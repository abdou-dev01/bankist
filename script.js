'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const allSection = document.querySelectorAll('.section');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  "we use cookies for best performance <button class='btn btn--close-cookie'>Got it!</button>";

header.prepend(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.backgroundColor = '#777';
message.style.color = '#fff';

message.style.height = '50px';
console.log(window.getComputedStyle(message).height);

btnScrollTo.addEventListener('click', function (event) {
  const secOneCoords = sectionOne.getBoundingClientRect();
  console.log(secOneCoords);
  console.log(window.scrollY);

  // window.scrollTo(secOneCoords.right, secOneCoords.top + window.scrollY);
  // Old way
  // window.scrollTo({
  //   left: secOneCoords.left + scrollX,
  //   top: secOneCoords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  //  Modern way
  sectionOne.scrollIntoView({ behavior: 'smooth' });
});

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('nav__link')) {
      const target = document.querySelector(event.target.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

const tabs = document.querySelector('.operations__tab-container');
const tabsBtn = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabs.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');

  if (!clicked) return;
  tabsBtn.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

function handelMouse(event) {
  const logo = document.getElementById('logo');
  const target = event.target;
  if (target.classList.contains('nav__link')) {
    const siblings = [
      ...target.closest('.nav__links').querySelectorAll('.nav__link'),
      logo,
    ];
    siblings.forEach(sibling => {
      if (sibling !== target) sibling.style.opacity = this;
    });
  }
}

nav.addEventListener('mouseover', handelMouse.bind(0.5));

nav.addEventListener('mouseout', handelMouse.bind(1));

// function observerCallback(entries, observer) {
//   entries.forEach(observer => console.log(observer));
// }

// const observerOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);

// observer.observe(sectionOne);

const navHieght = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  });
}

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHieght}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, options);

headerObserver.observe(header);

function revealSection(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

const imgLazy = document.querySelectorAll('img[data-src]');

function loadImg(entries, observer) {
  entries.forEach(entry => {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgLazy.forEach(image => imgObserver.observe(image));

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dots = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

function createDots() {
  slides.forEach((_, index) => {
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
}

// slider.style.transform = 'scale(0.5)';
// slider.style.overflow = 'visible';

// slides.forEach((slide, index) => {
//   slide.style.transform = `translateX(${100 * index}%)`;
// });

const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

function goTo(currentSlide) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
  });
}

function nextSlide() {
  if (curSlide < maxSlide - 1) curSlide++;
  else curSlide = 0;
  goTo(curSlide);
  activateDot(curSlide);
}

function prevSlide() {
  if (curSlide > 0) curSlide--;
  else curSlide = maxSlide - 1;
  goTo(curSlide);
  activateDot(curSlide);
}

function activateDot(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

function init() {
  goTo(0);
  createDots();
  activateDot(0);
}

init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') prevSlide();
});

dots.addEventListener('click', function (event) {
  if (!event.target.classList.contains('dots__dot')) return;
  const { slide } = event.target.dataset;
  goTo(slide);
  activateDot(slide);
});
