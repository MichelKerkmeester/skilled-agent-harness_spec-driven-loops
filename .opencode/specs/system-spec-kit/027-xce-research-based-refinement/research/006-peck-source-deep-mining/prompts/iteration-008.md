DEEP-RESEARCH

# Deep-Research Iteration 008 — deferred T1 re-evaluation (per-AC >=90% coverage gate)

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
This is the HEADLINE focus. The 2026-06-02 analysis named T1 (acceptance-criteria-as-assertions + a mechanical >=90% per-AC test-coverage completion gate) the single highest-leverage borrow but DEFERRED it as "a separate future packet" (largest blast radius). Since then, the 026 graph-and-context program CLOSED and the live validate.sh/checklist/deep-review stack matured. Re-evaluate whether T1 is NOW adoptable, and design it concretely.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- prior analysis: `specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md` (section 3 = T1) and `001-peck-teachings-adoption/spec.md` (T1 deferral rationale + OPEN QUESTIONS)
- spec-kit:    `.opencode/skills/system-spec-kit/`

## FOCUS — answer ONLY this
Read the peck mechanism and the spec-kit gap, then DESIGN the adoption:
- peck `external/peck-master/src/assets/agents/acceptance-reviewer.md` (classification Tested/Partially/Manual/Not-covered; `covered >= floor(0.9 x task_ACs)`; blocking Pass/Fail), `external/peck-master/src/assets/templates/story.md` (AC assertion format precondition+action -> observable outcome), `external/peck-master/README.md` (dual-reviewer gate is structural/blocking)
- spec-kit gap: `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` (the single "All acceptance criteria met" checkbox), `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` (EVIDENCE_CITED severity = WARNING; AC/section rules), `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` (AC columns / Given-When-Then), `.opencode/skills/deep-review/SKILL.md` (fresh-context reviewer), `CLAUDE.md` section 2 COMPLETION VERIFICATION

Deliver a CONCRETE adoption design and a verdict ADOPT-AS-PACKET / ADAPT / DEFER-STILL:
1. AC traceability table in checklist.md: `AC-id | classification (Tested/Partially/Manual/Not-covered) | evidence (test name @ file:line)`.
2. An `AC_COVERAGE` validation rule computing covered/total against a configurable floor (`SPECKIT_AC_COVERAGE_FLOOR`, default 0.9), WARNING->ERROR staged rollout, with a "Manual - automation infeasible" escape hatch.
3. Bind the verdict to a FRESH-CONTEXT reviewer (deep-review), not the implementer.
4. Per-LEVEL opt-in (Level 1 may legitimately lack tests).
For each design element: GAP (cite the spec-kit surface), EFFORT S/M/L, RISK, BLAST-RADIUS (exact files: which template, which rule file, which CLAUDE.md section). Also state: should T1 be its OWN packet, or a sub-phase of the proposed 006 sub-packet? Justify against the 001 deferral rationale.

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
4-8 findings. Each: `[F-008-MM] <claim>` with peck `file:line` AND spec-kit `file:line`. Cover the 4 design elements + the packet-shape recommendation. Each: GAP; VERDICT ADOPT-AS-PACKET | ADAPT | DEFER-STILL | SKIP; EFFORT; RISK; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: which ingredients spec-kit ALREADY has (so the packet reuses, not rebuilds), cited.
### METRICS
newInfoRatio: <0.0-1.0 — note this revisits a known-but-deferred teaching, so novelty is in the DESIGN + the now-adoptable verdict, not the teaching's existence>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
