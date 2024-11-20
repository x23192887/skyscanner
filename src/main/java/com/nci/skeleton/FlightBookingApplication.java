package com.nci.skeleton;

import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.entity.TestEntity;
import com.nci.skeleton.repository.FlightRepository;
import com.nci.skeleton.repository.TestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@SpringBootApplication
public class FlightBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlightBookingApplication.class, args);
    }

    @Bean
    public CommandLineRunner init(FlightRepository flightRepository) {
        return new CommandLineRunner() {

            @Override
            public void run(String... args) throws Exception {
                List<String> airlines=List.of("Lufthansa","Air India", "Vistara",
                        "Aer Lingus","Etihad","British Airways","SWISS",
                        "Qatar Airways","IndiGo Airlines","Ryanair");

                List<BigDecimal> prices=List.of(BigDecimal.valueOf(1200),BigDecimal.valueOf(600),BigDecimal.valueOf(300),
                        BigDecimal.valueOf(1800),BigDecimal.valueOf(950),BigDecimal.valueOf(450),BigDecimal.valueOf(1650),
                        BigDecimal.valueOf(1450),BigDecimal.valueOf(1100),BigDecimal.valueOf(700),BigDecimal.valueOf(800));

                for (int i = 0; i < 0; i++) {
                    Flight testEntity=new Flight();
                    testEntity.setId(UUID.randomUUID());
                    testEntity.setAirline(airlines.get(randomRangeRandom(0,9)));
                    testEntity.setDuration(randomRangeRandom(1,18)+ " Hours");
                    testEntity.setFeatures(List.of("Premium","Free Cancellation","Meals Included"));
                    testEntity.setFromAirport(String.valueOf(randomRangeRandom(1,38)));
                    testEntity.setToAirport(String.valueOf(randomRangeRandom(1,38)));
                    testEntity.setStatus("AVAILABLE");
                    testEntity.setPrice(prices.get(randomRangeRandom(0,10)));
                    testEntity.setFlyDate(String.valueOf(LocalDate.now().plusDays(randomRangeRandom(1,90))));
                    testEntity.setImages(List.of("https://media.istockphoto.com/id/155439315/photo/passenger-airplane-flying-above-clouds-during-sunset.jpg?s=612x612&w=0&k=20&c=LJWadbs3B-jSGJBVy9s0f8gZMHi2NvWFXa3VJ2lFcL0=",
                            "https://img.freepik.com/free-photo/airplane_74190-463.jpg",
                            "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/10/Getty-1-1.jpg"));
                    flightRepository.save(testEntity);
                }
            }
        };
    }

    private int randomRangeRandom(int start, int end) {
        Random random = new Random();
        int number = random.nextInt((end - start) + 1) + start; // see explanation below
        return number;
    }


}
