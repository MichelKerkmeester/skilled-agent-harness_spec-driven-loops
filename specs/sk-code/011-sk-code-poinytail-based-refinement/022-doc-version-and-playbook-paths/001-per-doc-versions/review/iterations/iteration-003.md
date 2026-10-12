# Deep Review - Iteration 003 (traceability)

Dimension this iteration: **traceability (D3)** - the chain from the packet's requirements, ledger and acceptance criteria to the eight release commits 41302e72be..HEAD, and from the versioning standard and sk-doc changelog to the behavior those commits shipped.

Method: read-only reads plus git history forensics (per-commit stats, name lists, parent-tree reads) and one read-only engine run: node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify -> [verify] 5624 files | ok=3027 skip-no-frontmatter=2597, exit 0. No file under review was modified.

## Dimension

traceability (core protocols: spec_code, checklist_evidence; overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability).

## Files Reviewed

- specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/spec.md - problem and scope (lines 62-98), REQ-001 to REQ-009 (110-123), the PV-R1 to PV-R8 recommendation ledger (132-139), open question 1 (227).
- specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/goal.md - decisions D1 to D8 (38-51), completion criteria (60-65), log (88-89).
- specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md - whole file; still scaffold state.
- specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/acceptance-criteria.md - AC-001 to AC-009 (54-62).
- specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/tasks.md - tasks T001 to T014 and the verification checklist (34-61).
- .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md - scope table (21-43), format and anchor (47-66), bump rule (70-83), enforcement table (106-118).
- .skilled/skills/sk-doc/changelog/v2.3.7.0.md - lines 15-34.
- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs - scope constants and inScope (49-64, 174-190).
- .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py - version seeding (212).
- Commits read: 31888d05bb (2,845 removals), a8d0dd7c2a (restore), 3e848d1303 (68 seeds), 18d3233a52 (22 frontmatter additions), 812197ab82 (standard and templates), f60fa8adac (7-file citation re-anchor), aa89063bca (sk-doc 2.3.7.0 release). HEAD is aa89063bca.
- Packet diff: git diff --name-only 41302e72be..HEAD -- <packet> is empty; no packet file changed in the reviewed range.

## Findings by Severity

### P0

None.

### P1

1. [P1] The packet's ledger, acceptance evidence and task state are unwritten at HEAD (R3-P1-001)

- Case: a reader checks the phase packet against the shipped commits and finds every completion artifact still in scaffold state: implementation-summary.md says "Nothing yet", its ledger table and Tests table T1 to T4 are absent, all nine rows of acceptance-criteria.md read Unmet, tasks T012 to T014 are unchecked, and every box in goal.md's completion criteria is unchecked. The commit range touches no packet file at all.
- File: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md:48 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/implementation-summary.md:48]
- Evidence: implementation-summary.md:48 ("Nothing yet. The phase is scaffolded...") and :62 ("Not delivered yet. The builder records the 8 ledger rows PV-R1 to PV-R8 and the Tests table T1 to T4 here..."); acceptance-criteria.md:54-62 (AC-001 to AC-009 all Unmet; AC-005 at :58 explicitly tests the ledger); tasks.md:59-61 (T012 to T014 unchecked); goal.md:60-65 (six unchecked completion criteria); goal.md:32 says handoff is "Every criterion in goal.md passes". git diff --name-only 41302e72be..HEAD -- specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions prints nothing.
- User impact: REQ-005 (a P0 requirement in spec.md) and SC-001 evaluate false; the packet cannot close; a later reader cannot find per-row proofs; and AC-004 is marked Unmet although its own command now passes (the restore check below), so the recorded state is both incomplete and wrong.
- Finding class: matrix/evidence. Scope proof: the ledger's canonical location is fixed by spec.md ("The builder records every row above in implementation-summary.md"); no second ledger file for PV-R1 to PV-R8 was found in the packet.
- Affected surface hints: [packet ledger, acceptance criteria, task list, goal criteria]
- Claim: the reviewed commits leave the packet's completion record unwritten, so the shipped state cannot be traced to a closed ledger.
- Evidence refs: implementation-summary.md:48,62; acceptance-criteria.md:54-62; tasks.md:59-61; goal.md:60-65; empty packet diff over 41302e72be..HEAD.
- Counterevidence sought: whether the packet changed anywhere in the range (it did not); whether a later commit holds the ledger (HEAD is the release commit); whether a waiver or decision-record.md exists (neither file exists in the packet); whether the commit messages carry per-row proofs (they carry per-commit Verification blocks, not ledger rows).
- Alternative explanation: the build may record Phase 3 (T012 to T014) only after this review completes; the per-commit Verification blocks show the underlying evidence exists, just not in the artifact the spec designates.
- Final severity: P1. Confidence: high on the observed state; medium on the closure-timing intent.
- Downgrade trigger: a recorded workflow step that defers the ledger and acceptance fill to a post-review closure pass, or the fill itself (then advisory P2).
- Recommendation: fill the ledger PV-R1 to PV-R8 and the Tests table from the commit-message evidence, set AC-001 to AC-009 from observed runs, check off T003 to T014, or record the deferral before the packet is represented as complete.

