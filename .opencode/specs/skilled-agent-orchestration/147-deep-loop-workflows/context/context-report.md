# Context Report: Merge 5 Deep-Loop Workflow Skills into `deep-loop-workflows`

## 1. Current Architecture Map

The system is a **partially-realized two-skill split**: one shared backend (`deep-loop-runtime`) plus five sibling workflow skills, all dispatched through 8 `/deep:*` commands and per-runtime native agents.

### The backend: `deep-loop-runtime` (stays a peer; not merged)

Created by the **FULL_ISOLATE_NO_MCP** consolidation (deep-loop-runtime/SKILL.md:10,255,268,289), it is MCP-free and owns no agents. It owns:

- **`lib/deep-loop/`** durability/scoring primitives: `atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`, `permissions-gate.ts`, `prompt-pack.ts`, `post-dispatch-validate.ts`, `bayesian-scorer.ts`, `fallback-router.ts` (+ `executor-config.ts`, `executor-audit.ts` named in SKILL.md:125-136 but unconfirmed on disk — see §7).
- **`lib/coverage-graph/`** (3 modules): `coverage-graph-db.ts` (sole DB-connection + schema owner, `VALID_KINDS[loopType]`, `CONTEXT_WEIGHTS`), `coverage-graph-query.ts`, `coverage-graph-signals.ts`.
- **`lib/council/`** (7 files, already extracted from deep-ai-council): `multi-seat-dispatch.cjs`, `round-state-jsonl.cjs`, `adjudicator-verdict-scoring.cjs`, `cost-guards.cjs`, `session-state-hierarchy.cjs`, plus `council-graph-db.ts`, `council-graph-query.ts`, `convergence.cjs`. (SKILL.md:146-153 lists only 5 — doc drift.)
- **`scripts/`** (8 entry points + `lib/cli-guards.cjs`): `convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs` (ex-MCP shims) and `fanout-run.cjs`, `fanout-pool.cjs`, `fanout-salvage.cjs`, `fanout-merge.cjs`.
- **`database/`**: TWO SQLite DBs — `deep-loop-graph.sqlite` + `council-graph.sqlite`.
- **`tests/`** (discovered via `system-spec-kit/mcp_server/vitest.config.ts` glob `../deep-loop-runtime/tests/**`) and **`references/`** (`coverage_graph_schema.md`, `integration_points.md`, `script_interface_contract.md`, `state_format.md`). Production imports still reach into `system-spec-kit/mcp_server/node_modules` for `zod` + `better-sqlite3`.

### The five workflow skills (the merge set)

| Skill | Persona | Command(s) | Family/Category | Unique-owned | Key divergence |
|---|---|---|---|---|---|
| **deep-context** | Inward, agreement-weighted PARALLEL sweep over one scope → reuse-first Context Report | `/deep:start-context-loop` | deep-loop / autonomous-loop | `scripts/reduce-state.cjs` (801L), **local `scripts/loop-lock.cjs`** (114L, runtime wrapper), context-report template, 5 reuse-first convergence signals | `convergenceThreshold=0.10`; coverage-graph is MANDATORY substrate; allowed-tools NO Task/WebFetch; v1.2.0 |
| **deep-research** | Outward/web, SEQUENTIAL fresh-context-per-iteration → `research/research.md` | `/deep:start-research-loop` | deep-loop / autonomous-loop | `reduce-state.cjs` (1072L, also convergence evaluator), `runtime-capabilities.cjs`, **`spec_check_protocol.md` (231L spec.md write-back + advisory lock)**, `verify-yaml-script-paths.sh`, capability-matrix subsystem | `newInfoRatio` threshold 0.05; richest lifecycle (resume/restart/fork, lineage fan-out, insight/thought statuses); allows Task+WebFetch+memory_*; v1.13.1.0 |
| **deep-review** | Code-review, one dimension/iteration → `review-report.md` + verdict | `/deep:start-review-loop` | deep-loop / autonomous-loop | `reduce-state.cjs` (review-domain: SEVERITY_WEIGHTS P0/P1/P2, REQUIRED_DIMENSIONS), `runtime-capabilities.cjs`, `review_mode_contract.yaml` | P0/P1/P2 + VERDICT_LOCK + exact final line "Review verdict: PASS\|CONDITIONAL\|FAIL"; 9 legal-stop gates, threshold 0.10/composite 0.60; Task but NO WebFetch; v1.10.2.0 |
| **deep-ai-council** | Planning-only multi-seat deliberation (2-3 seats, 6 lenses) → `ai-council/**` | `/deep:ask-ai-council` | **sk-util / utility** | `orchestrate-session.cjs`, `orchestrate-topic.cjs`, `persist-artifacts.cjs`, `advise-council-completion.cjs`, `replay-graph-from-artifacts.cjs`, `scripts/lib/` (findings-registry, rollback, audit-trail) + own `node_modules/.vite` | two-of-three convergence (threshold 0.20); session>topic>round hierarchy (no "iteration"); Write/Edit scoped to `ai-council/**`; one-CLI-per-round; **already imports `../../deep-loop-runtime/lib/council/`**; v2.2.0.0 |
| **deep-improvement** | THE ONLY mutating loop; FOUR lanes A/B/C/D | `/deep:start-{agent-improvement,model-benchmark,skill-benchmark,non-dev-ai-system}-loop` | **sk-util / utility** | Largest skill (~334 files): `scripts/shared/loop-host.cjs` mode-router, `reduce-state.cjs`, `promote-candidate.cjs`, `improvement-journal.cjs`, per-lane subtrees, `sweep-benchmark.cjs`, grader cache | No `loopType`; bypasses runtime convergence; bespoke plateau/trajectory stop logic; guarded promotion + rollback; frozen stop-reason taxonomy; v1.16.0.0 |

