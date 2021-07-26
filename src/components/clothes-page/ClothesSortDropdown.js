import { Dropdown } from "semantic-ui-react";

export default function ClothesSortDropdown({
  handleSortByPrice,
  handleSortBySales,
}) {
  return (
    <Dropdown
      style={{ marginRight: 40, float: "right" }}
      placeholder="Sort By"
      item
    >
      <Dropdown.Menu>
        <Dropdown.Item content={"Sales"} onClick={handleSortBySales} />
        <Dropdown.Item content={"Price"} onClick={handleSortByPrice} />
      </Dropdown.Menu>
    </Dropdown>
  );
}
