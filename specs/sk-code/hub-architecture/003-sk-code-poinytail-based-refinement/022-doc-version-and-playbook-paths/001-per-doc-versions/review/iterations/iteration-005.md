# Deep Review - Iteration 005 (correctness, adversarial convergence pass)

Dimension this iteration: **correctness (D1)** - the six git-state behaviors the brief names (a staged doc followed by a pathspec commit, an amend, a merge commit, a doc deleted, a version hand-lowered, an initial commit with no HEAD) and the f60fa8adac citation re-anchor.

Method: read-only on the reviewed tree, plus executable probes in throwaway git repositories under /tmp (sanctioned by the iteration brief). No reviewed file was modified; no repo build, test suite or generator was run. Each scratch repo gets a copy of the real hook installed under .git/hooks and a symlink to the real engine, the same shape the committed harness uses [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:944]. The probes ran hermetically (GIT_CONFIG_GLOBAL=/dev/null), matching the harness [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:28]; without it the machine's global gitignore hides .opencode/ from git add and every scenario fails for the wrong reason.

## Dimension

correctness. Two focus questions:

1. Do the six git states raise wrongly, crash, or pass silently?
2. Did f60fa8adac move every citation to the line it named before the restore?

## Files Reviewed

- .skilled/scripts/git-hooks/pre-commit - doc-version gate: HEAD guard [SOURCE: .skilled/scripts/git-hooks/pre-commit:841], staged-doc pre-filter [SOURCE: .skilled/scripts/git-hooks/pre-commit:845], pathspec check branch [SOURCE: .skilled/scripts/git-hooks/pre-commit:862], normal auto-raise branch [SOURCE: .skilled/scripts/git-hooks/pre-commit:875], index-arrival proof [SOURCE: .skilled/scripts/git-hooks/pre-commit:903].
- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs - nextEdition [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:315], changedDocs [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346], bumpDocs [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:378], merge-base guard [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384], raise decision [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410], write [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:437].
- .skilled/scripts/git-hooks/tests/pre-commit.test.sh - cases 67-73 [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:929]; frontmatter-only pin [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:966]; pathspec refusal [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:992].
- f60fa8adac full diff; its 7 playbook docs at HEAD; cited targets .skilled/skills/sk-code/shared/references/stack-detection.md:30 and .skilled/skills/system-deep-loop/deep-review/README.md:80.
- Scratch fixtures /tmp/docv3.* (eight repos: A, A2, B, C, C2, D, E1, E2, F, G) and /tmp/verify-reanchor.mjs.

## Findings by Severity

### P0

None.

### P1

None this iteration. R3-P1-001 remains active in the registry; this iteration neither changes nor resolves it.

### P2

None this iteration. The eight open P2s (R1-P2-001..003, R2-P2-001..003, R3-P2-001, R4-P2-001) are unchanged.

## Adversarial Probe Results (correctness)

