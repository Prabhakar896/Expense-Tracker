import { useNavigate } from "react-router-dom";
import TextPressure from "../Design/TextPressure";
import DecryptedText from "../Design/DecryptedText";
import ShinyText from '../Design/Shinytext';
import Particles from "../Design/Particles";

function FirstHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col justify-center items-center gap-1 relative">
      {/* Particles Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={500}
          particleSpread={7}
          speed={0.5}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* TextPressure Animation */}
        <div className="w-full flex justify-center">
          <div style={{ position: 'relative', height: '200px', width: '100%', maxWidth: '800px' }}>
            <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
              <TextPressure 
                className="font-lg"
                text="Expense Tracker"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={24} // Adjusted for smaller screens
              />
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="w-full max-w-[400px] md:max-w-[500px] p-6 md:p-8 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg flex flex-col items-center text-center mt-[-100px] md:mt-[-150px]">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Welcome to Expense Tracker
          </h3>
          <p className="mb-4 text-sm md:text-base">
            <ShinyText 
              text="Take control of your finances with our simple and powerful Expense Tracker. Whether you're tracking daily expenses or planning for the future, our tool helps you stay organized and financially aware. Start tracking today!" 
              disabled={false} 
              speed={3} 
            />
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full justify-center mb-4">
            <h5 className="text-gray-900 text-sm md:text-base">New User?</h5>
            <button 
              onClick={() => navigate("/register")} 
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all cursor-pointer text-sm md:text-base"
            >
              Sign Up
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full justify-center">
            <h5 className="text-gray-900 text-sm md:text-base">Already have an account?</h5>
            <button 
              onClick={() => navigate("/login")} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all cursor-pointer text-sm md:text-base"
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