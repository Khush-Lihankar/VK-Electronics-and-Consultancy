/* VK Electronics and Consultancy — lightweight page interactions */

(function () {
  // Mobile menu toggle
  var menuButton = document.querySelector(
    '[data-testid="mobile-menu-toggle"]'
  );

  var navigation = document.querySelector(
    '[data-testid="primary-navigation"]'
  );

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = navigation.classList.toggle("is-open");

      menuButton.setAttribute("aria-expanded", String(isOpen));

      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("is-open");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  // Scroll reveal animations
  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries, revealObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  // ===== Team Auto-Slider (mobile only, infinite loop, dynamic cloning) =====
  var teamTrack = document.querySelector('.team-track');
  if (!teamTrack) return;

  // Remove any existing clones (if any from previous manual setup)
  teamTrack.querySelectorAll('.team-card.clone').forEach(function (clone) {
    clone.remove();
  });

  var originalCards = teamTrack.querySelectorAll('.team-card');
  var originalCount = originalCards.length;

  // Clone each original card and append to track
  originalCards.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.classList.add('clone');
    clone.setAttribute('aria-hidden', 'true');
    // Remove reveal animations from clones to avoid issues
    clone.classList.remove('reveal', 'reveal-delay', 'is-visible');
    // Make links non-focusable
    clone.querySelectorAll('a').forEach(function (link) {
      link.setAttribute('tabindex', '-1');
    });
    teamTrack.appendChild(clone);
  });

  var mobileQuery = window.matchMedia('(max-width: 700px)');
  var currentIndex = 0;
  var autoSlideInterval = null;
  var isTransitioning = false;

  function setTransform(index, animate) {
    if (animate === undefined) animate = true;
    teamTrack.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    teamTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex++;

    if (currentIndex >= originalCount * 2) {
      setTransform(currentIndex, true);
      setTimeout(function () {
        setTransform(originalCount, false);
        currentIndex = originalCount;
        isTransitioning = false;
      }, 500);
    } else {
      setTransform(currentIndex, true);
      setTimeout(function () {
        isTransitioning = false;
      }, 500);
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 3000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  function resetSlider() {
    stopAutoSlide();
    currentIndex = 0;
    setTransform(0, false);
    isTransitioning = false;
  }

  function handleViewportChange(e) {
    if (e.matches) {
      // Mobile: activate slider
      resetSlider();
      startAutoSlide();
    } else {
      // Desktop: deactivate slider, show grid
      resetSlider();
    }
  }

  // Initial setup
  handleViewportChange(mobileQuery);

  // Listen for viewport changes
  mobileQuery.addEventListener('change', handleViewportChange);

  // Pause on hover for better UX
  teamTrack.addEventListener('mouseenter', stopAutoSlide);
  teamTrack.addEventListener('mouseleave', function () {
    if (mobileQuery.matches) {
      startAutoSlide();
    }
  });
})();
