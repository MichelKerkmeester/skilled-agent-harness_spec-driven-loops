GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @code, a LEAF implementation executor at depth 1. You make exactly the edit described,
run the named VERIFY commands, and return one handback block. Nested dispatch is illegal: do not start
another pi, cli or agent process. If you cannot finish, stop and report where.

Repo root: the current working directory (all paths from there).

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no command beyond the VERIFY commands.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- Never put spec paths, packet or phase numbers, or task ids in code comments.
- If an OLD text is not found exactly once, skip that EDIT, do the rest, and report it under
  failures. Never guess a nearby match.

TARGET: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts (1 file, 1 test added)

WHY: the snapshot now skips capture folders, so they are no longer in the baseline that detection
subtracts. Detection must skip them too, or every capture an earlier run left in the tree becomes a
new violation. This test pins that and must FAIL against the current detection code.

EDIT 1 (OLD occurs exactly once: the end of the test added just before this one)
OLD:
    expect(dirtySorted(dirty)).toEqual(['new-outside.txt']);
    expect(existsSync(join(captureDir, 'containment/baseline/specs'))).toBe(false);
  });
NEW:
    expect(dirtySorted(dirty)).toEqual(['new-outside.txt']);
    expect(existsSync(join(captureDir, 'containment/baseline/specs'))).toBe(false);
  });

  it('does not report capture folders an earlier run left in the tree as new violations', () => {
    const { root, artifactDir } = baselineRepo();
    const earlier = join(root, 'specs/other/lineages/a/containment/baseline/deep');
    mkdirSync(earlier, { recursive: true });
    writeFileSync(join(earlier, 'file.txt'), 'EARLIER_CAPTURE\n');
    const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    writeFileSync(join(artifactDir, 'iter.md'), 'iteration\n');

    const violations = detectNewOutOfScopeViolations({ repoRoot: root, artifactDir, preDispatchDirtyPaths });

    expect(violations).toEqual([]);
  });

VERIFY - run these, paste each command with its result line
  grep -c 'as new violations' .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts   # expect 1

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
