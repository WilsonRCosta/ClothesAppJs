import { Dropdown } from 'semantic-ui-react'

export default function ClothesSortDropdown({handleSortByProp}) {
    return (
        <Dropdown
            style={{ marginRight: 40, float: "right" }}
            placeholder="Sort By"
            item
          >
            <Dropdown.Menu>
              <Dropdown.Item
                content={"Sales"}
                onClick={() => handleSortByProp("discount")}
              />
              <Dropdown.Item
                content={"Price"}
                onClick={() => handleSortByProp("price")}
              />
            </Dropdown.Menu>
          </Dropdown>
    )
}