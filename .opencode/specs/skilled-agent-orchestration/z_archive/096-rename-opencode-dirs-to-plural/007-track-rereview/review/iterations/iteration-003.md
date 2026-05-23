# Iteration 3 — Correctness Pass #2 (101 cli-opencode executor-config wiring)

## Dispatcher

- Run: 3 of 10
- Mode: review
- Focus: `correctness:101-executor-config`
- Dimension: correctness
- Budget profile: `verify` (target 11-13 calls, used 9)
- Status: complete
- Lifecycle: new (sessionId `deep-review-102-2026-05-07T2055`, generation 1)

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` (full file)
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` (full file)
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:770-820` (if_cli_opencode branch)
- `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts` (full file)
- `.opencode/skills/cli-opencode/SKILL.md:10-100` (self-invocation contract)
- Live `opencode run --help` output (provider-side flag enumeration)

## Findings — New

### P0 Findings

None.

### P1 Findings

1. **cli-opencode `sandboxMode` is declared "supported" by parseExecutorConfig but silently ignored by the if_cli_opencode YAML dispatch branch** — `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:40` declares `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] = ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds']`. parseExecutorConfig therefore accepts e.g. `{kind:'cli-opencode', sandboxMode:'read-only'}` without throwing. But `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:787` hardcodes `--dangerously-skip-permissions` unconditionally, with no conditional render-hint that consults `config.executor.sandboxMode`. The note at line 801 explicitly states "`sandboxMode='read-only' is not currently honored (no opencode equivalent)`" — confirming the divergence is known. This is a state-integrity gap: a user setting `sandboxMode:'read-only'` for cli-opencode gets schema-accepted but their intent is silently ignored at dispatch. Either `sandboxMode` should be removed from `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` (parseExecutorConfig then rejects it like serviceTier), OR the YAML should branch on sandboxMode and refuse to dispatch when `read-only` is requested.
   - Finding class: `cross-consumer` (executor-config.ts surface and 4 YAML branches must agree)
   - Scope proof: All 4 YAML deep-* dispatch branches inherit the same hardcoded `--dangerously-skip-permissions` pattern; the comment at line 801 documents the gap explicitly.
   - Affected surface hints: `executor-config.ts:40`, `spec_kit_deep-review_auto.yaml:781-802`, `spec_kit_deep-review_confirm.yaml:if_cli_opencode`, `spec_kit_deep-research_auto.yaml:if_cli_opencode`, `spec_kit_deep-research_confirm.yaml:if_cli_opencode`

```json
{
  "type": "wiring_divergence",
  "claim": "cli-opencode sandboxMode is schema-supported by EXECUTOR_KIND_FLAG_SUPPORT but ignored by all 4 if_cli_opencode YAML branches",
  "evidenceRefs": [
    "executor-config.ts:40 (sandboxMode in supported list)",
    "executor-config.ts:127 (validation gate skips when supportedFlags.includes(field))",
    "spec_kit_deep-review_auto.yaml:787 (hardcoded --dangerously-skip-permissions)",
    "spec_kit_deep-review_auto.yaml:801 (note: sandboxMode='read-only' is not currently honored)"
  ],
  "counterevidenceSought": "Whether some other code path enforces sandboxMode for cli-opencode at dispatch time. Searched the YAML branch for sandboxMode references — zero hits inside if_cli_opencode block (lines 781-802).",
  "alternativeExplanation": "Could be intentional 'best effort' compatibility — but then EXECUTOR_KIND_FLAG_SUPPORT entry should drop sandboxMode to avoid the false 'accepted' contract.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Documentation-only deferral with explicit ADR pointing to a known-limitation entry would downgrade to P2."
}
```

### P2 Findings

