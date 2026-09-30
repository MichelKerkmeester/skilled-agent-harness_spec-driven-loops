---
title: "cli-deem: Manual Testing Playbook"
description: "Operator-facing directory for the cli-deem transport: execution policy, evidence rules, the ten-scenario index, the automated test cross-reference and the feature catalog index."
trigger_phrases:
  - "cli-deem playbook"
  - "deem manual testing"
  - "deem validation scenarios"
  - "deem health checks"
  - "deem judgment checks"
importance_tier: "important"
contextType: "implementation"
version: 0.1.0.0
---

# cli-deem: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real, not mocked and not classified as an unsupported automation case. An agent executing these scenarios runs the exact command block, inspects the real output and captures stdout, stderr and the exit status. The only acceptable verdicts are PASS, FAIL, or SKIP with a specific sandbox or runtime blocker.

> **OFFLINE BOUNDARY**: No scenario needs a served Deem model. Each judgment scenario starts an inline stub server on an ephemeral loopback port and closes it when the client exits, and each refusal scenario points `CLI_DEEM_URL` at `http://127.0.0.1:9`, a port with nothing behind it. No scenario reads a key, and no data leaves the machine.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the packet's `benchmark/reports/<dated-run-label>/` folder. No run folder exists yet.

---

## 1. OVERVIEW

Each scenario is its own file under a category directory and carries its full execution truth: the prompt, the command, the expected observable, the 9-column contract table, the recorded result, the source anchors and the failure triage. The package holds ten scenarios in three categories.

Categories:

- `availability-gate/` DEE-001 to DEE-004: the health check, from a refused port through the backend and model refusals to a pinned install that passes.
- `judgment-subcommands/` DEE-005 to DEE-008: `noul`, `choice`, `score` and the batched `run`, each answered by a stub server so the client's translation is the thing under test.
- `dormant-path/` DEE-009 to DEE-010: a refused server must never read as a value, and a caller with its own switch stays dormant when Deem is down.

### Realistic Test Model

1. Start from the repository root with a current Node.js runtime.
2. Run the exact command block in the selected scenario file without substituting a broader or weaker check.
3. Read the exit status before the payload and capture stdout and stderr separately.
4. Compare the observed output with the expected signals.
5. Assign only `PASS`, `FAIL` or `SKIP` with a one-sentence reason.

### Package Boundaries

- The stub server answers any request with the body the scenario names. It is a fixture, not a Deem implementation, so a scenario proves the client's translation and error mapping rather than the model's judgment quality.
- No scenario starts, stops, updates or rolls back the real Deem server. That lifecycle belongs to `deem-ctl`.
- Health scenarios that pass the backend and model checks read the commit pair from disk. DEE-004 points `CLI_DEEM_HOME` at a throwaway fixture, so no scenario depends on the machine's real install.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Node.js is available so `node` runs `scripts/cli-deem.mjs`.
3. Nothing else needs to be running. Every stub scenario binds an ephemeral loopback port itself and every refusal scenario uses port 9.
4. The real Deem server is neither required nor disturbed.
5. Temporary folders created by a scenario live outside the repository, and the scenario removes them or leaves them safe to remove.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Every executed scenario records four things and nothing else counts:

1. The exact command block, copied as written.
2. stdout and stderr, captured separately.
3. The exit status, observed from the shell.
4. The observable the row names, which is a printed value, a JSON field, an empty stream or the absence of a file.

