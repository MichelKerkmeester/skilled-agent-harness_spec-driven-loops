---
title: "Implementation Plan: Phase 013 mcp-obsidian README revisit (verify-only exemplar)"
description: "Verify the mcp-obsidian mode skill README against the refined README template and record the conformance verdict with evidence. Rewrite purpose-first with a version bump and changelog entry only when conformance fails."
trigger_phrases:
  - "phase 13 plan"
  - "mcp obsidian readme plan"
  - "exemplar verify plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 013 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the conformance check per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-mcp-obsidian"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 013 mcp-obsidian README revisit (verify-only exemplar)

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a verify-only pass on `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` against the refined template from phase 001. The phase records a baseline, runs the conformance gates (validator, HVR grep, link guard, version field and changelog entry) and writes the verdict per gate into this phase's checklist. A conformant README stays untouched. A failed gate triggers the scoped rewrite path: purpose-first rewrite per the refined template, version bump, changelog entry and revalidation. No other skill file and no vault file is touched. Rollback on the rewrite path is a git revert of the rewrite commit. The conformant path has nothing to roll back.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator (REQ-006) | Zero issues on the README | validate_document.py --type readme |
| HVR grep (REQ-004) | Zero em dashes, zero semicolons, zero Oxford commas in the README body | rg HVR patterns |
| Link guard (REQ-006) | Every linked path in the README resolves | link guard scan |
| Version field (REQ-005) | Present in the README frontmatter | rg version |
| Changelog entry (REQ-005) | Entry exists at changelog/<version>.md | ls changelog |
| Scope diff (REQ-008) | No out-of-scope file changed and no whitespace errors | git diff --check + git status |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Verify conformance, rewrite only on failure: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections with `---` dividers, HVR-clean prose and a version field |
| `changelog/<version>.md` | Verify presence, add only on failure: per-release entry matching the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the conformance check: the README is compared against the refined template's section model (pitch blockquote, AT A GLANCE, OVERVIEW required and problem-first, numbered ALL-CAPS H2 with dividers) and its validation checklist (command output expectations, link verification and HVR). The verdict per gate lands in checklist.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined template and the current README, record the baseline (version field, validator output, link state). Sequenced as T001-T003 in tasks.md.

### Phase 2: Conformance Check

Run the gates against the refined template and record the verdict per gate. Sequenced as T004-T005 in tasks.md.

### Phase 3: Conditional Rewrite

On failure only: purpose-first rewrite, version bump, changelog entry. Sequenced as T006-T008 in tasks.md.

### Phase 4: Closeout

Revalidate, scope diff, phase validation and metadata regeneration. Sequenced as T009-T013 in tasks.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The README is validated with `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas. The link guard confirms every linked path resolves. `git diff --check` reports no whitespace errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Conformance measured against a moving standard | Read the template first and record its section model (REQ-001) |
| Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist (REQ-006) |
| Parent packet sub-phase order | Predecessor and successor pointers drift | Read the parent sub-phase table before closeout (REQ-008) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The conformant path changes no skill file, so there is nothing to roll back. The rewrite path changes exactly two files (README.md and changelog/<version>.md) in one commit. `git revert` of that commit restores the prior state. Phase docs are additive and need no rollback.
<!-- /ANCHOR:rollback -->
