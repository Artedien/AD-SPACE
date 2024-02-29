import './index.scss';
import aboutSwiper from './js/components/aboutSwiper';
import artistsSwiper from './js/components/artistsSwiper';

import faq from './js/components/faq';
import header from './js/components/header';

window.addEventListener('DOMContentLoaded', () => {
    try {
        header();
    } catch {}
    try {
        aboutSwiper();
    } catch {}
    try {
        faq();
    } catch {}
    try {
        artistsSwiper();
    } catch {}
});
