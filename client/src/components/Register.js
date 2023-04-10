import React, { useState, useContext } from "react";
import { Button, Form, Grid, Input } from "semantic-ui-react";
import { useSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import clothesService from "../service/serviceAPI";
import NavBar from "./navbar/NavBar";
export default function Register() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [email, setEmail] = useState();
  const [name, setUsername] = useState();
  const [password, setPassword] = useState();
  const [repeat_password, setRepeatPass] = useState();
  const { userProvider, tokenProvider } = useContext(UserContext);
  const [user, setUser] = userProvider;
  const [token, setToken] = tokenProvider;

  const styles = {
    noBorder: { borderRadius: 0 },
    grid: { padding: 30, textAlign: "center" },
    alignLeft: { textAlign: "left" },
  };

  // false - login, true - signup
  const [registryType, toggleRegistry] = useState(false);

  const setUserInfo = (resp) => {
    setUser(resp.user);
    setToken(resp.token);
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(resp.msg, { variant: resp.type });
    if (resp.type === "success") history.push("/");
  };

  const handleLoginClick = () =>
    clothesService().loginUser({ name, password }).then(setUserInfo);

  const handleSignupClick = () => {
    clothesService()
      .registerUser({
        email,
        name,
        password,
        repeat_password,
      })
      .then(setUserInfo);
  };

  const handleToggleRegistryClick = () => toggleRegistry(!registryType);

  return (
    <>
      <br />
      <NavBar />
      <br />
      <br />
      <h1>Register</h1>
      <Grid centered columns={2} style={styles.grid} verticalAlign="middle">
        <Grid.Column width={5}>
          {!registryType ? (
            <Form style={styles.alignLeft}>
              <Form.Field>
                <label>Username</label>
                <Input
                  icon="user"
                  iconPosition="left"
                  onChange={(e, { value }) => setUsername(value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Input
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  onChange={(e, { value }) => setPassword(value)}
                />
              </Form.Field>
              <Form.Field as={Link}>Forgot password?</Form.Field>
              <br />
              <br />
              <Button
                content="Login"
                color="black"
                style={styles.noBorder}
                onClick={handleLoginClick}
              />
            </Form>
          ) : (
            <Button
              content="Login"
              color="black"
              style={styles.noBorder}
              size="big"
              onClick={handleToggleRegistryClick}
            />
          )}
        </Grid.Column>
        <Grid.Column width={5}>
          {registryType ? (
            <Form style={styles.alignLeft}>
              <Form.Field>
                <label>Email</label>
                <Input
                  icon="mail"
                  iconPosition="left"
                  onChange={(e, { value }) => setEmail(value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Username</label>
                <Input
                  icon="user"
                  iconPosition="left"
                  onChange={(e, { value }) => setUsername(value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Input
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  onChange={(e, { value }) => setPassword(value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Repeat Password</label>
                <Input
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  onChange={(e, { value }) => setRepeatPass(value)}
                />
              </Form.Field>
              <br />
              <br />
              <Button
                content="Signup"
                color="black"
                style={styles.noBorder}
                onClick={handleSignupClick}
              />
            </Form>
          ) : (
            <Button
              content="Signup"
              color="black"
              style={styles.noBorder}
              size="big"
              onClick={handleToggleRegistryClick}
            />
          )}
        </Grid.Column>
      </Grid>
    </>
  );
}
