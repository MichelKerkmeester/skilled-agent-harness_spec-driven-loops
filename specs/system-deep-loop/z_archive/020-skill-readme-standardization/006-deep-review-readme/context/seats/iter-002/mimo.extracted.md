Here is the verified report.

---

# Deep-Review Skill: Fact Verification Report

## 1. EXACT INVOCATION

**Command:** `/deep:start-review-loop:auto` or `/deep:start-review-loop:confirm` — the sole legal invocation surface. (`SKILL.md:59`, `references/protocol/quick_reference.md:29-31`)

**Argument hint:** `[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]` (`SKILL.md:5`)

**Additional flags documented:**
- `--spec-folder` (auto-detected default) — `README.md:257`
- `--dims` (comma-separated subset of 4 dimensions) — `README.md:258`
- `--no-resource-map` — disable convergence-time `resource-map.md` emission — `README.md:259`
- `--executor` / `--executors` / `--concurrency` — fan-out flags — `SKILL.md:56`

**Target examples** (from `README.md:86-93`):
- `/deep:start-review-loop:auto "skill deep-review"`
- `/deep:start-review-loop:confirm "<spec-folder>"`
- `/deep:start-review-loop:auto "track skilled-agent-orchestration"`

**What it writes:**
- `{spec_folder}/review/` packet: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `.deep-review-pause`, `resource-map.md`, `review-report.md`, `iterations/iteration-NNN.md` — `SKILL.md:308`, `references/state/state_format.md:16-26`

**Workflow YAMLs:**
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` — `references/protocol/loop_protocol.md:54`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` — `references/protocol/loop_protocol.md:55`

---

## 2. CAPABILITY ROSTER

**Convergence model:** Three-signal weighted vote. Signals and weights: Rolling Average (0.30), MAD Noise Floor (0.25), Dimension Coverage (0.45). Composite stop-score threshold: `0.60`. (`references/convergence/convergence.md:206-258`)

**Default convergence threshold:** `0.10` (severity-weighted `newFindingsRatio`) — `references/convergence/convergence.md:45`, `review_mode_contract.yaml:124`

**Sibling-parity thresholds** (`references/convergence/convergence.md:56-64`):

| Skill | Default | Signal |
|---|---|---|
| `deep-review` | 0.10 | severity-weighted P0/P1/P2 ratio |
| `deep-research` | 0.05 | newInfoRatio (negative-knowledge emphasis) |
| `deep-ai-council` (proposed) | 0.20 | adjudicator-verdict stability |

**P0/P1/P2 severity model** (`SKILL.md:335-339`, `review_mode_contract.yaml:67-79`):

| Severity | Weight | Criteria | Blocking |
|---|---|---|---|
| P0 (Blocker) | 10.0 | Correctness failure, security vulnerability, spec contradiction | Yes |
| P1 (Required) | 5.0 | Degraded behavior, incomplete implementation, missing validation | Conditional |
| P2 (Suggestion) | 1.0 | Style, naming, minor improvements, documentation gaps | No |

**P0 Override:** Any new P0 forces `newFindingsRatio = max(calculated, 0.50)`, preventing premature convergence. (`references/convergence/convergence.md:390-400`)

**Verdicts** (`SKILL.md:344-348`, `review_mode_contract.yaml:82-95`):
- **PASS** — No P0/P1 findings (P2 permitted with `hasAdvisories: true`)
- **CONDITIONAL** — P1 findings present, P0 zero
- **FAIL** — Any P0 confirmed after adversarial self-check

**Review dimensions (4):** Correctness (priority 1), Security (priority 2), Traceability (priority 3), Maintainability (priority 4) — `review_mode_contract.yaml:44-64`

**Iteration / fresh-context mechanism:** Each iteration dispatches a LEAF `@deep-review` agent with a fresh context window. State continuity comes from files on disk (JSONL, strategy, config), not in-context memory. (`SKILL.md:311-313`)

