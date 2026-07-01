# Iteration 006 - Security Pass B

## Dimension

Security -- PASS B: secret redaction in evidence/logs and state persistence safety.

Focus areas reviewed:

- `redactEvidence` coverage and call sites for verifier evidence, status output, injection preview, debug/continuation logs, and error handling.
- State directory permissions and per-session filename safety against crafted session ids/objectives.
- Whether raw secret-shaped text can reach chat/system context or shared logs outside plugin state.

## Files Reviewed

- `.opencode/plugins/mk-goal.js:96` - state directory normalization.
- `.opencode/plugins/mk-goal.js:167` - session-key derivation.
- `.opencode/plugins/mk-goal.js:205` - `redactEvidence` helper.
- `.opencode/plugins/mk-goal.js:446` - JSONL log writer.
- `.opencode/plugins/mk-goal.js:579` - state directory creation mode.
- `.opencode/plugins/mk-goal.js:592` - per-session goal path construction.
- `.opencode/plugins/mk-goal.js:716` - atomic state-file write path and file mode.
- `.opencode/plugins/mk-goal.js:1016` - verifier result normalization.
- `.opencode/plugins/mk-goal.js:1053` - supervisor-verifier exception handling.
- `.opencode/plugins/mk-goal.js:1077` - persisted verifier result fields.
- `.opencode/plugins/mk-goal.js:1350` - injection preview rendering.
- `.opencode/plugins/mk-goal.js:1402` - status output formatting.
- `.opencode/plugins/mk-goal.js:1445` - tool failure output.
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:45` - positive API-key and `sk-...` redaction test samples.
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:83` - stored verifier evidence redaction assertions.
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:91` - status output redaction assertions.
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:61` - session file separation assertions.
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:76` - hex session filename assertions.

## Findings By Severity

### P0

None.

### P1

#### DR-006-P1-001 [P1] Verifier exception messages bypass secret redaction before persistence and injection/status output

- File: `.opencode/plugins/mk-goal.js:1057`
- Claim: A secret-bearing supervisor-verifier exception message is sanitized but not redacted, then persisted as `lastVerifierReason` and surfaced through `injection_preview` in status/chat output.
- Evidence: `runSupervisorVerifier` catches verifier exceptions and builds `reason: sanitizeInlineText(\`Verifier failed: ${error?.message || 'unknown error'}\`, DEFAULT_MAX_REASON_CHARS)` without `redactEvidence` [SOURCE: `.opencode/plugins/mk-goal.js:1053`, `.opencode/plugins/mk-goal.js:1057`]. `maybeVerifyGoal` persists that result as `lastVerifierReason` [SOURCE: `.opencode/plugins/mk-goal.js:1077`, `.opencode/plugins/mk-goal.js:1085`, `.opencode/plugins/mk-goal.js:1086`]. `renderGoalInjection` includes that reason in the active-goal block [SOURCE: `.opencode/plugins/mk-goal.js:1356`, `.opencode/plugins/mk-goal.js:1371`], and `goalStateLines` emits the rendered `injection_preview` in tool/status output [SOURCE: `.opencode/plugins/mk-goal.js:1402`, `.opencode/plugins/mk-goal.js:1441`].
- Redaction coverage gap: `redactEvidence` handles `sk-...`, GitHub tokens, Slack tokens, AWS access keys, and `api_key|token|password|secret` assignment shapes [SOURCE: `.opencode/plugins/mk-goal.js:205`, `.opencode/plugins/mk-goal.js:207`, `.opencode/plugins/mk-goal.js:211`], but the exception path does not call it at all. Bearer tokens, JWTs, database connection strings, and generic env-var-shaped values in verifier exception text therefore remain raw.
- Counterevidence sought: Reviewed normal verifier evidence normalization and status tests. Normal `rawResult.evidence` and fallback evidence are redacted through `redactEvidence` [SOURCE: `.opencode/plugins/mk-goal.js:1016`, `.opencode/plugins/mk-goal.js:1029`], and tests assert API key plus `sk-...` samples do not remain in stored evidence or status output [SOURCE: `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:45`, `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:83`, `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:91`]. No equivalent test or code path redacts `error.message` before it becomes `lastVerifierReason`.
- Alternative explanation: If every configured `supervisorVerifier` implementation is fully trusted and guaranteed never to throw secret-bearing messages, this becomes a hardening gap rather than an active leak. That guarantee is not enforced at the plugin boundary.
- Finding class: cross-consumer / secret-redaction boundary.
- Scope proof: Exact read of all `redactEvidence`, `lastVerifierReason`, `renderGoalInjection`, `goalStateLines`, and failure/error paths found one unredacted exception-to-status/injection route; debug and continuation logs do not write evidence/objective text.
- Affected surface hints: `supervisorVerifier` exception handling, persisted goal state, `/goal status` output, active-goal injection preview.
- Recommendation: Redact verifier exception messages before storing or rendering them, preferably by applying `redactEvidence` to the composed failure reason or by replacing external exception detail with a bounded generic error plus internal-only diagnostic id.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: Downgrade to P2 only if the verifier boundary is constrained so exception messages cannot contain user, provider, transport, credential, or connection-string data, and that constraint is covered by tests.

### P2

None.

## Traceability Checks

- `spec_code`: partial. Secret redaction is present for verifier evidence, but verifier exception text has a separate unredacted path into persisted state and injection/status output.
- `checklist_evidence`: not applicable. The scoped phase folders are Level 1 packets and do not include `checklist.md`.
- `feature_catalog_code`: pending for the next traceability dimension.
- `playbook_capability`: pending for the next traceability dimension.

## Ruled Out Directions

- State path traversal via session id/objective: ruled out. `goalPathForSession` uses `${sessionKeyForSession(sessionID)}.json`, and `sessionKeyForSession` hex-encodes the required session id before joining it under `stateDir`; objective text is not used in path construction [SOURCE: `.opencode/plugins/mk-goal.js:167`, `.opencode/plugins/mk-goal.js:592`, `.opencode/plugins/mk-goal.js:594`].
- State-file permission failure for per-session JSON files: ruled out for newly written goal state. `ensureGoalStateDir` creates the state directory with `0o700`, and `writeGoalAtomic` opens temp state files with `0o600` before rename [SOURCE: `.opencode/plugins/mk-goal.js:579`, `.opencode/plugins/mk-goal.js:581`, `.opencode/plugins/mk-goal.js:724`, `.opencode/plugins/mk-goal.js:725`].
- Debug logging of objective/evidence: ruled out. `logDebugEvent` writes only sanitized event type and session id when `MK_GOAL_DEBUG=1` [SOURCE: `.opencode/plugins/mk-goal.js:464`, `.opencode/plugins/mk-goal.js:466`, `.opencode/plugins/mk-goal.js:467`, `.opencode/plugins/mk-goal.js:468`].
- Continuation decision logs leaking objective/evidence: ruled out. `logContinuationDecision` writes session id, decision, sanitized reason, and turn count, not objective, goal prompt, verifier evidence, or injection preview [SOURCE: `.opencode/plugins/mk-goal.js:455`, `.opencode/plugins/mk-goal.js:456`, `.opencode/plugins/mk-goal.js:459`, `.opencode/plugins/mk-goal.js:460`].

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. This iteration found one new P1 secret-redaction boundary gap and no P0 findings.

## Next Dimension

Traceability -- spec/code alignment and overlay catalog/playbook claims for phases 001-008, continuing to exclude `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**`.

Review verdict: CONDITIONAL
