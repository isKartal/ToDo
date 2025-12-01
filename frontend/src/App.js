import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './components/Modal';
import Login from './components/Login';

function App() {
  // LocalStorage'da token varsa giriş yapılmış say
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
    category: "diger"
  });

  useEffect(() => {
    if (isLoggedIn) {
      refreshList();
    }
  }, [isLoggedIn]);

  // --- KRİTİK NOKTA 1: Listeyi Çekerken Token Kullan ---
  const refreshList = () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Token yoksa hiç deneme

    axios
      .get("http://localhost:8000/api/todos/", {
        headers: {
            Authorization: `Bearer ${token}` // <--- İŞTE BU SATIR EKSİK OLABİLİR
        }
      })
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log("Liste çekme hatası:", err));
  };

  const toggle = () => {
    setModal(!modal);
  };

  // --- KRİTİK NOKTA 2: Ekleme/Güncelleme Yaparken Token Kullan ---
  const handleSubmit = (item) => {
    toggle();
    const token = localStorage.getItem("token");
    // Header ayarını bir değişkene atadık, tekrar tekrar yazmayalım
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item, config)
        .then((res) => refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/todos/", item, config)
      .then((res) => refreshList());
  };

  // --- KRİTİK NOKTA 3: Silerken Token Kullan ---
  const handleDelete = (item) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (window.confirm("Silmek istediğine emin misin?")) {
      axios
        .delete(`http://localhost:8000/api/todos/${item.id}/`, config)
        .then((res) => refreshList());
    }
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false, category: "diger" };
    setActiveItem(item);
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(true);
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setTodoList([]); // Çıkış yapınca listeyi temizle
  };

  // Giriş yapılmadıysa Login ekranını göster
  if (!isLoggedIn) {
      return (
          <div className="container">
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          </div>
      );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Yapılacaklar Listesi</h1>
          <button className="btn btn-warning" onClick={handleLogout}>Çıkış Yap</button>
      </div>
      
      <div className="mb-4">
        <button className="btn btn-primary" onClick={createItem}>
          + Yeni Görev Ekle
        </button>
      </div>

      <ul className="list-group">
        {todoList.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
             <div className="d-flex align-items-center">
              <span
                title={item.description}
                className={item.completed ? "text-decoration-line-through text-muted" : ""}
              >
                {item.title}
              </span>
              <span className="badge bg-warning text-dark ms-2" style={{marginLeft: "10px", fontSize: "0.8em"}}>
                 {item.category ? item.category.toUpperCase() : "DİĞER"}
              </span>
            </div>
            <span>
              <button
                className="btn btn-secondary mr-2"
                onClick={() => editItem(item)}
                style={{ marginRight: "10px" }}
              >
                Düzenle
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(item)}
              >
                Sil
              </button>
            </span>
          </li>
        ))}
      </ul>

      {modal ? (
        <Modal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </div>
  );
}

export default App;