package com.nci.skeleton.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class Country {
    private String countryId;
    private String countryName;
    private List<Airports> airportsList;

}
