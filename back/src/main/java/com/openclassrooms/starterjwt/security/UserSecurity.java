package com.openclassrooms.starterjwt.security;

import com.openclassrooms.starterjwt.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSecurity {
    private final UserService userService;

    public boolean isOwner(Long id, String authenticatedEmail) {
        return userService.findById(id).getEmail().equals(authenticatedEmail);
    }
}
