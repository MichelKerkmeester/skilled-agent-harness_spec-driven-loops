# Review Iteration 002

Dispatcher: fan-out lineage `dsflash-llmgw`, executor cli-pi (deepseek-v4.1-flash), session `fanout-dsflash-llmgw-1791667148881-n911tj`.
Mode: review. Stop policy: max-iterations (5).

## Dimension

Security (D2). Focus: the Pi dispatch authorization trust boundary, wrapper-delivered dispatches, the classifier's expanded-token handling, and the audit writer's secret handling.

## Files Reviewed

- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:230-262` — tool_call handler entry, classification call, early return (READ)
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:307-433` — `SHELL_WRAPPER`, `EXEC_WRAPPERS`, `resolveDispatchPacket`, `resolveSegment` (READ, context)
- `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs:21,62` and `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs:22,57` — sibling adapters' resolver choice (READ)
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:500-536` — `SECRET_PATTERNS` and `scrubSecrets` (READ, context)
- `.skilled/hooks/dispatch/README.md:72,75` — documented Pi authorization policy (READ)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Pi dispatch authorization is bypassable by wrapper-delivered dispatches (`bash -c`, `sh -c`, `zsh -c`) that the rule engine's own resolver classifies as an executor** -- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235` -- The Pi handler classifies the command with `audit.inspectDispatch(event.input.command)` and returns at `:236` when the kind is `none`. `inspectDispatch` never unwraps shell payloads, so `bash -c 'devin -p task'`, `sh -c 'opencode run task'` and `zsh -c 'codex exec task'` all classify `none` — allowed — while `resolveDispatchPacket`, the wrapper-aware resolver shipped in the same module, maps the identical commands to `cli-devin`, `cli-opencode` and `cli-codex` [SOURCE: `probe/wrapper-probe.ts` output]. The Claude and Codex preflight adapters already call `resolveDispatchPacket` [SOURCE: `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs:62`; `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs:57`], so Pi is the only adapter that both denies ambiguous commands and misses wrapped ones; a wrapped dispatch also skips every hard rule (its `dispatchSkill` stays null and the handler returns before rule evaluation), including the stdin-redirect rule that exists to stop a hanging dispatch.

   Finding class: class-of-bug.
   Scope proof: `rg "resolveDispatchPacket|inspectDispatch"` over the four adapters shows Pi alone on `inspectDispatch`; the wrapper patterns (`SHELL_WRAPPER`, `EXEC_WRAPPERS`) and the unwrapping resolver exist in the shared lib and are already exercised by the sibling adapters.
   Affected surface hints: Pi `tool_call` preflight, `lib/dispatch-audit.mjs` resolver adoption, `dispatch-preflight-lint.test.ts` wrapper cases.
   Case: under the Pi runtime, issue `bash -c 'devin -p task'` in a turn whose request names no executor: the call executes with no authorization denial and no hard-rule evaluation, whereas the direct form `devin -p task` is denied.

   Claim adjudication:
   ```json
   {
     "type": "auth_guardrail_bypass",
     "claim": "The Pi guard's classification misses dispatches delivered through a shell -c payload while the shared resolver recognizes them as CLI dispatches, so the guard's authorization and hard-rule lint are both skipped for that shape.",
     "evidenceRefs": [
       ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235",
       ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:236",
       ".skilled/hooks/dispatch/lib/dispatch-audit.mjs:310",
       ".skilled/hooks/dispatch/lib/dispatch-audit.mjs:424",
       ".skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs:62",
       "probe/wrapper-probe.ts output"
     ],
     "counterevidenceSought": "Checked the guard README (documents ambiguous-denied and direct-unnamed-denied policy, says nothing about wrappers); checked whether the tokenizer deliberately treats quoted payloads as data (it does, for grep/prose false positives on the rule path, but the wrapper-informed resolver exists precisely to recover the -c case); checked the deny matrix tests, which contain no wrapper case at all.",
     "alternativeExplanation": "The guard may accept wrapper delivery because a nested shell is assumed to be the operator's own composition. That leaves the guard's stated authorization contract silently unenforced for a documented dispatch shape and drops the hard-rule pass with it, so the gap stands; the remedy matches the sibling adapters rather than inventing policy.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "A documented decision that shell-wrapped dispatches are out of the guard's authorization scope, with the README and deny matrix amended to say so."
   }
   ```

### P2 Findings

None this iteration.

## Traceability Checks

- `spec_code` (core): partial. The security lens does not change the phase-1..6 alignment results; commit 004's message still reaches `.pi/extensions` unchanged, and no phase doc claims a wrapper path was considered.
- `checklist_evidence` (core): notApplicable (Level 1 folder has no checklist.md).

## Integration Evidence

- `probe/wrapper-probe.ts` compares `inspectDispatch` against `resolveDispatchPacket` per command; the three shell wrappers are `none` for the guard and a resolved skill for the rule engine.
- Adapter grep: `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs:21,62`, `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs:22,57` use the wrapper-aware resolver; `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235` does not.

## Edge Cases

- `env devin -p task` is classified `direct` (the resolver skips `env` preassignments), so the bypass is specific to shell `-c` payloads and `eval`, not every wrapper.
- `perl` and `timeout` wrappers land in `ambiguous` and are denied — noisy but fail-closed.
- `eval 'devin -p task'` classifies `none` for both the guard and the rule resolver; recorded as an adjacent variant of the same gap rather than a separate finding, because the shared resolver has no eval unwrap to reuse.

## Confirmed-Clean Surfaces

- The deny reason is a static string with no interpolated command content, so the reviewed message change introduces no injection surface.
- The audit writer scrubs flag secrets, env assignments, bearer/header creds, provider key prefixes, PEM blocks and JWTs before appending [SOURCE: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:500-536`]; the guard itself writes nothing.
- The compiled-route test suites spawn fixed node entrypoints with `spawnSync`/`spawn` and temp roots, with no shell interpolation of reviewed inputs.

## Ruled Out

- **Secret disclosure through the reviewed guard.** Ruled out: the guard only returns static reason strings; the audit line scrubbing path is unchanged by the six commits.
- **Expanded-token handling in the classifier is injection-prone.** Ruled out as a separate finding: the same expanded-token state produces the iteration-1 false positive rather than an executable-injection path (nothing is executed by the classifier; it is a pure string classifier).

## Next Focus

- Dimension: traceability (D3)
- Focus area: each phase's `spec.md` / `goal.md` / `implementation-summary.md` against its commit (claim fidelity), the parent packet updates, cross-reference integrity for `.hermes` mirror and changelog, and the derived-artifact claims (`sync-skills-hermes --check`, trigger-index `--check`)
- Reason: D1 and D2 confirmed three P1 findings on the deny path and rebuild wiring; D3 checks whether the docs claim what the commits do
- Rotation status: correctness and security reviewed (findings open); traceability next
- Blocked/productive carry-forward: archived-fixture angle re-checked in D3
- Required evidence: file:line plus commit diffs for every claim mismatch
- Recovery note: none

Review verdict: CONDITIONAL
