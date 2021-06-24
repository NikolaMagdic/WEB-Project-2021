package beans;

public class CartItem {
	
	private Long id;
	
	private Integer item;
	
	private Double amount;
	

	public CartItem() {
		
	}


	public CartItem(Long id, Integer item, Double amount) {
		super();
		this.id = id;
		this.item = item;
		this.amount = amount;
	}



	public Integer getItem() {
		return item;
	}

	public void setItem(Integer item) {
		this.item = item;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}
	
	
	
}
