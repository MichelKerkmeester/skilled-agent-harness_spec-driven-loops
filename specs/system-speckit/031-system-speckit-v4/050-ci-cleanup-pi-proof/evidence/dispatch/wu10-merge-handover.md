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

TARGET: P/handover.md

EDIT 1
OLD: **Blockers**: the cli-jev re-mint after the merge, and the primary checkout residue at the merge step.
NEW: **Blockers**: the primary checkout residue, which blocks the primary checkout's own sync after the push.

EDIT 2
OLD: | The cli-jev compiled manifest is stale after the SKILL.md edit | open | Re-mint after merging main with `node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev`, then require the guard to report fresh and CJ-001 to route compiled before any push |
NEW: | The cli-jev compiled manifest is stale after the SKILL.md edit | resolved | The route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, and the merged tree reports all seven hubs fresh |

EDIT 3
OLD: | The SKILL.md edit changes the cli-jev compiled-routing policy hash | The cli-jev compiled manifest and the route guard |
NEW: | The SKILL.md edit changes the cli-jev compiled-routing policy hash | The cli-jev compiled manifest and the route guard. The route-remint pre-commit gate ran the re-mint inside f0411552aa |

EDIT 4
OLD: | The operator chose to publish local main as it stands, which carries the other session's two commits along with this phase | The push step for local main |
NEW: | The operator chose to publish local main as it stands, which carries the other session's two commits along with this phase. The other session pushed them itself first | The push step for local main |

EDIT 5
OLD: | Re-mint with `node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev` and require the guard to report fresh before any push |
NEW: | The route-remint pre-commit gate re-mints the hub inside the commit that edits it, so read the commit output for a [gate:route-remint] line before assuming the manifest is stale. Otherwise re-mint with `node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev` |

EDIT 6 (INSERT one trap row directly after this ANCHOR line)
ANCHOR: | The packet scaffold ran against the primary checkout path | A scaffold for a worktree packet resolves the primary checkout's specs/ tree | Load-bearing. The primary checkout's main cannot move to the phase commit while the residue sits there | Before the merge, check the primary checkout for a same-named packet folder and parent rows, back them up, and remove them only with the operator's yes |
NEW:
| Generated Hermes mirrors conflict on merge | Both branches regenerate the same .hermes mirror from different sources | Defensive. The mirrors are derived, so no hand-written content is at stake | Take either side, regenerate every mirror from the merged sources with sync-skills-hermes.cjs, and require --check to pass before the merge commit |

EDIT 7
OLD: - **Next safe action**: Commit the phase on the worktree branch after the operator's yes, the first part of T017.
NEW: - **Next safe action**: Push the worktree branch tip to main and skilled/v4.0.0.0 after the operator's yes, then watch CI.

EDIT 8
OLD: - **Context:** Nothing is committed, merged or pushed yet.
NEW: - **Context:** The work is committed and merged on the worktree branch, and nothing is pushed yet.

EDIT 9
OLD: Tasks T001 to T014 are done and T015 to T017 are open.
NEW: Tasks T001 to T016 are done and T017 is open.

EDIT 10 (replace the whole numbered list)
OLD: 1. Commit the phase on the worktree branch after the operator's yes, the first part of T017.
2. Merge main, clear the primary checkout residue with the operator's yes, then re-mint the cli-jev compiled-routing manifest (T015).
3. Re-verify the merged tree with Hermes sync, the scorer ratchet, the link check and the route guard before any push (T016).
4. Push after the operator's yes, watch CI, then remove the worktree (the rest of T017).
NEW: 1. Push the worktree branch tip to main and skilled/v4.0.0.0 after the operator's yes (T017).
2. Watch CI on the pushed commit (T017).
3. Clear the primary checkout residue with the operator's yes, so the primary checkout can fast-forward.
4. Remove the worktree after the operator's yes (the rest of T017).

EDIT 11
OLD: - [ ] No breaking changes left mid-implementation. Open. REQ-005 and AC-008 wait on the post-merge cli-jev re-mint.
NEW: - [x] No breaking changes left mid-implementation. The merged tree passes every check and the route guard reports all hubs fresh.

EDIT 12
OLD: - [ ] Tests passing (if applicable). Partly. AC-003 to AC-007 are Met on the worktree. AC-010 waits on the merged-tree re-run.
NEW: - [x] Tests passing (if applicable). AC-003 to AC-007 are Met on the worktree, and AC-010 is Met on the merged tree.

EDIT 13
OLD: - REQ-005 P1 cli-jev compiled routing re-minted after the merge. AC-008. Unmet (post-merge).
NEW: - REQ-005 P1 cli-jev compiled routing re-minted, guard fresh, CJ-001 compiled. AC-008. Met. The re-mint ran at commit time through the route-remint pre-commit gate.

EDIT 14
OLD: AC-010. Unmet (post-merge).
NEW: AC-010. Met.

EDIT 15
OLD: Task status: T001 to T014 are done. T015 to T017 are open.
NEW: Task status: T001 to T016 are done. T017 is open.

EDIT 16 (the guard line in the verification list: replace it, then add one line after it)
OLD: - `node .skilled/bin/compiled-route-guard.cjs` -> cli-jev stale-manifest (the other five hubs fresh). Open until the post-merge re-mint
NEW: - `node .skilled/bin/compiled-route-guard.cjs` -> before the merge, cli-jev stale-manifest. On the merged tree 0b39a1f6c3, all seven hubs fresh, exit 0
- merges -> f127890ea7 was clean. 0b39a1f6c3 conflicted on three generated Hermes mirrors, resolved by taking main's copies and regenerating every mirror. `compiled-route-admission.cjs --all` warns on sk-design with 1 drift, the same as on origin/main, and CI runs it with --warn-only

VERIFY - run these, paste each command with its result line
  grep -c 'Unmet' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md            # expect 0
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md    # expect 14

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
