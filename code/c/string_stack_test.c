#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>

#include "string_stack.h"

// -----------------------------------------------------------------------------
int passed = 0;
int failed = 0;

void expect(const char* description, bool condition) {
  if (condition) passed++; else failed++;
  printf("%s %s\n", description, condition ? "PASS" : "FAIL");
}
// -----------------------------------------------------------------------------

int main() {

    // Successful create (can't test out of memory though)
    stack_response res = create();
    expect("Stack creation response is success", res.code == success);
    stack s = res.stack;
    expect("New stack empty", is_empty(s));
    expect("New stack not full", !is_full(s));
    expect("New stack size 0", size(s) == 0);

    // Individual elements are bounds checked
    char long_string[258];
    memset(long_string, 'x', 257);
    long_string[257] = '\0';
    response_code code = push(s, long_string);
    expect("Guards against long elements", code == stack_element_too_large);

    // One element stack
    code = push(s, "first!");
    expect("Push response code is success", res.code == success);
    expect("1-element stack not empty", !is_empty(s));
    expect("1-element stack not full", !is_full(s));
    expect("1-element stack size 1", size(s) == 1);

    // Push until full
    while (size(s) < MAX_CAPACITY) push(s, "hi");
    expect("full stack not empty", !is_empty(s));
    expect("full stack full", is_full(s));
    expect("full stack size MAX_CAPACITY", size(s) == MAX_CAPACITY);

    // Push on full stack error
    code = push(s, "there");
    expect("Push on full stack produces error response", code == stack_full);

    // Pops
    string_response r = pop(s);
    expect("Pop response code is success", res.code == success);
    expect("Pop after full stack not empty", !is_empty(s));
    expect("Pop after full stack not full", !is_full(s));
    expect("Pop after full stack size MAX_CAPACITY-1", size(s) == MAX_CAPACITY-1);
    expect("Popped value is expected", strcmp(r.string, "hi") == 0);

    // Pop until empty
    while (size(s) > 0) r = pop(s);
    expect("After popping everything, empty", is_empty(s));
    expect("After popping everything, not full", !is_full(s));
    expect("After popping everything, size 0", size(s) == 0);
    expect("Last value popped is expected", strcmp(r.string, "first!") == 0);

    // Pop when empty is an error
    r = pop(s);
    expect("Pop from empty string code is stack_empty", r.code == stack_empty);
    expect("Pop from empty stack string is null", r.string == NULL);

    // Test defensive copies
    char greeting[] = {'h', 'e', 'l', 'l', 'o', '\0'};
    push(s, greeting);
    greeting[1] = 'u';
    r = pop(s);
    expect("Elements are defensively copied", strcmp(r.string, "hello") == 0);

    // Destroy sets to null, for memory leak testing use an external tool
    destroy(&s);
    assert(s == NULL);

    printf("\n%d passed, %d failed\n", passed, failed);
    return 0;
}
