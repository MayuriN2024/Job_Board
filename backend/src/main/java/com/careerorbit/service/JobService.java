package com.careerorbit.service;

import com.careerorbit.entity.Job;
import com.careerorbit.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository repository;

    public List<Job> getAllJobs() {
        return repository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return repository.findById(id);
    }

    public Job createJob(Job job) {
        return repository.save(job);
    }

    public Job updateJob(Long id, Job jobDetails) {
        Job job = repository.findById(id).orElseThrow();
        job.setTitle(jobDetails.getTitle());
        job.setCompany(jobDetails.getCompany());
        job.setLocation(jobDetails.getLocation());
        job.setSalary(jobDetails.getSalary());
        job.setDescription(jobDetails.getDescription());
        job.setSkills(jobDetails.getSkills());
        job.setExperience(jobDetails.getExperience());
        job.setEmploymentType(jobDetails.getEmploymentType());
        return repository.save(job);
    }

    public void deleteJob(Long id) {
        repository.deleteById(id);
    }
}
