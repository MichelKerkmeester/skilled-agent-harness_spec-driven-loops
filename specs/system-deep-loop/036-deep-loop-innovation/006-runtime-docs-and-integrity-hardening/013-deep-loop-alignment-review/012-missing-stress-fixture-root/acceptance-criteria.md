---
title: "Acceptance Criteria: Phase 12: missing-stress-fixture-root"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: missing-stress-fixture-root

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/012-missing-stress-fixture-root
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fixture root the four files name, When it is listed, Then the canonical target exists in all six current runtime tree shapes and the two symlink mirrors resolve onto the `.claude` file | `find` lists 1 README + 4 regular agents + 2 links; `readlink` returns `../../.claude/agents/cp-improve-target.md` and `../../../.claude/agents/cp-improve-target.md`; `head` through each link prints the mirror | Met | - |
| AC-002 | REQ-002 | Given the corrected script, When it is invoked exactly as the scenarios invoke it, Then it exits 0 and prints the created-sandbox message | `setup-cp-sandbox.sh --sandbox-dir /tmp/cp-direct-sandbox` → `Created deep-improvement sandbox at /tmp/cp-direct-sandbox`, exit 0 | Met | - |
| AC-003 | REQ-002 | Given a sandbox built by the script alone, When the scenarios' pre-dispatch helper steps run from it, Then both exit 0 and produce their reports against the restored target | `scan-integration.cjs` → `"mirrorSyncStatus":"all-aligned"`, exit 0; `generate-profile.cjs` → `"id":"cp-improve-target"`, exit 0 | Met | - |
| AC-004 | REQ-002 | Given an absent required surface, When the script runs, Then it fails closed with the path named | Baseline run: `ERROR: required path not found: .../.opencode/.opencode/commands/deep`, exit 1; the repo-root walk was one level shallow | Met | - |
| AC-005 | REQ-003 | Given the restored fixture, When the roster and mirror gates run, Then they see only the shipped roster and no fixture agent | `agent-roster-mirror-check.cjs` → `STATUS=OK`, 12/12 per runtime, exit 0; `check-agent-mirror-sync.cjs --all` → `12 agent(s) checked`, exit 0; `sync-agents.cjs --check` and `sync-agents-pi.cjs --check` → `PASS: 12 agents are in sync` | Met | - |
| AC-006 | REQ-003 | Given a nested fixture agent path, When the pre-commit staged-path filter is applied, Then it does not match, while a top-level agent path does | `grep -E '^\.(opencode\|claude)/agents/'`: fixture path 0 matches, top-level path 1 match | Met | - |
| AC-007 | REQ-001 | Given the restore and script repair, When the deep-loop runtime suite runs, Then it exits zero with no failure to attribute | `npx vitest run --no-coverage` in `runtime/`: 154 files passed, 2678 passed, 8 skipped, duration 1215s, exit 0 | Met | - |

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

AC-002 and AC-003 carried this packet. A restore that satisfies the path guard but leaves the
scenario's own helper steps failing on module resolution would only move the wall; the criterion
is a sandbox built by the script alone running the scanner and profiler. AC-005 and AC-006 answer
the standing question about fixture agents: nested trees are outside every discovery surface, and
that is demonstrated rather than argued.

Two decisions are recorded rather than built. The retired `.gemini` mirror is dropped and the
superseded `benchmark/sentinel.js` is not restored, because the current tree shapes and the current
benchmark-boundary scenario do not consume them. And no model-dispatched Call A / Call B run was
executed here: the sandbox and its helper steps are what this packet proves, while the dispatches
remain the scenario operator's run.
<!-- /ANCHOR:closure -->
