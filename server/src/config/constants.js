module.exports = {
  ROLES: {
    ADMIN: 'admin',
    STAFF: 'staff',
  },
  ORDER_STATUS: [
    'pending',
    'cutting',
    'stitching',
    'finishing',
    'ready',
    'delivered',
    'cancelled',
  ],
  PAYMENT_STATUS: ['paid', 'partial', 'unpaid'],
  PAYMENT_METHODS: ['cash', 'upi', 'card'],
  PRIORITIES: ['low', 'medium', 'high'],
};