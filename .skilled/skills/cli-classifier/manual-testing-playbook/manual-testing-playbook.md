---
title: "cli-classifier: Manual Testing Playbook"
description: "Operator-facing manual validation for cli-classifier hub routing: a Jev request resolves mode cli-jev, a Deem request resolves mode cli-deem, and other requests stay out."
version: 1.1.0.0
---

# cli-classifier: Manual Testing Playbook

This playbook is the operator directory and release-review surface for the `cli-classifier` hub's routing. Per-feature files contain the exact prompt, commands, signals, evidence, verdict criteria and failure triage for each deterministic scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the hub's `benchmark/reports/` directory.

---

## 1. OVERVIEW

The walked tree holds the hub-routing scenarios for `cli-classifier` and one measurement scenario for its offline injection screen scorer. The hub registers two modes, both declared `packetKind: "transport"`: `cli-jev`, which runs over the packet folder `cli-usage` and bridges the hosted Jev service, and `cli-deem`, a client for the Deem model served on this machine. The routing questions are small. Does a Jev request resolve `cli-jev`? Does a Deem request resolve `cli-deem`? Do other requests stay out? Each transport's own behavior is covered in its packet: `cli-usage/manual-testing-playbook/` for Jev and `cli-deem/scripts/tests/cli-deem.test.mjs` for Deem. These scenarios do not replace them.

The `CJ-` scenarios came from the retired `cli-jev` hub with the Jev transport. Their two recorded runs sit under `benchmark/reports/`.

### Realistic Test Model

1. Begin with the exact natural-human prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the advisor output and the front door output with the expected signals.
4. Capture the transcript, exit status and a concise signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The hub-routing scenarios validate routing only. `CC-004` runs the injection screen scorer on stub binaries. No scenario starts the Deem server or sends a judgment to either backend.
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

### CC-001 | A Deem request resolves mode cli-deem

Verify the advisor ranks `cli-classifier` first for a Deem judgment request and the front door routes a single `cli-deem` target.

Prompt: `ask deem for a probability that this incident is urgent`

> **Feature File:** [CC-001](hub-routing/deem-request-routes-to-transport.md)

### CC-002 | A Jev request resolves mode cli-jev

Verify a request that names the hosted Jev service ranks `cli-classifier` first and the front door routes a single `cli-jev` target over `cli-usage`.

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

### CJ-002 | The cli-jev name resolves the Jev transport

Verify a request that names only `cli-jev` routes a single `cli-jev` target through the alias registration.

Prompt: `cli-jev noul for this question.`

> **Feature File:** [CJ-002](hub-routing/alias-still-resolves.md)

---

## 7. MEASUREMENTS

### CC-004 | The injection screen scorer runs with zero model calls

Verify the offline injection screen scorer prints its censuses without calling a backend and that failing gates add only their skip lines.

Prompt: `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither`

> **Feature File:** [CC-004](measurements/injection-screen-measurement.md)

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Hub routing contract | [cli-classifier SKILL.md](../SKILL.md) | `CC-001`, `CC-002`, `CC-003`, `CJ-001`, `CJ-002` |
| Router vocabulary | [hub-router.json](../hub-router.json) | `CC-001`, `CC-002`, `CC-003`, `CJ-001`, `CJ-002` |
| Compiled canary corpus | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` | none, replayed by the rollout harness |
| Jev transport behavior | [cli-usage playbook](../cli-usage/manual-testing-playbook/manual-testing-playbook.md) | none, covered by the `JEV-` scenarios |
| Deem client behavior | [cli-deem tests](../cli-deem/scripts/tests/cli-deem.test.mjs) | none, covered by `node --test` |
| Injection screen scorer | [score-injection-screen tests](../benchmark/injection-screen/tests/score-injection-screen.test.mjs) | `CC-004` |

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CC-001 | A Deem request resolves mode cli-deem | Hub Routing | [CC-001](hub-routing/deem-request-routes-to-transport.md) |
| CC-002 | A Jev request resolves mode cli-jev | Hub Routing | [CC-002](hub-routing/jev-request-stays-with-cli-jev.md) |
| CC-003 | An out-of-domain request resolves nothing here | Hub Routing | [CC-003](hub-routing/out-of-domain-resolves-nothing.md) |
| CJ-001 | A Jev judgment request resolves mode cli-jev | Hub Routing | [CJ-001](hub-routing/judgment-request-routes-to-transport.md) |
| CJ-002 | The cli-jev name resolves the Jev transport | Hub Routing | [CJ-002](hub-routing/alias-still-resolves.md) |
| CC-004 | The injection screen scorer runs with zero model calls | Measurements | [CC-004](measurements/injection-screen-measurement.md) |
