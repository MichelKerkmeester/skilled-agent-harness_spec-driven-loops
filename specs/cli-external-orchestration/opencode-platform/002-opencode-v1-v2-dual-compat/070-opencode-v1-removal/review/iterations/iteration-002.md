# Deep Review Iteration 002

## Dispatcher

- Command: `/deep:review` (route: mode=review, target_agent=@deep-review, single iteration)
- Generation 2, lineage mode `restart`; session `2026-11-19T15:56:57.978Z`
- Iteration derived from the ledger: 1 existing `type:"iteration"` record + 1 = **2** (matches the dispatch number)
- Dimension: D2 Security
- Review target: the branch's own commits since origin/main (runtime code `ba9720f2f08`, CI/packages `fc8b3a9a241`, docs `af87a2aa13a`, spec packet `96e3d8a8f24`, renames `3ef324c3de1`, live evidence `4c72145b752`, merge resolution `a793f3ad733`)

BINDING: target=Branch worktrees/477-opencode-v1-removal, commits since origin/main (ba9720f2f08 runtime code, fc8b3a9a241 CI and packages, af87a2aa13a docs, 96e3d8a8f24 spec packet, 3ef324c3de1 renames, 4c72145b752 live evidence, a793f3ad733 merge resolution)
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` | full (307) | executable-trust set, path-qualified vs bare-name probe branch, cache key, probe spawn |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | 1085-1176 + diff | the only caller that supplies a command-derived binary name, version-family filtering, severity downgrade |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | full | surviving rule set, `appliesTo` rows, blocking severities |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | 1-420 | destructive paths, link handling, aside/restore flow, probe execution, trap/cleanup quoting |
| `.opencode/plugins/lib/v2-bridge.js` | 1-120, 150-320, 430-560 + diff | deny-on-throw contract, tool-name/arg translation, export surface, cleanup |
| `.opencode/plugins/system-spec-gate.js` | event dispatch + diff | dropped `session.resumed` / `session.compact` lifecycle branches |
| `.opencode/plugins/system-skill-advisor.js` | lifecycle mapping + diff | dropped resume/compact lifecycle boundaries |
| `.opencode/plugins/system-dist-freshness-guard.js` | diff | dropped `server.instance.disposed` branch |
| `.opencode/plugins/lib/opencode-goal-core.js` | diff | helper registry keyed by factory instead of server |
| `.opencode/plugins/ARCHITECTURE.md` | 130, 142, 149, 224 | the bridge's security-relevant contract rows and the v2 event inventory |
| `.opencode/plugins/tests/plugin-inventory.json` | event rows | captured-event evidence for the narrowed branches |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | diff stat + argv/exec scan | shell-execution surface for the opencode lineage command |
| `.skilled/bin/skilled-loop`, `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | exec-site scan | any shell string built from interpolated input |

