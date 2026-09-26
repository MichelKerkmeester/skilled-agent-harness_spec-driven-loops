---
title: "Implementation Summary: Phase 11: cross-surface-references"
description: "The create-goal mode is now named wherever its sibling create modes are, the advisor command bridges carry /create:goal, and both command counts pass."
trigger_phrases:
  - "create-goal references summary"
  - "command bridge evidence"
  - "create asset roster evidence"
  - "phase 011 closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/011-cross-surface-references"
    last_updated_at: "2026-09-26T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Named the goal mode across READMEs, agent, catalog and advisor bridges"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/skills/sk-doc/README.md"
      - ".skilled/agents/markdown.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Workspace for this phase: current branch in the main checkout (operator, 2026-09-26)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-cross-surface-references |
| **Status** | Complete |
| **Updated** | 2026-09-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader who opens the root README, the sk-doc hub README, the `@markdown` agent or the sk-doc feature catalog now finds `sk-create-goal` and `/create:goal` next to the other create modes, and every count reads fifteen modes across fourteen packets. The skill advisor's command-bridge projection carries `/create:goal` and its freshness check passes again. The create command's asset tests and the advisor's command census both count the goal command. The changelog link and the command files already matched their siblings, so they were checked and left as they were.

### Phase 11: cross-surface-references

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Mode count, goal-authoring line, `/create:goal` entry |
| `.skilled/skills/sk-doc/README.md` | Modified | Description, overview, command list, FAQ, related-documents row |
| `.skilled/agents/markdown.md`, `.claude/agents/markdown.md`, `.pi/agents/markdown.md`, `.codex/agents/markdown.toml` | Modified | Valid command, count and template-map row |
| `.hermes/skills/agent-markdown/SKILL.md` | Regenerated | Generated copy |
| `sk-doc/feature-catalog/feature-catalog.md`, `packet-authored-registry-routing.md` | Modified | Mode list and counts |
| `command-bridges/scoring-compatibility.json` | Modified | Memory-save wording moved into the authored input |
| `command-bridges.generated.json`, `lib/scorer/projection.ts`, `scripts/skill_advisor.py` | Regenerated | The `/create:goal` bridge |
| `tests/command-metadata-e2e.vitest.ts` | Modified | Census 21 |
| `commands/create/assets/tests/fixtures/emitted-name-contract.json`, `test_emitted_name_contract.py` | Modified | Roster rebuilt from disk, YAML count 26 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator did this phase directly, in the main checkout at the operator's choice. A search for documents naming a sibling create mode but not the goal mode produced the edit list. The bridge deriver's first run would have reverted a hand edit in the committed TypeScript projection, so the wording moved into the deriver's authored input and the second run changed nothing but the new bridge. Only this phase's files were staged, because another session was editing the advisor runtime at the same time.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Carry the memory-save wording into `scoring-compatibility.json` | The generated file must come from its inputs. Hand-restoring the output would leave the check stale |
| Rebuild the asset roster from disk | It had drifted before this phase, and a partial fix would still fail |
| Leave the trigger index alone | The shared checkout holds other sessions' uncommitted spec folders |
| Count thirteen commands in the agent | Its list now has thirteen, and the old "fourteen" matched no list |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m unittest discover .skilled/commands/create/assets/tests` | 13 of 13 pass, where two failed before |
| `derive-command-bridges.cjs --check` | `"status": "fresh"`, where it was `stale` before |
| Advisor typecheck, bridge and routing tests | Exit 0, and 22 of 22 pass |
| Advisor full suite | 896 of 907 pass. The divergence ratchet fails on `rr-iter3-093`, and the committed Python scorer gives the same sk-prompt top result, so it predates this phase. Four `records runtime and delivered bytes` hook cases fail in a test another session added and has not committed |
| Agent and runtime mirrors | 12 agents, 71 Hermes copies and 170 runtime mirrors in sync |
| Edited documents | 0 issues on both READMEs and both catalog files, with HVR counts unchanged on every file |
| sk-doc gates | Guard fresh, leaf manifest OK, command references OK, catalog mirror OK, package PASS, parent-skill OK, README manifest tests 11 of 11 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict` | `RESULT: PASSED` for all 12 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advisor's divergence ratchet still fails on `rr-iter3-093`.** It comes from the live skill graph, not from this phase, and needs a ledger entry or a scorer fix from the advisor's owner.
2. **The root README's CREATE section still omits other existing commands** and names `/create:testing-playbook`, which is not the current command.
3. **The trigger index was not regenerated.** The next regeneration from a clean tree picks up this phase's phrases.
<!-- /ANCHOR:limitations -->
