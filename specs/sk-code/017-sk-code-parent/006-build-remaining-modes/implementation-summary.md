---
title: "Implementation Summary: build remaining modes"
description: "The four remaining sk-code mode contracts (implement, quality, debug, verify) were authored from the distributed pre-hub doctrine, pinned to registry tool surfaces, verified for links/hygiene/one-identity, and version-stamped."
trigger_phrases:
  - "sk-code build remaining modes summary"
  - "code mode contracts outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/006-build-remaining-modes"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored and verified the four remaining mode contracts and READMEs"
    next_safe_action: "phase 007 advisor-and-integration"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-implement/SKILL.md"
      - ".opencode/skills/sk-code/code-quality/SKILL.md"
      - ".opencode/skills/sk-code/code-debug/SKILL.md"
      - ".opencode/skills/sk-code/code-verify/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-build-remaining-modes |
| **Completed** | 2026-07-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 006 turned the four placeholder mode packets into full contracts by distributing the pre-hub flat `sk-code` doctrine across them by lifecycle phase. The `code-review` mode was already built in phase 005 and was not rebuilt.

### Doctrine distribution

The pre-hub flat `sk-code/SKILL.md` (316 lines, recovered from history) held the Phase 0/1/1.5/2/3 workflow doctrine. Its surface-detection sections already live in `shared/` from phase 004. This phase distributed the phase-workflow doctrine so each mode owns exactly one lifecycle phase, mirrors the sk-design mode shape, consumes surface detection from `../shared/`, and points its resource-loading table at that packet's relocated references, assets, and scripts.

### Mode contracts authored

| Mode | SKILL / README | allowed-tools | Owns |
|------|----------------|---------------|------|
| `code-implement` | 265 / 86 lines | `[Read, Write, Edit, Bash, Grep, Glob, Task]` | Phase 0 research + Phase 1 implementation; WEBFLOW/OPENCODE/UNKNOWN authoring workflows; OPENCODE language sub-detection; write-time authoring-checklist pointer |
| `code-quality` | 263 / 109 lines | `[Read, Edit, Bash, Grep, Glob]` | Phase 1.5 gate; P0/P1/P2 model; comment-hygiene enforcement layers; target-path authoring-checklist map |
| `code-debug` | 237 / 109 lines | `[Read, Edit, Bash, Grep, Glob, Task]` | Phase 2 root-cause; one-cause-fix rule; bounded-Task boundary; three-strike escalation discipline |
| `code-verify` | 272 / 116 lines | `[Read, Bash, Grep, Glob]` | Phase 3 Iron Law; verification ladder; mutation/claim-falsifier ritual; baseline/delta contract; non-mutating boundary |

### Execution model

Claude orchestrated and verified. GPT-5.5-fast (high) via cli-opencode authored the contracts in two dispatches: `code-implement` alone (the largest packet), then `code-quality` + `code-debug` + `code-verify` as a coherent set. Dispatches ran one at a time (sequential), each exiting on its own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/code-implement/SKILL.md` + `README.md` | Updated | Full implement (Phase 0/1) contract + orientation |
| `.opencode/skills/sk-code/code-quality/SKILL.md` + `README.md` | Updated | Full quality-gate (Phase 1.5) contract + orientation |
| `.opencode/skills/sk-code/code-debug/SKILL.md` + `README.md` | Updated | Full debug (Phase 2) contract + orientation |
| `.opencode/skills/sk-code/code-verify/SKILL.md` + `README.md` | Updated | Full verify (Phase 3, non-mutating) contract + orientation |
| `.opencode/specs/sk-code/017-sk-code-parent/006-build-remaining-modes/` | Created | Phase 006 documentation and metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The pre-hub doctrine was recovered from git history and mapped section-by-section to its owning mode. Two GPT-5.5-fast dispatches authored the contracts against the sk-design mirror shape and the recovered doctrine, each pointing at real packet files and the shared references. Claude verified every output against the real files rather than trusting the dispatch's self-report. The phase docs were created from the 005 child structure and populated with the verified facts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Distribute the recovered flat doctrine rather than author from scratch | The Phase 0/1/1.5/2/3 doctrine already existed; the task is to split it by phase, not invent new behavior |
| Two dispatches (implement solo; quality+debug+verify grouped) | The implement packet is the largest and warranted a focused agent; the three post-implementation modes share vocabulary and stay coherent authored together |
| Sequential, not parallel, dispatch | Rule-16 single-dispatch default plus the standing no-`pkill` directive (a live operator opencode session must not be killed); each dispatch exits on its own |
| Version 1.0.0.1 for all four modes | A minimal bump over the committed 1.0.0.0 skeletons, consistent with sibling sk-design mode versioning |
| Defer per-mode playbooks and changelogs | The hub playbook and the folded code-review playbook remain; per-mode playbooks fit the 008 benchmark phase and changelogs the 009 cutover version bumps |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full contract per mode | PASS: four SKILL.md carry the sk-design section set and their owned phase workflow (265/263/237/272 lines) |
| Registry-exact tool surface | PASS: each `allowed-tools` equals its `mode-registry.json` `toolSurface.allowed`; `code-verify` is non-mutating (`Read, Bash, Grep, Glob`) |
| One-identity preserved | PASS: no `graph-metadata.json` under any mode packet; exactly one remains under `sk-code`, at the hub |
| Consume shared, not re-author | PASS: each contract defers surface detection to `../shared/` and does not re-implement it |
| Link resolution | PASS: deterministic resolver — 117 links (implement pair) + 89 links (other three pairs) all resolve |
| Comment hygiene | PASS: 0 spec-path/artifact-id violations inside code fences across the four SKILL.md files |
| Scope | PASS: only the four mode packets changed; hub, registry, hub-router, hub graph-metadata, shared, and code-review untouched |
| Handoff chain | PASS: implement → quality → debug → verify → review cross-references are coherent |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:lessons -->
## Lessons

Distributing an existing monolithic doctrine into mode packets is safest when each mode is held to three independent invariants at once: it owns exactly one lifecycle phase, it consumes shared surface detection instead of re-authoring it, and its tool surface is pinned to the registry. Verifying tool surfaces and link resolution deterministically — not by trusting the dispatch's self-report — is what caught prior-phase drift and kept this phase clean.
<!-- /ANCHOR:lessons -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor rebuild is deferred.** Merging review keywords into the hub node and regenerating the advisor graph belong to phase 007.
2. **Per-mode playbooks and changelogs are deferred.** The hub playbook and folded code-review playbook remain; per-mode testing playbooks and changelog/version bumps come in phases 008 and 009.
3. **`command-metadata.json` remains deferred.** No `/code:*` command surface is authored yet; that stays a phase 007 concern.
4. **Runtime load unverified in this phase.** The contracts are authored and statically verified; a live OpenCode session must be restarted to load them, which is out of scope here.
<!-- /ANCHOR:limitations -->
