package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {SessionMappingHelper.class})
public interface SessionMapper extends EntityMapper<SessionDto, Session> {

    @Mapping(source = "description", target = "description")
    @Mapping(source = "teacherId", target = "teacher", qualifiedByName = "idToTeacher")
    @Mapping(source = "users", target = "users", qualifiedByName = "userIdsToUsers")
    Session toEntity(SessionDto sessionDto);

    @Mapping(source = "description", target = "description")
    @Mapping(source = "teacher.id", target = "teacherId")
    @Mapping(source = "users", target = "users", qualifiedByName = "usersToUserIds")
    SessionDto toDto(Session session);
}
