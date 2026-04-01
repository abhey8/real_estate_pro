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
  activeFilterCount: number;
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

const PANEL_SECTION_CLASS = 'rounded-2xl border border-slate-200 bg-slate-50/80 p-4';
const SELECT_TRIGGER_CLASS = 'h-11 rounded-xl border-slate-200 bg-white shadow-none';

const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const getOptionButtonClass = (selected: boolean) =>
  [
    'w-full rounded-xl border px-3 py-2.5 text-left text-sm leading-5 transition-all duration-200',
    selected
      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100',
  ].join(' ');

const getChipClass = (selected: boolean) =>
  [
    'rounded-xl border px-3 py-2 text-center text-sm transition-colors duration-200',
    selected
      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100',
  ].join(' ');

export function PropertyFilters({
  filters,
  states,
  cities,
  localities,
  activeFilterCount,
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
    <motion.aside
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.08)] lg:flex lg:max-h-[calc(100vh-7.75rem)] lg:flex-col"
    >
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                <Filter className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Search Filters</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Refine the result set without losing the bigger picture.
                </p>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                {activeFilterCount} active filters
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="rounded-xl border-slate-200 bg-white px-3 text-slate-700 shadow-none hover:bg-slate-100"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-5 p-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
        <section className={PANEL_SECTION_CLASS}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">Search by location / keyword</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Search cities, sectors, localities, or phrases like 3 BHK.
            </p>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={filters.search}
              placeholder="Try Chandigarh, Zirakpur, 3 BHK, Sector 17..."
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-none"
            />
          </div>
        </section>

        <section className={`${PANEL_SECTION_CLASS} space-y-4`}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">Location setup</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Select the listing type, then narrow by state and city.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Listing Type
              </Label>
              <Select
                value={filters.listingType}
                onValueChange={(value) => onFilterChange({ ...filters, listingType: value })}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
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
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                State
              </Label>
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
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
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
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                City
              </Label>
              <Select
                value={filters.city || 'all'}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    city: value === 'all' ? '' : value,
                    localities: [],
                  })
                }
                disabled={!filters.state}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder={filters.state ? 'Select city' : 'Choose state first'} />
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
        </section>

        <section className={`${PANEL_SECTION_CLASS} space-y-3`}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">Type of Property</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Focus the listings by the residential format you care about.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PROPERTY_TYPE_OPTIONS.map((option) => {
              const selected = filters.propertyTypes.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePropertyType(option.value)}
                  className={getOptionButtonClass(selected)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className={`${PANEL_SECTION_CLASS} space-y-3`}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">No. of Bedrooms</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Tap once to apply, tap again to clear that bedroom count.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
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
                  className={getChipClass(selected)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>

        <section className={`${PANEL_SECTION_CLASS} space-y-4`}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">Extra filters</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Keep these optional so the main search stays easy to scan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Construction
              </Label>
              <Select
                value={filters.constructionStatus}
                onValueChange={(value) => onFilterChange({ ...filters, constructionStatus: value })}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
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
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Posted By
              </Label>
              <Select
                value={filters.postedBy}
                onValueChange={(value) => onFilterChange({ ...filters, postedBy: value })}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
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
        </section>

        <section className={`${PANEL_SECTION_CLASS} space-y-4`}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">Budget</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {formatInr(filters.minPrice)} to {formatInr(filters.maxPrice)}
            </p>
          </div>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            min={0}
            max={50000000}
            step={100000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{formatInr(filters.minPrice)}</span>
            <span>{formatInr(filters.maxPrice)}</span>
          </div>
        </section>

        <section className={`${PANEL_SECTION_CLASS} space-y-4`}>
          <div>
            <Label className="text-sm font-semibold text-slate-900">Area (sq.ft.)</Label>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Set a tighter square-foot range only when you need it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="0"
              value={filters.minArea}
              onChange={(e) => onFilterChange({ ...filters, minArea: e.target.value })}
              placeholder="Min"
              className="h-11 rounded-xl border-slate-200 bg-white shadow-none"
            />
            <Input
              type="number"
              min="0"
              value={filters.maxArea}
              onChange={(e) => onFilterChange({ ...filters, maxArea: e.target.value })}
              placeholder="Max"
              className="h-11 rounded-xl border-slate-200 bg-white shadow-none"
            />
          </div>
        </section>

        {localities.length > 0 && (
          <section className={`${PANEL_SECTION_CLASS} space-y-3`}>
            <div>
              <Label className="text-sm font-semibold text-slate-900">Popular localities</Label>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Helpful micro-markets around your selected city.
              </p>
            </div>
            <div className="space-y-2">
              {localities.map((locality) => {
                const selected = filters.localities.includes(locality.name);
                return (
                  <button
                    key={locality.name}
                    type="button"
                    onClick={() => toggleLocality(locality.name)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                      selected
                        ? 'border-slate-900 bg-white shadow-sm'
                        : 'border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="text-sm text-slate-700">{locality.name}</span>
                    <span className="flex items-center gap-1 text-sm text-amber-600">
                      {locality.rating.toFixed(1)}
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </motion.aside>
  );
}
