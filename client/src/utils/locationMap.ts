export type Coordinates = [number, number];

export const INDIA_CENTER: Coordinates = [22.5937, 78.9629];

const LOCATION_COORDINATES: Record<string, Coordinates> = {
  india: INDIA_CENTER,
  maharashtra: [19.7515, 75.7139],
  pune: [18.5204, 73.8567],
  'pune maharashtra': [18.5204, 73.8567],
  lohgaon: [18.5957701, 73.9245544],
  'lohgaon pune': [18.5957701, 73.9245544],
  'yawspace boys hostel': [18.5957701, 73.9245544],
  'revel orchard': [18.5957701, 73.9245544],
  'yawspace boys hostel near revel orchard': [18.5957701, 73.9245544],
  'lohgaon yawspace boys hostel near revel orchard': [18.5957701, 73.9245544],
  'lohgaon pune maharashtra': [18.5957701, 73.9245544],
  mumbai: [19.076, 72.8777],
  'navi mumbai': [19.033, 73.0297],
  thane: [19.2183, 72.9781],
  nagpur: [21.1458, 79.0882],
  nashik: [19.9975, 73.7898],
  delhi: [28.6139, 77.209],
  'new delhi': [28.6139, 77.209],
  noida: [28.5355, 77.391],
  ghaziabad: [28.6692, 77.4538],
  gurgaon: [28.4595, 77.0266],
  'gurugram': [28.4595, 77.0266],
  chandigarh: [30.7333, 76.7794],
  'new chandigarh': [30.7552, 76.6753],
  zirakpur: [30.6425, 76.8173],
  mullanpur: [30.822, 76.7241],
  'dera bassi': [30.5881, 76.8446],
  kharar: [30.7463, 76.6469],
  mohali: [30.7046, 76.7179],
  panchkula: [30.6942, 76.8606],
  haryana: [29.0588, 76.0856],
  ambala: [30.3782, 76.7767],
  ludhiana: [30.9009, 75.8573],
  amritsar: [31.634, 74.8723],
  jaipur: [26.9124, 75.7873],
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  rajkot: [22.3039, 70.8022],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  mysore: [12.2958, 76.6394],
  chennai: [13.0827, 80.2707],
  coimbatore: [11.0168, 76.9558],
  hyderabad: [17.385, 78.4867],
  secunderabad: [17.4399, 78.4983],
  visakhapatnam: [17.6868, 83.2185],
  kolkata: [22.5726, 88.3639],
  howrah: [22.5958, 88.2636],
  lucknow: [26.8467, 80.9462],
  kanpur: [26.4499, 80.3319],
  agra: [27.1767, 78.0081],
  varanasi: [25.3176, 82.9739],
  indore: [22.7196, 75.8577],
  bhopal: [23.2599, 77.4126],
  patna: [25.5941, 85.1376],
  kochi: [9.9312, 76.2673],
  'thiruvananthapuram': [8.5241, 76.9366],
  bhubaneswar: [20.2961, 85.8245],
  guwahati: [26.1445, 91.7362],
  goa: [15.2993, 74.124],
  panaji: [15.4909, 73.8278],
};

const LOCATION_ENTRIES = Object.entries(LOCATION_COORDINATES).sort((a, b) => b[0].length - a[0].length);

export const normalizeLocationText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (!Array.isArray(value) || value.length < 2) {
    return false;
  }

  const [lat, lng] = value;
  return (
    typeof lat === 'number' &&
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90 &&
    typeof lng === 'number' &&
    Number.isFinite(lng) &&
    lng >= -180 &&
    lng <= 180
  );
};

const parseNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

export const findCoordinatesFromText = (...parts: Array<string | null | undefined>): Coordinates | null => {
  const haystack = normalizeLocationText(parts.filter(Boolean).join(' '));

  if (!haystack) {
    return null;
  }

  const exactMatch = LOCATION_COORDINATES[haystack];
  if (exactMatch) {
    return exactMatch;
  }

  for (const [key, coordinates] of LOCATION_ENTRIES) {
    if (haystack.includes(key)) {
      return coordinates;
    }
  }

  return null;
};

export const resolveListingCoordinates = (listing: Record<string, unknown>): Coordinates => {
  const latitude = parseNumber(listing.latitude);
  const longitude = parseNumber(listing.longitude);

  if (latitude !== null && longitude !== null) {
    return [latitude, longitude];
  }

  const existingCoordinates = listing.coordinates;
  if (isValidCoordinates(existingCoordinates)) {
    return existingCoordinates;
  }

  return (
    findCoordinatesFromText(
      typeof listing.address === 'string' ? listing.address : '',
      typeof listing.area === 'string' ? listing.area : '',
      typeof listing.city === 'string' ? listing.city : '',
      typeof listing.state === 'string' ? listing.state : '',
      typeof listing.location === 'string' ? listing.location : '',
      typeof listing.title === 'string' ? listing.title : ''
    ) || INDIA_CENTER
  );
};

export const getMapFocusFromFilters = ({
  search,
  city,
  state,
}: {
  search?: string;
  city?: string;
  state?: string;
}) => {
  const center = findCoordinatesFromText(city, state, search) || INDIA_CENTER;
  let zoom = 5;

  if (city) {
    zoom = 11;
  } else if (state) {
    zoom = 7;
  } else if (search && center !== INDIA_CENTER) {
    zoom = 9;
  }

  return { center, zoom };
};

export const buildOsmEmbedUrl = (center: Coordinates, delta = 0.015) => {
  const [lat, lng] = center;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta]
    .map((value) => value.toFixed(6))
    .join(',');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)},${lng.toFixed(6)}`;
};
