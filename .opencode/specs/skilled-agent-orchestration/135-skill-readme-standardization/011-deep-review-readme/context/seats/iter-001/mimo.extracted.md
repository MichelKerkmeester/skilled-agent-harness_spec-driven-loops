## 1. PURPOSE

Autonomous iterative code-review loop that runs multiple dimension-focused review passes with fresh context per iteration, externalized JSONL state, severity-weighted convergence detection (P0/P1/P2), and a PASS / CONDITIONAL / FAIL release-readiness verdict.

## 2. PROBLEM

Single-pass code review inside a long conversation degrades as context accumulates — early findings bias later ones, severity gets misclassified, and cross-reference drift goes undetected. A reviewer covering correctness, security, traceability, and maintainability in one sitting will fatigue before all dimensions get equal attention. Fresh context per iteration eliminates carry-over bias: each dispatch reads state from disk, focuses on one dimension, and exits. Convergence detection replaces human judgment about "enough review" with a mathematically gated STOP that requires all dimensions covered, severity-weighted findings stabilized, and binary quality gates passing together.

## 3. MODES & CAPABILITIES

- **Iterative multi-pass review** — loop dispatches one LEAF `@deep-review` agent per iteration, each with a fresh context window.
- **Externalized state** — all state lives on disk in `{spec_folder}/review/`: immutable config, append-only JSONL, mutable strategy, reducer-owned registry/dashboard, per-iteration markdown.
- **Convergence detection** — three-signal weighted vote (severity-weighted newFindingsRatio, rolling stop average, dimension coverage) plus binary quality gates; STOP only when all agree.
- **Fresh context per pass** — agent reads strategy/JSONL from disk, never from prior context; context is discarded after each dispatch.
- **P0/P1/P2 severity-weighted findings** — weights 10.0/5.0/1.0; P0 override forces at least one more iteration; adversarial Hunter/Skeptic/Referee self-check on every P0.
- **Four review dimensions** — Correctness (priority 1), Security (priority 2), Traceability (priority 3), Maintainability (priority 4).
- **Fan-out** — command-driven via `--executor`/`--executors`/`--concurrency` flags; `fanout-merge.cjs` applies strongest-restriction merge (any lineage active P0 → merged FAIL).
- **Auto-resume** — detects existing JSONL state on re-invocation and continues from last completed iteration.
- **Pause sentinel** — `{spec_folder}/review/.deep-review-pause` halts between iterations; delete to resume.
- **Resource-map emission** — convergence-time `resource-map.md` emitted from delta evidence (disable with `--no-resource-map`).

## 4. INVOCATION

**Trigger:** `/deep:start-review-loop` exclusively (YAML workflow owns state, dispatch, convergence).

**Modes:**
- `/deep:start-review-loop:auto "<target>"` — autonomous, no approval gates.
- `/deep:start-review-loop:confirm "<target>"` — approval gate between iterations.
- Bare `/deep:start-review-loop "<target>"` — asks which mode.

**Target argument:** spec folder path, `"skill <name>"`, `"track <name>"`, or `"files"` with explicit file list.

**Key flags:** `--max-iterations` (default 7), `--convergence` (default 0.10), `--spec-folder` (auto-detected), `--dims` (comma-separated subset), `--no-resource-map`, `--executor`/`--executors`/`--concurrency` for fan-out.

