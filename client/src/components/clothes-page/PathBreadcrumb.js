import React from "react";
import { Breadcrumb } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function PathBreadcrumb({ activeType, genre, code }) {
  return (
    <Breadcrumb size="small" style={{ marginLeft: 20, float: "left" }}>
      <Breadcrumb.Section as={Link} to="/">
        Home
      </Breadcrumb.Section>
      <Breadcrumb.Divider />
      {genre ? (
        <Breadcrumb.Section active as={Link} to={`/clothes/${genre}`}>
          {genre.charAt(0).toUpperCase() + genre.substring(1)}
        </Breadcrumb.Section>
      ) : (
        <Breadcrumb.Section active as={Link} to="/clothes/sales">
          Sales
        </Breadcrumb.Section>
      )}
      {code && (
        <>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{code}</Breadcrumb.Section>
        </>
      )}
      {activeType && (
        <>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{activeType.slice(0,1).toUpperCase() + activeType.substring(1)}</Breadcrumb.Section>
        </>
      )}
    </Breadcrumb>
  );
}
