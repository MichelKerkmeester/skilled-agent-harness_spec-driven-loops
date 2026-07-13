---
title: "Implementation Plan: Phase 11: skdoc-doc-conformance"
description: "Plan and record for the sk-doc conformance remediation of deep-alignment's own 83 shipped docs, the snake_case category-folder rename, and the build-state honesty reconcile, each executed against a deterministic validator or a live disk check."
trigger_phrases:
  - "sk-doc conformance plan"
  - "deep-alignment doc remediation plan"
  - "category folder rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/011-skdoc-doc-conformance"
    last_updated_at: "2026-07-12T09:11:00Z"
    last_updated_by: "claude"
    recent_action: "Executed all three remediation lanes and ran the final validator sweep and link check"
    next_safe_action: "Phase complete; no further action required for this phase's own scope"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/feature_catalog/"
      - ".opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-skdoc-doc-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Folder rename scope: category subfolders only under feature_catalog/ and manual_testing_playbook/, matching the operator's stated exception for skill/mode-packet/spec folders and per-feature file slugs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: skdoc-doc-conformance

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
| **Language/Stack** | Markdown (sk-doc-governed documents), git (folder renames plus path-reference rewrites) |
| **Framework** | sk-doc create-* standards (SKILL.md/README/skill/reference templates, DQI validator, `core_standards.md`), the same authority phase 005's own adapter wraps for other skills |
| **Storage** | `.opencode/skills/system-deep-loop/deep-alignment/` (`SKILL.md`, `README.md`, `feature_catalog/`, `manual_testing_playbook/`, `references/`, `changelog/`) |
| **Testing** | `validate_document.py`/`extract_structure.py` sweep across all 83 md docs, plus a full relative-link check across 224 links |

### Overview
A parallel sk-doc conformance audit of `deep-alignment`'s own 83 shipped docs found MAJOR_GAPS: 4 P0, 13 P1, and 11 P2 findings. This phase fixed every deep-alignment-LOCAL gap across `SKILL.md`, `README.md`, `feature_catalog/`, `manual_testing_playbook/`, and `references/`, executed the operator's snake_case category-folder-convention directive for this packet's slice, and reconciled 12 docs' stale build-state claims against the real BUILT-and-REGISTERED state, closing with a clean final validator sweep and link check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] A parallel sk-doc conformance audit ran across all 83 `deep-alignment` markdown docs against their matching create-* standards. Evidence: MAJOR_GAPS verdict, 4 P0, 13 P1, 11 P2, 25 clean.
- [x] The operator's snake_case category-folder-convention directive was read and scoped to this packet's category subfolders, excluding skill/mode-packet/spec folders and per-feature file slugs.
- [x] `/deep:alignment`, both YAML workflows, and `@deep-alignment` were independently verified BUILT and REGISTERED on disk before any build-state doc language was corrected. Evidence: `mode-registry.json`'s `"alignment"` entry confirmed present.

### Definition of Done
- [x] Every deep-alignment-LOCAL P0/P1/P2 finding is remediated. Evidence: see `implementation-summary.md` Verification.
- [x] All 12 category subfolders are renamed to snake_case and all 223 path references are rewritten, with 0 residual kebab-case forms. Evidence: see `implementation-summary.md` Verification.
- [x] All 12 stale build-state docs are corrected, with the two permanent design facts preserved verbatim. Evidence: see `implementation-summary.md` Verification.
- [x] `validate.sh` passes `--strict` with Errors:0 on this phase folder. Evidence: recorded in `implementation-summary.md`'s own run, appended after this document set was authored.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation remediation applied directly against shipped files. No new code or runtime surface, and no change to the mode's own behavior.

### Key Components (built)

**SKILL.md remediation** — added `## 2. SMART ROUTING` (Resource Loading Levels plus Smart Router Pseudocode), added `### ESCALATE IF` under RULES, added `## SUCCESS CRITERIA`, trimmed the frontmatter description from 226 to 120 characters, and replaced the stale REFERENCES placeholder with real links. The validator's `missing_required_section: smart_routing` result flipped from false to true.

**README.md remediation** — added Feature Catalog and Manual Testing Playbook subsections to VERIFICATION.

**feature_catalog remediation** (root index plus 21 leaves) — renamed `#### How It Works` to `#### Current Reality` across 21 entries, added `trigger_phrases` and `last_updated` to the root frontmatter, normalized the Implementation `Layer` and Validation `Type` table columns to the canonical taxonomy (clearing every `off_taxonomy_validation_type` warning across the 21 leaves), added SOURCE METADATA blank lines, and fixed 5 paraphrased trigger_phrases.

**manual_testing_playbook remediation** (31 files) — inserted the required blank line before H3 under TEST EXECUTION, and added feature-catalog cross-reference lines to SOURCE FILES on 17 files, with every added link verified resolving.

**references remediation** (4 contract docs) — renamed `## 1. Purpose` to `## 1. OVERVIEW`, clearing the validator's blocking missing-overview finding on all 4, fixed a JSON-asset hyperlink, and corrected DAB-011's mis-cited "@deep-review Adversarial Self-Check" claim.

