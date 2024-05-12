const Filter = ({newFilter, handleFilterChange}) => (
  <div>
    <h2>Phonebook</h2>
    filter names: <input value={newFilter} onChange={handleFilterChange} />
  </div>
);

export default Filter;