### P2

2. [P2] The 22-doc frontmatter addition is not traceable to a recorded amendment of frozen decision D1 (R3-P2-001)

- Case: goal.md D1 (frozen; "Changing one is an amendment") scopes the contract to docs that already have a frontmatter block and lists "docs with no frontmatter block (style corpus, benchmark output, runtime and test fixtures, 21 hand-authored docs listed in spec.md)" as out. spec.md repeats it at :78: "Adding frontmatter to them is not in scope: see open question 1", and open question 1 (:227) says adding frontmatter "is an operator call". Commit 18d3233a52 gives 22 such docs a frontmatter block and version: 1.0.0.0. No amendment is recorded anywhere in the packet.
- File: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/goal.md:44 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/001-per-doc-versions/goal.md:44] and commit 18d3233a52
- Evidence: git show 18d3233a52 = 22 files, 161 insertions; for all 22 files the parent tree's first line is a heading, not a frontmatter fence (22 of 22 checked), so each doc had no frontmatter and now carries a version. rg -ni "amend|operator" over the packet finds no amendment record; goal.md's decision table and log are unchanged; the packet has no decision-record.md. The only authorization statement is the commit message ("The operator wants a version in every doc") and the related 2026-10-12 operator intent in spec.md:62. The count is 22, one more than the 21 enumerated (the extra is the superseded spec-kit runbook under a references folder).
- User impact: the frozen decision record now contradicts shipped behavior; a future reader cannot tell whether D1 still binds, and the changelog does not record the frontmatter addition either, so the authorization lives only in a commit message.
- Finding class: instance-only. Scope proof: one commit and one decision record; the other out-classes (style corpus, benchmark, runtime, tests) were not touched by this addition (the restore and seed commits only touched docs that already had frontmatter).
- Claim: the addition of frontmatter to 22 docs contradicts D1 as recorded, with no in-packet amendment.
- Counterevidence sought: packet-wide search for amendment or operator notes (none); check for a decision-record ADR (none); parent trees of all 22 docs (all frontmatter-less).
- Alternative explanation: the operator may have authorized the addition through the same 2026-10-12 intent; the substance (a version on every hand-authored doc) matches that intent, so the defect may be only the record lag.
- Final severity: P2. Confidence: high that no record exists; medium on the authorization question.
- Downgrade trigger: none needed at P2; an operator confirmation would close this as a documentation fix.
- Recommendation: record the amendment in goal.md (decision table or log) or a decision record naming the 22nd doc, and cite it from spec open question 1; or revert 18d3233a52.

## Traceability Checks

Claim vs commit (spec ledger and commit messages):

