# ASKTHEINDUSTRY 22: I want to audit the performance of my website, where do I start? (part 1)
_This article is part of #ASKTHEINDUSTRY project, a series of **daily** conversations about Web Performance. [Go follow on medium](https://medium.com/west-wing-solutions) if interested!_

![Performance audit: where do I start? (part 1)](/assets/img/perf-audit-part1.png)

I see this one a lot. More and more people in the web development industry are beginning to see the incredible convenience of having a fast-loading website. It's good for the users, it's good for conversions, it's good for the numbers, it's good for everybody. Reasonably, developers are starting to approach this topic. What's in an audit? How do I start? Is there a single way to go about it, or are there many?

To me, the term _perf audit_ feels kind of general. I prefer to differ between loadtime audit and runtime audit. Also, I usually either perform an **high level audit** or a **really specific looking-for-something audit**. Lastly, I like to call the former _discoveries_, the latter investigations or _troubleshooting_, so let's clear things up a bit.

There are two types of approaches that one can take:
- **High level discovery**: you start with general metrics and tests to have a sense of the overall performance of the site. It is not a superficial work by any means, though. There are two very specific goals that need to be attained: to get a clear picture of the state of the website, and to cross out common issues. Typically, it answers the questions _is there a need for fix? Is this website respecting a baseline performance budget? Does it follow established best practices? Is gzip in place? Is it served over HTTP 2? Static assets are served via a CDN?_ And so on and so forth.
- **Troubleshooting specific to a particular issue or aspect**: this one, in most cases, represents a follow up of the previous one. It is tailored to the problem at hand and it is difficult to reduce to a checklist of stuff to look for. Typically, you end up diving deep into the timeline trying to figure out what is the root cause of the problems you identified in the previous step.

Each approach can be applied to various scenarios, but I usually end up working with these two:
- **Loadtime scenario**: you analyze meaningful metrics that tell you whether or not your website loads fast enough. You identify the font loading technique in use, look for render blocking resources that are in the critical rendering path, you assess -- if valuable -- the time it takes for the site or app to be interactive.
- **Runtime scenario**: discoveries of this type can be very different from case to case. Typically, I focus on scrolling performance and heavy animations. You identify elements that get repainted often (e.g -- on scroll, or on click), check whether animations are hardware accelerated, and so on.

In the next two days, I'll address the more practical side of it, giving you a bullet lists of every step I take when going for loadtime and runtime discoveries, respectively. Stay tuned!