**Artifacts written to `{spec_folder}/review/`:** `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `.deep-review-pause`, `review-report.md`, `resource-map.md`, `iterations/iteration-NNN.md`.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime instructions, smart router, lifecycle rules, severity/verdict contracts |
| `README.md` | Human-facing overview, quick start, feature catalog index, structure, config, FAQ |
| `graph-metadata.json` | Skill graph metadata (family: deep-loop, edges, intent signals) |
| `references/protocol/loop_protocol.md` | 4-phase lifecycle, dispatch contract, executor invariants, config surface |
| `references/protocol/loop_state_and_gates.md` | State transitions, error handling, quality gates |
| `references/protocol/quick_reference.md` | One-page operator cheat sheet |
| `references/convergence/convergence.md` | Stop algorithms, composite math, legal-stop gates, security-sensitive overrides, threshold semantics |
| `references/convergence/convergence_signals.md` | Focused STOP signals, P0 override, legal-stop summary |
| `references/convergence/convergence_recovery.md` | Stuck recovery, convergence report, graph-aware convergence |
| `references/state/state_format.md` | Canonical schemas for config, JSONL, registry, strategy, dashboard, report |
| `references/state/state_jsonl.md` | JSONL record schemas + Review Depth Schema v2 |
| `references/state/state_outputs.md` | Packet outputs, iteration markdown, dashboard, final report |
| `references/state/state_reducer_registry.md` | Reducer ownership, registry semantics, fail-closed behavior, finding dedup |
| `assets/review_mode_contract.yaml` | Dimensions, severities, verdicts, gates, protocols |
| `assets/deep_review_config.json` | Default config shape |
| `assets/deep_review_dashboard.md` | Dashboard template |
| `assets/deep_review_strategy.md` | Strategy template |
| `assets/prompt_pack_iteration.md.tmpl` | Iteration prompt template (rendered by prompt-pack.ts) |
| `assets/runtime_capabilities.json` | Per-runtime capability matrix |
| `scripts/reduce-state.cjs` | State reducer (registry, dashboard, strategy) |
| `scripts/runtime-capabilities.cjs` | Runtime capability detection |
| `scripts/tests/fixtures/` | Reducer fixtures (blocked-stop session) |
| `feature_catalog/` | 21 markdown files across 4 categories (lifecycle, state, dimensions, severity) |
| `feature_catalog/feature_catalog.md` | Canonical 21-entry feature inventory |
| `manual_testing_playbook/` | 45 deterministic test scenarios across 8+1 (fanout) categories |
| `manual_testing_playbook/manual_testing_playbook.md` | Test playbook index |
| `changelog/` | 16 per-release notes (v1.0.0.0 through v1.11.0.0) |

## 6. BOUNDARIES

**Does NOT own:**
- **Executor, state schema, coverage-graph runtime** → owned by `deep-loop-runtime` (post-118 FULL_ISOLATE_NO_MCP split from `system-spec-kit/mcp_server/`).
- **Single-pass code review doctrine** → owned by `sk-code-review`.
- **Investigation/research loops** → owned by `deep-research` (signal is newInfoRatio over negative-knowledge emphasis, not code audit).
- **Context-gathering loops** → owned by `deep-context`.
- **Command-owned state and continuity saves** → owned by `system-spec-kit` (`generate-context.js`).
- **WebFetch** — deep-review is code-only; no external resource fetching. This differs from `deep-research` which may use WebFetch.
- **Code implementation** → owned by `sk-code`; deep-review is observation-only (read-only against target, never modifies files under review).

**Sibling skills:** `deep-research`, `deep-context`, `deep-loop-runtime`, `sk-code-review`.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- Loop stuck on one dimension — strategy `next-focus` not advancing after dimension completed.
- P0 findings keep blocking convergence — real P0s surviving adversarial check, or misclassified P1s elevated to P0.
- `review-report.md` missing sections — synthesis step interrupted before all 9 sections wrote (JSONL state is intact; re-run synthesis).
- Loop runs to max iterations without converging — convergence threshold too tight or target has genuine structural issues.
- Agent attempts sub-agent dispatch — LEAF constraint violated in agent definition.
- Reducer refuses to write derived state — JSONL corruption detected by `reduce-state.cjs`.
- `resource-map.md` not produced — `--no-resource-map` was passed or `config.resource_map.emit == false`.

**User FAQ (top questions):**
1. How is `deep-review` different from `sk-code-review`? → Multi-pass vs single-pass, dimension coverage, adversarial P0 check, verdict.
2. Can I review individual files? → Yes, set target type to `files`.
3. Does the review modify the target code? → No, strictly read-only.
4. What happens after a FAIL verdict? → Release blocked; run `/speckit:plan` for remediation.
5. Can I pause a running autonomous review? → Yes, create `.deep-review-pause` sentinel.
6. What triggers the P0 override? → Any new P0 sets `newFindingsRatio >= 0.50`, blocking convergence.

## 8. STALE FACTS

- **Version mismatch:** SKILL.md frontmatter says `version: 1.10.2.0`. README.md "Key Statistics" table says `Version | 1.11.0.0`. Changelog has both `v1.10.0.0`, `v1.10.1.0`, and `v1.11.0.0`. The SKILL.md version field appears stale relative to the README and latest changelog entry.
- **Tool budget:** SKILL.md says "Target 8-11 tool calls per iteration (max 12)". README.md says "Tool budget per iteration | 9 to 12 (max 13)". These disagree on both the floor (8 vs 9) and the max (12 vs 13).
- **Stuck threshold:** SKILL.md says "3 consecutive timeouts" as an escalation trigger. README.md Default Configuration table says "Stuck threshold | 2 consecutive no-progress iterations". These are different values referring to different signals, but the README table header "Stuck threshold" could be confused with the SKILL.md "3+ consecutive timeouts" escalation.
- **Feature catalog count:** README says "21 markdown files across 4 categories" and "canonical 21-entry feature inventory". SKILL.md does not cite a count. The `feature_catalog/` directory contains 4 category subdirectories plus `feature_catalog.md` (5 top-level entries); the individual `.md` files inside subdirectories were not enumerated but the README claims 21 — this is consistent with the README's own feature reference table which lists 20 features (6+5+4+5). The README's "21" count versus the table's "20" entries is a minor internal discrepancy.
- **Lifecycle modes:** README says "3 active (`new`, `resume`, `restart`) + 2 reserved (`fork`, `completed-continue`)". SKILL.md mentions `new`, `resume`, `restart` and the quick reference adds `fork` and `completed-continue` as "deferred, not runtime-wired". These are consistent but the terminology differs ("reserved" vs "deferred").
- **References subfolder `state/state_jsonl.md`:** Listed in the README structure tree but not cited in SKILL.md's §5 references list (SKILL.md cites `state_format.md`, `state_outputs.md`, `state_reducer_registry.md` but omits `state_jsonl.md`). The README references table also omits it. It exists on disk but is not cross-referenced.
- **References subfolder `protocol/loop_state_and_gates.md`:** Listed in the README structure tree but not cited in SKILL.md §5 or the README references table. It exists on disk but is not cross-referenced.