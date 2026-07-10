---
title: "Implementation Plan: Phase 14: sk-code Frontmatter Alignment"
description: "Normalize all 88 sk-code reference and asset docs to the canonical frontmatter contract via one assertion-guarded batch patch; largest phase of the 009 campaign."
trigger_phrases:
  - "sk-code frontmatter plan"
  - "frontmatter campaign largest phase"
  - "skill doc contract batch patch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code"
    last_updated_at: "2026-06-11T13:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 88 docs normalized and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-014-sk-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: sk-code Frontmatter Alignment

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
| **Storage** | `.opencode/skills/sk-code/references/**/*.md` (68 docs) + `assets/**/*.md` (20 docs, READMEs exempt) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill sk-code --coverage` + Python local-mode advisor smoke |

### Overview
sk-code is the largest campaign phase: 88 in-scope docs spread over per-surface reference trees (motion_dev, opencode, universal, webflow, router roots) and 4 asset trees. 76 docs carried title+description only; 12 webflow references carried partial detailed blocks (3 of them with 9 trigger phrases, over the 8 cap) and one doc carried a stray `keywords` key. At this scale per-file editing is wasteful, so the phase authors all phrases from a digest sweep (frontmatter + H1 + heading scan per doc) and applies one assertion-guarded Python batch patch.
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
Frontmatter-only normalization: each leading YAML fence is rebuilt with exactly the 5 contract keys (existing title/description lines reused verbatim), body bytes stay untouched behind suffix assertions.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (coverage mode, `--skill sk-code` filter)
- **Digest sweep**: one Python pass emitting frontmatter + H1 + headings + intro per doc, so phrases are authored without full reads of large docs
- **Batch patcher**: single Python script with a per-doc phrase/tier/contextType map and assertion guards (fence present, single-line scalars, 3-8 lowercase multi-word phrases, body suffix unchanged)
- **Tier policy**: `important` for formal contract/invariant docs (verification gates, enforcement, severity contract, router contracts), `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (baseline: 88/88 failing)
2. Digest sweep captures every doc's existing frontmatter, H1, and headings
3. Batch patcher rebuilds all 88 leading fences in one run; non-contract keys (`keywords`) drop out, 9-item phrase lists trim to 8 or fewer, mixed-case/single-word phrases normalize to lowercase multi-word
4. Coverage re-check must report 0 violations for the skill
5. Python local-mode smoke proves an authored phrase routes to sk-code with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (88/88 docs failing; 12 partial blocks, 3 over the 8-phrase cap)
- [x] Digest sweep over all 88 docs (frontmatter + H1 + heading scan, no full reads)

### Phase 2: Core Implementation
- [x] references/motion_dev (7), references/opencode (19), router roots (3), references/universal (4): contract block authored with surface-qualified phrases
- [x] references/webflow (35): net-new blocks plus normalization of the 12 partial blocks (trim 9-phrase lists, lowercase, multi-word); stray `keywords` key dropped from `debugging/error_recovery.md`
- [x] assets (20: motion_dev 2, opencode 12, universal 2, webflow 4): contract block authored; checklist docs phrased as validation checklists
- [x] Tier judgment: 7 docs promoted to `important` (2 router contracts, severity contract, webflow enforcement + verification workflows, 2 verification-gate checklists)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks sk-code first with a doc signal
- [x] git diff confined to frontmatter hunks (88 files)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 88 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill sk-code --coverage` |
| Routing smoke | Authored phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks | `git diff --stat` + sampled hunk review |
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

- **Trigger**: A consumer turns out to depend on the removed `keywords` key, the prior phrase casing, or the prior tier values
- **Procedure**:
  1. `git checkout -- .opencode/skills/sk-code/references/ .opencode/skills/sk-code/assets/` (88 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
