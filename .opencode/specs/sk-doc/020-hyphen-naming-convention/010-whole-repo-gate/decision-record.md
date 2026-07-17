---
title: "Decision Record: whole-repo verification gate (032 phase 010)"
description: "Locks the phase 010 gate as an evidence-based conjunction over scope-aware naming, reference closure, Git rename history, and the complete validation/test baseline, with exact pass criteria and measurement sources."
trigger_phrases:
  - "whole-repo gate decision record"
  - "phase 010 gate criteria"
  - "rename history verification decision"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/010-whole-repo-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/010-whole-repo-gate"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Recorded the exact pass domains and measurements for the whole-repo gate"
    next_safe_action: "Use this record as the non-negotiable verifier contract after phase 009"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/spec.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/checklist.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The phase passes only when every gate domain passes for the same candidate SHA."
      - "Git rename history is measured with explicit R-status output, not inferred from matching paths."
---

# Decision Record: Whole-repo verification gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:context -->
## Context

### Metadata

| Field | Value |
|-------|-------|
| **Decision ID** | DR-010 |
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Scope** | Phase 010 whole-repo verification |
| **Depends on** | Phase 000 baseline, frozen classified rename map, phase 009 handoff |

The migration changes filesystem names and their references across a large repository. A naming scan alone cannot prove references resolve; a green test suite cannot prove Git preserved rename history; and a reference scan cannot prove the declared exemptions were respected. Results are also invalid if they compare different commits or use a map different from the one used for the migration.

### Constraints

- The candidate is evaluated against the immutable BASE SHA and the frozen, hashed source-to-target map.
- Kebab-case is canonical only for in-scope filesystem names; Python files/package directories, generated/lockfile output, tool-mandated names, and frozen surfaces remain excluded by policy.
- Verification is read-only with respect to tracked migration content and must fail on an empty or zero-file measurement.

<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### Decision

The phase passes only when every row in the following measurement contract passes for the same BASE SHA, candidate SHA, and rename-map hash. Any failed row fails the entire phase and returns the candidate to the owning migration phase.

| Domain | Evidence and measurement | Exact pass criterion |
|--------|--------------------------|----------------------|
| **Filesystem naming** | Scope-aware whole-tree `--all` guard output plus exemption/frozen classification report | Exit code is 0; violation count is 0; every remaining snake_case filesystem name is classified as an allowed Python, generated/lockfile, tool-mandated, or frozen path; unknown/unclassified count is 0. |
| **Reference closure** | Rename-map-driven checker output over module imports, `require`, shell sourcing, registry entries, path-valued JSON/YAML/TOML, and markdown links; dynamic-site disposition ledger | Unresolved reference count is 0; dynamic `require`/source/glob sites all have dispositions; scanned-file count is greater than 0; no path or link is repaired by an unrecorded fallback. |
| **Rename history** | Raw `git diff --name-status --find-renames=50% BASE CANDIDATE` output reconciled with the frozen map | Each mapped source-to-target pair appears as one `R` or `Rnn` record; no mapped source appears as `D` while its target appears as `A`; observed mapped rename count equals the frozen map's rename count; unexpected renames fail. |
| **Strict validation** | Every strict validation command listed in the phase 000 command matrix, including recursive packet/skill validation where applicable | Every command exits 0 with no strict errors; the report names each validated scope and records its exit code. |
| **Build, typecheck, and tests** | Every build/typecheck/test command and discovery-count probe from phase 000 | Every required command exits 0; each suite discovers the baseline-equivalent test files/cases; no required suite reports zero tests or silently skips its configured scope. |
| **Behavior and benchmark** | Whole-repo import/path/link resolution and the fixed-seed Lane C benchmark compared with phase 000 | Broken-target count is 0; scenario IDs match the baseline; the score does not regress unless an explicit, approved baseline disposition is attached. |
| **Evidence and cleanliness** | Candidate report, command logs, tool-version manifest, SHA/map identity, and post-run tracked-state check | All commands, exit codes, counts, and logs are present; the verifier observes no unexpected tracked mutation; the final verdict is one of `PASS` or `FAIL`, never inferred from missing evidence. |

### Alternatives Considered

1. **Use a single recursive name grep.** Rejected because it cannot apply the exemption/frozen boundary or resolve path semantics and dynamic sites.
2. **Treat `git diff` delete-plus-add pairs as equivalent to renames.** Rejected because the migration's history-preservation requirement is lost and review cannot verify source-to-target continuity.
3. **Run only the changed packages' tests.** Rejected because a filesystem rename can break distant registries, imports, links, or discovery paths; phase 000's complete command matrix is the authority.
4. **Allow each verifier to choose its own candidate or map.** Rejected because cross-domain evidence would no longer describe one repository state.

### Implementation

1. Load and verify BASE, candidate, map hash, baseline command matrix, and phase 009 evidence.
2. Run the naming, reference, history, validation, test, behavior, and cleanliness measurements independently.
3. Reconcile each result with the table above and the phase 010 checklist; stop on the first missing or failed P0 domain.
4. Emit the evidence report consumed by phase 011. Do not repair files, alter exemptions, or reinterpret a failed result inside the gate.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The gate is stricter and slower than a local smoke test, but its verdict is reproducible and auditable.
- A failure is actionable because the report identifies the domain, command, output, and owning migration phase instead of masking the symptom.
- The test baseline and rename map become mandatory inputs rather than optional context.
- The verifier must preserve raw Git status output and dynamic-site dispositions, which increases evidence size but prevents optimistic interpretation.

### Five Checks Evaluation

| Check | Evaluation |
|-------|------------|
| **Correctness** | The conjunction covers names, references, history, validation, tests, discovery, imports, links, and benchmark behavior. |
| **Simplicity** | Each domain has one authoritative input and a binary pass condition; the final verdict is an explicit conjunction. |
| **Consistency** | BASE, candidate, map hash, tool versions, and command matrix are shared across all measurements. |
| **Recoverability** | A failed domain returns the candidate to its owning phase; no gate code mutates the migration to obtain a pass. |
| **Observability** | Raw outputs, exit codes, counts, scenario IDs, dispositions, and clean-state checks are recorded in the report. |

<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Phase 010 specification: `spec.md`
- Phase 010 verifier contract: `checklist.md`
- Phase 000 baseline and census: `../000-worktree-baseline-and-census/`
- Program policy and exemption boundary: `../001-convention-policy-and-scope/decision-record.md`
<!-- /ANCHOR:references -->
