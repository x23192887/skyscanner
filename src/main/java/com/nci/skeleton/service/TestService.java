package com.nci.skeleton.service;

import com.nci.skeleton.entity.TestEntity;
import com.nci.skeleton.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    private final TestRepository testRepository;

    @Autowired
    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public List<TestEntity> getAllResults() {
        return this.testRepository.findAll();
    }
}
