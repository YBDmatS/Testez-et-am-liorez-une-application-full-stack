package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean register(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return false;
        }

        User user = new User(
                signUpRequest.getEmail(),
                signUpRequest.getLastName(),
                signUpRequest.getFirstName(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                false);

        userRepository.save(user);
        return true;
    }
}
