package com.haribhakthi.history;

import com.haribhakthi.common.dto.SongDto;
import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.song.Song;
import com.haribhakthi.song.SongRepository;
import com.haribhakthi.song.SongStatus;
import com.haribhakthi.user.User;
import com.haribhakthi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final ListeningHistoryRepository historyRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public HistoryService(ListeningHistoryRepository historyRepository, SongRepository songRepository, UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    public List<SongDto> getRecentlyPlayed(UUID userId) {
        return historyRepository.findByUserIdOrderByPlayedAtDesc(userId).stream()
                .map(ListeningHistory::getSong)
                .filter(song -> song.getStatus() == SongStatus.ACTIVE)
                .distinct()
                .map(SongDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void recordPlayback(UUID userId, UUID songId, Integer progressSeconds, Boolean completed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));

        if (song.getStatus() != SongStatus.ACTIVE) {
            return; // Ignore inactive songs
        }

        ListeningHistory history = new ListeningHistory(user, song, progressSeconds, completed);
        history.setPlayedAt(ZonedDateTime.now());
        historyRepository.save(history);
    }
}
