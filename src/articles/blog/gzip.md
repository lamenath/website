# Your minification is not enough
_Alessandro Menduni_ _06/09/2016_

The other day I got into a converstation that got me thinking. A friend of mine was sort of bragging about his new flashing gulp configuration, and trying to convince me to include it into my next project.

_"Dude, it's amazing! I've got everything you could ever need, all your CSS files in the project directory get minified, every single JS module gets uglified, I got concatenation, image optimization, templates compilation, and so on."_

Being the nice person to live with I am, I asked: _"What about GZIP?"_

Reply: _"Well that's a server-side thing, plus what difference could it possibly make?"_

Well, as it turns out, it can make quite a lot of difference. I decided to investigate more on this point, and in the act of doing it, hopefully convincing you to **never leave GZIP out of your build process again.** <!-- ![what could go wrong](/assets/img/laurea.jpg) -->

## Dear friend, your minification task is just not enough
So here's what I mean. Minification is actually great, it allows you to shrink down your text file's size to its extreme, by refactoring the program, removing or replacing elements from it. The assumption being that, while as we write it, we need our code to be as readable and as easy to reason about as possible, as machines run it, it simply needs to be syntactically and functionally correct. Consider the following piece of code:

```javascript
  // Function a
  var current;
  var best;

  if ( current > best ) {
    return current;
  } else {
    return best;
  }
```

Even though it's basically useless in it's functionality, it's pretty clear what it does. **Readability matters**. However, when we ship our source down the wire, we need it to be the smallest possible, so in order to let our users experience our wunderful features as soon as possible ([and possibly not losing their interest along the way](https://blog.kissmetrics.com/wp-content/uploads/2011/04/loading-time-lrg.jpg)). So here's a _functionally equivalent_ version of the same code:

```javascript
  // Function b
  var a, b; return a > b ? a : b;
```

Same outcome, different characters count.

That's what a minification build step would do (in a simplicistic form). While that's great, I wouldn't be so sure that, by adding a minification build step to my workflow, I am doing the best I can in order to ship a faster-loading version of my web app.

In fact, **let me show you a much more powerful way to make your site load faster.**

