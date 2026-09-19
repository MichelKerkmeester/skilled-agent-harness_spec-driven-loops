---
title: "Implementation Summary: Phase 17: build-compiled-serving-gold-admission-checker"
description: "The admission checker is built, tested and running in CI warn-only, and its baseline finds three engine drifts and one stale gold entry among the admitted hubs. The flip cannot run yet: every hub's canary gate scores through modules retired with the benchmark lane."
trigger_phrases:
  - "gold admission checker summary"
  - "phase 17 status"
  - "compiled serving admission baseline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/017-build-compiled-serving-gold-admission-checker"
    last_updated_at: "2026-09-19T05:54:19Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built the checker, its tests and CI step, and ran the baseline"
    next_safe_action: "Decide how the flip gate and the scorer freeze are unblocked"
    blockers:
      - "Every hub's validate-canary.cjs scores through modules retired with the skill-benchmark lane, so activation and flip fail closed"
      - "The scorer freeze may be renewed only on a green routing battery, and two advisor parity tests are red"
    key_files:
      - ".skilled/bin/compiled-route-admission.cjs"
      - ".skilled/bin/lib/compiled-route-admission.cjs"
      - ".skilled/bin/tests/compiled-route-admission.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "How should the canary gate be unblocked: replace it with the admission check, restore the retired modules, or leave the flip blocked?"
      - "Renew the scorer freeze now, or after the two advisor parity failures are resolved?"
      - "When should CI block: after the four baseline failures are fixed, or with an exemption list?"
    answered_questions:
      - "The five build decisions, accepted as recommended on 2026-09-19"
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
| **Spec Folder** | 017-build-compiled-serving-gold-admission-checker |
| **Completed** | Not yet: the flip is blocked |
| **Level** | 2 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Any hub can now be held to the admission bar with one command, `node .skilled/bin/compiled-route-admission.cjs --hub <hub>`, and CI runs it over every hub. Its first run is also the first measurement of the admitted hubs against their own gold since the parity harness was retired, and it found real engine drift.

### The checker

It loads every scenario in a hub's playbook that declares `expected_workflow_mode`, reads the prompt, asks the compiled engine for a decision, and scores it. The scoring follows the operator's answers:
- Every gold mode must be routed, which covers multi-mode gold.
- `clarify` counts as a non-route.
- Negative, `UNKNOWN` and `defer` gold fail on any compiled route.
- Gold naming a mode or leaf the hub does not declare is stale gold, not drift.

A hub outside the default-on cohort must also have scored gold for every declared mode and at least one negative scenario. The admitted hubs get that measurement as a report. The checker calls `compiledRoute()` directly, so it never reads the serving flag or a manifest.

One detail differs from phase 15's research: the engine returns destinations as objects carrying `workflowMode` and `packetId`, not as qualified-id strings. The checker builds the qualified id from those fields and still resolves it through the leaf contract's `qualifiedIdToLeaf`.

### The baseline

`baseline/admission-report.md` holds the first run over the 73 scenarios:
- **Engine drift, 3.**
  - system-deep-loop routes the bare prompt in `advisor-integration/command-bridge-guard.md` to `model-benchmark`. The scenario says a command-bridge lane must not fire without its `/deep:*` command.
  - system-deep-loop answers the `research:` mode hint in `mode-routing/mode-hint-override.md` with `clarify`. The scenario fails exactly that.
  - sk-doc defers on the natural-language holdout `holdout/doc-quality-natural.md`.
- **Stale gold, 1.** sk-doc's `token-cost-baseline/max-load.md` still expects `sk-design-diagram`, a mode of the dissolved sk-design hub.
- **No prompt, 5.** Three cli-external-orchestration hook scenarios have none, and two sk-doc agent-dispatch scenarios point at their setup section instead.
- **Coverage gaps, reported only.** sk-code has gold for 1 of 6 modes and no negative scenario. cli-external-orchestration covers 2 of 7, mcp-tooling 8 of 9, and sk-doc 12 of 14. system-deep-loop covers all five.

The retired parity harness scored these hubs as zero drift. It compared compiled decisions with a replay of the legacy router, so a failure both routers shared never showed up there.

### The flip

`frozen-scorer-contract.cjs` now finds the scorer under either source-root name at `runtime/lib/scorer`. Its pins are keyed relative to that directory, and every digest is unchanged, so the gate names the 7 scorer files that really changed since the 2026-08-15 freeze instead of crashing. The flip still cannot run, for two reasons that need decisions:

- **The canary gate is dead for every hub.** `activate-hub.cjs` and `flip-serving.cjs` both run each hub's `validate-canary.cjs`. All five canaries pin and score through `load-playbook-scenarios.cjs` and `score-skill-benchmark.cjs`, which phase 13 deleted with the benchmark lane. A sandboxed flip with a fresh freeze failed closed there, and the live state was unchanged.
- **The freeze may not be renewed yet.** Its pins say to re-freeze only when the routing battery is green on the new scorer. Two advisor parity tests are red: one ledgered prompt now ranks `system-deep-loop` above `system-spec-kit`, and the Python-correct count fell from 109 to 108.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/compiled-route-admission.cjs` | Created | Command line |
| `.skilled/bin/lib/compiled-route-admission.cjs` | Created | Loader, scorer, floors, reports |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Created | 29 tests |
| `.github/workflows/routing-registry-drift.yml` | Modified | Warn-only step; playbooks join the triggers |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-contract.cjs`, `frozen-scorer-pins.json` | Modified | Scorer path; pins rekeyed, digests unchanged |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modified | Admission runbook and its blockers |
| `baseline/admission-report.json`, `.md` | Created | The baseline |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scoring rules were fixed in fixture tests before the first live run, and three deliberate mutants of the scorer each failed the suite. The checker then ran over the live hubs in the worktree and in a clean clone under Node 22 with no installs, which is how CI will run it. The flip was tried once on a sandboxed copy of the cutover tooling under the gitignored test sandbox root, with a fresh freeze of its own, so no live pin or manifest was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rekey the pins but keep every digest | A re-freeze is a conscious act the pins reserve for a green routing battery; rekeying only makes the gate report the truth |
| Keep CI warn-only | The baseline has four failures on admitted hubs, and fixing engines or gold is outside this phase |
| Report the flip blocker instead of patching around it | The canary gate is a designed safety check; replacing or restoring it is a design choice |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Admission tests | `node --test .skilled/bin/tests/compiled-route-admission.test.cjs`: 29 pass, 0 fail |
| Mutation check | 3 of 3 scorer mutants fail the suite |
| Checker, live | `--all`: 3 hubs pass, 2 drift; exit 1, and 0 with `--warn-only` |
| Clean clone, Node 22 | Same result with no installs |
| Sandboxed flip | Fails closed at the canary gate; live activation hash unchanged |
| Scorer gate | Names the 7 changed files |
| Reference | `validate_document.py`: 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No hub can be activated or flipped yet.** See the flip section above; both blockers need a decision.
2. **The four baseline failures are reported, not fixed.** They belong to the hubs' engines and playbooks.
3. **Found while testing, outside this phase:**
   - Phase 12's `63ad140f9b` broke 8 of the advisor plugin's cache tests. They build workspaces with no source root, which the plugin now declines to cache. The plugin before that commit passes all 40, and no CI job runs this suite.
   - Running the advisor suite rewrites the tracked fixture `tests/scorer/fixtures/.embeddings-cache/skill-embeddings.json`. It was restored by hand.
   - Three advisor CLI job tests fail here because the daemon launcher exits 1.
   - The sync concurrency test leaves four sandbox directories behind on each run.
<!-- /ANCHOR:limitations -->

---
