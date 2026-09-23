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

TARGET: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs (1 file)

WHY: the spec gate exempts every write under /tmp, so a repository that itself lives under /tmp is
never gated. The gate is about to drop that rule, because "anything outside the repo" already
exempts /tmp scratch space for a repo that lives elsewhere. This test pins the new behavior and must
FAIL against the current gate.

EDIT 1 (OLD occurs exactly once: the workspace helper's first two lines)
OLD:
function makeWorkspace() {
  const root = mkdtempSync(join(tmpdir(), 'spec-gate-test-'));
NEW:
function makeWorkspace(base = tmpdir()) {
  const root = mkdtempSync(join(base, 'spec-gate-test-'));

EDIT 2 (OLD occurs exactly once: the comment inside the path traversal test)
OLD:
    // "/tmp/../<real source file>" starts with the exempt "/tmp/" prefix as a
    // raw string, but resolves to a real in-repo file -- it must still deny.
NEW:
    // "/tmp/../<real source file>" reads as a path outside the repo as a raw
    // string, but resolves to a real in-repo file -- it must still deny.

EDIT 3 (OLD occurs exactly once: the first line of the exempt-path test; add a test before it)
OLD:
test('exempt path: /tmp scratchpad, dist, node_modules, .git, out-of-repo', () => {
NEW:
test('a repository rooted under /tmp is gated like any other', () => {
  const { root } = makeWorkspace('/tmp');
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the sync job', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: join(root, 'src', 'login.ts'),
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny');
  } finally {
    cleanup(root);
  }
});

test('exempt path: /tmp scratchpad, dist, node_modules, .git, out-of-repo', () => {

VERIFY - run these, paste each command with its result line
  grep -c 'gated like any other' .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs   # expect 1
  grep -c 'function makeWorkspace(base = tmpdir())' .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs   # expect 1

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
