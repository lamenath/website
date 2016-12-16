# Measuring performance: page load
_Alessandro Menduni_ _16/12/2016_

As I [tweeted](https://twitter.com/westwingsols/status/808589828065529856) recently, when approaching performance, you need to start with profiling. The first thing you want to do is identifying the problem: finding what's wrong is always the first step of making it right. That's why measuring is so important when it comes to page load performance, **if you don't have metrics to compare, you don't have a measure of success**. You can't just rely on "_it feels faster_", you need data.

Measuring can be tricky. One needs tools to do the job right, but this is the easy part: you can open the Dev Tools, or rely on services like [SiteSpeed.io](https://www.sitespeed.io/) or [WebPageTest.org](http://www.webpagetest.org/). You can even install [Lighthouse](https://github.com/GoogleChrome/lighthouse) or get your site audited by Google itself on [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/). **The tricky part, however, is knowing what to measure**, what different metrics represent, and why would they matter. Without a solid understanding of what the options are, it can be awfully difficult to understand what type of problems it might make sense to address in your specific scenario.

In this article, I'm going to focus on metrics that are specific to page load perofrmance. There are plenty of options. If you ever read anything on the topic, you've probably come across the terms Time To First Paint, Time To Interactive, and similar: well that's what this article is going to be about. Let's dive into this mess of acronyms, and hopefully bring light to what should be measured and why.

## 50 shades of "Time to"
Whenever we approach this type of tasks, it is important that we keep in mind one fundamental thing: **all it matters is the time passing between the user navigating to a page and the page _reacting_ in some way**. Depending on what aspect of the process of loading the page you are most interested in, you will consider different things as the _reaction of the page_.

In the following, we will see what this "reaction" can be and why.

## Time to first paint
It's called this way **the time it takes for the browser to begin the render**. In this case, the _reaction_ we are looking for is the rendering of the [initial containing block](https://drafts.csswg.org/css-display-3/#initial-containing-block).

## Time to first contentful paint
This is **the time it takes for the first content to be displayed on screen**. It's when the browser first paints any text, image, non-white canvas or SVG. [As I found out recently](https://twitter.com/westwingsols/status/809374962238844928) this is very different from the first meaningful paint (which we'll see right after), as it doesn't imply the usefulness of the content being rendered. **Think empty headers or background images**.

> If you're doing things right, the FCP is probably going to be your [App Shell](https://developers.google.com/web/updates/2015/11/app-shell), or part of it.

![First Paint visualized](/assets/img/perf-metrics-firstpaint.png)

In the image you can see that - sadly - for this site WebPageTest.org reports the First Paint to happen at 4.3s on a Moto G on a 3G connection. It's the first time that the user can see anything on screen, it's the very first thing different from the blank screen.

## Time to first meaningful paint
It's **the time it takes to paint content that's meaningful to the user**. That's when the things the user navigated for are actually ready. It's not your App Shell, it's something more: it's content, text, an article, an image, anything that can be consumed by the user.

> The FMP is the bit that people actually wanted to use, not just your app shell ([Paul Lewis](https://aerotwist.com/blog/when-everything-is-important-nothing-is/#first-meaningful-paint))

## Time to interactive
This one is the real deal when talking web apps or PWAs. It is **the time it takes for the content to be interactive**. Basically, can the user actually make use of what she sees? Can buttons be pressed, can interactions happen? In 99% of the cases, this metric has a lot to do with how quickly you can **spin up your JavaScript code**.

![Time to interactive in Dev Tools](/assets/img/perf-metrics-interactive.png)

In the image above you can clearly see when things start being interactive: tha main thread settles down, some setup JS has run and paint occurred. Further JavaScript will run (furthest right), but the app is going to be responsive from that moment on.

## But wait, there's more
What I outlined above are, in my opinion, the most useful metrics that you can make use of when profiling your site. However, there are plenty of other metrics: here's a perfect visualization of the full journey by [Addy Osmani](https://speakerdeck.com/addyosmani/production-progressive-web-apps-with-javascript-frameworks)

![Addy Osmani's slide on the various metrics](https://pbs.twimg.com/media/Cy-1VtZXUAAPjjY.jpg)

In addition to all of these, you can still measure more. There's no limit to it. You can count the number of HTTP requests, consider the global weight of the page, and much more. **Your creativity is really the limit here**.

## Why does measuring matter so much?
The more I work on performance, the more I realize the real importance of having measurements to refer to. Everytime I approach a problem without a proper metric, I end up tweaking in the wrong places of the project. I learned the hard way that you have to **always start with profiling**. Two things happen for free from the moment you have proper data to work with:
- You start actively working in the right places, meaning you are able to **attack right at the root of the problem**
- You **immediately notice regressions**. So many times I fixed something, only to introduce the problem back an hour later without even noticing

That's why a proper performance based strategy heavily relies on continuous assessment. It sets a clear **performance budget**, meaning the constraints your product is expected to meet, it gathers relevant metrics on every commit, and it compares with the budget.

## Wrap up and self promotion
I hope you found this helpful! Follow [@westwingsols](https://twitter.com/westwingsols) for daily **#WebPerformance** tips. If you think this might be useful to someone you know, please share it to **let us reach more people**! Also, we'd love to hear your feedback on this type of articles. Is it helpful? Would you rather read something more practical or theoretical? **Let us know, by leaving a comment on Twitter!**
