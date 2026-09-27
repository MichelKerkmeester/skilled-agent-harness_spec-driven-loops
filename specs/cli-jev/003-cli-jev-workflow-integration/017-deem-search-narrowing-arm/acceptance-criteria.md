---
title: "Acceptance Criteria: Phase 17: deem-search-narrowing-arm"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "phase-author-leaf"
    recent_action: "Authored one criterion per requirement for the planned narrowing arm"
    next_safe_action: "Build after phases 008 and 010 land, then meet each row"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-017-deem-search-narrowing-arm"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 17: deem-search-narrowing-arm

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

In every row, `S` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` and `STUB` is a directory holding stub `cli-deem` and `jev` binaries that each append one line per invocation to `STUB/calls.log`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the real tree, When the script runs without `--deem` or `--jev`, Then it prints per-track counts, both baselines' accuracy, the probe line and the headroom line, calls nothing and writes nothing | `PATH="STUB:$PATH" node S` exits 0 and prints lines starting `baseline lookup:`, `baseline ripgrep:` and either `no headroom` or `planned calls:`. `test ! -s STUB/calls.log && echo no-calls` prints `no-calls`, and `git status --porcelain` is unchanged by the run | Unmet | - |
| AC-002 | REQ-002 | Given packets whose descriptions are placeholders or name a track, When the test set is built, Then those rows are dropped and counted, no track keeps more than 20 rows, and no question scores against its own folder | The vitest cases "test set drops a leaking description" and "lookup ignores the question's own folder" pass. On the real tree, the zero-call output prints `kept`, `placeholder`, `leak` and `residual` columns for all 16 tracks with no `kept` value above 20 | Unmet | - |
| AC-003 | REQ-003 | Given the fresh index, When both baselines score the test set, Then each prints a track accuracy on the same row count and the index `manifestHash` prints | The zero-call output's `baseline lookup:` and `baseline ripgrep:` lines show the same denominator, and an `index manifestHash:` line prints a 64-character hex value equal to `node -p "require('./.skilled/skills/system-spec-kit/runtime/data/trigger-index.json').manifestHash"` | Unmet | - |
| AC-004 | REQ-004 | Given measured rows in a backend column, When its verdict is computed, Then `keep` needs a gain of at least 10 points, sign-test p below 0.05 and a flip rate of at most 0.10, and anything else prints `stop` with its reason | The vitest cases "verdict keep on stub answers" and "verdict stop (margin) on a small gain" pass and print `verdict deem: keep` and `verdict deem: stop (margin)`. `PATH="STUB:$PATH" node S` prints `margin: 0.10` before any call line. A saturated fixture prints `no headroom` and the stub log stays empty | Unmet | - |
| AC-005 | REQ-005 | Given `--deem`, When the Deem check fails, Then the matching skip line prints, the zero-call output is byte-identical and the run exits 0 | With a stub `cli-deem health` reporting backend `stub`, `node S --deem --out <tmp>` prints `deem arm skipped: stub backend` and exits 0, and `diff` of its output minus that line against the default run's output prints nothing. The stub log holds only `health` calls and no `jev` call | Unmet | - |
| AC-006 | REQ-006 | Given a default run and each model run, When all finish, Then only the planned paths changed | `git status --porcelain` lists only `score-track-narrowing.mjs`, `score-track-narrowing.vitest.ts`, the retrieval `README.md` and, if inside the repository, the report directory. `git diff --stat -- .skilled/skills/system-spec-kit/runtime/data .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures .skilled/hooks AGENTS.md` prints nothing | Unmet | - |
| AC-007 | REQ-007 | Given a model arm with a passing check, When it asks a question, Then it sends 17 options in three rotations and reduces them to a modal pick | `calls.jsonl` from the live `--deem` run has exactly 3 lines per measured Deem row with order indexes 0, 1 and 2, and `report.json` holds an `optionSetSha256` of 64 hex characters and `options: 17`. In the stub-`jev` vitest run, each row logs 3 `jev choice` calls with 17 `-o` pairs each | Unmet | - |
| AC-008 | REQ-008 | Given a live model run, When it finishes or stops, Then its notice printed first, every call is recorded and each exit had one handling | The `--deem` run's first arm lines include `nothing leaves the machine` and `planned calls:`. `node -e` over `calls.jsonl` counts 0 Deem lines missing `wallMs`, `exitCode`, `modelId`, `modelCommit` or `sourceCommit` and 0 Jev lines missing `wallMs`, `exitCode`, `jevVersion`, `provider` or `model`. The Jev notice holds `payload:` and `estimated input tokens:` and no `$`. The vitest case for a Deem exit 4 with a changed pair prints `deem arm stopped: model commit changed mid-run`. `node S --deem` or `node S --jev` without `--out` exits 2 with the stub log empty | Unmet | - |
| AC-009 | REQ-009 | Given a verdict, When the report is written, Then it names what the verdict was measured on | `report.json` holds, for the Deem column, `modelCommit` and `sourceCommit` equal to what `cli-deem health` printed at the start, and for a Jev column `jevVersion`, `provider` and `model` equal to the identity and `auth test` lines. Vitest cases with a stored Deem pair or Jev model that differs print `requalify: model commit changed` or `requalify: model changed` | Unmet | - |
| AC-010 | REQ-010 | Given the 20 Latin paraphrase probes, When any run finishes, Then a probe line prints hits per method and no verdict depends on it | The output holds one `paraphrase probes:` line with the counted gold-less probes and hits for lookup, ripgrep and each model column that ran. The vitest verdict cases give the same verdict with the probe hits changed | Unmet | - |
| AC-011 | REQ-011 | Given the build, When the vitest file runs, Then every case passes | From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/score-track-narrowing.vitest.ts` exits 0 and reports at least 17 passed tests and 0 failed | Unmet | - |
| AC-012 | REQ-012 | Given `--jev`, When the Jev gate fails, Then the identity line prints first, the matching skip line prints, the zero-call output is byte-identical and the run exits 0 | With a stub `jev` whose `auth status --provider official` exits 3 and no `JEV_PROVIDER` set, `node S --jev --out <tmp>` prints a first arm line naming the stub's path and provider `official`, then `jev arm skipped: no credential`, and exits 0. `diff` of its output minus those lines against the default run prints nothing. The stub log holds no `choice` or `auth test` call | Unmet | - |
| AC-013 | REQ-013 | Given the script and a stub run that passes the Jev gate, When its code and logged calls are inspected, Then no key appears and every Jev call carries only the question, the options and one provider | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' S` returns no match and exits 1. In the stub `jev` log, every `auth status`, `auth test` and `choice` line carries the same `--provider` value, and each `choice` line carries only `--provider`, 17 `-o` pairs and no file path argument | Unmet | - |

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

Nothing is built. The phase is Planned, and every row above is `Unmet` until the build after phases 008 and 010.
<!-- /ANCHOR:closure -->
