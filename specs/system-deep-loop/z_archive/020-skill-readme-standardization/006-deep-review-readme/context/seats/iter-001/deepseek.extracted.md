Now let me verify a few remaining details for the stale-facts analysis.
Here is the factual map:

---

# Factual Map: deep-review README Rewrite

## 1. PURPOSE

`deep-review` is an autonomous, multi-iteration code-review loop that dispatches LEAF agents with fresh context per iteration, externalizes all state to disk, and converges on a severitarian PASS/CONDITIONAL/FAIL release-readiness verdict.

## 2. PROBLEM

Single-pass code review inside a single conversation window degrades as the session ages: accumulating findings bias later assessments, severity drift goes undetected, and critical cross-dimension gaps (e.g., a traceability issue that slips past a correctness pass) remain invisible until after shipping. Reviewers operating under time pressure routinely classify P0 correctness flaws as P2 style nits because no structured adversarial check forces re-verification. The deep-review loop eliminates all three failure modes by giving every iteration a blank context window, writing every finding to append-only on-disk logs, requiring a Hunter/Skeptic/Referee adversarial replay on every P0, and refusing to stop until three independent convergence signals agree across four review dimensions.

## 3. MODES & CAPABILITIES

- **Iterative review loop:** dispatches one `@deep-review` LEAF agent per iteration, each focusing on one of four dimensions (Correctness, Security, Traceability/Spec-Alignment, Completeness/Maintainability).
- **Externalized state:** all state lives in `{spec_folder}/review/` on disk — an immutable config, append-only JSONL log, mutable strategy, reducer-owned registry and dashboard, per-iteration markdown — so fork, resume, and forensic replay work without in-memory context.
- **Convergence detection:** a three-signal weighted vote (severity-weighted `newFindingsRatio`, rolling stop average, dimension coverage) plus a P0 override that forces at least one more iteration on any new P0; STOP is legal only when all three vote together AND all binary quality gates pass.
- **Fresh context per pass:** every agent dispatch gets a clean context window — no bias leakage from prior iterations — because continuity is carried by files, not conversation memory.
- **P0/P1/P2 severity-weighted findings:** every finding carries a severity level (P0=10.0, P1=5.0, P2=1.0 weight), `file:line` evidence, category, content-hash, and claim-adjudication packet; verdict logic is severitarian (any P0 → FAIL, any P1 → CONDITIONAL, P2-only → PASS with advisories).
- **Two operating modes:** `:auto` for unattended/overnight audits; `:confirm` for interactive audits with operator approval gates between iterations.
- **Fan-out (command-driven):** `--executor`/`--executors`/`--concurrency` flags on `/deep:start-review-loop` support multi-lineage dispatch via the YAML workflow's `step_fanout_spawn` plus `fanout-merge.cjs` (strongest-restriction merge). Ad-hoc shell fan-out is forbidden.

## 4. INVOCATION

**Command:** `/deep:start-review-loop` with a mode suffix and target argument:

```
/deep:start-review-loop:auto "skill deep-review"
/deep:start-review-loop:confirm "<spec-folder>"
/deep:start-review-loop:auto "track skilled-agent-orchestration"
```

**Key flags:** `--max-iterations=N` (default 7), `--convergence=N` (default 0.10), `--spec-folder=<path>`, `--dims=<subset>`, `--no-resource-map`, `--executor=<cli>`.

**Artifacts written** (under `{spec_folder}/review/`):
- `deep-review-config.json` — immutable after init
- `deep-review-state.jsonl` — append-only structured iteration log
- `deep-review-findings-registry.json` — reducer-owned canonical findings
- `deep-review-strategy.md` — mutable review brain
- `deep-review-dashboard.md` — auto-generated after each iteration
- `review-report.md` — 9-section synthesized report with verdict
- `resource-map.md` — emitted at convergence (unless `--no-resource-map`)
- `iterations/iteration-NNN.md` — write-once per-iteration narrative
- `.deep-review-pause` — operator sentinel

