---
title: "027 Gem Team Adoption Matrix — Phase 007 Synthesis"
parts: [gem-team-adoption-001-019]
iterations: "001-024 (24): 13 analysis + 5 adversarial + 1 critic [gpt-5.5-fast] + 5 cross-model extension [MiMo-V2.5-Pro]"
executor: "cli-opencode — openai/gpt-5.5-fast --variant high (iters 001-019) + xiaomi-token-plan-ams/mimo-v2.5-pro --variant high COSTAR (iters 020-024); read-only dispatch, orchestrator-written state (Gate-3-safe, race-safe, compaction-safe)"
session: "2026-06-06-027-gem-team-adoption-matrix"
research_subject: "external/gem-team-main (mubaidr/gem-team) — self-learning multi-agent orchestration framework"
status: "complete; verdict = VALIDATE-AND-INCREMENTALLY-REFINE — cross-model-corroborated (MiMo agrees); P1 re-scoped to dispatch-input primary"
depth: "Exhaustive (operator-selected)"
---

# 027 Gem Team Adoption Matrix — Phase 007 Synthesis

**Question.** Which Gem Team mechanisms should the spec-kit ADOPT / ADAPT / REJECT, and what independently-shippable sub-packets should 027 spawn — without rebuilding what the system already has?

---

> **Separate-packet note + cross-phase reconciliation.** Phase 007 (gem-team) is a **self-contained research packet, numbered 001-024**, independent of the other 027 research phases (it does not continue any global iteration counter). It ran alongside two operator-launched sibling packets — `006-peck-source-deep-mining` (peck-master) and `008-caura-memclaw-fleet-memory-teachings` (MemClaw, still running at synthesis time) — which study other external frameworks. The only cross-phase coupling is the **proposed new 027 child numbers**, now **reconciled collision-free**: `001` ← 006-peck, `009` ← 007-gem-team (this packet, **final**), `015` ← 008-caura-memclaw. See `sub-packet-proposals.md` §Placement for the full table.

## 1. Executive Summary

**The spec-kit is mature; Gem Team mostly validates it. The genuine net-new is incremental, not transformative.** Across 13 analysis angles, every high-value claim was downgraded by an adversarial pass: each "new" mechanism turned out to overlap an existing spec-kit surface (deep-loop fan-out, the @context **Context Package**, @code **escalation classifiers**, @debug **5-phase** method, sk-code-review **security minimums**, **Logic-Sync** precedence, deep-improvement **evaluator-first** skill creation, the confidence/halt framework). What survives is a short list of **typed/uniform refinements and small scoped gates** — adapters over existing contracts, not new subsystems.

Three headline results:

1. **No transformative adoption exists.** Gem Team's orchestration, memory, verification, no-self-review, planner DAG, and 2-agent wave ceiling are already matched or exceeded by the spec-kit *(iters 001-002; F-001-01/03, F-005-05)*. The XCE corpus was exhausted; this run confirms the spec-kit's architecture is competitive with a purpose-built peer framework.
2. **The strongest net-new is a typed agent I/O adapter.** Gem's uniform `status/confidence/failure_type` output envelope + per-agent dispatch schemas are the one thing the spec-kit does in *scattered prose* rather than a typed contract *(iter 011, ratio 0.83 — highest)*. Even this is an **adapter/header over existing structured returns**, never a JSON-only rewrite *(iter 018, iter 011 §ruled-out)*.
3. **The adversarial round changed the answer.** All 9 top candidates were downgraded (ADOPT→ADAPT, strong→narrow). A naive first-pass would have proposed ~9 sub-packets; the honest, evidence-checked set is **3 worth building + a short tags/aliases/notes list** *(iters 014-019)*.

**Bottom line for 027:** a small, high-confidence refinement program — typed dispatch/output adapter, a scoped debug-handoff + boundary-contract gate, and a pre-mortem/reviewer-focus planning hint — plus several "tag/alias/defer" items. See `sub-packet-proposals.md`.

---

## 2. Method & Convergence

