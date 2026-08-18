---
title: "Implementation Summary: Per-Mode Executor Parity"
description: "Consolidating the three deep modes that run their own dispatch (model-benchmark, skill-benchmark, ai-council) onto the shared buildLineageCommand for cli-cursor/cli-devin/cli-pi, so they inherit the fan-out's hardened flags instead of forking or stubbing them. Leaf 1 (model-benchmark) and leaf 3 (ai-council) are built and baseline-verified; leaf 2 (skill-benchmark) is a documented design exemption."
trigger_phrases:
  - "per-mode executor parity progress"
  - "model-benchmark shared builder delegation"
  - "buildLineageCommand reuse benchmark council"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/004-per-mode-executor-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/004-per-mode-executor-parity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled the per-mode parity implementation to Complete with model-benchmark and ai-council"
    next_safe_action: "Await SOL verdicts and operator review before the combo-matrix phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cursor/devin/pi is the intended scope; native/codex parity for model-benchmark and skill-benchmark stays out of scope"
      - "buildLineageCommand fits cursor/devin/pi with no mode-specific arg divergence"
      - "fanout-run.cjs main() is require-guarded, so modes can require it side-effect-free"
      - "the removed local model-benchmark allowlists are identical to the shared builder's"
---
# Implementation Summary: Per-Mode Executor Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 004-per-mode-executor-parity |
| **Completed** | 100% (leaf 1 + leaf 3 built; leaf 2 exempt-by-design) |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Reuse the shared fan-out builder from three modes' own dispatch; fan-out builders untouched |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

An audit established that deep-research, deep-review, and deep-alignment already dispatch all seven executor kinds through the shared `fanout-run.cjs`, so only three modes with their own dispatch need parity work: model-benchmark, skill-benchmark, and ai-council. The consolidation seam: `fanout-run.cjs` exports `buildLineageCommand` and guards its `main()` behind `require.main === module`, so a mode script requires it side-effect-free and delegates cli-cursor/cli-devin/cli-pi command construction to it — inheriting the live-verified hardened flags — while keeping its own I/O contract. Those CLIs (unlike opencode, which needs `--format json`/`--dir`/`--agent`) have no mode-specific arg divergence, so the fan-out command drops in cleanly.

**Leaf 1 — model-benchmark (built).** `dispatch-model.cjs` now delegates cli-cursor/cli-devin/cli-pi to `buildLineageCommand` through a `buildSharedLineageSpec()` helper that maps the lane's `writeCapable` opt-in to `workspace-write` (else `read-only`). This removed the lane's stale cli-cursor read-only fiction, its throwing cli-pi stub, and its duplicate cursor/pi allowlists (the shared builder enforces them), and added `cli-devin` to `KNOWN_EXECUTORS` and the profile validator. cli-opencode/cli-claude-code are unchanged.

### Files Changed (leaf 1)

| File | Action | Purpose |
|---|---|---|
| `model-benchmark/dispatch-model.cjs` | Modified | Delegate cursor/devin/pi to the shared builder; register cli-devin; drop stale local allowlists |
| `model-benchmark/lib/profile-validator.cjs` | Modified | Add `cli-devin` so devin profiles validate |
| `model-benchmark/tests/remediation.vitest.ts` | Modified | Assert the hardened cursor/devin/pi args; add a devin case |

**Leaf 2 — skill-benchmark (exempt by design).** Investigation showed this lane's live score signal — skill activation and observed resource reads — is parsed from the executor's structured tool-use event stream, which only opencode and codex emit. Text-only executors would score as "no activation", i.e. false data. Rather than add a misleading path, the exemption is documented at the dispatch branch (`executor-dispatch.cjs`); opencode+codex remain the live transports. Real parity needs an executor-agnostic observation model — a separate change.

**Leaf 3 — ai-council (built).** Seats are read-only deliberations whose plain-text output is parsed by regex, so any executor's text works. `runSeatSubprocess` now selects the seat command by the resolved executor kind: cursor/devin/pi delegate to `buildLineageCommand` (read-only sandbox, `plan` permission); opencode/native keep the bespoke `opencode run --agent plan` seat args. The executor allowlist gained cursor/devin/pi (cli-codex still deliberately rejected), and `executionProvenance.effective.command` now reflects the real per-kind command instead of a hardcoded `opencode`.

