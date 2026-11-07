/*
 * Portfolio data. To use your own photos, drop files into images/ and set
 *   src: "images/my-photo.jpg"
 * Remote placeholders come from picsum.photos (Unsplash-licensed images).
 * w/h are the photo's aspect ratio, used for layout before the image loads.
 */
const PHOTOS = [
  { id: 1015, title: "River Through the Valley", place: "Norway", category: "landscape", w: 3, h: 2, hero: true },
  { id: 1043, title: "Morning Window", place: "Lisbon", category: "urban", w: 2, h: 3 },
  { id: 1018, title: "Ridge Line", place: "Dolomites", category: "landscape", w: 3, h: 2, hero: true },
  { id: 1080, title: "Summer Harvest", place: "Studio", category: "portrait", w: 2, h: 3 },
  { id: 1044, title: "Low Tide", place: "Brittany", category: "nature", w: 3, h: 2 },
  { id: 1067, title: "Avenue at Dusk", place: "New York", category: "urban", w: 3, h: 2, hero: true },
  { id: 1039, title: "Falling Water", place: "Iceland", category: "nature", w: 2, h: 3 },
  { id: 1060, title: "Pour-over", place: "Studio", category: "portrait", w: 3, h: 2 },
  { id: 1016, title: "Canyon Light", place: "Utah", category: "landscape", w: 2, h: 3 },
  { id: 1047, title: "Grid", place: "Hong Kong", category: "urban", w: 3, h: 2 },
  { id: 1069, title: "Drift", place: "Monterey", category: "nature", w: 2, h: 3 },
  { id: 1019, title: "Open Sea", place: "Azores", category: "landscape", w: 3, h: 2 },
  { id: 1050, title: "Harbour Walls", place: "Malta", category: "urban", w: 2, h: 3 },
  { id: 1074, title: "Watcher", place: "Kenya", category: "nature", w: 3, h: 2 },
  { id: 1035, title: "Cascade", place: "Faroe Islands", category: "landscape", w: 3, h: 2 },
  { id: 1062, title: "Nap Time", place: "Home", category: "portrait", w: 2, h: 3 },
];

function photoUrl(p, width) {
  if (p.src) return p.src;
  const height = Math.round((width * p.h) / p.w);
  return `https://picsum.photos/id/${p.id}/${width}/${height}`;
}
