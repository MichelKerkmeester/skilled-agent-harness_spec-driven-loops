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
First run the STEP 0 command exactly as written, if the body has one. Then apply the numbered EDITS below to the one TARGET file, exactly as written. Each EDIT gives the OLD text,
copied from the file as it is now, and the NEW text that replaces it. An INSERT gives an ANCHOR line
that exists in the file and the NEW lines to add directly after it.

DON'T
- No git state change of any kind. No nested CLI, no agent dispatch, no commands beyond STEP 0 and VERIFY.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- If an OLD text or ANCHOR line is not found exactly once, skip that EDIT, do the rest, and report it
  under failures. Never guess a nearby match.

TARGET: P/implementation-summary.md

EDIT 1
OLD:     last_updated_at: "2026-09-23T06:00:00Z"
NEW:     last_updated_at: "2026-09-23T12:30:00Z"

EDIT 2
OLD:     recent_action: "T001-T016 done: main merged, cli-jev re-minted, merged tree verified"
NEW:     recent_action: "T001-T018 done: pushed 5b522489a2, CI green on both branches"

EDIT 3
OLD:     next_safe_action: "Push after the operator's yes, watch CI, remove the worktree"
NEW:     next_safe_action: "Remove the worktree after the closing push"

EDIT 4 (INSERT two lines directly after this ANCHOR line)
ANCHOR:       - "evidence/dispatch/evidence.md"
NEW:
      - ".github/workflows/routing-registry-drift.yml"
      - ".github/workflows/spec-kit-check.yml"

EDIT 5
OLD:     completion_pct: 90
NEW:     completion_pct: 100

EDIT 6
OLD: | **Status** | In Progress |
NEW: | **Status** | Complete |

EDIT 7
OLD: | **Completed** | Pending |
NEW: | **Completed** | 2026-09-23 |

EDIT 8 (INSERT two rows directly after this ANCHOR line)
ANCHOR: | `recursive-child-manifest.vitest.ts` | Modified | Two hardcoded .opencode/specs paths corrected to the tracked specs/ tree |
NEW:
| `.github/workflows/routing-registry-drift.yml` | Modified | The corpus gate and two push path filters read the json-optimization baseline from its z_archive/ location |
| `.github/workflows/spec-kit-check.yml` | Modified | The runtime vitest step runs with TMPDIR set to the runner's temp dir, outside the spec gate's /tmp exemption |

EDIT 9
OLD: and the dispatch briefs wu1 to wu8 with their handbacks
NEW: and the dispatch briefs wu1 to wu14 with their handbacks

EDIT 10 (replace one line with four paragraphs)
OLD: T001-T016 are done and T017 is open. The work is committed and merged on the worktree branch, and nothing is pushed yet.
NEW:
The first push published the phase at 997cd8ee2e to main and skilled/v4.0.0.0. CI passed 13 workflows and failed two steps that the six fixed surfaces had hidden, because a workflow stops at its first failing step. The routing-accuracy corpus gate read the json-optimization baseline from a path that had moved under specs/sk-doc/z_archive/. The runtime vitest project failed five Pi enforce tests in spec-gate-pi-extension.vitest.ts. The spec gate exempts every write under /tmp, and os.tmpdir() is /tmp on the Linux runner, so every write in that suite was exempt. The same five failures reproduced locally with TMPDIR=/tmp.

The first fix for the Pi suite moved its workspace into a gitignored tests/.tmp- folder, and it failed. The gate anchors its state to the repository root and hoists any path under .skilled or .opencode to that root, so the suite's state landed in the real repository. That edit was reverted, and the stray state file it wrote was backed up and removed with the operator's yes. The shipped fix sets TMPDIR to the runner's temp dir on the runtime vitest step, which matches a macOS run, where the temp dir sits under /var/folders. The corpus gate fix repoints the step and the two path filters to the z_archive/ location. Both fixes ran through cli-pi as wu11 and wu13, and wu12 is the reverted attempt.

