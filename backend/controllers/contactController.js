const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact enquiry (Public)
// @route   POST /api/contact
// @access  Public
const submitMessage = async (req, res) => {
  try {
    const { name, mobile, email, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      mobile,
      email,
      message,
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Contact submission error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error submitting contact message' });
  }
};

// @desc    Get all contact messages with search (Admin)
// @route   GET /api/contact
// @access  Private (Admin only)
const getAllMessages = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching contact messages' });
  }
};

// @desc    Delete a contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ success: false, message: 'Server error deleting contact message' });
  }
};

module.exports = {
  submitMessage,
  getAllMessages,
  deleteMessage,
};
