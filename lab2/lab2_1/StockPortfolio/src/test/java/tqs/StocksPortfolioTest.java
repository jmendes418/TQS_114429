package tqs;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class StocksPortfolioTest {

    @InjectMocks
    StocksPortfolio portfolio;

    @Mock
    IStockMarketService stockMarketService;

    @Test
    public void testTotalValue() {

        // Load the mock with expectations
        when(stockMarketService.lookUpPrice("Tesla")).thenReturn(2.6);
        when(stockMarketService.lookUpPrice("Nikolai")).thenReturn(5.9);
        when(stockMarketService.lookUpPrice("Galp")).thenReturn(1.6);

        portfolio.addStock(new Stock("Tesla", 1));
        portfolio.addStock(new Stock("Nikolai", 5));
        portfolio.addStock(new Stock("Galp", 9));

        // Assert the total value
        assertThat(portfolio.totalValue(), equalTo(46.5));

        // Verify the interactions with the mock
        verify(stockMarketService, times(3)).lookUpPrice(anyString());
    }
}