### Files Changed (leaves 2-3)

| File | Action | Purpose |
|---|---|---|
| `skill-benchmark/executor-dispatch.cjs` | Modified (comment) | Document the observation-model exemption for text-only executors |
| `deep-ai-council/scripts/orchestrate-session.cjs` | Modified | Per-kind seat command via the shared builder for cursor/devin/pi; allowlist + provenance |
| `deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts` | Modified | Assert per-kind seat args; codex-reject + unknown-kind throw |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Leaf 1 was authored via the cli-pi LUNA primary builder against a precise brief, then verified inline. The lane runs under its own `deep-improvement/scripts/vitest.config.mjs` (root `deep-improvement/scripts/`, include `*/tests/**`), executed from that directory. No-regression was proven with a stash-baseline delta rather than inference: the three changed files were `git stash`ed, the full lane suite captured as a baseline, the changes restored, and the suites diffed by failing-test identity.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Delegate only cursor/devin/pi to the shared builder | Those CLIs have no mode-specific arg divergence; opencode/claude do, so they keep the lane's own args |
| Remove the lane's local cursor/pi allowlists | They were byte-identical to the shared builder's; a single enforcement point avoids drift |
| Map `writeCapable` → sandbox mode | The builder's contract is the 3-way sandbox mode; the lane's read-only-by-default opt-in maps to it |
| Reuse `buildLineageCommand`, never fork | The fan-out builders are the single source of the hardened flags; forking them into the lane is forbidden |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| Leaf 1 targeted lane test (`remediation.vitest.ts`) | PASS — 32 tests |
| Leaf 1 stash-baseline delta | Pre-change 29 failed / 594; post-change 28 failed / 595 — zero NEW failures (strict subset), one baseline failure fixed |
| Whole-runtime TypeScript | PASS — zero diagnostics |
| `dispatch-model.cjs` require smoke test | PASS — resolves and loads, 14 exports |
| Leaf 1 SOL cross-verify (cli-opencode GPT-5.6-SOL, high) | REQUESTED_CHANGES, 0 P0 / 3 P1 — all fixed and re-verified (see below) |
| Leaf 1 re-gate after fixes | Targeted 35/35 (3 new scenario tests); full suite 28 failed / 570 passed; zero new regressions vs baseline; tsc 0 |
| `validate.sh --strict` | Errors 0 (only the benign uncommitted dirty_tree freshness warning) |

The 28 post-change lane failures are all pre-existing and unrelated to executor dispatch (benchmark fixtures, scorer wiring, report snapshots, compiled-routing parity, design-token lint, command recipes); the baseline delta confirms this leaf added none of them.

### SOL review disposition (leaf 1)

SOL found three real P1s — all consequences of enabling the pi path and delegating to the throwing shared builder — each fixed in-phase and covered by a scenario-reproducing test:

- **P1-003 (a command-construction throw aborted the whole sweep) — FIXED.** The shared builder's binary-availability/model-allowlist preflight throws; `dispatchReal` did not catch it, so one unavailable cell aborted every other cell. Wrapped the `buildSpawnSpec` call in a try/catch that returns a normalized failed-dispatch envelope (`ok:false`, `attempts:0`). Test: an out-of-roster cursor model yields a failure envelope, not an uncaught throw.
- **P1-001 (a pi auth failure with exit 0 was scored as model output) — FIXED.** Pi's exit code is not a reliable success signal; a zero exit carrying an auth/config banner (e.g. "No API key found for provider") is now classified as a failed dispatch via a pi-specific output guard, before the generic `status === 0` success branch. Tests: the banner yields `ok:false`; real model output with exit 0 still yields `ok:true` (no false negative).
- **P1-002 (the shared delegation dropped the cursor bin-override env) — documented alignment, no fix needed.** `CURSOR_AGENT_BIN`/`DEVIN_BIN`/`PI_BIN` are referenced nowhere in the tree (only the untouched opencode/claude cases keep `OPENCODE_BIN`/`CLAUDE_BIN`); the override was unused. Cursor/devin/pi now resolve via PATH exactly as the fan-out does — a deliberate alignment recorded in a code comment, not an accidental regression.

