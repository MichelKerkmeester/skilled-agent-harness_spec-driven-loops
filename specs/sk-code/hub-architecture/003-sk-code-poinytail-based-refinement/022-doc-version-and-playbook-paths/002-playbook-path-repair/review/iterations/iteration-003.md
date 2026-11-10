# Iteration 003 -- Traceability (ledger rows PP-01..PP-28, PP-V; non-cli path identity)

Run 1, iteration 3 of 5. Dimension: traceability. Target: the playbook path repair commits `41302e72be..HEAD` on `worktrees/118-playbook-paths` -- `82c90e85b7` (validator and report), `f30918f94b`, `3be9030128`, `cd34e1fbbe` (playbook repairs); 234 files = 223 manual-testing-playbook docs + validator and test + the sk-doc bump surfaces. This iteration maps each of the spec's 29 ledger rows (PP-01..PP-28, PP-V) to the actual changes, verifies that each rewritten path in the non-cli playbook files names the right file, and checks every removed row or cited module for a residual dependency. The seven cli-external-orchestration packages were covered in iteration 2 and are not re-entered; their outcomes are cited as evidence only.

## Dimension

Traceability: ledger row to change; rewritten path to target identity; removed reference to successor or written reason. Core protocols: `spec_code`, `checklist_evidence`. Overlay: `skill_agent` (swept in iteration 1, not re-entered), `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (non-cli side).

## Files Reviewed

- `spec.md:119` (Path Ledger table PP-01..PP-V), `goal.md:58`-`:62` (completion criteria)
- `.../002-playbook-path-repair/implementation-summary.md` (scaffold: 0 of 29 ledger rows recorded, no Remaining table)
- sk-code Webflow rows: `motion-api-smoke.md:99`, `:100`; `prefers-reduced-motion.md:84`; plus `cross-browser-animate.md`, `cwv-gates.md`, `gpu-compositing.md`, `animation-regression-baseline.md`, `cdn-bundle-version-pin.md`
- `.skilled/skills/cli-classifier/cli-jev/manual-testing-playbook/providers/auth-status-reports-key-state.md:61`
- cli-orca (8): `hub-deferral-receipt.md:82`, `embedded-browser-boundary.md:79`, `official-skill-handoff.md:81`, `negative-holdouts.md:79`, `orca-positive-route.md:77`, `ambiguous-send-recovery.md:82`, `preflight-executable-resolution.md:81`, `runtime-stopped-recovery.md:83`
- mcp-tooling: `mcp-click-up/.../install.md:29`, `mcp-figma/.../safe-connect.md:43`; mcp-obsidian `delete-throwaway-note.md`, `health-md-data.md`, `manage-tags.md:23`, `read-write-roundtrip.md:23`, `iconic-rules.md:25`
- sk-code: `sk-code-obsidian/.../stack-standards-routing.md`, `routing-disambiguation/mixed-marker-ambiguity.md`, `surface-detection/obsidian-detection.md`, `surface-detection/webflow-detection.md`
- sk-design-diagram (7): `diagram-generation/type-selection-and-routing.md`, `import-export/export-guidance.md`, `command-and-hub-integration/design-diagram-command.md` and the remaining `docs/` rewrites
- sk-git (9): `doctor-commands/doctor-git-standards-copy-once.md:47`, `...change-rule.md`, `...refuse-invalid.md`, `git-preflight-advisory/advisory-fires-on-silent-scope-drop.md`, `owner-first-worktree-tooling/reaper-keeps-non-qualifying-worktrees.md:48` and the other four worktree-tooling rows
- sk-vision (19): `host-adapters/opencode-plugin.md`, `opencode-vision-command.md`, `pi-extension.md`, `pi-vision-command.md`, `guaranteed-vision/auto-inspect-guarantee.md`, `devin-note.md` and the `hooks/pi/sk-vision.ts` rewrites; `.opencode/plugins/sk-vision.js` (tracked symlink to `../skills/sk-vision/vision-runtime/dist/plugin.js`)
- sk-doc: `sk-create-goal/.../detect-unbound-phase.md`, `.../phase-parent-and-nested-child-goals.md`; `sk-create-command/.../repeatable-slash-command.md:52`; `sk-create-benchmark/.../author-behavior-package.md`; the two `sk-create-changelog` route files
- system-spec-kit (15): `doctor-update-align.md:47`, `:50`, `doctor-update-compat.md`, `doctor-update-test-environment.md`, `feature-flag-governance.md:38`, `:51`, `core-workflow-infrastructure.md:59`, `shared-frontmatter-value-list.md:15`, the three `ux-hooks/comment-hygiene-*.md` files, `spec-folder-literal-naming-remediation-rule.md`
- system-deep-loop: `deep-ai-council/.../council-graph-query-five-modes-prompt-safe-context.md:70`, `.../council-graph-upsert-idempotency-and-self-loop-rejection.md`, `.../council-graph-derived-projection-rebuilds-from-artifacts.md`, `.../decision-provenance-audit-graph-vs-baseline.md`, `.../advisor-routes-council-prompts-to-skill.md`; `runtime/.../append-mode-event-script.md`
- PP-V surfaces: `validate-playbook-package.cjs` and `tests/validate-playbook-package.test.cjs`; sk-doc `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `changelog/v2.3.7.0.md`; `.hermes/skills/sk-doc/SKILL.md`; both compiled sk-doc `manifest.json` copies
- residual warning: `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:14`

