---
title: "Implementation Summary"
description: "The sk-code compiled front door now takes the session's detected surface as --surface-hint, so a keyword tie between surfaces opens with the surface the session works in."
trigger_phrases:
  - "session aware tie break implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break"
    last_updated_at: "2026-10-10T19:30:00Z"
    last_updated_by: "verifier"
    recent_action: "Verified, reviewed and closed after the orchestrator steps"
    next_safe_action: "Commit the child"
    blockers: []
    key_files:
      - ".skilled/bin/compiled-route.cjs"
      - ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs"
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"
      - ".skilled/bin/tests/compiled-route-surface-hint.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-session-aware-tie-break"
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
| **Spec Folder** | 008-session-aware-tie-break |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When a prompt matches two code surfaces equally, the surface your session is working in now leads the bundle. The Webflow test-plan and language-check prompts that used to open with OpenCode now open with Webflow once the caller passes `--surface-hint WEBFLOW`. Without a usable hint every hub routes as before.

### Phase 8: session-aware-tie-break

The sk-code canary router exports `applySurfaceHint`. It matches a hint (a detection label such as `WEBFLOW`, or a `workflowMode` such as `sk-code-webflow`, case-insensitive) against the hub's declared surface destinations and, when that surface is already among a validated route's targets, moves it into the first surface slot. Workflow modes keep their slots, no target is added or dropped, and `UNKNOWN`, an unknown name or a surface the prompt did not match return the targets unchanged. The runtime engine calls it at serve time when `compiledRoute` receives `options.surfaceHint`, `resolveRoute` passes the option through and the front door reads `--surface-hint <SURFACE>`. The sk-code canary harness applies a case's `surfaceHint` the same way, so the fixture pins the served order. Hubs whose router exports no `applySurfaceHint` serve the compiled order whatever hint arrives.

