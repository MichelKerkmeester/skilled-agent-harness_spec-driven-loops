---
title: "Rule: Prevent overengineering"
description: "Build the smallest thing that solves the stated problem; take a costlier move only by naming what fails at the cheaper one."
trigger_phrases:
  - "restraint ladder"
  - "reversal cost order"
  - "does this need to exist"
  - "build nothing"
  - "future proof"
  - "might need it later"
  - "flexible"
  - "best practice"
  - "while we're here"
  - "premature abstraction"
  - "DRY it up"
  - "two is not a pattern"
  - "speculative optimization"
  - "add a config option"
  - "add a dependency"
  - "feature flag"
  - "new abstraction layer"
  - "pre-write pass"
  - "climbing sentence"
  - "fallback for a constraint that does not exist"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Prevent overengineering

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before the first write of anything new.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- Adding a file, module, class, interface, abstraction, config option, feature flag, layer, or dependency.
- Generalizing something that already works for its one caller.
- Writing or thinking: *flexible*, *future-proof*, *scalable*, *extensible*, *might need*, *best practice*, *while we're here*.
- Adding a test beyond the coverage floor, or wrapping something already callable.

## The rule

**Build the smallest thing that solves the stated problem. Build the bigger thing only
after naming what fails at the smaller one.**

The naming is the whole rule. "It's cleaner" is not a failure. "A future caller might"
is not a failure. A failure is something that breaks today, for a requirement that
exists today.

---

## 1. THE REVERSAL-COST ORDER

Start at the cheapest move every time. **Take a costlier one only by writing the sentence
that says what fails at the cheaper one** in the response, not just in your head.

| Move | Cost when wrong |
|------|-----------------|
| **Build nothing:** existing behavior already meets the requirement | zero |
| Change a value, constant, or config that exists | one line to revert |
| Extend an existing function or module in place | contained to one unit |
| Add a new function beside the existing ones | one new symbol to learn |
| Add a new file or module | a new place readers must look |
| Add an abstraction, interface, or indirection layer | every future reader pays the hop |
| Add a dependency | permanent supply-chain, version and trust surface |

> **This orders moves by what being wrong costs, and it is deliberately not the numbered
> rung ladder.** For code, `AGENTS.md` §3 names
> `sk-code/shared/references/universal/code-quality-standards.md` §1 as the authoritative
> rungs, and that ladder orders *solution sources*, standard library, then native
> platform, then an installed dependency. Two orderings, two axes, one authority: cite
> rung numbers from that file, and cite moves by name from this one. Naming a "rung 2"
> here would mean something different there, which is exactly the confusion this section
> stopped causing.

Building nothing is not a formality: a surprising share of requests are already satisfied
by code that exists, and reading first is what reveals it. The sentence, written out, > "Extending `parseConfig` in place fails, because the CLI and the daemon call it with
> incompatible defaults today, so the change breaks the daemon. Adding a new function
> beside it."

If you cannot write that with a real symbol and a real caller in it, you are reaching
past the move you can justify.

---

## 2. THE PRE-WRITE PASS

After reading the existing code, before the first edit:

1. **Does this need to exist?** Walk §1 in order. Answer by naming the move and writing
   its climbing sentence.
2. **What does it touch?** If the change can break a caller or a shared contract, name
   the owning module, one real caller (`file:line`), and the contract that must not
   break. No real caller means the change is smaller than you think, or the code
   should not exist either.

---

## 3. TWO SIGNALS `AGENTS.md` DOES NOT CARRY

Its Restraint Signals table binds and is not repeated here.

| Signal | What it means | Do this |
|--------|---------------|---------|
| A config option "so we can change it later" | a decision deferred into a permanent branch | Hardcode it (§4) |
| A wrapper that only forwards arguments | indirection with no behavior | Call the thing directly |

---

## 4. SPECIFIC RESTRAINTS

**Options.** Every option is a permanent branch in the code, a row in the docs, and an
axis in the test matrix. Default to hardcoding. An option earns existence when **two
real callers need different values today**.

**Abstraction.** One instance is a case, two a coincidence, three a pattern. Abstracting
at two buys a wrong abstraction more often than it saves a duplication, and duplication
is cheaper to fix than the wrong seam.

**Error handling.** Catch only what you can handle. A `try` that logs and re-raises, or
swallows an exception into a default, converts a loud failure into a silent wrong answer.

**Defensive checks.** Do not validate what the type system, the caller contract, or the
layer above already guarantees. A null check on something never null tells the next
reader it *is* sometimes null, and they will code around a ghost.

**Tests.** The coverage floor and the earns-its-place bar are `AGENTS.md` §3. The ladder
applies to test code exactly as to the code under test.

**Performance.** No speculative optimization. Measure under stated conditions and report
baseline and delta, or leave it alone.

**Fallbacks.** A second code path for a constraint the target environment does not
actually have is an untested branch that will rot. Add the no-install path, the offline
path, or the degraded path only when you can name the environment that needs it. "In
case" is not an environment.

**Dependencies.** Prefer what the project has. A new one is the costliest move in §1,
needs its climbing sentence, and takes the `blast-radius.md` pass too, installing
mutates the environment.

---

## 5. WHAT THIS RULE IS NOT

Restraint constrains *how much you build*, never *how much you deliver*.

- **Not a license to under-deliver.** "This part is unnecessary" never authorizes
  cutting it. Build the frozen scope **and** raise the amendment in the same response.
- **Not a reason to skip real error handling.** A failure mode that happens is not
  speculative.

---

## 6. SELF-CHECK

- [ ] Named the move and wrote the climbing sentence for every move past "build nothing".
- [ ] Every new option, abstraction and dependency has a caller that needs it **today**.
- [ ] Nothing is justified only by a future nobody asked for.
- [ ] If I judged part of the scope unnecessary, I built it anyway and said so.
- [ ] Any fallback path I added names the environment that requires it.