- **Executor:** `cli-opencode openai/gpt-5.5-fast --variant high`, dispatched READ-ONLY (the project Gate-3 HARD BLOCK intercepts opencode file writes), orchestrator wrote all iteration/delta/state artifacts. Parallel fan-out in batches of ~5 background processes.
- **Evidence rule:** every claim cites `[SOURCE: file:line]` on BOTH the gem-team and spec-kit sides; REJECT requires citing the existing spec-kit equivalent.
- **newInfoRatio trend (001-013):** 0.18, 0.24, 0.42, 0.38, 0.64 · 0.78, 0.64, 0.58, 0.31, 0.74 · 0.83, 0.46, 0.72 — **high throughout, no convergence-to-zero**: each angle found genuine signal, justifying the Exhaustive depth. Convergence came from the **adversarial round** collapsing that signal to narrow slices, not from the analysis angles drying up.

---

## 3. Gem-Team Adoption Verdict Matrix (final, post-adversarial)

| # | Angle | Gem mechanism | Spec-kit equivalent (already-have) | Final verdict | Surviving net-new slice |
|---|-------|---------------|-------------------------------------|---------------|--------------------------|
| 001 | Orchestration & waves | pure-delegator orchestrator, routing matrix, ≤2 concurrent | @orchestrate delegation-first; 2-agent ceiling; deep-loop fan-out [orchestrate.md:20-34,267-278] | **REJECT** | routing-matrix doc consolidation (cosmetic) |
| 002 | Memory architecture | typed memory (facts/patterns/gotchas/failure_modes/decisions/conventions), dedup, self-validate | memory MCP: causal graph, learning reducers, semantic triggers, importance tiers | **REJECT (mostly)** | `gotcha`/`failure_mode` as retrieval **tags** (XS) |
| 003 | Context envelope | progressive per-plan `context_envelope.json` snapshot + read-directives | @context **Context Package** + `payloadContract` [context.md:230-284] | **ADAPT-S** | typed dispatch **header** + read-directive buckets layered on existing package |
| 004 | Knowledge layers | PRD/AGENTS/Memory/Skills/Derived + priority order | spec-folder doc levels; **Logic-Sync** precedence | **ADAPT-low** | compact cross-source arbitration note (preserve Logic-Sync) |
| 005 | Verification gates | reviewer (OWASP/secrets), critic, contract-first, TDD, no-self-review | sk-code Iron Law; sk-code-review security minimums; @review Hunter/Skeptic/Referee | **mixed** | **contract-first scoped to API/schema** (005 ADOPT→ADAPT); critic-as-mode |
| 006 | Diagnose-then-fix | 4-level machine-checked `debugger_diagnosis` gate | @debug 5-phase + debug-delegation.md [debug.md:142-159] | **ADAPT-narrow** | typed **handoff schema** (root_cause/target_files/fix_recommendations) when handoff crosses agents |
| 007 | Auto-skills | auto pattern→SKILL.md, reuse≥2× / conf≥0.90 | /create + deep-improvement (evaluator-first) | **ADAPT-narrow** | run-learning **discovery trigger** → packet-local /create candidate (shadow only) |
| 008 | Task classification | 7-type × complexity → MICRO/FAST/full | doc Levels 1-3 + gate skips + trivial exemptions | **REJECT (mostly)** | optional explicit task-type→track table (cosmetic) |
| 009 | Token efficiency | concise output, file-based, self-validating cache | Code Mode ~98% reduction; advisor token caps; file-based spec folders | **REJECT** | — |
| 010 | Pre-mortem / resilience | typed failure taxonomy + per-type retry + pre-mortem | confidence/halt/escalate/Logic-Sync + deep-loop recovery | **ADAPT-narrow** | mandatory **pre-mortem field** for med/high work |
| 011 | Standard output contract | uniform `status/confidence/failure_type` + per-agent input schemas | @code RETURN+escalation classes [code.md:270-310]; @review gates | **ADAPT (strongest)** | typed **dispatch schema + output envelope adapter** preserving markdown bodies |
| 012 | CHANGELOG mine | research-findings cache, plan-template cache, failure-log reinjection, a11y snapshots | mostly niche | **mostly REJECT** | focus-scoped research lookup before broad memory expansion (small) |
| 013 | Distribution (APM) | single-source → multi-harness auto-deploy | per-runtime dirs (.opencode/.claude/.codex) [CLAUDE.md §5] | **REJECT** | (optional future) drift-control generator |

