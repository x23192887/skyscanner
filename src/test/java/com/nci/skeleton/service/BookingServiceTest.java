package com.nci.skeleton.service;

import com.google.gson.Gson;
import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.repository.BookingRepository;
import com.nci.skeleton.repository.FlightRepository;
import com.nci.skeleton.repository.UserRepository;
import com.nci.skeleton.security.User;
import com.nci.skeleton.service.BookingService;
import com.nci.skeleton.service.SQSService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.nci.skeleton.config.Constants.STATUS_ACTIVE;
import static com.nci.skeleton.config.Constants.STATUS_INACTIVE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SQSService sqsService;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Flight testFlight;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        // Prepare test data
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setFirstname("John");
        testUser.setLastname("Doe");

        testFlight = new Flight();
        testFlight.setId(UUID.randomUUID());
        testFlight.setAirline("Test Airlines");

        testBooking = new Booking();
        testBooking.setId(UUID.randomUUID());
        testBooking.setFlightCode(testFlight.getId().toString());
        testBooking.setPrice(BigDecimal.valueOf(100.00));
    }

    @Test
    @DisplayName("Test fetchMyBookings returns user's active bookings")
    void testFetchMyBookings() {
        // Prepare mock bookings
        Booking booking1 = new Booking();
        Booking booking2 = new Booking();
        List<Booking> mockBookings = Arrays.asList(booking1, booking2);

        // Mock repository method
        when(bookingRepository.findByStatusAndBookedBy(STATUS_ACTIVE, "testuser"))
                .thenReturn(mockBookings);

        // Call the method
        List<Booking> retrievedBookings = bookingService.fetchMyBookings("testuser");

        // Verify results
        assertNotNull(retrievedBookings);
        assertEquals(2, retrievedBookings.size());
        verify(bookingRepository).findByStatusAndBookedBy(STATUS_ACTIVE, "testuser");
    }

    @Test
    @DisplayName("Test saveBooking successfully creates a new booking")
    void testSaveBooking() {
        // Mock repository methods
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));
        when(flightRepository.findById(any(UUID.class)))
                .thenReturn(Optional.of(testFlight));
        when(sqsService.sendSqsMessage(any(String.class)))
                .thenReturn("Message Sent");

        // Call the method
        ResponseModel response = bookingService.saveBooking(testBooking, "testuser");

        // Verify results
        assertEquals("Success", response.getStatus());
        assertEquals("Operation Successful", response.getMessage());
        assertNotNull(response.getCreationId());

        // Verify interactions
        verify(bookingRepository).save(any(Booking.class));
        verify(sqsService).sendSqsMessage(any(String.class));
    }

    @Test
    @DisplayName("Test updateBooking successfully updates an existing booking")
    void testUpdateBooking() {
        // Prepare an existing booking
        Booking existingBooking = new Booking();
        existingBooking.setId(UUID.randomUUID());
        existingBooking.setBookedBy("testuser");
        existingBooking.setBookingClass("ECONOMY");
        existingBooking.setPrice(BigDecimal.valueOf(100.00));

        // Prepare update booking
        Booking updateBooking = new Booking();
        updateBooking.setBookingClass("BUSINESS");
        updateBooking.setPrice(BigDecimal.valueOf(200.00));

        // Mock repository method
        when(bookingRepository.findById(existingBooking.getId()))
                .thenReturn(Optional.of(existingBooking));

        // Call the method
        ResponseModel response = bookingService.updateBooking(
                existingBooking.getId(),
                updateBooking,
                "testuser"
        );

        // Verify results
        assertEquals("Success", response.getStatus());
        assertEquals("Operation Successful", response.getMessage());

        // Verify booking was updated
        assertEquals("BUSINESS", existingBooking.getBookingClass());
        assertEquals(BigDecimal.valueOf(200.00), existingBooking.getPrice());
        assertNotNull(existingBooking.getModifiedOn());

        // Verify repository save was called
        verify(bookingRepository).save(existingBooking);
    }

    @Test
    @DisplayName("Test updateBooking fails when user is not authorized")
    void testUpdateBookingUnauthorized() {
        // Prepare an existing booking
        Booking existingBooking = new Booking();
        existingBooking.setId(UUID.randomUUID());
        existingBooking.setBookedBy("anotheruser");

        // Prepare update booking
        Booking updateBooking = new Booking();

        // Mock repository method
        when(bookingRepository.findById(existingBooking.getId()))
                .thenReturn(Optional.of(existingBooking));

        // Call the method
        ResponseModel response = bookingService.updateBooking(
                existingBooking.getId(),
                updateBooking,
                "testuser"
        );

        // Verify results
        assertEquals("Unsuccessful", response.getStatus());
        assertEquals("Operation Unsuccessful : Not Authorized To Update This Property", response.getMessage());

        // Verify repository save was not called
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test inactiveProperty successfully deactivates a booking")
    void testInactiveProperty() {
        // Prepare an existing booking
        Booking existingBooking = new Booking();
        existingBooking.setId(UUID.randomUUID());
        existingBooking.setBookedBy("testuser");
        existingBooking.setStatus(STATUS_ACTIVE);

        // Mock repository method
        when(bookingRepository.findById(existingBooking.getId()))
                .thenReturn(Optional.of(existingBooking));

        // Call the method
        ResponseModel response = bookingService.inactiveProperty(
                existingBooking.getId(),
                "testuser"
        );

        // Verify results
        assertEquals("Success", response.getStatus());
        assertEquals("Operation Successful", response.getMessage());

        // Verify booking was deactivated
        assertEquals(STATUS_INACTIVE, existingBooking.getStatus());

        // Verify repository save was called
        verify(bookingRepository).save(existingBooking);
    }

    @Test
    @DisplayName("Test sendEmail generates correct message")
    void testSendEmail() {
        // Mock SQS service
        when(sqsService.sendSqsMessage(any(String.class)))
                .thenReturn("Message Sent");

        // Call the method
        String result = bookingService.sendEmail(testUser, testBooking, testFlight);

        // Verify the SQS message was sent
        assertEquals("Message Sent", result);
        verify(sqsService).sendSqsMessage(argThat(message -> {
            // Use Gson to parse the message and verify its contents
            return message.contains(testUser.getEmail()) &&
                    message.contains(testUser.getFirstname()) &&
                    message.contains(testBooking.getId().toString()) &&
                    message.contains(testFlight.getAirline());
        }));
    }
}