import { Dropdown } from 'semantic-ui-react'


export default function SortProducts({handleSortByProp}) {
    return (
        <Dropdown
            style={{ marginRight: 40, float: "right" }}
            placeholder="Sort By"
            item
          >
            <Dropdown.Menu>
              <Dropdown.Item
                content={"Code"}
                onClick={() => handleSortByProp("code")}
              />
              <Dropdown.Item
                content={"Name"}
                onClick={() => handleSortByProp("name")}
              />
              <Dropdown.Item
                content={"Genre"}
                onClick={() => handleSortByProp("genre")}
              />
              <Dropdown.Item
                content={"Brand"}
                onClick={() => handleSortByProp("brand")}
              />
              <Dropdown.Item
                content={"Type"}
                onClick={() => handleSortByProp("type")}
              />
              <Dropdown.Item
                content={"Price"}
                onClick={() => handleSortByProp("price")}
              />
            </Dropdown.Menu>
          </Dropdown>
    )
}