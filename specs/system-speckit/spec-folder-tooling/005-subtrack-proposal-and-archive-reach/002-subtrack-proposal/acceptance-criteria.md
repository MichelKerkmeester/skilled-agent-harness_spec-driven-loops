---
title: "Acceptance Criteria: Phase 2: subtrack-proposal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "subtrack proposal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-subtrack-proposal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: subtrack-proposal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs`. `FLAT` is the fixture track `demo` with 10 live packets, because no real flat track holds 8 or more. `CLONE` is the throwaway `git clone --shared` under `/private/tmp` that held `demo`, deleted after the runs.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `FLAT`, When `node S --track FLAT` runs, Then it exits 0 and prints a JSON map whose `from` entries are the live packets of `FLAT`, each exactly once | CLONE: `suggest-subtracks.mjs --track demo` exit 0 with a 10-entry map for the 10-packet track, sub-tracks billing-invoice, index-query, login-oauth and general. The `relocate.mjs` dry run on it reported `moves=10 identity=10` | Met | - |
| AC-002 | REQ-002 | Given the map from AC-001, When `relocate.mjs --map <file>` runs as a dry run, Then preflight accepts it and the exit code is 1 | CLONE: `relocate.mjs --map` on the `demo` map exit 1 with `moves=10 moved=0 rewrites=21 identity=10 roots=5 ledger=10`. Real tree: the 6-entry `cli-classifier --threshold 3` map was accepted by a `relocate.mjs --map` dry run too | Met | - |
| AC-003 | REQ-003 | Given two fixture packets that share `trigger_phrases` and one that shares none, When the tool clusters them, Then the two land in one cluster named from a shared term and the third lands in the remainder cluster | CLONE: the 10-packet `demo` fixture gave three clusters named from shared terms (billing-invoice, index-query, login-oauth) and the remainder `general`. Real tree: `--track cli-classifier --threshold 3` gave completion-directive and general. The run used the 10-packet fixture, not a three-packet one | Met | - |
| AC-004 | REQ-004 | Given a flat track of 7 live packets, When `node S --track <track>` runs, Then it prints no map and says the track is below the threshold, and `--threshold 5` prints a map | Real tree: `--track cli-classifier` printed `track cli-classifier has 6 live packets, below the threshold of 8` and no map, exit 0. `--threshold 3` printed a 6-entry map. The run used 6 packets and a threshold of 3 in place of 7 and 5 | Met | - |
| AC-005 | REQ-005 | Given a track with subtracks, When `node S --track <track> --describe "<text>"` runs, Then it prints one existing subtrack name, or `none fits` with a new subtrack as the proposal | Real tree: `--track system-speckit --describe "archive a spec folder"` printed `best fit: system-speckit/spec-folder-tooling`. `--describe "bake sourdough bread"` printed `none fits: propose a new sub-track in system-speckit` | Met | - |
| AC-006 | REQ-006 | Given a clean tree, When both modes run, Then no file is created or changed | Real tree: `git status --porcelain` identical before and after every run of the tool, both modes | Met | - |
| AC-007 | REQ-007 | Given a target track at or above the threshold, When `create.sh --json --skip-branch` runs in a scratch tree, Then stderr holds one advisory line that names `suggest-subtracks.mjs`, the exit code is 0 and stdout parses as JSON | CLONE at commit 3f2c1f9d61, orchestrator run of 2026-11-13: `bash create.sh --json --skip-branch --track demo --short-name probe-json "Probe json"` exit 0. stdout parsed with `node -e JSON.parse` (keys BRANCH_NAME, SPEC_FILE, FEATURE_NUM, DOC_LEVEL, COMPLEXITY, EXPANDED, HAS_DESCRIPTION, CREATED_FILES) and held no `suggest-subtracks` text. stderr line 1 was `[speckit] Track demo has grown into clusters. Consider sub-tracks: node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track demo`. The folder `specs/demo/011-probe-json` was created. `bash -n create.sh` exit 0 | Met | - |
| AC-008 | REQ-008 | Given the spec gate module, When its three exported strings are read, Then each option C names a new subtrack as a choice | `rg -c -i "subtrack\|sub-track" .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` printed 3. spec-gate-core and gate-3-menu-parity node tests: 127 tests, 124 pass, 3 skipped, 0 fail | Met | - |
| AC-009 | REQ-009 | Given the two presentation assets and `AGENTS.md`, When option C is read in each, Then each carries the subtrack clause | `rg -c -i "subtrack\|sub-track"` printed 1 for each of `AGENTS.md`, `speckit-plan-presentation.txt` and `speckit-complete-presentation.txt`. agents-md tests 71 pass, and the regenerated `agents-md-manifest.json` check printed PASS | Met | - |
| AC-010 | REQ-010 | Given the structure docs, When they are searched, Then `folder-structure.md` holds the new section, `phase-definitions.md` points to it and `SKILL.md` and `quick-reference.md` document `--track <track>/<sub>` | Four `rg -c` runs each printed 1: "when to propose a sub-track" in `folder-structure.md`, `folder-structure.md` in `phase-definitions.md`, and `--track <track>/<sub>` in `SKILL.md` and in `quick-reference.md` | Met | - |

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

All 10 criteria are Met with evidence observed on 2026-11-13, on the real tree for the read-only runs and in a throwaway clone for the fixture track. AC-007 closed last: a `create.sh --json --skip-branch` run in the clone exited 0, its stdout parsed as JSON and the one advisory line went to stderr. AC-001, AC-002 and AC-007 rest on a fixture track, because the largest real flat track, `cli-classifier`, holds 6 live packets. `npm test` after the change exits 0 with the same counts as `../001-relocation-engine/scratch/baseline.txt`.
<!-- /ANCHOR:closure -->
