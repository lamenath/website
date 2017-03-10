# It's a PRPLful world
At the Google I/O last May 2016, a new shiny acronym [made the stage][1]: it's PRPL, a technique, or rather a collection of techniques, that should help developers **hit those unmerciful performance budgets** a great user experience requires.

So, here we are again with another acronym. **PRPL** indeed is one of those, whose goal is to help us recalling the 4 magic techniques that make the impossible possible. Here they come:
- Push critical resources for the initial route (with HTTP2 push feature)
- Render the bare minimum necessary to make your app useful and interactive. We're not talking a splash screen here, it's the actual interactive content the user came for.
- Pre-cache assets for the following routes via the Service Worker cache
- Lazy load the following routes from the SW cache upon navigation

It may not sound like a big deal, but it does all the difference. Not convinced? Let's dive in.

## Push
The first step to get a blazing fast loading experience involves the new HTTP/2 [server push](http://httpwg.org/specs/rfc7540.html#PushResources). It allows the server to preemptively send a resource to the client, before even receiving a request for it. This is unprecedented in the HTTP delivery protocol and enables some great optimizations: for instance, the server could send, along with the requested HTML document, all the subresources that the client is most likely going to need, such as the attached CSS and JS.

The implications are many, the main one being that developers finally have a way to avoid idle network time.

With standard HTTP/1.1, there has always been a tiny window in the loading process during which the network is idling. It's the time between the moment the client requests for the HTML document and the instant the browser realizes it needs to also fetch another resource, like a CSS file. This period of time can be noticeable on high latency networks (tipically, on mobile 3G) and is, basically, wasted time.

Server Push allows to make use of this window.

## Render
The second step to glory is rendering. This one requires extra delicacy, since it may be the strongest bottleneck in your app, if it's heavily JavaScript-based. What the PRPL pattern suggests is to **only render the critical resources** for the initial route: in other words, give the user something.

During this step, we should just care about satisfying the need the visitor came for. We don't show a splash screen and call it a day, we don't bootstrap thousands of lines of JavaScript-based components that the user doesn't need - yet -, we don't block rendering with secondary resources (Web Fonts, anyone?). The only thing that matters is running the **absolute minimum amount of code** necessary for the **First Meaningful Paint**. Period.

The main benefits of following this approach are:
1. The main thread is quickly free to handle interactivity
2. The user is not left glaring a white screen while we boot up the code necessary to animate something hidden 5 clicks away
3. The **perceived performance** is much greater

## Pre-cache
## Further material
- Server Push in **much** more details:  [https://docs.google.com/document/d/1K0NykTXBbbbTlv60t5MyJvXjqKGsCVNYHyLEXIxYMv0/preview](https://docs.google.com/document/d/1K0NykTXBbbbTlv60t5MyJvXjqKGsCVNYHyLEXIxYMv0/preview)

[1]: https://www.youtube.com/watch?v=J4i0xJnQUzU&t=1818s
