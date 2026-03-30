import { motion } from 'motion/react';
import { Filter, Search, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';

export interface FilterState {
  search: string;
  listingType: string;
  state: string;
  city: string;
  propertyTypes: string[];
  bedrooms: string;
  constructionStatus: string;
  postedBy: string;
  minPrice: number;
  maxPrice: number;
  minArea: string;
  maxArea: string;
  localities: string[];
}

interface LocalityOption {
  name: string;
  rating: number;
}

interface PropertyFiltersProps {
  filters: FilterState;
  states: string[];
  cities: string[];
  localities: LocalityOption[];
  onFilterChange: (filters: FilterState) => void;
}

const PROPERTY_TYPE_OPTIONS = [
  { value: 'APARTMENT', label: 'Residential Apartment' },
  { value: 'HOUSE', label: 'Independent House/Villa' },
  { value: 'LAND', label: 'Residential Land' },
  { value: 'FLOOR', label: 'Builder Floor' },
  { value: 'STUDIO', label: '1 RK / Studio Apartment' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
];

const BEDROOM_OPTIONS = ['1 RK/1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6+ BHK'];
const CONSTRUCTION_OPTIONS = [
  { value: 'new_launch', label: 'New Launch' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready to Move' },
];
const POSTED_BY_OPTIONS = [
  { value: 'owner', label: 'Owner' },
  { value: 'builder', label: 'Builder' },
  { value: 'dealer', label: 'Dealer' },
  { value: 'feature_dealer', label: 'Feature Dealer' },
];

const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export function PropertyFilters({
  filters,
  states,
  cities,
  localities,
  onFilterChange,
}: PropertyFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const togglePropertyType = (value: string) => {
    const next = filters.propertyTypes.includes(value)
      ? filters.propertyTypes.filter((type) => type !== value)
      : [...filters.propertyTypes, value];
    onFilterChange({ ...filters, propertyTypes: next });
  };

  const toggleLocality = (value: string) => {
    const next = filters.localities.includes(value)
      ? filters.localities.filter((locality) => locality !== value)
      : [...filters.localities, value];
    onFilterChange({ ...filters, localities: next });
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      listingType: 'all',
      state: '',
      city: '',
      propertyTypes: [],
      bedrooms: 'any',
      constructionStatus: 'all',
      postedBy: 'all',
      minPrice: 0,
      maxPrice: 50000000,
      minArea: '',
      maxArea: '',
      localities: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h2 className="text-xl">Search Filters</h2>
        </div>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Search by Location / Keyword</Label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <Input
              value={filters.search}
              placeholder="Try Chandigarh, Zirakpur, 3 BHK, Sector 17..."
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Listing Type</Label>
            <Select
              value={filters.listingType}
              onValueChange={(value) => onFilterChange({ ...filters, listingType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
                <SelectItem value="RENT">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select State</Label>
            <Select
              value={filters.state || 'all'}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  state: value === 'all' ? '' : value,
                  city: '',
                  localities: [],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select City</Label>
            <Select
              value={filters.city || 'all'}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  city: value === 'all' ? '' : value,
                  localities: [],
                })
              }
              disabled={!filters.state && cities.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Type of Property</Label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPE_OPTIONS.map((option) => {
              const selected = filters.propertyTypes.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePropertyType(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selected ? 'bg-black text-white border-black' : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label>No. of Bedrooms</Label>
          <div className="flex flex-wrap gap-2">
            {BEDROOM_OPTIONS.map((option) => {
              const value = option.split(' ')[0].replace('RK/1', '1');
              const selected = filters.bedrooms === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      bedrooms: selected ? 'any' : value,
                    })
                  }
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selected ? 'bg-black text-white border-black' : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Construction Status</Label>
            <Select
              value={filters.constructionStatus}
              onValueChange={(value) => onFilterChange({ ...filters, constructionStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {CONSTRUCTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Posted By</Label>
            <Select
              value={filters.postedBy}
              onValueChange={(value) => onFilterChange({ ...filters, postedBy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {POSTED_BY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>
            Budget: {formatInr(filters.minPrice)} - {formatInr(filters.maxPrice)}
          </Label>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            min={0}
            max={50000000}
            step={100000}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Area (sq.ft.)</Label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="0"
              value={filters.minArea}
              onChange={(e) => onFilterChange({ ...filters, minArea: e.target.value })}
              placeholder="No min"
            />
            <Input
              type="number"
              min="0"
              value={filters.maxArea}
              onChange={(e) => onFilterChange({ ...filters, maxArea: e.target.value })}
              placeholder="No max"
            />
          </div>
        </div>

        {localities.length > 0 && (
          <div className="space-y-3">
            <Label>Localities</Label>
            <div className="space-y-2">
              {localities.map((locality) => {
                const selected = filters.localities.includes(locality.name);
                return (
                  <button
                    key={locality.name}
                    type="button"
                    onClick={() => toggleLocality(locality.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                      selected ? 'border-black bg-gray-100' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span>{locality.name}</span>
                    <span className="text-sm opacity-70 flex items-center gap-1">
                      {locality.rating.toFixed(1)}
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
