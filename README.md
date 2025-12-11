# CinePass

CinePass is a modern, full-stack movie ticketing platform designed to provide a seamless and intuitive experience for booking cinema tickets online. From discovering the latest movie releases to securely reserving your favorite seats, CinePass aims to make your movie-going experience hassle-free. It features a robust administrative panel for comprehensive management of movies, showtimes, and user bookings.

## ✨ Key Features

### 🎬 User Experience

*   **🔐 Seamless Authentication:** Enjoy a secure and intuitive user registration and login experience, powered by **Clerk**.
*   **🍿 Diverse Movie Catalog:** Explore a rich collection of currently playing and **upcoming movie releases**, complete with detailed synopses, cast information, and ratings, all sourced dynamically from TMDB.
*   **🔍 Intelligent Search:** Easily discover your next favorite film with a powerful **movie search functionality**.
*   **📄 Comprehensive Movie Details:** Dive deep into each movie with dedicated pages showcasing trailers, full cast lists, user ratings, and more.
*   **💺 Interactive Seat Selection:** Experience a visually engaging and user-friendly interface to **select your preferred seats** for any available showtime.
*   **💳 Secure Online Booking:** Effortlessly purchase your tickets with a reliable and secure **Stripe payment gateway** integration. Bookings are initially marked as pending and confirmed upon successful payment.
*   **📅 Personal Booking History:** Keep track of all your **past and pending ticket bookings** in a dedicated user section, with options to complete payments for any unpaid bookings.
*   **❤️ Curated Favorites:** Easily **mark and manage your favorite movies**, allowing you to create a personalized watchlist for quick access.

### 💼 Administrative Control

*   **📊 Dynamic Admin Dashboard:** Gain valuable insights into your cinema's performance with a comprehensive dashboard displaying **total bookings, revenue, active shows, and overall user statistics**.
*   **➕ Effortless Show Management:** Efficiently **add new movies and create custom showtimes**, seamlessly integrating with your existing movie catalog.
*   **📝 Centralized Show Listing:** View and manage all **active shows** from a single, organized list, making scheduling and updates straightforward.
*   **🎫 Detailed Booking Overview:** Access a complete record of all **user bookings**, providing administrators with easy tracking and management capabilities.

### ⚙️ Backend Automation

*   **🔄 Clerk User Synchronization:** Automated background processes (powered by **Inngest**) ensure seamless **user data synchronization** between Clerk and your MongoDB database, keeping user profiles up-to-date.
*   **⏳ Scheduled Payment Checks:** Reliable **Inngest** tasks are scheduled to automatically monitor and **update payment statuses** for pending bookings, ensuring data consistency and timely release or occupation of seats.

## 🚀 Tech Stack

### Frontend
*   **React.js:** A JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **React Hot Toast:** For beautiful and responsive toast notifications.
*   **Clerk React:** Frontend SDK for Clerk authentication.
*   **Lucide React:** A collection of beautiful and customizable open-source icons.

### Backend
*   **Node.js:** JavaScript runtime.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** NoSQL database for storing application data.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **Clerk Express:** Backend middleware for integrating Clerk authentication.
*   **Stripe:** For payment processing and managing checkout sessions.
*   **Inngest:** A serverless platform for building reliable background jobs and workflows.
*   **Axios:** For making external API calls (e.g., to TMDB).
*   **Dotenv:** To load environment variables from a `.env` file.
*   **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

### External Services
*   **Clerk:** User authentication and management.
*   **Stripe:** Payment gateway for secure online transactions.
*   **The Movie Database (TMDB) API:** For movie data (now playing, upcoming, details, posters).
*   **Inngest:** For reliable background task execution.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (v18 or higher recommended)
*   **npm** or **Yarn**
*   **MongoDB:** Local instance or a cloud service (e.g., MongoDB Atlas).
*   **Clerk Account:** [clerk.com](https://clerk.com)
*   **Stripe Account:** [stripe.com](https://stripe.com)
*   **TMDB API Key:** [themoviedb.org](https://www.themoviedb.org/documentation/api)
*   **Inngest Account:** [inngest.com](https://www.inngest.com/)

## 📝 Environment Variables

Create `.env` files in both the `client` and `server` directories based on the following templates:

### `client/.env`
```dotenv
VITE_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PUBLISHABLE_KEY
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500 # For TMDB movie posters
VITE_CURRENCY=$ # Or your desired currency symbol
```

### `server/.env`
```dotenv
MONGODB_URI=mongodb://localhost:27017/cinepass # Or your MongoDB Atlas connection string
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_SECRET_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
TMDB_API_KEY=YOUR_TMDB_API_KEY # TMDB API Read Access Token (Bearer Token)
INNGEST_SIGNING_KEY=YOUR_INNGEST_SIGNING_KEY # From Inngest dashboard
INNGEST_EVENT_KEY=YOUR_INNGEST_EVENT_KEY # From Inngest dashboard
```

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd CinePass
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install # or yarn install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install # or yarn install
    ```

## 🏃‍♀️ Running the Application

1.  **Start the server:**
    ```bash
    cd server
    npm run server # This uses nodemon for development
    # Or for production: npm start
    ```

2.  **Start the client (in a new terminal):**
    ```bash
    cd client
    npm run dev # This starts the Vite development server
    ```

Your application should now be running on `http://localhost:5173` (or the port specified by Vite).

## 🔑 Admin Access

To grant admin access to a user:
1.  Log in to your Clerk Dashboard.
2.  Navigate to the "Users" section.
3.  Select the desired user.
4.  In their `Private Metadata`, add or update the `role` field:
    ```json
    {
      "role": "admin"
    }
    ```
5.  The user will gain admin privileges upon their next login or session refresh.

## 🤝 Stripe Webhook Setup (Crucial for Payments)

For a robust payment flow, you **must** set up a Stripe webhook. This ensures your backend is notified of successful payments and can update booking statuses and seat availability accordingly.

1.  **Deploy your backend:** Your webhook endpoint needs to be publicly accessible. During development, you can use a tool like `ngrok` to expose your local server.
2.  **Create a webhook endpoint in your `server`:** You'll need to define a new route (e.g., `/api/stripe-webhook`) that listens for Stripe events.
3.  **Implement webhook logic:** In this endpoint, verify the Stripe signature and handle the `checkout.session.completed` event to update `Booking.isPaid` to `true` and mark `Show.occupiedSeats`.
4.  **Configure in Stripe Dashboard:**
    *   Go to your Stripe Dashboard > Developers > Webhooks.
    *   Add a new endpoint, pointing to your public backend URL (e.g., `https://your-deployed-backend.com/api/stripe-webhook`).
    *   Select events to listen for: `checkout.session.completed` is essential. You might also want `checkout.session.async_payment_succeeded` and `checkout.session.async_payment_failed`.
    *   Stripe will provide a Webhook Secret; store this in your `server/.env` as `STRIPE_WEBHOOK_SECRET`.

## 📄 License

[Optional: Add your project's license here. e.g., MIT, Apache 2.0, etc.]
