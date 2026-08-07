# Context Report — cli-devin Deprecation

**Scope:** Deprecate `.opencode/skills/cli-devin` and remove all references across the framework.
**Executor pool:** 2 native `@deep-context` seats on **sonnet** (by-model-shared-scope, agreement≥2, relevance gate 0.55).
**Iterations (parallel sweeps):** 10 / 10 · **Stop reason:** maxIterationsReached (coverage effectively saturated; iter-9/10 found only minor residuals).
**Code graph:** MCP unavailable → frontier seeded via Glob+Grep; citations labeled `unverified` (no `code_graph_verify`), but every active-wiring site was line-verified by ≥1 sonnet seat and the load-bearing ones by both.

> **Methodology note:** seats are read-only analyzers; the host (orchestrator) merged all findings and wrote every state file (Gate-3-safe). Unit of agreement = the **file to edit** (path-keyed), the correct unit for a reference-map. Reuse/registry scripts (`reduce-state.cjs`/`upsert.cjs`/`convergence.cjs`) were non-functional this session (coverage-graph DB down) → host-driven saturation governed the stop, per the YAML's `code_graph_unavailable` recovery path.

---

## 0. THE ACTIVE-vs-HISTORICAL BOUNDARY (the headline)

`cli-devin` appears in **~1811 files**. The deprecation surface is NOT 1811 files:

