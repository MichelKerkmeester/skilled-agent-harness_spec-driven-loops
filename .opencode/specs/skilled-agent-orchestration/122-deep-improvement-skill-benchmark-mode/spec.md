---
title: "Feature Specification: deep-improvement — skill-benchmark mode + rename"
description: "Phase parent: rename deep-agent-improvement to deep-improvement and add Lane C (skill-benchmark) measuring a skill's real-world routing, unprompted reference/asset discovery, efficiency, and usefulness; multi-model deep research (001) informs rename (002), Lane C build (003), and validation/docs (004)."
trigger_phrases:
  - "122-deep-improvement-skill-benchmark-mode"
  - "skill-benchmark mode"
  - "deep-improvement skill rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phases 001-004 done; Lane C Mode A spine built + verified by full suite"
    next_safe_action: "Phase 005 three-lane docs + hardening gate"
    blockers: []
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase control + what needs done; no migration narrative (see context-index.md); heavy docs live in children. -->

# Spec 122 — deep-improvement: skill-benchmark mode + skill rename

**Track:** skilled-agent-orchestration
**Type:** Phase parent (sub-phase control file)
**Status:** In progress — Phases 001-004 complete; Phase 005 (docs + hardening) ready
**Level:** 3 (architecture-affecting; multi-phase)

---

## 1. Purpose

Evolve the `deep-agent-improvement` skill into a broader **`deep-improvement`** evaluation skill and add a third evaluation lane that benchmarks *skills themselves*.

Two coupled changes:

1. **Rename `deep-agent-improvement` → `deep-improvement`.** The skill no longer only improves agent `.md` files. It already carries Lane A (agent-improvement) and Lane B (model-benchmark), and this packet adds Lane C (skill-benchmark). The `-agent-` infix in the name is now too narrow and miscommunicates scope.

2. **Add Lane C — skill-benchmark mode.** A new evaluation lane that measures whether a *skill* is actually well-structured, well-routed, efficient, and useful **in practice** — i.e. how real AI agents discover and use it in situ — and emits actionable findings that a follow-up packet can remediate.

