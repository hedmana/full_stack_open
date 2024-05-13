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
    }).catch((error) => {
      console.log(error);
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
        const personToUpdate = persons.find((per) => per.name === newName);
        const personObject = {
          name: newName,
          number: newNumber,
        };
        service
          .update(personToUpdate.id, personObject)
          .then((response) => {
            persons.map((person) => {
              if (person.id === response.data.id) {
                return response.data;
              } else {
                return person;
              }
            });
          })
          .catch((error) => {
            console.log(error.response.data.error);
            setNotificationText(error.response.data.error);
            setNotificationClassName("error");
            ("error");
            setTimeout(() => {
              setNotificationText("");
              setNotificationClassName("");
            }, 5000);
          });
        service.getAll().then((response) => {
          setPersons(response.data);
        });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      service
        .create(personObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNotificationText(`Added ${newName}`);
          setNotificationClassName("added");
          setTimeout(() => {
            setNotificationText(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setNotificationText(error.response.data.error);
          setNotificationClassName("error");
          ("error");
          setTimeout(() => {
            setNotificationText("");
            setNotificationClassName("");
          }, 5000);
        });
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
