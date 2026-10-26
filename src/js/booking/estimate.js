/* Truck-size estimate. Rough volumes in cubic feet — an ESTIMATE only,
 * always confirmed by phone. Truck capacities come from business.js. */

import { business } from '../../content/business.js';

export const ITEM_VOLUME = {
  sofa: 45, bed: 55, mattress: 20, dresser: 25, table: 20, chair: 5, fridge: 35,
  stove: 25, washer: 20, dryer: 20, tv: 8, desk: 25, cabinet: 12, box: 3, other: 15,
};
const HOME_VOLUME = { studio: 250, s35: 400, s45: 650, s55: 900, house: 1300 };
const OFFICE_VOLUME = { small: 350, medium: 750, large: 1300 };

/** @returns {null | { truck: string, fill: number, volume: number }} */
export function estimateTruck(state) {
  const itemsVol = state.items.reduce((sum, it) => sum + (ITEM_VOLUME[it.type] || 15) * it.qty, 0);
  let sizeVol = 0;
  if (state.job === 'home') sizeVol = HOME_VOLUME[state.move_size] || 0;
  if (state.job === 'office') sizeVol = OFFICE_VOLUME[state.office_size] || 0;
  const volume = Math.max(itemsVol, sizeVol);
  if (!volume) return null;

  const fleet = [...business.fleet].sort((a, b) => a.capacityCuFt - b.capacityCuFt);
  const pick = fleet.find((t) => t.capacityCuFt >= volume) || fleet[fleet.length - 1];
  return { truck: pick.id, fill: Math.min(1, volume / pick.capacityCuFt), volume };
}

/** Pre-fill mapping when a visitor clicks "Choose this truck" in the fleet. */
export const TRUCK_TO_SIZE = { 16: 's35', 20: 's45', 26: 'house' };
