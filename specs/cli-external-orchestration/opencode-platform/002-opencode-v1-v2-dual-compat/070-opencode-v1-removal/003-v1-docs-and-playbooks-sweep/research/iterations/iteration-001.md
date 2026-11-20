# Iteration 1: OpenCode version resolution and family-scoped dispatch rules

## Focus

Read `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` and `dispatch-rule-checks.mjs` (its only non-test importer) and answer Q1-Q4: how a binary's reported major is parsed into a family, which majors map to which family, where the rule engine consumes the family and what it does per family, and how the result is cached/overridden or fails.

## Actions Taken

1. Read the research config, state log, and strategy (`research/deep-research-{config.json,state.jsonl,strategy.md}`) to establish iteration number, budgets, and the four key questions.
2. Read `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` in full (308 lines).
3. Located importers with `rg "opencode-version"` over `.skilled/hooks`: the only production importer is `dispatch-rule-checks.mjs:22`; the rest are tests and the lib README.
4. Read the evaluation core of `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` (lines 1040-1175) plus constants (lines 30-50) and the four cli-opencode check bodies (lines 735-789).
5. Read `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`, the only sidecar in the tree that declares `appliesTo`.
6. Read `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` lines 215-314 to confirm family-filter and severity semantics, and checked the four preflight adapters' calls to `evaluateDispatch` (claude:62, codex:64, dsh:51, pi:547) — none pass a `version` option.

## Findings

1. **Probe shape.** A binary is read by spawning `<path> --version` (sync `spawnSync`, async `execFile`), both with a 3000 ms timeout; stdout and stderr are concatenated with `\n` and the combined text is what gets parsed. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:22] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:61] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:79]

2. **Parse algorithm.** `parseOpencodeVersion` trims the text, splits on lines, splits each line on whitespace, and tries each token and each adjacent token pair against `VERSION_PATTERN = /^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$/`. The optional leading word is why `opencode v2.0.32` matches; group 1 is the major, coerced with `Number()`. The first matching token wins, so `opencode v2.0.32 1.19.3` resolves to `v2`. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:23] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:189] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:196] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:200]

3. **Family map is a two-case test, not a table.** Major `1` → `'unsupported'`; major `2` → `'v2'`; every other parseable major (e.g. `0.x`, `3.x`) → `'unknown'`. Non-string, empty, or unparseable output → `'unknown'`. Only `'v2'` is in `SUPPORTED_FAMILIES` (frozen `['v2']`), so "unsupported" specifically means a recognised retired major, and only major 1 is recognised that way. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:21] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:201] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:184]

4. **The engine consumes the family as a rule filter, defaulting rules to the supported set.** `dispatch-rule-checks.mjs` imports `resolveOpencodeVersionSync` and `SUPPORTED_FAMILIES`. In `evaluate`, `UNRESOLVED_FAMILIES = ['unknown','unsupported']`; an explicit `options.version` is used when it is one of the three known values. Otherwise, if the command text matches an `opencode… run` shape AND at least one rule declares `appliesTo`, the engine itself calls `resolveOpencodeVersionSync(opencodeRun[1])` and turns filtering on. A rule with no `appliesTo` is treated as `SUPPORTED_FAMILIES`. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:22] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:50] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1098] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1107] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1116]

5. **Per-family behaviour: filter for `v2`, run-everything-with-downgrade for `unsupported`/`unknown`.** For `v2`, a rule runs only when `appliesTo` includes `v2`; others are skipped (`continue`). For `unsupported` or `unknown`, `unresolved` is true so the skip is bypassed and every rule runs. Severity is then recomputed: if `unresolved` and the rule is not `appliesToAll` — where `appliesToAll` means it covers every family in `SUPPORTED_FAMILIES`, i.e. `v2` — the rule is downgraded to `warn`; a rule covering all supported families keeps its declared severity, so a declared `error`/`block` still refuses the dispatch. Today all four `cli-opencode` rules declare `appliesTo: ["v2"]`, so on a v1 binary they all still run and their declared severities survive: the two `error` rules block, the two `warn` rules advise. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1117] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1120] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1135] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:7] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:14]

6. **Nothing rewrites the command; the only "rewrite" is severity and message.** `evaluate` returns violation objects `{id, severity, message, check, passed:false}` and never mutates command text. It rewrites a declared severity down to `warn` in the unresolved-narrower case and substitutes `DSH_PATCH_LITERAL_MESSAGE` for unexpanded DSH `--patch` values. Adapters do the refusing: a `block` becomes a deny (Claude `permissionDecision: deny`), a `warn` becomes advisory context. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1135] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1139] [SOURCE: .skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs:62]

7. **Cache is in-process and keyed on file identity, not on the binary name.** `versionCache` is a module-level `Map`; the key is `fileIdentity()` = `JSON.stringify([realpath(path), stat.size, stat.mtimeMs])`. A replaced binary therefore misses the cache even at the same path. `clearOpencodeVersionCache()` empties the map. Because the key is computed before probing, a cached family is returned without spawning. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:25] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:102] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:242] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:293]

