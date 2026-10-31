# Iteration 001 — Scaffold versus validate for the three packet types

- Angle: what `create.sh` writes for phase / review / research packets versus what `check-files.sh` (FILE_EXISTS) and `check-template-source.sh` (TEMPLATE_SOURCE) require, read-only.
- Verdict: the manifest declares three packet-type levels; the only scaffolder rejects two of them outright, the third is the only one with a special-cased template path. The review packet type's report document has no template anywhere, and the resolver that the rules use disagrees with the resolver that the scaffolder uses about which spec template a review packet carries.
- Tool calls: 12 evidence reads + artifact writes (disclosed; all evidence by hand-reading checked-in source).

## Findings (5: 4×P1, 1×P2)

### f-iter001-001 [P1] — create.sh refuses the two packet-type levels its own manifest declares
- THE CLAIM (manifest side): `templates/spec-kit-docs.json` `levels.review` (requiredCoreDocs = [spec.md, review/review-report.md]) and `levels.research` (requiredCoreDocs = [spec.md, research/research.md]) are first-class creatable levels, alongside `levels.phase`.
- WHAT THE COMMAND DOES: `runtime/cli/spec/create.sh:92` validates `--level` against `^(1|2|3|3\+|phase-parent)$` and `create.sh:94` errors out for anything else ("Error: --level must be 1, 2, 3, or 3+"). `review` and `research` cannot be requested; only `phase-parent` maps to the phase row (`create.sh:99-100`).
- CONSEQUENCE: the manifest rows for review/research are unreachable from the scaffolder that reads the manifest's own contract (`create.sh:1674` calls `copy_templates_batch` with the resolved level contract). The other reader, `runtime/cli/utils/template-structure.js:72`, explicitly accepts them (`VALID_LEVELS` includes review/research) and `check-files.sh`/`check-template-source.sh` take `$level` verbatim — so the validation side treats them as live levels while the creation side treats them as typos.
- SEVERITY: P1 (wrong/unused surface: a declared packet type with no creation path; no data is corrupted because review/research trees are produced by the loop writers, but the scaffolder's level contract machinery is dead code for exactly the rows it was built to serve).
- RECOMMENDATION: fix — accept `review`/`research` in the `--level` case (and teach the resolver + renderer the mapping), or delete the two level rows and the VALID_LEVELS entries if loop writers own those trees exclusively.

### f-iter001-002 [P1] — `review/review-report.md` has no template anywhere, though it is a required core document of its level
- THE CLAIM (manifest side): `levels.review.requiredCoreDocs` names `review/review-report.md` as required core; the `versions` map in the same file enumerates every other template (`research.md.tmpl`, `phase-parent.spec.md.tmpl`, `review.spec.md.tmpl`, …) but NOT `review-report.md.tmpl`.
- WHAT THE TREE HAS: `templates/addons/` and `templates/core/` and `templates/packet-types/` contain no `review-report.md.tmpl` (directory listing verified: addons = acceptance-criteria, before-after, debug-delegation, decision-record, goal, handover, research, resource-map, roadmap, timeline; core = implementation-summary, plan, spec, tasks; packet-types = phase-parent.spec, review.spec). `runtime/cli/lib/template-utils.sh:191-213` (`_manifest_template_path`) resolves `review/review-report.md` to `review-report.md.tmpl`, which does not exist → `copy_templates_batch` (`template-utils.sh:130-133`) would hard-fail "required template document missing".
- CONSEQUENCE: the review packet's report document can never come from a template, and `check-template-source.sh` (TEMPLATE_SOURCE) silently cannot cover it — a template-backed-document gap the census's round-two list never examined (round two checked goal/research/resource-map/handover seams, not the report template).
- SEVERITY: P1 (wrong/unused: level row and template universe disagree; TEMPLATE_SOURCE's coverage claim "checks that spec documents include the template source header" has an excluded required document).
- RECOMMENDATION: document — decide whether review reports are authored (add `review-report.md.tmpl` to addons + versions, mirroring research.md.tmpl) or loop-generated (drop it from requiredCoreDocs or label the row). Given deep-review writes review-report.md itself, the latter is likely correct; the manifest should say so.

### f-iter001-003 [P1] — two resolvers disagree on which spec template a review packet carries
- THE CLAIM (rule-side resolver): `runtime/cli/utils/template-structure.js:403-404` — `normalizedLevel === 'review' && basename === 'spec.md'` ⇒ `review.spec.md.tmpl` (a real file: `templates/packet-types/review.spec.md.tmpl`).
- WHAT THE SCAFFOLDER RESOLVER DOES: `runtime/cli/lib/template-utils.sh:195-197` — the `phase` special case is the ONLY one; for any other level `spec.md` resolves to `basename + '.tmpl'` → `core/spec.md.tmpl` (the Level-1 spec). `review.spec.md.tmpl` is never selected by the scaffolder path, though the manifest's `versions` map lists it.
- CONSEQUENCE: `compare`/`contract` operations driven by `template-structure.js` would judge a review-packet `spec.md` against `review.spec.md.tmpl`, while a create.sh-driven scaffold (if it ever accepted review, see f-iter001-001) would produce a spec.md built from `core/spec.md.tmpl` — the two engines would disagree about the same document's origin template. Latent today (CLI rejects the level), which is precisely why it survived two rounds.
- SEVERITY: P1 (wrong/unused: one of `review.spec.md.tmpl` or the special case must be the authority; today the file's only consumer is the structure helper, and the helper's sibling in the same skill disagrees).
- RECOMMENDATION: fix — mirror the phase special case in `_manifest_template_path` (phase and review are both packet-type rows), or delete `review.spec.md.tmpl` and the review branch if review packets reuse the core spec.

### f-iter001-004 [P1] — the renderer places templates by basename, so manifest path-typed documents cannot land at their contract path
- THE CLAIM (manifest side): the doc names `research/research.md` (levels.research.requiredCoreDocs[1]) and `review/review-report.md` (levels.review.requiredCoreDocs[1]) carry their packet-relative paths.
- WHAT THE RENDERER DOES: `runtime/cli/templates/inline-gate-renderer.ts:290-292` — `outputName = filePath.split('/').pop().replace(/\.tmpl$/,'')` and writes `${outDir}/${outputName}`; a `research.md.tmpl` render lands at `<packet>/research.md`, not `<packet>/research/research.md`. The bash layer itself proves the renderer cannot honor contract paths: `template-utils.sh:144-146` has to `mv phase-parent.spec.md spec.md` after the render.
- CONSEQUENCE: `check-files.sh:75-82` (FILE_EXISTS) requires `research/research.md` at the contract path, so a scaffold that went through `copy_templates_batch` would fail its own rule the moment it exists — exactly the defect class this angle exists to catch; unreachable today only because of f-iter001-001.
- SEVERITY: P1 (wrong: the render contract is path-typed in the manifest and basename-only in the renderer; the phase rename hack is the visible symptom).
- RECOMMENDATION: fix — pass destination names through `copy_templates_batch` (the `docs` loop already knows them) or teach the renderer a `--name`/manifest-path lookup for packet-relative docs.

### f-iter001-005 [P2] — `resolveTemplatePath` looks up `DOC_TEMPLATE_NAMES` by basename while the map is keyed by full path, so `research/research.md` is unresolvable in the JS helper
- THE CLAIM (helper contract side): `runtime/cli/utils/template-structure.js:67` defines `'research/research.md': 'research.md.tmpl'` (full-path key), and the helper describes itself as resolving manifest names.
- WHAT THE CODE DOES: `template-structure.js:390-395` checks `contractDocs.includes(basename)` (basename = `research.md`, but the contract lists `research/research.md`) → returns null; `:407` indexes `DOC_TEMPLATE_NAMES[basename]` → undefined → null. The round-two census row f-iter006-003 ("helper cannot resolve research/research.md — fixed: resolves by basename") repaired only the bash `_manifest_template_path`; the JS helper in this file still cannot resolve it.
- SEVERITY: P2 (cosmetic in impact — the `compare`/`contract` CLI paths are the consumers, and research trees are loop-generated — but it is a re-broken seam in the same file a previous round claimed fixed).
- RECOMMENDATION: fix — index the map by basename (one `Object.fromEntries(Object.entries(DOC_TEMPLATE_NAMES).map(([k,v])=>[k.split('/').pop(),v]))`) or pass the full doc path into the lookup.

## Verified correct on this angle

- `check-files.sh` phase branch (`:37-56`) requires the phase contract docs + `description.json` + `graph-metadata.json`, and `create.sh` phase scaffolding runs a graph-metadata writer (`create_graph_metadata_file`, create.sh:562-566) — the phase shape is internally coherent in the parts read.
- `check-template-source.sh` (`:43-49`) checks marker presence in the first 60 lines only, and `finalize_scaffold_templates` places the marker right after the second `---` (`create.sh:584-600`) — consistent.
- Lifecycle gating anchors to `tasks.md` list items (`check-files.sh:60-68`), matching the census's retired-`checklist.md` fix; no regression in the rows read.
- `is_phase_parent` detection in both rules is symmetric (`check-files.sh:35`, `check-template-source.sh:38`).

## Open questions

1. Who calls `validate.sh` (or the two rules) with `--level review`/`--level research` today — the deep loop writers, the packet owners, or nobody? The P1 severity of f-iter001-001 depends on it; not verified within budget.
2. Which consumer reaches `compare`/`contract` for a research tree (i.e., how live is `resolveTemplatePath`'s research path in validation)? Not verified.
3. Exact line numbers for the `levels.review`/`levels.research` rows in `spec-kit-docs.json` (rows verified by key name and dump, not by line).
4. Does the `documents` map in the manifest carry a `review/review-report.md` entry? The depth-2 dump was truncated before the tail of `documents`.
5. What `getTemplateSourceDocs(level)` returns for `review` (whether it skips the template-less report) — body not read within budget.
