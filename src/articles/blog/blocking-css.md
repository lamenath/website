# The single most effective technique I employ to fix a slow First Paint
_Alessandro Menduni 15/01/2017_

Recently I shared [the most effective technique](https://www.facebook.com/westwingsols/photos/a.648989588615139.1073741828.638332633014168/662925037221594/?type=3&theater) I end up relying on, when fixing a slow First Paint. It is not mind blowing, it is not novel, and _it is certainly not complicated_. Still, that's what I spend most of my time doing, so I decided to expand a little bit more. What I am talking about is **deferring blocking resources, such as CSS, as much as possible**.

![CSS is a blocking resource. Defer as much as you can.](/assets/img/blocking-css.png)

Boom. Feeling mind blown? I don't expect you to. But let's see why it matters so much, in the pre-HTTP2 era.

> CSS is a render blocking resource, meaning that the browser won't render any content until the CSSOM is constructed.

That's it. It doesn't get any simpler. Whenever you `<link rel="stylesheet">` a file, or `@import` some CSS (but you never would, would you?), you are asking your users to wait on two events before they can see ANY content:
- The CSS needs to be requested and downloaded
- The CSS needs to be processed and "computed"

Among the two, the first event is the real bottleneck today. Every HTTP request adds delay and, even if you rely on HTTP2 for distributing your assets, downloading those bytes may still be a time consuming process for those users navigating on slow networks.

While this holds true for every blocking resource (`<script>` tags in the `<head>`, anyone?), in my experience, it is far more common to forget some blocking CSS here and there in their projects. Plus, **this is one of the easiest fixes that you can possibly do**. Here are the steps:
- Identify a blocking resource that's not absolutely necessary for the First Paint (secondary fonts, icons sets, you name it) and remove it
- Add a `<script>` tag containing a minified implementation of loadCSS  to the bottom of the `body`
- Add this to the bottom of the `body`:

```javascript
<script>loadCSS( "path/to/mystylesheet.css" );</script>
```

That loadCSS function you see there is [a great piece of JavaScript by the filamentgroup](https://github.com/filamentgroup/loadCSS), which simply requests your stylesheet in a non-blocking manner. **And that is literally it.** You go through those three steps and you might end up reducing your [Time To First Paint](https://westwingsolutions.com/articles/blog/perf-metrics) by just so much.

## Cheers and self promotion
I hope you found this helpful! Follow [@westwingsols](https://twitter.com/westwingsols) for daily **#WebPerformance** tips. If you think this might be useful to someone you know, please share it to **let us reach more people**!
