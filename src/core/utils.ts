import * as R from 'ramda';
import { Op } from 'sequelize';

export const paginate = (query) => {
  const page = Number(R.prop('page', query)) ? R.prop('page', query) : 1;
  const limit = Number(R.prop('limit', query)) ? R.prop('limit', query) : 20;

  return {
    offset: (page - 1) * limit,
    limit,
  };
};

export const searchQuery = (searchFields: string[], query) => {
  const searchValue = R.propOr('', 'search', query);

  if (!searchValue) return {};
  console.log(searchValue);
  const fieldIterator = R.map(
    (field) => ({
      [field]: {
        [Op.like]: `%${searchValue}%`,
      },
    }),
    searchFields,
  );
  console.log(fieldIterator);
  return {
    where: { [Op.or]: fieldIterator },
  };
};
