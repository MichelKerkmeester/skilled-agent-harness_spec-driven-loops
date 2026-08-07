# Iteration 001 - Correctness

Focus: constitutional comment-hygiene enforcement versus executable checker behavior.

## Files Reviewed

- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`

## Finding

### F001 - P1 - Comment-hygiene checker misses several exact forbidden examples from the constitutional rule

The constitutional rule forbids spec-folder paths, packet/phase numbers, ADR ids, task/checklist/requirement ids, and finding ids in code comments [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:34]. Its examples include `.opencode/specs/012-foo/`, bare `REQ-042`, bare `CHK-007`, bare `T042`, and `finding #7` [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:42] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:45] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:46] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:47].

The checker regexes do not cover those exact shapes. It matches `REQ-\d+[-:]`, `CHK-\d+[-:]`, and `T\d{3,4}[-/]`, so the bare examples in the rule do not match [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:87] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:88] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:90]. It also matches `review finding`, not `finding #7` [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:96], and the spec-path regex only covers a nested `specs/<track>/<NNN>-` shape rather than the root spec-path example [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:93].

Impact: a commit can satisfy the checker while still violating the constitutional rule's own forbidden examples. That makes the governance rule weaker than advertised and creates false confidence around pre-commit enforcement.

Fix: align the checker regexes and tests with every forbidden class in the constitutional table. At minimum, cover bare `REQ-\d+`, bare `CHK-\d+`, bare `T\d+`, `finding #\d+`, `P\d-finding-\d+`, and root `.opencode/specs/<NNN>-...` paths.

## Claim Adjudication Packet

```json
{
  "findingId": "F001",
  "claim": "The executable checker does not detect several exact forbidden examples listed by the constitutional comment-hygiene rule.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:34",
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:42",
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:45",
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:46",
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:47",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:87",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:88",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:90",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:93",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:96"
  ],
  "counterevidenceSought": "Checked checker allowed patterns and violation patterns for alternate bare-id or finding-number coverage.",
  "alternativeExplanation": "The examples could be illustrative rather than exhaustive, but the same table labels them forbidden and the trigger list names those exact classes.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if another enforced hook or validator catches those exact shapes before commit."
}
```

Review verdict: CONDITIONAL
