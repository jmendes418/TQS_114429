package tqs;

public class Stock {
    public Stock(String label, int quantity) {
        this.label = label;
        this.quantity = quantity;
    }

    private String label;
    private int quantity;

    public String getLabel() {
        return label;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
