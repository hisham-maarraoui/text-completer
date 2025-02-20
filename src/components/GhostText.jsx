import React from 'react';

const GhostText = ({ text, position, style }) => {
  return (
    <div 
      className="fixed text-gray-400 pointer-events-none"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999999,
        whiteSpace: 'pre',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      {text}
    </div>
  );
};

export default GhostText;

// import React from 'react';

// const GhostText = ({ text, position }) => {
//   return (
//     <div 
//       className="fixed text-gray-400 pointer-events-none z-[9999]"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//       }}
//     >
//       {text}
//     </div>
//   );
// };

// export default GhostText;