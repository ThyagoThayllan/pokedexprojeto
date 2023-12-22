import styles from "./styles.module.css";
import imgLogin from "../../imgs/imgLogin.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { UsersTypes } from "../../routes";

type SignUpTypes = {
  users: UsersTypes[];
  changeUser: (user: UsersTypes) => void;
  getUsers: () => void;
};

export const SignUp = ({ users, getUsers, changeUser }: SignUpTypes) => {
  const [userExists, setUserExists] = useState(false);
  const [verifyPasswords, setVerifyPasswords] = useState(false);
  const [longerPassword, setLongerPassword] = useState(false);
  const [longerUsername, setLongerUsername] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const newUser = {
    username,
    password,
  };

  const navigate = useNavigate();

  const signUpUser = async (e: any) => {
    try {
      e.preventDefault();

      if (users.some((user) => user.username === newUser.username)) {
        return setUserExists(true);
      }
      if (username.length < 3 || username.length > 30) {
        return setLongerUsername(true);
      }
      if (password.length < 3 || password.length > 30) {
        return setLongerPassword(true);
      }
      if (confirmPassword !== password) {
        return setVerifyPasswords(true);
      }

      await axios
        .post("http://localhost:3000/users", newUser)
        .then((res) => console.log(res));

      changeUser(newUser);

      getUsers();
      setUserExists(false);
      setVerifyPasswords(false);
      setLongerPassword(false);
      setLongerUsername(false);

      navigate("/pokedex");
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.loginContainer}>
        <div className={styles.imgLoginDiv}>
          <div className={styles.overlayImgDiv}></div>
          <img src={imgLogin} />
        </div>
        <form className={styles.form} onSubmit={(e) => signUpUser(e)}>
          <h1>Crie sua conta</h1>
          <div className={styles.inputsContainer}>
            <div className={styles.inputDiv}>
              <label>Usuário:</label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                onChange={(e) => setUsername(e.target.value)}
              />
              {userExists && (
                <p className={styles.userExists}>Usuário já existe.</p>
              )}
              {longerUsername && (
                <p className={styles.longerUsername}>
                  Seu usuário deve ter entre 3 à 30 caracteres.
                </p>
              )}
            </div>
            <div className={styles.inputDiv}>
              <label>Senha:</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                onChange={(e) => setPassword(e.target.value)}
              />
              {longerPassword && (
                <p className={styles.longerPassword}>
                  Sua senha deve ter entre 3 à 30 caracteres.
                </p>
              )}
            </div>
            <div className={styles.inputDiv}>
              <label>Confirmar senha:</label>
              <input
                type="password"
                placeholder="Confirme sua senha"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {verifyPasswords && (
                <p className={styles.verifyPassword}>Verifique sua senha.</p>
              )}
            </div>
            <div className={styles.buttons}>
              <button className={styles.signUp} type="submit">
                Cadastrar
              </button>
              <button className={styles.signIn}>
                <Link to={"/"}>Entrar</Link>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
