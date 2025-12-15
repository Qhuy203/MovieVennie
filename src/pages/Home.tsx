import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner  from '../components/Banner';
import { MovieList } from '../components/MovieList';

export const Home: React.FC = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [nowPlay, setTopNowPlay] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const popularResponse = await axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                    },
                });
                setPopularMovies(popularResponse.data.results);

                const topRatedResponse = await axios.get('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                    },
                });
                setTopRatedMovies(topRatedResponse.data.results);

                const nowPlay = await axios.get('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                    },
                });
                setTopNowPlay(nowPlay.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className='container mx-auto p-8'>
            <Banner />
            {loading ? (
                <>
                    {/* Skeleton for three sections to match MovieList layout */}
                    {Array.from({ length: 3 }).map((_, sectionIdx) => (
                        <div key={sectionIdx} className='mb-8'>
                            <div className='w-1/3 h-10 bg-gray-700 rounded mb-4 animate-pulse' />

                            <div className='flex gap-4 overflow-x-auto py-2'>
                                {Array.from({ length: 5 }).map((__, i) => (
                                    <div
                                        key={i}
                                        className='w-[250px] h-[380px] bg-gray-800 rounded-md shrink-0 animate-pulse'
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <MovieList title={'Popular Movies'} data={popularMovies} />
                    <MovieList title={'Top Rated Movies'} data={topRatedMovies} />
                    <MovieList title={'Now Playing'} data={nowPlay} />
                </>
            )}
            <button className='mt-4 mr-auto ml-auto flex'>
                <a href='#' className='mt-6 px-5 py-3 bg-[#ffb43a] rounded mr-auto text-white'>Next Page</a>
            </button>
            <h2 className='text-white flex mr-auto ml-auto justify-center mt-4'>© MovieVennie All Right Reserved</h2>
        </div>
    );
};