**snake_case category-folder rename** — renamed 4 `feature_catalog/` and 8 `manual_testing_playbook/` category subfolders from kebab-case to snake_case via `git mv`, then rewrote 223 path references across 54 files. `behavior_benchmark/` subdirectories stayed unchanged because they were already single-word, not kebab-case. Skill/mode-packet/spec folders and per-feature file slugs stayed hyphenated, per the operator's stated exception. This is the `deep-alignment` slice of a broader repo-wide migration owned by a separate task, which also updates the sk-doc canon templates; this phase did not touch sk-doc templates or other skills.

**Build-state honesty reconcile** — independently verified `/deep:alignment`, both YAML workflows, and `@deep-alignment` are BUILT and REGISTERED on disk (`mode-registry.json`'s `"alignment"` entry present) before touching any doc language. Corrected 12 docs' stale "not yet built" framing to the real state, with the honest caveat that a live run reaching a genuinely converged alignment-report remains the acceptance step. Preserved two permanent design facts verbatim: `remediate-hook.cjs`'s intentional no-op stub, and the intentionally absent live-render known-deviations file (graceful `[]` degradation).

### Data Flow
Not applicable. This phase edits static documentation, not a runtime pipeline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the code-change sense. No production code, script, or runtime behavior changed. The remediation here is documentation-only, checked against a deterministic validator (`validate_document.py`/`extract_structure.py`) and a relative-link check, both fully covered by the Verification table in `implementation-summary.md` rather than a code affected-surfaces matrix.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Ran a parallel sk-doc conformance audit across all 83 `deep-alignment` markdown docs against their matching create-* standards.
- [x] Read the operator's snake_case category-folder-convention directive and scoped it to this packet's category subfolders.
- [x] Independently verified `/deep:alignment`, both YAML workflows, and `@deep-alignment` are BUILT and REGISTERED on disk before touching any build-state doc language.

### Phase 2: Core Implementation
- [x] Remediated `SKILL.md` (5 fixes; validator flipped false to true).
- [x] Remediated `README.md` (VERIFICATION subsections added).
- [x] Remediated `feature_catalog/` root plus 21 leaves (Current Reality rename, frontmatter fields, taxonomy normalization, SOURCE METADATA, trigger_phrases fixes).
- [x] Remediated `manual_testing_playbook/` 31 files (blank-line fix, 17 cross-reference additions).
- [x] Remediated `references/` 4 contract docs (OVERVIEW rename, hyperlink fix, DAB-011 citation correction).
- [x] Renamed 12 category subfolders kebab-case to snake_case via `git mv` and rewrote 223 path references across 54 files.
- [x] Corrected 12 docs' stale build-state framing to the real BUILT-and-REGISTERED state, preserving the two permanent design facts verbatim.

### Phase 3: Verification
- [x] Ran the final validator sweep across all 83 md docs: 71 valid, 12 documented out-of-scope false positives.
- [x] Ran the final relative-link check: 224 links, 0 broken.
- [x] Confirmed 0 residual stale build-state claims outside the two flagged permanent design facts.
- [x] Confirmed 0 residual kebab-case path forms, 0 broken links, and 0 cross-skill contamination from the folder rename.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Result |
|-----------|-------|-------|--------|
| Documentation validator | All 83 `deep-alignment` md docs | `validate_document.py`/`extract_structure.py` sweep | 71/83 valid; 12 known out-of-scope false positives (`behavior_benchmark` missing overview) |
| Link check | All relative links across the packet's docs | Relative-link resolution check | 224 links, 0 broken |
| Manual/live | Category-folder rename | `git mv` plus grep for residual kebab-case forms | 0 residual kebab path forms, 0 broken links, 0 cross-skill contamination |
| Manual/live | Build-state claim reconcile | Cross-check against `mode-registry.json` and live file existence | 12 docs corrected; 2 permanent design facts preserved verbatim |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc create-* standards plus `validate_document.py`/`extract_structure.py` | Internal | Green | Without them, this phase's remediation would have no deterministic standard to check against |
| `mode-registry.json`'s `"alignment"` entry (phases 003/008/009) | Internal | Green | Without it, the build-state honesty reconcile would have no ground truth to verify against |
| Operator's snake_case category-folder-convention directive | External | Green | Without it, the folder rename would have no authorized scope |
| Repo-wide kebab-to-snake_case migration task (separate, also touches sk-doc canon templates) | Internal, out of packet | Deferred/parallel | This phase's rename is the `deep-alignment` slice only; the broader migration proceeds independently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The repo-wide snake_case convention migration task lands a different final folder-naming convention than what this phase applied.
- **Procedure**: `git mv` the 12 renamed category subfolders back to kebab-case and revert the 223 rewritten path references. The sk-doc conformance content fixes (`SKILL.md`/`README.md`/`feature_catalog/`/`manual_testing_playbook/`/`references/`) and the build-state honesty corrections are independent of the folder-naming question and would not need reverting.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
