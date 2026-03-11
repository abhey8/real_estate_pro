export interface Property {
  id: string;
  title: string;
  price: number;
  type: 'house' | 'apartment' | 'villa' | 'penthouse' | 'loft';
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  location: string;
  coordinates: [number, number]; // [lat, lng]
  image: string;
  images: string[];
  description: string;
  features: string[];
  yearBuilt: number;
  status: 'sale' | 'rent';
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    price: 2850000,
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    location: 'Beverly Hills, CA',
    coordinates: [34.0736, -118.4004],
    image: 'https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTkxMDEzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTkxMDEzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1757264119016-7e6b568b810d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzcxODY0ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1586310520462-658e93388399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBiZWRyb29tfGVufDF8fHx8MTc3MTg4Nzg3NHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Stunning modern villa featuring cutting-edge architecture and luxurious amenities. This property offers breathtaking views, a resort-style pool, and meticulously designed interiors.',
    features: ['Pool', 'Garden', 'Smart Home', 'Garage', 'Security System', 'Home Theater'],
    yearBuilt: 2022,
    status: 'sale'
  },
  {
    id: '2',
    title: 'Contemporary City Apartment',
    price: 850000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    location: 'Manhattan, NY',
    coordinates: [40.7580, -73.9855],
    image: 'https://images.unsplash.com/photo-1758974835125-83ba4f9d7e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZ3xlbnwxfHx8fDE3NzE5NTA0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1758974835125-83ba4f9d7e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZ3xlbnwxfHx8fDE3NzE5NTA0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1586310520462-658e93388399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBiZWRyb29tfGVufDF8fHx8MTc3MTg4Nzg3NHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Elegant apartment in the heart of Manhattan featuring floor-to-ceiling windows, modern finishes, and access to premium building amenities.',
    features: ['Gym', 'Concierge', 'Rooftop Access', 'Parking', 'Pet Friendly'],
    yearBuilt: 2020,
    status: 'sale'
  },
  {
    id: '3',
    title: 'Luxury Penthouse Suite',
    price: 4500000,
    type: 'penthouse',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    location: 'Miami Beach, FL',
    coordinates: [25.7907, -80.1300],
    image: 'https://images.unsplash.com/photo-1568115286680-d203e08a8be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3NzE4OTMyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1568115286680-d203e08a8be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3NzE4OTMyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1654175868733-6e60cc6f9ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwcHJvcGVydHl8ZW58MXx8fHwxNzcxOTEzNDAxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Exceptional penthouse with panoramic ocean views, private terrace, and world-class amenities. The ultimate in luxury living.',
    features: ['Ocean View', 'Private Terrace', 'Wine Cellar', 'Smart Home', 'Spa', 'Beach Access'],
    yearBuilt: 2021,
    status: 'sale'
  },
  {
    id: '4',
    title: 'Urban Industrial Loft',
    price: 3500,
    type: 'loft',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    location: 'Brooklyn, NY',
    coordinates: [40.6782, -73.9442],
    image: 'https://images.unsplash.com/photo-1553661763-1bbb4b5cf599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzcxODY5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1553661763-1bbb4b5cf599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGxvZnQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzcxODY5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Converted warehouse loft with exposed brick, high ceilings, and an open floor plan. Perfect for creative professionals.',
    features: ['High Ceilings', 'Exposed Brick', 'Open Floor Plan', 'Natural Light', 'Storage'],
    yearBuilt: 2019,
    status: 'rent'
  },
  {
    id: '5',
    title: 'Suburban Family Home',
    price: 675000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    location: 'Austin, TX',
    coordinates: [30.2672, -97.7431],
    image: 'https://images.unsplash.com/photo-1622480198867-016a77991bd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGhvdXNlJTIwZ2FyZGVufGVufDF8fHx8MTc3MTkzNjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1622480198867-016a77991bd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGhvdXNlJTIwZ2FyZGVufGVufDF8fHx8MTc3MTkzNjAwMHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Spacious family home in a quiet neighborhood with a large backyard, modern kitchen, and excellent school district.',
    features: ['Backyard', 'Modern Kitchen', 'Garage', 'Fireplace', 'Patio', 'Storage'],
    yearBuilt: 2018,
    status: 'sale'
  },
  {
    id: '6',
    title: 'Modern Villa with Pool',
    price: 1950000,
    type: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    location: 'San Diego, CA',
    coordinates: [32.7157, -117.1611],
    image: 'https://images.unsplash.com/photo-1757264119016-7e6b568b810d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzcxODY0ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1757264119016-7e6b568b810d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzcxODY0ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Contemporary villa featuring a stunning infinity pool, outdoor entertainment area, and panoramic views of the ocean.',
    features: ['Pool', 'Ocean View', 'Outdoor Kitchen', 'Smart Home', 'Garden', 'Security'],
    yearBuilt: 2023,
    status: 'sale'
  },
  {
    id: '7',
    title: 'Downtown Luxury Apartment',
    price: 2800,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    location: 'Chicago, IL',
    coordinates: [41.8781, -87.6298],
    image: 'https://images.unsplash.com/photo-1654175868733-6e60cc6f9ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwcHJvcGVydHl8ZW58MXx8fHwxNzcxOTEzNDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1654175868733-6e60cc6f9ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwcHJvcGVydHl8ZW58MXx8fHwxNzcxOTEzNDAxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Stylish apartment in the heart of downtown Chicago with modern amenities and walkability to restaurants and entertainment.',
    features: ['City View', 'Gym', 'Parking', 'Balcony', 'Concierge'],
    yearBuilt: 2021,
    status: 'rent'
  },
  {
    id: '8',
    title: 'Cozy Suburban House',
    price: 4200,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    location: 'Seattle, WA',
    coordinates: [47.6062, -122.3321],
    image: 'https://images.unsplash.com/photo-1586310520462-658e93388399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBiZWRyb29tfGVufDF8fHx8MTc3MTg4Nzg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1586310520462-658e93388399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBiZWRyb29tfGVufDF8fHx8MTc3MTg4Nzg3NHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Charming home with minimalist design, featuring a cozy atmosphere and modern conveniences. Perfect for small families.',
    features: ['Garden', 'Fireplace', 'Garage', 'Patio', 'Storage'],
    yearBuilt: 2020,
    status: 'rent'
  }
];
