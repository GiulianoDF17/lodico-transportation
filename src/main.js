/* Entry point — loads fonts and styles, then wires up each section.
 * Heavy things (Three.js scenes) are lazy-loaded by ./js/three/loader.js. */

import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';

import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/booking.css';

import { strings } from './js/i18n.js';
import { initNav } from './js/nav.js';
import { initMotion } from './js/motion.js';
import { initArea } from './js/area.js';
import { initBooking } from './js/booking/form.js';
import { initScenes } from './js/three/loader.js';

const motion = initMotion();
initNav(motion);
initArea(strings);
initBooking(strings, motion);
initScenes(motion);
