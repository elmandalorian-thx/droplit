import { motion } from 'framer-motion';
import { useProfileStore } from '../../store/profileStore';
import { BlobbyAvatar } from '../ui/BlobbyAvatar';
import './LeaderboardScreen.css';

interface LeaderboardScreenProps {
    onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
    const { profiles } = useProfileStore();

    // Sort profiles by highest level, then total clears
    const sortedProfiles = [...profiles].sort((a, b) => {
        if (b.stats.highestLevel !== a.stats.highestLevel) {
            return b.stats.highestLevel - a.stats.highestLevel;
        }
        return b.stats.totalClears - a.stats.totalClears;
    });

    return (
        <div className="leaderboard-screen">
            <div className="leaderboard-bg">
                {/* Reusing the water effect from welcome screen via CSS or component if needed, 
                    but here we'll use the CSS background */}
                <div className="ripple-container">
                    <div className="ripple" style={{ left: '20%', top: '30%', animationDelay: '0s' }} />
                    <div className="ripple" style={{ left: '80%', top: '60%', animationDelay: '2s' }} />
                    <div className="ripple" style={{ left: '50%', top: '80%', animationDelay: '4s' }} />
                </div>
            </div>

            <motion.div
                className="leaderboard-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="leaderboard-title">Leaderboard</h1>

                <div className="leaderboard-list">
                    <div className="leaderboard-header">
                        <span>Rank</span>
                        <span>Player</span>
                        <span>Level</span>
                        <span>Combo</span>
                        <span>Clears</span>
                    </div>

                    {sortedProfiles.map((profile, index) => (
                        <motion.div
                            key={profile.id}
                            className={`leaderboard-row ${index < 3 ? `rank-${index + 1}` : ''}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="rank-col">
                                {index === 0 && '👑'}
                                {index === 1 && '🥈'}
                                {index === 2 && '🥉'}
                                {index > 2 && `#${index + 1}`}
                            </div>

                            <div className="player-col">
                                <div className="player-avatar-small">
                                    <BlobbyAvatar
                                        seed={profile.avatarSeed}
                                        color={profile.avatarColor}
                                        size={32}
                                    />
                                </div>
                                <span className="player-name">{profile.name}</span>
                            </div>

                            <div className="stat-col level-stat">
                                {profile.stats.highestLevel}
                            </div>

                            <div className="stat-col">
                                {profile.stats.bestCombo}
                            </div>

                            <div className="stat-col">
                                {profile.stats.totalClears}
                            </div>
                        </motion.div>
                    ))}

                    {sortedProfiles.length === 0 && (
                        <div className="empty-leaderboard">
                            No profiles yet. Start playing!
                        </div>
                    )}
                </div>

                <motion.button
                    className="back-btn"
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Back to Menu
                </motion.button>
            </motion.div>
        </div>
    );
}
