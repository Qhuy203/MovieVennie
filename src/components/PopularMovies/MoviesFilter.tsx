// ...existing code...
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export type Filters = {
  genres: number[];
  year?: string;
  language?: string;
  sortBy?: string;
  includeAdult?: boolean;
};

export default function MoviesFilter({
  onApply,
}: {
  onApply: (f: Filters) => void;
  onReset: () => void;
}) {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [year, setYear] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  const API_KEY = import.meta.env.VITE_API_KEY;
  const isBearer = typeof API_KEY === "string" && API_KEY.startsWith("ey");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: isBearer ? { language: "vi-VN" } : { language: "vi-VN", api_key: API_KEY },
          headers: isBearer ? { accept: "application/json", Authorization: `Bearer ${API_KEY}` } : { accept: "application/json" },
        });
        setGenres(res.data.genres || []);
      } catch (e) {
        console.error("Can't load genres", e);
      }
    };
    fetchGenres();
  }, [API_KEY, isBearer]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const apply = () => {
    onApply({
      genres: selectedGenres,
      year: year || undefined,
      language: language || undefined,
      sortBy,
    });
  };
  return (
    <aside className="flex flex-col p-4 gap-1 w-full md:w-64 lg:w-72 bg-[#0f172a] text-white sticky top-20 self-start">
      <div className="mb-4 rounded-2xl border-solid border border-gray-700 p-4">
        <label className="block text-sm text-gray-300 mb-2 font-semibold">SORT</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 rounded bg-[#0f1724] text-sm text-gray-200">
          <option value="popularity.desc">Popuplarity Descending</option>
          <option value="popularity.asc">Popuplarity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="primary_release_date.asc">Release Date Descending</option>
          <option value="release_date.desc">Release Date Ascending</option>
          <option value="original_title.asc">Title (A - Z)</option>
          <option value="original_title.desc">Title (Z - A)</option>
        </select>
      </div>
      
      <div className="mb-4 rounded-2xl border-solid border border-gray-700 p-4 flex flex-col gap-2">
        <h4 className="font-semibold mb-3">FILTER</h4>
        <label className="block text-sm text-gray-300 mb-2">Thể loại</label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-2">
          {genres.length === 0 && <div className="text-xs text-gray-500">Đang tải...</div>}
          {genres.map((g) => {
            const selected = selectedGenres.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`text-sm px-3 py-1 rounded-full transition-colors duration-150 border ${
                  selected
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-transparent text-gray-200 border-gray-700 hover:bg-gray-700"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
        
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">Năm phát hành</label>
        <input
          type="number"
          min={1900}
          max={new Date().getFullYear()}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Ví dụ: 2023"
          className="w-full p-2 rounded bg-[#0f1724] text-sm text-gray-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">Ngôn ngữ</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 rounded bg-[#0f1724] text-sm text-gray-200">
          <option value="">Mặc định</option>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="fr">Français</option>
        </select>
      </div>
      </div>
      <div>
        <button onClick={apply} className="w-full bg-cyan-500 text-black py-2 rounded text-sm font-medium">
          Tìm kiếm
        </button>
      </div>
    </aside>
  );
}