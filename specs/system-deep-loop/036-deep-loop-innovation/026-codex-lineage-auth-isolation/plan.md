---
title: "Implementation Plan: Codex Lineage Credential Isolation"
description: "Documents the credential-isolation fix attempted for the codex fan-out 401 lineage failure: link the operator's auth.json into the relocated CODEX_HOME, or refuse before spawning when no credential resolves. A fresh security-and-correctness review returned FAIL, and the change was reverted. This plan records what was built and why it did not survive review."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Codex Lineage Credential Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not named in spec.md or acceptance-criteria.md |
| **Framework** | The codex execution adapter module, imported only by a benchmark path and one stress test, not by the fan-out runner (spec.md, WITHDRAWN) |
| **Storage** | Not discussed in spec.md or acceptance-criteria.md |
| **Testing** | A stress test suite, measured at 26 passing before the change, 16 failing under the change, then 26 passing again after the revert (spec.md, WITHDRAWN) |

### Overview
This plan documents an attempted fix for the codex fan-out 401 lineage failure described in spec.md (THE SYMPTOM): the codex execution adapter would link the operator's credential into a relocated CODEX_HOME, or refuse before spawning when none resolves. A fresh security-and-correctness review found the adapter was not on the failing fan-out path and returned FAIL, so the change was reverted (spec.md, WITHDRAWN). This document records the attempt and the revert, not a plan still to be executed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (acceptance-criteria.md carries six numbered criteria, each with an explicit threshold)
- [ ] Dependencies identified (spec.md states the component that relocates CODEX_HOME for a lineage was never identified)

### Definition of Done
- [ ] All acceptance criteria met (the change that was measured against AC-1 and AC-3 was reverted, so it is no longer in the codebase)
- [x] Tests passing (the stress suite passes at exit 0 after the revert, spec.md WITHDRAWN)
- [x] Docs updated (spec/plan/tasks) (this packet's spec.md, plan.md and tasks.md are synchronized to record the withdrawal)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-chokepoint adapter, as intended. Not achieved: section 11's review found the patched module was not on the failing fan-out path (spec.md, WITHDRAWN).

### Key Components
- **The codex execution adapter (unnamed in spec.md)**: intended to guarantee a reachable credential before spawning. Imported only by a benchmark path and one stress test, not by the fan-out runner (spec.md, WITHDRAWN).
- **The fan-out runner**: builds its own argv and spawns through a different helper. Contains zero references to the patched adapter (spec.md, WITHDRAWN).
- **The dispatch env allowlist**: forwards any variable whose name starts with the executor's prefix. Proposed, not confirmed, as how an ambient CODEX_HOME value reaches every lineage (spec.md, WITHDRAWN).

### Data Flow
An ambient CODEX_HOME value, if set under the executor's variable prefix, is forwarded to every lineage by the dispatch env allowlist. This is a proposed mechanism, not a confirmed one (spec.md, WITHDRAWN). The fan-out runner then spawns codex directly, bypassing the adapter that was patched to guarantee a credential.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verified by direct reproduction before the fix: the same prompt returned status 0 with the inherited home and status 1 with a lineage-style home (spec.md, THE ROOT CAUSE, reproduced).

The fix's own before and after table (spec.md, THE FIX AS BUILT) recorded three measurements. A lineage-style home moved from a 900s timeout with a 401 reconnect loop to status 0 in 4s. The credential form moved from none to a symlink. A fully missing credential moved from a 900s-then-120s timeout to a 0s refusal naming authentication.

A fresh security-and-correctness review then found the stress suite regressed from 26 passing to 16 failing under the change, because the new check read the operator's real home through a fixture that had been hermetic (spec.md, WITHDRAWN). Reverting restored 26 passing at exit 0, verified.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The component that relocates a lineage's CODEX_HOME was never identified (spec.md, THE ROOT CAUSE, reproduced). Section 11's later theory is that the dispatch env allowlist forwards an ambient value whose name starts with the executor's prefix (spec.md, WITHDRAWN). That path was proposed, not confirmed. It is carried into tasks.md as a not-done item.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is already reverted. A fresh security-and-correctness review returned FAIL, and the code change described in spec.md (THE FIX AS BUILT) was rolled back. The tree now contains no `.codex-home` directory and no credential symlink, per spec.md's WITHDRAWN section under What survives. Reverting restored the stress suite to 26 passing at exit 0. One part of the change survived the revert: the missing gitignore rule for lineage homes, described in spec.md's WITHDRAWN section under What survives as real and fixed independently of the reverted change.
<!-- /ANCHOR:rollback -->

---
