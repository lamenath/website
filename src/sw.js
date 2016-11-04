// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './',
  'pages/blog.html',
  'pages/portfolio.html',
  'pages/about.html',
  '/main.css',
  'pages/blog.css',
  'pages/portfolio.css',
  'pages/about.css',
  'pages/main.js',
  'assets/img/skyline.jpeg'
];

// The activate handler takes care of cleaning up old caches.
self.addEventListener( 'activate', event => {
  const currentCaches = [ PRECACHE, RUNTIME ];
  event.waitUntil(
    caches.keys().then( cacheNames => {
      return cacheNames.filter( cacheName => !currentCaches.includes( cacheName ) );
    } ).then( cachesToDelete => {
      return Promise.all( cachesToDelete.map( cacheToDelete => {
        return caches.delete( cacheToDelete );
      } ) );
    } ).then( () => self.clients.claim() )
  );
} );


self.addEventListener( 'install', onInstall );
// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener( 'fetch', onFetch );

function onInstall( evt ) {
  evt.waitUntil(
    caches.open( PRECACHE )
    .then( cache => cache.addAll( PRECACHE_URLS ) )
    .then( self.skipWaiting() )
  );
}

function onFetch( evt ) {

  console.log( evt.request.url );
  // Skip cross-origin requests, like those for Google Analytics.
  if ( evt.request.url.startsWith( self.location.origin ) ) {
    evt.respondWith(
      caches.open( RUNTIME ).then( function( cache ) {
        return cache.match( evt.request ).then( function( response ) {
          var fetchPromise = fetch( evt.request ).then( function( networkResponse ) {
            cache.put( evt.request, networkResponse.clone() );
            return networkResponse;
          } )
          return response || fetchPromise;
        } )
      } )
    );
  }

}