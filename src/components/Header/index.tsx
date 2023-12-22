import styles from "./styles.module.css";
import pokebola from "../../imgs/pokebola.png";
import pokemonLogo from "../../imgs/pokemon.png";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { UsersTypes } from "../../routes";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  getPokemonByType: (type: string) => void;
  searchPokemonByName: (name: string) => void;
  user: UsersTypes;
  changeUser: (user: UsersTypes) => void;
};

export const Header = ({
  getPokemonByType,
  searchPokemonByName,
  user,
  changeUser,
}: HeaderProps) => {
  const clearUser: UsersTypes = {
    username: "",
    password: "",
  };

  const navigate = useNavigate();

  const [nameToSearch, setNameToSearch] = useState("");

  const searchPokemon = (e: any) => {
    e.preventDefault();

    searchPokemonByName(nameToSearch);

    setNameToSearch("");
  };

  const leavePokedex = () => {
    navigate("/");

    changeUser(clearUser);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={pokebola} className={styles.pokebola} alt="Pokebola" />
        <img
          src={pokemonLogo}
          className={styles.pokebolaLogo}
          alt="Pokemon Logo"
        />
      </div>

      <form action="" className={styles.form}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Digite o nome do Pokémon"
            onChange={(e) => setNameToSearch(e.target.value)}
            value={nameToSearch}
          />
          <button onClick={searchPokemon}>
            <Search sx={{ color: "var(--gray3)" }} />
          </button>
        </div>
        <select
          name="pokemon"
          onChange={(e) => getPokemonByType(e.target.value)}
        >
          <option value="all">Tipo</option>
          <option value="normal">Normal</option>
          <option value="fighting">Luta</option>
          <option value="flying">Voador</option>
          <option value="poison">Tóxico</option>
          <option value="ground">Terra</option>
          <option value="rock">Pedra</option>
          <option value="bug">Besouro</option>
          <option value="ghost">Fantasma</option>
          <option value="steel">Ferro</option>
          <option value="fire">Fogo</option>
          <option value="water">Água</option>
          <option value="grass">Grama</option>
          <option value="electric">Elétrico</option>
          <option value="psychic">Pisíquico</option>
          <option value="ice">Gelo</option>
          <option value="dragon">Dragão</option>
          <option value="dark">Sombrio</option>
          <option value="fairy">Fada</option>
        </select>
      </form>

      <div className={styles.userDiv}>
        <PersonIcon />
        <h2>{user.username ? user.username : "Usuário"}</h2>
        <button className={styles.logout} onClick={leavePokedex}>
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};
