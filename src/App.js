import React from 'react'

function App() {
  const [item, setItem] = React.useState([]);

  const handleItems = (item) => {
    setItem(items=> [...items, item])
  }
  const handleDeleteItem = (id) => {
    setItem((items)=>items.filter(preV=> preV.id !== id))
  }

  const handleToggleItem = (id) => {
    setItem((items)=>items.map((preV)=> preV.id === id ? {...preV, packed:!preV.packed}: preV))
  }
  return (
    <div className='app'>
      <Logo />
      <Form handleItems={handleItems} />
      <PackingList items={item} handleDeleteItem={handleDeleteItem} handleToggleItem={handleToggleItem} setItem={setItem} />
      <Stats items={item} />
    </div>
  );
}

function Logo() {
  return (<h1>🌴 Far Away 💼</h1>)
}

function Form({handleItems}) {
  const [description, setDescription] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() }
    console.log(newItem)

    handleItems(newItem)
    setDescription('');
    setQuantity(1);
  }
  return (<form className='add-form' onSubmit={handleSubmit}>
    <h3>What do you need for your 😍 trip?</h3>
    <select value={quantity} onChange={(e) => { setQuantity(Number(e.target.value))}}>
      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num}</option>))}
    </select>
    <input type="text" placeholder="Item..." value={description} onChange={(e) => {setDescription(e.target.value) }} />
    <button>Add</button>
  </form>)
}

function PackingList({ items, setItem, handleDeleteItem, handleToggleItem }) {
  const [sortBy, setSortBy] = React.useState('input')

  let sortedItems; 

  if (sortBy === 'input') sortedItems = items;
  if (sortBy === 'description') sortedItems= items.slice().sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === 'packed') sortedItems = items.slice().sort((a,b)=>Number(a.packed) - Number(b.packed))
  return <div className='list'>
    <ul>
      {sortedItems.map((item) => (
        <Item item={item} key={item.id} handleDeleteItem={handleDeleteItem} handleToggleItem={handleToggleItem} />
      ))}
    </ul>

    <div className='actions'>
      <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
        <option value='input'>Sort by input order</option>
        <option value='description'>Sort by description</option>
        <option value='packed'>Sort by packed status</option>
      </select>
      <button onClick={() => { const confirmed = window.confirm("Are you sure want to delete all items");  if(confirmed) setItem([])}}>Clear list</button>
    </div>
  </div>
}

function Item({item, handleDeleteItem, handleToggleItem}) {
  return <li><input type="checkbox" value={item.packed} onChange={()=>handleToggleItem(item.id)} /> <span style={item.packed ? {textDecoration:"line-through"} : null}>{item.quantity} {item.description}</span> <button onClick={()=>handleDeleteItem(item.id)}>❌</button></li>
}

function Stats({ items }) {
  if (!items.length) return (<footer className="stats"><em>Start adding some items to your packing list 🚀.</em></footer>);
  const numItem = items.length;
  const numPacked = items.filter((data) => data.packed).length;
  const packedRatio = Math.round((numPacked / numItem) * 100); 
  return <footer className='stats'>
    <em>{packedRatio === 100 ? `You got everything! Ready to go ✈️`: `💼 You have ${numItem} items on your list, and you already packed ${numPacked} (${packedRatio}%)`}</em>
  </footer>
}

export default App;
