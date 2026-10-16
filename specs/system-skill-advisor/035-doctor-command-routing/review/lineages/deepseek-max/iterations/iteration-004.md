# Review Iteration 4, Cross-Repo References and the Root README

Mode: review | Dimension: traceability (cross-repo reference integrity) + maintainability (authoring standards)
Iteration: 4 of 5 | Target: v4.0.0.12 release, cross-repo group (steer.md scope group 4)

## Dimension

Whether every place the release touched or that lists the doctor surface names `/doctor:setup` and
the doctor routing correctly, whether each cited path and invocation exists and behaves as the
document says, and whether the counts those documents assert match the tree.

## Files Reviewed

- `README.md` — DOCTOR section (lines 1230-1285) plus earlier doctor references (205, 547-551)
- `.skilled/commands/README.txt` — group summary table and Doctor Commands table
- `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:828` (category pointer)
- `.skilled/skills/system-spec-kit/SKILL.md` (read for doctor mentions; only a version bump shipped)
- `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` (the
  fleet-wide DOC-number registry the sibling doctor READMEs point at)
- `.skilled/skills/{sk-git,mcp-code-mode,system-deep-loop,sk-code}/manual-testing-playbook/doctor-commands/README.md`
  (read as the referrers to that registry)
- `.skilled/commands/doctor/assets/` inventory (24 YAML files) as the count denominator

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The fleet-wide DOC-number registry omits the new DOC-385..DOC-391 scenarios and `/doctor:setup`** -- .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26 -- Description: this README is the registry four sibling doctor READMEs point at for the shared DOC numbering series, and its "other doctor commands are tested in the playbook of the skill they check" sentence still maps only the pre-release ranges: `/doctor:skill-advisor` in system-skill-advisor (DOC-348 and DOC-362 to DOC-367) with no mention of `/doctor:setup`, and no entry for DOC-385 to DOC-391 although the advisor playbook now ships all seven. The release updated the peer registry in the same skill (`feature-catalog/doctor-commands/category-overview.md` now says `/doctor:skill-advisor` and `/doctor:setup` are tested there) but not this playbook registry.
   - Case: a maintainer allocating the next doctor scenario number opens this registry as the sibling READMEs instruct ("The system-spec-kit `doctor-commands/README.md` lists the retired ranges"), sees DOC-382/383 as the highest sk-code range and no 385..391, and reuses 385 for a new scenario, colliding with the shipped `doctor-routing-setup-onboarding.md`; an agent looking for the `/doctor:setup` scenarios finds no pointer from the doctor command surface registry and must guess that they live in the advisor playbook.
   - File: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26
   - Evidence: `grep -c "DOC-385|...|DOC-391|doctor:setup"` on the file returns 0 while the advisor playbook ships 7 files carrying those IDs; four sibling READMEs (sk-git, mcp-code-mode, system-deep-loop, sk-code) name this file as the registry (evidence: `evidence/iter-004-doc-registry.txt`). The earlier release that added DOC-382/383 did update this map — both ranges are listed — so the miss is this release's omission, not a convention change.
   - User impact: the shared number space the convention describes is no longer fully recorded, so the very collision the convention prevents becomes possible at the next allocation; readers of the doctor command surface lose the pointer to the `/doctor:setup` scenarios.
   - Finding class: instance-only
   - Scope proof: `rg -n "DOC-38[5-9]|DOC-39[01]" .skilled/skills/*/manual-testing-playbook/doctor-commands/README.md` shows no registry entry anywhere; the only occurrences are the seven advisor scenario files themselves and the advisor root playbook section that lists them.
   - Affected surface hints: ["system-spec-kit doctor-commands README", "advisor playbook DOC range", "feature-catalog category-overview peer map"]
   - riskScore: 2 (advisory only)
   - Recommendation: add `/doctor:setup` to the system-skill-advisor entry and extend it to "DOC-385 to DOC-391", the way DOC-382/383 were added, so the registry stays the single number source the sibling READMEs describe.

## Confirmed-Clean Surfaces

