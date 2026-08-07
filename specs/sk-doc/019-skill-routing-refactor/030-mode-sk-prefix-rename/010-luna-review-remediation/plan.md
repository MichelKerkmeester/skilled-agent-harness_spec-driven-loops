---
title: "Implementation Plan: Remediate LUNA review findings for the sk-prefix rename"
description: "Align both live catalog inventories, make freshness traversal fail closed with deterministic tests, and publish one superseding verification record backed by durable rerun outputs."
trigger_phrases:
  - "LUNA review remediation plan"
  - "catalog registry parity"
  - "freshness traversal failure"
  - "current state verification"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-luna-review-remediation"
    last_updated_at: "2026-07-29T12:41:33Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-luna-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remediate LUNA Review Findings For The Sk-Prefix Rename

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | CommonJS Node.js, Markdown, JSON, Python 3 |
| **Framework** | Self-running Node assertions, sk-doc validators, Lane C benchmark harness |
| **Storage** | Repository files only; no data migration |
| **Testing** | Node `assert`, feature-catalog validation, route-gold replay, metadata freshness gates |

### Overview
Implement four coordinated lanes. First, derive the twelve canonical workflow keys from `mode-registry.json` and update both live catalog inventories. Second, return traversal failures from manifest discovery and fold them into deterministic text/JSON reporting and the exit verdict. Third, run the maintained route-gold and generated-metadata gates into packet-local evidence paths. Fourth, publish a dated current-state record that supersedes phase 008's snapshot without rewriting historical observations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria expressed as four measurable Given/When/Then scenarios
- [x] Dependencies and maintained verification entrypoints confirmed from repository sources

### Definition of Done
- [ ] Both live catalog inventories match all twelve registry keys exactly
- [ ] Freshness regression matrix and existing metadata gates pass
- [ ] Route-gold and generated-metadata rerun outputs are durable and linked
- [ ] Current-state record supersedes the earlier closeout snapshot
- [ ] Phase and recursive parent validation pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Source-projection-evidence pipeline. `mode-registry.json` remains the typed source; catalogs are published consumers; manifest and route-gold gates produce machine evidence; the packet-local verification record is the single narrative authority for the latest run.

### Key Components
- **Catalog inventory**: Publishes the public `workflowMode` set in the root catalog and detailed routing page.
- **Manifest discovery**: Enumerates committed `leaf-manifest.json` roots and now carries traversal errors rather than discarding them.
- **Verification runners**: Produce route-gold and generated-metadata results through maintained CLIs.
- **Current-state record**: Connects the exact rerun outputs to the packet acceptance state and historical supersession boundary.

### Data Flow
Registry keys flow to the two catalog documents and to generated manifests. The freshness walker returns discovered manifest roots plus any failed paths; `run()` checks both, renders both, and fails when either a manifest check or traversal fails. Verification commands write packet-local outputs, which the current-state record links and summarizes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/mode-registry.json` | Canonical twelve-key typed inventory | Unchanged source of truth | Direct set comparison and parent-skill check |
| Root feature catalog | Live public inventory | Replace twelve unprefixed keys | Catalog package validator plus exact set-parity assertion |
| Detailed packet-routing catalog page | Live discriminator explanation | Replace repeated keys and shared-packet wording | Exact set-parity assertion against registry |
| `findManifestDirs()` | Fleet manifest-root discovery | Return roots and structured traversal failures | Injected `EACCES`, multiple-failure, exclusion, and happy-path tests |
| `run()` freshness gate | Text/JSON reporting and exit status | Render traversal failures and include them in failure count | Direct self-running Node test plus fleet invocation |
| Phase 008 and 009 records | Historical closeout/remediation observations | Preserve observations; add current-state pointers | Link check and reviewer trace from old records to new authority |
| Route-gold and metadata gates | Current executable acceptance evidence | Rerun without changing gold or generators | Packet-local JSON/Markdown outputs and exit codes |
| Parent phase packet | Program navigation and status surface | Point phase map/current-state readers to phase 010 evidence | Recursive strict validation and metadata refresh |

**Finding classes:** `R1-P1-001` is cross-consumer, `R3-P1-001` is matrix/evidence, and `R4-P2-001` is class-of-bug.

**Same-class inventory:** both live catalog pages publish the stale keys; adjacent validators do not compare prose to the registry. Other recursive walkers are out of scope unless they call the changed freshness functions.

**Traversal invariant:** every attempted subtree is either read successfully, intentionally excluded before descent, or represented as a stable failure that makes the gate nonzero.

**Regression axes:** root validity, readable versus throwing nested reads, one versus multiple failures, text versus JSON, excluded versus attempted directories, and fresh versus stale manifests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Catalog Alignment
- [ ] Update the root and detailed catalog inventories from the registry key set.
- [ ] Add or execute an exact twelve-key parity check, including `sk-create-skill-parent`.
- [ ] Run catalog document and package validators.

### Phase 2: Freshness Hardening
- [ ] Change discovery to preserve attempted-subtree read failures.
- [ ] Include traversal failures in text/JSON output and exit status.
- [ ] Add focused regression coverage using injected filesystem failures with `finally` restoration.

### Phase 3: Current-State Verification
- [ ] Run sk-doc route-gold and compiled-routing parity into a packet-local evidence directory.
- [ ] Run root-metadata then leaf-freshness gates and retain machine-readable output.
- [ ] Publish `current-state-verification.md` with commands, outputs, results, timestamp, and supersession statement.
- [ ] Add pointers from parent, phase 008, and phase 009 records without rewriting historical results.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Discovery errors, exclusions, stable ordering, output modes, mock restoration | Self-running Node `assert` test |
| Catalog | Root/leaf package integrity and exact workflow-key equality | `validate_document.py`, `validate_catalog_package.py --strict`, parity assertion |
| Integration | Root metadata followed by fleet manifest freshness | `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs` |
| Routing | sk-doc route-gold and compiled-routing parity | `run-skill-benchmark.cjs` plus Lane C vitest suite |
| Documentation | Phase contract and parent integration | `validate.sh --strict`, then `--recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mode-registry.json` | Internal authority | Green | Catalog parity has no canonical comparison set. |
| Node filesystem API | Runtime boundary | Green | Traversal failure cannot be injected or reported. |
| Lane C skill benchmark | Internal verification | Green | Current route-gold acceptance cannot be refreshed. |
| Spec-kit metadata generators | Internal verification | Green | Generated-metadata evidence cannot be refreshed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Catalog parity regresses, ordinary freshness behavior changes, JSON output becomes invalid, or maintained route-gold/metadata gates regress.
- **Procedure**: Revert only the implementation lane that introduced the regression, preserve packet-local evidence for diagnosis, and rerun the pre-change gate for that lane. Do not rewrite historical phase 008/009 results.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Catalog Alignment | Registry inventory | Current-state publication |
| Freshness Hardening | Existing gate and test patterns | Generated-metadata rerun |
| Current-State Verification | Catalog and freshness lanes | Packet closeout and review rerun |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Catalog Alignment | Low | 1-2 hours |
| Freshness Hardening | Medium | 3-5 hours |
| Current-State Verification | Medium | 2-4 hours |
| **Total** | **Medium** | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Preserve the failing command output under the packet evidence directory.
2. Revert the smallest affected lane: catalog prose, freshness implementation/test, or verification pointers.
3. Rerun that lane's focused checks before rerunning the complete matrix.
4. Keep `current-state-verification.md` in draft until all required reruns are green or explicitly record a failed current state.

No data reversal, deployment rollback, or feature flag is required because this work changes repository documentation, CI behavior, and tests only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
