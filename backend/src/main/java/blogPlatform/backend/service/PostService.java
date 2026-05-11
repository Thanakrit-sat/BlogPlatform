package blogPlatform.backend.service;


import blogPlatform.backend.dto.CommentRequest;
import blogPlatform.backend.dto.PostRequest;
import blogPlatform.backend.dto.PostResponse;
import blogPlatform.backend.model.Comment;
import blogPlatform.backend.model.Like;
import blogPlatform.backend.model.Post;
import blogPlatform.backend.model.User;
import blogPlatform.backend.repository.CommentRepository;
import blogPlatform.backend.repository.LikeRepository;
import blogPlatform.backend.repository.PostRepository;
import blogPlatform.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    // helper: Post → PostResponse
    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getUsername(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId()).size(),
                baseUrl + "/posts/" + post.getId(),   // share URL
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Post getPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // CRUD
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PostResponse getPostById(String postId) {
        return toResponse(getPost(postId));
    }

    public PostResponse createPost(PostRequest request, String email) {
        User author = getUser(email);

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(author);

        return toResponse(postRepository.save(post));
    }

    public PostResponse updatePost(String postId, PostRequest request, String email) {
        Post post = getPost(postId);

        // only owner can be editing the post
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to edit this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        return toResponse(postRepository.save(post));
    }

    public void deletePost(String postId, String email) {
        Post post = getPost(postId);

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    // Comments
    public Comment addComment(String postId, CommentRequest request, String email) {
        Post post   = getPost(postId);
        User author = getUser(email);

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setAuthor(author);

        return commentRepository.save(comment);
    }

    public List<Comment> getComments(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    public void deleteComment(String commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    // Likes (toggle)
    public boolean toggleLike(String postId, String email) {
        Post post = getPost(postId);
        User user = getUser(email);

        // if already like → unlike, but unlike → like
        var existing = likeRepository.findByUserEmailAndPostId(email, postId);
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return false;   // unlike
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
            return true;    // liked
        }
    }

    public boolean isLikedByUser(String postId, String email) {
        return likeRepository.existsByUserEmailAndPostId(email, postId);
    }

    // Share post
    public String getShareUrl(String postId) {
        getPost(postId);   // ตรวจว่า post มีอยู่จริง
        return baseUrl + "/posts/" + postId;
    }
}
