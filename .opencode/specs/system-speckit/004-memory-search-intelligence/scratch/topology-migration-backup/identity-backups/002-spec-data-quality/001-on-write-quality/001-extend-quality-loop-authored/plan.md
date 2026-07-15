---
title: "Implementation Plan: A1 Extend the Live Quality Machinery to Authored Specs"
description: "Wires the shipped pure scorer and the non-mutating post-save reviewer to the authored spec-doc and metadata-JSON write surface through three additive seams and adds a default-off warn CONTENT_QUALITY rule to validate.sh."
trigger_phrases:
  - "a1 extend quality loop authored plan"
  - "computeMemoryQualityScore authored seam"
  - "content quality validate rule plan"
  - "reviewPostSaveQuality workflow seam"
  - "authored write surface quality plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored"
    last_updated_at: "2026-07-04T17:11:59.952Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored PLANNED plan for the H1 H2 H3 seams"
    next_safe_action: "Build H1a graph-metadata at atomicWriteJson, then H1b description at savePerFolderDescription"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-005-001-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Reuse the shipped pure scorer and the non-mutating reviewer, never runQualityLoop"
---
# Implementation Plan: A1 Extend the Live Quality Machinery to Authored Specs

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
| **Language/Stack** | TypeScript (Node scripts and MCP handlers) |
| **Framework** | system-spec-kit scripts plus validate.sh rule registry |
| **Storage** | Authored spec docs and the two metadata JSONs on disk |
| **Testing** | vitest unit checks plus a byte-identity check on the JSONs |

### Overview
This phase reaches the shipped quality machinery into the authored write surface through three additive seams. H1 scores BOTH metadata JSONs at their real write seams report-only: `graph-metadata.json` at the `atomicWriteJson` seam in `generate-context.ts` (`:587`) and `description.json` at the `savePerFolderDescription` seam reached through `runWorkflow` in `workflow.ts` (`:1683`, `:1720`). H2 extends the non-mutating `reviewPostSaveQuality` call already wired in `workflow.ts` (call at `:1855`, dynamic import at `:1854`, a distinct call site from the H1b write seam) to cover the authored spec-doc artifacts. H3 adds a default-off warn `CONTENT_QUALITY` rule to `validate.sh`. No new scorer is written and no body is mutated.
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
Reuse-first additive seams over the shipped quality core. The on-write report-only front door sits ahead of the later B1 sweep and B2 doctor front doors.

### Key Components
- **H1 metadata score**: score BOTH metadata JSONs report-only at their real seams. H1a scores `graph-metadata.json` at the `atomicWriteJson` seam (defined `generate-context.ts:398`, sole call `:587`), where the writer emits its own argument plus a trailing newline, so the call-site payload is the written body. H1b scores `description.json` at the `savePerFolderDescription` seam reached through `runWorkflow` in `workflow.ts` (`:1683`, `:1720`), where the writer emits a MERGED payload from `getDescriptionWritePayload` (`folder-discovery.ts:238,250`), not its argument, so H1b must score the post-merge payload inside or after the merge to keep byte-identity. CAVEAT: `computeMemoryQualityScore` is markdown-body-shaped and degenerates on raw serialized JSON (near-constant anchors, coherence and trigger dimensions, landing every `graph-metadata.json` near 0.54), so H1 projects each metadata payload into a scorer-legible shape rather than pass the serialized bytes verbatim, then reports the score, never writing a body field.
- **H2 reviewer extension**: extend the `reviewPostSaveQuality` call already wired at `workflow.ts:1855` (its dynamic import sits at `:1854`) so the authored spec-doc save artifacts are reviewed alongside the memory artifacts, report-only and non-blocking.
- **H3 validate rule**: a new `scripts/validation/content-quality.ts` rule body registered in `validator-registry.json` next to the existing shape rules at severity `warn`, default-off.

