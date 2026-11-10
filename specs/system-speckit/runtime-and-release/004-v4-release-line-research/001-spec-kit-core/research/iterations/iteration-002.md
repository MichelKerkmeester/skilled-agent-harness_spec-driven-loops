# Iteration 2 — validate.sh rules and the trigger-index contract

## Focus

Key questions 2 and 3: the `validate.sh` rules named in the v4.0.0.0 and v4.0.0.5 notes, and the trigger-index lookup/build contract on rebuild, staleness and exit codes. The iteration tested the marquee v4.0.0.5 anchor claims with fixtures under `/tmp`, then read the commit and pull-request gates the same note names.

## Actions Taken

1. Read the validator front end and its rule registry: `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`, `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`, `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`, and `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`.
2. Built three minimal fixtures under `/tmp` from the real `spec.md` template and ran `SPECKIT_RULES=ANCHORS_VALID ... validate.sh <folder> --strict --json`:
   - `/tmp/dr2-nested` — `probe-outer` containing `probe-inner`.
   - `/tmp/dr2-inline` — a complete anchor pair quoted in inline code inside `probe-outer`.
   - `/tmp/dr2-adr` — `adr-001` containing `adr-001-child`.
3. Built `/tmp/dr2-phase-parent` with a `001-child/` folder and a nested anchor in the parent `spec.md`; ran the same rule.
4. Ran the retrieval lane's documented cases: no-hit lookup, bad invocation, missing index, and `generate-trigger-index.mjs --check --json` against the working tree.
5. Inspected the two commit/PR gates: `.skilled/scripts/git-hooks/pre-commit` and `.github/workflows/changed-packet-validation.yml`.

No repository file was modified. No scope violations.

## Findings

### F1 — A phase parent with a nested anchor passes `ANCHORS_VALID` (P1, drift, v4.0.0.5)

The v4.0.0.5 note states "Nested anchors fail validation" without a phase-parent caveat. The code returns a pass before it scans any anchor when the folder resolves to `phase`:

- `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975]` — `if (level === 'phase' && isPhaseParent(folder)) {`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976]` — `return entry('ANCHORS_VALID', 'pass', 'Phase parent lean document set accepted');`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:192]` — a folder with phase children resolves to `phase`.

Repro I ran: `/tmp/dr2-phase-parent/spec.md` contains `<!-- ANCHOR:outer -->` around `<!-- ANCHOR:inner -->`. `SPECKIT_RULES=ANCHORS_VALID validate.sh /tmp/dr2-phase-parent --strict --json` returns the parent entry `status: "pass"`, message `"Phase parent lean document set accepted"`, and `passed: true`. The child folder fails separately only because the fixture child has no anchors.

The rule registry does document the exemption, so code and registry agree; the release note does not. This is a drift finding with a validation consequence: a phase parent can carry the exact defect the release note says is now an error and still pass strict validation.

Verify:

```bash
SPECKIT_RULES=ANCHORS_VALID bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh /tmp/dr2-phase-parent --strict --json
```

Confidence: high (the fixture and the code both show the pass).

### F2 — Gate 1's "clean no-hit" cannot be distinguished from a stale index (P2, UX, v4.0.0.0 / v4.0.0.16)

Gate 1 tells the caller that exit 1 with no rows is a clean no-hit:

- `[SOURCE: AGENTS.md:51]` — "It reads the committed index; exit 1 with no rows is a clean no-hit".
- `[SOURCE: .cursor/rules/skill-routing.md:25]` — the generated mirror repeats the same sentence.

The lookup itself reports only the index's `manifestHash`; it has no corpus hash or freshness flag. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:26]` documents exit 1 as "no candidates", not "index may be stale".

At this commit the committed index is stale: `generate-trigger-index.mjs --check --json` exits 1 with `fresh: false`, 36 missing documents, all under `specs/system-speckit/047-v4-release-line-research/`. The generator's own contract is correct (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:39]` and `:565`), and the retrieval README documents the cost trade-off: `--check` "runs as the report-only `advisory-checks.yml` step and by hand, never per lookup" (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84]`). The retrieval conventions mention only that the index and manifest are produced together (`[SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:51]`), not how to detect staleness.

Repro I ran: a lookup for `"spec kit core plan"` — the phrase the stale report says the 047 plan.md declares — returns only `.skilled/skills/system-spec-kit/README.md` at `query-containment`, not `specs/system-speckit/047-v4-release-line-research/001-spec-kit-core/plan.md`. A prompt that matches an unindexed document therefore receives either a different document or a no-hit, and the Gate 1 wording reads either as clean.

This is a UX/observability gap rather than a broken exit-code contract: the exit codes match the header exactly (see O2). A cheap extension would have the lookup emit the index's build time or a corpus fingerprint, or have Gate 1 run `--check` once per session instead of per prompt.

