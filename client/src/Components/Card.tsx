import { useRef } from "react";
import { useContext } from "react";

import { TokenContext } from "../Context/TokenContext";
interface cardProps {
  image: string;
  name: string;
  price: string;
}

export default function Card({ image, name, price }: cardProps) {
  const modalRef = useRef(null);

  const { contract } = useContext(TokenContext);

  window.onclick = (event) => {
    const modal: any = modalRef.current;
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const toggleModal = () => {
    const modal: any = modalRef.current;

    let displayProperty = modal.style.display;
    if (displayProperty === "block") return (modal.style.display = "none");
    modal.style.display = "block";
  };

  const buyProduct = () => {
    console.log(`You bought the product ${name}`);
    toggleModal();
  };
  const buyWithSuperToken = async () => {
    // These two values has to change
    const sellerAddress = "0xF51Cb8b7fFF47c28E31E163Ab10b9f3CC6389618";
    const price = 1;

    contract && (await contract.useTokens(sellerAddress, price));

    toggleModal();
  };

  return (
    <>
      {/* New Doc Modal */}
      <div id="myModal" className="modal" ref={modalRef}>
        <div className="modal-content relative">
          <span className="close" onClick={toggleModal}>
            &times;
          </span>
          <img src={image} alt="" />
          <div className="flex justify-between my-2">
            <p className=" text-black">{name}</p>
            <p className=" text-black">{price}</p>
          </div>
          <hr />
          <div className="modal-body">
            <div>
              <div>
                <button onClick={buyProduct} className="submit">
                  Buy
                </button>
                <button onClick={buyWithSuperToken} className="create">
                  Buy With Super Token
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-700 bg-opacity-80 rounded">
        <div>
          <img
            className="thumbnail rounded rounded-b-none"
            src={image}
            alt=""
          />
        </div>
        <div className=" px-3 py-2">
          <p className=" my-1">{name}</p>
          <p className=" my-1">{price}</p>
          <div className=" flex justify-between">
            <button
              className=" bg-orange-500 px-2 rounded-sm"
              onClick={toggleModal}
            >
              Buy
            </button>
            <button className=" bg-yellow-500 px-2 rounded-sm">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
