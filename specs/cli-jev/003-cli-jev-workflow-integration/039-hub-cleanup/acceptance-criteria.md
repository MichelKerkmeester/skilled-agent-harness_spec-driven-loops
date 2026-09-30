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
    last_updated_at: "2026-09-30T16:40:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the acceptance criteria as a Planned phase, all five rows open"
    next_safe_action: "Build the phase, then mark each row from its evidence"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-039-hub-cleanup"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Planned
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command and the expected output, then the authoring baseline where one was read. Nothing is built yet, so every row is open and no row carries observed evidence. `C` is `.skilled/skills/cli-classifier/` and `H` is `C/cli-jev/`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `C/cli-usage/` and the routing entries that name it, When the folder is renamed to `H` and `cli-usage` stays an alias, Then `H/SKILL.md` exists, `cli-usage/` does not, and a `cli-usage` prompt still routes to mode `cli-jev` | The routing replay the design pass fixes for a prompt that names `cli-usage`, plus `test -f H/SKILL.md` and `test ! -d C/cli-usage`. Expected: the replay answers workflowMode `cli-jev`, and both file checks exit 0. Baseline: `mode-registry.json` lines 60-61 and 76 map workflowMode `cli-jev` to packet folder `cli-usage` today. Not yet run, nothing is built | Unmet | - |
| AC-002 | REQ-002 | Given the live references `refs.txt` lists, When each one is read and classified as a path or an alias, Then the path grep prints no `cli-classifier/cli-usage` hit outside `specs/` and benchmark reports | `rg -n 'cli-classifier/cli-usage' --glob '!specs/**' --glob '!**/benchmark/**'` over the repo. Expected: no output, exit 1. Baseline: the authoring grep printed 13 paths outside `specs/`, none under a `benchmark/` folder. The alias vocabulary in `mode-registry.json` and `hub-router.json` is not a hit, because the grep looks for the path string. Not yet run | Unmet | - |
| AC-003 | REQ-003 | Given the version fields in `C`, When each takes the design pass's continuation, Then the version grep finds no value at or above `1.0.0.0` | `rg -n` over `C` for version fields at or above `1.0.0.0`, with the exact pattern the design pass fixes. Expected: no output, exit 1. Baseline: the authoring grep found 71 such fields, with the hub at `1.2.0.0`, the Jev packet at `1.0.2.0` and cli-deem at `1.0.0.0`. Not yet run | Unmet | - |
| AC-004 | REQ-004 | Given the new `C/cli-deem/manual-testing-playbook/`, When its scenarios cover the health-check gate, each judgment type and the dormant path on stubs or a refused call, Then the playbook validator prints PASS | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook`. Expected: status PASS with 0 violations and exit 0, and no scenario needs a served model. Baseline: the authoring run exited 2 with `validate-playbook-package: package does not resolve to a manual-testing-playbook root: .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook`. Not yet run | Unmet | - |
| AC-005 | REQ-005, REQ-007 | Given the regenerated artifacts and the final tree, When the four artifact gates and the phase validator run, Then each gate passes and `validate.sh --strict` prints `RESULT: PASSED` | `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs .skilled/skills/cli-classifier` and `sync-skills-hermes.cjs --check`, then `validate.sh specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup --strict`. Expected: each gate prints its own PASS line or exits 0, the Hermes gate prints `PASS: 72 Hermes skill copies in sync`, and `validate.sh` prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`. Baseline: the Hermes gate prints that PASS line today (context.md). The other three gates are not yet run from a renamed tree | Unmet | - |

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

**Closeable:** No

This phase is Planned. All five rows are open because the rename, the version sweep and the Deem playbook do not exist yet, and each row closes only when the build's own recordings satisfy it.
<!-- /ANCHOR:closure -->

---
