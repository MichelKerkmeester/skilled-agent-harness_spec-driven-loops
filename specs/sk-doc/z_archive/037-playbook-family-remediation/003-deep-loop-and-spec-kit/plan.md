---
title: "Plan: deep-loop and spec-kit playbook remediation"
description: "Classify each large count as many defects or one before editing, transform the single-cause classes at their source, and re-measure per root across the agent relaunches."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "deep-loop and spec-kit playbook remediation plan"
  - "single-cause violation class plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/003-deep-loop-and-spec-kit"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Classified the large counts, transformed the single-cause classes, re-measured"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook"
      - ".opencode/skills/system-deep-loop/runtime/manual-testing-playbook"
      - ".opencode/skills/sk-git/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:3389215322ac5455871cca3868eca7dfa920ba2d59e60fde5e2e251e837f6e5c"
      session_id: "2026-08-29-sk-code-031-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: deep-loop and spec-kit playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`system-spec-kit` is the fleet's largest playbook root at 422 scenarios across 26 categories, with 20 scenarios routing-gold excluded and 402 under the operator contract. The `system-deep-loop` family is a parent with a `compiled-routing/` routing-gold exclusion plus four mode packets, each with its own root. `sk-git` and `sk-doc/sk-create-diff` are standalone roots. All are tier `FAIL_CLOSED`, so `FORBIDDEN_VERDICT` rejects `PARTIAL`, `READY`, `UNAUTOMATABLE`, and `BLOCKED`, and a `SKIP` must record a blocker.

### Overview

Before editing anything, classify each root's violations by class and decide whether the count represents many independent defects or one repeated decision. Where it is one, repair the decision at its source and let the count follow. Where the repair is a bulk transform, review the transform rather than its exit code, and handle any residual case explicitly rather than forcing it into the same shape.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Starting counts measured per root: `system-spec-kit` 918, `runtime` 473, `deep-review` 173, `deep-research` 165, `deep-improvement` 123, `sk-git` 89, the `system-deep-loop` parent 79, `sk-doc/sk-create-diff` 1.
- The routing-gold exclusions inside `system-spec-kit` and the deep-loop parent are known and recorded before the work, so a later change to them would be visible.

### Definition of Done

- All eight roots report `violations=0` at `tier=FAIL_CLOSED` under their own runs.
- The underscored section token is gone from `runtime`'s tree.
- `sk-git` uses no forbidden verdict, records a blocker for every `SKIP`, and its scenario table columns align.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Classify before repairing. A violation count is not a work estimate; it is a symptom whose shape has to be read first. Two of the largest counts in this phase reduce to one decision each, so the correct unit of work is the decision, and the count is the confirmation that the decision was read correctly.

### Key Components

- The section vocabulary in `system-deep-loop/runtime`: 54 scenarios generated against an older form that wrote `SOURCE_METADATA` with an underscore, which is precisely why the required-section regex never matched. One reviewed transform covers 472 of the 473.
- The shared boilerplate line in `sk-git`: one line repeated across 82 scenarios, carrying both a `PARTIAL` verdict the tier forbids and a `SKIP` with no blocker.
- The misaligned `sk-git` scenario table: a stray `||` shifted the columns so the grader read command text as Evidence. It graded green while reading the wrong cell, which makes its prior pass meaningless rather than merely lucky.

### Data Flow

Per-root measurement to establish counts, then violation-class analysis per root, then repair at the class source — vocabulary transform for `runtime`, single boilerplate correction for `sk-git`, per-class work for the rest — then per-root measurement again to confirm `violations=0` with routing-gold exclusion counts unchanged.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Measure all eight roots individually. Record each starting count and each root's routing-gold exclusion count, so a later reclassification would be detectable in the after-run.

### Phase 2: Core Implementation

Repair each root by violation class. Apply the reviewed vocabulary transform across `runtime`'s 54 scenarios and handle the one residual case by hand. Correct `sk-git`'s shared boilerplate line once and repair the misaligned scenario table. Work `system-spec-kit`'s 402 operator scenarios class by class.

### Phase 3: Verification

Re-run `--package <root> --strict` on all eight roots and read each census line. Confirm the underscored section token is absent from `runtime`'s tree, and confirm the routing-gold exclusion counts on `system-spec-kit` and the deep-loop parent are unchanged.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `validate-playbook-package.cjs --package <root> --strict` per root, before and after, reading the full census line rather than the exit code. Controlled: a recursive search for the underscored `SOURCE_METADATA` token across `system-deep-loop/runtime/manual-testing-playbook/` is the source-level control on the vocabulary transform — it must return no files after the work, which proves the class was cleared at the vocabulary rather than suppressed per scenario. The unchanged `routing_gold_excluded` values on `system-spec-kit` and the deep-loop parent are the control against clearing a count by moving scenarios out of the operator contract.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and its `playbook-corpus-manifest.json`.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Documentation-only and fully reversible: reverting the eight roots' `manual-testing-playbook/` trees restores their prior contents and counts. The `runtime` vocabulary transform is the largest single change and is reversible with the rest of that root's tree. No manifest entry was added or removed by this phase.

<!-- /ANCHOR:rollback -->
