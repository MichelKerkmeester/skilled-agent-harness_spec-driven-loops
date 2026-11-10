# Review Iteration 003 — Maintainability (13c removal surface)

## Dispatcher

- Mode: review (`/deep:review` loop, single iteration dispatched to `@deep-review`)
- Run: `2026-10-12T16:20:15.273Z-i3`; session `2026-10-12T16:20:15.273Z`; generation 1; lineageMode `new`
- Budget profile: verify (evidence rereads over dispatch-declared focus files)
- Note: the orchestrator assigned **maintainability**; the strategy's prior Next Focus pointer (security) was stale for this rotation and is updated below.

## Dimension

**maintainability** — the parent-skill doctor 13c removal surface: was the check removed completely and surgically, does the new test guard the removal, are the surviving symbols still used, is the section header comment accurate, and does the removal drop a protection the per-doc version rule still needs?

## Files Reviewed

| File | Anchors |
|------|---------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | 178, 188, 596, 997, 1252 (warn definition, downgrade and call sites); 1757 (section 13 header comment); 1761-1767 (markdownVersion helper); 1783-1800 (13b checkChangelogVersion); 1804-1837 (13d checkPacketChangelogVersions); 1842-1868 (13a checkVersionParity, followers at 1849-1854); 1812, 1826, 1843, 1850 (markdownVersion call sites) |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | 333-397 (FAILING_CASES head, no 13c entry remains), 437 (new negative assertion) |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | 17, 24-34 (in-scope/out-of-scope tables), 122 |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch` | 37-113 (checker and test hunks), 225-243 (frontmatter-versioning hunk) |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

No findings this iteration. Every dispatch question resolved clean on direct reads; the details are under Confirmed-Clean Surfaces, Ruled Out and Edge Cases.

## Traceability Checks

- `spec_code` (core): **partial** — carried; the maintainability read adds no new spec-row mapping, and spec-doc reconciliation remains pending.
- `checklist_evidence` (core): **pending** — deferred to the traceability iteration.
- Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not in scope for this dimension; unchanged.

## Integration Evidence

- The checker is exercised by `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` and `.skilled/commands/doctor/scripts/tests/run-all.sh` (orchestrator-observed: 97/97 tests pass; run-all.sh 7 suites, 0 failed).
- The frontmatter standard's sentence at `frontmatter-versioning.md:122` names the doctor check; the read confirms it matches `checkVersionParity`'s follower set at `parent-skill-check.cjs:1849-1854`.
- The five hub runs (system-spec-kit, system-skill-advisor, sk-git, sk-doc, system-deep-loop) are orchestrator-observed: no 13c line remains, and the FAIL counts on three hubs each dropped by one, matching the removed FAIL path.

## Edge Cases

- **Dispatch dimension vs strategy pointer.** The strategy's Next Focus said security; the dispatch assigned maintainability. Proceeded with the dispatch-declared dimension (the per-iteration authoritative assignment) and moved the strategy pointer to security.
- **Result caps on token collisions.** Both identifier scans hit their result caps on unrelated `13c` tokens (`T-013c` test ids, `#b3813c` hex colors, sha256 and image-url substrings). The identifier-precise terms (`checkReadmeVersion`, `README_VERSION_WARN_ONLY`) returned zero product hits; the bare-`13c` sweep is corroborated-only.
- **No command execution in this dispatch** (accept-edits, no shell). Orchestrator-observed suite and hub results were used as corroboration; every mechanism claim was re-derived from file content (diff, test body, call sites).

## Confirmed-Clean Surfaces

- `parent-skill-check.cjs`: the removal is three hunks only — the section comment `(13a-13d)` to `(13a, 13b, 13d)`, the `README_VERSION_WARN_ONLY` set plus `checkReadmeVersion` block, and the call site in `checkVersionParity`; no other line changed.
- `parent-skill-check.cjs`: section 13's header comment names exactly the checks present (13a `checkVersionParity`, 13b `checkChangelogVersion`, 13d `checkPacketChangelogVersions`).
- `parent-skill-check.cjs`: `warn` (178, 188, 596, 997, 1252) and `markdownVersion` (1812, 1826, 1843, 1850) keep live call sites; no dead code left by the removal.
- `parent-skill-check-invariants.test.cjs`: `FAILING_CASES` no longer carries a 13c entry; the new test injects a README version differing from SKILL.md, asserts no `13c-readme-version` line and exit 0, and fails against the pre-removal checker — it proves the removal.
- `frontmatter-versioning.md`: the replacement sentence at :122 matches 13a's comparison set (ROUTER.md plus the three JSON files against SKILL.md); the per-doc rule gives every non-SKILL doc its own edition, so the removal drops no protection the rule needs.
- No caller, test, doc, workflow YAML or playbook references the removed identifiers.

## Ruled Out

- 13c removal surgicalness: the checker's only hunks are the section comment, the 13c block and its call site; no other line changed (iteration 3, evidence: review-diff.patch:41-82)
- New-test guard value: the test fails against the pre-removal checker (assertion matches the restored FAIL line; pass 0 / fail 1), so it proves the removal (iteration 3, evidence: review-diff.patch:102-113; parent-skill-check-invariants.test.cjs:437)
- Per-doc version rule protection: READMEs carry their own edition under the standard; 13c's README == SKILL.md demand contradicted it and had to warn-exempt four hubs (iteration 3, evidence: frontmatter-versioning.md:17,30; review-diff.patch:54-56)
- Dead code after the removal: `warn` (178, 188, 596, 997, 1252) and `markdownVersion` (1812, 1826, 1843, 1850) keep live call sites (iteration 3, evidence: parent-skill-check.cjs)
- Section 13 header comment: `(13a, 13b, 13d)` names exactly the checks in the section (iteration 3, evidence: parent-skill-check.cjs:1757,1783,1804,1842)

## Next Focus

- **Dimension:** security — **Focus area:** credential and auth wording in the changed surface — the ClickUp auth lines, the mcp-code-mode INSTALL-GUIDE frontmatter change and the `.env.example` cross-claim; confirm no changed doc leaks or implies credential values. — **Reason:** dimension rotation; maintainability closed the 13c removal surface this iteration. — **Rotation status:** next unchecked dimension. — **Carry-forward:** (a) runtime-mirror sentence closure for traceability (`agent_cross_runtime`); (b) remaining F12–F23 re-derivations: sk-git 9 categories, sk-design-chart 29 forms, deep-loop runtime `changelog/` tree, INSTALL-GUIDE header, system-spec-kit Node engines and hooks adapters, spec docs. — **Required evidence:** direct listings/reads of the named files; the mirror-sync tooling's runtime table. — **Recovery note:** none — iteration 3 completed.

## Verdict

Review verdict: PASS