**Legal-stop gate bundle (9 gates):** `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, `graphlessFallbackGate` — `references/convergence/convergence.md:406-420`

**Fan-out:** Command-driven fan-out IS supported via `--executor`/`--executors`/`--concurrency` flags. The command's YAML `step_fanout_spawn` owns multi-lineage dispatch; `fanout-merge.cjs` applies strongest-restriction merge (any lineage active P0 → merged FAIL). (`SKILL.md:56`)

**Lifecycle modes:** 3 active (`new`, `resume`, `restart`) + 2 reserved (`fork`, `completed-continue`) — `review_mode_contract.yaml:147-159`

**Adversarial self-check:** Hunter / Skeptic / Referee pattern on every P0 before it enters the active findings registry. (`SKILL.md:337`, `references/convergence/convergence_signals.md:39-44`)

---

## 3. KEY FILES

| Path | Role |
|---|---|
| `SKILL.md` | Runtime instructions, smart router, rules, success criteria (490 lines) |
| `README.md` | Operator-facing overview, quick start, features, structure, config, examples, troubleshooting, FAQ (474 lines) |
| `graph-metadata.json` | Skill-graph metadata (schema v2, family `deep-loop`, category `autonomous-loop`) |
| **references/protocol/** | |
| `references/protocol/loop_protocol.md` | 4-phase lifecycle, dispatch contract, executor invariants (756 lines) |
| `references/protocol/loop_state_and_gates.md` | State-transition rules, error handling, binary quality gates (156 lines) |
| `references/protocol/quick_reference.md` | One-page operator cheat sheet (220 lines) |
| **references/convergence/** | |
| `references/convergence/convergence.md` | Stop algorithms, composite math, legal-stop gates, severity-weighted ratio, sibling threshold semantics (576 lines) |
| `references/convergence/convergence_signals.md` | Focused STOP signals, P0 override, legal-stop summary (79 lines) |
| `references/convergence/convergence_recovery.md` | Stuck recovery strategies, convergence report format, graph-aware convergence (232 lines) |
| **references/state/** | |
| `references/state/state_format.md` | Config + canonical state-file schemas (535 lines) |
| `references/state/state_jsonl.md` | JSONL record schemas + Review Depth Schema v2 (454 lines) |
| `references/state/state_outputs.md` | Packet outputs, dashboard, iteration markdown, report (94 lines) |
| `references/state/state_reducer_registry.md` | Reducer ownership, registry semantics, fail-closed behavior, reconstruction (106 lines) |
| **assets/** | |
| `assets/deep_review_config.json` | Default config shape |
| `assets/deep_review_dashboard.md` | Dashboard template |
| `assets/deep_review_strategy.md` | Strategy template |
| `assets/prompt_pack_iteration.md.tmpl` | Iteration prompt template (rendered by prompt-pack.ts) |
| `assets/review_mode_contract.yaml` | Canonical contract: dimensions, severities, verdicts, gates, protocols, lifecycle modes (481 lines) |
| `assets/runtime_capabilities.json` | Per-runtime capability matrix |
| **scripts/** | |
| `scripts/reduce-state.cjs` | State reducer (registry, dashboard, strategy) |
| `scripts/runtime-capabilities.cjs` | Runtime capability detection |
| `scripts/tests/fixtures/` | Reducer fixtures (blocked-stop session) |
| **feature_catalog/** | 27 feature markdown files across 4 categories + `feature_catalog.md` index |
| **manual_testing_playbook/** | 49 deterministic test scenarios across 9 categories + `manual_testing_playbook.md` index |
| **changelog/** | 16 per-release notes (v1.0.0.0 through v1.11.0.0) |

---

## 4. CONVERGENCE & OUTPUTS

**How the loop decides it is done** (`references/convergence/convergence.md:136-145`):

Decision priority (first match wins):
1. **Max iterations** (default 7) — hard cap, always checked first
2. **All dimensions covered + clean** — all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed → `stopReason: "converged"`
3. **Stuck detection** — 2+ consecutive no-progress iterations (`stuckThreshold=2`, `noProgressThreshold=0.05`) → `stopReason: "stuckRecovery"`
4. **Composite convergence** — 3-signal weighted vote (Rolling Average 0.30, MAD Noise Floor 0.25, Dimension Coverage 0.45) with threshold 0.60
5. **Legal-stop gate bundle** — 9 gates must all pass; any failure persists `blockedStop` event and continues
6. **Default CONTINUE** — none of the above triggered

**What it produces:**
- `review-report.md` — 9 core sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix, plus conditional `## Resource Map Coverage Gate` section (`SKILL.md:440`)
- `resource-map.md` — emitted at convergence from delta evidence unless `--no-resource-map` (`SKILL.md:288`, `references/convergence/convergence.md:31`)
- `deep-review-dashboard.md` — auto-generated status with provisional verdict, findings deltas, coverage progress, trend signals (`README.md:158`)
- `deep-review-findings-registry.json` — reducer-owned active/resolved/repeated/blocked findings with severity totals (`references/state/state_reducer_registry.md:40-48`)
- `iterations/iteration-NNN.md` — write-once per-iteration detailed findings, each ending with `Review verdict: PASS|CONDITIONAL|FAIL` (`SKILL.md:351-367`)
- Release-readiness verdict: `PASS`, `CONDITIONAL`, or `FAIL` — `SKILL.md:344-348`
- Release-readiness state: `in-progress`, `converged`, or `release-blocking` — `references/convergence/convergence.md:27-29`

