# The performance of images: a Custom Element
_Alessandro Menduni_ _25/11/2016_

This is the second part of our series on **the performance of images**, in the following we will be building a Custom Element implementing the [inlining technique](https://westwingsolutions.com/articles/blog/image-inlining) outlined earlier. Here's what we're going to do, we're going to create a custom element `<inline-image>` and define the following API:
- _src_: image to be displayed
- _placeholder_: placeholder image to be used while fetching the real image

[You can grab the code on GitHub](https://github.com/west-wing-solutions/blog-samples/tree/master/custom-elements/InlineImage) or follow along.

## My first Custom Element
First and foremost, let's set up the playground. In order to teach the browser about our new `<inline-image>` element, we first need to create its prototype, by extending  `HTMLElement`.

```javascript
  class InlineImage extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {}
  }
```

Then, we signal to the browser that, everytime it encounters an `<inline-image>` element in the HTML, it should refer to our prototype.

```javascript
  customElements.define( 'inline-image', InlineImage );
```

That's it. Custom Element implemented. Now what?

## The Markup
Let's put some real visible content inside our new element. In the realm of Web Components, it is common practice using an [inert Template tag](http://webcomponents.org/articles/introduction-to-template-element/) to insert the markup inside of a component. It's a really valuable techinque, but it's slightly overcomplicated for our purpose, plus - and that's the great thing about Web Components - it's entirely optional. Instead we'll make good use of [ES6 template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/template_strings) and include our HTML and CSS in JavaScript. Let's see it. First, we'll need two `<img>` tags:
- one to immediately display the placeholder image
- the other one will be used to fetch the real image

```javascript
  var markup = `
    <img id="placeholder"/>
    <img id="full"/>
    `;
```

While we technically could fetch the images via JavaScript and then inject them in the document, this technique it's preferred for two reasons:
- it's using the platform, no wheel gonna be reinvented today
- it allows us to crossfade between the two images, which is always cool

Let's add some CSS, in order to overlap the two, while hiding the full image, which will not be available at first.

```javascript
  var markup = `
      <style>
        :host img {
          width: 100%;
          height: 100%;
        }
        #container {
          position: relative;
        }
        #placeholder, #full {
          transition: opacity 0.3s ease-in-out;
        }
        #full {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
      </style>
      <div id="container">
        <img id="placeholder"/>
        <img id="full"/>
      </div>
    `;
```

## Sprinkle in some Shadow DOM
If you've never heard about Shadow DOM, [go read it now](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM). Honestly, I strongly believe it's going to be one of the most exciting parts of Web Components. In a few words - but seriously, go learn more - Shadow DOM is a new API providing encapsulation to the DOM. Why is this important? Because it prevents implementation details and styles from leaking outside of the boundaries of a component. Read it twice: CSS encapsulation! Long live Shadow DOM!

In order to start using Shadow DOM we need to first create a shadow root:

```javascript
  // Attach a Shadow DOM root to this element
  this._shadowRoot = this.attachShadow( {
    mode: 'open'
  } );
```

A shadow root basically is a Node that will encapsulate everything you attach to it. Let's do it, then:

```javascript
  this._shadowRoot.innerHTML = markup;
```

## Implement the thing
Let's revise the behaviour we want to implement for the element. It should accept two attributes: **src** and **placeholder**. All being well, the first one will be an URL pointing to the real full-res image, while the second one should contain the data URL of a low-res equivalent of the same image. In this example, we will be generating the placeholder by hand, but in a real scenario we would probably automate this process. It consists in two steps:

Shrink the original image to 1% of its size, by running the convert command, which is part of the ImageMagick suite

```bash
  convert skyline.jpeg -resize 1% preview.jpeg
```

Then, generate the base64 data by running the base64 command, which is part of the coreutils package

```bash
  base64 preview.jpeg
```

The implementation logic will be inside of the `connectedCallback()`, which is one of the callbacks of a [Custom Element's lifecycle](https://developers.google.com/web/fundamentals/getting-started/primers/customelements#reactions), that gets called when our `<inline-image>` element is attached to the DOM. First things first, we'll look up for both the image elements:

```javascript
  // Query for the <img> tags
  this._imageEl = this._shadowRoot.querySelector( '#placeholder' );
  this._fullImageEl = this._shadowRoot.querySelector( '#full' );
```

We then pass down the placeholder attribute to the image element, which will take care of displaing it.

```javascript
  // Display the placeholder
  this._imageEl.src = this.getAttribute( 'placeholder' );
```

Immediately after, we'll start fetching the actual image. The important benefit here is that, while we're downloading it in the background, we already have our placeholder rendered.

```javascript
  // Start fetching the full image
  this._fullImageEl.src = this.getAttribute( 'src' );
```

Finally, an onload callback is set, so that the two images can be properly swapped, as soon as we're ready.

```javascript
  // Crossfade between the two, as soon as the image has been fetched
  this._fullImageEl.onload = this._onFullImgLoad.bind( this );

  _onFullImgLoad() {
    this._imageEl.style.opacity = 0;
    this._fullImageEl.style.opacity = 1;
  }
```

## Wrapping up
And that's about it! We've just implemented a great **reusable element** that we can adopt for every above-the-fold image in our apps or sites. By any means, do take a look at [the code on GitHub](https://github.com/west-wing-solutions/blog-samples/tree/master/custom-elements/InlineImage). Let's conclude with an example of usage:

```markup
  <inline-image
    src="skyline.jpeg"
    placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMg
IyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wAARCAAEAAgDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAA//EAB4QAAIBAwUAAAAAAAAAAAAAAAECAwAEBQYSEyEx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAXEQEBAQEAAAAAAAAAAAAAAAABAhEA/9oADAMBAAIRAxEAPwApdZ5iK23rOhbjLdoPRU9KUG88gm53/9k=">
  </inline-image>
```

If you think this might help someone you know, please share it to **help us reach more people**! Also, we'd love to hear your feedback on this type of articles. Is it helpful? Would you rather read something more practical or theoretical? **Let us know, by leaving a comment on Twitter!**
