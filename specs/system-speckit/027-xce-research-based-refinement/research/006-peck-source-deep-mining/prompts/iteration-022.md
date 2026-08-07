DEEP-RESEARCH — INTEGRATION & IMPACT (gpt-5.5-fast)

# Iteration 022 — Rollout sequencing & backward-compat (the concrete how-to-integrate)

You are a LEAF deep-research analyst, READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify/create/write ANY file — the orchestrator writes artifacts. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, you write NOTHING).

## MISSION (shared this round)
READ FIRST: `research/006-peck-source-deep-mining/sub-packet-proposal.md` (§7 sequencing) + `research.md`. Research HOW TO INTEGRATE. **TOP PRIORITIES: UX and AUTOMATION.** Changes: **009** verification-discipline bundle; **010** reviewer test-bench (first); **011** AC coverage gate (warn→error); coordination → pending 003/004. Also read the live re-plan `research/005-live-rescope-coco-purge/research.md` and the 027 parent `spec.md` phase map + `001-peck-teachings-adoption/spec.md` (pending 002/003/004).
Key surfaces: `mcp_server/ENV_REFERENCE.md` (flag + staged-rollout conventions), `references/validation/validation_rules.md` + `scripts/lib/validator-registry.json` (severity model + any existing warn→error precedent like `SPECKIT_SAVE_QUALITY_GATE`), `templates/manifest/{spec,checklist}.md.tmpl`.

## FOCUS — answer ONLY this
Produce the concrete ROLLOUT. (1) **Dependency order** — confirm 010→009→011 and the coordination with pending 001/{002,003,004} that share `spec.md.tmpl`/`checklist.md.tmpl`. (2) **Backward-compat** — exactly how EXISTING spec folders survive the new ERROR-severity `AC_COVERAGE` rule and the freshness binding: grandfathering, lifecycle opt-in (only enforce when `implementation-summary.md` is in-progress+), warn-only window. (3) **Feature flags** — name the flags + defaults for staged rollout, matching the existing flag conventions; cite a real existing warn→error precedent to copy. (4) **Coordination** — land pending 002/003/004 first or coordinate the shared-template edit window. (5) A **phased timeline** with an explicit gate between each phase. Optimize the rollout so automation lands early and user-facing friction lands late (behind flags/warn-mode).

## DELIVER (plain text — orchestrator writes artifacts)
### ROLLOUT_PLAN
Ordered phases: `phase | what ships | gate-to-next | backward-compat mechanism | flag + default`
### PRECEDENT
The existing warn→error / shadow→active rollout in spec-kit to copy (cite file:line).
### COORDINATION
How to interleave with pending 002/003/004 (cited).
### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <file:line list>
Be terse, evidence-dense. No preamble.
