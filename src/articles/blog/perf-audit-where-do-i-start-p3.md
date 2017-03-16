# ASKTHEINDUSTRY 24: I want to audit the performance of my website, where do I start? (part 3)
_This article is part of #ASKTHEINDUSTRY project, a series of **daily** conversations about Web Performance. [Go follow on medium](https://medium.com/west-wing-solutions) if interested!_

![Performance audit: where do I start? (part 1)](/assets/img/perf-audit-part3.png)

In this last part, I'm giving you a bullet list of every step I take when going for **runtime discoveries**. [Two days ago](https://medium.com/west-wing-solutions/asktheindustry-22-i-want-to-audit-the-performance-of-my-website-where-do-i-start-part-1-10aef0012699#.azicoljsw) we established two types of perf audits and said that one can focus on either loadtime or runtime. Today **let's see an actionable list of steps that you can take on your website right now.**

First, a quick reminder: in a runtime discovery you focus on those metrics that can tell you if your website runs smoothly enough. The aim is to answer the questions: _Does it respond quickly upon interaction? Is scrolling acceptable?_ Etc..

However, runtime audits can be very different from case to case. Typically, I focus on scrolling lag and heavy animations smoothness. The right thing to do would be to **record small interactions on the timeline** and see the how long frames are. Then to try to **identify the cause of long frames** by digging in the callbacks and the render process. It is a pretty accurate, yet slow and painful process, so I like to start by looking for common issues. It is faster and **typically ends up solving most performance problems**.

> I like to start by looking for common issues. It is faster and **typically ends up solving most performance problems**.

Here is a brief list of what I usually watch out for:
- Check the usual suspects of repaints: sticky elements (position: fixed) that can cause paints on scroll, parallax effects, and so on. It is really important to understand that, [when optimizing for shorter frames, paints are your harshest enemy](https://westwingsolutions.com/articles/blog/60fps-animations). Cross out as many common causes of repaints as you can, it can save you so much time and effort.
- See if animations are taking advantage of hardware acceleration when possible. Most of the times it boils down to promoting elements to their own layer, so that the GPU can do its thing.
- **Enable "Paint Flashing" on Chrome** and see what gets repainted on scrolls or on other basic interactions (hover, clicks, and so on). Go through the main interactions (scrolling top to bottom and back, clicking on core elements, interacting with stuff..) and see if there is any green area lighting up.

From there, it is pretty much a matter of what the main activity of the site in question is. Improving runtime performance is an exercise of asking he right questions for the site at hand:
- What is core the users' experience?
- Is it an animation? Or is it scrolling?
- Is the site responding well upon interactions (as per [the RAIL recommendations](https://medium.com/west-wing-solutions/asktheindustry-02-what-is-rail-and-why-do-you-feel-it-s-a-game-changer-b050acb8ce3d#.uciu7il93))?
- Regardless of how the loading time of the first screen, [which we covered yesterday](https://medium.com/west-wing-solutions/asktheindustry-23-i-want-to-audit-the-performance-of-my-website-where-do-i-start-part-2-88ac2b874659#.nwewvva1z), are secondary routes fast to load? Can they be preloaded? Or cached?
- Can secondary features (or videos, or images, or any other content) be fetched at runtime?

I'll be honest, there is no concrete secret recipe when it comes to crafting a great experience on the Web. If I had to find some guidelines I'll say this: **you need to empathize with the users** and try as hard as possible to let their journey be flawless, while exploiting the idle time (e.g -- while the user is reading, or thinking) to lazy load functionalities and content. **Try not to lock the main thread for long at once, and may the force be with you.**
