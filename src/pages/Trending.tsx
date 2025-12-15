import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card } from "../components/ui/card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MoviesFilter from "../components/PopularMovies/MoviesFilter";
import type { Filters } from "../components/PopularMovies/MoviesFilter";

const BASE_URL = "https://api.themoviedb.org/3";

const RatingCircle = ({ vote }: { vote: number }) => {
  const percentage = Math.round((vote ?? 0) * 10);
  let colorClass = "text-green-400";
  if (percentage < 70) colorClass = "text-yellow-400";
  if (percentage < 50) colorClass = "text-red-500";

  // svg circle settings
  const r = 16;
  const C = 2 * Math.PI * r;
  const dash = (percentage / 100) * C;
  const stroke = 3;

  return (
    <div className="relative">
      <div className="rounded-full p-0.5 bg-yellow-400 drop-shadow-lg">
        <div className="rounded-full bg-[#0b1220] p-">
          <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90 transform">
            <circle cx="20" cy="20" r={r} stroke="#0b1220" strokeWidth={stroke} fill="none" />
            <circle
              cx="20"
              cy="20"
              r={r}
              stroke="currentColor"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${C}`}
              className={`${colorClass} transition-all duration-700`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`font-bold text-[10px] ${colorClass} drop-shadow-lg`}>
          {typeof vote === "number" ? `${Math.round(vote * 10)}%` : "N/A"}
        </span>
      </div>
    </div>
  );
};

// Skeleton card khi loading
const MovieSkeleton = () => (
  <div className="group relative">
    <Skeleton className="aspect-2/3 rounded-lg bg-gray-800" />
    <div className="absolute bottom-3 left-3">
      <div className="w-6 h-6 md:w-8 md:h-8">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
    </div>
  </div>
);

export default function Trending() {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<Filters | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const apiKey = import.meta.env.VITE_API_KEY;
  const isBearer = typeof apiKey === "string" && apiKey.startsWith("ey");

  const fetchMovies = async (pageNum: number, f?: Filters | null) => {
    setLoading(true);
    try {
      const useDiscover =
        !!f && (f.genres.length > 0 || f.year || f.language || f.sortBy || f.includeAdult);
      const url = useDiscover ? `${BASE_URL}/discover/movie` : `${BASE_URL}/movie/popular`;
      const params: any = { language: "vi-VN", page: pageNum };
      if (!isBearer) params.api_key = apiKey;

      if (useDiscover && f) {
        if (f.genres.length) params.with_genres = f.genres.join(",");
        if (f.year) params.primary_release_year = f.year;
        if (f.language) params.with_original_language = f.language;
        if (f.sortBy) params.sort_by = f.sortBy;
        if (f.includeAdult) params.include_adult = true;
      }

      const res = await axios.get(url, {
        params,
        headers: isBearer
          ? { accept: "application/json", Authorization: `Bearer ${apiKey}` }
          : { accept: "application/json" },
      });

      const newMovies = res.data?.results ?? [];
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m: any) => m.id));
        const filtered = newMovies.filter((m: any) => !existingIds.has(m.id));
        return pageNum === 1 ? filtered : [...prev, ...filtered];
      });
      setHasMore(pageNum < (res.data?.total_pages ?? 0));
    } catch (err) {
      console.error("Lỗi tải phim:", err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchMovies(1, filters);
  
  }, []);

  
  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1, filters);
    
  }, [filters]);

  useEffect(() => {
    if (!observerRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchMovies(page, filters);
    
  }, [page]);

  return (
    <div className="w-full bg-[#0f172a] py-8">
      <div className="max-w-screen-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Phim Phổ Biến Nhất
        </h2>

        <div className="flex gap-6">
          
          <div className="hidden md:block shrink-0">
            <MoviesFilter
              onApply={(f) => {
                setFilters(f);
              }}
              onReset={() => setFilters(null)}
            />
          </div>

         
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <Card
                  key={movie.id}
                  onClick={() =>
                    navigate(`/movie/${movie.id}`, { state: { from: location.pathname } })
                  }
                  className=" group relative overflow-hidden bg-transparent border-0 shadow-none hover:z-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="aspect-2/3 relative rounded-lg overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w220_and_h330_face${movie.poster_path}`}
                        alt={movie.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No image</span>
                      </div>
                    )}

                    <div className="absolute left-0 right-0 bottom-0 z-20">
                      <div className="bg-white/95 text-black rounded-b-lg px-3 py-1 mt-3 flex items-start">
                        <div className="flex-1 min-w-0 mt-2 ">
                          <h3 className="font-semibold text-sm leading-tight truncate">
                            {movie.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {movie.release_date
                              ? new Date(movie.release_date).toLocaleDateString("vi-VN")
                              : "Chưa rõ"}
                          </p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="absolute left-2 bottom-9.5 z-30">
                      <RatingCircle vote={movie.vote_average ?? 0} />
                    </div>
                  </div>
                </Card>
              ))}

            
              {loading &&
                Array(14)
                  .fill(0)
                  .map((_, i) => (
                    <div key={`sk-${i}`}>
                      <MovieSkeleton />
                    </div>
                  ))}
            </div>

            
            {hasMore && (
              <div className="py-6 flex flex-col items-center gap-4">
                {/* sentinel for intersection observer (keeps infinite scroll) */}
                <div ref={observerRef} className="w-full flex justify-center">
                  {loading && <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />}
                </div>

                {/* Load more button */}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang tải..." : "Tải thêm"}
                </button>
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <p className="text-center text-gray-500 py-10">Đã tải hết phim</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}