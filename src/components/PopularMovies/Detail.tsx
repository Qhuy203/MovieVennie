// ...existing code...
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { ArrowLeft } from "lucide-react";

const BASE_URL = "https://api.themoviedb.org/3";

const RatingCircle = ({ vote }: { vote: number }) => {
  const percentage = Math.round((vote ?? 0) * 10);
  let colorClass = "text-green-400";
  if (percentage < 70) colorClass = "text-yellow-400";
  if (percentage < 50) colorClass = "text-red-500";

  const r = 45;
  const C = 2 * Math.PI * r;
  const dash = (percentage / 100) * C;
  const strokeWidth = 8;

  return (
    <div className="relative w-12 h-12 md:w-14 md:h-14">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
        <circle cx="50" cy="50" r={r} stroke="#111827" strokeWidth={strokeWidth} fill="none" opacity={0.9} />
        <circle
          cx="50"
          cy="50"
          r={r}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${C}`}
          className={`${colorClass} drop-shadow-lg transition-all duration-700`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-sm md:text-base ${colorClass}`}>
          {typeof vote === "number" ? `${Math.round(vote * 10)}%` : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default function MovieDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_API_KEY;
  const isBearer = typeof apiKey === "string" && apiKey.startsWith("ey");

  useEffect(() => {
    const fetchMovie = async (movieId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
          params: isBearer ? { language: "vi-VN" } : { language: "vi-VN", api_key: apiKey },
          headers: isBearer ? { accept: "application/json", Authorization: `Bearer ${apiKey}` } : { accept: "application/json" },
        });
        setMovie(res.data);
      } catch (err: any) {
        console.error("Fetch movie detail error:", err);
        setError("Không tải được thông tin phim.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie(id);
  }, [id, apiKey, isBearer]);

  if (!id) return <div className="p-6 text-center text-red-400">ID phim không hợp lệ.</div>;
  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
  if (error) return <div className="p-6 text-center text-red-400">{error}</div>;
  if (!movie) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20 sm:p-8">
      <button onClick={() => navigate(-1)} className="text-sm text-cyan-400 mb-4"><ArrowLeft className="w-4 h-4 inline mr-1" /> Quay lại</button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-0 overflow-hidden">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-gray-400">No image</div>
            )}
          </Card>
        </div>

        <div className="md:col-span-2 text-white">
          <h1 className="text-2xl font-bold mb-2">{movie.title ?? "Untitled"}</h1>
          <div className="flex items-center gap-4 mb-4">
            <RatingCircle vote={movie.vote_average ?? 0} />
            <div className="text-sm text-gray-300">
              <div>{movie.release_date ? new Date(movie.release_date).toLocaleDateString("vi-VN") : "Chưa rõ ngày phát hành"}</div>
              <div>{movie.vote_count ?? 0} lượt đánh giá</div>
            </div>
          </div>

          <div className="mb-4">
            <strong className="text-yellow-400">Thể loại:</strong>{" "}
            <span className="text-gray-300">
              {Array.isArray(movie.genres) && movie.genres.length > 0
                ? movie.genres.map((g: any) => g.name).join(", ")
                : "N/A"}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Tổng quan</h3>
            <p className="text-gray-200">{movie.overview || "Không có mô tả."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-gray-300">
            <div>
              <h4 className="text-sm text-yellow-400">Runtime</h4>
              <div>{movie.runtime ? `${movie.runtime} phút` : "N/A"}</div>
            </div>
            <div>
              <h4 className="text-sm text-yellow-400">Ngôn ngữ gốc</h4>
              <div>{movie.original_language?.toUpperCase() ?? "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ...existing code...