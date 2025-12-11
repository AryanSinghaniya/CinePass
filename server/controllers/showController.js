import axios from 'axios'
import Movie from '../models/Movie.js';
import Show from '../models/Show.js'


export const getNowPlayingMovies = async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
    console.log("Fetching movies from:", url); 
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    const movies = data.results;    
    console.log("Movies fetched:", movies.length); 
    res.json({success: true, movies: movies});
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    res.json({success: false, message: error.message});
  }
}


export const newReleases = async (req, res) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
  
      const movies = data.results;    
      res.json({success: true, movies: movies});
    } catch (error) {
      console.error('Error fetching new releases:', error);
      res.json({success: false, message: error.message});
    }
  }


export const addShow = async (req, res) => {
  try {
    const {movieId, showsInput, showPrice} = req.body;

    let movie = await Movie.findById(movieId);
    if (!movie) {
        const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`),
            fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        ])

        if (!movieDetailsResponse.ok || !movieCreditsResponse.ok) {
             throw new Error("Failed to fetch movie details from TMDB");
        }

        const movieApiData = await movieDetailsResponse.json();
        const movieCreditsData = await movieCreditsResponse.json();

        const movieDetails = {
            _id: movieId,
            title: movieApiData.title,
            overview: movieApiData.overview,
            poster_path: movieApiData.poster_path,
            backdrop_path: movieApiData.backdrop_path,
            genres: movieApiData.genres,
            casts: movieCreditsData.cast,
            release_date: movieApiData.release_date,
            original_language: movieApiData.original_language,
            tagline: movieApiData.tagline || "",
            vote_average: movieApiData.vote_average,
            runtime: movieApiData.runtime
        };

        movie = await Movie.create(movieDetails)
    }

    const showsToCreate = [];
    showsInput.forEach(show => {
        const showDate = show.date;
        show.time.forEach(time => {
            const dateTimeString = `${showDate}T${time}`;
            
            showsToCreate.push({
                movie: movieId,
                showDateTime: new Date(dateTimeString),
                showPrice, 
                occupiedSeats: {}
            });
        });
    });

    if(showsToCreate.length > 0){
        await Show.insertMany(showsToCreate);
    }

    res.json({success: true, message: 'Show Added successfully.'});
  } catch (error) {
    console.error('Error adding show:', error);
    res.json({success: false, message: error.message});
  }
}


export const getShows = async(req, res) => {
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).
        populate('movie').sort({showDateTime: 1});

        const uniqueShows = new Set(shows.map(show => show.movie))
        res.json({success: true, shows: Array.from(uniqueShows)})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: error.message})
    }
}


export const getShow = async(req, res) => {
    try {
        const {movieId} = req.params;

        const shows = await Show.find({movie: movieId, showDateTime: {$gte: new Date()}});

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({time: show.showDateTime, showId: show._id})
        })

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error(error)
        res.json({success: false, message: error.message})
    }
}