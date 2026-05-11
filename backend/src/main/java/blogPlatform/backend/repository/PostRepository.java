package blogPlatform.backend.repository;

import blogPlatform.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByAuthorEmail(String email);
}