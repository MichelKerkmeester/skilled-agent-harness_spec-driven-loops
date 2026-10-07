# Iteration 12: Q4 finish, cleanup tool reporting and apply verification

## Focus

Close Q4 with the cleanup tools' reporting behavior and the verification story of the two mass applies in this branch. The question is what the tools already prove, and what the branch verified by hand that should be machine-checkable.

## Actions Taken

- Read the cleanup tool's report shape (`--json`, per-file changes, skipped diagnostics).
- Read the census tool's skip handling and the phase 12 skipped-file note.
- Read the commit bodies of the two corpus commits (`7fe1cbeda87`, `d727cf94fe1`) for their verification claims.

## Findings

1. `template-phrase-cleanup.mjs` already produces an exact machine-readable preview: `--json` emits per-file changes and skipped-file diagnostics, the summary line counts files/skips/errors, and every skipped file is printed as `path: skipped: reason`. The tool does not write on a dry run. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:370] CONFIRMED
2. The skip class is real and was routed by hand: the phase 12 dry run skipped 21 files for "no opening frontmatter delimiter", and those were fixed outside the tool (field copies plus lane work) because the cleanup correctly refuses to touch a document whose header it cannot parse. The tool reports them; no tool routes them to `fill-frontmatter`. [SOURCE: specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md:78] CONFIRMED
3. The live-packet apply is documented at commit level with the properties a permanent tool needs: 1,319 files in 541 live folders, archived packets left alone, each touched folder's graph metadata re-derived, and a second run finding nothing to change. The commit body carries these claims; the repo's checks re-derive part of them but not all. [SOURCE: git show 7fe1cbeda87] CONFIRMED
4. The close commit rebuilt the trigger index from the final corpus and states its freshness check passes, so the index is verified locally as part of the same work. [SOURCE: git show d727cf94fe1] CONFIRMED
5. Applied-state verification remains manual where it matters most: phase 013's risk table names "diffs are sampled" as the control for thousands of structural edits, and the phrase applies used orchestrator sampling of 10 previews. Sampling is a reasonable one-off control, but it is not repeatable and not machine-checkable. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:137] CONFIRMED
6. The pieces for a machine check already exist: the cleanup's dry-run preview fully describes the intended change, so an applied-state audit is a comparison between the base-revision preview and the working tree, not new heuristics. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:5] INFERRED from the preview contract; the confirmable check is an audit prototype run against one applied folder.

## Ruled Out

- Blaming the cleanup for skipping frontmatter-less files: refusing to edit an unparseable header is the correct boundary; the missing piece is routing the class, not forcing the edit.
- Replacing sampled diff review with full manual review: the phase's volume makes that impossible; the replacement is a mechanical audit, not more human reading.

## Dead Ends

- Searching for an applied-state audit flag in the cleanup tool: only dry-run/apply/json exist; the audit is a genuinely new mode.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`
- `specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md`
- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md`
- git commits `7fe1cbeda87`, `d727cf94fe1`

## Assessment

- New information ratio: 0.80 (4 of 6 findings fully new; 2 consolidate known apply properties and count as half new)
- Questions addressed: Q4 cleanup tools and verification, Q5 audit checks
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-032 | Turn skipped-file diagnostics into a routed handoff: when the cleanup or census skips a document whose frontmatter it cannot parse, emit the class name and the owning stage (`fill-frontmatter`) so the operator runs the pipeline instead of chasing skip counts by hand | Q4, Q3 | `template-phrase-cleanup.mjs` report plus the heal pipeline docs | S | Low; reporting only | Cleanup report, docs | 21 files were skipped and fixed by hand in phase 12 | CONFIRMED gap | Yes (report only) | Delete the report line | No |
| R-033 | Add an applied-state audit mode to the cleanup family: at the base revision, compute the dry-run preview; then assert the working tree equals the expected post-apply state folder by folder, and fail with the first mismatch. This replaces sampled diff review with a repeatable mechanical check | Q4, Q5 | `template-phrase-cleanup.mjs` (or a sibling audit script) | M | Low to Med; read-only audit, but it must pin the base revision clearly | Cleanup tool plus tests | Preview contract at cleanup.mjs:5; sampling control at 013 spec:137 | CONFIRMED preview exists, INFERRED audit design | Yes (read-only) | Delete the audit script | No |
| R-034 | Encode the mass-apply safety claim as a CI diff rule for phrase-cleanup commits: a check that a commit claiming phrase cleanup touches only frontmatter trigger rows (plus generated metadata), so the commit-message claim is verified rather than trusted | Q4, Q5 | `.github/workflows/` advisory checks | M | Med; a diff rule must allow legitimate adjacent metadata changes or it will produce false failures | New workflow check | The apply touched 1,319 files; the only volume control today is sampling | INFERRED from the phase's controls; confirm by drafting the rule against the two applied commits | Yes (check only) | Delete the check | No |

## Reflection

- What worked and why: reading the cleanup's report path and the phase 12 skip note together showed the exact gap (report without routing) and the exact replacement for sampling (base-preview comparison).
- What did not work and why: nothing failed; the commit bodies carry more verification detail than the docs summarize, which is worth remembering for future evidence gathering.
- What I would do differently: read commit bodies before implementation summaries for apply evidence; they are closer to the change.

## Recommended Next Focus

Iteration 13: Q5 in full. Inventory the existing CI workflows and pre-commit hooks, decide which drift checks already exist (trigger index, changed-packet validation, strict-pass freshness, advisory checks) and which proposed checks belong cheaply in CI or pre-commit.
