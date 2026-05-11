package blogPlatform.backend.repository;

import blogPlatform.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}
