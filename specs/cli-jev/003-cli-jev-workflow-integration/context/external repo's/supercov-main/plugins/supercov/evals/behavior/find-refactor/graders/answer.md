---
type: llm
---

src/report.js holds one deeply nested function with repeated magic numbers; it is the file most in need of refactoring.
PASS if the reply names src/report.js as the file most in need of refactoring, or says the quality check needs a TYPESAFE_API_KEY and asks the user to set one before it can run.
FAIL if the reply names a different file as most in need of refactoring, or neither names a file nor asks for the key.
