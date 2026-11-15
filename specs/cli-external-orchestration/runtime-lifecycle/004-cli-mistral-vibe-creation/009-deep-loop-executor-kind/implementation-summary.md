---
title: "Implementation Summary"
description: "A deep-loop fan-out run can now use Mistral Vibe as the cli-mistral-vibe executor kind, with a lineage-local Vibe home and a per-lineage outcome scored from export.json."
trigger_phrases:
  - "deep loop executor kind implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind"
    last_updated_at: "2026-11-14T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the Vibe executor kind phase"
    next_safe_action: "Phase 011 adds the goal bridge"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Alias source: the aliases come from the phase 006 model rows, both with thinking max"
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
| **Spec Folder** | 009-deep-loop-executor-kind |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-research or deep-review fan-out run can now name `cli-mistral-vibe` as an executor group. A keyed research lineage ran beside an OpenCode group, wrote its iteration file and ended with `export.json` showing `exit_code` 0.

### Phase 9: deep-loop-executor-kind

The kind accepts only `model`, `timeoutSeconds` and `liveTools`, and it rejects any model alias outside the two roster aliases, `deepseek-flash` and `glm-flash`. Before launch the adapter checks for the binary, pins Vibe 3.1.2 and checks the alias. It then gives the lineage its own `VIBE_HOME`, prompt file and output folder. The runner scores each lineage from `export.json`: exit 0 with an export is success, exit 3 with an export is a partial result that never counts as success, and no export is failure, which keeps Vibe's exit 3 apart from the recursion guard's. The recursion guard knows the names Vibe runs under, and the env filter passes `MISTRAL_API_KEY` and `VIBE_` variables but replaces an inherited `VIBE_HOME`. Both deep-loop YAMLs refuse a single-executor Vibe run and point to fan-out.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | The kind, its field support and the roster allowlist |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Binary names, env prefix and key, lineage-state variables |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `buildVibeLineageCommand` and the per-lineage export scoring |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/`, `tests/stress/cli-adapter/` | Modified, created | Unit cases, the stress fixture with its exit 3 shim, live contract and matrix rows |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml` | Modified | The `if_cli_mistral_vibe` refusal branch |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md`, `README.md` | Modified | Replaced the stale "out of scope" and "not registered" lines with what lineages now do |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

OpenCode dispatches on `mistral/deepseek-v4-1-flash-1017#max` wrote the kind, adapter and tests, each worker on its own files. The orchestrator ran the suites, the keyed lineage, the preflight check and the secret scan itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Supersede AC-012 with AC-013 (ADR-001) | The new kind forced edits to two existing cases, the kind count and the web-search matrix model id |
| Fan-out only | The lineage-local home, output folder and export scoring live in the fan-out adapter |
| Score from `export.json`, not the exit code | Vibe and the recursion guard both use exit 3 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Executor unit suites | PASS: `Tests  382 passed (382)`, baseline 365 |
| Stress suite | PASS: 9 files, `175 passed, 9 skipped`, baseline `153 passed, 8 skipped` |
| Typecheck | PASS: `npm run typecheck` exit 0 |
| Dispatch hook suite | PASS: 59 tests, 0 failures |
| Preflight on the built command (T020) | PASS with a recorded deviation: `[]` once the runner's closed empty stdin is written as `</dev/null` |
| Keyed lineage | PASS: `vibe-1/vibe-output/export.json` `exit_code` 0, beside `oc-1` |
| Operator `~/.vibe` | PASS: nothing newer than the lineage's prompt file |
| Secret scan of `research/` and `scratch/` | PASS: no key value, no `vibe-home` folder, no key-shaped string |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vibe lineages are unguarded.** A lineage runs with `--auto-approve` and has no confinement. In the keyed run all 136 hook records came from Vibe's built-in `agents_md` hook, so the repository's guard hooks never ran. The likely cause is that the lineage trusts only its own folder. Amended on 2026-11-14 by phase 011: the adapter now renders the repository hooks into each lineage's `VIBE_HOME` with absolute paths and passes `VIBE_SPEC_FOLDER`, so the guards load; `--auto-approve` and the missing confinement remain.
2. **The stdin hard rule reads argv only.** The built command does not pass `stdin-redirect-required` as written, because the runner closes stdin through the spawn rather than through a redirect. Either the rule should accept a closed-pipe stdin, or the adapter's recorded command should carry the redirect.
3. **Keyed evidence sits in `research/`.** CHK-050 asked for `scratch/`.
<!-- /ANCHOR:limitations -->
