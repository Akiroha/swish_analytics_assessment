'use client';

import { useEffect, useState } from 'react';
import propsJson from '@/props.json';
import alternatesJson from '@/alternates.json';
import { PropType, MarketType, AltType, CachedFilterType } from '@/types';
import Table from '@/components/table';
import FilterActions from '@/components/filter-actions';

export default function Home() {
  const [markets, setMarkets] = useState<MarketType[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<MarketType[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<MarketType[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<
    Map<string, Set<string>>
  >(
    new Map([
      ['position', new Set<string>()],
      ['statType', new Set<string>()],
      ['marketStatus', new Set<string>()],
    ])
  );

  /**
   * The purpose of this useEffect is to set the stage for the app.
   * Based on the contents of the props and alternates json files,
   * we need to set the market rows for the display table.
   */
  useEffect(() => {
    let altsByUniqueKey = new Map<string, AltType[]>();

    // based on a unique key (player Id and statTypeId), we get a list of alternates that will be used when calculating the initial suspended value of each market
    alternatesJson.forEach((alt: AltType) => {
      const uniqueKey = alt.playerId + '' + alt.statTypeId;

      if (altsByUniqueKey.has(uniqueKey)) {
        let alts = altsByUniqueKey.get(uniqueKey) ?? [];
        alts.push(alt);
        alts.sort((a, b) => a.line - b.line);

        altsByUniqueKey.set(uniqueKey, alts);
      } else {
        altsByUniqueKey.set(uniqueKey, [alt]);
      }
    });

    /**
     * Calculates the suspended value for a given market line
     * @param alts corresponding list of alternates for a given market line
     * @param prop the prop in question
     * @returns boolen - whether or not a market line is suspended
     */
    const isSuspended = (alts: AltType[] | undefined, prop: PropType) => {
      if (!alts) return true;

      if (prop.marketSuspended) return true;

      const optimalLine = alts.find((alt) => prop.line === alt.line);

      if (!optimalLine) return true;

      return (
        optimalLine.underOdds < 0.4 &&
        optimalLine.overOdds < 0.4 &&
        optimalLine.pushOdds < 0.4
      );
    };

    /**
     * Takes in a PropType and spits out a MarketType. Adding suspended, low, high, and uniqueKey (playerId and statTypeId) values
     * @param prop given prop
     * @returns returns a prop converted into a market
     */
    const convertPropToMarket = (prop: PropType) => {
      const uniqueKey = prop.playerId + '' + prop.statTypeId;

      const alts = altsByUniqueKey.get(uniqueKey);

      let returnVal: MarketType = {
        ...prop,
        suspended: isSuspended(alts, prop),
        low: alts ? alts[0].line : 0,
        high: alts ? alts[alts.length - 1].line : 0,
        uniqueKey: uniqueKey,
      };

      return returnVal;
    };

    setMarkets(propsJson.map((prop) => convertPropToMarket(prop)));
  }, []);

  /**
   * This useEffect handles setting the filtered market value.
   * The dependency array is comprised of market, search and selectedFilters variables - all necessary for the filtering
   */
  useEffect(() => {
    setFilteredMarkets(
      markets
        // this filter is for filtering by search value on name and team name columns
        .filter(
          (market) =>
            market.playerName
              .toLowerCase()
              .includes(search.toLowerCase().trim()) ||
            market.teamNickname
              .toLowerCase()
              .includes(search.toLowerCase().trim())
        )
        // this filter is by player position
        .filter((market) => {
          if (selectedFilters.get('position')?.size === 0) return true;

          return selectedFilters.get('position')?.has(market.position);
        })
        // this filter is by player stat type
        .filter((market) => {
          if (selectedFilters.get('statType')?.size === 0) return true;

          return selectedFilters.get('statType')?.has(market.statType);
        })
        // this filter is by market status
        .filter((market) => {
          if (selectedFilters.get('marketStatus')?.size === 0) return true;

          return (
            (selectedFilters.get('marketStatus')?.has('suspended') &&
              market.suspended) ||
            (selectedFilters.get('marketStatus')?.has('not suspended') &&
              !market.suspended)
          );
        })
    );
  }, [markets, search, selectedFilters]);

  /**
   * handles the addition or deletion of elements (in selected markets) to their respective key
   * @param key key to update
   * @param option option that was clicked
   */
  const handleFilterSelect = (key: string, option: string) => {
    setSelectedFilters((oldSelectedFilters) => {
      let updateSelectedFilters = new Map(oldSelectedFilters);

      if (!updateSelectedFilters.has(key)) return oldSelectedFilters;

      let updateSet = new Set(updateSelectedFilters.get(key));

      if (updateSet.has(option)) {
        updateSet.delete(option);
      } else {
        updateSet.add(option);
      }

      updateSelectedFilters.set(key, updateSet);

      return updateSelectedFilters;
    });
  };

  /**
   * Clears the filter sets for each key
   */
  const handleClearFilter = () => {
    setSelectedFilters((oldSelectedFilters) => {
      let updateSelectedFilters = new Map(oldSelectedFilters);

      updateSelectedFilters.forEach((value, key) => {
        updateSelectedFilters.set(key, new Set());
      });

      return updateSelectedFilters;
    });
  };

  /**
   * handles the selection toggling of market rows
   * @param checked whether or not the market row is selected
   * @param uniqueKey market row unique key
   */
  const handleSelect = (checked: boolean, uniqueKey: string) => {
    setSelectedMarkets((oldMarkets) => {
      let updateMarkets = [...oldMarkets];

      if (checked) {
        let selectedMarket = filteredMarkets.find(
          (market) => market.uniqueKey === uniqueKey
        );
        if (selectedMarket) {
          updateMarkets.push(selectedMarket);
        }
      } else {
        let selectedIndex = updateMarkets.findIndex(
          (market) => market.uniqueKey === uniqueKey
        );

        if (selectedIndex !== -1) {
          updateMarkets.splice(selectedIndex, 1);
        }
      }

      return updateMarkets;
    });
  };

  /**
   * handles the clicking of a button and updating their suspended values
   * @param action the manual button action clicked
   */
  const handleManualUpdate = (action: 'suspend' | 'release') => {
    selectedMarkets.forEach((market) => {
      switch (action) {
        case 'suspend':
          market.suspended = true;
          break;
        case 'release':
          market.suspended = false;
          break;
      }
    });

    setSelectedMarkets([]);
    alert('Successfully updated markets!');
  };

  return (
    <main className="h-screen p-5 gap-5 bg-white flex flex-col">
      <div className="text-xl lg:text-6xl font-bold text-black">
        Swish Analytics Assessment
      </div>
      <FilterActions
        search={search}
        setSearch={setSearch}
        selectedFilters={selectedFilters}
        handleFilterSelect={handleFilterSelect}
        handleClearFilter={handleClearFilter}
        selectedMarkets={selectedMarkets}
        handleManualUpdate={handleManualUpdate}
      />
      <Table
        filteredMarkets={filteredMarkets}
        handleSelect={handleSelect}
        selectedMarkets={selectedMarkets}
      />
    </main>
  );
}
