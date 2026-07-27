---
title: "Implementation Plan: Cursor agents/skills/rules parity"
description: "Resolve the UserPromptSubmit skill-advisor-equivalent-context question first, then populate .cursor/rules/*.md and record the agents/commands non-applicability decisions."
trigger_phrases:
  - "cursor agents skills rules parity plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Read UserPromptSubmit hook source before writing rules content."
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (rules content), documentation |
| **Framework** | Cursor CLI `cursor-agent rule`/`generate-rule`, `.cursor/hooks.json` |
| **Testing** | Source read + manual CLI invocation |

### Overview
Read the `.cursor/hooks.json` `UserPromptSubmit` hook's actual source to resolve whether it already injects skill-advisor-equivalent context, then populate `.cursor/rules/*.md` informed by that answer, and record the agents/commands non-applicability decisions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` states the open question and the task-ordering requirement to resolve it first.]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines five command/citation-backed outcomes.]
- [x] Dependencies identified. [EVIDENCE: phase 004 provides the hook source this phase reads.]

### Definition of Done
- [ ] All acceptance criteria met. [EVIDENCE: pending implementation.]
- [ ] UserPromptSubmit question resolved with a cited source read. [EVIDENCE: pending implementation.]
- [ ] `.cursor/rules/*.md` populated with non-duplicative content. [EVIDENCE: pending implementation.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-before-write ordering: resolve the open question from actual source first, then build the rules content informed by that answer — mirroring the live-probe-before-build discipline used elsewhere in the sibling Devin packet.

### Key Components
- **Source-read step**: read `.cursor/hooks.json`'s `UserPromptSubmit` handler implementation directly.
- **Rules content**: `.cursor/rules/*.md`, scoped to whatever the hook does not already cover.
- **Decision record**: explicit non-applicability notes for agents and commands, mirroring the Devin-side sibling phase's decisions.

### Data Flow
Cursor dispatches `UserPromptSubmit` on every prompt; if it already injects advisor-equivalent context, that context reaches the session before any rules file is consulted. `.cursor/rules/*.md` is a separate, static mechanism `cursor-agent rule`/`generate-rule` reads independently — the two are not mutually exclusive, but their content must not duplicate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.cursor/hooks.json` `UserPromptSubmit` handler | Unknown scope (open question) | Read only, no modification | Source citation in `implementation-summary.md` |
| `.cursor/rules/*.md` | Does not exist (0 files) | Create | Non-overlap check against the hook's injected content |
| `cli-external-orchestration/cli-cursor/SKILL.md` | No agents/commands decision recorded | Add explicit decision notes | Manual review |

Matrix axes: mechanism (rules/agents/commands), status (gap/non-concept), question state (open/resolved).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Resolve the open question
- [ ] Read the `.cursor/hooks.json` `UserPromptSubmit` handler's actual implementation source.
- [ ] Determine whether it injects skill-advisor-equivalent context, and cite the exact file/lines.
- [ ] Document the answer in `implementation-summary.md` before proceeding to Phase 2.

### Phase 2: Build and document
- [ ] Populate `.cursor/rules/*.md` via `cursor-agent rule`/`generate-rule`, scoped to avoid duplicating what the hook already injects (if anything).
- [ ] Record the agents non-applicability decision (`cursor-agent --help` has no custom-agent-loading concept).
- [ ] Record the commands non-applicability decision, mirroring the Devin-side sibling phase.

### Phase 3: Verification and closeout
- [ ] Diff the new rules content against the hook's injected content to confirm non-overlap.
- [ ] Run phase 014 strict and recursive parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source read | `UserPromptSubmit` handler implementation | Direct file read |
| Manual | `.cursor/rules/*.md` content vs. hook-injected content overlap check | Manual diff |
| Packet | Phase and parent consistency | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 (cursor-hook-adapter-layer) | Internal | Complete | Provides the `UserPromptSubmit` hook implementation this phase reads. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new rules content is found to duplicate or conflict with the hook's injected context after the fact.
- **Procedure**: Trim or remove the overlapping section of `.cursor/rules/*.md`; the hook itself is never modified by this phase, so rollback touches only the new static file.
<!-- /ANCHOR:rollback -->

---

## Related Documents
- `spec.md`, `tasks.md`, `checklist.md`
