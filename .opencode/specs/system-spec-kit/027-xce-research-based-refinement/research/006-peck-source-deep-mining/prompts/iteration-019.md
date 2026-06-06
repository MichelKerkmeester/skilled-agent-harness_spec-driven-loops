DEEP-RESEARCH — INTEGRATION & IMPACT (gpt-5.5-fast)

# Iteration 019 — Complete impact inventory (skills / commands / agents / hooks / configs)

You are a LEAF deep-research analyst, READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify/create/write ANY file — the orchestrator writes artifacts. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, you write NOTHING).

## MISSION (shared this round)
A prior deep-research pass (this packet, iterations 001-018) proposed adopting peck-derived mechanisms into spec-kit as 3 new sub-packets + coordination items. READ FIRST: `research/006-peck-source-deep-mining/sub-packet-proposal.md` + `research/006-peck-source-deep-mining/research.md` §2 (verdict matrix). Now research HOW TO INTEGRATE and the FULL impact surface.
**TOP PRIORITIES (operator directive): UX and AUTOMATION** — every recommendation must optimize for minimal user friction + maximal safe automation (hooks/CI/validators), human-in-loop only where judgment is required.
Proposed changes (plain): **009** verification-discipline bundle [completion-freshness = bind "done" to file content + clean tree; escalation gates; anti-softening; reviewer read-budget; numeric-severity note]; **010** a reviewer-prompt test-bench in deep-improvement (land FIRST); **011** the AC test-coverage gate [AC-format normalization + AC table + `AC_COVERAGE` rule + deep-review binding + warn→error]; coordination: reflection-cap→pending 004, current-state→pending 003.

Surfaces to inspect (relative to --dir):
- skills `.opencode/skills/{system-spec-kit,deep-review,deep-improvement,sk-code,sk-code-review,deep-research,cli-opencode,sk-prompt-small-model}/`
- commands `.opencode/commands/{speckit,deep}/` (/speckit:complete, /speckit:resume, /deep:start-review-loop, /deep:start-model-benchmark-loop) + `/code-review`
- agents `.opencode/agents/` and `.claude/agents/` ({review,context,debug,deep-review,deep-research,orchestrate})
- hooks `.opencode/skills/system-spec-kit/references/hooks/`, `references/config/hook_system.md`, skill-advisor hook
- validation `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`, `scripts/lib/validator-registry.json`, `scripts/rules/`, `scripts/validation/`
- templates `.opencode/skills/system-spec-kit/templates/manifest/`
- root `CLAUDE.md`, `AGENTS.md`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`

## FOCUS — answer ONLY this
Produce the COMPLETE impact surface. For EACH existing skill / command / agent / hook / config / template / validator-rule / env-flag the 009/010/011 + coordination changes touch: name it with `file:line`, say what changes, mark NEW vs MODIFY, blast-radius (low/med/high), and tag it **UX** (user-facing) or **AUTO** (background/automation). Be EXHAUSTIVE — go beyond the proposal's key-files: include the commands, agents, hooks, validator-registry entries, and env flags it implies but does not enumerate.

## DELIVER (plain text — orchestrator writes artifacts)
### IMPACT_MATRIX
One row per surface: `surface | file:line | what changes | NEW/MODIFY | blast | UX|AUTO`
### MISSED_SURFACES
Surfaces the proposal's key-files list omitted but that the changes actually touch (2-6 bullets, cited).
### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <file:line list>
Be terse, evidence-dense. No preamble.
