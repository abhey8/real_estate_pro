export const getFavoriteListingId = (favorite: any): string | null => {
  if (!favorite) {
    return null;
  }

  if (favorite.listingId) {
    return String(favorite.listingId);
  }

  if (favorite.listing && typeof favorite.listing === 'object') {
    const listingObjectId = favorite.listing._id || favorite.listing.id;
    if (listingObjectId) {
      return String(listingObjectId);
    }
  }

  if (favorite.listing && (typeof favorite.listing === 'string' || typeof favorite.listing === 'number')) {
    return String(favorite.listing);
  }

  if ((favorite.title || favorite.price || favorite.images) && (favorite._id || favorite.id)) {
    return String(favorite._id || favorite.id);
  }

  return null;
};

export const getFavoriteListing = (favorite: any) => {
  if (!favorite) {
    return null;
  }

  if (favorite.listing && typeof favorite.listing === 'object') {
    return favorite.listing;
  }

  if (favorite.title || favorite.price || favorite.images) {
    return favorite;
  }

  return null;
};

export const normalizeFavoriteListings = (favorites: any[] = []) =>
  favorites
    .map((favorite) => {
      const listing = getFavoriteListing(favorite);
      if (!listing) {
        return null;
      }

      return {
        ...listing,
        _id: listing._id || listing.id || getFavoriteListingId(favorite),
      };
    })
    .filter(Boolean);
