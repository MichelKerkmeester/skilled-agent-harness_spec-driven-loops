DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: security
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: correctness touched (1/4)
Traceability: core=partial overlay=inventory_only
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 10
Mode: review
Dimension: security
Review Target: same audit charter as iteration 1 -- see `deep-review-strategy.md` §2 TOPIC.

## READ FIRST (in order)

1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl` -- iteration 1's full record (P1-001 confirmed: ENV_REFERENCE.md omits the 3 new env vars).
2. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` -- charter, known context, doc inventory from iteration 1.
3. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json` -- current open findings (do not re-emit P1-001 as new; reference it if you find related evidence).

## THIS ITERATION'S FOCUS (iteration 2 of 10 -- security dimension)

The operator's brief states `.opencode/plugins/mk-goal.js` gained "hardened sanitizer/redaction" this session. Audit whether any in-scope documentation (SKILL.md/references/assets/feature_catalog/manual_testing_playbook/constitutional across ALL skills, plus README files) makes a security-relevant claim about the goal plugin that is now WRONG in either direction:

1. Read the actual sanitizer/redaction code in `.opencode/plugins/mk-goal.js` (search for sanitize/redact/scrub-style function names) and note exactly what it does (what gets redacted, what triggers redaction, any size/char caps).
2. Check whether any doc UNDERCLAIMS this (e.g. still says goal text/state is stored or injected without sanitization, or omits the hardening entirely where a security-relevant claim would be expected -- e.g. `references/hooks/goal_plugin.md`, `ENV_REFERENCE.md` char-cap rows, `constitutional/goal-prompting-runtime-specific.md`).
3. Check whether any doc OVERCLAIMS this (e.g. claims a stronger security property than the code actually delivers -- e.g. "fully sanitized" when only specific patterns are scrubbed, or claims of encryption/secure-storage that don't exist).
4. Check `store_health` and `mutation=` output fields (also new this session) for any inadvertent information disclosure risk (e.g. do they ever leak raw goal text, file paths outside the sandboxed area, or PII) and whether any doc's characterization of these fields is accurate on that front.
5. Note file:line evidence for every claim you confirm, downgrade, or refute. If you find zero security-relevant doc drift, say so explicitly with the specific docs you checked (a clean negative result is a valid iteration outcome, not a failure).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability (this iteration is a dedicated security pass)

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
- Write iteration narrative to: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-002.md`
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-002.jsonl`
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` (in-place updates only)
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead, recorded under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative markdown** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-002.md`. Structure: headings for Dimension, Files Reviewed, Security Audit Findings, Findings by Severity (P0/P1/P2), Traceability Checks, Next Dimension. The FINAL line MUST be exactly one of: "Review verdict: PASS", "Review verdict: CONDITIONAL", "Review verdict: FAIL".

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl`, `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":2,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-002","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-002.jsonl`: one `{"type":"iteration",...}` record plus per-event structured records (one per finding/classification/traceability-check/ruled_out direction).

All three artifacts are REQUIRED and will be validated.
