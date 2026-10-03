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
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-001-trigger-index-freshness"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Planned
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the current corpus, When the build regenerates the committed artifacts through `/doctor:rebuild`, Then `generate-trigger-index.mjs --check --json` exits 0 with `fresh: true`, zero stale documents and zero missing documents, and the index plus its three sidecars carry one `manifestHash`. | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0, and a `node -e` compare of the `manifestHash` field over `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the three files under `fixtures/` finds one value; output saved to `scratch/`. | Unmet | - |
| AC-002 | REQ-002 | Given a corpus document whose single-token phrase repeats its own packet folder token, When the generator publishes diagnostics, Then `fixtures/generation-diagnostics.json` carries a non-zero `phraseQuality.phrases['folder-token-fallback']`, and the per-document validator reports the same class for that document. | `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/trigger-index.vitest.ts --config ../vitest.config.ts --root .` passes with the new case, and `node -e` over `fixtures/generation-diagnostics.json` prints the `folder-token-fallback` key. | Unmet | - |
| AC-003 | REQ-003 | Given `doctor-speckit-retrieval.yaml`, When phase 0 runs, Then its activity list invokes `generate-trigger-index.mjs --check --json` as the staleness evidence, and phase 1 describes the mtime sample as supporting evidence. | `rg -n "generate-trigger-index.mjs --check" .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` finds the phase-0 activity, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | Unmet | - |
| AC-004 | REQ-004 | Given `retrieval-conventions.md` §9, When the fix lands, Then the `.opencode/specs` row no longer asserts a symlink that is absent from this checkout, and the retrieval parity suite still passes. | `ls .opencode/specs` reports no such file in this checkout, and `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/retrieval-coverage-parity.vitest.ts --config ../vitest.config.ts --root .` passes. | Unmet | - |
| AC-005 | REQ-005 | Given `runtime/cli/retrieval/README.md`, When the fix lands, Then it says Claude reads the root `AGENTS.md` directly and carries no `CLAUDE.md` symlink claim. | `rg -n "CLAUDE\.md" .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` finds no symlink claim, and the replacement sentence matches `rg -n "reads that file directly" .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs`. | Unmet | - |
| AC-006 | REQ-006 | Given the acceptance packet's continuity block, When the fix lands, Then its `key_files` name the live `.skilled/skills/system-spec-kit/runtime/{cli/retrieval,data}` paths and no `.opencode/skills/system-spec-kit/{scripts,data}` path. | `rg -n "opencode/skills/system-spec-kit/(scripts\|data)" specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` finds no match, and `rg -n "runtime/(cli/retrieval\|data)"` on the same file finds both live paths. | Unmet | - |
| AC-007 | REQ-007 | Given the conventions' ripgrep pins, When the build re-tests the §2.5 hazard and the §4 worked example at the host version, Then both sections name the tested version and the frozen fixtures stay untouched. | `rg -n "14\.1\.1" .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` finds no match; `rg --version` and the two-order `rg --json --count` / `rg --count --json` test output are recorded in `scratch/`; `git status --porcelain .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/` is unchanged for the frozen fixtures. | Unmet | - |
| AC-008 | REQ-008 | Given the doctor's pass policy, When the fix lands, Then `index_regenerates_byte_identical` names `/doctor:rebuild` as the owner of the proof. | `rg -n "index_regenerates_byte_identical" .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` shows the policy naming `/doctor:rebuild`, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | Unmet | - |

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

All eight criteria are `Unmet` at planning time: the index is still stale, the bucket still cannot carry `folder-token-fallback`, and the four document corrections are not applied. The packet closes when each row carries observed evidence from the command named in its Verification cell.
<!-- /ANCHOR:closure -->
