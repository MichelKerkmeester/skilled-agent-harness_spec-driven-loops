# Iteration 010 — Widening pass: the corrected ladder over eight fresh skills, the full catalog anchor census, and live drift cases outside the known cluster

- Run: `2026-10-11T16:24:27.869Z` | Iteration 10 of 10 | Mode: research | Route: @deep-research (native, cli-pi executor)
- Focus reconciliation: all five strategy key questions remain answered; no box is re-ticked. This final iteration executes the dispatch's widening mandate with a fresh corpus and a corrected extractor: it samples eight skills never covered by iterations 7-9, tests the proposed existence check against their real content, finds live drift outside the known advisor cluster, and completes the catalog anchor census to every feature-catalog pack. It closes no key question; it corrects the resolution ladder's stage list, disproves the catalog check's assumed breadth, and adds four fixtures.

## Focus

1. Re-run the inline existence prototype over eight previously unsampled skills' exact `manual-testing-playbook` trees: sk-git, sk-vision, sk-prompt, cli-orca, cli-classifier, mcp-tooling, sk-design, system-deep-loop.
2. Correct the ladder: add per-file relative resolution, preserve `../` tokens with `os.path.normpath`, add a subtree-suffix stage, and widen the basename index to `.skilled` + `.opencode` + `specs`.
3. Adjudicate every residual token with targeted `find`/`rg` against the repo; separate expected-unresolved families from real drift.
4. Census backticked `path:line` anchors across all 29 feature-catalog packs (611 files).
5. Control scan: reproduce the known anchor cluster on the system-spec-kit and system-skill-advisor catalogs with the same extractor.

## Actions Taken

