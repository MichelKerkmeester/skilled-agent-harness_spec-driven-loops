# Review Iteration 002 — Correctness: F12–F23 related docs, doctor 13c removal, frontmatter standard line

## Dispatcher

- Mode: review; target agent: @deep-review; run `2026-10-12T16:20:15.273Z-i2`; session `2026-10-12T16:20:15.273Z`; generation 1; lineageMode `new`.
- Dimension assigned by the dispatch: correctness (iteration 1 covered the root README; this iteration covers the eleven related docs, the doctor check 13c removal and the frontmatter versioning standard line — see Edge Cases 1 for the strategy mismatch).
- Budget profile: verify. Review target read-only; only this narrative, the delta file and the strategy file are written.

## Dimension

Correctness — does each new line in the F12–F23 related-doc fixes match the repository, with focus on the six dispatch questions: (1) related-doc line accuracy, (2) `bin/lib` tree comments per module header, (3) the "Every module here depends only on Node core" import claim, (4) the git-hooks README "ten sub-gates / nine bypass flags" counts against `pre-commit`, (5) the `surfaceHint` sentence against the advisor runtime, (6) `frontmatter-versioning.md:122` against `checkVersionParity`.

## Files Reviewed

- `.skilled/scripts/git-hooks/README.md:24,110` — changed counts re-read in the current file.
- `.skilled/scripts/git-hooks/pre-commit:93–924` — full gate inventory (section headers and bypass flags).
- `.skilled/bin/README.md:77,168` — the added `check-agent-mirror-sync.cjs` tree line plus its CLI table row.
- `.skilled/bin/lib/README.md:72–75,97` — the four added tree lines and the Imports boundary row.
- `.skilled/bin/lib/*.cjs` — banner/require inventory across all modules, including `compiled-routing/**`.
- `.skilled/bin/lib/compiled-route-admission.cjs:1–80` — header banner and imports read directly.
- `.skilled/bin/lib/{node-engine-resolver.cjs,node-engine-resolver.test.cjs,mirror-sync-verify.cjs,launcher-ipc-bridge.cjs,launcher-session-proxy.cjs,model-server-supervision.cjs,sidecar-env-allowlist.cjs}` — banners and imports.
- `.skilled/skills/system-skill-advisor/README.md:113,154` — changed paragraph and options table (via diff), matched against the runtime.
- `.skilled/skills/system-skill-advisor/runtime/{tools/advisor-recommend.ts:24,schemas/advisor-tool-schemas.ts:251,handlers/advisor-recommend.ts:364–381,415–439,553,622,skill-advisor-cli-manifest.ts:58}`.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1754,1839–1868,1960` and `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:407–439`.
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122` (changed sentence, via diff) against `checkVersionParity`.
- `.skilled/skills/cli-external-orchestration/README.md:94` and `.skilled/skills/cli-external-orchestration/cli-hermes/references/{integration-patterns.md:30,providers-and-models.md:97}`.
- Diff-verified related docs (current text from `scratch/review-diff.patch`): `.skilled/skills/sk-git/README.md` (playbook/verification lines), `.skilled/skills/sk-doc/README.md` (sk-design-chart row), `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` (header block), `.skilled/skills/system-deep-loop/runtime/README.md` (tree), `.skilled/skills/system-spec-kit/README.md` (Requirements), `.skilled/skills/system-spec-kit/runtime/README.md:26` (hook adapters).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

All seven claim families checked this iteration resolved clean against the repository; no finding reached the severity bar. The deferred coverage is listed under Edge Cases and Next Focus rather than converted into findings.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Every changed line checked this iteration maps to research rows F12–F23; the doc-to-code claims re-derived from source files listed above. Spec-doc reconciliation (spec.md / tasks.md / acceptance-criteria.md against the diff) still pending — carried to the traceability iteration. |
| `checklist_evidence` | core | pending | Deferred to the traceability iteration (acceptance-criteria evidence rows not re-read this iteration). |

Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) were not part of this iteration's correctness focus and remain pending.

## Integration Evidence

- `.skilled/scripts/git-hooks/pre-commit` — the hook the git-hooks README describes; the gate/flag inventory was read from this file and matches the README's named set exactly (see Confirmed-Clean 1).
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` with `runtime/schemas/advisor-tool-schemas.ts`, `runtime/tools/advisor-recommend.ts` and `runtime/skill-advisor-cli-manifest.ts` — the surfaces behind the advisor README's `surfaceHint` sentence.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` with its invariant tests — the surfaces behind the 13c removal and `frontmatter-versioning.md:122`.
- `.skilled/bin/compiled-route.cjs` — the compiled-route front door the advisor handler invokes with `--surface-hint` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:367,381].
- `.skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:30` — the probe line behind the hub README's `hermes config get providers.llmgateway.base_url` claim.

