---
title: Deep Research Strategy — cli-classifier quality audit (deepseek-v4-1-flash-max lineage)
description: Session tracking for the five-iteration audit of the shipped cli-classifier hub on seven axes.
trigger_phrases:
  - "cli-classifier quality research"
  - "deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - cli-classifier quality audit

Lineage `deepseek-v4-1-flash-max` of the fan-out run `fanout-deepseek-v4-1-flash-max-1791118713156-9uew1r`.
Artifact directory: `specs/cli-jev/004-cli-classifier-quality-research/research/lineages/deepseek-v4-1-flash-max`.
Write boundary: this lineage directory only (detached fan-out lineage; spec-folder writeback intentionally skipped).

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage: five iterations, each with one focus, auditing the shipped cli-classifier work on seven axes. Findings are appended to `deltas/iter-NNN.jsonl` as `type:"finding"` records and narrated in `iterations/iteration-NNN.md`; the terminal synthesis is `research.md`.

### Usage

- Per iteration: read Next Focus, read `steer.md` if the lead left one, gather evidence, write the iteration file and delta, append the iteration record through the append gateway.
- The official reducer cannot run against this lineage (it resolves artifact paths from the spec folder, outside this write boundary), so the executor maintains Sections 3, 6-11A of this file directly, keeping the reducer's shapes.

---

## 2. TOPIC

Audit the shipped cli-classifier work (the `.skilled/skills/cli-classifier` hub, its `cli-jev` packet, `shared/` transport and scorer-report scripts, `benchmark/`, feature catalog, manual testing playbook, changelogs and READMEs, plus every live caller of `shared/scripts/jev-transport.mjs` and `scorer-report.mjs` in sk-doc, system-deep-loop and system-spec-kit) on seven axes: (1) sk-doc compliance of every doc; (2) sk-code-opencode compliance of every script and test; (3) system-skill-advisor integration: routing vocabulary, leaf manifests, graph metadata and how a prompt reaches the hub; (4) UX for an external repository user who installs the skill without Jev, and for the operator who runs the benchmarks; (5) documentation accuracy against the code; (6) bugs in the scripts and tests; (7) drift between docs, metadata, mirrors and code, and whether the measured with-and-without results are visible to a reader. Read only. Cite `file:line` for every finding, give it a severity (P0 to P2) and an axis, and say how you confirmed it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1 (axes 1+5): sk-doc compliance + documentation accuracy — answered: F-003 (P1 cluster), F-001/F-002/F-004/F-005/F-009; rest validates clean.
- [x] Q2 (axes 2+6): sk-code-opencode compliance + bugs — answered: no functional bugs; 153 tests pass; F-005 count defect.
- [x] Q3 (axis 3): skill-advisor integration — answered: chain verified end to end; F-006 approved divergence.
- [x] Q4 (axis 4): external-user + operator UX — answered: operator flow complete; F-007 prerequisite gap.
- [x] Q5 (axis 7): drift + measured-results visibility — answered: F-008 metadata lag; mirror clean; results visible.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Fixing any finding; this run reports only.
- Live Jev or Pi calls; the audit reads code, docs and recorded run folders.
- Re-measuring any benchmark; recorded results are evidence.

---

## 5. STOP CONDITIONS

