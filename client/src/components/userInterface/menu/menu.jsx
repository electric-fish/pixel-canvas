import React, { Suspense, lazy } from 'react';
import styles from "./menu.css";

const Menu = (props) => {

  const ItemList = props.canvasList.map((item) => {
    console.log(item.title);
    <option value={item._id}>{item.title}a</option>
  });

  return (
    <div className={styles.menu_container}>
      <form>
        <select className={styles.form_style} onChange={props.selectCanvas}>
          <option value="0">Terra Terminal</option>
          <option value="1">Void Station</option>
        </select>
      </form>
    </div>
  );
};

export default Menu;