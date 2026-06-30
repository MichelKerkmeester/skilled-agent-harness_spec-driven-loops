# Iteration 44 — gpt55

**Angle:** Audit deep-loop-runtime executor tests for provider/model examples that are not meant to validate model identity.

**Findings:** 6

- **[P2] drift** `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts:85` — Command-shape tests pin real-looking model IDs
  - evidence: Test title: "cli-codex produces codex exec with stdin piping"; fixture/assertion pins `model: 'gpt-5.4'` at line 88 and `expect(cmd).toContain('--model "gpt-5.4"')` at line 95, while the test is validating argv shape and stdin piping.
  - fix: Use a neutral sentinel such as `test-codex-model`/`test-claude-model` or a shared `MODEL_UNDER_TEST` constant so the test validates pass-through, not live model identity.
- **[P2] misalignment** `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:47` — Executor config parser tests use provider-branded IDs despite no whitelist intent
  - evidence: Test title: "accepts a wired cli-codex executor with a model" followed by `model: 'gpt-5.4'` at line 48; the same file explicitly states `accepts cli-opencode without a model (no whitelist enforcement)` at line 189.
  - fix: Replace provider-branded examples with neutral sentinel strings in parser tests, keeping only kind/field-support behavior under assertion.
- **[P2] drift** `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts:38` — Audit serialization tests centralize on a stale-looking Codex model example
  - evidence: Helper comment: "Returns a default cli-codex ExecutorConfig for use in tests." and the helper returns `model: 'gpt-5.4'` at line 43; audit tests then assert JSONL/audit fields rather than model validity.
  - fix: Define `const TEST_CODEX_MODEL = 'test-codex-model'` and use it in audit assertions so provenance serialization remains covered without encoding provider identity.
- **[P2] drift** `.opencode/skills/deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts:33` — Dispatch-failure tests use model names while validating failure-state behavior
  - evidence: Test title: "returns dispatch_failure_logged when a crash happens before the iteration record is written" with fixture `model: 'gpt-5.4'` at line 36; the assertion checks `reason: 'dispatch_failure_logged'` at line 60.
  - fix: Use a neutral model fixture for the executor provenance block and keep the assertion focused on dispatch failure logging.
- **[P2] misalignment** `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:724` — Fanout argv/env tests hard-code model examples unrelated to their assertions
  - evidence: Test title: "omits service_tier from codex argv when serviceTier is unset (A4)" uses helper config `model: 'o4-mini'` at line 694; the assertion only checks `expect(argvLine).not.toContain('service_tier')` at line 727.
  - fix: Use neutral sentinel model values in fanout helpers unless the test explicitly verifies model mismatch or model extraction.
- **[P2] contradiction** `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:59` — Native executor fixture carries a model even though native rejects models
  - evidence: `nativeExecutor()` returns `kind: 'native'` and `model: 'gpt-5.4'` at lines 61-62; executor-config tests state `rejects model for native because the kind does not support it` at line 157.
  - fix: Set the native fixture model to `null`; keep requested-vs-actual model identity checks only on executor kinds that support model fields.
