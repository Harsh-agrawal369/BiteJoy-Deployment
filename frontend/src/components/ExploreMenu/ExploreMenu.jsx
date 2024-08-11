import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our Delicacies</h1>
      <p className="explore-menu-text">
        Order from a wide menu of your favorite dishes, expertly prepared by top
        chefs and delivered with joy to your doorstep. Experience the
        convenience of having restaurant-quality meals in the comfort of your
        own home.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory(prev=>prev === item.menu_name ? "All" : item.menu_name)
              }
              key={index}
              className="exlore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active1" : ""}
                src={item.menu_image}
                alt=""
              />{" "}
              {/* Using dynamic classname */}
              <p className="item-name">{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