**Consumption pattern:** context/research/review/council consume the runtime via the **command-layer YAMLs** (`.opencode/commands/deep/assets/deep_start-*-loop_{auto,confirm}.yaml`) which invoke `node .opencode/skills/deep-loop-runtime/scripts/{fanout-run,fanout-merge,convergence,upsert}.cjs --loop-type <context|research|review>`. Council additionally shells out directly from `replay-graph-from-artifacts.cjs:26,56,65`. **deep-improvement consumes NO runtime CLI scripts** — it ships its own `loop-host.cjs` + reducer (it does trust the runtime at the LIBRARY level: `reduce-state.cjs:118-132` in-process requires `atomic-state.ts` + `jsonl-repair.ts` via a tsx shim).

---

## 2. Backend-vs-Mode Boundary

### Already correctly in `deep-loop-runtime` (DO NOT touch / DO NOT fork)

- All `lib/deep-loop/` durability + scoring + routing primitives (zero workflow semantics).
- Coverage-graph storage, schema, signals, both SQLite DBs.
- The 8 `scripts/` entry points incl. the entire **fan-out family** — this is the precedent that "parallel dispatch / lineage isolation is a backend concern," NOT per-workflow.
- The council backend (`lib/council/*`, `council-graph.sqlite`) — **the strongest single precedent for the backend/modes line**: merging deep-ai-council means moving ONLY its orchestration layer; its durable primitives already split out.
- Executor-config resolver, post-dispatch validator, per-loop-type coverage-graph weights — all loop-type-specialized lib modules the merged skill references by `--loop-type`.

### Currently in the 5 skills but GENERIC → should move UP to the runtime

| Item | Where it lives now | Why it's backend | Evidence |
|---|---|---|---|
| **`loop-lock.cjs` CLI adapter** | `deep-context/scripts/` only (thin tsx-wrapper over runtime `loop-lock.ts`) | Other loops use prose-only locks; one canonical CLI belongs in `deep-loop-runtime/scripts/` | deep-context/scripts/loop-lock.cjs:1-30,114 |
| **`runtime-capabilities.cjs`** | Duplicated byte-identical in deep-research + deep-review (differ only in banner + 1 error string) | Generic capability resolver loading `assets/runtime_capabilities.json` by mode → one parameterized runtime probe | deep-research/...:1-115 vs deep-review/...:1-115 |
| **`writeTextAtomic` / `repairJsonlTailInline`** | Re-inlined in deep-context + deep-improvement reducers ("Mirrors the runtime writeStateAtomic") | Duplicates `lib/deep-loop/atomic-state.ts` / `jsonl-repair.ts`; 4 reducers risk drifting on constants they're supposed to mirror | deep-context/reduce-state.cjs:55-60; deep-improvement/...:51-90 |
| **Relevance/agreement gate constants** | Duplicated in reducers ("mirror coverage-graph-signals") | Should be imported from `coverage-graph-signals.ts`, not copied | deep-context/reduce-state.cjs:15,28-31 |
| **`verify-yaml-script-paths.sh`** | Misfiled in deep-research/scripts/, but verifies BOTH research+review YAMLs | Cross-mode verifier → one workflow-level (or runtime) verifier | deep-research/scripts/verify-yaml-script-paths.sh:7-12 |
| **`typed-errors.cjs`** | deep-improvement copy ("mirrors deep-loop-runtime's CLI guard pattern") | Copied, not imported → dedupe candidate | deep-improvement/scripts/lib/README.md:22 |
| **Stop-reason / journal taxonomy** | Frozen in deep-improvement `improvement-journal.cjs` (6 reasons + 4 outcomes) | Overlaps the convergence vocabulary in research/review; strong candidate to be the shared journal contract all modes map onto | deep-improvement/SKILL.md:464-471; loop_contract.md:100-114 |

