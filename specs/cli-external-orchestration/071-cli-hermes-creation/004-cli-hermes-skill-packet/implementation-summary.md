---
title: "Implementation Summary"
description: "The cli-hermes skill packet exists with eight hard rules and seven references, and it is the seventh registered mode of cli-external-orchestration, reachable through both routing stages and passing both hub checkers."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet"
    last_updated_at: "2026-09-14T20:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Packet authored and registered on every hub surface; both checkers and both routing stages pass"
    next_safe_action: "Phase 005 creates the repo-root .hermes folder"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-004-cli-hermes-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The hub is a graduated compiled-routing child whose harness enumerates packet SKILL.md sources by hand; a new mode must be added there or the hub stops compiling"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cli-hermes-skill-packet |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A request for Hermes now reaches a documented contract. The advisor routes it to the hub, the hub routes it to `cli-hermes`, and the packet tells the caller exactly which flags a dispatch carries, which operator steps the repo cannot perform, and which two models are allowed.

### Phase 4: cli-hermes skill packet

You get the seventh mode packet at `.opencode/skills/cli-external-orchestration/cli-hermes/`, built to the existing-hub checklist: `SKILL.md` with eight hard rules, a README, two assets, seven references, a changelog, a benchmark index and a playbook root. The agent and command bridge lives in `references/agent-delegation.md` (inline the persona, persona skills as the alternative, prompt templates for the nested commands) and the MCP operator policy in `references/mcp-policy.md`, which is why the two candidate phases folded into this one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-hermes/SKILL.md`, `README.md` | Created | Routing contract, eight hard rules, dispatch shape, gotchas, at-a-glance summary |
| `cli-hermes/assets/prompt-quality-card.md`, `prompt-templates.md` | Created | Thin delegator to the canonical card; write, read-only, generation and fan-out templates |
| `cli-hermes/references/cli-reference.md`, `providers-and-models.md`, `hermes-tools.md`, `integration-patterns.md`, `agent-delegation.md`, `hook-contract.md`, `mcp-policy.md` | Created | The seven references the leaf manifest lists |
| `cli-hermes/changelog/v1.0.0.0.md`, `benchmark/README.md`, `manual-testing-playbook/manual-testing-playbook.md` | Created | Packet changelog, benchmark index, playbook root (scenarios are phase 008's) |
| `mode-registry.json` | Modified | Seventh `modes[]` entry, `routingClass: metadata`, eight aliases |
| `hub-router.json` | Modified | `routerSignals.cli-hermes`, `cli-hermes-aliases` and `hermes-dispatch` vocabulary classes, `tieBreak` entry |
| `ROUTER.md` | Modified | `HERMES` intent signals and resource map |
| `SKILL.md` (hub) | Modified | Mode table row, layout block, references, seven-mode wording, version 1.5.0.0 |
| `description.json`, `graph-metadata.json` | Modified | Seventh-mode description and keywords; trigger phrases, intent signals, key topics, key files, entity, source docs, causal summary |
| `leaf-manifest.json` | Regenerated | `generate-leaf-manifest.cjs --write`; nine Hermes leaves |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs`, `fixtures/canary-cases.v1.json` | Modified | The graduated hub's harness enumerates packet sources by hand; the Hermes source and a `hermes-single` canary were added |
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Refreshed | `compiled-route-manifest.cjs refresh`; fresh, generation 5 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet mirrors `cli-pi`'s file shapes and the hub registration follows the eleven-surface list in the nested-packet reference. The one surprise was compiled routing: the hub is a graduated child whose harness reads a fixed list of packet `SKILL.md` files, so the hub stopped compiling until the Hermes source joined that list; the HEAD sources compiled to the manifest's exact hash, which located the cause. Generated surfaces were regenerated, never hand-edited: the leaf manifest, the intent-signal projection into the graph metadata, and the compiled-routing manifest.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fold the agent and command bridge and the MCP policy into this packet | Both are contract text a caller reads, not repo files: personas are inlined, commands become prompt templates, MCP is an operator step |
| Eight hard rules with implemented checks | The rule-check CI guard fails on any declared check id without an implementation, so each rule got one in the dispatch rule engine |
| No packet-local `description.json` or `graph-metadata.json` | The hub is the single advisor identity; the checker fails hard on a nested one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-skill-check.cjs .opencode/skills/cli-external-orchestration` | PASS: all hard invariants, 0 warnings; 6b names 7 modes; 10b byte-drift clean; 10d 7 manifest modes reachable |
| `validate_skill_package.py` on the packet and on the hub | PASS both; hub: package check, compiled-routing readiness and parent-skill-check all exit 0 |
| Compiled routing | Hub engine compiles; manifest `fresh: true` after refresh; front door routes "delegate to hermes" and "run this review through hermes chat" to `cli-hermes` |
| The six existing modes still resolve | Front door routes "delegate to opencode / claude code / codex / cursor / devin / pi" to their own modes |
| Stage one (advisor) | `skill_advisor.py "delegate this review to hermes agent"` returns the hub at confidence 0.95 |
| Stage two (intent reach) | `ci-router-vocabulary-reach.cjs --hub cli-external-orchestration` PASSED: declared 58, no-reach 0, wrong-hub 0 |
| Leaf and derived freshness | `ci-leaf-manifest-freshness.cjs` 13 of 13 fresh; `ci-skill-derived-freshness.cjs` 13 of 13 fresh |
| Every manifest leaf on disk | Nine leaves listed for `cli-hermes`; 10c passes |
| Documented stage-two replay script | Not found at its documented path (`skill-benchmark/router-replay.cjs`); the compiled front door and the reach check stand in |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Every dispatch claim in the packet is source-read** until phase 002 records the live run; the packet marks them so.
2. **`ci-skill-root-metadata.cjs` reports one failure repo-wide**, in `sk-communication`'s stale leaf aliases, a hub this packet did not touch.
3. **The nested-packet reference names a replay script that does not exist**; an amendment to that reference is recorded as an adjacent finding, not fixed here.
<!-- /ANCHOR:limitations -->

---
