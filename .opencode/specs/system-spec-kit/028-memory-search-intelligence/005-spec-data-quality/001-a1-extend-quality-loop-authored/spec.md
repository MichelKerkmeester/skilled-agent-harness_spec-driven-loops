---
title: "Feature Specification: A1 Extend the Live Quality Machinery to Authored Specs"
description: "A live default-ON quality scorer and post-save reviewer run on memory saves but never reach the authored spec-doc and metadata-JSON write surface. This phase wires the pure scorer and non-mutating reviewer to that surface and adds a CONTENT_QUALITY validate.sh rule."
trigger_phrases:
  - "a1 extend quality loop authored"
  - "computeMemoryQualityScore authored docs"
  - "content quality validate rule"
  - "reviewPostSaveQuality spec docs"
  - "authored write surface quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-a1-extend-quality-loop-authored"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Created PENDING A1 keystone implementation spec from the converged research"
    next_safe_action: "Plan the H1 H2 H3 seams before any code edit"
    blockers: []
    key_files:
      - "spec.md"
      - "../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-005-001-a1-extend-quality-loop-authored"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Reuse the pure scorer plus the non-mutating reviewer, never the destructive runQualityLoop"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: A1 Extend the Live Quality Machinery to Authored Specs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | PENDING |
| **Created** | 2026-06-21 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/005-spec-data-quality` |
| **Phase** | 001 |
| **Tier** | A (on-write, reuse-first, floor-bypassing) |
| **Verdict** | GO-on-cost (the Tier A keystone, while A4 is the only measured unconditional GO) |
| **Source** | `../research/research.md` sections 2 (Tier A), 4 (build seams), 5 (governance) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A verify-fix-verify quality loop already runs LIVE and default-ON on the memory-save path. Its pure scorer `computeMemoryQualityScore` ships at `mcp_server/handlers/quality-loop.ts:392` and exports at `:747`, and the non-mutating reviewer `reviewPostSaveQuality` ships at `scripts/core/post-save-review.ts:573`. That machinery never reaches the authored spec-doc and metadata-JSON surface it is meant to protect. The two metadata JSONs are written through two distinct seams inside the same `generate-context.js` save run, both with no quality score attached. `graph-metadata.json` is written by `atomicWriteJson` (defined at `scripts/memory/generate-context.ts:398`, sole call site `:587` inside `updatePhaseParentPointer`). `description.json` is written by `savePerFolderDescription` from the `@spec-kit/mcp-server/api` surface, invoked inside `runWorkflow` in `scripts/core/workflow.ts` (`:1683` and `:1720`), which `generate-context.ts` reaches by calling `runWorkflow` at `:885`. Neither seam is `atomicWriteJson` for `description.json`, so a single-seam framing covers only half the scope. And `validate.sh` has no rule that scores authored content quality. The result is that the spec corpus that feeds retrieval and AI adherence ships unscored while the much smaller memory surface is scored on every save.

### Purpose
Extend the SHIPPED quality machinery to the authored write surface through three additive seams so authored docs and metadata JSONs earn a quality score and a validate.sh gate, with zero new scorer and zero body mutation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- H1: score BOTH metadata JSONs at their real write seams using the PURE `computeMemoryQualityScore`, report-only, attach the score, never mutate either JSON body. H1a scores `graph-metadata.json` at the `atomicWriteJson` seam in `generate-context.ts` (`:587`), where `atomicWriteJson` writes its own argument plus a trailing newline, so the call-site payload is the written body once that newline is accounted for. H1b scores `description.json` at the `savePerFolderDescription` seam reached through `runWorkflow` in `workflow.ts`, where the writer does NOT write its argument. `savePerFolderDescription` builds a merged payload through `getDescriptionWritePayload` (it merges the incoming argument against the existing on-disk `description.json` plus canonical fields at `folder-discovery.ts:238,250`) before writing, so byte-identity for H1b can only hold against that post-merge payload scored inside or after the merge, never against the `regenerated` or `sequenceSnapshot` call-site argument.
- H2: extend the existing non-mutating post-save reviewer where it already runs in `workflow.ts` so the authored spec-doc save artifacts are reviewed alongside the memory artifacts.
- H3: add a `CONTENT_QUALITY` rule to `validate.sh` via a new `scripts/validation/content-quality.ts` registered in `validator-registry.json` next to the existing shape rules, default-off and warn so the legacy corpus never breaks.
- Reuse the shipped scorers as the single scoring engine. Add no second or parallel scorer. CAVEAT for the JSON surface: `computeMemoryQualityScore` is markdown-body-shaped, so a verbatim pass of serialized metadata JSON is degenerate. Three of its four dimensions read near-constant on JSON (anchors fall to the neutral 0.5 with no `<!-- ANCHOR -->` tags, coherence caps at 0.75 with no markdown heading and triggers read 0 because the JSON stores snake_case `trigger_phrases` while the scorer reads camelCase `triggerPhrases`), so every `graph-metadata.json` lands near 0.54 for structural reasons unrelated to quality. H1 therefore needs an input adaptation that projects the metadata into a scorer-legible shape, not a verbatim pass of the serialized bytes. The markdown spec-doc artifacts under H2 are already markdown bodies, so they reuse the scorer without that adaptation.

### Out of Scope
- The DESTRUCTIVE `runQualityLoop` at `quality-loop.ts:582`. Its `attemptAutoFix` trims content by `substring` to an 8000-char budget, and the 005 `spec.md` is 10.6KB, so wiring it onto authored docs would silently amputate the body. Reason: a fix touching an authored body is never `safe` (research INV-1).
- Any content-mutating auto-fix. The HVR style swap (A6), the description regenerate (A2), and the enum normalize (A3) are separate detectors in later phases.
- The B1 scheduled sweep, the B2 doctor front door, and every Tier C retrieval candidate. This phase is the on-write report-only front door only.
- Promoting `DESCRIPTION_SHAPE` or `GRAPH_METADATA_SHAPE` warn to error. That is A4, a separate phase with its own backfill-to-zero migration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modify later | H1a: at the `atomicWriteJson` seam (def `:398`, sole call `:587`) call `computeMemoryQualityScore` on the serialized `graph-metadata.json` payload and report the score, no body write |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modify later | H1b: score the post-merge `description.json` payload that `savePerFolderDescription` writes (merged by `getDescriptionWritePayload`, `folder-discovery.ts:238,250`), not the call-site argument, reached through `runWorkflow` (`:1683`, `:1720`), report the score, no body write |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modify later | H2: extend the `reviewPostSaveQuality` call already wired at `:1855` (dynamic import at `:1854`) to cover the authored spec-doc artifacts |
| `.opencode/skills/system-spec-kit/scripts/validation/content-quality.ts` | Create later | H3: the `CONTENT_QUALITY` rule body, default-off and warn |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify later | Register the new rule next to the shape rules with severity `warn` |
| `spec.md` | Create | Defines this phase scope and acceptance criteria |
| `plan.md` | Create | Defines the H1 H2 H3 build approach and verification route |
| `tasks.md` | Create | Keeps all build work PENDING |
| `checklist.md` | Create | Keeps all verification items PENDING |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | H1 scores BOTH metadata JSONs without mutating either | WHEN a save writes `graph-metadata.json` via `atomicWriteJson` (`generate-context.ts:587`) AND WHEN it writes `description.json` via `savePerFolderDescription` through `runWorkflow` (`workflow.ts:1683,1720`), THE SYSTEM SHALL score the exact bytes each seam writes and report the score, with each written JSON body byte-identical to its pre-scoring state. SEAM ASYMMETRY: `atomicWriteJson` writes its own argument plus a trailing newline, so H1a scores the call-site payload directly. `savePerFolderDescription` writes a MERGED payload from `getDescriptionWritePayload` (`folder-discovery.ts:238,250`), not its argument, so H1b SHALL score that post-merge payload inside or after the merge, never the `regenerated` or `sequenceSnapshot` call-site argument. SCORER ADAPTATION: because `computeMemoryQualityScore` is markdown-body-shaped, H1 SHALL project each metadata payload into a scorer-legible shape rather than pass raw serialized JSON, otherwise the verdict is structurally degenerate near 0.54 |
| REQ-002 | The destructive auto-fix path is never reached | No code path added by this phase calls `runQualityLoop` or `attemptAutoFix`, and only `computeMemoryQualityScore` and `reviewPostSaveQuality` are imported |
| REQ-003 | H2 reviews the authored spec-doc artifacts | THE SYSTEM SHALL pass the authored spec-doc save artifacts to `reviewPostSaveQuality` through the existing `workflow.ts` reviewer wiring, report-only, non-blocking |
| REQ-004 | H3 adds a default-off warn CONTENT_QUALITY rule | `validate.sh` exposes a `CONTENT_QUALITY` rule registered in `validator-registry.json` at severity `warn`, and running it against the legacy corpus blocks nothing |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | One scorer, adapted input, no second scorer | THE SYSTEM SHALL reuse the shipped `computeMemoryQualityScore` as the only scoring engine and SHALL NOT introduce a second or parallel quality scorer (research Tier D NO-GO). On the metadata-JSON surface THE SYSTEM SHALL adapt the scorer INPUT into a scorer-legible shape rather than reuse it verbatim on raw serialized JSON, because the shipped scorer is markdown-body-shaped and degenerates on JSON |
| REQ-006 | The rule reads next to the existing shape rules | The `content-quality.ts` rule follows the same registry contract as `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE`, so a later A4 warn-to-error flip reuses the same migration discipline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both metadata JSONs carry a reported quality score on write with both bodies unchanged. `graph-metadata.json` is scored on the `atomicWriteJson` call-site payload and `description.json` on the post-merge payload that `savePerFolderDescription` actually writes.
- The authored spec-doc save artifacts pass through the non-mutating reviewer in `workflow.ts`.
- `validate.sh` runs a `CONTENT_QUALITY` warn rule that the legacy corpus passes.
- No code path reaches `runQualityLoop` or any content-mutating fix.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-a1-extend-quality-loop-authored --strict` exits 0 on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 026-shared-safe-fix-engine | A1 is the on-write front door over the same shared core that B1 and B2 reuse | Build the pure score-and-review path here, keep the engine seam compatible with the later front doors |
| Dependency | The shipped scorers | H1 and H2 reuse `computeMemoryQualityScore` and `reviewPostSaveQuality` as-is | Import only the pure and non-mutating exports, never `runQualityLoop` |
| Risk | Accidental body mutation through the wrong import | Wiring the destructive loop would amputate a 10.6KB spec to an 8000-char budget | INV-1 wrapper that throws on full-auto, quarantine the budget-trim to memory-save only |
| Risk | A new hard rule breaking the legacy corpus | An error-tier rule on day one would fail every existing packet | Land `CONTENT_QUALITY` default-off and warn, defer any warn-to-error flip to a backfill-to-zero migration in a later phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- The change is additive and report-only. No authored body and no metadata-JSON body is mutated by this phase.
- The score computation reuses the one shipped pure scorer, so no second scorer can drift from the memory-surface engine. On the markdown spec-doc surface the verdict matches the memory surface directly. On the metadata-JSON surface the scorer is markdown-body-shaped, so the input is adapted into a scorer-legible shape before scoring, which keeps the JSON verdict meaningful rather than the near-constant 0.54 a verbatim JSON pass produces.
- The new validate.sh rule is default-off and warn, so default-off byte-identity of every existing packet is preserved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A metadata JSON that is malformed at either write seam (the `atomicWriteJson` seam for `graph-metadata.json` or the `savePerFolderDescription` seam for `description.json`) must still write, with the score reported as unavailable rather than blocking the write.
- A spec-doc save with no `_memory` block is a supplementary doc and is not scanned by the continuity rules, so the reviewer must score its content quality without assuming a continuity block.
- A spec body larger than the memory-save budget must be scored in full and never trimmed, which is the exact reason `runQualityLoop` is out of scope.
- A legacy packet that fails the new warn rule must report a warning and exit 0, never block, until a separate backfill-to-zero migration precedes any error-tier flip.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Small | Two modified scripts, one new rule file, one registry entry |
| Risk | Medium | The hazard is reaching the destructive loop or mutating a body, both guarded by INV-1 |
| Verification | Medium | Needs a byte-identity check on the JSONs plus a legacy-corpus warn-not-block check |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the reported JSON score be persisted as a first-class field or kept report-only? This phase reports only. Persisting it as a field is the A8 governance scope, not A1.
<!-- /ANCHOR:questions -->
