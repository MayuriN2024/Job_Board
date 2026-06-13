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
        return repository.findAllByOrderByIdDesc();
    }

    public Optional<Job> getJobById(Long id) {
        return repository.findById(id);
    }

    public Job createJob(Job job) {
        return repository.save(job);
    }

    public Job updateJob(Long id, Job jobDetails) {
        Job job = repository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        job.setTitle(jobDetails.getTitle());
        job.setCompany(jobDetails.getCompany());
        job.setLocation(jobDetails.getLocation());
        job.setSalary(jobDetails.getSalary());
        job.setSalaryMin(jobDetails.getSalaryMin());
        job.setSalaryMax(jobDetails.getSalaryMax());
        job.setCategory(jobDetails.getCategory());
        job.setFeatured(jobDetails.getFeatured());
        job.setApplyUrl(jobDetails.getApplyUrl());
        job.setTags(jobDetails.getTags());
        job.setDescription(jobDetails.getDescription());
        job.setResponsibilities(jobDetails.getResponsibilities());
        job.setRequirements(jobDetails.getRequirements());
        job.setExperience(jobDetails.getExperience());
        job.setEmploymentType(jobDetails.getEmploymentType());
        job.setPostedDays(jobDetails.getPostedDays());
        return repository.save(job);
    }

    public void deleteJob(Long id) {
        repository.deleteById(id);
    }
}
