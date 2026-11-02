# Rang Haveli (रंग हवेली)
### Rajasthani Heritage E-Commerce Web Application (MERN Stack)

An online shop for **traditional Rajasthani products**, with **sarees, bangles and earrings** as the main collections. It is a full-stack web application with a customer storefront and a shop-owner dashboard.

## Product collections
| Main focus | Also sold |
|---|---|
| Sarees (bandhani, leheriya, Kota Doria, block print, gota patti) | Necklaces (kundan, meenakari, silver) |
| Bangles (lac, meenakari, kundan, glass, bridal chooda) | Dupattas |
| Earrings (jhumka, chandbali, studs; kundan, lac, thewa, silver) | Lehengas |
| | Juttis (mojari) |
| | Potli bags |
| | Home decor (blue pottery, kathputli puppets) |

The seed loads 35 sample products across these 9 collections. The shop owner can add more products, in any collection, from the dashboard.

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Frontend | React 18, JavaScript (JSX), HTML, CSS, React Router, Vite |
| Backend  | Node.js, Express.js, JSON Web Tokens, bcrypt        |
| Database | MongoDB with Mongoose                               |

## Project structure
```
rang-haveli/
├── frontend/                 React application (what the customer sees)
│   ├── index.html
│   ├── vite.config.js        dev server + proxy to the backend
│   └── src/
│       ├── main.jsx          app entry point
│       ├── App.jsx           routes
│       ├── api.js            helper for calling the backend
│       ├── categories.js     list of collections, crafts and sizes
│       ├── index.css         all styling
│       ├── context/          AuthContext (login state), CartContext (bag)
│       ├── components/       Navbar, Footer, ProductCard, ProductArt
│       └── pages/            Home, Shop, ProductDetail, Cart, Checkout,
│                             AuthPage, Orders, Admin
├── backend/                  Node + Express REST API
│   ├── server.js             app entry point
│   ├── config/db.js          MongoDB connection
│   ├── config/categories.js  list of collections
│   ├── models/               Product, User, Order (Mongoose schemas)
│   ├── middleware/auth.js    login check + admin check
│   ├── routes/               auth, products, orders
│   ├── seed/seed.js          35 sample products + owner account
│   └── .env                  settings (database address, secret key)
├── docs/
│   ├── PROJECT_REPORT.md     report: abstract, design, testing, future scope
│   └── screenshots/          put your screenshots here
├── package.json              shortcut commands for the whole project
└── README.md
```

## Features
**Customer**
- Browse every collection; filter by craft, search, sort, page through results
- Product page with description, craft, origin, size selector (bangles, juttis, lehengas), stock
- Shopping bag that is remembered in the browser; free shipping above ₹2,999
- Register and log in; Cash on Delivery or UPI checkout; order history

**Shop owner (dashboard at `/admin`)**
- Sales summary: products, orders, revenue, low stock
- Add, edit and delete products
- View all orders and change status (placed, packed, shipped, delivered, cancelled)

**Security**
- Passwords hashed with bcrypt, sessions use JWT
- Admin-only API routes; customers cannot make themselves admin
- Order prices and stock are always checked on the server, never trusted from the browser

## How to run
Requirements: **Node.js 18+** and a **MongoDB** database (local or free MongoDB Atlas).

1. **Install everything**
   ```bash
   npm run install-all
   ```
2. **Set the database address** in `backend/.env`
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/rang_haveli
   ```
   (For Atlas, paste your connection string instead.)
3. **Load sample products and the owner account**
   ```bash
   npm run seed
   ```
4. **Start frontend and backend together**
   ```bash
   npm run dev
   ```
5. **Open** http://localhost:5173

| Account | Email | Password |
|---|---|---|
| Shop owner | admin@ranghaveli.test | admin123 |
| Customer | register on the Log in page | your choice |

To run the parts separately, use two terminals: `cd backend && npm run dev` and `cd frontend && npm run dev`.

## REST API
| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | create customer account |
| POST | /api/auth/login | public | log in, returns token |
| GET | /api/auth/me | login | current user |
| GET | /api/products | public | list; `category, craft, q, sort, minPrice, maxPrice, page, limit` |
| GET | /api/products/featured | public | home page products |
| GET | /api/products/:slug | public | one product |
| POST | /api/products | admin | add product |
| PUT | /api/products/:id | admin | edit product |
| DELETE | /api/products/:id | admin | delete product |
| POST | /api/orders | login | place order |
| GET | /api/orders/mine | login | my orders |
| GET | /api/orders | admin | all orders |
| PATCH | /api/orders/:id/status | admin | update order status |

## Documentation
See [docs/PROJECT_REPORT.md](docs/PROJECT_REPORT.md) for the full project report.

## Adding a new kind of product later
1. Add its name to `backend/config/categories.js`.
2. Add an entry to `frontend/src/categories.js` (label, crafts, sizes, patterns).
3. Add it from the dashboard. If you give it no drawing in `ProductArt.jsx`, it uses the saree drawing until you add a photo or a new drawing.