Verify:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json; echo "exit=$?"
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "spec kit core plan"
```

Confidence: high on the staleness and the lookup result; the extension is a proposal, not a tested fix.

### F3 — Two anchor parsers disagree on what "nested" means (P2, drift, v4.0.0.5)

`ANCHORS_VALID` flags any different anchor opened inside another (except an `adr-NNN` parent holding `adr-NNN-*` children):

- `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:936]` — `anchor '${id}' is opened inside '${top}'`.

The structure parser used for spec-doc structure returns overlapping bodies instead:

- `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:588]` — `parseAnchors`.
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:620]` — it reports a nested anchor only when the same id is already in the stack; a different id opened inside another is accepted.

The divergence is latent in a normal validation run because `CROSS_ANCHOR_CONTAMINATION` skips without a routing payload (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1291]`). It becomes live only when a consumer supplies one and merges by anchor. The two parsers should share one nesting contract, or the structure parser should refuse the same shape the validator refuses.

Verify:

```bash
sed -n '588,625p' .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts
sed -n '930,940p' .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts
```

Confidence: high on the code divergence; medium on user impact until a routing-payload consumer is exercised.

### Verified claims (not findings)

- **O1 — The anchor claims hold for numbered levels.** `/tmp/dr2-nested` fails with `"spec.md: anchor 'probe-inner' is opened inside 'probe-outer'"` and exit 2; `/tmp/dr2-inline` passes; `/tmp/dr2-adr` passes. This matches the v4.0.0.5 note's three statements (nested anchors error, inline code ignored by the nesting check, decision-record child allowed).
- **O2 — The retrieval exit codes match their headers.** No-hit lookup exits 1; a lookup with no prompt exits 2; a missing index exits 2; `--check` on a stale corpus exits 1. This matches `lookup-trigger-index.mjs:26` and `generate-trigger-index.mjs:39`.
- **O3 — The commit and pull-request gates exist and match the note.** `.skilled/scripts/git-hooks/pre-commit:225` runs the template-phrase lint, blocks with `BLOCKED [gate:template-phrase-lint]` at `:234`, and names `SPECKIT_SKIP_PHRASE_LINT=1` at `:235`. `.github/workflows/changed-packet-validation.yml:166` compares head against the merge base, `:227` fails closed when the base cannot be materialised, and `:287` reports no regressions when every failing packet also failed at the base.
- **O4 — `validate.sh`'s exit code matches its help.** A validation error exits 2, as `validate.sh:82` states.

## Questions Answered

- **Q2:** "Which validate.sh rules named in the v4.0.0.0 and v4.0.0.5 notes exist in runtime/cli/rules and the validation orchestrator, and does any rule pass on a packet it should fail?" — The named rules exist: `ANCHORS_VALID` is `native:orchestrator`; `FILE_EXISTS`, `LEVEL_MATCH`, `GRAPH_METADATA_*` and `METADATA_DISK_PATH_CONSISTENCY` are in `runtime/cli/rules`; the commit and PR gates are the pre-commit hook and `changed-packet-validation.yml`. Yes, one rule passes on a packet it should fail: a phase parent with a nested anchor passes `ANCHORS_VALID` (F1).
- **Q3:** "Does the trigger index lookup and build (runtime/cli/retrieval/) match retrieval-conventions.md and the release notes on rebuild, staleness and exit codes?" — Yes on exit codes and `--check` behavior: 0/1/2 match the headers, and a stale corpus exits 1 with `fresh: false`. The conventions document omits the `--check` and staleness contract, which lives in the retrieval README; the Gate 1 no-hit wording does not distinguish a stale index from a genuine absence (F2).

## Questions Remaining

- Q4–Q12 remain: continuity save/resume routing, the goal budget, upgrade preview/rollback, `create.sh` and the level templates, the v4.0.0.13–v4.0.2.0 doc drift, dead scripts, operator friction, sk-code/sk-doc conformance, and concrete extensions.
- Residual on Q2: the other four named rules were inventoried but not each executed with a failing fixture; the phase-parent exemption and the structure-parser divergence need a decision.
- Residual on Q3: whether the lookup should expose a freshness signal, and whether `retrieval-conventions.md` should carry the `--check` contract.

## Next Focus

Iteration 3: Q4 and Q5 — continuity save/resume routing (`generate-context.js`, `/speckit:save`, `/speckit:resume`, the v4.0.0.13, v4.0.0.14 and v4.0.1.0 notes) and the goal system (`goal.md`, `goal.cjs`, the 4,000-character slice budget), with the same rule: read the code and run a bounded check, not only the release notes.
