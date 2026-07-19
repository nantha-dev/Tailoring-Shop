Below is the complete `README.md` for the Tailoring Shop Management System. Place it in the root of your project.

```markdown
# Tailoring Shop Management System

A full‑stack (MERN) web application to manage a tailoring business.  
Covers customers, measurements, orders, invoices, payments, dashboard analytics, reports, and role‑based access.

---

## Features

### 🔐 Authentication & Roles
- JWT based login/logout
- Role based access: **Admin** and **Staff**
- Password hashing with bcrypt

### 📊 Dashboard
- Today’s orders, pending, in‑progress, ready, delivered counts
- Total customers and monthly revenue
- Recent orders table
- (Charts prepared for future integration)

### 👥 Customer Management
- CRUD customers (auto‑generated customer ID)
- Search by name, mobile, ID
- Pagination

### 📏 Measurement Management
- Store body measurements (chest, waist, hip, …)
- History per customer
- Custom measurement support

### 📦 Order Management
- Full order lifecycle: Pending → Cutting → Stitching → Finishing → Ready → Delivered → Cancelled
- Auto order number generation
- Assign tailor, set priority, delivery/trial date
- Fabric tracking (provided by customer/shop)

### 🧾 Invoicing & Payments
- Generate invoices linked to orders
- Multiple items, discount, tax, grand total
- Record partial/full payments (Cash/UPI/Card)
- Payment status tracking (paid/partial/unpaid)

### 📈 Reports
- Order report with date/status filters
- Revenue summary
- Export orders to **PDF** and **Excel**

### ⚙️ Shop Settings
- Configure shop name, address, phone, GSTIN (single global settings)

### 👤 Profile Management
- Update name, email, change password

### 📱 Responsive Design
- Works on mobile, tablet, and desktop
- Modern UI with **shadcn/ui** and Tailwind CSS

---

## Tech Stack

### Frontend
- React 18 (Vite)
- React Router DOM 6
- Axios
- React Hook Form
- React Hot Toast
- shadcn/ui (Radix UI primitives)
- Tailwind CSS + tailwind-merge/clsx
- Lucide React icons

### Backend
- Node.js / Express.js
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken, bcryptjs)
- Cookie‑parser
- CORS
- express‑validator
- Multer (prepared for file uploads)
- PDFKit (PDF export)
- ExcelJS (Excel export)

---

## Folder Structure

```
tailoring-shop/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui primitives
│   │   │   ├── Layout/         # MainLayout, Sidebar, Header
│   │   │   └── common/         # ProtectedRoute, Loader, EmptyState
│   │   ├── contexts/           # AuthContext
│   │   ├── hooks/              # useAuth, useDebounce
│   │   ├── lib/                # utils (cn)
│   │   ├── pages/              # All route pages
│   │   ├── services/           # Axios API calls
│   │   └── utils/              # formatDate, constants
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # db.js, constants.js
│   │   ├── controllers/        # Business logic
│   │   ├── middlewares/        # auth, errorHandler, validate
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routers
│   │   ├── services/           # PDF, Excel generators
│   │   ├── utils/              # catchAsync, ApiError, generateToken
│   │   ├── validators/         # express-validator rules
│   │   └── server.js           # Entry point
│   ├── uploads/
│   ├── package.json
│   └── .env
│
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or later
- **MongoDB** running locally or a cloud Atlas URI

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url> tailoring-shop
cd tailoring-shop

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `server/.env` file from the provided example:

```bash
cp .env.example server/.env
```

Edit `server/.env` with your own values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tailoring-shop
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Sample Data (Optional)

The database is empty by default. To populate it with demo customers, orders, invoices etc., run:

```bash
cd server
node seed.js
```

> This creates an admin user and other sample data.  
> **Admin login:** `admin@shop.com` / `admin123`

### 4. Start the Application

Open two terminals:

**Backend (from `server/`):**

```bash
npm run dev
```
Runs on http://localhost:5000

**Frontend (from `client/`):**

```bash
npm run dev
```
Runs on http://localhost:5173

Visit the frontend URL in your browser. You should see the login page.

---

## API Documentation

Base URL: `http://localhost:5000/api`  
Authentication: Include `Authorization: Bearer <token>` header (or the cookie is handled automatically).

### Auth
| Method | Endpoint              | Description           | Auth |
|--------|-----------------------|-----------------------|------|
| POST   | /auth/register        | Register new user     | No   |
| POST   | /auth/login           | Login, receive token  | No   |
| POST   | /auth/logout          | Clear cookie          | No   |
| GET    | /auth/me              | Current user profile  | Yes  |
| PUT    | /auth/profile         | Update profile        | Yes  |
| PUT    | /auth/change-password | Change password       | Yes  |

