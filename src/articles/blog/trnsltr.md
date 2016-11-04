# Offline, installable and fast in simple steps
_Alessandro Menduni_ _03/11/2016_

If you haven't been able to keep up with the latest from the Web Development industry, you probably missed one of the biggest innovations that happened to us since Ajax became a thing. I'm talking about Progressive Web Apps (PWA for short), which is an umbrella term used to refer to web apps that are installable on the user's device and can work offline.

That's right, no typos there: web apps can (and already are!) work offline, thanks to a new standardized technology called Service Workers; another standard called the Web Manifest, allows for web app to be "installed" on the user's device, which basically means they can be accessed as any other app via an icon placed on the homescreen, they can open in fullscreen mode and display a fancy splash screen while booting up.

Alright, that's a lot of stuff to digest,

Let's see how you can get pwa-ify your existing app through two simple steps.

## 1. sw-precache
`sw-precache` is a tool built by the Chrome Developers team which allows to

By simply running `sw-precache --root=dist` you'll generate the most basic service worker possibile.

You then want to register the service worker by adding at the end of your index.html file the following:

```html
<script>
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js');
  }
</script>
```

## 2. manifest generator
In order for your users to be prompted by an install dialog, the manifest should contain a couple of attributes. I find it pretty tedious to manually check those, but you could use this awesome tool [https://app-manifest.firebaseapp.com/](https://app-manifest.firebaseapp.com/)

## That's it
And that's literally it. You can now just deploy your app to an https-enabled server and you're good to go.
