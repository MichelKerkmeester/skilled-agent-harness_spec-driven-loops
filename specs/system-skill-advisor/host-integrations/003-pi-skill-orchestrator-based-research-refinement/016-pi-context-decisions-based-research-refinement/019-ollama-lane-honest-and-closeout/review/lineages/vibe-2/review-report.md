# Review Report: Phase 19 ollama-lane-honest-and-closeout

- Run: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Lineage: `vibe-2`
- Mode: review, depthMode expansive, stopPolicy convergence
- Iterations: 8 of 16
- Stop reason: legal convergence (all five signals at 1.0, no blockers)
- Verdict: CONDITIONAL
- Release readiness: in-progress

## 1. Executive Summary

Eight iterations reviewed the commit set the operator named, across all four configured dimensions and both frontier nodes. The run found one P1 and eleven P2 findings, and no P0.

The P1 is a real invariant break: the semantic coverage gate opens the daemon-owned skill-graph database read-write on the recommend path, contradicting the read-only contract the same module states at its own call site. It is the only finding that blocks a clean verdict.

The eleven P2 findings cluster into three groups. Four are lane correctness edges: a diagnostic token that fires for the wrong subject, a one-directional fixture guard, an ungated rerank path, and a misnamed constant feeding the weight guard. Five are documentation claims that do not match shipped behavior: two changelog statements, an undocumented diagnostic vocabulary, a superseded ablation score pair, and an acceptance criterion that claims a broader match than the recorded evidence. Two are duplication and logging: the same wrong claim living in two changelog files, and the adapter's raw error message carrying the configured base URL into the log.

What held up is worth stating plainly. The prompt-isolation boundary is sound: `why_recommended` reduces every evidence entry to a fixed category token, so no prompt text can leak. The two tests the acceptance criteria cite for the coverage gate and the outage path assert the claimed behavior directly rather than describing it. The test-only commit `0390556ee2b` is honest in both halves: the widened alternation matches the shipped call site, and the Pi path assertion still fails on nudge-side drift. The ablation measurement is recorded consistently in the feature catalog, the playbook, the install guide and the older changelog; only the newer changelog's first sentence is stale.

## 2. Planning Trigger

Planning is required. One active P1 remains, so the promotion gate is conditional and the verdict is CONDITIONAL. The P1 has a concrete fix and a concrete downgrade trigger, both recorded in its finding. The eleven P2 findings do not block promotion but should be scheduled, because five of them are operator-facing documentation claims and two of those understate the cost of enabling the semantic lane.

## 3. Active Finding Registry

| ID | Severity | Dimension | Location | Title |
|----|----------|-----------|----------|-------|
| R1-P1-001 | P1 | correctness | `runtime/lib/scorer/lanes/semantic-shadow.ts:404` | The semantic coverage gate opens the daemon-owned skill-graph database read-write on the recommend path |
| R1-P2-001 | P2 | correctness | `runtime/lib/scorer/lanes/semantic-shadow.ts:1432` | The `incomplete_skill_vectors` reason also fires for a missing command vector |
| R1-P2-002 | P2 | correctness | `runtime/lib/scorer/lanes/semantic-shadow.ts:352` | The fixture-dimension guard is one-directional |
| R1-P2-003 | P2 | correctness | `runtime/lib/scorer/lanes/semantic-shadow.ts:288` | The exact-subset rerank has no coverage gate |
| R2-P2-001 | P2 | correctness | `.skilled/changelog/skilled/v4.1.0.0.md:229` | The changelog says the launcher always sets `SYSTEM_SKILL_ADVISOR_DB_DIR`, but the code only fills it when the operator has not set it |
| R2-P2-002 | P2 | correctness | `.skilled/changelog/skilled/v4.1.0.0.md:222` | One changelog section cites two different corpus sizes for one measurement |
| R3-P2-001 | P2 | security | `runtime/lib/scorer/lanes/semantic-shadow.ts:245` | The lane logs the adapter raw error message, which embeds the configured base URL verbatim |
| R4-P2-001 | P2 | security | `references/scoring/advisor-scorer.md:80` | The docs define three of the eight `disabledReason` tokens the code can emit |
| R5-P2-001 | P2 | traceability | `acceptance-criteria.md:60` | AC-005 claims the shipped runs match five earlier runs while the recorded evidence covers two |
| R6-P2-001 | P2 | traceability | `.skilled/changelog/skilled/v4.1.0.0.md:222` | The changelog records two different ablation score pairs for the same lane, and the first appears nowhere in the packet ablation table |
| R7-P2-001 | P2 | maintainability | `runtime/lib/scorer/lanes/semantic-shadow.ts:156` | The lane weight guard reads a constant named `DEFAULT_SCORER_LANE_WEIGHTS` that actually holds the resolved live weights |
| R8-P2-001 | P2 | maintainability | `changelog/v1.3.0.0.md:26` | Two claims already recorded as wrong are stated again in the older changelog, so fixing one file leaves the other |

