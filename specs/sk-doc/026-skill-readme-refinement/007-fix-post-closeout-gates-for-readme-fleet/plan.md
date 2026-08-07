---
title: "Implementation Plan: Fix post-closeout gates for the README fleet"
description: "Classify each global documentation-gate finding, repair real targets, preserve intentional fixtures narrowly, and align the CLI README family with verified contract language."
trigger_phrases:
  - "link guard remediation plan"
  - "frontmatter version remediation"
  - "CLI README alignment plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/007-fix-post-closeout-gates-for-readme-fleet"
    last_updated_at: "2026-08-05T08:05:14Z"
    last_updated_by: "phase-executor"
    recent_action: "Captured remediation design"
    next_safe_action: "Classify all link findings by owner and intent"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
      - ".opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-fix-post-closeout-gates-for-readme-fleet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Fix post-closeout gates for the README fleet

<!-- SPECKIT_LEVEL: 3 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language and stack** | CommonJS link guard, Node-based version tool, Bash gate wrapper, Markdown and YAML frontmatter |
| **Framework** | OpenCode skill packages and Spec Kit phase records |
| **Storage** | Repository files only |
| **Testing** | Link-guard self-test, global link gate, frontmatter-version gate, README validator, strict phase validator |

### Overview

Work from a frozen baseline of 96 link reports in 44 source documents and six missing version fields. Classify each link as a real target repair, intentional template placeholder, or deliberately invalid test fixture. Repair only the first class, add exact policy exceptions for the second and third classes, then rerun the global guard until it reports zero failures.

For the CLI family, compare every README with its local `SKILL.md`. Apply the shared nine-section presentation pattern to all six child modes, give `cli-opencode` an explicit full-runtime identity, and present all five siblings in each comparison table. Use the README validator and changelog discipline as the release gate.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate-3 write authority established at `007-fix-post-closeout-gates-for-readme-fleet`.
- [x] Global baselines captured: 96 link reports and six missing version fields.
- [x] The link guard's exception contract and versioning standard read before edits.
- [x] The CLI hub and `cli-opencode` runtime contracts read before README changes.

### Definition of Done

- [ ] `check-markdown-links.cjs --self-test` exits 0.
- [ ] The repository-wide link guard exits 0 with `0 broken`.
- [ ] The frontmatter-version gate exits 0 with no missing or malformed fields.
- [ ] Each changed CLI README passes `validate_document.py --type readme`.
- [ ] All changed CLI README versions have matching changelog records.
- [ ] Phase and parent metadata are regenerated and strict validation reports zero errors.
- [ ] `git diff --check` reports no whitespace errors.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-driven documentation remediation with a fail-closed guard.

### Key Components

- **Link guard**: Discovers Markdown under active documentation roots, resolves references against source and repository roots, and applies narrow policy exceptions.
- **Source documents**: Own their real links and must point at existing targets.
- **Version tool**: Derives compliant four-part versions from the nearest skill anchor without YAML reserialization.
- **CLI README family**: Uses each mode's `SKILL.md` as the operating-contract authority and the README as its reader-facing guide.
- **Spec packet**: Records scope, decisions, verification evidence, and rollback.

### Data Flow

