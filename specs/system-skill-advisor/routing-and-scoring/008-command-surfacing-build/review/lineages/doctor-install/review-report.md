# Review Report — Command Surfacing, doctor-install lineage

- Session: `fanout-doctor-install-1794550137809-1ecgc7` (generation 1, lineageMode new, parentSessionId null)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`, area `doctor-install`
- Iterations: 5 of 5 (`maxIterationsReached`); convergence ratio never fell below 0.10
- Dimensions: correctness (iterations 1–2), traceability (3), security (4), maintainability (5)

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: false
- Active findings: **P0 = 0, P1 = 2, P2 = 14** (16 active, 0 resolved)
- Review scope: the 28 `doctor-install` paths in `review/review-scope.txt` plus the shared docs that describe them (`INSTALL-SKILLED.md`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`, the command docs). Four runtimes' hook surfaces were executed read-only; holdout files were inspected by count only.
- Operator review focus: Code review of command surfacing. Scope: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope.txt lists the changed files, one per line as area TAB path. Review the files whose area equals your lineage label (last folder of config.fanout_lineage_artifact_dir), plus shared docs that describe them. Every finding is P0, P1 or P2 with file:line. Check: behaviour on claude, codex, opencode, pi, devin and dsh; safety of offering a mutating command; holdout hygiene, so no tune, fix or report path reads or leaks holdout rows; docs that disagree with code. Never read or print holdout prompt text (split holdout in command-prompts.jsonl, or holdout-prompts.jsonl): counts only. The reviewer changes no code and writes only inside its lineage folder.
- Release readiness: **in-progress** (the loop hit the iteration ceiling without legal convergence; two P1 findings remain)

## 2. Planning Trigger

