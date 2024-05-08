import { useState } from "react";
import Countries from "./components/Countries"

function App() {
  const [newFilter, setNewFilter] = useState("");

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <Countries 
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
}

export default App;