### Customers
| Method | Endpoint          | Description          | Auth | Query params |
|--------|-------------------|----------------------|------|--------------|
| GET    | /customers        | List all (paginated) | Yes  | search, page, limit |
| POST   | /customers        | Create new           | Yes  | -            |
| GET    | /customers/:id    | Get single           | Yes  | -            |
| PUT    | /customers/:id    | Update               | Yes  | -            |
| DELETE | /customers/:id    | Delete               | Yes  | -            |

### Measurements
| Method | Endpoint                          | Description                    | Auth |
|--------|-----------------------------------|--------------------------------|------|
| POST   | /measurements                     | Create new measurement         | Yes  |
| GET    | /measurements/customer/:customerId| All measurements for a customer| Yes  |
| GET    | /measurements/:id                 | Get single                     | Yes  |
| PUT    | /measurements/:id                 | Update                         | Yes  |
| DELETE | /measurements/:id                 | Delete                         | Yes  |

### Orders
| Method | Endpoint          | Description                          | Auth | Query params |
|--------|-------------------|--------------------------------------|------|--------------|
| GET    | /orders           | List (paginated, search, status, date) | Yes  | search, status, startDate, endDate, page, limit |
| POST   | /orders           | Create                               | Yes  | - |
| GET    | /orders/history   | Filterable order history             | Yes  | customerId, status, startDate, endDate |
| GET    | /orders/:id       | Get single                           | Yes  | - |
| PUT    | /orders/:id       | Update (status, etc.)                | Yes  | - |
| DELETE | /orders/:id       | Delete                               | Yes  | - |

### Invoices
| Method | Endpoint               | Description                   | Auth |
|--------|------------------------|-------------------------------|------|
| GET    | /invoices              | List (paginated, search)      | Yes  |
| POST   | /invoices              | Create                        | Yes  |
| GET    | /invoices/:id          | Get invoice + payments        | Yes  |
| PUT    | /invoices/:id          | Update                        | Yes  |
| POST   | /invoices/:id/payment  | Record a payment              | Yes  |

### Dashboard
| Method | Endpoint   | Description                            | Auth |
|--------|------------|----------------------------------------|------|
| GET    | /dashboard | Stats, recent orders, chart data       | Yes  |

### Reports
| Method | Endpoint                      | Description                      | Auth  |
|--------|-------------------------------|----------------------------------|-------|
| GET    | /reports/orders?from=&to=     | Filtered orders                  | Yes   |
| GET    | /reports/revenue?from=&to=    | Revenue summary                  | Yes   |
| GET    | /reports/export/orders/pdf    | Download orders as PDF           | Admin |
| GET    | /reports/export/orders/excel  | Download orders as Excel         | Admin |

### Settings
| Method | Endpoint   | Description                 | Auth  |
|--------|------------|-----------------------------|-------|
| GET    | /settings  | Get shop settings           | Yes   |
| PUT    | /settings  | Update shop settings        | Admin |

### Users (Admin only)
| Method | Endpoint                    | Description              | Auth  |
|--------|-----------------------------|--------------------------|-------|
| GET    | /users                      | List all users           | Admin |
| POST   | /users                      | Create new user (staff)  | Admin |
| PATCH  | /users/:id/toggle-status    | Activate/deactivate user | Admin |

---

## Default Admin Credentials (After Seeding)

```
Email:    admin@shop.com
Password: admin123
```

You can also register a new admin user via the API:

```
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@shop.com",
  "password": "admin123",
  "role": "admin"
}
```

---

## Deployment Notes

### Backend
- Set `NODE_ENV=production`
- Use a real MongoDB Atlas URI
- Generate a strong `JWT_SECRET`
- Set `CLIENT_URL` to your frontend domain
- Use a process manager like PM2: `pm2 start server/src/server.js --name tailoring-api`

### Frontend
- Build: `npm run build`
- Serve the `dist/` folder using Nginx or any static server
- Update the `VITE_API_URL` environment variable (if needed) to point to your API

---

## Screenshots

*(Add screenshots of your running application – Login, Dashboard, Customer List, Order Details, Invoice, etc.)*

---

## License

MIT License – feel free to use and modify for your own shop.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Support

For issues or questions, contact: `your-email@example.com`

---

**Happy Tailoring! 🧵✂️**
```

That's the full, detailed README. It covers everything from setup to API documentation and deployment. Place it in the project root.