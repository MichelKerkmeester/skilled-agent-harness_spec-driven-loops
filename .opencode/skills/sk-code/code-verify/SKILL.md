---
name: code-verify
description: Non-mutating verification mode for sk-code; runs surface-appropriate commands, records Iron Law evidence, reports baseline deltas, and gates completion claims.
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.1
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-verify, verification, iron law, non-mutating, baseline delta, mutation check, claim falsifier, webflow verification, opencode verification, completion evidence -->

# Code Verify (verify)

`verify` is the non-mutating verification MODE child of the `sk-code` family. It runs last. It consumes shared surface detection, executes surface-appropriate verification commands, records fresh evidence, compares against the implementation baseline, applies mutation and claim-falsifier rituals, and gates any done, works, complete, fixed, or passing claim. It never edits code.

---

## 1. WHEN TO USE

### Activation Triggers

Use this mode when the request involves:
- Verifying work after implementation, quality checks, or debugging.
- Running final commands before a done, works, complete, fixed, passing, or ready claim.
- Collecting Iron Law evidence for WEBFLOW/browser behavior or OPENCODE system-code changes.
- Reporting the delta from the baseline captured before implementation.
- Running mutation checks or claim-falsifier checks after a green result.
- Walking the verification ladder and naming each rung's blind spot.
- Confirming that tests, minification, alignment drift, stack-folder checks, or browser evidence support the claim.

Keyword triggers: `verify`, `verification`, `done`, `works`, `complete`, `fixed`, `passing`, `ready`, `Iron Law`, `mutation check`, `claim falsifier`, `baseline delta`, `browser evidence`, `alignment verifier`, `verify after change`.

### When NOT to Use

Skip this mode when:
- The task requires writing code, scaffolding files, or changing behavior. Use `code-implement`.
- The task is the author-side quality gate or an in-place checklist fix. Use `code-quality`.
- Verification finds a defect that needs root-cause repair. Use `code-debug`.
- The user wants findings-first review output or PR review. Use `code-review`.
- The active surface and verification command set are unknown. Ask for them or hand back to the hub UNKNOWN fallback.

### Family Boundary

This is an independently invokable member of the `sk-code` family. It owns evidence, not fixes. Its tool surface is deliberately read-only plus shell execution: `Read`, `Bash`, `Grep`, and `Glob`. When verification fails, it reports the evidence and hands back to `code-debug` for repair or `code-implement` for missing build work.

Pairs well with:
- `code-quality` immediately before verification, because quality evidence must be clean enough to verify.
- `code-debug` when a verification failure has a reproducible symptom.
- `code-implement` when verification proves requested behavior is missing.
- `code-review` when the user wants a review report instead of final verification evidence.

---

## 2. SMART ROUTING

### Primary Detection Signal

Surface identity is resolved once by the parent shared router. This mode consumes that result and then routes by evidence type:

```text
VERIFY TASK
    |
    +- Surface identity -> ../shared/references/stack_detection.md
    +- Phase lifecycle  -> ../shared/references/phase_detection.md
    +- Resource routing -> ../shared/references/smart_routing.md
    |
    +- Universal pre-claim gate -> assets/universal-verification_checklist.md
    +- WEBFLOW verification     -> assets/webflow-verification_checklist.md + references/webflow-verification/*
    +- WEBFLOW performance      -> assets/performance_loading_checklist.md + performance checklist
    +- OPENCODE verification    -> assets/scripts/verify_alignment_drift.py + targeted tests
    +- Stack-folder integrity   -> assets/scripts/verify_stack_folders.py
```

### Phase Detection

```text
Phase 1 Implementation
    -> Phase 1.5 Code Quality Gate
    -> Phase 2 Debugging if failures exist
    -> Phase 3 Verification runs here
        -> read baseline from implementation context
        -> run surface command set
        -> run targeted tests or browser checks
        -> report delta from baseline
        -> apply mutation or claim-falsifier ritual when applicable
        -> claim only what evidence proves
        -> hand back if a defect is found
```

### Resource Domains

- `assets/universal-verification_checklist.md` is the pre-claim gate for all supported surfaces.
- `assets/webflow-verification_checklist.md` is the Webflow/browser verification checklist.
- `assets/performance_loading_checklist.md` is the performance-loading checklist.
- `references/webflow-verification/verification_workflows.md` owns browser evidence and Webflow verification workflows.
- `references/webflow-verification/performance_checklist.md` owns Webflow performance verification details.
- `assets/scripts/verify_alignment_drift.py` checks OpenCode alignment drift for changed scopes.
- `assets/scripts/test_verify_alignment_drift.py` tests the alignment verifier.
- `assets/scripts/verify_stack_folders.py` checks stack-folder integrity.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any verification invocation | `../shared/references/stack_detection.md`, `../shared/references/smart_routing.md`, `../shared/references/phase_detection.md` |
| ALWAYS | Before any done, works, complete, fixed, passing, or ready claim | `assets/universal-verification_checklist.md` |
| CONDITIONAL | WEBFLOW/frontend behavior, layout, animation, media, forms, navigation, or minification | `assets/webflow-verification_checklist.md`, `references/webflow-verification/verification_workflows.md` |
| CONDITIONAL | WEBFLOW performance, loading, Core Web Vitals, or runtime weight concern | `assets/performance_loading_checklist.md`, `references/webflow-verification/performance_checklist.md` |
| CONDITIONAL | OPENCODE skill, agent, command, spec, MCP, hook, script, config, or language target | `assets/scripts/verify_alignment_drift.py`, targeted language/project tests selected from shared routing |
| CONDITIONAL | Stack-folder or surface-router integrity | `assets/scripts/verify_stack_folders.py` |
| ON_DEMAND | Verifier implementation changed | `assets/scripts/test_verify_alignment_drift.py` |

