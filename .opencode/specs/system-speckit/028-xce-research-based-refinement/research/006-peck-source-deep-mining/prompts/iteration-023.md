DEEP-RESEARCH — INTEGRATION & IMPACT (gpt-5.5-fast)

# Iteration 023 — Re-rank everything through the UX + automation lens (top priorities)

You are a LEAF deep-research analyst, READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify/create/write ANY file — the orchestrator writes artifacts. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, you write NOTHING).

## MISSION (shared this round)
READ FIRST: `research/006-peck-source-deep-mining/sub-packet-proposal.md` + `research.md` §2-§3. **TOP PRIORITIES (operator directive): UX and AUTOMATION are the system's #1 priorities.** Changes: **009** [completion-freshness, escalation gates, anti-softening, reviewer read-budget, numeric-severity note]; **010** reviewer test-bench; **011** AC coverage gate; coordination → pending 003/004; optional T13 resume-manifest, T11 cheap-model preset. Inspect the existing user-facing + automation surfaces (`/speckit:complete`, `validate.sh`, status-line/startup-hook, `checklist.md`, `deep-review` report, `references/hooks/`, `scripts/`) to ground the opportunities.

## FOCUS — answer ONLY this
Re-rank the ENTIRE proposal through the operator's TOP priorities (UX + automation). For each proposed change, score: **user-friction** (low/med/high), **automation-potential** (full/semi/manual), **value** (low/med/high) → a **ship-rank**. Then: (a) which changes are the BEST UX+automation wins to ship FIRST (low-friction, high-automation, high-value)? (b) which change's UX or automation cost outweighs its value → **reshape or defer**? (c) what NET-NEW UX/automation opportunities are NOT in the proposal but should be, given UX+automation are #1 — e.g. auto-fix suggestions embedded in validation errors, a status-line coverage/freshness indicator, auto-generated AC stubs from requirements, a one-command "refresh my completion fingerprint" helper, a single `deep-review` verdict surfaced in `/speckit:complete`. Be concrete and cite the existing surface each opportunity would plug into.

## DELIVER (plain text — orchestrator writes artifacts)
### PRIORITY_SCORECARD
Per change: `change | friction low/med/high | automation full/semi/manual | value low/med/high | ship-rank`
### RESHAPE_OR_DEFER
Changes whose UX/automation cost outweighs value, with the reshape/defer recommendation (cited).
### NEW_UX_AUTO_OPPORTUNITIES
3-6 net-new UX/automation ideas not in the proposal, each plugged into a named existing surface (file:line).
### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <file:line list>
Be terse, evidence-dense. No preamble.
