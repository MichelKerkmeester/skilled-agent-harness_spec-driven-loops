
TARGET: P/implementation-summary.md

EDIT 1
OLD:     recent_action: "T001-T014 done: live Pi proof, six CI surfaces green, packet validates strict"
NEW:     recent_action: "T001-T016 done: main merged, cli-jev re-minted, merged tree verified"

EDIT 2
OLD:     next_safe_action: "Commit on the worktree branch, merge main, re-mint cli-jev, re-verify"
NEW:     next_safe_action: "Push after the operator's yes, watch CI, remove the worktree"

EDIT 3
OLD:     completion_pct: 80
NEW:     completion_pct: 90

EDIT 4
OLD: | The SKILL.md edit changes the compiled-routing policy hash, and the guard must report fresh with CJ-001 routing compiled before any push |
NEW: | The SKILL.md edit changes the compiled-routing policy hash, and the guard must report fresh with CJ-001 routing compiled before any push. In practice the repository's route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, before the merge, and the merged tree kept it fresh |

EDIT 5
OLD: | The operator chose to publish local main as it stands, which carries the other session's two commits along with this phase |
NEW: | The operator chose to publish local main as it stands, which carries the other session's two commits along with this phase. The other session pushed them itself first, so this phase's push no longer carries them |

EDIT 6 (the guard row of the Verification table: replace it, then add four rows after it)
OLD: | `node .skilled/bin/compiled-route-guard.cjs` | STALE. cli-jev stale-manifest while the other five hubs are fresh. Open until the post-merge re-mint under REQ-005 and AC-008 |
NEW: | `node .skilled/bin/compiled-route-guard.cjs` on the merged tree `0b39a1f6c3` | PASS. All seven hubs fresh, exit 0 |
| CJ-001 prompt through `node .skilled/bin/compiled-route.cjs --hub cli-jev` on the merged tree | PASS. Routes compiled to cli-usage under effectivePolicyHash 178b10dd |
| Hermes sync, frontmatter, graph compiler, freshness and link checks on the merged tree | PASS. 70 copies in sync, 0 violations, VALIDATION PASSED, 15/15 fresh, 0 broken, all exit 0 |
| Deep-loop contract tests and advisor routing and ratchet tests on the merged tree | PASS. 42 passed and 28 passed, exit 0 |
| `node .skilled/bin/compiled-route-admission.cjs --all` on the merged tree | WARN. Six hubs pass. sk-design reports 1 drift, the same as on origin/main, and CI runs this check with --warn-only |

EDIT 7 (replace the first Known Limitations item)
OLD: 1. **The cli-jev compiled-routing re-mint is pending.** The SKILL.md edit changed cli-jev's compiled-routing policy hash, so compiled-route-guard.cjs reports cli-jev stale-manifest and CJ-001 serves through legacy routing. The fix is to run node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-jev --skill-root .skilled/skills/cli-jev after merging main, then require the guard to report fresh and CJ-001 to route compiled before any push. AC-008 stays Unmet until then.
NEW: 1. **The cli-jev re-mint ran at commit time, not after the merge.** The repository's route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, moving its effectivePolicyHash from 3240ebf5 to 178b10dd. That commit's message still says the manifest stays stale until a re-mint after the merge, and this summary records the actual order.

EDIT 8 (INSERT one paragraph directly after this ANCHOR line, with one blank line before it)
ANCHOR: The live-proof captures and the dispatch trail first lived in scratch/. They moved to evidence/ before the commit, because the packet docs cite them and the spec-kit folder rules keep cited files out of scratch/.
NEW:

Main was merged into the worktree branch twice. The first merge, f127890ea7, was clean. The other session then pushed main to 80dc0a118d, and the second merge, 0b39a1f6c3, conflicted on the generated Hermes mirrors of cli-hermes, cli-opencode and cli-pi, because both sides had regenerated them. The conflict was resolved by taking main's copies and regenerating every Hermes mirror from the merged sources, which also refreshed the drifted sk-design mirror.

EDIT 9
OLD: T001-T012 are done and T013-T017 are open. Nothing is committed, merged or pushed yet.
NEW: T001-T016 are done and T017 is open. The work is committed and merged on the worktree branch, and nothing is pushed yet.

VERIFY - run these, paste each command with its result line
  grep -c 'STALE\|pending' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md   # expect 0
  grep -c '0b39a1f6c3' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md      # expect 2
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/implementation-summary.md   # expect 12
