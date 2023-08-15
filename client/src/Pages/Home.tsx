import { useContext } from "react";
import _ from 'lodash'

import { TokenContext } from "../Context/TokenContext";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";


import data from '../Data/data'


export default function Home() {
  const { partners, setPartners, wallet } = useContext(TokenContext);
  
  const becomePartner = ()=>{
    const accountAddress = wallet.accounts[0];

    const newArr = partners.concat([accountAddress])

    if(partners[0] == "") return setPartners(newArr.slice(1,newArr.length))
    setPartners(newArr);
  }

  return (
    <>
      <Navbar />

    

    <div >
      <button className=" fixed right-4 bottom-10 bg-sky-500 p-2">Become a Partner</button>

      <div className="grid grid-cols-4 gap-4">

      {
        data.map((d)=>
        {
          
          return (
          <div className="col-span-1">
          <Card
            image={d.img}
            name={d.name}
            price={d.price}
          />
        </div>
          )
        })
      }

{/*         
        <div className="col-span-1">
          <Card
            image={Iphone}
            name="Apple iPhone 14 Pro Max"
            price="₹ 1,27,999"
          />
        </div>
          <div className="col-span-1">
          <Card
            image={SonyHeadphones}
            name="SONY Bluetooth Headset"
            price="₹ 22,990"
          />
        </div>
        <div className="col-span-1 ">
          <Card
           image={trolley}
           name="Trolley-Luggage"
           price="₹ 12,999"
          />
        </div>
        <div className="col-span-1">
          <Card
            image={TV}
            name="SAMSUNG TV "
            price="₹ 42,990"
          />
        </div><div className="col-span-1">
          <Card
            image={tshirt}
            name="T-Shirt"
            price="₹ 299"
          />
        </div><div className="col-span-1">
          <Card
            image={cycle}
            name="FireFox cycle"
            price="₹ 25,990"
          />
        </div>
        <div className="col-span-1">
          <Card
            image={hoodies}
            name="Hoodies"
            price="₹ 999"
          />
          </div>
          <div className="col-span-1">
          <Card
            image={shoes}
            name="Ultra-Boot Shoes"
            price="₹ 18,990"
          />
          </div><div className="col-span-1">
          <Card
            image={kalash}
            name="Kalash"
            price="₹ 399"
          />
          </div><div className="col-span-1">
          <Card
            image={shavers}
            name="Shaver"
            price="₹ 1,649"
          />
          </div><div className="col-span-1">
          <Card
            image={butter}
            name="Peanut Butter"
            price="₹ 250"
          />
          </div><div className="col-span-1">
          <Card
            image={car_washer}
            name="Car Pressure Washer"
            price="₹ 9,490"
          />
          </div> */}
      </div>  

     </div>    
      
    </>
  );
}
