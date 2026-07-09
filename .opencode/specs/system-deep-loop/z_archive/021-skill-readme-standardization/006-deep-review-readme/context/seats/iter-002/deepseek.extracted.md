Let me read all the relevant files in parallel.
Now let me read all reference files and assets in parallel.
Now let me read the key reference files that define convergence, signals, outputs, etc.
Now let me read the remaining key reference files and the YAML contract.
Now I have all the data needed. Here is the verification report.

---

# deep-review README Verification Report

## 1. EXACT INVOCATION

The canonical invocation is documented at `.opencode/skills/deep-review/SKILL.md:59` and `.opencode/skills/deep-review/references/protocol/quick_reference.md:29-31`:

- `/deep:start-review-loop:auto "target"` — autonomous, no approval gates
- `/deep:start-review-loop:confirm "target"` — with approval gates at each iteration
- `/deep:start-review-loop "target"` — mode-choosing variant (quick_reference.md only)

SKILL.md `argument-hint` (line 5): `[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]`

Additional parameters from quick_reference.md: `--spec-folder`, `--severity-threshold`. The README §5 adds `--dims`, `--no-resource-map`, and `--executor`.

**The command** (`/deep:start-review-loop`) is owned by the YAML workflow files at:
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`

**What it writes:**

All artifacts land under the target spec folder's `review/` directory (resolved via `resolveArtifactRoot(specFolder, 'review')` from `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` as cited at SKILL.md:63). The output files are:

| File | Source |
|---|---|
| `deep-review-config.json` | `.opencode/skills/deep-review/references/protocol/loop_protocol.md:113` |
| `deep-review-state.jsonl` | loop_protocol.md:115 |
| `deep-review-findings-registry.json` | loop_protocol.md:117 |
| `deep-review-strategy.md` | loop_protocol.md:119 |
| `deep-review-dashboard.md` | loop_protocol.md:379 |
| `.deep-review-pause` | loop_protocol.md:204 |
| `review-report.md` (9 core sections) | loop_protocol.md:475-489 |
| `resource-map.md` | `.opencode/skills/deep-review/references/convergence/convergence.md:31` |
| `iterations/iteration-NNN.md` | loop_protocol.md:334 |

---

## 2. CAPABILITY ROSTER

### Convergence Model

Defined in `.opencode/skills/deep-review/references/convergence/convergence.md:40-50` and `.opencode/skills/deep-review/assets/review_mode_contract.yaml:121-145`.

**Three-signal composite vote** with weights:

| Signal | Weight | Source |
|---|---|---|
| Rolling Average (severity-weighted) | 0.30 | convergence.md:210 |
| MAD Noise Floor | 0.25 | convergence.md:210 |
| Dimension Coverage | 0.45 | convergence.md:210 |

Stop requires weighted score ≥ `compositeStopScore` (default **0.60**), followed by the legal-stop gate bundle.

**Key defaults** (convergence.md §1 and yaml `convergence.defaults`):
- `maxIterations`: 7
- `convergenceThreshold`: **0.10**
- `rollingStopThreshold`: 0.08
- `noProgressThreshold`: 0.05
- `stuckThreshold`: **2**
- `minStabilizationPasses`: 1
- `compositeStopScore`: 0.60

**Sibling threshold contrast** (convergence.md:57-63 and convergence_signals.md:64-71):

| Skill | Default Threshold | Signal |
|---|---|---|
| `deep-review` | **0.10** | severity-weighted P0/P1/P2 ratio |
| `deep-research` | **0.05** | newInfoRatio (negative-knowledge emphasis) |
| `deep-ai-council` (proposed) | **0.20** | adjudicator-verdict stability |

The convergence_signals.md table for deep-ai-council says "Council-specific, not interchangeable" (no numeric default), while convergence.md says "(proposed) 0.20". This is consistent — the proposed value exists in the spec but is not a live runtime default.

### Severity Model (P0/P1/P2)

From `.opencode/skills/deep-review/assets/review_mode_contract.yaml:67-79` and SKILL.md:334-339, `.opencode/skills/deep-review/references/convergence/convergence.md:367-368`:

| Severity | Weight | Criteria |
|---|---|---|
| **P0** (Blocker) | 10.0 | Correctness failure, security vulnerability, spec contradiction. **Blocks PASS** |
| **P1** (Required) | 5.0 | Degraded behavior, incomplete implementation, missing validation. **Triggers CONDITIONAL** |
| **P2** (Suggestion) | 1.0 | Style, naming, minor improvements, documentation gaps. **PASS with advisories** |

**P0 override rule** (convergence.md:390-398): Any new P0 sets `newFindingsRatio >= 0.50`, forcing at least one more iteration regardless of other signals.

**Adversarial self-check**: Every P0 finding runs a Hunter/Skeptic/Referee re-read before entering the active findings registry (SKILL.md:452, convergence.md:69).

### Iteration / Fresh-Context Mechanism

Each `@deep-review` agent dispatch gets a fresh context window. State continuity is file-based, not in-memory (SKILL.md:312-313, loop_protocol.md:47-48). The LEAF agent reads `deep-review-state.jsonl`, `deep-review-findings-registry.json`, and `deep-review-strategy.md` at the start of each iteration, writes findings to `iteration-NNN.md`, updates strategy, and appends JSONL.

### Review Modes

Two operating modes (`:auto` and `:confirm`) — SKILL.md:59, quick_reference.md:27-28.

Three lifecycle modes (`new`, `resume`, `restart`) with two deferred (`fork`, `completed-continue`) — loop_protocol.md:570-578, review_mode_contract.yaml:147-159.

### Review Dimensions

From `.opencode/skills/deep-review/assets/review_mode_contract.yaml:44-64` and SKILL.md:320-327:

| Priority | Dimension | Required for Coverage |
|---|---|---|
| 1 | Correctness | Yes |
| 2 | Security | Yes |
| 3 | Traceability | No |
| 4 | Maintainability | No |

**Target types**: `spec-folder`, `skill`, `agent`, `track`, `files` (review_mode_contract.yaml:21-40).

### Fan-Out Support

SKILL.md:56: "COMMAND-DRIVEN FAN-OUT IS SUPPORTED: use `--executor`/`--executors`/`--concurrency` flags." The YAML workflow's `step_fanout_spawn` owns multi-lineage dispatch; `fanout-merge.cjs` applies strongest-restriction merging. Intra-lineage wave orchestration remains deferred.

### Verdicts

From review_mode_contract.yaml:82-95:

| Verdict | Condition | Next Command |
|---|---|---|
| **FAIL** | `activeP0 > 0` OR any required quality gate fails | `/speckit:plan` |
| **CONDITIONAL** | `activeP0 == 0 AND activeP1 > 0` | `/speckit:plan` |
| **PASS** | `activeP0 == 0 AND activeP1 == 0` | `/create:changelog` |

PASS with `hasAdvisories: true` when `activeP2 > 0`.

---

## 3. KEY FILES

| File Path | Role |
|---|---|
| `SKILL.md` | Runtime instructions, smart router, invocation protocol, rules |
| `README.md` | Human-readable overview, quick start, feature reference, FAQ |
| `graph-metadata.json` | Skill graph metadata |
| **references/protocol/** | |
| `references/protocol/loop_protocol.md` | 4-phase lifecycle (init, iteration, synthesis, save), auto-resume, pause/resume, executor selection contract |
| `references/protocol/loop_state_and_gates.md` | State transitions, error handling, binary quality gates |
| `references/protocol/quick_reference.md` | One-page operator cheat sheet |
| **references/convergence/** | |
| `references/convergence/convergence.md` | Stop algorithms, signal math, severity weights, legal-stop gate bundle (9 gates), blocked-stop event, P0 override, stuck detection, composite convergence, threshold semantics |
| `references/convergence/convergence_signals.md` | Focused STOP signals, P0 override, legal-stop summary, sibling contrast table |
| `references/convergence/convergence_recovery.md` | Stuck recovery strategies, convergence report format, graph-aware convergence |
| **references/state/** | |
| `references/state/state_format.md` | Schemas for config, JSONL, strategy, findings registry, iteration files, review report, dashboard, claim adjudication |
| `references/state/state_jsonl.md` | JSONL record schemas + Review Depth Schema v2 |
| `references/state/state_outputs.md` | Packet files, iteration markdown, dashboard, final report, resource-map behavior |
| `references/state/state_reducer_registry.md` | Reducer ownership, registry semantics, fail-closed behavior, reconstruction, two-tier content-hash dedup |
| **assets/** | |
| `assets/review_mode_contract.yaml` | Single source of truth: dimensions, severities, verdicts, quality gates, convergence, lifecycle modes, cross-reference protocols, output contracts, validation |
| `assets/deep_review_config.json` | Default config shape template |
| `assets/deep_review_dashboard.md` | Dashboard template |
| `assets/deep_review_strategy.md` | Strategy template |
| `assets/prompt_pack_iteration.md.tmpl` | Iteration prompt template (rendered by prompt-pack.ts) |
| `assets/runtime_capabilities.json` | Per-runtime capability matrix |
| **scripts/** | |
| `scripts/reduce-state.cjs` | State reducer (registry, dashboard, strategy) — single state writer |
| `scripts/runtime-capabilities.cjs` | Runtime capability detection |
| `scripts/README.md` | Script documentation |
| `scripts/tests/fixtures/blocked-stop-session/` | Reducer fixtures (7 files: config, jsonl, strategy, dashboard, findings-registry, 3 iteration files, README) |
| **feature_catalog/** | 28 markdown files (1 root catalog + 27 feature files across 4 categories: 01--loop-lifecycle (9), 02--state-management (7), 03--review-dimensions (4), 04--severity-system (7)) |
| **manual_testing_playbook/** | 45 test scenarios across 8 categories + root catalog (manual_testing_playbook.md) |
| **changelog/** | 16 per-release changelogs (v1.0.0.0 through v1.11.0.0) |

---

## 4. CONVERGENCE & OUTPUTS

### How the Loop Decides It Is Done

Per `.opencode/skills/deep-review/references/convergence/convergence.md:136-145`, checks are evaluated in priority order (first match wins):

1. **Max iterations** — hard cap (default 7). Stop unconditionally with `stopReason: maxIterationsReached`.
2. **All dimensions covered + clean** — all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed → `stopReason: converged`.
3. **Stuck detection** — 2+ consecutive no-progress iterations (using `noProgressThreshold: 0.05`) → `STUCK_RECOVERY`.
4. **Composite convergence** — 3-signal weighted vote with threshold 0.60. If score ≥ 0.60, proceed to gate evaluation.
5. **Legal-stop gate bundle** — 9 gates must all pass. Any gate failure → `blocked_stop` event written, loop continues.
6. **Default CONTINUE** — none triggered.

The 9 legal-stop gates (convergence.md:410-420): `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate` (v2 rollout), `graphlessFallbackGate` (v2 rollout).

### What It Produces

| Artifact | Path | Description |
|---|---|---|
| **Review report** | `{spec_folder}/review/review-report.md` | 9 core sections (Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix) + conditional Resource Map Coverage Gate (when resource_map_present=true). Source: loop_protocol.md:475-489, state_format.md:339-369, review_mode_contract.yaml:268-277 |
| **Findings registry** | `deep-review-findings-registry.json` | Reducer-owned; active, resolved, repeated findings with severity and dimension coverage. Source: loop_protocol.md:117 |
| **Dashboard** | `deep-review-dashboard.md` | Auto-generated after each iteration: status, findings summary, progress table, coverage, trend, active risks. Source: loop_protocol.md:379-395 |
| **Resource map** | `resource-map.md` | Emitted at convergence from delta evidence unless `--no-resource-map`. Source: convergence.md:31 |
| **Convergence report** | embedded in `review-report.md` | Records stop reason, verdict, iteration count, dimension coverage, P0/P1/P2 counts, convergence score, gate results. Source: convergence_recovery.md |

---

## 5. TROUBLESHOOTING & FAQ

### Failure Modes

From `.opencode/skills/deep-review/references/protocol/loop_protocol.md:729-737`, `.opencode/skills/deep-review/references/convergence/convergence.md:177-200`, SKILL.md:408-414:

| Failure Mode | Detection | Recovery |
|---|---|---|
| **Same dimension stuck** | Last 2 iterations same dimension with ratios < 0.05 | Change granularity (zoom in/out) |
| **Traceability plateau** | Required protocols partial while ratios < 0.05 | Protocol-first replay against conflicting artifacts |
| **Low-value advisory churn** | Last 2 iterations found only P2 | Escalate severity review, search for P0/P1 |
| **3+ consecutive timeouts** | Infrastructure issue | Pause loop, report to user |
| **State file corruption** | Cannot reconstruct iteration history | Recovery cascade (JSONL→iteration files→config→error) |
| **All dimensions covered with P0 remaining** | Active P0 findings survive adversarial check | Human sign-off required |
| **All recovery tiers exhausted** | No automatic recovery path | Escalate |
| **Missing iteration file** | `iteration_file_missing` | Conflict event → 3 consecutive → stuck_recovery |
| **JSONL corruption** | `reduce-state.cjs` detects malformed lines | Pass `--lenient`, or repair lines |

### Likely User Questions

**Q: What is the difference between deep-review and sk-code-review?**
A: `deep-review` runs multi-iteration loop until convergence, with severity-weighted voting, adversarial P0 self-check, dimension coverage gates, and a PASS/CONDITIONAL/FAIL verdict with 9-section report. `sk-code-review` is single-pass. (Source: SKILL.md:37-38, README §3.3)

**Q: What triggers the P0 override?**
A: Any new P0 finding sets `newFindingsRatio >= 0.50` regardless of other signals, forcing at least one more iteration. This is a hard convergence guard that cannot be suppressed. (Source: convergence.md:390-398)

**Q: How do I pause a running autonomous review?**
A: Create `{spec_folder}/review/.deep-review-pause`. The orchestrator checks between iterations, halts cleanly, and logs a `userPaused` event. Delete the file to resume. (Source: loop_protocol.md:200-216)

**Q: What happens after a FAIL verdict?**
A: Release is blocked. Run `/speckit:plan` to create a remediation plan from the findings in `review-report.md`, implement fixes, then re-run `deep-review`. The re-run uses auto-resume from prior state. (Source: convergence.md:535-541)

**Q: How do I extend the review after convergence?**
A: Raise `--max-iterations` above completed iteration count and re-invoke. Auto-resume detects existing JSONL state and continues without repeating prior iterations. (Source: README §8)

---

## 6. STALE FACTS IN CURRENT README

| # | README Claim | README Location | Actual (source) | Discrepancy |
|---|---|---|---|---|
| 1 | **Version: 1.11.0.0** | README.md:39 | **1.10.2.0** (SKILL.md:6) | README out of date |
| 2 | **Stuck recovery threshold: 3 consecutive no-progress iterations** | README.md:48 | **2** (convergence.md:48, yaml convergence.defaults.stuckThreshold: 2, state_format.md:73) | README says 3; all source files say 2 |
| 3 | **State files per packet: 7 primary** | README.md:49 | **8** (state_format.md:14-25 lists 8 files: config, state, registry, strategy, dashboard, pause, report, iterations; plus resource-map.md makes 9. quick_reference.md §4 also shows 8 entries.) | README says 7; actual count is 8-9 |
| 4 | **Tool budget per iteration: 9 to 12 (max 13)** | README.md:50 | **8-11 (max 12)** (SKILL.md:403, loop_protocol.md:289) | README overshoots by 1 |
| 5 | **Feature catalog: 21 markdown files across 4 categories** | README.md:210 | **28 files** (actual glob: 1 root catalog + 9 loop-lifecycle + 7 state-management + 4 review-dimensions + 7 severity-system = **28**. The feature_catalog.md header counts 9+7+4+7=**27** features.) | README says 21; actual is 28 |
| 6 | **Twenty features grouped by the four catalog categories** (feature reference text) | README.md:137 | 27 features (feature_catalog.md §1 count: 9+7+4+7) | README says 20; actual is 27 |
| 7 | **Quality gates: 3 binary (evidence, scope, coverage) + claim-adjudication gate** | README.md:44 | The **3 binary gates** (evidence, scope, coverage) are from the YAML contract (review_mode_contract.yaml:98-118). The **legal-stop gate bundle** has **9 gates** (convergence.md:410-420). The README omits the 5 additional gates: evidenceDensity, hotspotSaturation, fixCompletenessReplay, candidateCoverage (v2), graphlessFallback (v2). | README claims 4 (3+1); the legal-stop bundle has 9 |
| 8 | The README §4.2 "Skill Package" directory tree shows `convergence/` with 3 files. The §8 "Related Documents" table also lists 3 convergence files. | README.md:191-194, 414-416 | All 3 files exist and are properly cited. | No factual error here, but the §7 troubleshooting "Stuck recovery threshold" rows contradict convergence.md:48 |
| 9 | README "Configuration §5 Default Configuration" table shows `Rolling stop threshold: 0.08` and `No-progress threshold: 0.05` — these are correct per convergence.md:46-47. However, it shows `Stuck threshold: 2 consecutive no-progress iterations`, contradicting the Key Statistics table on line 48 which says **3**. | README.md:269-270 vs README.md:48 | convergence.md:48 = 2 | Internal inconsistency within README: §5 says 2 (correct), §1 says 3 (stale) |
| 10 | README says `@deep-review` agent tools include "Edit (state files only)" — | README implied via SKILL.md | SKILL.md `allowed-tools` line 4 lists `Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query`. Loop_protocol.md:290 says `Edit (state files only)`. | Consistent, no staleness. |

### Summary

**6 stale facts found** in the current README:
1. Version claims 1.11.0.0; SKILL.md frontmatter is 1.10.2.0
2. Stuck threshold claims 3; all source files (convergence.md, state_format.md, yaml) say 2
3. State files per packet claims 7; actual count is 8-9
4. Tool budget claims 9-12 (max 13); SKILL.md/loop_protocol.md say 8-11 (max 12)
5. Feature catalog count claims 21 markdown files; actual glob shows 28 files / 27 features
6. Feature reference claims 20 features; actual catalog counts 27

Additionally, one **internal inconsistency** within the README: §5 Configuration table correctly lists stuck threshold as 2, but §1 Key Statistics table lists it as 3. The legal-stop gate bundle description (claiming 4 gates) is incomplete — the actual bundle has 9 gates per convergence.md §6.