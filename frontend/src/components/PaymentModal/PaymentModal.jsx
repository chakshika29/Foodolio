import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ amount, currency = "₹", onClose, onSuccess }) => {
    const [method, setMethod] = useState("card"); // 'card' | 'upi' | 'netbanking'
    const [status, setStatus] = useState("idle"); // 'idle' | 'processing' | 'success'
    const [txnId, setTxnId] = useState("");

    // Card Form State
    const [cardData, setCardData] = useState({
        number: "4532 8920 1142 9845",
        name: "Chakshika Pawar",
        expiry: "08/29",
        cvv: "342"
    });

    // UPI State
    const [upiApp, setUpiApp] = useState("gpay");
    const [upiId, setUpiId] = useState("chakshika@okhdfcbank");

    // Net Banking State
    const [selectedBank, setSelectedBank] = useState("HDFC Bank");

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 16);
        return cleaned.replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 4);
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        return cleaned;
    };

    const getCardBrand = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('6')) return 'RuPay';
        return 'Card';
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        if (name === 'number') {
            setCardData(prev => ({ ...prev, number: formatCardNumber(value) }));
        } else if (name === 'expiry') {
            setCardData(prev => ({ ...prev, expiry: formatExpiry(value) }));
        } else if (name === 'cvv') {
            setCardData(prev => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) }));
        } else {
            setCardData(prev => ({ ...prev, [name]: value }));
        }
    };

    const processPayment = (paymentMethodName) => {
        setStatus("processing");
        const generatedTxnId = `FOOD_TXN_${Date.now().toString().slice(-8)}`;
        setTxnId(generatedTxnId);

        setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
                onSuccess(paymentMethodName, generatedTxnId);
            }, 1200);
        }, 1600);
    };

    return (
        <div className="payment-modal-overlay" onClick={onClose}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                
                {status === "idle" && (
                    <>
                        <div className="payment-modal-header">
                            <div>
                                <h3>Complete Payment</h3>
                                <p className="secure-badge">
                                    <span className="lock-icon">🔒</span> 256-bit Bank Grade Secure Checkout
                                </p>
                            </div>
                            <button className="payment-modal-close" onClick={onClose}>✕</button>
                        </div>

                        <div className="payment-amount-banner">
                            <span className="amount-label">Amount Payable:</span>
                            <span className="amount-val">{currency}{amount}</span>
                        </div>

                        <div className="payment-tabs">
                            <button 
                                type="button" 
                                className={`payment-tab ${method === "card" ? "active" : ""}`}
                                onClick={() => setMethod("card")}
                            >
                                💳 Card
                            </button>
                            <button 
                                type="button" 
                                className={`payment-tab ${method === "upi" ? "active" : ""}`}
                                onClick={() => setMethod("upi")}
                            >
                                📱 UPI / QR
                            </button>
                            <button 
                                type="button" 
                                className={`payment-tab ${method === "netbanking" ? "active" : ""}`}
                                onClick={() => setMethod("netbanking")}
                            >
                                🏦 Net Banking
                            </button>
                        </div>

                        <div className="payment-tab-content">
                            {method === "card" && (
                                <div className="card-form">
                                    <div className="form-group">
                                        <label>Card Number <span className="card-brand-badge">{getCardBrand(cardData.number)}</span></label>
                                        <input 
                                            type="text" 
                                            name="number" 
                                            value={cardData.number} 
                                            onChange={handleCardChange}
                                            placeholder="1234 5678 9012 3456" 
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cardholder Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={cardData.name} 
                                            onChange={handleCardChange}
                                            placeholder="Name on card" 
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input 
                                                type="text" 
                                                name="expiry" 
                                                value={cardData.expiry} 
                                                onChange={handleCardChange}
                                                placeholder="MM/YY" 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV / CVC</label>
                                            <input 
                                                type="password" 
                                                name="cvv" 
                                                value={cardData.cvv} 
                                                onChange={handleCardChange}
                                                placeholder="•••" 
                                                maxLength="4"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="pay-now-btn"
                                        onClick={() => processPayment(`Card (${getCardBrand(cardData.number)})`)}
                                    >
                                        Pay {currency}{amount} Now
                                    </button>
                                </div>
                            )}

                            {method === "upi" && (
                                <div className="upi-form">
                                    <p className="upi-subtitle">Select your preferred UPI App or enter UPI ID:</p>
                                    <div className="upi-apps-grid">
                                        {[
                                            { id: 'gpay', name: 'Google Pay', icon: '🟢 GPay' },
                                            { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                                            { id: 'paytm', name: 'Paytm', icon: '🔵 Paytm' },
                                            { id: 'bhim', name: 'BHIM UPI', icon: '🟠 BHIM' }
                                        ].map(app => (
                                            <div 
                                                key={app.id} 
                                                className={`upi-app-card ${upiApp === app.id ? "selected" : ""}`}
                                                onClick={() => {
                                                    setUpiApp(app.id);
                                                    setUpiId(prev => prev.split('@')[0] + (app.id === 'gpay' ? '@okaxis' : app.id === 'phonepe' ? '@ybl' : '@paytm'));
                                                }}
                                            >
                                                <span>{app.icon}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-group">
                                        <label>UPI ID (VPA)</label>
                                        <input 
                                            type="text" 
                                            value={upiId} 
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="username@bank" 
                                            required
                                        />
                                    </div>
                                    <div className="upi-qr-preview">
                                        <div className="qr-box">
                                            <div className="qr-corner top-left"></div>
                                            <div className="qr-corner top-right"></div>
                                            <div className="qr-corner bottom-left"></div>
                                            <div className="qr-corner bottom-right"></div>
                                            <span className="qr-icon">📱</span>
                                            <p className="qr-text">Scan & Pay via any UPI App</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="pay-now-btn"
                                        onClick={() => processPayment(`UPI (${upiId || upiApp.toUpperCase()})`)}
                                    >
                                        Verify & Pay {currency}{amount}
                                    </button>
                                </div>
                            )}

                            {method === "netbanking" && (
                                <div className="netbanking-form">
                                    <p className="nb-subtitle">Select your bank for instant checkout:</p>
                                    <div className="banks-grid">
                                        {[
                                            "HDFC Bank",
                                            "State Bank of India",
                                            "ICICI Bank",
                                            "Axis Bank",
                                            "Kotak Bank",
                                            "Punjab National Bank"
                                        ].map(bank => (
                                            <div 
                                                key={bank}
                                                className={`bank-card ${selectedBank === bank ? "selected" : ""}`}
                                                onClick={() => setSelectedBank(bank)}
                                            >
                                                <span>🏛️</span>
                                                <p>{bank}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        type="button" 
                                        className="pay-now-btn"
                                        onClick={() => processPayment(`NetBanking (${selectedBank})`)}
                                    >
                                        Pay {currency}{amount} with {selectedBank}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {status === "processing" && (
                    <div className="payment-processing-state">
                        <div className="payment-spinner"></div>
                        <h4>Contacting Payment Gateway...</h4>
                        <p>Please do not refresh or close this window.</p>
                        <p className="sub-hint">Authorizing {currency}{amount} with bank server...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="payment-success-state">
                        <div className="success-checkmark">
                            <span>✓</span>
                        </div>
                        <h3>Payment Successful!</h3>
                        <p className="success-amount">{currency}{amount} Paid</p>
                        <p className="success-txn">Transaction ID: <b>{txnId}</b></p>
                        <p className="success-redirect">Confirming your food order...</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentModal;
