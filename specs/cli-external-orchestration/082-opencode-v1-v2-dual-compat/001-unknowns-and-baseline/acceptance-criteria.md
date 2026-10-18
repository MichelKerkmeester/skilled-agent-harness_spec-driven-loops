---
title: "Acceptance Criteria: Phase 1: unknowns-and-baseline"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "unknowns and baseline acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-unknowns-and-baseline"
    last_updated_at: "2026-10-18T12:45:01Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-unknowns-and-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: unknowns-and-baseline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the eleven listed questions, When each is probed or desk checked, Then `findings.md` holds one verdict per question with its command and output excerpt | `grep -c '^### Q' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/findings.md` prints 11, and each `### Q` block names a verdict and a command Evidence: `grep -c '^### Q' findings.md` prints 11 (findings.md:19). Luna review of the captures: Q1 to Q11 supported after the orchestrator reran Q7 with the real zod output (scratch/q7z-marker.log) and narrowed Q1, Q2, Q3 and Q6. | Met | - |
| AC-002 | REQ-002 | Given the 16 repo plugins on each host, When the baseline runs, Then `baseline.json` lists all 16 with a v1 load state and a v2 load state | `node -p 'Object.keys(require("./specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/baseline.json").plugins).length'` prints 16, and each entry holds `v1` and `v2` Evidence: the node check prints 16. v1 loaded 16 by the harness (scratch/v1-harness.jsonl:1), v2 failed 16 on the worktree entries (scratch/v2-plugin-3.json). | Met | - |
| AC-003 | REQ-003 | Given the sk-vision source and its build script, When the build and the load check run, Then `findings.md` names the source path and the load result on each version, or records the bundle as blocked | `grep -n 'vision-runtime/src' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/findings.md` prints a line, and the Q11 block gives a v1 result and a v2 result Evidence: findings.md:202 names `vision-runtime/src`, the build exits 0 (scratch/sk-vision-build.txt), v1 loads it (scratch/v1-harness.jsonl:10) and v2 rejects it (scratch/v2-plugin-3.json). | Met | - |
| AC-004 | REQ-004 | Given the phase scope, When the phase ends, Then no file outside this child folder changed, except the gitignored sk-vision `dist/` folder | `git status --porcelain` compared with `scratch/status-before.txt` shows no new path outside the child folder Evidence: `comm -13 scratch/status-before.txt:1` against the final status shows no path from this phase outside the folder, apart from `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js`, a build artifact that is untracked on main too. The other new paths belong to phases 2 and 5. | Met | - |
| AC-005 | REQ-005 | Given the plugin and guard suites, When the baseline runs, Then `baseline.json` records the pass and fail counts of each suite | `node -p 'JSON.stringify(require("./specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/baseline.json").suites)'` prints a pass and a fail count for the plugin suite and the guard suite Evidence: baseline.json suites holds plugin 303 pass 0 fail, guard node 21 pass 0 fail and guard vitest 86 pass 0 fail (baseline.json:1, scratch/suite-plugin.txt, scratch/suite-guard-node.txt, scratch/suite-guard-vitest.txt). | Met | - |
| AC-006 | REQ-006 | Given the findings, When the phase closes, Then `findings.md` lists each decision change for the parent spec | `grep -n '^## Decision changes for the parent' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/findings.md` prints a line Evidence: findings.md:212 holds `## Decision changes for the parent` with nine items. | Met | - |

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

### Row sources and evidence

AC-001 to AC-004 come from the Acceptance list in the phase brief. AC-005 comes from the brief's Outputs. AC-006 comes from the brief's hand-off to phase 2.

The template has no separate evidence column. The Verification column names the check, and it takes the observed evidence once the check runs. Each row stays `Unmet` until that evidence sits in its Verification cell.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Every row is `Unmet`. The phase closes only after its probes run and their evidence sits in the Verification column. AC-004 allows one exception, the gitignored sk-vision `dist/` folder, which the parent goal log asks the phase to build. The orchestrator confirms that exception before closure.
<!-- /ANCHOR:closure -->
