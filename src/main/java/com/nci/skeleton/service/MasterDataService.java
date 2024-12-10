package com.nci.skeleton.service;

import com.nci.skeleton.model.Airports;
import com.nci.skeleton.model.Country;
import com.nci.skeleton.model.MasterData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasterDataService {
    static MasterData data;

    static {
        try {
            data = new MasterData();

            data.setCountries(List.of(
                    Country.builder().countryId("1").countryName("INDIA").airportsList(
                            List.of(Airports.builder().airportName("Chennai").airportCode("MAA").airportId("1").build(),
                                    Airports.builder().airportName("Delhi NCR").airportCode("DEL").airportId("2").build(),
                                    Airports.builder().airportName("Ahmedabad").airportCode("AMD").airportId("3").build(),
                                    Airports.builder().airportName("Jaipur").airportCode("JAI").airportId("4").build(),
                                    Airports.builder().airportName("Kolkata").airportCode("CCU").airportId("5").build(),
                                    Airports.builder().airportName("Mumbai").airportCode("BOM").airportId("6").build(),
                                    Airports.builder().airportName("Pune").airportCode("PNQ").airportId("7").build()
                            )
                    ).build(),
                    Country.builder().countryId("2").countryName("IRELAND").airportsList(
                            List.of(Airports.builder().airportName("Cork").airportCode("ORK").airportId("8").build(),
                                    Airports.builder().airportName("Dublin").airportCode("DUB").airportId("9").build(),
                                    Airports.builder().airportName("Kerry").airportCode("KIR").airportId("10").build(),
                                    Airports.builder().airportName("Knock").airportCode("NOC").airportId("11").build(),
                                    Airports.builder().airportName("Shannon").airportCode("SNN").airportId("12").build()
                            )
                    ).build(),Country.builder().countryId("3").countryName("UNITED KINGDOM").airportsList(
                            List.of(Airports.builder().airportName("Birmingham").airportCode("BHX").airportId("13").build(),
                                    Airports.builder().airportName("Bournemouth").airportCode("BOH").airportId("14").build(),
                                    Airports.builder().airportName("Bristol").airportCode("BRS").airportId("15").build(),
                                    Airports.builder().airportName("London").airportCode("LCY").airportId("16").build(),
                                    Airports.builder().airportName("Liverpool").airportCode("LPL").airportId("17").build(),
                                    Airports.builder().airportName("Manchester").airportCode("MAN").airportId("18").build(),
                                    Airports.builder().airportName("Southampton").airportCode("SOU").airportId("19").build()
                            )
                    ).build(),Country.builder().countryId("4").countryName("UNITED STATES").airportsList(
                            List.of(Airports.builder().airportName("Atlanta").airportCode("ATL").airportId("20").build(),
                                    Airports.builder().airportName("Boston").airportCode("BOS").airportId("21").build(),
                                    Airports.builder().airportName("Chicago").airportCode("CHS").airportId("22").build(),
                                    Airports.builder().airportName("Las Vegas").airportCode("LAS").airportId("23").build(),
                                    Airports.builder().airportName("Los Angeles").airportCode("LAX").airportId("24").build(),
                                    Airports.builder().airportName("New York City").airportCode("JFK").airportId("25").build(),
                                    Airports.builder().airportName("Orlando").airportCode("MCO").airportId("26").build()
                            )
                    ).build(),Country.builder().countryId("5").countryName("FRANCE").airportsList(
                            List.of(Airports.builder().airportName("Paris").airportCode("CDG").airportId("27").build(),
                                    Airports.builder().airportName("Toulon").airportCode("TLN").airportId("28").build(),
                                    Airports.builder().airportName("Marseille").airportCode("MRS").airportId("29").build(),
                                    Airports.builder().airportName("Bordeaux").airportCode("BOD").airportId("30").build(),
                                    Airports.builder().airportName("Beauvais").airportCode("BVA").airportId("31").build()
                            )
                    ).build()
                    ,Country.builder().countryId("6").countryName("GERMANY").airportsList(
                            List.of(Airports.builder().airportName("Berlin").airportCode("BER").airportId("32").build(),
                                    Airports.builder().airportName("Bremen").airportCode("BRE").airportId("33").build(),
                                    Airports.builder().airportName("Munich").airportCode("MUC").airportId("34").build(),
                                    Airports.builder().airportName("Hanover").airportCode("HAJ").airportId("35").build(),
                                    Airports.builder().airportName("Hamburg").airportCode("HAM").airportId("36").build(),
                                    Airports.builder().airportName("Frankfurt").airportCode("FRA").airportId("37").build(),
                                    Airports.builder().airportName("Stuttgart").airportCode("STR").airportId("38").build()
                            )
                    ).build()
            ));

            data.setBookingClass(List.of("ECONOMY","PREMIUM ECONOMY","FIRST","BUSINESS"));
        } catch (Exception ex) {
        }
    }
    public MasterData fetchMasterData() {
        return data;
    }
}