Doctrine loaded before severity calls: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` §2 (severity, reach calibration) and §3 (evidence).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The bare-name probe runs a command-chosen `opencode<N>` binary from PATH before any rule decides** -- .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:238 -- A path-qualified binary is deliberately never executed on the command's word: the resolver maps it through `trustedExecutableFor` (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139), which only returns a path whose canonical file identity equals one the operator already put in reach, and the comment above it states the intent — "it must not run a file the command merely names" (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:134). The bare-name branch has no such gate: `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:238` and the sync twin at `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:272` call `resolveOnPath(executable)` and hand the result straight to `spawnSync(binary, ['--version'])` (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:62) / `execFile` (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:81). The caller's regex accepts any `opencode\d*` first word (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:49) and passes it through unsanitised (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1108), so a command that says `opencode1 run …` makes the guard execute that PATH entry — with the hook's own privileges and before `evaluate` can resolve the family or block anything. The retired v1 launcher the phase exists to delete is exactly such a PATH entry: `readonly V1_LAUNCHER="$BIN/opencode1"` (.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:38).
   Finding class: trust-boundary (security) — a guard executes a command-named file on the exact input class its sibling branch was hardened against
   Scope proof: `opencode-version.mjs` is in the removal commit's own diff (`git show ba9720f2f08 --stat`, 21 lines changed) and was read in full; `dispatch-rule-checks.mjs:1108` is the only production caller that passes a command-derived name, confirmed by `rg -n "resolveOpencodeVersion(Sync)?\("` over the tree.
   Affected surface hints: every dispatch-guard invocation of `evaluate` (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1108), the async probe path used by any future caller of `resolveOpencodeVersion` (.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:247), and the `opencode1` / `opencode2` shims the earlier side-by-side layout left on PATH.
   Case: an operator who still has the old layout keeps `~/.local/bin/opencode1` on PATH. A dispatch command written as `opencode1 run -m p/m "task"` — plausible wording for "try it with the old binary" — makes the cli-dispatch guard execute the retired launcher during rule evaluation, even though the same evaluation then resolves the family as `unsupported` and would have blocked or warned on the command itself.
   Confidence: high on the mechanism (code read end to end, single caller trace). Reach is named but not attacker-supplied content: writing to a PATH directory already implies code execution, so the harm is confined to defense-in-depth and to running a binary the removal commit declares retired.
   Downgrade trigger: none at P2; this is already the lowest tier. It would already be P2 even if the guard's own comment were silent, because no input class outside PATH reach produces it.

Claim adjudication:

```json
{
  "type": "trust_boundary_violation",
  "claim": "The version resolver executes a PATH-resolved binary whose name the evaluated command supplied (opencode<N>), while the path-qualified branch refuses to execute a file the command merely names.",
  "evidenceRefs": [
    ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:238",
    ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:272",
    ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:62",
    ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139",
    ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:134",
    ".skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:49",
    ".skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1108",
    ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:38"
  ],
  "counterevidenceSought": "Read the full resolver to test whether the bare-name branch is itself gated (it is not: no realpath identity check, no allowlist), whether the caller can pass an arbitrary name (regex `opencode\\d*` and `$OPENCODE_BIN` only), and whether the probe could be inert (it spawns with `--version`, exit 0 required, 3s timeout). Also checked the README row for `resolveOpencodeVersionSync`, which describes bare-name probing as intended for `opencode` itself.",
  "alternativeExplanation": "A bare name is treated as operator-controlled because PATH is operator-controlled, so executing it is no different from executing `opencode`. Rejected as a full explanation: the name executed is chosen by the dispatch text, not by the operator, and the module's own comment fixes the intent as 'must not run a file the command merely names'. The `opencode<N>` family is precisely where a command-chosen name and a real installed file coincide, because the previous layout shipped `opencode1` and `opencode2`.",
  "finalSeverity": "P2",
  "confidence": "high on mechanism, medium on impact",
  "downgradeTrigger": "If no supported install can have an executable named `opencode<N>` (N non-empty) on PATH, the finding is documentation-only and still P2."
}
```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` (core) | partial | The security-relevant contracts were checked against code: the bridge denies a tool call on a hook throw (`.opencode/plugins/ARCHITECTURE.md:130` against `.opencode/plugins/lib/v2-bridge.js:516`), the v2 event inventory the narrowed branches rely on is recorded (`.opencode/plugins/ARCHITECTURE.md:142`, `:149`, `:224`), and the surviving hard rules all declare `appliesTo: ["v2"]` (`hard-rules.json`). A direct `spec.md` read was still not performed in this iteration, so alignment stays `partial` rather than `pass`; the traceability dimension (D3) owns that read. |

Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) were not run this iteration and are omitted rather than recorded as pending.

## Integration Evidence

- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` — the dispatch guard's only command-derived version lookup; checked the call site (`:1108`) and the version/severity branch that decides block, warn or skip.
- `.opencode/plugins/lib/v2-bridge.js` — the v2 host contract: `tool.execute.before` awaits the v1 hook and lets a throw escape (`:516`), matching the documented "denies the call on a throw" row (`.opencode/plugins/ARCHITECTURE.md:130`); `toV1ToolName` maps `shell`→`bash` and `subagent`→`task`, and args are rewritten back under v2 names.
- `.opencode/plugins/system-spec-gate.js` — narrowed to `session.compacted` (`:192`); the security question was whether the dropped `session.resumed` / `session.compact` branches left a gate unrearmed on v2.
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` — the destructive surface of the phase: `check_v1_launcher` refuses symlinks, directories and files without the v1 package path before `rm -- "$V1_LAUNCHER"`, and `restore_opencode` re-verifies both the link target and the resolved realpath after the uninstall.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — no shell string is built from lineage input: the opencode lineage returns `{ command, args }` from a trusted resolved path (`resolveOpencodeBinary`) and every `spawnSync('/bin/sh', ['-c', …])` is a fixed `command -v` literal.

## Edge Cases

- **Iteration number**: dispatch said 2 and the ledger holds one `type:"iteration"` record, so 2 is used; no mismatch to report.
- **`plugin-inventory.json` records `global.disposed` delivery as uncaptured** (`.opencode/plugins/tests/plugin-inventory.json:12`), so the surviving disposal branch is evidence-backed for the bus type but not for delivery. Recorded as an observation, not a finding: an undelivered disposal event degrades cache reset, not a trust boundary.
- **`spawnSync`/`execFile` probe surface is shell-free** (`binary`, `['--version']`), so no argument-injection path exists even where the binary name is command-derived; the residual risk is *which* file runs, not what it is told to run.
- **`OPENCODE_BIN` trust is deliberately unconditional** in `trustedExecutables` (`.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:125`). Tested whether an inline assignment in the command could poison it: the hook reads `process.env`, and no code path copies a command's inline assignment into the guard's environment, so an inline `OPENCODE_BIN=…` prefix cannot widen the trusted set.
- **Non-enumerable `factory` is not an access boundary**: `Object.defineProperty(plugin, 'factory', { enumerable: false })` (`.opencode/plugins/lib/v2-bridge.js:592`) hides the property from `Object.keys`, not from `plugin.factory` or `'factory' in plugin`. Recorded as a wording caveat, not a finding: the host is the operator's own runtime, so a second visible entry point is not a trust boundary.

