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
    last_updated_at: "2026-10-30T14:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Met every criterion and recorded one command output per row"
    next_safe_action: "Close the packet, or land the sibling phase and rebase the counts it quotes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d95d629cfdd8ffa5f18fd0bd81c887f5289b91352ab3ef383493c18057eb1e02"
      session_id: "worktree-294-doctor-helper"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the helper's own advisor bridge activated? No: activation needs a routing-slice row and a scorer rebaseline outside this packet's change list, so it ships derived and inactive with the reason recorded."
      - "Does the setup-list contract test pass on the first run? Yes: every one of the twelve pre-existing routers already carried a row."
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
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a described pre-commit problem, When the matcher runs, Then its first candidate is the git hooks route | `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "my pre-commit hook keeps rejecting my commit"` exits 0 and its first line is `1) /doctor:git hooks             mutates   matches "pre-commit gate keeps blocking" (pre-commit, pre, commit)` | Met | - |
| AC-002 | REQ-002 | Given a multi-target command's problem wording, When the matcher runs with `--json`, Then the first candidate is that route's own runnable and its class reads `read-only` | `--json -- "is this skill in the skilled format"` exits 0 with `candidates[0].runnable` = `/doctor:sk-skill check`, `candidates[0].mutating` = `read-only`, `candidates[0].writes` = `false` | Met | - |
| AC-003 | REQ-003 | Given a problem no route matches, When the matcher runs, Then it exits 1 and names the setup fallback | `-- "write me a poem about cats"` exits 1 and its only line is `STATUS=NO_MATCH FALLBACK=/doctor:setup` | Met | - |
| AC-004 | REQ-004 | Given `--table --json`, When it runs, Then no runnable is the helper itself and no output byte carries a local-only name | exits 0; `grep -c 'local-'` prints `0`; no `runnable` starts `/doctor:helper`; `table` reports 25 entries, 12 commands, 0 skipped private | Met | - |
| AC-005 | REQ-005 | Given the frozen held-out set, When the suite runs, Then top-1 is at least 0.80, top-3 at least 0.90 and negatives at least 0.90, with the sha256 unchanged | the suite prints `held-out top1=0.917 top3=0.938 negatives=1.000 (rows=60 positive=48 negative=12)` and reports `fail 0`; the hash case passes against `e5a41fbcad7db0bd8f5e67034579b74573c6eedf096b60b378d393c32f143191`. That pin replaced `d95d629c…` once, when `/doctor:sk-skill` split into `check` and `convert`: two expected labels gained the target name and no prompt changed. The current digest is what `shasum -a 256` prints for the fixture. The retired string survives only in this packet's `session_dedup.fingerprint`, which is the continuity record's summary-text digest and not fixture evidence | Met | - |
| AC-006 | REQ-006 | Given every doctor router, When the contract suite runs, Then each owns at least one helper entry and every phrase self-recalls top-1 | `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` reports 20 tests, `fail 0`, including `every doctor router owns at least one helper entry` and `every helper entry carries a phrase and every phrase ranks its own entry first` | Met | - |
| AC-007 | REQ-007 | Given the generated bridge file, When the helper's entries are compared, Then ids and runnables match plus only the standalone action extras | the contract suite's `the helper ids and runnables match the deriver, plus only the standalone action extras` case passes: 25 derived ids equal the 25 generated doctor ids, every active bridge's runnable equals its generated `name`, and the only extra is `command-doctor-update-action-compat` | Met | - |
| AC-008 | REQ-008 | Given the route manifest, When the validator runs, Then the summary names the re-measured route count and command count | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and prints `OK: route-validate — 21 routes validated, 3 warnings` with `J1: … across 10 commands` | Met | - |
| AC-009 | REQ-008 | Given the setup presentation, When its target list is read, Then the helper appears exactly once | `rg -c 'helper' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints `1` | Met | - |
| AC-010 | REQ-009 | Given a completed generation run, When the deriver runs again, Then it prints `"status": "fresh"` with the re-measured `doctorRoutes` count | `derive-command-bridges.cjs --check` prints `"status": "fresh"` with `"doctorRoutes": 25` and `"generated": 52`, exit 0 | Met | - |
| AC-011 | REQ-009 | Given the mirrors and the three prompt stub sets, When each `--check` runs, Then each exits 0 at the re-measured count | `hermes`, `codex` and `pi` each print `PASS: 40 prompts are in sync.` and `sync-runtime-mirrors.cjs --check` prints `PASS: 205 mirrors across 9 trees are in sync.`, all exit 0 | Met | - |
| AC-012 | REQ-010 | Given the bridge decision, When the activation list is read, Then the helper bridge is active with all four checks passing, or inactive with its reason recorded | `doctor-phrase-reach.cjs` exits 0 with `STATUS=OK phrases=142 bridges=24`; `scoring-compatibility.json` lists 24 active doctor ids in both lanes and `command-doctor-helper` is not one of them, so the helper bridge is derived and inactive, and `implementation-summary.md` records why. Every other doctor route, `sk-skill`'s `check` and `convert` included, is active under its target-suffixed id | Met | - |
| AC-013 | REQ-011 | Given the command contract, When the router generator checks, Then it reports zero path drift | `generate-command-routers.cjs --check` prints `routers=38 clean=38 path-drift=0 shape-drift=0`, exit 0 | Met | - |
| AC-014 | REQ-011 | Given the root README, When the doctor count is read, Then it equals the router count and every command appears exactly once | the doctor section reads `Thirteen commands` and carries 13 `/doctor:` bullets, `ls .skilled/commands/doctor/*.md \| wc -l` prints 13, and `/doctor:sk-skill` appears once, on its `[check\|convert]` line. The start branch already listed it, so the repair was the stale second block an earlier commit appended, not a missing entry | Met | - |
| AC-015 | REQ-009 | Given the family runner, When it runs, Then every suite passes | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `tests 792, pass 792, fail 0` over 38 files and ends `7 suite(s) passed, 0 failed`, exit 0 | Met | - |
| AC-016 | REQ-012 | Given a bad argument or an unreadable manifest, When the matcher runs, Then it exits 2; given a match, Then it exits 0; given no candidate above the floor, Then it exits 1 | the case `a bad argument, an unreadable manifest and a missing yaml package each exit 2` passes, alongside the exit-0 match case and the exit-1 no-match case | Met | - |
| AC-017 | REQ-009 | Given the advisor runtime, When its doctor suites run, Then they pass with no failure | `vitest run` over `doctor-command-bridges`, `command-bridges-drift-guard`, `doctor-routing-slice`, `scorer/doctor-bridge-isolation` and `scorer/doctor-ordering` reports 5 files passed, 96 tests passed, 0 failed | Met | - |
| AC-018 | REQ-004 | Given the final tree, When the change list is read, Then it names no file outside the spec's file list and no local-only path | `git status --porcelain` names 19 paths for the accuracy repair that closed this packet, and each one is either a row of section 3's list or one of this packet's own documents: the manifest, the presentation, the matcher, both suites, the tune set, both regenerated advisor sources, the three changelogs, `README.md`, and seven packet documents including the re-derived `graph-metadata.json`. No `local-*` path appears, and `git status --porcelain` is empty once the work is committed | Met | - |

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

AC-001 through AC-018 are met, each with an observed command output. Two facts a
reader should carry: the advisor bridge for the helper is derived and inactive by
decision, with the reason recorded in `implementation-summary.md`, and the counts
this packet quotes move by one when the sibling `/doctor:agents-md` phase lands,
because the helper reads the route manifest at run time.
<!-- /ANCHOR:closure -->
