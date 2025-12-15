import { Play } from 'lucide-react';
import bannerImage from '../assets/home-background.png';

const Banner = () => {
  return (
    <div
      className="h-[470px] w-[1060px] bg-cover bg-center relative mt-8 mr-auto ml-auto"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black opacity-70"></div>
      <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white">
        <h1 className="text-4xl font-bold mb-4 text-left">
          Hitman's Wife's<br /> Bodyguard
        </h1>
        <p className="text-lg mb-6 text-left text-[#ffb43a]">Releasing 23 July</p>
        <div className="flex items-center gap-4">
          {/* Nút Play */}
          <button
            className="flex items-center justify-center w-10 h-10 bg-[#f8a92a] text-[#fcfeff] rounded-full text-[21px] leading-[21px] hover:bg-[#ffa726] transition"
          >
            <Play className="w-5 h-5" />
          </button>

          {/* Phần text "Watch the Trailer" */}
          <span className="text-lg font-medium text-white hover:text-[#ffb43a] transition cursor-pointer">
            Watch the Trailer
          </span>
        </div>
      </div>
    </div>
  );
};

export default Banner;