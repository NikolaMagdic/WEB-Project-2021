package beans;

public class CartItem {
		
	private Integer item;
	
	private int amount;
	

	public CartItem() {
		
	}


	public CartItem(Integer item, int amount) {
		super();
		this.item = item;
		this.amount = amount;
	}


	public Integer getItem() {
		return item;
	}

	public void setItem(Integer item) {
		this.item = item;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}
	
	
	
}
