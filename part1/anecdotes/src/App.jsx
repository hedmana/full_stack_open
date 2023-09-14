import { useState } from "react";

const Header = (props) => {
  return <h1>{props.text}</h1>;
};

const Anecdote = (props) => {
  return (
    <div>
      {props.anecdote} <br></br>
      has {props.votes} votes
    </div>
  );
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const MostVotes = (props) => {
  const index = props.votes.indexOf(Math.max.apply(Math, props.votes));
  return (
    <div>
      {props.anecdotes[index]} <br></br>
      has {props.votes[index]} votes
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));

  function updateVotes(votes, selected) {
    const updatedVotes = [];

    votes.forEach((element, index) => {
      if (index === selected) {
        element += 1;
      }
      updatedVotes.push(element);
    });

    return updatedVotes;
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button
        text="vote"
        handleClick={() => setVotes(updateVotes(votes, selected))}
      />
      <Button
        text="next anecdote"
        handleClick={() =>
          setSelected(Math.floor(Math.random() * anecdotes.length))
        }
      />
      <Header text="Anecdote with most votes" />
      <MostVotes votes={votes} anecdotes={anecdotes} />
    </div>
  );
};

export default App;