8. **Override surface is `OPENCODE_BIN` plus PATH; path-qualified binaries are only probed when already trusted.** A bare name resolves on `PATH`. A command token spelled exactly `$OPENCODE_BIN` or `${OPENCODE_BIN}` is replaced by the env value before resolution. For a path-qualified value, the file must be executable and its canonical identity must match one of the trusted executables (`PATH`'s `opencode`, or `OPENCODE_BIN` resolved through PATH), otherwise the resolver returns `unknown` rather than executing a path the command merely names. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:35] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:120] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:231]

9. **Resolver errors degrade to `unknown`, and the caching of that differs by path.** Async: a timeout, thrown probe, or empty output yields `{version:'unknown', cacheable:false}` — not cached. A non-empty but unparseable output is parsed (to `unknown`) with `cacheable:true` and cached. Sync: the whole body is wrapped in `try/catch` returning `'unknown'`; a successful probe always caches its parse result, including `unknown`, after which the rule engine treats the dispatch as `unresolved`. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:162] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:281] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:284] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:287]

## Questions Answered

- Q1: How does opencode-version.mjs read a binary's reported version and parse its major number? — `--version` probe with 3 s timeout, stdout+stderr concatenated, token/token-pair scan against `VERSION_PATTERN`, `Number(match[1])` as major. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:61] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:192]
- Q2: Which major numbers map to which family, and what family does an unparseable or missing version get? — `1 → unsupported`, `2 → v2`, any other parseable major and all unparseable/missing output → `unknown`; `SUPPORTED_FAMILIES === ['v2']`. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:201]
- Q3: Where does the dispatch rule engine consume the resolved family, and what does it allow, rewrite or refuse for each family? — in `evaluate` (auto-resolving via `resolveOpencodeVersionSync` when no explicit version is passed and an `opencode run` shape plus `appliesTo` exists); v2 filters to matching rules, unsupported/unknown run all rules with narrower-than-supported rules downgraded to `warn`, and blocking severities refuse. No command rewriting. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1107]
- Q4: How is the resolved family cached or overridden (environment variables, explicit paths), and what happens on a resolver error? — in-process `Map` keyed by `[realpath, size, mtimeMs]`, cleared by `clearOpencodeVersionCache`; `OPENCODE_BIN`/`$OPENCODE_BIN`/`${OPENCODE_BIN}` and PATH provide the trust set, path-qualified binaries must match it; any probe/resolve error yields `unknown` (uncached on async failure, cached when a probe succeeded but parsed `unknown`). [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:287]

## Questions Remaining

None from the strategy's Q1-Q4.

## Edge Cases

- Ambiguous input: the topic says "classify a binary's reported major version into a family"; the code recognises only majors 1 and 2, so a future major (3.x) is `unknown`, not `unsupported`. Recorded as a finding rather than assumed.
- Contradictory evidence: none. The module comment at lines 17-20 says a recognised major outside `SUPPORTED_FAMILIES` resolves to `'unsupported'`, while the code only does that for major 1; the comment is narrower than a general rule and is not contradicted because no other major is recognised.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` (lines 1-308)
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` (lines 1-120, 735-789, 1040-1175)
- `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` (lines 1-30)
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` (lines 215-314)
- `.skilled/hooks/cli-dispatch/lib/README.md` (lines 20-139)
- `.skilled/hooks/cli-dispatch/{claude,codex,dsh,pi}/dispatch-preflight-lint.*` (call sites at 62, 64, 51, 547)

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1, Q2, Q3, Q4
- Questions answered: Q1, Q2, Q3, Q4

## Reflection

- What worked and why: reading the resolver end-to-end before the engine meant the family vocabulary (`v2`/`unsupported`/`unknown`) was fixed before interpreting the filter, which is what made the `appliesToAll` subtlety visible. Reading the test at lines 264-284 supplied a second lens confirming that `unsupported` and `unknown` share one branch.
- What did not work and why: an initial assumption that all four `cli-opencode` rules would be downgraded to `warn` on a v1 binary was wrong; `appliesToAll` is computed against `SUPPORTED_FAMILIES` (`['v2']`), so `appliesTo:['v2']` counts as covering all supported families and keeps `error` severity. The code at lines 1117 and 1135 corrected it.
- What I would do differently: check `appliesToAll` against the frozen supported list before reasoning about downgrades, and grep the adapters for `options.version` earlier to confirm the auto-resolution path is the live one.

## Next Focus

No further iteration is needed for Q1-Q4. If the loop continues, the open follow-up is whether `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` (a second, deep-loop-owned resolver) agrees with this one on family boundaries, since a divergence there would mean the loop's dual dispatch and the preflight guard classify the same binary differently.

## SCOPE VIOLATIONS

None. All writes were confined to `research/iterations/iteration-001.md` and `research/deltas/iter-001.jsonl`; the append gateway writes `research/deep-research-state.jsonl` from the ledger. No researched file was modified.