This is the phase-parent control file. Heavy per-phase docs (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`) live in the sub-phases where the work happens. Migration notes for the placeholder→real phase restructure live in `context-index.md`, not here.

---

## 2. Background / current state

`deep-agent-improvement` (evaluator-first bounded improvement) currently ships:

- **Lane A — agent-improvement** (`/deep:start-agent-improvement-loop`): proposal-first loop over a bounded agent `.md`, dynamic-mode 5-dimension scoring, guarded promotion/rollback.
- **Lane B — model-benchmark** (`/deep:start-model-benchmark-loop`): benchmark a model or prompt framework against repeatable fixtures; pattern or 5-dim scoring; deterministic or graded runs. Built across packet **121** (`121-deep-agent-improvement-benchmark-mode`).
- **Three pluggable seams** shared by all lanes: candidate-source, dispatcher, scorer. Entry: `scripts/shared/loop-host.cjs --mode=<lane>`. References/assets/scripts are organized by lane (`agent-improvement/`, `model-benchmark/`, `shared/`).
- Shared runtime via the `deep-loop-runtime` peer skill (executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fallback routing).

Lane C is the natural third lane: same loop shape, same three seams, a new fixture/dispatcher/scorer triple scoped to *skills*.

---

## 3. Problem statement

Skills are validated today in two ways, and both miss a critical failure class:

- **`sk-doc` / `validate.sh`** check *document shape* (sections present, frontmatter valid, README/package conformance).
- **Manual testing playbooks** (shipped inside many skills) check the *behavior the skill docs describe* — i.e. "does the workflow do what the doc says when followed."

Neither answers the question that actually determines a skill's real-world value:

> When an AI is dropped into a realistic situation that *should* trigger this skill, does it (a) get routed to the skill at the right moment, (b) find and load the *correct, useful* references/assets **without being told which file to open**, and (c) reach a good outcome efficiently — or does the skill's structure/routing create bottlenecks that make AIs miss it, mis-route, over-load context, or fail to find the asset they needed?

This is a **structure / routing / efficiency / usefulness** benchmark of the skill *as it is actually consumed*, not of the logic it describes. It is distinct from manual playbooks and from doc-shape validation. Its output must be **diagnostic and remediable** — ranked bottlenecks with concrete recommendations.

---

## 4. Goals

- **G1.** Rename `deep-agent-improvement` → `deep-improvement` across every surface (skill dir, `SKILL.md`, commands, agent + runtime mirrors, skill-advisor graph, `descriptions.json`, and all cross-references) with zero dangling references and a green skill-advisor rebuild.
- **G2.** Define Lane C ("skill-benchmark") precisely: what it measures, the fixture (scenario) schema, the unprompted-dispatch capture method, the scoring dimensions, and the remediation-report format.
- **G3.** Implement Lane C as a third lane reusing the candidate/dispatcher/scorer seams and `loop-host.cjs --mode=skill-benchmark`, with a `/deep:start-skill-benchmark-loop` command.
- **G4.** Produce a **Skill Benchmark Report** that ranks bottlenecks and gives actionable remediation a follow-up packet can act on.
- **G5.** Keep Lane A and Lane B byte-identical when no `--mode=skill-benchmark` flag is set (no regression to existing lanes).
- **G6.** Update all docs (two-lane → three-lane), README, advisor metadata, and run the standard hardening/deep-review gate.

### Non-Goals

- **NG1.** Actually *remediating* the skills that Lane C flags (Lane C is diagnostic; remediation is separate, optionally via Lane A).
- **NG2.** Replacing `sk-doc` doc-shape validation or the existing manual testing playbooks — Lane C is complementary, not a replacement.
- **NG3.** Re-architecting the shared `deep-loop-runtime` (consume it; do not redesign it).
- **NG4.** Renaming the per-lane command verbs unnecessarily (e.g. `/deep:start-agent-improvement-loop` stays — it still improves *agents*); only the **skill name** must change. Command/agent naming decisions are recorded explicitly in Phase 002.

---

## 5. Scope

**In scope:** the `deep-improvement` skill (post-rename), its commands/agent/mirrors, advisor metadata, and the new Lane C surface (references/assets/scripts under a `skill-benchmark/` domain), plus the deep-research that informs the design.

**Out of scope:** changes to skills *other than* as benchmark *targets* of Lane C; changes to `deep-loop-runtime` internals; changes to `deep-review`/`deep-research` workflows beyond consuming them.

**Frozen scope note:** per the Four Laws, scope defined here is frozen for the implementation phases. New ideas surfaced by research are recorded as follow-ups, not silently absorbed.

---

## 6. Sub-phase control

This packet decomposes into the following ordered phases. Each child owns its own canonical docs.

| Phase | Folder | Purpose | Depends on |
| ----- | ------ | ------- | ---------- |
| **001** | `001-skill-benchmark-deep-research/` | Design research: 20-iteration deep-research loop investigating Lane C design (what to measure, how to capture unprompted routing/discovery, scoring, remediation) **and** the rename impact map. Multi-model: 5× MiniMax-2.7, 5× DeepSeek-v4-pro, 5× GPT-5.5 (xhigh, fast), 5× Opus-4.8 native. **Complete.** | — |
| **002** | `002-implementation-deep-research/` | Implementation research: GPT-5.5 sweep + Opus verification turning the converged 001 design into a build-ready implementation playbook (module map, loop-host wiring, trace capture, fixtures, scorer/report, rename runbook). **Complete.** | 001 |
| **003** | `003-skill-rename-deep-improvement/` | Rename `deep-agent-improvement` → `deep-improvement` across all surfaces; advisor rebuild; no dangling refs. | 001, 002 |
| **004** | `004-skill-benchmark-mode/` | Design + build Lane C in the renamed skill: scenario fixtures, unprompted dispatcher, routing/discovery/efficiency/usefulness scorer, report, `/deep:start-skill-benchmark-loop`. | 001, 002, 003 |
| **005** | `005-validation-and-docs/` | Three-lane doc updates, README, advisor metadata, hardening/deep-review gate, end-to-end validation. | 003, 004 |

Resume policy: on a phase parent, follow `graph-metadata.json.derived.last_active_child_id`; if absent/stale, list children with statuses and pick.

---

## 7. Lane C — requirements (to be confirmed/refined by Phase 001 research)

Working hypothesis for what Lane C measures. Phase 001 deep research validates, corrects, and operationalizes these; Phase 004 implements the converged design.

- **R1 — Routing/activation accuracy.** Given a realistic prompt that *should* activate the target skill at a specific intent, does the skill-advisor + the skill's smart router select the right skill and the right intent/resource set? Measure precision/recall over a scenario suite (including near-miss negatives that should *not* activate).
- **R2 — Unprompted reference/asset discovery.** For scenarios whose correct handling *requires* a specific reference/asset, does the agent autonomously load the right file via the router **without** being told the path? Measure discovery precision/recall and the count of irrelevant loads.
- **R3 — Efficiency / bottlenecks.** Tool-calls and token cost to reach the needed resource; over-loading (too much context), under-loading (missing needed refs), ambiguous routing keys, fallback misfires, dead-ends.
- **R4 — Usefulness (ablation).** Does the skill materially improve the scenario outcome vs a skill-off baseline? (skill-on vs skill-off delta.)
- **R5 — Structural connectivity.** Orphan references/assets (present but never routable), router keys that never fire for any real scenario, missing triggers for real scenario classes, broken/over-broad routing.
- **R6 — Actionable output.** A ranked **Skill Benchmark Report**: per-dimension scores + ranked bottlenecks + concrete remediations (add trigger X, intent Y never fires for class Z, reference A orphaned, scenario class B needs asset C surfaced).

### Architecture fit (working hypothesis)

- **Fixtures** = a scenario set per target skill: realistic prompt + expected activation + expected resource(s) + correct-outcome rubric, including negatives.
- **Dispatcher** = run each scenario against an executor in a *hint-free* harness, capturing the resource-load trace and tool trace (what it opened, in what order, how many calls).
- **Scorer** = compare actual vs expected across R1–R5 → skill-benchmark dimensions; emit R6 report. Reuses the deterministic-checks + pluggable-grader shape of the Lane B 5-dim scorer.
- **Mode** = `loop-host.cjs --mode=skill-benchmark`; every state record carries `mode: skill-benchmark`; reports carry a `scoringMethod`.
- **Promotion** = Lane C is **advisory/diagnostic** by default (emits a report; does not mutate the target skill). Optional hand-off: feed findings into Lane A to actually improve a `SKILL.md`.

---

## 8. Success criteria

- **SC1.** Phase 001 deep-research loop completes (convergence or max iterations) with all state files consistent, `research/research.md` synthesized, and the multi-model split executed (5/5/5/5 across MiniMax-2.7 / DeepSeek-v4-pro / GPT-5.5-xhigh-fast / Opus-4.8-native).
- **SC2.** Rename (Phase 003) leaves zero dangling `deep-agent-improvement` references where `deep-improvement` is intended; skill-advisor rebuild + validate are green; Lane A/B commands still run.
- **SC3.** Lane C (Phase 004) runs end-to-end on at least one real target skill and emits a Skill Benchmark Report with ranked, actionable bottlenecks; Lane A/B behavior is unchanged when the mode flag is absent.
- **SC4.** Docs/README/advisor reflect three lanes; hardening/deep-review gate passes (Phase 005).
- **SC5.** `validate.sh <packet> --strict` is green at parent and per active child.

---

## 9. Risks

- **Rename blast radius.** `deep-agent-improvement` is referenced by commands, the agent + 3 runtime mirrors, the advisor graph, `descriptions.json`, the sentinel `sk-prompt-small-model`, and root docs. Mitigation: Phase 001 produces an exhaustive impact map before Phase 003 touches anything.
- **Lane C measurement validity.** "Did the AI find the right asset unprompted" must be measured without leaking the answer into the prompt. Mitigation: hint-free dispatch harness + held-out expected-resource keys; this is a primary research question.
- **Non-determinism.** AI routing varies run-to-run. Mitigation: repeatability runs + report variance, mirroring Lane B's stability evidence.
- **Scope creep into remediation.** Easy to drift from "diagnose" to "fix". Mitigation: NG1 freezes Lane C as diagnostic.

---

## 10. References

- Skill under change: `.opencode/skills/deep-agent-improvement/SKILL.md` (→ `deep-improvement`).
- Sibling packet (Lane B, template): `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/`.
- Deep-research contract: `.opencode/skills/deep-research/SKILL.md`; command `.opencode/commands/deep/start-research-loop.md`.
- Shared runtime: `.opencode/skills/deep-loop-runtime/SKILL.md`.
- Doc/validation: `.opencode/skills/sk-doc/`, `system-spec-kit` validate.

---

## 11. Open questions (for Phase 001 research)

- OQ1. Exact scoring dimensions + weights for Lane C (R1–R5) and how to normalize across skills of different shapes.
- OQ2. How to build a credible *hint-free* dispatch harness that still captures the resource-load trace.
- OQ3. Whether activation accuracy should be measured against the skill-advisor, the in-`SKILL.md` smart router, or both as separate sub-scores.
- OQ4. Scenario authoring: hand-authored vs generated-from-the-skill's-own-triggers (and how to avoid circularity).
- OQ5. The exact rename surface list + safe ordering (advisor graph + mirrors + descriptions).
- OQ6. Whether `/deep:start-skill-benchmark-loop` should reuse the model-benchmark command scaffold or get its own.
