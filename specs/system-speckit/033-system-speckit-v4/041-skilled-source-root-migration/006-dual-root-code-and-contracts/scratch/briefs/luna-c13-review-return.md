## Verdict

Not ready: the workflow does not support a `.skilled`-only checkout, accepts an empty positive fixture as a valid failure, and the guard can pass unreadable files or falsely flag unrelated imports.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F1 | P1 must fix | `.github/workflows/runtime-no-spec-import.yml:37` | In the supported `skilled-only` layout represented at `compiled-routing-foundation.vitest.ts:297-299`, `.opencode/bin/check-no-spec-imports.cjs` does not exist; the default workflow call fails before the fixture checks run. | Resolve whichever source-root name exists and build all guard and fixture paths from it. |
| F2 | P1 must fix | `.github/workflows/runtime-no-spec-import.yml:39` | If the positive fixture is moved or absent, the guard returns exit 2 at `check-no-spec-imports.cjs:143-145`; the `if` only rejects exit 0, so the workflow continues and can pass after the negative scan. | Capture the status and require the positive fixture to exit exactly 1. |
| F3 | P1 must fix | `.opencode/bin/check-no-spec-imports.cjs:112` | With an unreadable `*.cjs` file in an explicit scan directory, `walk` counts it at lines 88-90, `readFileSync` silently returns no violations at line 112, and `files.length` is nonzero, producing exit 0 at lines 148-158 despite reading zero files. | Count successful reads separately and return exit 2, or fail on read errors. |
| F4 | P2 should fix | `.opencode/bin/check-no-spec-imports.cjs:129` | A file containing `const x = require('safe-package'); const marker = '.skilled/specs';` is flagged because the line contains both `require` and `.skilled/specs`, although the import target is unrelated to the spec tree. | Parse the actual import expression or strip unrelated comments/literals before applying the dynamic-path fallback. |
| F5 | P2 should fix | `.opencode/bin/check-no-spec-imports.cjs:123` | A `.skilled/bin` file with `require('../specs')` resolves under the newly supported `.skilled/specs` root at lines 34-38 and is correctly rejected, but the violation reason at line 123 and header at line 152 incorrectly report `.opencode/specs`; the comments at lines 4 and 29-33 also hard-code the incomplete spelling. | Report the generic spec tree or the matched root, and replace path-specific comments with durable behavior-focused wording. |
Codex exit 0, 2026-09-17T11:05:10Z to 2026-09-17T11:10:26Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
