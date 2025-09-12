package posts_management.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import posts_management.backend.entity.Post;


import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorId(Long id);
    Page<Post> findByAuthorId(Long id, Pageable pageable);

    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}