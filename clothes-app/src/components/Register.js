import React, { useState } from "react";
import { Button, Form, Grid, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { service } from "../auth";
import NavBar from "./NavBar";

export default function Register() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [registryType, toggleRegistry] = useState(false); // false - login, true - signup

  const handleLoginClick = () => service().login(username, password);

  const handleSignupClick = () => service().signup(username, password);

  const handleToggleRegistryClick = () => toggleRegistry(!registryType);

  return (
    <div>
      <br />
      <NavBar />
      <br />
      <br />
      <h1>Register</h1>
        <Grid centered columns={2} style={{padding:30, textAlign:'center'}} verticalAlign="middle">
          <Grid.Column width={5}>
            {!registryType ? (
              <Form style={{ textAlign: "left" }}>
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
                  style={{ borderRadius: 0 }}
                  onClick={handleLoginClick}
                />
              </Form>
            ) : (
              <Button
                content="Login"
                color="black"
                style={{ borderRadius: 0 }}
                size="big"
                onClick={handleToggleRegistryClick}
              />
            )}
          </Grid.Column>
          <Grid.Column width={5}>
            {registryType ? (
              <Form style={{ textAlign: "left" }}>
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
                <br />
                <br />
                <Button
                  content="Signup"
                  color="black"
                  style={{ borderRadius: 0 }}
                  onClick={handleSignupClick}
                />
              </Form>
            ) : (
              <Button
                content="Signup"
                color="black"
                style={{ borderRadius: 0 }}
                size="big"
                onClick={handleToggleRegistryClick}
              />
            )}
          </Grid.Column>
        </Grid>
    </div>
  );
}
