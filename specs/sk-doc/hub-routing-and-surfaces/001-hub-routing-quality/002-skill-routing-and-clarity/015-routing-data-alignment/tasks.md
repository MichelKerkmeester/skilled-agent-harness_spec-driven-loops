---
title: "Tasks: Phase 15: routing-data-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "routing data alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: routing-data-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `scratch/` in this packet. `PR` is `node S/probe.cjs`, which runs the probes in `S/probes.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase child and add its parent map row, and set the 014 Successor (`../spec.md`, `../014-skill-router-files/spec.md`). Verify: `grep -n 015-routing ../spec.md` prints the row and the handoff line.
- [x] T002 Capture the scorer and replay before any edit (`S/baseline-before.json`, `S/replay-before.txt`). Verify: the replay prints `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` and the scorer prints 155/195, 49/66 and 19/24.
- [x] T003 Write one probe per item plus controls and run them (`S/probes.json`, `S/probes-before.txt`). Verify: the fixed items' probes print FAIL before the change.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Drop "screen examples" from Mobbin scoring and "extract design.md" from Figma scoring (`.skilled/skills/mcp-tooling/`). Verify: PR prints PASS for MT-D01 and MT-D08.
- [x] T005 Let a chart or diagram request that names a DESIGN.md reach its theming branch (`.skilled/skills/sk-design/hub-router.json`, `ROUTER.md`, `mode-registry.json`, `SKILL.md`). Verify: PR prints `route:sk-design-diagram` for SD-D01a.
- [x] T006 Add the `DESIGN_MD_THEME` intent (`sk-design-diagram/ROUTER.md`, `references/foundations/router-pseudocode.md`). Verify: `rg -c design-md-theming sk-design-diagram/ROUTER.md` prints 3.
- [x] T007 Carry eleven router phrases into the deep-loop mode classes (`.skilled/skills/system-deep-loop/hub-router.json`). Verify: PR prints PASS for DL-D10a to DL-D10f.
- [x] T008 Read `NO_LOAD_INTENTS` before loading and drop the prose RAW keyword (`.skilled/skills/sk-prompt/ROUTER.md`). Verify: `S/sk-prompt-router-after.txt` shows `level=RAW resources=[]` for both `$raw` prompts.
- [x] T009 [P] Add narrow stage-one signals (`graph-metadata.json` of cli-orca, sk-git, sk-prompt, system-skill-advisor, system-spec-kit). Verify: PR prints PASS for CO-A05, SG-D1, SP-D03, SK-D05b and SK-D04a, and every OOD control passes.
- [x] T010 Add MT-011 notion gold and correct MT-004 (`.skilled/skills/mcp-tooling/manual-testing-playbook/`). Verify: `compiled-route-admission.cjs --hub mcp-tooling` prints 16 pass and no uncovered mode.
- [x] T011 Regenerate the derived files. Verify: `compiled-route-guard.cjs` prints all hubs fresh, `sync-skills-hermes.cjs --check` prints PASS and `skill-graph-freshness.cjs` prints no drift.
- [x] T012 Add one bullet to each touched skill's newest changelog entry (nine `changelog/` files). Verify: `validate_document.py` prints `Total issues: 0` on each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Capture the scorer and replay after the change (`S/baseline-after.json`, `S/replay-after.txt`). Verify: 155/195, 49/66 and 19/24, and `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`.
- [x] T014 Rerun every probe from the final state (`S/probes-after.txt`). Verify: 68 of 78 rows print no FAIL, and each of the ten rows with a FAIL is an item left or refuted in `decision-record.md`.
- [x] T015 Run the skill and hub gates. Verify: `package_skill.py --check --strict` prints `Result: PASS` on nine skills and `parent-skill-check.cjs` prints OK on three hubs.
- [x] T016 Run the suites and the SA-001 battery. Verify: vitest prints 431 passed, `node --test` prints 90 and 95 passed, and SA-001 prints 12/12 and 0/5.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed, with the probe, scorer and replay captures in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

An item that a probe cannot fix through routing data is left with its cause named, and does not count as a blocked task.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The before captures exist: `ls S/baseline-before.json S/replay-before.txt S/probes-before.txt` lists all three
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `ci-hub-vocabulary-source.cjs` prints `drift=0` and `RESULT: PASSED`
- [x] CHK-011 [P0] `generate-router-intent-signals.cjs --check` prints `missing=0` and `RESULT: PASSED`
- [x] CHK-012 [P1] `ci-router-vocabulary-reach.cjs` prints `wrong-hub=0, outranked=0, no-reach=0` and `RESULT: PASSED`
- [x] CHK-013 [P1] Every JSON edit keeps the file's own serialization, shown by a diff of only the changed entries
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each fixed item's probe failed before and passes after (`S/probes-before.txt`, `S/probes-after.txt`)
- [x] CHK-022 [P1] Each new stage-one signal has an out-of-domain control that it does not take
- [x] CHK-023 [P1] The scorer holds at 155/195, 49/66 and 19/24
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable item has a class. The two mcp-tooling aliases and the sk-design weights are `cross-consumer`, because stage one and stage two disagreed. The deep-loop phrases are `class-of-bug`, so all eleven stage-two-reverse terms moved, not only the three named. The NO_LOAD wiring is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "screen examples|extract design.md"` listed every copy before the edit, and `ci-hub-vocabulary-source.cjs` lists the deep-loop stage-two-reverse terms, 11 before and 0 after.
- [x] CHK-FIX-003 [P0] Consumer inventory: the scorer corpus, the replay gold, the admission gold and the admission live-gold pin. Each is captured or updated.
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix: 78 probes, two stages per hub item, one out-of-domain control per new signal.
- [x] CHK-FIX-006 [P1] N/A. No test reads process-wide state that this change sets.
- [x] CHK-FIX-007 [P1] Evidence is pinned to base `c82a9aaa57` and the working tree in `worktrees/276-routing-data-alignment`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A. No credential, secret or permission changes.
- [x] CHK-031 [P0] N/A. No input boundary changes.
- [x] CHK-032 [P1] N/A. No auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] No code comment names an ephemeral id. The one new comment in `sk-prompt/ROUTER.md` states why the no-load test reads both the prefix and the token.
- [x] CHK-042 [P2] The mcp-tooling playbook index and the diagram feature catalog describe the new routes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the probe tools and the before and after evidence the docs cite
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
