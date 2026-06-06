DEEP-RESEARCH

# Deep-Research Iteration 003 — numeric weighted severity rubric (score >=4 blocks)

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted; T1 DEFERRED. Mine peck-master's ACTUAL SOURCE for NET-NEW mechanisms beyond T1-T4. Do NOT re-derive T2/T3/T4; assess only the DELTA vs spec-kit.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/system-spec-kit/`

## FOCUS — answer ONLY this
peck's `code-reviewer` uses a NUMERIC weighted severity rubric with a hard block threshold. Read:
- peck `external/peck-master/src/assets/agents/code-reviewer.md` (the `<rubric>` with weights 4-10 across Correctness/Simplicity/Security/Concurrency, the "Score each finding using the item's base weight, adjusted +/-2 for context", and "Score >=4 blocks the PR"; also the `<output-format>` "[score: N]")
- spec-kit severity model: `.opencode/skills/sk-code-review/SKILL.md` (severity scheme + minimums), `.opencode/skills/deep-review/SKILL.md` (P0/P1/P2 and the 0.10 weighted-severity convergence threshold), and any severity vocabulary in `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`

Determine: spec-kit uses CATEGORICAL P0/P1/P2. Does peck's QUANTITATIVE per-finding weighted score (with explicit base weights, a +/-2 context adjustment, and a numeric block cutoff) provide anything spec-kit lacks — e.g. a more consistent/auditable block decision, calibration, or a tie-break between P1/P2? Map peck's weight bands onto spec-kit's P-levels. Is a numeric-rubric OPTION worth ADOPT/ADAPT/DEFER/SKIP for sk-code-review or deep-review? Watch for over-engineering (peck's numbers may be cosmetic).

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-003-MM] <claim>` with BOTH a peck `file:line` and a spec-kit `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: what is NOT net-new (already shipped), cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
