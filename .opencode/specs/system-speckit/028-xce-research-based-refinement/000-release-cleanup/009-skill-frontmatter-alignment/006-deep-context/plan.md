---
title: "Implementation Plan: Phase 6: deep-context Frontmatter Alignment"
description: "Author the canonical frontmatter block on all 11 deep-context reference/asset docs; first net-new authoring phase after the 008 pilot."
trigger_phrases:
  - "deep-context frontmatter plan"
  - "frontmatter net-new authoring"
  - "skill doc contract authoring"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/006-deep-context"
    last_updated_at: "2026-06-11T13:05:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Authoring executed: 11 docs patched and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-006-deep-context"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: deep-context Frontmatter Alignment

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
| **Storage** | `.opencode/skills/deep-context/references/**/*.md` (10 docs) + `assets/context_report_template.md` (1 doc) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill deep-context --coverage` + Python local-mode advisor smoke |

### Overview
deep-context is the first net-new authoring phase: all 11 docs carried title+description only, so the work is composing trigger_phrases, importance_tier, and contextType from each doc's actual content rather than normalizing existing values. Phrases must stay distinctive against sibling deep-* skills (deep-loop-runtime already owns "coverage graph schema" and "deep-loop state format"), so deep-context phrases anchor on its own vocabulary: parallel heterogeneous sweep, stop contract, findings registry, context report.
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
Frontmatter-only authoring: three contract fields are inserted into each leading YAML fence in place, body bytes stay untouched (git diff shows 87 insertions, 0 deletions).

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Phrase sourcing**: section headings, event names, and signal vocabulary from each doc body
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Inventory confirms all 11 docs carry title+description only (clean single-line descriptions, no stray keys)
2. Each doc's leading fence gains trigger_phrases (4-6 items), importance_tier, contextType
3. Coverage-mode check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to deep-context with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory captured: 11 docs (10 references across convergence/guides/protocol/state plus 1 asset), all title+description only
- [x] Sibling phrase audit: deep-loop-runtime's existing phrases noted to keep deep-context phrases distinctive

### Phase 2: Core Implementation
- [x] Convergence docs (4): phrases from the stop contract, coverage-graph flow, recovery paths, and the five signals
- [x] State docs (4): phrases from JSONL records, packet outputs, reducer/registry vocabulary, ownership model
- [x] Protocol + guide + asset (3): phrases from sweep lifecycle, command surface, and the Context Report schema
- [x] Tiers: `important` for `convergence.md` (stop contract) and `loop_protocol.md` (runtime contract); rest `normal`
- [x] contextTypes: `implementation` for runtime docs, `general` for the cheat sheet, `planning` for the report template

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode smoke ranks deep-context first (0.95) on an authored phrase with a doc signal
- [x] git diff confined to frontmatter hunks (insertions only)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 11 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill deep-context --coverage` |
| Routing smoke | Authored phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
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

- **Trigger**: Authored phrases cause routing collisions with sibling deep-* skills, or a consumer rejects the new fields
- **Procedure**:
  1. `git checkout -- .opencode/skills/deep-context/references/ .opencode/skills/deep-context/assets/` (11 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
