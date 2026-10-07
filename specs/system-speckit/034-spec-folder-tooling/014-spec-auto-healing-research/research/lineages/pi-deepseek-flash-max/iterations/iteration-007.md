# Iteration 7: The long tail rule set and the archive policy tension

## Focus

Finish Q1 by capturing the long-tail repair rules the phase 013 lanes were given, and record the policy tension between the pipeline's archive protection and phase 013's archived-packet repairs. The lane brief is effectively a specification for a permanent heal tool.

## Actions Taken

- Read the first lane brief (`fix-lanes/batch-01.task`) in full and counted the lane briefs.
- Read the phase 013 success criteria, risks, NFRs and edge cases (working tree).
- Compared the archive policies of `upgrade-legacy.mjs` and `heal-spec-docs.cjs` against phase 013's archive scope.

## Findings

1. The lane brief encodes nine explicit repair rules: (1) never change what a document says, structure only; (2) anchors from the matching template with numbered duplicate ids; (3) missing required docs reconstructed from the folder's own spec.md and git history with a dated "Reconstructed on" first line and "Not recorded" for unknowns; (4) broken links pointed at the current path or de-linked while keeping text; (5) generic single-word phrases replaced by folder-slug phrases; (6) scaffold continuity placeholders replaced with explicit "not recorded" values; (7) status disagreements resolved by changing implementation-summary.md to match spec.md; (8) level set from the docs' own declarations per the structure reference; (9) template headers added after frontmatter. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task:1] CONFIRMED
2. The long tail ran as 43 parallel lane briefs, each validating its own folder list and re-running `repair-derived.cjs --apply` after edits; the lanes were explicitly told never to hand-edit `graph-metadata.json` or `description.json`. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task:8] CONFIRMED
3. Phase 013 makes the safety properties explicit as requirements: every scripted fix idempotent with a dry run before apply (NFR-R01), the full corpus passes or each exception is listed with its reason (SC-001), reconstructed documents open with a dated note and write "Not recorded" for unknowns, and archived packets keep their status with only structure and metadata changing. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:123] CONFIRMED
4. The archive policy tension is real and needs a stated reconciliation. `upgrade-legacy.mjs` says archived snapshots "are only ever recorded, never rewritten" (with `--include-archive` opting in deliberately), and `heal-spec-docs.cjs` hard-skips `z_archive` and `z_future`. Phase 013, by contrast, cleaned the archive's phrases and repaired every archived packet. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:40] CONFIRMED
5. The reconciliation that both records support: snapshot immutability protects what a document SAYS, while validation repair changes only structure, metadata and recorded paths. Phase 013 honored that line ("only structure and metadata change", "never change what a document says"), so an archive-safe heal is legitimate when it is structural-only and explicitly opted in. Without the reconciliation, the two policies read as contradictory to any external user. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:166] CONFIRMED as the two policies, INFERRED as the intended reconciliation
6. The lane rules include two classes no current tool can do at all: reconstructing a missing document from spec.md plus git history, and re-pointing broken links by searching the tree for the file's current path. Both are mechanical but currently lane work. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task:12] CONFIRMED
7. Phase 013's own risk table names the control that makes mass structural repair defensible: scripts change only marker lines, fields and paths; lanes are told structure only; diffs are sampled. That is the evidence standard an external-user heal path must reproduce in its own docs and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:135] CONFIRMED

## Ruled Out

- Treating the lane briefs as throwaway one-offs: the brief is a coherent nine-rule specification with proven safety properties, and most rules map onto idempotent transformations a tool can own.
- Reading the archive protection as an absolute prohibition on archive repair: the pipeline's own `--include-archive` opt-in and phase 013's completed archive repair show the intended line is prose preservation, not structural immutability.

## Dead Ends

- None; both evidence paths resolved on first read.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the archive policy pair in finding 4 is a genuine tension between two code paths; it is recorded here with both sources and the reconciliation, not resolved as a code change.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task`
- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`

## Assessment

- New information ratio: 0.80 (5 of 7 findings fully new; 2 consolidate the policy picture and count as half new)
- Questions addressed: Q1 completion evidence; Q3 archive-safety constraint
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-017 | Turn the lane's nine-rule set into permanent documented heal modes, one transformation per rule: anchor add/number, link re-point/de-link, slug phrase reseed, continuity placeholder fill, status align, level declare, header add; each dry-run first and idempotent, each refusing anything it cannot derive | Q1 | `heal-spec-docs.cjs` extended plus pipeline steps in `upgrade-legacy.mjs` | M to L | Med; it is structure-only by rule but touches many documents, so per-folder validation after each apply is the control | Heal tool, pipeline, tests | The nine rules are explicit and proven at corpus scale; the controls (structure only, sampled diffs, re-validate) are named in the phase spec | CONFIRMED rules, INFERRED tool decomposition | Yes if each rule is a fixed point (second run reports zero) | Revert the heal commit | No; structure and derived fields only |
| R-018 | State the archive-safe healing contract once, in the tool docs: archived snapshots are immutable in meaning, so structural repair is allowed only under an explicit `--include-archive` opt-in and only through marker/field/path changes; prose is never touched | Q3, Q4 | `heal-spec-docs.cjs` and `upgrade-legacy.mjs` docs, plus the doctor skill docs that surface it | S | Low; documentation and one flag path | Docs plus flag plumbing | upgrade-legacy:12 and heal-spec-docs.cjs:40 protect the archive; phase 013 repaired it structurally under the never-change-meaning rule | CONFIRMED tension, INFERRED contract wording | n/a (policy) | n/a | No |
| R-019 | Keep missing-document reconstruction and dead-link re-pointing as the two lane-eligible exceptions, but give the lanes tooling support: a reconstruction scaffold (dated note, "Not recorded" sentinels, template selection) and a dead-link candidate report (rg-based) | Q1, Q3 | Reconstruction helper beside `heal-spec-docs.cjs`; the report feeds lanes | M | Med; the helper must emit placeholders, never content | New helper plus report | Lane rules 3 and 4; the phase's dated-note requirement | CONFIRMED lane practice, INFERRED helper shape | Yes (scaffold is fixed-shape; report is read-only) | Revert the helper commit | No; the helper writes markers and placeholders only |

## Reflection

- What worked and why: reading the lane brief fully was cheap and repaid by giving the exact nine-rule specification that Q1 needs; it also exposed the archive tension immediately.
- What did not work and why: nothing failed this iteration; the two policy reads were targeted and both landed.
- What I would do differently: capture the archive tension as its own delta conflict row so the reducer can surface it, instead of folding it into prose only.

## Recommended Next Focus

Iteration 8: begin Q3 in earnest. Read `/doctor:update` (command doc, YAML assets, presentation, release-update script) to learn what update already detects and does to a user's tree, then map the heal pipeline onto it as the safe old-repo path.
