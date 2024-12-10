package com.nci.skeleton.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Airports {
    private String airportId;
    private String airportName;
    private String airportCode;

}
