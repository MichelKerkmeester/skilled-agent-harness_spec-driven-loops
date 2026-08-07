DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 10
Dimension: inventory + correctness (Finding #1: ENV_REFERENCE.md env-var gap)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 10
Mode: review
Dimension: inventory + correctness
Review Target: Audit related skill documentation (SKILL.md/references/assets) and README files across the repo for stale /goal OpenCode plugin behavior after phases 010-014 remediation + goal_opencode.md filename correction. Independently AUDIT (not merely re-cite) a companion 10-iteration deep-research pass's 6 numbered findings with your own P0/P1/P2 verdict (confirm/downgrade/refute + evidence), and actively hunt for anything its reducer-stall (iterations 4-9 repeated ground) may have missed.
Review Scope Files (representative; full list + more may be discovered):
- .opencode/plugins/mk-goal.js (source of truth)
- .opencode/commands/goal_opencode.md
- .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
- .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md
- .opencode/plugins/README.md
- README.md (repo root)
- .opencode/skills/system-skill-advisor/README.md
- .opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md
- .opencode/skills/system-spec-kit/feature_catalog/**/goal-opencode-plugin.md
- .opencode/skills/system-spec-kit/manual_testing_playbook/**/goal-opencode-plugin.md
- .opencode/skills/system-skill-advisor/manual_testing_playbook/**/goal-opencode-plugin.md
- .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md
- .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md
- .opencode/skills/system-spec-kit/ARCHITECTURE.md
Prior Findings: P0=0 P1=0 P2=0

## READ FIRST (in order)

1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` -- full review charter, the 6 companion-research findings to audit (§2 TOPIC), known context (§13), files under review (§15). This is your primary orientation document.
2. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-config.json` and `deep-review-state.jsonl` -- config + prior iteration history (none yet, this is iteration 1).
3. `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/research.md` -- the companion research packet you are independently auditing. Do NOT just re-cite its findings; verify each one yourself against the live code/docs and assign your OWN P0/P1/P2 verdict (confirm at same severity, downgrade, upgrade, or refute with evidence).

## THIS ITERATION'S FOCUS (iteration 1 of 10 -- inventory + first audit pass)

1. **Re-confirm independently** that `.opencode/commands/goal_opencode.md` is the only live command file matching `.opencode/commands/*goal*.md`, and `.opencode/commands/goal.md` does NOT exist (`Glob` it yourself -- do not trust the research packet's claim).
2. **Build an inventory** of every doc class in scope: SKILL.md files, references/, assets/, feature_catalog/, manual_testing_playbook/, constitutional/ across ALL skills mentioning the goal plugin (`mk-goal.js`, `mk_goal`, `goal_opencode`, `/goal`, `usage_limited`) -- not just the doc set research happened to touch. Record this inventory in the iteration narrative so later iterations can build on it.
3. **Audit companion research Finding #1** (P1 claim): `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` omits `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`. Read the actual file and the actual `mk-goal.js` env-var definitions (lines ~30-42) side by side. Assign your own P0/P1/P2 verdict with file:line evidence -- confirm, downgrade, or refute.
4. Read `.opencode/plugins/mk-goal.js` directly for the functions/fields the operator flagged as new this session: `recordProviderUsageLimit`, `archiveGoalStateFile`, `pruneArchive`, `sweepOrphanedActiveStates`, the 3 new env vars, `store_health` status field, and the `mutation` field on `/goal set` output. Note exact line numbers for later iterations' cross-checks.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability (this iteration emphasizes correctness + inventory scaffolding for traceability)

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

Per-finding verdict: `CONFIRMED-P0 | CONFIRMED-P1 | CONFIRMED-P2 | DOWNGRADED-P{n} | REFUTED`, each with file:line evidence.
Overall iteration verdict: `FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-config.json
- State Log: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files (docs, code, research packet).
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-001.md`
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-001.jsonl`
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` (in-place updates only)
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative markdown** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-001.md`. Structure: headings for Dimension, Files Reviewed, Doc Inventory (this iteration only), Per-Finding Audit (Finding #1 verdict with evidence), Findings by Severity (P0/P1/P2), Traceability Checks, Next Dimension. The FINAL line of this file MUST be exactly one of: "Review verdict: PASS", "Review verdict: CONDITIONAL", "Review verdict: FAIL".

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"inventory + correctness (Finding #1)","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per finding/classification/traceability-check/ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED and will be validated. Do not skip any.
