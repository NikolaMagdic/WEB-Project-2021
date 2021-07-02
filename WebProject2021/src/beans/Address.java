package beans;

public class Address {

	private String streetAndNumber;
	
	private String city;
	
	private String country;
	
	private int postalCode;
	
	
	public Address() {
		
	}


	public Address(String streetAndNumber, String city, String country, int postalCode) {
		super();
		this.streetAndNumber = streetAndNumber;
		this.city = city;
		this.country = country;
		this.postalCode = postalCode;
	}



	public String getStreetAndNumber() {
		return streetAndNumber;
	}

	public void setStreetAndNumber(String streetAndNumber) {
		this.streetAndNumber = streetAndNumber;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public int getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(int postalCode) {
		this.postalCode = postalCode;
	}


	public String getCountry() {
		return country;
	}


	public void setCountry(String country) {
		this.country = country;
	}
	
	
	
}
