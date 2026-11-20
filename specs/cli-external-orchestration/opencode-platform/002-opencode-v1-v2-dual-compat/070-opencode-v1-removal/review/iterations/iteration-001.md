# Deep Review Iteration 001

## Dispatcher

- Command: `/deep:review` (route: mode=review, target_agent=@deep-review, single iteration)
- Generation 2, lineage mode `restart`; session `2026-11-19T15:56:57.978Z`
- Dimension: D1 Correctness (inventory pass first)
- Review target: the branch's own runtime commit `ba9720f2f08` and its tests

BINDING: target=Branch worktrees/477-opencode-v1-removal, commits since origin/main (ba9720f2f08 runtime code, fc8b3a9a241 CI and packages, af87a2aa13a docs, 96e3d8a8f24 spec packet, 3ef324c3de1 renames, 4c72145b752 live evidence, a793f3ad733 merge resolution)
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | full | parser, probe, cache, refusal paths |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | diff + 2345-2440, 3490-3530 | native lineage removal, opencode argv, refusal ordering |
| `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` | diff | worktree refusal message |
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` | full | parser, trusted-executable path, async probe race |
| `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json` | full | parser expectations |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | 1-80, 1085-1176 | `evaluate` version filtering, `UNRESOLVED_FAMILIES` |
| `.skilled/hooks/shared/session-readers/opencode.mjs` | diff + 95-260 | legacy table removal, role derivation, tool dedup |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | diff | part-table removal, latest-session routing |
| `.opencode/plugins/lib/v2-bridge.js` | full + diff | `{ id, setup }` export, hidden factory, cleanup |
| `.opencode/plugins/opencode-goal.js` | diff | disposed / question branches |
| `.opencode/plugins/system-spec-gate.js` | diff | lifecycle epoch narrowing |
| `.opencode/plugins/system-dist-freshness-guard.js` | diff | disposed branch narrowing |
| `.skilled/bin/skilled-loop` | diff + 750-830, 1205-1225 | `--standalone` handling, model carry |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | full | 4 rules, all `appliesTo: ["v2"]` |
| `.opencode/plugins/tests/plugin-inventory.json` | 1-20 | event evidence after the branch narrowing |

Evidence commands run: `git show ba9720f2f08 --stat`, per-file `git show`, `node --check` on every touched runtime module (exit 0), `grep` for removed symbols (`thinkingBlock`, `partEntries`, `messageRoles`, `PART_TABLE`, `LEGACY_MESSAGE_TABLE`, `SESSION_TABLES`) in the session reader (clean no-hit), `grep -rn UNRESOLVED_FAMILIES` (locally defined at `dispatch-rule-checks.mjs:50`, not a dangling import).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Retired-major comment promises a token the parser never returns** -- .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:17 -- The `SUPPORTED_FAMILIES` comment states that "a recognised major outside it resolves to 'unsupported', which names a retired install but does not refuse the dispatch". `parseOpencodeVersion` returns `'unsupported'` only for major 1 (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:201) and `'unknown'` for every other major, which the module's own corpus records for `3.0.0` (.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json:9).
   Finding class: documentation-accuracy (maintainability)
   Scope proof: both files are in the reviewed commit's own diff (`git show ba9720f2f08 --stat`) and were read in full this iteration; the claim and the behaviour sit three lines apart in one module.
   Affected surface hints: `evaluate` version filtering at .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1120, the cli-opencode packet's `appliesTo` rows, and any future consumer that branches on `'unsupported'` to name a retired install.
   Case: a maintainer reads the comment and writes a test or branch expecting `resolveOpencodeVersion` to answer `'unsupported'` for an OpenCode 3 binary; it answers `'unknown'`, so a caller that wants to tell "retired install" apart from "unreadable probe" classifies a future major as unreadable.
   Confidence: high. Downgrade trigger: none at P2; this is already the lowest tier.

2. **Two byte-identical version parsers with divergent failure semantics** -- .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:148 -- `parseOpencodeVersion` exists twice with the same body and the same `VERSION_PATTERN`: the deep-loop resolver throws `E_OPENCODE_UNRESOLVED` on `'unsupported'` (:120) while the cli-dispatch resolver returns the token and lets `evaluate` downgrade severity (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:183). One parser decides whether a fan-out lineage starts; the other decides whether a hard rule blocks, warns, or is skipped.
   Finding class: duplicate-implementation (maintainability)
   Scope proof: both files are part of the removal commit, each exports the function independently, and each has its own tests; nothing in the repository links the two copies.
   Affected surface hints: cli-opencode hard-rule severity at .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1120, fan-out start at .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2351, and the two version corpora that pin the parser independently.
   Case: a future change teaches one copy to accept a new major, or to read a semver prerelease-with-build form. The guard and the loop runtime then disagree about the same binary, and only the copy whose tests moved stays green.
   Confidence: high on the duplication. The extraction is constrained because the copies live in different module systems (CJS runtime, ESM hooks), so the actionable fix is a shared fixture or a parity test rather than a plain import. Downgrade trigger: none at P2.

3. **Wrapper drops the capability probe and now passes `--standalone` to any `opencode`** -- .skilled/bin/skilled-loop:1217 -- The commit deletes the `--help` probe that set `opencode_two` and now always prepends `--standalone` for the opencode runtime (:825, :1217). The wrapper never calls the version resolver, so an OpenCode 1 binary on PATH is launched with a flag it does not have.
   Finding class: error-reporting (correctness, diagnosability)
   Scope proof: the whole probe block and the `opencode_two` variable are removed in `ba9720f2f08`; the replacement conditions at :1213 and :1217 no longer test a capability, only `opencode_server_seen` and `opencode_standalone_seen`.
   Affected surface hints: the runtime refusal message at .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:120, and the relaunch path at .skilled/bin/skilled-loop:825.
   Case: an operator whose PATH still resolves `opencode` 1.19.3 runs the loop wrapper. The hop now dies with the CLI's own "unknown option: --standalone" usage error instead of the resolver's "is OpenCode 1, which is no longer supported; install OpenCode 2", because the wrapper never asks the resolver and the deleted probe was its only capability signal.
   Confidence: high on the mechanism. Severity stays P2 because the launch fails either way; what regresses is the diagnosis, not the outcome. Downgrade trigger: if the wrapper is documented as the sole supported entry point for OpenCode launches, this raises to P1.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` (core) | partial | The phase parent's binding decisions are known only through the strategy's spec.md summary: major 1 resolves unsupported, native deep-loop lineages dropped, legacy session/message branches removed, `EVENT_ALIASES` and the v2 bridge kept. Each was checked against code this iteration (resolver :201, `fanout-run.cjs:3190-3211` and :3505, the session reader's `SESSION_TABLE`, `v2-bridge.js` `EVENT_ALIASES` intact). A direct `spec.md` read was not performed, so alignment is recorded as partial rather than pass. |
| `checklist_evidence` (core) | not run | Correctness iteration; the `tasks.md` and `acceptance-criteria.md` evidence rows belong to the traceability dimension (iteration 3). Omitted rather than recorded as pending. |

## Integration Evidence

- `.skilled/bin/skilled-loop` — the loop relaunch owner; checked the argv it builds for the opencode runtime (`--standalone`, `--prompt`, carried model via `OPENCODE_CONFIG_CONTENT`).
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` — the per-iteration executor; its worktree refusal changed only in wording (`--dir` becomes `--repo-root`).
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — the fan-out runner; both the pre-flight refusal (:3505) and the command builder (:3211) refuse `kind: 'native'` with the same message, and `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1110` plus :3162 assert both.
- `.opencode/plugins/lib/v2-bridge.js` — the plugin host contract; the module now exports the enumerable `{ id, setup }` shape and keeps the factory non-enumerable, and every entry point under `.opencode/plugins/*.js` calls `dualPlugin('<id>', <factory>)`.
- `.skilled/hooks/shared/session-readers/opencode.mjs` — the read path the handover hook uses; `session_v2` is the only session table and `session_message` the only message table.

## Edge Cases

- **`UNRESOLVED_FAMILIES` looked like a dangling import.** `dispatch-rule-checks.mjs:1098` and :1120 use it while importing only `resolveOpencodeVersionSync` and `SUPPORTED_FAMILIES` from the resolver. Confirmed locally defined at :50; the severity behaviour holds: a rule whose `appliesTo` covers `SUPPORTED_FAMILIES` keeps its blocking severity for an unresolved binary, so an unreadable probe cannot silently downgrade `stdin-redirect-required`.
- **`nativeDual: []` in `.opencode/plugins/tests/plugin-inventory.json:2`** can no longer be populated now that the dual server export is gone. Recorded as an observation, not a finding: the field is inert in every test read, and no consumer was found that it would mislead.
- **Event-branch narrowing** (`opencode-goal.js` suffix match becomes `=== 'global.disposed'`, `system-dist-freshness-guard.js` dropping `server.instance.disposed`, `system-spec-gate.js` dropping `session.resumed`) is evidence-backed rather than assumed: `.opencode/plugins/ARCHITECTURE.md:224` records that the 2.3.2 binary strings hold no `server.instance.disposed`, and `plugin-inventory.json:12` records that `global.disposed` delivery on 2.3.2 is uncaptured. Both were read before the narrowing was ruled out.
- **`durationMs` in the state record** is derived from the durable `iteration_start` timestamp (`2026-11-19T15:57:51.766Z`), clamped to the configured 120-minute ceiling, because the sandbox clock and the packet's recorded timestamps are not guaranteed to share an epoch.

## Confirmed-Clean Surfaces

- `parseOpencodeVersion` boundary rows: the corpus covers `v1.19.3`, a prefixed `1.19.3`, `1.19.3-beta.1`, `2.0.32`, `3.0.0`, `0.9.1`, empty output, a leading blank line, and a warning line before the version; the token-plus-pair candidate loop answers every row as the corpus declares.
- `resolveOpencodeBinary` refusal path: `'unsupported'` and `'unknown'` both throw `E_OPENCODE_UNRESOLVED` with the probe output attached, so no caller can observe a v1 binary as a usable resolution.
- Session reader role derivation after the part-table removal: `row.type` alone decides user versus assistant (`opencode.mjs:109-124`), and the tool-call dedup set is now local to `messageEntries` (:102), which is correct because the part rows that shared it no longer exist.
- `v2-bridge.js` setup and cleanup: the factory failure path still disposes every registration before rethrowing, and `setup(ctx, options)` forwards options only to the factory.
- Native lineage removal completeness: no path reaches a native command build — the pre-flight refuses before any lineage starts, the builder refuses as a second barrier, and the `--command deep/<loop>` adapter and its input composer are deleted rather than orphaned.
- Syntax: `node --check` on the cli-dispatch resolver, the rule engine, the deep-loop resolver, the fan-out runner, the session reader, and the plugin bridge — all exit 0.

## Ruled Out

- **The `server.instance.disposed` and `app.disposed` removal is a shutdown regression.** Ruled out: `.opencode/plugins/ARCHITECTURE.md:224` records that the 2.3.2 binary defines neither, and the cleanup the bridge returns still runs the v1 `dispose` hook.
- **Removing the question-event branches leaves blocked-prompt state set.** Ruled out: `toV1ToolContext` throws `ask is not available on OpenCode 2` (`v2-bridge.js`), so no v2 question event exists to clear it.
- **The v1 `part` table removal loses answers the sweeper used to find.** Ruled out by decision: the phase removes the legacy table branches, and on a 1.x database the reader reports `store_unreadable` instead of half-reading a legacy layout.
- **Rule-engine fail-open through `UNRESOLVED_FAMILIES`.** Ruled out by reading `evaluate` end to end: an unresolved family keeps every rule and keeps blocking severity for any rule whose `appliesTo` covers `SUPPORTED_FAMILIES`.
- **The surviving `-m <model>#<effort>` argv is a v1 leftover.** Ruled out: the v2 argv is `run --standalone -m ... --format json`, with `--auto` only under `danger-full-access`, and the bypass warning now names `--auto` rather than a v1-only flag.

## Next Focus

- Dimension: D2 Security
- Focus area: the plugin trust boundary and the dispatch guard — `v2-bridge.js` tool-argument translation, the `toV1ToolContext.ask` refusal, `trustedExecutableFor` and `trustedExecutables` path trust in `opencode-version.mjs`, and the `env-secret-guard`, `mcp-route-guard`, and `classifier-injection-screen` plugins after the export-shape change.
- Reason: D1 is swept; the removal touched executable-trust code and a whole host bridge that widens what a plugin can reach, neither of which a correctness pass over argv and table names can settle.
- Rotation status: D1 complete, D2 next in the queue.
- Blocked/productive carry-forward: the static-read-plus-corpus technique was productive; carry it to the guard's path-trust tests.
- Required evidence: the removal commit's diff for the cli-dispatch resolver, the guard tests, and a direct read of every `trustedExecutableFor` caller.
- Recovery note: none; no iteration is stuck.

Review verdict: PASS
