package beans;

public class CartItem {
		
	private Integer article;
	
	private int amount;
	

	public CartItem() {
		
	}


	public CartItem(Integer article, int amount) {
		super();
		this.article = article;
		this.amount = amount;
	}


	public Integer getArticle() {
		return article;
	}

	public void setArticle(Integer article) {
		this.article = article;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}


	@Override
	public String toString() {
		return "CartItem [article=" + article + ", amount=" + amount + "]";
	}
	
	
	
}
