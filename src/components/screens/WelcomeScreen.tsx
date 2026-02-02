import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '../../store/profileStore';
import { BlobbyAvatar } from '../ui/BlobbyAvatar';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
    onStartGame: () => void;
}

export function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
    const { profiles, activeProfileId, createProfile, selectProfile, deleteProfile } = useProfileStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const handleCreateProfile = () => {
        if (newName.trim()) {
            createProfile(newName.trim());
            setNewName('');
            setIsCreating(false);
        }
    };

    const handleStartGame = () => {
        if (activeProfileId) {
            onStartGame();
        }
    };

    const handleDeleteProfile = (id: string) => {
        deleteProfile(id);
        setShowDeleteConfirm(null);
    };

    return (
        <div className="welcome-screen">
            {/* Animated background gradient */}
            <div className="welcome-bg" />

            {/* Water ripple effects */}
            <div className="ripple-container">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="ripple"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 1.5}s`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="welcome-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Logo */}
                <motion.h1
                    className="welcome-title"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                    🌊 DropLit 🌊
                </motion.h1>
                <p className="welcome-subtitle">Chain Reaction Puzzle</p>

                {/* Profile Selection */}
                <div className="profile-section">
                    <h2 className="section-title">Select Player</h2>

                    <div className="profile-list">
                        <AnimatePresence>
                            {profiles.map((profile, index) => (
                                <motion.div
                                    key={profile.id}
                                    className={`profile-card ${activeProfileId === profile.id ? 'active' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => selectProfile(profile.id)}
                                >
                                    <BlobbyAvatar
                                        seed={profile.avatarSeed}
                                        color={profile.avatarColor}
                                        size={56}
                                    />
                                    <div className="profile-info">
                                        <span className="profile-name">{profile.name}</span>
                                        <span className="profile-level">
                                            🏆 Level {profile.stats.highestLevel || 1}
                                        </span>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteConfirm(profile.id);
                                        }}
                                    >
                                        ✕
                                    </button>

                                    {/* Delete confirmation */}
                                    {showDeleteConfirm === profile.id && (
                                        <motion.div
                                            className="delete-confirm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span>Delete?</span>
                                            <button
                                                className="confirm-yes"
                                                onClick={() => handleDeleteProfile(profile.id)}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                className="confirm-no"
                                                onClick={() => setShowDeleteConfirm(null)}
                                            >
                                                No
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add new profile button */}
                        {profiles.length < 5 && !isCreating && (
                            <motion.button
                                className="add-profile-btn"
                                onClick={() => setIsCreating(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="add-icon">+</span>
                                <span>Add Player</span>
                            </motion.button>
                        )}

                        {/* New profile form */}
                        {isCreating && (
                            <motion.div
                                className="new-profile-form"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <input
                                    type="text"
                                    placeholder="Enter name..."
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
                                    autoFocus
                                    maxLength={12}
                                />
                                <div className="form-buttons">
                                    <button
                                        className="btn-create"
                                        onClick={handleCreateProfile}
                                        disabled={!newName.trim()}
                                    >
                                        Create
                                    </button>
                                    <button
                                        className="btn-cancel"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setNewName('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Start Game Button */}
                <motion.button
                    className="start-btn"
                    onClick={handleStartGame}
                    disabled={!activeProfileId}
                    whileHover={{ scale: activeProfileId ? 1.05 : 1 }}
                    whileTap={{ scale: activeProfileId ? 0.95 : 1 }}
                >
                    ▶ Start Game
                </motion.button>

                {/* Quick tip */}
                {!activeProfileId && profiles.length === 0 && (
                    <p className="tip-text">Create a profile to get started!</p>
                )}
            </motion.div>
        </div>
    );
}
