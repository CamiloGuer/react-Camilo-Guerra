import React, {useState, useContext} from 'react'
import ItemCount from '../ItemCount'
import { useNavigate } from 'react-router-dom'
import { Shop } from '../../context/ShopProvider';


const ItemDetail = ({ product }) => {
    const [qty, setQty] = useState(0);
    const navigate = useNavigate();
    const {addItem} = useContext(Shop)


    const addCart = (quantity) => {
        setQty(quantity);
        addItem(product, quantity)
    };


    const handleFinish = () => {
        navigate("/cart");
    };


    return (
        <div className="detail-container">
            <img
                className="detail-img"
                src={product.image}
                alt="product-detail"
            />
            <div className="detail-subcontainer">
                <h1>{product.title}</h1>
                {qty ? (
                    <button onClick={handleFinish}>Finalizar compra</button>
                ) : (
                    <ItemCount stock={8} initial={1} onAdd={addCart} />
                )}
            </div>
        </div>
    );
};


export default ItemDetail;