- **Root README names the command where a user looks.** The DOCTOR section lists `/doctor:setup`
  first, describes its five legs, its three-valued leg output, the write-nothing contract, and
  the advisor hint [SOURCE: README.md:1233-1235]; the section's count moved 9 -> 10 commands and
  7 -> 8 manifest-routed commands, and both numbers reconcile with the tree (10 command files in
  `.skilled/commands/doctor/`, 7 commands with `routes:` entries plus `/doctor:mcp` tracked under
  `mcp_subroutes`).
- **`.skilled/commands/README.txt` is coherent.** Group summary says 10 command files, the
  Doctor Commands table gained the Setup row first, and the table's invocation strings match the
  routers' argument hints; the catalog mirror check independently confirms
  `commands/README.txt 39/39 listed`.
- **`category-overview.md` names the new command in all three places that matter.** The overview
  sentence, the how-it-works paragraph (five read-only legs, one repair per failing check) and
  the source map row for `.skilled/commands/doctor/setup.md`
  [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17,25,43];
  the playbook-ownership sentence now routes `/doctor:setup` to the advisor playbook where the
  scenarios actually live.
- **`system-spec-kit/SKILL.md` needed no doctor edit.** The release shipped only the version
  bump; the file contains no doctor command mentions, so there is no list there to update
  (`rg -i doctor` returns nothing).
- **Referenced paths resolve.** `.skilled/commands/doctor/setup.md`, its YAML and presentation
  assets, the `_routes.yaml` manifest, and every scenario path the root playbook tables link
  exist on disk; `route-validate.sh` and the catalog mirror check pass (iterations 1-2).

## Traceability Checks

- `spec_code`: no change from iterations 1-3; REQ-016's "root README lists `/doctor:setup`" and
  "spec-kit doctor catalog" claims hold for the two skills the requirement names.
- `checklist_evidence`: partial; `tasks.md` evidence rows are read in iteration 5.
- `agent_cross_runtime`, `skill_agent`, `feature_catalog_code`, `playbook_capability`: unchanged
  from their iteration 2/3 states.

## Edge Cases / Observations

- **Advisory, pre-existing: root README workflow count stale.** README.md:1283 says "The 21
  underlying YAML workflows in `.skilled/commands/doctor/assets/`"; the directory holds 24 YAML
  files (23 before this release, 18 with a `workflow:` key, 16 phase-structured), so no counting
  rule yields 21. The line predates the release and was not touched; the release added
  `doctor-setup.yaml` without updating it. Recorded as README debt in the reviewed section, not a
  release finding.
- **Pre-existing sibling-map wording.** The sk-code doctor README lists the whole numbering
  community while the system-spec-kit registry sentence stops at mcp-code-mode; both predate this
  release and do not affect the finding above.
- **MCP numbering hole.** The advisor ranges start at DOC-385 while DOC-379 to DOC-384 belong to
  other skills; the gap is consistent with the shared-series convention and the retired-ID notes
  in the registry.

## Ruled Out

- **"The root README lists a doctor command that does not exist."** Ruled out: all ten listed
  commands resolve to files in `.skilled/commands/doctor/`, and the ten bold entries match the
  ten command files.
- **"`/doctor:setup` is missing from a doctor command table that should list it."** Ruled out for
  the declared scope: root README, `commands/README.txt`, and the spec-kit category overview all
  carry it; the remaining doctor tables are scoped to their own command per their overviews.
- **"The category overview points `/doctor:setup` scenarios at the wrong playbook."** Ruled out:
  the seven DOC-385..391 scenarios live in the system-skill-advisor playbook, which is the file
  the overview names.

## Next Dimension

Iteration 5: changelogs plus a final cross-check. Scope group 5 of steer.md:
`.skilled/skills/system-skill-advisor/changelog/v0.16.0.0.md`,
`.skilled/skills/system-spec-kit/changelog/v2.8.0.0.md`,
`.skilled/changelog/skilled/v4.0.0.12.md`, plus re-verification of every carried finding
(R2-P2-001, R4-P2-001) and the `tasks.md`/`implementation-summary.md` evidence trail.

Review verdict: PASS
