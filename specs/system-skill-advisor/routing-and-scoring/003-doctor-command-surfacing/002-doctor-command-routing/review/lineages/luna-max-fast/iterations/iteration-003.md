# Iteration 3 — Skill documentation and traceability

## Review summary

Reviewed DOC-385–DOC-391 and their playbook index, the doctor-routing feature-catalog leaf and root, the Claude/OpenCode hook catalog leaves, the shared hook reference, Pi README, advisor README and SKILL. Cross-checked authoring requirements against the `sk-create-manual-testing-playbook` and `sk-create-feature-catalog` contracts, and checked the setup scenario's read-only claim against the advisor CLI and lease implementation.

The seven scenario documents and the sampled catalog, hook and skill documents pass their single-file structural validators. The feature-catalog package validator reports `clean: true` with zero violations. The playbook package validator returns exit 0 but classifies the entire 61-file package as routing-gold exclusions (`operatorScenarioFiles: 0`); it therefore does not validate these documents under the operator-scenario contract. It also reports the root's missing result-persistence marker as an advisory warning. No tests, builds or runtime probes were run.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **P2-004 — Doctor-routing scenarios omit their required feature-catalog backlink**
   - Location: `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:94` (same omission in DOC-386 through DOC-391).
   - Finding class: `documentation-traceability`.
   - Scope proof: The playbook authoring contract requires scenarios to link to the matching catalog entry when a catalog exists (`sk-create-manual-testing-playbook/SKILL.md:506`). The matching `scorer-fusion/doctor-command-routing.md` exists and links back to DOC-385–DOC-391, but each scenario's Source Files section links only to the root playbook and implementation files.
   - Case: An operator opening DOC-385 directly cannot follow the scenario to the feature contract that explains the routing behavior and its test anchors; they must leave the scenario and search the catalog index manually. This loses the required two-way traceability across all seven scenarios.
   - Recommendation: Add a link to `../../../../feature-catalog/scorer-fusion/doctor-command-routing.md` in each scenario's source references.

2. **P2-005 — DOC-391 calls the setup run write-free while its advisor leg writes daemon state**
   - Location: `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:16` and command at `:56`.
   - Finding class: `side-effect-accuracy`.
   - Scope proof: DOC-391 says “The run writes nothing” and treats an empty `git status` diff as proof. Its direct advisor leg uses `--warm-only`. The CLI contract says that option starts or attaches to the daemon (`references/runtime/cli-front-door-contract.md:33`); daemon startup acquires a writable lease database (`runtime/lib/daemon/lease.ts:156-175`) and inserts and heartbeats a lease row (`:317-348`, `:363-370`). The database directory ignores `*.sqlite` (`runtime/database/.gitignore:2`).
   - Case: In a fresh workspace with no running advisor daemon, running `/doctor:setup` starts the advisor and creates/updates its package-local lease database. The ignored database and running process are outside the scenario's `git status` assertion, so the scenario can pass while it has changed persistent runtime state.
   - Recommendation: Describe and verify the daemon/database side effect, or require a pre-warmed isolated advisor instance and define cleanup so the scenario's read-only guarantee is accurate.

3. **P2-006 — The feature catalog lists an OpenCode hook capability without a feature page**
   - Location: `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:126`.
   - Finding class: `catalog-leaf-coverage`.
   - Scope proof: The row names “OpenCode native SessionStart/UserPromptSubmit hooks with prompt-wrapper fallback” but says “No feature file yet.” The catalog authoring contract requires one per-feature reference file for each root-catalog entry (`sk-create-feature-catalog/SKILL.md:12`), and describes those leaves as the place for current behavior, implementation anchors and tests (`:14`).
   - Case: A reader following the current feature inventory to this OpenCode capability has no page to inspect its behavior, source files or validation anchors. The package validator passes because it checks linked leaves and source paths, not an explicitly unlinked root entry.
   - Recommendation: Add the missing feature page, or merge/remove the row if it is not a distinct shipped capability.

## Validation and scope notes

- `validate_document.py --type playbook_feature --json`: DOC-385–DOC-391 all valid, zero issues. The root playbook also validates with zero issues.
- `validate_document.py --type feature_catalog --json`: feature-catalog root and doctor-routing leaf valid, zero issues. The package validator reports zero violations.
- The shared hook reference, Pi README, advisor README and advisor SKILL all validate with zero issues.
- The playbook package validator's exit 0 is not evidence that the operator-scenario contract passed: its manifest explicitly excludes the whole advisor playbook tree as routing gold.
- No review target was modified. The worktree-wide application checks and runtime scenarios remain unrun by instruction.

## Sources

- `specs/system-skill-advisor/035-doctor-command-routing/review/lineages/luna-max-fast/steer.md`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:16`, `:293-310`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:22-31`, `:92-108`; corresponding DOC-386–DOC-391 scenarios
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:33-72`
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:20`, `:120-128`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:501-509`
- `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md:12-16`
- `.skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:28-34`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/lifecycle.ts:40-48`, `runtime/lib/daemon/lease.ts:156-175`, `:312-370`, `runtime/database/.gitignore:2`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39-57`, `hooks/pi/README.md:20-26`, `README.md:82-90`, `SKILL.md:290-301`

Review verdict: CONDITIONAL
