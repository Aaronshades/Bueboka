import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import Layout from "../../components/common/layout/Layout";
import { UserContext } from "../../helpers/StateProvider";
import { googleLogin, facebookLogin } from "../../auth";
import styles from "./Login.module.css";

const Login = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.displayName) {
      navigate("/user");
    }
  }, [navigate, user]);

  return (
    <Layout>
      <div className={styles.welcomeContainer}>
        <h2>Velkommen!</h2>
        <p>Med denne tjenesten kan du enkelt:</p>
        <ul className={styles.list}>
          <li>oppdatere din profil med skytternr. og data om ditt utstyr</li>
          <li>legge inn mål fra skytting og få beregnet siktemål</li>
        </ul>
        <div className={styles.loginContainer}>
          <Button onClick={facebookLogin}>Logg in med Facebook</Button>
          <Button onClick={googleLogin}>Logg in med Google</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
