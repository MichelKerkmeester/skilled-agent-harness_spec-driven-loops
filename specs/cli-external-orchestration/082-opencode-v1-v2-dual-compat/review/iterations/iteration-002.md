# Deep Review - Iteration 2 (security)

## Dimension

security. Surfaces named for this iteration: the classifier injection screen and its classifier-injection paths; the goal supervisor and the goal tool path; session-cleanup subprocess calls; command-string readers (sk-git-message-gate, cli-dispatch-audit); PATH and OPENCODE_BIN binary resolution; the dispatch guards and hard-rules.json; the setup helper and the CI workflow inputs.

## Files Reviewed

In-manifest files read for this dimension: .opencode/plugins/classifier-injection-screen.js (98 lines, whole); .opencode/plugins/lib/classifier-injection-screen-core.js (28); .opencode/plugins/cli-dispatch-audit.js (131); .opencode/plugins/sk-git-message-gate.js (71); .opencode/plugins/session-cleanup.js (274); .opencode/plugins/codex-hooks-watchdog.js (102); .opencode/plugins/opencode-goal.js (imports, sanitizers 397-470, bindGoal 1835-1890, tool surface 3329-3381); .opencode/plugins/lib/opencode-goal-core.js (31); .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs (333); .skilled/hooks/dispatch/lib/dispatch-audit.mjs (constants 1-60, reader 89-335, wrappers 348-400, redaction and append 562-735); .skilled/hooks/dispatch/lib/opencode-version.mjs (234); .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json (6 rules); .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh (502); .skilled/commands/doctor/scripts/opencode-version-battery.cjs (probe and temp regions).

Read as context only, outside the 157-file manifest, and NOT grounds for any finding: .opencode/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs and classifier-screen-fetched-text.mjs; .opencode/hooks/goal/lib/goal-slice.cjs; .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs; .github/workflows/opencode-dual-version.yml.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R2-P2-001 - A test marker in the evaluated command text disables two Hermes hard rules at enforcement time

- Claim: the negative-control marker SPECKIT_DISPATCH_NEGATIVE_CONTROL=1 is matched against the same composed command string the rule engine evaluates, and the checks hermes-yolo-required-for-writes and hermes-explicit-toolsets-required both return passed when it is present. A dispatch carrying the marker runs a Hermes chat with a write-capable toolset and no --yolo, or with delegation/memory toolsets named, and the guard reports clean.
- EvidenceRefs: [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:93] declares the marker; [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:186] and [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:203] are the two early returns; the only consumer that can refuse runs it through [SOURCE: .opencode/plugins/cli-dispatch-audit.js:89], which throws only on block-severity violations.
- CounterevidenceSought: read the marker's comment at :86-92 (intentional scenario control), the severity mapping at :319-322, and the adapter throw at :98. No second barrier survives the marker: the rules it removes are removed before severity matters.
- AlternativeExplanation: deliberate test seam - the guard's own proof scenarios must issue a refused shape, the marker is the least-invasive way to make that runnable in-process, cannot appear by accident, and the closed outcome is a quality/confinement guard rather than a credential boundary.
- FinalSeverity: P2. Confidence: high on mechanism.
- DowngradeTrigger: the control moves out of the command string (parent-process env or a test-only entry point), or evidence the marker cannot be reached by a model-authored command.

#### R2-P2-002 - CLI_DISPATCH_AUDIT_DISABLED also turns off the pre-execution dispatch refusal

- Claim: the kill-switch check short-circuits tool.execute.before before it resolves a dispatch packet or evaluates hard rules, so an operator silencing telemetry also loses the only in-session denial for ad-hoc dispatches. The variable and its documentation frame the switch as audit scoped.
- EvidenceRefs: [SOURCE: .opencode/plugins/cli-dispatch-audit.js:75] (before-hook early return) and [SOURCE: .opencode/plugins/cli-dispatch-audit.js:104] (after-hook); the variable is declared and described at [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:18].
- CounterevidenceSought: the owning module's comment at :15-18 says the switch turns the whole surface into a full no-op under either runtime, so whole-surface intent is documented in code; a separate isHookEnabled gate exists at :74.
- AlternativeExplanation: bundling is deliberate - one switch owns one optional surface.
- FinalSeverity: P2. Confidence: high.
- DowngradeTrigger: the switch is renamed or documented as guard+audit, or enforcement moves behind its own gate.

