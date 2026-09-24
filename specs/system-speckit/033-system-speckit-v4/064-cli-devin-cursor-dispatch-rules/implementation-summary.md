---
title: "Implementation Summary"
description: "cli-devin and cli-cursor now send only research and review lineages through the fan-out runner and point single build and doc dispatches at the child envelope, matching cli-codex."
trigger_phrases:
  - "implementation summary"
  - "cli devin cursor dispatch rules"
  - "cli devin cursor fanout scope evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/064-cli-devin-cursor-dispatch-rules"
    last_updated_at: "2026-09-24T07:36:35Z"
    last_updated_by: "generate-context"
    recent_action: "Scoped the cli-devin and cli-cursor fan-out rule"
    next_safe_action: "Hand the cli-hermes rule 2 wording to the operator"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-devin/SKILL.md"
      - ".skilled/skills/cli-external-orchestration/cli-cursor/SKILL.md"
    session_dedup:
      fingerprint: "sha256:6144e33c86f83bb9c63240fafbc33c0eea99088b7879d267a127ff3096a24a85"
      session_id: "scaffold-064-cli-devin-cursor-dispatch-rules"
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
| **Spec Folder** | 064-cli-devin-cursor-dispatch-rules |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

cli-devin and cli-cursor no longer tell an orchestrator to send every dispatch through a runner that refuses most of them. Their ALWAYS rule 2 and Execution Ownership text now match what phase 63 gave cli-codex.

### The fan-out rule says what it covers

In both packets, rule 2 and both Execution Ownership paragraphs send research and review lineages to `fanout-run.cjs` and a single build or doc dispatch to the child dispatch envelope in `references/providers-and-models.md` §5. Each packet's §5 holds that envelope, with its own CLI's command line. The rule still forbids a second adapter inside the packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modified | Rule 2, Execution Ownership, version 1.4.3.0 |
| `.skilled/skills/cli-external-orchestration/cli-devin/changelog/v1.4.3.0.md` | Created | Changelog entry |
| `.skilled/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Modified | Rule 2, Execution Ownership, version 1.4.2.0 |
| `.skilled/skills/cli-external-orchestration/cli-cursor/changelog/v1.4.2.0.md` | Created | Changelog entry |
| `.hermes/skills/cli-devin/SKILL.md` | Regenerated | Hermes copy of the skill |
| `.hermes/skills/cli-cursor/SKILL.md` | Regenerated | Hermes copy of the skill |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerated | Runtime routing manifest for the cli hub |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerated | Authored source of that manifest |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modified | Row 64 in the phase map |
| `specs/system-speckit/033-system-speckit-v4/063-cli-codex-dispatch-rules/spec.md` | Modified | Phase count and successor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A MiMo v2.6 Pro executor, through cli-pi and LLM Gateway, applied eight text replacements and wrote the two changelogs from a brief whose old texts the orchestrator had matched against each file first. It returned PASS and touched only its four files. The orchestrator read the diff, compared both changelogs with the brief byte for byte, and ran the checks itself.

The edit made the same generated copies stale that phase 63's did. The guard reported the cli hub's manifest stale; refreshing it changed the policy hash, and the authored copy was brought level with the runtime copy. `sync-skills-hermes.cjs --check` reported the cli-devin and cli-cursor copies drifted, and a regeneration rewrote those two of 70.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse cli-codex's wording with the executor kind changed | The three packets state one rule; different words would read as different rules |
| Keep the `§5` pointer | Both packets' `providers-and-models.md` put the child envelope under `## 5. HOW TO INVOKE`, as cli-codex's does |
| Leave out cli-codex's sandbox gotcha | It records a Codex `--sandbox workspace-write` observation; neither packet runs children under that sandbox |
| Keep the success-criteria and Execution summary lines | cli-codex kept them; they state that no packet-local adapter exists, which stays true |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-doc `validate_document.py` on both `SKILL.md` | VALID, 0 issues each |
| sk-doc `validate_document.py` on both changelogs | VALID, 0 issues each |
| Search for the old rule wording | 0 hits in each `SKILL.md` |
| Changelogs against the brief | Byte-identical |
| `compiled-route-guard.cjs` | Before the refresh: cli-external-orchestration stale-manifest, exit 1. After: all hubs fresh, exit 0 |
| `sync-skills-hermes.cjs --check` | Before: 2 drifted (cli-cursor, cli-devin), exit 1. After: 70 copies in sync, exit 0 |
| Runtime against authored manifest | Byte-identical after the copy; before it only the policy hash differed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cli-hermes states the same rule in other words.** Its Execution Ownership says the shared runtime owns process construction and execution, and its ALWAYS rule 2 reads "Delegate execution to the shared deep-loop runtime", with no scope to research and review. It was outside this phase and is reported to the operator. cli-claude-code, cli-opencode and cli-pi do not name the runner in their `SKILL.md`.
<!-- /ANCHOR:limitations -->

---
