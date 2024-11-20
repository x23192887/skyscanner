package com.nci.skeleton.model;

import lombok.Data;

import java.util.List;

@Data
public class MasterData {
    private List<Country> countries;
    private List<String> bookingClass;
    private List<String> locations;
    private List<String> energyRatings;
}
