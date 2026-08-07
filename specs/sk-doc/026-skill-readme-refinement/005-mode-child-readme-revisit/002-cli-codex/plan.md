---
title: "Implementation Plan: Phase 002 cli-codex README revisit"
description: "Rewrite the cli-codex skill README purpose-first on the refined template from phase 001, using the mcp-obsidian exemplar as the standard, with a version bump and changelog entry."
trigger_phrases:
  - "phase 002 plan"
  - "cli codex readme plan"
  - "codex readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex"
    last_updated_at: "2026-08-04T13:50:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-cli-codex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 002 cli-codex README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/cli-external-orchestration/cli-codex/README.md` from the older tabular reference-card style to a narrative, purpose-first document on the refined template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite keeps every fact the current README carries, bumps the version field, adds a changelog entry under `changelog/` and validates the result with zero issues. No SKILL.md content, template, other skill README or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | All relative links in the README resolve | link guard |
| Version field | Frontmatter version field present and bumped | rg |
| Changelog entry | Entry exists at `changelog/v<version>.md` | ls |
| Git hygiene | `git diff --check` reports no whitespace errors | git diff |
| Phase docs | `validate.sh` on this phase folder reports zero errors | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/cli-external-orchestration/cli-codex/README.md` | Modify: purpose-first rewrite, one-line pitch, problem-first OVERVIEW, capability sections per the refined template, version bump in frontmatter |
| `.opencode/skills/cli-external-orchestration/cli-codex/changelog/v<version>.md` | Add: changelog entry for the bumped version per the `vX.Y.Z.W.md` convention |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: frontmatter with a bumped version field, one-line pitch blockquote, OVERVIEW with the reader's problem first, capability sections that keep the dispatch lifecycle, the two silent traps, the self-invocation guard, agent routing and reasoning effort, auth pre-flight and memory handback, integration and navigation, troubleshooting, verification and related documents. Facts migrate from the current document unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined README template and the mcp-obsidian exemplar and record their section models. Read the current cli-codex README and record the baseline: version field value, validator output and link state. Tasks T001-T002.

### Phase 2: Implementation

Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW. Bump the version field and add the changelog entry under `changelog/`. Preserve every fact via a section-by-section diff of old versus new README. Tasks T003-T006.

### Phase 3: Verification

Run the README validator and the HVR grep, confirm the link guard, `git diff --check` and the scope diff, then run `validate.sh` on this phase folder and record evidence in checklist.md. Tasks T007-T010.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues), the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body, the link guard confirms every relative link resolves, and `git diff --check` confirms clean whitespace. Fact preservation is proven by a section-by-section diff of old versus new README. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite follows the stale section model | Record the refined template model in setup |
| mcp-obsidian exemplar README | Rewrite misses the pilot standard | Read the exemplar and mirror its narrative order |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Changelog convention | Entry naming drifts from the `vX.Y.Z.W.md` convention | Match the existing changelog folder entries |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, registry, manifest or vault file participates.
<!-- /ANCHOR:rollback -->
