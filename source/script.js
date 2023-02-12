'use strict';

(function () {
  document.body.classList.remove('no-js');

  const makeCurrentBulletDisabled = (bullets) => {
    bullets.forEach((bullet) => {
      const ariaDisabled = bullet.classList.contains('swiper-pagination-bullet-active');
      bullet.setAttribute('aria-disabled', ariaDisabled);
    });
  };

  const lazyLoad = (slide) => {
    const img = slide.querySelector('img');

    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.alt = img.dataset.alt;
      img.dataset.src = '';
      img.dataset.alt = '';
      img.hidden = false;
    }
  }

  const debounce = (f, ms) => {
    let isCooldown = false;

    return function () {
      if (isCooldown) return;

      f.apply(this, arguments);
      isCooldown = true;

      setTimeout(() => isCooldown = false, ms);
    };
  };

  let bullets;

  const swiper = new Swiper('.swiper', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    watchSlidesProgress: true,
    on: {
      init() {
        setTimeout(() => {
          this.el.setAttribute('aria-roledescription', 'carousel');

          const paginationWrapper = document.querySelector('.swiper-pagination');
          bullets = paginationWrapper.querySelectorAll('.swiper-pagination-bullet');
          paginationWrapper.setAttribute('role', 'group');
          paginationWrapper.setAttribute('aria-label', 'Choose slide to display');

          makeCurrentBulletDisabled(bullets);

          this.slides.forEach((swiperSlide, i) => {
            const slide = swiperSlide.querySelector('.slide');
            slide.setAttribute('aria-roledescription', 'slide');
            if (!swiperSlide.classList.contains('swiper-slide-visible')) {
              slide.style.display = 'none';
            } else {
              lazyLoad(slide);
            }
            bullets[i].setAttribute('aria-label', slide.getAttribute('aria-label'));
          });
        }, 0);
      },
    }
  });

  swiper.on('setTranslate', debounce(() => {
    swiper.slides.forEach((swiperSlide, i) => {
      const slide = swiperSlide.querySelector('.slide');
      if (swiperSlide.classList.contains('swiper-slide-visible')) {
        lazyLoad(slide);
        slide.style.display = '';
      }

      bullets[i].setAttribute('aria-label', slide.getAttribute('aria-label'));
    });
  }, 50));

  swiper.on('transitionEnd', function () {
    swiper.slides.forEach((swiperSlide) => {
      if (!swiperSlide.classList.contains('swiper-slide-visible')) {
        swiperSlide.querySelector('.slide').style.display = 'none';
      }
    });
    makeCurrentBulletDisabled(bullets);
  });
})();
