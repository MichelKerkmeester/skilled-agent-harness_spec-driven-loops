# Iteration 007 — Widening: the token tier replayed over the corpus; the wrong-line class is a cluster; the existence tier is corpus-clean once extensions match whole

- Run: `2026-10-11T16:24:27.869Z` | Iteration 7 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: all five strategy key questions remain answered; no box is re-ticked. This iteration executes the dispatch's widening mandate — verify earlier claims against the tree, sample further skills' playbooks and catalogs, and test the proposed checks against real drift cases. It closes no key question; it adds corpus-scale evidence and one self-corrected measurement.

## Focus

1. Replay the token-at-line check — the tier iteration 6's live wrong-line case motivated — over every catalog anchor, and adjudicate every fire against the cited file.
2. Replay the path-existence half over every `.skilled/`-prefixed citation in every catalog file, then classify everything that fails.
3. Sample beyond the skills root: the two `.pi/extensions` playbook trees, the `.skilled/specs` archive mirror, and re-verify the fleet gate's root scope.

## Actions Taken

1. Token-at-line prototype over `feature-catalog/**/*.md`: 670 files matched; 58 anchors in 8 files, of which 22 belong to a duplicate archive mirror; the live corpus is 36 anchors across 6 files (matches iteration 6). For each anchor: resolve through three bases (as-is, skill-relative, skill+runtime), bounds-check, extract backticked identifiers from the citing line, and test them against the cited segment.
2. Adjudication: for every fire, the target file's cited lines were read and the claimed token located where it actually occurs.
3. Existence replay: every `.skilled`/`.opencode` path citation in the 263 catalog files, counted per instance and classified. A first run reported 34 distinct unresolved; a self-check exposed an extension-alternation bug (`js` ordered before `json` truncates every `.json` path to `.js`), and the corrected rerun reports 4 distinct.
4. Fleet-scope re-verification in `validate-playbook-package.cjs` (defaults, discovery) and `.github/workflows/` (which workflows touch playbooks and under which path filters).
5. `.pi/extensions` sampled: 23 scenarios, no CI or validator reference, flags are pi-CLI options.

## Findings

### F1 — Token-at-line over the live anchor corpus: 11 of 36 anchors are extractable, 3 pass, 8 fire; the wrong-line class is a cluster in one catalog, not a singleton

The six live anchor catalogs carry 36 `path:line` anchors. Eleven expose a backticked identifier token on the citing line; 3 of those pass; 8 fire. Adjudication splits the 8 live fires into:

- **3 clear stale anchors** — the cited line no longer carries the claimed token, and the substance sits elsewhere in the same file: `schemas/advisor-tool-schemas.ts:221` cited where `compiledRoute` is declared at line 268 [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:268]; `advisor-status.ts:89-94` cited where the diagnostic-only/repair comment is at 344-345 [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:344]; `skill-advisor-cli.ts:1420-1440` cited where the `-32602` + `includeCompiledRoute` handling is at 1500-1501 [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1500].
- **4 approximate/loose anchors** — right file, line range near but not on the claim: `advisor-recommend.ts:500-510` vs the option gate at 551 [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:551]; `skill-advisor-cli-fallback.ts:230` vs `includeCompiledRoute: false` at 221 [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:221]; `advisor-tool-schemas.ts:227`, where the file carries no request-option token at all; `skill-advisor-cli-manifest.ts:40` vs the option declaration at 57 [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:57].
- **1 known true positive** — `code-standards-alignment.md:76` [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:76], iteration 6's live case.

Seven of the 8 live fires sit in the three `system-skill-advisor` catalog files (`advisor-recommend.md` carries 5 of them, including 4 anchors on a single line [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33]); the eighth is the spec-kit cell. Two structural consequences for the check: multi-anchor lines (also `canonical-first-spec-root-resolution.md:67` and `:69`, two anchors each) make per-line token binding false-positive-prone, so attribution must be per-anchor; and 25 of 36 anchors carry no extractable token, so the tier is structurally silent on two-thirds of the corpus. The claim-token advisory posture — nothing fail-closed — is strengthened by this replay, not weakened: the class is real and recurring, but adjudication is irreducibly judgment-bound.

### F2 — Existence tier over the corpus: 1,426 citations, 8 unresolved instances (4 distinct, 0.56%) — all explainable; the first scan's 34-distinct reading was the scanner's own bug

Corrected counts: 1,426 path citations in 263 catalog files; 8 unresolved instances, 4 distinct paths.

