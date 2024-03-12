import './index.scss';
import aboutSwiper from './js/components/aboutSwiper';
import artistsSwiper from './js/components/artistsSwiper';
import releaseSwiper from './js/components/releaseSwiper';
import burger from './js/components/burger';

import faq from './js/components/faq';
import header from './js/components/header';

window.addEventListener('DOMContentLoaded', () => {
    try {
        header();
    } catch {}
    try {
        faq();
    } catch {}
    try {
        aboutSwiper();
    } catch {}
    try {
        artistsSwiper();
    } catch {}
    try {
        releaseSwiper();
    } catch {}
    try {
        burger();
    } catch {}
});
