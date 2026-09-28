---
title: "cli-classifier: Manual Testing Playbook"
description: "Operator-facing manual validation for cli-classifier hub routing: a Deem request resolves the hub and its one transport, while other requests stay out."
version: 1.0.0.0
---

# cli-classifier: Manual Testing Playbook

This playbook is the operator directory and release-review surface for the `cli-classifier` hub's routing. Per-feature files contain the exact prompt, commands, signals, evidence, verdict criteria and failure triage for each deterministic scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the hub's `benchmark/reports/` directory.

---

## 1. OVERVIEW

The walked tree holds the hub-routing scenarios for `cli-classifier`. The hub registers one mode, `cli-deem`, declared `packetKind: "transport"`. Its routing question is therefore small. Does a Deem request resolve the hub? Do other requests stay out? The client's own behavior is covered by `cli-deem/scripts/tests/cli-deem.test.mjs`, which runs against a fake server. These scenarios do not replace it.

### Realistic Test Model

1. Begin with the exact natural-human prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the advisor output and the front door output with the expected signals.
4. Capture the transcript, exit status and a concise signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The scenarios validate routing only. They never start the Deem server and never send a judgment.
- The hub has no compiled activation manifest, so the compiled front door answers with the legacy sentinel. Stage two then resolves through `hub-router.json`, which registers one signal.

---

## 2. GLOBAL PRECONDITIONS

1. Start at the repository root.
2. Use a current Node.js runtime so the advisor entry point runs.
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

### CC-001 | A Deem request resolves cli-classifier

Verify the advisor ranks `cli-classifier` first for a Deem judgment request and the hub's registry resolves `cli-deem`.

Prompt: `ask deem for a probability that this incident is urgent`

> **Feature File:** [CC-001](hub-routing/deem-request-routes-to-transport.md)

### CC-002 | A Jev request stays with cli-jev

Verify a request that names the hosted Jev service ranks `cli-jev` and never `cli-classifier`.

Prompt: `ask jev for a probability that this plan ships on time`

> **Feature File:** [CC-002](hub-routing/jev-request-stays-with-cli-jev.md)

### CC-003 | An out-of-domain request resolves nothing here

Verify a request with no classifier signal produces no `cli-classifier` recommendation.

Prompt: `summarize the release notes for the last sprint`

> **Feature File:** [CC-003](hub-routing/out-of-domain-resolves-nothing.md)

---

## 7. AUTOMATED TEST CROSS-REFERENCE

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Hub routing contract | [cli-classifier SKILL.md](../SKILL.md) | `CC-001`, `CC-002`, `CC-003` |
| Router vocabulary | [hub-router.json](../hub-router.json) | `CC-001`, `CC-003` |
| Client behavior | [cli-deem tests](../cli-deem/scripts/tests/cli-deem.test.mjs) | none, covered by `node --test` |

---

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CC-001 | A Deem request resolves cli-classifier | Hub Routing | [CC-001](hub-routing/deem-request-routes-to-transport.md) |
| CC-002 | A Jev request stays with cli-jev | Hub Routing | [CC-002](hub-routing/jev-request-stays-with-cli-jev.md) |
| CC-003 | An out-of-domain request resolves nothing here | Hub Routing | [CC-003](hub-routing/out-of-domain-resolves-nothing.md) |