- Five iterations reached (stopPolicy `max-iterations`; convergence before the cap is telemetry only).
- All seven axes have findings or explicit no-finding lines, each cited.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 (axes 1+5) — answered (F-003 P1 cluster; F-001/F-002/F-004/F-005/F-009; rest validates clean)
- Q2 (axes 2+6) — answered (no functional bugs; 153 tests pass; F-005 count defect)
- Q3 (axis 3) — answered (chain verified end to end; F-006 approved divergence)
- Q4 (axis 4) — answered (operator flow complete; F-007 prerequisite gap)
- Q5 (axis 7) — answered (F-008 metadata lag; mirror byte-identical; results visible)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Grep-based caller inventory against code, then per-file verification: found the exact six live importers and one provenance gap (iteration 1)
- Reading a script end to end before judging a doc claim: settled the SKILL.md transport-default contradiction with code evidence (iteration 1)
- Running the README's own verification commands with a git-status containment check: three passes confirmed with zero repo writes (iteration 1)
- Sampling six sibling skills before reporting a version-lag finding: cleared a would-be false positive (iteration 1)
- Running the doc validator over all 79 hub markdown docs with explicit types, then sibling-comparing each failure class: isolated a five-file blocking gap and cleared three false-positive classes (iteration 2)
- Running every test suite with TMPDIR redirected inside the lineage and a git-status containment check: 153 cases proven green with zero repo writes (iteration 3)
- Matching the compiled route's policy hash against the activation manifest: proved the live front door and the activation record agree (iteration 4)
- Reading the code condition before trusting either doc side of a discrepancy (review band 0.25–0.60): settled it with `score-injection-screen.mjs:1387` (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Nothing failed outright in iteration 1; the only friction was scope control (the surface is 116 files, so per-iteration focus must stay narrow)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

[Approaches investigated and definitively eliminated — consolidated from iteration dead-end data]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Does the hub SKILL.md:114 transport-default error appear in any mirror copy (.claude/skills/, runtime mirrors)? Check in iteration 5 (drift axis).
- Resolved: the "five scorers" phrasing repeats in pi-transport-integration.md:90-91 and the SOURCE FILES table; recorded as F-004 (iteration 2).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 3: sk-code-opencode compliance and bugs across the hub's scripts and tests (axes 2+6). Targets: `shared/scripts/jev-transport.mjs` + `scorer-report.mjs` (already read end to end), `benchmark/injection-screen/score-injection-screen.mjs`, `benchmark/pi-transport/score-pi-transport.mjs` + `replay-helpers.mjs`, the two shared test suites (1040 + 194 lines), and the six live callers' transport seams. Syntax checks, error-path reads, test-quality review.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior context loaded from the packet (read-only):

- `spec.md` (packet): seven axes in scope; out of scope is fixing findings and re-measuring; acceptance criteria REQ-001..005; two lineages of five iterations; merged `research/research.md` must carry a section or explicit no-finding line per axis.
- `plan.md`: fan-out architecture; `fanout-run.cjs` spawns and validates, `fanout-merge.cjs` merges registries.
- `implementation-summary.md`: continuity block is template defaults; no handover.md and no decision-record.md exist.
- Sibling packet `specs/cli-jev/003-cli-jev-workflow-integration` shipped the hub; its `007-classifier-deep-research` research exists as prior work on where a classifier cuts context (topic-adjacent, not this audit).

### Bounded Context Snapshot

- Source pointers: hub root `.skilled/skills/cli-classifier/` (SKILL.md, README.md, ROUTER.md, description.json, mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json); `shared/scripts/{jev-transport.mjs,scorer-report.mjs}` + `shared/scripts/tests/`; `benchmark/{injection-screen,pi-transport,reports}`; `feature-catalog/` + `manual-testing-playbook/` + `changelog/`; packet `cli-jev/` (SKILL.md, README.md, hard-rules.json, references/, feature-catalog/, manual-testing-playbook/, benchmark/, changelog/, assets/).
- Live callers to locate: `jev-transport.mjs` and `scorer-report.mjs` importers under `.skilled/skills/sk-doc/`, `.skilled/skills/system-deep-loop/`, `.skilled/skills/system-spec-kit/`.
- Integration points: `.claude/skills/cli-classifier/` runtime mirror; skill-advisor graph inputs (`graph-metadata.json`, `leaf-manifest.json`, `hub-router.json`, `description.json`); `.skilled/skills/system-skill-advisor/` routing surfaces.
- Constraints and risks: read-only audit (no repo writes outside this lineage); mirror drift must be checked against the runtime copies; benchmark claims are recorded evidence, not to be regenerated.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls target (max 24)
- Progressive synthesis: true (default)
- `research/research.md` ownership: workflow-owned canonical synthesis output (written at synthesis)
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: maintained by the executor in this lineage (official reducer resolves paths outside the lineage write boundary)
- Question injection surface: not used in this detached lineage
- Canonical pause sentinel: `research/.deep-research-pause` (not used; detached lineage)
- Current generation: 1
- Started: 2026-10-04T15:01:00Z
