---
title: "Acceptance Criteria: Phase 2: scripts-into-runtime-nesting"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting"
    last_updated_at: "2026-09-05T11:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the scripts -> runtime/cli move"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/package.json"
      - ".opencode/skills/system-spec-kit/package.json"
      - ".opencode/skills/system-spec-kit/runtime/cli/core/config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-002-scripts-into-runtime-nesting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: scripts-into-runtime-nesting

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the T001 `rg` hit list, When each hit is classified live-consumer or prose, Then every live hit names its resolving mechanism (import, exec, config-string) and every count is grouped by consumer class | `scratch/inventory.md` §1-§8: counts by class, the grep-invisible section (`.opencode/bin/skill-advisor.cjs:24`, `shared/embeddings/factory.ts:248`, `runtime/lib/graph/graph-metadata-parser.ts:966`, `runtime/lib/validation/orchestrator.ts:74-77,229`, and more), the relative-import-direction-flip class (21 files, 36 lines), and the dirname-climb `+1` class | Met | - |
| AC-002 | REQ-002 | Given the `runtime/scripts/` collision, When the target-layout decision is recorded, Then `spec.md` names the chosen layout (`runtime/cli/`) and states why it was chosen over folding `runtime/scripts/`'s three files into the incoming tree | `spec.md` Scope section, In Scope bullet 2; the move executed at `runtime/cli/` with `runtime/scripts/` (build tooling) untouched, confirmed by `evals/check-architecture-boundaries.ts`'s `wrappersDir` still pointing at `runtime/scripts` while `REQUIRED_ROOT_DIRS` now reads `runtime/cli` | Met | - |
| AC-003 | REQ-003 | Given this folder, When `recommend-level.sh` runs against it, Then its numeric score and recommended level are recorded here | `bash .../scripts/spec/recommend-level.sh --loc 900 --files 450 --architectural --json` (pre-move path; replayed 2026-09-05 from `runtime/cli/spec/recommend-level.sh` with the same result: `recommended_level: 3, total_score: 73, confidence: 82`) → `recommended_level: 3, total_score: 73, confidence: 82` (`scratch/inventory.md` §11); the execution ran directly under this phase folder by explicit operator instruction once the other lanes landed, rather than through a separately Gate-3'd child folder | Met | - |
| AC-004 | REQ-004 | Given the execution-phase handoff, When it is created, Then its `spec.md` opens with the atomic-commit plan (one `git mv` plus freshness/hook/workspace/CLAUDE.md updates in the same commit) and cites packet 053's review-loop precedent by folder path | `scratch/execute-plan.md` (the atomic-commit plan, executed) cites `specs/system-speckit/053-spec-kit-runtime-rename/` throughout; `implementation-summary.md` Verification table records the executed gate set mirroring 053's own closeout list | Met | - |

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

All four criteria are Met. The move executed as one atomic working-tree change: `scripts/` → `runtime/cli/`, `scripts/memory/` → `runtime/cli/continuity/` (Stage B of packet 054/007, riding on this move per operator instruction), the workspace manifest, both tsconfig files, both vitest configs, the freshness table id, the command-router family key, and every resolved consumer updated in the same pass. Typecheck (shared, runtime, cli) exits 0; `validate.sh --strict` passes on this packet's own parent recursively and on packets 052 and 053; the trigger index regenerates with an identical `indexSha256` across two runs; the runtime-mirror sync reports 169/169 in sync; `compiled-route-guard.cjs` reports every hub fresh; both sk-doc CI scripts (`ci-skill-root-metadata.cjs`, `ci-skill-derived-freshness.cjs`) pass 14/14; `rg` for the four retired patterns (`system-spec-kit/scripts/`, `scripts/dist/`, `scripts/memory`, `dist/memory`) returns zero hits outside the historical corpus. The CLI package's own vitest suite still carries 63 failing tests (of 1580); `implementation-summary.md`'s Known Limitations section lists every one investigated, split between confirmed pre-existing/unrelated failures (stale template-path expectations, a spec-folder restructuring from an unrelated packet, content-assertion drift) and a smaller remainder not yet root-caused. None of the investigated failures trace to an unresolved `scripts/` → `runtime/cli/` path.
<!-- /ANCHOR:closure -->
