import 'dotenv/config';
import axios from 'axios';

async function testTMDB() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
    console.log("Testing URL:", url);
    try {
        const response = await axios.get(url);
        console.log("Success! Status:", response.status);
        console.log("Results count:", response.data.results.length);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testTMDB();
