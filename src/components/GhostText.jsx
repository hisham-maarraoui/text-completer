import React from 'react';
import { useEffect} from 'react';

const GhostText = ({ text, position, style, onTabComplete }) => {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault(); // Stop default tab behavior
                onTabComplete(text);
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [onTabComplete, text]);

    return (
        <div 
            className="fixed pointer-events-none"
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 999999,
                whiteSpace: 'pre',
                pointerEvents: 'none',
                userSelect: 'none',
                color: 'rgba(169, 169, 169, 0.73)',
                ...style
            }}
        >
        {text}
        </div>
    );
};

export default GhostText;