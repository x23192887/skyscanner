package com.nci.skeleton.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
public class Flight {
    @Id
    private UUID id;
    private String airline;
    private String fromAirport;
    private String toAirport;
    private String flyDate;
    private String duration;
    private BigDecimal price;
    private List<String> features;
    @Column(length = 2000)
    private List<String> images;
    private String status;
}
