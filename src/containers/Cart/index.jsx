import React, { useContext, useState } from "react";
import { Shop } from "../../context/ShopProvider";
import ordenGenerada from "../../Services/generarOrden";

import { DataGrid } from "@mui/x-data-grid";
import { Button, CircularProgress } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const Cart = () => {
    const { cart, removeItem, clearCart, total } = useContext(Shop);

    const [loading, setLoading] = useState(false);

    const renderImage = (image) => {
        return (
            <img
                src={image.value}
                alt="cart-product"
                style={{ height: "120px" }}
            ></img>
        );
    };

    const renderRemoveButton = (item) => {
        const product = item.value;
        return (
            <Button
                onClick={() => removeItem(product)}
                variant="contained"
                color="error"
            >
                Remove
            </Button>
        );
    };

    const handleBuy = async () => {
        setLoading(true)
        const importeTotal = total();
        const orden = ordenGenerada(
            "Nombre",
            "mail@live.com",
            11111111111,
            cart,
            importeTotal
        );
        console.log(orden);

        const docRef = await addDoc(collection(db, "orders"), orden);

        cart.forEach(async (productoEnCarrito) => {
            const productRef = doc(db, "products", productoEnCarrito.id);
            const productSnap = await getDoc(productRef);
            await updateDoc(productRef, {
                stock: productSnap.data().stock - productoEnCarrito.quantity,
            });
        });
        setLoading(false);
        alert(
            `Gracias por su compra! Se generó la orden generada con ID: ${docRef.id}`
        );
    };

    const columns = [
        {
            field: "image",
            headerName: "Image",
            width: 250,
            renderCell: renderImage,
        },
        { field: "title", headerName: "Product", width: 450 },
        { field: "quantity", headerName: "Quantity", width: 80 },
        {
            field: "remove",
            headerName: "Remove",
            renderCell: renderRemoveButton,
            width: 120,
        },
    ];

    const filas = [];
    cart.forEach((item) => {
        filas.push({
            id: item.id,
            image: item.image,
            title: item.title,
            quantity: item.quantity,
            remove: item,
        });
    });

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={filas}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                rowHeight={150}
            />
            <Button onClick={clearCart} color="error" variant="outlined">
                Clear cart
            </Button>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress/>
                </div>
            ) : (
                <Button onClick={handleBuy}>Confirmar compra</Button>
            )}
        </div>
    );
};

export default Cart;