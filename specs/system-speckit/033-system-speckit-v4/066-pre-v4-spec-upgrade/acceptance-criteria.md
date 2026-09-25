---
title: "Acceptance Criteria: Phase 1: pre-v4-spec-upgrade"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade"
    last_updated_at: "2026-09-25T06:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Marked AC-001 to AC-007 Met with the final-state evidence"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "abb8eac5-f92d-4f79-aab2-f81adb6c378b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: pre-v4-spec-upgrade

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade
**Level:** 2
**Status:** Complete
**Date:** 2026-09-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh harness sandbox of a v3.x tag, When `upgrade-legacy.mjs` runs without `--apply`, Then the specs root's path-and-sha256 manifest is unchanged and the command exits 1 listing the packets it would repair | `plan.md` §5 proof item 5, plus `rg -n "fetch\|https?://\|child_process.*curl" runtime/cli/spec/upgrade-legacy.mjs` finding no network call. Observed 2026-09-24 in all four proof runs (v3.0 and v3.6, each with and without `--include-archive`): `proof 5: dry run exit=1 manifest=identical`. On 2026-09-25 a wider `rg` for `fetch(`, URLs, `curl`, `wget`, `http.`, `net.connect` and model provider names exited 1 with no match Final-state reruns on 2026-09-25 repeated `dry run exit=1 manifest=identical` for both tags. | Met | - |
| AC-002 | REQ-002 | Given harness sandboxes of `v3.0.0.0` and `v3.6.0.0`, When `upgrade-legacy.mjs --apply` runs, Then 170 of 170 and 995 of 995 active packets pass `validate.sh --strict`. Amended 2026-09-24 with the operator's approval: the count is v4's own packet rule (an `NNN-slug` name, no dot-folder on the path), not every folder that holds a `spec.md` | `plan.md` §5 proof item 1: `validate-all.cjs` then `agg.cjs` on each sandbox. Observed 2026-09-24: `passing before=2/170 after=170/170` on v3.0 and `before=0/995 after=995/995` on v3.6, and `agg.cjs` printed `active: packets=170 unreadable=0 pass=170 fail=0` and `packets=995 unreadable=0 pass=995 fail=0` Final-state reruns on 2026-09-25 counted active 170 of 170 (v3.0) and 995 of 995 (v3.6), `unreadable=0 fail=0`. | Met | - |
| AC-003 | REQ-003 | Given a sandbox already upgraded, When `--apply` runs a second time, Then no file under the specs root changes | `plan.md` §5 proof item 2: manifest diff is empty. Observed 2026-09-24 in all four proof runs: `proof 2: second --apply exit=0 manifest=identical`. On 2026-09-25 the final command file, run again with `--apply --include-archive` over the upgraded v3.0 sandbox, printed `passing before=328/328 after=328/328`, exit 0, manifest identical Final-state reruns on 2026-09-25 repeated `second --apply exit=0 manifest=identical` for both tags. | Met | - |
| AC-004 | REQ-004 | Given the same sandboxes, When `--apply --include-archive` runs, Then 158 of 158 and 895 of 895 archived packets pass, and no archived document was edited. Amended 2026-09-24 with the operator's approval, by the same packet rule as AC-002 | `plan.md` §5 proof item 4, plus `git diff --stat` in the sandbox listing no `.md` under `z_archive` or `z_future`. Observed 2026-09-24: `inspected=328 active=170 archived=158` with `after=328/328` on v3.0 and `inspected=1890 active=995 archived=895` with `after=1890/1890` on v3.6. The sandbox `git status --porcelain` listed no changed file under `z_archive` or `z_future` other than each new `upgrade-baseline.json` (`archived files changed=0` in both runs) Final-state reruns on 2026-09-25 counted archived 158 of 158 and 895 of 895 with `archived files changed=0`. | Met | - |
| AC-005 | REQ-005 | Given a folder whose graph refresh fails, When the backfill runs on it, Then it exits 1, `repair-derived --apply` prints `FAILED` for it, and `upgrade-legacy` exits 2 if the packet still fails strict | New spawn test in `runtime/cli/tests/graph-metadata-backfill.vitest.ts`, existing `repair-derived.vitest.ts`, new `upgrade-legacy.vitest.ts`. Observed: the backfill test "exits 1 and names the folder when one graph file is corrupt" passes. On 2026-09-25, with one v3.0 packet's `graph-metadata.json` made not-JSON in a proof sandbox, `repair-derived --folder <packet> --apply` printed `FAILED specs/01--anobel.com/030-label-product-content-attr — re-derive: exit 1` and exited 2, and `upgrade-legacy --roots <packet> --apply` printed `step repair-derived: FAILED exit 2`, `still failing ...: GENERATED_METADATA_DRIFT, GENERATED_METADATA_INTEGRITY` and `after=0/1`, and exited 2. The command test "exits 2 and names a packet the tools cannot fix" now guards that path | Met | - |
| AC-006 | REQ-006 | Given an upgraded packet, When a finding not in its `upgrade-baseline.json` appears, Then that entry stays an error and `validate.sh --strict` prints `RESULT: FAILED`, while listed findings report as warnings | `runtime/tests/upgrade-baseline.vitest.ts` cases, plus `plan.md` §5 proof item 3. Observed: the hook tests pass 10 of 10, among them "keeps an error entry when one detail is not recorded" and "keeps an error entry when a recorded detail appears again at a new line". In all four proof runs one new broken link printed `RESULT: FAILED` with `x SPEC_DOC_INTEGRITY`, while every upgraded packet passed. A listed finding reads as a warning: on 2026-09-25 an upgraded v3.6 packet, `skilled-agent-orchestration/144-operate-like-fable-5`, printed `! GREP_CONVENTION: ... (recorded in upgrade-baseline.json)` and `RESULT: PASSED` Final-state reruns on 2026-09-25 repeated the negative control for both tags. | Met | - |
| AC-007 | REQ-007 | Given a harness sandbox under git, When `--apply` runs, Then no new `.md` file exists and no `Status` row changed | `git status --porcelain` in the sandbox lists no new `.md`, and `git diff -G 'Status'` on `*.md` shows no changed Status row. Observed 2026-09-24 in all four proof runs: `new .md files=0` from the sandbox's `git status --porcelain --untracked-files=all`, and `changed status lines=0` from `git diff -U0` over `specs/*.md`, matching a `**Status**` row, a `Status:` line or a `status:` key Final-state reruns on 2026-09-25 repeated `new .md files=0` and `changed status lines=0` for both tags. | Met | - |

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

All seven criteria are Met, carried by the final-state proof reruns of 2026-09-25 over both v3 tags, the command and hook tests, and a hand run of a failed re-derive on a real packet. Consciously left out: structure-only transforms (T014, not needed for a pass) and the gate review's P2 suggestions, which `implementation-summary.md` lists as known limitations.
<!-- /ANCHOR:closure -->
