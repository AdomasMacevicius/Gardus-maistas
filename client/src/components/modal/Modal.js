import { useState } from 'react';
import './Modal.css';

export default function Modal(props) {
    const [modal, setModal] = useState(false);

    const ToggleModal = () => {
        setModal(!modal);
    }

    return (
        <>
            <div className="pb-4">
                <button onClick={ToggleModal} className="btn btn-success text">Papildoma informacija</button>
            </div>
            {modal && (
                <div>
                    <div onClick={ToggleModal} className="Overlay"></div>
                    <div className="modal-content">
                        <div className="d-flex justify-content-end pb-3">
                            <button onClick={ToggleModal} className="btn btn-success w-25">Uždaryti</button>
                        </div>
                        <h4><b>Telefono numeris: {props.restaurant.phoneNumber}</b></h4>
                        <h4><b>Kainų įvertinimas: {props.restaurant.priceRating}</b></h4>
                    </div>
                </div>
            )}
        </>
    );
}