import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import FilterAnecdotes from './components/FilterAnecdotes'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <FilterAnecdotes />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App