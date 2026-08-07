DEEP-RESEARCH

# Deep-Research Iteration 006 — revim-* agent/prompt benchmark harness

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted; T1 DEFERRED. Mine peck-master's ACTUAL SOURCE for NET-NEW mechanisms beyond T1-T4 (the README pass NEVER looked at peck's benchmark harness). Do NOT re-derive T2/T3/T4.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/`

## FOCUS — answer ONLY this
peck ships a BENCHMARK harness for its agent prompts that the prior analysis never examined. First run `ls -R external/peck-master/benchmarks/` to map it, then read:
- `external/peck-master/benchmarks/AGENTS.md`
- `external/peck-master/benchmarks/models.json`
- `external/peck-master/benchmarks/revim-planner/README.md` and whatever exists under `benchmarks/revim-acceptance-reviewer/` and `benchmarks/revim-code-reviewer/`
- spec-kit's benchmarking surfaces: `.opencode/skills/deep-research/../` — specifically `.opencode/commands/deep/start-skill-benchmark-loop.md` (or the skill `deep:start-skill-benchmark-loop`), `deep:start-model-benchmark-loop`, and `.opencode/skills/deep-improvement/` sweep-benchmark

Determine: WHAT is peck benchmarking and HOW (revim = a fixture corpus? known-buggy inputs with a ground-truth verdict? a models matrix in models.json?). Is peck's method of benchmarking its REVIEWER/PLANNER PROMPTS against fixtures with an expected outcome a NET-NEW approach vs spec-kit's skill/model-benchmark loops? Specifically: does spec-kit have a way to regression-test that a reviewer prompt still catches a known class of bug? This matters because any new reviewer rule the 006 sub-packet proposes will need a benchmark. Verdict + effort + risk + which spec-kit benchmark surface it maps to.

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-006-MM] <claim>` with a peck `file:line` and (where relevant) a spec-kit `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: what is NOT net-new, cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
