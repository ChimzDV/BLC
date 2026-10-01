(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    e.preventDefault();
    const navbar = select('#navbar');
    if (!navbar) return;

    // toggle mobile state on navbar
    navbar.classList.toggle('navbar-mobile');

    // toggle icons on all mobile toggles (in case there are duplicates)
    const toggles = select('.mobile-nav-toggle', true);
    toggles.forEach(t => {
      t.classList.toggle('bi-list');
      t.classList.toggle('bi-x');
    });

    // lock background scroll while menu open
    document.body.classList.toggle('nav-open');
  });

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    const navbar = select('#navbar');
    if (!navbar) return;

    if (navbar.classList.contains('navbar-mobile')) {
      e.preventDefault();

      // parent <li class="dropdown">
      const parent = this.closest('.dropdown');
      if (!parent) return;

      // submenu <ul>
      const submenu = parent.querySelector('ul');
      // toggle both parent and submenu classes so CSS can show/hide
      parent.classList.toggle('dropdown-active');
      if (submenu) submenu.classList.toggle('dropdown-active');
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar && navbar.classList.contains('navbar-mobile')) {
        // close mobile nav
        navbar.classList.remove('navbar-mobile')

        // restore all mobile toggle icons (handle duplicates)
        const toggles = select('.mobile-nav-toggle', true)
        toggles.forEach(t => {
          t.classList.remove('bi-x')
          t.classList.add('bi-list')
        })

        // IMPORTANT: remove body lock so scrolling is restored
        document.body.classList.remove('nav-open')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * What We Do Slider
   */
  new Swiper('.what-we-do-slider', {
    speed: 600,
    loop: false,
    pagination: {
      el: '.what-we-do-slider .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1.15,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 2.15,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24
      }
    }
  });

  /**
   * Counts Slider
   */
  new Swiper('.counts-slider', {
    speed: 600,
    loop: false,
    pagination: {
      el: '.counts-slider .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1.35,
        spaceBetween: 14
      },
      576: {
        slidesPerView: 2.2,
        spaceBetween: 18
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 24
      }
    }
  });

  /**
   * Services Slider
   */
  new Swiper('.services-slider', {
    speed: 600,
    loop: false,
    pagination: {
      el: '.services-slider .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1.15,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 2.15,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24
      }
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.testimonials-slider .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1.15,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 2.15,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 24
      }
    }
  });

  /**
   * Team Slider
   */
  new Swiper('.team-slider', {
    speed: 600,
    loop: false,
    pagination: {
      el: '.team-slider .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1.15,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 2.15,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 24
      }
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()