// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./src/models/User');
const Customer = require('./src/models/Customer');
const Measurement = require('./src/models/Measurement');
const Order = require('./src/models/Order');
const Invoice = require('./src/models/Invoice');
const Payment = require('./src/models/Payment');
const Setting = require('./src/models/Setting');  // ensure you have the model

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tailoring-shop';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional – remove if you want to keep old data)
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Measurement.deleteMany({}),
      Order.deleteMany({}),
      Invoice.deleteMany({}),
      Payment.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // ----- Users -----
    const admin = await User.create({
      name: 'Nantha Kumar',
      email: 'nantha1234789@gmail.com',
      password: '123456',
      role: 'admin',
      phone: '9786739239',
      isActive: true,
    });
   

    const tailor1 = await User.create({
      name: 'Ramesh Tailor',
      email: 'kumar@gmail.com',
      password: '123456',
      role: 'staff',
      phone: '9988776655',
      isActive: true,
    });

    const tailor2 = await User.create({
      name: 'Suresh Master',
      email: 'suresh@shop.com',
      password: '123456',
      role: 'staff',
      phone: '9876543211',
      isActive: true,
    });

    console.log('Users seeded');

    // ----- Customers -----
  // ----- Customers -----
const customersData = [
  {
    name: 'Amit Sharma',
    mobile: '9810012345',
    alternateNumber: '9810012346',
    email: 'amit@example.com',
    gender: 'male',
    address: '12, MG Road',
    city: 'Delhi',
    pincode: '110001',
    notes: 'Regular customer, prefers slim fit',
  },
  {
    name: 'Priya Patel',
    mobile: '9820012345',
    email: 'priya@example.com',
    gender: 'female',
    address: '45, Park Avenue',
    city: 'Mumbai',
    pincode: '400001',
    notes: 'Likes bright colors',
  },
  {
    name: 'Rajesh Kumar',
    mobile: '9830012345',
    gender: 'male',
    address: '78, Civil Lines',
    city: 'Jaipur',
    pincode: '302001',
  },
  {
    name: 'Sunita Verma',
    mobile: '9840012345',
    email: 'sunita@example.com',
    gender: 'female',
    address: '22, Model Town',
    city: 'Lucknow',
    pincode: '226001',
    notes: 'Urgent delivery always',
  },
  {
    name: 'Vikram Singh',
    mobile: '9850012345',
    alternateNumber: '9850012346',
    email: 'vikram@example.com',
    gender: 'male',
    address: '89, Rajouri Garden',
    city: 'Delhi',
    pincode: '110027',
  },
];

const customers = await Customer.insertMany(
  customersData.map((customer, index) => ({
    customerId: `CUS${String(index + 1).padStart(6, '0')}`,
    ...customer
  }))
);

