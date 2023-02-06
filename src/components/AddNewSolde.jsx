/* @ts-nocheck */
/* eslint-disable */

import React, { useState, useEffect } from "react";

import axios from "axios";

import { BiSearch } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addOrderSolde } from "../features/soldesSlices";

const AddNewSolde = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearched, setUserSearched] = useState([]);
  const [userSearchedToggle, setUserSearchedToggle] = useState(false);

  const { soldes } = useSelector((state) => state.soldes);

  // console.log(soldes);

  const [userId, setUserId] = useState("");
  const [numSolde, setNumSolde] = useState("");
  const [solde, setSolde] = useState("");
  const [qte, setQte] = useState(1);
  const [pu, setPu] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("En cours");

  console.log(userSearched[0]);

  const { users } = useSelector((state) => state.user);

  const notifyErrorToSearchUser = () =>
    toast.error("Veuiller saisir des données valides");

  const notifyErrorToAddSoldeUser = () =>
    toast.error(
      "Veuiller remplir tous les champs avant de confirmer la commande"
    );

  const notifySuccessToAddSoldeOrder = (name) =>
    toast.success("Commande N° " + name + " à été ajouté avec succés");

  // console.log(users);

  const handleSearch = () => {
    if (!searchTerm) {
      notifyErrorToSearchUser();
    } else {
      setUserSearched(users.filter((user) => user.email === searchTerm));
      setUserSearchedToggle(true);
    }
  };

  const handleRemoveAddNewSolde = () => {
    setSearchTerm("");
    setUserSearchedToggle(false);
  };

  useEffect(() => {
    setUserId(userSearched[0]?._id);
  }, [userSearched]);

  // useEffect(() => {
  //   let searchPriceSolde = soldes.filter((sold) => (sold.solde = solde));
  //   console.log(searchPriceSolde);
  // }, [soldes, solde]);

  const handleSoldeChange = (e) => {
    setSolde(e.target.value);
    // if (solde) {
    //   // setPu(soldes.filter((sold) => (sold.solde = solde)).priceDh);
    //   let prix = soldes.filter((sold) => sold.solde === solde)[0]?.priceDh;
    //   setPu(prix);
    // } else {
    //   console.log("Can't calculate price with empty balance");
    // }
  };

  useEffect(() => {
    if (solde) {
      let prix = soldes.filter((sold) => sold.solde === solde)[0]?.priceDh;
      setPu(prix);
    }
  }, [soldes, solde]);

  const codeGenerated = () => {
    const generateRandomCode =
      "0123456789abcdefghijklmnopkrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let myCode = "";
    for (let i = 0; i < 7; i++) {
      let code = Math.floor(Math.random() * generateRandomCode.length);
      myCode += generateRandomCode[code];
    }
    return myCode;
  };

  useEffect(() => {
    setNumSolde(codeGenerated());
  }, []);

  useEffect(() => {
    setTotalPrice((qte * pu).toFixed(2));
  }, [qte, pu]);

  const handleAddSoldeOrder = (e) => {
    e.preventDefault();
    if (!userId || !solde || !qte || !pu || !paymentMethod || !numSolde) {
      notifyErrorToAddSoldeUser();
    } else {
      try {
        axios({
          method: "post",
          url: `${process.env.REACT_APP_CLIENT_URL}/soldeorder`,
          data: {
            userId,
            numSolde,
            solde,
            qte,
            pu,
            totalPrice,
            detailUser: userSearched[0],
            paymentMethod,
            status,
          },
        }).then((res) => {
          console.log(res?.data);
          dispatch(addOrderSolde(res?.data));
          notifySuccessToAddSoldeOrder(res?.data?.numSolde);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    userSearched[0]?.currency === "dhs"
      ? setPaymentMethod(
          "Banque: " +
            userSearched[0]?.dhsBank +
            " " +
            "Prénom de paie: " +
            userSearched[0]?.dhsBankLastname +
            " " +
            "Nom de paie: " +
            userSearched[0]?.dhsBankFirstname +
            " " +
            "Rib: " +
            userSearched[0]?.dhsRib
        )
      : userSearched[0]?.currency === "euro"
      ? userSearched[0]?.currencymethod === "skrill" ||
        userSearched[0]?.currencymethod === "paypal"
        ? setPaymentMethod(
            userSearched[0]?.currencymethod +
              " " +
              "Email de paie : " +
              userSearched[0]?.emailCurrencyEuro
          )
        : userSearched[0]?.currencymethod === "payeer"
        ? setPaymentMethod("Compte Payeer: " + userSearched[0]?.payeeraccount)
        : userSearched[0]?.currencymethod === "paylib"
        ? setPaymentMethod(
            "Prénom de paie paylib: " +
              userSearched[0]?.paylibcurencyLastname +
              " " +
              "Nom de paie paylib: " +
              userSearched[0]?.paylibcurencyFirstname +
              " " +
              "Tél de paie paylib: " +
              userSearched[0]?.paylibcurencyTel
          )
        : userSearched[0]?.currencymethod === "sepa"
        ? setPaymentMethod("IBAN " + userSearched[0]?.ibanCurrency)
        : ""
      : userSearched[0]?.currency === "usdt"
      ? userSearched[0]?.currencymethod === "binance pay"
        ? setPaymentMethod(
            "Email binance pay: " + userSearched[0]?.emailCurrencyEuro
          )
        : userSearched[0]?.currencymethod === "trc20"
        ? setPaymentMethod(
            "Adresse TRX trc20: " + userSearched[0]?.usdtAdressTrx
          )
        : ""
      : "";
  }, [userSearched]);

  return (
    <div className="addnewsolde">
      <div className="addnewsolde_infos_user">
        <div className="infos-user-search">
          <input
            type="text"
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="coller l'email de l'utilisateur"
          />
          <span className="search_addnewsolde" onClick={handleSearch}>
            <BiSearch />
          </span>
        </div>
        {userSearchedToggle && (
          <div className="infos_data_user">
            <div>
              <label htmlFor="">userId:</label>
              <span>{userSearched[0]?._id}</span>
            </div>
            <div>
              <label htmlFor="">Email:</label>
              <span>{userSearched[0]?.email}</span>
            </div>
            <div>
              <label htmlFor="">Prénom:</label>
              <span>{userSearched[0]?.lastname}</span>
            </div>
            <div>
              <label htmlFor="">Nom:</label>
              <span>{userSearched[0]?.firstname}</span>
            </div>
            <div>
              <label htmlFor="">Devise:</label>
              <span>{userSearched[0]?.currency}</span>
            </div>
            {/* <div>
              <label htmlFor="">Moyen de paie:</label>
              <span>{userSearched[0]?.currencymethod}</span>
            </div> */}
            <div>
              <label htmlFor="">Meth de paie:</label>
              <span>
                {" "}
                {userSearched[0]?.currencymethod}: <br />
                {userSearched[0]?.currency === "dhs" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // alignItems: "center",
                      marginLeft: "-105px",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <label htmlFor="">: {userSearched[0]?.dhsBank}</label>
                    <label htmlFor="">
                      Prénom de paie: {userSearched[0]?.dhsBankLastname}
                    </label>
                    <label htmlFor="">
                      Nom de paie: {userSearched[0]?.dhsBankFirstname}
                    </label>
                    <label htmlFor="">Rib: {userSearched[0]?.dhsRib}</label>
                  </div>
                ) : userSearched[0]?.currency === "euro" ? (
                  <div>
                    {userSearched[0]?.currencymethod === "skrill" ||
                    userSearched[0]?.currencymethod === "paypal" ? (
                      <label htmlFor="">
                        Email de paie: {userSearched[0]?.emailCurrencyEuro}
                      </label>
                    ) : userSearched[0]?.currencymethod === "payeer" ? (
                      <label>
                        Compte Payeer: {userSearched[0]?.payeeraccount}
                      </label>
                    ) : userSearched[0]?.currencymethod === "paylib" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          // alignItems: "center",
                          marginLeft: "-105px",
                          gap: "10px",
                        }}
                      >
                        <label htmlFor="">
                          Prénom de pai:{" "}
                          {userSearched[0]?.paylibcurencyLastname}
                        </label>
                        <label htmlFor="">
                          Nom de paie: {userSearched[0]?.paylibcurencyFirstname}
                        </label>
                        <label htmlFor="">
                          Tél de paie: {userSearched[0]?.paylibcurencyTel}
                        </label>
                        {/* <label htmlFor="">Rib: {userSearched[0]?.dhsRib}</label> */}
                      </div>
                    ) : userSearched[0]?.currencymethod === "sepa" ? (
                      <label htmlFor="">
                        IBAN: {userSearched[0]?.ibanCurrency}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                ) : // userSearched[0]?.emailCurrencyEuro
                userSearched[0]?.currency === "usdt" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // alignItems: "center",
                      marginLeft: "-105px",
                      gap: "10px",
                    }}
                  >
                    {userSearched[0]?.currencymethod === "binance pay" ? (
                      <label htmlFor="">
                        {" "}
                        Email de paie: {userSearched[0]?.emailCurrencyEuro}
                      </label>
                    ) : userSearched[0]?.currencymethod === "trc20" ? (
                      <label htmlFor="">
                        Adresse TRX: {userSearched[0]?.usdtAdressTrx}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
        )}
        {userSearchedToggle && (
          <button
            className="infos_data_user_close"
            onClick={handleRemoveAddNewSolde}
          >
            Fermer
          </button>
        )}
      </div>
      <form onSubmit={handleAddSoldeOrder} className="form_addnewsolde">
        <div>
          <div>
            <label htmlFor="">userId</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
            />
          </div>
          <div>
            <label htmlFor="">N° de commande</label>
            <input
              type="text"
              value={numSolde}
              onChange={(e) => setNumSolde(e.target.value)}
              placeholder="N° de commande"
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="">Nom de solde</label>
            <select value={solde} onChange={handleSoldeChange}>
              <option value="">Choisir le solde</option>
              {soldes?.map((solde) => (
                <option value={solde?.solde}>{solde?.solde}</option>
              ))}
            </select>
            {/* <input
              type="text"
              value={solde}
              onChange={(e) => setSolde(e.target.value)}
              placeholder="Nom de solde"
            /> */}
          </div>
          <div>
            <label htmlFor="">Quantité</label>
            <input
              type="number"
              value={qte}
              onChange={(e) => setQte(e.target.value)}
              placeholder="Quantité"
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="">Prix unitaire</label>
            <input
              type="number"
              value={pu}
              onChange={(e) => setPu(e.target.value)}
              placeholder="Prix unitaire"
            />
          </div>
          <div>
            <label htmlFor="">Total</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="Total"
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="">Méthode de paie</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Méthode de paie"
            />
          </div>
          <div>
            <label htmlFor="">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="En cours">En cours</option>
              <option value="Terminée">Terminée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>
        <input
          type="submit"
          value="Confirmer commande"
          className="btn-confirm-solde"
        />
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddNewSolde;
