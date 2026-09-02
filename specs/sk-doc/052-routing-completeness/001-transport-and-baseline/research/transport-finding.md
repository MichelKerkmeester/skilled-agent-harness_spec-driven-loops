---
title: "Which Scorer Governs Automatic Routing"
description: "Two scorers answer the same question and disagree on roughly a third of prompts. This records which one the runtime consults, the code path that proves it, and what follows for every routing number measured anywhere else."
trigger_phrases:
  - "advisor transport"
  - "which scorer governs routing"
  - "daemon versus python scorer"
importance_tier: "important"
contextType: "implementation"
---

# Which Scorer Governs Automatic Routing

Settled by reading the dispatch path rather than by comparing outputs.

---

## 1. OVERVIEW

Two scorers answer the routing question. A TypeScript one reached through the advisor
daemon, and a Python one invoked as a command. They disagree on roughly a third of prompts,
and the 0.8 invocation bar frequently falls between their two answers, so the same request
routes or does not depending on which one replied.

That made every routing number ambiguous until the caller was established.

---

## 2. THE FINDING

**The automatic path is the TypeScript scorer, and no live hook path invokes Python.**

The evidence is a chain of three reads:

- The primary is the advisor handler, which imports its scorer from the fusion module under
  the server's own scorer library.
- Its only fallback is the daemon-backed command in the runtime bin directory, which speaks
  the same tool surface over a socket. That is a transport, not a second scorer.
- A search of the hook library for a Python invocation returns nothing. The one place the
  Python scorer appears outside its own directory is a validation handler, which is not on
  the routing path.

**The Python scorer is still real, and it has a caller.** The repository's own gate documents
it as the fallback to run by hand when no hook brief is present. So both scorers govern
something. One answers the hook, the other answers a person following the written
instruction, and the two give different routing for the same words.

---

## 3. WHAT FOLLOWS

Every routing measurement uses the daemon, because that is what routes without a human in
the loop. A number measured through the Python command describes the manual path only and
must say so.

Two further cautions carry into every later phase.

**A confidence of exactly 0.8200 is a floor rather than a score.** Anything the daemon
surfaces at all reports at least that value. An unrelated request to refactor a module
returns exactly 0.8200 with an underlying score near 0.51. Reading it as a passing score
overstates a result that has not cleared anything. The score field is the discriminator.

**The disagreement itself is a finding, not a nuisance to route around.** A repository that
documents a manual command giving materially different answers from its own automation has
two routing behaviours and one description of them.
