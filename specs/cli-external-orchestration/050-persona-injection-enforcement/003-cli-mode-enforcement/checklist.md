---
title: "Verification Checklist: CLI Mode + Hub Persona-Injection Enforcement"
description: "Verification evidence for applying the persona-injection contract to six modes and the hub."
trigger_phrases:
  - "cli mode enforcement checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/003-cli-mode-enforcement"
    last_updated_at: "2026-08-19T11:12:00Z"
    last_updated_by: "claude"
    recent_action: "Edits verified; P3 checklist closed with evidence"
    next_safe_action: "Author P4 sk-prompt alignment"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-003-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: CLI Mode + Hub Persona-Injection Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Build/verify approach defined in `plan.md`
- [x] CHK-003 [P1] Build executor confirmed — `devin auth status` returned `Logged in`; `gemini-3-7-flash-high` in the model roster
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Diff is pure insertion — `git diff --stat` shows `13 insertions(+)`, 0 deletions across the 7 files
- [x] CHK-011 [P1] Each inserted rule mirrors its file's existing ALWAYS-rule style (numbered for 5 modes, bullet 11 for `cli-pi`, bullets for hub)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 6 mode `SKILL.md` files carry one persona-injection rule (`cli-devin` R17, `cli-opencode` R18, `cli-claude-code` R14, `cli-codex` R17, `cli-cursor` R17, `cli-pi` bullet 11)
- [x] CHK-021 [P0] Hub `SKILL.md` carries one `✅ ALWAYS` bullet + one `REFERENCES` bullet (`Persona-injection contract (canonical)`)
- [x] CHK-022 [P0] Each rule's native-vs-inline verdict matches contract `§3` — verified by independent `cline`/DeepSeek review (C1 PASS 7/7)
- [x] CHK-023 [P1] Cross-references correct — canonical card `../../sk-prompt/...` (modes) / `../sk-prompt/...` (hub); DESIGN_DISPATCH_MANIFEST `Rule 11` (claude-code) / `Rule 14` (others) — C4 PASS
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every dispatch surface named in the contract now carries the rule (6 modes + hub; `fanout-run.cjs` covered by the contract, no code change in scope)
- [x] CHK-FIX-002 [P0] No existing rule renumbered and no adjacent content changed — insertion-only diff confirmed (`git diff --stat` = `13 insertions(+)`, 0 deletions)
- [x] CHK-FIX-003 [P1] Runtime-aware resolution (AGENTS.md §7, never hardcode) + subtask→persona mapping present in every rule — C2/C3 PASS 7/7
- [x] CHK-FIX-004 [P1] P2 verification finding reconciled — `cli-pi` bullet 11 given the failure-consequence clause for parity with the six mode rules
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Scope-locked — only the 7 `SKILL.md` files under `cli-external-orchestration/` changed (`git status` scoped)
- [x] CHK-031 [P1] No secrets in the build/verify dispatch prompts — only persona + task + repo paths (verified in `p3-devin-build-prompt.txt`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Build/verify/reconcile summary recorded in `implementation-summary.md`
- [x] CHK-041 [P1] Each rule points back to the canonical contract (`cli-prompt-quality-card.md` "Persona Injection")
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Build/verify artifacts confined to the session `scratchpad/`; `git status` shows no stray files in the phase folder
- [x] CHK-051 [P2] No stray files outside the packet (`git status` sweep scoped to the 7 targets)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-19

**Verification note**: P3 verified two ways — deterministic orchestrator inspection of the scoped `git diff` (pure insertion, correct placement/numbering/cross-refs), AND an independent `cli-opencode`/cline (DeepSeek V4 Flash @ xhigh, `review` persona, tool-free) review that returned APPROVE 98/100 with C1–C6 all PASS and zero P0/P1. The single P2 (cli-pi compressed out the failure clause) was reconciled. The verifier's MEDIUM caveat (pre-insertion rule-count baselines unverifiable tool-free) is resolved deterministically here: the git diff confirms the numbering fits each file's actual structure.
<!-- /ANCHOR:summary -->