---

## 4. Adversarial Outcomes — every top candidate downgraded (iters 014-018)

| Candidate | First-pass | Adversarial result | Why (counter-evidence) |
|-----------|-----------|--------------------|------------------------|
| Contract-first ordering | ADOPT | **downgrade → ADAPT (scoped)** | @code/sk-code already verify + targeted tests; scope to API/schema only, not universal TDD [code.md:180-188] |
| Diagnose-then-fix 4-level | ADAPT-strong | **downgrade → ADAPT-narrow** | @debug 5-phase already exists; keep only a typed cross-agent handoff schema [debug.md:142-159,481] |
| Context-package snapshot | ADAPT-lead | **downgrade → ADAPT-S** | @context Context Package + payloadContract already exist; add only a typed dispatch header |
| Memory taxonomy | ADAPT | **downgrade → ADAPT-XS** | contextType/importanceTier/memoryType/causal already exist; add only `gotcha`/`failure_mode` tags |
| Failure taxonomy + pre-mortem | ADAPT-strong | **downgrade → ADAPT-narrow** | failure classes already scattered-present; keep only a pre-mortem field |
| Auto-skills thresholds | ADAPT | **downgrade → ADAPT-narrow** | deep-improvement evaluator-first already gates creation; keep only the discovery trigger (shadow) |
| Knowledge precedence | ADAPT-high | **downgrade → ADAPT-low** | Logic-Sync already arbitrates; add only a clarifying matrix |
| Security standing gates | ADAPT | **downgrade → ADAPT-narrow** | sk-code-review security_checklist.md exists; add only OWASP **naming** + discoverability |
| Typed I/O contract | ADOPT | **downgrade → ADAPT** | @code/@review/@context already structured; build an **adapter**, not a rewrite |

**Read:** the spec-kit is consistently more mature than each angle's first pass assumed. The value of Gem Team is **confirmation + a punch-list of typed/uniform polish**, not new capability.

---

## 5. Completeness Critic (iter 019) — gaps, counter-argument, drops

**Coverage gaps the 13 angles missed (net-new, worth noting):**
- **Specialized leaf-agent mode-checklists** — gem-code-simplifier (behavior-preserving simplification), gem-browser-tester (E2E evidence w/ console/network/a11y), gem-devops (deploy approval/health-check). Useful slice = *mode presets/checklists for sk-code surfaces*, not new agents [gem-code-simplifier.agent.md:46-63; gem-browser-tester.agent.md:46-61].
- **PRD write-back / `prd_update_recommended`** — a *requirements-drift write-back recommendation field* for planner/subagent outputs (we already have richer spec folders) [gem-planner.agent.md:106-107].
- **Planner self-scoring `quality_score` / `reviewer_focus`** — a low-cost way to **route review attention** without adding gates [gem-planner.agent.md:108-110; CHANGELOG.md:65-74]. *(Elevated to a sub-packet ingredient.)*

**Strongest counter-argument:** maintenance cost + schema/gate creep. Gem Team is compact YAML/JSON-first; the spec-kit relies on richer spec-folder governance, evidence-heavy markdown contracts, and Logic-Sync. Adopting Gem's typed-everything risks flattening evidence-rich outputs into brittle protocol compliance. → **Every adoption must be an adapter/optional-mode, never a replacement.**

**Critic drops:** full OWASP packet (→ naming/alias), memory-taxonomy packet (→ tags), APM/distribution packet (→ drop/defer). Auto-skills → proposal-only, low priority.

---

## 6. What the spec-kit ALREADY has (the dedup that drives most REJECTs)

