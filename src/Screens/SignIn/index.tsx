import styles from "./styles.module.css";
import imgLogin from "../../imgs/imgLogin.jpg";
import { Link, useNavigate } from "react-router-dom";
import { UsersTypes } from "../../routes";
import { useEffect, useState } from "react";

type SignInTypes = {
  users: UsersTypes[];
  changeUser: (user: UsersTypes) => void;
  getUsers: () => void;
};

export const SignIn = ({ users, getUsers, changeUser }: SignInTypes) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [checkUsernameAndPassword, setCheckUsernameAndPassword] =
    useState(false);

  const myAccount = {
    username,
    password,
  };

  const signIn = async (e: any) => {
    try {
      e.preventDefault();

      if (
        users.some(
          (user) =>
            user.username === myAccount.username &&
            user.password === myAccount.password
        )
      ) {
        changeUser(myAccount);
        setCheckUsernameAndPassword(false);
        navigate("/pokedex");
        return;
      }

      setCheckUsernameAndPassword(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.loginContainer}>
        <div className={styles.imgLoginDiv}>
          <div className={styles.overlayImgDiv}></div>
          <img src={imgLogin} />
        </div>
        <form className={styles.form} onSubmit={signIn}>
          <h1>Login</h1>
          <div className={styles.inputsContainer}>
            <div className={styles.inputDiv}>
              <label>Usuário:</label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputDiv}>
              <label>Senha:</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                onChange={(e) => setPassword(e.target.value)}
              />
              {checkUsernameAndPassword && (
                <p className={styles.wrongLogin}>
                  Verifique seu usuário e senha.
                </p>
              )}
            </div>
            <div className={styles.buttons}>
              <button className={styles.signIn} type="submit">
                Entrar
              </button>
              <button className={styles.signUp} type="submit">
                <Link to={"/signup"}>Criar conta</Link>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
