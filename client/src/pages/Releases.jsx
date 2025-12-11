import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Title from '../components/admin/Title'; // Reusing for consistent styling
import { StarIcon } from 'lucide-react';
import { kConverter } from '../lib/kConverter';
import { Link } from 'react-router-dom'; // Keep Link import, even if not directly used for movie cards

function Releases() {
  const { axios, image_base_url, getToken } = useAppContext();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpcomingMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const {data} = await axios.get('/api/show/new-release', {
        headers: {Authorization: `Bearer ${await getToken()}`}})

      if (data && data.movies) {
        setUpcomingMovies(data.movies);
      } else {
        setError('Failed to fetch upcoming movies.');
      }
    } catch (err) {
      console.error('Error fetching upcoming movies:', err);
      setError('An error occurred while fetching movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <Title text1="Upcoming" text2="Releases" />

      {upcomingMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-10">
          {upcomingMovies.map((movie) => (
            <div key={movie.id} className="block group cursor-default">
              <div className="relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105 cursor-pointer">
                <img
                  src={movie.poster_path ? image_base_url + movie.poster_path : 'https://via.placeholder.com/150'}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white text-lg font-semibold truncate">{movie.title}</h3>
                  <p className="text-gray-300 text-sm">Release Date: {movie.release_date}</p>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                    <StarIcon className="w-4 h-4 fill-yellow-400" />
                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} ({kConverter(movie.vote_count)} votes)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-400">No upcoming movies found.</div>
      )}
    </div>
  );
}

export default Releases; 