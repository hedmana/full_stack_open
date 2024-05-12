import Filter from "./Filter";
import AddContact from "./AddContact";
import SubmitButton from "./SubmitButton";

const Form = ({
  addPerson,
  newFilter,
  handleFilterChange,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <div>
    <form onSubmit={addPerson}>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <AddContact
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <SubmitButton text="add" />
    </form>
  </div>
);

export default Form;
