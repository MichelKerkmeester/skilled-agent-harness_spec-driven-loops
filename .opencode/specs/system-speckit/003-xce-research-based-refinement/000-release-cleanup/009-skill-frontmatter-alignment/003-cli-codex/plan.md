---
title: "Implementation Plan: Phase 3: cli-codex Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto all 7 cli-codex reference/asset docs; 6 net-new blocks plus 1 partial-block completion."
trigger_phrases:
  - "cli-codex frontmatter plan"
  - "codex doc contract authoring"
  - "skill doc frontmatter campaign"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/003-cli-codex"
    last_updated_at: "2026-06-11T09:37:05Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 7 docs authored and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-003-cli-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: cli-codex Frontmatter Alignment

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
| **Language/Stack** | Markdown YAML frontmatter only |
| **Framework** | Canonical contract from 001 (operator Option B, 2026-06-11) |
| **Storage** | `.opencode/skills/cli-codex/references/*.md` (5 docs) + `assets/*.md` (2 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill cli-codex --coverage` + Python local-mode advisor smoke |

### Overview
Unlike the pilot (pure normalization), cli-codex is mostly net-new authoring: 6 of 7 docs carry title+description only, so trigger phrases, tier, and contextType must be derived from each doc body. The one partial block (`hook_contract.md`) already has 4 accurate trigger phrases and only lacks the two enum fields.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Frontmatter-only authoring: each doc body is read first, then the leading YAML fence is extended in place; body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Phrase policy**: 3-8 lowercase multi-word phrases per doc, codex-prefixed to stay distinctive against sibling cli-* skills
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode baseline enumerates per-doc violations (7/7 failing)
2. Each doc body is read; phrases/tier/contextType are derived from actual content
3. Each leading fence is patched; existing accurate title/description kept
4. Coverage re-check must report 0 violations for the skill
5. Python local-mode smoke proves an authored phrase routes to cli-codex with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (7/7 docs failing; 6 missing the full block, hook_contract missing only tier + contextType)
- [x] All 7 doc bodies read to ground trigger-phrase derivation

### Phase 2: Core Implementation
- [x] `cli_reference.md`: full block added; tier `important` (binary flag/invocation contract), contextType `implementation`
- [x] `hook_contract.md`: kept existing 4 phrases; added tier `important` (formal hook contract), contextType `implementation`
- [x] `agent_delegation.md`, `codex_tools.md`: full block added; `normal` / `implementation`
- [x] `integration_patterns.md`: full block added; `normal` / `planning` (workflow pattern guide)
- [x] `prompt_quality_card.md`, `prompt_templates.md` (assets): full block added; `normal` / `implementation`

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks cli-codex first with a doc signal
- [x] git diff confined to frontmatter hunks (insertions only)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 7 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill cli-codex --coverage` |
| Routing smoke | Authored doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks | `git diff` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 contract decision | Internal | Green | Cannot author without a fixed contract |
| Contract checker script | Internal | Green | No deterministic per-skill verification |
| Live daemon matchedDocs smoke | Internal | Deferred | Covered campaign-wide by packet 145 T025 after session-cycle adoption |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer turns out to depend on the prior minimal frontmatter or the authored phrases mis-route sibling cli-* requests
- **Procedure**:
  1. `git checkout -- .opencode/skills/cli-codex/references/ .opencode/skills/cli-codex/assets/` (7 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
