# Iteration 005 - Correctness Convergence Sweep

Mode: review | Dimension: correctness (final coverage and convergence sweep over the open findings registry) | Iteration 5 of 5
Target: the ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde (0039903bde..d867ba976b).

## Dimension

Correctness as the final sweep: re-adjudicate every open registry finding against the final tree, replay the completion gate, and census the one seam no prior iteration measured - whether the version-line strip executed the scope the rewritten standard states.

Core protocols: `spec_code`, `checklist_evidence`. Overlays: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

## Files Reviewed

- Packet `goal.md` (full; 48 holds decision D5, 61 holds its gate command) and `spec.md` (full; 47 deliverables, 107 REQ-005, 113 DV-R1, 169 the DV-R1 risk row)
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (full; 30 the MUST-NOT sentence, 87 the routing-artifact note)
- Commit messages of `c071e01662` (narrowing) and `31888d05bb` (strip scope)
- Censuses: touched-skill census over 0039903bde..HEAD; SKILL.md and changelog diffs; `^version:` survivor census and frontmatter classifier over `.skilled/skills` outside SKILL.md and changelog; five-skill version-versus-changelog comparison; the goal D5 gate replay; `git status`
- Prior registry context: iterations 001-004 narratives, the findings registry and the strategy

## Verification Evidence

- Touched skills: 14 under `.skilled/skills` in the range. SKILL.md diffs exist for five (sk-design 2.0.2.0, sk-doc 2.3.5.0, system-deep-loop 1.6.2.0, system-skill-advisor 0.15.4.0, system-spec-kit 2.7.11.0) and each equals its newest changelog entry.
- The goal D5 gate replayed verbatim from `goal.md:61` prints GATE-FAIL for cli-classifier, cli-external-orchestration, cli-orca, mcp-code-mode, mcp-tooling, sk-code, sk-git, sk-prompt and sk-vision: 9 of 14 touched skills carry no added changelog entry and no `+version:` SKILL.md change. R3-P1-001 stands exactly as iteration 3 recorded it.
- All 14 `.skilled/skills/*/SKILL.md` carry a `version:` line, so no bump lost a version.
- Strip survivor census: 78 files under `.skilled/skills` outside SKILL.md and `changelog/` match `^version:`; a frontmatter classifier finds 54 true frontmatter fields. The 54 split into 7 ROUTER.md, 26 README.md, 14 benchmark reports, 1 test fixture and 6 other child docs (examples/, hooks/, procedures/, runtime/). The remaining 24 matches are example text inside fenced blocks, not frontmatter.
- The strip commit declares "every .md under references/, assets/, feature-catalog/ or manual-testing-playbook/, and every README.md beside a SKILL.md" as its scope; the standard's out-of-scope sentence says every other document in a skill MUST NOT carry version, and its section 6 separately acknowledges ROUTER.md and the hub routing artifacts as convention-parity surfaces.
- `git status --porcelain` shows only the untracked review directory; this iteration modified no reviewed file.

## Findings by Severity

### P0 - None

### P1 - 1 carried, re-confirmed

**R3-P1-001 - Goal D5 bump gate fails: 9 of 14 touched skills carry no bump or changelog entry** (carried from iteration 3)

- Claim: frozen decision D5 ("Each touched skill is bumped once, with one changelog entry") and the goal's completion criterion remain unmet; the criterion command prints nine GATE-FAIL lines.
- Evidence refs: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:48], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md:61], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:107], plus the command replay above.
- Counterevidence sought: a changelog entry for any of the nine under a directory spelling variant, and a SKILL.md version diff outside the five-skill bump commit; neither exists in the range.
- Alternative explanation: the five bumped skills are the five whose SKILL.md or changelog shipped user-visible changes while the other nine were touched only through stripped child docs. That collision is what D5 and its gate exist to prevent, and the spec's risk row predicted it; it does not discharge the criterion.
- Impact: the handoff criterion "Every criterion in goal.md passes" cannot be claimed; nine skills would ship a doc change with no edition record.
- Final severity: P1 (unchanged). Confidence: high.
- Downgrade trigger: the nine skills each get one changelog entry and one SKILL.md bump, and the criterion prints nothing.

### P2 - 1 new, 7 carried

**R5-P2-001 - The strip executed a narrower scope than the rewritten standard's MUST-NOT statement, leaving 47 child docs with frontmatter version lines**

