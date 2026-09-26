---
type: llm
---

src/users.js has findUser build its SQL query by interpolating name into the string, which allows SQL injection.
PASS if the reply reports that SQL injection risk in src/users.js, or says the security check needs a TYPESAFE_API_KEY and asks the user to set one before it can run.
FAIL if the reply says the project has no security problems, or neither reports the injection nor asks for the key.
