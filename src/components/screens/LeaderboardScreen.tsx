import { motion } from 'framer-motion';
import { useProfileStore } from '../../store/profileStore';
import { BlobbyAvatar } from '../ui/BlobbyAvatar';
import './LeaderboardScreen.css';

interface LeaderboardScreenProps {
    onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
    const { profiles } = useProfileStore();

    const sortedProfiles = [...profiles].sort((a, b) => {
        if (b.stats.highestLevel !== a.stats.highestLevel) {
            return b.stats.highestLevel - a.stats.highestLevel;
        }
        return b.stats.totalClears - a.stats.totalClears;
    });

    return (
        <div className="leaderboard-screen">
            <div className="leaderboard-bg" />

            <motion.div
                className="leaderboard-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <h1 className="leaderboard-title">Rankings</h1>

                <div className="leaderboard-list">
                    <div className="leaderboard-header">
                        <span>#</span>
                        <span>Player</span>
                        <span>Level</span>
                        <span>Combo</span>
                        <span>Clears</span>
                    </div>

                    {sortedProfiles.map((profile, index) => (
                        <motion.div
                            key={profile.id}
                            className={`leaderboard-row ${index < 3 ? `rank-${index + 1}` : ''}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                        >
                            <div className="rank-col">
                                {index + 1}
                            </div>

                            <div className="player-col">
                                <BlobbyAvatar
                                    seed={profile.avatarSeed}
                                    color={profile.avatarColor}
                                    size={28}
                                />
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
                            No players yet.
                        </div>
                    )}
                </div>

                <motion.button
                    className="back-btn"
                    onClick={onBack}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Back
                </motion.button>
            </motion.div>
        </div>
    );
}
