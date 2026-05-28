# places4friends

> Discover the best spots, curated by the friends you trust.

**places4friends** is a social discovery platform designed to help you share and explore local highlights with your closest friends. No generic reviews or fake ratings—just genuine recommendations from the people whose taste you actually trust.

---

## Key Features

### Interactive Shared Map
- Explore a clean, interactive map showing all the places recommended by your friends.
- Search easily for specific locations or filter through recommendations.
- Quick navigation helps you zoom straight to your city highlights (such as Berlin).

### Simple & Highlighted Recommendations
- Recommend any spot you've visited with a simple search.
- Mark your absolute highlights as a **"Must See"** to give them a premium badge in your friends' feeds.
- Write personal reviews, secrets, or tips (like the best table to sit at or the must-try drink).

### Profile & Personal Activity
- A dedicated profile tab showcasing your personal curated feed of recommended places.
- Keep track of your contributions and see how many friends are connected.

---

## Getting Started

### Prerequisites
To view the interactive map, make sure to add your Mapbox access token to your configuration:
1. Create a `.env.local` file in the root directory.
2. Add your token:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token_here
   ```

### Running the App Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Built With

- **Next.js** & **React** - Modern, fast web framework
- **Mapbox GL & React Map GL** - High-performance interactive maps
- **Tailwind CSS** - Clean, responsive UI layout
- **Lucide React** - Sleek vector icons
