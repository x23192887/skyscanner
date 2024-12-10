package com.nci.skeleton.service;

import com.nci.skeleton.model.Airports;
import com.nci.skeleton.model.Country;
import com.nci.skeleton.model.MasterData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class MasterDataServiceTest {

    @InjectMocks
    private MasterDataService masterDataService;

    private MasterData masterData;

    @BeforeEach
    void setUp() {
        masterData = masterDataService.fetchMasterData();
    }

    @Test
    @DisplayName("Test fetchMasterData returns non-null MasterData")
    void testFetchMasterDataNotNull() {
        assertNotNull(masterData, "MasterData should not be null");
    }

    @Test
    @DisplayName("Test countries list is populated")
    void testCountriesListPopulated() {
        List<Country> countries = masterData.getCountries();
        assertNotNull(countries, "Countries list should not be null");
        assertFalse(countries.isEmpty(), "Countries list should not be empty");
        assertEquals(6, countries.size(), "Expected 6 countries");
    }

    @Test
    @DisplayName("Test booking classes are correctly set")
    void testBookingClasses() {
        List<String> bookingClasses = masterData.getBookingClass();
        assertNotNull(bookingClasses, "Booking classes list should not be null");
        assertEquals(4, bookingClasses.size(), "Expected 4 booking classes");
        assertTrue(bookingClasses.containsAll(List.of("ECONOMY", "PREMIUM ECONOMY", "FIRST", "BUSINESS")),
                "Booking classes should match expected values");
    }

    @Test
    @DisplayName("Test India country details")
    void testIndiaCountryDetails() {
        Country india = masterData.getCountries().get(0);
        assertEquals("1", india.getCountryId(), "Country ID should match");
        assertEquals("INDIA", india.getCountryName(), "Country name should match");

        List<Airports> indianAirports = india.getAirportsList();
        assertNotNull(indianAirports, "Indian airports list should not be null");
        assertEquals(7, indianAirports.size(), "Expected 7 airports in India");

        // Verify a few specific airports
        assertTrue(indianAirports.stream().anyMatch(airport ->
                airport.getAirportName().equals("Chennai") &&
                        airport.getAirportCode().equals("MAA") &&
                        airport.getAirportId().equals("1")
        ), "Chennai airport details should be correct");
    }

    @Test
    @DisplayName("Test United Kingdom country details")
    void testUnitedKingdomCountryDetails() {
        Country uk = masterData.getCountries().stream()
                .filter(country -> country.getCountryName().equals("UNITED KINGDOM"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("United Kingdom country not found"));

        assertEquals("3", uk.getCountryId(), "UK Country ID should match");

        List<Airports> ukAirports = uk.getAirportsList();
        assertNotNull(ukAirports, "UK airports list should not be null");
        assertEquals(7, ukAirports.size(), "Expected 7 airports in UK");

        // Verify a few specific airports
        assertTrue(ukAirports.stream().anyMatch(airport ->
                airport.getAirportName().equals("London") &&
                        airport.getAirportCode().equals("LCY") &&
                        airport.getAirportId().equals("16")
        ), "London airport details should be correct");
    }

    @Test
    @DisplayName("Test empty airports list handling")
    void testEmptyAirportsList() {
        // Create a country with no airports to test edge case
        Country emptyCountry = Country.builder()
                .countryId("7")
                .countryName("EMPTY COUNTRY")
                .airportsList(List.of())
                .build();

        assertEquals(0, emptyCountry.getAirportsList().size(), "Empty airports list should have zero size");
    }

    @Test
    @DisplayName("Test singleton MasterData instance")
    void testSingletonMasterData() {
        MasterData secondFetch = masterDataService.fetchMasterData();
        assertSame(masterData, secondFetch, "Multiple calls should return the same MasterData instance");
    }
}