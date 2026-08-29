# sk-code Workflow Sub-skill Research

## Iteration 1 Synthesis

The four workflow sub-skills have a useful division of labor: `code-implement` owns research and mutation, `code-quality` owns author-side gate fixes, `code-debug` owns symptom-to-root-cause repair, and `code-verify` owns non-mutating evidence and completion claims. This aligns with the shared phase lifecycle and hub registry. [SOURCE: .opencode/skills/sk-code/SKILL.md:23] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:46]

Initial highest-leverage upgrade candidates are documentation/contract refinements rather than new behavior: correct stale checklist path vocabulary in `code-quality`, clarify Webflow debugging/verification resource ownership in `code-debug` and `code-verify`, and add a compact handoff matrix so agents can move between sibling modes without guessing. [SOURCE: research/iterations/iteration-001.md]

## Ranked Proposals So Far

1. Fix `code-quality` checklist path vocabulary.
2. Clarify Webflow debug/verify resource ownership.
3. Clarify verifier script ownership in `code-verify`.
4. Add a cross-mode handoff matrix.
5. Add a workflow permission precedence note for `Task`.

## Open Questions

- Are the delegated `code-opencode` checklist contents themselves sufficient and non-overlapping?
- Do Webflow debug/verify references cover real browser and minification edge cases without duplicating `code-webflow` process?
- Which proposal should be ranked highest after asset-level inspection?

## Iteration 2 Synthesis

`code-implement` is strongest as a small orchestration contract: it owns Phase 0 research, Phase 1 mutation, read-first discipline, baseline/blast-radius capture, restraint-ladder application, and explicit handoff, while delegating deep evidence to sibling surface packets. Its main friction is wording: README quick-start calls the delegated resources “packet-owned references,” even though local inventory shows only `SKILL.md` and `README.md` under `code-implement`. [SOURCE: research/iterations/iteration-002.md]

`code-quality` is operationally useful because it has local gate assets and scripts: a Webflow/general quality checklist, comment-hygiene checker, dist-staleness warning checker, hook shim, tests, and README guidance. Its upgrade need is sharper than `code-implement`'s: normalize stale `assets/opencode-checklists/` wording to the actual `../code-opencode/assets/checklists/` location, and resolve the contradiction where shared smart routing points CODE_QUALITY at `code-review/assets/code_quality_checklist.md` even though author-side quality owns `code-quality/assets/code_quality_checklist.md`. [SOURCE: research/iterations/iteration-002.md]

## Ranked Proposals After Iteration 2

1. Fix `code-quality` OpenCode checklist path vocabulary to actual `../code-opencode/assets/checklists/` paths.
2. Resolve author-side quality vs findings-first review checklist ownership in shared routing.
3. Clarify `code-implement` delegated-resource wording instead of adding local duplicate references.
4. Document `check-dist-staleness.sh` as advisory and require escalation/handoff when it prints stale warnings.
5. Add a cross-mode handoff matrix after `code-debug` and `code-verify` receive equal asset-level inspection.

## Iteration 3 Synthesis

`code-debug` is well-scoped as Phase 2 root-cause repair: reproduce or characterize a symptom, capture exact evidence, localize source cause, edit one cause at a time, rerun the original reproduction, and return through `code-quality` before `code-verify`. Its main upgrade need is documentation alignment: local Resource Domains and the universal checklist still use older `references/webflow/...`, `references/opencode/shared/...`, and local Webflow asset vocabulary, while current navigation delegates those resources to sibling `code-webflow` and `code-verify` paths. [SOURCE: research/iterations/iteration-003.md]

`code-verify` is the strongest operational packet so far because it owns non-mutating claim gating and includes runnable assets: the universal pre-claim checklist, performance-loading checklist, alignment-drift verifier, stack-folder verifier, and verifier tests. The alignment verifier passed against `code-verify`, but `verify_stack_folders.py` failed from its actual location because it resolves `SK_CODE` to `code-verify` and then searches for a `STACK_FOLDERS` dict in `code-verify/SKILL.md`. [SOURCE: research/iterations/iteration-003.md]

## Ranked Proposals After Iteration 3

1. Repair or relocate `code-verify/assets/scripts/verify_stack_folders.py` so it targets the current two-axis registry/surface-packet layout instead of an older monolithic `STACK_FOLDERS` contract.
2. Normalize stale `code-debug` and `code-verify` Resource Domains/checklist path vocabulary to the delegated `../code-webflow/...`, `../code-opencode/...`, and `../shared/...` paths.
3. Add a compact cross-mode handoff matrix: implement → quality → debug → verify, plus verify handbacks to debug/implement/quality.
4. Keep `verify_alignment_drift.py` as a high-value OpenCode verification asset and document its passing/failing semantics alongside targeted tests.
5. Treat missing local debug/verify `references/` directories as intentional delegation, not as a need to duplicate surface evidence.

## Iteration 4 Synthesis

The cross-skill lifecycle is conceptually strong: `code-implement` produces the smallest scoped change and hands off, `code-quality` enforces author-side gates, `code-debug` repairs reproducible failures one cause at a time, and `code-verify` collects non-mutating final evidence. The most important seam is not missing ownership but missing payload shape: each mode names some handoff data, but no shared schema tells agents exactly which fields should travel between modes. [SOURCE: research/iterations/iteration-004.md]

Parent routing should remain routing-only. `SKILL.md`, `mode-registry.json`, and `hub-router.json` establish the single advisor identity, registry-driven mode resolution, and surface bundling; lifecycle process belongs in mode packets and shared references. The main parent-level improvement is precedence clarity: after a mode is resolved, the narrower registry/tool-surface contract should override the parent hub's broad allowed-tool superset. [SOURCE: research/iterations/iteration-004.md]

## Ranked Proposals After Iteration 4

1. Add a compact shared cross-mode handoff schema/matrix for implement -> quality -> debug -> verify and verify handbacks.
2. Normalize stale path vocabulary in `shared/references/phase_detection.md` and `code-quality/SKILL.md` to current nested packet paths.
3. Add explicit parent-vs-packet tool-surface precedence wording: parent hub can route broadly, but packet registry contracts govern execution after resolution.
4. Preserve intentional checklist overlap by documenting it as “implement consumes write-time checklists; quality enforces author-side gates.”
5. Avoid moving lifecycle logic into `hub-router.json`; if route metadata is added, keep mode contracts in mode packets/shared references.

## Iteration 5 Synthesis

The strongest ranked proposal is now operational rather than purely documentary: repair, relocate, or explicitly retire/re-scope `code-verify/assets/scripts/verify_stack_folders.py`. `code-verify` advertises it as a stack-folder/surface-router integrity check, but the script still expects an older monolithic `STACK_FOLDERS` declaration and local `references/`/`assets/` surface folders, while the current architecture is registry-driven with sibling surface packets. [SOURCE: research/iterations/iteration-005.md]
