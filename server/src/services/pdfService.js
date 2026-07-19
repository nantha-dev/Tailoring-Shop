const PDFDocument = require('pdfkit');

exports.generateOrdersPDF = (orders) => {
  const doc = new PDFDocument({ margin: 30 });
  doc.fontSize(16).text('Orders Report', { align: 'center' });
  doc.moveDown();
  orders.forEach((order, index) => {
    doc.fontSize(10).text(
      `${index + 1}. ${order.orderNumber} - ${order.customer?.name || 'N/A'} - ${order.status} - ${new Date(order.orderDate).toLocaleDateString()}`
    );
  });
  return doc;
};