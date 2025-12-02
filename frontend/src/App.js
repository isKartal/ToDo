import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './components/Modal';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [view, setView] = useState("login");
  const [todoList, setTodoList] = useState([]);
  
  // Sayfalama State'leri
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("http://localhost:8000/api/todos/");
  
  // --- 1. YENİ: Arama State'i ---
  const [searchTerm, setSearchTerm] = useState("");

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
    // eslint-disable-next-line
  }, [isLoggedIn, currentPageUrl]); 

  const refreshList = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // --- 2. YENİ: Arama parametresini URL'ye ekle ---
    // Eğer currentPageUrl zaten bir sayfalama linkiyse (?page=2), onu olduğu gibi kullan.
    // Eğer ana link ise ve arama yapılıyorsa parametreyi ekle.
    
    let urlToFetch = currentPageUrl;
    
    // Basit bir mantık: Eğer kullanıcı arama butonuna bastıysa, URL'i sıfırlayıp aramayı ekleyeceğiz.
    // Ancak bu useEffect içinde olduğu için, biz aramayı ayrı bir fonksiyonda tetikleyelim.
    
    axios
      .get(urlToFetch, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setTodoList(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
      })
      .catch((err) => console.log(err));
  };

  // --- 3. YENİ: Arama Tetikleme Fonksiyonu ---
  const handleSearch = (e) => {
      e.preventDefault(); // Sayfa yenilenmesin
      // URL'i sıfırla ve arama parametresini ekle
      const url = `http://localhost:8000/api/todos/?search=${searchTerm}`;
      setCurrentPageUrl(url); 
      // setCurrentPageUrl değiştiği için useEffect çalışacak ve listeyi çekecek
  };
  
  // Arama kutusunu temizleme
  const clearSearch = () => {
      setSearchTerm("");
      setCurrentPageUrl("http://localhost:8000/api/todos/");
  };

  const toggle = () => setModal(!modal);
  // ... (handleSubmit, handleDelete, createItem, editItem, handleLogout, getFilteredList AYNI KALSIN) ...
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
  const getFilteredList = () => {
      if (activeCategory === "all") return todoList;
      return todoList.filter(item => item.category === activeCategory);
  };

  if (!isLoggedIn) {
     if (view === "login") return <div className="container"><Login onLoginSuccess={() => setIsLoggedIn(true)} /><div className="text-center mt-3">Hesabın yok mu? <span style={{color:"blue", cursor:"pointer"}} onClick={() => setView("register")}>Kayıt Ol</span></div></div>;
     else return <div className="container"><Register onRegisterSuccess={() => setView("login")} switchToLogin={() => setView("login")} /></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center">Yapılacaklar Listesi</h1>
          <button className="btn btn-warning" onClick={handleLogout}>Çıkış Yap</button>
      </div>

      {/* --- YENİ EKLENEN KISIM: DASHBOARD --- */}
      <Dashboard />
      <hr className="my-5" /> {/* Araya bir çizgi çekelim */}
      {/* ----------------------------------- */}

      {/* --- 4. YENİ: ARAMA KUTUSU (Görünüm) --- */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
            <form onSubmit={handleSearch} className="input-group">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Görev ara..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-info" type="submit">Ara</button>
                <button className="btn btn-secondary" type="button" onClick={clearSearch}>Temizle</button>
            </form>
        </div>
      </div>
      
      {/* Kategori Butonları */}
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

      <ul className="list-group mb-4">
        {getFilteredList().length === 0 ? <div className='text-center text-muted'>Kayıt bulunamadı.</div> : null}

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

      {/* Sayfalama Butonları */}
      <div className="d-flex justify-content-center mb-5">
        <button className="btn btn-outline-primary me-2" disabled={!prevPage} onClick={() => setCurrentPageUrl(prevPage)}>&laquo; Önceki</button>
        <button className="btn btn-outline-primary" disabled={!nextPage} onClick={() => setCurrentPageUrl(nextPage)}>Sonraki &raquo;</button>
      </div>

      {modal ? <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} /> : null}
    </div>
  );
}

export default App;