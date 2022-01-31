import React, { useState, useEffect } from "react";
import "./App.css";

const defaultState = {
  addressToAdd: "",
  noteToAdd: "",
};

function App() {
  const [addresses, setAddresses] = useState([]);

  const [infoToAdd, setInfoToAdd] = useState(defaultState);
  const [dataToFilter, setDataToDFilter] = useState("");
  const [code, setCode] = useState("");

  const getAddresses = async () => {
    await fetch(`${process.env.REACT_APP_LINK_TO_FETCH}/all-addresses`)
      .then((response) => response.json())
      .then((info) => {
        if (info.msg) {
          alert(info.msg);
        } else {
          setAddresses(info.addresses);
        }
      });
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const addAddress = () => {
    if (!infoToAdd.addressToAdd || !infoToAdd.noteToAdd) {
      alert("Fill out properly");
    } else {
      fetch(`${process.env.REACT_APP_LINK_TO_FETCH}/add-address`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: infoToAdd.addressToAdd,
          note: infoToAdd.noteToAdd,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setInfoToAdd(defaultState);
          getAddresses();
          console.log(data.msg);
        });
    }
  };

  const deleteAddress = (idToDelete) => {
    fetch(`${process.env.REACT_APP_LINK_TO_FETCH}/delete-address`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idToDelete,
        code: code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.msg);
        getAddresses();
      });
  };

  const filterAddresses = () => {
    return addresses.filter((item) => {
      return item.address.toLowerCase().includes(dataToFilter.toLowerCase());
    });
  };

  return (
    <div className="app_container">
      <div className="app_container_adder">
        <input
          type="text"
          placeholder="Address"
          value={infoToAdd.addressToAdd}
          onChange={(e) => {
            setInfoToAdd({ ...infoToAdd, addressToAdd: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Note"
          value={infoToAdd.noteToAdd}
          onChange={(e) => {
            setInfoToAdd({ ...infoToAdd, noteToAdd: e.target.value });
          }}
        />
        <button onClick={addAddress}>ADD</button>
        <button onClick={() => setInfoToAdd(defaultState)}>CLEAR</button>
      </div>
      <div className="app_container_search_input">
        <input
          type="text"
          placeholder="Search Here..."
          onChange={(e) => {
            setDataToDFilter(e.target.value);
          }}
        />
      </div>
      <div className="app_container_table">
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Note</th>
              <th>Control</th>
            </tr>
          </thead>
          <tbody>
            {filterAddresses().map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.address}</td>
                  <td>{item.note}</td>
                  <td>
                    <button
                      id={item.id}
                      onClick={(e) => {
                        deleteAddress(e.target.id);
                      }}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="app_container_search_input">
        <input
          type="text"
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default App;
