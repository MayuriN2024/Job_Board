package com.careerorbit.repository;

import com.careerorbit.entity.Application;
import com.careerorbit.entity.Job;
import com.careerorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserOrderByAppliedAtDesc(User user);
    List<Application> findByJobRecruiterOrderByAppliedAtDesc(User recruiter);
    Optional<Application> findByUserAndJob(User user, Job job);
}
