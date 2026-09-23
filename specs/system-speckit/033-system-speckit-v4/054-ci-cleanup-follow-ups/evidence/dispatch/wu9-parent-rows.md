GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You make exactly the edit described,
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

TARGETS: specs/system-speckit/033-system-speckit-v4/spec.md and specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/spec.md (2 files, 4 edits)

WHY: two new child phases need their rows in the parent phase maps and handoff tables. Rows only. Do not touch any
other line. Each ANCHOR line occurs exactly once. Keep it and add the NEW line right after it, or replace it where the
edit says REPLACE.

EDIT 1 in specs/system-speckit/033-system-speckit-v4/spec.md (ANCHOR, add one row after it)
ANCHOR: | 53 | 053-legacy-template-default-detection/ | Template default text already left in older packets is reported as a warning by exact match, without changing any exit code. A repository baseline records how much remains, and a read-only `gpt-6-luna` sample measures whether a cheap backfill is viable | planned |
NEW: | 54 | 054-ci-cleanup-follow-ups/ | The spec gate stops exempting a repository that itself lives under /tmp, so the CI temp-dir workaround goes, two playbooks stop describing the old rule, and the six recorded cli-jev probe scripts run under pipefail, which clears the drift guard's last errors | complete |

EDIT 2 in specs/system-speckit/033-system-speckit-v4/spec.md (ANCHOR, add one row after it)
ANCHOR: | 052-core-template-canonical-markers | 053-legacy-template-default-detection | 053 matches against the retired-default list that 052 records, so 052 must close first | 053 validates strict, the legacy-default warning leaves every exit code unchanged, and the baseline counts are recorded |
NEW: | 050-ci-cleanup-pi-proof | 054-ci-cleanup-follow-ups | 050 is Complete and leaves the spec gate's /tmp rule, its CI workaround and six cli-jev scripts without pipefail, and 054 shares no files with 051 to 053 | 054 validates strict, every spec-gate suite passes with the temp dir at /tmp and the drift guards report 0 errors |

EDIT 3 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/spec.md (ANCHOR, add one row after it)
ANCHOR: | 20 | `020-direct-append-sites-through-gateway/` | complete | Stop a projection refresh from dropping state-log rows the command YAMLs still append directly: every remaining direct append goes through the gateway, and the exemptions that allowed them are retired. |
NEW: | 21 | `021-capture-folders-out-of-snapshot/` | complete | Keep containment's own capture output out of every later run's snapshot and violation detection, and stop tracking it so a worktree can be removed again. |

EDIT 4 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/spec.md (REPLACE this whole line)
OLD: | 020-direct-append-sites-through-gateway | 021-capture-folders-out-of-snapshot | [Criteria TBD] | [Verification TBD] |
NEW: | 020-direct-append-sites-through-gateway | 021-capture-folders-out-of-snapshot | the successor's goal criteria, checked in its `goal.md` | the successor's `validate.sh --strict` PASSED and its full-suite record |

VERIFY - run these, paste each command with its result line
  grep -c '^| 54 | 054-ci-cleanup-follow-ups/' specs/system-speckit/033-system-speckit-v4/spec.md   # expect 1
  grep -c '^| 050-ci-cleanup-pi-proof | 054-ci-cleanup-follow-ups' specs/system-speckit/033-system-speckit-v4/spec.md   # expect 1
  grep -c '021-capture-folders-out-of-snapshot' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/spec.md   # expect 2
  grep -c 'TBD' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/spec.md   # expect 0
  git diff --numstat -- specs/system-speckit/033-system-speckit-v4/spec.md specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/spec.md   # expect 2 0 and 2 1

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