## Edge Cases

1. **Dimension assignment vs strategy.** The strategy's Next Focus named security; the dispatch assigned correctness (F12–F23 related-doc claims, unreviewed after iteration 1). The dispatch was followed, and the strategy has been updated: correctness extended, security remains the next unchecked dimension.
2. **`pre-commit` has an eleventh `# ---` header.** `pre-commit:919` opens a "Tool ownership map gate (blocking)" section, but its own text says it is "enforced by CI only (pull request, push to main, and a nightly cron), which is broader than this copy could be" and no code follows before `exit 0` at `:924`. It is a documented CI-only gate, not an eleventh sub-gate, so the README's "ten" counts only the implemented sub-gates and is not contradicted.
3. **Literal reading of "Every module here depends only on Node core".** Some modules also require intra-folder relatives (`launcher-session-proxy.cjs → ./launcher-ipc-bridge.cjs`, `node-engine-resolver.test.cjs → ./node-engine-resolver.cjs`) and `mirror-sync-verify.cjs` requires a computed `PARSER_PATH` into the repo's own built parser. Under the row's operative second clause ("No third-party packages") the claim holds: the bare-specifier scan over `.skilled/bin/lib` returned 21 matches, every one a Node core module (`fs`, `http`, `path`, `child_process`, `net`, `string_decoder`, `crypto`). No action needed; recorded so the interpretation is explicit.
4. **Coverage limits.** F12–F23 claims not independently re-derived this iteration: sk-git "9 categories", sk-design-chart "twenty-nine forms", the system-deep-loop runtime `changelog/` tree line, the mcp-code-mode INSTALL-GUIDE header block, system-spec-kit's Node engines wording ("Node 24 for a full install") and hooks-adapter list, and the phase's spec docs. Orchestrator observations corroborate the sk-git folder count, the sk-design-chart template count and the `engines` range, but were not re-derived here. All carried forward.
5. **`cli-hermes` probe nuance.** `providers-and-models.md:97` notes `hermes config get providers.llmgateway.base_url` prints nothing when the provider is unconfigured; `integration-patterns.md:30` still lists it as the probe step paired with `command -v hermes`, which is exactly what the hub README sentence describes. Consistent; no finding.

## Confirmed-Clean Surfaces