| Class | ~Count | Disposition |
|-------|--------|-------------|
| **ACTIVE-WIRING** (live code, configs, registries, governance, agent rosters, active docs) | **~45 files** | **EDIT / REMOVE** (this packet's work) |
| **HISTORICAL-RECORD** (`.opencode/specs/**` ~1700+, `**/changelog/**` ~30, benchmark `state/*.jsonl` + eval outputs ~40) | **~1760 files** | **LEAVE** — immutable audit trail of completed work |

This mirrors the shipped **`132-cli-gemini-deprecation`** precedent, which deliberately scoped to *"active, non-spec references."* Rewriting the 1760 historical files would corrupt the spec/benchmark audit trail for **zero functional gain** — every historical mention is a record of work that genuinely used cli-devin at the time.

**Recommendation: edit the ~45 active-wiring files; leave the ~1760 historical files.** (See §6 decision D1 — this is the choice you flagged "all 1811"; the evidence says active-only.)

---

## 1. STRUCTURAL DECISIONS REQUIRED (resolve before/at planning)

| # | Decision | Evidence | Recommendation |
|---|----------|----------|----------------|
| **D1** | **Removal scope:** all ~1811 vs active-only ~45 | 1572 specs + ~40 benchmark + ~30 changelog are historical records | **Active-only** (132 precedent; protect audit trail) |
| **D2** | **swe-1.6 model fate:** remove vs mark-retired | model-profiles.json: swe-1.6 has ONE executor (cli-devin/cognition-free), `fallback_target:null`; absent from opencode.json/.utcp_config.json; profile says "Only executor path; no cli-opencode alternative" → **cli-devin-EXCLUSIVE** | **Remove or mark `retired`** (no surviving dispatch path). deepseek-v4-pro/kimi-k2.6/glm-5.1 keep cli-opencode → only drop their cli-devin executor row. |
| **D3** | **`context-budget.md` canonical re-home target** | `cli-opencode/references/context-budget.md` is a SENTINEL pointing at `cli-devin/references/context-budget.md` as canonical; also referenced by prompt_templates.md:42, sk-prompt-models/SKILL.md:258, pattern-index.md:35, swe-1.6.md:235 | Re-home canonical content (+ `per-model-budgets.json`) into **sk-prompt-models/references/** or **cli-opencode** itself, then rewrite the sentinel + repoint. **MUST happen before deletion.** |
| **D4** | **deep-review successor executor** | `system-spec-kit/constitutional/post-implementation-deep-review.md` PRESCRIBES cli-devin SWE-1.6 as the default per-iter review worker (lines 24,52-57,85,120) | Pick **cli-codex** or **cli-opencode** as the successor + rewrite the recipe + drop dead `--agent-config` paths. |
| **D5** | **Devin removal scope** (the two-surface question) | (1) cli-devin *executor skill* vs (2) **Devin IDE *runtime* hooks** (`.devin/hooks.v1.json`, skill-advisor + spec-kit + code-graph `hooks/devin/*`, `'devin'` runtime enum). Surface (2) does NOT depend on (1). | You said "remove cli-devin from skill advisor" + deprecating Devin → **recommend FULL Devin removal** (both surfaces) for consistency; but (2) touches spec-kit/code-graph hooks that are IDE-runtime integration, not cli-devin. Confirm. |
| **D6** | **Grader-prompt label** (contradiction) | `system-spec-kit deep-improvement scorer/grader/prompts/{system-grader,system-skeptic}.md:3` say "cli-devin SWE 1.6 …loop"; grading is executor-agnostic | LOW priority, non-breaking. native-a=leave (historical), native-b=edit (stale label). Recommend a one-line label neutralization if touching. |

---

## 2. ACTIVE-WIRING LEDGER (the ~45-file touch list, by cluster)

### A. Runtime code (HARD — breaks dispatch if missed)
- `deep-loop-runtime/lib/deep-loop/executor-config.ts` — EXECUTOR_KINDS:7, EXECUTOR_KIND_FLAG_SUPPORT:40, DEVIN_SUPPORTED_MODELS:46, DevinSupportedModel:47, DevinPermissionMode:48, resolveDevinPermissionMode fn:160-168, model-required guard:194-198, model-whitelist guard:242-255, JSDoc:320.
- `deep-loop-runtime/lib/deep-loop/executor-audit.ts` — 5 map entries:51,59,67,75,92.
- `deep-loop-runtime/scripts/fanout-run.cjs` — STATE map:114, buildLineageCommand branch:330-342 (hard-codes swe-1.6:336), resolveDevinPermissionMode import:377 + local:432 + ternary:435 (coupled triad).
- `deep-improvement/scripts/model-benchmark/dispatch-model.cjs` — KNOWN_EXECUTORS:141 + buildSpawnSpec case:438-446 (DEVIN_BIN).
- `deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` — 2nd hand-synced KNOWN_EXECUTORS:39.
- `system-skill-advisor/mcp_server/lib/advisor-runtime-values.ts` — `'devin'` in ADVISOR_RUNTIME_VALUES:16 (drives AdvisorRuntime type). *(Devin-runtime scope D5)*
- Tests: `deep-loop-runtime/tests/unit/executor-{config,audit}.vitest.ts` (214/370), `deep-improvement/.../tests/remediation.vitest.ts` (49,211-235), `system-skill-advisor/.../tests/hooks/runtime-parity.vitest.ts` (25,97). *(advisor test = D5)*

### B. Deep-loop YAMLs + command docs
- `deep_start-research-loop_auto.yaml:753-811` (if_cli_devin block), `deep_start-review-loop_auto.yaml:916-974`, `deep_start-review-loop_confirm.yaml:865-888`. (`deep_start-research-loop_confirm.yaml` = CLEAN.)
- `deep_start-context-loop_auto.yaml:421,455-456` + `_confirm.yaml:450,484-485` (seat notes).
- `start-research-loop.md` (123,172,235), `start-review-loop.md` (123,185,261), `start-context-loop.md` (168), `start-model-benchmark-loop.md` (97,188,357), `start-agent-improvement-loop.md` (509).

### C. sk-prompt-models registry cluster
- `SKILL.md` (3,8,21-22,51,67,103,201-212,216,237,258-264,274,281), `assets/model-profiles.json` (swe-1.6 decision + deepseek:57/kimi:117/glm:216 cli-devin rows + notes:129,240), `graph-metadata.json` (9-13,27,128 + trigger_phrases), `description.json` (trigger_phrases:45,49), `assets/cli_prompt_quality_card.md:117`, `references/pattern-index.md` (21,35-39,41,46,56,74), `references/models/_index.md` (3,8,20), `references/models/swe-1.6.md` (whole file — D2), `deepseek-v4-pro.md` (40,149,155,168,172), `kimi-k2.6.md` (40,130,138,143,153,158), `glm-5.1.md` (40,117,129,139,143), `README.md` (7,25,90,128).

### D. Skill-graph + skill-advisor
- Graph: `system-skill-advisor/graph-metadata.json:80-84` (uses-edge); sibling reciprocal edges `cli-opencode/graph-metadata.json:27,45`, `cli-claude-code/:21,38`, `cli-codex/:21,38`, `sk-prompt/:20`; `sk-prompt-models/graph-metadata.json` (above). Export copies `system-skill-advisor/mcp_server/{scripts,database}/skill-graph.json`. **`skill-graph.sqlite` = REBUILD** (via `indexSkillMetadata()` / `advisor_rebuild` MCP / daemon restart) AFTER all graph-metadata edits — JSON exports regenerate, never hand-edit.
- Advisor docs/scripts: `SKILL.md` (118,150,350), `INSTALL_GUIDE.md` (135,198,398), `ARCHITECTURE.md:139`, `README.md` (160,184), `references/runtime/freshness_contract.md:104`, `references/hooks/skill_advisor_hook.md:20`, `references/decisions/deferred_decisions.md` (F4 — leave/close). CI: `check-prompt-quality-card-sync.sh` (63,93 — **P1, breaks CI**), `run-deep-review-arc.sh` (6,27,31-34,339,374). Playbook: `manual_testing_playbook/02--cli-hooks-and-plugin/devin-user-prompt-submit.md` (delete) + `manual_testing_playbook.md` (151,190 + counts) + `runtime-parity.vitest.ts`.
- **Devin platform hooks (D5 scope):** `.devin/hooks.v1.json` (delete), `system-skill-advisor/hooks/devin/user-prompt-submit.ts` + dist (delete dir), `system-spec-kit/mcp_server/hooks/devin/session-start.ts` + `tests/devin-session-start-hook.vitest.ts`, `system-code-graph/manual_testing_playbook/10--devin-hooks/devin-session-start.md`, `system-spec-kit/manual_testing_playbook/18--ux-hooks/D--comment-hygiene-devin-precommit.md`.

### E. Agents (3 runtimes)
- `deep-context.md` (.opencode:203 / .claude:186 / .codex:193), `deep-research.md` (.opencode:329-344 SWE-1.6 section + :337 card ref; mirrors clean), `deep-review.md` (.opencode:281-298 + :291; mirrors clean), `deep-improvement.md` (.opencode:44 / .claude:29 / .codex:34).

### F. Governance + top-level docs
- `AGENTS.md` (56,57) + **`CLAUDE.md` (56,57 — verbatim twin, NOT symlink)**; `.claude/CLAUDE.md` = CLEAN. `README.md` (18,942-944,974), `.opencode/skills/README.md:51`.

### G. Cross-skill docs + constitutional
- deep-context: `SKILL.md:391`, `references/protocol/loop_protocol.md:31`, `references/guides/quick_reference.md:44`, `feature_catalog/02--by-model-parallel-sweep/cli-council-seats.md:22,43`.
- cli-* siblings: `cli-opencode/{README:142,SKILL.md:328+434,references/context-budget.md(sentinel-D3),references/integration_patterns.md:260,references/opencode_tools.md:14,assets/prompt_templates.md:42+426}`, `cli-codex/{README:154+203,SKILL.md:360}`, `cli-claude-code/{README:145,SKILL.md:355}`, `sk-prompt/{README:155,graph-metadata.json:20}`.
- system-spec-kit: `constitutional/cli-dispatch-skill-preload.md` (7,8,27-29,39,46-47,58,62), `constitutional/post-implementation-deep-review.md` (D4), `references/cli/shared_smart_router.md` (3,8,125), `references/cli/memory_handback.md` (8,22-23 — plain-text delimiter behavior).
- deep-improvement docs: `SKILL.md` (290,310,313), `feature_catalog/feature_catalog.md:293`, `feature_catalog/04--model-benchmark-mode/model-dispatcher.md` (26,38), `scripts/model-benchmark/README.md` (37,73).
- deep-loop-runtime: `SKILL.md:166` (fanout pool), `feature_catalog/feature_catalog.md:436`, `feature_catalog/09--fanout/fanout-run.md` (3,25,42).
- `.opencode/scripts/README.md` (68,78 — sweeper preserve rules).

### H. The skill directory itself
- `rm -rf .opencode/skills/cli-devin/` (~70 files: SKILL.md, README, graph-metadata.json, references/, assets/ incl. agent-config-deep-{research,review}-iter.json + per-model-budgets.json + prompt_quality_card.md + context-budget.md(D3 re-home), manual_testing_playbook/, changelog/). **LAST** (Phase 5).

---

## 3. HISTORICAL-RECORD LEDGER (LEAVE — ~1760 files)
- `.opencode/specs/**` (~1700+) incl. `z_archive/104-cli-devin-creation`, `z_archive/113-cli-devin-prompt-quality`, `z_archive/116-deep-skill-evolution`, `135/004-cli-devin-readme`, and all per-spec `description.json` rows. **`.opencode/specs/descriptions.json` cli-devin entries are all historical spec rows — LEAVE.**
- `**/changelog/**` (~30) — per-skill version changelogs.
- Benchmark/eval state: `sk-prompt-models/benchmarks/**/state/*.jsonl`, `per-probe*.jsonl`, `synthesize.cjs` output strings, `system-spec-kit/mcp_server/benchmarks/**`, `deep-improvement/references/model-benchmark/mixed_executor_methodology.md` (both seats: HISTORICAL).
- **Caveat (residual):** two `specs/**/research/*.sh` one-off scripts (`009-.../research/run_loop.sh:13`, `006-.../research/prompts/render_remediation.sh:10`) read live cli-devin asset paths — they'd break if *re-run*, but are in completed packets. Non-blocking; tombstone or update if desired.
- **`-ne 391` count check** in `system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166` — does NOT track cli-devin → **no bump needed**.

---

## 4. DEPENDENCY-ORDERED PHASE PLAN (deletion safety)

**Deletion safety: SAFE** — no retained code imports/requires a `cli-devin/` path at runtime; no symlinks into the dir. Safe to `rm -rf` once P1-P4 land.

- **P1 — CI gate (FIRST):** patch `check-prompt-quality-card-sync.sh` (remove cli-devin from `cli_cards`:63 + `cli_skills`:93) and re-home/repoint the `prompt_quality_card.md` path. *Deleting the skill before this = immediate CI FAIL.*
- **P2 — Re-home canonical (before code):** move `context-budget.md` (+`per-model-budgets.json`) canonical content out of cli-devin → repoint cli-opencode/references/context-budget.md (full rewrite), prompt_templates.md:42, sk-prompt-models SKILL.md:258 / pattern-index.md:35 / swe-1.6.md:235. Decide fate of `prompt_quality_card.md` + `prompt_templates.md` (re-home vs retire).
- **P3 — Bulk removals (one wave):** runtime code (§2A) + tests + YAMLs/command docs (§2B) + sk-prompt-models cluster (§2C) + agents (§2E) + governance (§2F) + cross-skill/constitutional (§2G) + run-deep-review-arc.sh + residual deep-loop-runtime docs. Apply D2 (swe-1.6), D4 (deep-review successor), D5 (Devin platform hooks) here.
- **P4 — Graph rebuild (after edits):** remove cli-devin edges from all graph-metadata.json (6 skills) → rebuild `skill-graph.sqlite` (`indexSkillMetadata()`/`advisor_rebuild`/daemon restart) → regenerate the 2 skill-graph.json exports.
- **P5 — Delete + verify:** `rm -rf .opencode/skills/cli-devin/` → run `validate.sh --strict` + `check-prompt-quality-card-sync.sh` + a final `rg -l 'cli-devin' --glob '!**/specs/**' --glob '!**/changelog/**'` = 0 active hits.

---

## 5. SUGGESTED PHASE DECOMPOSITION (maps phases→child packets)
1. `001-canonical-rehome-and-ci-gate` (P1+P2 — context-budget re-home, prompt-card path, CI script). *Must land first.*
2. `002-runtime-code-and-executor-removal` (P3 §2A code + tests + D2 swe-1.6 + YAMLs §2B).
3. `003-registry-graph-and-skill-advisor` (P3 §2C + §2D + P4 graph rebuild + D5 Devin hooks).
4. `004-docs-agents-governance` (P3 §2E + §2F + §2G + residuals).
5. `005-delete-skill-and-verify` (P5).

*(Or fewer/coarser children if you prefer — e.g. collapse 003+004. Each child is Level 2.)*

---

## 6. GAPS & UNKNOWNS
- Code graph down → no `code_graph_verify`; line numbers verified by sonnet reads, not graph. Re-confirm exact lines at edit time (files drift).
- D2-D5 are genuine decisions, not lookups — they need your call (see §1).
- Two `specs/**/research/*.sh` residual scripts (non-blocking).
- Grader-prompt contradiction (D6, low priority).
- The successor executor for D4 (deep-review constitutional rule) and the re-home target for D3 are design choices, not discovered facts.

---

## Convergence Report
- Stop reason: maxIterationsReached (10/10; coverage saturated — iter-9 gap recovery + iter-10 closure found only minor residuals).
- Pool: native×2 (sonnet), by-model-shared-scope. Cross-seat agreement was high throughout (load-bearing runtime sites confirmed identically by both seats; complementary breadth from per-seat emphasis unioned to a near-complete map).
- Final signals (host-tracked): sliceCoverage 1.0 (7/7 clusters + gap recovery + closure), dependencyCompleteness ~0.97, agreementRate high. 1 contradiction surfaced (D6), unresolved by design.
- Per-iteration audit trail: `context/iterations/iteration-001..010` is partially narrated; full per-seat findings in `context/seats/iter-NNN/`; state log `context/deep-context-state.jsonl`.