`/speckit:plan` is required: two active P1 findings and fourteen P2 advisories.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": 16,
  "remediationWorkstreams": [
    "W1: make apply atomic per target and roll back on a write failure (DR1-P1-001)",
    "W2: refuse a symlinked router or Cursor mirror at compose time, or write to the resolved target explicitly (DR4-P1-001)",
    "W3: align the sibling hook checks' argument parsing and structural marker match (DR5-P2-001, DR5-P2-002)",
    "W4: converge the check/embed router-table grammar on one reader (DR5-P2-003)",
    "W5: align the runtime count and dsh name across the install guide, `_routes.yaml` and `symlink-manifest.json` (DR2-P2-001)",
    "W6: correct the diagnostic summaries and repair contracts (DR1-P2-001/002/003, DR3-P2-001/002/003/004)",
    "W7: bind the embedder's mutation host to OLLAMA_BASE_URL (DR2-P2-002)",
    "W8: state the setup socket-directory write in the workflow's own mutation boundary (DR2-P2-003)"
  ],
  "specSeed": [
    "Define atomicity for a multi-target apply: either all targets written or none, and the undo line printed before any target is touched",
    "Define the allowed symlink shapes per allowlisted path (root document, CLAUDE.md, router, Cursor mirror) and the refusal for each",
    "State which runtime set `/doctor:install` offers and where the canonical list lives (route manifest vs symlink manifest vs docs)",
    "State whether the embedder route may target a non-default OLLAMA_BASE_URL and how the start/pull steps bind to it"
  ],
  "planSeed": [
    "Add a rollback or staged-write path around the apply loop in agents-md-embed.cjs and print the undo line before the first write",
    "Add an isSymlink guard for REPO RULES.md and .cursor/rules/repo-local.md, or write to the resolved target after an explicit confirmation",
    "Route both hook checks through one argument parser and match the marker inside hook command strings, not the serialized payload",
    "Extract the router-table reader into a shared helper that returns rows with line positions",
    "Reconcile the six-vs-seven runtime list and add dsh wherever the route manifest accepts it",
    "Fix the A10 summary count to exclude the pointer-missing INFO from 'as expected'",
    "Give the absent Codex entry a repair line or change the runtime-mirrors WARN contract to match",
    "Add the socket-directory write to the setup mutation boundary or state the advisor probe never creates it",
    "Correct the scripts README's delegated-tool count from three to four"
  ],
  "findingClasses": ["class-of-bug", "cross-consumer", "instance-only"],
  "affectedSurfacesSeed": [
    "agents-md-embed.cjs apply and compose",
    "agents-md-check.cjs A10 and A11",
    "codex-hook-approval-check.cjs and hook-wiring-check.cjs",
    "doctor-install presentation and workflow",
    "doctor-setup workflow, presentation and router",
    "doctor-runtime-mirrors workflow",
    "doctor-symlink-check workflow",
    "doctor-skill-advisor-embedder workflow",
    "scripts/README.markdown",
    "INSTALL-SKILLED.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1 — Required

| ID | Title | Dimension | Location | Evidence | Fix |
|----|-------|-----------|----------|----------|-----|
| DR1-P1-001 | A failed write mid-apply leaves a half-embedded tree and prints no undo | correctness | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1364` | The write loop runs without a guard; rollback is reachable only after the loop returns (`:1395`), and the undo line prints after the proof (`:1407`) | Wrap the write loop so a throw restores from the backup and prints the undo, or write all targets through a staged transaction |
| DR4-P1-001 | A symlinked `REPO RULES.md` or `.cursor/rules/repo-local.md` is written through, so apply mutates a file its plan never named | security | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:783` | Router/mirror branches have no symlink guard; `assertWritable` (`:902`) rejects only links outside the root | Refuse a symlinked router/mirror, or resolve the link and require an explicit target before writing |

Finding-class: DR1-P1-001 `class-of-bug`; DR4-P1-001 `class-of-bug`. Scope proofs and affected surfaces are in `iterations/iteration-001.md` and `iteration-004.md`.

### P2 — Suggestions

| ID | Title | Location |
|----|-------|----------|
| DR1-P2-001 | A symlinked `.codex/AGENTS.md` reports PASS while the manifest declares that path absent | `.skilled/commands/doctor/scripts/agents-md-check.cjs:709` |
| DR1-P2-002 | The CLAUDE.md pointer verdict claims every line names AGENTS.md while only one line must | `.skilled/commands/doctor/scripts/agents-md-check.cjs:731` |
| DR1-P2-003 | The preservation proof's fourth claim is computed and never enforced | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:598` |
| DR2-P2-001 | The install guide offers six runtimes while calling the accepted set seven, and never names dsh | `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` |
| DR2-P2-002 | The embedder route probes OLLAMA_BASE_URL but starts and pulls against the default local host | `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:89` |
| DR2-P2-003 | setup.md documents one out-of-repository write while the workflow declares an empty allowlist | `.skilled/commands/doctor/setup.md:75` |
| DR3-P2-001 | A10 reports copies as expected for a tree whose CLAUDE.md is missing | `.skilled/commands/doctor/scripts/agents-md-check.cjs:649` |
| DR3-P2-002 | An absent Codex advisor entry is routed to a command that cannot repair it, and a promised repair line is never printed | `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:165` |
| DR3-P2-003 | The symlink check output contract says OK on engine exit 0 though its hook step can end the run as WARN | `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:67` |
| DR3-P2-004 | The scripts README says the check runs three owner tools as children while it runs four | `.skilled/commands/doctor/scripts/README.markdown:102` |
| DR4-P2-001 | Automatic rollback restores the backup without the allowlist and hash checks the manual restore enforces | `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1289` |
| DR5-P2-001 | The two sibling hook checks disagree on a value flag whose next token starts with a dash | `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:59` |
| DR5-P2-002 | Hook wiring counts a marker anywhere in the event payload, so a mention is read as a wired entry | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:123` |
| DR5-P2-003 | The check and the embed engines read the same router table by different rules | `.skilled/commands/doctor/scripts/agents-md-check.cjs:809` |

## 4. Remediation Workstreams

1. **W1 — Apply atomicity (P1).** DR1-P1-001. The fix is structural: the run must not be able to leave `AGENTS.md` written and `CLAUDE.md` not written, and the undo line must be available before the first byte.
2. **W2 — Symlink write containment (P1).** DR4-P1-001. Add the guard the root document already has to the router and mirror branches.
3. **W3 — Sibling check parity (P2).** DR5-P2-001, DR5-P2-002. One argument parser and one structural marker match.
4. **W4 — Router grammar (P2).** DR5-P2-003. One reader for the check and embed halves.
5. **W5 — Runtime list (P2).** DR2-P2-001. Reconcile six/seven and dsh across the presentation, the workflow and `symlink-manifest.json`.
6. **W6 — Diagnostic truth (P2).** DR1-P2-001/002/003, DR3-P2-001/002/003/004, DR4-P2-001. Counts, details, repair lines and rollback checks.
7. **W7 — Embedder host binding (P2).** DR2-P2-002.
8. **W8 — Setup mutation boundary (P2).** DR2-P2-003.

## 5. Spec Seed

- Atomicity contract for multi-target apply, including the undo line's position in the output.
- Allowed symlink shape per allowlisted write path.
- One canonical runtime list and its owner.
- Embedder host binding for probe, start and pull.
- One router-table grammar shared by check and embed.

## 6. Plan Seed

See `planSeed` in the Planning Packet. Tasks are ordered W1, W2, W3, W4, then the W5–W8 corrections, with the W6 group parallelizable.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The change diff (`35c3188681..320e7b64d4`, 27 files) was read directly; the packet's `spec.md` was not read at this level, and the phased parent has no root checklist. |
| `checklist_evidence` | notApplicable | No root `checklist.md`; child packets own their checklists. |
| `AC_COVERAGE` | exempt | Level and lifecycle predicate not active at the parent level; no acceptance criteria file is in this lineage's scope. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No skill or agent definition is in this lineage's scope. |
| `agent_cross_runtime` | pass | `hook-wiring-check` reports `ok` for claude, codex, cursor, devin; `codex-hook-approval-check` reports the documented unapproved state; the four-runtime advisor hook reach matches `.opencode/hooks/skill-advisor/`. |
| `feature_catalog_code` | partial | The install checklist matches the route rows; the feature catalog entry was not read. |
| `playbook_capability` | notApplicable | No manual-testing playbook file is in scope. |

## 8. Deferred Items

- The dsh runtime gap needs a decision outside this lineage: `symlink-manifest.json` has no `dsh` key, so the install guide cannot offer it even after the wording is fixed.
- `capture-command-routing-baseline.mjs` reads holdout rows for aggregate baseline counts. It is an evaluation report rather than a tune path, and it prints no prompt text, so it is recorded as an observation, not a finding.
- A shared router-table helper needs line positions for insertion; that is a refactor risk, not a current defect.

## Dimension Expansion Map

- Saturated directions: correctness (two passes, no new class after iteration 2), traceability (one pass), security (one pass), maintainability (one pass).
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Selected review directions: runtime branch logic, mutation safety, doc/code agreement, holdout hygiene, sibling-pair divergence.
- Remaining frontier: none recorded; the iteration cap ended the loop before a legal convergence.

## Search Ledger

- `searchCoverage` (v2, all iterations): required bug classes across five iterations — runtime_branch_coverage, false_clean_diagnostic, misleading_evidence, partial_write, proof_contract, runtime_parity, environment_boundary, docs_code_disagreement, mutation_authorization, repair_path_closure, count_accuracy, runtime_coverage, holdout_isolation, write_containment, secret_emission, rollback_integrity, sibling_argument_parity, marker_structural_match, shared_grammar_drift. Covered or ruled out: all. Deferred: 0. Blocked: 0.
- `candidateCoverage`: graph unavailable; `graphCoverageMode = graphless_fallback` on every iteration, with a direct-read or exact-search ledger row per required class.
- `searchDebt`: 0 (reducer `searchDebtCount = 0`).
- `ruledOutCandidates`: the four-runtime hook table, the nested Codex shape, the bare `check` default target, the `--tool` value set, the mcp-install approval claim, the documented manifest test file, the holdout leak, the caller-chosen backup directory, the shared-helper simplification.
- `cleanSearchProof`: `iteration-001.md` through `iteration-005.md`, each carrying a claim-adjudication packet for its P1 findings.

## Audit Appendix

### Convergence summary

| Iteration | Dimension | New findings | Weighted ratio | Verdict |
|-----------|-----------|--------------|----------------|---------|
| 1 | correctness | 1 P1, 3 P2 | 1.00 | CONDITIONAL |
| 2 | correctness | 3 P2 | 0.27 | CONDITIONAL |
| 3 | traceability | 4 P2 | 0.21 | CONDITIONAL |
| 4 | security | 1 P1, 1 P2 | 0.29 | CONDITIONAL |
| 5 | maintainability | 3 P2 | 0.125 | CONDITIONAL |

Stop reason: `maxIterationsReached` at iteration 5. Release-readiness state: `in-progress`.

### Coverage summary

- Dimensions: 4 of 4 (`dimensionCoverage` all true in the registry).
- Files reviewed: the four doctor scripts, the eight doctor assets in scope, the three command routers, the scripts README, `INSTALL-SKILLED.md`, and the two changed regions of `INSTALL-GUIDE.md`.

### Ruled-out claims

All nine entries in `deep-review-strategy.md` §11 plus the four iteration-level ruled-out rows in `deltas/iter-001..005.jsonl`.

### Sources reviewed

`review-scope.txt` (area `doctor-install`), `_routes.yaml`, `agents-md-manifest.json`, `symlink-manifest.json`, `.codex/hooks.json`, `.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.opencode/hooks/skill-advisor/`, and the routing-accuracy scripts by file name and count only.
