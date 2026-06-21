# Iteration 005 - KQ5: Skill-doc corpus quality automation

**Focus:** What skill-doc corpus quality automation exists (SKILL.md + references + assets, advisor metadata, smart-router coverage) and what is missing.
**newInfoRatio:** 0.70
**Novelty:** Finds the skill surface already has the benchmark+regression+graph-validate routing-quality pattern that the spec surface entirely lacks; identifies it as the transferable template for spec-corpus retrieval QA, and finds the same on-write/content-quality gaps recur.
**Status:** complete

## What I examined
- `scripts/spec/check-smart-router.sh` (header + exit contract) [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:1-30]
- Skill advisor surface: `skill-graph.json`, `advisor-validate.ts`, `skill_graph_compiler.py`, `skill_advisor_bench.py`, `skill_advisor_regression.py` [SOURCE: file listing]
- Advisor MCP tools: `advisor_validate`, `advisor_rebuild`, `skill_graph_validate`, `skill_graph_scan`, `skill_graph_propagate_enhances` [SOURCE: deferred-tool inventory]
- `/deep:skill-benchmark` command (routing/discovery/efficiency/usefulness benchmark) [SOURCE: available-skills list]
- Cross-surface: `audit_descriptions.py` walks skills+commands+agents (iter 2) [SOURCE: audit_descriptions.py:6-31]

## Findings

### F1. The skill surface ALREADY has the routing-quality pattern the spec surface lacks
Skills are backed by: a compiled `skill-graph.json`, `advisor_validate` + `skill_graph_validate` (metadata integrity), `skill_advisor_bench.py` (routing benchmark), `skill_advisor_regression.py` (regression guard), and a full `/deep:skill-benchmark` loop scoring "real-world routing, discovery, efficiency, usefulness." That is a closed quality loop: derive metadata -> validate -> benchmark routing -> regression-guard. **The spec/memory corpus has no equivalent** — no spec-retrieval benchmark, no routing regression, only the shape validators of iter 1.

### F2. But the skill checks are still mostly structural / availability, not content-quality
`check-smart-router.sh` validates that smart-router blocks reference **existing** resources and flags ALWAYS-tier bloat (`:1-30`) — a referential-integrity + budget check, not "is this routing discriminative." Description quality is bounded only by `audit_descriptions.py` budget math. So even the richer skill surface has the same content-quality hole: nothing checks that a skill's `description`/trigger phrases are *discriminative against sibling skills* or that the SKILL.md body delivers what its triggers advertise. (The benchmark measures routing outcome, but it is operator-run, not an on-write gate.)

### F3. On-write consistency for skill metadata is daemon/operator-driven, not gated
`advisor_rebuild` / `skill_graph_scan` refresh advisor metadata, but a freshly edited SKILL.md does not, on write, assert its advisor metadata is still consistent. This mirrors the spec-corpus trigger_phrase divergence (iter 3 F3): the derived index can silently lag the authored doc until someone reruns the rebuild.

### F4. Cross-surface retrieval surface: the available-skills list itself
`audit_descriptions.py` exists because the skills+commands+agents descriptions collectively form the **available-skills list that the model retrieves over at routing time** (budget ceiling 5600). This is a first-class retrieval surface with the same quality levers as spec retrieval: discriminative descriptions, distinctive triggers, no bloat. A unified description-quality automation could serve both surfaces.

### F5. The transferable design (cross-pollination)
The strongest KQ5 finding is directional: port the skill surface's **benchmark + regression** loop to the spec/memory corpus, but wire its metric to the truncation law — the spec-retrieval benchmark must score **prod-mode completeRecall@3**, not eval-mode@K (parent doctrine). That gives the spec corpus the same closed quality loop skills already enjoy, and it is the automation that finally lets a retrieval candidate be promoted (the parent's open question).

## Dead Ends / Ruled Out
- `check-smart-router.sh` as a content-quality gate: ruled out — referential-integrity + bloat only.
- Assuming skills lack quality automation: ruled out — they have more than specs; the gap is content-quality + on-write gating, not the loop's existence.

## Answers
- **KQ5 answered:** Skill docs have a routing-quality loop (advisor/graph validate + benchmark + regression) absent from specs, but it is structural/operator-run; content-quality (discriminative descriptions/triggers, body-matches-triggers) and on-write consistency gating are still missing. Best move: port the benchmark+regression loop to the spec corpus with a prod-mode-@3 metric, and add a shared description/trigger quality check across the available-skills retrieval surface.

## Next focus
KQ6: command-doc quality automation gaps across the command surface.
