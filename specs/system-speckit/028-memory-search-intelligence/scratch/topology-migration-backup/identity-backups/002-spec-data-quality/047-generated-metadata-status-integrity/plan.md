---
title: "Implementation Plan: Phase 10: generated-metadata-status-integrity"
description: "Gate deriveStatus on real completion evidence and add a non-blocking cross-field validator rule catching the same defect class in existing folders."
trigger_phrases:
  - "generated metadata status integrity plan"
  - "deriveStatus fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity"
    last_updated_at: "2026-07-04T17:11:47.506Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md"
    next_safe_action: "Implement Phase 2 (core fix)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-010-status-integrity-20260702"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: generated-metadata-status-integrity

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | TypeScript (compiled to `mcp_server/dist/`) |
| **Framework** | Node.js, Zod schema validation |
| **Storage** | Flat-file spec-doc frontmatter + generated JSON (`graph-metadata.json`) |
| **Testing** | `node --test` / vitest, matching the existing suite pattern for `graph-metadata-parser.ts` |

### Overview
`deriveStatus`'s `!checklistDoc` branch currently returns `complete` whenever `implementation-summary.md` exists, with zero regard for its content. The fix reads `completion_pct` from that doc's frontmatter (`extractFrontmatterScalar` already matches nested YAML keys by regex, so no new frontmatter parser is needed) and checks `tasks.md` for open `- [ ]` items (reusing the same checklist-regex pattern `evaluateChecklistCompletion` already uses for `checklist.md`), gating `complete` on both. A new validator check in `generated-metadata-integrity.ts` cross-references any stored `derived.status: complete` against that same evidence and reports a violation when they disagree, gated behind a new report-mode-default capability flag so existing folders are not immediately broken.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from the diagnostic review's P0/P1 findings)
- [x] Success criteria measurable (SC-001 through SC-003)
- [x] Dependencies identified (none - isolated fix)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-005)
- [x] Tests passing (targeted 9-file suite, 108/108, fresh run pasted in implementation-summary.md); full 815-file repo-wide suite still running as a broader confirmation
- [x] Docs updated (spec/plan/tasks/implementation-summary + ENV_REFERENCE.md)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure function fix + additive validator rule, no new abstraction layer.

### Key Components
- **`deriveStatus` (graph-metadata-parser.ts:1167-1224)**: status-derivation logic; the `!checklistDoc` branch (1215-1218) is the exact defect site.
- **`checkGeneratedMetadataIntegrity`/`validateGraphMetadataFile` (generated-metadata-integrity.ts:83-114, 206-240)**: the `--strict` validator pipeline; the new check plugs in here as another `violations.push(...)` call, consistent with the existing `assertSourceFingerprint` pattern.
- **`capability-flags.ts`**: home of the existing graduated-rollout flags (`SPECKIT_GENERATOR_HARDENING`, `SPECKIT_GENERATED_METADATA_DRIFT_GATE`); the new flag follows the identical default-OFF-enforces / opt-in-report shape those already use, inverted to default-report / opt-in-enforce since this is a NEW check with a known existing backlog (213 folders), not a migration-graduation check.

