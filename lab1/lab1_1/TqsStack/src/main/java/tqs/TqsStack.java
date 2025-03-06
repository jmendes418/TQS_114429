package tqs;

import java.util.LinkedList;
import java.util.NoSuchElementException;

public class TqsStack<T> {
    public TqsStack() {
        collection = new LinkedList<T>();
    }

    private LinkedList<T> collection;

    public T pop() {
        if (collection.isEmpty()) {
            throw new NoSuchElementException("Stack is empty");
        }
        return collection.removeLast();
    }

    public int size() {
        return collection.size();
    }

    public T peek() {
        if (collection.isEmpty()) {
            throw new NoSuchElementException("Stack is empty");
        }
        return collection.getLast();
    }

    public void push(T item) {
        collection.add(item);
    }

    public boolean isEmpty() {
        return collection.isEmpty();
    }

    public T popTopN(int n) {
        T top = null;
        for (int i = 0; i < n; i++) {
            top = collection.removeLast();
        }
        return top;
    }
}
