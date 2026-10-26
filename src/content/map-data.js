/* =============================================================================
 * Stylized geography of Montréal + Laval, shared by the SVG service-area map
 * and the 3D hero scene. Coordinates are in a simple grid (x → east,
 * y → north, roughly 0–100 × 0–62) using the "Montréal north" convention
 * (the island's long axis is drawn horizontally, like locals read the city).
 * Shapes are deliberately simplified and angular — this is a graphic, not GIS.
 * ========================================================================== */

export const MAP_W = 100;
export const MAP_H = 62;

export const montreal = [
  [2, 22], [8, 30], [18, 33], [28, 36], [38, 40], [48, 42], [56, 43],
  [66, 44], [76, 45], [88, 46], [97, 47], [95, 41], [84, 36], [74, 31],
  [64, 25], [58, 19], [52, 13], [46, 10], [38, 9], [28, 12], [18, 13],
  [10, 15], [4, 18],
];

export const laval = [
  [24, 44], [32, 52], [42, 56], [54, 58], [66, 57], [76, 54], [84, 50],
  [78, 48], [68, 47], [60, 46.5], [50, 45.5], [40, 43.5], [32, 42], [26, 42],
];

// Mainland bands, shown hatched as "ask us"
export const riveNord = [[0, 60], [20, 58], [40, 61], [60, 62], [80, 59], [100, 55], [100, 62], [0, 62]];
export const riveSud = [[30, 0], [44, 4], [56, 9], [66, 17], [80, 26], [100, 34], [100, 0]];

// Laval ⇄ Montréal bridges over the Rivière des Prairies (west → east)
export const bridges = [
  { id: 'louis-bisson', name: 'Louis-Bisson (A-13)', x: 34.5 },
  { id: 'lachapelle', name: 'Lachapelle', x: 41 },
  { id: 'mederic-martin', name: 'Médéric-Martin (A-15)', x: 45 },
  { id: 'viau', name: 'Viau', x: 51 },
  { id: 'papineau-leblanc', name: 'Papineau-Leblanc (A-19)', x: 55 },
  { id: 'pie-ix', name: 'Pie-IX', x: 60 },
  { id: 'a25', name: 'Olivier-Charbonneau (A-25)', x: 68 },
];

// Lodico's base (10871, avenue Salk, Montréal-Nord) — stylized position
export const base = [59.5, 41];

// Sectors drawn on the map (approximate positions)
export const mapSectors = [
  { name: 'Montréal-Nord', region: 'montreal', x: 59.5, y: 41 },
  { name: 'Ahuntsic', region: 'montreal', x: 46, y: 38 },
  { name: 'Saint-Laurent', region: 'montreal', x: 36, y: 31 },
  { name: 'Saint-Léonard', region: 'montreal', x: 64, y: 36 },
  { name: 'Anjou', region: 'montreal', x: 73, y: 39 },
  { name: 'RDP–PAT', region: 'montreal', x: 84, y: 42 },
  { name: 'Rosemont', region: 'montreal', x: 58, y: 29 },
  { name: 'Hochelaga', region: 'montreal', x: 67, y: 27 },
  { name: 'Plateau', region: 'montreal', x: 53, y: 24 },
  { name: 'Centre-ville', region: 'montreal', x: 55, y: 18 },
  { name: 'NDG', region: 'montreal', x: 44, y: 19 },
  { name: 'Verdun', region: 'montreal', x: 48, y: 13 },
  { name: 'Lachine', region: 'montreal', x: 28, y: 16 },
  { name: 'Pierrefonds', region: 'montreal', x: 22, y: 29 },
  { name: 'Pointe-Claire', region: 'montreal', x: 12, y: 20 },
  { name: 'Chomedey', region: 'laval', x: 36, y: 47 },
  { name: 'Laval-des-Rapides', region: 'laval', x: 50, y: 48.5 },
  { name: 'Vimont', region: 'laval', x: 47, y: 52.5 },
  { name: 'Duvernay', region: 'laval', x: 61, y: 50.5 },
  { name: 'Sainte-Rose', region: 'laval', x: 42, y: 54.5 },
  { name: 'Fabreville', region: 'laval', x: 33, y: 51 },
  { name: 'Saint-François', region: 'laval', x: 76, y: 51 },
];

// Hero truck route: pickup in Laval → Pie-IX bridge → Montréal-Nord → downtown
export const heroRoute = [
  [57, 53], [58.5, 50], [60, 47.4], [60, 42.6], [59.5, 40], [60.5, 35],
  [59, 29.5], [56.5, 24], [55, 20],
];

// Major roads (stylized), drawn faintly
export const roads = [
  [[6, 26], [30, 30], [50, 33], [70, 36], [92, 43]], // A-40
  [[45, 41], [46, 30], [47, 20]], // A-15
  [[60, 43], [62, 34], [61, 26], [59, 20]], // Pie-IX
  [[28, 48], [40, 51], [52, 52], [66, 52], [78, 50]], // A-440
  [[45, 46], [46, 56]], // A-15 Laval
];

/* Sector names for the "Is my area covered?" checker. Matching ignores
 * accents, case, hyphens. TO CONFIRM with the owner. */
export const coveredSectors = {
  montreal: [
    'Montréal', 'Montreal', 'MTL', 'Montréal-Nord', 'Ahuntsic', 'Cartierville',
    'Saint-Laurent', 'Saint-Léonard', 'Anjou', 'Rivière-des-Prairies',
    'Pointe-aux-Trembles', 'Montréal-Est', 'Mercier', 'Hochelaga',
    'Maisonneuve', 'Rosemont', 'Petite-Patrie', 'Villeray', 'Saint-Michel',
    'Parc-Extension', 'Plateau', 'Mile End', 'Outremont', 'Ville-Marie',
    'Centre-ville', 'Downtown', 'Vieux-Montréal', 'Old Montreal',
    'Griffintown', 'Saint-Henri', 'Pointe-Saint-Charles', 'Sud-Ouest',
    'Verdun', 'Île-des-Soeurs', 'LaSalle', 'Lachine', 'Côte-des-Neiges',
    'NDG', 'Notre-Dame-de-Grâce', 'Westmount', 'Mont-Royal', 'Town of Mount Royal',
    'Hampstead', 'Côte-Saint-Luc', 'Montréal-Ouest', 'Dorval', 'Pointe-Claire',
    'Kirkland', 'Beaconsfield', 'Baie-D\'Urfé', 'Sainte-Anne-de-Bellevue',
    'Senneville', 'Pierrefonds', 'Roxboro', 'Dollard-des-Ormeaux',
    'Île-Bizard', 'Sainte-Geneviève', 'West Island', 'Ouest-de-l\'Île',
  ],
  laval: [
    'Laval', 'Chomedey', 'Laval-des-Rapides', 'Pont-Viau', 'Vimont', 'Auteuil',
    'Duvernay', 'Saint-Vincent-de-Paul', 'Saint-François', 'Sainte-Rose',
    'Fabreville', 'Laval-Ouest', 'Sainte-Dorothée', 'Laval-sur-le-Lac',
    'Îles-Laval', 'Val-des-Brises', 'Concorde', 'Cartier', 'Souvenir',
  ],
};
