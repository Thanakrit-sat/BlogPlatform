package blogPlatform.backend.security;

import blogPlatform.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Authorization header
        String authHeader = request.getHeader("Authorization");
        System.out.println(">>> Auth header: " + authHeader);  // เพิ่มบรรทัดนี้
        System.out.println(">>> Request URI: " + request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // token
        String token = authHeader.substring(7);

        // check token is valid
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // get email from token
        String email = jwtUtil.extractEmail(token);

        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // find user from DB
            boolean userExists = userRepository.existsByEmail(email);
            if (!userExists) {
                filterChain.doFilter(request, response);
                return;
            }

            // build UserDetails and set SecurityContext
            UserDetails userDetails = User.builder()
                    .username(email)
                    .password("")         // ไม่จำเป็นต้องใส่ตอนนี้
                    .authorities(List.of())
                    .build();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // send to controller
        filterChain.doFilter(request, response);
    }
}
