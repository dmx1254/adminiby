/* @ts-nocheck */
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../components";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RiDeleteBin6Line } from "react-icons/ri";
import { RiFileEditLine } from "react-icons/ri";
import { BiAddToQueue, BiDotsHorizontalRounded } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

import { getOrders } from "../features/ordersSlice";

// import noCapture from "../assets/nomage.jpg";

// import FileBase from "react-file-base64";

import { updateOrder, deleteOrder } from "../features/ordersSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  // console.log(dateFilter);
  // console.log(orders);
  // const [capture, setCapture] = useState("");
  // console.log(orders);
  // console.log(capture);

  const notifyErrorToUpdateOrder = () =>
    toast.error("Veuillez la zone de capture avant de valider");

  const notifySuccessToAddOrder = (name) =>
    toast.success("Commande n° " + name + " mis à jour avec succés");

  const notifySuccessToDeleteOrder = (name) =>
    toast.success("Commande n° " + name + " mis à jour avec succés");

  const [toggleSub, setToggleSub] = useState(false);

  const [dataOrder, setDataOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [editableId, setEditableId] = useState(null);
  const [status, setStatus] = useState("En attente");

  const [totalOrderDay, setTotalOrderDay] = useState(0);
  // useEffect(() => {
  //   if (dataOrder.length === 1) {
  //     if (dataOrder[0].status === "Payée") {
  //       setTotalPrice(dataOrder[0].totalPrice);
  //     } else {
  //       setTotalPrice(0);
  //     }
  //   } else if (dataOrder.length > 1) {
  //     let myTab = orderData.filter((data) => data.status === "Payée");
  //     if (myTab.length === 1) {
  //       setTotalPrice(myTab[0].totalPrice);
  //     } else {
  //       setTotalPrice(orderData.reduce((a, b) => a + b.totalPrice, 0));
  //     }
  //   } else {
  //     setTotalPrice(0);
  //   }
  // }, [dataOrder]);

  useEffect(() => {
    const getAllOrders = async () => {
      await axios.get(`${process.env.REACT_APP_CLIENT_URL}/buy`).then((res) => {
        dispatch(getOrders(res?.data));
      });
    };
    getAllOrders();
  }, [dispatch]);

  const convertDate = (date) => {
    const dateConverted = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return dateConverted;
  };

  // let day = new Date("17 novembre 2022");
  // console.log(day.getDay());
  // const d = new Date("July 21, 1983 01:15:00");
  // let day = d.getDate() + 3;
  // console.log(day);

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

  const handleEditOrder = (orderIdToEdit) => {
    setEditableId(orderIdToEdit);
  };
  const handleDeleteOrder = (orderIdToDelete) => {
    try {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_CLIENT_URL}/buy/${orderIdToDelete}`,
      }).then((res) => {
        dispatch(deleteOrder({ id: res?.data._id }));
        notifySuccessToDeleteOrder(res?.data?.numBuy);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateOrders = (idOrderToUpdate) => {
    if (!status) {
      notifyErrorToUpdateOrder();
    } else {
      try {
        axios({
          method: "put",
          url: `${process.env.REACT_APP_CLIENT_URL}/buy/${idOrderToUpdate}`,
          data: {
            status,
          },
        }).then((res) => {
          dispatch(updateOrder(res?.data));
          notifySuccessToAddOrder(res?.data?.numBuy);
          setEditableId(null);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCancleModifOrders = () => {
    setEditableId(null);
  };

  const handleToggleSubstr = (chaine) => {
    if (!toggleSub) {
      return chaine.substring(0, 17);
    } else {
      return chaine;
    }
  };

  const handleBasculeToggle = () => {
    setToggleSub((prevToggleSub) => !prevToggleSub);
  };

  // useEffect(() => {
  //   let newDateFiltered = convertDate(dateFilter);
  //   if (orders.length === 1) {
  //     if (
  //       orders[0].status === "Payée" &&
  //       convertDate(orders[0].createdAt) === newDateFiltered
  //     ) {
  //       setTotalOrderDay(orders[0].totalPrice);
  //     } else {
  //       setTotalOrderDay(0);
  //     }
  //   } else if (orders.length > 1) {
  //     let myTab = orders
  //       .filter((sol) => convertDate(sol.createdAt) === newDateFiltered)
  //       .filter((data) => data.status === "Payée");
  //     if (myTab.length === 1) {
  //       setTotalOrderDay(myTab[0].totalPrice);
  //     } else {
  //       setTotalOrderDay(orders.reduce((a, b) => a + b.totalPrice, 0));
  //     }
  //   } else {
  //     setTotalOrderDay(0);
  //   }
  // }, [orders, orders.status]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-2 bg-white rounded-3xl dark:bg-secondary-dark-bg orders">
      <Header category="Dofus" title="Gestion des commandes dofus" />
      <div className="table_responsive">
        <table>
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Jeu</th>
              <th>Serveur</th>
              <th>Qte</th>
              <th>PU</th>
              <th>Total</th>
              {/* {user?.person?.isAdmin && <th>Coordonnées de paiement</th>} */}
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
            {orders?.map((order) => (
              <tr key={order.id}>
                <td>
                  <p className="order-sales">{order.numBuy}</p>
                </td>
                <td
                  className={
                    order.jeu === "dofus-kamas"
                      ? "dofuskamas"
                      : order.jeu === "dofus-touch"
                      ? "dofustouch"
                      : "dofusretro"
                  }
                >
                  {order.jeu}
                </td>
                <td>{order.server}</td>
                <td>{order.qte}</td>
                <td>{order.pu}</td>
                <td>{order.totalPrice}</td>
                {order?._id === editableId ? (
                  <td>
                    {" "}
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En Cours de payment">
                        En Cours de payment
                      </option>
                      <option value="Payée">Payée</option>
                      <option value="Annulée">Annulée</option>
                    </select>{" "}
                  </td>
                ) : (
                  <td
                    className={
                      order.status === "Payée"
                        ? "success"
                        : order.status === "Annulée"
                        ? "no-success"
                        : order.status === "En Cours de payment"
                        ? "payment-success"
                        : order.status === "En attente"
                        ? "pending"
                        : "no-pending"
                    }
                  >
                    {order.status}
                  </td>
                )}
                <td>{convertDate(order.createdAt)}</td>
                <td>{convertDateAndAddDay(order.createdAt)}</td>{" "}
                {/* <td>
                    <span>{order?.paymentMethod}</span>
                  </td> */}
                <td
                  className={order?.detailUser?.currency ? "pas-vide" : "vide"}
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
                <td className={order?.detailUser?.dhsRib ? "pas-vide" : "vide"}>
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
                {/* <span className="info_dot" onClick={handleBasculeToggle}>
                        <BiDotsHorizontalRounded />
                      </span> */}
                {order?._id === editableId ? (
                  <td>
                    <div className="action_btn">
                      <button
                        className="servers-valid"
                        onClick={() => handleUpdateOrders(order?._id)}
                      >
                        Valider
                      </button>
                      <button
                        className="servers-cancel"
                        onClick={handleCancleModifOrders}
                      >
                        Annuler
                      </button>
                    </div>
                  </td>
                ) : (
                  <td>
                    <div className="action_btn">
                      <span
                        className="servers-delete"
                        onClick={() => handleDeleteOrder(order?._id)}
                      >
                        <RiDeleteBin6Line />
                      </span>
                      <span
                        className="servers-edit"
                        onClick={() => handleEditOrder(order?._id)}
                      >
                        <RiFileEditLine />
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="solde-buy-thisday">
          <span className="solde-buy-thisday-text">
            Commandes Payées aujourd'hui:
          </span>
          <span className="solde-buy-thisday-text-amount">
            {totalOrderDay.toFixed(2)} dhs
          </span>
        </div> */}
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
export default Orders;
