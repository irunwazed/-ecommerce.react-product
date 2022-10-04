import "../assets/css/Produk.css";
import React, { useState } from "react";
import {Button, Modal, Card, Form, Spinner, Alert } from "react-bootstrap";
import axios from 'axios';
import { FaTrashAlt, FaPencilAlt,FaPlusCircle, FaEyeSlash, FaMoneyBillAlt } from 'react-icons/fa';


const baseUrl = 'http://127.0.0.1:8000/';
const TOKEN = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

const unescapeHTML = (escapedHTML) => {
	if(escapedHTML === '' || escapedHTML === null){
		return '';
	}
  return stripHtml(escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
}
function stripHtml(html)
{
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

const AlertDismissibleExample = ({notif, judul, isi, status}) => {
  // const [show, setShow] = useState(false);
	// console.log({notif, judul, isi, status});
	// const tes = notif;
	// console.log({notif, judul, isi, status});
  if (notif) {
    return (
      <Alert variant={status} >
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


class Produk extends React.Component {

  constructor(){
    super();
    this.state = {
      products: [],
      page: 1,
      loading: false,
      loadingAll: false,
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
		this.checkLogin();
    this.getProduct();
  }


	checkLogin = () => {
			axios.get(baseUrl+'api/cek-login').then(res => {
					console.log(res);

			}).catch(err => {
				console.log(err.message);
				window.location.replace("/login");
			})
	}

	getALlProduct = () => {
		var result = window.confirm("semua data akan terhapus, dan semua data di elevenia akan dimasukkan bila SKU ada dan berbeda. Apakah anda yakin?");
    if (result){
			this.setState({loadingAll: true});
			axios.get(baseUrl+'elevenia/set-product').then(res => {
				this.getProduct();
				this.setState({loadingAll: false});
			}).catch(err => {
				console.log(err.message);
				this.setState({loadingAll: false});
			})
		}
	}

  handleSubmit = (_data) => {
    const data = new FormData() ;
    Object.keys(_data).forEach(e => {
      data.append(e, _data[e]);
    })
    axios.post(baseUrl+'api/product', data).then(res => {
      let alert =  {
				status: 'danger',
				notif: true,
				judul: res.data.message,
				isi: '',
			}
			console.log(res);
			if(res.data.statusCode === 200){
				// this.getProduct();
				alert =  {
					status: 'success',
					notif: true,
					judul: res.data.message,
					isi: '',
				}

				setTimeout( ()=> { window.location.reload() }, 2000 );
			}
			this.setState({alert: alert});


    }).catch(err => {
      console.log(err.message);
    })
    
  }

	handleEditSubmit = (data) => {
    axios.get(baseUrl+'elevenia/harga-edit/'+data.no+'/'+data.price).then(res => {
      console.log(res);
			let alert =  {
				status: 'danger',
				notif: true,
				judul: res.data.message,
				isi: '',
			}
			let products = this.state.products;
			if(res.data.statusCode === '200'){
				alert =  {
					status: 'success',
					notif: true,
					judul: res.data.message,
					isi: '',
				}
				products = []
				for(let i = 0; i < this.state.products.length; i++){
					if(this.state.products[i].no === data.no){
						products.push({
							_id: this.state.products[i]._id,
							no: this.state.products[i].no,
							sku: this.state.products[i].sku,
							name: this.state.products[i].name,
							price: data.price,
							image: this.state.products[i].image,
							description: this.state.products[i].description,
						})
					}else{
						products.push({
							_id: this.state.products[i]._id,
							no: this.state.products[i].no,
							sku: this.state.products[i].sku,
							name: this.state.products[i].name,
							price: this.state.products[i].price,
							image: this.state.products[i].image,
							description: this.state.products[i].description,
						})
					}
				}
			}
			this.setState({alert: alert, products: products});
    }).catch(err => {
      console.log(err.message);
    })
  }



	handleEditSubmitProduct = (_data) => {

    const data = new FormData() ;
    Object.keys(_data).forEach(e => {
      data.append(e, _data[e]);
    })
    axios.put(baseUrl+'api/product/'+data.no, data).then(res => {
			let alert =  {
				status: 'danger',
				notif: true,
				judul: res.data.message,
				isi: '',
			}
			let products = this.state.products;
			if(res.data.statusCode === 200){
				alert =  {
					status: 'success',
					notif: true,
					judul: res.data.message,
					isi: '',
				}
				products = []
				for(let i = 0; i < this.state.products.length; i++){
					if(this.state.products[i].no === data.no){
						products.push({
							_id: data._id,
							no: data.no,
							sku: data.sku,
							name: data.name,
							price: data.price,
							image: data.image,
							description: data.description,
						})
					}else{
						products.push({
							_id: this.state.products[i]._id,
							no: this.state.products[i].no,
							sku: this.state.products[i].sku,
							name: this.state.products[i].name,
							price: this.state.products[i].price,
							image: this.state.products[i].image,
							description: this.state.products[i].description,
						})
					}
				}

				setTimeout( ()=> { window.location.reload() }, 2000 );
			}
			
			this.setState({alert: alert, products: products});
    }).catch(err => {
      console.log(err.message);
    })
  }

  handleDelete = (prdNo) => {
    var result = window.confirm("ingin penyembunyikan produk di elevenia?");
    if (result) {
      axios.get(baseUrl+'elevenia/hidden-product/'+prdNo).then(res => {
        let alert = {
          status: 'danger',
          notif: true,
          judul: res.data.message,
          isi: '',
        }
				if(res.data.statusCode === '200'){
					alert =  {
						status: 'success',
						notif: true,
						judul: res.data.message,
						isi: '',
					}
				}
				this.setState({alert: alert});
      }).catch(err => {
        console.log(err.message);
      })
    }
  }


  handleDeleteProduct = (prdNo) => {
    var result = window.confirm("ingin menghapus data di database?");
    if (result) {
      axios.delete(baseUrl+'api/product/'+prdNo).then(res => {
        let alert = {
          status: 'danger',
          notif: true,
          judul: res.data.message,
          isi: '',
        }
				console.log(res);
				let products = this.state.products;
				if(res.data.statusCode === 200){
					alert =  {
						status: 'success',
						notif: true,
						judul: res.data.message,
						isi: '',
					}
					products = []
					for(let i = 0; i < this.state.products.length; i++){
						if(this.state.products[i].no !== prdNo){
							products.push({
								_id: this.state.products[i]._id,
								no: this.state.products[i].no,
								sku: this.state.products[i].sku,
								name: this.state.products[i].name,
								price: this.state.products[i].price,
								image: this.state.products[i].image,
								description: this.state.products[i].description,
							})
						}
					}
				}
				this.setState({alert: alert, products: products});
      }).catch(err => {
        console.log(err.message);
      })
    }
  }

  getProduct = async (page = null) => {
		if(page === null){
			page = this.state.page;
		}
		this.setState({loading: true});
    axios.get(baseUrl+'api/product?page='+page).then(res => {
      // console.log(res.data.data);
      let data = res.data.data;
      
			let product = [];

			data.forEach(row => {
				let masuk = true;
				this.state.products.forEach(e=>{
					if(e._id ===  row._id){
						masuk = false;
					}
				})
				if(masuk){
					product.push(row);
				}
			})
      this.setState({products: this.state.products.concat(product), page: page + 1, loading: false})
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
		if(this.state.loadingAll){
			return (
				<center ><Spinner animation="border" variant="danger" /> <span style={{fontSize: 30}}>loading</span></center>
			)
		}
    return(
      <DisplayProduk products={this.state.products} loading={this.state.loading} handleSubmit={this.handleSubmit} handleEditSubmit={this.handleEditSubmit} handleEditSubmitProduct={this.handleEditSubmitProduct} handleDelete={this.handleDelete} handleDeleteProduct={this.handleDeleteProduct} alert={this.state.alert} getALlProduct={this.getALlProduct} />
    );
  }
}

const DisplayProduk = ({products, loading, handleSubmit, handleEditSubmit, handleEditSubmitProduct, handleDelete, handleDeleteProduct, alert, getALlProduct}) => {
  const [show, setShow] = useState(false);
	const [showEdit, setEditShow] = useState(false);
	const [showEditProduct, setEditProductShow] = useState(false);
  const [form, setForm] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);
  const handleEditProductClose = () => setEditProductShow(false);
  const handleEditProductShow = () => setEditProductShow(true);

  const handleChange = (event) => {
    const {name, value, files} = event.target;
    if(name === 'image'){
      setForm(values => ({...values, [name]: files[0]}))
    }else{
      setForm(values => ({...values, [name]: value}))
    }
  }

	const checkSubmit = (data) => {
		handleSubmit(data);
		handleClose();
	}

	const checkEditSubmit = (data) => {
		handleEditSubmit(data);
		handleEditClose()
	}

	const handleEdit = (e) => {
		handleEditShow();
    setForm({
			_id: e._id,
			no: e.no,
			price: e.price,
		})
  }

	const handleEditProduct = (e) => {
		handleEditProductShow();
    setForm({
			_id: e._id,
			no: e.no,
			sku: e.sku,
			name: e.name,
			price: e.price,
			description: e.description,
			image: e.image,
		})
  }
	const checkProductSubmit = (data) => {
		handleEditSubmitProduct(data);
		handleEditProductClose();
	}

  return (
    <div>
      <div className="container">
        <h1>Produk</h1>
        <br />
				<Button onClick={getALlProduct} variant="success" >
					Ambil Semua Produk
				</Button>
        <Button variant="primary" onClick={handleShow}>
          <FaPlusCircle /> Tambah
        </Button> 
        <AlertDismissibleExample notif={alert.notif} judul={alert.judul} isi={alert.isi} status={alert.status} />
        <div className="products">
          <div className="row">
            {products.map((e) => {
              return (
                <div className="col-sm-3" key={e._id}>
                  <Card style={{height: 400, marginBottom: 15}}>
                    <Card.Img variant="top" style={{height: 200}} src={e.image} />
                    <Card.Body>
                      <Card.Title>{e.name}</Card.Title>
                      
                      <Card.Text style={{fontWeight: 'bold'}}>Rp. {formatRupiah(e.price)}</Card.Text>
                      <Card.Text>
                        {unescapeHTML(e.description).length>80?unescapeHTML(e.description.substring(0,80))+'..':unescapeHTML(e.description)}
												{/* {unescapeHTML(e.description)} */}
                      </Card.Text>
                      <div style={{position: 'absolute', top: 0, right: 0}}>
                        <Button variant="primary"  onClick={handleEditProduct.bind(null,e)}><FaPencilAlt /></Button>
                        <Button variant="primary"  onClick={handleEdit.bind(null,e)}><FaMoneyBillAlt /></Button>
                        <Button variant="warning" onClick={handleDelete.bind(null, e.no)}><FaEyeSlash /></Button>
                        <Button variant="danger" onClick={handleDeleteProduct.bind(null, e.no)}><FaTrashAlt /></Button>
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
            <Form id="form-product" onSubmit={(e)=>{e.preventDefault();checkSubmit(form);}}>
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" name="sku" placeholder="Enter SKU"  onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter name" onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" step="0.01" name="price" placeholder="Enter Price" onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" rows={3}  onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" placeholder="Password"  onChange={handleChange} required/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button type = 'submit' form="form-product"  variant="primary" >
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>



        <Modal show={showEditProduct} onHide={handleEditProductClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="form-edit-product" onSubmit={(e)=>{e.preventDefault();checkProductSubmit(form);}}>
              <Form.Group className="mb-3">
                <Form.Label>Nomor</Form.Label>
                <Form.Control type="text" name="no"  value={form.no}  onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" name="sku" value={form.sku} onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" rows={3} value={form.description} onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
								<img alt="" style={{height: 200}} src={form.image} />
                <Form.Control type="file" name="image" placeholder="Password"  onChange={handleChange}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditProductClose}>
              Batal
            </Button>
            <Button type = 'submit' form="form-edit-product"  variant="primary" >
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEdit} onHide={handleEditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="form-product" onSubmit={(e)=>{e.preventDefault();checkEditSubmit(form);}}>
              <Form.Group className="mb-3">
                <Form.Label>Nomor</Form.Label>
                <Form.Control type="hidden" name="no" onChange={handleChange} value={form.no} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" step="0.01" name="price"  value={form.price} onChange={handleChange}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditClose}>
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
