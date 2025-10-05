import React, { useEffect, useState } from 'react';

interface HeaderProps {
    title: string;
    user?: {
        name: string;
        avatar?: string;
    };
}

const Header: React.FC<HeaderProps> = ({ title, user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        // Using optional chaining and nullish coalescing
        const userName = user?.name ?? 'Guest';
        document.title = `${title} - Welcome ${userName}`;
    }, [title, user?.name]);
    
    const handleShare = async () => {
        // Web Share API usage
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Sharing failed:', error);
            }
        }
    };
    
    return (
        <header className="header">
            <h1>{title}</h1>
            <nav className="nav">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                >
                    Menu
                </button>
                {user && (
                    <div className="user-info">
                        <img 
                            src={user.avatar ?? '/default-avatar.png'} 
                            alt={`${user.name} avatar`}
                            loading="lazy"
                        />
                        <span>{user.name}</span>
                        <button onClick={handleShare}>Share</button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;