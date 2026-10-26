/* Side-view box truck illustration in Lodico livery (black box, red cab,
 * red band). Length is drawn to scale so the 16/20/26 ft trucks compare
 * honestly in the fleet section. Also used for the hero poster. */

import { esc } from './utils.js';

const PX_PER_FT = 12;

/**
 * @param {object} o
 * @param {number} o.ft        truck box length in feet
 * @param {string} [o.title]   accessible name (omit for decorative)
 * @param {string} [o.cls]     extra class
 * @param {number} [o.maxFt]   draw on a canvas wide enough for this length,
 *                             so several trucks share one scale
 */
export function truckSvg({ ft, title = '', cls = '', maxFt = ft }) {
  const boxL = ft * PX_PER_FT;
  const cabL = 96;
  const x0 = 12;
  const cx = x0 + boxL + 6; // cab start
  const W = x0 + maxFt * PX_PER_FT + 6 + cabL + 16;
  const H = 190;
  const rearWheel = x0 + boxL * 0.74;
  const dual = ft >= 24;
  const frontWheel = cx + cabL - 34;
  const wordSize = Math.min(boxL * 0.24, 64);
  const a11y = title
    ? `role="img" aria-label="${esc(title)}"`
    : 'aria-hidden="true" focusable="false"';

  const wheel = (x) => `
    <g class="truck__wheel">
      <circle cx="${x}" cy="160" r="19" fill="#050505"/>
      <circle cx="${x}" cy="160" r="9" fill="#2a2a2a"/>
      <circle cx="${x}" cy="160" r="3" fill="#E10600"/>
    </g>`;

  return `
<svg class="truck-svg ${cls}" viewBox="0 0 ${W} ${H}" ${a11y} preserveAspectRatio="xMinYMax meet">
  <line x1="0" y1="179.5" x2="${W}" y2="179.5" stroke="#3a3a3a" stroke-dasharray="6 6"/>
  <!-- chassis -->
  <rect x="${x0 + 4}" y="140" width="${boxL + cabL}" height="12" fill="#1a1a1a"/>
  <!-- cargo box -->
  <rect x="${x0}" y="14" width="${boxL}" height="128" fill="#0d0d0d" stroke="#333" stroke-width="1.5"/>
  <rect x="${x0}" y="106" width="${boxL}" height="14" fill="#E10600"/>
  <rect x="${x0}" y="122" width="${boxL}" height="3" fill="#E10600"/>
  <line x1="${x0 + 7}" y1="18" x2="${x0 + 7}" y2="138" stroke="#2c2c2c"/>
  <line x1="${x0 + 11}" y1="18" x2="${x0 + 11}" y2="138" stroke="#2c2c2c"/>
  <text x="${x0 + boxL / 2 + 6}" y="${82}" text-anchor="middle" class="truck__word" font-size="${wordSize}" fill="#F2EFE8">LODICO</text>
  <text x="${x0 + boxL / 2 + 6}" y="100" text-anchor="middle" class="truck__sub" font-size="9" fill="#9a9a9a">TRANSPORT · MONTRÉAL ⇄ LAVAL</text>
  <text x="${x0 + 18}" y="36" class="truck__ft" font-size="15" fill="#E10600">${ft}′</text>
  <!-- cab -->
  <path d="M${cx} 150 V50 H${cx + cabL - 30} L${cx + cabL - 6} 94 L${cx + cabL} 102 V150 Z" fill="#C80500"/>
  <path d="M${cx + 12} 60 H${cx + cabL - 34} L${cx + cabL - 16} 94 H${cx + 12} Z" fill="#0b0b0b"/>
  <line x1="${cx + 40}" y1="60" x2="${cx + 40}" y2="146" stroke="#8f0400" stroke-width="2"/>
  <rect x="${cx + cabL - 10}" y="110" width="10" height="8" fill="#F2EFE8"/>
  <rect x="${cx + cabL - 18}" y="138" width="22" height="12" fill="#111"/>
  <rect x="${x0 - 2}" y="128" width="5" height="10" fill="#E10600"/>
  ${wheel(rearWheel)}${dual ? wheel(rearWheel - 44) : ''}${wheel(frontWheel)}
</svg>`;
}
