---
title: "Acceptance Criteria: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "read only and research bookkeeping acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/004-read-only-and-research-bookkeeping"
    last_updated_at: "2026-10-03T05:27:39Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-read-only-and-research-bookkeeping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/038-review-and-cli-lineage/004-read-only-and-research-bookkeeping
**Level:** 2
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a scratch coverage database directory with no database file, When status, query and convergence run with the read-only flag, Then each returns an empty result and the directory is still absent; given a present database, the same calls write no observability event and no snapshot | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/graph-read-only.vitest.ts`; probe `DEEP_LOOP_COVERAGE_DB_DIR=<tmp>/absent node scripts/status.cjs --spec-folder specs/system-deep-loop/038-review-and-cli-lineage/004-read-only-and-research-bookkeeping --loop-type context --session-id probe --read-only` then `test ! -e <tmp>/absent` Evidence: `graph-read-only.vitest.ts` 4/4: absent dirs stay absent for status, query and convergence (research and council); a present database directory is byte-identical by sha256 listing after all three read-only calls with `--persist-snapshot`; older schema row unchanged. Probe `DEEP_LOOP_COVERAGE_DB_DIR=<tmp>/absent node scripts/status.cjs ... --read-only` returned `status ok`, `databasePresent:false`, exit 0, then `test ! -e` exit 0. Read-only status, query and convergence against the repository database left `database/` checksums and listing identical. | Met | - |
| AC-002 | REQ-002 | Given the doctor deep-loop route, When each status, query and convergence invocation runs, Then the invocation carries the read-only flag and the workflow contract names no database creation or observability append | `rg -n -- '--read-only' .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-deep-loop.yaml`; `bash .skilled/commands/doctor/scripts/route-validate.sh` Evidence: `doctor-deep-loop.yaml` passes `--read-only` on every status, query and convergence call and no longer names database creation or observability appends; `route-validate.sh` exit 0 (9 routes, 2 informational warnings). Handoff sweep: `.skilled/commands/doctor/_routes.yaml` lines 57-59 now pass `--read-only` on status, query and convergence (convergence no longer passes `--persist-snapshot false`); the `rg` lists the three route invocations plus the workflow's; `route-validate.sh` exit 0, 9 routes, 2 informational warnings. | Met | - |
| AC-003 | REQ-003 | Given a fresh temp packet, When the shipped init step from each deep-research workflow runs, Then the gateway exits 0 and the ledger's first frame receipt is the run-initialized event, and the stem census lists that stem as spoken | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-run-open.vitest.ts`; `node scripts/check-ledger-stem-producers.cjs` Evidence: `deep-research-run-open.vitest.ts` 3/3: the shipped init step of both workflows exits 0, frame 1 receipt is `deep-research.ledger.run-initialized` sequence 1, the state log opens with a `config` row and a later iteration append exits 0; the direct-write control exits 2. `check-ledger-stem-producers.cjs` exit 0 with the stem spoken by both workflows. | Met | - |
| AC-004 | REQ-004 | Given an iteration delta whose record answers key questions, When the reducer runs, Then the strategy's key-question boxes are ticked for those questions and the registry reports a matching resolved count | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts` Evidence: `deep-research-reduce-state.vitest.ts` 21/21, including a delta `answeredQuestions` case: one box `- [x]`, the other `- [ ]`, registry 1 resolved / 1 open. Fixture run through the shipped steps: Q1 ticked, Q2 open, registry 1 / 1. | Met | - |
| AC-005 | REQ-005 | Given an iteration delta carrying graph events, When the upsert step runs, Then the coverage database holds nodes and edges for that namespace | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-graph-upsert.vitest.ts` Evidence: `deep-research-graph-upsert.vitest.ts` 4/4 (2 nodes and 1 edge persisted from a delta for each workflow; a delta without graph events exits 0 and creates nothing). Fixture run: read-only status after the shipped upsert step reports 3 nodes and 1 edge. | Met | - |
| AC-006 | REQ-006 | Given an acquired nonce-bearing lock, When a workflow release path runs, Then it passes the captured nonce, reports released true, and the lock file is gone | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-lock-release.vitest.ts tests/unit/loop-lock-cli.vitest.ts` Evidence: `deep-research-lock-release.vitest.ts` and `loop-lock-cli.vitest.ts` pass: every release command in both workflows carries `--nonce {captured_acquire_nonce}`, and a real acquire followed by the rendered release returns `released:true` with the file gone. Fixture run: `{"command":"release","released":true}`, lock file absent. | Met | - |
| AC-007 | REQ-007 | Given iteration deltas whose records carry path fields, When the resource map is emitted, Then `Total references` is greater than zero and the entries name the files | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts`; `node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs <fixture> --emit-resource-map` then read the `Total references` line Evidence: `deep-research-reduce-state.vitest.ts` case with a finding row carrying `sources:["src/a.ts"]` yields `Total references` above zero naming the file. Fixture run through `reduce-state.cjs <fixture> --emit-resource-map`: `Total references` 1, names `loop-lock.ts`. | Met | - |
| AC-008 | REQ-008 | Given a fixture research packet, When the staging step runs, Then no lock, pause sentinel, run-now sentinel or projection watermark is staged, while deltas, iterations, ledger frames and lock-coordinator state remain staged | `git check-ignore -v specs/system-speckit/048-doctor-command-audit/003-update/research/.deep-research.lock`; `git add --dry-run -- <fixture>/research` piped through `rg -- '\.deep-research\.lock\|\.deep-research-pause\|\.deep-research-run-now\|\.legacy-projection-watermarks'` returns no match Evidence: Staging half met: the rendered staging command in a temp git repo with `--dry-run` lists only `deltas/iter-001.jsonl` and `locks-and-fencing-v1/x/coordinator-state.json`, while a plain `git add --dry-run` also lists the lock, pause sentinel and watermark file (`scratch/staging-decision.md`). Handoff sweep: root `.gitignore` lines 397-400 ignore the lock, both sentinels and the watermark directory; `git check-ignore -v` on the 048 research `.deep-research.lock`, `.deep-research-pause`, `.deep-research-run-now` and a file under `.legacy-projection-watermarks/` exit 0, each naming its rule, while `locks-and-fencing-v1/x/coordinator-state.json` and `grant-journal.jsonl` are not ignored (exit 1). | Met | - |
| AC-009 | REQ-009 | Given every event name the workflows route through the gateway, When each is sent through the gateway, Then it exits 0, or the workflow no longer emits it | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-bookkeeping-emission.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts` Evidence: `deep-research-bookkeeping-emission.vitest.ts` 3/3 and `append-mode-event-legacy-seam.vitest.ts` pass: every remaining `append_to_jsonl`/`append_jsonl` row exits 0 through the real gateway, every refused row is a `bookkeeping_log` directive listed under `pinned_bookkeeping`, and every listed event is in fact refused. | Met | - |
| AC-010 | REQ-010 | Given a rendered prompt whose first line is the canonical header, When the marker guard runs, Then it does not halt; given a first line that is a nested-dispatch marker other than the canonical header, Then it halts | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-marker-scan.vitest.ts` Evidence: `deep-research-marker-scan.vitest.ts` passes: the canonical header `DEEP-RESEARCH` does not match `nested_marker_pattern`, `DEEP-REVIEW` and `CODE-REVIEW` do, in both workflows. | Met | - |

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

All ten rows are Met with observed evidence. AC-002 and AC-008 closed in the
handoff sweep, once the build's file limits no longer applied: the doctor route
now passes `--read-only` on all three calls, and the root `.gitignore` ignores
the transient deep-research run state while lock-coordinator state stays
tracked.
<!-- /ANCHOR:closure -->
