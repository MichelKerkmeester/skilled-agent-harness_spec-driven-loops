---
description: Turn a question about the code into a typed Jev query
argument-hint: <the question, plus any files it is about>
---

Answer this with Jev rather than on your own: $ARGUMENTS

1. Decide the shape of the judgement: yes/no (`noul`), pick one of a set
   (`choice`), or rate along a described dimension (`score`).
2. Name the files and line ranges the judgement depends on and pass them as
   `sources` so the server reads them; do not paste the code yourself.
3. Call `jev_ask` with one literal question per judgement, boundary cases in the
   criteria, everything in one call.
4. Report the numbers and what you conclude from them, keeping the two apart.

If the question needs counting, arithmetic, date comparison or generated text,
do that part yourself and ask Jev only for what is left.
