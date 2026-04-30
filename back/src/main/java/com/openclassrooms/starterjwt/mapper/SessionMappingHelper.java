package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SessionMappingHelper {

    private final TeacherService teacherService;
    private final UserService userService;

    @Named("idToTeacher")
    public Teacher idToTeacher(Long id) {
        return id != null ? teacherService.findById(id) : null;
    }

    @Named("userIdsToUsers")
    public List<User> userIdsToUsers(List<Long> ids) {
        if (ids == null) return Collections.emptyList();
        return ids.stream().map(userService::findById).toList();
    }

    @Named("usersToUserIds")
    public List<Long> usersToUserIds(List<User> users) {
        if (users == null) return Collections.emptyList();
        return users.stream().map(User::getId).toList();
    }
}
