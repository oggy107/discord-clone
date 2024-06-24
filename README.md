# Discord Clone

This project is a clone of Discord built using modern web technologies. It features real-time messaging, audio and video calling, and server-based communities.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **shadcn/ui**: Component library for building user interfaces.
- **Prisma**: ORM for type-safe database access.
- **NeonDB**: PostgreSQL database hosted on Neon.
- **Clerk**: Authentication and user management.
- **Pusher**: Real-time messaging.
- **LiveKit**: Audio and video calling.

## Features

- Real-time messaging
- Audio and video calling
- Server-based communities
- Authentication and user management

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/discord-clone.git
    cd discord-clone
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Signup to clerk, pusher, uploadthing and livekit and create a `.env` file in the root directory and add the following:

    ```bash
    npm install
    ```

    ```env
    # clerk auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-public-key>
    CLERK_SECRET_KEY=<your-clerk-secret-key>
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    DATABASE_URL=<your-database-url>

    # uploadthing
    UPLOADTHING_SECRET=<your-uploadting-secret>
    UPLOADTHING_APP_ID=<your-uploadthing-appid>

    # pusher
    PUSHER_APP_ID=<your-pusher-app-id>
    PUSHER_SECRET=<your-pusher-secret>
    NEXT_PUBLIC_PUSHER_KEY=<your-pusher-public-key>
    NEXT_PUBLIC_PUSHER_CLUSTER=<your-pusher-cluster>

    # livekit
    NEXT_PUBLIC_LIVEKIT_URL=<your-livekit-url>
    LIVEKIT_API_KEY=<your-livekit-api-key>
    LIVEKIT_API_SECRET=<your-livekit-api-secret>
    ```

4. Run database migrations:

    ```bash
    npx prisma migrate deploy
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
