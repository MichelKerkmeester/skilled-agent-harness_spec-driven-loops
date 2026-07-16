---
title: "Implementation Plan: Scaffolded-folder acceptance for the spec-gate binding path"
description: "Relax the spec-gate core's own prior_answer binding acceptance so a scaffolded folder (exists + spec.md) satisfies the gate, keeping the shared classifier untouched. Chosen approach: Option A (local relaxed-validation wrapper) over Option B (a new pending status)."
trigger_phrases:
  - "spec gate acceptance plan"
  - "relaxed prior_answer binding"
  - "pending status vs relaxed validation"
  - "missing_metadata local wrapper"
  - "classifyIntent scaffolded accept"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-spec-gate-enforce-readiness/003-scaffolded-folder-acceptance"
    last_updated_at: "2026-07-11T11:05:57.515Z"
    last_updated_by: "spec-author"
    recent_action: "Recorded the Option A vs Option B design decision and the affected-surfaces inventory"
    next_safe_action: "Implement the relaxed accept and add the adversarial test matrix"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".opencode/skills/system-spec-kit/shared/gate-3-classifier.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-scaffolded-folder-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scaffolded-folder acceptance for the spec-gate binding path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM JavaScript (`.mjs`); the shared classifier is TypeScript compiled to `shared/dist/` and is NOT edited |
| **Framework** | None; runtime-neutral core consumed by the OpenCode plugin and the Claude hook adapters |
| **Storage** | Per-session JSON gate-state files under `.opencode/skills/.spec-gate-state/` |
| **Testing** | `node:test` via `spec-gate-core.test.mjs` |

### Overview
Relax the spec-gate core's own `source:'prior_answer'` binding acceptance in `classifyIntent` so a scaffolded folder (exists and carries a real `spec.md`) satisfies the gate even before `description.json`/`graph-metadata.json` exist. The shared classifier's `MANDATORY_SPEC_METADATA_FILES` and `validateSpecFolderBinding` stay byte-identical; the relaxation lives entirely in the core's `prior_answer` branch. Chosen approach: **Option A** (a local relaxed-validation wrapper) over Option B (a new `pending` gate status).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test spec-gate-core.test.mjs` green (existing + new)
- [ ] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Session-scoped state machine. Each user turn maps to a persisted gate status: `open` -> (`satisfied` | `skipped`) via `classifyIntent`; each Write/Edit is judged against that status by `evaluateMutation`. This phase adds one new transition into `satisfied`: a scaffolded folder answered on the `prior_answer` path.

### Key Components
- **`classifyIntent` (`spec-gate-core.mjs:481-542`)**: parses the answer, calls `validateSpecFolderBinding`, and persists `satisfied`/`skipped`/`open`. The relaxed accept is added to its `prior_answer` binding branch (`:501-516`).
- **`validateSpecFolderBinding` -> `validateSpecFolderCandidate` (`gate-3-classifier.ts:538-618`)**: runs in-tree, existence, symlink, cycle, trio, and deprecated checks. Returns `reason:'missing_metadata'` (`:563-565`) when only the trio requirement fails. Unchanged by this phase.
- **`evaluateMutation` (`spec-gate-core.mjs:557-590`)**: reads the persisted status; a `satisfied` gate always allows (`:568`). Unchanged.

### Data Flow
`prompt` -> `classifyIntent` -> `answerParse` yields `{type:'binding', path}` -> `validateSpecFolderBinding({path, source:'prior_answer'})` -> if `valid` persist `satisfied` (existing) ELSE if `reason==='missing_metadata'` and a real `spec.md` exists in the resolved folder, persist `satisfied` (NEW) ELSE fall through and stay `open`.

### DESIGN DECISION: relaxed validation (Option A) vs a `pending` status (Option B)

The WS3 defect is that `validateSpecFolderCandidate` rejects a scaffolded folder with `missing_metadata` at `gate-3-classifier.ts:563` because `description.json`/`graph-metadata.json` do not exist until a memory save runs. The brief offers two ways to accept it without weakening the shared `MANDATORY_SPEC_METADATA_FILES` contract.

