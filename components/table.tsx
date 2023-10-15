import { MarketType } from '@/types';

type Props = {
  filteredMarkets: MarketType[];
  handleSelect: Function;
  selectedMarkets: MarketType[];
};

const Table = ({ filteredMarkets, handleSelect, selectedMarkets }: Props) => {
  return (
    <div className="flex-auto overflow-y-auto rounded-lg overflow-x-auto text-black">
      <table className="table table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <th className="text-white">Name</th>
            <th className="text-white">Team</th>
            <th className="text-white">Position</th>
            <th className="text-white">Type</th>
            <th className="text-white">Optimal</th>
            <th className="text-white">Available</th>
            <th className="text-white">Low</th>
            <th className="text-white">High</th>
          </tr>
        </thead>
        <tbody>
          {filteredMarkets.map((market) => (
            <tr key={market.uniqueKey}>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs lg:checkbox-md checkbox-primary"
                    checked={
                      selectedMarkets.findIndex(
                        (mk) => mk.uniqueKey === market.uniqueKey
                      ) !== -1
                    }
                    onChange={(event) =>
                      handleSelect(event.target.checked, market.uniqueKey)
                    }
                  />
                </label>
              </th>
              <td>{market.playerName}</td>
              <td>{market.teamNickname}</td>
              <td>{market.position}</td>
              <td>{market.statType}</td>
              <td>{market.line}</td>
              <td>
                {market.suspended ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-error"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-success"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </td>
              <td>{market.low}</td>
              <td>{market.high}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
