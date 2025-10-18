#include <iostream>
#include <cassert>
#include <cmath>
#include <stdexcept>
#include <string>
#include <utility>
using namespace std;

#include "stack.h"

// -----------------------------------------------------------------------------
int passed = 0;
int failed = 0;

void expect(string description, bool condition) {
  if (condition) passed++; else failed++;
  cout << description << " " << (condition ? "PASS" : "FAIL") << endl;
}
// -----------------------------------------------------------------------------

int main() {

    Stack<int> is;
    Stack<string> ss;
    Stack<pair<int, string>> ps;
  
    // Test can create successfully
    expect("New int stack empty", is.is_empty());
    expect("New int stack not full", !is.is_full());
    expect("New int stack size 0", is.size() == 0);
    expect("New pair stack empty", ps.is_empty());
    expect("New pair stack not full", !ps.is_full());
    expect("New pair stack size 0", ps.size() == 0);

    // One element stack
    is.push(1);
    expect("1-element stack not empty", !is.is_empty());
    expect("1-element stack not full", !is.is_full());
    expect("1-element stack size 1", is.size() == 1);
    ss.push("hello");
    expect("1-element string stack not empty", !ss.is_empty());
    ps.push(make_pair(5, "world"));
    expect("1-element pair stack not empty", !ps.is_empty());

    // Push until full
    while (is.size() < MAX_CAPACITY) is.push(100);
    expect("full stack not empty", !is.is_empty());
    expect("full stack full", is.is_full());
    expect("full stack size MAX_CAPACITY", is.size() == MAX_CAPACITY);
  
    // Push on full stack error
    bool thrown = false;
    try {
        is.push(200);
    } catch (overflow_error& e) {
        thrown = true;
        expect("Overflow exception message is correct",
             string("Stack has reached maximum capacity") == e.what());
    }
    expect("Push on full stack should throw", thrown);

    // Pops
    int popped = is.pop();
    expect("Pop after full stack not empty", !is.is_empty());
    expect("Pop after full stack not full", !is.is_full());
    expect("Pop after full stack size MAX_CAPACITY-1", is.size() == MAX_CAPACITY-1);
    expect("Popped value is expected", popped == 100);

    // Pop until empty
    while (!is.is_empty()) popped = is.pop();
    expect("After popping everything, empty", is.is_empty());
    expect("After popping everything, not full", !is.is_full());
    expect("After popping everything, size 0", is.size() == 0);
    expect("Last value popped is expected", popped == 1);

    // Pop when empty is an error
    thrown = false;
    try {
        is.pop();
    } catch (underflow_error& e) {
        thrown = true;
        expect("Underflow exception message is correct",
             string("cannot pop from empty stack") == e.what());
    }
    expect("Pop from empty stack should throw", thrown);

    // Test that the stack is not storing references to the elements
    auto p = make_pair(5, "world");
    ps.push(p);
    p.second = "hello";
    auto r = ps.pop();
    expect("Stack elements are copied", r.second == "world");

    // Next line should be compiler error if uncommented
    // Stack<int> is2 = is;

    // Next two lines should be compiler errors if uncommented
    // Stack<int> is3;
    // is3 = is;

    // Next line should be compiler error if uncommented
    // Stack<int> is4 = move(is);

    // Next two lines should be compiler errors if uncommented
    // Stack<int> is5;
    // is5 = move(is);

    // Each of the next three lines should be compiler errors if uncommented
    // cout << ss.top;
    // cout << ss.capacity;
    // cout << ss.elements;
    // ss.reallocate(128);

    printf("\n%d passed, %d failed\n", passed, failed);
    return 0;
}
