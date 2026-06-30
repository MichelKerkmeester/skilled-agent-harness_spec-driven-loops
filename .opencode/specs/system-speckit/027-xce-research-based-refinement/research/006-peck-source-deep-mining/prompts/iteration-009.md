DEEP-RESEARCH

# Deep-Research Iteration 009 — cheap-model-gates cost architecture

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted; T1 DEFERRED. Mine peck-master's ACTUAL SOURCE for NET-NEW mechanisms beyond T1-T4. Do NOT re-derive T2/T3/T4.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/`

## FOCUS — answer ONLY this
peck makes a deliberate COST architecture choice: it runs its BLOCKING quality gates on CHEAP small models at LOW reasoning. Read the agent frontmatter `model:`/`variant:` fields:
- peck `external/peck-master/src/assets/agents/implementer.md` (`model: opencode-go/deepseek-v4-flash`)
- peck `external/peck-master/src/assets/agents/acceptance-reviewer.md` (`model: opencode-go/qwen3.6-plus`, `variant: low`)
- peck `external/peck-master/src/assets/agents/code-reviewer.md` (`model: opencode-go/glm-5.1`, `variant: low`)
- peck `external/peck-master/src/assets/agents/planner.md` (note its model)
- peck `external/peck-master/benchmarks/models.json`
- spec-kit cost/dispatch surfaces: `.opencode/skills/cli-opencode/SKILL.md` (model selection), `.opencode/skills/sk-prompt-models/SKILL.md` and its `assets/model-profiles.json`, the deep-* loop executor-selection contracts

Determine: peck's thesis is that structural quality gates can run on CHEAP models because the RUBRIC carries the rigor, not the model. Does spec-kit have an explicit cost-tiered verification pattern (cheap small-model gates vs expensive implement/synthesize)? Given sk-prompt-models exists, is "run the deep-review / sk-code-review severity pass on a cheap small model via cli-opencode" a NET-NEW adoptable cost pattern — or does spec-kit already route this way? Watch for the trap: spec-kit reviewers may need stronger models than peck's because spec-kit's surface is broader. Verdict + effort + risk, and note the failure mode.

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-6 findings. Each: `[F-009-MM] <claim>` with a peck `file:line` and a spec-kit `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: what is NOT net-new (already routed this way), cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
