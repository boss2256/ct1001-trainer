export interface Topic {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  emoji: string;
}

export const TOPICS: Topic[] = [
  {
    id: "computational-thinking",
    label: "Computational Thinking",
    description: "Decomposition, pattern recognition, abstraction, algorithm design",
    keywords: ["decomposition", "abstraction", "algorithm", "pattern recognition"],
    emoji: "🧠",
  },
  {
    id: "python-basics",
    label: "Python Basics",
    description: "Variables, comments, I/O, basic syntax",
    keywords: ["print", "input", "comment", "syntax", "variable"],
    emoji: "🐍",
  },
  {
    id: "variables-data-types",
    label: "Variables & Data Types",
    description: "int, float, bool, str, type(), type conversion",
    keywords: ["int", "float", "bool", "str", "type", "casting"],
    emoji: "📦",
  },
  {
    id: "strings-io",
    label: "Strings & I/O",
    description: "String methods, f-strings, input/output, formatting",
    keywords: ["str", "f-string", "format", "input", "print", "len", "split"],
    emoji: "💬",
  },
  {
    id: "conditionals",
    label: "Conditional Statements",
    description: "if, elif, else, nested conditions",
    keywords: ["if", "elif", "else", "condition", "branch"],
    emoji: "🔀",
  },
  {
    id: "boolean-logic",
    label: "Boolean & Logical Expressions",
    description: "and, or, not, comparison operators, truthiness",
    keywords: ["and", "or", "not", "True", "False", "==", "!=", ">", "<"],
    emoji: "⚖️",
  },
  {
    id: "while-loops",
    label: "While Loops",
    description: "while, break, continue, infinite loops",
    keywords: ["while", "break", "continue", "loop", "iteration"],
    emoji: "🔄",
  },
  {
    id: "for-loops",
    label: "For Loops & Range",
    description: "for, range(), enumerate, iterating collections",
    keywords: ["for", "range", "enumerate", "in", "iterate"],
    emoji: "🔁",
  },
  {
    id: "lists",
    label: "Lists",
    description: "List creation, indexing, methods, slicing, list comprehension",
    keywords: ["list", "append", "pop", "index", "slice", "comprehension"],
    emoji: "📋",
  },
  {
    id: "tuples",
    label: "Tuples",
    description: "Tuple creation, immutability, unpacking, named tuples",
    keywords: ["tuple", "immutable", "unpack", "packing"],
    emoji: "🔒",
  },
  {
    id: "dictionaries",
    label: "Dictionaries",
    description: "Dict creation, key/value access, methods, iteration",
    keywords: ["dict", "key", "value", "get", "items", "keys", "values"],
    emoji: "🗂️",
  },
  {
    id: "sets",
    label: "Sets",
    description: "Set operations, union, intersection, difference, membership",
    keywords: ["set", "union", "intersection", "difference", "in", "add"],
    emoji: "🔢",
  },
  {
    id: "functions",
    label: "Functions",
    description: "def, return, scope, docstrings, first-class functions",
    keywords: ["def", "return", "function", "scope", "local", "global"],
    emoji: "⚙️",
  },
  {
    id: "parameters-return",
    label: "Parameters & Return Values",
    description: "Positional, keyword, default args, *args, **kwargs, multiple return",
    keywords: ["parameter", "argument", "default", "*args", "**kwargs", "return"],
    emoji: "↩️",
  },
  {
    id: "modules-imports",
    label: "Modules & Imports",
    description: "import, from...import, standard library, module lookup",
    keywords: ["import", "from", "module", "math", "random", "os"],
    emoji: "📦",
  },
  {
    id: "exceptions",
    label: "Exceptions & Error Handling",
    description: "try, except, else, finally, common exceptions",
    keywords: ["try", "except", "finally", "raise", "NameError", "TypeError", "KeyError", "IndexError"],
    emoji: "🚨",
  },
  {
    id: "file-handling",
    label: "File Handling",
    description: "open(), read, write, modes r/w/a, with statement",
    keywords: ["open", "read", "write", "with", "file", "close", "readline"],
    emoji: "📁",
  },
  {
    id: "csv-json",
    label: "CSV & JSON Concepts",
    description: "csv module, json module, reading and writing structured data",
    keywords: ["csv", "json", "DictReader", "DictWriter", "loads", "dumps"],
    emoji: "📄",
  },
  {
    id: "classes-objects",
    label: "Classes & Objects",
    description: "class, __init__, self, attributes, methods, instantiation",
    keywords: ["class", "__init__", "self", "object", "instance", "attribute", "method"],
    emoji: "🏗️",
  },
  {
    id: "oop-concepts",
    label: "Basic OOP Concepts",
    description: "Encapsulation, inheritance, constructor, class vs instance",
    keywords: ["inheritance", "encapsulation", "constructor", "super", "subclass"],
    emoji: "🧬",
  },
];

export const TOPIC_IDS = TOPICS.map((t) => t.id);

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
