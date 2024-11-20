package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.entity.Flight;
import com.nci.skeleton.model.MasterData;
import com.nci.skeleton.security.User;
import com.nci.skeleton.service.BookingService;
import com.nci.skeleton.service.MasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/master")
public class MasterController {

    @Autowired
    MasterDataService masterDataService;

    @Autowired
    BookingService bookingService;

    @GetMapping
    public ResponseEntity<MasterData> getMasterData() {
        return new ResponseEntity<>(masterDataService.fetchMasterData(), HttpStatus.OK);
    }

    @GetMapping("email")
    public ResponseEntity<String> testEmail() {
        Flight flt=new Flight();
        flt.setId(UUID.randomUUID());
        flt.setAirline("Air India");
        User usr=new User();
        usr.setFirstname("John");
        usr.setLastname("Rubbish");
        usr.setEmail("gawade.achyut96@gmail.com");
        Booking booking=new Booking();
        booking.setId(UUID.randomUUID());
        booking.setFlightCode(flt.getId().toString());

        return new ResponseEntity<>(bookingService.sendEmail(usr,booking,flt), HttpStatus.OK);
    }
}
