# Iteration 2: Fan-Out Runs release-note coverage

## Focus
Audit Fan-Out Runs notes against runner, merge, lineage containment, shared budgets and merge provenance changes.

## Actions Taken
- Re-read config, projection, strategy, and checked steer.md before choosing this focus; steer.md is absent.
- Compared the Fan-Out Runs notes (lines 261-357) with window commits and current runner behavior.
- Inspected commit 15fe7306bca6e92332b827d129cdc799b74efeae and traced executable identity into the finished-lineage comparison path.
- Checked candidate pass-judgment and survivor changes against their release-note entries.
- Checked the salvage JSONL append path but excluded it because its blamed line predates the v4.1.0.0..HEAD window.

## Findings
1. **MISSING | P2** When the first runnable PATH match cannot be read, fanout-run now records the executable version as unknown instead of hashing a later binary. This keeps finished-lineage executor identity from being inferred from a different executable. Commit 15fe7306bca6e92332b827d129cdc799b74efeae changed this behavior. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3506-3517] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3676] The related finished-lineage mismatch note is line 294, but it does not mention the unknown-version safeguard. [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:294]

## Ruled Out
- The release-note claim that a finished lineage from another topic or executor refuses the whole run is consistent with current code; the narrower unreadable-executable identity safeguard is omitted, not contradictory.
- Commit 0fde65e7b6989905abfc4498319d33058e62aad6 refines timestamp and retry evidence used by the flagged-pass feature already named in the notes at line 281; no separate contradiction was confirmed.
- The direct salvage-event JSONL append was excluded: blame attributes it to a June 2026 change, before this release window.

## Dead Ends
- None. The fan-out commit scan produced a current executable-identity behavior change that can be tied to the existing finished-lineage note.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none; local commit and source history were available.
- Partial success: none. The finding is scoped to the runner identity fallback; the broader audit remains open.

## Sources Consulted
- .skilled/changelog/skilled/v4.2.0.0.md:261-357
- specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3484-3523, 3676
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:520-532
- Commits 15fe7306bca6e92332b827d129cdc799b74efeae, 0fde65e7b6989905abfc4498319d33058e62aad6, and 978b74e8df739105e59e8be611a19b8b79bb89db

## Assessment
- New information ratio: 1.0 (1 fully new, 0 partially new, 0 redundant)
- Questions addressed: the Fan-Out Runs portion of the missing-coverage question; finished-lineage executor identity.
- Questions answered: none; all four audit questions remain open.
- Questions remaining: all four key questions remain open.

## Reflection
- What worked and why: following the candidate change into the executable identity field tied it to the already-documented finished-lineage refusal.
- What did not work and why: broad fan-out keyword searches return many frontier changes; section-by-section matching was needed to isolate a new behavior.
- What I would do differently: compare each runner behavior claim with its post-note implementation commits, then inspect only the changed call path.

## Recommended Next Focus
Audit Dispatch and Safety notes against executor construction, setup refusals, containment guards, recursion protection, and failure propagation.