**Dashboard:** `deep-review-dashboard.md` — status view (not source of truth) displaying provisional verdict, findings deltas, coverage progress, trend signals, active risks. Regenerated after every iteration by the reducer. (`references/state/state_outputs.md:58-60`)

---

## 5. TROUBLESHOOTING & FAQ

### Failure Modes

| Symptom | Likely Cause | Fix | Source |
|---|---|---|---|
| Loop stuck on one dimension | Strategy `next-focus` not advancing after dimension completed | Read `deep-review-strategy.md`; if dimension shows complete, manually update `completed-dimensions` and re-run | `README.md:353` |
| P0 findings keep blocking convergence | Real P0s surviving adversarial check, or misclassified P1s elevated to P0 | Open the relevant `iteration-NNN.md`, read Hunter/Skeptic/Referee output; if misclassified, downgrade severity in JSONL and re-run convergence | `README.md:354` |
| `review-report.md` missing sections | Synthesis step interrupted before all 9 sections wrote | Re-run synthesis manually; JSONL state is intact, synthesis reads from it without re-running iterations | `README.md:355` |
| Loop runs to max iterations without converging | Convergence threshold too tight, or target has genuine structural issues | Raise `--convergence` to 0.15 and re-run with auto-resume; if findings keep appearing, target needs remediation | `README.md:356` |
| Reducer refuses to write derived state | JSONL corruption detected by `reduce-state.cjs` | Read the corruption-warning output; repair the JSONL line or re-run with `--lenient` | `README.md:359` |
| Agent attempts sub-agent dispatch | LEAF constraint violated in agent definition | Verify `@deep-review` agent definition forbids the `Task` tool | `README.md:357` |
| `resource-map.md` not produced | `--no-resource-map` was passed or `config.resource_map.emit == false` | Re-run without `--no-resource-map` or flip config flag and re-run synthesis | `README.md:360` |

### Top 5 User Questions

**Q: How is `deep-review` different from `sk-code-review`?**
A: `sk-code-review` is single-pass. `deep-review` runs multiple iterations until convergence, tracks dimension coverage, runs adversarial self-checks on P0 findings, and produces a structured nine-section `review-report.md` with a three-way verdict. (`README.md:366-368`)

**Q: Can I review individual files?**
A: Yes. Set target type to `files` and pass the explicit file list at invocation. (`README.md:370-372`)

**Q: Does the review modify the target code?**
A: No. The `@deep-review` agent is strictly read-only against the review target. It writes only to the dedicated `{spec_folder}/review/` packet. (`README.md:378-380`)

**Q: What happens after a FAIL verdict?**
A: Release is blocked. Run `/speckit:plan` to create a remediation plan from findings in `review-report.md`, implement fixes, then re-run `deep-review` to confirm resolution. (`README.md:382-384`)

**Q: Can I pause a running autonomous review?**
A: Yes. Create `{spec_folder}/review/.deep-review-pause`. The orchestrator checks for this sentinel between iterations and halts cleanly. Delete the file to continue. (`README.md:390-392`)

