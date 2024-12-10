package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private Principal principal;

    @InjectMocks
    private BookingController bookingController;

    private Booking sampleBooking;
    private UUID bookingId;

    @BeforeEach
    public void setUp() {
        bookingId = UUID.randomUUID();
        sampleBooking = new Booking();
        sampleBooking.setId(bookingId);

        // Common mock setup for Principal
        when(principal.getName()).thenReturn("testuser@example.com");
    }

    @Test
    public void testGetConfirmedBookings_Success() {
        // Arrange
        List<Booking> mockBookings = Arrays.asList(sampleBooking);
        when(bookingService.fetchMyBookings(principal.getName())).thenReturn(mockBookings);

        // Act
        ResponseEntity<List<Booking>> response = bookingController.getConfirmedBookings(principal);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockBookings, response.getBody());
        verify(bookingService).fetchMyBookings(principal.getName());
    }

    @Test
    public void testBookFlight_Success() {
        // Arrange
        ResponseModel expectedResponse = new ResponseModel();
        expectedResponse.setMessage("Booking successful");
        when(bookingService.saveBooking(sampleBooking, principal.getName()))
                .thenReturn(expectedResponse);

        // Act
        ResponseEntity<ResponseModel> response = bookingController.bookFLight(sampleBooking, principal);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(bookingService).saveBooking(sampleBooking, principal.getName());
    }

    @Test
    public void testUpdateBooking_Success() {
        // Arrange
        ResponseModel expectedResponse = new ResponseModel();
        expectedResponse.setMessage("Booking updated");
        when(bookingService.updateBooking(bookingId, sampleBooking, principal.getName()))
                .thenReturn(expectedResponse);

        // Act
        ResponseEntity<ResponseModel> response = bookingController.updateBooking(bookingId, sampleBooking, principal);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(bookingService).updateBooking(bookingId, sampleBooking, principal.getName());
    }

    @Test
    public void testDeleteBooking_Success() {
        // Arrange
        ResponseModel expectedResponse = new ResponseModel();
        expectedResponse.setMessage("Booking deleted");
        when(bookingService.inactiveProperty(bookingId, principal.getName()))
                .thenReturn(expectedResponse);

        // Act
        ResponseEntity<ResponseModel> response = bookingController.deleteBooking(bookingId, principal);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(bookingService).inactiveProperty(bookingId, principal.getName());
    }

    @Test
    public void testGetConfirmedBookings_EmptyList() {
        // Arrange
        when(bookingService.fetchMyBookings(principal.getName())).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<Booking>> response = bookingController.getConfirmedBookings(principal);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }
}