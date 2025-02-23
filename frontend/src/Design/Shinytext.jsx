const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
  return (
    <div
      className={`relative inline-block text-transparent bg-clip-text ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgb(0, 0, 0),rgb(28, 32, 88),rgb(86, 87, 146),rgb(202, 199, 219))',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animation: `shine ${6}s linear infinite`,
      }}
    >
      {text}
    </div>
  );
};



  
  export default ShinyText;
  
  // tailwind.config.js
  // module.exports = {
  //   theme: {
  //     extend: {
  //       keyframes: {
  //         shine: {
  //           '0%': { 'background-position': '100%' },
  //           '100%': { 'background-position': '-100%' },
  //         },
  //       },
  //       animation: {
  //         shine: 'shine 5s linear infinite',
  //       },
  //     },
  //   },
  //   plugins: [],
  // };