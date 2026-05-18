---
title: "Implementation Plan: Child 002 README marketing rewrite"
description: "Single-file rewrite anchored on exemplar pattern. Voice resemblance allowed per D1; banned words and banned phrases stay banned."
trigger_phrases:
  - "019/002 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/002-readme-problem-first-rewrite"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan with 9-section arc"
    next_safe_action: "Write the README"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000296"
      session_id: "029-002-plan"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Child 002

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | sk-doc readme template (relaxed HVR per D1) |
| **Storage** | n/a |
| **Testing** | grep for banned words/phrases + strict-validate |

### Overview
Single-file rewrite of `system-code-graph/README.md`. Write fresh content section by section, anchored on the structural patterns from the Public root README and the system-spec-kit README. Per D1, allow stylistic carries (em dashes, semicolons, Oxford commas) while keeping banned words and banned phrases out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research §11 section-by-section plan available
- [x] Exemplar READMEs sampled for voice
- [x] D1 voice rule confirmed (accept resemblance)

### Definition of Done
- [ ] README rewritten with 9 sections (TOC + OVERVIEW + QUICK START + FEATURES + STRUCTURE + CONFIGURATION + USAGE EXAMPLES + TROUBLESHOOTING + FAQ + RELATED DOCUMENTS)
- [ ] Problem hook present in §1
- [ ] Key Statistics table present
- [ ] 3-column comparison table present
- [ ] HVR banned-word + banned-phrase grep clean
- [ ] Strict-validate child 002 + parent 019 exits 0
- [ ] Commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Section-by-section markdown authoring. No new abstractions.

### Key Components
- Existing `mcp_server/tool-schemas.ts` for accurate tool count and names
- Existing `ARCHITECTURE.md` for accurate component descriptions
- Existing `SKILL.md` (child-001 just shipped) for canonical terminology

### Data Flow
Exemplar voice + research §11 plan → section drafts → assembled README → grep + validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Sampled root README §1 OVERVIEW (lines 49-72) for hook pattern
- [x] Sampled system-spec-kit §1 OVERVIEW for two-problem hook pattern
- [x] Confirmed tool count 11, MCP namespace `mcp__mk_code_index__*`

### Phase 2: Core Implementation
- [ ] Author frontmatter + tagline blockquote
- [ ] Author TOC (double-dash anchors)
- [ ] Author §1 OVERVIEW (problem hook + solution + Key Statistics + comparison + cross-skill integration)
- [ ] Author §2 QUICK START (boot + verify + first scan + first query + impact example)
- [ ] Author §3 FEATURES (per-tool capability summary)
- [ ] Author §4 STRUCTURE (directory tree + key file pointers)
- [ ] Author §5 CONFIGURATION (env vars + maintainer mode + runtime configs)
- [ ] Author §6 USAGE EXAMPLES (3-4 concrete scenarios)
- [ ] Author §7 TROUBLESHOOTING (readiness blocked, parser quarantine, missing dist)
- [ ] Author §8 FAQ
- [ ] Author §9 RELATED DOCUMENTS

### Phase 3: Verification
- [ ] grep for banned words: `leverage|empower|seamless|disrupt|harness|delve|realm|cutting-edge|game-changer|revolutionise`
- [ ] grep for banned phrases: `It's important to|Dive into|When it comes to|Let me be clear|In today's world`
- [ ] Strict-validate child 002 exits 0
- [ ] Strict-validate parent 019 exits 0
- [ ] Fill implementation-summary.md with verification evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Banned-word grep | README only | `grep -inE` |
| Banned-phrase grep | README only | `grep -inE` |
| Strict-validate | child 002 + parent 019 | `validate.sh --strict` |
| Spot-read | Section structure | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 shipped (canonical terminology in SKILL.md) | Internal | Done at commit 8142b8d02 | Required for D5 sequential rule |
| tool-schemas.ts | Internal | Stable | Authoritative tool count |
| Voice exemplars | Internal | Stable | Anchors structural patterns |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh fails or banned-word grep still has hits
- **Procedure**: `git checkout -- .opencode/skills/system-code-graph/README.md` and re-attempt
<!-- /ANCHOR:rollback -->
