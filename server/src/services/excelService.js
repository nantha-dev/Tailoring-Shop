const ExcelJS = require('exceljs');

exports.generateOrdersExcel = async (orders) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Orders');
  sheet.columns = [
    { header: 'Order No', key: 'orderNumber' },
    { header: 'Customer', key: 'customerName' },
    { header: 'Date', key: 'orderDate' },
    { header: 'Status', key: 'status' },
  ];
  orders.forEach((order) => {
    sheet.addRow({
      orderNumber: order.orderNumber,
      customerName: order.customer?.name || '',
      orderDate: order.orderDate.toISOString().split('T')[0],
      status: order.status,
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};