**Option A - relax acceptance in the spec-gate's own binding path (RECOMMENDED).**
In `classifyIntent`'s `prior_answer` branch (`spec-gate-core.mjs:501-516`), after calling `validateSpecFolderBinding({ path: answer.path, source: 'prior_answer' }, { workspaceRoot: dir })`:
- if `validation.valid && validation.resolvedAbsolutePath` -> persist `satisfied` (unchanged, `:506-514`);
- else if `validation.reason === 'missing_metadata'` -> the folder already passed the in-tree, existence, symlink-containment, and cycle checks inside `validateSpecFolderCandidate` (`:543-561`); the ONLY failing check was the trio at `:563`. Re-derive the folder's absolute path from `validation.path` (set by `invalidBinding('missing_metadata', toWorkspaceRelative(realFolderPath, ...))` at `:565`), resolve it against `dir`, and do a bounded `statSync` for `spec.md`. If `spec.md` is a real file -> persist `satisfied` with `boundSpecFolder` + `validatedResolvedPath`. If `spec.md` is absent -> fall through and stay `open`.

**Option B - add a `pending` gate status.**
`classifyIntent` writes `status:'pending'` for the scaffolded case; `evaluateMutation` (`:568`) treats `pending` like `satisfied`/`skipped` (allow). This requires the SAME scaffold detection as Option A, PLUS: extend the status union in both entrypoints' JSDoc and returns, and update every status consumer - the Claude classify adapter (`spec-gate-classify.mjs:38`), the enforce adapter (`spec-gate-enforce.mjs:43`), the OpenCode plugin (`mk-spec-gate.js:208`/`:227`), the WS1 advise/would-deny telemetry decision vocabulary, and the test corpus.

**Recommendation: Option A.** Rationale:
1. **Smallest blast radius.** A touches only `classifyIntent` and its test. B additionally threads a new enum value through five surfaces plus WS1's decision vocabulary for no behavioral gain - both options end in "Writes allowed."
2. **Semantically honest.** `satisfied` already means "a valid, in-tree, existing spec folder was named as the answer." A real `spec.md` is the load-bearing Gate-3 signal; `description.json`/`graph-metadata.json` are save-time bookkeeping the guard should not deadlock the whole session on.
3. **B is strictly a superset of A's work.** B still needs A's scaffold detection, then adds an enum expansion - more surface for a label.

**Risk of Option A**: it broadens what `satisfied` covers within the spec-gate (folders without the save-time trio). Mitigated because `validateSpecFolderBinding` still runs every security check and the core still requires a real `spec.md`. It also inherits the deprecated-ordering edge - `missing_metadata` (`:563`) precedes the deprecated check (`:567`), so a folder that is both deprecated and missing the trio would surface as `missing_metadata`; mitigated by fresh-scaffold reality and an optional P2 local status read.

