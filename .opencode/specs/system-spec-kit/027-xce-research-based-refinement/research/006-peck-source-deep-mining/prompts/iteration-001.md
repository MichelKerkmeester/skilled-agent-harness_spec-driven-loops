DEEP-RESEARCH

# Deep-Research Iteration 001 — implementer escalation / anti-thrash discipline

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined the peck framework ONCE via its README (2026-06-02) -> teachings T1-T4. T2 (bounded reflection), T3 (self-check templates), T4 (current-state discipline) were ADOPTED into spec-kit (children `001-peck-teachings-adoption/{002,003,004}`). T1 (per-AC >=90% test-coverage gate) was DEFERRED. Your job: mine peck-master's ACTUAL SOURCE for NET-NEW adoptable mechanisms the README-level pass missed. Do NOT re-derive T2/T3/T4; only assess the DELTA between peck-as-implemented and what spec-kit already has.

Repo roots (relative to the --dir you were launched in):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/system-spec-kit/`
- root docs:   `CLAUDE.md`, `AGENTS.md`, agent defs under `.opencode/agents/` and `.claude/agents/`

## FOCUS — answer ONLY this
peck's `implementer` agent enforces a STRUCTURED escalation / anti-thrash discipline. Read:
- peck `external/peck-master/src/assets/agents/implementer.md` (esp. `<role>` stop conditions and the `<verify>` step-9 escalation list)
- spec-kit loop/escalation discipline: `.opencode/skills/sk-code/SKILL.md` (verify/debug loop), `.opencode/agents/debug.md` (5-phase root-cause debug), `CLAUDE.md` section 1 (Execution Behavior / "do not stop early") and section 4 (Escalation: "after two failed attempts")

Determine whether spec-kit has peck's SPECIFIC gates, and for each missing/weaker one give a verdict:
(a) hard 3-strike loop budget ("Verify loop has run 3 or more times" -> escalate);
(b) "if you cannot state in one sentence what the root cause is and how your fix addresses it -> escalate";
(c) "implementation correct against the real codebase but conflicts with the story -> escalate for story/spec AMENDMENT, not a code workaround";
(d) "reviewers contradict each other -> escalate";
(e) "escalating early is always cheaper than another verify loop" framing.
Which of these does spec-kit's sk-code/@debug/CLAUDE.md already encode, and which are net-new? Is each adoptable as a self-check/escalation rule in spec-kit templates or CLAUDE.md?

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-001-MM] <claim>` with BOTH a peck `file:line` and the relevant spec-kit `file:line`. For each candidate mechanism state: GAP in spec-kit (real / partial / none — cite the surface that does or does not cover it); VERDICT one of ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS (which spec-kit files/templates/rules would change).
### RULED_OUT
1-3 bullets: what you checked that is NOT net-new (already covered by T2/T3/T4 or already shipped), each with a citation.
### METRICS
newInfoRatio: <0.0-1.0 vs the known T1-T4 baseline>
novelty: <1 sentence justifying the ratio>
status: complete
sources: <comma-separated file:line list you actually cited>

Be terse and evidence-dense. No preamble.
