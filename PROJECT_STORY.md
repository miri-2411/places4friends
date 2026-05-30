# places4friends

## Inspiration

We wanted to help local, independent businesses like family cafes and small shops. Big companies with lots of money often hide them. Search engines and review apps can make this worse with fake reviews and paid ads. 

We believe the best way to find cool local places is through friends. Instead of trusting algorithms, we trust the people we know. places4friends lets users share their favorite spots on a map with their friends. Our goal is to use real word-of-mouth to bring more people to local businesses so they can survive and grow.

## What it does

places4friends is an app where friends can share their favorite local spots. Standard review sites often have fake or paid reviews. Our app works differently: the best tips come from people you trust. 

It is a mobile-friendly web app that combines an interactive map with a social network. Users can save cafes and bars, mark them as "Must See", share photos, comment, and create personal wishlists.

## How we built it

### 1. Frontend & Visual Interface
* **Next.js**: Used for routing, fast pages, and API endpoints.
* **React & Mapbox GL JS**: Used for the interactive map. Mapbox lets us add animations, map styles, and custom markers.
* **Tailwind CSS**: Used for the dark design with green and amber highlights. It looks and feels like a native mobile app.

### 2. Backend & Real-time Database
* **Supabase (PostgreSQL)**: Our database for user profiles, friends, activities, and wishlists.
* **Row Level Security (RLS)**: Keeps data safe. Only your accepted friends can see your map and profile.
* **Supabase Storage**: Used for saving user avatars and photos.

### 3. Tools & APIs
* **Supabase Auth**: For secure user login and authentication.
* **Mapbox**: For interactive maps and location-based features.
* **Google Places API**: For location search and place details.

## Challenges we ran into

We faced a few problems while building the app:

### 1. Mobile Performance and Image Handling
* **The Problem**: Loading big maps and editing images made the mobile app slow.
* **The Solution**: We changed how we handle image cropping to use less phone power. We also split the code into smaller parts.

### 2. Categorized Location Search
* **The Problem**: Normal address search was not good enough to find specific cafes or museums.
* **The Solution**: We used the Mapbox Search API and Google Places API to combine a global place search with our own local filters in one search bar.

### 3. Working with New Technologies
* **The Problem**: Learning new tools like Mapbox and Supabase security was hard.
* **The Solution**: We worked together. By coding together and talking, we solved problems much faster.

### 4. Getting a Working Development Environment
* **The Problem**: Setting up the project on different computers caused errors.
* **The Solution**: We kept trying, fixed the errors step by step, and wrote down the setup instructions for everyone.

### 5. Avoiding Git Merge Conflicts
* **The Problem**: Working fast on the same code can cause version conflicts.
* **The Solution**: We talked a lot. We gave everyone specific files to work on to avoid overwriting each other's code.

## Accomplishments that we're proud of

* **Interactive Map**: Building a smooth map that tracks location and shows details easily.
* **Privacy**: Using Supabase security to make sure only friends see your places.
* **Image Uploads**: Making a fast photo upload and cropping tool for phones.

## What we learned

* **Building Fast Works**: Focusing on a quick prototype helped us finish in record time.
* **Time Management**: Short deadlines forced us to focus on the most important features first.
* **Communication is Key**: Talking clearly kept the team together and stopped things from breaking.
* **Project Management**: Good planning helped us combine the map and the database smoothly.
* **Anything is Possible**: You don't need to know everything perfectly at the start. If you believe in your idea, you can learn as you go.

## What's next for places4friends

* **Private Groups**: Creating smaller groups (like "Coworkers") to filter map markers.
* **Business Features**: Letting local businesses claim their spots to offer special deals to friends who recommend them.
* **Marketing**: Social media posts and paid ads to reach a wider audience.