package beans;

public class Amenity {

	private Integer id;
	
	private String name;
	
	private boolean deleted;
	
	public Amenity() {
		
	}

	public Amenity(Integer id, String name, boolean deleted) {
		super();
		this.id = id;
		this.name = name;
		this.deleted = deleted;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	@Override
	public String toString() {
		return "Amenity [id=" + id + ", name=" + name + ", deleted=" + deleted + "]";
	}
	
	
	
}
