/* @ts-nocheck */
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BiAddToQueue, BiDotsHorizontalRounded } from "react-icons/bi";

import { BsCheckLg } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

import { updateSolde } from "../features/soldesSlices";

import { Header } from "../components";

import { RiDeleteBin6Line } from "react-icons/ri";
import { RiFileEditLine } from "react-icons/ri";
import { RiEyeFill } from "react-icons/ri";
import axios from "axios";

import {
  updateHistorySolde,
  deleteSoldeHistory,
  addNewSolde,
  getSoldeHistory,
} from "../features/dataSoldeSlice";

import { deleteSolde, getSolde } from "../features/soldesSlices";

const Balances = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { soldeData } = useSelector((state) => state.solde);

  // console.log(soldeData);

  const { soldes } = useSelector((state) => state.soldes);

  // console.log(soldeData);

  const notifySuccessUpadteSolde = () =>
    toast.success("Status du solde mis à avec succés");

  const notifySuccessUpadteSoldeHistory = () =>
    toast.success("Solde mis à jour avec succés");

  const notifySuccessAddNeWSoldeSoldeHistory = (name) =>
    toast.success("Solde " + name + " ajouté avec succés");

  const notifySuccessDeleteSoldeHistory = (name) =>
    toast.success("Solde " + name + " supprimé avec succés");

  //   const [dataOrder, setDataOrder] = useState(soldeData);
  //   const [totalPrice, setTotalPrice] = useState(0);

  const [editIdSolde, setEditIdSolde] = useState(null);
  const [status, setStatus] = useState("");

  const [totalSolde, setTotalSolde] = useState(0);

  const [soldeHistoryId, setSoldeHistoryId] = useState("");

  const [priceDh, setPriceDh] = useState(0);
  const [soldeStatus, setSoldeStatus] = useState();

  const [toggleSub, setToggleSub] = useState(false);

  const [openSolde, setOpenSolde] = useState(false);

  const [sold, setSold] = useState("");
  const [priceD, setPriceD] = useState(null);
  const [stat, setStat] = useState("");
  const [idToTry, setIdToTry] = useState(null);

  //   console.log(priceDh);
  //   console.log(soldeStatus);

  //   useEffect(() => {
  //     if (dataOrder.length === 1) {
  //       setTotalPrice(dataOrder[0]?.totalPrice);
  //     } else if (dataOrder.length > 1) {
  //       let total = 0;
  //       for (let i = 0; i < dataOrder.length; i++) {
  //         total += dataOrder[i]?.totalPrice;
  //       }
  //       setTotalPrice(total);
  //     } else {
  //       setTotalPrice(0);
  //     }
  //   }, [dataOrder]);

  const handleBasculeToggle = (idToSub) => {
    setIdToTry(idToSub);
    setToggleSub((prevToggleSub) => !prevToggleSub);
  };

  const handleToggleOpenSolde = () => {
    setOpenSolde((prevOpenSolde) => !prevOpenSolde);
  };

  const handleEdit = (idToEdit) => {
    setEditIdSolde(idToEdit);
  };

  const handleCancelEditBalance = () => {
    setEditIdSolde(null);
  };

  const handleEditHistory = (soldeIdToEdit) => {
    setSoldeHistoryId(soldeIdToEdit);
    let dataSolde = soldes.filter((solde) => solde?._id === soldeIdToEdit);
    setPriceDh(dataSolde[0]?.priceDh);
    setSoldeStatus(dataSolde[0]?.status);
  };

  const handleCancelEditHistoryBalance = () => {
    setSoldeHistoryId(null);
  };

  useEffect(() => {
    const getSoldes = async () => {
      await axios
        .get(`${process.env.REACT_APP_CLIENT_URL}/soldeorder`)
        .then((res) => dispatch(getSolde(res?.data)));
    };
    getSoldes();
  }, [dispatch]);

  useEffect(() => {
    const getSoldes = async () => {
      await axios
        .get(`${process.env.REACT_APP_CLIENT_URL}/solde`)
        .then((res) => {
          console.log(res?.data);
          dispatch(getSoldeHistory(res?.data));
        });
    };
    getSoldes();
  }, [dispatch]);

  const handleUpdateBalance = (idToUpdate) => {
    try {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_CLIENT_URL}/soldeorder/${idToUpdate}`,
        data: {
          status,
        },
      }).then((res) => {
        dispatch(updateSolde(res?.data));
        notifySuccessUpadteSolde();
        setEditIdSolde(null);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateHistorySolde = (idSoldeHistory) => {
    try {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_CLIENT_URL}/solde/${idSoldeHistory}`,
        data: {
          priceDh,
          status: soldeStatus,
        },
      }).then((res) => {
        dispatch(updateHistorySolde(res?.data));
        notifySuccessUpadteSoldeHistory();
        setSoldeHistoryId(null);
      });
    } catch (error) {}
  };

  const handleDeleteHistorySolde = (soldeIdToDelete) => {
    try {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_CLIENT_URL}/solde/${soldeIdToDelete}`,
      }).then((res) => {
        dispatch(deleteSoldeHistory({ id: res?.data._id }));
        notifySuccessDeleteSoldeHistory(res?.data?.solde);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewSoldeBalance = () => {
    try {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_CLIENT_URL}/solde`,
        data: {
          solde: sold,
          priceDh: priceD,
          status: stat,
        },
      }).then((res) => {
        dispatch(addNewSolde(res?.data));
        notifySuccessAddNeWSoldeSoldeHistory(res?.data?.solde);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const convertDate = (date) => {
    const dateConverted = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return dateConverted;
  };

  const convertDateAndAddDay = (date) => {
    const myDate = new Date(date);
    const day = myDate.getDay();
    myDate.setDate(day === 6 ? myDate.getDate() + 2 : myDate.getDate() + 1);
    const dateConverted = new Date(myDate).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return dateConverted;
  };

  const handleDeleteSingleSolde = (idSoldeToDelete) => {
    try {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_CLIENT_URL}/soldeorder/${idSoldeToDelete}`,
      }).then((res) => {
        dispatch(deleteSolde({ id: res?.data?._id }));
        notifySuccessDeleteSoldeHistory(res?.data?.solde);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReduce = (chaine) => {
    if (!toggleSub && chaine) {
      return chaine.substring(0, 20);
    } else {
      return chaine;
    }
  };

  return (
    <div className="balance-container">
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 shadow-2xl bg-white rounded-3xl dark:bg-secondary-dark-bg balance">
        <div className="mb-2">
          <Header category="Devise" title="Soldes" />
          <Link to="/addnewsolde">
            <div className="balance-next-add">
              <span className="balance-add">
                {" "}
                <BiAddToQueue />
              </span>
              <span className="servers-add-text">Ajouter une commande</span>
            </div>
          </Link>
        </div>
        <div class="table_responsive">
          <table>
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Solde</th>
                <th>Qté</th>
                <th>PU</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Date de paie</th>
                {/* <th>Méth de paie</th> */}
                <th>Devise</th>
                <th>Meth de paie</th>
                <th>Banque de paie</th>
                <th>Rib</th>
                <th>Prénom Virement</th>
                <th>Nom Virement</th>
                <th>Prénom Paylib</th>
                <th>Nom Paylib</th>
                <th>Numéro Paylib</th>
                <th>Compte Payeer</th>
                <th>IBAN</th>
                <th>Email de paie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {soldeData?.map((order) => (
                <tr key={order.id}>
                  <td>{order.numSolde}</td>
                  <td
                    className={
                      order.solde === "euro"
                        ? "dofuskamas"
                        : order.solde === "USDT"
                        ? "dofustouch"
                        : order.solde === "Skrill"
                        ? "dofusSkrill"
                        : order.solde === "Skrill Moneybookers (EURO)"
                        ? "dofusMoney"
                        : "dofusretro"
                    }
                  >
                    {order.solde}
                  </td>
                  <td>{order.qte}</td>
                  <td>{order.pu}</td>
                  <td>{order.totalPrice}</td>

                  {editIdSolde === order?._id ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="balance-select"
                    >
                      <option value="En cours">En cours</option>
                      <option value="Terminée">Terminée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  ) : (
                    <td
                      className={
                        order.status === "Terminée"
                          ? "success"
                          : order.status === "Annulée"
                          ? "no-success"
                          : order.status === "En cours"
                          ? "pending"
                          : "no-pending"
                      }
                    >
                      {order.status}
                    </td>
                  )}

                  <td>{convertDate(order.createdAt)}</td>
                  <td>{convertDateAndAddDay(order.createdAt)}</td>
                  {/* <td>
                      <div className="info_payment_methods">
                        <span>{handleReduce(order?.paymentMethod)}</span>
                        <span
                          className="info_dot"
                          onClick={() => handleBasculeToggle(order?._id)}
                        >
                          <BiDotsHorizontalRounded />
                        </span>
                      </div>
                    </td> */}
                  <td
                    className={
                      order?.detailUser?.currency ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.currency}
                  </td>
                  <td
                    className={
                      order?.detailUser?.currencymethod ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.currencymethod}
                  </td>
                  <td
                    className={order?.detailUser?.dhsBank ? "pas-vide" : "vide"}
                  >
                    {order?.detailUser?.dhsBank}
                  </td>
                  <td
                    className={order?.detailUser?.dhsRib ? "pas-vide" : "vide"}
                  >
                    {order?.detailUser?.dhsRib}
                  </td>
                  <td
                    className={
                      order?.detailUser?.dhsBankLastname ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.dhsBankLastname}
                  </td>
                  <td
                    className={
                      order?.detailUser?.dhsBankFirstname ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.dhsBankFirstname}
                  </td>
                  <td
                    className={
                      order?.detailUser?.paylibcurencyLastname
                        ? "pas-vide"
                        : "vide"
                    }
                  >
                    {order?.detailUser?.paylibcurencyLastname}
                  </td>
                  <td
                    className={
                      order?.detailUser?.paylibcurencyFirstname
                        ? "pas-vide"
                        : "vide"
                    }
                  >
                    {order?.detailUser?.paylibcurencyFirstname}
                  </td>
                  <td
                    className={
                      order?.detailUser?.paylibcurencyTel ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.paylibcurencyTel}
                  </td>
                  <td
                    className={
                      order?.detailUser?.payeeraccount ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.payeeraccount}
                  </td>
                  <td
                    className={
                      order?.detailUser?.ibanCurrency ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.ibanCurrency}
                  </td>
                  <td
                    className={
                      order?.detailUser?.emailCurrencyEuro ? "pas-vide" : "vide"
                    }
                  >
                    {order?.detailUser?.emailCurrencyEuro}
                  </td>
                  <td>
                    {editIdSolde === order?._id ? (
                      <div className="balance-cancel">
                        <span
                          className="servers-update-rate"
                          onClick={() => handleUpdateBalance(order?._id)}
                        >
                          <BsCheckLg />
                        </span>
                        <span
                          className="servers-cancel-rate"
                          onClick={handleCancelEditBalance}
                        >
                          <MdCancel />
                        </span>
                      </div>
                    ) : (
                      <div className="action_btn">
                        <span
                          className="servers-delete"
                          onClick={() => handleDeleteSingleSolde(order?._id)}
                        >
                          <RiDeleteBin6Line />
                        </span>
                        <Link
                          className="balance-user"
                          to={`/profil/${order?.userId}`}
                          style={{
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <span className="balance-view">
                            <RiEyeFill />
                          </span>
                        </Link>
                        <span
                          className="servers-edit"
                          onClick={() => handleEdit(order?._id)}
                        >
                          <RiFileEditLine />
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="solde-buy-thisday">
          <span className="solde-buy-thisday-text">
            Solde achetés aujourd'hui:
          </span>
          <span className="solde-buy-thisday-text-amount">
            {totalSolde.toFixed(2)} dhs
          </span>
        </div> */}
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 shadow-2xl bg-white rounded-3xl dark:bg-secondary-dark-bg solde-hist">
        <div className="mb-2">
          <Header category="Solde" title="Historique des soldes" />
          {/* <Link to="/createnewsolde"> */}
          <div
            className="balance-next-add"
            onClick={handleToggleOpenSolde}
            style={{
              cursor: "pointer",
            }}
          >
            <span className="balance-add">
              {" "}
              <BiAddToQueue />
            </span>
            <span className="servers-add-text">Ajouter un solde</span>
          </div>
          {/* </Link> */}
        </div>
        <div class="table_responsive">
          <table>
            <thead>
              <tr>
                <th>Solde</th>
                <th>Prix(Dh)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {soldes?.map((solde) => (
                <tr key={solde?._id}>
                  <td>{solde?.solde}</td>
                  {soldeHistoryId === solde?._id ? (
                    <td>
                      <input
                        type="number"
                        value={priceDh}
                        className="bal-input-update"
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                        onChange={(e) => setPriceDh(e.target.value)}
                      />
                    </td>
                  ) : (
                    <td>{solde?.priceDh}</td>
                  )}

                  {soldeHistoryId === solde?._id ? (
                    <td>
                      <select
                        className="select-update-solde"
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                        value={soldeStatus}
                        onChange={(e) => setSoldeStatus(e.target.value)}
                      >
                        <option value="Vendre rapidement">
                          Vendre rapidement
                        </option>
                        <option value="Stock complet">Stock complet</option>
                      </select>
                    </td>
                  ) : (
                    <td
                      className={
                        solde.status === "Vendre rapidement"
                          ? "success"
                          : "no-success"
                      }
                    >
                      {solde?.status}
                    </td>
                  )}

                  <td>
                    {soldeHistoryId === solde?._id ? (
                      <div className="balance-cancel">
                        <span
                          className="servers-update-rate"
                          onClick={() => handleUpdateHistorySolde(solde?._id)}
                        >
                          <BsCheckLg />
                        </span>
                        <span
                          className="servers-cancel-rate"
                          onClick={handleCancelEditHistoryBalance}
                        >
                          <MdCancel />
                        </span>
                      </div>
                    ) : (
                      <div className="action_btn">
                        <span
                          className="servers-delete"
                          onClick={() => handleDeleteHistorySolde(solde?._id)}
                        >
                          <RiDeleteBin6Line />
                        </span>
                        <span
                          className="servers-edit"
                          onClick={() => handleEditHistory(solde?._id)}
                        >
                          <RiFileEditLine />
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {openSolde && (
          <div className="balance-add-solde-sec">
            <button className="balance-ferm" onClick={handleToggleOpenSolde}>
              Fermer
            </button>
            <div className="balance-sec-solde">
              <div>
                <label htmlFor="">Solde</label>
                <input
                  type="text"
                  value={sold}
                  onChange={(e) => setSold(e.target.value)}
                  placeholder="Nom du solde"
                />
              </div>

              <div>
                <label htmlFor="">Prix(Dh)</label>
                <input
                  type="number"
                  value={priceD}
                  onChange={(e) => setPriceD(e.target.value)}
                  placeholder="Prix du solde"
                />
              </div>

              <div>
                <label htmlFor="">Status</label>
                <select
                  value={stat}
                  onChange={(e) => setStat(e.target.value)}
                  placeholder="Status du solde"
                >
                  <option value="">choisissez le status</option>
                  <option value="Vendre rapidement">Vendre rapidement</option>
                  <option value="Stock complet">Stock complet</option>
                </select>
              </div>

              <button
                className="balance-btn"
                onClick={handleAddNewSoldeBalance}
              >
                Ajouter le solde
              </button>
            </div>
          </div>
        )}
      </div>
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

export default Balances;