---

## 6. STALE FACTS IN CURRENT README

| # | README Claim | Actual Value (Source) | Discrepancy |
|---|---|---|---|
| 1 | **Version: 1.11.0.0** (`README.md:39`) | **1.10.2.0** (`SKILL.md:6`) | README is one minor version ahead of SKILL.md frontmatter |
| 2 | **Feature catalog: "21 markdown files across 4 categories"** (`README.md:210`) | **27 files** across 4 categories (9+7+4+7): `feature_catalog/01--loop-lifecycle/` (9), `02--state-management/` (7), `03--review-dimensions/` (4), `04--severity-system/` (7). Confirmed by `feature_catalog.md:16-21` | Undercount by 6 |
| 3 | **Section 3.2: "Twenty features grouped by four catalog categories"** (`README.md:137`) with tables showing Loop Lifecycle "6 features", State Management "5 features", Review Dimensions "4 features", Severity System "5 features" = 20 | Actual feature_catalog.md lists Loop Lifecycle = 9, State Management = 7, Review Dimensions = 4, Severity System = 7 = 27 | Undercount by 7; all categories except Review Dimensions are stale |
| 4 | **Quality gates: "3 binary (evidence, scope, coverage) + claim-adjudication gate"** (`README.md:44`) | **9 gates**: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, `graphlessFallbackGate` (`references/convergence/convergence.md:408-420`) | Undercount by 5; README omits 6 gates |
| 5 | **Manual testing: "45 deterministic test scenarios across 8 categories"** (`README.md:211`) | **49 scenarios across 9 categories** (`manual_testing_playbook/manual_testing_playbook.md:30`) | Undercount by 4 scenarios and 1 category |
| 6 | **Stuck recovery threshold: "3 consecutive no-progress iterations"** (`README.md:48`) | **2 consecutive** (`references/convergence/convergence.md:48,192`, `review_mode_contract.yaml:125`, `README.md:270` — the README itself says `stuckThreshold: 2` in its own Default Configuration table) | Internal contradiction within README: Key Statistics says 3, Default Configuration table says 2 |
| 7 | **Tool budget: "9 to 12 (max 13)"** (`README.md:50`) | **"8-11 tool calls per iteration (max 12)"** (`SKILL.md:393`) | Off by 1 on both range and max |
| 8 | **State files: "7 primary + per-iteration markdown"** (`README.md:49`) | **8 primary** state files listed in `references/state/state_format.md:14-26`: config, JSONL, findings-registry, strategy, dashboard, pause sentinel, review-report, + iterations directory | Undercount by 1 |
| 9 | **SKILL.md §6 lists 8 review-report sections** (`SKILL.md:440`): "Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix" but calls it "all 9 core sections" | Count: Executive Summary (1), Planning Trigger (2), Active Finding Registry (3), Remediation Workstreams (4), Spec Seed (5), Plan Seed (6), Traceability Status (7), Deferred Items (8), Audit Appendix (9) = 9. Count is correct but the list has 9 items — no actual discrepancy. Retracted. | N/A — verified correct |
| 10 | **README §3.2 Loop Lifecycle table** (`README.md:139-148`) lists 6 features but omits: `fanout-dispatch.md`, `resource-map-coverage-gate.md`, `executor-selection-contract.md` (3 missing) | Actual 01--loop-lifecycle/ directory has 9 files | 3 features unlisted in README table |
| 11 | **README §3.2 State Management table** (`README.md:150-158`) lists 5 features but omits: `graph-convergence-event.md`, `pause-sentinel.md` (2 missing) | Actual 02--state-management/ directory has 7 files | 2 features unlisted in README table |
| 12 | **README §3.2 Severity System table** (`README.md:169-177`) lists 5 features but omits: `convergence-signals.md`, `security-sensitive-fix-overrides.md` (2 missing) | Actual 04--severity-system/ directory has 7 files | 2 features unlisted in README table |

**Summary of stale facts:** 10 verified discrepancies (items 1-8, 10-12). The README is materially out of date on version, feature counts (catalog, testing), quality gate count, tool budget ranges, stuck threshold (internal contradiction), and state file count.