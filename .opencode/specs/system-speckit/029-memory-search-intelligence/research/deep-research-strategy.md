---
title: Deep Research Strategy - System Speckit Alignment Audit
description: Runtime strategy for auditing system-speckit catalogs, playbooks, skill assets, docs, benchmarks, and stress tests against recent specs and implementation work.
trigger_phrases:
  - "system speckit alignment audit"
  - "feature catalog playbook alignment"
  - "skill docs benchmark coverage audit"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - System Speckit Alignment Audit

## 1. OVERVIEW

### Purpose

Audit documentation, skill assets, catalogs, playbooks, benchmarks, and stress tests against recent system-speckit backend, integration, and command implementation work.

### Usage

- Init: seeded by the `/deep:research:auto` workflow for the bound packet.
- Per iteration: each leaf pass reads the next focus, writes iteration evidence, and appends state/delta records.
- Protection: machine-owned sections may be refreshed by reducers or later workflow steps.

---

## 2. TOPIC

Audit whether all feature catalogs, manual testing playbooks, skill references, skill assets, SKILL.md files, READMEs, code READMEs, benchmarks, and stress tests are fully aligned with the last ~50 specs and implementation work for system-speckit backend code, integration, and commands. Find every misalignment, staleness, and coverage gap; explore multiple angles and broaden them across iterations.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Which recent specs and implementation packets define the authoritative behavior for system-speckit backend code, integrations, and commands?
- [ ] Which feature catalogs, manual testing playbooks, skill references, skill assets, SKILL.md files, READMEs, code READMEs, benchmarks, and stress tests describe outdated or missing behavior?
- [ ] Where do docs claim coverage that tests, benchmarks, stress cases, or code no longer support?
- [ ] Where does implemented behavior lack corresponding catalog, playbook, README, skill, benchmark, or stress-test coverage?
- [ ] Which misalignments are highest severity because they affect command routing, MCP/tool contracts, memory retrieval, code graph, skill advisor, or deep-loop workflows?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement fixes.
- Do not rewrite catalogs, playbooks, READMEs, skills, benchmarks, or tests.
- Do not broaden beyond system-speckit backend code, integrations, command surfaces, and directly supporting docs/assets.

---

## 5. STOP CONDITIONS

- Hard cap: 40 iterations (operator-capped and stopped at iteration 20 for this run; synthesis produced at 20).
- Convergence is telemetry only for this run because stop policy is `max-iterations`.
- Stop early only for hard blockers, safety violations, or invalid research state that cannot be repaired within the workflow contract.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

[None yet]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Start with a top-down inventory: identify the last ~50 relevant system-speckit spec/implementation packets and map them to maintained catalogs, playbooks, skill assets, READMEs, benchmarks, and stress tests.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Memory context for the narrow bound spec folder returned no canonical results and advised broader retrieval. Code graph startup state is stale/unavailable, so leaf iterations should verify all claims with direct file evidence and use Grep/Glob/Read rather than relying on structural graph answers.

### Bounded Context Snapshot

- Source pointers: `.opencode/specs/system-speckit/029-memory-search-intelligence/` phase children, `.opencode/skills/system-spec-kit/`, `.opencode/skills/deep-loop-workflows/`, `.opencode/commands/`, related benchmark and manual-testing folders.
- Reuse candidates: existing feature catalogs, manual testing playbooks, behavior benchmarks, stress-test docs, SKILL.md files, command contracts, generated metadata, and README files.
- Integration points: Spec Kit Memory MCP, Code Graph MCP, Skill Advisor, deep-loop workflows, command contracts, generated descriptors, and validation scripts.
- Constraints and risks: research-only run; no implementation fixes; code graph freshness is stale/unavailable; use file evidence.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 40 (operator override: run capped and stopped at iteration 20)
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `research/inbox.jsonl`
- Current generation: 1
- Started: 2026-07-05T05:06:00.715Z
