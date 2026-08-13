---
title: "Implementation Summary: Deep-Loop Market Research (Loop-Engineering Landscape)"
description: "Final state of the 45-iteration non-converging research run: 216 catalogued repos, 174 insights, 134 contradictions, all 13 subsystems mapped, research.md synthesized; executed via a manual Shape-B driver because the fanout codex executor lacks live --search."
trigger_phrases:
  - "deep loop market research summary"
  - "phase 001 implementation summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research"
    last_updated_at: "2026-07-17T13:30:51Z"
    last_updated_by: "claude-code"
    recent_action: "Packet renumbered 034->036; description.json/graph-metadata.json regenerated"
    next_safe_action: "Operator review + phase-002 ranking/mapping from research.md §17"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/findings-registry.json"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-001-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-002 shape: Shape B, realized manually (fanout codex lacks --search)."
      - "GLM provider: zai-coding-plan/glm-5.2, --variant max, live search via opencode WebFetch."
---
# Implementation Summary: Deep-Loop Market Research (Loop-Engineering Landscape)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deep-loop-market-research |
| **Completed** | 2026-07-15 — run complete (45/45 iterations); deliverable synthesized |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A full-depth, non-converging (broadening) research run over the loop-engineering landscape, producing a subsystem-mapped synthesis to feed the phases 002/003 improvement pipeline.

**Outcomes (45 iterations, 0 parse failures):**
- **216 deduplicated, URL-verified GitHub repos** catalogued (target ≥10), each with a transferable lesson; by lineage: LUNA 121, SOL 45, GLM 50.
- **222 insights** and **134 evidence-backed contradictions** captured; confidence 176 high / 34 med / 6 low.
- **All 13 `system-deep-loop` subsystems** mapped (target ≥6): the 5 modes (deep-research/review/ai-council/improvement/alignment) + 8 runtime subsystems (convergence, state-jsonl-checkpointing, fan-out-fan-in, dedup-novelty, budget-cost, gauges-observability, locks-recovery, continuity-threading).
- **`research/research.md`** — 17-section synthesis incl. the mandatory Eliminated Alternatives (§16) and ranked recommendations for system-deep-loop (§17), plus a §18 Sources & Provenance appendix.

**Headline finding:** the ecosystem has already solved, formally, most of the runtime's hard problems — but in *adjacent* fields (durable-execution engines, stream processors, workflow schedulers, RL frameworks, eval/red-team harnesses) that agent-framework surveys rarely connect to loop control. Highest-leverage improvements are cross-domain imports, not agent-framework mimicry.