### Verification Command Matrix

| Surface | Required Evidence | Blind Spot To Name |
| --- | --- | --- |
| WEBFLOW | `node .opencode/skills/sk-code/webflow/assets/scripts/minify-webflow.mjs`, `node .opencode/skills/sk-code/webflow/assets/scripts/verify-minification.mjs`, `node .opencode/skills/sk-code/webflow/assets/scripts/test-minified-runtime.mjs`, and browser evidence for affected desktop/mobile behavior | Build scripts cannot prove real browser interaction, layout, animation timing, or console state. |
| OPENCODE | `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py --root <changed-scope>` plus targeted tests such as vitest, pytest, shellcheck, JSON validation, or spec validation | Alignment checks cannot prove every runtime path or external consumer behavior. |
| UNKNOWN | User-selected command set before any claim | Unsupported surfaces have no built-in evidence contract. |

The Webflow script trio is owned by the implementation packet because those scripts build and inspect Webflow bundles. Verification owns when to run them, how to interpret their evidence, and the browser/runtime claim boundary. If a command path is missing or moved, do not invent a replacement; report the missing verifier and hand back to the owner.

### Baseline And Delta Contract

Verification must compare against the baseline captured before implementation whenever a no-regressions or improved claim is made. Report:

| Field | Required Content |
| --- | --- |
| Baseline | Starting command status, failing tests, warning count, browser issue, performance number, or stated UNKNOWN when no baseline was captured. |
| Current | Fresh command output, exit codes, test counts, browser observations, or measured numbers. |
| Delta | What changed, improved, regressed, or remains unproven. |
| Claim Scope | The exact claim supported by the evidence and the blind spot that remains. |

No baseline means no broad no-regressions claim. You may still make a narrower claim tied to fresh evidence.

---

## 3. HOW IT WORKS

### Verification Workflow

1. Resolve the surface through shared router references. If unsupported or ambiguous, ask for the verification command set before claiming anything.
2. Read the implementation, quality, or debug handoff for intended behavior, changed scope, baseline, and accepted risks.
3. Load `assets/universal-verification_checklist.md` before any pre-claim decision.
4. Select the surface command set and targeted tests from shared routing and this packet's assets.
5. Run commands with `Bash` and capture exit codes, command names, test counts, important output, and failures.
6. For WEBFLOW behavior changes, include desktop and mobile browser evidence when available; for performance claims, include the relevant performance checklist and measurement caveats.
7. For OPENCODE changes, run `verify_alignment_drift.py --root <changed-scope>` and targeted language/project tests appropriate to the changed files.
8. Compare current evidence to baseline and report the delta.
9. Apply the mutation check or claim-falsifier ritual when the claim depends on a new or changed test.
10. State only the claims the evidence proves. If evidence fails, hand back to `code-debug` or `code-implement` without editing.

### Iron Law

No completion claim without fresh surface-appropriate verification evidence. A clean static read is not runtime evidence. A green unit test is not live proof. A minified bundle is not browser interaction. A browser click is not full regression coverage. Name the rung and its blind spot.

### Verification Ladder

Climb cheapest to most authoritative and name what each rung cannot see:

| Rung | Proves | Blind Spot |
| --- | --- | --- |
| Unit | Isolated logic or assertion path | Integration, wiring, real I/O, browser/runtime state |
| In-memory | Multiple modules without external runtime | Real file system, serialization, deployed config, browser behavior |
| On-server | Runtime service or local server path | Production deploy differences, caches, real user environment |
| Live | Exact exercised path in real target | Unexercised paths, other users, other viewports, future data |

For WEBFLOW, the ladder usually climbs from scripts to browser console and viewport evidence. For OPENCODE, it climbs from targeted tests to real-file/spec validation to live CLI or daemon runs when relevant.

### Mutation Check And Claim Falsifier

After green evidence for a newly added or modified test, confirm the test can fail for the right reason when feasible. A true red result is an assertion failing against the intended behavior. A compile error or command that never reached the assertion is not a satisfying red. If a test stays green after the guarded behavior is broken, report it as a verification defect and hand back.

### Decision Economy

Verification should prefer fail-closed construction and named seams. If a branch, flag, fallback, or deferred path exists, it needs a closing condition and evidence. A bare reminder is not a verification strategy.

### Non-Mutating Boundary

