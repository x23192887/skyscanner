package com.nci.skeleton.service;

import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.model.Airports;
import com.nci.skeleton.model.Country;
import com.nci.skeleton.model.MasterData;
import com.nci.skeleton.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightService flightService;

    private MasterData mockMasterData;

    @BeforeEach
    void setUp() {
        // Prepare mock MasterData
        mockMasterData = new MasterData();
        mockMasterData.setCountries(Arrays.asList(
                Country.builder()
                        .countryName("Test Country")
                        .airportsList(Arrays.asList(
                                Airports.builder()
                                        .airportId("1")
                                        .airportName("Test Airport From")
                                        .build(),
                                Airports.builder()
                                        .airportId("2")
                                        .airportName("Test Airport To")
                                        .build()
                        ))
                        .build()
        ));
    }

    @Test
    @DisplayName("Test getFlights method returns flights with airport names")
    void testGetFlights() {
        // Prepare mock flights
        Flight flight1 = new Flight();
        flight1.setFromAirport("1");
        flight1.setToAirport("2");

        Flight flight2 = new Flight();
        flight2.setFromAirport("1");
        flight2.setToAirport("2");

        // Mock repository and MasterDataService
        try (MockedStatic<MasterDataService> masterDataServiceMockedStatic =
                     Mockito.mockStatic(MasterDataService.class,
                             // Use a fallback answer to return the mock data
                             invocation -> {
                                 if (invocation.getMethod().getName().equals("getData")) {
                                     return mockMasterData;
                                 }
                                 return Mockito.RETURNS_DEFAULTS.answer(invocation);
                             })) {

            when(flightRepository.findAll()).thenReturn(Arrays.asList(flight1, flight2));

            List<Flight> flights = flightService.getFlights();

            // Verify results
            assertNotNull(flights);
            assertEquals(2, flights.size());

            // Check that airport IDs are replaced with airport names
            assertEquals("Chennai", flights.get(0).getFromAirport());
            assertEquals("Delhi NCR", flights.get(0).getToAirport());
        }
    }

    @Test
    @DisplayName("Test getFlightDetails returns flight with airport names")
    void testGetFlightDetails() {
        // Prepare mock flight
        Flight mockFlight = new Flight();
        mockFlight.setFromAirport("1");
        mockFlight.setToAirport("2");

        UUID flightId = UUID.randomUUID();

        // Mock repository and MasterDataService
        try (MockedStatic<MasterDataService> masterDataServiceMockedStatic =
                     Mockito.mockStatic(MasterDataService.class,
                             // Use a fallback answer to return the mock data
                             invocation -> {
                                 if (invocation.getMethod().getName().equals("getData")) {
                                     return mockMasterData;
                                 }
                                 return Mockito.RETURNS_DEFAULTS.answer(invocation);
                             })) {

            when(flightRepository.findById(flightId))
                    .thenReturn(Optional.of(mockFlight));

            Flight retrievedFlight = flightService.getFlightDetails(flightId);

            // Verify results
            assertNotNull(retrievedFlight);
            assertEquals("Chennai", retrievedFlight.getFromAirport());
            assertEquals("Delhi NCR", retrievedFlight.getToAirport());
        }
    }

    @Test
    @DisplayName("Test getFlightDetails returns null when flight not found")
    void testGetFlightDetailsNotFound() {
        UUID nonExistentFlightId = UUID.randomUUID();

        try (MockedStatic<MasterDataService> masterDataServiceMockedStatic =
                     Mockito.mockStatic(MasterDataService.class)) {

            when(flightRepository.findById(nonExistentFlightId))
                    .thenReturn(Optional.empty());

            Flight retrievedFlight = flightService.getFlightDetails(nonExistentFlightId);

            // Verify results
            assertNull(retrievedFlight);
        }
    }

    @Test
    @DisplayName("Test getFlightDetails with airport ID not in master data")
    void testGetFlightDetailsWithUnknownAirportId() {
        // Prepare mock flight with an unknown airport ID
        Flight mockFlight = new Flight();
        mockFlight.setFromAirport("999");
        mockFlight.setToAirport("888");

        UUID flightId = UUID.randomUUID();

        // Mock repository and MasterDataService
        try (MockedStatic<MasterDataService> masterDataServiceMockedStatic =
                     Mockito.mockStatic(MasterDataService.class,
                             // Use a fallback answer to return the mock data
                             invocation -> {
                                 if (invocation.getMethod().getName().equals("getData")) {
                                     return mockMasterData;
                                 }
                                 return Mockito.RETURNS_DEFAULTS.answer(invocation);
                             })) {

            when(flightRepository.findById(flightId))
                    .thenReturn(Optional.of(mockFlight));

            Flight retrievedFlight = flightService.getFlightDetails(flightId);

            // Verify results
            assertNotNull(retrievedFlight);
            assertEquals("999", retrievedFlight.getFromAirport());
            assertEquals("888", retrievedFlight.getToAirport());
        }
    }
}