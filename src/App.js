import React, { useState, useEffect } from "react";
import axios from "axios";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Header = () => {
  return (
    <nav>
      <h1>Pokemon</h1>
    </nav>
  );
};
const Footer = () => {
  return (
    <div className="footer">
      <p>
        Copyright &#169; 2021{" "}
        <a target="blank" href="https://github.com/rsingh954">
          github.com/rsingh954
        </a>
      </p>
    </div>
  );
};
const Item = ({ title, id, stats, img, types, weight }) => {
  const [showInfo, setShowInfo] = useState(false);
  const onClick = (e) => {
    setShowInfo(!showInfo);
  };
  return (
    <div id={id} className="container" onClick={onClick}>
      <div className="container-heading">
        <img
          style={{ display: showInfo ? "block" : "none" }}
          src={img}
          alt="pokepic"
        />
        <h1>{title}</h1>
        <p> 00{id} </p>
      </div>
      {showInfo ? (
        <div className="dropdown container">
          <StatsView
            showInfo={showInfo}
            weight={weight}
            stats={stats}
            types={types}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
const StatsView = ({ stats, showInfo, types, weight }) => {
  let obj = {};
  for (const stat of stats) {
    const name = stat.stat.name;
    obj[name] = stat.base_stat;
  }
  const { hp, attack, defense, speed } = obj;
  return (
    <div
      className="stats-container"
      style={{ visible: showInfo ? "block" : "none" }}
    >
      <label>HP: {hp}</label>
      <label>Attack: {attack}</label>
      <label>Defence: {defense}</label>
      <label>Speed: {speed}</label>
      <label>
        Type: [{" "}
        {types.map((type, i) =>
          types.length === i + 1
            ? `${capitalizeFirstLetter(type.type.name)}`
            : `${capitalizeFirstLetter(type.type.name)}, `
        )}{" "}
        ]
      </label>
      <label>Weight: {weight}kg</label>
    </div>
  );
};

export default function App() {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/?&limit=5");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();

  //The way the api is structured we must obtain a list of pokemon
  //the data
  const pokeFun = async () => {
    setLoading(true);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };
  const getPokemon = async (res) => {
    res.map(async (item) => {
      const result = await axios.get(item.url);
      setPokeData((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    });
  };
  useEffect(() => {
    pokeFun();
  }, [url]);

  return (
    <div className="app">
      <Header />
      <main>
        {pokeData.map((pokemon) => (
          <Item
            key={pokemon.id}
            weight={pokemon.weight}
            types={pokemon.types}
            img={pokemon.sprites.front_shiny}
            url={pokemon.url}
            title={capitalizeFirstLetter(pokemon.name)}
            id={pokemon.id}
            stats={pokemon.stats}
          />
        ))}
        <div
          className="button-group"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "3rem",
            gap: "32px",
          }}
        >
          {prevUrl && (
            <button
              onClick={() => {
                setPokeData([]);
                setUrl(prevUrl);
              }}
            >
              Previous
            </button>
          )}

          {nextUrl && (
            <button
              onClick={() => {
                setPokeData([]);
                setUrl(nextUrl);
              }}
            >
              Next
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
