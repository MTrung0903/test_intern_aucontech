package posts_management.backend.service;


import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import posts_management.backend.dto.PostDTO;
import posts_management.backend.dto.PostResponseDTO;
import posts_management.backend.entity.Post;
import posts_management.backend.entity.User;
import posts_management.backend.repository.PostRepository;
import posts_management.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public PostResponseDTO createPost(PostDTO postDTO, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        BeanUtils.copyProperties(postDTO, post, "createdAt");
        post.setCreatedAt(LocalDateTime.now());
        post.setAuthor(author);
        Post saved = postRepository.save(post);
        return new PostResponseDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getAuthor().getUsername()
        );
    }
    private Pageable sortPostsByCreated(Pageable pageable) {
        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }
    public Page<PostResponseDTO> getPostsByUser(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable sortedPageable = sortPostsByCreated(pageable);
        return postRepository.findByAuthorId(user.getId(), sortedPageable)
                .map(p -> new PostResponseDTO(
                        p.getId(),
                        p.getTitle(),
                        p.getContent(),
                        p.getCreatedAt(),
                        p.getAuthor().getUsername()
                ));
    }
    public Page<PostResponseDTO> getAll(Pageable pageable) {
        Pageable sortedPageable = sortPostsByCreated(pageable);
        return postRepository.findAll(sortedPageable)
                .map(p -> new PostResponseDTO(
                        p.getId(), p.getTitle(), p.getContent(), p.getCreatedAt(), p.getAuthor().getUsername()
                ));
    }
    public PostResponseDTO getPost(Long id) {
        Post p = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return new PostResponseDTO(
                p.getId(), p.getTitle(), p.getContent(), p.getCreatedAt(), p.getAuthor().getUsername()
        );
    }

    public PostResponseDTO updatePost(Long id, PostDTO postDTO, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!java.util.Objects.equals(post.getAuthor().getId(), user.getId())) {
            throw new RuntimeException("Not authorized to update this post");
        }

        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        Post saved = postRepository.save(post);
        return new PostResponseDTO(
                saved.getId(), saved.getTitle(), saved.getContent(), saved.getCreatedAt(), saved.getAuthor().getUsername()
        );
    }

    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!java.util.Objects.equals(post.getAuthor().getId(), user.getId())) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.delete(post);
    }
    public Page<PostResponseDTO> findPostsByTitle(String title, Pageable pageable) {
        Pageable sortedPageable = sortPostsByCreated(pageable);
        return postRepository.findByTitleContainingIgnoreCase(title, sortedPageable)
                .map(p -> new PostResponseDTO(
                        p.getId(), p.getTitle(), p.getContent(), p.getCreatedAt(), p.getAuthor().getUsername()
                ));
    }

}
