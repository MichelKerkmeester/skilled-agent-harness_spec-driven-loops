# Verification Checklist: Task 04 — Agent Configs Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## P0 — Model Assignments

- [ ] CHK-001 [P0] Handover agent = Haiku on OpenCode (`.opencode/agent/handover.md`)
- [ ] CHK-002 [P0] Handover agent = Haiku on Claude Code (`.claude/agents/handover.md`)
- [ ] CHK-003 [P0] Handover agent = fast profile on Codex (`.codex/agents/handover.md`)
- [ ] CHK-004 [P0] Review agent model-agnostic on OpenCode (`.opencode/agent/review.md`)
- [ ] CHK-005 [P0] Review agent model-agnostic on Claude Code (`.claude/agents/review.md`)
- [ ] CHK-006 [P0] Review agent = readonly profile on Codex (`.codex/agents/review.md`)

## P0 — Codex Frontmatter

- [ ] CHK-007 [P0] All 8 `.codex/agents/*.md` files use Codex-native frontmatter
- [ ] CHK-008 [P0] `.codex/config.toml` has 4 profiles (fast, balanced, powerful, readonly)
- [ ] CHK-009 [P0] `.codex/config.toml` has sub-agent dispatch MCP

## P1 — AGENTS.md + Consistency

- [ ] CHK-010 [P1] `AGENTS.md` routing rules include all spec 014 additions
- [ ] CHK-011 [P1] `AGENTS.md` notes handover = Haiku
- [ ] CHK-012 [P1] `AGENTS.md` notes review = model-agnostic
- [ ] CHK-013 [P1] Agent body content consistent across all 3 platforms

## P2 — Description Consistency

- [ ] CHK-020 [P2] Agent descriptions match between platforms
- [ ] CHK-021 [P2] All 8 agents listed in AGENTS.md

## Output Verification

- [ ] CHK-030 [P0] changes.md populated with all required edits
- [ ] CHK-031 [P0] No placeholder text in changes.md

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | /11 |
| P1 Items | 4 | /4 |
| P2 Items | 2 | /2 |

**Verification Date**: ____