1. **Zero unit-test coverage for `cli-opencode` in executor-config.vitest.ts** — `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` contains explicit test cases for `native`, `cli-codex`, `cli-gemini`, and `cli-claude-code` but **zero** mentions of `cli-opencode` (grep count = 0). The file ships with 24 test cases (lines 9-156). cli-opencode is the 5th wired executor and matches the symmetric test-coverage profile cli-claude-code already has (model required? supported flags? unsupported-flag rejection? whitelist behavior?). All 5 in-process probes I ran in this iteration (minimal config, serviceTier rejection, reasoningEffort acceptance, arbitrary-model acceptance, null-model acceptance) returned the expected behavior, so this is a coverage gap not a runtime defect. Add at minimum 4 cases mirroring the cli-claude-code pattern: minimal accept, serviceTier reject, arbitrary-model accept (no whitelist parity test), and a sanity check on reasoningEffort flowthrough.
   - Finding class: `instance-only` (test file)
   - Scope proof: `grep -c "cli-opencode" executor-config.vitest.ts = 0`
   - Affected surface hints: `tests/deep-loop/executor-config.vitest.ts`

```json
{
  "type": "test_coverage_gap",
  "claim": "cli-opencode shipped as a wired executor kind without any unit-test coverage in the dedicated executor-config test file",
  "evidenceRefs": [
    "tests/deep-loop/executor-config.vitest.ts:1-157 (full file, no cli-opencode references)",
    "executor-config.ts:7 (cli-opencode in EXECUTOR_KINDS)",
    "executor-config.ts:32-41 (cli-opencode flag-support entry)"
  ],
  "counterevidenceSought": "Whether cli-opencode is exercised in matrix-adapter-opencode.vitest.ts. That file exists per Glob output and tests adapter-level invocation; it does NOT exercise parseExecutorConfig with cli-opencode kind (different layer).",
  "alternativeExplanation": "If matrix tests indirectly cover the parser layer, this might be redundant — but the architectural pattern (one test file per module) and the parity with cli-claude-code coverage make this a real gap.",
  "finalSeverity": "P2",
  "confidence": 0.95,
  "downgradeTrigger": "Confirmation that another test file directly invokes parseExecutorConfig with cli-opencode permutations would downgrade to ruled-out."
}
```

## Traceability Checks

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | partial | 101 implementation-summary claims cli-opencode wired across 6 surfaces. Code confirms 6 surfaces touched but executor-config↔YAML sandboxMode contract is divergent (P1 above). |
| checklist_evidence | pass | EXECUTOR_KINDS array correctly extends to 5 kinds; flag-support entry shape matches the readonly-tuple pattern of siblings. |

Summary: required=2, executed=2, pass=1, partial=1, fail=0, blocked=0, notApplicable=0, gatingFailures=0.

## Integration Evidence

- **Schema correctness**: In-process probe of `parseExecutorConfig` confirms 5 of 5 cli-opencode behavior expectations — minimal config defaults work, serviceTier is correctly rejected, reasoningEffort is accepted and flows through, arbitrary models are accepted (intentionally no whitelist), null model is accepted (parity with cli-claude-code, divergent from cli-codex).
- **CLI flag surface**: Live `opencode run --help` confirms `--variant <string>` exists with no enum constraint. The YAML render hint mapping `reasoningEffort → --variant` is therefore wire-compatible at the CLI layer (provider-side string validation is downstream and out of scope).
- **Self-invocation contract**: `cli-opencode/SKILL.md:12` (CRITICAL banner) + `:54-96` (Python `detect_self_invocation` with 3-layer detection) is concrete and matches the YAML reference at `spec_kit_deep-review_auto.yaml:802`. Contract is grep-checkable — the §SELF-INVOCATION PROHIBITED section heading exists verbatim.
- **No model whitelist for cli-opencode**: Confirmed by code read at `executor-config.ts:143-156` — only `cli-gemini` has a whitelist gate (`GEMINI_SUPPORTED_MODELS`). cli-opencode and cli-claude-code share the no-whitelist behavior. Intentional given OpenCode supports many provider models.
- **No `resolveOpencodeSandboxMode` helper**: Confirmed by full-file read at `executor-config.ts:46-67` — sandbox-mode resolvers exist for codex/gemini/claude only. Consistent with the F1 finding that sandboxMode is effectively dead config for cli-opencode.