| Gem feature | Spec-kit equivalent | Evidence |
|-------------|---------------------|----------|
| Pure-delegator orchestrator | @orchestrate (no direct impl/explore) | orchestrate.md:20-34 |
| ≤2 concurrent waves | default 2-agent parallel ceiling | orchestrate.md:267-278 |
| Wave fan-out | deep-loop isolated lineages + merge/salvage | deep-loop-runtime/SKILL.md:165-170 |
| Memory typing + dedup | causal graph, learning reducers, importance tiers, contextType/memoryType | system-spec-kit memory MCP |
| Context handoff object | @context **Context Package** (memory+findings+gaps+evidence) | context.md:230-284 |
| Failure classes | @code escalation classifiers (UNKNOWN_STACK/SCOPE_CONFLICT/LOGIC_SYNC/VERIFY_FAIL) | code.md:303-310 |
| Diagnose-then-fix | @debug 5-phase + debug-delegation.md | debug.md:142-159 |
| No-self-review | @review read-only, "cannot review code they helped write" | review.md:424-427 |
| Security review | sk-code-review security minimums + checklist + /security-review | sk-code-review/references/security_checklist.md:24 |
| Knowledge precedence | Logic-Sync Protocol | CLAUDE.md §4 |
| Gated skill creation | deep-improvement (evaluator-first) + /create | deep-improvement/SKILL.md |
| Confidence framework | thresholds + halt/escalate | CLAUDE.md §4 |

---

## 7. Recommended Sub-Packets

Three worth building (detailed in `sub-packet-proposals.md`):

- **P1 — Typed agent dispatch + output-envelope adapter** (strongest). A typed dispatch header + normalized `status/confidence/failure_type` envelope as an **adapter** over @code RETURN / @review gates / @context Context Package; preserve markdown evidence bodies; add numeric-alongside-qualitative confidence + read-directive buckets.
- **P2 — Scoped pre-execution & handoff gates.** (a) machine-checkable **debug-handoff schema** when a diagnosis crosses agents; (b) **boundary contract-first** check for API/schema/integration changes only; (c) mandatory **pre-mortem field** for medium/high work. All optional-mode, scoped — no universal ceremony.
- **P3 — Planner reviewer-focus + requirements-drift hint** (lowest cost). Add `reviewer_focus`/`quality_score`-style hints to route review attention + a `spec_drift / update_recommended` write-back field. Docs/contract-level.

Deferred to tags/aliases/notes (not packets): `gotcha`/`failure_mode` memory tags; OWASP naming + /security-review discoverability; knowledge-source arbitration matrix note; run-learning skill-discovery shadow trigger; specialized-agent mode checklists; APM distribution.

---

## 8. Negative Knowledge / Ruled-Out

- **Do not** adopt JSON-only agent output — review/context need rich markdown evidence [iter 011 ruled-out].
- **Do not** import Gem's failure taxonomy wholesale — map existing escalation/severity classes instead [iter 011; 016].
- **Do not** mandate universal TDD/test-first — scope contract-first to boundaries [iter 014].
- **Do not** make a new canonical `memory_type` for gotcha/failure_mode — fights existing schemas; use tags [iter 015].
- **Do not** adopt APM packaging / marketplace / release automation — premature for an in-repo system [iter 013; 019].
- **Do not** add autonomous skill creation — deep-improvement's evaluator-first gate already covers it [iter 017].

---

## 8b. Phase 2 — MiMo-V2.5-Pro Cross-Model Extension (iters 020-024)

A second pass with a **different executor** (`xiaomi-token-plan-ams/mimo-v2.5-pro --variant high`, COSTAR-framed) — 4 coverage-gap angles the critic flagged + 1 cross-model validation. MiMo read *deeper* into the spec-kit than gpt-5.5 (surfacing `code_quality_checklist.md`, `removal_plan.md`, the `feature_catalog` flag governance). **Low newInfoRatios throughout (0.05 / 0.15 / 0.25 / 0.25 / 0.15) independently corroborate "validate-don't-transform."**

**Coverage-gap angles (020-023):**
- **RQ-M1 specialized-agent checklists (0.05):** 17/20 REJECT — already-covered or infra/deploy *out-of-scope-by-design* (sk-code is a spec+workflow+review framework, not a deployment pipeline; the `DEPLOYMENT` intent has no RESOURCE_MAP by design). Only 2 tiny ADAPT gaps: an ordered **simplification-mode checklist** + an **a11y audit schedule**. Not sub-packet-grade.
- **RQ-M2 PRD write-back (0.15):** `prd_update_recommended` + Phase-4 decisions→PRD. PARTIAL vs our continuity; supports P3's `spec_drift` field but small.
- **RQ-M3 planner intelligence (0.25):** confirms `quality_score` / `reviewer_focus` → P3.
- **RQ-M4 CHANGELOG signals (0.25):** minor new ops signals — **plan-template cache + high-confidence bypass** (persist DAG when conf≥0.85), **shared-component pre-save check**, **failure-log reinjection into re-delegated tasks**. Defer-tier.

