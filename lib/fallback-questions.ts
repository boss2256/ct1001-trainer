import type { Question } from "./validators";

export const FALLBACK_QUESTIONS: Question[] = [
  {
    question_id: "fallback-001",
    topic: "variables-data-types",
    difficulty: "easy",
    question_type: "predict-output",
    prompt: "What is the output of the following code?",
    code_snippet: `x = 10
y = 3
print(x // y)
print(x % y)`,
    options: ["3 and 1", "3.33 and 1", "3 and 0", "4 and 1"],
    correct_answer: "3 and 1",
    rubric: null,
    hint_level_1: "This question tests integer division and the modulo operator.",
    hint_level_2: "// is floor division (drops decimals). % gives the remainder.",
    explanation: "x // y = 10 // 3 = 3 (floor division). x % y = 10 % 3 = 1 (remainder). So output is 3 then 1.",
    common_trap: "Confusing // with / (true division) which gives 3.3333...",
  },
  {
    question_id: "fallback-002",
    topic: "conditionals",
    difficulty: "easy",
    question_type: "find-bug",
    prompt: "There is one syntax issue in this snippet. Identify it.",
    code_snippet: `age = 20
if age >= 18
    print("Adult")`,
    options: [
      "Missing colon after if statement",
      "Wrong indentation on print",
      "age should be a string",
      "No issue — code is correct",
    ],
    correct_answer: "Missing colon after if statement",
    rubric: null,
    hint_level_1: "This question tests conditional statement syntax.",
    hint_level_2: "Look carefully at the end of the if line.",
    explanation: "Python requires a colon (:) at the end of an if statement. The correct line is: if age >= 18:",
    common_trap: "Students familiar with other languages forget the colon.",
  },
  {
    question_id: "fallback-003",
    topic: "for-loops",
    difficulty: "easy",
    question_type: "predict-output",
    prompt: "What does this code print?",
    code_snippet: `for i in range(1, 5):
    print(i, end=" ")`,
    options: ["1 2 3 4 5", "1 2 3 4", "0 1 2 3 4", "0 1 2 3"],
    correct_answer: "1 2 3 4",
    rubric: null,
    hint_level_1: "This tests how range() works with start and stop arguments.",
    hint_level_2: "range(start, stop) goes up to but NOT including stop.",
    explanation: "range(1, 5) generates 1, 2, 3, 4. The stop value (5) is excluded. end=' ' keeps output on one line.",
    common_trap: "Thinking range(1, 5) includes 5.",
  },
  {
    question_id: "fallback-004",
    topic: "lists",
    difficulty: "medium",
    question_type: "predict-output",
    prompt: "What is printed by this code?",
    code_snippet: `nums = [10, 20, 30, 40, 50]
print(nums[-1])
print(nums[1:3])`,
    options: [
      "50 and [20, 30]",
      "10 and [20, 30, 40]",
      "50 and [20, 30, 40]",
      "40 and [20, 30]",
    ],
    correct_answer: "50 and [20, 30]",
    rubric: null,
    hint_level_1: "This tests negative indexing and list slicing.",
    hint_level_2: "Negative index -1 means the last element. Slice [1:3] gives index 1 up to (not including) 3.",
    explanation: "nums[-1] = 50 (last element). nums[1:3] = [20, 30] (index 1 and 2, not 3).",
    common_trap: "Including index 3 in the slice result — slicing is exclusive of the end index.",
  },
  {
    question_id: "fallback-005",
    topic: "exceptions",
    difficulty: "medium",
    question_type: "identify-error",
    prompt: "What error will occur when this code runs?",
    code_snippet: `data = {"name": "Alice", "age": 25}
print(data["email"])`,
    options: ["KeyError", "IndexError", "TypeError", "NameError"],
    correct_answer: "KeyError",
    rubric: null,
    hint_level_1: "This question tests dictionary access and common exceptions.",
    hint_level_2: "What happens when you access a key that doesn't exist in a dictionary?",
    explanation: "data does not have a key 'email'. Accessing a missing key in a dict raises KeyError: 'email'.",
    common_trap: "Confusing KeyError (dict) with IndexError (list/tuple).",
  },
  {
    question_id: "fallback-006",
    topic: "functions",
    difficulty: "medium",
    question_type: "predict-output",
    prompt: "What is the output of this function call?",
    code_snippet: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Bob"))
print(greet("Alice", "Hi"))`,
    options: [
      "Hello, Bob! and Hi, Alice!",
      "Hello, Bob! and Hello, Alice!",
      "Bob and Alice",
      "Error — missing argument",
    ],
    correct_answer: "Hello, Bob! and Hi, Alice!",
    rubric: null,
    hint_level_1: "This tests default parameter values in function definitions.",
    hint_level_2: "When greeting is not passed, the default 'Hello' is used.",
    explanation: "greet('Bob') uses the default greeting='Hello' → 'Hello, Bob!'. greet('Alice', 'Hi') overrides it → 'Hi, Alice!'.",
    common_trap: "Thinking the second call still uses the default value.",
  },
  {
    question_id: "fallback-007",
    topic: "while-loops",
    difficulty: "medium",
    question_type: "trace-logic",
    prompt: "What value does x have after this loop finishes?",
    code_snippet: `x = 1
while x < 100:
    x = x * 2
print(x)`,
    options: ["64", "128", "100", "256"],
    correct_answer: "128",
    rubric: null,
    hint_level_1: "This tests loop tracing — follow the value of x each iteration.",
    hint_level_2: "Track: 1 → 2 → 4 → 8 → 16 → 32 → 64 → 128. At 128, the condition x < 100 is False.",
    explanation: "x starts at 1, doubles each iteration: 1,2,4,8,16,32,64,128. At 128, while 128<100 is False so loop exits. print(x) outputs 128.",
    common_trap: "Stopping at 64 (forgetting the loop runs one more time since 64 < 100).",
  },
  {
    question_id: "fallback-008",
    topic: "classes-objects",
    difficulty: "medium",
    question_type: "predict-output",
    prompt: "What does this code output?",
    code_snippet: `class Dog:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} says Woof!"

d = Dog("Rex")
print(d.speak())`,
    options: [
      "Rex says Woof!",
      "Dog says Woof!",
      "self says Woof!",
      "Error — missing argument",
    ],
    correct_answer: "Rex says Woof!",
    rubric: null,
    hint_level_1: "This tests class instantiation and method calls.",
    hint_level_2: "self.name is set in __init__ to the value passed when creating the object.",
    explanation: "Dog('Rex') creates an instance with self.name='Rex'. Calling d.speak() returns 'Rex says Woof!' using the f-string.",
    common_trap: "Thinking self.name would be 'Dog' (the class name) rather than 'Rex'.",
  },
  {
    question_id: "fallback-009",
    topic: "exceptions",
    difficulty: "hard",
    question_type: "explain-bug",
    prompt: "Explain why this code does not behave as intended.",
    code_snippet: `try:
    result = 10 / 0
except TypeError:
    print("Caught an error!")
print("Done")`,
    options: null,
    correct_answer: "The except clause catches TypeError, but 10/0 raises ZeroDivisionError. The exception is not caught, so Python raises an unhandled ZeroDivisionError and 'Done' is never printed.",
    rubric: "Award marks for: (1) identifying the exception raised is ZeroDivisionError not TypeError, (2) explaining the mismatch means the except block doesn't run, (3) noting Done is never printed.",
    hint_level_1: "Think about what specific error dividing by zero raises in Python.",
    hint_level_2: "Match the actual exception type to what the except block is catching.",
    explanation: "10 / 0 raises ZeroDivisionError. The except block only catches TypeError. Since there is no matching handler, the ZeroDivisionError propagates and crashes the program before 'Done' is printed.",
    common_trap: "Assuming any except clause catches all exceptions.",
  },
  {
    question_id: "fallback-010",
    topic: "dictionaries",
    difficulty: "medium",
    question_type: "predict-output",
    prompt: "What is the output of this code?",
    code_snippet: `scores = {"Alice": 85, "Bob": 92, "Carol": 78}
for name, score in scores.items():
    if score > 80:
        print(name)`,
    options: ["Alice and Bob", "Alice, Bob, Carol", "Bob only", "Alice only"],
    correct_answer: "Alice and Bob",
    rubric: null,
    hint_level_1: "This tests dictionary .items() iteration with a conditional filter.",
    hint_level_2: "Check each score: 85 > 80 ✓, 92 > 80 ✓, 78 > 80 ✗.",
    explanation: "scores.items() returns (name, score) pairs. Alice has 85 > 80 → printed. Bob has 92 > 80 → printed. Carol has 78 which is not > 80 → not printed.",
    common_trap: "Thinking 78 > 80 is true, or including Carol in the output.",
  },
  {
    question_id: "fallback-011",
    topic: "file-handling",
    difficulty: "medium",
    question_type: "find-bug",
    prompt: "What is wrong with this file handling code?",
    code_snippet: `f = open("data.txt", "w")
content = f.read()
f.close()
print(content)`,
    options: [
      "Cannot read from a file opened in write mode",
      "f.close() should come before f.read()",
      "print(content) will print None",
      "open() requires a third argument",
    ],
    correct_answer: "Cannot read from a file opened in write mode",
    rubric: null,
    hint_level_1: "This tests file modes. What does 'w' mode allow?",
    hint_level_2: "'w' opens the file for writing only. Reading requires 'r' mode.",
    explanation: "The file is opened with mode 'w' (write-only). Calling f.read() on a write-mode file raises UnsupportedOperation: not readable. Use mode 'r' to read.",
    common_trap: "Thinking the mode argument is optional or that 'w' allows reading.",
  },
  {
    question_id: "fallback-012",
    topic: "python-basics",
    difficulty: "easy",
    question_type: "concept-recognition",
    prompt: "Which Python concept is mainly being demonstrated in this snippet?",
    code_snippet: `name = input("Enter your name: ")
age = int(input("Enter your age: "))
print(f"Hello {name}, you are {age} years old.")`,
    options: [
      "User input, type conversion, and f-string formatting",
      "Function definition and return values",
      "List comprehension and iteration",
      "Exception handling with try/except",
    ],
    correct_answer: "User input, type conversion, and f-string formatting",
    rubric: null,
    hint_level_1: "Identify the three main operations happening in these 3 lines.",
    hint_level_2: "Look at input(), int(), and the f-string.",
    explanation: "Line 1 uses input() for user input. Line 2 converts the string input to int with int(). Line 3 uses an f-string (f'...') to embed variables in a string.",
    common_trap: "Overlooking that input() always returns a string, hence the need for int().",
  },
  {
    question_id: "fallback-013",
    topic: "boolean-logic",
    difficulty: "medium",
    question_type: "predict-output",
    prompt: "What does this code print?",
    code_snippet: `x = 5
y = 10
z = 5

print(x == z and y > x)
print(x != z or y < x)
print(not x == y)`,
    options: [
      "True, False, True",
      "True, True, False",
      "False, True, True",
      "True, False, False",
    ],
    correct_answer: "True, False, True",
    rubric: null,
    hint_level_1: "Evaluate each boolean expression step by step.",
    hint_level_2: "x==z is True (5==5). y>x is True (10>5). x!=z is False (5==5). not x==y: x==y is False, not False is True.",
    explanation: "x==z and y>x: True and True = True. x!=z or y<x: False or False = False. not x==y: not (5==10) = not False = True.",
    common_trap: "Getting the precedence of 'not' wrong — not applies to the whole expression x==y.",
  },
  {
    question_id: "fallback-014",
    topic: "tuples",
    difficulty: "easy",
    question_type: "find-bug",
    prompt: "What happens when this code runs?",
    code_snippet: `coords = (10, 20)
coords[0] = 15
print(coords)`,
    options: [
      "TypeError: tuple does not support item assignment",
      "Prints (15, 20)",
      "Prints (10, 20) — the assignment is silently ignored",
      "IndexError: tuple index out of range",
    ],
    correct_answer: "TypeError: tuple does not support item assignment",
    rubric: null,
    hint_level_1: "This tests the key property that distinguishes tuples from lists.",
    hint_level_2: "Tuples are immutable — their elements cannot be changed after creation.",
    explanation: "Tuples are immutable. Attempting coords[0] = 15 raises TypeError: 'tuple' object does not support item assignment.",
    common_trap: "Thinking tuples behave like lists for assignment.",
  },
  {
    question_id: "fallback-015",
    topic: "modules-imports",
    difficulty: "easy",
    question_type: "identify-error",
    prompt: "What error occurs when this code runs?",
    code_snippet: `from maths import sqrt
print(sqrt(16))`,
    options: ["ModuleNotFoundError", "NameError", "ImportError — wrong function", "SyntaxError"],
    correct_answer: "ModuleNotFoundError",
    rubric: null,
    hint_level_1: "This tests knowledge of Python's standard library module names.",
    hint_level_2: "The module is misspelled. Python's math module is math, not maths.",
    explanation: "The module is named 'math' not 'maths'. from maths import sqrt raises ModuleNotFoundError: No module named 'maths'. The correct import is: from math import sqrt.",
    common_trap: "Adding an 's' to 'math' — a very common beginner mistake.",
  },
];
