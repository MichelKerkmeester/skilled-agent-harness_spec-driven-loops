# Iteration 1: Correctness — commit hooks, allocator and rewrite callback semantics

## Focus

- Dimension: D1 Correctness (primary), with claim verification touching the advertised read path.
- Files reviewed: `.opencode/scripts/git-hooks/commit-msg`, `.opencode/scripts/git-hooks/prepare-commit-msg`, `.opencode/scripts/git-hooks/tests/commit-msg.test.sh`, `.opencode/skills/sk-git/scripts/commit-id-naming.sh`, `.opencode/skills/sk-git/SKILL.md` (§ Commit Message Logic), `.opencode/skills/sk-git/references/commit-workflows.md`, `.opencode/skills/sk-git/changelog/v1.6.0.0.md`, `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md`, `.opencode/specs/sk-git/028-crawlable-commit-history/005-history-rewrite/scripts/stamp-callback.py`.
- Scope investigated: subject grammar, trailer shaping, Commit-Id regex/collision path, allocator scan, amend/cherry-pick re-mint rules.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 10
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (all four findings new this iteration)

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: The blocking hook does not enforce that `Spec:` / `Commit-Id:` sit in the final contiguous trailer paragraph, yet every advertised reader depends on git's trailer parser. The hook scans every body line with an unanchored-at-end match (`^Commit-Id:` anywhere in the body is validated and accepted), so a message with prose after the key paragraph passes the "blocking structural validation" while `git log --format='%(trailers:key=Commit-Id,valueonly)'` no longer sees the key (git only parses the final paragraph). Evidence: `.opencode/scripts/git-hooks/commit-msg:150-167` (loop over all body lines, no positional check), contract at `.opencode/skills/sk-git/SKILL.md:491-493` ("The trailer paragraph is the commit's final paragraph"), advertised values query at `.opencode/skills/sk-git/changelog/v1.6.0.0.md:22` and `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md:49` (GIT-044 uses `%(trailers:...)`). The commit-msg suite has no positional case (`.opencode/scripts/git-hooks/tests/commit-msg.test.sh` cases 1-10). Fix shape: require the key lines to be the final paragraph (or move keys before a non-trailer line check).

**Claim adjudication packet — F001**

```json
{
  "findingId": "F001",
  "claim": "The commit-msg hook accepts Spec:/Commit-Id: keys anywhere in the body, even though the documented contract requires a final contiguous trailer paragraph and the advertised %(trailers:) read path only sees the final paragraph.",
  "evidenceRefs": [
    ".opencode/scripts/git-hooks/commit-msg:150-167",
    ".opencode/skills/sk-git/SKILL.md:491-493",
    ".opencode/skills/sk-git/changelog/v1.6.0.0.md:22",
    ".opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md:49"
  ],
  "counterevidenceSought": "Re-read the full hook for a final-paragraph or trailing-block test (none exists; TRAILER_RE at commit-msg:121 is classification-only), checked the 10-case harness for a misplaced-key case (none), and checked prepare-commit-msg:201-253 which appends keys at the end so the normal path happens to comply.",
  "alternativeExplanation": "The stamper guarantees placement in the default flow, so positional enforcement may have been judged redundant; rejected because the hook is documented as the blocking structural validator and GIT-044's third query would silently return nothing on a hook-accepted message.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the hook gains a final-paragraph check or the docs drop the %(trailers:) query in favor of --grep, downgrade to P2 advisory.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F002**: `Fixes:` and `Closes:` colon-form trailers are not recognized by the trailer whitelist. `TRAILER_RE` accepts only the space forms (`Fixes #123`, `Closes #123`); the conventional `Fixes: #123` falls through to "explanatory body" and is measured by the 100-character body warning. Evidence: `.opencode/scripts/git-hooks/commit-msg:121`.
- **F003**: Quoted `Commit-Id:` text in a commit body is treated as a real identifier by both scanners, so examples can block an unrelated commit or inflate the ordinal. The collision scan is a substring `--grep` (`.opencode/scripts/git-hooks/commit-msg:155-158`) and the allocator scans every message line for `^Commit-Id: [0-9]{7}$` (`.opencode/skills/sk-git/scripts/commit-id-naming.sh:66-69`). Fail-closed and bounded at 9,999,999, but a doc-quoting commit that names an existing id is refused with "already belongs to another commit".
- **F004**: "An amend keeps its id" holds only when the message already carries the trailer. `git commit --amend -m "..."` mints a fresh ordinal because `REQUIRE_ID=1` whenever `HAS_COMMIT_ID=0`. Evidence: `.opencode/scripts/git-hooks/prepare-commit-msg:7-8` (header comment), `:173-176` (re-mint decision), claim at `.opencode/skills/sk-git/SKILL.md:493` and `.opencode/skills/sk-git/changelog/v1.6.0.0.md:11`.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pending | hard | — | scheduled for the D3 iteration |
| checklist_evidence | pending | hard | — | scheduled for the D3 iteration |

## Assessment

- New findings ratio: 1.0. Severity-weighted: new weight 5(P1)×1 + 1(P2)×3 = 8 over a prior active weight of 0.
- Dimensions addressed: correctness.
- Novelty justification: all findings are code-reading findings on files not previously audited in this lineage; none are restatements of recorded packet decisions. The rewrite callback (`stamp-callback.py`) and allocator were read for this dimension and showed no additional correctness defect beyond F003.

## Ruled Out

- `BASH_REMATCH` group numbering in the subject regex: verified group 4 is `!` and group 5 the summary given the nested `(-[a-z0-9]+)*` group (`commit-msg:72-77`); no off-by-one.
- Cherry-pick re-mint: correct by design (drops copied ids, `prepare-commit-msg:130-152`, re-mint at `:174`), matching SKILL.md:493.
- Overlapping pass ordering in `stamp-callback.py` (`stamp_message` before `remap_message`): ids are 7 digits, outside the 10-40 hex token pattern (`stamp-callback.py:51`), so pass 2 cannot corrupt stamped ids.
- Lock reclaim correctness in the allocator (stale-lock rename protocol, `commit-id-naming.sh:95-152`): logic is serialized by rename; no double-hold found.

## Dead Ends

- Searching for a missing blank line before the trailer paragraph: `commit-msg:52-62` errors when the body does not start after a blank line, and `stamp-callback.py:152-158` inserts the blank line; no gap found.
- Testing whether `git stripspace --strip-comments` could transform keys: it normalizes whitespace but does not move lines; positional gap is F001's, not here.

## Recommended Next Focus

D2 Security: the bypass surface (`SPECKIT_SKIP_COMMIT_MSG_VALIDATE`, `SPECKIT_SKIP_PREPARE_COMMIT_MSG`), injection through message content passed to `git log --grep`, path/quoting safety in the 005 rewrite scripts, and the push-gating in `pre-push` as it relates to the rewritten refs.

Review verdict: CONDITIONAL