| # | Scenario | Observed | Ruling |
| --- | --- | --- | --- |
| A | doc staged at 1.2.0.0, body changed, then a pathspec commit | rc=1, "narrows its", commit count unchanged, index still 1.2.0.0 | correct: a raise staged into the throwaway next-index would be discarded, so it blocks [SOURCE: .skilled/scripts/git-hooks/pre-commit:862] |
| A2 | pathspec commit of an unrelated path while the doc stays staged | rc=0, gate silent, doc still staged at 1.2.0.0 | correct: the temp index never held a skill doc; the next normal commit's gate is where the raise belongs |
| B | git commit --amend with a staged body change; then an empty amend | rc=0 and 1.2.0.0 to 1.2.1.0 staged; empty amend rc=0 | correct: the engine diffs against the amended HEAD [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384] |
| C | clean merge of a branch commit made with the documented bypass | rc=0, no hook output, merged version stays 1.2.0.0 | boundary: the bypass is explicit, a clean merge adds no content, and CI's PR job reruns bump --check |
| C2 | conflicted merge resolved with version 1.2.0.0 (base 1.2.1.0) and committed | resolution commit ran the gate, rc=0, 1.2.0.0 to 1.2.2.0 staged | correct: merge content a human introduces is gated |
| D | doc deletion staged via git update-index --force-remove, then commit | rc=0, gate silent, path untracked | correct: --diff-filter=AMR excludes deletions [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346] |
| E1 | body change plus version hand-lowered to 1.1.0.0 | raised 1.1.0.0 to 1.2.1.0 (base+1) | correct: monotonic raise against the merge base [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410] |
| E2 | version hand-lowered with no body change | rc=0, gate silent, 1.1.0.0 committed, bump --check rc=0 | by design: a frontmatter-only change raises nothing, pinned by the harness [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:966] |
| F | initial commit with no HEAD, doc carrying no version | engine rc=1 "cannot find the merge base of HEAD and HEAD"; hook skipped the gate; first commit rc=0 | correct: the guard skips only the state the engine cannot compare [SOURCE: .skilled/scripts/git-hooks/pre-commit:841] |
| G | commit with node absent from PATH | rc=0, gate silent, no warning, version unchanged | boundary, family-consistent: route-remint and spec-remint share the silent shape [SOURCE: .skilled/scripts/git-hooks/pre-commit:496] [SOURCE: .skilled/scripts/git-hooks/pre-commit:691]; the PR check is the net |

Answer: no scenario raised wrongly or crashed. Four scenarios pass with the gate silent (C, E2, F, G); each is a documented boundary - an explicit bypass, the pinned frontmatter-only rule, a state with no comparison base, and a missing prerequisite that also disables the sibling re-mint gates - and none loses a raise that was owed. The conflict-resolution merge, the one merge path that introduces new content, is gated.

## Re-anchor Verification (f60fa8adac)

- 20 changed lines = 13 citation lines (carrying 15 citations) + 7 version raises. All 7 raises equal nextEdition(old): third segment +1, fourth reset [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:315].
- All 13 changed citation lines cite the two docs the restore shifted (stack-detection.md, the deep-review README); every shifted number moved +1. The one line carrying two citations moved only the shifted one (stack-detection 45-50 to 46-51, ROUTER.md 555-559 unchanged).
- The 4 citation lines the commit does not touch cite unshifted targets (code_surface_detection.md, ROUTER.md): no over-correction.
- Resolution against the pre-removal tree (31888d05bb^): all 17 citation-bearing lines at f60 carry the same numbers as before the removal (0 mismatches), and the cited windows at those numbers are identical (0 diffs). git diff f60fa8adac..HEAD on the playbook subtree is empty, so the verified state is the current HEAD state.
- The 5 dated citations the commit deliberately leaves alone fall outside this sweep (exact search over sk-design finds no stack-detection or deep-review citation), which matches the commit's stated dated-record boundary.

## Traceability Checks

- Carried from iterations 2-4, not re-run: spec_code partial (REQ-005 FAIL, R3-P1-001); checklist_evidence FAIL as recorded (R3-P1-001); skill_agent pass; agent_cross_runtime pass; feature_catalog_code partial; playbook_capability partial.
- citation_reanchor (traceability, this iteration): PASS - 13/13 shifted-target citation lines moved +1; 17/17 living citation lines carry pre-removal numbering; 0/17 window diffs.
- git_state_probes (correctness, this iteration): PASS - 10 probes, 0 wrong raises, 0 crashes, 0 lost raises.

## Verdict

No new P0, P1 or P2. The iteration-5 focus is closed: every git-state probe matches the engine's documented contract, including the conflict-resolution merge, and the re-anchor commit restores every living citation into the shifted docs to the numbering it carried before the restore. The run's carrying condition remains the prior P1 R3-P1-001; synthesis recomputes the release verdict from the registry.

## Next Dimension

None - iteration 5 of 5; stopPolicy max-iterations reached.

Review verdict: PASS
