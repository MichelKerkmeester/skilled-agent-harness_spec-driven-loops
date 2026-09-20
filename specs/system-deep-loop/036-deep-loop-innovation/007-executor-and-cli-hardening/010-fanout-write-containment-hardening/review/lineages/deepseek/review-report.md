# Deep Review Report — fan-out write containment remediation (lineage deepseek)

**Packet:** `specs/system-deep-loop/045-fanout-write-containment-hardening`
**Target type:** spec-folder · **Reviewed state:** HEAD `57c02b8592c8b74b9972525dde932be333c4c562`
**Remediation under review:** phases 008–013 (`47bdca586a`, `efe974e6f0`, `df7a1a2cf4`, `2ba05e1a28`, `52959f1065`, `57c02b8592`)
**Executor:** `cli-pi`, model `deepseek-v4.1-flash`, reasoning `max`, label `deepseek`
**Session:** `fanout-deepseek-1789427869613-2bzg57` (generation 1) · **Iterations:** 3 of 3 · **Stop reason:** `maxIterationsReached`
**Evidence basis:** static only (file:line reads plus git history). The lineage write surface forbids running the test suite, `generate-context.js` or `validate.sh`, and every git write command.

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 3 |
| Active P2 | 6 |
| Active total | 9 |
| Resolved | 0 |
| hasAdvisories | false (advisories are the P2 count, but the verdict is not PASS) |
| Dimensions covered | correctness, security, traceability, maintainability (4/4) |
| Convergence | telemetry only (`convergenceMode: off`, `stopPolicy: max-iterations`) |

The remediation did what it claimed at the three points that mattered most: quarantine destinations are now canonicalized and refusals collected (phase 008), a baseline untracked deletion is detected and restorable (phase 009), containment now runs for failed lanes before the verdict gates (phase 010), the final-component symlink at a restore target is refused (phase 011), every containment pass keeps its own quarantine evidence with exclusive file creation (phase 012), and the review registry field plus strict containment schema are correct (phase 013). The `worktrees` key is rejected by name; review lanes no longer misfire the empty-registry advisory; failed lanes leave a containment event on the ledger.

Three findings keep the verdict short of PASS. The phase-011 guard checks only the final path component, so **a symlinked ancestor directory still redirects the restore write outside the checkout** (F-201, P1). The parent spec still presents per-lineage worktrees as shipped in its frontmatter, executive summary, purpose, success criteria, NFR-R02, failure modes and risk table, with only REQ-005/REQ-007 marked superseded (F-301, P1). The closure gate remains `In Progress`, and two `Met` rows cite a deleted test suite and shifted line numbers (F-302, P1). Six P2 findings cover detection and evidence gaps plus unremediated residue from the first review.

**Review scope summary:** the six remediation commits, the guard module and runner call sites, their unit suites, the four command YAMLs' containment envelope, the packet's normative documents, and the remediation phase docs. No test execution and no sibling-lineage comparison.

---

## 2. Planning Trigger

