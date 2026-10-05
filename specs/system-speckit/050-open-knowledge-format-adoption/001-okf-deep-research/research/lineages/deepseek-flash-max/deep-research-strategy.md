---
title: Deep Research Strategy - OKF Adoption Verdict
description: Session tracking for the ten-iteration OKF v0.2 versus system-spec-kit comparison run (lineage deepseek-flash-max).
trigger_phrases:
  - "okf adoption verdict"
  - "open knowledge format comparison"
  - "denkseite deepseek flash max lineage"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - OKF Adoption Verdict

## 1. OVERVIEW

### Purpose

Persistent brain for the ten-iteration comparison of Google's Open Knowledge Format (OKF v0.2) against system-spec-kit, ending in a ranked adopt / adapt / reject verdict list for phase 002 of the 050-open-knowledge-format-adoption packet.

### Usage

- Init: topic, key questions, known context and boundaries populated from the Research Charter in `specs/system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research/spec.md`.
- Per iteration: one charter focus per iteration, findings written to `iterations/iteration-NNN.md`, one canonical state record appended to `deep-research-state.jsonl`, one delta file at `deltas/iter-NNN.jsonl`; Next Focus advanced here.
- Mutability: analyst-owned sections stable; machine-owned sections refreshed by this executor after each iteration (detached fan-out lineage: the executor IS the reducer).
- Protection: config immutable after init; state log append-only; iteration files write-once; `research.md` mutable until synthesis.

---

## 2. TOPIC
Decide, for each idea in Google's Open Knowledge Format (OKF v0.2), whether system-spec-kit should adopt, adapt or reject it, by comparing OKF with how system-spec-kit works today.

---

## 3. KEY QUESTIONS (remaining)

- [x] Q1. Spec-kit anatomy: what does a spec packet contain per level, how do templates, anchors and phase-parent packets shape it? (answered iteration 1)
- [x] Q2. Spec-kit metadata: which frontmatter fields, `description.json`, `graph-metadata.json` and `_memory.continuity` fields exist and which validator enforces each? (answered iteration 2)
- [x] Q3. Spec-kit search and navigation: what can an agent find today via the trigger index, ripgrep recipes, skill advisor, `/speckit:resume`, graph traversal? (answered iteration 3)
- [x] Q4. OKF specification deep read: reserved filenames, concept types, `sources`, `generated`, `verified`, `status`, `stale_after`, index and log files, conformance, attested computations. (answered iteration 4)
- [x] Q5. OKF ecosystem: Google Cloud article, Knowledge Catalog, reference agent, visualizer, community write-ups, llms.txt, Agent Skills, AGENTS.md. (answered iteration 5)
- [x] Q6. Crosswalk: field-by-field and file-by-file mapping between spec-kit and OKF - matches, gaps on both sides, conflicts. (answered iteration 6)
- [x] Q7. Candidate ideas and feasibility: typed concepts, per-folder index files, change log file, provenance and freshness fields, bundle export/import - touched surfaces, callers, validators, effort, benefit. (answered iteration 7)
- [x] Q8. Compatibility and blast radius: effect on the 4,548 existing `spec.md` files, validators, templates, hooks, trigger index, advisor; additive versus migration. (answered iteration 8)
- [x] Q9. Adversarial counter-case: OKF weaknesses, where spec-kit is already better, cheaper alternatives. (answered iteration 9)
- [x] Q10. Synthesis: ranked recommendations each adopt / adapt / reject with evidence, effort, risk, proposed shape for phase 002. (answered iteration 10)

---

## 4. NON-GOALS

- Editing spec-kit code, templates or validators (phase 003 owns edits).
- Designing the adopted changes in detail (phase 002 owns design).
- Any write outside this lineage directory.

---

## 5. STOP CONDITIONS

- Hard stop at maxIterations = 10 (config.stopPolicy `max-iterations`): every iteration runs, convergence is telemetry only.
- All ten charter focuses covered with cited evidence.
- Synthesis written with stopReason `maxIterationsReached`.

---