- 2 instances: `.skilled/skills/system-spec-kit/runtime/cli/core/memory-indexer.ts`, annotated historical removal — the citing catalog says "(removed with the memory server)" [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md:58], with the retirement note at line 19 [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md:19].
- 3 instances: `.opencode/plugins/sk-vision.js`, a committed symlink to the unbuilt `vision-runtime/dist/plugin.js` (dist missing in this worktree); the catalog itself documents it as a symlink to the built runtime plugin [SOURCE: .skilled/skills/sk-vision/feature-catalog/feature-catalog.md:248].
- 2 instances: `.skilled/commands/memory/save.md`, genuinely absent — `.skilled/commands/` has no `memory` directory [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md:44]. This is the only candidate move-drift left in the existence tier.
- 1 instance: `.skilled/commands/create/assets/create-diagram-auto.yaml`, absent, while sibling `create-<mode>-auto.yaml` assets exist for other create modes [SOURCE: .skilled/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md:47].

The first run of the same scan reported 34 distinct unresolved because the extractor ordered `js` before `json` in its alternation, truncating every `.json` citation to `.js` — e.g. the catalog's `mode-registry.json` [SOURCE: .skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md:41] was reported as a missing `mode-registry.js`. With boundary-aware extension matching there are zero missing `.json` citations. Consequence: the existence half needs boundary-aware extension matching plus an expected-unresolved convention (annotated removals, unbuilt-symlink targets) — not the "generated-artifact policy" the buggy first run implied.

### F3 — Coverage boundary: the two `.pi/extensions` playbook trees (23 scenarios) are outside the operator-contract fleet

`validate-playbook-package.cjs` defaults `skillsRoot` to `<repo>/.skilled/skills` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:81] and discovers packages only under that root, while the playbook fleet gate runs the validator with `--strict` [SOURCE: .github/workflows/playbook-operator-contract.yml:61]. No workflow and no validator file references `.pi/` or the extension names (rg over `.github/workflows/` and the validator packet returns nothing). The sampled extension scenarios exercise pi-CLI options rather than repo scripts [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/persistence-and-startup/fast-startup-flag.md:16] — the non-repo-executable skip class from iteration 3 — so the boundary is defensible, but it must be stated as coverage: a check hosted in this validator reaches the skills root and its discovered trees, never the extension trees. `routing-registry-drift.yml` watches only `.skilled/skills/*/manual-testing-playbook/**` and shares the same boundary [SOURCE: .github/workflows/routing-registry-drift.yml:55].

### F4 — Corpus scoping: `.skilled/specs` is a symlink to `../specs`, so `.skilled/**` globs double-count archive catalogs (22 duplicate anchors observed)

A `feature-catalog/**/*.md` glob under `.skilled/` traversed the `specs` symlink into `specs/**/z_archive` and matched a full mirror of the live catalog: the scan found 58 anchors in 8 files, of which 22 are the archive duplicate (e.g. the archived copy of the live file's line [SOURCE: .skilled/specs/system-speckit/z_archive/022-hybrid-rag-fusion/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:47] mirroring [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:47]). Corpus scans must scope to `.skilled/skills/**` or exclude `z_archive`; otherwise the same drift is reported twice and unfixable archive copies can hold a check red. `.skilled/plugins -> ../.opencode/plugins` carries the same caveat.

### F5 — Adjacent precedent: the repository already scores playbook-authored routing gold against compiled behavior, warn-only

`routing-registry-drift.yml` runs "Compiled-serving admission — compiled decisions against playbook routing gold" via `compiled-route-admission.cjs --all --warn-only` [SOURCE: .github/workflows/routing-registry-drift.yml:180], with the warn-only posture explicitly documented as "until the first baseline is triaged" [SOURCE: .github/workflows/routing-registry-drift.yml:175]. A warning-first rollout with a triaged baseline is an accepted pattern in this repository — directly relevant to staging the proposed checks rather than gating them blocking from day one.

## Questions Answered

- No new strategy key question; all five stay ticked from earlier iterations. This iteration discharges the widening mandate with corpus-scale replays and adjudication: the token tier (F1), the existence tier (F2), further skills' playbooks and catalogs (F3, F4), and earlier claims re-verified (F1's 36-anchor/6-file count reproduces iteration 6; the validator's default root and the CI run line re-pinned).

## Questions Remaining

- None open. The synthesis residue now carries a concrete fixture set: F1's stale-anchor cluster (`schemas:221`↔268, `status:89-94`↔344, `cli:1420-1440`↔1500) with the loose trio (handler/fallback/manifest) as near-miss fixtures; the corrected existence scan with its own `.json`→`.js` truncation as an extractor regression test; and the `.pi` plus archive scoping boundaries to state, not absorb.

## Next Focus

- Synthesis (iterations 8+): assemble the implementation-ready spec. Required elements now enumerated: per-anchor claim binding for multi-anchor lines; dual-base resolution (skill-relative + skill/runtime) for bare-relative citations; boundary-aware extension matching; expected-unresolved conventions (annotated removals, unbuilt-symlink targets); the `.pi`/archive scoping boundaries; and the warn-only staging precedent.

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
