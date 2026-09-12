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
version: 1.1.0.5
---

# Integration and Lifecycle: Wiring, Revising and Retiring a Rule

A rule file that nothing points at is inert.

---

## 0. OVERVIEW

The router's trigger table is the only thing that **loads** one; the pointer from the
governed `AGENTS.md` section is the only thing that makes it **findable at the moment
of need**.

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

The shipped set hit this four times, and every time the row was written before
anyone looked:

- Adding the delegation rule under a scope statement that listed "agent dispatch" as
  **Out**. The router would have routed to a rule it declared out of bounds.
- Moving communication down while §4 said nothing about how a reply reads.

All four were caught and the boundary was widened deliberately each time, the third
being the narrow routing carve-out that admits verifying wiring you changed while still
refusing route selection. **A fifth widening that admitted selection itself would
dissolve the boundary the set exists to hold** — if the scope statement excludes a
proposal, that is a refusal, not a paperwork problem. The mode does not widen §4
unilaterally; that is an operator decision, and each of the four was one.

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

**On `version`:** use the fourth segment for any content change and leave the first three
alone until something forces the question. **This is a choice, not a finding.**

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

## 8. THE SIBLING FEDERATION

A rule file can be shared. A rule in `repo-rules/` may be symlinked into sibling
repositories, and each sibling's router then points at the link. The source file stays
here. A sibling holds only a path to it, so **every shared rule is edited, versioned
and retired in one place**.

**Per sibling, four mechanics.** A new or promoted rule needs all four in every sibling
that shares the set. Each omission breaks something specific:

| Missing | Result |
|---------|--------|
| Symlink | A row resolves to nothing, and the break looks like coverage |
| `.gitignore` entry | The link is committed and dangles on a fresh clone, and it publishes the local filesystem layout |
| Trigger row | The rule never loads in that repository |
| Index row | The rule is unbrowsable there |

**The symlink shape.** Create a relative symlink in the sibling's `repo-rules/`
directory, named after the rule and pointing at the source file, for example
`../../Code_Environment/Public/repo-rules/<rule>.md`. A relative target names the
sibling's own layout instead of an absolute home directory.

**The `.gitignore` entry.** Add `repo-rules/<rule>.md` to the sibling's shared-rules
block. Local rule files and the router beside the symlinks stay tracked. Only the
links are ignored.

**The rows.** Add the trigger row to the sibling router's §2 and the index row to its
§3, matching the source rows. A shared row carries no `**local**` marker. The rules
that live in the sibling are the ones that do.

**Ordering.** Create the symlink only after the source file exists, or it dangles.
Retire by running that order backwards in every sibling: rows first, then the
`.gitignore` entry, then the symlink, and the source file last. Deleting the source
first leaves every sibling row pointing at nothing.

**Promoting a local rule.** Move the file into the source repository's `repo-rules/`,
replace each sibling's local copy with the symlink, and add the ignore entry and the
rows that are missing.

**Verifying a shared rule.** Follow each link to a real file, confirm both rows
resolve, and confirm that every sibling still has the same count of files, trigger
rows and index rows. A link that resolves in one repository is not evidence for
another.

---

## 9. SELF-CHECK

- [ ] The scope statement was checked before the trigger row was written.
- [ ] All three wiring points exist, and the pointer covers every governed section.
- [ ] Trigger rows, index rows and rule files are the same count.
- [ ] Every link resolves.
- [ ] On a shared rule: every sibling carries the symlink, the ignore entry and both rows.
- [ ] On revise: if the firing condition changed, the trigger row changed with it.
- [ ] On retire: nothing points at the deleted file, and the reason is recorded.
- [ ] Nothing in `AGENTS.md` changed except a pointer.
