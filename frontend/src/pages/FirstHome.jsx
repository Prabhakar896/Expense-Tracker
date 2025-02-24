import { useNavigate } from "react-router-dom";
import TextPressure from "../Design/TextPressure";
import DecryptedText from "../Design/DecryptedText";
import ShinyText from '../Design/Shinytext';
import Particles from "../Design/Particles";

function FirstHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col justify-center items-center gap-1 relative">
 
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

      <div className="relative z-10">
        <div style={{ position: 'relative', height: '300px' }}>
        <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

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
            minFontSize={36}
          />
          </div>
        </div>

        <div className="w-[400px] p-8 bg-white shadow-lg rounded-lg flex flex-col items-center text-center mt-[-200px] backdrop-blur-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 h1">
            Welcome to Expense Tracker
          </h3>
          <p className="mb-4 mt-4 p1">
            <ShinyText 
              text="Take control of your finances with our simple and powerful Expense Tracker. Whether you're tracking daily expenses or planning for the future, our tool helps you stay organized and financially aware. Start tracking today!" 
              disabled={false} 
              speed={3} 
            />
          </p>

          <div className="flex items-center gap-3 w-full justify-center mb-4 mt-4">
            <h5 className="text-gray-900">New User?</h5>
            <button 
              onClick={() => navigate("/register")} 
              className="bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
          <div className="flex items-center gap-3 w-full justify-center">
            <h5 className="text-gray-900">Already have an account?</h5>
            <button 
              onClick={() => navigate("/login")} 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-900 transition-all cursor-pointer"
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