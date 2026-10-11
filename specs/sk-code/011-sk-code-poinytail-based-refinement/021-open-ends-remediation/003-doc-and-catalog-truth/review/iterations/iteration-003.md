# Iteration 003 - Traceability Review

Mode: review | Dimension: traceability (D3) | Iteration 3 of 5
Target: the ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde.

## Dimension

Traceability - whether the change set's own claims resolve against the tree: spec and goal clauses to the commits that satisfy them, completion checkpoints to observed evidence, skill bumps and changelog entries to the set of touched skills, and corrected docs to the code and capabilities they cite.

Core protocols: `spec_code`, `checklist_evidence`. Overlays: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

## Files Reviewed

- Packet claims: `goal.md`, `spec.md`, `implementation-summary.md`, `tasks.md`, `plan.md` under `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/`
- Bump set: five `SKILL.md` diffs and five new changelog entries (sk-design 2.0.2.0, sk-doc 2.3.5.0, system-deep-loop 1.6.2.0, system-skill-advisor 0.15.4.0, system-spec-kit 2.7.11.0), plus the ROUTER.md / description.json / hub-router.json / mode-registry.json and `.hermes` ripples recorded in commit `d867ba976b`
- Carried-finding targets: `frontmatter-versioning.md`, `frontmatter-templates.md`, `.skilled/hooks/post-edit-quality/README.md`, `frontmatter-version.mjs`
- Corrected docs: `iteration-citation-jsonl.md`, `code-standards-alignment.md`, `skill-advisor-cli.md`, `spec-folder-literal-naming-create-sh-fallback.md`
- Commit arithmetic: `0039903bde..HEAD` (10 commits); strip commit `31888d05bb`; bump commit `d867ba976b`

## Verification Evidence

- Goal completion criterion 4 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:61], run verbatim, prints nine skill names where it must print nothing: cli-classifier, cli-external-orchestration, cli-orca, mcp-code-mode, mcp-tooling, sk-code, sk-git, sk-prompt, sk-vision.
- Goal completion criterion 1 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:58] prints `0` (want 17); criterion 3 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:60] prints `NOT-ok`; criterion 5 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:62] prints `[verify] 57 files | ok=57` and exits 0.
- Commit arithmetic: the strip commit `31888d05bb` removes exactly one `version:` line from 2,845 files spanning 14 skills; the range adds exactly five changelog files and five `version:` changes; `git diff --name-only 0039903bde..HEAD -- .skilled/skills` names all 14 skills.
- Version alignment: all 14 skills' `SKILL.md` versions equal their highest changelog entry; the five bumped `.hermes/skills/*/SKILL.md` mirrors match their `.skilled` twins.
- Corrected citations resolve: `.skilled/agents/deep-research.md` (611 lines) covers the cited 63-75, 177-220, 231-260 and 275-287 ranges; `skill-advisor-cli.ts` (1,648 lines) holds the JsonRpcError `-32602` retry at 1495-1515; iteration 1 verified `research.md:157`, `deep-research/SKILL.md:411-413`, `advisor-status.ts:342-345` and `advisor-tool-schemas.ts:268`; iteration 2 verified `spec-folder-mutex.ts:22`.
- Mirrors: `.claude/skills` symlinks `.skilled/skills`; no runtime directory outside `.skilled` carries a stale `frontmatter-versions` scope text.

## Findings by Severity

### P0 - None

### P1 - 1

**R3-P1-001 - Goal D5's bump gate fails on the tree: nine of the fourteen touched skills carry no bump or changelog entry**

