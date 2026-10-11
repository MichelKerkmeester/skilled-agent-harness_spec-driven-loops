# Iteration 002 — Security

Dispatcher: deep-review iteration 2 of 5, focus security. Resolved route: mode=review target_agent=deep-review. Session `fanout-dsflash-llmgw-1791717087028-ifv8d2`, generation 1, lineageMode new, stopPolicy max-iterations.

## Dimension

Security: trust boundaries, input handling, auth/authz of the dispatch guard, process-spawn safety in the advisor plugin, and the fail-open/fail-closed behavior of the hook stdin deadline. Adversarial framing of the correctness pass's guard-coverage advisory.

## Files Reviewed

- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:273-331` — `inspectDispatch` fail-open paths, `shellPayload` unescape semantics, `MAX_INSPECTED_COMMAND_CHARS`.
- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235-268` — guard consumption of `direct`/`ambiguous`/`none` and the deny text.
- `.opencode/plugins/system-skill-advisor.js:681-697,963-1060` — `detectWorkspaceSurface` marker reads and the advisor CLI spawn.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:364-381,415-439` — `--surface-hint` forwarding.
- `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:24` and `schemas/advisor-tool-schemas.ts:249-251` — hint accepted, unknown surfaces ignored.
- `.skilled/skills/sk-code/shared/references/stack-detection.md` §2 — the canonical detection order and symlink guard the plugin cites.
- `.skilled/skills/system-spec-kit/runtime/hooks/README.md` (deadline paragraph) and `hook-stdin-deadline.test.mjs:233-333` — fail-open behavior under a hostile host.
- `.skilled/bin/compiled-route-sync.cjs:1002-1036` — `--check` read scope after the drift comparison.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The workspace-surface hint treats any `.skilled` path component as the hub's own directory, wider than the canonical detector it cites** -- `.opencode/plugins/system-skill-advisor.js:688` -- `detectWorkspaceSurface` resolves the workspace path and returns `OPENCODE` when any path component equals `.skilled` (line 689: `real.split(/[\\/]/).includes('.skilled')`). The cited canonical rule — `.skilled/skills/sk-code/shared/references/stack-detection.md` §2, "Symlink guard" — holds OPENCODE "only when the **resolved** real path of the CWD or of a changed/target file lands inside the hub's actual `.skilled/` directory". A workspace whose path merely contains a `.skilled` component (another checkout, a home dot-directory) is not inside this hub but still gets `surfaceHint: OPENCODE`. The plugin test pins this component-level behavior for a folder inside the hub (`system-skill-advisor-plugin.vitest.ts:660-677`) and does not cover a non-hub `.skilled` path. Impact is bounded: the front door "uses the hint only to order surfaces the prompt matched" and ignores unknown surfaces (`advisor-recommend.ts:24`), so the worst case is a wrong tie-break ordering in the advisor brief, never a denial or a code change.
   Finding class: detector divergence (advisory, pre-existing)
   Scope proof: line 688-689 is the exact predicate this range added; the canonical rule it cites is stack-detection.md §2; the consumer behavior is pinned in `runtime/tools/advisor-recommend.ts:24`.
   Affected surface hints: `.opencode/plugins/system-skill-advisor.js` surface detection; sk-code surface routing in the advisor brief; the plugin test matrix.
   Case: a workspace rooted at `/tmp/.skilled/demo` (or any non-hub checkout whose path contains a `.skilled` component) resolves without error, matches the component test, and sends `surfaceHint: OPENCODE` although it is not inside the hub's own `.skilled` directory.

## Traceability Checks

- `spec_code` (core) — partial: the advisor phase claim ("other workspaces send none") is contradicted at the edges by the predicate above; the four code-phase claims were matched in iteration 1 and remain consistent.
- `checklist_evidence` (core) — pending.
- Overlay protocols — pending.

## Edge Cases

- `inspectDispatch`'s `catch (_) { return { kind: 'none' } }` (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs:298-300`) is a deliberate fail-open on tokenizer failure. For a name-attribution lint over statically provable shapes, the alternative (fail-closed on parse errors) would deny ordinary commands; recorded as design, not a finding.
- The Pi guard is not a sandbox: any shape it cannot statically prove reads `none` and is allowed (variables in command position, script files, the second wrapper of a compound command — carried advisory R1-P2-001). This is the guard's documented contract ("the command does not prove one direct executor" is denied only when evidence exists), so the security pass does not upgrade the advisory to P1.
- A hostile host that writes stdin after 500 ms loses the payload and the entry fails open exit 0 (`.skilled/skills/system-spec-kit/runtime/hooks/README.md` residual-risk paragraph). The phase documents this exact loss mode; the change's tests drive every one of the seven entries on both sides, so the claim is verified rather than assumed.
- The advisor CLI is spawned with an argv array and the prompt travels on stdin (`system-skill-advisor.js:1000-1014`); no shell interpolation of prompt text exists on this path.

