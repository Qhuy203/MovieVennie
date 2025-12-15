import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation } from 'swiper/modules';
import { X, Play } from 'lucide-react';

const MOVIE_GENRES = [
  { id: 28, name: 'Hành Động' },
  { id: 12, name: 'Phiêu Lưu' },
  { id: 16, name: 'Hoạt Hình' },
  { id: 35, name: 'Hài' },
  { id: 80, name: 'Tội Phạm' },
  { id: 99, name: 'Tài Liệu' },
  { id: 18, name: 'Chính Kịch' },
  { id: 10751, name: 'Gia Đình' },
  { id: 14, name: 'Giả Tưởng' },
  { id: 36, name: 'Lịch Sử' },
  { id: 27, name: 'Kinh Dị' },
  { id: 10402, name: 'Âm Nhạc' },
  { id: 9648, name: 'Bí Ẩn' },
  { id: 10749, name: 'Lãng Mạn' },
  { id: 878, name: 'Khoa Học Viễn Tưởng' },
  { id: 10770, name: 'Phim Truyền Hình' },
  { id: 53, name: 'Gây Cấn' },
  { id: 10752, name: 'Chiến Tranh' },
  { id: 37, name: 'Miền Tây' },
];

interface Movie {
  id: number;
  title: string;
  name?: string;
  release_date?: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
}

interface MovieListProps {
  title: string;
  data: Movie[];
}

export const MovieList: React.FC<MovieListProps> = ({ title, data }) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const handleTrailer = async (id: number) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      });
      const result = await response.json();
      const trailer = result.results?.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer?.key) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const closeModal = () => setTrailerKey(null);

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map(id => MOVIE_GENRES.find(g => g.id === id)?.name)
      .filter(Boolean)
      .filter(Boolean)
      .slice(0, 2)
      .join(' • ');
  };

  return (
    <>
      <div className="text-white mt-8 bg-[#2d2e37] p-3 mb-4 relative w-[1060px] mr-auto ml-auto">
        <h2 className="text-2xl">{title}</h2>
      </div>

      <Swiper
        className="relative w-[1060px] mx-auto"
        spaceBetween={20}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        breakpoints={{
          300: { slidesPerView: 1, spaceBetween: 10 },
          400: { slidesPerView: 2, spaceBetween: 15 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {data.length > 0 && data.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="w-[250px] h-[380px] relative group flex flex-col justify-between cursor-pointer"
              onClick={() => handleTrailer(item.id)}
            >
              <div className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 group-hover:bg-black/70 transition-all duration-500 ease-in-out z-10" />
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 p-2 bg-[#ffb43a] text-white rounded-full hover:bg-[#ff9800] transition z-20">
                  <Play className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-left z-20">
                <h2 className="text-white font-bold text-base leading-tight line-clamp-2 drop-shadow-lg">
                  {item.title || item.name || 'Không có tiêu đề'}
                </h2>
                <p className="text-xs text-gray-200 font-semibold mt-2 uppercase tracking-wider drop-shadow-md">
                  {getGenreNames(item.genre_ids) || 'Đang cập nhật'}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal Trailer */}
      {trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <button className="absolute top-2 right-2 text-white text-4xl hover:text-gray-400 z-10" onClick={closeModal}>
              <X className='text-gray-400'/>
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};