# Iteration 4: Carried-Forward Resolution — Ancestry, Leaf-Alias Count, Track-Root Wording

## Focus

Resolve the three open carried-forward branches rather than open new surfaces: (1) Q4's final branch, the ten-commit ancestry check against tag `v4.0.2.0`; (2) the `sk-doc/shared/README.md:50` claim of "five alias entries / four `shared/` paths" after cdd3c27db4; (3) the policy edge on the two packet-worded track-root docs (`README.md:241-243`, `folder-structure.md:121`). Exhausted directions from iterations 1-3 were respected: no mcp-tooling, system-skilled-doctor, onnxruntime or `specs/` re-sweeps.

## Actions Taken

1. Read the agent definition, config, strategy and findings registry (state-first; 4 reads).
2. Ran one bounded, read-only git probe: tag list, tag head, `git merge-base --is-ancestor <sha> v4.0.2.0` for each of the ten commits, then `git rev-list --count v4.0.2.0..HEAD` and the HEAD identity.
3. Read `.skilled/skills/sk-doc/leaf-aliases.json` in full (5 entries) and `sk-doc/shared/README.md:30-51`.
4. Settled the track-root policy edge by reusing iteration 3's captured wording (read-budget freshness) instead of re-reading both files.

## Findings

1. **Ancestry split: six fixes shipped inside tag `v4.0.2.0`, four postdate it.** Ancestors of `v4.0.2.0`: 190b103dd8 (12:49:04), 509c2d707c (12:49:06), 8da131af09 (12:49:10), 95f704cfc0 (12:49:23), cdd3c27db4 (13:06:15), 9932b52352 (13:26:41). Not ancestors: 478cdec696 (14:31:31), 67fc950028 (15:45:34), a65d573299 (15:45:35), b8d66a38f7 (15:46:10). The tag's own head is a7b158d71278, 2026-11-08 13:59:47, "docs(skilled): add the setup guide and overlay adoption to the v4.0.2.0 notes" — and `v4.0.2.0..HEAD` holds 60 commits. The six ancestor fixes landed 12:49-13:26, before the tag's own notes commit, so the missing coverage is not a notes-predate-code artifact: v4.0.2.0 shipped six undocumented fixes. Disposition: the six belong in an amended v4.0.2.0 entry (published-entry amendment path, tag left in place; the file records that these notes were amended four times), while the four post-tag fixes (478cdec696, 67fc950028, a65d573299, b8d66a38f7) require a new, strictly greater version file. Extending v4.0.2.0 in place stays BLOCKED as a direction; the corrected split replaces iteration 2's unresolved either/or. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:245] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:257] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:195]

2. **The leaf-alias count claim is accurate after cdd3c27db4; no doc change needed.** `leaf-aliases.json` holds exactly five entries; four `diskPath` values are under `shared/` (`llmstxt-templates.md`, `validation.md`, `core-standards.md`, `evergreen-packet-id-rule.md`) and one is under `sk-create-with-human-voice/`. `sk-doc/shared/README.md:50` says "the five alias entries the router addresses as packet-local leaves, four of them `shared/` paths" — verified true against the regenerated projection. [SOURCE: .skilled/skills/sk-doc/leaf-aliases.json:1] [SOURCE: .skilled/skills/sk-doc/shared/README.md:50]

3. **Track-root policy edge resolved: no defect, optional clarity only.** `system-spec-kit/README.md:241-243` already states the list is rewritten "from the packet folders on disk" and defines a sub-track as a non-numbered child with no `spec.md`; `references/structure/folder-structure.md:121`'s "direct numbered packets" is true under the new packet definition (numbered folder **with** `spec.md`). Neither contradicts a65d573299; neither states the gate explicitly. Verdict: leave as written; if a clarity pass happens, add "a numbered folder containing `spec.md`" to `folder-structure.md:121` and to the genuinely stale rows already reported (`track-root-children-lists.md:32`, `runtime/cli/spec/README.md:115-116`, `runtime/cli/lib/README.md:121`). [SOURCE: .skilled/skills/system-spec-kit/README.md:241] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:121]

## Questions Answered

- Carried-forward: Q4's final branch (ten-commit ancestry) — resolved with a 6/4 split disposition.
- Carried-forward: the `sk-doc/shared/README.md:50` alias-count claim — verified accurate.
- Carried-forward: the track-root packet-wording policy edge — resolved as no-defect with an optional-clarity recommendation.
- No strategy key question was unchecked on entry; all five remain checked as recorded by the reducer.

## Questions Remaining

None in the strategy ledger. What remains is release planning, not research: whether the four post-tag fixes ship in the next version file (`v4.0.2.0..HEAD` already spans 60 commits) and whether the six ancestor fixes are amended into the published v4.0.2.0 entry as a correction.

## Edge Cases

- Ambiguous input: none; the three carried-forward items were specific.
- Contradictory evidence: none; the ancestry split refines rather than contradicts iteration 2's either/or framing.
- Missing dependencies: none.
- Partial success: none.

## SCOPE VIOLATIONS

None. All writes stayed inside the research packet; all researched paths were read-only; no `.env` file and nothing under `barter/` was opened.

## Sources Consulted

- `.skilled/skills/sk-doc/leaf-aliases.json:1-27`
- `.skilled/skills/sk-doc/shared/README.md:30-51`
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:245-263`
- `.skilled/changelog/skilled/v4.0.2.0.md:195-233`
- `.skilled/skills/system-spec-kit/README.md:241-243` (wording captured in iteration 3's registry)
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:121` (wording captured in iteration 3's registry)
- Command evidence: `git tag --list 'v4.0.2*'`, `git log -1 v4.0.2.0`, `git merge-base --is-ancestor <sha> v4.0.2.0` (ten commits), `git rev-list --count v4.0.2.0..HEAD`, `git log -1 HEAD`

## Assessment

- New information ratio: 0.65 (one fully new fact — the 6/4 ancestry split — plus two partially new resolutions: alias count verified, policy edge settled)
- Questions addressed: 3 carried-forward branches
- Questions answered: 3 carried-forward branches

## Reflection

- What worked and why: one bounded git probe answered the decisive branch directly, and because `leaf-aliases.json` is a five-entry projection, a direct count is authoritative rather than a doc inference.
- What did not work and why: nothing failed; the policy edge is a wording judgment that evidence cannot settle on its own, so it is reported as a recommendation rather than a defect.
- What I would do differently: no new sweeps on the final iteration — consolidate the register and close the release split.

## Recommended Next Focus

Iteration 5 (final): consolidate the remediation register into one ordered checklist. Confirmed doc defects: the three directory-worded track-root rows plus `folder-structure.md:121` (optional clarity), `filesystem-naming-convention.md` §3 and §5 plus `shared/scripts/README.md:50` for the `research_archive` exemption, the unconditional TypeScript module-header rule at `typescript-checklist.md:47` and `overview-strict-and-naming.md:36`, the `SETUP.md` naming in `system-skilled-doctor/changelog/v1.1.1.0.md`, the ~22 live `goal.md` files and the `.skilled` playbook/README set still pointing at `specs/hooks/`, and the missing changelog coverage. Release split: amend v4.0.2.0 for the six ancestor fixes; new version file for the four post-tag fixes.
