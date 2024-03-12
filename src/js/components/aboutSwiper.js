import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const aboutSwiper = () => {
    const swiper = new Swiper('.about__swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        // loop: true,
        navigation: {
            nextEl: '.about__swiper-btn-next',
            prevEl: '.about__swiper-btn-prev',
        },
    });
};

export default aboutSwiper;
