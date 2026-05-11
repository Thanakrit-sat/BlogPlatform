package blogPlatform.backend.controller;

import blogPlatform.backend.dto.CommentRequest;
import blogPlatform.backend.dto.PostRequest;
import blogPlatform.backend.dto.PostResponse;
import blogPlatform.backend.model.Comment;
import blogPlatform.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostService postService;

    // CRUD
    @GetMapping
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public PostResponse getPost(@PathVariable String id) {
        return postService.getPostById(id);
    }

    @PostMapping
    public PostResponse createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return postService.createPost(request, user.getUsername());
    }

    @PutMapping("/{id}")
    public PostResponse updatePost(
            @PathVariable String id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return postService.updatePost(id, request, user.getUsername());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user) {
        postService.deletePost(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    // Comments
    @GetMapping("/{id}/comments")
    public List<Comment> getComments(@PathVariable String id) {
        return postService.getComments(id);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return postService.addComment(id, request, user.getUsername());
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal UserDetails user) {
        postService.deleteComment(commentId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    // Like
    @PostMapping("/{id}/like")
    public Map<String, Object> toggleLike(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user) {
        boolean liked = postService.toggleLike(id, user.getUsername());
        return Map.of(
                "liked", liked,
                "likeCount", postService.getPostById(id).getLikeCount()
        );
    }

    // Share
    @GetMapping("/{id}/share")
    public Map<String, String> getShareUrl(@PathVariable String id) {
        return Map.of("url", postService.getShareUrl(id));
    }
}