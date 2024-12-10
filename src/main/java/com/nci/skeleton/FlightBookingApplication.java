package com.nci.skeleton;

import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.repository.FlightRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@SpringBootApplication
public class FlightBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlightBookingApplication.class, args);
    }
    
}
