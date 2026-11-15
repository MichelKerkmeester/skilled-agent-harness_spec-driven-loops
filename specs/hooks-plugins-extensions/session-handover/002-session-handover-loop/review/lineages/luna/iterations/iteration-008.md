# Iteration 8 — correctness and traceability

## Dimension

Correctness and traceability: repository-root, state/config resolution through a linked .skilled directory, and project-level registration of automatic runtime hooks.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/nudge.cjs:236-249
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:58-72, 182-204
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-159
- .skilled/bin/skilled-loop:10-32, 282-298, 423-436
- .skilled/hooks/shared/hook-flags.cjs:86-92
- .skilled/hooks/session-relaunch/README.md:23-31, 184
- .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:53-58, 85-98
- .claude/settings.json:126, 192, 247
- .codex/hooks.json:66, 139, 159
- .pi/extensions/session-relaunch.ts (symlink to .skilled/hooks/session-relaunch/pi/session-relaunch.ts)
- .pi/settings.json
- .opencode/plugins/session-relaunch.js:13-18
- .hermes/plugins/repo-guards/__init__.py:19-20, 33-40, 62-67
- .hermes/plugins/repo-guards/plugin.yaml:6-15
- README.md:1412
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:114, 167
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-26
- specs/hooks/023-session-relaunch-loop/review-archive/*/review-report.md and the two requested research reports (targeted search for linked-repository registration findings)

## Findings by Severity

### P0 Findings

1. **LUNA-FANOUT-P0-001 — A .skilled-only linked repository has no project-level automatic hook registrations**
   - Case: A consumer repository links only its .skilled directory to this checkout and has no equivalent user-level hook setup. Starting Claude, Pi, OpenCode, Codex, or Hermes through the shell shim finds skilled-loop, but the consumer repository has none of the sibling project hook surfaces that emit the usage nudge and arm events.
   - File: .skilled/hooks/session-relaunch/README.md:23-31.
   - Evidence: The runtime matrix places Claude registrations in .claude/settings.json, Codex registrations in .codex/hooks.json, Pi discovery in .pi/extensions/session-relaunch.ts, the OpenCode adapter in .opencode/plugins/session-relaunch.js, and Hermes events in .hermes/plugins/repo-guards. None is inside .skilled. The shell test fixture creates only the .skilled symlink at skilled-loop-shell.test.cjs:53-58 and tests wrapper discovery at :85-98; it does not install or exercise those sibling registrations. The repository README says the loop is on by default in the main checkout at README.md:1412. The target requirement nevertheless calls for equivalent hops in a repository that symlinks .skilled at spec.md:167.
   - Impact: Under this exact link-only setup, no project hook sends the nudge or arms the record, so none of the five automatic runtimes can start an automatic handoff.
   - Finding class: cross-consumer.
   - Scope proof: The five automatic registrations are all sibling project surfaces listed in the adapter matrix; a .skilled-only link does not create them. The prior-review search found only unrelated symlink findings about handoff-directory containment and a Pi development environment.
   - Affected surfaces: Claude project settings; Codex project hooks; Pi extension discovery; OpenCode project plugin; Hermes project plugin.
   - Recommendation: Add a supported link/bootstrap step that installs or links each required project registration alongside .skilled, and cover a clean linked-repository setup through the registration check for all five automatic runtimes.
   - Prior-review check: No archived review or research report records this link-only hook-registration gap.

### P1 Findings

None.

### P2 Findings

None.

## Review Evidence

- nudge.resolveRepoRoot uses SESSION_RELAUNCH_REPO_ROOT when set and otherwise resolves the checkout that contains the concern. The README documents that default as the install root. Note validation uses that same root.
- Relaunch state lives under XDG_RUNTIME_DIR or a uid-qualified temp directory. It is not addressed through a project-root path that the .skilled symlink could redirect.
- skilled-loop records the physical starting cwd, and the relaunch decision returns that cwd for restoration. Hermes similarly anchors its plugin script paths to the resolved install root while passing the session cwd to the adapter.
- These paths consistently use the install checkout for concern files and the launching repository for continuation cwd. The failure above is the missing project registration set in a link-only consumer.
- No separate realpath/state-directory mismatch was found.

## Traceability Checks

- spec_code: the phase 016 requirement explicitly includes a repository that symlinks .skilled; the link-only setup does not provide the project hook surfaces listed by the runtime matrix.
- checklist_evidence: deferred to iteration 10.
- skill_agent: iteration 9 will check the sk-doc command contract.
- agent_cross_runtime: the registered event surfaces were checked for all five automatic runtimes.

## Edge Cases and Ruled Out

- With runtime registrations present in the consumer, .skilled-relative command paths resolve through its symlink to the install checkout.
- The install-root note location is the documented default and does not change the saved project cwd used by the next hop.
- The recorded shared XDG state directory is independent of .skilled realpath resolution.
- A consumer that separately installs each project hook surface or an equivalent global hook setup is outside the link-only failure condition.

## SCOPE VIOLATIONS

- scope_violation: the workflow step_graph_upsert would write shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: the workflow step_graph_convergence would append observability data to the shared graph database; no write-mode graph command was run. Graph work remains graphless_fallback under the configured max-iterations policy.

## EXECUTION CONFLICT

The reducer strategy marks dimensions complete and deferred directions BLOCKED after one pass. The lead steer requires review across all runtimes and stages, so this lineage continues to its ten-iteration cap and records the live linked-repository gap found here.

## Claim Adjudication

- Finding: LUNA-FANOUT-P0-001
- claim: A repository that links only .skilled and has no equivalent global setup does not load the project hook registrations required to nudge and arm any automatic runtime.
- evidenceRefs: .skilled/hooks/session-relaunch/README.md:23-31; .claude/settings.json:126,192,247; .codex/hooks.json:66,139,159; .pi/extensions/session-relaunch.ts; .opencode/plugins/session-relaunch.js:13-18; .hermes/plugins/repo-guards/plugin.yaml:6-15; .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:53-58,85-98; specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:167.
- counterevidenceSought: Checked the actual registration files, the shell-shim symlink fixture, the runtime adapter matrix, main-checkout setup notes, and prior reviews/research for a link bootstrap or matching finding.
- alternativeExplanation: A consumer that separately installs the sibling runtime files or configures equivalent global hooks can run the adapters; that setup is not provided by the .skilled symlink and was not found in the reviewed bootstrap path.
- finalSeverity: P0
- confidence: 0.91
- downgradeTrigger: A supported bootstrap plus a linked-repository registration check that proves the five automatic runtime event surfaces are available from a clean .skilled-only consumer.

## Next Focus

Review Cursor and Devin command-only handoff execution, then check .skilled/commands/speckit/handoff.md against the sk-doc sk-create-command contract and its assets.

Review verdict: FAIL

