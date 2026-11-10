---
title: "Implementation Summary"
description: "A prompt that names a runtime as the owner of a hook, plugin or guard no longer routes to that runtime's CLI executor, and a real hand-off beside it still does. Corpus accuracy is unchanged."
trigger_phrases:
  - "runtime name implementation routing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/006-runtime-name-implementation-routing"
    last_updated_at: "2026-11-08T16:43:36Z"
    last_updated_by: "generate-context"
    recent_action: "Shipped the runtime-surface mask; no probe routes to a CLI executor"
    next_safe_action: "Decide whether sk-code should declare hook and guard vocabulary"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json"
    session_dedup:
      fingerprint: "sha256:d89c83891bad4ee156c33c05c72ae38829b61cb76e6c36c3ceec08961c0c5df5"
      session_id: "scaffold-034-runtime-name-implementation-routing"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "37344d65-539c-401d-8341-c9b769fd34a7"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-08T16:43:36Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-runtime-name-implementation-routing |
| **Completed** | 2026-11-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

"Make the Claude Code Stop hook return a block" used to route to the Claude Code CLI executor, because the advisor read any runtime name as a request to hand work to it. It now routes to `sk-code`, while "use codex to fix the Claude Code Stop hook" still goes to Codex.

### Route implementation prompts that name a runtime surface to the code skill, not the CLI executor

The delegation resolver now blanks a runtime name that a surface noun follows within two words: hook, plugin, extension, adapter or guard. That mention names the code you are building, so it is never matched as a hand-off. The rest of the prompt is still read, so a separate hand-off cue routes as before. When no hand-off resolves and the CLI hub still leads only because its author lane matched that runtime name, the hub drops below the next passing candidate. A literal `cli-*` skill id keeps the hub on top, because naming the skill is an explicit choice. The Python fallback carries the same mask, so both engines agree on the shared fixture.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Modified | Surface mask before alias matching, and the surface-only hub demotion |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | The same mask in the Python fallback resolver |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modified | Four surface cases, a hand-off beside a surface, a runtime with no surface |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Modified | Two `runtime-surface` cases both engines must agree on |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | Re-captured; only the delegation bucket moves, 18 to 20 |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-validate.vitest.ts` | Modified | Delegation census pins 18 to 20 |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modified | Claude Stop hook count 3 to 4, for the ask-surface guard registered there |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Keywords gain guard, adapter, stderr and detector |
| `.skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts` | Modified | Import follows the hooks track rename to `hooks-plugins-extensions` |
| `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl` | Modified | Session id uses the `template-session` token the scaffold replaces |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md` | Modified | A test writes only into its own temp folder, after a Pi test's marker in the shared temp root failed 27 goal-core tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first: the probes, `advisor_validate`, the vitest suite and the Python regression suite all ran before the edit. The mask alone moved two of the four CLI misses, and a trace showed fusion's author lane still lifted the hub for the other two, so the demotion followed. Each engine was rebuilt and rerun, and the eval baseline was re-captured with its own script.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mask the surface mention, not the whole prompt | A blanket guard like the existing OpenCode one would also drop a real hand-off in the same sentence |
| Demote the hub after fusion rather than change the author lane | The author lane serves every prompt; the override already owns delegation decisions and touches only prompts that name a runtime surface |
| Add four code words to `sk-code`'s keywords, with the operator's approval | guard, adapter, stderr and detector move P01, P04, P05 and P06 and leave the corpus unchanged. Bare "hook" stole advisor-hook, env-example and changelog prompts, and "fixtures" stole a documentation prompt, so both were dropped after spot checks |
| Change SC-001 from 7 of 11 to no CLI misses | The 7-of-11 target was set before the trace; the remaining misses score near zero on every skill, so no scorer fix reaches them honestly |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `run-probes.cjs` | Before: pass 3, four CLI executors. After the mask: pass 4, no CLI executor. After the keywords: pass 8 |
| `advisor_validate` | Before and after: 158/195, holdout 30/40, UNKNOWN 13, the same four pre-existing parity regressions |
| Advisor vitest | Before: 1 failed test, 2 failed files. After: 0 failed tests and 0 failed files once the stale import was fixed |
| Collision spot checks | Git-hook, advisor-hook, env-example, changelog, spec-gate guard and README prompts keep their owners with the final keyword set |
| Scaffold probe | A throwaway Level 2 scaffold writes `session_id: "scaffold-999-scaffold-probe"`; spec-kit template and scaffold tests 201/201, AC-closure 29/29 |
| Python regression suite | 78/84 before and after, the same six failures |
| Delegation tests and fixture | 87/87, TypeScript and Python agree on both new cases |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three probes still miss, each for a stated reason.** P07 names a rule file that no skill owns, and claiming bare `.md` paths for `sk-doc` would pull spec-doc prompts from `system-spec-kit`. P09 routes to `sk-code` on `hook-registry.json`, a JSON edit. Moving P09 to `system-spec-kit` was tried with `hook-registry` and `hook configs` in its keywords: both skills then scored 1.0 on the author lane, `sk-code` still led on shared words, and an unrelated hook-flags prompt moved, so it was reverted. P11 routes to `sk-doc` because it asks to document the switch in a README.
2. **The 22 other copies of the old placeholder stay as they are.** None is a live packet: each sits in a research run's frozen `containment/baseline` snapshot or a scratch backup, and editing one would change recorded evidence.
<!-- /ANCHOR:limitations -->

---
