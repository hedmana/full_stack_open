import { useState } from "react";

const Header = (props) => {
  return <h1>{props.text}</h1>;
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  if (props.text != "positive") {
    return (
      <tr>
        <td> {props.text} </td>
        <td> {props.value} </td>
      </tr>
    );
  }
  return (
    <tr>
      <td> {props.text} </td>
      <td> {props.value} % </td>
    </tr>
  );
};

const Statistics = (props) => {
  if (props.total == 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text={"good"} value={props.good} />
          <StatisticLine text={"neutral"} value={props.neutral} />
          <StatisticLine text={"bad"} value={props.bad} />
          <StatisticLine text={"all"} value={props.total} />
          <StatisticLine
            text={"average"}
            value={((props.good * 1 + props.bad * -1) / props.total).toFixed(1)}
          />
          <StatisticLine
            text={"positive"}
            value={((props.good / props.total) * 100).toFixed(1)}
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const total = good + neutral + bad;

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  );
};

export default App;
