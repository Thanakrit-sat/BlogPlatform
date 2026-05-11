package blogPlatform.backend.repository;

import blogPlatform.backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, String> {
    Optional<Like> findByUserEmailAndPostId(String email, String postId);
    int countByPostId(String postId);
    boolean existsByUserEmailAndPostId(String email, String postId);
}
