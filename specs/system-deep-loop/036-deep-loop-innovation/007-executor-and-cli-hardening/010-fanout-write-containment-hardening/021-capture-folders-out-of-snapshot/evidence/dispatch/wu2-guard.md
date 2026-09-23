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

TARGET: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts (1 file)

WHY: snapshotOutOfScopeDirtyPaths copies every untracked path outside the lane into
containment/baseline/, including capture folders an earlier run left in the tree. Each run then
copies the previous captures one level deeper, until paths pass the filesystem's length limit.
Captures are containment's own output, never a lane's work, so the snapshot must skip them.

EDIT 1 (OLD occurs exactly once: the end of the isUnattributable function)
OLD:
  if (unattributableFileRelPosix.some((file) => p === file)) return true;
  return unattributableRelPosix.some((dir) => p === dir || p.startsWith(`${dir}/`));
}
NEW:
  if (unattributableFileRelPosix.some((file) => p === file)) return true;
  return unattributableRelPosix.some((dir) => p === dir || p.startsWith(`${dir}/`));
}

/** The folders containment writes its own captures to: baseline copies and quarantine passes. */
const CAPTURE_DIRS = [join('containment', 'baseline'), PASS_QUARANTINE_DIR].map(toPosix);

/**
 * True for a path inside a capture folder, whichever run wrote it. Captures are containment's own
 * output, not a lane's work, so they never belong in a lane's baseline, and copying them there
 * nests captures inside captures, one level per run, until paths outgrow the filesystem's limit.
 */
function isContainmentCapturePath(repoRelativePath: string): boolean {
  const p = `/${toPosix(repoRelativePath)}`;
  return CAPTURE_DIRS.some((dir) => p.includes(`/${dir}/`));
}

EDIT 2 (OLD occurs exactly once, inside snapshotOutOfScopeDirtyPaths)
OLD:
    if (isUnattributable(entry.path, scope.unattributableRelPosix, scope.unattributableFileRelPosix)) continue;
NEW:
    if (isUnattributable(entry.path, scope.unattributableRelPosix, scope.unattributableFileRelPosix)) continue;
    if (isContainmentCapturePath(entry.path)) continue;

VERIFY - run these, paste each command with its result line
  grep -c 'isContainmentCapturePath' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts   # expect 2
  git diff --numstat -- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts   # expect 14 0

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