## Findings by Severity

### P0

None.

### P1

None new. R1-P1-001 (carried, active): the fleet validator at HEAD prints exactly one `BACKTICK_PATH_UNRESOLVED` -- `.cursor/worktrees.json` at `worktree-dry-run-inspection.md:14` -- while `implementation-summary.md` holds 0 Remaining rows and 0 of 29 ledger rows, so REQ-001's "0 or exactly the Remaining rows" clause, SC-002 and goal criteria 1-2 are unmet at HEAD. The row mapping below confirms this is the only outcome gap: every other package prints 0.

### P2

#### R3-P2-001 -- The a_nobel_en_zn rewrites mark the target "(not in this repo)" while three rows still describe it as "In-repo"

The a_nobel_en_zn repair rewrote the Webflow table targets to `nav_dropdown.js` under `2_javascript/navigation/` in the external Webflow project `a_nobel_en_zn` (not in this repo) -- the D2 external-project rewrite. Three of those rows keep a rationale cell that points the other way: `motion-api-smoke.md:99` ("In-repo pinned ESM import pattern"), `motion-api-smoke.md:100` ("In-repo window.Motion runtime availability pattern"), `prefers-reduced-motion.md:84` ("In-repo reduced-motion media query and slider behavior"). At `41302e72be` the same rows paired the `../../../../../a_nobel_en_zn/...` target with the same `In-repo` rationale, so the repair corrected the target cell and added "(not in this repo)" but left the contradicting rationale inside the rows it edited. (SOURCE: .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/motion-api-smoke.md:99)

- claim: the a_nobel_en_zn repair left three table rows internally contradictory -- the target is declared external "(not in this repo)" while the row's rationale says "In-repo".
- evidenceRefs: `motion-api-smoke.md:99`, `:100`; `prefers-reduced-motion.md:84`; pre-state `git show 41302e72be:...motion-api-smoke.md` (lines 99-100 carry the same `In-repo` text); repository-wide `grep -rn In-repo` over the sk-code playbook returns only these three current lines.
- counterevidenceSought: checked every other a_nobel_en_zn row (cross-browser, cwv-gates, gpu-compositing, animation-regression-baseline, cdn-bundle-version-pin, plus the rest of motion-api-smoke) for the same phrase -- no other occurrence; checked whether "In-repo" is a column header -- it is row-scoped rationale text.
- alternativeExplanation: "In-repo" may mean "inside the external Webflow project" (the repo under test), which would make the row consistent under a different scope reading.
- finalSeverity: P2
- confidence: 0.65
- downgradeTrigger: the three rationale cells are aligned to the external-project scope, or the wording is clarified to name which repo "In-repo" means.

## Answers to the Iteration Questions