### Data Flow
A save composes each metadata payload and H1 scores the exact bytes each seam writes before reporting. For `graph-metadata.json` that is the `atomicWriteJson` call-site payload. For `description.json` that is the post-merge payload `savePerFolderDescription` builds from `getDescriptionWritePayload`, not the call-site argument. The written bytes stay identical to their pre-scoring state for both JSONs. The authored spec-doc artifacts flow through the existing reviewer wiring under H2. A separate `validate.sh` run exercises the H3 warn rule against the corpus.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `computeMemoryQualityScore` (`quality-loop.ts:392`, export `:747`) | The shipped pure scorer used on memory saves, markdown-body-shaped | Import the one scorer, adapt the JSON input into a scorer-legible shape, never a verbatim pass of raw serialized JSON | grep the import is the pure export and not `runQualityLoop` |
| `reviewPostSaveQuality` (`post-save-review.ts:573`) | The shipped non-mutating reviewer | Extend its `workflow.ts` call to authored artifacts | grep the call site at `workflow.ts:1855` (import at `:1854`) covers spec-doc artifacts |
| `atomicWriteJson` seam (def `generate-context.ts:398`, sole call `:587`) | Writes `graph-metadata.json` as its own argument plus a trailing newline | Score the call-site payload before the write, account for the appended newline, no body change | byte-identity diff of the written `graph-metadata.json` against the call-site payload plus that newline |
| `savePerFolderDescription` seam (`workflow.ts:1683,1720`, via `runWorkflow`) | Writes a MERGED `description.json` from `getDescriptionWritePayload` (`folder-discovery.ts:238,250`), not its argument | Score the post-merge payload inside or after the merge, no body change | byte-identity diff of the written `description.json` against the post-merge payload, not the call-site argument |
| `validator-registry.json` shape rules | Register validate.sh rules | Add `CONTENT_QUALITY` at severity `warn` default-off | run validate.sh against the legacy corpus and confirm exit 0 |
| `runQualityLoop` / `attemptAutoFix` (`quality-loop.ts:582`) | Destructive auto-fix that trims to an 8000-char budget | Not a consumer, never reached | grep proves no new path imports or calls it |

Required inventories:
- Same-class producers: `rg -n 'computeMemoryQualityScore|reviewPostSaveQuality|runQualityLoop|attemptAutoFix' .opencode/skills/system-spec-kit`.
- Consumers of changed symbols: `rg -n 'atomicWriteJson|savePerFolderDescription|reviewPostSaveQuality|CONTENT_QUALITY' . --glob '*.ts' --glob '*.json' --glob '*.sh'`.
- Matrix axes: metadata JSON type (description vs graph-metadata), payload health (well-formed vs malformed), corpus age (new vs legacy).
- Algorithm invariant: the metadata-JSON body written under H1 is byte-identical to the exact bytes scored at each seam (the call-site payload plus trailing newline for `graph-metadata.json`, the post-merge payload for `description.json`), and no path reaches a content-mutating fix.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the shipped exports `computeMemoryQualityScore` and `reviewPostSaveQuality` are importable from the script surface
- [ ] Confirm both metadata-JSON write seams (the `atomicWriteJson` seam in `generate-context.ts` for `graph-metadata.json` and the `savePerFolderDescription` seam in `workflow.ts` for `description.json`) and the `workflow.ts` reviewer call site line up with the spec seams
- [ ] Confirm the `validator-registry.json` shape-rule contract for a new warn rule

### Phase 2: Core Implementation
- [ ] H1a: score `graph-metadata.json` at the `atomicWriteJson` seam (`generate-context.ts:587`) report-only, no body write
- [ ] H1b: score `description.json` at the `savePerFolderDescription` seam (`workflow.ts:1683,1720`, via `runWorkflow`) report-only, no body write
- [ ] H1: score the exact bytes each seam writes (call-site payload plus newline for `graph-metadata.json`, post-merge payload for `description.json`) and adapt the markdown-body-shaped scorer input so the JSON verdict is not degenerate
- [ ] H2: extend the `reviewPostSaveQuality` call in `workflow.ts` to the authored spec-doc artifacts
- [ ] H3: add `content-quality.ts` and register `CONTENT_QUALITY` at severity `warn` default-off

### Phase 3: Verification
- [ ] Byte-identity check on the two metadata JSONs before and after scoring
- [ ] Legacy-corpus run of the warn rule reports a warning and exits 0
- [ ] grep proof that no new path reaches `runQualityLoop` or `attemptAutoFix`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The H1 scorer call returns a score and reports it without a body field | vitest |
| Integration | H2 reviewer covers the authored artifacts and stays non-blocking | vitest plus a save run |
| Manual | validate.sh CONTENT_QUALITY warn against the legacy corpus exits 0 | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026-shared-safe-fix-engine | Internal | Green | A1 is the on-write front door over the same shared core that B1 and B2 reuse |
| Shipped pure scorer and reviewer | Internal | Green | H1 and H2 cannot reuse the shipped exports as the single engine |
| validator-registry.json contract | Internal | Green | H3 cannot register the warn rule next to the shape rules |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A metadata-JSON body changes on write, or any path reaches a content-mutating fix.
- **Procedure**: Revert the H1 H2 H3 changes and restore `validator-registry.json` to drop the rule.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1 (Confirm) ────┘
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
| Core Implementation | Medium | 4-6 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Byte-identity baseline of the two metadata JSONs captured
- [ ] CONTENT_QUALITY rule landed default-off and warn
- [ ] grep guard confirms no path reaches the destructive loop

### Rollback Procedure
1. Drop the `CONTENT_QUALITY` registration from `validator-registry.json`
2. Revert the H1 scoring call and the H2 reviewer extension
3. Re-run validate.sh on the corpus to confirm a clean exit
4. Confirm the two metadata JSONs read byte-identical to baseline

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
