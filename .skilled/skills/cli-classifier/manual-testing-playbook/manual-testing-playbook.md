---
title: "cli-classifier: Manual Testing Playbook"
description: "Operator-facing validation for the cli-classifier hub: Jev requests resolve to cli-jev, the current only mode, while out-of-domain requests stay out."
version: 0.4.0.0
---

# cli-classifier: Manual Testing Playbook

This playbook is the operator directory and release-review surface for the `cli-classifier` hub's routing. Per-feature files contain the exact prompt, commands, signals, evidence, verdict criteria and failure triage for each deterministic scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the hub's `benchmark/reports/` directory.

---

## 1. OVERVIEW

The walked tree holds the hub-routing scenarios for `cli-classifier` and one measurement scenario for its offline injection screen scorer. The hub currently registers one `packetKind: "transport"` mode: `cli-jev`, which bridges the hosted Jev service. A future classifier can join the parent hub as a new mode with its own packet. The routing questions are small. Does a Jev request resolve `cli-jev`? Do other requests stay out? The transport's own behavior is covered in `cli-jev/manual-testing-playbook/`. These scenarios do not replace it.

The `CJ-` scenarios came from the retired `cli-jev` hub with the Jev transport. Their two recorded runs sit under `benchmark/reports/`.

### Realistic Test Model

1. Begin with the exact natural-human prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the advisor output and the front door output with the expected signals.
4. Capture the transcript, exit status and a concise signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The hub-routing scenarios validate routing only. `CC-004` runs the injection screen scorer on stub binaries. No scenario sends a judgment to the hosted classifier.
- The hub serves compiled routes. The front door answers from the policy pinned in `013-live-activation/activation/cli-classifier/manifest.json`, not from the legacy sentinel.

---

## 2. GLOBAL PRECONDITIONS

1. Start at the repository root.
2. Use a current Node.js runtime so the advisor entry point and the compiled front door run.
3. Confirm the advisor graph includes `cli-classifier` before any scenario runs.
4. Preserve unrelated working-tree changes.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Capture the following for every scenario:

- Feature ID and per-feature file path.
- Exact prompt, copied without paraphrase.
- Command transcript with exit status.
- The advisor recommendations array and the front door JSON.
- Final `PASS`, `FAIL` or `SKIP` verdict with a one-sentence reason.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash: <command>` means run the command exactly in a POSIX-compatible shell from the repository root.
- `->` separates sequential steps in a single operator session.
- An exit status of zero is required unless the scenario names a different observable result.
- Quoted advisor fields are exact JSON field names, not descriptive placeholders.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance Rules

A scenario is `PASS` only when its preconditions hold, the exact prompts and commands were used, every expected signal is present and no contradictory signal appears. It is `FAIL` when a command fails, an expected signal is absent or a contradictory signal appears. It is `SKIP` only when a specific environment blocker prevents execution and the blocker is recorded.

### Release Review Rules

1. Every root-indexed scenario maps to exactly one per-feature file.
2. All scenarios must be `PASS`. Any `FAIL` prevents a release recommendation.
3. A `SKIP` does not count as passing release evidence.

---

## 6. HUB ROUTING

### CC-002 | A Jev request resolves mode cli-jev

Verify a request that names the hosted Jev service ranks `cli-classifier` first and the front door routes a single `cli-jev` target over `cli-jev`.

Prompt: `ask jev for a probability that this plan ships on time`

> **Feature File:** [CC-002](hub-routing/jev-request-stays-with-cli-jev.md)

### CC-003 | An out-of-domain request resolves nothing here

Verify a request with no classifier signal produces no `cli-classifier` recommendation and that the front door defers it and the judgment-words holdout.

Prompt: `summarize the release notes for the last sprint`

> **Feature File:** [CC-003](hub-routing/out-of-domain-resolves-nothing.md)

### CJ-001 | A Jev judgment request resolves mode cli-jev

Verify a `jev judgment` request and the six advertised Jev phrasings each route a single `cli-jev` target.

Prompt: `Use jev judgment to decide whether this incident is urgent, and give me the probability.`

> **Feature File:** [CJ-001](hub-routing/judgment-request-routes-to-transport.md)

### CJ-002 | The cli-usage name resolves the Jev transport

Confirm the `cli-usage` name resolves mode `cli-jev` over the `cli-jev` transport packet.

Prompt: `cli-usage noul for this question.`

> **Feature File:** [CJ-002](hub-routing/alias-still-resolves.md)

---

## 7. MEASUREMENTS

### CC-004 | The injection screen scorer runs with zero model calls

Verify the offline injection screen scorer prints its censuses without calling a backend and that failing gates add only their skip lines.

Prompt: `Run the injection screen scorer with a fake jev on my PATH and show me it calls nothing`

> **Feature File:** [CC-004](measurements/injection-screen-measurement.md)

### CC-005 | The Pi transport scorer runs with zero model calls

Verify the offline Pi transport scorer prints its transport census without a model call and that a live arm without `--out` refuses with exit 2.

Prompt: `Run the Pi transport scorer with a fake jev on my PATH and show me its census runs without a model call`

> **Feature File:** [CC-005](measurements/pi-transport-comparison.md)

### CC-006 | The Pi classifier transport routes, answers and skips on stubs

Verify the opt-in Pi transport keeps the `jev` CLI as the default, answers a `choice` question through an injected Pi runtime with the CLI-shaped payload, and prints one skip line per failed gate before the CLI runs.

Prompt: `Run the Pi classifier transport with a stub jev first on PATH and show me the switch routes and the skip cases passing`

> **Feature File:** [CC-006](measurements/pi-transport-integration.md)

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Hub routing contract | [cli-classifier SKILL.md](../SKILL.md) | `CC-002`, `CC-003`, `CJ-001`, `CJ-002` |
| Router vocabulary | [hub-router.json](../hub-router.json) | `CC-002`, `CC-003`, `CJ-001`, `CJ-002` |
| Compiled canary corpus | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` | none, replayed by the rollout runner |
| Jev transport behavior | [cli-jev playbook](../cli-jev/manual-testing-playbook/manual-testing-playbook.md) | none, covered by the `JEV-` scenarios |
| Injection screen scorer | [score-injection-screen tests](../benchmark/injection-screen/tests/score-injection-screen.test.mjs) | `CC-004` |
| Pi transport scorer | [score-pi-transport tests](../benchmark/pi-transport/tests/score-pi-transport.test.mjs) | `CC-005` |
| Pi classifier transport | [jev-transport tests](../shared/scripts/tests/jev-transport.test.mjs) | `CC-006` |

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CC-002 | A Jev request resolves mode cli-jev | Hub Routing | [CC-002](hub-routing/jev-request-stays-with-cli-jev.md) |
| CC-003 | An out-of-domain request resolves nothing here | Hub Routing | [CC-003](hub-routing/out-of-domain-resolves-nothing.md) |
| CJ-001 | A Jev judgment request resolves mode cli-jev | Hub Routing | [CJ-001](hub-routing/judgment-request-routes-to-transport.md) |
| CJ-002 | The cli-usage name resolves the Jev transport | Hub Routing | [CJ-002](hub-routing/alias-still-resolves.md) |
| CC-004 | The injection screen scorer runs with zero model calls | Measurements | [CC-004](measurements/injection-screen-measurement.md) |
| CC-005 | The Pi transport scorer runs with zero model calls | Measurements | [CC-005](measurements/pi-transport-comparison.md) |
| CC-006 | The Pi classifier transport routes, answers and skips on stubs | Measurements | [CC-006](measurements/pi-transport-integration.md) |
