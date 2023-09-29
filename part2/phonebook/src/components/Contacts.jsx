const Contacts = ({ persons, deletePerson}) => (
  <div>
    <h2>Contacts</h2>
    {persons.map((person, index) => (
      <div key={index}>
        {person.name} {person.number} <button onClick={() => deletePerson(person)}> delete</button>
      </div>
    ))}
  </div>
);

export default Contacts;
