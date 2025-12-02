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
  
  // --- 1. YENİ: Dashboard'u tetiklemek için sayaç ---
  const [dashboardVersion, setDashboardVersion] = useState(0); 

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("http://localhost:8000/api/todos/");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({ title: "", description: "", completed: false, category: "diger" });

  useEffect(() => {
    if (isLoggedIn) refreshList();
    // eslint-disable-next-line
  }, [isLoggedIn, currentPageUrl, dashboardVersion]); // dashboardVersion değişince de listeyi yenile

  const refreshList = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Arama varsa URL'e ekle
    let url = currentPageUrl;
    if(searchTerm && !url.includes("search")) {
        url = `http://localhost:8000/api/todos/?search=${searchTerm}`;
    }

    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTodoList(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
      })
      .catch((err) => console.log(err));
  };

  // --- 2. YENİ: Hızlı Tamamlama Fonksiyonu (Checkbox için) ---
  const handleToggleComplete = (item) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Sadece 'completed' durumunu tersine çevirip gönderiyoruz
    const updatedItem = { ...item, completed: !item.completed };

    axios.put(`http://localhost:8000/api/todos/${item.id}/`, updatedItem, config)
      .then(() => {
          refreshList();
          setDashboardVersion(v => v + 1); // Grafikleri yenile!
      });
  };

  const toggle = () => setModal(!modal);

  const handleSubmit = (item) => {
    toggle();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const request = item.id 
        ? axios.put(`http://localhost:8000/api/todos/${item.id}/`, item, config)
        : axios.post("http://localhost:8000/api/todos/", item, config);

    request.then(() => {
        refreshList();
        setDashboardVersion(v => v + 1); // Grafikleri yenile!
    });
  };

  const handleDelete = (item) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (window.confirm("Silmek istediğine emin misin?")) {
      axios.delete(`http://localhost:8000/api/todos/${item.id}/`, config).then(() => {
          refreshList();
          setDashboardVersion(v => v + 1); // Grafikleri yenile!
      });
    }
  };

  const createItem = () => { setActiveItem({ title: "", description: "", completed: false, category: "diger" }); setModal(true); };
  const editItem = (item) => { setActiveItem(item); setModal(true); };
  
  const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setTodoList([]);
      setView("login");
  };

  const handleSearch = (e) => { e.preventDefault(); setCurrentPageUrl(`http://localhost:8000/api/todos/?search=${searchTerm}`); };
  const clearSearch = () => { setSearchTerm(""); setCurrentPageUrl("http://localhost:8000/api/todos/"); };
  const getFilteredList = () => { return activeCategory === "all" ? todoList : todoList.filter(item => item.category === activeCategory); };

  if (!isLoggedIn) {
     return view === "login" 
        ? <div className="container"><Login onLoginSuccess={() => setIsLoggedIn(true)} /><div className="text-center mt-3">Hesabın yok mu? <span className='text-primary' style={{cursor:"pointer"}} onClick={() => setView("register")}>Kayıt Ol</span></div></div>
        : <div className="container"><Register onRegisterSuccess={() => setView("login")} switchToLogin={() => setView("login")} /></div>;
  }

  return (
    <div className="container-fluid min-vh-100 bg-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="fw-bold text-dark">🚀 Görev Yönetim Paneli</h2>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Çıkış Yap</button>
        </div>

        {/* --- 3. DASHBOARD YENİLEME: 'key' prop'u sayesinde her işlemde yeniden çizilecek --- */}
        <Dashboard key={dashboardVersion} />
        
        <hr className="my-5 text-secondary" />

        <div className="row justify-content-center mb-4">
            <div className="col-md-6">
                <form onSubmit={handleSearch} className="input-group shadow-sm">
                    <input type="text" className="form-control border-0" placeholder="Görev ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button className="btn btn-primary" type="submit"><i className="bi bi-search"></i> Ara</button>
                    {searchTerm && <button className="btn btn-secondary" onClick={clearSearch}>X</button>}
                </form>
            </div>
        </div>
        
        <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
            {['all', 'is', 'okul', 'kisisel', 'diger'].map(cat => (
                <button 
                    key={cat} 
                    className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat ? 'btn-dark' : 'btn-white border'}`} 
                    onClick={() => setActiveCategory(cat)}
                >
                    {cat.toUpperCase()}
                </button>
            ))}
        </div>

        <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-success shadow-sm rounded-pill px-4" onClick={createItem}>+ Yeni Görev</button>
        </div>

        {/* --- 4. YENİ LİSTE TASARIMI: Modern Kartlar --- */}
        <div className="row">
            {getFilteredList().length === 0 && <div className='text-center text-muted py-5'>Kayıt bulunamadı.</div>}
            
            {getFilteredList().map((item) => (
            <div key={item.id} className="col-12 mb-3">
                <div className={`card border-0 shadow-sm p-3 ${item.completed ? 'bg-light opacity-75' : 'bg-white'}`} style={{transition: '0.3s'}}>
                    <div className="d-flex justify-content-between align-items-center">
                        
                        {/* Sol Taraf: Checkbox ve Yazılar */}
                        <div className="d-flex align-items-center gap-3">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={item.completed} 
                                    onChange={() => handleToggleComplete(item)} // Tıklayınca anında tamamla
                                    style={{transform: "scale(1.5)", cursor: "pointer"}}
                                />
                            </div>
                            <div>
                                <h5 className={`mb-1 ${item.completed ? "text-decoration-line-through text-muted" : "fw-bold"}`}>
                                    {item.title}
                                </h5>
                                <p className="mb-0 text-muted small">{item.description}</p>
                            </div>
                        </div>

                        {/* Sağ Taraf: Kategori ve Butonlar */}
                        <div className="d-flex align-items-center gap-3">
                            <span className={`badge rounded-pill ${
                                item.category === 'is' ? 'bg-info' : 
                                item.category === 'okul' ? 'bg-warning' : 
                                item.category === 'kisisel' ? 'bg-success' : 'bg-secondary'
                            }`}>
                                {item.category.toUpperCase()}
                            </span>
                            
                            <div className="btn-group">
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => editItem(item)}>✏️</button>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item)}>🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>

        <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-link text-decoration-none" disabled={!prevPage} onClick={() => setCurrentPageUrl(prevPage)}>Önceki Sayfa</button>
            <span className='mx-3 text-muted'>|</span>
            <button className="btn btn-link text-decoration-none" disabled={!nextPage} onClick={() => setCurrentPageUrl(nextPage)}>Sonraki Sayfa</button>
        </div>

        {modal ? <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} /> : null}
      </div>
    </div>
  );
}

export default App;