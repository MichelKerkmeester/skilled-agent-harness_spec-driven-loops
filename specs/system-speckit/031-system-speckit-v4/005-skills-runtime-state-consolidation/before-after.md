---
title: "Before/After Record: skills-root state consolidation"
description: "What the skills directory showed before and after seven runtime-state directories moved under one .state parent."
trigger_phrases:
  - "skills state before after"
  - "state directory consolidation"
  - "skills folder cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: before-after | v2.2 -->
# Before/After Record: skills-root state consolidation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Compares what `.opencode/skills/` lists, and where four subsystems write runtime state.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** runtime state under `.opencode/skills/`
**Status:** Accepted
**Date:** 2026-08-28
**Owner:** Operator
**Related packet:** `specs/system-speckit/033-system-speckit-v4/005-skills-runtime-state-consolidation`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:summary -->
## 2. SUMMARY

**What changed:** seven runtime-state directories moved from the skills root into a single `.state/` parent, one child per owning subsystem.

**Why it changed:** the skills root is what a person opens to find a skill, and seven of its hidden entries were machine state with nothing grouping them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:comparison -->
## 3. COMPARISON

Write one block per aspect the change touched. Name the aspect, state how it was, then state how it is now. Keep it prose. Do not use a table.

**What the skills directory lists**
Before: skills, plus seven hidden state directories interleaved among them with nothing marking them as different in kind.
After: skills, plus one `.state` entry. Everything machine-owned sits behind it.

**Naming**
Before: each directory carried a leading dot and a `-state` suffix, so the word "state" appeared twice in every path.
After: the parent carries both meanings once. `.advisor-state` is `.state/advisor`; `.spec-gate-state` is `.state/spec-gate`.

**Ignore rules**
Before: fifteen lines, seven excluding a directory and seven re-including its README.
After: two lines. The exclusion deliberately matches one level inside each child, because excluding the directory itself would make the README negation inert and untrack all seven documents without any error.

**Test fixtures**
Before: two fail-open tests rebuilt the state directory's parent by hand, encoding how deep it sat.
After: both derive the parent from the resolver's own answer, so the next relocation needs no fixture edit.

**Where a subsystem writes**
Before: each of four subsystems wrote to its own directory at the skills root.
After: each writes one level deeper. Nothing above the resolver changed, and the advisor was observed writing to the new location immediately.
<!-- /ANCHOR:comparison -->

---

<!-- ANCHOR:net-effect -->
## 4. NET EFFECT

**Behavior:** unchanged for every subsystem. The same files are written with the same fail-open semantics, one directory deeper.
**Operational impact:** processes started before the change keep writing the old paths until restarted. Because the old paths are no longer ignored, such a process reveals itself as an untracked directory rather than diverging quietly.
**Follow-up:** restart the long-lived daemons, and decide whether a standing guard should fail the gate on any pre-`.state` write.
<!-- /ANCHOR:net-effect -->

---

<!-- ANCHOR:notes-caveats -->
## 5. NOTES & CAVEATS

Thirty untracked runtime files were discarded rather than migrated, on the operator's instruction; all were derived and machine-local. One historical benchmark report still records a pre-change path and was left untouched, because editing it would falsify what that run observed.
<!-- /ANCHOR:notes-caveats -->
