---
title: "Feature Specification: Spec-Kit Template & Context Reducer Research"
description: "Multi-model deep-research charter: test whether Reducer-Engineering and Agent-Engineering harness concepts yield concrete, in-repo optimizations to system-speckit templates, documentation logic, and the context/memory system — for token reduction, plan adherence, and general optimization."
trigger_phrases:
  - "spec templates context reducer"
  - "reducer engineering speckit"
  - "template weight reduction research"
  - "context reduction deep research"
  - "plan adherence optimization research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-templates-and-context-reducer"
    last_updated_at: "2026-08-12T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "10-iter multi-model research complete; findings synthesized"
    next_safe_action: "speckit:plan ranks 1,2,4 as implementation packet"
    blockers: []
    key_files:
      - "specs/system-speckit/033-spec-templates-and-context-reducer/context/Reducer Engineering.md"
      - "specs/system-speckit/033-spec-templates-and-context-reducer/context/The $1.2M Agent Engineering skill.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-033-templates-context-reducer"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does deep-research consume spec-kit research.md.tmpl or only its own synthesis shape?"
    answered_questions:
      - "Do the two concepts yield concrete in-repo optimizations? Yes — 6 genuine gaps surfaced; most patterns already ship."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Spec-Kit Template & Context Reducer Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete — 10-iter multi-model research done; findings synthesized (report-only) |
| **Created** | 2026-08-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | system-speckit |
| **Predecessor** | None |
| **Successor** | A follow-up implementation packet, scoped by `/speckit:plan` after research converges |
| **Handoff Criteria** | 10-iteration multi-model loop completes with a ranked, evidence-cited shortlist of in-repo optimizations, each classified against existing prior art; explicit go/no-go per opportunity before any implementation packet is scoped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two external agent-engineering write-ups landed as context material here (`context/Reducer Engineering.md`, `context/The $1.2M Agent Engineering skill.md`). Their combined thesis: the gains live in the harness around the model, not the model itself — a deterministic model-free reducer between fan-out workers and a synthesis model cuts what the expensive model must read (claimed 86% cost / 78% latency drop), and a small set of harness patterns (Default-FAIL, fresh-context evaluator, self-authored handoff, external memory, complexity-matches-task) is what makes long-horizon agent work reliable.

An inline first-pass analysis this session found that most of those patterns are **already implemented** in `system-speckit` + `system-deep-loop`, often more maturely (per-mode reducers, a findings registry that already dedups and surfaces contradictions, Default-FAIL via the Iron Law, fresh-context deep-review evaluators, `handover.md`/continuity, Documentation Levels 1–3+). That pass is a **hypothesis, not a verified finding**. Before scoping implementation, we need adversarial, multi-model evidence on where these two concepts translate into concrete, un-done improvements — versus where acting on them would reinvent shipped machinery (the cargo-cult / wrong-abstraction risk the framework warns against).

Three optimization axes to test: **(a) reduce context/tokens** (the `templates/manifest/*.tmpl` set is ~5,541 LOC authoring agents must read; `memory_context` retrieval may lack a token-budget/dedup pass), **(b) improve AI plan adherence**, **(c) general optimization**.

### Purpose

Run a bounded, forced-depth, multi-model deep-research loop that produces a ranked, evidence-cited set of concrete in-repo optimization opportunities — or refutes them — so a follow-up `/speckit:plan` can scope implementation with confidence and without reinventing existing reducers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Research surface (report-only; no mutation of these during the loop):

- **Spec-kit templates** — `templates/manifest/*.tmpl`: weight, redundancy, and what an authoring agent is forced to read/fill to scaffold each level.
- **Documentation logic** — the Gate 3 classifier, Documentation Levels 1–3+, `validate.sh`, the doc-authoring workflow, and how much lands in agent context per turn.
- **Context / memory system** — `memory_context` / `memory_search` retrieval and whether a deterministic token-budget / dedup / synthesis-input reducer pass exists or would add value.
- **Prior art** — the existing `system-deep-loop/runtime/lib/*-reducers`, findings registry, and convergence machinery, so recommendations are classified against what already ships.
- **Concept mapping** — where each source concept adds value NOT already present, tagged to the three axes.

### Out of Scope

- Implementation of any fix (deep-research is report-only; changes are a separate packet).
- Modifying runtime code, templates, configs, or any file outside `research/` and this spec's generated findings fence during the loop.
- Non-speckit surfaces (sk-design, sk-code, cli-*) except as cited evidence.
- Rebuilding or duplicating the existing deep-loop reducers.

### Files to Change

