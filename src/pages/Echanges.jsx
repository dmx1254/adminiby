/* @ts-nocheck */
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../components";

import { RiDeleteBin6Line } from "react-icons/ri";
import { RiFileEditLine } from "react-icons/ri";

import { getExchange } from "../features/ExchangesSlice";

import { BiSearch } from "react-icons/bi";

import { updateExchange, deleteExchange } from "../features/ExchangesSlice";

import { updateRate } from "../features/rateSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Echanges = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.exchange);

  // const fixedValue = (valToFixed) =>{}

  const { rate } = useSelector((state) => state.rate);
  const { rateId } = useSelector((state) => state.rate);

  const [toggleEdit, setToggleEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [status, setStatus] = useState("");
  const [rateUpdated, setRateUpdated] = useState(rate);
  const [editRate, setEditRate] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const notifySuccessToUpadteExchange = (name) =>
    toast.success("Echange numéro " + name + " mis à jour avec succès");

  const notifySuccessToDeleteExchange = (name) =>
    toast.success("Echange numéro " + name + " suprrimé avec succès");

  const notifySuccessToUpdateRate = () =>
    toast.success("Taux de change mis à jour avec succès");

  const convertDate = (date) => {
    const dateConverted = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return dateConverted;
  };

  console.log(products);

  const handleToggleEdit = (idToEdit) => {
    setEditId(idToEdit);
  };

  const cancelModif = () => {
    setEditId("");
  };

  const handleEditRate = () => {
    setEditRate(true);
  };

  const cancelModifRate = () => {
    setEditRate(false);
  };

  useEffect(() => {
    const getExchanges = async () => {
      await axios
        .get(`${process.env.REACT_APP_CLIENT_URL}/exchange`)
        .then((res) => dispatch(getExchange(res.data)));
    };
    getExchanges();
  }, [dispatch]);

  const handleUpdateExchange = (idToUpdate) => {
    try {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_CLIENT_URL}/exchange/${idToUpdate}`,
        data: {
          status,
        },
      }).then((res) => {
        dispatch(updateExchange(res?.data));
        notifySuccessToUpadteExchange(res?.data?.numExchange);
        setEditId(null);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveExchange = (idToDelete) => {
    try {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_CLIENT_URL}/exchange/${idToDelete}`,
      }).then((res) => {
        dispatch(deleteExchange({ id: res?.data?._id }));
        notifySuccessToDeleteExchange(res?.data?.numExchange);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateRate = () => {
    try {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_CLIENT_URL}/order/rate/${rateId}`,
        data: {
          rate: rateUpdated,
        },
      }).then((res) => {
        dispatch(updateRate({ rateUpdated: res?.data?.rate }));
        notifySuccessToUpdateRate();
        setEditRate(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg echanges">
      <div className="flex items-center justify-between mr-6">
        <Header category="Dofus" title="Echanges" />
        <div className="infos-user-search">
          <input
            type="text"
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Commande"
          />
          <span className="search_addnewsolde">
            <BiSearch />
          </span>
        </div>
        <div className="flex items-center gap-6 rate-container">
          <div className="rate_update">
            <span className="server-rate-text">Taux de change</span>
            {editRate ? (
              <input
                className="input-rate"
                type="number"
                value={rateUpdated}
                onChange={(e) => setRateUpdated(e.target.value)}
              />
            ) : (
              <span className="server-rate-Value">{rateUpdated}</span>
            )}
          </div>
          {editRate ? (
            <div
              className="action_btn"
              style={{
                marginTop: "20px",
              }}
            >
              <button className="servers-valid" onClick={handleUpdateRate}>
                Valider
              </button>
              <button className="servers-cancel" onClick={cancelModifRate}>
                Annuler
              </button>
            </div>
          ) : (
            <div className="echanges-edit-btn" onClick={handleEditRate}>
              <span className="rate-editButton">
                <RiFileEditLine />
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="table_responsive">
        <table>
          <thead>
            <tr>
              <th>N° Echan</th>
              <th>Code</th>
              <th>Serveur ac</th>
              <th>Qté à échanger</th>
              <th>Nom perso</th>
              <th>Serveur dé</th>
              <th>Qté à rec</th>
              <th>Nom perso</th>
              <th>Date</th>
              <th>Status</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products
              ?.filter((product) => product.numExchange.includes(searchTerm))
              ?.map((product) => (
                <tr key={product?._id}>
                  <td>{product.numExchange}</td>
                  <td>{product.codeToExchange}</td>
                  <td>{product.serverOut}</td>
                  <td>{product.qtyToPay}</td>
                  <td>{product.characterToPay}</td>
                  <td>{product.serverIn}</td>
                  <td>{product.qtyToReceive}</td>
                  <td>{product.characterToReceive}</td>
                  <td>{convertDate(product.createdAt)}</td>
                  {editId === product?._id ? (
                    <select
                      className="echanges_selec"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Terminée">Terminée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  ) : (
                    <td
                      className={
                        product.status === "Terminée"
                          ? "success"
                          : product.status === "Annulée"
                          ? "no-success"
                          : product.status === "En attente"
                          ? "pending"
                          : "no-pending"
                      }
                    >
                      {product.status}
                    </td>
                  )}
                  <td>{product?.detailUser?.email}</td>
                  <td>
                    {editId === product?._id ? (
                      <div className="action_btn">
                        <button
                          className="servers-valid"
                          onClick={() => handleUpdateExchange(product?._id)}
                        >
                          Valider
                        </button>
                        <button
                          className="servers-cancel"
                          onClick={cancelModif}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span
                          className="servers-delete"
                          onClick={() => handleRemoveExchange(product?._id)}
                        >
                          <RiDeleteBin6Line />
                        </span>
                        <span
                          className="servers-edit"
                          onClick={() => handleToggleEdit(product._id)}
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

export default Echanges;