- Claim: the standard states "Out of scope (MUST NOT carry version): Every other document in a skill" [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], but 26 README.md, 14 benchmark reports, 6 other child docs (examples/, hooks/, procedures/, runtime/) and 1 fixture still carry a frontmatter `version:`. The 7 ROUTER.md survivors are excluded from the 47 because section 6 explicitly acknowledges the routing artifacts' parity values [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:87].
- Evidence refs: the survivor census and classifier above; the strip commit's scope statement (`31888d05bb`); the standard's MUST-NOT sentence.
- Counterevidence sought: a strip-scope clause naming nested READMEs, benchmarks, hooks or examples, and any check that reads these lines. The commit names four directories plus "every README.md beside a SKILL.md"; the engine, packager and router all narrowed to SKILL.md (or changelog), so no guard reads the survivors.
- Alternative explanation: benchmark reports and mirrored component READMEs are dated or external artifacts and the sentence may be meant to describe only the engine's historical scope. Plausible for the 14 benchmark reports and the mirrored `mcp-servers/**` READMEs; weaker for `hooks/skill-advisor-hook.md` (version 3.6.0.31 is exactly the per-doc build count D1 rejects), `procedures/design-system-extraction.md` and the `examples/**` docs.
- Impact: the standard and the tree disagree about which docs may carry a version; no guard reads them, so the disagreement stays latent and the next editor must guess which artifact wins.
- Final severity: P2 (documentation contract drift; no check fails). Confidence: high on the census, medium on intent.
- Downgrade trigger: the standard's sentence is narrowed to the strip's scope with the excluded classes named, or the 47 files are stripped.
- Recommendation: extend the strip to the remaining child docs, or amend section 1 to name the excluded classes (benchmark records, nested component READMEs, examples, hooks, procedures, runtime docs).

Carried open from prior iterations, unchanged by this sweep: R1-P2-001 (templates list version in README and Feature Catalog rows), R1-P2-002 (post-edit README describes the pre-change dispatch scope), R1-P2-003 (dead child-doc derivation branch and git-walk machinery), R1-P2-004 (standard example cites 2.7.10.0), R3-P2-001 (completion ledger still scaffold), R4-P2-001 (router test-only scope mapper), R4-P2-002 (five-way predicate spelling, vestigial parameters, unread openIdx).

## Ruled Out This Iteration

- Bulk mutation integrity of the 2,845-file strip: no SKILL.md lost its version (14/14 carry one), the five bumped versions each equal their newest changelog entry, and no changelog entry lost its version line; the commit records 2,845 files with zero additions and one deletion each.
- Version anchor drift across the five bumped skills: SKILL.md value equals the newest changelog filename for all five.
- A checker still demanding versions on child docs: the engine, packager and router were read in iterations 1-4 and all narrowed to SKILL.md (changelog for the packager); the only residual mismatch is the strip-versus-standard scope, filed as R5-P2-001.
- ROUTER.md version lines: acknowledged by the standard's section 6 as convention-parity routing artifacts, so not drift.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | fail, carried | D5 gate prints 9 failures (R3-P1-001); the tree's version-line scope is narrower than the standard's MUST-NOT (R5-P2-001) |
| `checklist_evidence` | core | not applicable this iteration | Packet ledger is traceability-owned (R3-P2-001) |
| `skill_agent` | overlay | pass with carry | 14/14 SKILL.md carry a version; the five bumped agree with their changelogs; nine touched skills remain unbumped (R3-P1-001) |
| `agent_cross_runtime` | overlay | inherited pass (iterations 2, 4) | No consumer of the narrowed scope outside `.skilled`/`.opencode` |
| `feature_catalog_code` | overlay | inherited pass (iterations 2, 4) | Two-column File-table path check implemented and regression-tested |
| `playbook_capability` | overlay | inherited pass (iterations 2, 4) | Backtick warnings report-only; piped report preserved |

## Verdict

The final sweep re-confirms one active P1 (R3-P1-001) by replaying the goal's own gate and files one new P2 (R5-P2-001). With an active P1 and no P0 the iteration verdict is CONDITIONAL; R5-P2-001 is advisory. The release decision is recomputed from the findings registry: 0 P0, 1 P1, 8 P2.

## Next Dimension

None. All four dimensions are covered and this is iteration 5 of 5; the run hands off to synthesis with the registry above.

Review verdict: CONDITIONAL
