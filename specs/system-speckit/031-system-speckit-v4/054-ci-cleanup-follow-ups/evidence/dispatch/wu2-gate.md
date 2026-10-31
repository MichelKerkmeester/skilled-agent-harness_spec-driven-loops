GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups
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

TARGET: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (1 file)

WHY: isExemptTargetPath exempts every path under /tmp before it checks containment. The next line
already exempts anything outside the repo, which covers /tmp scratch space for a repo that lives
elsewhere, so the /tmp rule only changes the outcome when the repo itself sits under /tmp, and there
it switches the gate off for every write. That is how the gate suites fail on a Linux runner, whose
temp dir is /tmp. Drop the rule and its now-unused helper.

EDIT 1 (OLD occurs exactly once: the helper, with the blank line after it)
OLD:
function isUnderAnyRoot(absolutePath, roots) {
  return roots.some((root) => absolutePath === root || absolutePath.startsWith(`${root}/`));
}

function isPathWithin(parentAbsolute, candidateAbsolute) {
NEW:
function isPathWithin(parentAbsolute, candidateAbsolute) {

EDIT 2 (OLD occurs exactly once: the doc comment of isExemptTargetPath)
OLD:
 * Exempt path classes that must never be blocked: the spec tree itself
 * (writing it IS the Gate-3 workflow), /tmp scratch space, dist output,
 * node_modules, .git, and anything outside the repo. Substitutes for the
NEW:
 * Exempt path classes that must never be blocked: the spec tree itself
 * (writing it IS the Gate-3 workflow), dist output, node_modules, .git, and
 * anything outside the repo, which already covers /tmp scratch space. A repo
 * that itself lives under /tmp is gated like any other. Substitutes for the

EDIT 3 (OLD occurs exactly once)
OLD:
  if (isUnderAnyRoot(absolute, ['/tmp', '/private/tmp'])) return true;
  if (!isPathWithin(projectDirReal, absolute)) return true;
NEW:
  if (!isPathWithin(projectDirReal, absolute)) return true;

VERIFY - run these, paste each command with its result line
  grep -c 'isUnderAnyRoot' .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs   # expect 0
  node --check .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs && echo syntax-ok   # expect syntax-ok

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
