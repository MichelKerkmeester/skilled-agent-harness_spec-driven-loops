
TARGET: P/acceptance-criteria.md

EDIT 1
OLD:     recent_action: "Packet docs revised, strict validation passed, evidence moved out of scratch"
NEW:     recent_action: "Merged main, cli-jev re-minted, merged tree verified"

EDIT 2
OLD:     next_safe_action: "Commit on the worktree branch, merge main, re-mint cli-jev, re-verify"
NEW:     next_safe_action: "Push after the operator's yes, watch CI, remove the worktree"

EDIT 3
OLD:     completion_pct: 80
NEW:     completion_pct: 90

EDIT 4 (the AC-008 row: Verification cell and Status cell)
OLD: | node .skilled/bin/compiled-route-admission.cjs --hub cli-jev passed 3 of 3 with exit 0 while node .skilled/bin/compiled-route-guard.cjs still reports cli-jev stale-manifest with the other five hubs fresh. The re-mint is a post-merge step per the operator decision, so the row is Unmet | Unmet | - |
NEW: | The repository's route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, moving its effectivePolicyHash from 3240ebf5 to 178b10dd, so the re-mint ran at commit time rather than after the merge. On the merged tree at 0b39a1f6c3, node .skilled/bin/compiled-route-guard.cjs reports all seven hubs fresh with exit 0, the CJ-001 prompt routes compiled to cli-usage through node .skilled/bin/compiled-route.cjs under hash 178b10dd, and compiled-route-admission.cjs --hub cli-jev passes 3 of 3 | Met | - |

EDIT 5 (the AC-010 row: Verification cell and Status cell)
OLD: | On the merged tree, sync-skills-hermes.cjs --check, the parity/scorer-eval-baseline-ratchet vitest, check-markdown-links.cjs and compiled-route-guard.cjs must each exit 0, with the guard reporting cli-jev fresh. Task T016 is open, so the row is Unmet | Unmet | - |
NEW: | On the merged tree at 0b39a1f6c3, sync-skills-hermes.cjs --check reported 70 copies in sync, the advisor routing and ratchet vitest reported 28 passed, check-markdown-links.cjs reported 0 broken and compiled-route-guard.cjs reported all seven hubs fresh, each with exit 0 | Met | - |

EDIT 6
OLD: **Closeable:** No
NEW: **Closeable:** Yes

EDIT 7
OLD: AC-008 and AC-010 are the open rows and each must turn Met or carry a waiver ADR before this packet may close. Both are steps after the merge.
NEW: Every criterion is Met. The packet closes once the push, the CI watch and the worktree removal in T017 are done.

VERIFY - run these, paste each command with its result line
  grep -c '| Met | - |' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md     # expect 10
  grep -c '| Unmet |' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md        # expect 0
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md   # expect 6
