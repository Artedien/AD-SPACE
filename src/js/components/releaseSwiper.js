import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';


const releaseSwiper = () => {
    const swiper = new Swiper('.release__swiper', {
        slidesPerView: 'auto',
    
        // loop: true,

        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        coverflowEffect: {
            rotate: 0,
            stretch: 45,
            depth: 330,
            modifier: 1.5,
            slideShadows: false,
        },
        navigation: {
            nextEl: '.release__swiper-nav-btn--next',
            prevEl: '.release__swiper-nav-btn--prev',
        },
    });
};

export default releaseSwiper;