1. **git-hooks README ↔ `pre-commit` (dispatch question 4).** Ten implemented blocking sub-gates — comment hygiene (`pre-commit:93`), template phrase lint (`:153`), agent mirror-sync (`:168`), mirror parity (`:207`), skill authoring (`:318`), prompt-card sync (`:422`), MCP mutation-class (`:449`), compiled-routing re-mint (`:479`), spec derived-metadata re-mint (`:681`) and doc version bump (`:833`) — and nine distinct bypass flags (`SPECKIT_SKIP_COMMENT_HYGIENE`, `PHRASE_LINT`, `MIRROR_PARITY`, `SKILL_AUTHORING`, `CARD_SYNC`, `MCP_MUTATION_CLASS`, `ROUTE_REMINT`, `SPEC_REMINT`, `DOC_VERSION_BUMP`), exactly the nine the README's boundary table names, with agent-mirror sync carrying none of its own. The README's "ten blocking sub-gates" (`README.md:24`), "10 blocking gates" diagram, "10 blocking sub-gates" tree comment and "ten named sub-gates" boundary row (`README.md:110`) are mutually consistent, and no residual "nine"/"eight" count remains anywhere in the README.
2. **`bin/lib` tree additions ↔ module headers (dispatch question 2).** All four new entries match: `compiled-route-admission.cjs` ("LIBRARY: COMPILED-SERVING ADMISSION CHECK" … "scores the decision against the gold" ↔ "Scores a hub's compiled decisions against its playbook routing gold"), `mirror-sync-verify.cjs` ("repo-managed agent mirror sync verifier" ↔ "Verifies each runtime's agent mirrors against their source"), `node-engine-resolver.cjs` ("LIB: Node Engine Resolver" ↔ "Finds a Node interpreter that satisfies a package's engines range") and `node-engine-resolver.test.cjs` ("TEST: Node Engine Resolver" with `node:test` ↔ "node:test suite for the resolver").
3. **"Node core only" import claim (dispatch question 3).** The bare-specifier scan over `.skilled/bin/lib` returned 21 matches, all Node core; every other require is `node:`-prefixed or an intra-folder relative. No third-party package anywhere in the tree, including the generated `compiled-routing/**` closure.
4. **`surfaceHint` sentence (dispatch question 5).** Schema `z.string().min(1).max(64)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:251]; forwarded as its own argv pair `--surface-hint <value>` to `.skilled/bin/compiled-route.cjs`, the compiled-route front door [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:381], with the handler comment and manifest text both stating an unknown surface is ignored there; the options count in the README paragraph is seven (`topK`, `includeAttribution`, `includeAbstainReasons`, `confidenceThreshold`, `uncertaintyThreshold`, `includeCompiledRoute`, `surfaceHint`), matching the tool schema.
5. **`frontmatter-versioning.md:122` (dispatch question 6).** `checkVersionParity` compares exactly `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` against the `SKILL.md` release authority [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849–1854]; the changed sentence names precisely that check, and no longer the removed README check.
6. **Doctor check 13c removal complete.** No `checkReadmeVersion`, `README_VERSION_WARN_ONLY` or `13c-readme-version` reporting remains anywhere in `.skilled`; the section comment reads "13a, 13b, 13d" [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1754]; the failing-case entry is gone from the tests and the replacement test asserts the README version is not reported and the checker exits 0 [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:433–439].
7. **`check-agent-mirror-sync.cjs` tree line.** The file exists and the tree comment ("Checks each runtime's agent mirrors against `.skilled/agents`") matches the same file's own description in the bin README's CLI table ("Blocks agent edits that desync the runtime mirrors. Run by both pre-commit hooks and the agent-mirror-sync CI workflow.") [SOURCE: .skilled/bin/README.md:77,168].
8. **`cli-hermes` probe line.** The exact command in the changed sentence, `hermes config get providers.llmgateway.base_url`, is the documented probe paired with `command -v hermes` [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:30] and matches the `providers.llmgateway` block and `LLMGATEWAY_API_KEY` key variable the mode's provider reference documents.

## Ruled Out

- **git-hooks README sub-gate/bypass count drift** — ten implemented gates and nine bypass flags in `pre-commit`; the README's ten/nine text matches the named set exactly; zero residual "nine"/"eight" counts in the README (evidence: `pre-commit:93–924`, `README.md:24,110`).
- **Third-party import in `bin/lib`** — 21 bare specifiers, all Node core; no npm package in any module or in the generated `compiled-routing/**` closure (evidence: bare-specifier scan over `.skilled/bin/lib/*.cjs`).
- **`surfaceHint` documentation drift** — schema bounds, argv forwarding and unknown-surface handling all match the README sentence (evidence: `advisor-tool-schemas.ts:251`, `handlers/advisor-recommend.ts:381`).
- **`frontmatter-versioning.md:122` naming a removed or wrong check** — the sentence now names the version check that compares `ROUTER.md` and the three JSON files with `SKILL.md`, and that is what the code does (evidence: `parent-skill-check.cjs:1849–1854`).
- **Incomplete 13c removal** — no reporting code, constants or docs referencing the check remain in `.skilled`; tests updated (evidence: `.skilled` grep for `13c-readme|checkReadmeVersion|README_VERSION_WARN_ONLY` returns only the new negative assertion at `tests:437`).
- **`cli-hermes` command claim** — corroborated by the mode's own integration-patterns probe step (evidence: `integration-patterns.md:30`).
- **`pre-commit` eleventh header contradicting "ten"** — the 919 header is an explicit CI-only note with no gate body (evidence: `pre-commit:919–924`).

## Next Focus

- **Dimension:** security — **Focus area:** credential and auth wording in the changed surface — the ClickUp auth lines, the mcp-code-mode INSTALL-GUIDE frontmatter change and the `.env.example` cross-claim; confirm no changed doc leaks or implies credential values. — **Reason:** dimension rotation; correctness was extended this iteration to the F12–F23 related docs, the 13c removal and the frontmatter standard line. — **Rotation status:** next unchecked dimension. — **Carry-forward:** (a) runtime-mirror sentence closure for traceability (`agent_cross_runtime`); (b) remaining F12–F23 re-derivations: sk-git 9 categories, sk-design-chart 29 forms, deep-loop runtime `changelog/` tree, INSTALL-GUIDE header, system-spec-kit Node engines and hooks adapters, spec docs. — **Required evidence:** direct listings/reads of the named files; the mirror-sync tooling's runtime table. — **Recovery note:** none — iteration 2 completed.

## Verdict

PASS — no active P0 or P1, and no P2 raised this iteration. Seven claim families closed clean against the repository; the remaining related-doc re-derivations and the spec-doc reconciliation are carried forward as coverage limits, not findings.

Review verdict: PASS