**Risk of Option B**: it widens the status enum across five consumers plus telemetry. A `pending` value mishandled in any consumer either reintroduces the deadlock (treated as `open`) or silently widens allow (treated as never-deny in the wrong place) - a larger regression surface exactly as WS1 telemetry lands.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a `fix_bug` change on session-state acceptance and path validation, so the surfaces below are inventoried.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-gate-core.mjs` `classifyIntent` `prior_answer` branch (`:501-516`) | Persists `satisfied` only when `validateSpecFolderBinding` is fully valid | update - accept `missing_metadata` when a real `spec.md` is present | new core test; `git diff` |
| `gate-3-classifier.ts` `MANDATORY_SPEC_METADATA_FILES` (`:137`) + `validateSpecFolderBinding` (`:595-618`) | Shared trio contract other consumers rely on | unchanged - do NOT edit | `rg` shows the literal unchanged; no dist rebuild |
| `gate-3-classifier.ts` `applyGate3Satisfaction` (`:652-684`) prebound/AUTONOMOUS path | Strict trio for prebound sources | unchanged - relaxation is `prior_answer`-only | code inspection; not a consumer of the core wrapper |
| `spec-gate-core.mjs` `evaluateMutation` (`:557-590`) | Reads persisted status; deny only when enforce + Write/Edit + `open` | unchanged - still reads `satisfied`/`open` | golden-loop test still green |
| `spec-gate-core.test.mjs` | Golden loop + fail-open + `answerParse` corpus | update - add scaffolded accept + adversarial negatives | `node --test` green |
| Claude adapters (`spec-gate-classify.mjs:38`, `spec-gate-enforce.mjs:43`) + OpenCode plugin (`mk-spec-gate.js:208`/`:227`) | Call `classifyIntent`/`evaluateMutation`, own transport | unchanged under Option A (no status-enum change) | `rg`: no new status value threaded |

Required inventories:
- Same-class producers of the acceptance decision: `rg -n "validateSpecFolderBinding|status: 'satisfied'|status:'satisfied'" .opencode/skills/system-spec-kit/runtime/lib/spec-gate`.
- Consumers of the status vocabulary: `rg -n "'satisfied'|'skipped'|'open'|'pending'|decision" .opencode/skills/system-spec-kit/runtime .opencode/plugins/mk-spec-gate.js --glob '*.mjs' --glob '*.js'`.
- Matrix axes: `{folder exists?}` x `{spec.md present?}` x `{trio complete?}` x `{in-tree / out-of-tree / traversal / symlink-escape}` x `{deprecated?}` x `{source: prior_answer vs prebound}`.
- Algorithm invariant: the relaxed accept fires ONLY when `validateSpecFolderBinding.reason === 'missing_metadata'` AND a real `spec.md` file exists in the resolved in-tree folder. Every other reason (`missing_folder`, `out_of_tree`, `ambiguous_target_path`, `deprecated_or_superseded`, `phase_parent_without_active_child`, `invalid_metadata`) keeps the gate `open`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the `missing_metadata` reason payload and `validation.path` contents against `gate-3-classifier.ts`
- [ ] Capture the baseline: `node --test spec-gate-core.test.mjs` green before any change
- [ ] Inventory the status-enum and `validateSpecFolderBinding` consumers to confirm Option A's blast radius

### Phase 2: Core Implementation
- [ ] Add the relaxed accept to `classifyIntent`'s `prior_answer` branch (`missing_metadata` + real `spec.md` -> `satisfied`)
- [ ] Preserve fail-open: wrap the added `statSync` so any throw falls through to re-ask; keep the outer catch eviction intact
- [ ] Keep the relaxation scoped to `source:'prior_answer'`; leave `validateSpecFolderBinding` and `applyGate3Satisfaction` untouched

### Phase 3: Verification
- [ ] Add happy-path + adversarial tests, run the full suite, and run strict spec validation
- [ ] Confirm no shared-classifier or `mcp_server/` dist changes
- [ ] Documentation synchronized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyIntent` scaffolded accept + adversarial negatives; fail-open + kill-switch invariants | `node:test` |
| Integration | Golden loop: open -> deny -> answer scaffolded folder -> allow (extends the existing golden-loop test) | `node:test` |
| Manual | `validate.sh --strict` on this phase folder | Browser / CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validateSpecFolderBinding` `missing_metadata` reason + `validation.path` payload | Internal | Green | Without the resolved path in the payload the core would have to re-resolve the folder itself |
| `isExemptTargetPath` exemption of `.opencode/specs/**` | Internal | Green | If the scaffold Write were not exempt the deadlock would occur one step earlier |
| Phase 2 (002-trigger-turn-self-binding) touches the same `classifyIntent` branch | Internal | Yellow | Coordinate the diff so the two changes to the `prior_answer` path do not conflict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The relaxed accept mis-closes a gate it should not, or a test regression surfaces.
- **Procedure**: Revert the `spec-gate-core.mjs` + test diff. Because the shared classifier and its dist are untouched, no coordinated multi-file or dist revert is required.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Implementation | Med | 1-2 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **2.5-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test run captured green before the change
- [ ] Enforce is still opt-in and default-off (no change to `MK_SPEC_GATE_ENFORCE` gating)
- [ ] Shared classifier + `mcp_server/` dist confirmed untouched

### Rollback Procedure
1. Revert the `spec-gate-core.mjs` production diff.
2. Revert the `spec-gate-core.test.mjs` additions.
3. Re-run `node --test spec-gate-core.test.mjs` to confirm the pre-change baseline is restored.
4. No stakeholder notification needed - enforce is not yet flipped for any runtime.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the only persistent artifacts are per-session gate-state files that expire under the existing sweep.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
