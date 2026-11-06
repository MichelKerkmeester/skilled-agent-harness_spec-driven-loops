---
title: "Acceptance Criteria: Phase 15: dsh-hook-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh hook parity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/015-dsh-hook-parity"
    last_updated_at: "2026-11-06T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every criterion, the follow-up drift fixes included"
    next_safe_action: "Verify the rows again after any adapter or patch change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-015-dsh-hook-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: dsh-hook-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/085-cli-deepseek-harness-creation/015-dsh-hook-parity`
**Level:** 3
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the guards patch alone, When an interactive keyless boot runs, Then the session log holds an `Advisor:` notice. Given the lineage patch added, When the same boot runs, Then it holds none | `evidence/gates-2026-11-06.txt:97` prints `promptAdvisor: true`, `evidence/gates-2026-11-06.txt:100` shows the marker row, `evidence/keyless-boot-interactive.txt:14` holds the `Advisor:` notice, `evidence/keyless-boot-lineage.txt` holds no `Advisor:` line, and `session-role.test.mjs` passes inside `evidence/gates-2026-11-06.txt:6-8` | Met | - |
| AC-002 | REQ-002 | Given an interactive session, When `/goal-dsh bind`, `show`, `resent`, `pause`, `resume`, `complete` and `clear` run through the adapter, Then each returns `STATUS=OK` with `runtime=dsh`, and a lineage boot lists no `dsh_goal` tool | `evidence/goal-command-live.txt:3-10` records each action against the real manage CLI, `evidence/keyless-boot-interactive.txt:16` lists `dsh_goal` among 24 tools, `evidence/keyless-boot-lineage.txt:13` lists 23 tools without it, and `goal-manage.test.mjs` pins the `log` argument mapping | Met | - |
| AC-003 | REQ-003 | Given the parity table, When each row's DSH-after cell is read, Then it names an adapter or a by-design or n/a reason with a checkable source | `spec.md` section 12 holds 31 rows, each with an Evidence cell, and the coverage matrix row at `.skilled/hooks/README.md:298` carries the DSH column | Met | - |
| AC-004 | REQ-004 | Given the six new adapters and the sweep, When their suites first ran, Then each failed on its missing module, and When the bundle suite runs now, Then it prints `fail 0` | `evidence/tests-red.txt:3`, `:8`, `:13`, `:18`, `:23` and `:28` record `ERR_MODULE_NOT_FOUND` for each suite, and `evidence/gates-2026-11-06.txt:6-8` and `:12-14` record 75 of 75 and 8 of 8 | Met | - |
| AC-005 | REQ-005 | Given the adapter folder, When `find .dsh/plugins/repo-guards/adapters -type f` runs, Then it lists nothing, and every link resolves | `evidence/gates-2026-11-06.txt:88` prints 0 real files, `:91` prints 22 links and `:94` prints 0 dangling links | Met | - |
| AC-006 | REQ-006 | Given a `mktemp -d` cwd and `DSH_HOME` with model keys unset, When `--dump-config` and a headless boot run for both compositions, Then each dump exits 0 and each boot stops at `MISSING_CREDENTIAL` before any model call | `evidence/dump-interactive-web.txt:2`, `evidence/dump-interactive-headless.txt:2` and `evidence/dump-lineage.txt:2` record `exit=0, stderr lines: 0`, `evidence/dump-lineage.txt:7` shows the marker row, and `evidence/keyless-boot-interactive.txt:5` and `evidence/keyless-boot-lineage.txt:6` hold `MISSING_CREDENTIAL` as the only stderr line | Met | - |
| AC-007 | REQ-007 | Given the `dsh-adapters` tree, When `sync-runtime-mirrors.cjs --check` runs, Then it prints `PASS` over 10 trees, and in the mirror tests a missing link reports `MISSING` and a real file in a link's place reports `STALE` | `evidence/gates-2026-11-06.txt:57` prints `PASS: 243 mirrors across 10 trees`, and `evidence/gates-2026-11-06.txt:24-26` records the mirror suite at 6 of 6, including the DSH adapter case | Met | - |
| AC-008 | REQ-008 | Given the docs, When the matrix test and the bundle README are read, Then the matrix has seven runtime cells per row and the docs name the same four interactive-only adapters | `evidence/gates-2026-11-06.txt:30-32` records `runtime-refusal.test.mjs` at 6 of 6 with seven cells, and `.dsh/plugins/repo-guards/README.md:96-99`, `.dsh/SYNC.md:46` and `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md:102-110` list `prompt-advisor`, `goal-manage`, `session-start-advisories` and `session-stop-context` as interactive only | Met | - |
| AC-009 | REQ-009 | Given a step whose operator prompt is followed by an injected notice, When the classifier runs, Then it classifies the prompt, and a notice alone opens nothing | `evidence/followup-fixes-2026-11-06.txt:4-6` records the red run, `evidence/followup-fixes-2026-11-06.txt:27` records the bundle at 78 of 78, and `evidence/followup-fixes-2026-11-06.txt:49-55` shows the runtime-context snapshot and notices that follow the prompt in a real boot | Met | - |
| AC-010 | REQ-010 | Given the advisor adapter, When it runs the shared advisor, Then it passes `dsh`, the advisor runtime list holds `dsh` and a live run is not an outage | `evidence/followup-fixes-2026-11-06.txt:9` records the red run, `evidence/followup-fixes-2026-11-06.txt:28` and `:29` record 1373 advisor tests and the typecheck, and `evidence/followup-fixes-2026-11-06.txt:34` and the next line print the `dsh` runtime label and a live advisor brief | Met | - |
| AC-011 | REQ-011 | Given the lineage patch, When a keyless isolated `--dump-config` and lineage boot run, Then `tool-goal` is disabled and the request lists no native goal tool | `evidence/leaf-goal-tools-off.txt:5-8` shows the disabled row with no stderr, `evidence/leaf-goal-tools-off.txt:13` lists 20 tools, `evidence/leaf-goal-tools-off.txt:16` shows the 23 before, and `evidence/followup-fixes-2026-11-06.txt:13-15` records the red run | Met | - |
| AC-012 | REQ-012 | Given a process table with headless and web DSH sessions, When the sweeper builds its session trees, Then both are session roots and a lookalike path is not | `evidence/followup-fixes-2026-11-06.txt:18-20` records the red run and `evidence/followup-fixes-2026-11-06.txt:30` records the four sweeper suites at 30 of 30 | Met | - |
| AC-013 | REQ-013 | Given this checkout, When `git-setup-check.cjs --tool dsh` runs, Then the ai-tool-hooks row passes with the DSH registration, and an unregistered or dangling adapter fails | `evidence/followup-fixes-2026-11-06.txt:23-24` records the red runs, `evidence/followup-fixes-2026-11-06.txt:31` records 78 of 78, and `evidence/followup-fixes-2026-11-06.txt:38-46` prints `dsh (active): registered` | Met | - |

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

Every row is `Met`, each backed by a saved evidence file or a command recorded in `evidence/gates-2026-11-06.txt`.
<!-- /ANCHOR:closure -->
