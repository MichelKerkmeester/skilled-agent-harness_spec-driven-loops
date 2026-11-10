---
title: "Implementation Summary"
description: "The Jev Pi transport now runs on the installed managed Pi, every advertised Jev phrase routes, an OpenCode Go request reaches the CLI hub, and a hook that is not firing gets a doctor command."
trigger_phrases:
  - "cli hub routing and classifier implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/015-cli-hub-routing-and-classifier"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with the final gate green"
    next_safe_action: "Ask the lead before phase 017"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-015"
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
| **Spec Folder** | 015-cli-hub-routing-and-classifier |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The routes the documentation advertises now reach their targets. A Jev judgment can answer through the installed Pi, eight Jev phrases that deferred now route, and the advisor sends an OpenCode Go request and a hook problem where they belong.

### Phase 15: cli-hub-routing-and-classifier

The Pi transport reads the managed install's `current-version` when no package sits above the `pi` launcher, and accepts 0.99.2 or any 1.x-or-later release whose runtime carries the two calls it makes. The cli-classifier hub vocabulary carries every phrase both ROUTER files advertise, and a test probes each one. In the advisor, an `opencode go` phrase points at cli-external-orchestration and the bare `opencode` token no longer boosts sk-code. A "not firing" or "not triggering" problem is a strong cue, and `/doctor:git setup` carries three hook-not-firing phrases.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modified | Managed-install resolution, version and surface gates |
| `.skilled/skills/cli-classifier/hub-router.json` | Modified | Advertised Jev phrases |
| `.skilled/skills/cli-classifier/shared/scripts/tests/{jev-transport.test.mjs,hub-router-phrases.test.mjs}` | Modified/Created | Transport and phrase coverage |
| `.skilled/skills/cli-classifier/{cli-jev/SKILL.md,feature-catalog/...,shared/scripts/README.md,shared/scripts/tests/README.md}` | Modified | Gate and test inventory wording |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/{lanes/explicit.ts,doctor-helper-handoff.ts}` | Modified | OpenCode Go phrase, firing cue |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`, `scripts/command-bridges/command-bridges.generated.json` | Regenerated | Bridges from the doctor phrases |
| `.skilled/skills/system-skill-advisor/runtime/tests/{doctor-helper-handoff.vitest.ts,scorer/opencode-provider-route.vitest.ts}` | Modified/Created | Advisor coverage |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Hook-not-firing phrases |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json` and its authored copy | Regenerated | Re-minted for the new hub vocabulary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The GPT quota ran out at the first dispatch, so every worker ran on cli-pi DeepSeek V4.1 Flash max. Workers made the edits; the orchestrator regenerated the bridges, rebuilt the advisor dist and re-minted the manifest, then reviewed the full diff itself and reran every check.

| Suite | Command | Baseline | Final |
|-------|---------|----------|-------|
| Advisor vitest | `npx vitest run` in `system-skill-advisor/runtime` | 1379 passed, 8 skipped | 1383 passed, 8 skipped, exit 0 |
| Advisor typecheck | `npm run --silent typecheck` | exit 0 | exit 0 |
| Classifier node tests | `node --test` over every `*.test.mjs` in `cli-classifier` | 172 of 172 | 179 of 179 |
| Compiled-routing bin tests | `node --test .skilled/bin/tests/*.test.cjs` | 156 pass, 16 fail | 172 pass, 0 fail |
| Route sync check | `compiled-route-sync.cjs --check` | 55 served copies match | 55 served copies match |
| Route guard | `compiled-route-guard.cjs` | not run at baseline | all hubs fresh or excused |
| Bridge freshness | `derive-command-bridges.cjs --check` | n/a | fresh |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the hub's DeepSeek Harness choice for "opencode go route" (ADR-001) | It is a documented design with a passing test; the defect was the advisor sending the prompt to sk-code |
| Gate the Pi route on the runtime's calls, not one version | A pin breaks on every Pi release; the calls are what the transport needs |
| Reject a release name that does not start with a letter or digit | The name reaches a path join; `.` and `..` would escape the releases folder |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite and typecheck | PASS: 1383 passed, exit 0 |
| Classifier tests | PASS: 179 of 179 |
| Bin tests | PASS: 172 pass, 0 fail |
| Live advisor: "opencode go route this task" | PASS: cli-external-orchestration 0.734 over sk-code 0.657 |
| Live advisor: "write an opencode plugin" | PASS: sk-code 0.767 first |
| Live advisor: "my hooks are not firing, what do I run" | PASS: `command-doctor-git-setup` 0.607 listed |
| Route sync, guard, bridges | PASS: all fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **"triggered" and "fired" are not cues.** "my hook is not triggered" still gets no hand-off.
2. **The Pi transport benchmark keeps its 0.99.2 gate.** It records the version it measured, so a rerun on Pi 1.5.0 skips its Pi arm.
3. **The hook phrases sit on `/doctor:git setup`.** Session hooks that do not fire have no doctor route of their own.
<!-- /ANCHOR:limitations -->

---
