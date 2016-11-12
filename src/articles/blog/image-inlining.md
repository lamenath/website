# The performance of images: inlining
_Alessandro Menduni_ _12/11/2016_

[According to the HTTP Archive](http://httparchive.org/interesting.php#bytesperpage) webpages load an average of 1.6MB of images. Pictures are an integral part of the web experience, but can sometimes be slow to display, especially on mobile networks. As a result, users of the web are often left staring at a loading indicator or an empty box; I don't know about you, but in situations like these, I always have the feeling of being too slow for the experience, of being missing out on something. That's upsetting for users, and we don't want them to feel this way. So what can we, as developers, do?

## Beyond compression and form factors
When we talk about the performance of images we usually end up discussing the ever trending topics of [responsive images](http://responsiveimages.org/) and the [best compression tool](https://goo.gl/Yw5Y7w) at our disposal to shrink an image to the last byte, without losing quality. In other words, we do everything we can to make the time it takes to download the picture as small as possible. Why? Take a look at this diagram.

![Flamechart of network requests: the logo is fetched only when the document is done](/assets/img/image-inlining-diagram.png)

When the user navigate to a page, the browser:
- First, it downloads the HTML file
- Since it can't know of the images that will be required by that page, **it can't start downloading one until it has finished downloading and parsing** all the parts and blocking resources of the page that precede it .

This delay, quite small but still noticeable, adds up to the download time of the image itself. If we did our job well, after all the optimizations, it won't be needed that we wait long. Nonetheless, we can do better. Even though we can't render the full image until the browser downloaded it, we could (and should) still display something to the user **as soon as the page is ready**, thus addressing another important aspect of the matter: the perceived performance, meaning how fast the process is **perceived** by the user, regardless of the actual time it took to complete it. There's [a whole lot of literature](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/) on this topic, so I'm not going in to much detail on the theory of it; however, I would like to focus on one single very practical approach that you can easily adopt today, in order to make the loading of an image be perceived as instantaneous.

## Image inlining
How can you display an image immediately even though the browser didn't have the time to download it yet, you ask? That's easily solved: please welcome **data URI images**! Not everybody knows that you can embed the image's actual data to dispay directly into the document: it looks like this.

In CSS:

```css
  .image-container {
    background-image: url(data:image/jpeg;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)
  }
```

In HTML:

```markup
<img src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"/ >
```

Those gibberish characters represent the data the browser will intepret as the file to be displayed. Basically, instead of providing to an `<img>` element the path to an image, you're passing in the actual data to display, encoded in base64. It's a pretty powerful ability that it's given to us, when used properly: indeed, one could **inline the base64 data** in the HTML itself, saving the browser an HTTP request. That's not all however, because if you did this for every image in your page, you'll end up increasing the size of the document itself, gaining nothing in terms of loading time. We can however, steal [a great idea from the guys at Facebook](https://code.facebook.com/posts/991252547593574/the-technology-behind-preview-photos/) and embed a low resolution version of the same picture, then swap in the real image after we're done fetching it. Here's what would happen then, as shown in a filmstrip taken from the [Polymer's shop app](https://shop.polymer-project.org).

![Filmstrip showing the low res image being shown immediately, then swapped with the full res one](/assets/img/image-inlining-filmstrip.png)

As you can see, the user is shown something pretty much immediately, therefore **it will feel as though** the page loaded faster. But how can we do that? Let's see the steps.

## The six steps to glory:
So here's the secret recipe to **instantaneous image loading**:
- Create a downscaled version of the image down to 1% of its original size
- **BONUS**: Blur it
- Generate its base64 representation with a tool [such as base64](https://linux.die.net/man/1/base64)
- Inline the base64 in the HTML
- Fetch the original image
- Swap them
- **BONUS**: Crossfade between the two

## When does inlining make sense?
Well, as I mentioned earlier, you shouldn't inline a lot of images on the same document, otherwise you would end up having a pretty big file. This technique makes a lot sense for those images that are part of the [above the fold content](http://rigor.com/wp-content/uploads/2016/08/image03.png), or any other image that is core to the first experience the user has with your page. As a rule of thumb, if a given picture requires some sort of interaction for a user to see (e.g - scroll), it's not necessary that you go through the hassle.

## Want to see some code? Stay tuned.
In an upcoming article, I'm going to describe the process to build a custom element implementing precisely this behaviour; while you wait, you can still reference the awesome [iron-img element](https://elements.polymer-project.org/elements/iron-image) from the Polymer team, which among other things, allows you to provide an image placeholder directly in template.

Hope you enjoyed this article, [let me know what you think](https://twitter.com/mendaomn)!
