package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/flight")
public class FlightController {

    @Autowired
    FlightService flightService;

    @GetMapping
    public ResponseEntity<List<Flight>> getFlights() {
        return new ResponseEntity<>(flightService.getFlights(), HttpStatus.OK);
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<Flight> getFlightDetail(@PathVariable UUID flightId) {
        System.out.println("Received flightId: " + flightId.toString());
        return new ResponseEntity<>(flightService.getFlightDetails(flightId), HttpStatus.OK);
    }

}
