const Title = ({ title }) => <h2> {title}</h2>;

const Total = ({ parts }) => (
  <p>
    <b>
      {" "}
      Total of{" "}
      {parts
        .map((part) => part.exercises)
        .reduce((s, p) => {
          return s + p;
        })}{" "}
      exercises{" "}
    </b>
  </p>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ courses }) => {
  return courses.map((course) => (
    <div key={course.id}>
      <Title title={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  ));
};

export default Course