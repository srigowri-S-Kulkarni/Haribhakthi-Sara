ALTER TABLE songs ADD COLUMN IF NOT EXISTS audio_hash VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_songs_audio_hash ON songs(audio_hash);
