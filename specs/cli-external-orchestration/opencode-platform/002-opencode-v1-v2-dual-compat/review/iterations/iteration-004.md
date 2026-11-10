# Iteration 004 — maintainability

**Review target:** `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat`
**Dimension:** maintainability — version-branching across the 16 plugins and shared lib, v1/v2 duplication, the binary resolver and version detection, test coverage for both versions, install-guidance quality, the setup helper and `/doctor:opencode`, and the cost of adding a third OpenCode version.
**Mode:** review (read-only target; writes limited to this run directory)

## Dimension

Maintainability is the last uncovered dimension. The question the focus poses is concrete and mostly answered by counting: *how many places must change to teach this build a third version?* I read the four things that decide a version family (two Node resolvers, the doctor battery, the shell setup helper), the rule engine that consumes a resolved family, the bridge that maps v2 back onto v1 hook shapes, and the install reference that records what the binaries actually print. I did not re-read the sixteen plugin bodies; iteration 1 already established they are single-source, and this iteration's branch-site census confirms it independently.

## Files Reviewed

- `.skilled/hooks/dispatch/lib/opencode-version.mjs:18,104-130,142-217`
- `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24,35-43,142-163`
- `.skilled/commands/doctor/scripts/opencode-version-battery.cjs:52,146-171,207,499`
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:81-95,110-131`
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:12,296-333`
- `.opencode/plugins/lib/v2-bridge.js:8-55`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:19`
- `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:29-41,107,121,263-264,284-286`
- `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` (branch-site census only)
- Branch-site census across `.skilled` and `.opencode` source files (v1/v2 literal counts)
- Test inventories: `.opencode/plugins/tests/v2-bridge.test.cjs`, `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`, `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`

## What holds up

The focus anticipated per-plugin version branching. That is not the shape this build took, and the census says so plainly: among the 157 scoped files, the v1/v2 literals concentrate in the four detectors, the rule engine, `hard-rules.json`, `fanout-run.cjs` and the bridge — not in the sixteen plugin bodies. The plugin layer stayed single-source, and `v2-bridge.js` carries a translation table (`MAPPED_HOOKS` at [SOURCE: .opencode/plugins/lib/v2-bridge.js:8], event aliases and mappings at [SOURCE: .opencode/plugins/lib/v2-bridge.js:22]) rather than a copied v2 tree. That is the right call and it moves the third-version cost estimate down. The remaining cost is local, and it is the subject of the two findings below.

Install guidance is the strongest documentation in the slice. It labels every claim `[confirmed]` / `[documented]` / `[unknown]` with the command that produced it ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:29]), states the collision fact behind the whole layout problem ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:41]), and — the detail that makes it trustworthy — records that a v2 `--version` probe is itself a write ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:284]) and that the setup helper neutralises it with a temporary `XDG_DATA_HOME` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:286]). I checked the helper does exactly that: the probe at [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:112] sets `XDG_DATA_HOME="$PROBE_DATA_DIR"` and the directory is removed on exit. Doc and code agree.

## Findings by Severity

### P0 -- Critical

None.

### P1 -- Required

None this iteration. One P1 remains active from iteration 3 (`R3-P1-001`, the closeout child recording a non-closing state) and is carried in the registry; it does not originate here.

### P2 -- Minor

#### 1 [P2] Four copies of the version-output classifier, and the installer's copy reads a different grammar than the three that agree

- Case: a v2 patch release prints a bare `2.0.33`, or a v1 arrives behind a shim that prefixes its name. The installer classifies it `unknown`; every dispatch gate classifies it `v2` or `v1`. The two systems disagree about the same binary.
- File: `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:85`
- Evidence: the same parser body appears three times, line for line — [SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:104], [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:142], [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:146] — each mapping `major === 1 → v1`, `major === 2 → v2`, anything else `unknown` ([SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:122], [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:163]), and each carrying its own `VERSION_PATTERN` constant ([SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:18], [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24]; the battery's constant I did not separately diff). The shared pattern admits an optional leading word and an optional `v`/`V`. The shell classifier does not use that pattern and is asymmetric about it: the v1 branch requires a bare `1.x.y` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:85]), while the v2 branch *requires* the `opencode ` prefix ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:89]). Today that asymmetry is correct, because it mirrors observed output: v1 prints `1.19.3`, v2 prints `opencode v2.0.32` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:263]). So the divergence is latent rather than live — which is why this is a P2 and not a P1. Where it lands when it fires is unambiguous: `classify_version` falls through to `unknown` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:94]) and the installer's diagnosis contradicts the runtime's.
- User impact: the third-version cost is paid four times, in four grammars of which one is already different. Any banner-shape change in a supported version silently splits the installer's answer from the dispatchers' answer, and nothing fails.
- Finding class: cross-consumer
- Scope proof: `rg -n "VERSION_PATTERN|major === 1"` across `.skilled` returns exactly the three Node copies and no shared module. `rg -n "opencode-version" | grep -E "require|import"` shows two live dispatch paths consuming two separate resolvers — `dispatch-rule-checks.mjs:12` imports `resolveOpencodeVersionSync` from the `.mjs`, `fanout-run.cjs:19` requires `resolveOpencodeBinary` from the `.cjs`. The two resolvers have also drifted apart in behaviour, not just in file type: the `.cjs` carries an `opencode2`-then-`opencode` fallback vocabulary in its error contract ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:35]) that the `.mjs` has no counterpart for — the `.mjs` returns `unknown` the moment the name does not resolve on `PATH` ([SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:152]).
- Affected surface hints: ["version parsers (×3 Node)", "setup-helper classifier (shell)", "dispatch rule engine", "doctor battery"]
- Recommendation: one shared family classifier, consumed by both Node resolvers and the battery, plus one fixture corpus — bare, name-prefixed, `v`-prefixed, prefixed-and-`v` — asserted through the classifier *and* through the shell script, so drift fails a test instead of surfacing as a support question. That corpus is also the mechanism that makes a third version one table row.

#### 2 [P2] The rule engine's "applies to both families" test is a literal v1-and-v2 conjunction, so a third family silently changes which rules keep blocking severity

- Case: add a `v3`. A rule genuinely scoped to v1+v2 keeps `appliesToBoth === true` and therefore keeps its blocking severity on an unknown-version dispatch, although it says nothing about v3. A rule scoped to v1+v3 computes `appliesToBoth === false` and is downgraded to `warn` on the same dispatch.
- File: `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:305`
- Evidence: the default is spelled out as the pair ([SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:305]), the predicate is a name test on the same pair ([SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:306]), and the downgrade keys on that predicate ([SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:319]). The predicate asks "does this rule mention v1 and v2", not "does this rule cover every family we support". Those are the same question only while the supported set is exactly two.
- User impact: the documented unknown-version downgrade stops matching the code's own intent, and it fails in both directions at once — fail-open for one rule set, fail-closed for another — discovered by a dispatch that behaves unexpectedly rather than by a check.
- Finding class: class-of-bug
- Scope proof: the family set is spelled out as literals in at least five source files and exported by none — `opencode-version-battery.cjs` (30 occurrences, including `const FAMILIES = ['v1','v2']` at [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:52], used for both argument validation at `:207` and the run loop at `:499`), `opencode-version.cjs` (4), `dispatch-rule-checks.mjs` (4), `fanout-run.cjs` (3), and `hard-rules.json` (6). No module exports `SUPPORTED_FAMILIES`.
- Affected surface hints: ["rule applicability default", "unknown-version downgrade", "family enumeration across 5 files"]
- Recommendation: export one `SUPPORTED_FAMILIES` from the shared classifier and derive both the default and the coverage predicate from it — the downgrade condition becomes "the rule covers every supported family" rather than "the rule mentions v1 and v2".

## Traceability Checks

This iteration's assigned dimension is maintainability, so the core `spec_code` and `checklist_evidence` protocols were not re-run; iteration 3 closed traceability. One maintainability-adjacent trace is recorded:

- **feature_catalog_code (overlay) — partial.** The install reference's recorded `--version` shapes ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:263]) match the setup helper's classifier grammar, which is what makes finding 1 latent-today rather than live. I did not re-open `feature-catalog/opencode-dual-version-dispatch/` this iteration, so the catalog's version-detection paragraph is not re-verified here.
- **Note on coverage, not a separate finding.** Both families do have tests: `v2-bridge.test.cjs`, `dispatch-audit.test.mjs` (which exercises the `.mjs` resolver including cache and timeout paths), `dispatch-rule-checks.test.mjs`, `opencode-version-battery.test.cjs`, and `opencode-dual-dispatch.vitest.ts` for the `.cjs` resolver via `fanout-run`. What no test asserts is that the four classifiers *agree* — that is the gap folded into finding 1 rather than filed twice.

## Ruled Out

- **"The v2 path duplicates the v1 plugin bodies."** It does not. `v2-bridge.js` is a translation layer — a hook allow-list plus event aliases and mappings ([SOURCE: .opencode/plugins/lib/v2-bridge.js:8], [SOURCE: .opencode/plugins/lib/v2-bridge.js:22]) — and the plugins stay single-source. The duplication in this build lives in the version detectors, not in the plugin layer. Recorded so the next session does not re-enter it.
- **"Install guidance is thin, or was written after the fact."** It is the best-evidenced doc in the slice: claim labels, the npm `bin` collision that forces the whole layout, three runnable layouts, and the non-obvious fact that a v2 probe writes a log line — a trap the helper is then shown to avoid. No finding.

## Verdict

Two P2 findings, no P0 and no P1 originating this iteration. The duplication and the grammar divergence are read directly from source and the divergence is reproduced exactly; the "no parity test" component of finding 1 rests on test inventories rather than an exhaustive read of every test file, and is stated as such. Finding 2's impact is prospective by construction — it describes what a third family does to a predicate written for two — so its severity stays at P2 despite the fail-open/fail-closed split, because nothing misbehaves until a third family exists.

The run-level picture is unchanged and still CONDITIONAL on the carried `R3-P1-001`; this iteration adds no blocker of its own. All four dimensions now have coverage.

## Next Dimension

None remaining — maintainability was the fourth and last dimension. Next iteration is synthesis over the accumulated registry, not a new review direction.

## SCOPE VIOLATIONS

None. Every write landed in this run directory (`iterations/`, `deltas/`, `deep-review-strategy.md`); the reviewed target was read only, and the state log was written solely through the append gateway.

Review verdict: PASS
