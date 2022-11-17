import React, { useState, useEffect } from "react";
let url = 'https://pokeapi.co/api/v2/pokemon/?limit=5'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Item = ({ title, id, stats, img, types, weight }) => {
  const [showInfo, setShowInfo ] = useState(false)
  const onClick = (e) =>{
    setShowInfo(!showInfo)
  }
  return (
    <div id={id} className="container" onClick={onClick} >
      <div className="container-heading">
        <img style={{display: showInfo ? 'block': 'none'}} src={img} alt="pokepic" />
        <h1>{title}</h1>
      <span> 00{id} </span>
      </div>
      {showInfo ? (
        <div className="dropdown container">
          <StatsView showInfo={showInfo} weight={weight} stats={stats} types={types}/>
        </div>
      ): ""}
    </div>
  );
};
const StatsView = ({stats, showInfo, types, weight}) => {
  let obj ={}
  for (const stat of stats){
    const name  = stat.stat.name
    obj[name] = stat.base_stat
  }
  const {hp, attack, defense, speed} = obj
  return(
    <div className="stats-container" style={{visible: showInfo ? 'block': 'none'}}>
      <label>HP: {hp}</label>
      <label>Attack: {attack}</label>
      <label>Defence: {defense}</label>
      <label>Speed: {speed}</label>
      <label>Type: [ {types.map((type, i) => (
        (types.length === i+1) ?
        `${capitalizeFirstLetter(type.type.name)}`:`${capitalizeFirstLetter(type.type.name)}, `
      ) )} ]</label>
      <label>Weight: {weight}kg</label>
    </div>
  )
}

export default function App() {
  const [list, setList] = useState([]);
  const [ offset, setOffset ] = useState(5)

  //The way the api is structured we must obtain a list of pokemon
  //the data
  async function getPokeList(){
    let response = await fetch(url)
    let data = await response.json()
    let pokemonObj = []
    for (const res of data.results){
      let data = await getPokemonStats(res.url)
      pokemonObj.push(data)
    }
    return pokemonObj
  }
  async function getPokemonStats(url){
    const response = await fetch(url)
    const data = await response.json()
    return data
  }
  useEffect(() => {
    async function populateList(){
        setList([...list, ...await getPokeList()])
    }
    if(list.length === 0){
      populateList()
    }
    return () => {
      list.length = 0
    }
  },[list])

useEffect(() => {
  console.log(list)
}, [list])

const  handleNextClick = () => {
  setOffset(offset => offset + 5)
  url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=5`
  getPokeList().then(data => setList([...data]))
}
const handlePrevClick = () => {
  if(offset ===  5){
    url = `https://pokeapi.co/api/v2/pokemon/?limit=5`
    getPokeList().then(data => setList([...data]))
  }
  else if(offset > 5){
    setOffset(offset => offset - 5)
    url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=5`
    getPokeList().then(data => setList([...data]))
  }
}
  return (
    <div className="app"> 
    {
      list.map((pokemon) => (
         <Item key={pokemon.id} weight={pokemon.weight} types={pokemon.types} img={pokemon.sprites.front_shiny} url ={pokemon.url} title={capitalizeFirstLetter(pokemon.name)} id={pokemon.id} stats={pokemon.stats}/>
      ))
    }
    <div className="button-group" style={{display: "flex", width: '100%', justifyContent: 'center', marginTop: '8px', gap: '32px'}}>
    <button onClick = {handlePrevClick}>Previous</button>
      <button  onClick = {handleNextClick}>Next</button>
    </div>


    </div>
  );
}
