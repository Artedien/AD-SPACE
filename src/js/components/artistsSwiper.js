import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const artistsSwiper = () => {
    const swiper_text = new Swiper('.artists__swiper-title', {
        allowTouchMove: false,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    const swiper_main = new Swiper('.artists__swiper-photo', {
        slidesPerView:'auto',

        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        coverflowEffect: {
            rotate: 0,
            stretch: 50,
            depth: 600,
            modifier: 1.5,
            slideShadows: false,
        },

        navigation: {
            nextEl: ".artistis__swiper-nav-btn--next",
            prevEl: ".artistis__swiper-nav-btn--prev",
        },
        thumbs: {
            swiper: swiper_text 
        },
        breakpoints: {
            // when window width is >= 320px
            768: {
                coverflowEffect: {
                    rotate: 0,
                    stretch: 45,
                    depth: 300,
                    modifier: 1.5,
                    slideShadows: false,
                },
            }}
    });
};

export default artistsSwiper;