1. Corpus sample: 663 `.md` files in the exact `manual-testing-playbook` trees of the eight unsampled skills, holding 4,384 inline backticked path tokens — a fresh population disjoint from iteration 9's 1,465-file/12,959-token census.
2. Ladder pass 1 (iteration 9's published stage list as implemented): 58.2% resolved (2,550/4,384).
3. Ladder pass 2 (add file-relative + repo-wide basename index): 62.2%, still undermined by a relative-token defect in the prototype.
4. Ladder pass 3 (corrected: `normpath` before joining, file-relative stage, subtree-suffix stage): 96.5% resolved (4,231/4,384), residual 153, decomposed and adjudicated.
5. Drift adjudication: targeted `ls`/`find`/`rg` for every specific residual candidate — `worktree-session.sh`, `worktree-reaper.sh`, `create-diagram-*.yaml`, `tool-input-schemas.ts`, `review_protocol.md`, `subagent_utilization_ledger.md`, `cupt/*.py`, `vision-runtime/dist/*.js`.
6. Catalog census: same extractor over all 29 `feature-catalog` packs / 611 files, with the spec-kit + advisor pair re-scanned as control.

## Findings

### F1 — The published ladder under-resolves fresh skills by 34 points; file-relative and subtree-suffix are load-bearing stages [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:1]

Over the fresh sample, iteration 9's stage list as implemented resolves 58.2% of tokens. Three corrections lift it to 96.5% (4,231/4,384): per-file relative resolution (the same basis iteration 9 established for markdown links), `os.path.normpath` on every token so `../` prefixes survive, and a subtree-suffix stage matching a token's directory-plus-basename against any path under the skill subtree. Corrected stage profile: file-relative 1,198; subtree-suffix 1,354; skill-root 808; repo-root 801; skill-scripts 29; global-basename 19; specs-prefix 6; top-skill-root 7; skilled-prefix 8; skill-runtime 1. The two new stages carry 58% of all resolutions, so the implementation spec must not copy iteration 9's ladder summary as a stage list; it must specify file-relative and subtree-suffix semantics explicitly.

### F2 — Residual is 153 tokens (3.5%), all in enumerable expected families plus four live drift candidates [SOURCE: .skilled/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md:1]

Residual classes over the 153 dead tokens: other 62, scratch 58, placeholder/glob 26, runtime/generated 7. Adjudicated examples: `/tmp/drv-06x-*.json` scratch [SOURCE: .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-candidate-coverage.md:1]; `vision-runtime/dist/*.js` external build output — sk-vision carries no runtime tree in this checkout; `cupt/test_*.py` consumer sample-project paths (the `cupt-*` slugs live in the mcp-click-up feature-catalog, not as a project tree); `.obsidian/plugins/*/data.json` and `.devin/config.local.json` consumer-side config. Live drift candidates, all found in skills never checked before: (a) `.skilled/commands/create/assets/create-diagram-auto.yaml` and `create-diagram-confirm.yaml`, cited from the sk-design-diagram command playbook, do not exist — the assets directory holds create-agent, create-benchmark, create-changelog and create-command packs only [SOURCE: .skilled/commands/create/assets/create-agent-auto.yaml:1]; (b) `schemas/tool-input-schemas.ts`, cited twice from the council-graph playbooks, has no same-basename file anywhere under system-deep-loop [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md:1]; (c) `review_protocol.md` and `subagent_utilization_ledger.md`, cited in the sk-git root playbook, are absent repo-wide — session artifacts are the plausible class, so watch-only; (d) the two worktree scripts resolve at `.skilled/bin/` once the global-basename stage runs [SOURCE: .skilled/bin/worktree-session.sh:1]. Net: the existence tier demonstrably fires on real drift outside the advisor cluster, and every remaining residual class is enumerable as expected-unresolved.

### F3 — Catalog line anchors are a 2-pack asset: 32 anchor lines in 29 packs; the other 27 packs carry paths and links, zero lines [SOURCE: .skilled/skills/sk-git/feature-catalog/feature-catalog.md:35]

Full census across all 29 feature-catalog packs and 611 files: only two packs carry backticked `path:line` anchors — system-spec-kit (22 anchor lines) and system-skill-advisor (10). The control scan with the same extractor reproduces the known cluster [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:66]. The 22 freshly sampled packs carry 4,023 backticked path tokens and 1,480 markdown links with zero line anchors. Consequence for the implementation-ready spec: the catalog-side objective tier (existence plus bounds on anchors) can exercise exactly 2 of 29 packs; covering the other 27 requires an existence/link check over backticked paths and markdown links — a different, cheaper tier than the anchor check. The spec must state the scope split rather than implying catalog-wide anchor coverage.

### F4 — Extractor defect class #5 recorded: character-stripping relative tokens; the spec must normpath them [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/recovery-and-edge-cases/empty-commit-or-no-changes.md:1]

The first corrected prototype used `lstrip('./')`, which strips both dots and the slash of a leading `../`, turning `../recovery-and-edge-cases/empty-commit-or-no-changes.md` into a path with no parent segment and inflating the residual by hundreds of instances until `os.path.normpath` replaced the strip. This is the fifth extractor defect observed across iterations 7-10, after the `js`-before-`json` truncation, the backtick-separated line form, leading-dot loss, and incomplete extension sets. Spec action: pin a `../`-normpath regression fixture alongside the existing extractor regression set.

## Questions Answered

- None: all five strategy key questions stay ticked from earlier iterations; no box is re-ticked.

## Questions Remaining

- No open questions. Final residue for the implementation-ready spec, updated by this iteration: (a) resolution order = repo root -> `.skilled` prefix -> file-relative -> specs prefix -> skill root -> skill/scripts -> skill/runtime -> top-skill root -> subtree-suffix -> global basename, with `os.path.normpath` applied to every relative token before joining; (b) catalog scope split = 2 of 29 packs carry `path:line` anchors (objective tier), the other 27 need an existence/link tier if covered; (c) fixture set grows by the sk-design missing diagram assets, the council `tool-input-schemas.ts` pair, the sk-git absent basenames (watch-only), and the `../` normpath regression; (d) fresh-sample false-positive estimate is 3.5% (153/4,384) under the corrected ladder, against iteration 9's 13% corpus-wide estimate under its own ladder — both estimates carry their ladder and scope. Rate denominators: corpus-wide figures stay 1,465 files / 12,959 inline instances / 3,952 distinct tokens; this iteration's fresh-sample figures are 663 files / 4,384 tokens and are not comparable to the corpus rates.

## Next Focus

- Terminal iteration: no iteration 11. Hand off to synthesis: merge the corrected ladder and its stage profile into the implementation-ready spec, state the catalog scope split, and carry the four fixtures; the CI-wiring decision for the catalog fixture test remains the operator's.

## SCOPE VIOLATIONS

None against researched files. One instrumental temp file in the run directory carries the single iteration record to the append gateway; all other writes were the three allowed artifacts.
