# Deep Review -- Iteration 3 (traceability)

## DIMENSION

Traceability, core protocols `spec_code` and `checklist_evidence`, overlays `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`. The question for this pass was narrow: does every claim the eleven phase children and the parent record make about the shipped tree survive contact with the tree? That splits into four checks -- the manifest as the scope contract, the acceptance-criteria rows as the closure gate, the dated version claim as the one operator-visible assertion, and the overlay docs as the narrative around the code.

One open thread from iteration 1 was carried in: the 157-versus-159 manifest count. It is now closed with a mechanical answer rather than an opinion (section below).

## FILES REVIEWED

| File | What was read |
|---|---|
| `goal-file-manifest.txt` | whole file (159 lines), plus a per-path existence loop |
| `spec.md` | frontmatter continuity block 1-23, phase map 110-140 |
| `011-two-version-proof-and-closeout/proof.md` | whole file |
| `011-two-version-proof-and-closeout/acceptance-criteria.md` | metadata 25-41, criteria 44-60, closure 82-88 |
| `011-two-version-proof-and-closeout/implementation-summary.md` | frontmatter and metadata table 1-50 |
| `001`, `002`, `003`, `004`, `009`, `010` `acceptance-criteria.md` | status line, unmet scan, evidence cells |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | 128-140, word count |
| `cli-opencode/README.md` and the eight `references/*.md` | dated-claim occurrence scan |
| `.skilled/bin/agent-mirror-crosswalk.md` | agent-name coverage scan |
| `cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | index-to-page link coverage |
| `.skilled/agents/` and `.opencode/agents/` | directory listings (parity check) |

## FINDINGS BY SEVERITY

### P0 -- Critical

None.

### P1 -- Required

#### R3-P1-001 -- The closeout child records the packet as not closing while every other document says Complete

- **Claim:** `011-two-version-proof-and-closeout/acceptance-criteria.md`, the document that exists to decide whether this packet may close, records the decision as negative and unwritten. Its metadata status is `Draft` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:41], its closure statement reads `Closeable: No` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:86], and the section body still carries the scaffold text `Not started. This section is written when the packet closes, not before.` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:88]. The same file's six criteria rows are all `Met` (`grep -c '| Unmet |'` returns 0), its own `implementation-summary.md` records `**Status** | Complete`, and the parent phase map marks all eleven phases `Complete` including phase 11 [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md:124] and phase 1 [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md:114]. The parent continuity block states `completion_pct: 100` and `recent_action: Closed all eleven phases with the two-version proof`.
- **EvidenceRefs:** `011/acceptance-criteria.md:41`, `:86`, `:88`; `spec.md:114`, `:124`; `011/implementation-summary.md` Metadata table `Status | Complete`; `011/proof.md` "Recursive validation" section (RESULT: PASSED).
- **CounterevidenceSought:** (a) Is the scaffold text a template placeholder that `validate.sh` is expected to exempt? AC-003 in the same file records `RESULT: PASSED (scratch/validate-recursive.txt)`, so the strict validator reaches this text and does not object -- which means no automated gate catches it, strengthening rather than weakening the finding. (b) Does a decision record waive the closure statement? `grep -i "closable\|closure"` over `011/scratch/decisions.txt` and the packet `scratch/decisions.txt` returned nothing, so no waiver exists. (c) Is `Closeable: No` a deliberate hold pending the operator's push? The parent continuity says `next_safe_action: Packet complete. Pushing the branch waits for the operator` -- pushing is a separate act from closability, so the hold does not explain a `No`.
- **AlternativeExplanation:** the phase-authoring order. The criteria rows were filled in (each row gained a Met status and an Evidence cell) but the closure section was never revisited, because it is the one part of the document that has no row to tick and no validator rule behind it. That is a plausible mechanical account, and it is also precisely why the defect survives: the two halves of the same document disagree and nothing reconciles them.
- **FinalSeverity:** P1. **Confidence:** high on mechanism (three exact lines, all read); the follow-on (whether a reader or a downstream release check would treat `Closeable: No` as binding) is judgment, and what would settle it is naming the release-readiness consumer that reads this field.
- **DowngradeTrigger:** a decision record, or the spec-kit contract, declaring the CLOSURE STATEMENT section non-normative until a separate close-out step runs -- in that case this collapses to P2 documentation polish. It would also downgrade if the `Closeable` field is shown to be derived from something other than the criteria rows.

### P2 -- Minor

#### R3-P2-001 -- Four closed phase children still carry a Draft acceptance-criteria status

The same divergence as R3-P1-001, one level down and without the negative closeability, in the four earliest children. `001`, `002`, `003` and `004` each record `**Status:** Draft` at line 41 of their acceptance-criteria metadata [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/acceptance-criteria.md:41] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export/acceptance-criteria.md:41] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/acceptance-criteria.md:41] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/acceptance-criteria.md:41], while `005` through `010` all read `Complete` at the same line. `001` additionally retains `**Closeable:** No` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/acceptance-criteria.md:90], against the parent map's `Complete` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md:114]. The split is exactly between the children authored in the first pass and the children authored later, so the `Draft` values are almost certainly untouched scaffold rather than a held decision. The reason this sits below R3-P1-001: the parent phase map and each `implementation-summary.md` do agree with each other, so closure criterion AC-006 ("the completion state matches across them") is satisfied as written -- the divergence is between a third document the criterion does not name and the two it does.

- **Counterevidence sought:** none of the four has an `Unmet` row (`grep -c '| Unmet |'` returns 0 for all eleven children), so no criterion is actually open; the defect is the status label alone.
- **Final severity:** P2. **Confidence:** high on the observed status strings.
- **Downgrade trigger:** acceptance-criteria `Status` is a document-lifecycle field (Draft/Accepted) rather than a completion field -- in which case the label is correct and this is informational.

#### R3-P2-002 -- The proof's word-count row is the one row whose command is not named, and the obvious counter does not reproduce it

`proof.md`'s scoped-claim table records `SKILL.md words | 4,904 of 5,000` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/proof.md:88]. `wc -w` on the same file returns 4,972 [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:1] -- a 68-word gap, still under the cap. Every other row in that table names its command (`grep -n ...`, `validate_document.py`, `validate_skill_package.py`, `compiled-route-sync.cjs --check`, `sync-skills-hermes.cjs --check`); this one names a number and no invocation, so a later reader cannot tell whether the file drifted after the measurement or the counter differs.

- **Counterevidence sought:** the 5,000-word ceiling may be measured by a repository word counter whose rules (frontmatter excluded, code fences excluded, link targets excluded) legitimately produce a different number than `wc -w`. At 4,972 the file is under the cap by `wc -w` as well, so the gate outcome -- the only thing that matters operationally -- is identical either way. This is why the finding is P2 and not higher: nothing downstream changes.
- **Alternative explanation:** the count was taken before the final edit to `SKILL.md` and not re-run, which the same table's "final run is the one kept" discipline was meant to prevent.
- **Final severity:** P2. **Confidence:** low-medium on whether this is a defect at all -- the ceiling's own counter is unread.
- **Downgrade trigger:** if 4,904 is what the repository's document validator reports for this file, the row is correct and this becomes informational. **Upgrade trigger:** if the counter is `wc -w`, then the recorded measurement is simply wrong and the row should be re-measured.

## TRACEABILITY CHECKS

| Protocol | Status | Detail |
|---|---|---|
| `spec_code` (core) | **pass** | All 157 manifest paths resolve on disk; 0 missing. The three claims spot-checked against the tree all hold: the dated claim sits where AC-005 says, the eight-reference claim reproduces exactly, and the six hard rules match the dispatch audit table. |
| `checklist_evidence` (core) | **fail** | R3-P1-001 and R3-P2-001. The rows are Met and carry observed evidence; the document-level completion metadata around them does not agree with the rows or with the packet. |
| `skill_agent` (overlay) | **pass** | AC-005 cites `SKILL.md:134` for the dated claim; the line is the `Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-19` sentence in Prerequisites, exactly as claimed. The claim's placement claim ("Prerequisites, the end of the README overview, and the overview of each reference that names a version: eight references in all") reproduces: `grep -rl` finds the string in 8 files under `references/` plus `SKILL.md` plus `README.md` = the ten documents `proof.md` reports `validate_document.py` passing. |
| `agent_cross_runtime` (overlay) | **partial -- unconfirmed** | `.skilled/agents/` and `.opencode/agents/` carry the same eleven agent filenames plus `README.txt`, so source-to-runtime parity holds at filename level. A name-level scan of `.skilled/bin/agent-mirror-crosswalk.md` matched only 6 of the 11 names (`ai-council`, `context`, `debug`, `design`, `markdown`, `orchestrate`). Not filed as a finding: the file was not read in full, and a crosswalk organized by runtime rather than by agent would produce this pattern without any gap. Upgrades to a finding if the crosswalk is shown to enumerate agents individually yet omits five. |
| `feature_catalog_code` (overlay) | **pass (carried, not re-entered)** | Verified in iteration 2 and listed as swept; not re-checked here. |
| `playbook_capability` (overlay) | **pass on structure** | 56 playbook pages on disk, 0 unlinked from `manual-testing-playbook.md`'s index -- every page is reachable. Scope caveat: only 24 of those 56 pages are in the manifest, so capability coverage is claimed for the indexed set, not the full set. |

### Manifest count reconciliation (closes iteration 1's open thread)

`wc -l goal-file-manifest.txt` returns 159 and `sort -u | wc -l` also returns 159, with no blank line and no duplicate. The 157/159 discrepancy is not a defect and not a stale count in the packet: the file's first two lines are comment headers -- `# Review scope for the dual-compat build: every file the build commits changed outside specs/,` and `# minus generated runtime mirrors (.claude, .codex, .hermes, .pi) and lock files.` A per-line existence loop over the file reports exactly those two entries as `MISSING` and every one of the remaining 157 as present. So 157 real paths + 2 comment lines = 159 lines, and both figures are correct. Iteration 1's artifact map summed its subsystem counts to 159 because it counted the two comment lines among the files; the map's per-subsystem counts are otherwise reproducible. No finding; recorded here so the thread is not reopened.

## SCOPE VIOLATIONS

None. Every reviewed file was opened read-only. The only writes were the three permitted state artifacts.

## VERDICT

**CONDITIONAL.** One P1: the packet's closure gate records the packet as not closing (`Closeable: No`, `Status: Draft`, "Not started") while all six of its own rows are Met and every sibling document says Complete, and the strict validator passes over it. Two P2s follow from the same class of divergence and from one non-reproducible evidence row. The shipped code was not implicated by anything found this iteration -- the traceability failure is in the records around it, which is exactly the failure mode a closure gate exists to prevent.

## NEXT DIMENSION

**maintainability** (iteration 4). The last unopened dimension, and the two P1/P2 classes just found point into it: these documents had no rule keeping them in step, so the maintainability pass should ask what mechanism, if any, keeps a phase child's criteria status, closure statement and implementation summary aligned after the child closes -- and should read the 32 playbook pages and the unread `SKILL.md`/reference bodies that traceability only sampled for a claim string.

Review verdict: CONDITIONAL
