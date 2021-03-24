import React from "react";
import { Grid, Input, Button } from "semantic-ui-react";

export default function ClothesSearchBar({
  activeInput,
  handleSearchInput,
  setActiveInput,
}) {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={15}>
          {activeInput && (
            <Input
              fluid
              style={{ marginLeft: 20, marginRight: 20 }}
              placeholder="SEARCH..."
              onChange={handleSearchInput}
            />
          )}
        </Grid.Column>
        <Grid.Column>
          <Button
            icon="search"
            size="big"
            style={{ backgroundColor: "white", color: "black" }}
            onClick={() => setActiveInput(!activeInput)}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