**RQ-MV cross-model validation (024) — the high-value result.** MiMo independently **AGREES the overall verdict holds**, and corrects/sharpens the sub-packets:
- **P1 over-claimed the OUTPUT-side gap** — @code RETURN already has typed escalation enums + confidence bands [code.md:275-310] and 7 typed dispatch *modes* [code.md:117-128]; the real gap is the **dispatch-INPUT envelope** (`dispatch_id` / typed `task_definition` / `context_snapshot`). → **re-weight P1 to dispatch-header-primary, output-envelope-secondary.**
- **MISSED architectural gap:** Gem's `context_envelope.json` is a **progressive orchestrator-maintained cache** enriched between waves [gem AGENTS.md rule 9]; our Context Package is a **one-shot retrieval artifact** [context.md:230-232]. Defensible to keep ours — but it should be an *explicit ruled-out alternative*, not ignored.
- **P2 is a DOWNSCALE, not an invention:** Gem's orchestrator pre-wave gate *machine-checks* `debugger_diagnosis` (conf<0.85→escalate) — *stronger* than P2. Frame P2 honestly as adopting a **narrower** version of an existing Gem mechanism.
- **P3 confirmed** — genuinely absent, correctly L1.
- **Flagged unverified claim:** the "sk-code-review covers OWASP" downgrade (§6) was asserted *without* checking the checklist's actual OWASP-category coverage — verify before relying on it.

**Net effect:** verdict CORROBORATED by a second, deeper-reading model; P1 re-scoped (dispatch-input primary + an explicit snapshot-vs-progressive-enrichment decision); P2 reframed as an honest downscale; one claim flagged for verification. No new sub-packets — the 3 stand, refined.

---

## 9. Convergence Report

- **Stop reason:** all planned iterations complete + adversarial convergence (every candidate downgraded to a stable narrow slice; critic confirmed the surviving set) + cross-model corroboration (a second model independently reproduced the verdict with low new-info).
- **Iterations:** 24 total — 001-013 analysis (13), 014-018 adversarial verify (5), 019 completeness critic (1) [gpt-5.5-fast]; 020-023 coverage-gap angles + 024 cross-model validation (5) [MiMo-V2.5-Pro].
- **newInfoRatio:** high across analysis (0.18-0.83, mean ≈0.51); adversarial mean ≈0.47 (each refuted/narrowed real claims); critic 0.44; MiMo extension LOW throughout (0.05-0.25, mean ≈0.17) — independent corroboration that little net-new remains.
- **Method note:** TWO-model — gpt-5.5-fast (primary, 001-019) + MiMo-V2.5-Pro (cross-model, 020-024, COSTAR-framed); read-only dispatch + orchestrator-written state. Load-bearing claims carry direct `file:line` citations in the per-iteration `iterations/iteration-NNN.md` + raw `prompts/iteration-NNN.out`.
- **Confidence:** HIGH on the "validate + incrementally refine" verdict and the 3-sub-packet set — the adversarial + critic passes de-risked over-claiming, and a second model (MiMo) independently agreed while sharpening P1 (dispatch-input primary) and honestly reframing P2 (downscale of an existing Gem gate).

---

## 10. References

- Per-iteration evidence: `iterations/iteration-001.md` … `iteration-024.md` (+ raw `prompts/iteration-NNN.out`).
- Strategy / charter: `deep-research-strategy.md`. State log: `deep-research-state.jsonl`.
- Deliverable: `sub-packet-proposals.md`.
- Research subject: `../../external/gem-team-main/` (README.md, AGENTS.md, .apm/agents/*.agent.md, CHANGELOG.md).
- Prior canonical synthesis (superseded scope): `../005-live-rescope-coco-purge/research.md` (XCE corpus exhausted).
