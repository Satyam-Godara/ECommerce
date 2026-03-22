import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct } from "../services/productService";
import { useCart } from "../context/CartContext";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
  }, []);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div>
      <img src={product.image} width="250" />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <button onClick={() => addToCart(product)}>Add To Cart 🛒</button>
    </div>
  );
}
