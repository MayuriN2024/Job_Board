package com.careerorbit.repository;

import com.careerorbit.entity.Job;
import com.careerorbit.entity.SavedJob;
import com.careerorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);
    Optional<SavedJob> findByUserAndJob(User user, Job job);
}
