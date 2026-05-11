package blogPlatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PostResponse {
    private String id;
    private String title;
    private String content;
    private String authorUsername;
    private int likeCount;
    private int commentCount;
    // url for sharing the post
    private String shareUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
