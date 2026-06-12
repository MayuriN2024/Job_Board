package com.careerorbit.repository;

import com.careerorbit.entity.Application;
import com.careerorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUser(User user);
}
