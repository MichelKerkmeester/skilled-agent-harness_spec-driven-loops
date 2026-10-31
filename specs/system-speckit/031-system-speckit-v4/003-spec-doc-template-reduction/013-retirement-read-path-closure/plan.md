---
title: "Implementation Plan: Retirement Read-Path Closure"
description: "Five independent fixes, ordered so the one that changes what every future packet contains lands first and the rest can be measured against it."
trigger_phrases:
  - "read path closure plan"
  - "scaffold verification region"
  - "level inference replacement document"
  - "flag parser unrecognized value"
  - "level two tasks verification region"
  - "reference sweep historical mentions"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retirement Read-Path Closure

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five fixes with no shared code. Ordering is about measurement, not dependency: the scaffold fix
changes what a packet contains, and the id-filter fix changes what is counted inside it. Doing
the scaffold first means the id-filter's new finding count is measured against packets that
actually have a verification region, rather than against packets that never had one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

**Scaffold and upgrade.** The tasks template already gates the verification region on level 2 and
above. Two things defeat that gate: phase children are created at level 1 regardless of the
requested level, and the upgrade path adds documents without re-assembling existing ones. Fix the
first by honouring the requested level; fix the second by re-running the tasks assembly at the
new level, preserving authored content.

**Evidence checking.** The rule that did this was deleted as advisory while this phase was
being written. Start from that reasoning rather than around it: an advisory rule nobody read was
worth deleting. The open question is whether the acceptance-criteria document already carries the
weight, in which case nothing replaces it, or whether verification items need a check that
actually blocks.

**Level inference.** Both modules key on a file that no longer exists. The replacement signal for
level 2 is the document that became required at level 2.

**The flag parser.** Recognized truthy and falsey values keep their meaning; anything else is
neither, and the caller is told so rather than being handed a silent default.

**The reference sweep.** Distinguish an instruction to create the document from a historical
mention of it. Remove the first, keep the second.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION STEPS

| Step | Work | Gate before the next step |
|------|------|---------------------------|
| 1 | Scaffold honours the requested level for phase children | A child created at level 2 has the verification region |
| 2 | Upgrade re-assembles `tasks.md` at the new level | An upgraded packet matches a natively scaffolded one |
| 3 | Decide whether evidence checking needs a blocking successor | The decision and its reasoning are written down |
| 4 | Restore level-2 inference in both modules | Both return 2 for a level-2 packet |
| 5 | Flag parser reports unrecognized values | A misspelled enforcement variable is an error |
| 6 | Sweep the eight reference documents | No instruction to create the retired document remains |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING STRATEGY

Each fix gets a control observed failing first, because every one of these defects is a check
that was already passing while doing nothing.

- Level inference: today both modules return 1 for a level-2 packet.
- Flag parser: today a misspelled value disables the rule and reports nothing.
- Scaffold: today a fresh phase child has zero verification items.
- Upgrade: today raising a packet to level 2 leaves `tasks.md` untouched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

| Dependency | Why | Risk if unavailable |
|------------|-----|---------------------|
| The tasks template's level gating | Defines what a level-2 packet contains | None; in-repo |
| The two rules consuming the flag parser | Determine whether failing loudly breaks a caller | Inventory them before changing the shared helper |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK

Each fix is its own commit and none share a file, so any one reverts alone. The scaffold and
upgrade changes affect only packets created after they land; existing packets are untouched, so
rolling them back cannot corrupt anything already written.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## L2: AFFECTED SURFACES

| Surface | Effect |
|---------|--------|
| Every future packet | Gains the verification region its level entitles it to |
| The evidence rule | Reports items it currently exempts |
| Two blocking validation rules | Stop being silently disableable by a typo |
| The authoring documentation | Stops teaching a document that no longer exists |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Independent of 012. Shares no file with it and can land before, after, or alongside.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT

| Step | Estimate |
|------|----------|
| Scaffold and upgrade | Medium — the upgrade re-assembly must preserve authored content |
| Evidence decision | Small to write, but it is a judgement about what should block, not a code change |
| Level inference | Small, two files |
| Flag parser | Small, with a caller inventory first |
| Reference sweep | Medium — judgement per occurrence, not a substitution |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ROLLBACK DETAIL

The reference sweep is the only step that cannot be verified mechanically, since it turns on
whether a mention is instructional. Keep it last so a revert of it disturbs nothing else.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Every control observed failing before its fix.
- `validate.sh <packet> --strict` reports `RESULT: PASSED` on this packet.
- A freshly scaffolded level-2 phase child has a verification region.
- The evidence-checking decision is recorded with its reasoning.
<!-- /ANCHOR:quality-gates -->
