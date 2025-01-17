import QRCode from 'qrcode';

export async function generateQrcode(data, options = {}) {
  try {
    const inputData = typeof data === 'object' ? JSON.stringify(data) : data.toString();
    const result = await QRCode.toDataURL(inputData, options);
    return result;
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw error;
  }
}

let session = {
  session: "html",
  date: "now",
};

    const qrcode = await generateQrcode(session);
    console.log(qrcode); 
