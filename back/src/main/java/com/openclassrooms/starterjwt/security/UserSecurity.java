package com.openclassrooms.starterjwt.security;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSecurity {
    private final UserService userService;

    public boolean isOwner(Long id, String authenticatedEmail) {
        User user = userService.findById(id);
        return user != null && user.getEmail().equals(authenticatedEmail);
    }
}
