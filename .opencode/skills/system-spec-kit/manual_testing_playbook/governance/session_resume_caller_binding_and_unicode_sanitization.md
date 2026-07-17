---
title: "273 -- Session-resume caller binding and Unicode sanitization"
description: "This scenario validates the Phase 017 governance hardening for `273`. It focuses on strict session-resume caller binding and the NFKC plus zero-width sanitization guardrails."
version: 3.6.0.8
id: governance-session-resume-caller-binding-and-unicode-sanitization
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 273 -- Session-resume caller binding and Unicode sanitization

## 1. OVERVIEW

This scenario validates the Phase 017 governance hardening for `273`. It focuses on strict session-resume caller binding and the NFKC plus zero-width sanitization guardrails.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `session_resume` rejects mismatched caller/session IDs by default, permissive mode logs and continues, and the Unicode sanitizers normalize the documented confusable inputs.
- Real user request: `Please validate Session-resume caller binding and Unicode sanitization against caller-context plus the shared sanitizers and tell me whether the expected signals are present: strict mismatch rejected; permissive mismatch allowed with warning; Gate 3 and recovered payload sanitizers normalize the documented confusable inputs.`
- Prompt: `Validate session-resume caller binding and Unicode sanitization against the documented strict, permissive, and confusable-input cases.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: strict mismatch rejected; permissive mismatch allowed with warning; Gate 3 and recovered payload sanitizers normalize the documented confusable inputs
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if both the auth-binding and Unicode-hardening behaviors match the documented Phase 017 contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate session-resume caller binding and Unicode sanitization against the documented strict, permissive, and confusable-input cases.
```

### Commands

1. Run the strict-mode session-resume auth case with mismatched caller/session IDs
2. Re-run with `MCP_SESSION_RESUME_AUTH_MODE=permissive`
3. Run the Gate 3 Unicode test cases or the dedicated classifier suite
4. Run the shared-provenance sanitization suite or inspect sanitized recovered payload output

### Expected

Strict mismatch rejected; permissive mismatch allowed with warning; Unicode confusables normalized in both sanitizers

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/session-resume-auth.vitest.ts --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > proceeds when args.sessionId matches callerContext.sessionId
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > throws on mismatched sessionId in default strict mode
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > proceeds when callerContext.sessionId is null
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > proceeds when args.sessionId is not provided
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > re-reads auth mode at call time when strict follows permissive in one process
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > re-reads auth mode at call time when strict follows permissive in one process
[session-resume] Session-ID mismatch: args.sessionId='requested-session' vs callerContext.sessionId='transport-session' (permissive mode — allowing)

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > defaults to strict mode when MCP_SESSION_RESUME_AUTH_MODE is unset
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > ignores non-string args.sessionId values
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > treats an empty string sessionId as not provided
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > proceeds when args.sessionId matches callerContext.sessionId 478ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > throws on mismatched sessionId in default strict mode 13ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > proceeds when callerContext.sessionId is null 12ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > proceeds when args.sessionId is not provided 11ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > logs a warning and proceeds in permissive mode on mismatch 11ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > re-reads auth mode at call time when strict follows permissive in one process 11ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > defaults to strict mode when MCP_SESSION_RESUME_AUTH_MODE is unset 11ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > ignores non-string args.sessionId values 10ms
 ✓ mcp_server/tests/session-resume-auth.vitest.ts > session-resume auth binding > treats an empty string sessionId as not provided 11ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  00:40:11
   Duration  665ms (transform 389ms, setup 13ms, import 19ms, tests 567ms, environment 0ms)
```

Command run from `.opencode/skills/system-spec-kit`:

```text
npx vitest run scripts/tests/gate-3-classifier.vitest.ts -t "Gate 3 classifier — normalization" --reporter verbose

 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ✓ scripts/tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > lowercases and collapses whitespace 1ms
 ✓ scripts/tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > applies NFKC and strips soft hyphen / zero-width characters before matching 0ms
 ✓ scripts/tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > folds adversarial Unicode confusables into ASCII-safe normalized prompts 1ms
 ✓ scripts/tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > does not over-fold plain ASCII control inputs 0ms
 ✓ scripts/tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > tokenizes while preserving /, :, - and _ 0ms

 Test Files  1 passed (1)
      Tests  5 passed | 42 skipped (47)
   Start at  00:40:11
   Duration  108ms (transform 33ms, setup 0ms, import 43ms, tests 3ms, environment 0ms)
```

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/hooks-shared-provenance.vitest.ts --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > escapeProvenanceField > url-encodes a plain string value 1ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > escapeProvenanceField > url-encodes special characters that could break the marker line 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > escapeProvenanceField > uses fallback when value is null, undefined, or non-string 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > escapeProvenanceField > url-encodes the fallback too if it contains special chars 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > strips system/developer/assistant/user role prefixes 1ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > strips instruction-style injections 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > strips markdown headers that look like role sections 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > strips XML-style role tags 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > handles CRLF line endings 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > strips soft hyphen and zero-width characters before role-prefix filtering 1ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > folds Unicode confusables into ASCII before strip-pattern matching 1ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > does not over-fold plain ASCII control inputs 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > returns empty string when all lines are stripped 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > sanitizeRecoveredPayload > exposes the strip patterns array for downstream reuse 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > wrapRecoveredCompactPayload > wraps payload with [SOURCE:] / [/SOURCE] markers 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > wrapRecoveredCompactPayload > adds a [PROVENANCE:] line when metadata is provided 1ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > wrapRecoveredCompactPayload > omits the [PROVENANCE:] line when metadata is undefined 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > wrapRecoveredCompactPayload > uses fallbacks for missing metadata fields 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > wrapRecoveredCompactPayload > escapes adversarial metadata so forged markers cannot break out 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > wrapRecoveredCompactPayload > sanitizes the payload before wrapping (strips role prefixes inside) 0ms
 ✓ mcp_server/tests/hooks-shared-provenance.vitest.ts > hooks/shared-provenance > claude/shared.ts re-exports > Claude shared re-exports point to the same functions as shared-provenance 0ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  00:40:11
   Duration  112ms (transform 28ms, setup 14ms, import 24ms, tests 7ms, environment 0ms)
```

Additional observed output while executing the scenario: running the entire dedicated classifier suite with `npx vitest run scripts/tests/gate-3-classifier.vitest.ts` produced one non-Unicode failure:

```text
 FAIL  scripts/tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for direct speckit deep-research command prompts
AssertionError: expected [ ':auto' ] to deeply equal ArrayContaining{…}

- Expected
+ Received

- ArrayContaining [
-   "/deep:start-research-loop",
+ [
    ":auto",
  ]
```

### Pass / Fail

- **PASS**: both auth-binding and Unicode-hardening behaviors match the documented Phase 017 contract. Strict mismatch rejection and permissive warning/allow behavior passed in `session-resume-auth.vitest.ts`; Gate 3 normalization and shared recovered-payload normalization both passed their Unicode confusable checks.

### Failure Triage

Inspect `mcp_server/lib/context/caller-context.ts`, `mcp_server/context-server.ts`, `mcp_server/handlers/session-resume.ts`, `shared/gate-3-classifier.ts`, and `mcp_server/hooks/shared-provenance.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [governance/session_resume_caller_binding_and_unicode_sanitization.md](../../feature_catalog/governance/session_resume_caller_binding_and_unicode_sanitization.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 273
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `governance/session_resume_caller_binding_and_unicode_sanitization.md`
