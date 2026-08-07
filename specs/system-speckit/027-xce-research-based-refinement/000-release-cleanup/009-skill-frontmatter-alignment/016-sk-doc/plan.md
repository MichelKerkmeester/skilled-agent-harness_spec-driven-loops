---
title: "Implementation Plan: Phase 16: sk-doc Frontmatter Alignment"
description: "Normalize all 39 sk-doc reference/asset docs to the canonical contract AND reconcile sk-doc's own frontmatter guidance with the new mechanism."
trigger_phrases:
  - "sk-doc frontmatter plan"
  - "sk-doc guidance reconciliation"
  - "skill doc contract final phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 39 docs normalized and guidance reconciled"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-016-sk-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: sk-doc Frontmatter Alignment

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
| **Language/Stack** | Markdown YAML frontmatter + targeted body edits |
| **Framework** | Canonical contract from 001 (operator Option B, 2026-06-11) |
| **Storage** | `.opencode/skills/sk-doc/references/**/*.md` + `assets/**/*.md` (39 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill sk-doc --coverage` + Python local-mode advisor smoke |

### Overview
sk-doc is the final and most nuanced campaign phase because it owns two jobs: normalize its own 39 docs (Part 1) and reconcile its prescriptive guidance, since sk-doc's assets teach frontmatter practice to every other skill (Part 2). The old guidance said knowledge files must never carry frontmatter; the new contract requires the full 5-field block on every skill reference/asset doc, harvested by the Skill Advisor while Spec Kit Memory deliberately excludes skill docs.
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
Two-part change: assertion-guarded frontmatter patches for Part 1, surgical body edits for Part 2 guidance reconciliation. Template-skeleton fences are classified before any patch (own-metadata vs copyable skeleton).

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (coverage mode, `--skill sk-doc`)
- **Tier policy**: `important` for formal rule/contract docs (hvr_rules, core_standards, evergreen_packet_id_rule, validation, benchmark_creation, frontmatter_templates), `normal` default
- **Guidance home**: `assets/frontmatter_templates.md` becomes the canonical Skill Reference/Asset entry (template + validation rules + field reference)
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates the 39-doc worklist
2. Part 1: 28 docs get the 3 missing fields appended (readme_creation gets the 2 it lacks); 7 frontmatter-less docs get a full prepended block; benchmark_creation trims 12 phrases to 8; 2 benchmark skeletons get an enum fix only
3. Part 2: frontmatter_templates gains the Skill Reference/Asset doc type and drops the knowledge-NEVER rule; reference/asset template skeletons teach the 5-field block; stale memory-search claims rewritten to advisor doc harvest; skill_creation gains a contract pointer
4. Coverage re-check must report 0 violations; Python local-mode smoke proves an authored phrase routes to sk-doc with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (39/39 docs failing; 7 with no frontmatter, 2 with copyable skeleton fences)
- [x] Template-skeleton triage: benchmark templates carry copyable `{{PLACEHOLDER}}` fences as their leading block; the documented `cp` workflow depends on them, so they get in-place enum fixes, not restructuring

### Phase 2: Core Implementation
- [x] Part 1: 39 docs normalized (append, prepend, trim, enum-fix paths per doc class)
- [x] Part 2: frontmatter_templates.md reconciled (doc-type tables, decision trees, §3 field reference, §4 template entry, §5 validation rules, §6/§7/§9/§10 sweeps)
- [x] Part 2: skill_reference_template.md + skill_asset_template.md skeletons now scaffold the 5-field block
- [x] Part 2: stale memory-search claims fixed in feature_catalog_snippet_template.md and feature_catalog_creation.md; skill_creation.md gains the contract pointer

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke surfaces sk-doc with a `(signal)` reason
- [x] git diff confined to frontmatter hunks except the six in-scope Part 2 body-edit files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 39 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill sk-doc --coverage` |
| Routing smoke | Authored phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Stale-claim sweep | No skill-doc memory-search claims remain | `grep -rn "memory search\|memory_search\|Spec Kit Memory"` over references/ + assets/ |
| Diff hygiene | Frontmatter-only hunks outside the Part 2 file set | `git diff --numstat` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 contract decision | Internal | Green | Cannot normalize without a fixed contract |
| Contract checker script | Internal | Green | No deterministic per-skill verification |
| Live daemon matchedDocs smoke | Internal | Deferred | Covered campaign-wide by packet 145 T025 after session-cycle adoption |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer turns out to depend on the prior frontmatter values, or the new guidance conflicts with another doc-type contract
- **Procedure**:
  1. `git checkout -- .opencode/skills/sk-doc/references/ .opencode/skills/sk-doc/assets/`
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
