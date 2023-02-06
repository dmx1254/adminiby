/* @ts-nocheck */
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import axios from "axios";

import { useSelector } from "react-redux";

import { Sidebar, ThemeSettings } from "./components";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Orders, Employees } from "./pages";
import "./App.css";

import { useStateContext } from "./contexts/ContextProvider";
import SignIn from "./pages/SignIn";
import Servers from "./pages/Servers";
import AddNewServer from "./components/AddNewServer";
import Clients from "./pages/Clients";
import ProfilDetails from "./pages/ProfilDetails";
import Echanges from "./pages/Echanges";
import Balances from "./pages/Balances";
import AddNewSolde from "./components/AddNewSolde";
import AddNewDofusOrder from "./components/AddNewDofusOrder";
import SendSms from "./components/SendSms";
import BackDrop from "./components/BackDrop";

const App = () => {
  const { user } = useSelector((state) => state.user);
  const [userId, setUserId] = useState(user?.user);
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const [showPopup, setShowPopup] = useState(false);
  const [info, setInfo] = useState({});
  const [idPopupUser, setIdPopupUser] = useState("");

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const closePopup = (id, state) => {
    console.log(id, state);
    if (id && state) {
      setIdPopupUser(id);
      setShowPopup(state);
    } else {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    try {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_CLIENT_URL}/users/${idPopupUser}`,
      }).then((res) => {
        console.log(res?.data);
        setInfo(res?.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [idPopupUser]);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            {userId && user?.person?.isAdmin && (
              <TooltipComponent content="Paramètres" position="Top">
                <button
                  type="button"
                  onClick={() => setThemeSettings(true)}
                  style={{ background: currentColor, borderRadius: "50%" }}
                  className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            )}
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              {userId && user?.person?.isAdmin && <Sidebar />}
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              {userId && user?.person?.isAdmin && <Sidebar />}
            </div>
          )}
          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full"
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2"
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              {userId && user?.person?.isAdmin && <Navbar />}
              <BackDrop showPopup={showPopup} closePopup={closePopup} />
            </div>
            <div>
              {themeSettings && <ThemeSettings />}

              <Routes>
                {/* dashboard  */}
                <Route
                  path="/"
                  element={
                    userId && user?.person?.isAdmin ? <Servers /> : <SignIn />
                  }
                />
                <Route path="/signin" element={<SignIn />} />

                {/* pages  */}

                <Route
                  path="/servers"
                  element={
                    userId && user?.person?.isAdmin ? <Servers /> : <SignIn />
                  }
                />

                <Route
                  path="/send-sms"
                  element={
                    userId && user?.person?.isAdmin ? <SendSms /> : <SignIn />
                  }
                />

                <Route
                  path="/addnewserver"
                  element={
                    userId && user?.person?.isAdmin ? (
                      <AddNewServer />
                    ) : (
                      <SignIn />
                    )
                  }
                />

                <Route
                  path="/gc"
                  element={
                    userId && user?.person?.isAdmin ? <Employees /> : <SignIn />
                  }
                />

                <Route
                  path="/clients"
                  element={
                    userId && user?.person?.isAdmin ? (
                      <Clients
                        showPopup={showPopup}
                        closePopup={closePopup}
                        info={info}
                      />
                    ) : (
                      <SignIn />
                    )
                  }
                />

                <Route
                  path="/soldes"
                  element={
                    userId && user?.person?.isAdmin ? <Balances /> : <SignIn />
                  }
                />

                <Route
                  path="/addnewsolde"
                  element={
                    userId && user?.person?.isAdmin ? (
                      <AddNewSolde />
                    ) : (
                      <SignIn />
                    )
                  }
                />

                {/* apps  */}

                <Route
                  path="/profil/:profilId"
                  element={
                    userId && user?.person?.isAdmin ? (
                      <ProfilDetails />
                    ) : (
                      <SignIn />
                    )
                  }
                />
                <Route
                  path="/addnewdofusorder/:dofusId"
                  element={
                    userId && user?.person?.isAdmin ? (
                      <AddNewDofusOrder />
                    ) : (
                      <SignIn />
                    )
                  }
                />

                <Route
                  path="/echanges"
                  element={
                    userId && user?.person?.isAdmin ? <Echanges /> : <SignIn />
                  }
                />

                <Route
                  path="/commandes"
                  element={
                    userId && user?.person?.isAdmin ? <Orders /> : <SignIn />
                  }
                />

                {/* charts  */}
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
