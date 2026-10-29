---
title: "Acceptance Criteria: Phase 15: routing-data-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "routing data alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/015-routing-data-alignment"
    last_updated_at: "2026-10-29T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion with the evidence that met it"
    next_safe_action: "Land the phase on main"
    blockers: []
    key_files:
      - "scratch/probes-after.txt"
      - "scratch/baseline-after.json"
      - "scratch/replay-after.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0276-routing-data-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: routing-data-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/072-skill-routing-and-clarity/015-routing-data-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the follow-up list, When each item is probed before and after, Then every item is fixed, refuted with its reason or left with its cause | `scratch/probes-before.txt:1` and `scratch/probes-after.txt:1` (78 rows), plus the per-item list at `implementation-summary.md:56` | Met | - |
| AC-002 | REQ-001 | Given the items left by the explainer floor and by signal narrowing, When the probe still misses, Then the decision record names the cause | ADR-001 at `decision-record.md:37` and ADR-003 at `decision-record.md:243` | Met | - |
| AC-003 | REQ-002 | Given the scorer baseline before the change, When it is captured after, Then full corpus, holdout and ambiguity top-1 read 155/195, 49/66 and 19/24 or higher | `scratch/baseline-after.json:14` reads 155/195, 49/66 and 19/24, the same as `scratch/baseline-before.json` | Met | - |
| AC-004 | REQ-003 | Given the replay before the change, When it runs after, Then each moved number is explained and no earlier row is worse | `scratch/replay-after.txt:8` prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`. The one new row is MT-011, and every other hub line is identical | Met | - |
| AC-005 | REQ-004 | Given each new stage-one signal, When its out-of-domain control runs, Then the signal's skill does not take it | `scratch/probes-after.txt:70` to `:77` print PASS on all eight `OOD-` rows | Met | - |
| AC-006 | REQ-005 | Given the edits, When the derived checks run, Then each reports fresh or in sync | `scratch/gates-after.txt:2`, `:4`, `:10` and `:13`: `compiled-route-guard.cjs` prints all hubs fresh with exit 0, `generate-router-intent-signals.cjs --check` prints `RESULT: PASSED`, `sync-skills-hermes.cjs --check` prints PASS and `skill-graph-freshness.cjs` prints `SIGNAL DRIFT compiled vs disk: none` | Met | - |
| AC-007 | REQ-006 | Given the touched skills and hubs, When the package and hub gates run, Then each passes | `scratch/gates-after.txt:14` to `:25`: `package_skill.py --check --strict` prints `Result: PASS` on nine skills and `parent-skill-check.cjs` prints `OK` on mcp-tooling, sk-design and system-deep-loop | Met | - |
| AC-008 | REQ-007 | Given the advisor and router suites, When they run, Then none fails | `scratch/vitest-advisor.txt:6` prints `431 passed`, `scratch/node-test-sk-create-skill.txt:115` prints `pass 90`, `scratch/node-test-compiled-route.txt:200` prints `pass 95` and `scratch/vitest-bin-compiled.txt:8` prints `46 passed` | Met | - |
| AC-009 | REQ-007 | Given the sk-code SA-001 battery, When it runs after the change, Then positive accuracy is at least 10 of 12 and no negative is taken | `scratch/sa001-after.txt:18` prints `positive=12/12` and `negative_fp=0/5` | Met | - |
| AC-010 | REQ-008 | Given each touched skill or mode, When its newest changelog entry is read, Then it carries one bullet for this change and validates | `scratch/gates-after.txt:29` to `:37`: nine entries, each `validate_document.py` `Total issues: 0` | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met from the final state of the worktree.
<!-- /ANCHOR:closure -->
