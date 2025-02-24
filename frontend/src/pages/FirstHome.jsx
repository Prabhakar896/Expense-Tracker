import { useNavigate } from "react-router-dom";
import TextPressure from "../Design/TextPressure";
import DecryptedText from "../Design/DecryptedText";
import ShinyText from "../Design/Shinytext";
import Particles from "../Design/Particles";

function FirstHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 w-full h-screen flex flex-col justify-center items-center relative overflow-hidden px-4">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={400}
          particleSpread={6}
          speed={0.4}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl text-center">
        {/* Title Animation */}
        <div className="mb-8 w-full flex justify-center">
          <TextPressure
            className="text-3xl md:text-4xl font-bold"
            text="Expense Tracker"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={20}
          />
        </div>

        {/* Welcome Card */}
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-6 md:p-8 flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Welcome to Expense Tracker
          </h3>
          <p className="text-sm md:text-base text-gray-700 mb-6">
            <ShinyText
              text="Take control of your finances with our powerful Expense Tracker. Whether you're managing daily expenses or planning for the future, our tool keeps you organized and financially aware. Start tracking today!"
              disabled={false}
              speed={2}
            />
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 text-white w-full md:w-auto px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all text-lg"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white w-full md:w-auto px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all text-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstHome;
