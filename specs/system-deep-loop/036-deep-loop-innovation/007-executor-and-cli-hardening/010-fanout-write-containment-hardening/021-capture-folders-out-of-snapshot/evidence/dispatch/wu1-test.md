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

WHY: a fan-out snapshot copies every untracked path outside the lane into containment/baseline/,
including capture folders an earlier run left behind, so captures nest inside captures one level
per run. This test pins the fix before it exists, so it must FAIL against the current code.

EDIT 1 (OLD occurs exactly once: the end of the "marks a file over the per-file bound truncated"
test and the close of the "baseline content capture" describe block)
OLD:
    expect(existsSync(join(captureDir, 'containment/baseline/big-outside.bin'))).toBe(false);
  });
});
NEW:
    expect(existsSync(join(captureDir, 'containment/baseline/big-outside.bin'))).toBe(false);
  });

  it('skips capture folders an earlier run left in the tree, so a capture never copies a capture', () => {
    const { root, artifactDir } = baselineRepo();
    const captureDir = makeCaptureDir();
    const earlierBaseline = join(root, 'specs/other/lineages/a/containment/baseline/deep');
    const earlierQuarantine = join(root, 'specs/other/review/containment/quarantine/pass-1');
    mkdirSync(earlierBaseline, { recursive: true });
    mkdirSync(earlierQuarantine, { recursive: true });
    writeFileSync(join(earlierBaseline, 'file.txt'), 'EARLIER_CAPTURE\n');
    writeFileSync(join(earlierQuarantine, 'manifest.json'), '{}\n');
    writeFileSync(join(root, 'new-outside.txt'), 'new\n');

    const dirty = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir, captureContentDir: captureDir });

    expect(dirtySorted(dirty)).toEqual(['new-outside.txt']);
    expect(existsSync(join(captureDir, 'containment/baseline/specs'))).toBe(false);
  });
});

VERIFY - run these, paste each command with its result line
  grep -c 'a capture never copies a capture' .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts   # expect 1
  git diff --numstat -- .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts   # expect 17 0

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