An exit status read without its stdout is not executed evidence. A run whose stub body differs from the one the scenario names is a different test.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash: <command>` means run the command exactly as written in a POSIX-compatible shell from the repository root.
- An inline `node -e` block is a self-contained stub harness. It starts an HTTP server on an ephemeral loopback port, runs one `cli-deem` command with `CLI_DEEM_URL` pointed at that port, forwards the child's stdout and stderr unchanged and exits with the child's status.
- `->` separates sequential steps in a single operator session.
- `$TMP` names a directory the operator creates with `mktemp -d` when a scenario needs one.
- The stub harness is a fixture. It always answers HTTP 200 with the named JSON body, so a scenario isolates the client's handling of that body.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. The prompt and the command block were used as written.
3. Every expected signal is present and no contradictory signal appears.
4. The evidence is complete and readable.
5. The outcome rationale is explicit.

Scenario verdict:

- `PASS`: all acceptance checks true.
- `FAIL`: an expected signal is absent, a command fails, or a contradictory signal appears.
- `SKIP`: a specific sandbox or runtime blocker prevents execution, and the blocker is recorded.

### Feature Verdict Rules

- `PASS`: every mapped scenario passes.
- `FAIL`: any mapped scenario fails.
- `SKIP`: every mapped scenario is blocked by a named blocker.

### Release Readiness Rule

Release is ready only when no scenario fails, every critical scenario passes, every per-feature file is linked from this index, and no unresolved blocking triage item remains.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

The scenarios are independent and create their own ports and temporary folders, so they run in any order and in parallel without shared state. Run one wave with a coordinator, assign explicit scenario IDs to each worker, save each worker's transcript before the next wave, and record the evidence paths in the final report. No scenario is destructive, so no dedicated sandbox wave is needed.

---

## 7. AVAILABILITY GATE (`DEE-001..DEE-004`)

### DEE-001 | Refused port health reports unreachable

#### Description

Verify a health check against a refused port exits 4 with an unreachable error and an empty stdout.

#### Scenario Contract

Prompt: `Check whether cli-deem can reach Deem before I run a judgment.`

Confirm the client reports an unreachable server rather than inventing a health body.

Desired user-visible outcome: the operator reads exit 4 and the `Deem unreachable` error, and knows Deem is unavailable for this run.

#### Test Execution

> **Feature File:** [DEE-001](availability-gate/refused-port-health-reports-unreachable.md)
> **Catalog:** [Health check](../feature-catalog/availability-check/health-check.md)

### DEE-002 | Health refuses the stub backend

#### Description

Verify a health body whose `backend` is `stub` exits 3 with a refused-backend error.

#### Scenario Contract

Prompt: `Check Deem's health while a stub backend answers on the port.`

Confirm the backend check refuses a stub even though the body reports `status` `ok`.

Desired user-visible outcome: the operator reads the `refused backend: stub` error and treats Deem as unavailable rather than trusting a flat stub answer.

#### Test Execution

> **Feature File:** [DEE-002](availability-gate/health-refuses-stub-backend.md)
> **Catalog:** [Health check](../feature-catalog/availability-check/health-check.md)

### DEE-003 | Health refuses a model other than the pin

#### Description

Verify a health body whose `model` is not `deem-0.8-v1` exits 3 and names the refused model.

#### Scenario Contract

Prompt: `Check Deem's health while a server that is not the pinned model answers.`

Confirm the model check rejects a server that holds the port with another model id.

Desired user-visible outcome: the operator reads `refused model: deem-1.5, expected deem-0.8-v1` and knows a different server owns the port.

#### Test Execution

> **Feature File:** [DEE-003](availability-gate/health-refuses-wrong-model.md)
> **Catalog:** [Health check](../feature-catalog/availability-check/health-check.md)

### DEE-004 | Health accepts a pinned install and prints the commit pair

#### Description

Verify a healthy pinned body plus a fixture home holding `models/current` and a git `src` exits 0 with the backend, the model pin and both commits.

#### Scenario Contract

Prompt: `Check Deem's health against a pinned install and show me the commit pair.`

Confirm the health check passes only when the response and the install on disk agree.

Desired user-visible outcome: the operator reads one JSON line naming `torch`, `deem-0.8-v1`, the model commit behind `models/current` and the source commit of the checkout.

#### Test Execution

> **Feature File:** [DEE-004](availability-gate/health-accepts-pinned-install.md)
> **Catalog:** [Health check](../feature-catalog/availability-check/health-check.md)

---

## 8. JUDGMENT SUBCOMMANDS (`DEE-005..DEE-008`)

### DEE-005 | Noul returns a probability

#### Description

Verify `noul --value` prints one number in `[0, 1]` and exits 0.

#### Scenario Contract

Prompt: `Ask Deem for a probability that this request needs a reply today.`

Confirm Deem's `value` arrives renamed to `noul`, and `--value` prints only that number.

Desired user-visible outcome: the operator reads a probability between 0 and 1 with exit 0.

#### Test Execution

> **Feature File:** [DEE-005](judgment-subcommands/noul-returns-probability.md)
> **Catalog:** [Noul probability](../feature-catalog/judgment-subcommands/noul-probability.md)

### DEE-006 | Choice returns the submitted key

#### Description

Verify `choice` prints the submitted key and rekeys the probabilities by key.

#### Scenario Contract

Prompt: `Ask Deem which team owns this billing problem.`

Confirm the chosen option text maps back to the key the caller submitted.

Desired user-visible outcome: the operator reads `billing` or `support` in the `choice` field with the probabilities keyed the same way.

#### Test Execution

> **Feature File:** [DEE-006](judgment-subcommands/choice-returns-submitted-key.md)
> **Catalog:** [Choice selection](../feature-catalog/judgment-subcommands/choice-selection.md)

