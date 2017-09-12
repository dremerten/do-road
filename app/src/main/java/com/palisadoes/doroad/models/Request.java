package com.palisadoes.doroad.models;

/**
 * Created by stone on 9/11/17.
 */

public class Request {

    private String name;
    private String phone;
    private double pickUpLat;
    private double pickUpLng;
    private double dropoffLat;
    private double dropoffLng;
    private String datetime;

    public Request(String name, String datetime) {
        this.name = name;
        this.datetime = datetime;
    }

    public Request(String name, String phone, double pickUpLat, double pickUpLng, double dropoffLat, double dropoffLng, String datetime) {
        this.name = name;
        this.phone = phone;
        this.pickUpLat = pickUpLat;
        this.pickUpLng = pickUpLng;
        this.dropoffLat = dropoffLat;
        this.dropoffLng = dropoffLng;
        this.datetime = datetime;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public double getPickUpLat() {
        return pickUpLat;
    }

    public void setPickUpLat(double pickUpLat) {
        this.pickUpLat = pickUpLat;
    }

    public double getPickUpLng() {
        return pickUpLng;
    }

    public void setPickUpLng(double pickUpLng) {
        this.pickUpLng = pickUpLng;
    }

    public double getDropoffLat() {
        return dropoffLat;
    }

    public void setDropoffLat(double dropoffLat) {
        this.dropoffLat = dropoffLat;
    }

    public double getDropoffLng() {
        return dropoffLng;
    }

    public void setDropoffLng(double dropoffLng) {
        this.dropoffLng = dropoffLng;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }

    public String getName() {
        return name;
    }

    public String getDatetime() {
        return datetime;
    }
}
