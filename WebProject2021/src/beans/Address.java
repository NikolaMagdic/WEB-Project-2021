package beans;

public class Address {
	
	private Long id;

	private String streetAndNumber;
	
	private String city;
	
	private int postalCode;
	
	
	public Address() {
		
	}


	public Address(Long id, String streetAndNumber, String city, int postalCode) {
		super();
		this.id = id;
		this.streetAndNumber = streetAndNumber;
		this.city = city;
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
	
	
	
}
