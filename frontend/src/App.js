import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './components/Modal';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [view, setView] = useState("login");
  const [todoList, setTodoList] = useState([]);
  
  // --- 1. YENİ: Aktif kategoriyi tutan state (Varsayılan: Hepsi) ---
  const [activeCategory, setActiveCategory] = useState("all");

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

  const refreshList = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/todos/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  const toggle = () => setModal(!modal);

  const handleSubmit = (item) => {
    toggle();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (item.id) {
      axios.put(`http://localhost:8000/api/todos/${item.id}/`, item, config).then(refreshList);
      return;
    }
    axios.post("http://localhost:8000/api/todos/", item, config).then(refreshList);
  };

  const handleDelete = (item) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (window.confirm("Silmek istediğine emin misin?")) {
      axios.delete(`http://localhost:8000/api/todos/${item.id}/`, config).then(refreshList);
    }
  };

  const createItem = () => {
    setActiveItem({ title: "", description: "", completed: false, category: "diger" });
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(true);
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setTodoList([]);
      setView("login");
  };

  // --- 2. YENİ: Listeyi Filtreleyen Fonksiyon ---
  // Eğer 'all' seçiliyse hepsini göster, değilse kategoriye göre süz
  const getFilteredList = () => {
      if (activeCategory === "all") {
          return todoList;
      }
      return todoList.filter(item => item.category === activeCategory);
  };

  if (!isLoggedIn) {
      if (view === "login") {
          return (
            <div className="container">
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
                <div className="text-center mt-3">
                    Hesabın yok mu? <span style={{color:"blue", cursor:"pointer"}} onClick={() => setView("register")}>Kayıt Ol</span>
                </div>
            </div>
          );
      } else {
          return (
            <div className="container">
                <Register onRegisterSuccess={() => setView("login")} switchToLogin={() => setView("login")} />
            </div>
          );
      }
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Yapılacaklar Listesi</h1>
          <button className="btn btn-warning" onClick={handleLogout}>Çıkış Yap</button>
      </div>
      
      {/* --- 3. YENİ: Kategori Butonları (Nav Pills) --- */}
      <div className="mb-4 d-flex justify-content-center">
        <div className="btn-group">
            <button className={`btn ${activeCategory === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveCategory('all')}>Hepsi</button>
            <button className={`btn ${activeCategory === 'is' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveCategory('is')}>İş</button>
            <button className={`btn ${activeCategory === 'okul' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveCategory('okul')}>Okul</button>
            <button className={`btn ${activeCategory === 'kisisel' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveCategory('kisisel')}>Kişisel</button>
            <button className={`btn ${activeCategory === 'diger' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveCategory('diger')}>Diğer</button>
        </div>
      </div>

      <div className="mb-4 text-end">
        <button className="btn btn-primary" onClick={createItem}>+ Yeni Görev Ekle</button>
      </div>

      <ul className="list-group">
        {/* todoList yerine getFilteredList() kullanıyoruz */}
        {getFilteredList().length === 0 ? <div className='text-center text-muted'>Bu kategoride görev yok.</div> : null}
        
        {getFilteredList().map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
             <div className="d-flex align-items-center">
              <span className={item.completed ? "text-decoration-line-through text-muted" : ""}>{item.title}</span>
              <span className="badge bg-warning text-dark ms-2">{item.category ? item.category.toUpperCase() : "DİĞER"}</span>
            </div>
            <span>
              <button className="btn btn-secondary mr-2" onClick={() => editItem(item)}>Düzenle</button>
              <button className="btn btn-danger" onClick={() => handleDelete(item)}>Sil</button>
            </span>
          </li>
        ))}
      </ul>
      {modal ? <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} /> : null}
    </div>
  );
}

export default App;