- Restore 2,845 files, 2,824 unquoted and 21 quoted (spec PV-R1): 31888d05bb touches 2,845 files and removes 2,845 version lines of which 21 are quoted; a8d0dd7c2a is 2,845 files changed, 2,845 insertions; 3 spot-checks return their pre-removal values exactly (0.8.1.0, 1.0.0.5, 1.1.0.12). Match.
- 68 docs started at 1.0.0.0 (commit 3e848d1303): 68 files changed, 68 insertions, every insertion is +version: 1.0.0.0, no SKILL.md. Match.
- 22 docs given frontmatter (commit 18d3233a52): 22 files changed, 161 insertions, 22/22 parents frontmatter-less. Match, with the record-drift finding R3-P2-001.
- SC-002: every file 31888d05bb touched still exists and carries a 4-part version - 2,845 checked, 0 gone, 0 missing. Match. Live verify run: 5624 files, ok=3027, skip-no-frontmatter=2597, exit 0. Match.
- One sk-doc release (D6/REQ-008): only .skilled and .hermes sk-doc SKILL.md changed in the range; changelog v2.3.7.0.md added; SKILL.md 2.3.7.0 equals the newest changelog entry. Match.
- Templates seed 1.0.0.0 (REQ-007): 812197ab82 changes the README, code-README and architecture templates plus init_skill.py, which seeds version: 1.0.0.0 into generated doc frontmatter (line 212); 0 sk-doc asset templates lack a version line. The changelog's "playbook index generator" phrase maps to that generator in init_skill.py. Match.
- Citation re-anchor (f60fa8adac): 7 files, 20 and 20 lines, all inside the sk-code manual-testing-playbook docs the restore shifted. Consistent.

spec_code (core): REQ-001 PASS (verify observed, exit 0). REQ-002 PASS (hook gate wiring verified in iterations 1-2; bump tests shipped in range). REQ-003 PASS (workflow job shipped; PR check wiring verified iteration 2). REQ-004 PASS (restore, 68 seeds, 22 frontmatter additions; note R3-P2-001). REQ-005 FAIL - ledger absent (R3-P1-001). REQ-006 PASS - the standard's scope table matches the engine constants class for class (EXCLUDED_DIRS: changelog, scratch, node_modules, .git, dist; SCOPE_SUBTREES: references, assets, feature-catalog, manual-testing-playbook; TEST_DIRS: tests, fixtures; CORPUS_DIRS: runtime, benchmark, behavior-benchmark; SPEC_EXAMPLES_DIR: /templates/examples/), and the section 4 bump rule was verified against observed behavior in iteration 1. REQ-007 PASS. REQ-008 PASS. REQ-009 PARTIAL - tests exist in range but the Tests table with before/after exits is unrecorded (folded into R3-P1-001).

checklist_evidence (core): FAIL as recorded - implementation-summary ledger absent, AC-001 to AC-009 all Unmet (including AC-004 whose own command was just observed to pass), T012 to T014 unchecked, goal criteria unchecked. Recorded as R3-P1-001.

Overlay:

- skill_agent: pass - sk-doc SKILL.md 2.3.6.0 to 2.3.7.0 equals the new changelog entry; the standard lives inside the updated skill.
- agent_cross_runtime: pass - the Hermes mirror .hermes/skills/sk-doc/SKILL.md was regenerated in the same release commit (aa89063bca).
- feature_catalog_code: partial - 611 of 653 feature-catalog docs carry a version; the remainder falls to the exempt classes (verify exit 0 implies out of scope); not traced per file this iteration.
- playbook_capability: partial - 1,465 of 1,481 manual-testing-playbook docs carry a version; same caveat.

## Verdict

No P0. One P1 (R3-P1-001: the packet's completion record is unwritten) and one P2 (R3-P2-001: the D1 amendment is unrecorded). The code-side claims themselves all matched the commits exactly: the 2,845-file restore, the 21 quoted values, the 68 first-time seeds, the 22 frontmatter additions, the single sk-doc release, the template seeding and the citation re-anchor all trace clean. The CONDITIONAL rests on the record state, not on the shipped behavior.

## Next Dimension

maintainability - the last uncovered dimension.

Review verdict: CONDITIONAL