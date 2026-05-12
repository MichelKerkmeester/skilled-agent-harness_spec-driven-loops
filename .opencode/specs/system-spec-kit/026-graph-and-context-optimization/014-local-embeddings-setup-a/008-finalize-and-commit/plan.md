---
title: "Implementation Plan: Phase 8 — Finalize + Commit"
description: "Validate every 014 packet, refresh memory continuity, author the bundled commit message and post-merge checklist. User runs the actual git commit."
trigger_phrases:
  - "008 plan finalize commit"
  - "014 bundled commit plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/008-finalize-and-commit"
    last_updated_at: "2026-05-12T22:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan filled"
    next_safe_action: "Validate all packets"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140080c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-008-finalize-2026-05-12"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8 — Finalize + Commit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash + git; markdown authorship for the commit message |
| **Framework** | spec-kit validator (`scripts/spec/validate.sh`); spec-kit-memory MCP |
| **Storage** | No DB changes |
| **Testing** | `git status`, `git diff --stat`, validator exit codes |

### Overview
Validation pass + commit-message authorship. The agent prepares everything; the user runs `git commit -F`. No mid-session commits per the 014 plan.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001-005, 007 shipped or fully documented
- [x] 009 either shipped or documented as deferred
- [ ] 006 either shipped (post-009) or documented as gated-deferred

### Definition of Done
- [ ] All packets strict-validate exit 0
- [ ] Commit message authored
- [ ] Post-merge checklist authored
- [ ] handover.md reflects terminal state
- [ ] Memory continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validation cascade + authoring. No new code.

### Key Components
- **Validator cascade**: per-packet + parent recursive run
- **Commit message** (`scratch/commit-message.txt`): conventional commits style
- **Post-merge checks** (`scratch/post-merge-checks.md`): user-facing checklist
- **handover.md**: final-state resume document

### Data Flow
Validate → if all green → author commit message + checklist → refresh handover → user runs `git commit`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Each 014 packet | Self-validated | Re-run strict validate | All exit 0 |
| `008/scratch/commit-message.txt` | (new) | Author | Manual inspection; ≥1KB; conventional-commit shape |
| `008/scratch/post-merge-checks.md` | (new) | Author | Lists tcpdump + q4 opt-in + 009 follow-on |
| `handover.md` | Resume doc | Modify | Terminal state recorded |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Validate
- [ ] Strict validate each 014 packet (001-009) + parent
- [ ] Fix any newly-introduced validator failures

### Phase 2: Author
- [ ] Build files-changed inventory from `git status` + `git diff --stat`
- [ ] Write `scratch/commit-message.txt` (conventional commit: `feat(embeddings,014): ...`)
- [ ] Write `scratch/post-merge-checks.md`
- [ ] Refresh `handover.md` terminal state
- [ ] Refresh implementation-summary with the files-changed inventory

### Phase 3: Hand off
- [ ] Run `memory_index_scan` to pick up final-state docs
- [ ] Recommend the user run: `git add -A && git commit -F .opencode/specs/.../008/scratch/commit-message.txt`
- [ ] Provide the post-merge-checks.md path
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | All packets | spec-kit validator |
| Manual | Commit message review | User-facing read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| All other 014 packets validated | Internal | Pending — 008 runs the cascade | Must fix before commit |
| User git push permissions | External | Green | User runs the commit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator fails or user spots a problem in commit message
- **Procedure**: Don't commit. Iterate on the failing packet or the commit message. 008 is purely preparatory; nothing is mutated upstream until the user runs `git commit`.
<!-- /ANCHOR:rollback -->
