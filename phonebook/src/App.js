import axios from 'axios'
import { useEffect, useState } from 'react';
import personService from './services/persons'

const RenderFilter = (props) => {
  return props.persons.map((person) => {
     return person.name.toLowerCase().startsWith(props.filterValue.substring(0,3).toLowerCase())
     && props.filterValue !== ''
      ? <p key={person.name}>{person.name}, {person.number} <button onClick={() => props.handleDeletion(person.id, person.name)}>Delete</button></p> : <p key={person.name}></p>
    })
 }

 const RenderAll= (props) => {
   console.log(props.collection)
  return props.collection.map((person) => {
     return(<p key={person.name}>{person.name}, {person.number} <button onClick={() => props.handleDeletion(person.id, person.name)}>Delete</button></p>)
    })
 }


const App = () => {
  const [persons, setPersons] = useState([]); 

  useEffect(()=> {
    personService.getAll()
    .then(response => setPersons(response.data))
  },[]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [justAdded, setJustAdded] = useState('');
  const [messageStyle,setMessageStyle] = useState({
    color: 'green',
    fontSyle: 'italic',
    backgroundColor: 'lightgrey',
    fontSize: 20,
    borderRadius: 5,
    padding: 10
  })

  const refreshList = () => {
    personService.getAll()
    .then(response => setPersons(response.data))
  }

  const handleDeletion = (id, name) =>{
     const confirmation = window.confirm(`Are you sure you want to delete ${name} with id: ${id}`); 
     return confirmation ? personService.Delete(id).then(() => refreshList()) : null;
  }


  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    //The findIndex() method returns the index of the first element in the array that satisfies the provided testing function.
    // Otherwise, it returns -1, indicating that no element passed the test.
    let ide = 0;
    let index = persons.findIndex(i => i.name === newName);
    let numberIndex = persons.findIndex(i => i.number === newNumber);
   const personId = persons.forEach((person) => { 
      if (person.name === newName){
        ide = person.id;
        return ide;
      }
    })
    
    const person = persons.find(n => n.id === ide);
    const newPerson = {...person, number: newNumber, id: ide};

    const tryIt = index === -1 && numberIndex === -1 ? (setPersons(persons.concat({name : newName,number: newNumber})),  personService.Create({name : newName,number: newNumber})
    .then((response) => setPersons([...persons,{name: response.data.name, number: response.data.number, id: response.data.id}])))
     : window.confirm(`${newName}is already added with the current number: ${newNumber} is already added to the phonebook, Modify it?`) ? modifyNumber(ide,newPerson) : <p></p>

    setJustAdded(newName + "Was added succesfully");
    setMessageStyle({
      color: 'green',
      fontSyle: 'italic',
      backgroundColor: 'lightgrey',
      fontSize: 20,
      borderRadius: 5,
      padding: 10
    })
    setNewName(''); 
    setNewNumber('');
  }

  const handleChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumber = (e) => {
    setNewNumber(e.target.value);
  } 

  const handleFiltering = (e) => {
    setFilterValue(e.target.value);
  }

  useEffect(() => {
    const timer = setTimeout(() => setJustAdded(''), 3000);
    return () => clearTimeout(timer)
  },[handleSubmit])


  const modifyNumber = (id,person) => {
    personService.Update(id,person)
      .then(response => console.log(response)).catch(e => {
        if (e.response.status === 404) {
          setJustAdded('This persons data was already changed')
          setMessageStyle({
            color: 'red',
            fontSyle: 'italic',
            backgroundColor: 'lightgrey',
            fontSize: 20,
            borderRadius: 5,
            padding: 10
          })
        }
      });
    }


  return (
    <div>
     <div>
     <h2>Phonebook</h2>
      Filter by: <input onChange={handleFiltering} value={filterValue}/>
      <RenderFilter filterValue={filterValue} persons={persons} handleDeletion={handleDeletion}/>
     </div>
     {
      justAdded !== '' ? <p className='positivo' style={messageStyle}>{justAdded}</p> : <p></p>
       }
      <h2>Add new Contact</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input onChange={handleChange} value={newName} />
        </div>
        <div>
          number: <input onChange={handleNumber} value={newNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <RenderAll collection={persons} handleDeletion={handleDeletion}/>
    </div>
  )
}

export default App

