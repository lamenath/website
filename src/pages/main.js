// SideNav

var SideNav = ( function() {
  var hamburger;
  var overlay;
  var sideNav;

  function bindHamburger() {
    hamburger = document.querySelector( ".pageHeader__OpenNav" );
    hamburger.addEventListener( "click", toggleSideNav );
  }

  function bindNav() {
    sideNav = document.querySelector( ".sideNav__Container" );
    overlay = sideNav.querySelector( ".sideNav__Overlay" );
    overlay.addEventListener( "click", toggleSideNav );
  }

  function toggleSideNav() {
    hamburger.classList.toggle( "is-active" );
    sideNav.classList.toggle( "is-open" );
    document.body.classList.toggle( "no-scroll" );
  }

  return {
    bindHamburger: bindHamburger,
    bindNav: bindNav,
    toggleSideNav: toggleSideNav
  };
}() );

// Router

var Router = {
  init: function init() {
    this._listeners();
    this._hijackAnchors();
  },
  _onChanged: function _onChanged() {
    var path = window.location.pathname;
    var sidenav = document.querySelector( '.sideNav__Container' );

    if ( sidenav.classList.contains( 'is-open' ) ) {
      SideNav.toggleSideNav();
    }

    this._updateNav();

    Promise.all(
        [
          this._out(),
          this._fetchDocument( path ),
        ]
      )
      .then( function( data ) {
        var doc = data[ 1 ];
        var shell = document.querySelector( '.appShell__Main' )
        var title = doc.querySelector( 'title' ).textContent;
        var main = doc.body.querySelector( '.appShell__Main' );
        var styles = doc.head.querySelectorAll( 'link[rel="stylesheet"]' );
        var scripts = doc.head.querySelectorAll( 'script' );
        for ( var i = 0; i < styles.length; i++ ) {
          document.head.appendChild( styles[ i ].cloneNode() );
        }
        document.querySelector( 'title' ).textContent = title;
        shell.innerHTML = main.innerHTML;
        shell.style.opacity = 1;
      } )
      .then( SideNav.bindHamburger );
  },
  _out: function _out() {
    return new Promise( function( resolve, reject ) {
      var shell = document.querySelector( '.appShell__Main' );
      shell.style.transition = 'opacity 0.3s ease-in-out';
      shell.style.opacity = 0;
      shell.addEventListener( 'transitionend', resolve );
    } )
  },
  _updateNav: function _updateNav() {
    var url = window.location.href;
    var navLinks = document.querySelectorAll( '.sideNav__Main a' );
    for ( var i = 0; i < navLinks.length; i++ ) {
      var link = navLinks[ i ];
      var parent = link.parentNode;
      var href = link.href;

      if ( href === url ) {
        parent.classList.add( 'active' );
      } else {
        parent.classList.remove( 'active' );
      }
    }
  },
  _listeners: function _listeners() {
    document.addEventListener( 'popstate', this._onChanged.bind( this ) );
  },
  _go: function _go( url ) {
    window.history.pushState( null, null, url );
    this._onChanged();
  },
  _hijackAnchors: function _hijackAnchors() {
    document.addEventListener( 'click', function( evt ) {

      if ( !evt.target ) return;
      if ( evt.target.nodeName !== "A" ) return;
      if ( /mailto/.test( evt.target.href ) ) return;

      evt.preventDefault();
      Router._go( evt.target.href );

    } );
  },
  _fetchDocument: function _fetchDocument( url ) {
    return new Promise( function( resolve, reject ) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'document';
      xhr.onload = function onFetchResolved() {
        resolve( xhr.response );
      }
      xhr.onerror = function onFetchError() {
        reject( xhr.response );
      }
      xhr.open( 'GET', url );
      xhr.send();
    } );
  }
}

// Router.init();
SideNav.bindHamburger();
SideNav.bindNav();