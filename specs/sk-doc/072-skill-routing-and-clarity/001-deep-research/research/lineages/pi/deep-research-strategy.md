# Deep Research Strategy — Skill Routing Shape and Doc Clarity

## 1. OVERVIEW

### Purpose

Persistent brain for the `pi` lineage of the skill-routing-and-clarity deep research run. It records what to investigate, what worked, what failed, and where the next iteration should focus.

### Usage

- **Init:** populated with the topic, key questions, known context and boundaries.
- **Per iteration:** this agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked / What Failed, answered questions, carried-forward questions, ruled-out directions and Next Focus.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

### Question Injection Surface

External questions can be appended to `inbox.jsonl` beside this file; the reducer promotes them into the question registry.

---

## 2. TOPIC

Skill routing shape and doc clarity across every skill and hub under `.skilled/skills`, plus the command and agent docs that teach routing. The sk-code advisor report at `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md` is the starting hypothesis to test, not an assumption: JSON decides stage one, one hub `ROUTER.md` decides leaf files, script resolvers handle the rest, each mode `SKILL.md` keeps a short routing section with the machine block moved to an appendix, no `ROUTER.md` per mode, JSON-only viable only as a hybrid.

Lineage scope (from `steer.md`): the hubs `sk-code`, `sk-doc`, `sk-design` and `system-deep-loop`, every mode packet inside them, and their root `ROUTER.md`, `hub-router.json` and `mode-registry.json`; plus for the tooling question `parent-skill-check.cjs`, `verify-router-sync.cjs`, `router-replay-lib.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs`, `build-artifacts.cjs`, `package_skill.py`, `check-rule-copies.js`, the create-skill and parent-skill templates/canon under sk-doc, and the doctor router-reach workflow.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which mechanisms make each of the five routing decisions in sk-code, sk-doc, sk-design and system-deep-loop, and where is each decision restated?
- [x] Where have restated copies of the same routing decision drifted, and which copy is authoritative?
- [x] Which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current shape, and what would each proposed change break?
- [x] Which routing shape wins for hubs, for mode packets and for standalone skills: per-mode ROUTER.md, one hub ROUTER.md, the advisor hybrid, or JSON-only?
- [x] What readability defects exist per skill, with quoted passages?
- [x] What phased implementation plan (order, risk, rollback) delivers the winning shape?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Implementing any of the proposed changes. This is read-only research; only files under the lineage directory are written.
- Covering the standalone skills, the command and agent docs, the Hermes/runtime mirrors, or the advisor's graph-metadata inputs. `steer.md` assigns those to the sibling lineage.

---

## 5. STOP CONDITIONS

- Five iterations completed (`stopPolicy: max-iterations`).
- All six key questions answered with `path:line` evidence read in this run.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which mechanisms make each of the five routing decisions in sk-code, sk-doc, sk-design and system-deep-loop, and where is each decision restated?
- Where have restated copies of the same routing decision drifted, and which copy is authoritative?
- Which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current shape, and what would each proposed change break?
- Which routing shape wins for hubs, for mode packets and for standalone skills: per-mode ROUTER.md, one hub ROUTER.md, the advisor hybrid, or JSON-only?
- What readability defects exist per skill, with quoted passages?
- What phased implementation plan (order, risk, rollback) delivers the winning shape?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q3, Q4, Q5 (per-skill), Q6. (iteration 1)
- Q1 for sk-doc, sk-design, system-deep-loop (iterations 2-3). (iteration 1)
- Q2 for those hubs. (iteration 1)
- Q1/Q2 for sk-design and system-deep-loop. (iteration 2)
- Q3 (enforcement and breakage), Q4 (verdict), Q5 (per-skill readability), Q6 (plan). (iteration 2)
- Q5 (per-skill readability with quotes) — three hubs covered across iterations 1-3, the remaining packet-level reading is partial. (iteration 4)
- Q6 (phased plan). (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- `steer.md` in this lineage splits the work with a sibling lineage and fixes the five-iteration plan.
- The starting hypothesis document is `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md`.
- The packet's own config records `maxIterations: 5` for this lineage, `stopPolicy: max-iterations`, `convergenceThreshold: 0.05`.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/{sk-code,sk-doc,sk-design,system-deep-loop}/`, their per-mode `SKILL.md` files, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, and the scripts under `.skilled/skills/system-deep-loop/runtime/scripts/` and `.skilled/skills/system-spec-kit/runtime/`.
- Integration points: the compiled-route chain (`build-artifacts.cjs` → `compiled-route.cjs` → `compiled-route-guard.cjs`), `router-replay-lib.cjs` → `verify-router-sync.cjs`, `parent-skill-check.cjs`, `package_skill.py`, `check-rule-copies.js`, doctor `router-reach`.
- Constraints: read-only outside the lineage; every finding needs `path:line` read in the iteration that cites it.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under `stopPolicy: max-iterations`)
- Per-iteration budget: 24 tool calls, 20 minutes
- Progressive synthesis: true; `research.md` is workflow-owned
- Machine-owned sections: reducer controls Sections 3, 6, 7–11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-28T07:26:00Z
