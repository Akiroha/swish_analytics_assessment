import { FilterType, MarketType } from '@/types';

type Props = {
  search: string;
  setSearch: Function;
  selectedFilters: Map<string, Set<string>>;
  handleFilterSelect: Function;
  handleClearFilter: Function;
  selectedMarkets: MarketType[];
  handleManualUpdate: Function;
};

const filters = new Map([
  [
    'position',
    {
      label: 'Position',
      options: ['PG', 'SG', 'SF', 'PF', 'C'],
    },
  ],
  [
    'statType',
    {
      label: 'Stat Type',
      options: ['assists', 'rebounds', 'points', 'steals'],
    },
  ],
  [
    'marketStatus',
    {
      label: 'Availability',
      options: ['suspended', 'not suspended'],
    },
  ],
]);

const FilterActions = ({
  search,
  setSearch,
  selectedFilters,
  handleFilterSelect,
  handleClearFilter,
  selectedMarkets,
  handleManualUpdate,
}: Props) => {
  const filterOn = Array.from(selectedFilters).some(
    ([key, value]) => value.size > 0
  );

  return (
    <div className="flex flex-wrap gap-2 justify-between items-center">
      <div className="flex flex-wrap gap-2 items-end">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value ?? '')}
          className="border-2 border-black bg-white rounded-lg p-0.5 w-72 text-black outline-none"
          placeholder="Search by player name or team"
        />
        <div className="dropdown dropdown-hover dropdown-left md:dropdown-right dropdown-bottom">
          <div className="indicator">
            {filterOn && (
              <span className="indicator-item badge badge-xs badge-secondary"></span>
            )}
            <label tabIndex={0} className="btn btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {Array.from(filters).map(([key, filter]) => (
              <ul key={key}>
                <li className="menu-title">{`Filter By ${filter.label}:`}</li>
                {filter.options.map((option) => (
                  <li key={option}>
                    <a
                      className={
                        selectedFilters.get(key)?.has(option) ? 'active' : ''
                      }
                      onClick={() => handleFilterSelect(key, option)}
                    >
                      {option}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
            {filterOn && (
              <li>
                <a
                  className="bg-primary font-bold"
                  onClick={() => handleClearFilter()}
                >
                  Clear Filter
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div>
        {selectedMarkets.length > 0 &&
          selectedMarkets?.every((market) => !market.suspended) && (
            <button
              className="btn btn-sm btn-error"
              onClick={() => handleManualUpdate('suspend')}
            >
              Suspend
            </button>
          )}
        {selectedMarkets.length > 0 &&
          selectedMarkets?.every((market) => market.suspended) && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleManualUpdate('release')}
            >
              Release
            </button>
          )}
      </div>
    </div>
  );
};

export default FilterActions;
