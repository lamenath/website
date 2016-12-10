# 60fps animations on the Web
_Alessandro Menduni_ _10/12/2016_

I want you to listen to me. You cannot animate whichever CSS property you'd wish to transition carelessly. You just can't. Get over it. In fact, let's make a vow:

> I will not transition width, height, margins, or any other CSS property for that matter, without having consulted [csstriggers.com](https://csstriggers.com/) beforehand

Many people I talk to think it's lame that web developers can't transition what they want without incurring in jank and scrolling issues, but that's the reality of things and this fact is not going anywhere soon; so let's stop complaining and see what we can do to start helping to make the web a better (and smoother) place.

## Keep calm and break it down
![Keep calm and break it down](/assets/img/60fps-animations-keepcalm.png)

Let's take a step back here and stop ranting for a minute, what's this thing about animating the right CSS property?

I'll give you the **TL;DR** first: most CSS properties force expensive recalculation on the browser whenever their value changes, therefore, transitioning those properties over time result in continuous "expensive recalculations" many times per second and the corresponding animation will look laggy.

But **why exactly does making the browser compute a lot of stuff affect an animation's performance?** Where does jank come from?

## Jank explained
During an animation, many frames follow one another in a **regular** and **consistent** sequence. The illusion of movement is given by the rapid alternation of pictures, or frames, each one representing a slightly different state of the motion. **Jank, or lag, in an animation is the visible manifestation of the renderer skipping a frame.** In other words, whenever a frame lasts on screen sensibly longer than the others, lag is perceived.

That's ok, but why would that happen? What's the root cause of jank? The main reason for a frame to stay on screen longer than needed, is the following frame not being ready. This is way more common that one may intuitively think, in fact every time that, in between frames, the main thread is busy computing and preparing the next frame, you end up skipping one. Unfortunately, in the browser things are much more complicated than that.

## Possible causes of long frames
Let's see what could keep the browser busy during the duration of a frame (Pic shamelessy stolen from [Google Developers's article](https://developers.google.com/web/fundamentals/performance/rendering/#the-pixel-pipeline), which you should read):

![The pixel pipeline](/assets/img/60fps-animations-pipeline.jpg)
- _JavaScript execution_: as we all know, the main thread blocks while executing your JavaScript code, thus if it spends a lot of time running your program, it will easily end up skipping a frame
- _Styles and Layout_: calculating new styles (e.g - a new CSS class has been added) and computing layout information (size and shape of DOM elements) can be really expensive. Browsers are smart and limit the scope of these steps to the portion of the tree that actually changed, but it can still be a cause of jank
- _Paint_: it's the process of pushing pixels on screen. Browsers incrementally update only those parts that need repainting in order to avoid painting the whole page on every frame.
- _Composite_: since painting is sometimes done onto multiple layers, there is still the need to composite those layers together, in the correct order, so that the final result can be displayed to the user.

This is just a simplified picture of reality, if you're interested in diving deeper I highly suggest that you go check [this article](https://aerotwist.com/blog/the-anatomy-of-a-frame/) out by Paul Lewis. What is important to notice, however, is that **every one of these steps can be subject to delays, thus causing jank**.

## Animating at 60fps is possibile
Some steps of the pipeline above can be handled by another component inside your device: the GPU. Specifically, the Composite part can be offloaded to it; why does it matter? Well, the GPU is a great piece of technology **specifically built and optimized to execute multiple independent computations in parallel**! The benefits can be summed up as follows:
- Compositing layers on the GPU is more efficient than it is on the CPU, since the former is designed specifically for these types of workloads
- The GPU and the CPU can work together and operate at the same time, achieving true parallelism

As we understood earlier, in order to reduce jank we need to prepare the next frame in the smallest period of time possible. **Wouldn't it be great if the browser process could let the GPU compute the next frame**, while it's busy taking care of all the rest? Turns out it can. With a little help by us.

In fact, not all CSS properties are made equal. When their value changes, some of them trigger a complete repaint, some of them cause the browser to recompute layout information, some of them only need compositing to take place. A-ah! Therefore, one could **animate only these CSS properties** and achieve great performance!

## Let's get practical
So what can we do, practically, to act on this knowledge? Let's break it down:
- Browse [csstriggers.com](https://csstriggers.com/) when in doubt about what parts of the pipeline a given property is going to trigger
- Transition `tranform` and `opacity` whenever possibile, since these properties can be handled by the GPU

Actually there's a litte bit more to it. `transform` and `opacity` can, indeed, be handled by the GPU, since a [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) is created when their value is set. In other words, whenever their value changes, none of the other elements in the page get affected in any way. What this implies is that they can be managed in different layers: as a consequence, if we transition `transform`, for example, at every frame there is just the need to composite the layers together.

Since the creation of a stacking context is essential for this scenario to work out, developers can declarative hint the browser that an element is expected to change its `transform` value in the near future, so that it can create such context upfront. How? By specifying a `will-change: transform` CSS property on that element. The browser (and your users!) will thank you, and promote such an element to its own layer.

**But wait!** Before you go on and promote all your elements to their own layers, understand that there's a cost of doing that. Don't trust me on this, read on [here](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) and [here](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/#cons).

## This is interesting, give me more
Will do! This is a huge topic, and many people wrote on this. Here are some pointers to learn further:
- Paul Lewis wrote extensibly on the topic, discussing [the will-change property](https://aerotwist.com/blog/bye-bye-layer-hacks/), introducing a great [animation strategy](https://aerotwist.com/blog/flip-your-animations/) and talking about [the anatomy of a frame](https://aerotwist.com/blog/the-anatomy-of-a-frame/)
- Google Developers have many articles on performance, like [this one on rendering](https://developers.google.com/web/fundamentals/performance/rendering/) and [a whole article on compositor-only properties](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count), again by Paul Lewis
- Smashing Magazine recently published [GPU animation: doing it right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/#cons) that I found amazingly useful
- Lastly, bookmark [jankfree.org](http://jankfree.org/) and [perfplanet.com](http://www.perfplanet.com/) for dive-deep performance resources and articles

## Cheers and self promotion
I hope you found this helpful! Follow [@westwingsols](https://twitter.com/westwingsols) for daily **#WebPerformance** tips. If you think this might be useful to someone you know, please share it to **let us reach more people**! Also, we'd love to hear your feedback on this type of articles. Is it helpful? Would you rather read something more practical or theoretical? **Let us know, by leaving a comment on Twitter!**
