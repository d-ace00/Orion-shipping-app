const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const shipments = [
  {
    trackingNumber: "SWIFT1001",
    customer: "John Doe",
    destination: "Douala, Cameroon",
    status: "In Transit"
  },
  {
    trackingNumber: "SWIFT1002",
    customer: "Mary Smith",
    destination: "Yaoundé, Cameroon",
    status: "Delivered"
  }
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/shipments", (req, res) => {
  res.json(shipments);
});

app.get("/api/shipments/:trackingNumber", (req, res) => {
  const shipment = shipments.find(
    item =>
      item.trackingNumber.toLowerCase() ===
      req.params.trackingNumber.toLowerCase()
  );

  if (!shipment) {
    return res.status(404).json({ message: "Shipment not found" });
  }

  res.json(shipment);
});

app.post("/api/shipments", (req, res) => {
  const { customer, destination } = req.body;

  if (!customer || !destination) {
    return res.status(400).json({
      message: "Customer and destination are required"
    });
  }

  const newShipment = {
    trackingNumber: `SWIFT${1000 + shipments.length + 1}`,
    customer,
    destination,
    status: "Processing"
  };

  shipments.push(newShipment);
  res.status(201).json(newShipment);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SwiftShip Logistics running on port ${PORT}`);
});