## Edge Cases

1. **Strategy doc shows correctness as "completed" but dispatch packet asks for correctness pass #2.** Honored the dispatch focus (101 executor-config) which is a different surface than iter-2 (100 reducer). Both are correctness-dimension. Recorded both as completed dimensions; will not re-rotate to correctness in subsequent iterations unless new contradicting evidence surfaces.
2. **F2 shared gap (cli-claude-code + cli-opencode both accept null model unlike cli-codex).** Out of declared 101 scope (the 099→100→101 lineage chain doesn't introduce this; it predates cli-opencode landing). Recorded in `ruledOut` for synthesis-time consideration if cli-claude-code wiring is ever re-reviewed.
3. **Iteration-003.md not previously existing** — confirmed via `ls iterations/` showing only iteration-001.md and iteration-002.md. Safe to write.

## Confirmed-Clean Surfaces

- `EXECUTOR_KINDS` array correctly extended to include `'cli-opencode'` at executor-config.ts:7.
- `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` correctly omits `'serviceTier'` (cli-opencode has no service-tier knob — verified against `opencode run --help`).
- `parseExecutorConfig` correctly rejects unsupported flags for cli-opencode (verified by Test 2 probe — `serviceTier:'fast'` throws ExecutorConfigError with the documented "field 'serviceTier' is not supported by executor kind 'cli-opencode'" message).
- No model whitelist for cli-opencode — intentional, matches cli-claude-code pattern.
- Matrix-runner adapter at `adapter-cli-opencode.ts:1-37` correctly defaults `MATRIX_OPENCODE_VARIANT` to `'high'` and passes it via `--variant`.
- SKILL.md self-invocation guard contract (3-layer detection: env, ancestry, lockfile) is concrete and grep-checkable.

## Ruled Out

1. **F2: cli-opencode accepts null model** — out of declared 101-wiring scope; this is a shared cli-claude-code/cli-opencode pattern that predates the verdict-flip targets. Disposition: `deferred_to_separate_review`.
2. **F3: `--variant xhigh` could be silently rejected by DeepSeek provider** — provider-side concern, not 101 executor-config concern. parseExecutorConfig correctly enforces the `REASONING_EFFORTS` enum. Disposition: `out_of_scope`.
3. **F5: missing `resolveOpencodeSandboxMode` helper** — consistent with F4 finding (sandboxMode is dead config for cli-opencode). Resolution depends on F1 fix direction. Disposition: `subsumed_by_P1_028`.
4. **TypeScript compilation correctness** — verified indirectly via `node --experimental-strip-types` parse + execution; module loaded and all 5 probes ran without TypeScript errors. Disposition: `verified_implicitly`.

## Next Focus

- **Dimension**: security
- **Focus area**: workflow-resolved spec_folder authority + Stop hook gating + opencode `--dangerously-skip-permissions` semantics in light of P1-028 (sandboxMode wiring divergence)
- **Reason**: correctness dimension is now exercised at 2 surfaces (100 reducer iter-2, 101 executor-config iter-3). Strategy queue advances to security per dimension-queue ordering (item 3). P1-028 also hands off a security-adjacent question: does the unconditional `--dangerously-skip-permissions` create a privilege-escalation surface when used in CI/automation chains?
- **Rotation status**: rotating to next dimension (security)
- **Blocked carry-forward**: `claim:'P1-026 fix has hidden regression'` (BLOCKED iter-2)
- **Productive carry-forward**: `category:'in-process Node adversarial probes for parser correctness'` (PRODUCTIVE iter-2-3)
- **Required evidence**: read `--dangerously-skip-permissions` implementation in opencode binary docs; verify Stop hook gating actually fires for cli-opencode dispatch path; check for any path-traversal surface in `--dir "{repo_root}"` substitution.
