interface cardProps{
  image: string;
  name: string;
  price: string;
}

export default function Card({image, name, price}: cardProps) {
  return (
    <div className="bg-neutral-700 bg-opacity-80 rounded">
      <div>
        <img className="thumbnail rounded rounded-b-none" src={image} alt="" />
      </div>
      <div className=" px-3 py-2">
      <p className=" my-1">{name}</p>
      <p className=" my-1">{price}</p>
      <div className=" flex justify-between">
        <button className=" bg-orange-500 px-2 rounded-sm">Buy</button>
        <button className=" bg-yellow-500 px-2 rounded-sm">Add to Cart</button>
      </div>
      </div>
    </div>
  );
}
