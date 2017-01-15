# How I dropped 1s from the First Paint with a smarter font loading strategy
_Alessandro Menduni 15/01/2017_

I've been learning a lot about measuring performance recently, and I've also shared part of this journey on [Twitter](https://twitter.com/westwingsols) and [Facebook](https://www.facebook.com/westwingsols). One thing that I am learning to do more and more, as [I wrote about](https://westwingsolutions.com/articles/blog/perf-metrics) a couple of weeks ago, is measuring before optimizing.

As an exercise, I measured the Time to First Paint for our website on a Moto G on a 3G connection (thanks WebPageTest) which [was pretty upsetting](https://www.facebook.com/westwingsols/photos/a.648989588615139.1073741828.638332633014168/652668194913945/?type=3&theater).

![First Paint at 4.5s](/assets/img/fonts-firstpaint-before.png)

As I started investigating more on the causes, I've found out about two innocent realities that I've never considered before about Web Fonts:
- **The cost of using Web Fonts far exceeds the benefits**, for our specific use case
- **The First Paint gets delayed by so much** if you download your fonts from a different origin that's served on HTTPS

## Reality n.1: The cost of Web Fonts
The website of West Wing Solutions is a pretty simple one. There's only one font whose only purpose is enhancing the readability of the content, nothing else. **It seemed to me at first that readability was a pretty legit reason** to be considering a Web Font (specifically, Roboto), until I realized the following:
- Before rendering your text, **browsers wait some - fairly long - time** to see if the Web Font can be fetched quickly enough
- If you are using Google Fonts, and you are `@import`-ing a CSS file, the browser **will have to wait for it before rendering anything**

As it turns out, `@import`-ing files in CSS is a performance anti-pattern since stylesheets are considered by the browser as blocking resources, and the `@import`-ed one will be requested only after the `@import`-ing one has finished downloading. As a result, your users end up waiting on two sequential fetches before they can enjoy any of your content. But that's not all.

After the stylesheets are finally ready, your `@font-face` rule will trigger the actual download of the font file. **From this moment on, the browser is going to give it 3 full seconds**, before it displays any text. Which brings us to the second realization.

## Reality n.2: The cost of a HTTPS-hosted Web Font
Here's the thing. On a slow connection, **HTTPS can delay the actual download of any content (for the first request) for as long as 1 second**. Since Web Fonts are usually hosted on a different origin, you will pay this cost twice before rendering anything on screen. Here's what happens:
- The user navigates to your site
- The browser initiates the connection (spending up to 1s if it's HTTPS)
- The browser downloads a stylesheet, which itself requires an externally hosted Web Font
- The browser initiates **a second HTTPS connection (up to 1s again)**
- Stylesheets and fonts are finally ready, the browser goes on rendering

## Async font is faster font
So how do we stop this madness and improve our First Meaningful Paint by full seconds? Simple, meet your new bible: [A Comprehensive Guide To Font Loading Strategies](https://www.zachleat.com/web/comprehensive-webfonts/) by Zach Leatherman. He suggests a couple of optimized strategies to asynchronously load in fonts. The one I decided to follow (for practicality) goes like the following:
- First, we tell the browser to **render text with a well supported system font** (Arial)
- Then, we **asynchronously load in Roboto** via this lightweight [FontFaceObserver]([https://github.com/bramstein/fontfaceobserver](https://github.com/bramstein/fontfaceobserver)
- When Roboto is ready, we **apply a `.fonts-ready` CSS class on the document**, which enables the use of Roboto

And that's it. What this approach allows us to achieve is an instantaneous rendering of the text, with a visible FOUT (Flash Of Unstyled Text) when Roboto is ready. I'll be honest, **this technique blew my mind for its simplicity**. It allowed West Wing Solutions to drop a full second on its First Paint (on 3G).

![First Paint at 4.5s](/assets/img/fonts-firstpaint-after.png)

From this point, I can only see a couple of further improvements that can be considered:
- A fallback should be provided for when JS is disabled, like a regular `<link>` tag loading Roboto inside of a `<noscript>`
- A fallback should be put in place for browsers that do not support Promises, which are depended on by the FontFaceObserver. I am not sure whether a polyfill is worth it here, or if we should just give up on the font entirely and stick to Arial.

## Crazy Idea: no web fonts?
As I went through the journey of optimizing the Web Fonts loading strategy I started to develop this crazy idea. **How bad could it be to actually use a system font** for a website that just needs enhanced readability? Since it is so much more lightweight and so impactful on both [the First Paint and the First Meaningful Paint](https://westwingsolutions.com/articles/blog/perf-metrics), I think **we should reconsider the importance of a simple font like Roboto**. If you take a look at [fontfamily.io](http://fontfamily.io/arial), you'll notice how broadly supported Arial is. It's pretty darn similar to Roboto, and can be customized through something like [ffffallback](http://ffffallback.com/) so that it gets even better. I'm not entirely sold on this yet, but I am starting to think that, sometimes, **no font is better than some font**.

## Isn't FOUT bad, though?
The strategy I deployed though involves deliberately allowing a FOUT to happen, and that's something a lot of devs would despise and rather avoid. I believe **there is a middle ground where all these ideas can cohexist**, so here are two strategies that have come to mind while writing this post:
- Use Roboto if cached, otherwise use Arial and pre-cache Roboto in the background so that it can be ready for the next navigation
- Use Roboto if cached, otherwise skip it entirely

## Conclusions and self promotion
I'll close with a [side by side video comparison](http://www.webpagetest.org/video/view.php?id=161219_57f6726f6bc518d15a916faa2fc0f95b2fcde1b0) of the before and after. To be honest, I'm still learning. And experimenting. One thing I know I can suggest to you is to **keep it simple**. Try the technique that works best for you and improve on that, while always applying some good old _performance thinking_ (coining the term right now). Regardless, I hope you found this helpful! Follow [@westwingsols](https://twitter.com/westwingsols) for daily **#WebPerformance** tips. If you think this might be useful to someone you know, please share it to **let us reach more people**! Also, we'd love to hear your feedback on this type of articles. Is it helpful? Would you rather read something more practical or theoretical? **Let us know, by leaving a comment on Twitter!**
