# Sfridoo Recycle

Sfridoo Recycle is a comprehensive full-stack ecosystem designed to revolutionize waste management, recycling, and B2B material exchange. The platform leverages AI to optimize ragpicker dispatch networks, automatically classify waste, estimate market value, and seamlessly connect sellers with buyers in the recycling supply chain.

## 🌟 Features

*   **AI-Powered Waste Appraisal:** Upload photos of waste and let Gemini AI automatically classify materials, identify recyclable components, and estimate real-time market value.
*   **Smart Routing & Dispatch:** Our AI routing engine continuously matches the nearest ragpickers to collection hubs based on load capacity, distance, and material type, ensuring optimal collection efficiency.
*   **B2B Marketplace:** A dynamic marketplace for buyers and sellers to list, discover, and transact industrial waste and raw materials.
*   **Cross-Platform Ecosystem:** Available as a fully responsive Next.js web application and a native Expo mobile application for field workers.
*   **Sustainability Impact Tracking:** Track CO2 saved, water conserved, and trees equivalent for every transaction.

## 🏗️ Architecture

This repository is structured as a monorepo containing three core services:

*   **`/client`**: The Next.js frontend web application.
*   **`/server`**: The Node.js/Express backend API.
*   **`/app`**: The Expo (React Native) mobile application.

---

## 🚀 Getting Started

### 1. Web Client (Next.js)

The web client is built with Next.js 15, React 19, Tailwind CSS, and shadcn/ui.

```bash
cd client
npm install
npm run dev
```

*The client will run on `http://localhost:3000`.*

### 2. Backend Server (Node.js/Express)

The backend handles API requests, AI integrations, database connections, and payment processing.

**Prerequisites:** You will need to create a `.env` file in the `server` directory with your secrets (MongoDB, Gemini AI, Cloudinary, Razorpay, SendGrid).

```bash
cd server
npm install
npm start
```

*The server will run on `http://localhost:5001`.*

### 3. Mobile App (Expo)

The mobile app provides a native interface for users and field workers on iOS and Android.

```bash
cd app
npm install
npx expo start
```

*Use the Expo Go app on your physical device or run it on an iOS/Android simulator.*

---

## 🛠️ Tech Stack

**Frontend:**
*   Next.js (App Router)
*   React & TypeScript
*   Tailwind CSS & shadcn/ui
*   React Flow (for supply chain diagrams)
*   Leaflet (for interactive routing maps)
*   React Query

**Backend:**
*   Node.js & Express
*   MongoDB (Mongoose)
*   Google Gemini AI (for image analysis)
*   Cloudinary (for image storage)
*   Razorpay (for payments)

**Mobile:**
*   Expo / React Native

---

## 🌍 Deployment

*   **Frontend**: Deployed seamlessly on [Vercel](https://vercel.com).
*   **Backend**: Hosted on [Render](https://render.com) or [Railway](https://railway.app).
*   **Mobile App**: Built and distributed via [EAS (Expo Application Services)](https://expo.dev/eas).

---

## 📄 License
This project is proprietary and confidential.
