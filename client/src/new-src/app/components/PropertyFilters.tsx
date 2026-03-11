import { motion } from 'motion/react';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

export interface FilterState {
  status: string;
  type: string;
  priceRange: [number, number];
  bedrooms: string;
}

interface PropertyFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function PropertyFilters({ filters, onFilterChange }: PropertyFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5" />
        <h2 className="text-xl">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => onFilterChange({ ...filters, bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>
            Price Range: ${filters.priceRange[0].toLocaleString()} - $
            {filters.priceRange[1] >= 5000000
              ? '5M+'
              : filters.priceRange[1].toLocaleString()}
          </Label>
          <div className="pt-2">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={5000000}
              step={100000}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="outline"
          onClick={() =>
            onFilterChange({
              status: 'all',
              type: 'all',
              priceRange: [0, 5000000],
              bedrooms: 'any',
            })
          }
        >
          Reset Filters
        </Button>
      </div>
    </motion.div>
  );
}
