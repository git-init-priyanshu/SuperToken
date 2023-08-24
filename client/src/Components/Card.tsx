import { useRef } from "react";
import { useContext } from "react";

import { TokenContext } from "../Context/TokenContext";
import { ethers } from "ethers";
interface cardProps {
  sellerName: string;
  sellerAddress: string;
  image: string;
  name: string;
  price: number;
  tokenValue: number;
  contract: ethers.Contract | null;
}

export default function Card({
  sellerName,
  sellerAddress,
  image,
  name,
  price,
  // @ts-ignore
  tokenValue,
  contract,
}: cardProps) {
  const modalRef = useRef(null);

  const { wallet } = useContext(TokenContext);

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

  const buyProduct = async () => {
    console.log(`You bought the product ${name}`);

    // Random change to get super tokens
    if (!contract) return;
    const owner = await contract.owner();

    //2% of the price or 50 tokens, whatever is samller
    const tokens = Math.min(Math.round(price * 0.02), 50);

    toggleModal();

    await contract.issueTokens(owner, wallet.accounts[0], tokens);
  };
  const buyWithSuperToken = async () => {
    const tokenValue = 5;

    const productPriceInToken = price / tokenValue;
    contract &&
      (await contract.useTokens(
        wallet.accounts[0],
        sellerAddress,
        productPriceInToken,
        productPriceInToken
      ));

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

      <div className="bg-neutral-700 bg-opacity-80 rounded overflow-hidden">
        <div>
          <img
            className="thumbnail rounded rounded-b-none"
            src={image}
            alt=""
          />
        </div>
        <div className=" px-3 py-2">
          <div className=" my-1 flex justify-between overflow-hidden">
            <p>{name}</p>
            <p className=" font-light">{sellerName}</p>
          </div>
          <p className=" my-1">₹ {price}</p>
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