1. **Does every ledger row trace to an actual change?** Yes, all 29. Each of PP-01..PP-28 maps to >=1 changed file under its package path: counts PP-01=1; PP-02..PP-08=16/21/18/19/15/19/19 (127 files, iteration 2's ground); PP-09=8; PP-10..12=1/1/5; PP-13..16=11/2/1/1; PP-17=7; PP-18..21=1/2/1/2; PP-22=9; PP-23=19; PP-24..27=1/5/2/1; PP-28=15. PP-V maps to `82c90e85b7`: validator + test changed, sk-doc bumped once (2.3.6.0 -> 2.3.7.0 across `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json`), `changelog/v2.3.7.0.md` added and documenting the symlink and installed-tree rules, the `.hermes` mirror carrying the same bump, and both compiled sk-doc manifests carrying the same new `effectivePolicyHash`. All four commits carry the packet's `Spec:` trailer -- verified with `git log --format='%(trailers:key=Spec)'`. The accounting closes: 223 playbook + 2 validator + 6 sk-doc meta + 3 mirror/manifest = 234 files, and no playbook file in the diff sits outside a ledger package.
2. **Does each rewritten path name the right file?** Yes for the bulk, class by class: external-project rewrites keep the file names and explicitly mark "(not in this repo)" (R3-P2-001 is their only residue); vault/sandbox rewrites (`Daily/`, `.obsidian/plugins/`, `src/`, `docs/`, `.claude/`) keep the artifact name and demote the location to prose; placeholder patterns became marked text (`002-beta` child goal, `v<version>.md`, `<spec-folder>`, `$FIXTURE`, `$HOME`). Real repo-path corrections resolve via `git ls-files` and keep identity: `references/standards/platform-support.md`, `hooks/pi/sk-vision.ts`, `.opencode/plugins/sk-vision.js` (a tracked symlink to an unbuilt plugin build -- the exact class the PP-V symlink rule legalizes), `.skilled/commands/doctor/*`, both sk-code-webflow changelog files, `lib/council/council-graph-query.ts` (exists under `system-deep-loop/runtime/lib/`), the top-level `frontmatter-values.json` path, `.skilled/bin/tests/worktree-*.test.sh`, and the three cli-orca catalog retargets whose new targets all exist while the old `terminal-receipts-and-liveness` name exists nowhere in the repo.
3. **Any removed row or cited module the scenario still depends on?** No. The three comment-hygiene table rows removed reference `.../z_archive/119-comment-ref-hygiene/...` which `git ls-files` finds nowhere; residual greps in the three files return zero. `runtime/cli/core/memory-indexer.ts` was dropped from an inspection list and exists nowhere outside spec history (the scenario's own text marks the memory engine decommissioned); `assets/index.html` and `schemas/tool-input-schemas.ts` were rewritten to prose with no residual occurrence. One non-removal worth recording: `doctor-update-align.md` did not drop its second changelog file -- it expanded both `changelog/v1.0.0.0.md` and `changelog/v1.1.0.0.md` to full paths, and both exist.

## Traceability Checks

- **Row-to-change map**: every ledger row has package-local changes; no changed playbook file lacks a row; the four commit trailers and the sk-doc changelog connect PP-V to its surfaces.
- **Removed-reference sweep** (question 3 above): D1-compliant removals only; no successor exists for any removed target; no residual citations.
- **Non-cli resolution**: each added/removed path-like token was classified either as a repo target that resolves via `git ls-files` (direct path or unique basename) or as an explicit external/placeholder class; no repo-intended token fails to resolve. The only `test -e` failure among repair targets (`.opencode/plugins/sk-vision.js`) is the tracked symlink above, not a wrong target.
- **Cross-runtime**: the only non-`.skilled` sk-doc surface is `.hermes/skills/sk-doc/SKILL.md`; it carries the same 2.3.7.0 bump and no stale 2.3.6.0 copy exists under `.hermes`/`.opencode`/`.claude`/`.codex`/`.cursor`/`.pi`. Both compiled sk-doc manifests (source mirror under `specs/sk-doc/z_archive` and repo copy under `.skilled/bin`) carry the same new hash -- no compiled/source divergence.
- **Feature catalogs**: no stale `tool-input-schemas`, `memory-indexer` or `search-flags` references remain in the deep-ai-council and system-spec-kit feature-catalog trees.
- **Recording gap (carried)**: `implementation-summary.md` is still scaffold text; the ledger's Fixed/Closed side and the Remaining table cannot be traced at HEAD. Same root as R1-P1-001; not re-raised as a new finding.

## Proof Runs

- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict` at HEAD: rc=0; `BACKTICK_PATH_UNRESOLVED` count = 1 (the known cli-cursor `.cursor/worktrees.json`); all 21 non-cli ledger packages and the other six cli packages print 0.
- `git diff --name-only 41302e72be..HEAD` per ledger package: the counts above; total 234 files.
- `git ls-files` basename resolution over the non-cli token set; `grep` residual checks over the edited files.

## Next Dimension

Maintainability (iteration 4 of 5). Remaining dimensions after this iteration: security, maintainability.

## Verdict

One active P1 (R1-P1-001, carried) and one new P2 (R3-P2-001); no P0. Under the mapping rule the next state is CONDITIONAL.

Review verdict: CONDITIONAL