- Claim: the change set edits docs under all 14 skills, but only five skills were bumped and only five changelog entries were added. Goal D5 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:48] fixes "Each touched skill is bumped once, with one changelog entry", and its own completion criterion [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:61] demands one added changelog plus one `+version:` per skill named by `git diff --name-only -- .skilled/skills`; run verbatim it prints the nine un-bumped skills: cli-classifier, cli-external-orchestration, cli-orca, mcp-code-mode, mcp-tooling, sk-code, sk-git, sk-prompt, sk-vision.
- Evidence refs: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:48], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:61], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:107], [SOURCE: .skilled/skills/sk-doc/changelog/v2.3.5.0.md:25] ("the other skills are not bumped for it"), [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:86] (deviations log still "None yet"), commit `31888d05bb` (2,845 files, 14 skills), commit `d867ba976b` (5 changelog adds, 5 version bumps).
- Counterevidence sought: an exemption in `sk-create-changelog/references/version-bump-rules.md` for mechanical strips - none exists (no housekeeping, mechanical or touched-skill wording); a later commit that bumps the nine - `d867ba976b` is HEAD; a version-anchor drift that would make the omission invisible - none; an amendment to D5 - the goal text still carries the frozen wording [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:40] and its log records no deviation.
- Alternative explanation: "touched" may be read as "substantively touched", making the carve-out the intended policy and criterion 4 the over-broad artifact. Under either reading the packet's executable gate and the tree disagree; the resolution is nine mechanical bumps or a recorded amendment.
- Impact: completion criterion 4 cannot pass; the packet cannot close on its own criteria; a maintainer running the goal check sees nine failures with no recorded reason in the goal.
- Finding class: matrix/evidence. Scope proof: the criterion loop covers every skill in the diff; the diff-arithmetic counts are exact.
- Final severity: P1. Confidence: high.
- Downgrade trigger: an operator-approved amendment to D5 and criterion 4 that exempts the mechanical strip, with the deviation entered in the goal log, reduces this to P2 bookkeeping.
- Recommendation: either bump each of the nine skills once with one changelog entry, or amend D5 and criterion 4 and record the deviation in `goal.md`'s deviations log.

### P2 - 1 new, 4 carried

**R3-P2-001 - The packet's completion ledger is still the template scaffold: 0 of 17 rows, no Tests table**

- Claim: REQ-002, REQ-003, REQ-004 and SC-001 require the 17 ledger rows and a Tests table in `implementation-summary.md`, and completion criteria 1 and 3 encode the same checks [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:58], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:60], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:143], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:148], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:158]. At HEAD the file is the untouched scaffold: criterion 1 prints `0`, criterion 3 prints `NOT-ok`, and no commit in the range touches the spec folder (its only commit is the 0039903bde scaffold).
- Counterevidence sought: the packet is mid-flight - the goal log says `Build | Pending` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:80] - so the ledger may be written at close; but nothing in the tree records the rows today.
- Impact: the completion evidence the packet's own criteria count does not exist yet; reviewers cannot map a row to its proving command.
- Finding class: instance-only. Final severity: P2. Would rise to P1 if the packet is presented for completion without it.
- Recommendation: write the 17 ledger lines and the Tests table in the prescribed formats before close.

Carried open from iteration 1 (unchanged in this range, still active): R1-P2-001 [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:480] (version still listed as a required field for the README and Feature Catalog templates), R1-P2-002 [SOURCE: .skilled/hooks/post-edit-quality/README.md:50] (dispatch scope description stale), R1-P2-003 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:260] (dead child-doc derivation branch), R1-P2-004 [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:95] (worked example still cites 2.7.10.0 while system-spec-kit is 2.7.11.0).

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | fail | REQ-005 vs 5/14 bump accounting (R3-P1-001); REQ-002/003/004 unrecorded (R3-P2-001); REQ-001 verify green |
| `checklist_evidence` | core | partial | criteria 1, 3 and 4 fail; criterion 5 passes (`verify`, exit 0); criterion 6 deferred to packet close |
| `skill_agent` | overlay | pass | 14/14 version equals top changelog; five bumps ripple through metadata and `.hermes` |
| `agent_cross_runtime` | overlay | pass | `.claude/skills` symlink; `.hermes` matches; no stale scope docs in `.codex`, `.cursor`, `.pi` |
| `feature_catalog_code` | overlay | pass | corrected anchors resolve (1495-1515, 342-345, 268, 22) |
| `playbook_capability` | overlay | pass | citation ranges resolve in `deep-research.md`, `research.md`, `SKILL.md` |

## Ruled Out This Iteration

- Spec.md ledger citations that now point at unrelated lines are drift, not error: at the scaffold commit `0039903bde` line 57 of `frontmatter-version.mjs` held `SCOPE_SUBTREES` and line 98 of `frontmatter-versioning.md` held the `W` section - both were the cited pre-change sites, so the frozen plan's evidence was accurate when written.
- Un-bumped skills' release metadata is not additionally drifted: all 14 versions match their top changelog entries, and the five `.hermes` mirrors match.
- Cross-runtime doc drift: no mirror outside `.skilled` documents the old dispatch scope; the only external mention is the updated `.opencode` test.
- Playbook citation ranges are not past end: `deep-research.md` is 611 lines; the other corrected citations were verified in iterations 1-2.
- Catalog anchors are not stale: `skill-advisor-cli.ts:1495-1515` resolves to the `-32602` retry; the other three anchors were verified in iterations 1-2.

## Next Dimension

maintainability (iteration 4 of 5). Carried work: the four R1 P2 findings and the R3-P1-001 gate resolution.

Review verdict: CONDITIONAL
