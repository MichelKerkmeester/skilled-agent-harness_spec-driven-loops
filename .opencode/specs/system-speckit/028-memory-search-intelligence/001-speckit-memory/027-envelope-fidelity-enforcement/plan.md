---
title: "Implementation Plan: Envelope-Fidelity Enforcement [template:level_2/plan.md]"
description: "Make requestQuality and citationPolicy conditionally-mandatory render slots in the command contract, add a deterministic post-render envelope-fidelity check that replays the tool verdict against the rendered block with a fail mode and a grandfather report mode, and emit a pre-rendered verdict fragment from the handler, every behavioral change behind a default-OFF flag, with a vitest proving the check."
trigger_phrases:
  - "envelope fidelity enforcement"
  - "mandatory render slots verdict"
  - "post render envelope fidelity check"
  - "pre rendered verdict fragment"
  - "requestQuality citationPolicy render"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped recs 5, 6, 9 behind the envelope-fidelity flag"
    next_safe_action: "Run the grandfather report over a captured render corpus before the default-on flip follow-on"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-envelope-fidelity-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Envelope-Fidelity Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` check plus a TypeScript handler edit and Markdown command contract |
| **Framework** | spec-kit memory-search command and MCP handler, vitest |
| **Storage** | None, the check runs on a captured verdict and a rendered string |
| **Testing** | A vitest proving the fidelity check fails a dropped-field render, passes a faithful render, and the grandfather report mode does not fail an existing non-conforming render |

### Overview
This phase hardens soft spot B, envelope fidelity, without touching the scoring pipeline. The memory-search tool already ships `requestQuality` and `citationPolicy` on a non-empty result, the verdict is correct, but the render contract lets a weaker model drop the fields. The plan makes three changes from recs #5, #6 and #9. First, reclassify the two fields to conditionally-mandatory render slots required-when-present in `commands/memory/search.md` and `assets/search_presentation.txt`, with the render self-check extended to re-emit a tool-present field absent from the render, behind a default-OFF flag (rec #5). Second, add a deterministic `check-envelope-fidelity.mjs` that replays the tool verdict against the rendered block, asserts each shipped field is present and unmodified, with a fail mode and a grandfather report mode (rec #6). Third, emit a ready-to-paste pre-rendered verdict fragment from `handlers/memory-search.ts` so the model pastes rather than transcribes the fields, behind a default-OFF flag (rec #9). The verdict logic in `confidence-scoring.ts` is read but unchanged. Every behavioral change ships dark, the default-on flip is a follow-on gated on a clean grandfather report.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Render-contract hardening plus a deterministic post-render check, all flag-gated. Two contract-doc edits reclassify the verdict fields, one handler edit emits a fragment from the existing verdict object, and one net-new ESM check replays the verdict against a rendered block. No scoring, banding or citation change, and no edit to the verdict logic in `confidence-scoring.ts`.

### Key Components
- **`commands/memory/search.md`**: the command render contract. The named optional fields rule at line 76 and 144 moves to conditionally-mandatory required-when-present, and the render self-check re-emits a tool-present field absent from the render, behind a default-OFF flag.
- **`commands/memory/assets/search_presentation.txt`**: the presentation asset. The two fields at lines 103 and 110-111 move from optional trailing fields to conditionally-mandatory slots with the re-emit rule, matching the command contract.
- **`handlers/memory-search.ts`**: the verdict is shipped at lines 1325-1327. A pre-rendered verdict fragment is emitted alongside it, rendered from the same verdict object, behind a default-OFF flag.
- **`check-envelope-fidelity.mjs`**: the net-new deterministic check. It takes a tool verdict and a rendered block, asserts each shipped field is present and unmodified, and offers a fail mode and a grandfather report mode.
- **`confidence-scoring.ts`**: the verdict logic at `assessRequestQuality` line 433. Read for the field set the fragment and the replay use, not modified.

### Data Flow
The tool computes the verdict in `assessRequestQuality` and ships `requestQuality` and `citationPolicy` from the handler. The fragment is rendered from the same verdict object the handler already holds and emitted alongside the fields, behind the default-OFF flag, so the model pastes the fragment. The command contract requires a render that has the fields to keep them and re-emits a dropped tool-present field. After render, `check-envelope-fidelity.mjs` takes the captured tool verdict and the rendered block, replays the shipped fields against the render, and exits non-zero in fail mode on a drop or an alter while listing the same case without failing in grandfather report mode. The default-on flip of the render mandate is a follow-on gated on a clean grandfather report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `commands/memory/search.md` named optional fields | States `requestQuality` and `citationPolicy` are sanctioned extras whose absence is valid (line 76), with placement and exact names at line 144 | reclassify to conditionally-mandatory required-when-present and extend the render self-check to re-emit a tool-present field absent from the render, behind a default-OFF flag | grep shows the two fields described as required-when-present with a re-emit rule, and a flag default-OFF preserves the legacy absence-is-valid path |
| `commands/memory/assets/search_presentation.txt` trailing fields | Lists `requestQuality` and `citationPolicy` as the only sanctioned extras (line 103) and as optional trailing fields (lines 110-111) | move the two fields to the conditionally-mandatory slot list with the re-emit rule, matching the command contract | the asset describes the two fields as conditionally-mandatory and the contract and asset agree on the rule |
| `handlers/memory-search.ts` verdict ship | Ships `requestQuality` and the citation policy from the shipped verdict at lines 1325-1327 | emit a pre-rendered verdict fragment alongside the shipped fields, rendered from the same verdict object, behind a default-OFF flag | the handler emits a fragment containing both field names and their verbatim verdict values, gated default-OFF |
| `confidence-scoring.ts` verdict logic | `assessRequestQuality` at line 433 returns the `requestQuality.label` verdict, banded off the pre-calibration value at line 400 | no change, the fragment and the replay read the verdict it returns | grep shows `assessRequestQuality` and the banding unchanged, the fragment renders the returned label |
| `check-envelope-fidelity.mjs` | Does not exist | create the deterministic post-render check that replays the tool verdict against a rendered block, with a fail mode and a grandfather report mode | a dropped-field render exits non-zero in fail mode and lists with a zero exit in grandfather report mode |
| `envelope-fidelity.vitest.ts` | Does not exist | create the vitest proving the check fails a dropped-field render, passes a faithful render, and the grandfather report mode does not fail a pre-existing non-conforming render | the vitest has a dropped-field failing case, a faithful passing case, and a grandfather-report reporting case |
| `isResultConfidenceEnabled` gate | Presence-gates the shipped verdict so the fields are mandatory-when-enabled | leave unchanged, the check treats a confidence-disabled run as nothing-to-replay | the fidelity check passes a run where confidence is disabled and no verdict was shipped |

Required inventories:
- Same-class producers: `rg -n 'requestQuality|citationPolicy' .opencode/skills/system-spec-kit/mcp_server .opencode/commands/memory`.
- Consumers of changed symbols: `rg -n 'requestQuality|citationPolicy|isResultConfidenceEnabled' .opencode/commands/memory .opencode/skills/system-spec-kit/mcp_server/handlers`.
- Matrix axes: render with both fields, render dropping one field, render renaming a field, render altering a verdict value, empty result set, confidence disabled, fail mode, grandfather report mode.
- Algorithm invariant: the check replays only the fields the tool shipped, a dropped or altered field fails in fail mode while grandfather report mode lists it without failing, the render mandate and the fragment are default-OFF, and the verdict logic in `confidence-scoring.ts` is unchanged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the shipped verdict shape at `handlers/memory-search.ts:1325-1327` and the field set `assessRequestQuality` returns at `confidence-scoring.ts:433`, with no edit to the verdict logic
- [ ] Confirm the render contract names the two fields as the only sanctioned extras at `commands/memory/search.md:76`, `:144` and `assets/search_presentation.txt:103`, `:110-111`
- [ ] Define the default-OFF flag name for the render mandate and the fragment emit, and the grandfather report mode for the fidelity check
- [ ] Enumerate the matrix axes the fidelity check and the vitest must cover

### Phase 2: Core Implementation
- [ ] Reclassify `requestQuality` and `citationPolicy` to conditionally-mandatory required-when-present render slots in `commands/memory/search.md` and `assets/search_presentation.txt`, extend the render self-check to re-emit a tool-present field absent from the render, behind a default-OFF flag (rec #5)
- [ ] Build `check-envelope-fidelity.mjs` that replays the tool verdict against a rendered block, asserts each shipped field is present and unmodified, with a fail mode and a grandfather report mode (rec #6)
- [ ] Emit a pre-rendered verdict fragment from `handlers/memory-search.ts`, rendered from the shipped verdict object, behind a default-OFF flag (rec #9)
- [ ] Wire the fidelity check to read a captured verdict and a rendered block and to separate a dropped field from an altered value

### Phase 3: Verification
- [ ] A render that drops a tool-shipped field fails the fidelity check in fail mode and lists in grandfather report mode with a zero exit
- [ ] The render contract and asset describe the two fields as conditionally-mandatory required-when-present with a re-emit rule, behind a default-OFF flag
- [ ] The handler emits a fragment containing both field names and their verbatim verdict values, gated default-OFF, with the verdict logic unchanged
- [ ] The vitest fails a dropped-field render, passes a faithful render, and runs the grandfather report mode without failing a pre-existing non-conforming render
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The fidelity check fails a dropped or renamed field and an altered verdict value, passes a faithful render, treats a confidence-disabled run as nothing-to-replay, and the grandfather report mode lists a non-conforming render without failing | `envelope-fidelity.vitest.ts` over `check-envelope-fidelity.mjs` |
| Integration | The handler fragment emit is gated default-OFF and renders from the shipped verdict object, and the render contract re-emit rule is exercised against a dropped-field render | direct handler invocation plus the fidelity check over a rendered block |
| Manual | Confirm the render contract and asset agree on the conditionally-mandatory rule and the default-OFF flag, and the grandfather report lists the existing non-conforming renders | contract and asset inspection plus a grandfather report run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The shipped verdict at `handlers/memory-search.ts:1325-1327` | Internal | Green | The fragment and the replay read the shipped verdict, so they break if the shipped shape changes |
| `assessRequestQuality` at `confidence-scoring.ts:433` | Internal | Green | The fragment renders the label it returns, so a label-set change must propagate to the fragment |
| The `isResultConfidenceEnabled` presence gate | Internal | Green | The check keys nothing-to-replay on the same gate, so a confidence-disabled run is not a fidelity failure |
| A captured render corpus for the grandfather report | Internal | Yellow | The default-on flip is gated on a clean grandfather report, which needs a corpus of existing renders to audit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fidelity check false-fires on a faithful render, or the render mandate breaks an existing render path.
- **Procedure**: Leave the default-OFF flags off so the legacy absence-is-valid contract stays live, remove the fragment emit and the check file, and revert the two contract-doc edits. The verdict logic needs no revert because it was never modified.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Render mandate and fragment emit confirmed default-OFF before merge
- [ ] Grandfather report mode proven to list a non-conforming render without failing
- [ ] Dropped-field fail-mode proof staged in the vitest

### Rollback Procedure
1. Leave the default-OFF flags off so the legacy contract stays live
2. Remove the fragment emit from `handlers/memory-search.ts`
3. Remove `check-envelope-fidelity.mjs` and `envelope-fidelity.vitest.ts`
4. Revert the `commands/memory/search.md` and `assets/search_presentation.txt` edits
5. Confirm `confidence-scoring.ts` is untouched because the verdict logic was never modified

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds a render contract rule, a handler fragment and a check file, all flag-gated, with no data migration
<!-- /ANCHOR:enhanced-rollback -->

---
