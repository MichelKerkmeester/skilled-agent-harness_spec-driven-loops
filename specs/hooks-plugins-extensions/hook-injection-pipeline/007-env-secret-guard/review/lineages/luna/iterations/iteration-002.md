# Review Iteration 002

## Dispatcher

- Run: fanout-luna-1794335564064-t156gg; lifecycle: new; fan-out lineage mode: auto.
- Focus dimension: security. Operator review_focus: The env-secret-guard change: core .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, its runtime adapters (Claude, Codex, Cursor, Devin, Pi, DSH, OpenCode plugin), the hook-registry entry, CE-P06/CE-P07 playbook scenarios and the docs that list it. Hunt for dotenv reads or writes the guard misses, false denials, value leaks from the inspection tools, and doc claims the code does not back. Never open a real .env file.
- This pass reviewed the shared value-free inspection boundary and each named adapter’s error path. The iteration addresses inspection-value leaks and fail-open branches by tracing core returns to the CLI and OpenCode tools, then checking how adapter errors are logged or allowed.
- Budget profile: verify.

## Files Reviewed

- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs
- .skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs
- .skilled/hooks/env-secret-guard/cli/env-secret.cjs
- .opencode/plugins/env-secret-guard.js
- .skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs
- .skilled/hooks/env-secret-guard/pi/env-secret-guard.ts
- .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json
- .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/env-secret-guard-inspect-without-values-conversation.md (CE-P06)
- .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/env-secret-guard-protect-from-edit-conversation.md (CE-P07)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Command-substitution path assignment can read .env without refusal (carried active from iteration 1)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:270 -- The command-substitution assignment gap remains active; this security pass found no counterevidence that changes its severity. See iteration-001 claim adjudication.
Finding class: security
Scope proof: The packet includes direct shell reading programs and cat is a supported reader.
Affected surface hints: Shared core shell classification and all adapters that delegate tool decisions to the core.
Case: f="$(printf .env)"; cat "$f" reads .env in a shell, while the classifier does not recognize the generated path.

### P2 Findings

2. **Single-quoted variable reference is expanded and falsely denied (carried active from iteration 1)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:200 -- The parser still discards quote context before expansion.
Finding class: correctness
Scope proof: The classifier handles quoted arguments and variable expansion for supported shell-reader paths.
Affected surface hints: Shared core shell tokenizer.
Case: With f=.env, cat '$f' targets a literal file named $f, but the guard expands it and denies.

3. **.env* is denied when only the exempt .env.example exists (carried active from iteration 1)** -- .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:305 -- The glob branch considers a synthetic .env candidate before checking actual entries.
Finding class: correctness
Scope proof: The shared core has an explicit .env.example exemption and shell glob evaluation.
Affected surface hints: Shared core glob matcher.
Case: With .env.example and no .env, cat .env* matches only the template but is denied.

## Findings - New

None.

## Traceability Checks

- Value-free inspection: confirmed. The parser’s internal entries include values, but listKeys returns only key names and validity, validate returns validity and invalid line numbers, and fingerprint returns only key/algorithm/digest.
- Inspection path boundary: confirmed. Inspection resolves real paths under the project root, allows dotenv names or the designated template, rejects non-regular files, and enforces the size cap; errors are fixed text.
- Pepper handling: confirmed. Fingerprint requires ENV_SECRET_GUARD_PEPPER, uses HMAC-SHA256, and does not return exact length.
- Adapter error paths: partial. Command hook, Pi and DSH fail open; OpenCode logs then allows when the shared core throws. These are explicit adapter policies, and ordinary core denial returns still block.
- Runtime scenarios: not run. CE-P06/CE-P07 remain documentation evidence only.

## Integration Evidence

- .skilled/hooks/env-secret-guard/cli/env-secret.cjs:30-44 serializes only the return from listKeys, validate, or fingerprint.
- .opencode/plugins/env-secret-guard.js:99-123 exposes those same three helper results as tools; its answer function JSON-serializes the helper output.
- .skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs:73-79 calls the shared core and denies only a deny decision; unexpected errors exit successfully and emit a diagnostic.
- .skilled/hooks/env-secret-guard/pi/env-secret-guard.ts:17-24 returns a block for deny and logs then allows errors.
- .skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs:34-40 returns deny for a core refusal and continues after caught errors.
- .opencode/plugins/env-secret-guard.js:82-96 returns on disabled/error paths and throws on a core denial; caught errors are written to a bounded log.
- The registry registration and CE-P06/CE-P07 names are unchanged from iteration 1; no additional runtime claim was made.

## Edge Cases

- No dotenv values were exposed by the inspected outputs; parser values stay internal to the fingerprint operation.
- Fail-open behavior is explicitly documented in each adapter. This pass found no contrary runtime contract, so it is recorded as a limitation rather than a new defect.
- The reducer reported two field-shape warnings for iteration 1: findingsSummary lacked P0/P1/P2 counts and findingsNew was numeric. verify-iteration.cjs nevertheless returned ok for the narrative, route proof, and delta. This iteration uses the prompt-pack schema; the earlier append-only record is retained.
- No real .env was opened, and no live runtime or playbook scenario was executed.
- Graph-backed traceability steps remain blocked by the lineage-only write fence and are not retried.

## Confirmed-Clean Surfaces

- The CLI and OpenCode tools return only derived value-free fields.
- Adapter diagnostics do not include parsed dotenv entries; ordinary guard denials are not converted into allow decisions.
- Path resolution checks real paths remain inside the project root.

## Ruled Out

- The inspection tools do not serialize the parser’s entries or values to stdout/tool results.
- HMAC output is keyed by a required environment pepper and omits exact input length.

## Next Focus

- dimension: traceability
- focus area: Compare packet acceptance claims and listed documentation against exact core branches, runtime registrations, and CE-P06/CE-P07 coverage.
- reason: Security inspection found no value-output path; verify the public claims and integration map.
- rotation status: rotate from security to traceability.
- blocked/productive carry-forward: Productive: direct source-to-doc comparison. Blocked: graph-backed traceability writes and live runtime scenarios are outside lineage authority; do not retry.
- required evidence: exact claim lines, current source anchors, and scenario/runtime coverage boundaries.
- recovery note: Keep runtime execution and real dotenv fixtures out of scope.

Review verdict: CONDITIONAL
