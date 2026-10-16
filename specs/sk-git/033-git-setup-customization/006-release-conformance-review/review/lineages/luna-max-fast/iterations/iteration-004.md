# Iteration 004 — Cross-Repository References

**Timestamp:** 2026-10-16T05:17:48Z  
**Focus:** Cross-repo setup references, feature catalog structure, and documentation conformance  
**Dimensions:** correctness, maintainability, traceability

## Dimension

This pass checked that repository command listings name the setup target consistently, that the root README points users to it, and that the supporting catalog and hook documentation match the command and authoring contracts.

## Files Reviewed

- .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md
- .skilled/skills/sk-git/feature-catalog/feature-catalog.md
- .skilled/skills/sk-git/scripts/hooks/README.md
- README.md
- .skilled/commands/README.txt
- .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md
- .hermes/skills/sk-git/SKILL.md
- specs/sk-git/033-git-setup-customization/006-release-conformance-review/review/lineages/luna-max-fast/steer.md

## Scope and Sources

Read the lead steer, the eight manifest targets, and the applicable README, feature-catalog, skill, and Human Voice Rules authoring contracts. Searched repository-wide doctor command listings and setup-target references. Ran the catalog package validator, applicable document-structure checks, readme reference checks, and HVR scans in read-only mode.

The catalog package validator passed with zero violations. The feature catalog structure check returned a warning for a missing section number. Root README and the system doctor category and playbook structures passed their applicable checks. The HVR scans found the blockers below. Readme reference checks reported unresolved paths across seven files, and the hooks code-folder check reported 18 unresolved inline paths. Manual inspection found the checker treating slash commands and repository-root examples as local paths, so those path reports were inconclusive; no broken setup reference was confirmed from them.

Repository-wide search found the setup target named consistently in the root README, command index, system doctor category overview, system playbook README, feature catalog, sk-git skill documentation, and Hermes mirror. The Hermes mirror carries the skill-summary defects already recorded in iteration 3, so they are not duplicated here.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The setup documentation omits the status counters emitted by the command** — README.md:1507

   The root README and the feature-catalog leaf at .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:29 describe the final line as a bare STATUS value. The renderer in .skilled/commands/doctor/scripts/git-setup-check.cjs:1007, 1009, and 1011 appends counters, including checks=11 or degraded, failed, skipped, and unknown counts. The stated exact output contract therefore differs from the command output. Document the counters or change the renderer to match the contract.

2. **The feature catalog skips section 3** — .skilled/skills/sk-git/feature-catalog/feature-catalog.md:105

   The headings move from section 2 at line 25 to section 4 at line 105. The document validator reports non_sequential_numbering, expected section 3 and found 4. Restore the missing section or renumber the remaining headings and update the overview.

3. **The feature catalog fails the Human Voice Rules punctuation scan** — .skilled/skills/sk-git/feature-catalog/feature-catalog.md:31

   The HVR scan exits 1 with 12 hard punctuation blockers and 61 mechanical deductions across 233 lines. Its mechanical ceiling is 39. Revise authored prose to remove prohibited punctuation and rerun the scan.

4. **The hooks README fails the Human Voice Rules punctuation scan** — .skilled/skills/sk-git/scripts/hooks/README.md:31

   The HVR scan exits 1 with 32 hard punctuation blockers and 161 mechanical deductions across 219 lines. Its mechanical ceiling is 0. Revise authored prose to remove prohibited punctuation and rerun the scan.

5. **The command index contains two Human Voice Rules punctuation blockers** — .skilled/commands/README.txt:54

   The HVR scan exits 1 with hard semicolon blockers at lines 54 and 203 and 11 mechanical deductions across 349 lines. Its mechanical ceiling is 89. Replace the two semicolons with sentence breaks or conjunctions and rerun the scan.

## Traceability Checks

- **Command discovery: pass.** All searched command listings and cross-repo references name setup consistently, and the root README includes it in the sk-git verification guidance.
- **Feature catalog package: partial.** The package validator reports zero violations, while its document-structure check warns that section 3 is missing.
- **Documented output: partial.** The source renderer appends status counters that the README and catalog leaf omit.
- **Human Voice Rules: partial.** Three target documents return hard punctuation blockers, listed above.
- **Readme references: partial.** The reference checker reports path errors that are inconclusive for slash-command and repository-root examples; no concrete broken setup link was confirmed.

## Verdict

This iteration found only P2 documentation-conformance issues. The existing P1 package-size finding remains active in the cumulative review state.

## Next Dimension

Review both release changelogs and perform the final cross-target consistency pass.

Review verdict: PASS
