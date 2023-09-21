const Contacts = ({ persons }) => (
  <div>
    <h2>Contacts</h2>
    {persons.map((person, index) => (
      <div key={index}>
        {person.name} {person.number}
      </div>
    ))}
  </div>
);

export default Contacts;
