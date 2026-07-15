# Deep Review Iteration 002

## Dispatcher

- target_agent: deep-review
- mode: review
- agent_definition_loaded: true
- resolved_route: `/deep:review:auto` -> `.opencode/skills/sk-doc/create-changelog/` (skill)
- lifecycle: continuation, iteration 2 of 4
- focus: correctness -- global-versus-nested mode detection, component/version rules, and release-option boundaries
- budgetProfile: verify
- status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-changelog/SKILL.md`
- `.opencode/skills/sk-doc/create-changelog/references/version_bump_rules.md`
- `.opencode/skills/sk-doc/create-changelog/references/topology_edge_cases.md`
- Integration context: `.opencode/commands/create/assets/create_changelog_auto.yaml`, `.opencode/commands/create/assets/create_changelog_presentation.txt`, `.opencode/commands/create/changelog.md`, `.opencode/skills/sk-doc/shared/assets/changelog_template.md`, `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Findings - Carried Forward

- P2-001: Packet-local worked example is not shaped like the canonical nested templates. No correctness escalation in this iteration because the primary `SKILL.md` write path correctly uses the nested generator and templates.

## Traceability Checks

- Correctness of output-mode detection: `SKILL.md` requires `--nested`, phase-child/direct-child-phase/existing-`changelog/` detection before falling back to global mode [SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:292`; SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:296`]. The auto YAML source has the same branch [SOURCE: `.opencode/commands/create/assets/create_changelog_auto.yaml:371`; SOURCE: `.opencode/commands/create/assets/create_changelog_auto.yaml:374`].
- Correctness of version separation: `SKILL.md` says nested changelogs do not use global folders or four-part versioning [SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:114`; SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:129`], and the version reference repeats that packet-local changelogs are never versioned this way [SOURCE: `.opencode/skills/sk-doc/create-changelog/references/version_bump_rules.md:23`; SOURCE: `.opencode/skills/sk-doc/create-changelog/references/version_bump_rules.md:57`].
- Correctness of component fallback: `SKILL.md` deliberately rejects the stale `00--` fallback and requires asking rather than guessing [SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:312`; SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:319`]. This correctly overrides stale auto YAML fallback text that still says to default to `00--` [SOURCE: `.opencode/commands/create/assets/create_changelog_auto.yaml:193`; SOURCE: `.opencode/commands/create/assets/create_changelog_auto.yaml:207`].
- Correctness of release boundaries: `SKILL.md` prepares release-note body only and forbids inventing GitHub mechanics when no Git workflow supplies them [SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:385`; SOURCE: `.opencode/skills/sk-doc/create-changelog/SKILL.md:391`]. The topology edge-case reference records unknown tag/`gh release create` details instead of fabricating commands [SOURCE: `.opencode/skills/sk-doc/create-changelog/references/topology_edge_cases.md:76`; SOURCE: `.opencode/skills/sk-doc/create-changelog/references/topology_edge_cases.md:83`].

## Integration Evidence

- Fresh validator run returned 0 issues for `SKILL.md` with `--type skill`, `README.md` with `--type readme`, and all reference files with `--type reference`.
- `nested-changelog.js --help` exposes `--json`, `--write`, `--mode`, and `--output`, confirming the `SKILL.md` step-2/step-6 generator flags are real.
- `.opencode/commands/create/changelog.md:21` through `.opencode/commands/create/changelog.md:28` confirms the router loads presentation and the selected YAML, while `.opencode/commands/create/assets/create_changelog_presentation.txt:70` through `.opencode/commands/create/assets/create_changelog_presentation.txt:78` confirms setup fields used by the SKILL contract.

## Edge Cases

- The source auto YAML still contains stale `NN--component-name`, `00--` fallback, H1/version-date, and H3/Problem-Fix format checks. `SKILL.md` explicitly records these as stale source inconsistencies and gives the correct shared-template behavior, so this iteration treated them as corrected source drift rather than a target correctness finding.
- `README.md` and `references/` were not reread in full during this iteration because iteration 001 already validated path/route-map coverage; this iteration focused on behavior-level correctness and reran validators.
- The reducer-owned findings registry still shows initialization counts only; this LEAF contract treats it as read-only and did not update it.

## Confirmed-Clean Surfaces

- No active correctness defect found in the primary seven-step workflow: source context, target resolution, versioning, content generation, validation, write, and report steps are present and ordered.
- No fabricated nested-generator flags found; runtime help confirms the documented flags.
- No release-mechanics fabrication found in the target packet; unknowns are explicitly marked and publishing is bounded by external Git workflow support.
- No new P0/P1/P2 correctness findings were found.

## Ruled Out

- Ruled out P1 for stale YAML conflicts because `SKILL.md` explicitly overrides those stale source snippets and tells users to follow the shared template rather than the old YAML checks.
- Ruled out versioning bleed into nested mode because both `SKILL.md` and `version_bump_rules.md` state nested changelogs skip global versioning.
- Ruled out missing setup-field support for `--release`, `--nested`, and `--bump`; router/presentation surfaces expose those fields or flags.

## Next Focus

- dimension: security
- focus area: unsafe write/overwrite boundaries, command/tool execution claims, and release-publishing guardrails
- reason: correctness is clean; next iteration should audit whether the documentation prevents destructive writes or unauthorized release actions
- rotation status: traceability and correctness completed; security pending
- blocked/productive carry-forward: productive -- targeted SKILL/YAML/template comparison continues to surface source drift clearly
- required evidence: SKILL rules around overwrite prevention, release escalation, target-folder creation, command allowed-tools, and any shell examples that could cause unsafe behavior
