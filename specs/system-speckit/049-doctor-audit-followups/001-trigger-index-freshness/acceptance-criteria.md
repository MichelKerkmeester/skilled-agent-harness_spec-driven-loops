---
title: "Acceptance Criteria: Phase 1: trigger-index-freshness"
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
    packet_pointer: "system-speckit/049-doctor-audit-followups/001-trigger-index-freshness"
    last_updated_at: "2026-10-03T05:27:40Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Closed every criterion with evidence"
    next_safe_action: "Parent session applies the ADR-002 handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-001-trigger-index-freshness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: trigger-index-freshness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/001-trigger-index-freshness
**Level:** 3
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the current corpus, When the build regenerates the committed artifacts through `/doctor:rebuild`, Then `generate-trigger-index.mjs --check --json` exits 0 with `fresh: true`, zero stale documents and zero missing documents, and the index plus its three sidecars carry one `manifestHash`. | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0, and a `node -e` compare of the `manifestHash` field over `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the three files under `fixtures/` finds one value; output saved to `scratch/`. Observed: regenerated with the rebuild leg's generator command; `--check --json` exit 0, fresh true, 0 stale, 0 missing; one manifestHash across all four artifacts. Cited: scratch/manifest-hash-compare.txt:5 | Met | - |
| AC-002 | REQ-002 | Given a corpus document whose single-token phrase repeats its own packet folder token, When the generator publishes diagnostics, Then `fixtures/generation-diagnostics.json` carries a non-zero `phraseQuality.phrases['folder-token-fallback']`, and the per-document validator reports the same class for that document. | `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/trigger-index.vitest.ts --config ../vitest.config.ts --root .` passes with the new case, and `node -e` over `fixtures/generation-diagnostics.json` prints the `folder-token-fallback` key. Observed: the new vitest case passes (58 of 58); the committed bucket carries `folder-token-fallback` 43 phrases over 69 documents. Cited: scratch/regenerate.log:20 | Met | - |
| AC-003 | REQ-003 | Given `doctor-speckit-retrieval.yaml`, When phase 0 runs, Then its activity list invokes `generate-trigger-index.mjs --check --json` as the staleness evidence, and phase 1 describes the mtime sample as supporting evidence. | `rg -n "generate-trigger-index.mjs --check" .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` finds the phase-0 activity, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. Observed: phase 0 runs the `--check` activity and phase 1 calls the mtime sample supporting evidence; `route-validate.sh` exit 0. Cited: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:155 | Met | - |
| AC-004 | REQ-004 | Given `retrieval-conventions.md` §9, When the fix lands, Then the `.opencode/specs` row no longer asserts a symlink that is absent from this checkout, and the retrieval parity suite still passes. | `ls .opencode/specs` reports no such file in this checkout, and `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/retrieval-coverage-parity.vitest.ts --config ../vitest.config.ts --root .` passes. Observed: `ls .opencode/specs` reports no such file; the row now describes the alias conditionally; the parity suite passes. Cited: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:279 | Met | - |
| AC-005 | REQ-005 | Given `runtime/cli/retrieval/README.md`, When the fix lands, Then it says Claude reads the root `AGENTS.md` directly and carries no `CLAUDE.md` symlink claim. | `rg -n "CLAUDE\.md" .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` finds no symlink claim, and the replacement sentence matches `rg -n "reads that file directly" .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs`. Observed: no symlink claim remains and the row says Claude reads that file directly, matching `sync-gate1-pointers.cjs:7`. Cited: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:94 | Met | - |
| AC-006 | REQ-006 | Given the acceptance packet's continuity block, When the fix lands, Then its `key_files` name the live `.skilled/skills/system-spec-kit/runtime/{cli/retrieval,data}` paths and no `.opencode/skills/system-spec-kit/{scripts,data}` path. | `rg -n "opencode/skills/system-spec-kit/(scripts\|data)" specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` finds no match, and `rg -n "runtime/(cli/retrieval\|data)"` on the same file finds both live paths. Not edited here: the 033 file is outside this build's owned files; ADR-002 hands the two path replacements to the parent session. | Superseded | ADR-002 |
| AC-007 | REQ-007 | Given the conventions' ripgrep pins, When the build re-tests the §2.5 hazard and the §4 worked example at the host version, Then both sections name the tested version and the frozen fixtures stay untouched. | `rg -n "14\.1\.1" .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` finds no match; `rg --version` and the two-order `rg --json --count` / `rg --count --json` test output are recorded in `scratch/`; `git status --porcelain .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/` is unchanged for the frozen fixtures. Observed: no `14.1.1` remains; ripgrep 15.2.0 two-order test and worked example recorded; only the three generator sidecars changed under `fixtures/`, the five frozen fixtures did not. Cited: scratch/ripgrep-retest.md:8 | Met | - |
| AC-008 | REQ-008 | Given the doctor's pass policy, When the fix lands, Then `index_regenerates_byte_identical` names `/doctor:rebuild` as the owner of the proof. | `rg -n "index_regenerates_byte_identical" .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` shows the policy naming `/doctor:rebuild`, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. Observed: the policy names `/doctor:rebuild` as owner; `route-validate.sh` exit 0. Cited: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:41 | Met | - |

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

Seven criteria are Met with the observed evidence cited in each row. AC-006 is Superseded by ADR-002: the correction is fully specified and handed to the parent session because the file is outside this build's owned files.
<!-- /ANCHOR:closure -->
