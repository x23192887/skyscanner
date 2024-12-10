package com.nci.skeleton.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
public class Booking {
    @Id
    private UUID id;
    private String flightCode;
    private BigDecimal price;
    private String bookingClass;
    private String status;
    private String bookedBy;
    private LocalDateTime bookedOn;
    private LocalDateTime modifiedOn;
}