This mode never uses `Edit`, `Write`, or `Task`. When a command fails, a test is vacuous, a browser path breaks, a baseline delta regresses, or a verifier is missing, verification stops at evidence and handback. Repairs belong to `code-debug`; missing implementation belongs to `code-implement`; author-side quality issues belong to `code-quality`.

---

## 4. RULES

### ALWAYS

1. Load `assets/universal-verification_checklist.md` before any completion-related claim.
2. Resolve surface identity through shared router references before selecting commands.
3. Run fresh commands in the current session; stale evidence does not support a new claim.
4. Record command names, exit codes, key output, test counts, and browser or runtime observations.
5. Report baseline, current result, delta, and claim scope for no-regressions or improvement claims.
6. Name the verification ladder rung and the blind spot that remains.
7. Run `verify_alignment_drift.py --root <changed-scope>` for OPENCODE changes unless the path is not applicable and the exception is stated.
8. Include WEBFLOW desktop/mobile browser evidence when runtime behavior changed and browser tooling is available.
9. Hand back to `code-debug`, `code-implement`, or `code-quality` when verification finds a defect.

### NEVER

1. Never edit files; this mode has no `Edit` authority.
2. Never create files; this mode has no `Write` authority.
3. Never dispatch subagents; this mode has no `Task` authority.
4. Never claim done, works, complete, fixed, passing, or ready from unrun commands.
5. Never make broad no-regressions claims without a baseline and delta.
6. Never treat one green rung as proof of higher rungs.
7. Never hide a failed or skipped verifier behind a positive summary.
8. Never invent browser, runtime, test, or performance evidence.
9. Never add a packet-local `graph-metadata.json`.

### ESCALATE IF

1. The surface or required verification command set is unknown.
2. A required verifier path is missing or unsafe to run.
3. Commands contradict each other on a blocking outcome.
4. Browser evidence is required but unavailable, and the claim would be misleading without it.
5. The baseline is missing and the requested claim requires regression comparison.
6. A mutation check shows the test is vacuous.

---

## 5. SUCCESS CRITERIA

- Verification ran last, after implementation, quality, and debugging as applicable.
- The mode used only non-mutating tools: `Read`, `Bash`, `Grep`, and `Glob`.
- Fresh surface-appropriate commands ran and their results were recorded.
- OPENCODE changes include alignment drift evidence and targeted tests or a stated exception.
- WEBFLOW behavior changes include script evidence and browser/viewport evidence when available.
- No-regressions or improvement claims include baseline, current result, and delta.
- Mutation or claim-falsifier checks ran when the claim depends on new or changed tests, or the exception is stated.
- Any defect found is handed back without editing.

---

## 6. INTEGRATION POINTS

- `sk-code` routes verification prompts here through `mode-registry.json` and keeps the hub routing-only.
- `code-implement` receives handback when required behavior is missing or build work is incomplete.
- `code-quality` receives handback when a quality gate or comment-hygiene issue blocks verification.
- `code-debug` receives handback when commands, tests, or browser checks fail and need root-cause repair.
- `code-review` owns findings-first review when the user wants critique rather than final verification evidence.
- `mcp-chrome-devtools` may provide browser evidence for WEBFLOW runtime checks, but this mode owns the verification claim boundary.

---

## 7. REFERENCES

### Parent And Shared Router

- [`../SKILL.md`](../SKILL.md) - Routing-only parent hub.
- [`../mode-registry.json`](../mode-registry.json) - Source of truth for mode tool surfaces and packet identity.
- [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) - Shared surface detection consumed by every mode.
- [`../shared/references/smart_routing.md`](../shared/references/smart_routing.md) - Shared intent and resource routing.
- [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) - Lifecycle transitions into verification.

### Verification Assets And References

- [`assets/universal-verification_checklist.md`](assets/universal-verification_checklist.md) - Required pre-claim gate.
- [`assets/webflow-verification_checklist.md`](../webflow/assets/webflow-verification_checklist.md) - Webflow/browser verification checklist.
- [`assets/performance_loading_checklist.md`](assets/performance_loading_checklist.md) - Performance loading checklist.
- [`assets/scripts/verify_alignment_drift.py`](assets/scripts/verify_alignment_drift.py) - OpenCode alignment drift verifier.
- [`assets/scripts/test_verify_alignment_drift.py`](assets/scripts/test_verify_alignment_drift.py) - Tests for the alignment verifier.
- [`assets/scripts/verify_stack_folders.py`](assets/scripts/verify_stack_folders.py) - Stack-folder integrity verifier.
- [`references/webflow-verification/verification_workflows.md`](../webflow/references/verification/verification_workflows.md) - Webflow/browser verification workflows.
- [`references/webflow-verification/performance_checklist.md`](../webflow/references/verification/performance_checklist.md) - Webflow performance verification checklist.

### Sibling Mode Contracts

- [`../code-implement/SKILL.md`](../code-implement/SKILL.md) - Planned implementation and new behavior.
- [`../code-quality/SKILL.md`](../code-quality/SKILL.md) - Quality gate before verification.
- [`../code-debug/SKILL.md`](../code-debug/SKILL.md) - Root-cause repair after verification failures.
- [`../review/SKILL.md`](../review/SKILL.md) - Findings-first review output.
