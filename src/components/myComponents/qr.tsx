import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import QRCode from 'qrcode'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface QRCodeHandlerProps {
  onScan: (data: string) => void
  data?: string
  generateQRCode?: boolean
}

export default function QRCodeHandler({ onScan, data, generateQRCode = false }: QRCodeHandlerProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (showScanner) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        /* verbose= */ false
      )
      scannerRef.current.render(handleScan, handleError)
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [showScanner])

  useEffect(() => {
    if (generateQRCode && data) {
      generateQR()
    }
  }, [data, generateQRCode])

  const handleScan = (decodedText: string) => {
    onScan(decodedText)
    setShowScanner(false)
  }

  const handleError = (err: string | Error) => {
    console.error(err)
  }

  const generateQR = async () => {
      if (data) {
        console.log("from function");
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(data, { width: 300, margin: 2 })
        setQrCodeImage(qrCodeDataUrl)
      } catch (err) {
        console.error('Failed to generate QR code:', err)
      }
    }
  }

  return (
    <div>
      <Button onClick={() => setShowScanner(true)} className="mb-4">
        Scan QR Code
      </Button>
      {generateQRCode && (
        <Button onClick={generateQR} className="ml-4 mb-4">
          Generate QR Code
        </Button>
      )}
      {qrCodeImage && (
        <div className="mt-4">
          <img src={qrCodeImage} alt="Generated QR Code" />
        </div>
      )}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code within the camera frame to scan.
            </DialogDescription>
          </DialogHeader>
          <div id="qr-reader" className="w-full"></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}