The hub `SKILL.md` gains a `Session surface hint.` paragraph after the compiled-routing blockquote, `ROUTER.md` gains one sentence in its Core Principle paragraph, and the hub ships release 2.2.7.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modified | Authored source of `hintedSurface` and the exported `applySurfaceHint` |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modified | Byte copy of the authored router |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | Modified | Authored harness: `typedGold` applies a case's `surfaceHint` |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | Modified | Byte copy of the authored harness |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/compiled-route.cjs` | Modified | Authored engine: `compiledRoute(hubId, taskText, options)` |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modified | Byte copy of the authored engine |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs` | Modified | Authored resolver: `resolveRoute(hubId, taskText, options)` |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modified | Byte copy of the authored resolver |
| `.skilled/bin/compiled-route.cjs` | Modified | `--surface-hint <SURFACE>` flag and usage line |
| `.skilled/bin/README.md` | Modified | Front door row documents the flag (orchestrator handoff) |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Created | Six resolver and front door cases |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Five canary cases, three of them hinted |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Byte copy of the live fixture |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Version and the caller paragraph |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Version and one caller sentence |
| `.skilled/skills/sk-code/README.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | Version 2.2.7.0 |
| `.skilled/skills/sk-code/changelog/v2.2.7.0.md` | Created | Hub release entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash built the 28 planned units one at a time, each checked against its expected output (chain log: 28 of 28 PASS in order, plus the README handoff, no stray changes). The tests and canary cases were added before the code, and the negative controls prove they fail on the unchanged code (`# fail 3` and `cases 18 failures 3`). The verifier then reran every Phase 2 check and Phase 3 task, read the full diff and probed the engine with eleven hint values across four prompts. The compiled sk-code manifest re-mint, its archive copy, the Hermes generator and the trigger-index rebuild are orchestrator steps and have not run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Apply the hint after validation, in an exported `applySurfaceHint` called by the engine and by the canary harness | Reordering inside `evaluateCanary` fails the decision contract, since only the compiled composition rules are valid orders. One function serves both callers, so the canary tests the code that serves |
| `--surface-hint <SURFACE>` takes a detection label or a `workflowMode`, matched against declared surface destinations | The caller holds a label from `stack-detection.md`, and matching declared destinations is the validation. `UNKNOWN` matches nothing |
| An invalid hint is silent on stdout and stderr | The router stays pure and the front door test asserts an empty stderr |
| Edit each authored closure file and copy it byte for byte over its runtime copy, with no sync rebuild | `compiled-route-sync.cjs --check` already fails on the authored tree, and `--verify` is the only form run |
| The caller step is a paragraph after the compiled-routing blockquote | The blockquote is lockstep text across seven surfaces, and the lockstep test output is unchanged |
| Patch release 2.2.7.0 | An optional input that fixes a misrouting breaks no caller |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1: `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-surface-hint.test.cjs` | PASS: exit 0, `# pass 6`, `# fail 0` (`# fail 3` before the code change) |
| Goal 2: `scratch/canary-assert.cjs` and `cmp` of the two fixture copies | PASS: exit 0, `OK surface-hint-webflow-testing route orderedBundle sk-code-webflow,sk-code-opencode`, `cases 18 failures 0`, `cmp=0` |
| Goal 3: `scratch/all-canaries.cjs`, filtered | PASS: no FAIL line outside the baseline `jev-transport-single`, filter exit 1, `001-sk-code cases 18 failures 0`. The only diff against baseline is `cases 13` to `cases 18` |
| Goal 4: `cmp` of the four authored closure files against their runtime copies | PASS: no output, exit 0 |
| Goal 5: `grep -c -F -- '--surface-hint'` on `SKILL.md` and `ROUTER.md` | PASS: `SKILL.md:1` and `ROUTER.md:1` |
| Goal 6: `validate.sh <folder> --strict` | PASS: `RESULT: PASSED` |
| No hint, no change (T049) | PASS: probe diff 0, the canary diff is `1c1` only (13 to 18 cases), admission 28 pass, 1 fail and manifest 26 pass, 16 fail as at baseline, and after the orchestrator's re-mint the front door test reads `# pass 1` `# fail 0` |
| Hub guards (T052) | PASS: router-sync 5/5, doc-claims 4/4, parent-skill-check OK with 5e, 5i and 13c PASS, leaf manifest `OK (59ea33fd...)` |
| Advisor battery (T053) | PASS: `positives 13/17 negatives-false-positive 2/5`, no diff |
| Release and hub docs (T051, T054) | PASS: six carriers at 2.2.7.0, changelog VALID with 0 issues and 0 hard blockers, `SKILL.md` 0 issues and 36 hard blockers, `ROUTER.md` 1 issue and 32 hard blockers (all equal to baseline), lockstep output unchanged |
| Compiled routing serves the hint (T055) | PASS after the orchestrator's re-mint and archive copy: guard `sk-code fresh` and `All hubs fresh or excused`, the front door with `--surface-hint WEBFLOW` prints `"workflowMode":"sk-code-webflow"` then `"workflowMode":"sk-code-opencode"`, `move-simulation OK`, `verify=0`, `cmp=0` |
| Hermes copies (T056) | PASS after the orchestrator's generator run: `PASS: 70 Hermes skill copies in sync`, exit 0 |
| Review | No defects. The diff matches the plan, the new prose has no em dashes or semicolons, no code comment names a spec path or id, and fix-units.json is empty |

**Reviewer result.** The parallel reviewer found no defect. It ran 1,287 prompts against 47 hint values (`runs 60489 changed 1195 bad 0`), checked six other hubs (0 diffs) and the front door with `--prompt-stdin`, and wrote `[]`.

**Orchestrator steps, 2026-10-10.** The sk-code manifest was re-minted and copied over its archive copy (`cmp=0`), the Hermes generator wrote 1 of 70 copies (`PASS: 70 Hermes skill copies in sync`), and the trigger index was rebuilt (`stale documents   : 0`). `compiled-route-sync.cjs --verify` prints `move-simulation OK`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hint reaches the router only when the caller passes it.** The hub text tells the agent to, but nothing enforces it, so a caller that omits the flag gets the static tie-break order.
2. **Only the sk-code router exports `applySurfaceHint`.** Other hubs ignore the flag by design.
3. **`compiledRoute` with a `null` options argument throws.** The resolver catches it and falls back to legacy, and the front door always passes an object, so no shipped caller reaches it.
<!-- /ANCHOR:limitations -->

---
