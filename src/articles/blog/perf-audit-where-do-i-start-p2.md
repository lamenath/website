# ASKTHEINDUSTRY 23: I want to audit the performance of my website, where do I start? (part 2)
_This article is part of #ASKTHEINDUSTRY project, a series of **daily** conversations about Web Performance. [Go follow on medium](https://medium.com/west-wing-solutions) if interested!_

![Performance audit: where do I start? (part 1)](/assets/img/perf-audit-part2.png)

I'll address the more practical side of it, giving you a bullet list of every step I take when going for loadtime discoveries. [Yesterday](https://medium.com/west-wing-solutions/asktheindustry-22-i-want-to-audit-the-performance-of-my-website-where-do-i-start-part-1-10aef0012699#.fms6727sh) we established two types of perf audits and said that one can focus on either loadtime or runtime. Today **let's see an actionable list of steps that you can take on your website today**.

First, a quick reminder: with a loadtime discovery you focus on analyzing meaningful metrics that tell you whether or not your website loads fast enough. The goal is to get a clear picture of the state of the website, and to cross out common issues. Typically, it answers the questions _is there a need for fix? Is this website respecting a baseline performance budget? Does it follow established best practices? Is gzip in place? Is it served over HTTP 2? Static assets are served via a CDN?_ And so on and so forth.

The following are exactly the steps I take when auditing a website:
- Open [webpagetest.org](http://webpagetest.org/).
- Select Moto G, Mobile 3G with 200ms RTT.
- Check first and repeat visit and run the test.
- Write down the Time to First Byte.
- Eyeball [First Paint and First Meaningful Paint](https://medium.com/west-wing-solutions/asktheindustry-21-why-do-we-measure-the-first-paint-2cc094e8b88#.2ndbug15r) from the strip view and compare those to the Time to First Byte. If there is a noticeable difference **it usually means that the site is either loading render blocking resources or something else is preventing the browser from streaming the HTML**.
- Try to identify the Time to Interactive by looking at the yellow blocks in the timeline view. This exercise is not accurate by an means, but it helps understanding what the load on the main thread is. (Usually, **fat yellow blocks mean that the main thread is blocked for most of time**, thus the site is usually unresponsive)
- Take a look at the network breakdown to look for anything standing out: I'm thinking big images, huge script bundles, several different web fonts, and so on.
- Go through the strip view again, this time comparing it to the network breakdown, in order to **identify those blocking resources that are fetched before the FP happens** (or before the FMP)
- Open the site and manually inspect the code, looking for best practices: minification, compression, HTTP2 where possible, CDNs, embedded critical CSS, and so on. **This step can usually be sped up by PageSpeed Insights** and the Performance audit of the Chrome DevTools
- Try to identify the font loading technique (typically, none). Fonts get a special treatment for, in my experience, **they are the most common cause of
- difference between FP and FMP**. Indeed, on slow networks, so many websites are killed by a FOIT (Flash Of Invisible Text) that is due to the way web fonts are loaded.

From this point on, I usually have enough data points and observations to guide further analysis. If nothing stands out, you can pat yourself in the back: your website is great. On the other hand, if something came up during the discovery process, you can dive deeper and attack every problem one by one. This is usually what I call investigations or troubleshooting, and usually leads to fixes and further insights.

I hope this is of any help for those who want to take on the task of auditing a website! Tomorow, in the last part, I'll give my bullet list for runtime discoveries.
