import React,{useState,useEffect} from 'react';
import axios from 'axios'
import './dashboard.scss'

const Main = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    axios.get('/settings/gettotalinfo')
      .then(res => {
        const { products, users, categories, brands } = res.data
        setData(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <div className='dashboard'>

      <div className="row">

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-primary">
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.users:0}</div>
              <div>Total customers</div>
            </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-info" >
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.products:0}</div>
              <div>Total Products</div>
            </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-warning">
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.categories:0}</div>
              <div>Total Categories</div>
            </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-danger" >
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.brands:0}</div>
              <div>Total Brands</div>
            </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
};

export default Main;