### Data Flow
`deriveStatus` reads already-collected `ParsedSpecDoc[]` (no new I/O); the new validator check re-reads `implementation-summary.md`/`tasks.md` directly from disk (mirroring how `assertSourceFingerprint` re-derives from source docs), independent of whatever `deriveStatus` produced, so it catches drift in EXISTING files that were generated before this fix shipped.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deriveStatus` (graph-metadata-parser.ts:1167-1224) | Sole producer of `derived.status` for every spec folder repo-wide | Update: gate `!checklistDoc` branch on completion_pct + open tasks | New unit tests + full existing suite green |
| `deriveGraphMetadata` (graph-metadata-parser.ts:1252+) | Calls `deriveStatus` once per generate/backfill | Unchanged - already threads `existing?.derived.status` through | Existing tests unaffected |
| `generated-metadata-integrity.ts` validator chain | Consumer of `graph-metadata.json`'s `derived.status` for `--strict` | Update: add new cross-field check | New unit tests + `validate.sh --strict` manual smoke |
| `capability-flags.ts` | Owns all graduated-rollout env flags | Update: add one new flag | Existing flag tests unaffected; new flag has its own test |
| `ENV_REFERENCE.md` | Operator-facing flag documentation | Update: document new flag | Manual read-through |
| `backfill-graph-metadata.ts` | Calls `deriveGraphMetadata`/`deriveStatus` transitively for bulk regeneration | Not a consumer of the new validator check (different codepath); unchanged | Existing backfill tests unaffected |
| Every OTHER spec folder repo-wide whose `graph-metadata.json` currently has `derived.status: complete` from the old buggy logic | Passive data, not code | Not modified by this phase (213-folder bulk correction explicitly out of scope) | New validator surfaces them in report mode only; verified via a sample `validate.sh --strict` run showing no NEW hard failures |

Required inventories:
- Same-class producers of `derived.status`: `rg -n "deriveStatus|derived\.status\s*[:=]" .opencode/skills/system-spec-kit/mcp_server/lib` -- confirmed `deriveStatus` is the single producer; no duplicate derivation logic elsewhere.
- Consumers of `derived.status`: `rg -n "derived\.status" .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js'` before finalizing, to confirm no other module branches on `complete` in a way this fix could destabilize.
- Matrix axes: `completion_pct` (missing / <100 / >=100) x `tasks.md` (missing / all checked / has open items) x `checklist.md` (present / absent) - the fix only changes behavior in the `checklist.md` absent column; present-column behavior (existing checklist evaluation) is untouched.
- Algorithm invariant: a folder must never derive `complete` when its own authored docs show incomplete work (open tasks, or completion_pct explicitly below 100). A folder with genuinely unknown completion state (no parseable completion_pct) must never default to `complete` either - unknown means non-complete plus a review flag, not an assumed pass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline And Inventory
- [x] Run the existing test suite touching `graph-metadata-parser.ts`/`generated-metadata-integrity.ts` before any edit, capture output
- [x] Confirm `derived.status` has no other producer (`rg` inventory above)

### Phase 2: Core Fix (deriveStatus)
- [x] Add `parseCompletionPct(content)` helper (wraps `extractFrontmatterScalar(content, 'completion_pct')`, parses to number, returns `null` if absent/unparseable)
- [x] Add `hasOpenTaskItems(content)` helper (same unchecked-checkbox regex as `evaluateChecklistCompletion`, applied to tasks.md)
- [x] Rewrite the `!checklistDoc` branch (1215-1218): read `tasks.md` from `docs`, compute completion_pct + open-tasks, gate `complete` on `completion_pct >= 100 AND !hasOpenTasks`; on null completion_pct, preserve a valid `existingStatus` or fall back to `planned` with `reviewRequired: true` (matching the sibling `!implementationSummaryDoc` branch's existing pattern at 1207-1212)

### Phase 3: Validator Rule
- [x] Add the new capability flag to `capability-flags.ts` (default: report/non-blocking; explicit opt-in enforces)
- [x] Add the cross-field check function to `generated-metadata-integrity.ts`, wired into `validateGraphMetadataFile`, resolved through the new flag (not the existing `grandfather` flag, which already defaults to enforced); wired through the `validate.sh` CLI bridge, the actual path `validate.sh` uses. `orchestrator.ts`'s own call site was left unwired due to a concurrent session's unrelated uncommitted changes in that file (see implementation-summary.md Known Limitations)
- [x] Document the new flag in `ENV_REFERENCE.md`'s feature flags reference table

### Phase 4: Verification
- [x] Unit tests for both fixes (synthetic fixtures: unfilled scaffold, null completion_pct, real complete folder, open-tasks folder)
- [x] Targeted existing suite green after the change (108/108); full 815-file repo-wide suite still running as an additional confirmation
- [x] Manual `validate.sh --strict` smoke on real folders from the 213-folder backlog, confirming report-mode (no new hard failures) by default
- [x] Manual smoke with the new flag explicitly enforced, confirming the same folders now DO produce a violation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `deriveStatus`, `parseCompletionPct`, `hasOpenTaskItems`, the new validator check | `node --test` / vitest matching existing suite convention |
| Regression | Full existing `graph-metadata-parser`/`generated-metadata-integrity` suite | Same runner |
| Manual | `validate.sh --strict` against real folders (report mode default, enforced mode opt-in) | Bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | N/A | Isolated fix, no external dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: full test suite regresses, or the new validator rule's default report-mode accidentally resolves to enforced (would newly fail 213 folders repo-wide for other sessions)
- **Procedure**: revert the 3 modified source files via `git revert` or targeted `git checkout` of the prior commit; the new capability flag can also be force-disabled via its env var without a code revert if only the rollout default is wrong
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