## 6. ANSWERED QUESTIONS
- Q1: Packet anatomy mapped (iteration 1).
- Q2: Metadata surfaces mapped (iteration 2).
- Q3: Navigation mapped (iteration 3).
- Q4: OKF v0.2 spec read end-to-end and verified current (iteration 4).
- Q5: Ecosystem mapped (iteration 5).
- Q6: Crosswalk complete (iteration 6).
- Q7: Feasibility priced (iteration 7).
- Q8: Blast radius mapped (iteration 8).
- Q9: Adversarial case closed: in-place adoption, import, `verified`, and index/log families rejected; every adopted idea is separable from OKF (iteration 9).
- Q10: Synthesis ranked R1-R8 with effort/risk and phase-002 shape; net relationship `interoperate, don't absorb` (iteration 10).

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Directory-scoped `rg -n` with `--glob '!**/scratch/**'` returns file:line evidence fast across `.skilled` and `specs`. (iteration 0, init)
- `curl` to raw.githubusercontent + the GitHub API produced verifiable upstream evidence (sha256 equality, tree, implementation, practice bundles). (iteration 4)
- Live-running the repo's read-only tooling (trigger-index lookup, rg recipes) produced observed-behavior evidence instead of reading about it. (iteration 3)
- The adversarial iteration 9 blocked an early pro-adoption synthesis; the separable-ideas framing came from it. (iteration 9)

---

## 8. WHAT FAILED
- Web search engines were unavailable (no API key); ecosystem discovery relied on GitHub API search and known URLs. Coverage limit, recorded. (iteration 5)
- Mapping the generated metadata pair to OKF structures failed on every attempt: generated files have no OKF representation. (iterations 6-7)

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS
- Bundle import: generated sidecars unmappable; every validator fires on imported docs. (iterations 7-8)
- `verified` trust tiers: self-declared actors, advisory by spec text, protocol deferred. (iteration 9)
- Per-folder `index.md`/`log.md`: drift class; fail-closed index-walker conflict; duplicates existing navigation. (iterations 7-8)
- Required OKF frontmatter on the corpus: migration class against 23,413 docs. (iteration 8)

---

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: OKF in-place adoption (argued to conclusion, iteration 9); import (structurally blocked, iteration 7)
- Pivot lineage: none - linear charter execution with an adversarial angle at iteration 9
- Remaining frontier: phase-002 design choices R2 type vocabulary and R3 consumer

---

## 11A. CARRIED-FORWARD OPEN QUESTIONS
- R2 (export) needs a type-vocabulary decision in phase 002.
- R3 (freshness) ships only if doctor or resume adopts it as consumer.
- UNKNOWN: production-scale OKF adoption beyond star counts and Knowledge Catalog.

---

## 11. NEXT FOCUS
None - maxIterations reached. Terminal outputs: `research.md` (ranked R1-R8; stopReason maxIterationsReached), `iterations/`, `deltas/`, `resource-map.md`, `findings-registry.json`, `deep-research-dashboard.md`.
<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers:
  - `.skilled/skills/system-spec-kit/SKILL.md` (593 lines, read at init)
  - `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` (370 lines, read at init)
  - `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` (318 lines, read at init)
  - `scratch/seed/okf-SPEC.md` (1006 lines, v0.2 read at init)
  - `scratch/seed/okf-README.md` (232 lines, read at init)
- Reuse candidates: `system-deep-loop/deep-research` state formats; `system-spec-kit/runtime/cli/retrieval` trigger index; `runtime/cli/spec/validate.sh` KIT validator.
- Integration points: spec packet docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`), `description.json`, `graph-metadata.json`, `_memory.continuity`, `goal.md`; trigger index generator; skill advisor hook.
- Constraints and risks: research only, no writes outside the lineage; every repository claim needs `file:line`, every web claim a URL; single-model lineage (mitigated by adversarial iteration 9 and steer.md reviews).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only; stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 15 minutes
- Progressive synthesis: true
- `research.md` ownership: this executor writes the lineage synthesis (workflow-owned); the packet-level merge is phase_synthesis of the parent run
- Lifecycle branches: `resume`, `restart` (not needed for this detached run)
- Machine-owned sections: this executor refreshes Sections 3, 6, 7-11A after each iteration
- Current generation: 1
- Started: 2026-10-04T05:44:02Z
