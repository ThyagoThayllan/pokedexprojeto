import { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokemonType } from "../../App";
import styles from "./styles.module.css";
import { CircularProgress, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

type PokemonCardProps = Pokemon & {
  catchPokemon: (pokemonName: string) => void;
  pokemonTeam: PokemonType[];
};

export const PokemonCard = ({
  name,
  catchPokemon,
  pokemonTeam,
}: PokemonCardProps) => {
  const [pokemon, setPokemon] = useState<PokemonType>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [evolutions, setEvolutions] = useState<PokemonType[]>([]);

  const getPokemonInfo = async () => {
    try {
      await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((response) => setPokemon(response.data));
    } catch (error) {
      console.error();
    }
  };

  const getPokemonEvolution = async () => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    const data = await response.data.species.url;

    const speciesChain = await axios.get(data);
    const speciesChainDataURL = await speciesChain.data.evolution_chain.url;

    const evolutionChainAPI = await axios.get(speciesChainDataURL);
    const evolutionChainAPIData = await evolutionChainAPI.data.chain;

    if (evolutions.length === 0) {
      const evolutionOne = await evolutionChainAPIData.species.name;
      const responseEvolutionOne = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${evolutionOne}`
      );
      const dataEvolutionOne = await responseEvolutionOne.data;

      setEvolutions([...evolutions, dataEvolutionOne]);

      if (evolutions.length >= 0) {
        const evolutionTwo = await evolutionChainAPIData.evolves_to[0]?.species
          ?.name;
        const responseEvolutionTwo = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${evolutionTwo}`
        );
        const dataEvolutionTwo = await responseEvolutionTwo.data;

        setEvolutions([...evolutions, dataEvolutionOne, dataEvolutionTwo]);

        if (dataEvolutionTwo) {
          const evolutionThree = await evolutionChainAPIData.evolves_to[0]
            ?.evolves_to[0]?.species?.name;
          const responseEvolutionThree = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${evolutionThree}`
          );
          const dataEvolutionThree = await responseEvolutionThree.data;

          setEvolutions([
            ...evolutions,
            dataEvolutionOne,
            dataEvolutionTwo,
            dataEvolutionThree,
          ]);
        }
      }
    }
  };

  const putPokemonOnMyTeam = () => {
    if (
      pokemon &&
      !pokemonTeam.map((pokemon) => pokemon.name).includes(pokemon.name)
    ) {
      catchPokemon(pokemon.name);
    } else {
      alert(`${pokemon?.name.toUpperCase()} já adicionado!`);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getPokemonInfo();
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      {pokemon ? (
        <>
          <div className={styles.img}>
            <img
              src={
                pokemon?.sprites?.other?.dream_world?.front_default
                  ? pokemon?.sprites?.other?.dream_world?.front_default
                  : pokemon?.sprites?.front_default
              }
              alt="Imagem do Pokemon"
            />
          </div>
          <div className={styles.nameAndButton}>
            <h1>{name}</h1>
            <div className={styles.buttons}>
              <button
                onClick={() => {
                  setIsDialogOpen(!isDialogOpen);
                  getPokemonEvolution();
                }}
                className={styles.button}
              >
                Evoluções
              </button>

              <button className={styles.add} onClick={putPokemonOnMyTeam}>
                <AddIcon sx={{ color: "var(--gray1)" }} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <CircularProgress />
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(!isDialogOpen)}
        sx={{ minHeight: "600px" }}
      >
        <div className={styles.pokemonContainer}>
          <button
            onClick={() => setIsDialogOpen(!isDialogOpen)}
            className={styles.closeDialog}
          >
            <CloseIcon fontSize="large" />
          </button>
          <div className={styles.imgAndName}>
            <h1>{pokemon?.name}</h1>
            <div className={styles.pokemonImg}>
              <img
                src={
                  pokemon?.sprites?.other?.dream_world?.front_default
                    ? pokemon?.sprites?.other?.dream_world?.front_default
                    : pokemon?.sprites?.front_default
                }
                alt={`Imagem de ${pokemon?.name}`}
              />
            </div>
          </div>
          <div className={styles.evolutions}>
            <h2>Evoluções:</h2>
            <div className={styles.evolutionsDiv}>
              {evolutions.length > 0 ? (
                evolutions.map((evolution) => (
                  <div className={styles.evolutionDiv} key={evolution.id}>
                    <div className={styles.evolutionImg}>
                      <img
                        src={
                          evolution?.sprites?.other?.dream_world?.front_default
                            ? evolution?.sprites?.other?.dream_world
                                ?.front_default
                            : evolution?.sprites?.front_default
                        }
                        alt={`Imagem de ${evolution?.name}`}
                      />
                    </div>
                    <h3>{evolution?.name}</h3>
                  </div>
                ))
              ) : (
                <CircularProgress />
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
