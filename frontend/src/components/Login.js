import React, { useState } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Backend'e POST isteği atıyoruz: "Benim adım bu, şifrem bu"
    axios
        .post("http://localhost:8000/api/token/", {
        username: username,
        password: password,
      })
      .then((res) => {
        // BAŞARILI: Backend bize 'access' ve 'refresh' token verdi.
        console.log("Token alındı:", res.data);
        
        // Token'ı tarayıcının hafızasına (LocalStorage) kaydediyoruz
        localStorage.setItem("token", res.data.access);
        
        // App.js'e haber ver: "Giriş başarılı!"
        onLoginSuccess();
      })
      .catch((err) => {
        // HATA: Şifre yanlış veya kullanıcı yok
        setError("Kullanıcı adı veya şifre hatalı!");
        console.error("Giriş hatası:", err);
      });
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="text-center">Giriş Yap</h2>
      {error && <Alert color="danger">{error}</Alert>}
      
      <Form onSubmit={handleLogin} className="p-4 border rounded bg-light">
        <FormGroup>
          <Label>Kullanıcı Adı</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınız..."
          />
        </FormGroup>
        <FormGroup>
          <Label>Şifre</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifreniz..."
          />
        </FormGroup>
        <Button color="primary" block>Giriş Yap</Button>
      </Form>
    </div>
  );
};

export default Login;