## Meet GZIP
> Making a website half as big is as good as making the network twice as fast. ([CloudFlare docs](https://www.cloudflare.com/features-optimizer/#aggressive-GZIP))

GZIP is a file format used for **file compression**, based on the LZ77 compression algorithm, which works at its best when run against textual files. But how does it work? Well, the basic principle behind the algorithm consists in substituting actual text with pointers to a location where the same piece of text appears. Let's see an example:

```
 The cat is on the table
```

Will compress to

```
  The ca(0,1) is on (0, 3) (0,1)(5, 1)bl(2,1)
```

What this ugly notation indicates is that, when the decompressor encounters **the tuple (0, 3)**, it should go and **look at position 0 and take 3 characters** (more on this [here](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer?hl=en#text-compression-with-GZIP) and [here](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s)); this mechanism is especially effective for repetitive data due to the fact that, there will exist many references (or _length-distance pairs_) for a single copy of the data.

![An example of application of the LZ77 algorithm](/assets/img/gzip_example.gif)

Some of you might already have gotten it but, for the rest of you who are wondering _why should I care?_, let's state the following:
- GZIP is supported in every single browsers out there. No excuses.
- GZIP is available in basically every single server configuration or programming language you'll choose to deploy your last creation: here's [a link with some pointers](https://github.com/h5bp/server-configs)
- minification is meant to be, so to speak, the ice on the cake; it will remove useless characters and refactor your code, so that, **after compression** files will be even smaller
- it will gain **from 50% to 80%** in file size! There exist actual data making the comparison, plus it's easily replicable on your specific source code by running a simple `GZIP main.min.js` and comparing before/after sizes

## I think you're a fraud. Let's see figures.
Here they come. I've taken some famous libraries (Angular and Bootstrap) and a couple of big resources I found on the internet, just to make compression a sensible thing to do. **3, 2, 1, FIGHT!**

-                                                                                         | Minified | GZIPped | Gain
----------------------------------------------------------------------------------------- | -------- | ------- | ----
**Javascript** (angular 1.5)                                                              | 164k     | 56k     | 66%
**CSS** (bootstrap 3.3.7)                                                                 | 120k     | 20k     | 83%
**HTML** ([a big page](http://demo.borland.com/testsite/stadyn_largepagewithimages.html)) | 232k     | 52k     | 78%
**JSON** ([a big JSON](https://jsonplaceholder.typicode.com/comments))                    | 156k     | 40k     | 74%

Can you see what's happening here? I measured **an average of 75% gain** on the files I tested. Here I am comparing **minfied-only** resources against **minified and GZIPped** ones, the reason being that, hopefully, no one should still be pushing unminified code in production; of course, there are still a lot of benefits that come with the minification-only approach, however, I am trying to make the point that it's completely unacceptable that we, as web developers, skip GZIP entirely, being it widely supported and easily achieved. I believe this is due to a lack in the average developers' culture, and I would like to help you take the better decision next time you set up a project.

## Ok, I'm on it. How do I GZIP all the things?
I'm glad you asked. As a matter of fact, you **could** GZIP your resources [as a step in your build process](https://www.npmjs.com/package/gulp-GZIP), however you'd need to add the proper `Content-Encoding: GZIP` header to your HTTP responses, otherwise the requesting User Agent (reads - the browser) would not know that it needs to decompress the files before reading them; while that's not that hard to do, it might not be the most pleasant of options, since you don't always want to manually specify which resources need that header. Luckily, there are alternatives to the manual approach:
- if you do have access to your server's code, **use existing libraries**: I can only recommend the one that I've used before, but you can surely find the right library for the language or framework you're using. So here it is, the officially reccomended [Express.js middleware](http://expressjs.com/en/advanced/best-practice-performance.html#use-GZIP-compression): it allows you to enable GZIP compression, while giving you the control over which resources not to compress, which algorithm to use, and so on.
- if you're not coding the server, but simply relying on some hosting service, **make sure to enable GZIP compression on your hosting provider**; GitHub Pages has it working by default, being GZIP supported everywhere.
- if you can't do either of those, you might still consider making the delivery of your site's resources faster, by relying on a good CDN service. I will not go into details about what CDNs are and why you could need one, let's simply acknowledge here that popular CDN services offer GZIP compression of the resources they serve. [You can see here](https://www.cloudflare.com/features-optimizer/#see-the-difference) what difference it can make on the Financial Times website (I can't speak for the veridicity of the test, however it helps make the point, so why not ;)

## When GZIP actually hurts
There are some cases when it does. **Small files** suffer from the overhead coming from GZIP's dictionary that needs to be shipped along with the actual content, which risks to be even bigger than the original file; **already compressed content**, such as images, are usually left untouched or so, making it not only useless but even harmful, being the decompression a CPU-intensive process.

## Conclusion and TL;DR
Partly due to the [JavaScript fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4#.gwnwr1m48), we tend to trust what other people are doing, grokking other people's build pipelines, without ever stopping and considering why we have a minification step in 95% of build processes, and how much it matters to have one. Honestly, with this piece I am not trying by any means to convince you that other people are wrong, or that you are doing it badly; I would simply like to persuade my fellow web devs to adopt a critical approach to what we do, especially when it comes to performance-related best practices: because [#perfmatters](https://twitter.com/hashtag/perfmatters), and the users of the experiences we craft deserve our best work, we should always question the how, the why, and sometimes even the why not. Hope you enjoyed this article, [let me know what you think](https://twitter.com/mendaomn)!

I'll see you on these pages next time, in the mean time, keep on fatiguing!

## Further reading, tools and related material
- Check whether your resources are actually compressed with [this online tool](http://checkGZIPcompression.com/)
- See why Colt McAnlis thinks even GZIP is not enough [here](https://youtu.be/whGwm0Lky2s)
- Learn more about data compression with [this awesome playlist](https://www.youtube.com/watch?v=Eb7rzMxHyOk&list=PLOU2XLYxmsIJGErt5rrCqaSGTMyyqNt2H) by Colt McAnlis
