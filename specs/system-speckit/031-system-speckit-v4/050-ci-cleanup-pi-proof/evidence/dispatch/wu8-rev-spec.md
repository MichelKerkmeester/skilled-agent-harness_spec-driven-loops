GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You apply literal text replacements to one
spec document and return one handback block. Nested dispatch is illegal: do not start another pi, cli or
agent process.

Repo root: the current working directory (all paths from there).
P = specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof

ROLE
Apply the numbered EDITS below to the one TARGET file, exactly as written. Each EDIT gives the OLD text,
copied from the file as it is now, and the NEW text that replaces it. An INSERT gives an ANCHOR line
that exists in the file and the NEW lines to add directly after it.

DON'T
- No git state change of any kind. No nested CLI, no agent dispatch, no scripts beyond VERIFY.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- If an OLD text or ANCHOR line is not found exactly once, skip that EDIT, do the rest, and report it
  under failures. Never guess a nearby match.

TARGET: P/spec.md

EDIT 1 (the Files to Change row for the baseline: full path)
OLD: | `scorer-eval-baseline.json` | Modify |
NEW: | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify |

EDIT 2
OLD: | cli-jev compiled-routing manifest | Regenerate |
NEW: | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json` | Regenerate |

EDIT 3 (replace the parent-records row with two named rows)
OLD: | `specs/system-speckit/033-system-speckit-v4/` parent records | Modify | The parent records are reconciled and register phase 50 |
NEW: | `specs/system-speckit/033-system-speckit-v4/spec.md` | Modify | Phase map row 50 and the 049 to 050 handoff row register this phase |
| `specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md` | Modify | One Verification row records this phase's live Pi proof |

EDIT 4
OLD: | Dependency | Merged main before the cli-jev compiled-routing re-mint | N/A - insufficient source context |
NEW: | Dependency | Merged main before the cli-jev compiled-routing re-mint | Medium |

EDIT 5
OLD: | Risk | The skill-advisor hook CLI fallback times out and logs CLI_RETRYABLE_UNAVAILABLE exit 75 | N/A - insufficient source context |
NEW: | Risk | The skill-advisor hook CLI fallback times out and logs CLI_RETRYABLE_UNAVAILABLE exit 75 | Low |

EDIT 6
OLD: | Risk | The TUI capture carries a tmux extended-keys warning | N/A - insufficient source context |
NEW: | Risk | The TUI capture carries a tmux extended-keys warning | Low |

EDIT 7
OLD: | Risk | The re-mint refuses while the scorer freeze is stale | N/A - insufficient source context |
NEW: | Risk | The re-mint refuses while the scorer freeze is stale | Medium |

EDIT 8
OLD: | Risk | Pushing local main carries the other session's two unpushed commits f5a89115b1 and 2c8f243607 | N/A - insufficient source context |
NEW: | Risk | Pushing local main carries the other session's two unpushed commits f5a89115b1 and 2c8f243607 | Medium |

EDIT 9
OLD: - External service failure: N/A - insufficient source context
NEW: - External service failure: the skill-advisor hook CLI fallback can time out during a live Pi run. The hook fails open and the run continues with freshness unavailable.

EDIT 10
OLD: - Concurrent access: N/A - insufficient source context
NEW: - Concurrent access: another session works in the primary checkout at the same time. This phase writes only in worktree 061 and leaves the primary checkout's dirty entries untouched.

EDIT 11
OLD: - Partial completion: N/A - insufficient source context
NEW: - Partial completion: if the merged-tree re-verification fails, nothing is pushed. The phase commit can be reverted and the cli-jev manifest re-minted or restored.

VERIFY - run these, paste each command with its result line
  grep -c 'N/A - insufficient source context' P/spec.md      # expect 15
  grep -c '| Medium |\|| Low |' P/spec.md                    # expect 5
  grep -c '<!-- /\?ANCHOR:' P/spec.md                        # expect 22
(replace P with the full folder path when you run them)

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