### Genuinely PER-MODE → must move into `deep-loop-workflows` (keep mode-scoped, do NOT unify)

- **The 4+ `reduce-state.cjs` domain bodies** — severity-weight rollup (review) vs agreement dedup by `unit_id` (context) vs resource-map emit (research) vs candidate registry (improvement). The helper skeleton hoists up; the bucket/rollup logic stays per-mode.
- **Per-mode convergence config + signal definitions + threshold/weight tables** (see §4). The runtime engine is shared; the per-loopType evaluate-functions and weight vectors are domain logic.
- **Per-mode deliverable templates + synthesis logic**: `context-report.md/.json` + template, `research/research.md` (mutable), `review-report.md` (9 sections), `ai-council/**` tree, improvement `candidates/`+`benchmark-outputs/`.
- **Mode-unique protocols**: research's `spec_check_protocol.md` (231L spec.md write-back + advisory lock) — research-ONLY; deep-context explicitly must NOT mutate spec.md (deep-context SKILL.md:308).
- **Council orchestration** (`orchestrate-*.cjs`, `persist-artifacts.cjs`, `advise-council-completion.cjs`) and **improvement lanes** (the entire `agent-improvement/`, `model-benchmark/`, `skill-benchmark/`, `non-dev-ai-system/` subtrees + `loop-host.cjs` mode-router).

**Hidden cross-skill dependency to decide:** `resolveArtifactRoot` + `emitResourceMap` live in `system-spec-kit/shared/review-research-paths.cjs:202` (NOT the runtime) and are imported by 3 reducers. The two-skill target is NOT fully self-contained — the spec must decide whether these stay a `system-spec-kit` import or move into the runtime.

---

## 3. Surfaces That Must Change

### A. Commands (8 commands / 12 YAML + 6 presentation.txt = 18 asset files)

- **Markdown routers**: thin; only **4 literal skill-path strings in 3 `.md` files** need rewriting (start-research-loop.md:89; start-non-dev-ai-system-loop.md:36,79; start-skill-benchmark-loop.md:36,76). **2 frontmatter `skill: deep-improvement`** values (start-skill-benchmark-loop.md:3, start-non-dev-ai-system-loop.md:3) → `skill: deep-loop-workflows`.
- **YAML assets are the real surface**: ~270 skill-path occurrences (one grep) / 567 total skill-name occurrences across 26 files in `commands/deep/`. Each YAML carries a `skill:` + `skill_md:` pair (24 literal edits) plus nested `references/`/`assets/`/`scripts/` path blocks. Heaviest files: `deep_start-review-loop_confirm.yaml` (53), `deep_start-context-loop_auto.yaml` (35), `deep_start-agent-improvement-loop_auto.yaml` (35).
- **Rewrite rule (mechanically simple to scope)**: rewrite the 5 mode-skill path prefixes → `deep-loop-workflows`; leave EVERY `.opencode/skills/deep-loop-runtime/...` path UNCHANGED (incl. `ask-ai-council.md:73` body-level `--loop-type council`).
- **Presentation `.txt`** need a SECOND class of edit: SKILL.md pointers + cross-skill prose ("see deep-review skill" → "see deep-review MODE") + `memory_context` seed strings (e.g. `input: "deep-research"`).
- **Per-mode required-input setup schemas** (5 distinct) and 3 "do not transfer sibling defaults" guardrails (start-context-loop.md:114, start-review-loop.md:113, ask-ai-council.md:126) must survive verbatim.
- **deep-improvement backs 4 commands** → largest rename footprint; phase its 4-command cluster as one migration phase.

### B. Native agent mirrors (5 agents × 3 runtimes = 15 files)

All 15 exist with full parity. Agent names: `deep-context`, `deep-research`, `deep-review`, `deep-improvement`, **`ai-council`** (note: agent name ≠ skill name `deep-ai-council` — precedent that skill-rename does NOT force agent-rename).

- **Repoint volume per agent** (if agents keep names): deep-context = **1 string** (caller-table name only, no Read() loads); deep-research = 1 path (loop_protocol.md) ×3; deep-review = 2 self-paths + LEAVE the out-of-set `sk-code-review/references/review_core.md`; deep-improvement = skill-name string + verify 4-lane script paths; **ai-council = ~9 paths ×3 ≈ 27 edits** (executes `persist-artifacts.cjs` from literal paths — highest effort, lockstep contract with `output_schema.md`).
- **`.codex/*.toml`** wrap the full markdown body in `developer_instructions = '''...'''` with a `# Converted from:` header → confirm hand-edited vs generated before repointing (else edits get overwritten); extra TOML `model`/`sandbox_mode` fields must survive.
- **Whitelist the "Path Convention" line** as an expected per-runtime diff in any parity check.
- Self-referential "Runtime Mirror Awareness" tables (deep-review.md:288-291) and inline sibling-threshold notes become cross-MODE rather than cross-SKILL prose.