Main had moved again, so the two fix commits b566f9fc28 and 5b522489a2 were rebased onto it. On the rebased tree the corpus gate passed in CI's no-sqlite mode and the Pi suite passed 9 of 9 with a temp dir outside /tmp. The second push fast-forwarded both branches to 5b522489a2, and all 21 workflow runs passed.

T001-T018 are done. The worktree is removed after the closing commit is pushed, because the worktree holds that commit.

EDIT 11 (INSERT two rows directly after this ANCHOR line)
ANCHOR: | Rebuild handover.md from the template | The earlier hand-written handover had no frontmatter, no template header and no anchors, which produced three of the five strict-validation errors |
NEW:
| Point CI's TMPDIR at the runner's temp dir rather than move the Pi suite's workspace | The gate anchors its state to the repository root, so a workspace inside the checkout cannot be isolated, and the /tmp exemption is a deliberate gate rule this phase does not weaken |
| Rebase the two fix commits onto main before the second push | Main had moved with commits that touched none of this phase's files, and the rebased tree was re-verified before the push |

EDIT 12 (INSERT four rows directly after this ANCHOR line)
ANCHOR: | `node .skilled/bin/compiled-route-admission.cjs --all` on the merged tree | WARN. Six hubs pass. sk-design reports 1 drift, the same as on origin/main, and CI runs this check with --warn-only |
NEW:
| CI on the first push, `997cd8ee2e` | FAIL on two steps. 13 workflows passed on both branches. The routing-accuracy corpus gate failed with FileNotFoundError on the moved baseline, and the runtime vitest project failed 5 Pi enforce tests |
| `spec-gate-pi-extension.vitest.ts` with TMPDIR=/tmp, then with the default temp dir | The CI failure reproduced with 5 failed and 4 passed. With a temp dir outside /tmp it passed 9 of 9, exit 0 |
| `score-routing-corpus.py` with CI's floors and no skill-graph.sqlite on the rebased tree | PASS. accuracy 0.5436, TT 103, FT 3, FF 1, overall_pass true, exit 0 |
| CI on the second push, `5b522489a2` | PASS. All 21 workflow runs passed, 10 on main and 11 on skilled/v4.0.0.0. The runtime vitest project passed 106 files and 1292 tests with 13 skipped |

EDIT 13 (replace the whole fourth Known Limitations item)
OLD: 4. **The primary checkout holds this phase's scaffold residue.** The scaffold ran against the primary checkout path, so the primary checkout's parent spec.md carries two placeholder rows and an untracked copy of the original 050 scaffold folder sits beside it. Both block updating the primary checkout's main to the phase commit, and removing them waits for the operator's yes at the merge step.
NEW: 4. **The primary checkout was left to its owning session.** The scaffold residue this phase planted there was backed up and removed with the operator's yes. The primary checkout's main was not synced, because another session owns that checkout and holds uncommitted work in it, including new 050 to 052 phase folders whose number 050 collides with this phase.

EDIT 14 (INSERT two items directly after this ANCHOR line, each with one blank line before it)
ANCHOR: 5. **Phase 030 fails strict validation on its own goal.md.** Its durable slice is 6498 characters against a 4000 limit. That predates this phase and sits outside its scope, so the parent's recursive strict run stays red on that one phase.
NEW:

6. **Other spec-gate suites still build their workspace under os.tmpdir().** spec-gate-core.test.mjs and the devin and cursor spec-gate tests would hit the same /tmp exemption on a Linux machine whose temp dir is /tmp. CI does not run them, and the Pi suite fails the same way on such a machine outside CI.

7. **One runtime test fails locally only.** opencode-plugins-folder-purity.vitest.ts cannot import the unbuilt cli-communication-projection dist in this worktree. CI builds that dist and the test passes there.

VERIFY - run these, paste each command with its result line
  grep -c 'In Progress\|Pending' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md   # expect 0
  grep -c '5b522489a2' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md   # expect 4
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md   # expect 12

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
