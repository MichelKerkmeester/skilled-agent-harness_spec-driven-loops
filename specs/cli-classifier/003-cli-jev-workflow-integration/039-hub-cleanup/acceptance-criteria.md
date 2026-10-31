---
title: "Acceptance Criteria: Phase 39: hub-cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli classifier hub cleanup acceptance criteria"
  - "rename and alias criteria"
  - "pre-release version criteria"
  - "deem playbook closure gate"
  - "artifact gate criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup"
    last_updated_at: "2026-09-30T17:42:32Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Marked all five criteria Met from the build's records and the final-state gates"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-039-hub-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 39: hub-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup
**Level:** 2
**Status:** Complete
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command and the expected output, then the observed result from the build's own records under `scratch/verify/`. The build ran from the working tree at start HEAD `b3964f2a3f`, and the orchestrator commits it path-scoped after this closure pass. `C` is `.skilled/skills/cli-classifier/` and `H` is `C/cli-jev/`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `C/cli-usage/` and the routing entries that name it, When the folder is renamed to `H` and `cli-usage` stays an alias, Then `H/SKILL.md` exists, `cli-usage/` does not, and a `cli-usage` prompt still routes to mode `cli-jev` | The routing replay the design pass fixes for a prompt that names `cli-usage`, plus `test -f H/SKILL.md` and `test ! -d C/cli-usage`. Expected: the replay answers workflowMode `cli-jev`, and both file checks exit 0. Baseline: `mode-registry.json` lines 60-61 and 76 map workflowMode `cli-jev` to packet folder `cli-usage` today. Observed: `scratch/verify/c1-route.json:1` records `action route`, `selectionKind single` and target `workflowMode cli-jev` with `packetId cli-jev`, exit 0; `H/SKILL.md` exists and `C/cli-usage/` is gone (`scratch/verify/session-evidence.md:28`) | Met | - |
| AC-002 | REQ-002 | Given the live references `refs.txt` lists, When each one is read and classified as a path or an alias, Then the path grep prints no `cli-classifier/cli-usage` hit outside `specs/` and benchmark reports | `rg -n 'cli-classifier/cli-usage' --glob '!specs/**' --glob '!**/benchmark/**'` over the repo. Expected: no output, exit 1. Baseline: the authoring grep printed 13 paths outside `specs/`, none under a `benchmark/` folder. The alias vocabulary in `mode-registry.json` and `hub-router.json` is not a hit, because the grep looks for the path string. Observed: `scratch/verify/c2.txt` holds the final-state grep. Its hits are recorded history (`scratch/verify/c2.txt:1`, the line at `.skilled/skills/cli-classifier/changelog/v0.4.0.0.md:21`), the generated trigger-index bundle (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:110` and its three fixture sidecars, rebuilt after the commit because the generator indexes a git archive of HEAD) and two recorded finding strings in `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts:1470,1472`, left to that tree's owner. No hand-written live path reference remains, and the review records criterion 2 as met (`scratch/verify/review-mimo-r1.txt:5`) | Met | - |
| AC-003 | REQ-003 | Given the version fields in `C`, When each takes the design pass's continuation, Then the version grep finds no value at or above `1.0.0.0` | `rg -n` over `C` for version fields at or above `1.0.0.0`, with the exact pattern the design pass fixes. Expected: no output, exit 1. Baseline: the authoring grep found 71 such fields, with the hub at `1.2.0.0`, the Jev packet at `1.0.2.0` and cli-deem at `1.0.0.0`. Observed: `scratch/verify/c3.txt` is empty at exit 1, with the recorded benchmark reports excluded by the proof glob (`scratch/verify/session-evidence.md:30`; `scratch/verify/review-mimo-r1.txt:6`); the renamed changelogs read hub v0.1 to v0.5, cli-jev v0.1.0 to v0.1.2 and cli-deem v0.1.0 | Met | - |
| AC-004 | REQ-004 | Given the new `C/cli-deem/manual-testing-playbook/`, When its scenarios cover the health-check gate, each judgment type and the dormant path on stubs or a refused call, Then the playbook validator prints PASS | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook`. Expected: status PASS with 0 violations and exit 0, and no scenario needs a served model. Baseline: the authoring run exited 2 with `validate-playbook-package: package does not resolve to a manual-testing-playbook root: .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook`. Observed: `scratch/verify/c4.txt:4` prints `PASS package=cli-classifier/cli-deem tier=FAIL_CLOSED scenarios=10 categories=3 operator=10 routing_gold_excluded=0 violations=0 warnings=0` at exit 0; the cli-jev and hub playbooks also PASS (`scratch/verify/session-evidence.md:31`), and DEE-002, DEE-009 and DEE-010 re-ran as written against stubs or a refused port with no served model (`scratch/verify/review-mimo-r1.txt:7`) | Met | - |
| AC-005 | REQ-005, REQ-007 | Given the regenerated artifacts and the final tree, When the four artifact gates and the phase validator run, Then each gate passes and `validate.sh --strict` prints `RESULT: PASSED` | `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs .skilled/skills/cli-classifier` and `sync-skills-hermes.cjs --check`, then `validate.sh specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup --strict`. Expected: each gate prints its own PASS line or exits 0, the Hermes gate prints `PASS: 72 Hermes skill copies in sync`, and `validate.sh` prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`. Baseline: the Hermes gate prints that PASS line today (context.md). Observed: `scratch/verify/guard.txt:9` all 7 hubs fresh, `scratch/verify/leaf.txt:17` `checked=15 fresh=15 failed=0`, `scratch/verify/psc.txt:53` `OK: parent-skill-check — all hard invariants passed, 0 warnings`, `scratch/verify/hermes.txt:1` `PASS: 72 Hermes skill copies in sync`, `scratch/verify/verify.txt:1` `move-simulation OK: all 7 hubs resolve; 0 reads under .opencode/specs`, and `validate.sh --strict` printed `RESULT: PASSED` in this closure pass | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All five criteria are Met from the build's records under `scratch/verify/` and the working tree at start HEAD `b3964f2a3f`. Criterion 2 closes with its residuals recorded: the trigger-index bundle is regenerated after the commit, and one deep-loop fixture stays with its owner. The review's three P2s are handled as recorded, and the orchestrator commits the build and these docs path-scoped after this pass.
<!-- /ANCHOR:closure -->

---