**YAML workflow files:** `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` and `deep_start-review-loop_confirm.yaml`.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime instructions, smart router, when-to-use, convergence contract, integration points |
| `README.md` | Human-facing overview, quick start, feature catalog, troubleshooting, FAQ |
| `references/protocol/quick_reference.md` | One-page operator cheat sheet (ALWAYS loaded) |
| `references/protocol/loop_protocol.md` | 4-phase lifecycle, executor selection contract, lineage modes, failure modes |
| `references/protocol/loop_state_and_gates.md` | State transitions, error handling, quality gates |
| `references/convergence/convergence.md` | Stop algorithms, composite math, legal-stop gates, security-sensitive overrides, threshold semantics |
| `references/convergence/convergence_signals.md` | Focused STOP signals, P0 override, legal-stop summary |
| `references/convergence/convergence_recovery.md` | Stuck recovery, convergence report, graph-aware convergence |
| `references/state/state_format.md` | Canonical schemas for config, JSONL, registry, strategy, dashboard, report |
| `references/state/state_jsonl.md` | JSONL record schemas + Review Depth Schema v2 |
| `references/state/state_outputs.md` | Packet outputs, iteration markdown, dashboard, final report, resource-map behavior |
| `references/state/state_reducer_registry.md` | Reducer ownership, registry semantics, fail-closed behavior, two-tier content-hash dedup |
| `assets/deep_review_config.json` | Default config shape (immutable after init) |
| `assets/deep_review_dashboard.md` | Dashboard template |
| `assets/deep_review_strategy.md` | Strategy template |
| `assets/prompt_pack_iteration.md.tmpl` | Iteration prompt template (rendered by prompt-pack.ts) |
| `assets/review_mode_contract.yaml` | Dimensions, severities, verdicts, gates, protocols |
| `assets/runtime_capabilities.json` | Per-runtime capability matrix |
| `scripts/reduce-state.cjs` | State reducer (findings registry, dashboard, strategy); fail-closed on JSONL corruption |
| `scripts/runtime-capabilities.cjs` | Runtime capability detection |
| `scripts/README.md` | Code-facing README for the scripts folder |
| `scripts/tests/fixtures/` | Reducer test fixtures (blocked-stop session) |
| `feature_catalog/` | 28 .md files across 4 category subdirectories + root `feature_catalog.md` |
| `manual_testing_playbook/` | 9 category directories + root `manual_testing_playbook.md` |
| `changelog/` | 16 per-release changelogs (`v1.0.0.0.md` through `v1.11.0.0.md`) |
| `graph-metadata.json` | Skill graph metadata (edges, dependencies, intent signals) |

## 6. BOUNDARIES

**What `deep-review` does NOT own:**

| Scope | Owned By |
|---|---|
| Executor infrastructure, state schema, coverage-graph runtime | `deep-loop-runtime` (post-118 FULL_ISOLATE_NO_MCP split from `system-spec-kit/mcp_server/`) |
| Single-pass code review | `sk-code-review` |
| Autonomous investigation/research loops | `deep-research` (sibling loop; differs in convergence signal — `newInfoRatio` with negative-knowledge emphasis vs. severity-weighted `newFindingsRatio`) |
| Multi-seat AI council planning | `deep-ai-council` (sibling loop; differs in convergence threshold — 0.20 vs. 0.10) |
| Codebase context gathering before planning | `deep-context` |
| Spec-folder command state, continuity saves, `/speckit:resume` | `system-spec-kit` |
| Implementation / remediation | `sk-code` and `/speckit:implement` |
| External resource fetching | FORBIDDEN: review is code-only. No WebFetch tool is in the skill's `allowed-tools`. |

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**

1. **Loop stuck on one dimension:** strategy `next-focus` not advancing after dimension completion. Check `deep-review-strategy.md`; manually update `completed-dimensions` if confirmation already exists.
2. **P0 findings keep blocking convergence:** real P0s surviving adversarial check, or misclassified P1s elevated to P0. Read the iteration file's Hunter/Skeptic/Referee output and downgrade severity in the JSONL entry if misclassified.
3. **`review-report.md` missing sections:** synthesis interrupted before all 9 sections wrote. Re-run synthesis manually; JSONL state is intact.
4. **Reducer refuses to write derived state:** JSONL corruption detected by `reduce-state.cjs`. Repair the corrupt JSONL line, or re-run with `--lenient` to skip it.
5. **Loop runs to max iterations without converging:** threshold too tight or genuine structural issues. Raise `--convergence` to 0.15 and re-run with auto-resume.
6. **Agent attempts sub-agent dispatch:** LEAF constraint violated; `@deep-review` must forbid the Task tool. Reload the runtime mirror file.

