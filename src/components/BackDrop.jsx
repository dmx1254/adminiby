/* @ts-nocheck */
/* eslint-disable */

import React from "react";

const BackDrop = ({ showPopup, closePopup }) => {
  return (
    showPopup && (
      <div className="backdrop" onClick={() => closePopup("", "")}></div>
    )
  );
};

export default BackDrop;
