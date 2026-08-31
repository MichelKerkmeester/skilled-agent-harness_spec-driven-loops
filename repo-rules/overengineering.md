# Rule: Overengineering

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before the first write of anything new.
> Expands `AGENTS.md`, never overrides it — where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

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

## 1. The restraint ladder

Start at rung 0 every time. **Climb one rung only by writing the sentence that says
what fails at the rung below** — in the response, not just in your head.

| Rung | Move | Cost when wrong |
|------|------|-----------------|
| **0** | **Build nothing** — existing behavior already meets the requirement | zero |
| **1** | Change a value, constant, or config that exists | one line to revert |
| **2** | Extend an existing function or module in place | contained to one unit |
| **3** | Add a new function beside the existing ones | one new symbol to learn |
| **4** | Add a new file or module | a new place readers must look |
| **5** | Add an abstraction, interface, or indirection layer | every future reader pays the hop |
| **6** | Add a dependency | permanent supply-chain, version and trust surface |

Rung 0 is not a formality: a surprising share of requests are already satisfied by code
that exists, and reading first is what reveals it. The sentence, written out —

> "Rung 2 fails because `parseConfig` is called from the CLI and the daemon with
> incompatible defaults today, so extending it in place breaks the daemon. Going to
> rung 3."

If you cannot write that with a real symbol and a real caller in it, you are on the
wrong rung.

## 2. The pre-write pass

After reading the existing code, before the first edit:

1. **Does this need to exist?** Walk the ladder. Answer with a rung number and the
   climbing sentence.
2. **What does it touch?** If the change can break a caller or a shared contract, name
   the owning module, one real caller (`file:line`), and the contract that must not
   break. No real caller means the change is smaller than you think — or the code
   should not exist either.

## 3. Two signals `AGENTS.md` does not carry

Its Restraint Signals table binds and is not repeated here.

| Signal | What it means | Do this |
|--------|---------------|---------|
| A config option "so we can change it later" | a decision deferred into a permanent branch | Hardcode it (§4) |
| A wrapper that only forwards arguments | indirection with no behavior | Call the thing directly |

## 4. Specific restraints

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

**Dependencies.** Prefer what the project has. A new one is rung 6, needs its climbing
sentence, and takes the `blast-radius.md` pass too — installing mutates the environment.

## 5. What this rule is NOT

Restraint constrains *how much you build*, never *how much you deliver*.

- **Not a license to under-deliver.** "This part is unnecessary" never authorizes
  cutting it. Build the frozen scope **and** raise the amendment in the same response.
- **Not a reason to skip real error handling.** A failure mode that happens is not
  speculative.

## 6. Self-check

- [ ] Named the rung and wrote the climbing sentence for every rung above 0.
- [ ] Every new option, abstraction and dependency has a caller that needs it **today**.
- [ ] Nothing is justified only by a future nobody asked for.
- [ ] If I judged part of the scope unnecessary, I built it anyway and said so.
