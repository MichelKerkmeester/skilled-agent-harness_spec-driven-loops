## HIGH

No confirmed HIGH findings.

## MEDIUM

- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:73` — “`tests 106`, `pass 106`, `skipped 0`.” **Confirmed wrong:** the test file contains 107 test declarations; its mock-dependent skips also vary by filesystem. Update the expected counts or make them host-conditional.

- `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:94-95` — `codex exec ... -s read-only ... | grep ... 'SPEC FOLDER QUESTION'`; line 113 expects the question after “the run attempts its first write.” **Confirmed mismatch:** this command requests read-only mode, so it cannot reliably exercise mutation-time delivery. Use a disposable `workspace-write` run or add a direct first-write hook check.

- `.opencode/plugins/system-spec-gate.js:154-156` — “`enforce advises and carries the once-per-session mutation notice.” **Confirmed false:** `tool.execute.before` only logs telemetry at lines 272-285 and throws on denial at lines 286-287; it does not carry `result.detail` in advisory mode. Change the docstring to describe classify’s deferral relay and enforce’s telemetry-only advisory path.

- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1778-1785`, `:1847-1852`, `:424-432` — “`undelivered = !gate3DeliveryMarker(state)`” followed by emission, then marker recording. **Confirmed TOCTOU window; runtime impact inferred:** concurrent first mutations can both observe no marker and both deliver the advisory. Add a per-session atomic claim/lock, or document and enforce serialized mutation hooks.

## LOW

- `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:192-197` — current-looking live output says “reply with a letter A-E.” **Confirmed stale evidence:** the current deny detail in `spec-gate-core.mjs:187` uses the A-D mutation notice. Mark the entire captured block as pre-change history or refresh it.

## Verified correct

- Hermes’s serial advisory path calls the enforce adapter only from `transform_tool_result` (`.hermes/plugins/repo-guards/__init__.py:423-428`), while enforced writes are blocked in `pre_tool_call` (`:395-398`). The shared denial includes the full question (`spec-gate-core.mjs:180-187`).

- Claude, Codex, and Devin classify silently and emit the first-write notice through their enforce adapters; each acknowledges delivery after writing the envelope (for example, Claude `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs:40-49`).

- Pi’s UI path asks at the first write and returns a retry block (`.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts:110-126`). The supplied Hermes suite and Pi type-gate results were not rerun, per instruction.

## Uncertainty

- OpenCode and headless Pi intentionally relay `GATE_3_DEFERRED_INSTRUCTION` before mutation because they lack a user-facing mutation-result/dialog channel (`.opencode/plugins/system-spec-gate.js:230-245`; `spec-gate-classify.ts:49-67`). If the contract literally requires the full question only at the mutation, this remains a gap; repository documentation currently treats the deferral as the accepted fallback.

- Hermes’s fast-path predicate requires both `SYSTEM_SPEC_GATE_DISABLED=1` and `AI_SESSION_CHILD=1` (`.hermes/plugins/repo-guards/__init__.py:67-70`), while the shared core treats `AI_SESSION_CHILD=1` alone as a no-op (`spec-gate/README.md:103`). The subprocess core prevents visible leakage, but the Hermes-specific shortcut/test semantics are not fully aligned.
