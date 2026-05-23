# Iteration 7 — OpenCode assets and spec-folder verification gaps

## Focus

This iteration audited `sk-code` OpenCode assets, the shared alignment-verification recipe, and manual testing playbook expectations. The focus was whether assets/checklists provide first-class guidance for system-spec-kit spec-folder writes, skills/agents/commands authoring, and CocoIndex retrieval priorities.

## Actions Taken

- Action 1: Read Section 11 plus prior iteration finding summaries to avoid repeating iteration 6's reference-layer audit.
- Action 2: Listed `assets/opencode/` and `references/opencode/` to confirm the actual OpenCode asset surface.
- Action 3: Read `assets/opencode/checklists/universal_checklist.md`, `references/opencode/shared/alignment_verification_automation.md`, and the universal verification checklist.
- Action 4: Compared router/resource-loading prose with manual testing playbook expected-loaded assets for OpenCode TypeScript/Python and surface-detection scenarios.
- Action 5: Checked for authoring/checklist coverage around skills, agents, commands, spec folders, `validate.sh`, metadata, and manual playbook validation state.

## Findings

### sk-code

### F-007-001 — OpenCode asset surface is language-only despite broader OPENCODE scope [P1]

`sk-code` declares OPENCODE coverage for "skills, agents, commands, MCP servers, hooks, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, and Shell" in `.opencode/skills/sk-code/SKILL.md:90-92`, but the on-disk OpenCode asset tree contains only `assets/opencode/checklists/{config,javascript,python,shell,typescript,universal}_checklist.md`. The router map mirrors that same limitation: CODE_QUALITY loads `assets/opencode/checklists/universal_checklist.md` plus a language checklist, and every language maps to exactly one language checklist (`references/router/resource_loading.md:124-140`).

Impact: the asset layer has no canonical checklist for authoring or reviewing `.opencode/skills/*/SKILL.md`, `.opencode/agents/*`, `.opencode/commands/*`, or spec-folder writes. Those areas remain in scope but are governed indirectly by language/config rules.

### F-007-002 — Spec-folder validation is named but not operationalized as a loaded recipe [P1]

The OpenCode verification contract says OPENCODE should run alignment checks plus targeted tests "or spec validation" (`.opencode/skills/sk-code/SKILL.md:127-133` and `.opencode/skills/sk-code/references/router/resource_loading.md:144-149`). The universal pre-claim checklist's OPENCODE row only names `verify_alignment_drift.py --root <changed-path>` plus generic package-specific build/typecheck (`assets/universal/checklists/verification_checklist.md:37-45`). The OpenCode universal checklist's "Spec Folder Invariants" stops at allowed roots, archive/restore/create target validation, and checkpoint wording (`assets/opencode/checklists/universal_checklist.md:89-96`); it does not name `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`, `description.json`, `graph-metadata.json`, or `checklist.md` evidence.

Impact: sk-code and system-spec-kit compose only by prose memory. A `/speckit:complete` or OpenCode edit that writes spec docs can load sk-code, satisfy the alignment verifier, and still miss the system-spec-kit validator workflow unless separate instructions intervene.

### F-007-003 — Alignment automation cannot cover the Markdown-heavy assets that are missing checklists [P2]

The alignment verifier explicitly "does not scan markdown prose" and leaves naming, comments, KISS/DRY/SOLID, module export decisions, and TypeScript package-boundary decisions as manual checklist gates (`references/opencode/shared/alignment_verification_automation.md:36-47`). The missing OpenCode authoring surfaces are mostly Markdown/config contract surfaces: `SKILL.md`, agent definitions, command definitions, and spec-folder docs.

Impact: the current automation is useful for code/config drift, but it cannot compensate for the absence of first-class Markdown authoring checklists. Adding only verifier rules will not close this gap; sk-code needs authored assets or references for these surfaces.

### F-007-004 — Manual routing scenarios expect only language assets, so integration assets would not be tested [P2]

The OPENCODE TypeScript language-sub-detection scenario expects only `assets/opencode/checklists/typescript_checklist.md` and `assets/opencode/checklists/universal_checklist.md` (`manual_testing_playbook/02--language-sub-detection/001-opencode-typescript.md:27-38`). The OPENCODE surface-detection scenario similarly expects TypeScript plus universal OpenCode assets and verifies only alignment evidence after the edit (`manual_testing_playbook/01--surface-detection/002-opencode-detection.md:40-49`, `:71-84`). It does not expect a spec-folder validation asset, an authoring checklist, or the universal pre-claim checklist.

Impact: even if new integration assets are added, existing manual scenarios would not fail when the router omits them. The playbook should gain targeted scenarios for spec-folder writes and skills/agents/commands authoring.

### mcp-coco-index

### F-007-005 — CocoIndex has a retrieval-priority target: canonical assets before unvalidated playbook scenarios [P2]

Iteration 5 found CocoIndex surfacing manual testing playbook paths as sk-code standards evidence. This iteration found those scenarios are still marked "Last validated: pending first manual run" in TypeScript and Python sub-detection playbooks (`manual_testing_playbook/02--language-sub-detection/001-opencode-typescript.md:69-75`, `manual_testing_playbook/02--language-sub-detection/002-opencode-python.md:68-74`). Meanwhile the canonical OpenCode asset surface is thin and language-only.

Impact: search ranking can over-promote scenario files that are useful test fixtures but weaker standards sources. The remediation target is not "exclude playbooks"; it is to add canonical OpenCode integration assets and tune CocoIndex/queries to prefer `references/opencode/**` and `assets/opencode/**` for standards answers.

## Questions Answered

- Q5: Partially answered. The OpenCode asset gap is concrete: only language/config checklists exist, with no first-class checklist or recipe for skills, agents, commands, or spec-folder validation.
- Q7: Partially answered. sk-code acknowledges spec validation, but the loaded verification/checklist assets do not operationalize system-spec-kit's validator and metadata workflow.
- Q4: Partially advanced. The CocoIndex issue is now sharper: canonical `assets/opencode/**` and `references/opencode/**` need richer standards content so search can rank them above manual testing scenarios for standards queries.

## Questions Remaining

- Q6: Still open. Iteration 8 should compare `STACK_FOLDERS`, `resource_loading.md`, SKILL.md resource domains, and on-disk structure formally.
- Q7: Still open for live `/speckit:complete` or spec-folder write routing behavior. This iteration found asset-level gaps but did not execute a routing flow.
- Q5: Still open for deciding exact add/refine/remove targets: likely an OpenCode spec-folder validation recipe, authoring checklists for skills/agents/commands, and manual scenarios that assert those resources load.

## Next Focus (for iteration 8)

Run the formal `STACK_FOLDERS` and resource-map drift comparison promised by the rotation. Include `sk-code/SKILL.md`, `references/router/resource_loading.md`, on-disk `references/*` and `assets/*`, and the manual testing playbook's expected-loaded resource sets. Prioritize whether new integration assets from iteration 7 would be discoverable by the router and by CocoIndex without being drowned out by playbook fixtures.
