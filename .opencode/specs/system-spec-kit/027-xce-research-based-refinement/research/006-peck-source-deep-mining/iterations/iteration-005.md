# Iteration 005 — Anti-verdict-softening + anti-gaming discipline

**Focus:** peck "don't relabel Fail as conditional/partial" + anti-gaming `<avoid>` + "always emit a Verdict section" vs spec-kit honesty/verify-before-completion + deep-review verdict contract.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.55.

## Findings
- **[F-005-01]** peck forbids softening a reviewer Fail into "conditional or partial" (`external/peck-master/src/assets/agents/implementer.md:40`); spec-kit blocks completion on validation/checklist failure but never NAMES relabeling as forbidden (`CLAUDE.md:247-251`, `system-spec-kit/SKILL.md:428-449`). GAP real. **ADOPT** · S · low · blast: completion-ritual wording + /speckit:complete prompts.
- **[F-005-02]** peck "Fail ⇒ report the blocker, not completion" output contract (`implementer.md:52-72`); spec-kit reconciles completion metadata but lacks the equivalent contract (`CLAUDE.md:247-258`). GAP real. **ADAPT** · S · low.
- **[F-005-03]** peck names the gaming move "Partially tested instead of Not covered to inflate the ratio" (`acceptance-reviewer.md:86-91`); spec-kit doesn't ban coverage-label inflation. GAP partial. **DEFER** (overlaps deferred T1; reuse the anti-label-gaming wording there) · M · med.
- **[F-005-04]** peck "every report must include a Verdict section even on long output" (`acceptance-reviewer.md:79-83,93`); deep-review ALREADY requires an exact parseable verdict line per iteration (`deep-review/SKILL.md:349-367,450`). GAP none for iteration output. **SKIP** · S · low.
- **[F-005-05]** peck's anti-truncation is sharper for FINAL reports: spec-kit final report carries required sections but doesn't say truncation-without-verdict is invalid (`deep-review/SKILL.md:440,458-461`). GAP partial. **ADAPT** · S · low.

## Ruled out
- general honesty already shipped ("Never lie/fabricate", "UNKNOWN") (`CLAUDE.md:38-42`).
- generic verify-before-claiming already shipped (`verify-before-completion-claims.md:21-33`).
- deep-review already has a mandatory iteration verdict line; the net-new piece is anti-truncation for FINAL reports.

## Verdict contribution
Net-new = a sharp **anti-softening rule** ("do NOT relabel a failing gate as conditional/partial") for the completion ritual (**ADOPT**) + anti-truncation for final reports (**ADAPT**). Bundles with 001/002 into the verification-discipline sub-packet. The label-gaming piece DEFERs into the T1 packet.
