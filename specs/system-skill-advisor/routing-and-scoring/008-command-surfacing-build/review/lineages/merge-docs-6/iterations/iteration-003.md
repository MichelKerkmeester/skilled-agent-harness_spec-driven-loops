# Review Iteration 003

## Dispatcher

- Lineage: `merge-docs-6`, area `merge-docs`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: maintainability. The pass-six operator focus is the merge-docs area: this branch's net change to the twelve files a merge with main resolved, checking that nothing main added was lost and that each documentation claim is true of the code. This iteration checks the durable shape the merge left behind: whether a maintainer can find the authoritative copy, whether references resolve, and whether the changed files invite the same drift again.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/changelog/skilled/v4.0.2.1.md` | 38-60, 97-125, 470-495 | Whether the release-level index can be kept current and whether its sections overlap |
| `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md` | 1-32 | Whether the entry can be found from the release note and whether it duplicates its own version |
| `.skilled/agents/markdown.md` | 190-300 | Every command-table and related-resource path resolves |
| `README.md` | 676-686, 1234-1242, 1718-1726 | Whether the advisor paragraph duplicates the release note's copy |
| `CONTRIBUTING.md` | 190-200 | The renamed command is the only copy of that row |
| `.vibe/agents/markdown.toml` | 1 | The generated boundary is stated and the payload matches the source |
| `.github/workflows/spec-kit-check.yml` | 1-80, 315-374 | The duplicated path block and whether the two copies agree |
| `.skilled/commands/doctor/scripts/README.markdown` | 99-115, 232-240 | Whether the rows duplicate script usage text or add durable behavior |
| `.skilled/hooks/shared/session-readers/README.md` | 20-55 | Whether the contract bullets and the per-runtime notes can drift apart |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | 1 | The generated boundary is implicit but single-sourced |
| `.skilled/skills/system-spec-kit/SKILL.md` | 1-6 | The version is the only version statement outside the changelog |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 68-80 | The alias list duplicates the resolver's legacy list by design |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Every path named by the changed doc lines resolves; no new doc-vs-code gap was found. |
| `checklist_evidence` | notApplicable | No checklist row names this merge-docs area. |
| `skill_agent` | pass | The markdown agent's related-resource table resolves to 13 existing entry files. |
| `agent_cross_runtime` | pass | `.vibe/agents/markdown.toml:1` is a generated boundary and its payload matches the canonical body. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched. |
| `playbook_capability` | notApplicable | No playbook claim is touched. |

## Integration Evidence

- `.skilled/agents/markdown.md:197,290` name `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`; that file exists and its frontmatter is `name: sk-create-skill`, `version: 1.16.0.0`.
- The related-resource table at `.skilled/agents/markdown.md:286-300` names thirteen `SKILL.md` entry files; a filesystem check found every one present.
- `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md:18` names `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`, which exists and is this review target.
- `.vibe/agents/markdown.toml:1` carries the generated-by header; the payload's 275 lines equal the canonical `.skilled/agents/markdown.md` body line for line.
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75` repeats the `MK_` alias set that `.skilled/hooks/shared/hook-flags.cjs:41,73-75` defines; the duplication is the documented compatibility surface, not a competing source.
- `.github/workflows/spec-kit-check.yml` repeats the same path block under `push` and `pull_request`; the two copies agree line for line, so the merge did not leave one side stale.
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1` is a one-line generated record; the resolver test in iteration 2 proved it tracks the live policy.

## Edge Cases

- The release-level index at `.skilled/changelog/skilled/v4.0.2.1.md:480` is a hand-maintained run-on list of every skill's changelog range. That form is what let the `system-spec-kit` range fall one version behind (finding MD6-P2-001); this iteration records the structural reason but does not file a second finding for the same defect.
- The README's advisor paragraph and the release note's Skill Advisor section both describe hook health, and the README omits the OpenCode exception (finding MD6-P2-002). The duplication is intentional (release note and durable README), so the fix belongs in the README copy, not in removing either paragraph.
- The `.vibe/agents/markdown.toml` file is a generated mirror, but its generated boundary is only in its first line; a hand edit would be overwritten by the next sync. The sync check in `spec-kit-check.yml` and `command-tree-parity.yml` is the guard.
- The `.github/workflows/spec-kit-check.yml` path block is duplicated by workflow design; a future maintainer must edit both copies. Both copies currently agree, and the comment names the sibling workflow that covers the Vibe-only case.

## Confirmed-Clean Surfaces

- **Reference integrity:** every path named by the changed lines in `.skilled/agents/markdown.md` resolves, including the thirteen entry files and the renamed command.
- **Generated boundaries:** the Vibe agent mirror states it is generated and matches its source; the sk-doc manifest is proven live by the resolver; the changelog index is the only hand-maintained catalog and its one drift is already recorded.
- **Duplicate workflow block:** the push and pull-request path blocks in `spec-kit-check.yml` agree.
- **Version statements:** `SKILL.md:5` and `changelog/v2.13.4.0.md:11` agree at `2.13.4.0`; only the release-level range is behind, which is the recorded finding.
- **Rename consistency:** the new spelling is used in the agent, README, CONTRIBUTING and Vibe mirror; the old spelling appears only in historical changelog prose and in the documented advisor input mapping.

## Ruled Out

- **A broken path in the changed agent tables:** all thirteen entry files and the renamed command exist.
- **A contradictory version inside system-spec-kit:** `SKILL.md` and the new changelog agree at `2.13.4.0`.
- **A stale half of the duplicated workflow path block:** the push and pull-request copies are identical.
- **A hidden second source for the Vibe agent body:** the generated payload equals the canonical body exactly.
- **A new maintainability defect in the doctor README rows:** each added sentence describes behavior the script exposes and does not restate an internal constant.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis only
- Reason: all four dimensions have at least one full iteration; no new finding remains
- Rotation status: maintainability complete; all dimensions swept
- Required evidence: none

Review verdict: PASS