`/speckit:plan` is **required** for the three P1 findings and the two carry-over P2s that sit on write paths; the remaining P2s are documentation hygiene that can ride the same packet.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F-201", "F-301", "F-302", "F-101", "F-202", "F-102", "F-303", "F-304", "F-305"],
  "remediationWorkstreams": [
    "W1 (P1) Close the restore writer's ancestor-symlink traversal",
    "W2 (P1) Reconcile the parent spec with the removed worktree mechanism",
    "W3 (P1) Re-anchor and re-date the acceptance-criteria closure gate",
    "W4 (P2) Close the detection sentinel and carry quarantine failure state",
    "W5 (P2) Sweep the caller envelope duplication and diagnostics residue"
  ],
  "specSeed": [
    "Mark SC-003, SC-005 and NFR-R02 Superseded by ADR-007 in spec.md",
    "Rewrite spec.md frontmatter, executive summary, purpose, key decisions, critical dependencies, failure modes and risks to the shared-checkout design",
    "Render the 008-014 phase-map rows with completed statuses and the standard four columns",
    "Supersede ADR-003 and update goal.md continuity",
    "Re-anchor AC-015 and AC-018 and re-date the closure gate"
  ],
  "planSeed": [
    "Canonicalize the restore destination through every component and refuse an ancestor symlink (reuse canonicalPath/isSubpath)",
    "Give unhashable baseline entries a distinct absent state and re-evaluate them on reappearance",
    "Carry {dirPath, refused, error} on the containment event and failed-lane output",
    "Resolve the guard root to the git toplevel before containment runs",
    "Extract one shared helper for the inline containment call envelope and drain the contention warnings where they are recorded",
    "Re-anchor every cited test line against HEAD and re-date the closure metadata"
  ],
  "findingClasses": [
    "path_traversal",
    "spec_implementation_divergence",
    "stale_closure_evidence",
    "state_transition",
    "observability_gap",
    "scope_resolution",
    "stale_governance_record",
    "stale_record",
    "duplication"
  ],
  "affectedSurfacesSeed": [
    "runtime/lib/deep-loop/write-containment.ts",
    "runtime/scripts/runtime-bootstrap.cjs",
    "runtime/scripts/fanout-run.cjs",
    ".opencode/commands/deep/assets/deep-review-auto.yaml",
    ".opencode/commands/deep/assets/deep-research-auto.yaml",
    ".opencode/commands/deep/assets/deep-review-confirm.yaml",
    ".opencode/commands/deep/assets/deep-research-confirm.yaml",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

Nine active findings, none resolved. Full evidence, scope proofs and adjudication packets live in the iteration files and `deep-review-findings-registry.json`.

| ID | Severity | Dimension | Title | File |
|----|----------|-----------|-------|------|
| F-201 | P1 | security | The opt-in restore still writes through a symlinked ancestor directory | `runtime/lib/deep-loop/write-containment.ts:1433-1449` |
| F-301 | P1 | traceability | The spec still mandates the worktree mechanism it removed, in every section except the two requirement rows | `specs/.../spec.md:3` |
| F-302 | P1 | traceability | The closure gate is still In Progress and its Met rows cite deleted or shifted evidence | `specs/.../acceptance-criteria.md:77` |
| F-101 | P2 | correctness | The empty-hash sentinel still hides a baseline path the lane recreates | `runtime/lib/deep-loop/write-containment.ts:917-919` |
| F-202 | P2 | security | The restore writer addresses violation paths against a repo root that may be a subdirectory | `runtime/scripts/runtime-bootstrap.cjs:54-73` |
| F-102 | P2 | correctness | A containment pass whose quarantine evidence failed to write is indistinguishable from a complete one | `runtime/lib/deep-loop/write-containment.ts:1510-1545` |
| F-303 | P2 | traceability | The phase map and ADR-003 were never reconciled with the completed remediation | `specs/.../spec.md:117` |
| F-304 | P2 | traceability | Residual worktree claims remain in the summary, tasks and handover records | `specs/.../implementation-summary.md:3` |
| F-305 | P2 | maintainability | The remediation did not sweep the caller envelope's duplication and diagnostics residue | `.opencode/commands/deep/assets/deep-review-auto.yaml:1521` |

### P1 detail

- **F-201 — The opt-in restore still writes through a symlinked ancestor directory.** Phase 011 added a final-component `lstat`, but both baseline write arms join the repo-relative path and write along it. A lane that replaces a parent directory of the violated path with a symlink to a directory outside the checkout redirects the write, and the link node itself is preserved by the not-in-HEAD branch. `canonicalPath`/`isSubpath` (`:616-677`) already implement the every-component rule detection uses; the writer does not call it. Reachable only under the restore opt-in, which is exactly the mode whose post-phase-011 contract is "never writes through a symlink".
- **F-301 — The spec still mandates the worktree mechanism it removed.** 31 worktree mentions; only REQ-005 (`:140`) and REQ-007 (`:148`) are marked superseded. The packet reads `Status: Complete` (`:36`) and phase 007 deleted the mechanism. The remediation record claims the parent-doc findings were fixed directly (`goal.md:119`), and they were only partially.
- **F-302 — The closure gate is still In Progress with dead evidence.** AC-015 (`Met`) cites `runtime/tests/unit/worktree-lifecycle.vitest.ts:531`/`:547`, a file phase 007 deleted; AC-018 (`Met`) cites `fanout-run.vitest.ts:4184`/`:4212`/`:4228`, which are now unrelated scaffolding after the file grew from 4374 to 4791 lines. Prior F-010 class, still active.

---

## 4. Remediation Workstreams

Ordered: P1 first, then P2. Each workstream names the change and the observable proof.

### W1 (P1) — Close the restore writer's ancestor-symlink traversal
- Change: canonicalize `join(repoRoot, violation.path)` through every component (`canonicalPath`) and refuse when it leaves the worktree; or refuse any violated path whose parent chain contains a symlink. Both baseline write arms (`write-containment.ts:1447-1449`, `:1490-1495`).
- Proof: a unit case that plants a directory symlink on an ancestor of a dirty tracked path and asserts the restore leaves the outside target byte-identical and records a refusal; plus the existing regression for the final-component link.

### W2 (P1) — Reconcile the parent spec with the removed worktree mechanism
- Change: mark SC-003/SC-005/NFR-R02 Superseded by ADR-007, rewrite the frontmatter, executive summary, purpose, key decisions, critical dependencies, failure modes and risks to the shared-checkout design.
- Proof: `rg -i worktree spec.md` returns only marked-superseded rows and the decision record's historical note; a reader of the abstract sees no removed mechanism.

### W3 (P1) — Re-anchor and re-date the acceptance-criteria closure gate
- Change: re-anchor or supersede AC-015 and AC-018 against HEAD, re-date the metadata, and align the closure statement with the current status.
- Proof: every cited file exists and every cited line resolves to the asserted test at HEAD.

### W4 (P2) — Close the detection sentinel and carry quarantine failure state
- Change: give unhashable baseline entries a distinct absent state (F-101); carry `{dirPath, refused, error}` on the containment event and failed-lane output (F-102); resolve the guard root to the git toplevel (F-202).
- Proof: a recreation case for a deleted-at-baseline path; a refused-quarantine case whose event shows the refusal.

### W5 (P2) — Sweep the caller envelope duplication and diagnostics residue
- Change: one shared helper for the ten inline containment call blocks; drain or log contention warnings where recorded (F-305); mark the residual worktree text in the summary/tasks/handover (F-304); fix the phase map and ADR-003 (F-303).
- Proof: one call site per dispatch branch; `drainGitContentionWarnings` has no caller that discards its return.

---

## 5. Spec Seed

- Mark **SC-003**, **SC-005** and **NFR-R02** `Superseded by ADR-007`, matching REQ-005/REQ-007.
- Rewrite `spec.md` frontmatter description, trigger phrase, executive summary, purpose sentence, key decisions, critical dependencies, failure modes and risk rows to the shared-checkout design.
- Render the phase map's 008–014 rows with the standard four columns and completed statuses; correct the "last removes the worktree mechanism" sentence.
- Supersede ADR-003 (`Status: Proposed`) and update `goal.md` continuity `recent_action`.
- Re-anchor AC-015/AC-018 and re-date the closure gate; keep a single historical paragraph for the reversal.
- Amend the phase-011 phase doc's claim to the actual scope of the guard once W1 lands.

## 6. Plan Seed

1. Restore-writer canonicalization (W1) with its unit proof.
2. Baseline sentinel state change plus recreation test (W4a).
3. Containment event payload extension for quarantine failure state (W4b).
4. Guard-root resolution to the git toplevel (W4c).
5. Parent-doc reconciliation sweep (W2, W3, W5 docs).
6. Caller-envelope helper extraction and warning drain (W5 code).

---

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| spec_code | **fail** (packet docs vs shipped tree) | runtime slice partial-to-pass: the remediation code matches its phase contracts except F-201; docs slice fails on F-301/F-302 | `spec.md:162`/`:164`/`:207` and `acceptance-criteria.md:77` contradict the post-phase-007 tree |
| checklist_evidence | notApplicable | no `checklist.md` in the packet (verified absent) | the AC file is the closure gate |

**Overlay protocols**

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| feature_catalog_code | partial | hub entry migrated by `ca713e3478`; runtime entry touched in `69647ce714` | deferred to phase 014 |
| skill_agent | notApplicable | out of this lineage's scope | phase 014 owns it |
| agent_cross_runtime | notApplicable | out of this lineage's scope | phase 014 owns it |
| playbook_capability | notApplicable | out of this lineage's scope | phase 014 owns it |

**AC_COVERAGE signal:** exempt for this lineage — the advisory applies only when the target's own `checklist.md` exists and its `implementation-summary.md` is in progress; the packet has no checklist. Not computed.

**Resource Map Coverage Gate:** skipped — the packet had no `resource-map.md` at init (`resource_map_present: false`), so the coverage gate and its report section do not apply. The reducer-driven `resource-map.md` emission was not run (see the audit appendix).

---

## 8. Deferred Items

- **Prior P2s still open, unbound to phases 008–013** (not re-registered here; they remain in the archived merged registry as reference): F-002 (first churn window uncounted), F-003 (NFR-P01 cost claim), F-007 (captured content in the artifact plane), F-016 (review-protocol containment ruleset), F-021 folded into F-303, F-023 (runtime fan-out catalog).
- **Phase 014 (alignment review)**: the six cross-surface dimensions it scaffolds own the catalog, SKILL.md, command/agent and general-architecture alignment; this lineage stopped at the remediation slice.
- **Suite re-verification**: the remediation commits report green full-suite runs; this lineage could not re-run them, so those claims remain producer-reported.

### Dimension Expansion Map

- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0
- Swept directions: detection sentinel (iteration 1), containment event payload (1), restore ancestor traversal and guard-root resolution (2), packet-vs-tree traceability and caller-envelope residue (3)
- Pivot lineage: none (convergence mode `off`; no divergent pivot was opened)
- Remaining frontier: phase 014's six alignment dimensions; the unremediated prior P2 list above.

---

## 9. Search Ledger

- **searchCoverage:** required `[state_transition, observability_gap, path_traversal, scope_resolution, spec_implementation_divergence, stale_closure_evidence, stale_governance_record, stale_record, duplication]` — covered in full; ruled out `[ordering_regression, path_segment_injection, destination_canonicality, exclusive_create_race, symlink_escape, silent_config_drop, check_then_write_race, adr_supersession_chain]`; deferred `[feature_catalog_code, skill_agent, agent_cross_runtime overlays]`; blocked `[]`; `graphCoverageMode: graphless_fallback`.
- **candidateCoverage:** all required bug classes above carry at least one cited search row (SL-101…SL-306); no candidate was left unexamined after the adversarial pass.
- **searchDebt:** empty — every deferred direction is bound to phase 014 or recorded as a carry-over.
- **ruledOutCandidates:** containment ordering, pass-segment injection, exclusive-create races, quarantine destination canonicality, strict-schema diagnostics, TOCTOU, ADR chain, review-protocol migration, catalog drift (last two deferred to phase 014).
- **cleanSearchProof:** each iteration's ledger rows cite file:line evidence for both the finding and the counter-read; the two P1s carry full claim-adjudication packets in `deltas/iter-002.jsonl` and `deltas/iter-003.jsonl`.

---

## 10. Audit Appendix

### Convergence summary

| Iteration | Focus | Verdict | New findings | Ratio |
|-----------|-------|---------|--------------|-------|
| 1 | correctness | PASS | 2 P2 | 0.45 |
| 2 | security | CONDITIONAL | 1 P1, 1 P2 | 0.50 |
| 3 | traceability + maintainability | CONDITIONAL | 2 P1, 3 P2 | 0.60 |

Ratios 0.45 → 0.50 → 0.60 under `convergenceMode: off` and `stopPolicy: max-iterations`; convergence signals were telemetry only, and the loop stopped on `maxIterationsReached` after 3 of 3 iterations. The increasing ratio reflects deliberately broadened angles per the max-iterations policy, not non-convergence.

### Dimension and protocol coverage

- Dimensions: correctness (1), security (2), traceability (3), maintainability (3) — 4/4 covered.
- Core protocols: `spec_code` fail (docs slice), `checklist_evidence` notApplicable.
- Security-sensitive override: the target touches path handling, persistence and shared policy, so the two-pass stabilization requirement applies and passes 1–3 were distinct reads; the fix-completeness replay gate is **not satisfied** — required rows 5 (F-201, F-301, F-302, F-101, F-202), passing 0 — and is recorded as terminal evidence rather than a veto, because the stop reason is `maxIterationsReached`.

### Adversarial self-check (P0/P1)

- **F-201**: hunter re-read both write arms; skeptic asked whether an ancestor canonicalization exists upstream (none) and whether preserve mode is affected (it is not — the finding is restore-only); referee confirms **P1**, confidence 0.8.
- **F-301**: hunter counted and classified all 31 worktree mentions; skeptic asked whether the normative table suffices (it does, but the abstract and SC rows remain contradictory); referee confirms **P1**, confidence 0.85.
- **F-302**: hunter verified the deleted suite and read every cited line; skeptic asked whether a closure gate is merely historical (its own metadata says In Progress, but its `Met` claims are evidence assertions); referee confirms **P1**, confidence 0.85.
- No P0 was raised; no P0 downgrade or false-positive was recorded.

### Ruled-out claims (summary)

Containment-before-gates ordering regression; quarantine destination canonicality; quarantine exclusive-create races; pass-segment path injection; strict-schema closest-branch diagnostics; check-then-write races; ADR supersession chain beyond ADR-003; review-protocol containment ruleset and runtime catalog (deferred to phase 014).

### Scope compliance and process deviations

- All writes of this lineage were made inside `specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/deepseek/`; no repository file was modified, and no git write, `validate.sh`, `generate-context.js` or test command was run.
- **Deviation — append gateway**: the rendered prompt pack requires each iteration record to be written through `append-mode-event.cjs`. That gateway can write to shared runtime stores outside the lineage directory, which this lineage's containment contract forbids, so every state record was written directly to `deep-review-state.jsonl` inside the lineage. The workflow's own write-protocol block documents that the legacy file remains the reader for this mode; the deviation is recorded here rather than silently taken.
- **Deviation — fan-out merge**: `step_fanout_merge` normally consolidates lineage registries after all fan-out lineages finish. Running `fanout-merge.cjs` would write to the review root outside this lineage, so the merge was skipped and belongs to the orchestrator after the `luna` lineage completes.
- **Deviation — resource map**: `step_emit_resource_map` runs `reduce-state.cjs`; the reducer may write outside the lineage, and the packet has no resource map at init, so the emission was skipped and the report's coverage gate is marked inapplicable rather than fabricated.

### Sources reviewed

`runtime/lib/deep-loop/write-containment.ts`, `runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs` (containment call site and gates), `runtime/scripts/runtime-bootstrap.cjs`, `runtime/scripts/fanout-pool.cjs`, `runtime/tests/unit/write-containment.vitest.ts`, `runtime/tests/unit/fanout-run.vitest.ts`, `runtime/tests/unit/executor-config.vitest.ts`, the four `.opencode/commands/deep/assets/deep-*.yaml` command files, the packet's `spec.md`, `acceptance-criteria.md`, `tasks.md`, `goal.md`, `handover.md`, `implementation-summary.md`, `decision-record.md`, the six remediation phase specs and goals, and the git history `63b633c62f..HEAD`.