During research, writes are confined to `033-.../research/**` (loop-owned state + `research.md`) and exactly one generated findings fence in this `spec.md`. No runtime/product files change in this packet.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full forced-depth run | 10 iterations across the 4-model matrix; no early convergence (`--stop-policy=max-iterations`); all lineage state files present + consistent |
| REQ-002 | Cited synthesis | `research/research.md` carries findings from all lineages, each citing `file:line` or `url` |
| REQ-003 | Prior-art classification | Every recommendation tagged {already-exists / genuine-gap / not-applicable} with concrete evidence |
| REQ-004 | Axis + surface tagging | Every finding tagged to ≥1 axis (context-reduction / plan-adherence / general-opt) and ≥1 surface (templates / doc-logic / context-system) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Ranked shortlist | Implementable opportunities ranked with rough blast-radius, ready to feed `/speckit:plan` |
| REQ-006 | Refutation list | Concept ideas that do NOT apply here, with reasons (guards against cargo-culting the source docs) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Loop completed 10/10 iterations under `stop-policy=max-iterations`; convergence report stopReason `maxIterationsReached`.
- Deep-research quality guards passed: source diversity, focus alignment, no single-weak-source.
- `findings-registry.json`, `deep-research-dashboard.md`, and per-lineage state present and reducer-consistent.
- Ranked shortlist (REQ-005) and refutation list (REQ-006) exist and are evidence-cited.
- `git status` shows no change outside `033-.../research/**` and this spec's single findings fence — proof the research touched no runtime surface.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Executor auth / availability** — cli-devin (Cognition) and cli-cursor must be authenticated; a mid-run auth failure must not silently substitute an unapproved model.
- **Tier mapping** — "Grok 4.5 max" → `cursor-grok-4.5-high` (cursor's top grok tier; no literal "max" id, bracket-effort syntax rejected). "SWE 1.7" → `swe-1-7` (full tier, not the `swe-1-7-lightning` default). Both reversible pre-launch (see §7).
- **Fan-out child-gate hang** — dispatched children that inherit an *enforced* spec-gate stall at 0% CPU (the known cli-opencode lesson). Mitigation: `:auto` pre-resolves Gate 3 for the bound folder; shared fan-out adapters own child-env injection. Watch for stalled lineages.
- **Reinvention risk** — the loop could recommend rebuilding existing deep-loop reducers; mitigated by the REQ-003 classification requirement.
- **Anchoring bias** — the session's inline first-pass could bias findings; mitigated by 4-model diversity + the REQ-006 refutation requirement.
- **Dependencies** — `/deep:research` command + `system-deep-loop/deep-research` workflow; the two context docs; read access to the speckit template/mcp-server trees.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Grok tier** — Confirm "Grok 4.5 max" → `cursor-grok-4.5-high`. (Default taken; reversible pre-launch.)
2. **SWE tier** — Confirm "SWE 1.7" → `swe-1-7` full tier vs `swe-1-7-lightning`/`-medium`. (Default `swe-1-7` taken; reversible pre-launch.)
3. **Surface breadth** — Research is scoped to templates + doc-logic + context system. Confirm no other speckit surface (e.g. the goal/continuity system) belongs in the charter.
<!-- /ANCHOR:questions -->

<!-- SPECKIT_GENERATED_FINDINGS:START -->
## RESEARCH FINDINGS (converged)

**Run:** 10 iterations · 4 lineages · 3 model families (cursor-grok-4.5, composer-2.5, deepseek-v4-flash ×2) · forced depth (no early convergence). Full synthesis: `research/research.md`.

**Verdict:** The two source concepts mostly describe machinery this repo already ships, often more maturely — all four lineages agree. Only a small set of genuine gaps survived prior-art filtering. The run also corrected this session's own first-pass: raw template LOC is a red herring (gating collapses core docs ~80–85%), and `memory_context` already enforces a token budget (both verified).

**Ranked shortlist (verified items marked ✓):**
1. ✓ Gate `research.md.tmpl` by level — it renders 944 lines at *every* level (1 always-true gate). context-reduction / templates.
2. ✓ Promote `AC_COVERAGE` to default-on — the one machine plan-adherence gate is disabled by default. plan-adherence / doc-logic.
3. Add `check-scope-adherence.sh` — SCOPE LOCK is prose-only; no validate.sh scope rule. plan-adherence / doc-logic.
4. ✓ Apply `enforceTokenBudget` in `handleMemorySearch` — present in memory_context, absent in memory_search. context-reduction / context-system.
5. Raw-`.tmpl` read guard / rendered-view helper. context-reduction / templates.
6. Collapse cross-level template source duplication (~40%) — maintainability, not agent-read tokens.

**Do NOT reinvent (refuted):** port `reduce_findings()`, cut raw template LOC as the goal, add a memory_context token budget, new Default-FAIL/fresh-evaluator/handoff frameworks, Gate-3-as-reducer, GraphRAG/Kimi split — all already-exist or category errors.

**Process finding:** cli-devin is structurally unfit for this fan-out (single-turn `-p` can't sustain the loop); write-containment prevented all damage; deepseek-v4-flash via cli-pi was the working substitute.

**Next:** `/speckit:plan` a follow-up implementation packet scoped to ranks 1, 2, 4. This packet is report-only.
<!-- SPECKIT_GENERATED_FINDINGS:END -->