`baseline guard output -> classification matrix -> source repairs or policy exception -> guard self-test -> global guard -> version derivation -> CLI README validation -> phase validation`.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-markdown-links.cjs` | Whole-repository relative-link guard | Keep active documentation strict while recording only intentional fixture and template exceptions | Self-test and full guard both exit 0 |
| 44 reported Markdown sources | Link producers | Correct source-relative targets or retain permitted copy-time placeholders | Every report disappears from global output |
| Six version-gap documents | In-scope frontmatter consumers | Insert derived four-part versions line-wise | Version gate exits 0 |
| Six CLI child READMEs | Reader-facing executor guides | Align identity, sibling navigation, and release records without editing SKILL contracts | Six README validators exit 0 |
| Parent and phase metadata | Continuity consumers | Add phase-map row and regenerate generated metadata | Strict phase validation has zero errors |

Required inventories:

- Link producers: parse the baseline output and classify every `(source, reference)` pair.
- Link consumers: resolve each candidate target from the source directory before changing the link.
- Policy matrix: source repair, exact template allowlist, or named fixture exclusion.
- README matrix: mode name, unique executor capability, self-invocation boundary, all five siblings, version, and changelog.
<!-- /ANCHOR:affected-surfaces -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Classification

- [x] Create the Level-3 remediation packet.
- [x] Capture the current link and frontmatter-version gate outputs.
- [ ] Classify every link report as a repair, exact template placeholder, or negative fixture.
- [ ] Map the six missing version fields to their local skill anchors.

### Phase 2: Link and Version Remediation

- [ ] Repair every real relative-link target.
- [ ] Add only evidence-backed fixture exclusions and exact template allowlist pairs.
- [ ] Insert derived version fields without reformatting YAML.
- [ ] Run the guard self-test and both global gates after each coherent batch.

### Phase 3: CLI README Alignment

- [ ] Compare all six child README claims with their corresponding `SKILL.md` contracts.
- [ ] Update `cli-opencode` positioning and the full sibling navigation matrix.
- [ ] Align the five remaining child README sibling matrices and reader-facing identity language.
- [ ] Add matching changelog records and validate all six READMEs.

### Phase 4: Verification and Closeout

- [ ] Re-run the complete global gates twice for deterministic results.
- [ ] Regenerate phase and parent metadata.
- [ ] Update task, checklist, decision, implementation summary, and parent phase map with evidence.
- [ ] Run strict phase validation and `git diff --check`.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-style guard test | Inline-code and broken-link detection mechanics | `node .../check-markdown-links.cjs --self-test` |
| Repository integration | All active Markdown links | `node .../check-markdown-links.cjs` |
| Metadata integration | Every in-scope skill document with frontmatter | `bash .../check-frontmatter-versions.sh` |
| Document validation | Six CLI mode READMEs | `python3 .../validate_document.py <README> --type readme` |
| Phase validation | Phase 007 and parent packet records | `bash .../validate.sh <folder> --strict` |
| Diff hygiene | All edited files | `git diff --check` |
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js | Local runtime | Green | Link and version gates cannot run |
| Current repository files | Source of truth | Green | Target resolution and version derivation cannot be verified |
| CLI mode `SKILL.md` files | Documentation authority | Green | README claims cannot be safely aligned |
| Spec Kit generators | Metadata tooling | Green | Generated phase metadata cannot be refreshed |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A repaired target changes a documented contract, a guard exception masks an active defect, or README validation regresses.
- **Procedure**: Use `git restore -- <affected paths>` for the smallest failed batch, rerun the affected gate, and retain the baseline report for comparison.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline and Classification
          |
          v
Link and Version Remediation -----> CLI README Alignment
          |                                  |
          +------------------+---------------+
                             v
                    Verification and Closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline and Classification | None | Link remediation, version remediation, README alignment |
| Link and Version Remediation | Classification | Final verification |
| CLI README Alignment | CLI contract review | Final verification |
| Verification and Closeout | All remediation work | None |
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and Classification | High | 2-3 hours |
| Link and Version Remediation | High | 3-5 hours |
| CLI README Alignment | Medium | 1-2 hours |
| Verification and Closeout | Medium | 1-2 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Baseline output captured in `/tmp/007-link-baseline.txt`.
- [x] Existing file content read before any change.
- [ ] Batch-level diff reviewed before each global rerun.

### Rollback Procedure

1. Restore the failed batch with `git restore -- <paths>`.
2. Re-run the scoped source check and the global guard.
3. Confirm the restored baseline behavior before trying a narrower correction.
4. Record the rejected approach in the decision record when it affects guard policy.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Repository text and guard configuration are restored with Git.
<!-- /ANCHOR:enhanced-rollback -->

---
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
+--------------------+       +---------------------+
| Link classification| ----> | Real link repairs    |
+--------------------+       +---------------------+
          |                           |
          |                           v
          |                   +---------------------+
          +-----------------> | Guard policy repairs |
                              +---------------------+
                                        |
+--------------------+                  |
| Version derivation | -----------------+
+--------------------+                  |
                                        v
                              +---------------------+
                              | Global gate results |
                              +---------------------+
                                        |
+--------------------+                  |
| CLI README review  | -----------------+
+--------------------+                  |
                                        v
                              +---------------------+
                              | Closeout records    |
                              +---------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Classification matrix | Baseline output | Approved action per finding | Link repair |
| Link source repairs | Classification | Resolvable target references | Global link gate |
| Guard exceptions | Fixture or template proof | Narrow policy entries | Global link gate |
| Version derivation | Local skill anchors | Four-part version fields | Version gate |
| CLI README alignment | Mode contracts | Reader-facing consistency | README validators |
| Closeout | All gate results | Validated phase evidence | None |
<!-- /ANCHOR:dependency-graph -->

---
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Classify every link report** - 2 hours - CRITICAL.
2. **Repair real links and scope exceptions** - 3 hours - CRITICAL.
3. **Prove both global gates clean** - 1 hour - CRITICAL.
4. **Align and validate the CLI README family** - 2 hours - CRITICAL.
5. **Regenerate metadata and close the phase** - 1 hour - CRITICAL.

**Total Critical Path**: 9 hours.

**Parallel Opportunities**:

- Version derivation can proceed after source documents are read while link classifications are reviewed.
- CLI README comparison can proceed while independent link source groups are repaired.
<!-- /ANCHOR:critical-path -->

---
<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence baseline classified | Every link report has an approved action class | Phase 1 |
| M2 | Global documentation gates restored | Link and version gates exit 0 | Phase 2 |
| M3 | CLI family aligned | Six README validators and changelog checks pass | Phase 3 |
| M4 | Packet closeout | Strict validation and diff hygiene pass | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the classification matrix and confirm each finding's action class before editing.
- Verify the target file content with a read before any replacement.
- Confirm the owning skill folder for every path before writing.

### Task Execution Rules

- Apply repairs in disjoint batches and re-run the global guard after each batch.
- Never rewrite an intentional fixture or template placeholder as a real link.
- Keep guard policy changes reviewable as a diff, never as a silent directory-wide skip.

### Status Reporting Format

- Report each checkpoint as a gate result: `PASS` with the exact exit output, or `FAIL` with the failing paths and the next action.

### Blocked Task Protocol

- On any gate failure, stop further writes, list the failing paths, and retry with a narrower batch after the cause is confirmed.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Preserve validator signal with narrow exceptions

**Status**: Accepted

**Context**: The global guard must distinguish active broken links from intentionally invalid test fixtures and future-copy template links.

**Decision**: Correct real source links, exclude only named fixture classes, and add exact source-reference allowlist pairs for templates.

**Consequences**:

- The guard stays strict for active documentation.
- Policy configuration grows with a small auditable set of exceptions.
- Broad directory exclusions for active templates are rejected.
