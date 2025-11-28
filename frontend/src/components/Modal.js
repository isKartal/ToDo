import React, { Component } from "react";
// Bootstrap'in hazır modal ve form bileşenlerini çekiyoruz
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

class CustomModal extends Component {
  constructor(props) {
    super(props);
    // Formun içindeki verileri burada tutacağız (State)
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  // Inputlara yazı yazıldığında bu fonksiyon çalışır ve state'i günceller
  handleChange = (e) => {
    let { name, value } = e.target;
    
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };

  render() {
    // Parent'tan (App.js) gelen 'toggle' ve 'onSave' fonksiyonlarını al
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Görev Ekle / Düzenle</ModalHeader>
        <ModalBody>
          <Form>
            {/* BAŞLIK GİRİŞİ */}
            <FormGroup>
              <Label for="title">Başlık</Label>
              <Input
                type="text"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Görevi giriniz..."
              />
            </FormGroup>

            {/* AÇIKLAMA GİRİŞİ */}
            <FormGroup>
              <Label for="description">Açıklama</Label>
              <Input
                type="text"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Detayları yazınız..."
              />
            </FormGroup>

            {/* KATEGORİ SEÇİMİ */}
            <FormGroup>
              <Label for="category">Kategori</Label>
              <Input
                type="select"
                name="category"
                value={this.state.activeItem.category}
                onChange={this.handleChange}
              >
                <option value="diger">Diğer</option>
                <option value="kisisel">Kişisel</option>
                <option value="is">İş</option>
                <option value="okul">Okul</option>
              </Input>
            </FormGroup>

            {/* TAMAMLANDI ONAY KUTUSU */}
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Tamamlandı
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {/* Kaydet butonuna basınca onSave fonksiyonunu çalıştır ve veriyi gönder */}
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            Kaydet
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CustomModal;