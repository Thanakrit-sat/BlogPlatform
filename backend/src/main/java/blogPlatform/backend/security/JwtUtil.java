package blogPlatform.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    // read application.properties
    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 24 * 7;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)                    // เปลี่ยนจาก setSubject()
                .issuedAt(new Date())              // เปลี่ยนจาก setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey())                // ไม่ต้องระบุ algorithm แล้ว
                .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()                       // เปลี่ยนจาก parserBuilder()
                .verifyWith(getKey())              // เปลี่ยนจาก setSigningKey()
                .build()
                .parseSignedClaims(token)          // เปลี่ยนจาก parseClaimsJws()
                .getPayload();
    }
}
