DEEP-RESEARCH — INTEGRATION & IMPACT (gpt-5.5-fast)

# Iteration 021 — Automation integration: what runs auto vs semi vs manual, and how it's wired

You are a LEAF deep-research analyst, READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify/create/write ANY file — the orchestrator writes artifacts. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, you write NOTHING).

## MISSION (shared this round)
READ FIRST: `research/006-peck-source-deep-mining/sub-packet-proposal.md` + `research.md` §2. Research HOW TO INTEGRATE the peck adoptions. **TOP PRIORITIES: UX and AUTOMATION.** Changes: **009** [completion-freshness, escalation gates, anti-softening, reviewer read-budget, numeric-severity note]; **010** reviewer-prompt test-bench (deep-improvement, first); **011** AC coverage gate [AC-format + AC table + `AC_COVERAGE` rule + deep-review binding + warn→error]; coordination → pending 003/004.
Surfaces (relative to --dir): skills `.opencode/skills/{system-spec-kit,deep-review,deep-improvement,sk-code,sk-code-review,deep-research}/`; hooks `.opencode/skills/system-spec-kit/references/hooks/` + `references/config/hook_system.md`; validators `references/validation/validation_rules.md` + `scripts/lib/validator-registry.json` + `scripts/rules/` + `scripts/validation/` + `scripts/spec/validate.sh`; env `mcp_server/ENV_REFERENCE.md`; CI scripts under `scripts/` (e.g. `check-prompt-quality-card-sync.sh`); deep-loop runtime `.opencode/skills/deep-loop-runtime/`.

## FOCUS — answer ONLY this
This is the **AUTOMATION lens**. For EACH rule (completion-freshness, escalation gates, anti-softening, reviewer read-budget, AC coverage gate, 010 benchmark), classify **FULLY-AUTO / SEMI-AUTO (human-in-loop) / MANUAL**, then WIRE it to a CONCRETE EXISTING automation surface: which hook (pre-commit / completion / skill-advisor / post-mutation — find them), which CI gate, which `validator-registry.json` rule, which env flag for staged rollout (use the existing flag conventions). Specifically resolve: can completion-freshness run automatically in `validate.sh`/the completion validator or a pre-commit hook? can AC→test coverage be auto-extracted or does it need the reviewer? can the 010 benchmark run in CI on every reviewer-prompt change? can escalation gates be auto-detected (loop counter / contradiction)? What MUST stay manual (high false-positive, needs judgment)? Reuse existing automation surfaces — do not invent new infrastructure where one exists.

## DELIVER (plain text — orchestrator writes artifacts)
### AUTOMATION_MATRIX
Per rule: `rule | FULLY-AUTO|SEMI-AUTO|MANUAL | wiring (hook/CI/validator/flag + file:line) | what stays manual + why`
### AUTOMATION_GAPS
Existing automation surfaces reusable for these rules that the proposal did NOT name (2-5 bullets, cited).
### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <file:line list>
Be terse, evidence-dense. No preamble.
