# Rule: Overengineering

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before the first write of
> anything new.

---

## Fires when

- You are about to add a file, module, class, interface, abstraction, config
  option, feature flag, layer, or dependency.
- You are about to generalize something that already works for its one caller.
- You catch yourself writing or thinking: *flexible*, *future-proof*, *scalable*,
  *extensible*, *might need*, *best practice*, *while we're here*, *let's make it
  generic*.
- You are about to add a test beyond the coverage floor.
- You are about to wrap, adapt, or re-export something that is already callable.

## The rule

**Build the smallest thing that solves the stated problem. You may only build the
bigger thing after naming what fails at the smaller one.**

The naming is the whole rule. "It's cleaner" is not a failure. "A future caller
might" is not a failure. A failure is a concrete thing that breaks today, for a
requirement that exists today.

---

## 1. The restraint ladder

Cheapest rung first. Start at 0 every time. **Climb one rung only by writing the
sentence that says what fails at the rung below** — and put that sentence in the
response, not just in your head.

| Rung | Move | Typical cost when wrong |
|------|------|-------------------------|
| **0** | **Build nothing** — the requirement is already met by existing behavior | zero |
| **1** | Change a value, constant, or config in something that exists | one line to revert |
| **2** | Extend an existing function or module in place | contained to one unit |
| **3** | Add a new function beside the existing ones | one new symbol to learn |
| **4** | Add a new file or module | a new place readers must look |
| **5** | Add an abstraction, interface, or indirection layer | every future reader pays the hop |
| **6** | Add a dependency | permanent supply-chain, version, and trust surface |

Rung 0 is not a formality. A surprising share of requests are already satisfied by
code that exists — reading first is what reveals it, which is why this is a
post-read reflex and not a planning ritual.

**Climbing sentence, written out:**

> "Rung 2 fails because `parseConfig` is called from the CLI and the daemon with
> incompatible defaults today, so extending it in place breaks the daemon. Going
> to rung 3."

If you cannot write that sentence with a real symbol and a real caller in it, you
are on the wrong rung.

---

## 2. The pre-write pass

Two questions, in order, after reading the existing code and before the first edit.

**Q1 — Does this need to exist?**
Walk the ladder. Answer with a rung number and the climbing sentence.

**Q2 — What does it touch?**
If the change can break a caller or a shared contract, name three things before
editing: the **owning module**, one **real caller** (file:line), and the
**contract that must not break**. If you cannot name a real caller, the change is
smaller than you think — or the caller does not exist and neither should the code.

---

## 3. Signals and responses

Each row is a signal that the work has drifted off the stated problem. The response
column is what to *do*, not a phrase to recite.

| Signal | What it usually means | Do this |
|--------|----------------------|---------|
| "for flexibility", "future-proof", "might need" | an abstraction no current requirement earns | Build for the actual requirement. Note the hypothetical in close-out if it is worth tracking at all. |
| "could be slow", "might bottleneck" | a cost asserted without measurement | Measure, then report baseline and delta — or leave it alone. |
| "best practice", "always should" | a pattern imported without checking fit | Name the specific bug, cost, or user problem it prevents *here*, or drop it. |
| "while we're here", "also add", "might as well" | work outside the frozen scope | Record it separately. See `scope-discipline.md`. |
| "let's DRY this up" across two instances | similarity mistaken for sameness | Two is a coincidence. Wait for the third. |
| A config option "so we can change it later" | a decision deferred into a permanent branch | Hardcode it. See §4. |
| A wrapper that only forwards arguments | indirection with no behavior | Call the thing directly. |
| The fix works only where the bug surfaced | the symptom was treated, not the cause | Trace to the producer. See `root-cause.md`. |

---

## 4. Specific restraints

**Configuration and options.** Every option is a permanent branch in the code, a
permanent row in the docs, and a permanent axis in the test matrix. Default:
hardcode the value. An option earns existence when **two real callers need
different values today** — not when one caller might later.

**Abstraction.** The rule of three: one instance is a case, two is a coincidence,
three is a pattern. Abstracting at two costs you a wrong abstraction more often
than it saves you a duplication. Duplication is cheaper to fix than the wrong
seam.

**Error handling.** Catch what you can actually handle. A `try` that logs and
re-raises, or that swallows an exception into a default, converts a loud failure
into a silent wrong answer. Let unhandleable failures propagate.

**Defensive checks.** Do not validate what the type system, the caller contract, or
the layer above already guarantees. A null check on something that is never null
tells the next reader it *is* sometimes null, and they will code around a ghost.

**Tests.** The coverage floor comes first and this rule never waives it: happy path
plus one edge case per public surface. **Above that floor, a new test earns its
place only by failing for one real reason no current test catches.** Do not add a
test per branch, re-assert the framework or the language, or mirror the
implementation line for line. Changed behavior gets coverage; unchanged behavior
does not get new tests.

**Performance.** No speculative optimization. Measure under stated conditions,
report baseline and delta, or leave the code alone.

**Dependencies.** Prefer what the project already has. A new dependency is rung 6
and needs its climbing sentence like any other rung — plus the blast-radius pass
in `blast-radius.md`, because installing is a mutation of the environment.

---

## 5. What this rule is NOT

Restraint constrains *how much you build*, never *how much you deliver*.

- **Not a license to under-deliver.** Concluding "this part is unnecessary" never
  authorizes cutting it. Implement the frozen scope **and** raise the amendment in
  the same response.
- **Not a reason to skip real error handling.** A failure mode that happens is not
  speculative.
- **Not an excuse to skip the coverage floor.**
- **Not a reason to leave the work half-finished.** A smaller solution still has to
  be a complete one.

---

## 6. Self-check

Before the first write of anything new:

- [ ] I read the existing code before deciding this must exist.
- [ ] I named the rung and wrote the climbing sentence for every rung above 0.
- [ ] Every new option, abstraction, and dependency has a caller that needs it
      **today**.
- [ ] No new test exists that does not fail for a reason no other test catches.
- [ ] Nothing here is justified only by a future that has not been asked for.
- [ ] If I judged part of the scope unnecessary, I built it anyway and said so.
