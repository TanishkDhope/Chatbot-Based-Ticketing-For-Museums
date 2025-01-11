import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import './QrCodeScanner.css';
import StickyNavbar from './StickyNavbar';

const QrCodeScanner = () => {
  const [qrData, setQrData] = useState('No result');
  const [isScannerVisible, setIsScannerVisible] = useState(true);

  const handleScan = (data) => {
    if (data) {
      setQrData(data);
      setIsScannerVisible(false); // Hide scanner when data is received
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleRescan = () => {
    setQrData('No result');
    setIsScannerVisible(true); // Show scanner again
  };

  return (
    <>
    <StickyNavbar/>
    <div className="qr-scanner-container">
      <h2 className="qr-scanner-title">QR Code Scanner</h2>

      {isScannerVisible ? (
        <div className="qr-scanner-box">
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                handleScan(result?.text);
              }
              if (!!error) {
                handleError(error);
              }
            }}
            className="qr-scanner"
          />
        </div>
      ) : (
        <div className="qr-result-container">
          <h3 className="qr-result-title">Scanned Data:</h3>
          <p className="qr-result-text">{qrData}</p>
          <button className="rescan-button" onClick={handleRescan}>
            Scan Another QR Code
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default QrCodeScanner;