Counts: 0 P0, 1 P1, 11 P2. Open 12, resolved 0.

## 4. Remediation Workstreams

### W1: Restore the read-only contract on the recommend path (blocks promotion)

- R1-P1-001. `embeddingCoverage()` is called with no argument at `semantic-shadow.ts:404`, which reaches `getDb()` and then `initDb()`, opening the daemon-owned database read-write. The module states the opposite invariant at `:170-172` and uses `getDbReadOnly()` on the pre-embed path. Fix: pass the read-only handle through, or make `embeddingCoverage` take the database it reads.
- Downgrade trigger: prove `advisor_recommend` only ever runs inside the daemon process, which would make the dual-writer hazard unreachable.

### W2: Correct the lane's diagnostic vocabulary (operator-facing)

- R1-P2-001 and R4-P2-001 together. The code emits eight `disabledReason` tokens; the docs define three. `incomplete_skill_vectors` also fires for a missing command vector, so the token names the wrong subject. Fix: document all eight and split the command case into its own token or rename the existing one.

### W3: Close the lane's coverage gaps

- R1-P2-002 and R1-P2-003. The fixture-dimension guard only checks one direction, and the exact-subset rerank path has no coverage gate at all, so a stale vector can still score there. Fix: make the guard symmetric and gate the rerank path on the same coverage check the cosine path uses.

### W4: Reconcile the documentation with the measurement

- R2-P2-001, R2-P2-002, R6-P2-001, R8-P2-001. Four claims across three files. The launcher DB-directory sentence is wrong in two changelogs. The corpus size is stated as both 193 and 196 in one section. The ablation score pair 149/193 against 150 appears nowhere in the packet table and contradicts the 156 against 161 eleven lines below it. Fix: state each claim once, in the file that owns it, and delete the duplicates.

### W5: Correct the acceptance criterion's evidence claim

- R5-P2-001. AC-005 says runs 8 and 9 match runs 3 to 7; the summary records flip lists for runs 3 and 4 only. Fix: narrow the cell to the runs whose evidence exists, or record the missing flip lists.

### W6: Remove the base URL from the lane log

- R3-P2-001. The adapter's error message embeds `OLLAMA_BASE_URL` verbatim and the lane logs it. Fix: log the error class and the endpoint host, not the raw message.

### W7: Rename the resolved-weights constant

- R7-P2-001. `DEFAULT_SCORER_LANE_WEIGHTS` holds `RESOLVED_WEIGHTS`, which already carries the operator override. The guard is correct; the name invites a fix that would break the documented opt-in. Fix: rename to `RESOLVED_SCORER_LANE_WEIGHTS` and keep a separate `DEFAULT_*` for the pre-override values.

## 5. Spec Seed

The owning packet's decisions D1 and D2 are implemented as written, with two documentation exceptions. D1's coverage gate, outage-as-degraded behavior and `OLLAMA_*` forwarding all ship and are asserted by tests. D2's pass bar ran and failed, and the default weight correctly stayed 0. The spec-side work is therefore narrow: amend AC-005's verification cell to match the recorded evidence, and add the eight-token `disabledReason` vocabulary to the scoring reference so the diagnostic surface has one documented home.

## 6. Plan Seed

Order the work by blast radius, not by finding id.

1. W1 first: it is the only promotion blocker and it is a small change at one call site.
2. W6 second: a one-line logging change that removes a credential-bearing string from a support artifact.
3. W7 third: a rename with no behavior change, best done before W2 so the diagnostic work does not collide with it.
4. W2 and W3 together: both touch the lane's coverage logic and its vocabulary, so one pass avoids two rounds of test churn.
5. W4 and W5 last: documentation only, and W4's deduplication should follow the code fixes so it records the final behavior.

## 7. Traceability Status

| Protocol | Level | Status | Iterations | Notes |
|----------|-------|--------|------------|-------|
| `spec_code` | core | partial | 1, 2, 3, 4, 5, 6, 8 | The module read-only contract is contradicted by the coverage gate (R1-P1-001); several documentation claims do not match the code (R2-P2-001, R2-P2-002, R4-P2-001, R6-P2-001, R8-P2-001). |
| `checklist_evidence` | core | pass | 1, 5, 6, 7, 8 | Every acceptance criterion row reads `Met` with a named verification; no `Unmet` row remains. |
| `skill_agent` | overlay | pass | 4 | The advisor's own scoring reference matches the lane's shipped weight, gating and degradation behavior. |
| `agent_cross_runtime` | overlay | notApplicable | 5, 6, 7, 8 | No agent definition integrates the advisor status surface, so there is no agent-to-runtime pair to reconcile. |
| `feature_catalog_code` | overlay | pass | 2, 6, 8 | The catalog's ablation leaf, index leaf count and playbook mapping all match the code and the directories. |

## 8. Deferred Items