**Common questions:**

1. **How is this different from `sk-code-review`?** `sk-code-review` is single-pass; `deep-review` runs multiple iterations until convergence, tracks dimension coverage, runs adversarial self-checks on P0s, and produces a structured 9-section report with a three-way verdict.
2. **Does the review modify target code?** No. The agent is strictly read-only. All writes go to `{spec_folder}/review/`.
3. **What happens after a FAIL verdict?** Release is blocked. Run `/speckit:plan` to create a remediation plan from `review-report.md`, implement fixes, then re-run `deep-review` (auto-resume detects existing state).
4. **Can I pause a running review?** Yes — create `{spec_folder}/review/.deep-review-pause`; delete to resume.

## 8. STALE FACTS

| # | Claim in README.md | Actual (from real files) |
|---|---|---|
| 1 | **Version: 1.11.0.0** (§1 Key Statistics) | `SKILL.md` frontmatter says **`version: 1.10.2.0`**. A changelog file `changelog/v1.11.0.0.md` exists but the SKILL.md version was not bumped. |
| 2 | **Feature catalog: "21 markdown files across 4 categories"** (§4 Structure tree comment) | Actual count is **28 markdown files** (9 in `01--loop-lifecycle/`, 7 in `02--state-management/`, 4 in `03--review-dimensions/`, 7 in `04--severity-system/`, plus the root `feature_catalog.md`). |
| 3 | **Manual testing playbook: "45 deterministic test scenarios across 8 categories"** (§4 Structure) | Actual is **9 category directories**: `01--entry-points-and-modes/` through `08--review-depth-v2-rollout/` plus `09--fanout/`. Exact scenario-file count is higher than 45 (UNKNOWN precise number without full enumeration). |
| 4 | **State files per packet: "7 primary"** (§1 Key Statistics) | The actual state tree (§4 Review Runtime State) lists **8 primary files**: config, state.jsonl, findings-registry.json, strategy.md, dashboard.md, .deep-review-pause, review-report.md, resource-map.md. |
| 5 | **Tool budget per iteration: "9 to 12 (max 13)"** (§1 Key Statistics and §5 Default Configuration) | `SKILL.md` §4 ALWAYS rule 3 says **"Target 8-11 tool calls per iteration (max 12)."** The config file `assets/deep_review_config.json` has `"maxToolCallsPerIteration": 12`. |
| 6 | **Stuck recovery threshold: "3 consecutive no-progress iterations"** (§1 Key Statistics) vs. **"2 consecutive no-progress iterations"** (§5 Default Configuration table) | Config file `assets/deep_review_config.json` has `"stuckThreshold": 2`. `SKILL.md` §4 ESCALATE says **"3+ consecutive timeouts."** The README is internally inconsistent (key stats says 3, config table says 2). The canonical source `deep_review_config.json` says 2. |
| 7 | **Quality gates: "3 binary (evidence, scope, coverage) + claim-adjudication gate"** (§1 Key Statistics) | `SKILL.md` §6 Quality Gates lists **8 distinct binary quality gates**: Config validity, Strategy initialization, State consistency, Iteration completeness, Severity coverage, Adversarial replay, Coverage threshold, Security-sensitive override. |
| 8 | **Feature count in tables: 20 features shown** (§3.2 — 6+5+4+5) but the actual `feature_catalog/` subdirectories contain **27 feature markdown files** (9+7+4+7), with entries like `executor-selection-contract.md`, `fanout-dispatch.md`, `graph-convergence-event.md`, `pause-sentinel.md`, `security-sensitive-fix-overrides.md`, `convergence-signals.md`, `resource-map-coverage-gate.md` that have no corresponding row in the README tables. |