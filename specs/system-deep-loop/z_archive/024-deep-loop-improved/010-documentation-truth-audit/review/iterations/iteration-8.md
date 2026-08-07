# Deep Review Iteration 8

## Dimension
Synthesis-input integrity: verify whether the four active P1 remediation notes are internally consistent, preserve the current Goal utility facts verbatim for final synthesis, and check the goal-plugin contract doc for a missed fifth P1/P0.

## Files Reviewed
- `.opencode/skills/sk-code-review/references/review_core.md:28-49` - severity and evidence doctrine loaded before final severity calls.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:78` - requires the Spec Kit rename and Goal Plugin promotion.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:113` - requires README TOC/heading rename and no dangling old anchor.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:135` - success criterion requires Goal Plugin subsection with TOC entry.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/tasks.md:72-73` - task wording still includes the retired label at line 72 and the Goal subsection task at line 73.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/graph-metadata.json:164-170` - metadata still derives `Spec Kit Documentation` and also has `Spec Kit Framework` from `tasks.md`.
- `README.md:33` - current root TOC still points `SPEC KIT DOCUMENTATION` at `#spec-kit-documentation`.
- `README.md:208` - current root FEATURES heading still says `Spec Kit Documentation`.
- `README.md:780-818` - current Deep Loop feature text still lacks the explicit safety-posture sentence required by P1-004.
- `README.md:1231-1234` - current Goal utility wording captured verbatim below for synthesis preservation.
- `.opencode/plugins/README.md:49` - goal-plugin contract row checked against the planned root README Goal Plugin subsection.
- `review/iterations/iteration-7.md:40-47` - prior narrowed fix-completeness statements rechecked against current source files.
- `review/deep-review-findings-registry.json:6-86` - active registry confirms 4 P1 and 1 P2 remain open.
- `review/deep-review-strategy.md:24-62` - current strategy state checked for consistency with this iteration.

## Findings by Severity

### P0
None.

### P1
No new P1 findings.

The four active P1s remain valid and synthesis-ready:
- `P1-001`: The remediation note is internally consistent. The final fix must rename both `README.md:33` and `README.md:208`, and the TOC anchor must become `#spec-kit-framework`.
- `P1-002`: The remediation note is internally consistent only if the new FEATURES subsection gets a TOC entry and preserves the current utility-entry facts before trimming the old bullet.
- `P1-003`: Iteration 7's narrowed description is correct. `tasks.md:72` still contains the retired label, and `graph-metadata.json:164` still derives it, so the fix must explicitly correct the source wording and regenerate metadata or manually correct metadata after generation.
- `P1-004`: The remediation note is internally consistent. A bare runtime-doc link is not enough; the root README needs one explicit sentence naming the permission/sandbox boundary plus stall watchdog, per-lineage cost cap, and lag-ceiling/overrun guardrails, with runtime/script doc links.

### P2
No new P2 findings.

## Traceability Checks
- `spec_code`: PASS. `spec.md:78`, `spec.md:113`, and `spec.md:135` align with the active remediation plan for the README rename and Goal Plugin FEATURES subsection; they do not conflict with iteration 7's narrowed fix descriptions.
- `checklist_evidence`: CONDITIONAL. Final synthesis should keep `P1-003` open until evidence shows `tasks.md:72` source wording and active graph metadata no longer surface the retired entity.
- `feature_catalog_code`: PASS/partial. `.opencode/plugins/README.md:49` says `mk-goal.js` is the `/goal` plugin and owns per-session state, active-goal injection, `mk_goal`/`mk_goal_status` tools, lifecycle accounting, and default-off guarded continuation. That does not create a fifth P1/P0 if the new root README subsection distinguishes the OpenCode user command `/goal_opencode` from the plugin entrypoint `mk-goal.js`, and preserves the Claude Code native `/goal` boundary.
- `README.md:1231-1234` exact current wording is now preserved for synthesis:
  - `- Claude Code: use the built-in native `/goal <condition>` — do not route through `mk_goal` (that tool does not exist in Claude Code sessions)`
  - `- OpenCode: `/goal_opencode <condition>` sets a session completion condition the agent keeps working toward across turns; show / pause / clear / complete via the `mk_goal` tools`
  - `- Backed by the `mk-goal` OpenCode plugin: per-session goal state (atomic, fail-closed) plus active-goal injection into each turn; usage is accounted over the session lifecycle`
  - `- Autonomous continuation is **default-off** and gated (caps, cooldown, kill-switch). See `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` for the plugin contract (OpenCode only)`
- Fifth P1/P0 sweep: PASS. The plugin README row is compatible with the planned root README Goal Plugin subsection when the implementation fix uses precise wording: Claude Code native `/goal` is separate; OpenCode users invoke `/goal_opencode`; the plugin entrypoint is `mk-goal.js`; the tool surface is `mk_goal`/`mk_goal_status`.

## Verdict
CONDITIONAL. No new findings were added, but the active synthesis input still contains 4 P1 and 1 P2. The final report must preserve the exact Goal facts, must not close `P1-003` as self-resolving, and must phrase the Goal Plugin subsection to avoid conflating Claude Code `/goal`, OpenCode `/goal_opencode`, and the `mk-goal.js` plugin entrypoint.

## Next Dimension
Continue to iteration 9 under `stop-policy=max-iterations`; broaden into final-report completeness and remediation-workstream ordering so synthesis keeps all active findings actionable without duplicating or weakening them.
Review verdict: CONDITIONAL
