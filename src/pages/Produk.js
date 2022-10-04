import "../assets/css/Produk.css";
import React, { useState } from "react";
import {Button, Modal, Card, Form, Spinner, Alert } from "react-bootstrap";
import axios from 'axios';
import { FaTrashAlt, FaPencilAlt,FaPlusCircle } from 'react-icons/fa';


const AlertDismissibleExample = ({notif, judul, isi, status}) => {
  const [show, setShow] = useState(notif);
  if (show) {
    return (
      <Alert variant={status} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{judul}</Alert.Heading>
        <p>{isi}</p>
      </Alert>
    );
  }
}

const formatRupiah = (angka) => {
  var number_string = angka.toString().replace(/[^,\d]/g, '').toString(),
  split   		= number_string.split(','),
  sisa     		= split[0].length % 3,
  rupiah     		= split[0].substr(0, sisa),
  ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if(ribuan){
    let separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return rupiah;
}

const baseUrl = 'http://127.0.0.1:8000/';

class Produk extends React.Component {

  constructor(){
    super();
    this.state = {
      products: [],
      page: 1,
      loading: false,
      alert:{
        status: 'danger',
        notif: false,
        judul: '',
        isi: '',
      }
    }
    this.temp = 0;
    this.handleDelete = this.handleDelete.bind(this);
    
  }


  componentDidMount() {
    this.getProduct();
  }

  handleSubmit = (_data) => {
    const data = new FormData() ;
    Object.keys(_data).forEach(e => {
      data.append(e, _data[e]);
    })
    axios.post(baseUrl+'api/product', data).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err.message);
    })
    
  }

  handleDelete = (prdNo) => {
    var result = window.confirm("Want to delete?");
    if (result) {
      axios.get(baseUrl+'elevenia/hidden-product/'+prdNo).then(res => {
        let alert = {
          status: 'danger',
          notif: true,
          judul: res.data.message,
          isi: '',
        }
        // console.log(alert)
        this.setState({
          alert: alert
        })
      }).catch(err => {
        console.log(err.message);
      })
    }
  }

  getProduct = () => {
    console.log(this.state.page);
    this.setState({loading: true});
    axios.get(baseUrl+'api/product?page='+this.state.page).then(res => {
      console.log(res.data.data);
      let data = res.data.data;
      let masuk = true;
      this.state.products.forEach(e=>{
        if(e._id === data[0]._id){
          masuk = false;
        }
      })
      if(masuk)this.setState({products: this.state.products.concat(res.data.data), page: this.state.page + 1, loading: false})
    }).catch(err => {
      console.log(err.message);
      this.setState({loading: false});
    })
  }

  render(){
    window.onscroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1) {
        this.getProduct();
      }
    }
    return(
      <DisplayProduk products={this.state.products} loading={this.state.loading} handleSubmit={this.handleSubmit} handleDelete={this.handleDelete} alert={this.state.alert}  />
    );
  }
}

const DisplayProduk = ({products, loading, handleSubmit, handleDelete, alert}) => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    const {name, value, files} = event.target;
    if(name === 'image'){
      setForm(values => ({...values, [name]: files[0]}))
    }else{
      setForm(values => ({...values, [name]: value}))
    }
  }
  return (
    <div>
      <div className="container">
        <h1>Produk</h1>
        <br />
        <Button variant="primary" onClick={handleShow}>
          <FaPlusCircle />
        </Button> Tambah {alert.judul}
        <AlertDismissibleExample notif={alert.notif} judul={alert.judul} isi={alert.isi} status={alert.status} />
        <div className="products">
          <div className="row">
            {products.map((e) => {
              return (
                <div className="col-sm-2" key={e._id}>
                  <Card style={{height: 400, marginBottom: 15}}>
                    <Card.Img variant="top" style={{height: 200}} src={e.image} />
                    <Card.Body>
                      <Card.Title>{e.name}</Card.Title>
                      
                      <Card.Text style={{fontWeight: 'bold'}}>Rp. {formatRupiah(e.price)}</Card.Text>
                      <Card.Text>
                        {e.description.length>30?e.description.substring(0,30)+'..':e.description}
                      </Card.Text>
                      <div style={{position: 'absolute', top: 0, right: 0}}>
                        <Button variant="primary"  onClick={handleShow}><FaPencilAlt /></Button>
                        <Button variant="danger" data-no={e.no} onClick={handleDelete.bind(null, e.no)}><FaTrashAlt /></Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
          {loading?(<center ><Spinner animation="border" variant="danger" /> <span style={{fontSize: 30}}>loading</span></center>):null}
        </div>

        <div>
          footer
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="form-product" onSubmit={(e)=>{e.preventDefault();handleSubmit(form);}}>
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" name="sku" placeholder="Enter SKU"  onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter name" onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" step="0.01" name="price" placeholder="Enter Price" onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" rows={3}  onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" placeholder="Password"  onChange={handleChange}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type = 'submit' form="form-product"  variant="primary" >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default Produk;