### DEE-007 | Score returns a zero-based position

#### Description

Verify `score` prints the zero-based position of the chosen level and rekeys the probabilities by position.

#### Scenario Contract

Prompt: `Ask Deem how severe this incident is.`

Confirm Deem's `level` text becomes a position in the submitted lowest-to-highest list.

Desired user-visible outcome: the operator reads `"score": 1` for the second level and probabilities keyed `"0"`, `"1"` and `"2"`.

#### Test Execution

> **Feature File:** [DEE-007](judgment-subcommands/score-returns-zero-based-position.md)
> **Catalog:** [Score level](../feature-catalog/judgment-subcommands/score-level.md)

### DEE-008 | A batched run translates every answer

#### Description

Verify `run -` reads a Deem-shaped request from stdin and prints one translated answer per key.

#### Scenario Contract

Prompt: `Send one Deem-shaped batch and translate every answer.`

Confirm the batch translates each answer by its type and keeps the envelope.

Desired user-visible outcome: the operator reads one answer per question key, with `noul` renamed and a batch `choice` keeping Deem's option text.

#### Test Execution

> **Feature File:** [DEE-008](judgment-subcommands/batch-run-translates-every-answer.md)
> **Catalog:** [Batched run](../feature-catalog/judgment-subcommands/batched-run.md)

---

## 9. DORMANT PATH (`DEE-009..DEE-010`)

### DEE-009 | A refused judgment never reads as a value

#### Description

Verify a judgment command against a refused port exits 4 with an empty stdout and never prints a value.

#### Scenario Contract

Prompt: `Ask Deem to judge this even though the server is down.`

Confirm a transport failure stays a failure and cannot be mistaken for an answer.

Desired user-visible outcome: the operator reads exit 4 and the `Deem unreachable` error, and no number is printed.

#### Test Execution

> **Feature File:** [DEE-009](dormant-path/judgment-never-reads-a-refusal-as-a-value.md)
> **Catalog:** [Noul probability](../feature-catalog/judgment-subcommands/noul-probability.md)

### DEE-010 | The completion-claim census stays dormant without Deem

#### Description

Verify the completion-claim scorer prints its census, adds one skip line when the Deem arm cannot reach the server, and exits 0.

#### Scenario Contract

Prompt: `Run the completion-claim census with the Deem arm while Deem is down.`

Confirm the caller's own health gate keeps the arm dormant and the census unchanged.

Desired user-visible outcome: the operator reads `deem arm skipped: not reachable` as the only added line and exit 0.

#### Test Execution

> **Feature File:** [DEE-010](dormant-path/completion-claim-audit-skips-without-deem.md)
> **Catalog:** No dedicated catalog entry exists. The scorer belongs to the completion-claim audit under `system-spec-kit`, and this scenario covers its dormant Deem arm.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| [cli-deem.test.mjs](../scripts/tests/cli-deem.test.mjs) | Fake-server tests for the health checks, the four subcommands, the caps, the timeouts and the exit classes | `DEE-001` to `DEE-010` |

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| DEE-001 | Refused port health reports unreachable | Availability Gate | [DEE-001](availability-gate/refused-port-health-reports-unreachable.md) |
| DEE-002 | Health refuses the stub backend | Availability Gate | [DEE-002](availability-gate/health-refuses-stub-backend.md) |
| DEE-003 | Health refuses a model other than the pin | Availability Gate | [DEE-003](availability-gate/health-refuses-wrong-model.md) |
| DEE-004 | Health accepts a pinned install and prints the commit pair | Availability Gate | [DEE-004](availability-gate/health-accepts-pinned-install.md) |
| DEE-005 | Noul returns a probability | Judgment Subcommands | [DEE-005](judgment-subcommands/noul-returns-probability.md) |
| DEE-006 | Choice returns the submitted key | Judgment Subcommands | [DEE-006](judgment-subcommands/choice-returns-submitted-key.md) |
| DEE-007 | Score returns a zero-based position | Judgment Subcommands | [DEE-007](judgment-subcommands/score-returns-zero-based-position.md) |
| DEE-008 | A batched run translates every answer | Judgment Subcommands | [DEE-008](judgment-subcommands/batch-run-translates-every-answer.md) |
| DEE-009 | A refused judgment never reads as a value | Dormant Path | [DEE-009](dormant-path/judgment-never-reads-a-refusal-as-a-value.md) |
| DEE-010 | The completion-claim census stays dormant without Deem | Dormant Path | [DEE-010](dormant-path/completion-claim-audit-skips-without-deem.md) |