### Leaf 3 (ai-council) verification

| Gate | Result |
|---|---|
| Council vitest (`deep-ai-council/vitest.config.mjs`) | PASS — 10 files, 105 tests |
| Stash-baseline delta | Baseline 94/94 (zero pre-existing failures); post-change 105/105; zero new failures, +11 new parity tests |
| Whole-runtime TypeScript | PASS — zero diagnostics |
| `orchestrate-session.cjs` require smoke test | PASS |
| Leaf 3 SOL cross-verify (cli-opencode GPT-5.6-SOL, high) | REQUESTED_CHANGES, 0 P0 / 1 P1 / 2 P2 — P2s fixed, P1 tracked (see below); re-gate 106/106, tsc 0 |

### SOL review disposition (leaf 3)

- **P1-001 (read-only flags don't hard-prevent ambient-config writes) — verified NON-reproducing for all three; 005-tracked defense-in-depth.** The read-only flags bound each CLI's own model tools, but not the executor's ambient config (cursor `.cursor/hooks.json` hooks, devin config allow-rules, pi auto-loaded `.pi/` extensions). Verified against the real repo, each write-side scenario: cursor hooks write nothing for a read-only invocation (established in phase 003); `~/.config/devin/config.json` carries no `Write(`/`Exec(` allow-rules, so `auto` is not overridden; and a real read-only pi invocation in the repo (which loaded `.pi/` and attempted MCP) left git status byte-identical — the extension/skill loading wrote nothing. So no read-only executor actually writes via ambient config today. The residual is genuine defense-in-depth (the capability exists — pi supports `--no-extensions`/`--no-skills`/`--no-prompt-templates` if a future extension were write-capable) plus a separate reliability latent (pi can hang on an MCP-approval retry, like cursor's MCP gate). This is the SAME cross-cutting ambient-config isolation boundary accepted for the combo-matrix phase in the 003 disposition — SOL broadened it from cursor to cursor+devin+pi. The leaf-3 read-only FLAGS are correct and match the hardened fan-out; the hardening (hooks off, config isolated, pi `--no-extensions`, MCP isolation) is tracked there holistically, not forked into this leaf.
- **P2-001 (no invalid-model provenance test) — FIXED.** Added a test: a cursor seat with an out-of-roster (opencode-style) model fails closed — the builder throws, no subprocess spawns, and the rejection carries `execution_provenance` with the right executor family + command.
- **P2-002 (stale codex-reject message) — FIXED.** The message said seats "run via opencode/native"; updated to name the now-accepted native/opencode/cursor/devin/pi set (codex still deliberately excluded), with its test assertion.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| No regression to the lane | Failing-test set is a strict subset of baseline (zero new) | Pass |
| Read-only-by-default preserved | `writeCapable` false → `read-only`; hardened read-only flags | Pass |
| No fork of builder logic | The lane requires and reuses `buildLineageCommand` unchanged | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

Leaf 2 (skill-benchmark) is a documented design exemption, not a shared-builder delegate: its live score signal needs a structured tool-use stream that only opencode and codex emit, so an executor-agnostic observation model is a separate change. model-benchmark's native and cli-codex dispatch remain absent (out of this phase's cursor/devin/pi scope; native-static and codex-via-helper are pre-existing design choices). The lane's own pre-existing failing tests are untouched by this phase. External SOL sign-off and the operator review before the combo-matrix phase (005) remain pending as non-blocking gates.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

The operator-approved framing was "consolidate each mode onto `buildLineageCommand`". Reading the code showed that fit holds only for cursor/devin/pi (no arg divergence), not opencode/claude/codex (mode-specific arg contracts). The realization was scoped accordingly: delegate the three gap kinds, leave the divergent kinds on each mode's own logic. No shared-builder or core-fanout rewrite was needed.
<!-- /ANCHOR:deviations -->
