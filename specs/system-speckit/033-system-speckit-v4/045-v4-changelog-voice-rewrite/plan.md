---
title: "Implementation Plan: v4 changelog in the root README voice"
description: "Rewrite the changelog paragraph by paragraph in the root README's voice, correct the four counts the tree contradicts, add the two late-cycle glance bullets, and prove fact preservation with an extraction diff against HEAD."
trigger_phrases:
  - "v4 changelog voice plan"
  - "census rewrite plan"
  - "fact preservation extraction"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4 changelog in the root README voice

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown release notes, `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` |
| **Framework** | system-spec-kit packet lifecycle and derived metadata |
| **Storage** | None |
| **Testing** | The wall census, `hvr_scan.py`, an extracted-token diff against `HEAD`, `validate.sh --strict` |

### Overview

The rewrite keeps every sentence's facts and changes only their shape: one idea per bullet with a bold label, as the root README's §8 does. Four counts the tree contradicts are corrected at the same time, each measured from its own source before the edit, and the two late-cycle arrivals gain a glance bullet so the summary surface stops lagging the story.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The census and the scanner pass on the rewritten file
- [x] Docs updated (spec/plan/tasks/summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Document rewrite under a frozen fact set, with the pre-edit copy held in git as the reference the extraction is diffed against.

### Key Components
- **The changelog**: the artifact, 611 lines across 18 sections
- **The wall census**: sentences over four or characters over 500, measured per paragraph
- **The HVR scan**: hard blockers and the semicolon convention that only `&nbsp;` entities may carry
- **The extraction**: backtick spans, seven-plus hex tokens and numerals, compared before and after

### Data Flow
The census and the scan fix the baseline, the rewrite and the four corrections land, then the same two gates plus the extraction diff prove the result. Nothing else reads the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the setup, implementation and verification tasks and their state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The verification is objective and runs from the repository root: the census counts walls, the scanner counts hard blockers, `rg` proves the remaining semicolons are entities, and a Python extraction diff proves no unenumerated fact moved. The two validation runs are the closure gate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The tree facts the corrections rest on: the hub inventory (skills holding both `hub-router.json` and `mode-registry.json`), `mcp-tooling/mode-registry.json`, and the compiled-routing activation cohort under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One commit holds the rewrite and the packet. `git revert <commit>` restores the previous changelog in full, and no other file's content depends on this change.
<!-- /ANCHOR:rollback -->

---
