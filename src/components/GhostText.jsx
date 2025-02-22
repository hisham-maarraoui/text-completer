import React from 'react';

const GhostText = ({ text, position, style, onTabComplete }) => {
  if (!position || !position.x || !position.y) {
    return null; // Don't render if we don't have valid position
  }

  const ghostStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    color: '#666',
    pointerEvents: 'none',
    zIndex: 9999,
    ...style
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      onTabComplete(text);
    }
  };

  // Add event listener for Tab key
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [text]);

  return (
    <div style={ghostStyle}>
      {text}
    </div>
  );
};

export default GhostText;