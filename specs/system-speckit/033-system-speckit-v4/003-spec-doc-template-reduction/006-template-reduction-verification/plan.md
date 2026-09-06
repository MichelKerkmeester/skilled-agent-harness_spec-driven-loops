---
title: "Implementation Plan: Phase 6: verify-rollout"
description: "Close out the template-reduction packet with whole-suite snapshots, a deriveStatus fleet delta, fresh dist builds, recursive strict validation, and a no-residue review. This phase verifies the landed changes and makes no new template or validator changes."
trigger_phrases:
  - "verify rollout plan"
  - "template reduction close-out"
  - "deriveStatus fleet delta"
  - "recursive strict validation"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 6: verify-rollout

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown templates, Bash, Node.js, and Vitest |
| **Framework** | system-spec-kit scaffold, snapshot, status, and validation contracts |
| **Storage** | Generated distributions, snapshot output, verification evidence, and packet changelog |
| **Testing** | Whole golden snapshots, deriveStatus comparison, dist freshness, recursive strict validation, and residue scans |

### Overview
Run the authoritative close-out after phases 002 through 005 land: execute the whole golden-snapshot suite, compare `deriveStatus` before and after across a representative shipped fleet, rebuild `scripts/dist/` and `mcp-server/dist/`, and validate fresh L1/L2/L3/L3+ scaffolds plus a shipped legacy packet. Confirm the recursive packet gate is clean, `create.sh` still scaffolds correctly, no false-completion claim remains, and author the rollout changelog only after every gate passes; the phase implementation summary is authored later.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 002 through 005 are the only prerequisites, and this phase makes no new template or validator change.
- [x] The golden snapshot, deriveStatus, create, validate, dist, legacy, and residue surfaces are named.
- [x] The before/after baseline and delta evidence requirement is explicit.

### Definition of Done
- [ ] The whole golden-snapshot suite is green with only intended reviewed re-baselines.
- [ ] The deriveStatus fleet delta is zero and strict validation is clean across fresh levels and legacy coverage.
- [ ] Both distribution trees are fresh, recursive validation is clean, no false completion or residue remains, and the rollout changelog is written.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first close-out gate. Capture real baselines, run the complete verification set, inspect the scoped result, then roll out.

### Key Components
- **Golden snapshots**: `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` and `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` prove rendered output.
- **Status derivation**: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts` supplies the `deriveStatus` before/after comparison.
- **Scaffold and validation commands**: `.opencode/skills/system-spec-kit/scripts/spec/create.sh` and `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` cover fresh output, recursive packet validation, and strict validation.
- **Runtime distributions**: `.opencode/skills/system-spec-kit/scripts/dist/` and `.opencode/skills/system-spec-kit/mcp-server/dist/` must be rebuilt before validation.
- **Rollout record**: `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/changelog/` receives the packet rollout entry after verification; `006-verify-rollout/implementation-summary.md` remains a later artifact.

### Data Flow
Record snapshot and status baselines, run the whole snapshot suite, rebuild both distributions, scaffold every required level, and validate the fresh and legacy packets recursively and strictly. Compare statuses and rendered bytes, scan the scoped result for residue and false completion, then write the rollout changelog only when every requirement passes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 002 through 005 landed and capture the before baseline for rendered bytes and `deriveStatus`.
- [ ] Select a representative shipped L2+ fleet covering L1/L2/L3/L3+ behavior and legacy compatibility, with its packet list recorded.

### Phase 2: Core Implementation
- [ ] Run the whole golden-snapshot suite and review any re-baseline as intended output only.
- [ ] Rebuild `scripts/dist/` and `mcp-server/dist/`, then verify their freshness before invoking validation.
- [ ] Use `create.sh` to scaffold fresh L1, L2, L3, and L3+ packets and retain a shipped legacy packet for comparison.

### Phase 3: Verification
- [ ] Run `validate.sh --recursive --strict` on the parent packet and `validate.sh --strict` on every fresh and legacy target.
- [ ] Compare `deriveStatus` and rendered-byte measurements before and after, requiring a zero status delta and a reported reduction.
- [ ] Scan the scoped result for unrelated files, stray output, and false completion claims before writing the rollout changelog.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Snapshot | Whole scaffold render suite and intended re-baselines | `scaffold-golden-snapshots.vitest.ts` |
| Compatibility | Before/after `deriveStatus` for representative shipped L2+ packets | `graph-metadata-parser.ts` and recorded fleet comparison |
| Scaffold | Fresh L1, L2, L3, and L3+ outputs | `.opencode/skills/system-spec-kit/scripts/spec/create.sh` |
| Validation | Parent recursive gate, fresh levels, and shipped legacy packet | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |
| Hygiene | Scoped diff, stray outputs, and false-completion claims | File inventory and packet status inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002 through 005 | Internal predecessor work | Yellow | Close-out cannot prove the full packet |
| Golden snapshot suite and reviewed baseline | Internal evidence | Green | Rendered regressions remain unverified |
| `deriveStatus` implementation and fleet sample | Internal compatibility evidence | Green | Silent status flips can ship |
| `scripts/dist/` and `mcp-server/dist/` | Generated runtime surfaces | Yellow | Validation may run stale code |
| Fresh and legacy packet fixtures | Validation corpus | Green | Level or compatibility gaps remain |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any snapshot mismatch beyond reviewed re-baselines, nonzero status delta, stale distribution, strict-validation failure, unrelated diff, stray output, or false-completion claim.
- **Procedure**:
  1. Stop rollout and do not author the phase implementation summary.
  2. Remove temporary scaffold outputs and restore any unintended evidence or snapshot changes; leave prior phase source changes untouched for diagnosis.
  3. Rebuild both distributions and rerun the failed gate after the responsible prior phase is corrected.
<!-- /ANCHOR:rollback -->
