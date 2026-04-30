package com.openclassrooms.starterjwt.payload.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    private String password;

}
