import React, { useEffect } from 'react';

import Layout from './Layout';
import messages from './messages';
import './styles/App.scss';
import 'antd/dist/antd.css'
import Dashboard from './pages/dashboard/Dashboard';
import {
  Route, Switch
} from "react-router-dom";
import withAuth from './withAuth/withAuth'
import {useDispatch,useSelector} from 'react-redux'
import {setCategories,setBrands,setMedia} from './actions/generalData'


import Login from './pages/auth/Login';
import Brand from './pages/brand';
import Campaigns from './pages/campaigns/Campaigns';
import Campaign from './pages/campaigns/Campaign';
import CreateProduct from './pages/product/CreateProduct';
import EditProduct from './pages/product/EditProduct';
import Attributes from './pages/product/Attributes';
import ProductList from './pages/product/ProductList';
import BulkImport from './pages/product/BulkImport';
import BulkExport from './pages/product/BulkExport';
import CaterogyList from './pages/category/Category';
import Orders from './pages/orders/Orders';
import OrderDetails from './pages/orders/OrderDetails';
import Customers from './pages/customers';
import PaymentMethod from './pages/paymentmethod/PaymentMethod';
import Slider from './pages/website/Slider';
import Analytics from './pages/website/Analytics';
import Register from './pages/auth/Register';
import SMTP from './pages/settings/SMTP';
import ImageStorage from './pages/settings/ImageStorage';
import LiveChat from './pages/settings/LiveChat';
import ImportDemo from './pages/settings/ImportDemo';
import ProductReviews from './pages/reviews/ProductReviews';






function App() {
  let dispatch = useDispatch()
  const {authenticated} = useSelector(state => state.auth)


useEffect(() => {
  if(authenticated){
    dispatch(setMedia())
    dispatch(setCategories())
    dispatch(setBrands())
  }
 
}, [authenticated])



  return (
    

      <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
        <Layout>
          <Route exact path="/" component={Dashboard} />
          
          <Route path="/brands" component={Brand} />
          <Route exact path="/campaigns/:campaignid" component={Campaign} />
          <Route exact path="/campaigns" component={Campaigns} />


          <Route  path="/product/create" component={CreateProduct} />
          <Route  path="/product/edit/:productslug" component={EditProduct} />
          <Route  path="/product/attribute" component={Attributes} />
          <Route  path="/product/productlist" component={ProductList} />
          <Route  path="/product/bulk-import" component={BulkImport} />
          <Route  path="/product/bulk-export" component={BulkExport} />

          <Route  path="/categories" component={CaterogyList} />

          <Route  path="/product-reviews" component={ProductReviews} />
          <Route  path="/orders" component={Orders} />
          <Route  path="/order/details/:invoice" component={OrderDetails} />

          <Route  path="/customers" component={Customers} />

          <Route  path="/payment-method" component={PaymentMethod} />

          <Route  path="/website/slider" component={Slider} />
          <Route  path="/website/analytics" component={Analytics} />

          <Route  path="/settings/smtp" component={SMTP} />
          <Route  path="/settings/image-storage" component={ImageStorage} />
          <Route  path="/settings/live-chat" component={LiveChat} />
          <Route  path="/settings/import-demo" component={ImportDemo} />
        </Layout>
      </Switch>


  );
}

export default withAuth(App);
