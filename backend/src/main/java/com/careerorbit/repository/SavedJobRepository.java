package com.careerorbit.repository;

import com.careerorbit.entity.SavedJob;
import com.careerorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);
}