console.log('Customers seeded');
    console.log('Customers seeded');

    // ----- Measurements (for each customer) -----
    const measurements = await Measurement.insertMany([
      {
        customer: customers[0]._id,
        date: new Date('2024-01-15'),
        measurements: {
          chest: 40, waist: 34, hip: 42, shoulder: 18, neck: 15.5,
          sleeveLength: 25, armRound: 14, shirtLength: 30,
          pantLength: 42, thigh: 22, knee: 16, bottom: 18, inseam: 32,
        },
        notes: 'First measurement',
      },
      {
        customer: customers[1]._id,
        date: new Date('2024-02-20'),
        measurements: {
          chest: 36, waist: 30, hip: 38, shoulder: 16, neck: 14,
          sleeveLength: 23, armRound: 12, shirtLength: 28,
        },
        notes: 'Blouse measurement',
      },
      {
        customer: customers[2]._id,
        date: new Date('2024-03-10'),
        measurements: {
          chest: 42, waist: 38, hip: 44, shoulder: 19, neck: 16,
          sleeveLength: 26, armRound: 15, shirtLength: 31,
          pantLength: 43, thigh: 24, knee: 17, bottom: 20, inseam: 33,
        },
        notes: 'Regular fit',
      },
      {
        customer: customers[3]._id,
        date: new Date('2024-04-05'),
        measurements: {
          chest: 38, waist: 32, hip: 40, shoulder: 17, neck: 14.5,
          sleeveLength: 24, shirtLength: 29,
        },
      },
    ]);

    console.log('Measurements seeded');

    // ----- Orders -----
    const orders = await Order.insertMany([
      {
        orderNumber: 'ORD000001',
        customer: customers[0]._id,
        orderDate: new Date('2024-04-10'),
        deliveryDate: new Date('2024-04-25'),
        garmentType: 'Shirt',
        quantity: 2,
        measurements: measurements[0]._id,
        fabricProvided: true,
        fabricColor: 'Blue',
        stitchType: 'Slim Fit',
        priority: 'high',
        status: 'delivered',
        assignedTailor: tailor1._id,
        notes: 'Need fine stitching',
      },
      {
        orderNumber: 'ORD000002',
        customer: customers[1]._id,
        orderDate: new Date('2024-04-12'),
        deliveryDate: new Date('2024-04-28'),
        garmentType: 'Blouse',
        quantity: 1,
        measurements: measurements[1]._id,
        fabricProvided: false,
        fabricColor: 'Red',
        stitchType: 'Regular',
        priority: 'medium',
        status: 'ready',
        assignedTailor: tailor2._id,
      },
      {
        orderNumber: 'ORD000003',
        customer: customers[2]._id,
        orderDate: new Date('2024-04-15'),
        deliveryDate: new Date('2024-05-02'),
        garmentType: 'Pant',
        quantity: 1,
        measurements: measurements[2]._id,
        fabricProvided: true,
        fabricColor: 'Black',
        stitchType: 'Classic',
        priority: 'low',
        status: 'stitching',
        assignedTailor: tailor1._id,
      },
      {
        orderNumber: 'ORD000004',
        customer: customers[3]._id,
        orderDate: new Date('2024-04-18'),
        deliveryDate: new Date('2024-05-05'),
        garmentType: 'Kurta',
        quantity: 2,
        measurements: measurements[3]._id,
        fabricProvided: false,
        fabricColor: 'White',
        stitchType: 'Designer',
        priority: 'high',
        status: 'pending',
        assignedTailor: tailor2._id,
        notes: 'Wedding order',
      },
      {
        orderNumber: 'ORD000005',
        customer: customers[0]._id,
        orderDate: new Date('2024-04-20'),
        deliveryDate: new Date('2024-05-10'),
        garmentType: 'Jacket',
        quantity: 1,
        measurements: measurements[0]._id,
        fabricProvided: true,
        fabricColor: 'Brown',
        stitchType: 'Tailored',
        priority: 'medium',
        status: 'cutting',
        assignedTailor: tailor1._id,
      },
    ]);

    console.log('Orders seeded');

    // ----- Invoices & Payments -----
    const invoice1 = await Invoice.create({
      invoiceNumber: 'INV000001',
      order: orders[0]._id,
      customer: customers[0]._id,
      items: [
        { description: 'Shirt Stitching (x2)', quantity: 2, rate: 500, amount: 1000 },
        { description: 'Collar stiffener', quantity: 2, rate: 50, amount: 100 },
      ],
      discount: 100,
      tax: 0,
      grandTotal: 1000,
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      paidAmount: 1000,
      dueDate: new Date('2024-04-30'),
    });

    await Payment.create({
      invoice: invoice1._id,
      amount: 1000,
      method: 'cash',
      date: new Date('2024-04-25'),
      reference: 'Counter payment',
    });

    const invoice2 = await Invoice.create({
      invoiceNumber: 'INV000002',
      order: orders[1]._id,
      customer: customers[1]._id,
      items: [
        { description: 'Blouse Stitching', quantity: 1, rate: 400, amount: 400 },
        { description: 'Lining', quantity: 1, rate: 150, amount: 150 },
      ],
      discount: 0,
      tax: 27.5, // 5% GST
      grandTotal: 577.5,
      paymentStatus: 'partial',
      paymentMethod: 'upi',
      paidAmount: 300,
      dueDate: new Date('2024-05-05'),
    });

    await Payment.create({
      invoice: invoice2._id,
      amount: 300,
      method: 'upi',
      date: new Date('2024-04-28'),
      reference: 'UPI: amit@okhdfc',
    });

    const invoice3 = await Invoice.create({
      invoiceNumber: 'INV000003',
      order: orders[2]._id,
      customer: customers[2]._id,
      items: [
        { description: 'Pant Stitching', quantity: 1, rate: 600, amount: 600 },
      ],
      discount: 50,
      tax: 0,
      grandTotal: 550,
      paymentStatus: 'unpaid',
      paidAmount: 0,
      dueDate: new Date('2024-05-10'),
    });

    console.log('Invoices & payments seeded');

    // ----- Shop Settings -----
    await Setting.create({
      shopName: 'Fashion Tailors',
      address: 'Shop No. 5, Main Market, New Delhi',
      phone: '011-12345678',
      email: 'info@fashiontailors.com',
      gstin: '07ABCDE1234F1Z5',
    });

    console.log('Settings seeded');
    console.log('=======================');
    console.log('Default admin login:');
    console.log('Email: admin@shop.com');
    console.log('Password: admin123');
    console.log('=======================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();