---
title: "Implementation Summary"
description: "cli-codex now sends only research and review lineages through the fan-out runner, points single build and doc dispatches at the child envelope, and warns that a sandboxed child cannot run checks that start tsx."
trigger_phrases:
  - "implementation summary"
  - "cli codex dispatch rules"
  - "cli codex sandbox eperm evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/063-cli-codex-dispatch-rules"
    last_updated_at: "2026-09-24T07:18:45Z"
    last_updated_by: "generate-context"
    recent_action: "Scoped the cli-codex fan-out rule and added the sandbox gotcha"
    next_safe_action: "Hand the cli-devin and cli-cursor rule 2 question to the operator"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:2d6d11aa4a307a89cb241ed08a6e1e1ba5b265cd22562844478496ab2292cf50"
      session_id: "scaffold-063-cli-codex-dispatch-rules"
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
| **Spec Folder** | 063-cli-codex-dispatch-rules |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An orchestrator reading cli-codex is no longer told to do something the runtime refuses. Rule 2 had sent every orchestrated Codex dispatch through the deep-loop fan-out runner, which rejects anything but research and review loops, so every single build dispatch in phases 056 to 062 broke the rule to get done.

### The fan-out rule says what it covers

ALWAYS rule 2 and both Execution Ownership paragraphs now send research and review lineages to `fanout-run.cjs` and a single build or doc dispatch to the child dispatch envelope in `references/providers-and-models.md` §5. The rule still forbids a second adapter inside the packet.

### The sandbox limit is a gotcha

A fifth dispatch gotcha says a child under `--sandbox workspace-write` cannot run a check that starts tsx, since tsx fails to open its IPC socket with `listen EPERM`. It records when that was seen and on which codex-cli version, and tells the orchestrator to run such checks itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modified | Rule 2, Execution Ownership, a fifth gotcha, version 1.9.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-codex/changelog/v1.9.4.0.md` | Created | Changelog entry |
| `.hermes/skills/cli-codex/SKILL.md` | Regenerated | Hermes copy of the skill |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerated | Runtime routing manifest for the cli hub |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerated | Authored source of that manifest |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modified | Row 63 in the phase map |
| `specs/system-speckit/033-system-speckit-v4/062-v4-parent-data-repairs/spec.md` | Modified | Phase count and successor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A MiMo v2.6 Pro executor, through cli-pi and LLM Gateway, applied the four text replacements, the new bullet and the changelog from a brief whose old texts the orchestrator had matched against the file first. The orchestrator reviewed the diff and ran the checks.

The edit made three generated copies stale. The routing guard first reported the cli hub's manifest stale; refreshing it moved the policy hash, and the guard then reported the runtime manifest out of line with its authored source, so the authored copy was brought level with it, as the earlier cli commits did. `sync-skills-hermes.cjs --check` reported the Hermes copy of cli-codex drifted, and a regeneration rewrote that one copy of 70.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name the two loop types in the rule | The runner's own constant lists them, so the rule and the runtime cannot drift apart silently |
| Point one-shot dispatches at the existing envelope | §5 already carries the spec-gate variables a bound child needs; a second description would diverge |
| Date the sandbox note and name the codex-cli version | It rests on one observation, and a reader can retest it |
| Leave cli-devin and cli-cursor unchanged | Out of this phase's scope; their rule 2 carries the same wording and is reported to the operator |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-doc `validate_document.py` on `SKILL.md` | VALID, 0 issues |
| sk-doc `validate_document.py` on the changelog | VALID, 0 issues |
| Search for the old rule wording | `Delegate orchestrated execution` appears 0 times |
| `compiled-route-guard.cjs` | All seven hubs fresh; "All hubs fresh or excused", exit 0 |
| `sync-skills-hermes.cjs --check` | Before: 1 drifted (cli-codex), exit 1. After: 70 copies in sync, exit 0 |
| Runtime against authored manifest | Byte-identical after the copy; before it only the policy hash differed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cli-devin and cli-cursor still carry the old rule 2.** Both `SKILL.md` send every orchestrated dispatch to the fan-out runner; the same change would fit them.
2. **The sandbox note rests on one observation.** It was seen on codex-cli 0.156.1; a later release may lift it.
<!-- /ANCHOR:limitations -->

---