#### R2-P2-003 - Unmodeled command-position prefixes and env -S classify as none, skipping both the audit line and the hard-rule refusal

- Claim: the recognizer resolves a dispatch only from a direct command-position executor or through the two shell families and three exec wrappers it models. Shapes such as a subshell (opencode run x), a negation (bang opencode run x), nohup/command prefixed runs, and env -S with a quoted payload classify none: the executor token is not in command position, and the non-command-position evidence path requires a print flag, which the print-flagless executor shapes (opencode run, codex exec, hermes chat with a query flag) do not carry. none means no audit line and no pre-execution refusal.
- EvidenceRefs: [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:217] (directExecutor requires command position), :278-295 (hasDispatchEvidence needs a print flag for the non-position paths), :353 (SHELL_WRAPPER covers only bash/sh/zsh/dash -c), :391-396 (exec wrappers are perl, env and timeout only); consumer effect at [SOURCE: .opencode/plugins/cli-dispatch-audit.js:82] and [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:343].
- CounterevidenceSought: the wrapper comment at :348-350 and :383-387 states the wrapper list is empirical - 38 perl, 64 env, 13 timeout dispatches repo-wide and zero for every other wrapper - and says to add one only when a real dispatch uses it; bash-family -c wrappers are unwrapped and quote-safe executors are normalized.
- AlternativeExplanation: a best-effort recognizer consistent with its declared scope; print-flag shapes with a flag still classify ambiguous and enforce, so only the print-flagless shapes are exposed.
- FinalSeverity: P2. Confidence: medium - mechanism read token by token from the code, not executed; the env -S path in particular depends on how the exec-wrapper regex consumes the -S argument.
- DowngradeTrigger: a unit or live run shows any of these shapes classify direct or ambiguous, or the runtime's bash tool is shown to normalize them before the hook sees them.

## Traceability Checks

- spec_code (core): pass. spec.md:71 names the dispatch guards as a reviewed surface and the feature catalog describes dispatch semantics; evaluate (:284-333), resolveOpencodeVersionSync (:184-217) and resolveDispatchPacket (:497-506) match that description, including the documented unknown-version downgrade.
- feature_catalog_code (overlay): pass. The catalog's direct/ambiguous/none model, quoted-executor normalization, wrapper unwrap and version-scoped rule behavior match the code read this iteration.
- skill_agent (overlay): pass. The six hard-rules.json entries match the catalog's rule-by-rule paragraph (two blocking errors on both families, no-bare-agent-general warn v1, command-flag-for-slash-prompt error v1, v2-slash-prompt-route warn v2, share advisory on both).
- checklist_evidence (core): partial. No security checklist row was read this iteration; the phase-child checklists remain for the traceability iteration.
- agent_cross_runtime (overlay): partial. The Claude/Codex/Devin/Pi preflight consumers of the shared recognizer are outside the 157-file manifest; the cross-runtime claim was verified only against the catalog, not against those files.
- playbook_capability (overlay): partial. The in-scope review-agent-security-audit playbook page was not opened this iteration.

## Search Coverage (v2)

Twelve ledger rows: three finding-linked rows (guard_bypass) and nine ruled out (subprocess_injection, secret_exposure, path_traversal, data_egress, ci_injection, destructive_write, flag_weakening duplicate). No deferred rows, no blocked rows. Graph and semantic search were unavailable to this worker; coverage is a graphless fallback over the dimension's named surfaces.

## Scope

Read-only review. No out-of-scope mutation was needed or performed. The delegate modules listed under Files Reviewed are outside the manifest and were opened only to test candidate findings; none of the three findings is attributed to them.

## Verdict

PASS with advisories: 0 P0, 0 P1, 3 new P2 (registry total: 6 P2). The three findings are guard-scope defects, not exploitable boundaries: all three were checked against their owning design comments before being filed, and each carries a downgrade trigger.

Review verdict: PASS