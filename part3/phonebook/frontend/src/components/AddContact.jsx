const AddContact = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <div>
    <h2>Add new contact</h2>

    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
  </div>
);

export default AddContact;
