import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './components/Modal';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  const toggle = () => {
    setModal(!modal);
  };

  // ----- YENİ VE GÜNCELLENMİŞ FONKSİYONLAR -----

  // Kaydet butonuna basılınca çalışır
  const handleSubmit = (item) => {
    toggle(); // Modalı kapat

    // EĞER item.id VARSA -> GÜNCELLEME (PUT) YAP
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }

    // EĞER item.id YOKSA -> YENİ EKLE (POST) YAP
    axios
      .post("http://localhost:8000/api/todos/", item)
      .then((res) => refreshList());
  };

  // Düzenle butonuna basılınca çalışır
  const editItem = (item) => {
    setActiveItem(item); // Tıklanan görevi aktif yap
    setModal(true);      // Modalı aç
  };

  // Sil butonuna basılınca çalışır
  const handleDelete = (item) => {
    if (window.confirm("Bu görevi silmek istediğine emin misin?")) {
        axios
        .delete(`http://localhost:8000/api/todos/${item.id}/`)
        .then((res) => refreshList());
    }
  };

  const createItem = () => {
    // category: "diger" varsayılan olarak eklendi
    const item = { title: "", description: "", completed: false, category: "diger" };
    setActiveItem(item);
    setModal(true);
  };

  // ----------------------------------------------

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Yapılacaklar Listesi</h1>
      
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
            {/* SOL TARAF: Başlık ve Kategori */}
            <div className="d-flex align-items-center">
              <span
                title={item.description}
                className={item.completed ? "text-decoration-line-through text-muted" : ""}
              >
                {item.title}
              </span>
              
              {/* KATEGORİ ROZETİ */}
              <span className="badge bg-warning text-dark ms-2" style={{marginLeft: "10px", fontSize: "0.8em"}}>
                 {/* Veritabanında 'is' yazar ama biz ekranda 'İş' göstermek isteyebiliriz, şimdilik direkt yazdıralım */}
                 {item.category ? item.category.toUpperCase() : "DİĞER"}
              </span>
            </div>

            {/* SAĞ TARAF: Butonlar */}
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