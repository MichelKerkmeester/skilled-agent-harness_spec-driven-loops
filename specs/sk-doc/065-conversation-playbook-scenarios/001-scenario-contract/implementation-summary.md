---
title: "Implementation Summary: Phase 1: scenario-contract"
description: "Not built yet. This phase holds a plan for the json conversation block and its validator checks, and nothing in the skill has changed."
trigger_phrases:
  - "scenario contract implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/001-scenario-contract"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Recorded that the phase is planned and not built"
    next_safe_action: "Run T001 to record the fleet baseline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-scenario-contract |
| **Status** | Complete |
| **Completed** | 2026-11-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A playbook scenario can now script the human side of a conversation as one `json conversation` block. The fleet validator parses it against a closed key set, reports each malformed shape as `CONVERSATION_SCRIPT_INVALID` with the field path, never runs `setup` or `check`, and exports the parser so the runner reads the same parse.

### Phase 1: scenario-contract

The key set includes the additions settled in `../decision-record.md` ADR-002 before it froze: check-only turns, `retry`, `answer.multi`, ranged `delay_ms` on turns and questions, exit 77 for a skipped turn and the `checkpoints.tsv` evidence. The block's body is masked before the verdict and evergreen checks, so a `check` that greps for `BLOCKED` raises no false `FORBIDDEN_VERDICT`.

### Files Changed

Paths are relative to `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` unless they start with `.skilled/`.

| File | Action | Purpose |
|------|--------|---------|
| `scripts/validate-playbook-package.cjs` | Modified | Parser, rules, masking, prompt-sync copy, exports |
| `scripts/tests/validate-playbook-package.test.cjs` | Modified | Conversation suite, 95 assertions, path helper |
| `scripts/tests/fixtures/conversation-package/` | Created | Separate fixture, so `clean-package` stays byte-identical |
| `scripts/tests/fixtures/README.md` | Modified | Names the new fixture |
| `references/conversation-scenarios.md` | Created | Roles, schema, turn outcomes, evidence, example, rules |
| `assets/manual-testing-playbook-snippet-template.md` | Modified | Conversation Script subsection |
| `SKILL.md`, `ROUTER.md`, `references/README.md` | Modified | Rule, check, reference, version 1.0.9.0 |
| `changelog/v1.0.9.0.md` | Created | Release note |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Regenerated | Lists the new reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three cli-codex workers on `gpt-6-luna` at `xhigh`, tier `fast`: the validator, the docs and the tests, each with a short brief kept in `scratch/runs/`. The orchestrator took the baselines, reviewed each diff and ran every gate itself. The orchestrator also added the block name to two `SKILL.md` lines the docs worker wrote, so T010's grep finds two.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One fenced `json conversation` block holds the script | ADR-001 in `../decision-record.md` |
| The 043/006 needs are settled in the key set before it freezes | ADR-002 in `../decision-record.md` |
| Conversation tests use their own fixture package | `expectClean` asserts the whole clean package, so a shared fixture would mix two contracts |
| Unknown keys fail validation | A misspelled key would otherwise run silently with a default |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet before and after (`scratch/fleet-before.json`, `scratch/fleet-after.json`) | `packages 56 violations 1 warnings 93` both runs, exit 1 both, findings JSON byte-identical |
| `node scripts/tests/validate-playbook-package.test.cjs` | exit 0, `conversation script regressions: PASS (95 assertions)` |
| Export probe | `function claude-code,opencode,codex,pi,devin` |
| Template example in a temp fixture copy | synced: exit 0, no conversation finding. Unsynced: one `PROMPT_UNSYNCED` naming the conversation script's first send |
| `git diff --stat -- scripts/tests/fixtures/clean-package` | empty |
| `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` | `leaf-manifest.json OK (8e15bfbc...)` |
| `parent-skill-check.cjs .skilled/skills/sk-doc` | `OK: parent-skill-check` |
| `validate_document.py ... --type reference` | `VALID`, 0 issues |
| `rg -n "child_process\|execSync\|spawnSync"` on the validator | no match |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fleet baseline already fails.** The one `REQUIRED_PROMPT` violation in `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md` predates this packet, so the phase compares counts and findings rather than expecting exit 0.
2. **No keystroke verb or per-turn runtime filter.** ADR-002 set them aside until a named scenario needs one.
<!-- /ANCHOR:limitations -->

---
