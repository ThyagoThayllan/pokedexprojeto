import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "./components/Header";
import { PokemonCard } from "./components/PokemonCard";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import pokebola from "./imgs/pokebola.png";
import styles from "./App.module.css";
import { UsersTypes } from "./routes";

type Stats = {
  base_stat: number;
  stat: {
    hp: number;
  };
};

export type PokemonType = {
  id: number;
  name: string;
  base_experience: number;
  sprites: {
    front_default: string;
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  stats: Stats;
};

export type Pokemon = {
  name: string;
};

type PokemonsToFilter = {
  pokemon: {
    name: string;
  };
};

type AppTypes = {
  user: UsersTypes;
  changeUser: (user: UsersTypes) => void;
};

export const App = ({ user, changeUser }: AppTypes) => {
  //  States
  const [limit, setLimit] = useState(30);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonTeam, setPokemonTeam] = useState<PokemonType[]>([]);
  const [openPoketeam, setOpenPoketeam] = useState(false);

  const [pokemonsSearchedByName, setPokemonsSearchedByName] =
    useState<PokemonType>({} as PokemonType);
  const [pokemonsToFilter, setPokemonsToFilter] = useState<PokemonsToFilter[]>(
    []
  );

  //  Funções
  const getPokemons = async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/./?limit=${limit}&offset=9`
      );
      const data = await response.data.results;

      setPokemonsToFilter([]);
      setPokemons([...data]);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMorePokemons = () => {
    setLimit(limit + 9);
  };

  const putPokemonOnMyTeam = async (pokemonName: string) => {
    if (pokemonTeam.length < 5) {
      await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((pokemon) => setPokemonTeam([...pokemonTeam, pokemon.data]));
    } else {
      alert("Você já tem 5 Pokémons no seu time!");
    }
  };

  const removePokemon = (pokemonName: string) => {
    const updatedPokemon = pokemonTeam.filter(
      (pokemon) => pokemon.name !== pokemonName
    );

    setPokemonTeam(updatedPokemon);
  };

  //  Procurando Pokémons por Tipo
  const getPokemonByType = async (type: string) => {
    try {
      if (type === "all") {
        getPokemons();
      } else {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/type/${type}/`
        );
        const data = await response.data.pokemon;

        setPokemons([]);
        setPokemonsToFilter([...data]);
      }
    } catch (error) {
      alert("Nenhum Pokémon encontrado");
    }
  };

  // Procurando pokemon por nome
  const searchPokemonByName = async (name: string) => {
    if (!name) {
      getPokemons();
    } else {
      try {
        setPokemonsSearchedByName({} as PokemonType);
        setPokemons([]);
        setPokemonsToFilter([]);

        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const data = await response.data;

        setPokemons([]);
        setPokemonsToFilter([]);
        setPokemonsSearchedByName(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getPokemons();
  }, []);

  useEffect(() => {
    getPokemons();
  }, [limit]);

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <Header
        user={user}
        changeUser={changeUser}
        getPokemonByType={getPokemonByType}
        searchPokemonByName={searchPokemonByName}
      />

      <div className={styles.main}>
        <div className={styles.openDiv}>
          <button
            className={styles.arrowImg}
            onClick={() => setOpenPoketeam(!openPoketeam)}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>

        <div className={styles.title}>
          <h1>Pokédex</h1>
          <p>Veja detalhes dos Pokémons e monte o seu time com até 5 deles!</p>
        </div>

        <div className={styles.pokemonsContainer}>
          {pokemons.length > 0 &&
            pokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                catchPokemon={putPokemonOnMyTeam}
                pokemonTeam={pokemonTeam}
              />
            ))}

          {pokemonsToFilter.length > 0 &&
            pokemonsToFilter.map((pokemon) => (
              <PokemonCard
                key={pokemon.pokemon.name}
                name={pokemon.pokemon.name}
                catchPokemon={putPokemonOnMyTeam}
                pokemonTeam={pokemonTeam}
              />
            ))}

          {pokemons.length === 0 && pokemonsToFilter.length === 0 && (
            <PokemonCard
              key={pokemonsSearchedByName.id}
              name={pokemonsSearchedByName.name}
              catchPokemon={putPokemonOnMyTeam}
              pokemonTeam={pokemonTeam}
            />
          )}
        </div>

        {pokemons.length > 0 && (
          <button className={styles.button} onClick={loadMorePokemons}>
            Carreegar mais
          </button>
        )}

        {openPoketeam && (
          <div className={styles.teamContainer}>
            <button
              className={styles.closePoketeam}
              onClick={() => setOpenPoketeam(!openPoketeam)}
            >
              <ArrowBackIosNewIcon fontSize="medium" />
            </button>
            <div className={styles.titlePoketeam}>
              <img src={pokebola} alt="Imagem de uma Pokébola" />
              <h2>Seu time de Pokémon</h2>
            </div>

            <div className={styles.pokemonDiv}>
              <div className={styles.cleanAndCount}>
                <button onClick={() => setPokemonTeam([])}>
                  <DeleteIcon fontSize="small" />
                  <span>Limpar time</span>
                </button>
                <p>{pokemonTeam.length}</p>
              </div>
              {pokemonTeam.length > 0 ? (
                pokemonTeam.map((pokemon) => (
                  <div key={pokemon.id} className={styles.pokemon}>
                    <div className={styles.pokemonTeamDiv}>
                      <img
                        src={pokemon.sprites.other.dream_world.front_default}
                        alt={`Imagem do Pokémon ${pokemon.name}`}
                      />
                    </div>
                    <h3>{pokemon.name}</h3>
                    <button onClick={() => removePokemon(pokemon.name)}>
                      <DeleteIcon />
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyPokeTeam}>
                  <HelpOutlineIcon fontSize="large" />
                  <p>Não há nenhum Pokémon no seu time.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
