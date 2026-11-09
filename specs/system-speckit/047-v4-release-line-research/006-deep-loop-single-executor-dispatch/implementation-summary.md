---
title: "Implementation Summary"
description: "Single-executor cli-opencode deep-loop dispatch works again: all four deep YAMLs build the OpenCode command through the fan-out builder, so the rejected --pure flag is gone, and the surrounding drift is closed and locked by a contract test."
trigger_phrases:
  - "deep loop single executor dispatch implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/006-deep-loop-single-executor-dispatch"
    last_updated_at: "2026-11-09T03:30:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Implemented, reviewed and verified the single-executor dispatch fixes"
    next_safe_action: "Commit the phase, then start phase 007"
    blockers: []
    key_files:
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-006"
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
| **Spec Folder** | 006-deep-loop-single-executor-dispatch |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single-executor deep loop on `cli-opencode` no longer fails before its first iteration. The branch now asks the fan-out `buildLineageCommand` for its command, so it gets the argv the installed OpenCode accepts instead of a hand-built one carrying `--pure`.

### Phase 6: deep-loop-single-executor-dispatch

Every admitted executor kind now has an honest single-executor answer. cli-opencode dispatches through the shared builder and forwards the configured sandbox, so a confinement request OpenCode cannot enforce fails closed as it does in fan-out. cli-deepseek-harness stops with exit 2 and a message pointing at fan-out (ADR-001). The research YAMLs read `config.executor.kind` and bind their dispatch ids to `config.lineage.generation`. CLI leaves receive their persona inline, after the gate preamble and the execution-mode block. The research prompt pack prints the configured tool-call cap. The unreachable copilot branches are gone, and a static contract test fails if any of this drifts back.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Builder-based opencode branch, dsh refusal, `kind` branching, generation-bound ids, persona, tool cap binding |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modified | Builder-based opencode branch, `kind` branching, copilot branch removed, persona, tool cap binding |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modified | Builder-based opencode branch, dsh refusal, copilot branch removed, persona |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modified | Builder-based opencode branch, copilot branch removed, persona |
| `.skilled/commands/deep/assets/deep-{research,review}-presentation.txt` | Modified | Name `config.executor.kind` |
| `.skilled/commands/deep/assets/compiled/deep-{research,review}.contract.markdown` | Regenerated | Source digests match the edited YAMLs and presentations |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `agentPersonaBlock` and `withAgentPersona`; persona inlined into non-native fan-out prompts |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | `Max {max_tool_calls_per_iteration} tool calls total.` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Created | Five contract checks, each with a negative control |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Persona order and missing-persona tests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modified | Pins closed stdin (`input === ''`) for v1 and v2 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modified | Binds the new variable and asserts `Max 24 tool calls total.` |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts` | Modified | Searches the dispatcher's contract lines outside the persona block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator baselined first, then ran one cli-codex `gpt-6-luna` high fast worker per finding class (opencode builder, field drift, dsh refusal, tool cap, persona, contract test) and one cli-pi DeepSeek V4.1 Flash max worker for the copilot deletion, checking each diff before the next dispatch. A DeepSeek reviewer read the whole diff (verdict PASS, six P2). Five P2s were confirmed and fixed (two by Luna, one text pass by DeepSeek); the argv-size P2 is accepted below. The first full rerun exposed two caller tests the change broke; Luna fixed both without weakening an assertion, and the whole gate was rerun from the final state.

Baseline (before the first edit) and final, same commands:

| Gate | Baseline | Final |
|------|----------|-------|
| `npx vitest run --no-coverage` in `.skilled/skills/system-deep-loop/runtime` | 172 files passed; 2845 passed, 8 skipped (2853) | 173 files passed; 2853 passed, 8 skipped (2861); exit 0 |
| spec-kit cli vitest, four deep YAML contract files | 4 files, 24 passed | 4 files, 24 passed |
| `compile-command-contracts.cjs` dry print vs file (research, review, ai-council) | fresh, fresh, fresh | fresh, fresh, fresh (research and review regenerated) |
| Ruby YAML parse of the four deep YAMLs | ok x4 | ok x4 |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse single-executor dsh rather than build a dispatch path (ADR-001) | A working path needs a lineage cwd, `DSH_HOME` through the env allowlist and the completion validator; a refusal closes the finding at the cheapest reversal cost |
| Reuse the cursor, devin and pi branch pattern for opencode | Those branches already call `buildLineageCommand`; the opencode copy was the one that drifted |
| Insert the persona after the gate preamble and execution-mode block | The persona says it runs one iteration; placed first it contradicted the fan-out directive that the lineage runs every iteration |
| Fix the two caller tests by scoping their search, not by changing expectations | The persona is the agent file the leaf was already told to read; the assertions target the dispatcher's own contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `opencode run --pure ...` before the change | exit 1, `Unrecognized flag: --pure in command opencode run` (negative control) |
| Builder argv for cli-opencode plus `--help`, from a temp dir | `run --standalone -m ... --format json --auto`; status 0, no `Unrecognized flag` |
| `rg -n -- "--pure" .skilled/commands/deep/assets/*.yaml` | no output |
| `rg -n "config\.executor\.type\|if_cli_copilot" .skilled/commands/deep/assets/` | no output |
| `rg -n "g\{generation\}'" .skilled/commands/deep/assets/deep-research-*.yaml` | no output |
| dsh refusal heredoc run alone | message on stderr, exit 2 |
| Confirm-YAML claude branch run with `claude` stubbed to `printf` | output starts with `=== BEGIN AGENT PERSONA`, ends with the iteration body |
| Runtime vitest and spec-kit YAML tests | see the table above: PASS |
| Cross-family review (DeepSeek V4.1 Flash max via cli-pi) | PASS, 0 P0/P1, 6 P2; 5 fixed, 1 accepted |
| Acceptance criteria | 9 of 9 Met (`acceptance-criteria.md`); tasks P0 and P1 checklist items done |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The persona travels in argv and in dispatch receipts.** `deep-review.md` is 39 KB, so one positional prompt grows to about 50-57 KB, under the 128 KB single-argument limit on Linux with about 2x headroom, and each receipt stores it. If prompts grow, move the persona into the rendered iteration file.
2. **Single-executor dsh is refused, not supported.** Use fan-out for dsh, or cli-pi or cli-opencode on `opencode-go/deepseek-v4.1-flash` for a single-executor DeepSeek loop.
3. **Adjacent defects recorded, not fixed.** `deep-research-confirm.yaml` has no cursor, devin, pi or codex branch; `deep-review/SKILL.md:48` and the deep-research and deep-review changelogs still describe copilot dispatch.
<!-- /ANCHOR:limitations -->

---
