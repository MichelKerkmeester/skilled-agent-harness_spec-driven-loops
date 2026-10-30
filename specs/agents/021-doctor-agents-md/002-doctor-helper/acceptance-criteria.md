---
title: "Acceptance Criteria: /doctor:helper"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor helper acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/002-doctor-helper"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria, then mark each one Met with its command output"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: /doctor:helper

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/002-doctor-helper`
**Level:** 2
**Status:** Draft
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a described pre-commit problem, When the matcher runs, Then its first candidate is the git hooks route | `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "my pre-commit hook keeps rejecting my commit"` exits 0 and its first candidate line starts `1) /doctor:git hooks` | Unmet | - |
| AC-002 | REQ-002 | Given an inactive bridge's problem wording, When the matcher runs with `--json`, Then the first candidate is that route and its class reads `read-only` | `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json -- "is this skill in the skilled format"` exits 0 with `candidates[0].runnable == "/doctor:sk-skill"` | Unmet | - |
| AC-003 | REQ-003 | Given a problem no route matches, When the matcher runs, Then it exits 1 and names the setup fallback | `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "write me a poem about cats"` exits 1 with last line `STATUS=NO_MATCH FALLBACK=/doctor:setup` | Unmet | - |
| AC-004 | REQ-004 | Given `--table --json`, When it runs, Then no runnable is the helper itself and no output byte carries a local-only name | `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --table --json` exits 0 and `grep -c 'local-'` prints `0` | Unmet | - |
| AC-005 | REQ-005 | Given the frozen held-out set, When the suite runs, Then top-1 is at least 0.80, top-3 at least 0.90 and negatives at least 0.90, with the sha256 unchanged | `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` prints the three figures and reports `fail 0` | Unmet | - |
| AC-006 | REQ-006 | Given every doctor router, When the contract suite runs, Then each owns at least one helper entry and every phrase self-recalls top-1 | `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` reports `fail 0` | Unmet | - |
| AC-007 | REQ-007 | Given the generated bridge file, When the helper's entries are compared, Then ids and runnables match plus only the standalone action extras | the contract suite's derivation-parity case passes | Unmet | - |
| AC-008 | REQ-008 | Given the route manifest, When the validator runs, Then the summary names the re-measured route count and command count | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 | Unmet | - |
| AC-009 | REQ-008 | Given the setup presentation, When its target list is read, Then the helper appears exactly once | `rg -c 'helper' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints `1` | Unmet | - |
| AC-010 | REQ-009 | Given a completed generation run, When the deriver runs again, Then it prints `"status": "fresh"` with the re-measured `doctorRoutes` count | `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"` | Unmet | - |
| AC-011 | REQ-009 | Given the mirrors and the three prompt stub sets, When each `--check` runs, Then each exits 0 at the re-measured count | the mirror sync and the three prompt syncs exit 0 | Unmet | - |
| AC-012 | REQ-010 | Given the bridge decision, When the activation list is read, Then the helper bridge is active with all four checks passing, or inactive with its reason recorded | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 and the recorded decision matches the activation list | Unmet | - |
| AC-013 | REQ-011 | Given the command contract, When the router generator checks, Then it reports zero path drift | `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` prints zero path drift and zero shape drift | Unmet | - |
| AC-014 | REQ-011 | Given the root README, When the doctor count is read, Then it equals the router count and names the missing sibling entry | the number in the doctor section equals `ls .skilled/commands/doctor/*.md \| wc -l` | Unmet | - |
| AC-015 | REQ-009 | Given the family runner, When it runs, Then every suite passes | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed` | Unmet | - |
| AC-016 | REQ-012 | Given a bad argument or an unreadable manifest, When the matcher runs, Then it exits 2; given a match, Then it exits 0; given no candidate above the floor, Then it exits 1 | the suite's three exit-code cases pass | Unmet | - |
| AC-017 | REQ-009 | Given the advisor runtime, When its doctor suites run, Then they pass with no failure | the five named vitest files pass with zero failures | Unmet | - |
| AC-018 | REQ-004 | Given the final tree, When the change list is read, Then it names no file outside the spec's file list and no local-only path | `git status --porcelain` names no unexplained path | Unmet | - |

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

AC-001 through AC-018 are unmet: the packet is specified and not started.
<!-- /ANCHOR:closure -->
