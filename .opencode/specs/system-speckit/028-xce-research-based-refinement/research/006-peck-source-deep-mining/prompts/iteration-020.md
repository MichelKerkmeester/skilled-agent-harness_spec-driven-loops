DEEP-RESEARCH — INTEGRATION & IMPACT (gpt-5.5-fast)

# Iteration 020 — UX integration: how each rule surfaces to the user (minimize friction)

You are a LEAF deep-research analyst, READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify/create/write ANY file — the orchestrator writes artifacts. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, you write NOTHING).

## MISSION (shared this round)
READ FIRST: `research/006-peck-source-deep-mining/sub-packet-proposal.md` + `research.md` §2. Research HOW TO INTEGRATE the peck adoptions. **TOP PRIORITIES: UX and AUTOMATION.** Proposed changes: **009** [completion-freshness, escalation gates, anti-softening, reviewer read-budget, numeric-severity note]; **010** reviewer-prompt test-bench (deep-improvement, first); **011** AC coverage gate [AC-format + AC table + `AC_COVERAGE` rule + deep-review binding + warn→error]; coordination → pending 003/004. (Same surfaces list as iteration 019.)

## FOCUS — answer ONLY this
This is the **UX lens**. For each adopted rule (completion-freshness, escalation gates, anti-softening, reviewer read-budget, AC coverage gate, + the 010 benchmark), design the USER EXPERIENCE: WHERE/HOW it surfaces, the MESSAGE wording, the interaction, and how to MINIMIZE friction. Ground it in spec-kit's EXISTING user-facing surfaces (find them): the `/speckit:complete` output, `validate.sh --strict` error format + `validation_rules.md` message style, the status-line / startup-hook brief, `checklist.md` rendering, the `deep-review` report format, the skill-advisor hook brief. For each rule: which existing UX surface to REUSE, the proposed message/interaction, friction (low/med/high), and the UX improvement. Then list UX ANTI-PATTERNS to avoid (wall-of-errors, cryptic failures, blocking a fresh scaffold, double-prompting). Favor progressive disclosure + actionable/auto-fix-suggesting messages.

## DELIVER (plain text — orchestrator writes artifacts)
### UX_DESIGN
Per rule: `rule | existing UX surface to reuse (file:line) | proposed message/interaction | friction low/med/high | the UX win`
### UX_ANTIPATTERNS
3-6 bullets: UX traps these changes could introduce + how to avoid (cited where possible).
### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <file:line list>
Be terse, evidence-dense. No preamble.
