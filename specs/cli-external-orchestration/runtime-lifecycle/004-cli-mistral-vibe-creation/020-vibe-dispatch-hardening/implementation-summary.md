---
title: "Implementation Summary"
description: "The Vibe dispatch render rule, the recorded lineage posture, the CI collection of the repo-guards suites, and the dist-rebuild switch docs, all verified."
trigger_phrases:
  - "vibe dispatch hardening implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/020-vibe-dispatch-hardening"
    last_updated_at: "2026-11-14T23:30:00Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Built and verified every task in the phase"
    next_safe_action: "None: the phase validates PASSED"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json"
      - ".github/workflows/opencode-plugin-tests.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Approval posture: Option A, keep --auto-approve behind the rendered guards"
      - "Spec-gate posture: keep both AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_DISABLED=1"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-vibe-dispatch-hardening |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Vibe dispatch now has to render its guards into the home it names, in the same command and before the run. A hand-composed dispatch that skips the render is refused, and a copy of the documented recipe with the render step removed is refused whether its home is a literal or a variable.

### Phase 20: vibe-dispatch-hardening

The phase closes the four gaps carried out of the executor-kind and goal-hook work:

- **Seventh hard rule.** `rendered-home-hooks` joins the six Vibe rules. It reads the dispatch's own `VIBE_HOME` assignment and refuses unless the same command runs `render-home-hooks.cjs` with an argument textually equal to that value, chained before the run. Four new cases cover a literal home with no render, a variable home with the render removed, a render naming another home, and the documented shape that passes.
- **Recorded lineage posture.** The parent decision record holds Q004 (approval: keep `--auto-approve` behind the twelve rendered guards) and Q005 (spec gate: keep both `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_DISABLED=1`), each approved by the operator. No runner flag changed.
- **Vibe tests in CI.** The hook node:test job now walks `.vibe/plugins/repo-guards/tests`, both workflow path filters include `.vibe/**`, and the three Vibe mirror suites sit beside their dsh siblings in the advisory gate suite.
- **Dist-rebuild switch documented.** The env reference and the cli-mistral-vibe lineage section both explain why a lineage runs with `SPECKIT_DIST_AUTO_REBUILD=0`: sibling lineages would race one checkout build.
- **Three mirror suites.** `sync-agents-vibe`, `sync-prompts-vibe` and `sync-skills-vibe` now have node:test coverage of the reserved names, name collisions where the generator has them, pruning, dotfiles and linked operator entries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | The `rendered-home-hooks` check and its render-argument parser |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Rule fixtures plus four refuse/accept cases |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | Modified | The seventh rule row, its message naming the render line |
| `../decision-record.md` (parent) | Modified (append) | Q004 and Q005 with the operator's approval |
| `.github/workflows/opencode-plugin-tests.yml` | Modified | `.vibe/**` path filters and the widened node:test roots |
| `.github/workflows/advisory-checks.yml` | Modified | The three Vibe sync-generator suites beside the dsh siblings |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-vibe.test.mjs` | Created | Agents mirror suite |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-vibe.test.mjs` | Created | Prompts mirror suite |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-vibe.test.mjs` | Modified | Added collision, prune and reserved-prefix cases |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | The lineage dist-rebuild switch |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md` | Modified | The same switch in the lineage section |
| `graph-metadata.json` | Rewritten by validation | Draft metadata auto-repair during the strict run |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rule was written into the existing check registry beside the other Vibe home checks. The parser walks the dispatch's word list, takes the home argument of every `node render-home-hooks.cjs` invocation, and compares it with the value in the dispatch's own `VIBE_HOME` assignment; a quoted span stays one word, so a prompt that quotes the command cannot satisfy it. The rule row enables the check in the packet sidecar.

The posture decision was recorded before any flag question was answered, so the runner change task resolved to no change. The CI job widened its existing `find` roots rather than adding a second job, and the mirror suites follow the dsh sibling structure with the Vibe generators' own environment variables.

Verification is in `tasks.md` and in the table below. The rule and audit suites reran after the final state, the CI collection command ran locally over the widened roots, and the repo-guard suites ran under `env -i` so the worker's spec-gate switches could not mask their result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enforce the render on command text, in the same command | The renderer writes the only hooks file a scratch-cwd run loads; an earlier command is invisible to a dispatch guard, and the documented recipe chains the step |
| Require the render argument to repeat the home value | The renderer never reads an inherited `VIBE_HOME`, so `$VIBE_HOME` alone proves nothing and can point at a long-lived home |
| Keep `--auto-approve` (Option A) | The operator chose the rendered strict guards over the permission model; the classifier alternative has no one to answer a denial in a headless child |
| Keep both spec-gate switches | The second switch is redundant today but keeps the gate off if a later change drops `AI_SESSION_CHILD=1` |
| CI, not a new pre-commit step, is the gate | The pre-commit hook runs no `node:test` file and has none of the provisioning the CI job already does |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | `tests 64`, `pass 64`, `fail 0` (baseline 60 plus four) |
| `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` | `Test Files 1 passed (1)`, `Tests 130 passed (130)` |
| `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-vibe.test.mjs` | `tests 5`, `pass 5`, `fail 0` |
| `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-vibe.test.mjs` | `tests 5`, `pass 5`, `fail 0` |
| `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-vibe.test.mjs` | `tests 4`, `pass 4`, `fail 0` |
| `env -i PATH="$PATH" HOME="$HOME" node --test .vibe/plugins/repo-guards/tests/*.test.mjs` | `tests 12`, `pass 12`, `fail 0` |
| The CI collection command from `opencode-plugin-tests.yml`, run locally | `Collected 92 node:test hook and Vibe repo-guard files`, all four repo-guard files listed (`scratch/ci-collection.txt`) |
| `node -e 'console.log(require("./.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json").length)'` | `7` |
| `rg -n "'--auto-approve'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Still present at line 3268; the decision kept it |
| `validate.sh <folder> --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Command text only.** The render rule reads the dispatch's own command, so a render done in an earlier call is invisible to it; the refusal message names the one-line render step to chain, and the fan-out runner renders inside its own process, outside this rule.
2. **The short command block lags the rule.** The cli-mistral-vibe skill's concise dispatch block still shows the run without the chained render; the prose beside it names the render step. The documentation-correction phase owns that edit.
3. **The agents generator has no name-collision surface.** Its output name is the source file's stem, so the suite covers sourceless-profile drift, the reserved `main` stem and dotfiles instead.
<!-- /ANCHOR:limitations -->

---
