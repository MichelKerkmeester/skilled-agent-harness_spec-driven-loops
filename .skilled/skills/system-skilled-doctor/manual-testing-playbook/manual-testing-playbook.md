---
title: "system-skilled-doctor Manual Testing Playbook"
description: "Deterministic operator scenarios for system-skilled-doctor, and the corpus its benchmark runs score against."
trigger_phrases:
  - "system-skilled-doctor manual testing"
  - "system-skilled-doctor playbook"
importance_tier: "important"
contextType: "general"
version: 1.0.5.0
---

# system-skilled-doctor Manual Testing Playbook

> Operator scenarios for this skill. This corpus is an input: a benchmark run reads it and
> never rewrites it, so a later run can be compared against an earlier one.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the skill's `benchmark/reports/` directory.

---

## 1. OVERVIEW

The walked tree holds 11 deterministic scenarios in 2 categories, covering advisor routing for Skilled integration requests, the behavior of the doctor commands this skill owns, the overlay engine on a tree with no overlays, the engine's per-entry protected-file refusal, the guard's strict write checks, adopting an unowned upstream file, the commit check, a stale lock takeover, the move of an off-layout source, the audit of vendored drift no overlay owns and a root file upstream changed after the pin. The doctor contract tests remain authoritative for each command's full behavior. These scenarios check what an operator sees.

### Realistic Test Model

1. Begin with the exact prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the output with the expected signals.
4. Capture the transcript, exit status and a short signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The scenarios write only inside a temporary tree. A scenario that writes builds that tree in a folder from `mktemp -d` and names no repository path.
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
| 3 | Overlays | `SKD-005`, `SKD-006`, `SKD-007`, `SKD-008`, `SKD-009` | Confirm the guard refuses an unowned write and allows a generated or excluded path, that adopt and the commit check close the gap, that a stale lock is taken over, and that an off-layout source moves. |
| 4 | Overlays | `SKD-010`, `SKD-011` | Confirm the audit lists the drift no overlay owns and fails, and that an owned root file upstream changed after the pin fails status. |

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

### SKD-005 | Overlay guard refuses a write under a vendored root that no overlay owns

Verify `--guard` on a manifest with `strictWrites` on exits 1 for a new file and for an unowned upstream file, and prints `allow` for a generated path and a path under `repin.exclude`.

Prompt: `stop me writing into the vendored skilled tree where no overlay owns the file`

> **Feature File:** [SKD-005](overlays/strict-guard-refuses-unowned-write.md)

### SKD-006 | Overlay adopt takes an unowned upstream file into the overlay folder

Verify `apply --adopt` on an unowned upstream file appends its manifest entry, copies the edited file into the overlay folder, pins upstream's bytes and leaves `status` passing.

Prompt: `adopt an upstream skill file i edited in place so a re-pin keeps my change`

> **Feature File:** [SKD-006](overlays/adopt-an-unowned-file.md)

### SKD-007 | Overlay pre-commit refuses a staged change no overlay owns

Verify `pre-commit` exits 1 naming a staged unowned vendored change, and exits 0 once that change is adopted.

Prompt: `block the commit while a vendored file no overlay owns is staged`

> **Feature File:** [SKD-007](overlays/pre-commit-refuses-unowned-change.md)

### SKD-008 | Overlay apply takes over a lock a killed run left behind

Verify `apply` takes over a lock naming a dead process on this host with one `note:` line and removes the file, and refuses a lock naming a live process.

Prompt: `my overlay run died and left a lock file, can a new run take it over`

> **Feature File:** [SKD-008](overlays/stale-lock-takeover.md)

### SKD-009 | Overlay relayout moves an off-layout source onto its layout path

Verify `status` prints a `LAYOUT` line for an off-layout source and still passes, `apply --relayout` moves the copy and rewrites the manifest, and the `apply` and `status` that follow both pass.

Prompt: `move my overlay sources onto the layout folder`

> **Feature File:** [SKD-009](overlays/relayout-moves-sources.md)

### SKD-010 | Audit lists the vendored drift no overlay owns

Verify plain `status` passes while `status --audit` prints one `AUDIT` line for an unowned vendored file whose bytes differ from upstream and one for a tracked file upstream never had, prints `audit=2` and fails.

Prompt: `list the vendored files that drifted from upstream without an agent touching them`

> **Feature File:** [SKD-010](overlays/status-audit-lists-unowned-drift.md)

### SKD-011 | Status names a root file upstream changed since the pin

Verify `status` passes while an overlay's pinned root file matches upstream's copy at the pin, then prints one `STALE    root-file` line and fails once a re-pin moves the pin onto a commit that changed the file.

Prompt: `why does status call my agents overlay stale after a re-pin`

> **Feature File:** [SKD-011](overlays/stale-root-file-fails-status.md)

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Advisor routing | [Skill graph metadata](../graph-metadata.json) | `SKD-001` |
| Doctor command contracts | `.skilled/commands/doctor/scripts/tests/` | `SKD-002` |
| Overlay engine | `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | `SKD-003`, `SKD-004`, `SKD-005`, `SKD-006`, `SKD-007`, `SKD-008`, `SKD-009`, `SKD-010`, `SKD-011` |