### C. Cross-repo / framework docs

| Surface | What changes |
|---|---|
| **root README.md** | 4 sections: §Deep-Loop feature (L786-871, "five loop skills" L919, per-skill README links L871 that will 404); §Agents directory (L917-937, fold 5 entries→1, mirror deep-improvement's multi-lane entry); §Skills capabilities (L1172-1199); §codebase-agnostic table (L1322-1323, the brittle 5-skill slash-enumeration). |
| **`.opencode/skills/README.md`** | Catalog table L53-63 (6 rows → 2); 3 counts: `deep-* (6)`→`(2)` (L24), "23 skills"→19 (L3,L33). |
| **CLAUDE.md + AGENTS.md** | **Hand-mirrored at identical line numbers** — treat as ONE paired edit unit. Workflow table L185-188 (command-keyed, mostly safe), Agent list L365-369 (only `@deep-improvement` "via deep-improvement" L369 is a bare skill ref), GATE 4 L239 (repoint per-skill SKILL.md invariant references). |
| **`.claude/CLAUDE.md`** | ZERO matches — **no edits, out of scope.** |
| **`deep-loop-runtime/README.md`** | The densest cross-skill doc: written around a FIVE-consumer model (L28, per-consumer import table L119-123, FAQ L150, council-ownership FAQ L160-162) → rewrite to ONE consumer with internal modes. |
| **`system-spec-kit/constitutional/deep-skill-workflow-required.md`** | Enumerates all 5 skill names (L9-13) + "deep-context bypass" (L34) — governance contract. |
| **`system-spec-kit/README.md`+SKILL.md:531, cli-opencode/SKILL.md:439** | "Related skills" lines. cli-* docs are mostly AGENT/COMMAND refs (separate axis) — keep narrow. |
| **`descriptions.json`** | ZERO live skill refs (only historical spec-folder slugs) — **EXCLUDE from rename.** |
| **changelog/ dirs** | Append-only history — **EXCLUDE from rename sweep.** |

### D. Skill-advisor graph

- **`skill_id` is hard-bound to folder name** (`skill-graph-db.ts:654-658` throws on mismatch). Migration = delete 5 folders' metadata, create ONE `deep-loop-workflows/` folder + `graph-metadata.json` skill_id=`deep-loop-workflows`. FK `ON DELETE CASCADE` auto-removes the 5 nodes + all edges touching them — no manual edge cleanup for deleted nodes.
- **Surviving inbound edges to repoint (finite, 5 source files)**: `system-skill-advisor` (4 "enhances" edges @0.7 to research/review/improvement/ai-council — highest stakes, it's the Gate-2 router), `sk-code-review`→deep-review, `sk-prompt`→deep-improvement, `system-spec-kit`→deep-ai-council, `deep-loop-runtime` (6 enhances/siblings @0.7/0.6 + manual.related_to). Edges with vanished targets are REJECTED with "UNKNOWN-TARGET" warnings (silent degradation) → spec needs an explicit `rejectedEdges` grep after scan.
- **`system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13-47`** hard-codes alias groups for 4 of 5 (deep-context absent — pre-existing asymmetry). Plus `skill-graph.json`, scorer `lexical/explicit/fusion.ts`, and routing-parity vitest fixtures (`routing-parity-deep-skills.vitest.ts`, `intent-prompt-corpus.ts`) assert the 5 names → **fail-closed without fixture updates**; sequence advisor changes with their tests.
- **Keyword/trigger union**: merged skill must UNION all 50 keywords / 63 trigger_phrases (deduping intra-skill dupes) across the 5 — **the single biggest routing-quality risk.** Family must collapse 3 `deep-loop` + 2 `sk-util` skills into ONE family (logically `deep-loop`; verify it's in `ALLOWED_FAMILIES`). `key_files`/`entities` (~45 paths) rebuilt to new `deep-loop-workflows/**` paths after the file move.

### E. Governance: `feature_catalog/` + `manual_testing_playbook/`

- All 5 skills ship BOTH (deep-loop-runtime ownership unconfirmed — see §7). **~400+ per-feature `.md` files** total. Combined playbook scenarios ≈ 198 (council 32 + context 25 + research 44 + review 49 + improvement 48).
- **Casing split**: `deep-ai-council/feature_catalog/FEATURE_CATALOG.md` (UPPERCASE) vs the other 4 lowercase → normalize.
- **Feature-ID prefix collisions**: `CP-` reused across research (CP-046..051), review (CP-052..057), improvement (CP-032..037) at different bands → namespace per mode (CTX-/RES-/REV-/IMP-/COU-) or keep mode-scoped sub-trees; bidirectional catalog↔playbook cross-refs mean any renumber touches both trees.
- **Hard-coded count self-checks** (drift hazards): deep-improvement playbook `COVERED_FEATURES == TOTAL_FEATURES == 48` (L110) + ID-range list (RT-022..031 etc.); deep-ai-council `== TOTAL_FEATURES` (L127, no literal). These literals MUST be rewritten to the merged total or per-lane sub-totals.
- **SOURCE FILES path tables**: every per-feature file embeds OLD skill-rooted paths (`.opencode/skills/deep-research/...`) — ~198 files × multiple paths = **the largest mechanical edit surface.**
- **Duplicated `setup-cp-sandbox.sh`** across research/review/improvement → dedupe to one shared asset.
- **Pre-existing intra-skill drift** (deep-research playbook L680-682 falsely claims "No dedicated feature_catalog/ package exists" + duplicate `## 15.` headings) → add a reconciliation/validation step, don't trust source prose.
- **No common category schema**: lifecycle (research/review) vs sweep (context) vs 4-lane (improvement) vs council taxonomy → realistic shape is per-MODE top-level sections each keeping its own subtree, NOT a unified category list.

---

## 4. Divergent Per-Mode Semantics (DO NOT FLATTEN)

The merged skill MUST carry per-mode convergence/state/artifact contracts. The runtime's `convergence.cjs` already keys on `loopType ∈ {research, review, context, council}` with **three distinct hardcoded weight vectors** (convergence.cjs:116-291) — preserve that discriminator.

| Mode | Convergence model | Threshold | Stop substrate | Artifact root / shape |
|---|---|---|---|---|
| **context** | reuseCatalogCoverage 0.30 / agreementRate 0.25 / sliceCoverage 0.20 / relevance 0.15 / dependency 0.10; 3 BLOCKING guards | 0.10 | Coverage-graph is **MANDATORY** (`evaluateContext`); empty graph = CONTINUE | `context/context-report.{md,json}` + findings-registry; by-model-shared-scope fan-out (host-writes-state) |
| **research** | **DUAL-LAYER**: `newInfoRatio` signal vote (Rolling Avg 0.30 / MAD 0.35 / Question Entropy 0.35) NOMINATES stop → graph gate AUTHORIZES | 0.05 | Coverage-graph + signal layer; progressiveSynthesis; machine-owned strategy sections | `research/research.md` (MUTABLE) + spec.md write-back fence + `.deep-research-pause` sentinel; autonomous-lineage fan-out |
| **review** | dimensionCoverage 0.25 / findingStability 0.20 / p0ResolutionRate 0.25 / MAD 0.25; **9 legal-stop gates**; P0 override forces iteration | 0.10 / composite 0.60 | Coverage-graph | `{spec_folder}/review/`; P0/P1/P2 SEVERITY_WEIGHTS; **VERDICT_LOCK** + exact final line "Review verdict: PASS\|CONDITIONAL\|FAIL" (CI-parsed by string match) |
| **council** | **two-of-three** (agreementRatio 0.25 / dissentDensity 0.20 / evidenceDepth 0.20 / unresolvedCritical 0.20 / decisionConfidence 0.15) | 0.20 | **SEPARATE `council-graph-db`** (DECISION/RECOMMENDATION nodes, AGREES_WITH/CONTRADICTS edges); **empty graph = STOP_BLOCKED** (semantic inversion) | `ai-council/**` session>topic>round; `council_complete` event; `failed/` forensics; derived-projection graph |
| **improvement** | **NOT graph-based at all**: config-driven plateau/tie detection (maxConsecutiveTies, stopOnDimensionPlateau + plateauWindow:3, trade-off regression -3/-5) over 5-dim weighted score (struct 0.20/rule 0.25/integration 0.25/output 0.15/fitness 0.15) | n/a (no `loopType`) | Trajectory-plateau scoring + guarded promotion gating | `improvement/`: dual ledger (`agent-improvement-state.jsonl` + `improvement-journal.jsonl`), `experiment-registry`, `candidates/`, `benchmark-outputs/` |

**Other non-flattenable boundaries:**
- **H/S/R naming collision**: review uses Hunter/Skeptic/Referee for P0 adversarial self-check; council uses the same names for cross-SEAT critique scoring — **same vocabulary, different mechanism.** Flag explicitly.
- **spec.md write-back**: research-ONLY (231L protocol + advisory lock); context explicitly must NOT.
- **Tool-permission asymmetry**: research has WebFetch+memory_*; review/context/council do NOT (code/inward-only). Merged `allowed-tools` is the UNION but per-mode guards must restrict.
- **Optimizer-managed registry**: only research/review/context wire `_optimizerManaged` (shared manifest, but **per-mode `lockedFields` differ**); council/improvement opt out → preserve divergence or a flat locked-list lets the optimizer mutate protected fields.
- **Mutation boundary**: deep-improvement is the ONLY write-capable loop — read-only modes must NEVER reach `promote-candidate.cjs`/`rollback-candidate.cjs`. Make mutation a per-mode property.

---

## 5. Hardest Merge Points (with risk ratings)

| # | Merge point | Risk | Why |
|---|---|---|---|
| 1 | **deep-improvement Lane D (non-dev-ai-system)** | **CRITICAL** | Core loop lives OUTSIDE the skill — `<packaging-root>/benchmark/_loop/loop.py` + `_gates/{gates,derive}.py` (Python, cross-repo, external "Barter Copywriter" pilot). deep-improvement ships only a thin Node adapter (`run-non-dev-ai-system.cjs`, "owns no loop logic"). Own journal (18 event types, 10 stop reasons) that MAPS onto the canonical taxonomy. Kill-switch taxonomy + grader-family-violation HARD kill-switch. Cannot be absorbed as an in-skill mode — it's a contract/adapter boundary; may need version-bump coordination with the external pilot. |
| 2 | **deep-improvement is a 4-lane skill, not 1 mode** | **HIGH** | The merged skill is really N+3 modes. Each lane has its own `references/`, `assets/`, `scripts/` subtree + own scorer. Spec must decide: 4 top-level modes or nested mode-group. `loop-host.cjs` mode-router overlaps the loop-YAML/runtime dispatch the merged skill uses → two layers of mode-routing to reconcile. Must NOT break the byte-identical default-path guarantee or the mode-tagged reducer record contract. |
| 3 | **deep-improvement convergence bypasses the runtime** | **HIGH** | No `loopType`, never calls `convergence.cjs`; bespoke plateau/trajectory stop logic + guarded promotion. Either port lanes onto runtime fanout+convergence+upsert (new loop-types) OR carry a divergent local execution path. The clearest case where a naive flatten breaks behavior. |
| 4 | **Lane B external write target** | **MEDIUM-HIGH** | `sweep-benchmark.cjs` always writes to `.opencode/skills/sk-prompt-models/benchmarks/{run_label}/` — a FOREIGN skill's tree. Moving deep-improvement must not break this hub contract. Drags the deepest scorer/grader subtree (cache, dispute, hallucination-flag) ported from spec 120/003. |
| 5 | **Lane C self-referential risk** | **MEDIUM-HIGH** | Lane C benchmarks a SKILL (D1-D5, D5 hard gate, router-replay/contamination-lint/advisor-probe). Once all deep loops live in `deep-loop-workflows`, Lane C's target could be the merged skill itself. Largest sub-script fan-out (14 scripts); advisor-probe couples it to skill-advisor. Diagnostic-only (no mutation) → conceptually closer to review/context than to Lane A. |
| 6 | **ai-council agent path coupling** | **MEDIUM-HIGH** | ~27 path edits across 3 runtimes; agent EXECUTES `persist-artifacts.cjs` from literal paths; lockstep contract across agent section + script + `output_schema.md`. |
| 7 | **4 divergent reduce-state.cjs reducers** | **MEDIUM** | Genuine domain divergence (severity vs relevance vs candidate-score) — keep per-mode. But shared atomic-write/jsonl-repair/gate-constant scaffolding drifts → centralize plumbing, keep rollup logic. |
| 8 | **Keyword/trigger + advisor routing** | **MEDIUM** | 63 trigger_phrases unioned onto one node; precision/recall impact unmodeled; routing-parity fixtures fail-closed. |
| 9 | **Governance ID-collision + count self-checks** | **MEDIUM** | CP- prefix overlaps 3 skills; hardcoded `== 48` literal; ~198 SOURCE-FILES path rewrites. |

---

## 6. Reuse Opportunities

1. **The runtime/workflow split already exists and is intentional** — `deep-loop-runtime` (FULL_ISOLATE_NO_MCP, SKILL.md:10,255,289) is the load-bearing precedent. The merge collapses only the 5 persona surfaces; the backend boundary is frozen (MCP-free, direct `.cjs` invocation — cannot reintroduce MCP tools).
2. **deep-improvement's `loop-host.cjs` is a working "one host, `--mode` flag, shared seams" proof-of-concept** (VALID_MODES, byte-identical default path, mode-tagged reducer records) — the architectural template for how `deep-loop-workflows` dispatches all modes. It's already cleanly partitioned `shared/` + per-lane subtrees → shared maps onto the runtime, lanes map onto modes, near-1:1.
3. **deep-ai-council is already half-migrated** — its backend primitives live in `deep-loop-runtime/lib/council/`; the skill just orchestrates them. The reference template for how every mode should consume runtime primitives.
4. **`--loop-type` is the proven mode discriminator** — already validated by 4 of 5 consumers via `VALID_KINDS[loopType]`; the natural seam for a parameterized merged skill.
5. **deep-context's `loop-lock.cjs` is the canonical thin-wrapper pattern** (mode skill keeps a thin CLI; runtime owns the logic) — apply to consolidate the duplicated generics.
6. **Per-runtime native agent mirror convention** (deep-loop-runtime/SKILL.md:255-261): canonical `.opencode/` + `.claude/` + `.codex/` mirrors, identical bodies, dispatched by name. Skills/commands ride dir-level symlinks (`.claude`/`.codex` → `.opencode`) so renaming the skill folder only needs the canonical change — but **agents are real mirrors, not symlinks** (3-file edit per rename).
7. **Command gate-hardening pattern** (packet 134/007): every deep command opens with Phase 0 @general verification + BLOCKED setup (☐ BLOCKED markers, "Run Phase 0" first). The canonical block is a copy-template with 3 substitutions (indicator skill, box skill, restart line) — grep-based acceptance gates become migration regression checks.
8. **Byte-identical single-executor parity gate** (packet 123/006): the established acceptance bar for behavior-affecting deep-loop changes. The merge is a docs/structure reorg → hold it to byte-identical artifacts pre/post per mode (modulo timestamps). Concrete, ready-made acceptance criterion.
9. **FK `ON DELETE CASCADE`** auto-tears-down deleted-node edges → no manual edge-cleanup phase needed.

---

## 7. Open Questions For Research (15-iteration seed)

Sharpened and answerable design questions, grouped by decision area. Each names what to read to answer it.

### Q-ARCH — Skill structure
1. **Single multi-mode SKILL.md vs thin SKILL.md + per-mode reference packets?** deep-improvement already proves a 564-line multi-lane SKILL.md works, but the merged skill is N+3 modes. Decide: one SKILL.md with mode sections + smart-router (deep-improvement §2 has a ~120-line router with 10 weighted intents), OR a thin hub SKILL.md routing to `references/<mode>/`. Resolve the keyword-collision risk: deep-improvement's generic `benchmark` intent already routes to 3 lanes; unioning 5 skills' intents needs de-confliction.
2. **Internal layout: do the 5 old subtree shapes survive verbatim (so YAML path rewrites only change the `deep-<name>/`→`deep-loop-workflows/` segment), or is the tree reorganized into `modes/<mode>/`?** This sets whether the ~270 YAML + ~198 SOURCE-FILES path edits are single-segment renames or full rewrites. Read: the 12 command YAMLs' nested path blocks + a sample per-feature SOURCE-FILES table.

### Q-AGENT — Agent surface (the single biggest scoping variable)
3. **Do the 5 native agents keep their names (`deep-context`, `deep-research`, `deep-review`, `deep-improvement`, `ai-council`), or consolidate to a unified `@deep-loop`?** Keeping names = repoint-only (low); renaming = rename + repoint + sibling-table-sync across all 15 files (high). The existing `ai-council`/`deep-ai-council` asymmetry is precedent that skill-rename does NOT force agent-rename. **Recommend resolving this FIRST** — it gates the blast radius of Surfaces B, the speckit `agent_file:` refs, and the CLAUDE.md/AGENTS.md agent list.
4. **Are `.codex/*.toml` agent mirrors hand-edited or machine-generated** (the `# Converted from:` header implies a pipeline)? Determines whether `developer_instructions`-body repoints survive or get overwritten. Read: any `.opencode/agents/` → `.codex/agents/` conversion script.

### Q-CMD — Command surface
5. **Do the 8 commands stay as 8 (only skill paths repoint), or collapse?** The `/deep:*` command surface is independent of the skill folder. Confirm the merge keeps the command surface stable. Also: does ask-ai-council's known dual-naming (`/speckit:deep-council` vs `/deep:ask-ai-council`, 134/007 limitation #2) get reconciled or carried forward?
6. **Can `deep-improvement`'s `loop-host.cjs --mode` orchestration extend to context/research/review/council, or do those assume a different orchestration entrypoint?** Tells whether the merged skill unifies on one loop-host or keeps 5 distinct YAML workflows. Read: the phase-graph shape of each `*_auto.yaml` (loop vs evaluation vs session).

### Q-BACKEND — Backend-vs-mode line (the central design call)
7. **For the 4 duplicated `reduce-state.cjs`: (a) import shared atomic-write/gate-constants from the runtime + keep per-mode reducers in workflows, or (b) fold a parameterized reducer into the runtime?** Diff the 4 function-level bodies (not just line counts: context 801L, research 1072L, review, improvement) to quantify shared-vs-domain. Confirm whether deep-context's inline `writeTextAtomic` intentionally differs (markdown vs JSON-only) from runtime `writeStateAtomic`.
8. **Should `runtime-capabilities.cjs` (byte-identical in research+review) + the `loop-lock.cjs` CLI + `verify-yaml-script-paths.sh` be promoted into `deep-loop-runtime/scripts/`?** Pure-dedup candidates. Confirm the two `runtime-capabilities.cjs` copies carry no mode-specific capability sets.
9. **Should `resolveArtifactRoot`/`emitResourceMap` move from `system-spec-kit/shared/` into the runtime, or stay a cross-skill import?** Determines whether the two-skill architecture is truly self-contained. 3 reducers depend on it.
10. **Hoist deep-improvement's frozen stop-reason/journal taxonomy into the runtime as the shared convergence/journal contract for all modes?** It already has a Lane-D translation layer and overlaps research/review convergence vocabulary. Risk: a conflicting second contract if the runtime already owns one — confirm runtime ownership.

### Q-IMPROVE — deep-improvement integration
11. **Does deep-improvement gain an `improvement` `loopType` (port plateau/trajectory onto the coverage-graph signal abstraction), or stay convergence-divergent by design?** The plateau model may not map onto coverage-graph signals at all. Read: `convergence.cjs` dispatch + improvement `improvement_config.json` stopRules.
12. **How do Lane C and Lane D fit as modes?** Lane C (diagnostic-only, benchmarks a skill, 14-script subtree, self-referential risk) and Lane D (Python loop outside the skill, external pilot, kill-switches). Decide: first-class modes, nested sub-modes, or Lane D stays logically separate with an adapter boundary. Does the merge need to coordinate a contract-version bump with the external Barter Copywriter packaging?

### Q-ADVISOR — Routing & metadata
13. **Does the merged skill keep per-mode advisor alias keys (deep-research/deep-review/deep-improvement/deep-ai-council pointing at one skill) or collapse to one key?** Determines whether routing-parity vitest fixtures need expected-output rewrites and whether prompt→mode granularity survives. Also resolve: how is deep-context currently routed (it's ABSENT from `aliases.ts`)?
14. **Is `deep-loop` an allowed family for a consumer/workflow skill** (deep-loop-runtime uses it with category `system`)? Read the `ALLOWED_FAMILIES` constant (`skill-graph-db.ts:~140`) before authoring metadata. Confirm the family collapse of 2 `sk-util` skills into `deep-loop`.
15. **Are there refs to the 5 skill-ids OUTSIDE `graph-metadata.json`** (hardcoded in advisor `projection.ts`, command YAML, deep-loop-runtime council code) that the graph scan won't catch? This slice only covered graph-metadata + Keywords + aliases.ts.

### Q-GOV — Governance & validation
16. **Five separate `feature_catalog`/`manual_testing_playbook` roots (one per mode) or one unified tree?** No common category schema exists (lifecycle vs sweep vs 4-lane vs council). Resolve ID-prefix collisions (CP- across 3 skills) — namespace per mode or keep mode-scoped sub-trees. Identify the machine-enforced count guards vs prose-only `== 48` literals that need rewriting.
17. **Does `deep-loop-runtime` already carry a `feature_catalog`/`manual_testing_playbook` whose naming convention the merged tree must inherit?** (Open Q from Iter2 — unconfirmed.)
18. **What is the acceptance gate set?** Confirm the byte-identical single-executor parity proof (123/006) applies per mode, plus: post-scan `rejectedEdges`/UNKNOWN-TARGET grep, advisor router-replay (≥3 phrasing variants per mode), Phase 0 grep gates (134/007), three-way agent-mirror parity (Path-Convention line whitelisted), and a count/presence reconciliation step (given pre-existing intra-skill drift).
19. **Disk-confirm before relying on them:** do `executor-config.ts` + `executor-audit.ts` exist in `lib/deep-loop/` (SKILL.md:126-127 lists them; glob returned 8 `.ts` without them)? Does the merged skill assume one graph DB while two exist (`deep-loop-graph.sqlite` + `council-graph.sqlite`), and does `/doctor deep-loop` cover both?
