# Iteration 034 — maintainability

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:53:05.737Z
- New findings: 3 (of 3 reported; prior total 133)
- Coverage: {"filesExamined":19,"keyPaths":[".opencode/skills/system-deep-loop/runtime/vitest.config.ts",".opencode/skills/system-deep-loop/runtime/package.json",".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-rollback-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-rollback-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-resume-adapter.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-resume-adapter.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/spawn-cjs.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit-process-group.vitest.ts",".opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts"]}

## Summary
Examined the runtime test-discovery configuration, aggregate rollback suites, extreme timeout overrides, and the shared child-process test helper across a manifest containing 241 test files. Three concrete defects emerged: executable test modules are imported despite also being independently discovered, file-wide timeouts can conceal hangs for up to 24 hours, and the shared timeout helper cannot terminate a SIGTERM-resistant process. The aggregate-import pattern multiplies test registrations and spreads configuration and hook side effects across suite boundaries. No already-known finding was re-reported.

## Findings
- [P1] F-034-01 Aggregate suites register independently discovered tests a second time @ .opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:64
  - evidence: Lines 65-71 side-effect-import seven executable `*.vitest.js` suites. The same pattern exists at model-benchmark-rollback-gate.vitest.ts:70-76 and skill-benchmark-rollback-gate.vitest.ts:74-80. runtime/vitest.config.ts:17 independently discovers every `tests/**/*.{vitest,test}.ts`, so `npm test` collects each imported source suite directly and also registers its tests inside each rollback aggregate. Static registration counts show the agent aggregate imports at least 100 tests, while the model and skill aggregates import similarly large suites; nested imports such as agent-improvement-resume-adapter.vitest.ts:62 add further duplication.
  - recommendation: Stop importing executable test files. Extract reusable contract cases into non-discovered factory modules and invoke those factories explicitly, or rely on Vitest discovery and validate cross-suite coverage through metadata. Add a lint/test guard that rejects imports whose target matches the test-discovery pattern.
- [P1] F-034-02 File-wide timeout overrides can hide a hung test for a day @ .opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts:16
  - evidence: The module executes `vi.setConfig({ testTimeout: 86_400_000 })`, raising every test in the file from the configured 30 seconds to 24 hours without a matching reset. skill-benchmark-resume-adapter.vitest.ts:2067 and skill-benchmark-rollback-gate.vitest.ts:85 similarly install one-hour timeouts; the rollback aggregate explicitly extends that budget across all seven imported suites. A deadlock, leaked process, or unresolved promise therefore occupies a serial test worker for hours instead of producing timely failure evidence.
  - recommendation: Remove module-wide timeout mutation. Put bounded timeouts only on demonstrated slow cases, split expensive replay scenarios from unit tests, and add an independent process watchdog with a CI-scale upper bound. Require justification for any timeout exceeding the suite default.
- [P1] F-034-03 Shared spawn timeout never settles when the child ignores SIGTERM @ .opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts:331
  - evidence: On timeout, lines 331-335 only set `timedOut = true` and call `child.kill('SIGTERM')`; the returned promise resolves exclusively from the `close` listener at lines 345-354. A child that ignores SIGTERM therefore remains alive and the promise never settles. The unit test at spawn-cjs.vitest.ts:40-44 uses a cooperative timer process with no SIGTERM handler, so it passes without exercising the failure mode. This helper is used by lifecycle and integration suites, including callers that request 15-second timeouts.
  - recommendation: Implement two-stage termination: send SIGTERM, wait a short bounded grace period, then kill the process group with SIGKILL and settle the promise exactly once. Add a test fixture that ignores SIGTERM and spawns a descendant, asserting bounded completion and complete process-tree cleanup.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 34,
  "dimension": "maintainability",
  "summary": "Examined the runtime test-discovery configuration, aggregate rollback suites, extreme timeout overrides, and the shared child-process test helper across a manifest containing 241 test files. Three concrete defects emerged: executable test modules are imported despite also being independently discovered, file-wide timeouts can conceal hangs for up to 24 hours, and the shared timeout helper cannot terminate a SIGTERM-resistant process. The aggregate-import pattern multiplies test registrations and spreads configuration and hook side effects across suite boundaries. No already-known finding was re-reported.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Aggregate suites register independently discovered tests a second time",
      "file": ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts",
      "line": 64,
      "evidence": "Lines 65-71 side-effect-import seven executable `*.vitest.js` suites. The same pattern exists at model-benchmark-rollback-gate.vitest.ts:70-76 and skill-benchmark-rollback-gate.vitest.ts:74-80. runtime/vitest.config.ts:17 independently discovers every `tests/**/*.{vitest,test}.ts`, so `npm test` collects each imported source suite directly and also registers its tests inside each rollback aggregate. Static registration counts show the agent aggregate imports at least 100 tests, while the model and skill aggregates import similarly large suites; nested imports such as agent-improvement-resume-adapter.vitest.ts:62 add further duplication.",
      "recommendation": "Stop importing executable test files. Extract reusable contract cases into non-discovered factory modules and invoke those factories explicitly, or rely on Vitest discovery and validate cross-suite coverage through metadata. Add a lint/test guard that rejects imports whose target matches the test-discovery pattern."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "File-wide timeout overrides can hide a hung test for a day",
      "file": ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts",
      "line": 16,
      "evidence": "The module executes `vi.setConfig({ testTimeout: 86_400_000 })`, raising every test in the file from the configured 30 seconds to 24 hours without a matching reset. skill-benchmark-resume-adapter.vitest.ts:2067 and skill-benchmark-rollback-gate.vitest.ts:85 similarly install one-hour timeouts; the rollback aggregate explicitly extends that budget across all seven imported suites. A deadlock, leaked process, or unresolved promise therefore occupies a serial test worker for hours instead of producing timely failure evidence.",
      "recommendation": "Remove module-wide timeout mutation. Put bounded timeouts only on demonstrated slow cases, split expensive replay scenarios from unit tests, and add an independent process watchdog with a CI-scale upper bound. Require justification for any timeout exceeding the suite default."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Shared spawn timeout never settles when the child ignores SIGTERM",
      "file": ".opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts",
      "line": 331,
      "evidence": "On timeout, lines 331-335 only set `timedOut = true` and call `child.kill('SIGTERM')`; the returned promise resolves exclusively from the `close` listener at lines 345-354. A child that ignores SIGTERM therefore remains alive and the promise never settles. The unit test at spawn-cjs.vitest.ts:40-44 uses a cooperative timer process with no SIGTERM handler, so it passes without exercising the failure mode. This helper is used by lifecycle and integration suites, including callers that request 15-second timeouts.",
      "recommendation": "Implement two-stage termination: send SIGTERM, wait a short bounded grace period, then kill the process group with SIGKILL and settle the promise exactly once. Add a test fixture that ignores SIGTERM and spawns a descendant, asserting bounded completion and complete process-tree cleanup."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 19,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/vitest.config.ts",
      ".opencode/skills/system-deep-loop/runtime/package.json",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-rollback-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-rollback-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-resume-adapter.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-resume-adapter.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/spawn-cjs.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit-process-group.vitest.ts",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts"
    ]
  }
}
```