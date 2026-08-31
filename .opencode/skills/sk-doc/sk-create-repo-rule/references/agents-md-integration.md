---
title: "Integration and Lifecycle: Wiring, Revising and Retiring a Rule"
description: "A rule nothing points at never loads. The three wiring points, the order that makes every step interruptible, and the retire path — the one operation the rule set has never performed."
trigger_phrases:
  - "wire a rule"
  - "trigger row and index row"
  - "agents md pointer"
  - "retire a rule"
  - "revise a rule"
  - "dangling router row"
  - "rule lifecycle"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Integration and Lifecycle: Wiring, Revising and Retiring a Rule

A rule file that nothing points at is inert. The router's trigger table is the only thing
that **loads** one; the pointer from the governed `AGENTS.md` section is the only thing
that makes it **findable at the moment of need**.

---

## 1. THE THREE WIRING POINTS

| Point | Where | Lost without it |
|-------|-------|-----------------|
| **Trigger row** | `REPO RULES.md` §2 | The rule never loads. Nothing else in the system fires a rule file |
| **Index row** | `REPO RULES.md` §3 | The rule is unbrowsable — reachable only by already knowing its trigger |
| **Governed-section pointer** | The `AGENTS.md` section it expands | The rule is discoverable at session start and invisible at the moment of need. This is the one people skip |

**Measured:** every shipped rule has all three. Pointer counts run 2-4 per rule across 18
sections — a rule governing two areas gets a pointer in each, and the two-pointer minimum
is not an accident.

---

## 2. THE SCOPE-STATEMENT CHECK — RUN IT FIRST

Before adding a trigger row, confirm `REPO RULES.md` §4 **In** admits the rule.

The shipped set hit this twice, and both times the row was written before anyone looked:

- Adding the delegation rule under a scope statement that listed "agent dispatch" as
  **Out**. The router would have routed to a rule it declared out of bounds.
- Moving communication down while §4 said nothing about how a reply reads.

Both were caught and the boundary was widened deliberately. **A third widening to admit
routing would dissolve the boundary the set exists to hold** — if the scope statement
excludes it, that is a refusal, not a paperwork problem. The mode does not widen §4
unilaterally; that is an operator decision.

---

## 3. CREATE

Order matters, and it is chosen so an interruption is survivable.

1. **Scope check** (§2 above). Refuse here if it fails.
2. **Write the rule file.** First, deliberately.
3. **Add the trigger row.**
4. **Add the index row.**
5. **Add the pointer** to each `AGENTS.md` section the rule governs.
6. **Verify**: every link resolves; trigger rows, index rows and rule files are all the
   same count.

**Why the file first.** Stop after step 2 and you have an unreferenced file — inert,
harmless, obvious. Stop after step 3 with no file and you have a router row pointing at
nothing, which **looks like coverage**. Always leave the safer wreck.

---

## 4. REVISE

1. Run the decision tests again. A rule that no longer passes them should be **retired,
   not patched** — a rule kept alive by editing is how a set stops meaning anything.
2. Edit the rule.
3. **If the change alters when the rule fires, change the trigger row in the same edit.**
   Otherwise the router now lies about the rule, and it lies silently.
4. Bump `version`.
5. Re-verify links and counts.

**On `version`:** all eight shipped rules sit at `1.0.0.0`, so the corpus offers no
evidence for a scheme. Use the fourth segment for any content change and leave the first
three alone until something forces the question. **This is a choice, not a finding.**

---

## 5. RETIRE

**The rule set has never done this.** The path below is the create path inverted, and it
has been dry-run rather than performed.

1. **Remove the pointer** from every governed `AGENTS.md` section.
2. **Remove the index row.**
3. **Remove the trigger row.** The rule can no longer load.
4. **Delete the file.**
5. **Record why**, so the same rule is not proposed again next quarter with nobody
   remembering it was refused.
6. **Verify**: counts equal again, every remaining link resolves.

**Why this order.** It is create reversed for the same reason create is ordered as it is:
stop anywhere and the worst state is a file nothing points at. Delete the file first and
every intermediate state has rows pointing at nothing.

**Do not archive.** Git holds the history. An archive directory becomes the place rules go
to be ignored, and a reader who finds one cannot tell retired from pending.

---

## 6. THE `AGENTS.md` BOUNDARY

**Adding or removing a pointer is mechanical. Everything else escalates.**

That document carries hard blockers and mandatory gates. A mode that could edit it freely
could weaken the thing the whole rule set defers to. If wiring a rule seems to require
changing an `AGENTS.md` row, a gate, or the §4 scope statement — stop and put it to the
operator. That is not caution, it is the precedence ladder working.

---

## 7. A REPOSITORY WITH NO ROUTER

No `REPO RULES.md` means no rule can load, whatever else is true. Emit the router from
`assets/repo-rules-router-template.md` before writing the rule. It is a prerequisite, not
a deliverable — nobody asked for it.

---

## 8. SELF-CHECK

- [ ] The scope statement was checked before the trigger row was written.
- [ ] All three wiring points exist, and the pointer covers every governed section.
- [ ] Trigger rows, index rows and rule files are the same count.
- [ ] Every link resolves.
- [ ] On revise: if the firing condition changed, the trigger row changed with it.
- [ ] On retire: nothing points at the deleted file, and the reason is recorded.
- [ ] Nothing in `AGENTS.md` changed except a pointer.
