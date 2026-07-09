# Deep Review Iteration 015

## Dimension

Security - `deep-improvement` packet.

## Files Reviewed

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:142`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:31`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:537`
- `.claude/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:343`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:429`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:433`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:437`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:445`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:453`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:477`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:489`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:511`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:639`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:650`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:72`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:190`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:194`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:202`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:204`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:37`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:68`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:73`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:78`
- `.opencode/skills/system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md:69`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:111`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:159`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:165`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:435`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs:44`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:394`

## Findings by Severity

### P0

None.

### P1

#### DR-015-P1-001 [P1] Promotion and rollback boundaries trust supplied manifest/config equality instead of enforcing an allowed root

- Claim: The deep-improvement promotion and rollback helpers enforce many real gates, but their final write boundary is only `target === config.target` and `target === single canonical manifest target`; they do not resolve `target`, `manifest`, `config`, `archiveDir`, `backup`, or acceptance-state paths under a workspace/spec/agent allowlist before `copyFileSync` writes the canonical target. If the runtime config/manifest or accepted-state file is generated or pointed at the wrong path, the mutating helper can overwrite a live file outside the intended agent/skill target set while still passing its own boundary gate.
- Evidence refs: `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:343`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:437`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:511`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:639`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:650`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:190`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:194`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:204`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:73`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:78`
- Counterevidence sought: Promotion requires `proposalOnly === false`, `promotionEnabled === true`, explicit `--approve`, benchmark-complete/pass, repeatability, candidate existence, rubric guard, target/config equality, single manifest canonical target equality, and two-phase ship hash checks; rollback shared helper checks accepted-state hashes before copying. Those reduce accidental promotion risk but do not constrain resolved write destinations to allowed roots.
- Alternative explanation: The intended trust model may be that config and manifest are operator-authored immutable runtime inputs, not candidate-controlled data. That lowers exploitability, but the packet is the only mutating family and the helper is a reusable CLI accepting arbitrary path arguments, so relying on caller discipline is weaker than an enforced boundary.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if the command/YAML layer proves it always constructs `target`, `manifest`, `config`, `archiveDir`, and `acceptance-file` from immutable trusted templates and rejects any resolved target outside `.opencode/agents/`, `.claude/agents/`, `.opencode/skills/`, or an explicitly configured allowlist before invoking these helpers. Resolve by adding realpath containment checks in the helpers themselves.

### P2

None.

## Traceability Checks

- `promotion_guardrails`: partial. Real approval, score, benchmark, repeatability, rubric, mirror-sync, and hash gates exist, but write-boundary containment is not enforced at the final mutation point.
- `env_var_hardening`: pass for runtime safety. `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is fail-closed in `score-model-variant.cjs` and shared by `bundle-gate.cjs`; raw grader cache output is redacted unless `DEEP_AGENT_GRADER_CACHE_RAW=1|true`. `lane_b_mechanics.md` line 69 still describes permissive backward-compatible defaults, but the current code does not silently default unsafe.
- `script_injection_surface`: pass for sampled paths. Criterion commands are behind the fail-closed env gate; model dispatch uses `spawnSync` argv arrays, not shell string concatenation; materialized fixture ids are basename-restricted before writes.
- `rollback_safety`: partial. The shared rollback helper verifies accepted-state hashes before copy, but both shared and legacy rollback helpers share the same caller-supplied manifest/config equality boundary and lack root containment.
- `prior_findings`: carried forward existing DR-014-P1-001 only as context; no re-count.

## Verdict

CONDITIONAL. One new P1 security finding was confirmed in the deep-improvement mutation boundary.

## Next Dimension

Iteration 16 should continue `deep-improvement` with traceability. Focus on command/YAML invocation paths and generated docs for whether they compensate for or contradict DR-015-P1-001; do not re-count DR-014-P1-001 or DR-015-P1-001 unless new evidence broadens the impacted surface.

Review verdict: CONDITIONAL
