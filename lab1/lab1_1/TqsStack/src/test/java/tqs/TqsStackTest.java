package tqs;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.NoSuchElementException;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TqsStackTest {

    private TqsStack<Object> stack;

    @BeforeEach
    void setup() {
        stack = new TqsStack<>();
    }

    @Test
    @DisplayName("A stack is empty on construction")
    void testStackIsEmptyOnConstruction() {
        assertTrue(stack.isEmpty());
    }

    @Test
    @DisplayName("A stack has size zero on construction")
    void testStackSizeOnConstruction() {
        assertEquals(0, stack.size());
    }

    @Test
    @DisplayName("After n pushes to an empty stack, n > 0, the stack is not empty and its size is n.")
    void testPushIncreasesSize() {
        stack.push(1);
        stack.push(2);

        assertFalse(stack.isEmpty());
        assertEquals(2, stack.size());
    }

    @Test
    @DisplayName("Pushing then popping returns the last pushed value.")
    void testPushThenPop() {
        stack.push(1);
        assertEquals(1, stack.pop());
    }

    @Test
    @DisplayName("Pushing then peeking returns the last pushed value without changing the size.")
    void testPushThenPeek() {
        stack.push(1);
        stack.push(2);

        assertEquals(2, stack.peek());
        assertEquals(2, stack.size());
    }

    @Test
    @DisplayName("Popping all elements makes the stack empty.")
    void testPopUntilEmpty() {
        stack.push(1);
        stack.push(2);
        stack.pop();
        stack.pop();

        assertTrue(stack.isEmpty());
        assertEquals(0, stack.size());
    }

    @Test
    @DisplayName("Popping from an empty stack throws NoSuchElementException")
    void testPopOnEmptyStack() {
        assertThrows(NoSuchElementException.class, stack::pop);
    }

    @Test
    @DisplayName("Peeking into an empty stack throws NoSuchElementException")
    void testPeekOnEmptyStack() {
        assertThrows(NoSuchElementException.class, stack::peek);
    }

    @Test
    @DisplayName("Popping the nth element from the stack")
    void testPopTopN() {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);

        assertEquals(2, stack.popTopN(3));
        assertEquals(1, stack.size());
        assertEquals(1, stack.peek());
    }

    @Test
    @DisplayName("Popping the nth element from the stack when n is greater than the stack size throws NoSuchElementException")
    void testPopTopNThrowsException() {
        stack.push(1);
        stack.push(2);

        assertThrows(NoSuchElementException.class, () -> stack.popTopN(3));
    }
}