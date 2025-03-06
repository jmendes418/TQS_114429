package tqs;

import java.util.List;

public class StocksPortfolio {
    public StocksPortfolio(IStockMarketService stockMarket) {
        this.stockMarket = stockMarket;
    }

    private final IStockMarketService stockMarket;
    private List<Stock> stocks;

    public void addStock(Stock stock) {
        stocks.add(stock);
    }

    public double totalValue() {
        double value = 0;
        for (Stock stock : stocks) {
            value += stockMarket.lookUpPrice(stock.getLabel()) * stock.getQuantity();
        }
        return value;
    }
}
