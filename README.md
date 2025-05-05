# DosoBox - Movie Database & Review Platform

![DosoBox Logo](https://via.placeholder.com/200x80?text=DosoBox)

DosoBox is a modern movie database and review platform built with React, Vite, and Material UI. It allows users to browse trending and popular movies, search for specific titles, view detailed information about movies, and more.

## Features

- **Movie Discovery**: Browse trending and popular movies
- **Search Functionality**: Find movies by title or keywords
- **Detailed Movie Information**: View comprehensive details about movies
- **User Authentication**: Register, login, and maintain a profile
- **Responsive Design**: Optimal viewing experience across all devices
- **Dark/Light Mode**: Toggle between dark and light themes

## Tech Stack

- **Frontend**:
  - React 18
  - React Router 6
  - Material UI 5
  - Vite
  - Axios

- **APIs**:
  - TMDB API for movie data

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TMDB API key (get it from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dosobox.git
   cd dosobox
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Rename `.env.example` to `.env`
   - Add your TMDB API key:
     ```
     VITE_TMDB_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dosobox/
├── public/
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── Register.jsx
│   │   └── ...
│   ├── utils/
│   │   └── tmdbApi.js
│   ├── animations.css
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (once implemented)

## Backend Integration

This frontend project is designed to work with a backend server that provides:

- User authentication
- User profiles
- Movie favorites
- Reviews

You can set up the backend separately or modify the frontend to work without a backend initially.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie API
- [Material UI](https://mui.com/) for the UI components
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) teams for the amazing tools
