package com.careerorbit.config;

import com.careerorbit.entity.Job;
import com.careerorbit.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final JobRepository jobRepository;

    @Override
    public void run(String... args) throws Exception {
        if (jobRepository.count() == 0) {
            Job job1 = Job.builder()
                    .title("Software Development Engineer II")
                    .company("Amazon India")
                    .location("Bengaluru, Karnataka")
                    .salary("₹25–40 LPA")
                    .salaryMin(25)
                    .salaryMax(40)
                    .category("Engineering")
                    .featured(true)
                    .applyUrl("https://www.amazon.jobs/en/search?base_query=software+development+engineer&loc_query=India")
                    .tags("Java,AWS,System Design")
                    .description("Amazon India is hiring SDEs to build scalable services for millions of customers. You will design, develop, and deploy high-availability systems on AWS.")
                    .responsibilities("Design and implement backend services at scale\nCollaborate with product and QA teams on feature delivery\nImprove reliability, performance, and operational excellence\nParticipate in code reviews and technical design discussions")
                    .requirements("2+ years of professional software development experience\nStrong fundamentals in data structures and algorithms\nExperience with Java, Python, or similar languages\nBachelor's degree in CS or equivalent experience")
                    .employmentType("Full-time")
                    .experience("2+ years")
                    .postedDays(1)
                    .build();

            Job job2 = Job.builder()
                    .title("Senior Frontend Engineer")
                    .company("Flipkart")
                    .location("Bengaluru, Karnataka")
                    .salary("₹18–32 LPA")
                    .salaryMin(18)
                    .salaryMax(32)
                    .category("Engineering")
                    .featured(true)
                    .applyUrl("https://www.flipkartcareers.com/")
                    .tags("React,TypeScript,Next.js")
                    .description("Flipkart is looking for a Senior Frontend Engineer to own the UI Architecture of our shopping portals. You will build highly responsive, user-friendly customer experiences.")
                    .responsibilities("Optimize frontend performance for millions of concurrent users\nRefactor and maintain core shared UI component library\nWork closely with UX designers to implement pixel-perfect user flows\nMentor junior frontend engineers and define coding standards")
                    .requirements("4+ years of experience building production React/Web apps\nDeep understanding of HTML5, CSS3, ES6+ JavaScript\nExperience with web performance optimization (Lighthouse, Core Web Vitals)\nFamiliarity with state management like Redux or Context API")
                    .employmentType("Full-time")
                    .experience("4+ years")
                    .postedDays(2)
                    .build();

            Job job3 = Job.builder()
                    .title("Product Designer")
                    .company("Swiggy")
                    .location("Bengaluru, Karnataka")
                    .salary("₹12–22 LPA")
                    .salaryMin(12)
                    .salaryMax(22)
                    .category("Design")
                    .featured(true)
                    .applyUrl("https://careers.swiggy.com/")
                    .tags("Figma,UI/UX,Wireframing")
                    .description("Swiggy is seeking a Product Designer to design the future of food delivery and quick commerce interfaces. You will create intuitive, user-friendly designs for mobile and web apps.")
                    .responsibilities("Translate complex user problems into elegant, simple interfaces\nCreate user flows, wireframes, prototypes, and high-fidelity mockups\nConduct user research and usability testing to validate design concepts\nCollaborate with product managers and engineers to execute designs")
                    .requirements("2+ years of experience in product/interaction design\nStrong portfolio showcasing UI/UX designs for consumer apps\nExpertise in Figma, Sketch, or Adobe Creative Suite\nUnderstanding of design systems and typography")
                    .employmentType("Full-time")
                    .experience("2+ years")
                    .postedDays(3)
                    .build();

            Job job4 = Job.builder()
                    .title("Backend Developer")
                    .company("Razorpay")
                    .location("Bengaluru, Karnataka")
                    .salary("₹15–28 LPA")
                    .salaryMin(15)
                    .salaryMax(28)
                    .category("Engineering")
                    .featured(false)
                    .applyUrl("https://razorpay.com/jobs/")
                    .tags("Node.js,Go,PostgreSQL")
                    .description("Razorpay is hiring Backend Developers to build payment gateways and financial API services. You will join the core transactional engineering group.")
                    .responsibilities("Design and develop highly secure, resilient backend APIs\nImplement transaction processing systems with low latency\nEnsure ACID compliance across various transactional services\nOptimize SQL queries and database performance")
                    .requirements("3+ years of experience with Node.js, Go, or Java\nStrong database concepts (SQL, indexing, transactions)\nFamiliarity with microservices architecture and Docker\nUnderstanding of API security patterns (OAuth, JWT)")
                    .employmentType("Full-time")
                    .experience("3+ years")
                    .postedDays(1)
                    .build();

            Job job5 = Job.builder()
                    .title("Marketing Manager")
                    .company("Meesho")
                    .location("Remote (India)")
                    .salary("₹8–15 LPA")
                    .salaryMin(8)
                    .salaryMax(15)
                    .category("Marketing")
                    .featured(false)
                    .applyUrl("https://careers.meesho.com/")
                    .tags("Growth,SEO,Campaigns")
                    .description("Meesho is looking for a growth-oriented Marketing Manager to manage brand awareness campaigns, drive organic traffic, and oversee content channels.")
                    .responsibilities("Develop and execute brand campaigns on social channels\nOptimize organic discovery through SEO strategies\nAnalyze traffic and acquisition cost metrics weekly\nCoordinate with design and content creators on digital assets")
                    .requirements("3+ years in digital marketing or growth roles\nExperience running paid and organic social campaigns\nAnalytics proficiency (Google Analytics, Mixpanel)\nExcellent copy and content creation skills")
                    .employmentType("Full-time")
                    .experience("3+ years")
                    .postedDays(4)
                    .build();

            Job job6 = Job.builder()
                    .title("Financial Analyst")
                    .company("CRED")
                    .location("Bengaluru, Karnataka")
                    .salary("₹10–18 LPA")
                    .salaryMin(10)
                    .salaryMax(18)
                    .category("Finance")
                    .featured(false)
                    .applyUrl("https://careers.cred.club/")
                    .tags("Modeling,Excel,Budgeting")
                    .description("CRED is looking for a Financial Analyst to join our strategic finance team. You will build models, forecast budgets, and optimize business costs.")
                    .responsibilities("Construct and maintain corporate financial models\nCoordinate monthly budget reviews across departments\nPerform cost benefit analysis on vendor contracts\nPrepare investor relations and board slides")
                    .requirements("2+ years in financial analyst or advisory roles\nExpert level Microsoft Excel skills\nStrong knowledge of corporate finance and accounts\nCA or MBA in Finance from a top tier institute")
                    .employmentType("Full-time")
                    .experience("2+ years")
                    .postedDays(5)
                    .build();

            jobRepository.saveAll(Arrays.asList(job1, job2, job3, job4, job5, job6));
            System.out.println("Database pre-seeded with initial jobs!");
        }
    }
}
