GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof
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
- If an OLD text is not found the stated number of times, skip that EDIT, do the rest, and report it
  under failures. Never guess a nearby match.

TARGET: .github/workflows/routing-registry-drift.yml (1 file, 3 lines change)

WHY: the 033-json-optimization-implementation packet moved under specs/sk-doc/z_archive/, so the
corpus gate step fails with FileNotFoundError on the routing baseline, and two push path filters
watch a folder that no longer exists. The sibling 015-router-unification-program lines did not move
and must stay exactly as they are.

EDIT 1 (replace ALL occurrences; the OLD substring occurs exactly 3 times, on lines 65, 109 and 269)
OLD: specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/
NEW: specs/sk-doc/z_archive/019-skill-routing-refactor/033-json-optimization-implementation/

Accept when: exactly 3 lines differ, and each differs only by the inserted "z_archive/".

VERIFY - run these, paste each command with its result line
  grep -c 'specs/sk-doc/z_archive/019-skill-routing-refactor/033-json-optimization-implementation/' .github/workflows/routing-registry-drift.yml   # expect 3
  grep -c 'sk-doc/019-skill-routing-refactor/033-json' .github/workflows/routing-registry-drift.yml   # expect 0
  grep -c 'sk-doc/019-skill-routing-refactor/015-router-unification-program' .github/workflows/routing-registry-drift.yml   # expect 2
  git diff --numstat -- .github/workflows/routing-registry-drift.yml   # expect 3 3

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
