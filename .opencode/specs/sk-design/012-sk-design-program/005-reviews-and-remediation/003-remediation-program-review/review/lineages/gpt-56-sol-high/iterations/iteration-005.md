# Deep Review Iteration 005 — Correctness Consumer Closure

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `scan`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct manifest-scoped enumeration, focused reads, and executable consumer tests were used.

## Files Reviewed

- `.opencode/skills/sk-design/styles/lib/paths.mjs`
- `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs`
- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs`
- `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs`
- `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs`
- `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/corpus-baseline-v3.test.ts`
- `.opencode/skills/sk-design/command-metadata.json`
- The four manifest-listed mode-corpus test files corresponding to the corpus consumers above.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `runtime_consumer_import_closure`: **pass** — all four mode-corpus production consumers import the moved facade at `styles/lib/engine/style-library.mjs`, and the facade imports the persistent adapter plus centralized path defaults rather than reconstructing retired `_engine` or `_db` paths [SOURCE: `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:24-29`] [SOURCE: `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:24-29`] [SOURCE: `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:24-29`] [SOURCE: `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:20-25`] [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:14-29`].
- `moved_manifest_closure`: **pass** — centralized defaults resolve the retrieval manifest under `library/manifests`, while the md-generator runtime and its baseline test independently resolve that same moved manifest and the moved engine CLI [SOURCE: `.opencode/skills/sk-design/styles/lib/paths.mjs:13-32`] [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-71`] [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/tests/corpus-baseline-v3.test.ts:19-23`].
- `generated_state_regeneration_boundary`: **partial** — manifest-scoped packet evidence names `generate-context.js` as the metadata-refresh owner, but the generator implementation and downstream resume/index consumers are outside the frozen 118-file manifest. Existing `P1-005` therefore remains active and was not re-adjudicated under this exhausted approach [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:120`].
- `command_metadata_surface`: **pass** — the manifest-listed command metadata names all five `/interface:*` entry points and routes each to its current `.opencode/skills/sk-design/...` owner resources; no presentation-authority or retired styles-library path is encoded [SOURCE: `.opencode/skills/sk-design/command-metadata.json:1-47`] [SOURCE: `.opencode/skills/sk-design/command-metadata.json:173-235`] [SOURCE: `.opencode/skills/sk-design/command-metadata.json:344-405`] [SOURCE: `.opencode/skills/sk-design/command-metadata.json:614-675`] [SOURCE: `.opencode/skills/sk-design/command-metadata.json:760-822`].

## Integration Evidence

- Pinned Git evidence: `HEAD` resolved to `7b9d3b6b71`.
- Executable evidence: the four manifest-listed mode-corpus suites passed 60/60 against the moved facade and current retrieval manifest.
- Exact integration surfaces reviewed: `styles/lib/paths.mjs`, `style-library.mjs`, `persistent-adapter.mjs`, the four production mode-corpus consumers, md-generator `study-prepare.ts`, `corpus-baseline-v3.test.ts`, and `command-metadata.json`.

## Edge Cases

- The local md-generator Vitest binary was unavailable because its backend dependency installation is absent; the manifest-resolution seam was verified by direct source/test reads, but that TypeScript suite was not executed.
- Generated graph metadata is an output inside the manifest, while its generator and runtime resume/index consumers are outside the frozen manifest. This is optional integration evidence rather than permission to widen scope; the check remains partial and existing `P1-005` carries the risk.
- The first manifest-search command failed with a Python f-string syntax error. The corrected command completed without changing files.
- Historical `_db`/`_engine` references in migration specs and fixture-local underscore manifest names were separated from active runtime consumers and did not support new findings.

## Confirmed-Clean Surfaces

- The facade consumes `BUNDLE_ROOT` and `RETRIEVAL_MANIFEST_PATH` from the centralized path seam and routes query/hydration through `persistent-adapter.mjs` [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:25-36`] [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/style-library.mjs:184-204`].
- The four corpus consumers all call the same moved facade; their focused integration suites passed 60/60.
- md-generator `study-prepare.ts` resolves both `styles/lib/engine/style-library.mjs` and `styles/library/manifests/retrieval-manifest.json` at their current locations [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-71`].
- `command-metadata.json` routes all five interface entry points to current mode resources and contains no retired styles-library path.

## Ruled Out

- Active runtime reconstruction of `_db` or `_engine`: no manifest-scoped production consumer in this pass uses those retired trees; matching packet prose is historical migration evidence.
- Fixture-local `_retrieval-manifest.json`: retained by tests as an explicit path override and not used as a production default.
- A new generated-metadata finding: the observed regeneration gap is already represented by stable finding `P1-005`; no new evidence changed its claim, severity, or content hash.

## Next Focus

- Dimension: security (second-pass integration)
- Focus area: error-propagation and trust-boundary closure across the facade, persistent adapter, md-generator child-process boundary, and corpus fallback classification
- Reason: consumer locations are current and focused suites are green; the next distinct breadth risk is whether malformed, stale, or failed downstream responses preserve fail-closed behavior across process and adapter boundaries
- Rotation status: initial four dimensions plus correctness second-pass are complete; rotate to a distinct security integration pass for iteration 006
- Blocked/productive carry-forward: Code Graph remains unavailable; do not retry publication-digest, generated-metadata, stale-document, or fixture-path adjudication; focused adversarial reads/tests remain productive
- Required evidence: malformed stdout/nonzero child exit, synchronous and asynchronous adapter failures, stale-generation responses, and fallback classification across each named consumer boundary

Review verdict: PASS
