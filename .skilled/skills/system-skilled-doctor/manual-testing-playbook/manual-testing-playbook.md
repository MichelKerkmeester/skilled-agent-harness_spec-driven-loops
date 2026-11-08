---
title: "system-skilled-doctor Manual Testing Playbook"
description: "Deterministic operator scenarios for system-skilled-doctor, and the corpus its benchmark runs score against."
trigger_phrases:
  - "system-skilled-doctor manual testing"
  - "system-skilled-doctor playbook"
importance_tier: "important"
contextType: "general"
version: 1.0.2.0
---

# system-skilled-doctor Manual Testing Playbook

> Operator scenarios for this skill. This corpus is an input: a benchmark run reads it and
> never rewrites it, so a later run can be compared against an earlier one.

A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the skill's `benchmark/reports/` directory.

---

## 1. OVERVIEW

The walked tree holds 4 deterministic scenarios in 2 categories, covering advisor routing for Skilled integration requests, the behavior of the doctor commands this skill owns, the overlay engine on a tree with no overlays and the engine's per-entry protected-file refusal. The doctor contract tests remain authoritative for each command's full behavior. These scenarios check what an operator sees.

### Realistic Test Model

1. Begin with the exact prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the output with the expected signals.
4. Capture the transcript, exit status and a short signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The scenarios are read-only. They never run a writing doctor target.
- A `SKIP` needs a named environment blocker, such as a missing Node runtime.

---

## 2. GLOBAL PRECONDITIONS

1. Start at the repository root.
2. Use a current Node.js runtime.
3. Confirm the referenced scenario files exist before execution.
4. Preserve unrelated working-tree changes.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Capture the following for every scenario:

- Feature ID and per-feature file path.
- Exact prompt, copied without paraphrase.
- Command transcript with exit status.
- Expected signals and observed signals, including any contradiction.
- Final `PASS`, `FAIL` or `SKIP` verdict with a one-sentence reason.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash: <command>` means run the command exactly in a POSIX-compatible shell from the repository root.
- `->` separates sequential steps in a single operator session.
- An exit status of zero is required unless the scenario names a different observable result.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance Rules

A scenario is `PASS` only when its preconditions hold, the exact prompts and commands were used, every expected signal is present and no contradictory signal appears. It is `FAIL` when a command fails, an expected signal is absent or a contradictory signal appears. It is `SKIP` only when a specific environment blocker prevents execution and the blocker is recorded.

### Release Review Rules

1. Every root-indexed scenario maps to exactly one per-feature file.
2. All critical-path scenarios must be `PASS`. Any `FAIL` prevents a release recommendation.
3. A `SKIP` does not count as passing release evidence.

### Result Persistence

Record each verdict under the skill's `benchmark/reports/` directory with the transcript, exit status and one-sentence reason.

---

## 6. OPERATOR EXECUTION WAVES

| Wave | Category | Scenario IDs | Purpose |
|---|---|---|---|
| 1 | Routing | `SKD-001`, `SKD-002` | Confirm integration requests route here and the owned commands kept their behavior. |
| 2 | Overlays | `SKD-003`, `SKD-004` | Confirm the overlay check names a missing manifest and writes nothing, and that a directory entry refuses an unprotected token-named file. |

---

## 7. ROUTING

### SKD-001 | An integration request routes to system-skilled-doctor

Verify the advisor ranks this skill first for a request to put Skilled into a project.

Prompt: `put Skilled into my project repo`

> **Feature File:** [SKD-001](routing/integration-request-routing.md)

### SKD-002 | A moved doctor command keeps its name and behavior

Verify the owned commands pass their contract tests and credit this skill.

Prompt: `check that the doctor commands still work after the ownership move`

> **Feature File:** [SKD-002](routing/moved-command-contract.md)

---

## 8. OVERLAYS

### SKD-003 | Overlay status on a tree with no overlays names the missing manifest

Verify `status` on an empty tree exits 2, names the default manifest path and writes nothing.

Prompt: `check my vendored skilled overlays in a folder that has none`

> **Feature File:** [SKD-003](overlays/status-without-overlays.md)

### SKD-004 | Overlay status refuses a token-named file a directory entry does not protect

Verify `status` reports one MISS line for the entry that walks an unprotected token-named file, names the `protectedPaths` fix, exits 1 and writes nothing.

Prompt: `check my own overlay folder with an unprotected tokens.css file`

> **Feature File:** [SKD-004](overlays/adopt-with-protected-file.md)

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Advisor routing | [Skill graph metadata](../graph-metadata.json) | `SKD-001` |
| Doctor command contracts | `.skilled/commands/doctor/scripts/tests/` | `SKD-002` |
| Overlay engine | `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | `SKD-003`, `SKD-004` |
