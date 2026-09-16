---
title: "Acceptance Criteria: Phase 8: links-and-generated-state"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skilled links acceptance criteria"
  - "generated state closure gate"
  - "link census acceptance row"
  - "generator freshness acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored one acceptance row per requirement, all Unmet"
    next_safe_action: "Meet the rows by executing tasks.md after phase 007 validates"
    blockers:
      - "007-source-root-move has not validated"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-008-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: links-and-generated-state

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/008-links-and-generated-state
**Level:** 2
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

`SK` stands for `.skilled/skills/system-spec-kit/runtime/cli`. The census and sweep commands are written out in `plan.md` §5.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 435 tracked links of which 8 dangle at `728c4f3efc`, When the phase closes, Then every tracked link resolves except the frozen allowlist in `plan.md` §3 | The census in `plan.md` §5, saved to `scratch/link-census-after.txt`, prints a `dangling` list identical to the allowlist, `old-root-targets 0` and `absolute 4` | Unmet | - |
| AC-002 | REQ-002 | Given 27 hand-made runtime links target `.opencode/`, When T012 to T017 land, Then each link equals its `target_if_no_compat` value and resolves | A Python check over the 27 hand-made `mechanical` rows of `map-a-symlinks.tsv` confirms `os.readlink(link) == target_if_no_compat` and `os.path.exists(link)` for all 27, and prints `27/27` | Unmet | - |
| AC-003 | REQ-003 | Given 168 mirror links owned by `sync-runtime-mirrors.cjs`, When its constants change and it re-runs, Then its check passes and a second write run changes nothing | `node SK/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS: 168 mirrors across 8 trees are in sync.` and exits 0. A second `node SK/runtime-mirrors/sync-runtime-mirrors.cjs` prints `Linked 0, removed 0, of 168 expected mirrors.` (`sync-runtime-mirrors.cjs:298`) | Unmet | - |
| AC-004 | REQ-004 | Given 197 runtime files owned by eight generators, When each re-runs from edited constants, Then each check exits 0 and a second write run changes no file | `--check` exits 0 with `PASS: 4 registration files match the 29-hook registry; 15 Pi extensions resolve.`, `PASS: 2 instruction files carry the root Gate 1 lookup.`, 33 Codex prompts, 12 Codex agents, 33 Pi prompts, 12 Pi agents, 33 Hermes prompts and the Hermes skill copy count T033 recorded. After a second write run of all eight, `git status --porcelain -- .claude/settings.json .codex .cursor .devin .hermes .pi` prints nothing | Unmet | - |
| AC-005 | REQ-005 | Given dist output, compiled contracts, the compiled-routing closure, leaf manifests and the trigger index were built against `.opencode` paths, When their owners re-run, Then each owner's freshness proof passes | `node SK/lib/dist-freshness.cjs check --package <id>` exits 0 for the four built packages. `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0. `node .skilled/bin/compiled-route-sync.cjs --verify` prints `move-simulation OK` and `serving-closure.manifest.json` records `runtimeRoot` as `.skilled/bin/lib/compiled-routing`. `ci-leaf-manifest-freshness.cjs` exits 0. The T060 `cmp` of the four trigger-index files prints nothing and `grep -c '"\.opencode/' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` prints 0 | Unmet | - |
| AC-006 | REQ-006 | Given four links dangle before the move, When T006 and T018 run, Then each carries a recorded decision and the census shows it removed or resolved | The `goal.md` log names four decisions with reasons. `git ls-files -s` lists no retired link, and each restored link passes `test -e` | Unmet | - |
| AC-007 | REQ-007 | Given 13 skill `graph-metadata.json` files list `.opencode/skills/...` in `derived.key_files` and `derived.entities[].path`, When the T045 rewrite lands, Then the owner's dry run changes nothing and reports no error | `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --all` prints `"changed": 0` and `"errored": 0`. `ci-skill-derived-freshness.cjs` exits 0. `git grep -c '\.opencode/' -- '.skilled/skills/*/graph-metadata.json'` prints nothing. `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` exits 0 | Unmet | - |
| AC-008 | REQ-008 | Given `council-graph.sqlite`, `.skilled/package-lock.json` and this folder's metadata carry pre-move values, When their owners run, Then each matches the post-move tree | Phase 003's proof query returns its recorded expected result. `git diff <rollback-base> -- .skilled/package-lock.json` touches only lines 2-3, or `goal.md` records the discarded lock change. `node SK/spec/repair-derived.cjs --folder specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state` exits 0 as a dry run | Unmet | - |
| AC-009 | REQ-009 | Given every constant or path-data diff is contract-adjacent, When each unit runs, Then a `codex-sol` verdict precedes its write run and the orchestrator re-ran its check | `scratch/unit-returns/` holds one non-blocking verdict for each of T008, T020, T023, T026, T029, T032, T035, T038, T041, T046 and T051, each older than the commit of its write task. Each unit's orchestrator re-run output is saved beside it | Unmet | - |
| AC-010 | REQ-010 | Given phase 009's rewrite stales every output that copies or hashes source text, When phase 009 plans its re-run, Then it uses this runbook unchanged | `plan.md` §4 lists the order, commands, checks and suites for rows 1 to 15, and `009-reference-rewrite/plan.md` points to it | Unmet | - |

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

Every row is `Unmet` because the phase has not executed. It cannot start before `007-source-root-move` validates, and AC-008 also waits on the `council-graph.sqlite` disposition phase 003 records.
<!-- /ANCHOR:closure -->
