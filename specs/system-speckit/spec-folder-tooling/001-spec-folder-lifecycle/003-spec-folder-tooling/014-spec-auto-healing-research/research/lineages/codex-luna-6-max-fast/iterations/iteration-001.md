# Iteration 1: Branch inventory and phase 013 repair boundary

## Focus
Inventory the commits between `origin/main` and `HEAD`, connect the series-parent and Gate 3 work to its phase documents, and establish the current phase 013 repair scope. The phase 013 file is a working-tree source; other corpus paths may be changing concurrently. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:74]

## Actions Taken
- Confirmed the ordered commit list with `git log --reverse --format='%H %s' origin/main..HEAD`; it contains ten commits. The brief groups them by series-parent changes, template phrase work, CI rebuild, validation repairs, phase 012 closeout, and two Claude roster changes. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:39]
- Read the phase 006 and 009 documents to compare the original series-parent scope with the later runtime-menu implementation. Phase 006 describes the rule and sibling listing; phase 009 describes the shared Gate 3 menu text and Pi projection. [SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:41] [SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:48] [SOURCE: specs/system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent/implementation-summary.md:48] [SOURCE: specs/system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent/implementation-summary.md:52]
- Read the current working-tree phase 013 specification and compared its stated baseline, repair scope, and safety requirements. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:71] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:151]

## Findings
1. **CONFIRMED** The branch history covers series-parent rules and Gate 3 wording, template trigger-phrase cleanup and corpus updates, trigger-index CI push, strict-validation repairs, and phase 012 closeout. The two Claude roster commits are adjacent work in the same range. The actual ordered `git log` output matched the ten commits listed in the brief. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:39] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49]
2. **CONFIRMED** The working-tree phase 013 spec reports a baseline of 2,046 failing packets out of 4,371, split into 1,935 archived and 111 live. I have not independently reproduced these baseline counts yet. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]
3. **CONFIRMED** Phase 013 scopes repairs to archive phrases, derivable metadata, structural anchors/frontmatter, generic phrases, links, and required documents reconstructed from the packet's own specification and git history. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:71] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:76]
4. **CONFIRMED** The phase 013 safety contract separates structure-only changes from document reconstruction: existing meaning must stay fixed, reconstructed docs need a dated note and explicit unknowns, and scripted changes must be idempotent with dry run before apply. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:79] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:102] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:151]

## Recommendations
| ID | recommendation | question answered | where it lives (file path) | effort | risk | files touched | evidence | standing |
|---|---|---|---|---|---|---|---|---|
| R1-01 | Keep the final audit ledger keyed by commit hash and distinguish committed branch changes from the live phase 013 corpus repair. Idempotent if keyed by immutable commit hash; reverse by deleting the report row; does not change packet content. | Q4 | specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/research.md | S | Low: reporting only | lineage research.md | The range contains both ten commits and separate uncommitted repair work. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:39] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:53] | INFERRED |

## Ruled Out
- Treating the Claude 5.5 roster commits as direct spec-folder tooling changes. The commit paths are Claude runtime and roster files; retain them in the branch ledger but do not analyze them as causes of spec validation failures. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49]

## Questions Answered
- None yet. This pass established scope and preservation constraints but did not answer any of the five research questions.

## Questions Remaining
- All five key questions remain open.

## Sources Consulted
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md` [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:39]
- `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md` [SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:41]
- `specs/system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent/implementation-summary.md` [SOURCE: specs/system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent/implementation-summary.md:48]
- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md` (working tree) [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt` and `detail3.txt`; headings were counted with `rg -c '^### '`.

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q3 preservation boundary and Q4 branch scope.
- Questions answered: none.

## Reflection
- The phase 013 document gives a useful repair taxonomy and explicit safety requirements. Its baseline totals still need comparison with the underlying reports before they are treated as reproduced counts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:151]
- The branch range includes adjacent Claude roster work, so the final report should distinguish the requested tooling changes from unrelated changes in the same range. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49]

## Recommended Next Focus
Build the failure-class taxonomy from the phase 013 reports, then trace the dominant metadata, anchor, integrity, and sufficiency classes to validator sources and producers. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:60] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:61]
