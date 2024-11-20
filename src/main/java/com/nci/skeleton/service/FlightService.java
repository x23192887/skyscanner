package com.nci.skeleton.service;

import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.model.Airports;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.repository.BookingRepository;
import com.nci.skeleton.repository.FlightRepository;
import com.nci.skeleton.repository.UserRepository;
import com.nci.skeleton.security.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.nci.skeleton.config.Constants.STATUS_ACTIVE;
import static java.util.Objects.nonNull;


@Service
public class FlightService {

    @Autowired
    FlightRepository flightRepository;

    public List<Flight> getFlights() {
        return flightRepository.findAll().stream().peek(flight -> {
            // Find the airport name based on the flight's 'fromAirport' field
            String fromAirportName = MasterDataService.data.getCountries().stream()
                    .flatMap(country -> country.getAirportsList().stream())  // Flatten the airports from all countries
                    .filter(airport -> airport.getAirportId().equalsIgnoreCase(flight.getFromAirport())) // Match airport ID
                    .map(Airports::getAirportName) // Get the airport name
                    .findFirst() // Retrieve the first matching airport
                    .orElse(flight.getFromAirport()); // If no match found, keep original value

            // Set the resolved airport name for 'fromAirport'
            flight.setFromAirport(fromAirportName);

            // Find the airport name based on the flight's 'toAirport' field
            String toAirportName = MasterDataService.data.getCountries().stream()
                    .flatMap(country -> country.getAirportsList().stream())  // Flatten the airports from all countries
                    .filter(airport -> airport.getAirportId().equalsIgnoreCase(flight.getToAirport())) // Match airport ID
                    .map(Airports::getAirportName) // Get the airport name
                    .findFirst() // Retrieve the first matching airport
                    .orElse(flight.getToAirport()); // If no match found, keep original value

            // Set the resolved airport name for 'toAirport'
            flight.setToAirport(toAirportName);

        }).collect(Collectors.toList()); // Collect the result into a List

    }

    public Flight getFlightDetails(UUID id) {
        // Fetch the flight from the repository using the flight ID
        return flightRepository.findById(id).map(flight -> {
            // Find the airport name based on the flight's 'fromAirport' field
            String fromAirportName = MasterDataService.data.getCountries().stream()
                    .flatMap(country -> country.getAirportsList().stream())  // Flatten the airports from all countries
                    .filter(airport -> airport.getAirportId().equalsIgnoreCase(flight.getFromAirport())) // Match airport ID
                    .map(Airports::getAirportName) // Get the airport name
                    .findFirst() // Retrieve the first matching airport
                    .orElse(flight.getFromAirport()); // If no match found, keep original value

            // Set the resolved airport name for 'fromAirport'
            flight.setFromAirport(fromAirportName);

            // Find the airport name based on the flight's 'toAirport' field
            String toAirportName = MasterDataService.data.getCountries().stream()
                    .flatMap(country -> country.getAirportsList().stream())  // Flatten the airports from all countries
                    .filter(airport -> airport.getAirportId().equalsIgnoreCase(flight.getToAirport())) // Match airport ID
                    .map(Airports::getAirportName) // Get the airport name
                    .findFirst() // Retrieve the first matching airport
                    .orElse(flight.getToAirport()); // If no match found, keep original value

            // Set the resolved airport name for 'toAirport'
            flight.setToAirport(toAirportName);

            // Return the modified flight object
            return flight;
        }).orElse(null); // Handle the case where flight is not found
    }


}
