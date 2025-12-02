import React, { useState } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";

const Register = ({ onRegisterSuccess, switchToLogin }) => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    // Backend'e Kayıt İsteği At
    axios
      .post("http://localhost:8000/api/register/", userData)
      .then((res) => {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        onRegisterSuccess(); // App.js'e haber ver (Giriş ekranına dön)
      })
      .catch((err) => {
        console.error("Kayıt hatası:", err);
        // Backend'den gelen hatayı göster veya genel hata mesajı ver
        if (err.response && err.response.data) {
             // Django genelde hatayı obje olarak döner (örn: {username: ["Bu isim alınmış"]})
             // Bunu basitçe ekrana basmak için:
             setError(JSON.stringify(err.response.data)); 
        } else {
             setError("Kayıt olurken bir hata oluştu.");
        }
      });
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="text-center">Kayıt Ol</h2>
      {error && <Alert color="danger">{error}</Alert>}

      <Form onSubmit={handleRegister} className="p-4 border rounded bg-light">
        <FormGroup>
          <Label>Kullanıcı Adı</Label>
          <Input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Kullanıcı adı seçin..."
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>E-posta</Label>
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="E-posta adresiniz..."
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Şifre</Label>
          <Input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Güçlü bir şifre belirleyin..."
            required
          />
        </FormGroup>
        
        <Button color="success" block className="mb-3">Kayıt Ol</Button>
        
        {/* Giriş ekranına dönüş butonu */}
        <div className="text-center">
            <span>Zaten hesabın var mı? </span>
            <span 
                style={{color: "blue", cursor: "pointer", textDecoration: "underline"}} 
                onClick={switchToLogin}
            >
                Giriş Yap
            </span>
        </div>
      </Form>
    </div>
  );
};

export default Register;