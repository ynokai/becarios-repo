import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { ideal: 300 },
            height: { ideal: 200 },
            advanced: [{ willReadFrequently: true }]
          }
        },
        decoder: {
          readers: ["ean_reader"],
          multiple: false
        },
        locate: false
      }, (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      });

      const handleDetected = (data) => {
        console.log("Datos detectados:", data);
        const code = data.codeResult && data.codeResult.code;
        if (code) {
          onDetected(code);
          Quagga.stop();
        }
      };

      Quagga.onDetected(handleDetected);

      return () => {
        Quagga.offDetected(handleDetected);
        Quagga.stop();
      };
    }
  }, [onDetected]);

  return (
    <div
      ref={scannerRef}
      style={{
        width: "300px",
        height: "200px",
        border: "1px solid #ccc",
        backgroundColor: "#eee"
      }}
    ></div>
  );
}

export default BarcodeScanner;