## Confirmed-Clean Surfaces

- **Deny-on-throw survives the v2 bridge.** `tool.execute.before` awaits the v1 hook and a throw propagates to the host (`.opencode/plugins/lib/v2-bridge.js:516`), which the architecture row records as "denies the call on a throw" (`.opencode/plugins/ARCHITECTURE.md:130`). Every security plugin built on that hook (`system-spec-gate`, `env-secret-guard`, `mcp-route-guard`, `classifier-injection-screen`) therefore keeps its block on v2.
- **Version filtering fails closed after the `appliesTo` change.** An unresolved family (`unknown` or `unsupported`) keeps every rule, and only a rule that does not cover the whole supported set is downgraded to a warning — all four surviving cli-opencode rules declare `appliesTo: ["v2"]`, so a retired binary is held to every rule at `error`/`warn` as declared (`hard-rules.json`, `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1108` block).
- **The retired v1 checks lost no v2 coverage.** `no-bare-agent-general` and `command-flag-for-slash-prompt` were v1-only; the v2 replacement `v2-slash-prompt-route` keeps the slash-prompt case as its own check, so a slash prompt is still caught rather than silently delivered as prose.
- **`opencode-setup.sh` destructive paths are guarded before the first write.** `check_v1_launcher` exits on a symlink, a non-regular file, or a file without `node_modules/opencode-ai/`; the v1 package is removed only through `npm uninstall -g --prefix`; an `opencode` entry that does not resolve into the v1 package is moved aside (refusing when the aside path already exists) and restored with both the link target and the resolved realpath re-verified; data files are listed and never touched. Every `rm`/`mv` is `--`-terminated and quoted.
- **Temp-dir cleanup is safe.** `mktemp -d` result is used quoted under `rm -rf --` and guarded by a non-empty test, and the signal traps are re-armed only after the directory exists.
- **No shell string is built from lineage input in the opencode dispatch path.** The lineage command is `{ command: <trusted resolved path>, args: ['run', '--standalone', …] }`, and the `/bin/sh -c` uses in `fanout-run.cjs` are fixed `command -v <fixed-name>` literals.
- **Dropped lifecycle branches have no v2 producer.** `session.resumed`, `session.compact` and `server.instance.disposed` appear nowhere in the v2 event table or inventory (`.opencode/plugins/ARCHITECTURE.md:142`, `:149`, `:224`; `rg` no-hit for `session.resumed` outside the plugin diffs), so removing them from `system-spec-gate`, `system-skill-advisor` and `system-dist-freshness-guard` removes dead branches rather than live guards.

## Ruled Out

- **The dropped `session.resumed` branch leaves Gate 3 un-rearmed after a resume.** Ruled out: the v2 bus defines no `session.resumed` type (`.opencode/plugins/ARCHITECTURE.md:142`, `:149`), and `system-spec-gate.js` still re-arms on the one compaction event v2 does emit (`:192`).
- **The bridge lets a security hook fail open by swallowing a throw.** Ruled out: the await is unguarded and the throw becomes the host's denial (`.opencode/plugins/lib/v2-bridge.js:516`, `.opencode/plugins/ARCHITECTURE.md:130`).
- **A path-qualified binary named by a command can be executed by the guard.** Ruled out: `trustedExecutableFor` compares canonical path, size and mtime against the operator's own trust set and returns `null` otherwise.
- **`OPENCODE_BIN` can be poisoned from the command text.** Ruled out: `trustedExecutables` reads `process.env` only, and no path copies an inline assignment into it.
- **The setup helper can delete another install's `opencode`.** Ruled out: an entry that does not resolve into the v1 package is moved aside instead of removed, and the restore re-verifies target and realpath.

## Next Focus

- Dimension: D3 Traceability
- Focus area: the phase's own evidence chain — `spec.md` binding decisions against the shipped code, `tasks.md` completion rows, `acceptance-criteria.md` rows in 001/002/003, and the recorded blockers (001 T004 live capture, 002 CI run go-ahead, 003 AC-004 live iteration or ADR waiver).
- Reason: security is swept with one advisory; the run's remaining risk is that the packet claims a removal the code and evidence do not fully support, which only a direct spec/task/AC read can settle. `spec_code` is still `partial` for exactly that reason.
- Rotation status: D1 complete, D2 complete, D3 next in the queue.
- Blocked/productive carry-forward: reading a guard's own comment against its sibling branch produced the one finding this iteration; apply the same technique to the spec's stated decisions versus the code.
- Required evidence: a direct `spec.md` read, the `tasks.md` completion rows, and every `acceptance-criteria.md` row with its cited proof.
- Recovery note: none; no iteration is stuck.

Review verdict: PASS
