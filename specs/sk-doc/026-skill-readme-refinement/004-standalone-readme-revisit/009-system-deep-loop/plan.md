---
title: "Implementation Plan: Phase 9 system-deep-loop README rewrite"
description: "Rewrite the system-deep-loop skill README against the refined template from phase 001 and the mcp-obsidian exemplar, purpose-first with HVR enforcement, a version bump to 2.1.0.0 and a changelog entry."
trigger_phrases:
  - "phase 9 plan"
  - "system deep loop readme plan"
  - "deep loop readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop"
    last_updated_at: "2026-08-04T13:37:24Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 9 plan inside 004-standalone-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-system-deep-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 9 system-deep-loop README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/system-deep-loop/README.md` against the refined template from phase 001 and the mcp-obsidian exemplar. The rewrite leads with a one-line human pitch and a problem-first OVERVIEW, keeps every durable fact from the current document, bumps the version field from 2.0.0.0 to 2.1.0.0 and adds a changelog entry at `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md`. No SKILL.md, no other skill README, no hub registry, no template and no vault file is touched. Rollback is a git revert of the README rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README (REQ-006) | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) | rg |
| Link guard | Every link inside the README resolves | rg + check |
| Version field | README frontmatter version reads 2.1.0.0 (REQ-005) | rg |
| Changelog entry | `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md` exists (REQ-005) | ls |
| Diff hygiene | `git diff --check` reports zero whitespace errors | git diff --check |
| Phase docs | validate.sh errors zero on this phase folder (REQ-009) | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/system-deep-loop/README.md` | Rewrite: one-line pitch blockquote, at-a-glance table only if it earns its place per the template, problem-first OVERVIEW, QUICK START, HOW IT WORKS, navigation to the mode packets, VERIFICATION close |
| `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md` | Add: changelog entry with the hub changelog frontmatter shape and a description of the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: the refined template's numbered ALL-CAPS H2 section model with `---` dividers, OVERVIEW as the only required section and the mcp-obsidian README as the reference shape. Any section that does not earn its place in a hub README is dropped and the rest renumbered. Durable facts (invoke routes, mode names, artifact locations) are taken from the current README, `mode-registry.json` and `leaf-manifest.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm the refined template is committed, read the current README and record the baseline (version field, validator output, link state), read the mcp-obsidian exemplar.

### Phase 2: Rewrite

Draft the purpose-first README on the template, bump the version field to 2.1.0.0, write the changelog entry.

### Phase 3: Verification

Readme validator, HVR grep, link guard, section-by-section fact diff, scope diff, `git diff --check`, phase validation.

Sequenced in tasks.md (T001-T014).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas. The link guard resolves every link and a section-by-section diff confirms the durable facts survived. A scope diff confirms only the README, the changelog entry and this phase folder changed. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite against a moving template | Gate on the template being committed (REQ-001) |
| mcp-obsidian exemplar | Shape drift between the exemplar and a hub README | Read the exemplar README before drafting |
| system-deep-loop hub surfaces | Registry and manifest facts in the README drift | Read `mode-registry.json` and `leaf-manifest.json` during the fact check |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no SKILL.md, registry, manifest, template or vault file participates.
<!-- /ANCHOR:rollback -->