## Confirmed-Clean Surfaces

- Escaped-quote unwrap semantics match the shell for the characters that matter in double quotes (`$`, backtick, `"`, `\`, newline continuation) and do not unescape other sequences (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs:326-332`); the expansion case still fails closed to `ambiguous` and the quoted-dispatch case to `none` (iteration 1 probes).
- `compiled-route-sync.cjs --check` reads only; the drift comparison cannot write, and its failure path throws after printing the file list (`.skilled/bin/compiled-route-sync.cjs:1021-1035`). Confirmed by the clean `git status` before/after.
- The advisor `surfaceHint` key is consistent end to end — plugin request option (`system-skill-advisor.js:709`), runtime read (`advisor-recommend.ts:553,622`), CLI flag (`advisor-recommend.ts:381`), schema (`schemas/advisor-tool-schemas.ts:251`).
- The hook deadline parity test fails if the three 500 ms copies diverge (`hook-stdin-deadline.test.mjs:291-298`), so a silent drift in the security-relevant timeout is no longer possible.

## Ruled Out

- Command injection via the advisor prompt: the prompt is length-clamped, JSON-serialized, and written to the child's stdin; the child is spawned without a shell (`.opencode/plugins/system-skill-advisor.js:1000-1014`).
- Path traversal from `--check`'s `path.join(runtimeRoot, rel)`: `check` only reads, and a traversal path would surface in its own error message; no write path is reachable from the range's change.
- Denial-of-service by a huge `manifest.json` read in `detectWorkspaceSurface`: the read is bounded in practice by the workspace file and any throw is caught to `null` (`.opencode/plugins/system-skill-advisor.js:686-696`).
- Secrets exposure: none of the changed files handle credentials; the advisor CLI path passes no environment secrets to the prompt.

## Integration Evidence

- Pi `tool_call` preflight (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`) is the runtime consumer of the changed unwrap helper; its test pins the new allowed escaped-quote case.
- The advisor CLI bridge (`.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`) is the consumer of `surfaceHint`; its tool schema and CLI flag were read at the cited lines.
- The hooks README (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) is the operator-facing statement of the deadline's fail-open risk; the test file cited above is its proof.

## Next Focus

- Dimension: D3 traceability
- Focus area: claim fidelity — each 015 phase's `spec.md`, `goal.md` and `implementation-summary.md` against its commit; version and changelog hygiene for each release in the range (sk-code 2.2.10.0, sk-git 1.8.4.0, system-spec-kit 2.7.8.0, system-deep-loop 1.5.6.0, runtime 1.9.8.0, advisor 0.15.1.0); derived artifacts via their `--check` mode; the 009 ledger states against today's tree.
- Reason: dimensions order correctness → security → traceability; the doc-phase claims were deferred from iteration 1.
- Rotation status: D1, D2 reviewed; D3 next; D4 pending.
- Required evidence: `git show` per phase doc folder plus direct reads of the cited release files; `--check` runs for derived artifacts.

Review verdict: PASS
