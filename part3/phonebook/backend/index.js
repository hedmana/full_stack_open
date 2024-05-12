const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === "POST") {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }
}));
app.use(cors())

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook!</h1>");
});

app.get("/api/phonebook", (request, response) => {
  response.json(phonebook);
});

app.get("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = phonebook.find((note) => note.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`
  );
});

app.post("/api/phonebook", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name or number",
    });
  }

  if (phonebook.some((contact) => contact.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const contact = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(contact);

  response.json(contact);
});

app.delete("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
