import { useState, useEffect } from "react";

import Form from "./components/Form";
import Contacts from "./components/Contacts";
import service from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newFilter, setNewFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notificationText, setNotificationText] = useState(null);
  const [notificationClassName, setNotificationClassName] = useState(null);

  useEffect(() => {
    service.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.map((person) => person.name).includes(newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, do you want to update the number?`
        )
      ) {
        let id = persons.find((element) => element.name === newName).id;
        const personObject = {
          name: newName,
          number: newNumber,
          id: id,
        };
        service
          .update(id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== id ? person : returnedPerson
              )
            );
          })
          .catch((error) => {
            setNotificationText(
              `${newName} was already removed from the server`
            );
            setNotificationClassName("error");
            service.getAll().then((response) => {
              setPersons(response.data);
            });
            setTimeout(() => {
              setNotificationText(null);
            }, 5000);
          });
      }
    } else {
      for (let id = 1; id <= persons.length + 1; id++) {
        if (!persons.map((person) => person.id).includes(id)) {
          const personObject = {
            name: newName,
            number: newNumber,
            id: id,
          };
          service.create(personObject).then((response) => {
            setPersons(persons.concat(response.data));
            setNotificationText(`Added ${newName}`);
            setNotificationClassName("added");
            setTimeout(() => {
              setNotificationText(null);
            }, 5000);
          });
        }
      }
    }
    setNewFilter("");
    setNewNumber("");
    setNewName("");
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      service
        .remove(person.id)
        .then((response) => {
          service.getAll().then((response) => {
            setPersons(response.data);
          });
        })
        .catch((error) => {
          setNotificationText(
            `${person.name} was already removed from the server`
          );
          setNotificationClassName("error");
          service.getAll().then((response) => {
            setPersons(response.data);
          });
          setTimeout(() => {
            setNotificationText(null);
          }, 5000);
        });
    }
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <Notification
        message={notificationText}
        className={notificationClassName}
      />
      <Form
        addPerson={addPerson}
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <Contacts persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
