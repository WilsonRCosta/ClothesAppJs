import { Menu, Label, Button } from "semantic-ui-react";

export default function ClothesMenu({
  activeType,
  activeBrand,
  brands,
  types,
  setActiveType,
  setActiveBrand,
}) {

  return (
    <>
      {(activeType || activeBrand) && (
        <Button
          basic
          content={"Clear All"}
          style={{ verticalAlign: "middle" }}
          icon="delete"
          size="tiny"
          onClick={() => {
            setActiveType(null);
            setActiveBrand(null);
          }}
        />
      )}
      {activeType && (
        <Label
          size="mini"
          color="black"
          content={activeType.charAt(0).toUpperCase() + activeType.slice(1)}
        />
      )}
      {activeBrand && <Label color="green" size="mini" content={activeBrand} />}
      <Menu fluid vertical tabular>
        {types.map((type) => (
          <Menu.Item
            key={type}
            name={type}
            active={activeType === type}
            onClick={() => setActiveType(type)}
          />
        ))}
      </Menu>
      <Menu fluid vertical tabular>
        {brands.map((brand) => (
          <Menu.Item
            key={brand}
            name={brand}
            active={activeBrand === brand}
            onClick={() => setActiveBrand(brand)}
          />
        ))}
      </Menu>
    </>
  );
}