### Artifacts
`research/research.md`, `research/findings-registry.json` (full 216 index), `research/deep-research-state.jsonl` (45 lines), `research/iterations/iteration-001..045.md`, `research/deep-research-dashboard.md`, `research/deep-research-config.json`. Run harness (provenance): `scratch/deep-loop-driver.cjs`, `scratch/angle-schedule.json`, `scratch/synthesis-digest.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Shape B (sequential, findings-seeded generations) realized as a **manual hand-rolled driver**, not the `/deep:research` fan-out loop. The driver dispatched one iteration at a time — `codex --search exec` for LUNA/SOL (live `web_search`), `opencode run` for GLM (live `WebFetch`) — accumulating a deduplicated findings registry that seeded each subsequent iteration to broaden.

**Why manual (deviation, operator-authorized):** the fanout codex executor emits no top-level `--search`, so its leaves cannot mine live repos — the entire point of this phase — and patching it is out of scope (research-only). See decision-record.md ADR-002 Execution Amendment (verified → flagged → authorized, per PLAN-WORKFLOW LOCK).

**Execution sequence & gates:** doc-fix pre-flight → LUNA smoke (iter 1, validated `max` + live search + parse + real URLs) → LUNA 2-25 → Gate 1 (registry review, SOL steering) → SOL 26-35 → Gate 2 → GLM smoke (iter 36, validated `--variant max` + WebFetch self-correction) → GLM 37-45 → synthesis → close-out. Each generation resumed from `state.jsonl` (resume-safe). One transient failure (iter 35) auto-recovered via backoff/retry.

### Shape retro (CHK-113)
Shape B was effectively the only viable shape: a parallel Shape A would still have run through the same `--search`-less fanout executor and could not have mined live repos either. Manual sequential also delivered the true cross-iteration seeding Shape B is meant to provide.

### Check-in log (CHK-122)
Orchestrator gates at: LUNA smoke (pipeline validation), Gate 1 (post-LUNA, 121 repos / 13 subsystems / URL spot-check), Gate 2 (post-SOL, 166 repos / contradictions 72→110), GLM smoke (transport validation), final review (post-GLM, 216 repos). URL reality spot-checks at every gate (all 200).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001: divergent mode + max-iterations stop-policy | Guarantees full depth + steered broadening; the run never saturated (yield high through iter 45) |
| ADR-002: **Shape B, realized manually** | Fanout codex leaves lack top-level `--search` → cannot mine live repos; patching out of scope; operator-authorized. Manual also gives true cross-iteration seeding |
| ADR-003: GPT via cli-codex, GLM via cli-opencode | Operator mandate; probe confirmed `zai-coding-plan/glm-5.2` + `--variant max` + live WebFetch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 45/45 iterations, 0 parse failures | PASS — `state.jsonl` 45 lines |
| Repos ≥10 with link + lesson (SC-002) | PASS — 216 catalogued; URL sample all HTTP 200 |
| Subsystems ≥6 (SC-003) | PASS — 13/13 mapped |
| research.md 17-section incl. Eliminated Alternatives (SC-004) | PASS — `research/research.md` §16 |
| Zero writes outside spec folder (SC-005) | PASS — scoped `git status` clean (out-of-folder changes belong to concurrent packets 138/066) |
| Non-converging config (REQ-001) | PASS — `deep-research-config.json` (max_iterations=45, stop_policy=max-iterations, convergence_mode=divergent) |
| Strict recursive validation (SC-006) | `validate.sh .../036-deep-loop-innovation --strict --recursive` → **Errors: 0, Warnings: 0 → PASSED** (both parent + child; tail below) |

```
$ validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation --strict --recursive

  Folder: .../036-deep-loop-innovation                              (Level: phase)
  Summary: Errors: 0  Warnings: 0
  RESULT: PASSED

  Folder: .../036-deep-loop-innovation/001-deep-loop-market-research  (Level: 3)
  Summary: Errors: 0  Warnings: 0
  RESULT: PASSED
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Star/recency figures are model-reported** "GitHub snapshots" (directionally right, not audited). Repo *existence* is URL-verified on a sample; the full 216 are not each independently audited.
2. **Insight/contradiction citations are not exhaustively re-verified** against each primary source — phase 002 should spot-audit the arXiv/doc URLs before any load-bearing design rests on them.
3. **Relevance curation** in research.md §5–§14 is orchestrator judgment; `findings-registry.json` is the auditable ground truth (216 repos, some tangential — e.g. general data engines cited for one concept each, held in §16 Eliminated Alternatives).
4. **Catalogue breadth over depth per repo:** with 216 repos, each lesson is a one-liner; phase 002/003 must deep-read the top candidates before adapting code.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:continuation -->
## Continuation Notes (phase-002 seed)

Top improvement candidates for phase 002 ranking (from research.md §17, highest-leverage first):
1. **Multi-signal, path-covering termination** — fuse novelty with a quality/critic/execution gate; bound must span retries/handoffs/tool re-entry, not just `max-iterations`.
2. **Side-effect-receipt resume contract** — per-event replay semantics (reuse/re-execute/compensate) + versioned replay-compatibility fingerprint on the JSONL projection.
3. **Effective-independence for `deep-ai-council`** + 5-role evaluator separation (generator/detector/orchestrator/scorer/target) — 9 judges ≈ 2 effective votes.
4. **Conditional, budget-aware fan-in** + logical-branch-ID determinism + explicit partial-failure policy (strict/quorum/deadline/progressive).
5. **Cheap-checks-before-judges + regression-gated self-repair** for `deep-review`; keep raw pre-reduction scores.
6. **Semantic-community novelty + contradiction-as-versioned-event** for dedup/continuity.

Open research gaps (possible original contributions): no repo formally links RL convergence theory to LLM agent-loop termination; when self-play degenerates vs converges; which durable-execution guarantees survive LLM-step nondeterminism.
<!-- /ANCHOR:continuation -->
