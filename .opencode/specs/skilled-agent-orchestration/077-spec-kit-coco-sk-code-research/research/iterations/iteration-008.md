# Iteration 8 — OpenCode Resource-Map Drift

## Focus
This iteration audited the sk-code OpenCode `STACK_FOLDERS`/resource-map contract against the current on-disk `references/opencode/` and `assets/opencode/` structure. It also checked whether the declared OpenCode loading rules give system-spec-kit spec-folder writes and CocoIndex ranking a canonical resource target.

## Actions Taken
- Action 1: Read `deep-research-strategy.md` Sections 3, 6-12 and prior iteration finding headings to avoid re-treading iterations 1-7.
- Action 2: Compared `sk-code/SKILL.md` OpenCode language/resource-domain claims with `references/router/resource_loading.md` Section 5.
- Action 3: Inventoried `references/opencode/` and `assets/opencode/` with `find` and checked for the current `STACK_FOLDERS`/`RESOURCE_MAP` symbols with `rg`.
- Action 4: Reviewed `verify_alignment_drift.py` and the manual testing playbook's automated-test cross-reference to see whether resource-map drift is covered by automation.

## Findings

### sk-code

### F-008-001 — Live router no longer has a machine-readable `STACK_FOLDERS` contract [P1]
The iteration focus asks for a formal `STACK_FOLDERS` comparison, but the live sk-code surface no longer exposes that contract in current router files. `rg -n "STACK_FOLDERS|STACK|FOLDERS" .opencode/skills/sk-code .opencode/skills/system-spec-kit .opencode/skills/mcp-coco-index` found the only relevant `STACK_FOLDERS` reference in an old changelog entry: `.opencode/skills/sk-code/changelog/v3.0.0.0.md:7`, which says the path aligned with `STACK_FOLDERS["NEXTJS"]`, `references/router/stack_detection.md`, and `resource_map_for(NEXTJS)`. Those are not the current OpenCode map surface. The live contract is prose/table based: `SKILL.md:100-106` maps languages to `references/opencode/<language>/*`, while `references/router/resource_loading.md:136-140` expands those folders into three exact reference files plus one checklist per language.

Concrete target: add or regenerate a small machine-readable OpenCode resource manifest, even if the public docs stay prose. That gives both alignment tests and CocoIndex ranking checks a stable expected set.

### F-008-002 — OpenCode intent taxonomy is broader than the OpenCode resource map [P1]
`SKILL.md:121` says sk-code scores `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `TESTING`, `DEPLOYMENT`, `PERFORMANCE`, `ANIMATION`, `MOTION_DEV`, `FORMS`, `VIDEO`, `API`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS`. The OpenCode map in `references/router/resource_loading.md:124-130` only lists `CODE_QUALITY`, `VERIFICATION`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS`. The on-disk OpenCode reference folders match the narrower map: `references/opencode/` contains `shared/`, `javascript/`, `typescript/`, `python/`, `shell/`, and `config/`; `assets/opencode/` contains only `checklists/`.

This leaves OpenCode `DEBUGGING`, `TESTING`, `API`, `IMPLEMENTATION`, and authoring tasks to inherit generic shared/language files rather than first-class OpenCode resources. That reinforces F-006-002 and F-007-001, but adds the stricter resource-map drift: declared intents exist without OpenCode resource rows or folders.

### F-008-003 — The verifier cannot catch Markdown/resource-map drift [P2]
The documented OPENCODE verification command is `python3 .opencode/skills/sk-code/scripts/verify_alignment_drift.py --root <changed-scope>` in `SKILL.md:132` and `references/router/resource_loading.md:149`. The verifier itself only scans code/config extensions: `.ts`, `.tsx`, `.mts`, `.js`, `.mjs`, `.cjs`, `.py`, `.sh`, `.json`, and `.jsonc` in `verify_alignment_drift.py:31-42`. Its coverage comment says the same at `verify_alignment_drift.py:11-17`. Markdown-heavy router and asset drift, including `references/router/resource_loading.md`, `references/opencode/**/*.md`, `assets/opencode/**/*.md`, and the manual testing playbook, is therefore outside the recurring alignment check.

Concrete target: add a separate resource-manifest validation script or extend the verifier with a Markdown-resource mode that checks declared resource rows against on-disk paths.

### system-spec-kit / sk-code integration

### F-008-004 — Spec-folder writes are named in verification, but not loaded as an OpenCode recipe [P1]
The OpenCode verification row requires "spec validation for changed spec folders" (`SKILL.md:132`, `references/router/resource_loading.md:149`), but the loaded OpenCode map does not include a system-spec-kit workflow reference. The closest always-loaded OpenCode guidance is `references/opencode/shared/universal_patterns.md:420-426`, which covers path invariants for spec folders but not Gate 3, template levels, `description.json`/`graph-metadata.json`, or `validate.sh --strict`. The OpenCode map's `VERIFICATION` row loads only `references/opencode/shared/alignment_verification_automation.md` plus the alignment verifier (`references/router/resource_loading.md:127`).

Concrete target: add an OpenCode verification recipe that points spec-folder writes to `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md` and `scripts/spec/validate.sh`, or add a cross-skill resource row for SPEC_FOLDER_WRITES.

### mcp-coco-index / sk-code integration

### F-008-005 — CocoIndex has no canonical OpenCode authoring/spec resource target to prefer [P2]
Iterations 5 and 7 showed that unscoped sk-code standards queries can over-rank manual testing scenarios. The current resource-map comparison explains why: canonical OpenCode assets are only `assets/opencode/checklists/*.md`, and the router map has no first-class skill/agent/command authoring or spec-folder write resource. The manual playbook explicitly lists routing scenarios as not covered by automation at `manual_testing_playbook.md:298-307`, including all language-sub-detection and cross-stack smart-routing checks.

Concrete target: after adding first-class OpenCode authoring/spec resources, add CocoIndex smoke queries that assert those canonical files outrank manual testing scenario files for standards-style queries.

## Questions Answered
- Q5: Partially resolved. The missing OpenCode resources are not just assets; the OpenCode resource map lacks first-class rows for authoring, testing/debugging, API/implementation, and spec-folder writes.
- Q6: Resolved for the current tree. The old `STACK_FOLDERS` contract is not live; the active OpenCode contract is a prose/table map that cannot be mechanically validated today.
- Q7: Partially resolved. sk-code names spec validation, but its loaded OpenCode recipe does not operationalize system-spec-kit spec-folder gates or strict validation.

## Questions Remaining
- Q4: Still open for a fresh post-resource-map CocoIndex run. Prior evidence says sk-code is ingested but ranking is polluted; this iteration identifies the missing canonical targets to test after remediation.
- Q7: Needs an end-to-end `/spec_kit:complete` or equivalent routing trace to prove whether the skill advisor loads sk-code plus system-spec-kit resources together during actual `.opencode/specs/` writes.

## Next Focus (for iteration 9)
Run the cross-cutting integration pass: trace one `.opencode/` implementation flow that writes a spec folder, identify exactly which sk-code and system-spec-kit resources are loaded, and define CocoIndex smoke queries that should rank canonical OpenCode authoring/spec resources ahead of manual testing scenarios.
