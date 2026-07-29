# Iteration 002: Security — Trust Boundaries & Executor Dispatch

## Focus
Security dimension: trust boundaries around deep-loop executor dispatch, secrets exposure, input handling, injection vectors in hook surfaces. Scanned: `executor-config.ts`, deep-loop runtime lib, fable-subagent-guard hook, session-prime hook, coverage-graph query module.

## Scorecard
- Dimensions covered: security
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.444 (severity-weighted: 4 P2 x 1.0 = 4, accumulated 9)

## Findings

### P2, Suggestion

- **F006**: cli-opencode executor grants full OS write access with no sandbox enforcement, `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280`
  The `--dangerously-skip-permissions` flag used for cli-opencode dispatch grants full OS-level workspace write access. The config's `sandboxMode` field is declared as supported (`executor-config.ts:78`) but the protocol doc states it "is NOT currently honored/enforced by opencode." Containment relies entirely on prompt-level contracts that the AI model must obey. A compromised or adversarial review target could inject write instructions into the prompt that bypass containment. Dimension: security.

- **F007**: Security-sensitive fix overrides are SPEC-ONLY with no runtime enforcement, `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:77-86`
  The contract for `minStabilizationPasses=2`, `requiredClosedFindingReplay=true`, and `requiredFixCompletenessGate=true` for security-sensitive surfaces (auth, paths, sandboxing, env precedence, schemas, persistence) is fully documented but marked "SPEC ONLY (future implementation)." No config, YAML, or reducer surfaces enforce these overrides. Operators running security reviews must manually apply them. Dimension: security.

- **F008**: Fable-subagent-guard fails open when transcript is missing or unreadable, `.opencode/skills/system-deep-loop/runtime/hooks/claude/fable-subagent-guard.mjs:13`
  The guard's design principle is "a broken guard must never block legitimate work," so it fails open. This means a corrupted, missing, or inaccessible transcript file allows any Fable subagent dispatch to proceed without model-override enforcement. The guard's `activeMainModel()` returns `null` on any error, and `null` is treated as a non-Fable model. Dimension: security.

- **F009**: Session-prime hook emits code-graph tool guidance every startup without server-health validation, `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:212`
  Lists `code_graph_scan`, `code_graph_query`, etc. as recovery tools. If the external `system_code_graph` MCP server is down or unreachable, every session startup injects guidance pointing to unavailable tools. This creates user confusion and wastes context budget. No health check before emission. Dimension: security.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | n/a | hard | - | Not applicable this iteration |
| checklist_evidence | n/a | hard | - | Not applicable this iteration |

## Assessment
- New findings ratio: 0.444 (4 P2 x 1.0 = 4, cumulative weighted total: 4 P2 x 1.0 = 5 from previous + 4 = 9, weighted new = 4, ratio = 4/9 = 0.444)
- Dimensions addressed: security (focused on trust boundaries and executor dispatch)
- Novelty justification: F006 documents a known but important architectural risk in the cli-opencode executor path. F007 flags a security gap in fix-override enforcement. F008 identifies a deliberate fail-open design choice. F009 notes stale guidance injection.

## Ruled Out
- Secrets exposure: No API keys, tokens, or credentials found in production code.
- Dangerous spawn/exec in hooks: Hook files use only `fs.readFileSync` and `process.stdout.write` — no subprocess execution.
- Injection vectors in agent definitions: Agent frontmatter permissions are explicit and bounded.

## Dead Ends
None.

## Recommended Next Focus
Traceability dimension: cross-reference spec.md claims against implementation artifacts, verify checklist evidence for decommission phases 001-015, and audit the closeout docs against actual diffs.

```json
{"findingId":"F006","claim":"cli-opencode executor uses --dangerously-skip-permissions with sandboxMode not honored, relying solely on prompt-level containment.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:78"],"counterevidenceSought":"Checked executor-config.ts sandboxMode field, found it declared as supported but loop-protocol.md states it is not honored.","alternativeExplanation":"The opencode CLI may gain sandbox support in a future release, making sandboxMode honored retroactively.","finalSeverity":"P2","confidence":0.88,"downgradeTrigger":"If opencode adds sandbox workspace-write support and the executor path uses it, downgrade to resolved.","transitions":[]}
```
```json
{"findingId":"F007","claim":"Security-sensitive fix overrides in convergence.md are SPEC-ONLY with zero runtime enforcement.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:77-86"],"counterevidenceSought":"Grepped runtime/ for requiredClosedFindingReplay and requiredFixCompletenessGate — zero matches in config, YAML, or reducer surfaces.","alternativeExplanation":"This is an intentionally deferred feature, not an implementation gap. The contract stands as spec for a future release.","finalSeverity":"P2","confidence":0.92,"downgradeTrigger":"When runtime enforcement ships, this finding resolves.","transitions":[]}
```
```json
{"findingId":"F008","claim":"Fable-subagent-guard fails open when transcript is unreadable, allowing Fable-on-Fable dispatch.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/hooks/claude/fable-subagent-guard.mjs:13","fable-subagent-guard.mjs:31-44"],"counterevidenceSought":"Checked activeMainModel() function — returns null on any fs error, null is treated as non-Fable.","alternativeExplanation":"Fail-open is the project-wide guard policy. The risk is mitigated by the fact that transcript files are always present in a running session.","finalSeverity":"P2","confidence":0.78,"downgradeTrigger":"If the guard gains a fail-closed option or transcript-health precheck, severity reduces.","transitions":[]}
```
```json
{"findingId":"F009","claim":"Session-prime injects code-graph tool names without validating server health.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:212"],"counterevidenceSought":"Checked for health-check logic before emission — none found. The guidance is emitted unconditionally.","alternativeExplanation":"Most sessions will have the external server operational; stale guidance is a minor UX issue.","finalSeverity":"P2","confidence":0.82,"downgradeTrigger":"If the guidance is conditioned on server-health check, severity resolves.","transitions":[]}
```

Review verdict: PASS
