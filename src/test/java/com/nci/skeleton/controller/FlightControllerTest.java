package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FlightControllerTest {

    @Mock
    private FlightService flightService;

    @InjectMocks
    private FlightController flightController;

    private Flight sampleFlight;
    private UUID flightId;

    @BeforeEach
    public void setUp() {
        flightId = UUID.randomUUID();
        sampleFlight = new Flight();
        sampleFlight.setId(flightId);
        sampleFlight.setFromAirport("New York");
        sampleFlight.setToAirport("London");
    }

    @Test
    public void testGetFlights_Success() {
        // Arrange
        List<Flight> mockFlights = Arrays.asList(sampleFlight);
        when(flightService.getFlights()).thenReturn(mockFlights);

        // Act
        ResponseEntity<List<Flight>> response = flightController.getFlights();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockFlights, response.getBody());
        verify(flightService).getFlights();
    }

    @Test
    public void testGetFlights_EmptyList() {
        // Arrange
        when(flightService.getFlights()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<Flight>> response = flightController.getFlights();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(flightService).getFlights();
    }

    @Test
    public void testGetFlightDetail_Success() {
        // Arrange
        when(flightService.getFlightDetails(flightId)).thenReturn(sampleFlight);

        // Act
        ResponseEntity<Flight> response = flightController.getFlightDetail(flightId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sampleFlight, response.getBody());
        verify(flightService).getFlightDetails(flightId);
    }

    @Test
    public void testGetFlightDetail_NonExistentFlight() {
        // Arrange
        UUID nonExistentFlightId = UUID.randomUUID();
        when(flightService.getFlightDetails(nonExistentFlightId)).thenReturn(null);

        // Act
        ResponseEntity<Flight> response = flightController.getFlightDetail(nonExistentFlightId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
        verify(flightService).getFlightDetails(nonExistentFlightId);
    }

    @Test
    public void testGetFlightDetail_NullFlightId() {
        // Act & Assert
        assertThrows(NullPointerException.class,
                () -> flightController.getFlightDetail(null)
        );
    }
}