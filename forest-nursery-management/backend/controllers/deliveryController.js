const Delivery = require('../models/Delivery');
const Message = require('../models/Message');
const Site = require('../models/Site');

// Get all deliveries
const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add delivery and send notification
const addDelivery = async (req, res) => {
  try {
    const { siteId, siteName, plants, deliveryDate, driverName, vehicleNo, instructions } = req.body;

    const delivery = await Delivery.create({
      siteId, siteName, plants, deliveryDate, driverName, vehicleNo, instructions
    });

    // Build plant list for message
    const plantList = plants.map(p => `${p.plantName} x${p.quantity}`).join(', ');

    // Auto-create notification message
    await Message.create({
      deliveryId: delivery.deliveryId,
      title: `Delivery Scheduled: ${delivery.deliveryId}`,
      body: `Delivery ID: ${delivery.deliveryId}\nSite: ${siteName}\nPlants: ${plantList}\nDate: ${new Date(deliveryDate).toLocaleDateString()}\nDriver: ${driverName || 'N/A'}\nVehicle: ${vehicleNo || 'N/A'}\nInstructions: ${instructions || 'None'}`,
      recipients: [
        { name: 'Manager', role: 'Manager' },
        { name: 'Driver', role: 'Driver' },
        { name: 'Supervisor', role: 'Supervisor' },
        { name: 'Site Incharge', role: 'Site Incharge' }
      ],
      type: 'Delivery'
    });

    res.status(201).json({ message: 'Delivery created, notifications sent', delivery });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update delivery status
const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    // If marked delivered, update site plant count
    if (req.body.status === 'Delivered') {
      const totalPlants = delivery.plants.reduce((sum, p) => sum + p.quantity, 0);
      await Site.findByIdAndUpdate(delivery.siteId, { $inc: { totalPlantsDelivered: totalPlants } });
    }

    res.json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDelivery = async (req, res) => {
  try {
    await Delivery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Delivery deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDeliveries, addDelivery, updateDelivery, deleteDelivery };
