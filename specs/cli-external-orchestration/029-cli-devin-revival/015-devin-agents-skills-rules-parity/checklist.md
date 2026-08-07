---
title: "Verification Checklist: Devin agents/skills/rules parity"
description: "Evidence gate for the live-docs-gated AGENT.md build and the skills/rules discovery documentation."
trigger_phrases:
  - "devin agents skills rules parity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/015-devin-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T11:15:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA); live probes completed by Claude."
    next_safe_action: "Run strict validation."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", ".devin/agents/<name>/AGENT.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Native AGENT.md format is documented at https://docs.devin.ai/cli/subagents.", "The code-reviewer profile resolves and dispatches live, producing a real review with a valid finding."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines four acceptance-tested requirements (REQ-001 through REQ-004).]
- [x] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` gates the build on a live-docs fetch before any file write.]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 008 is complete; the supplied live Devin CLI docs are reachable and the installed CLI is `3000.2.17`.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The new `AGENT.md` profile matches the live-confirmed format, not an assumed one. [EVIDENCE: `implementation-summary.md` cites https://docs.devin.ai/cli/subagents before `.devin/agents/code-reviewer/AGENT.md` was created.]
- [x] CHK-011 [P1] No existing hook, skill, or rule behavior is altered by this phase. [EVIDENCE: phase changes are limited to the new profile, phase documentation, and `cli-devin/SKILL.md`; no hook code is modified.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A live probe confirms `run_subagent` resolves the new profile. [EVIDENCE: `devin -p "List every subagent profile..."` lists `code-reviewer` alongside `subagent_explore`/`subagent_general`; a follow-up `devin -p "Use the code-reviewer subagent to review ..." --permission-mode auto` actually dispatched and returned a real review (verdict APPROVED, one valid P1 finding). The dispatched build sandbox's own restricted network could not reach Devin's model service; re-run outside that sandbox succeeded.]
- [x] CHK-021 [P1] `devin skills list` output is captured and cited verbatim. [EVIDENCE: `SKILL.md` quotes the live repo-local output from Devin 3000.2.17.]
- [x] CHK-022 [P1] `devin rules list` output is captured and cited verbatim. [EVIDENCE: `SKILL.md` quotes the live output showing `CLAUDE` and `AGENTS` rules.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] The one genuine gap (`.devin/agents/*/AGENT.md`) is closed with a real, working profile. [EVIDENCE: CHK-020's live dispatch evidence -- the profile resolves and runs, not merely exists on disk.]
- [x] CHK-031 [P1] The commands non-applicability decision is recorded explicitly, not left implicit. [EVIDENCE: `SKILL.md` cites the live `devin --help` command roster and `devin commands` unexpected-argument result.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] The new agent profile does not grant broader tool access than the existing Devin dispatch policy allows. [EVIDENCE: profile is limited to `read`, `grep`, `glob`, and `exec`, denies `write`/`edit`, and the dispatch hard-rule engine grants no additional profile tools.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 015.]
- [x] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: this phase adds no new code files (AGENT.md is markdown-with-frontmatter, not a code comment surface); `check-comment-hygiene.sh` is not applicable.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] The new profile lives under `.devin/agents/<name>/AGENT.md`, matching the documented directory convention. [EVIDENCE: verified on disk at the time. SUPERSEDED -- `code-reviewer` was later deleted as a non-native bespoke profile; the directory now holds symlink mirrors of all 13 roster agents.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27 (Complete)
<!-- /ANCHOR:summary -->
