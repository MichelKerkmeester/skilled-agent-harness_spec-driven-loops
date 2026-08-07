---
title: "Implementation Plan: Phase 020 sk-design-mcp-open-design README revisit"
description: "Rewrite the sk-design-mcp-open-design README purpose-first per the refined README template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 20 plan"
  - "open design readme plan"
  - "sk-design-mcp-open-design plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/020-sk-design-mcp-open-design"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 020 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/020-sk-design-mcp-open-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 020 sk-design-mcp-open-design README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-design/sk-design-mcp-open-design/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The phase records a baseline first (version field, validator output, link state), runs a conformance scan to fix the rewrite scope, rewrites with a one-line pitch and a problem-first OVERVIEW, bumps the version field, adds the matching changelog entry and validates the result. No SKILL.md file and no other file in the skill folder is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator (REQ-006) | Zero issues on the README | validate_document.py --type readme |
| HVR grep (REQ-004) | Zero em dashes, zero semicolons, zero Oxford commas in the README body | rg HVR patterns |
| Link guard (REQ-006) | Every linked path in the README resolves | link guard scan |
| Version field (REQ-005) | Bumped version present in the README frontmatter | rg version |
| Changelog entry (REQ-005) | Entry exists at changelog/<version>.md | ls changelog |
| Scope diff (REQ-008) | No out-of-scope file changed and no whitespace errors | git diff --check + git status |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections with `---` dividers, HVR-clean prose and a bumped version field |
| `changelog/<version>.md` | Add: per-release entry matching the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: the README follows the refined template section model (pitch blockquote, AT A GLANCE, OVERVIEW required and problem-first, numbered ALL-CAPS H2 with dividers) and the mcp-obsidian README is the worked example. The conformance scan compares the current body against that model and fixes the rewrite scope before drafting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Refined README template read and its section model recorded: pitch blockquote, AT A GLANCE first, OVERVIEW required and problem-first, numbered ALL-CAPS H2 with `---` dividers, capability section pattern, HVR enforcement, versioning (T001)
- Current README baseline recorded: `version: 1.4.0.11`, `validate_document.py --type readme` exit `0` with `0` issues, `8/8` relative links resolve (T002)
- mcp-obsidian exemplar read and its purpose-first patterns recorded (T003)
- Parent sub-phase order confirmed from `../spec.md`: predecessor `019-sk-design-interface`, successor `021-sk-design-md-generator` (T004)

### Phase 2: Implementation
- Conformance scan run against the refined template: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections and `---` dividers, required-section rule (T005)
- README rewritten purpose-first with a one-line pitch and a problem-first OVERVIEW, using the mcp-obsidian README as the exemplar (T006)
- Frontmatter version bumped from `1.4.0.11` to `1.5.0.0`, re-aligning with the SKILL.md field (T007)
- `changelog/v1.5.0.0.md` entry added covering the rewrite (T008)

### Phase 3: Verification
- `validate_document.py --type readme` reports `0` issues, HVR greps return `0` em dashes, `0` semicolons and `0` Oxford commas, link guard `8/8` clean and `git diff --check` clean (T009, T010, T011)
- `validate.sh --strict` on this phase folder reports zero errors and the phase metadata is regenerated (T012, T013)
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
| Refined README template (phase 001) | Rewrite against a moving standard | Read the template first and record its section model (REQ-001) |
| Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| mcp-obsidian exemplar README | Exemplar shape drifts from the refined template | Read the exemplar README before drafting (REQ-003) |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist (REQ-006) |
| Parent packet sub-phase order | Predecessor and successor pointers drift | Read the parent sub-phase table before closeout (REQ-008) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase changes exactly two skill files (README.md and changelog/<version>.md) in one commit. `git revert` of that commit restores the prior state. Phase docs are additive and need no rollback.
<!-- /ANCHOR:rollback -->