- **Frontier depth 2 and 3 were not opened.** Both depth-1 nodes were answered across all four dimensions, and no iteration proposed a sub-target, so the depth-2 and depth-3 budgets (5.6 and 8) are unspent. This is a deliberate stop, not a gap: the two nodes the operator bound as `frontier_scope` are both answered.
- **The ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df` were reviewed only through the packet docs they wrote.** The 231 recorded answers were checked as acceptance-criteria and implementation-summary evidence, not as 231 individual decision records. A per-record audit is a separate review.
- **`dc3979eb451` (generation counter) and `571575632a4` (sk-doc routing) were not read directly.** Their surfaces fall outside both frontier node scopes. They remain unreviewed by this lineage.
- **No test asserts the `disabledReason` vocabulary against the docs.** Recorded in iteration 4 as a missing dependency rather than converted into a pass.

## 9. Audit Appendix

### Dimension Expansion Map

| Dimension | Iterations | Frontier node | Status |
|-----------|------------|---------------|--------|
| correctness | 1, 2 | F-1-002, F-1-005 | covered |
| security | 3, 4 | F-1-002, F-1-005 | covered |
| traceability | 5, 6 | F-1-002, F-1-005 | covered |
| maintainability | 7, 8 | F-1-002, F-1-005 | covered |

Frontier: 2 nodes, 2 answered, 0 open, 0 blocked, 0 pruned. Depth-1 budget 7 of 8 spent.

### Search Ledger

| ID | Iteration | Dimension | Bug class | Disposition | Finding |
|----|-----------|-----------|-----------|-------------|---------|
| SL-001 | 1 | correctness | read_write_hazard | finding | R1-P1-001 |
| SL-002 | 1 | correctness | wrong_subject_token | finding | R1-P2-001 |
| SL-003 | 1 | correctness | asymmetric_guard | finding | R1-P2-002 |
| SL-004 | 1 | correctness | missing_gate | finding | R1-P2-003 |
| SL-005 | 2 | correctness | doc_code_drift | finding | R2-P2-001 |
| SL-006 | 2 | correctness | inconsistent_count | finding | R2-P2-002 |
| SL-007 | 2 | correctness | stale_measurement | ruled_out | - |
| SL-008 | 3 | security | secret_exposure | finding | R3-P2-001 |
| SL-009 | 3 | security | env_leak | ruled_out | - |
| SL-010 | 3 | security | resource_exhaustion | ruled_out | - |
| SL-011 | 3 | security | race_condition | ruled_out | - |
| SL-012 | 4 | security | prompt_injection | ruled_out | - |
| SL-013 | 4 | security | information_disclosure | ruled_out | - |
| SL-014 | 4 | security | diagnostic_misdescription | finding | R4-P2-001 |
| SL-015 | 4 | security | untrusted_input | ruled_out | - |
| SL-016 | 5 | traceability | unchecked_test | ruled_out | - |
| SL-017 | 5 | traceability | overstated_evidence | finding | R5-P2-001 |
| SL-018 | 5 | traceability | stale_citation | ruled_out | - |
| SL-019 | 6 | traceability | stale_measurement | finding | R6-P2-001 |
| SL-020 | 6 | traceability | unsupported_claim | ruled_out | - |
| SL-021 | 6 | traceability | contradictory_doc | ruled_out | - |
| SL-022 | 7 | maintainability | misleading_name | finding | R7-P2-001 |
| SL-023 | 7 | maintainability | implicit_invariant | ruled_out | - |
| SL-024 | 7 | maintainability | dead_code | ruled_out | - |
| SL-025 | 8 | maintainability | duplicated_claim | finding | R8-P2-001 |
| SL-026 | 8 | maintainability | index_drift | ruled_out | - |
| SL-027 | 8 | maintainability | broken_reference | ruled_out | - |
| SL-028 | 8 | maintainability | stale_measurement | ruled_out | - |

Search debt: 0. Corruption warnings: 0.

### Convergence Trace

| Signal | Value | Threshold | Passed |
|--------|-------|-----------|--------|
| dimensionCoverage | 1.0 | 0.8 | yes |
| findingStability | 1.0 | 0.7 | yes |
| p0ResolutionRate | 1.0 | 0.9 | yes |
| evidenceDensity | 1.0 | 1.0 | yes |
| hotspotSaturation | 1.0 | 0.6 | yes |

Weighted score 1.0. Decision `STOP_ALLOWED` at iteration 8.

### Artifacts

- `iterations/iteration-001.md` through `iterations/iteration-008.md`
- `deltas/iter-001.jsonl` through `deltas/iter-008.jsonl`
- `deep-review-state.jsonl` (gateway projection, 9 ledger rows)
- `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`
- `review-report.md` (this file)

### Planning Packet

| Field | Value |
|-------|-------|
| Verdict | CONDITIONAL |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 11 |
| Blocking finding | R1-P1-001 |
| Promotion gate | blocked by active P1 |
| Dimension coverage | 1.0 (4 of 4) |
| Frontier | 2 of 2 answered |
| Search debt | 0 |
| Release readiness | in-progress |
| Next command | `/speckit:plan` |
| First workstream | W1, restore the read-only contract on the recommend path |
