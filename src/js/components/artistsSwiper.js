import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const artistsSwiper = () => {
    const swiper_text = new Swiper('.artists__swiper-title', {
        // loop: false,
        // slidesPerView: 1,
        allowTouchMove: false,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    const swiper_main = new Swiper('.artists__swiper-photo', {
        // loop: true,
        slidesPerView:'auto',

        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        coverflowEffect: {
            rotate: 0,
            stretch: 45,
            depth: 50,
            modifier: 1.5,
            slideShadows: false,
        },


        // autoplay: {
        //     delay: 9000
        // },
        // pagination: {
        //     el: '.swiper-pagination',
        // },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: swiper_text 
        }
    });
};

export default artistsSwiper;
