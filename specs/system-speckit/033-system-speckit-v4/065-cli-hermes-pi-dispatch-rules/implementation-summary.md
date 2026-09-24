---
title: "Implementation Summary"
description: "cli-hermes and cli-pi now send only research and review lineages to the shared runtime and say how a single build or doc dispatch runs, so no cli packet tells an orchestrator to route every dispatch through a runner that refuses most of them."
trigger_phrases:
  - "implementation summary"
  - "cli hermes pi dispatch rules"
  - "cli hermes pi runtime delegation evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/065-cli-hermes-pi-dispatch-rules"
    last_updated_at: "2026-09-24T09:20:28Z"
    last_updated_by: "generate-context"
    recent_action: "Scoped the cli-hermes and cli-pi runtime delegation rule"
    next_safe_action: "Hand the finished cli dispatch-rule series to the operator"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md"
      - ".skilled/skills/cli-external-orchestration/cli-pi/SKILL.md"
    session_dedup:
      fingerprint: "sha256:75f95096d2e64c413d317096f43d80a02d88fddd0acf49043fa4502ecf3055ea"
      session_id: "scaffold-065-cli-hermes-pi-dispatch-rules"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 065-cli-hermes-pi-dispatch-rules |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No cli packet now tells an orchestrator to send every dispatch through a runner that refuses most of them. cli-hermes and cli-pi were the last two. Each told you in five places to delegate all execution to the shared deep-loop runtime, and every one-shot `pi -p` in this program had to ignore that.

### The rule says what it covers

In both packets, the core principle, Execution Ownership, Dispatch Lifecycle step 4, ALWAYS rule 2 and the success criterion now send research and review lineages to the shared runtime. Each also says how a single build or doc dispatch runs instead.

### Each packet points at its own one-shot shape

cli-pi points one-shot dispatches at the child dispatch envelope in its `references/providers-and-models.md` §5, as cli-codex, cli-devin and cli-cursor do. cli-hermes has no envelope section. Its one-shot command is the dispatch shape in its own `SKILL.md` §3, which the fan-out builder also emits, so it points there, with the child environment its ALWAYS rule 11 sets.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Modified | Five rule sites, version 1.0.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.4.0.md` | Created | Changelog entry |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modified | Five rule sites, version 1.5.11.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.11.0.md` | Created | Changelog entry |
| `.hermes/skills/cli-hermes/SKILL.md` | Regenerated | Hermes copy of the skill |
| `.hermes/skills/cli-pi/SKILL.md` | Regenerated | Hermes copy of the skill |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerated | Runtime routing manifest for the cli hub |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerated | Authored source of that manifest |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modified | Row 65 in the phase map |
| `specs/system-speckit/033-system-speckit-v4/064-cli-devin-cursor-dispatch-rules/spec.md` | Modified | Phase count and successor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A search of all seven cli `SKILL.md` for wording that sends dispatches to the shared runtime found cli-hermes and cli-pi. The runner's `main()` rejects any loop type but `research` and `review` right after parsing its arguments, before it builds any executor's command, so the defect is the same for both kinds.

A MiMo v2.6 Pro executor, through cli-pi and LLM Gateway, applied twelve replacements and wrote the two changelogs from a brief. The orchestrator had first matched each old text against its file and confirmed the verification pattern hit only the lines being replaced. MiMo returned PASS and touched only its four files. The orchestrator then confirmed each new text appears exactly once, compared both changelogs with the brief byte for byte, and ran the checks itself.

As in phases 63 and 64, the edit made the cli hub's routing manifest stale. The runtime copy was refreshed and the authored copy brought level with it, and the two Hermes skill copies were regenerated. Every other mirror generator reported in sync without a change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Change all five sites, not only rule 2 and Execution Ownership | Here the core principle, the lifecycle step and the success criterion also route every dispatch to the runtime; in the other three packets those lines did not |
| Point cli-hermes at its own dispatch shape | It has no envelope section; the shape in §3 is the command the fan-out builder emits, and rule 11 sets the child environment |
| Leave the Deep-Loop Integration sections | They describe the runtime inside deep-loop lineages, which stays true |
| Leave cli-claude-code and cli-opencode | Their `SKILL.md` never mention the shared runtime |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-doc `validate_document.py` on both `SKILL.md` | VALID, 0 issues each |
| sk-doc `validate_document.py` on both changelogs | VALID, 0 issues each |
| Each new text in its `SKILL.md` | Exactly once, all twelve |
| Changelogs against the brief | Byte-identical |
| Old-wording sweep over all seven cli `SKILL.md` | No hits, exit 1 |
| `compiled-route-guard.cjs` | Before the refresh: cli-external-orchestration needs a re-mint, exit 1. After: all hubs fresh, exit 0 |
| `sync-skills-hermes.cjs --check` | Before: 2 drifted, exit 1. After: 70 copies in sync, exit 0 |
| The other eight mirror generators, `--check` | All PASS, exit 0, before and after |
| Runtime against authored manifest | Byte-identical after the copy; before it only the policy hash differed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cli-hermes points at a rule number.** Its one-shot pointer names ALWAYS rule 11 for the child environment; renumbering the rules would need the pointer moved.
<!-- /ANCHOR:limitations -->

---
