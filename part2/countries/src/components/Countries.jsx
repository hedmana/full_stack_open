import Filter from "./Filter";
import ListCountries from "./ListCountries";

const Countries = ({ newFilter, handleFilterChange }) => (
  <div>
    <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
    <ListCountries></ListCountries>
  </div>
);

export default Countries;
