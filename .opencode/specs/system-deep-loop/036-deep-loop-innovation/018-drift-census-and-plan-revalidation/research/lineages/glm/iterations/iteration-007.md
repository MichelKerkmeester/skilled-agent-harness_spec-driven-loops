# Iteration 7: Phases 016-017 drift + OPEN QUESTION B (packet-033 renumber)

## Focus

Iteration 7's focus was Q-008: drift over phases 016 (whole-system gate — touched by `72c36121201`) and 017 (integrate latest + closeout — drift-handling charter; touched by `1a5963e6b9d` and `71e18c224c3`), plus OPEN QUESTION B (does the packet-033 benchmark dependency survive its renumber, or must 003 rebase onto `z_archive/027-deep-loop-behavior-benchmarks`?). After iteration 7, all 15 phases carry verdicts and synthesis can run.

## Actions Taken

1. Read `016/spec.md` — full L2 set. Phase 016's gate consumes phase-003 BASE as the accepted comparison authority (cited at lines 59, 68, 88, 100, 115, 135, 151, 164). No direct "Packet 033" citation in phase 016.
2. Read `017/spec.md` — full L2 set. Phase 017 is the drift-handling closeout phase; its job is exactly what this census is doing (re-census touched contracts, reopen drifted phases). Cited paths: phase 016, parent spec, manifest/phase-tree.json.
3. Resolved OPEN QUESTION B by:
   - Searching for "033" / "027" / "behavior-benchmarks" references in `003/spec.md` and `016/spec.md`.
   - Finding `003/spec.md:57,119` cite "Packet 033" as the behavior-evidence source.
   - Listing `.opencode/specs/system-deep-loop/` — found `033-post-sync-verification-fixes` at the active 033 slot.
   - Listing `z_archive/` — found `027-deep-loop-behavior-benchmarks` with full content.
   - `git merge-base --is-ancestor 7f3216fc502 0ce43ff589` → IS NOT ANCESTOR → renumber commit is AFTER baseline.
   - `git show -s --format=%ai 7f3216fc502` = 2026-07-16 18:35:55; `git show -s --format=%ai 0ce43ff589` = 2026-07-16 06:09:33 → renumber is 12.5 hours after baseline.
   - Verified `z_archive/027-deep-loop-behavior-benchmarks` content: Status=Complete, 5-package behavior-benchmark framework with claude-baseline + GPT-5.5-fast comparisons preserved.
4. Verified `72c36121201`'s scope — touches skill-benchmark harness classifier, NOT phase-016's whole-system gate (which consumes phase-008's shadow-parity harness).

## Findings

### F7.1 — OPEN QUESTION B ANSWERED: dependency SURVIVES, but 003 MUST rebase its reference

The renumber commit `7f3216fc502` (2026-07-16 18:35:55, in the census range, 12.5 hours AFTER baseline `0ce43ff589`) did two things:
- Compacted the archive to `001-029`.
- Renumbered active packets to `030-036`.

Effect on phase 003:
- The behavior-benchmarks packet that phase 003 calls "Packet 033" was relocated to `z_archive/027-deep-loop-behavior-benchmarks` (archived, marked Status=Complete).
- The number "033" was reassigned to `033-post-sync-verification-fixes` — a completely different packet.
- The DEPENDENCY SURVIVES the renumber: `z_archive/027-deep-loop-behavior-benchmarks/spec.md` confirms the 5-package behavior-benchmark framework is intact, with claude-cli baseline + GPT-5.5-fast medium/high comparisons, scorecards, and implementation summaries. Phase 003's `REQ-007` ("Packet-033 behavior evidence becomes an eight-workstream baseline") can still be satisfied by reading `z_archive/027`.
- But the NUMBER REFERENCE in `003/spec.md:57, 119` ("Packet 033") is now AMBIGUOUS: at HEAD, "packet 033" points to `post-sync-verification-fixes`, NOT the behavior-benchmarks packet.

**Verdict on OPEN QUESTION B:** The dependency survives (content preserved at `z_archive/027`), but phase 003 MUST rebase its "Packet 033" reference to `z_archive/027-deep-loop-behavior-benchmarks` to remove the ambiguity. This is an additional first-order drift on phase 003 that iteration 1 missed — and it's NOT caused by `cc77a1e550a` (the kebab migration). It's caused by `7f3216fc502` (the renumber commit), which is in the census range but outside `.opencode/skills/system-deep-loop/` (it touches `.opencode/specs/system-deep-loop/`).

This confirms the spec's warning (SPEC §3 In-Scope): "the one confirmed drift hit to date originated outside the runtime." The renumber commit is another such case.

[SOURCE: `003/spec.md:57,119`; `git merge-base --is-ancestor 7f3216fc502 0ce43ff589` returns non-ancestor; `git show -s --format=%ai` timestamps; `ls .opencode/specs/system-deep-loop/` shows `033-post-sync-verification-fixes`; `ls .opencode/specs/system-deep-loop/z_archive/` shows `027-deep-loop-behavior-benchmarks`; `z_archive/027-deep-loop-behavior-benchmarks/spec.md` shows Status=Complete with full content.]

### F7.2 — Phase 016 still valid (transitive dependency on phase-003 refinement documented)

Phase 016's cited paths resolve. Phase 016 references "phase-003 baseline" at 8 sites but never "Packet 033" directly. So phase 016's plan itself is well-formed; its execution depends transitively on:
- Phase 003's kebab-path refinement (iter 1: `state_format.md`, `integration_points.md`, `behavior_benchmark/`).
- Phase 003's packet-033 → z_archive/027 rebase (iter 7, F7.1 above).

Phase 016's `REQ-003` ("Each mode's stable scenario IDs and semantic assertions match the phase-003 protected baseline through the phase-008 parity harness") cannot complete until both phase-003 refinements land. Same transitive pattern as phase 015 (iter 6).

`72c36121201`'s scope is the skill-benchmark harness classifier (de-skill-specific + manifest freshness gate) — part of the skill-benchmark typed-pair series. Phase 016's whole-system gate consumes the **phase-008** shadow-parity harness, NOT the skill-benchmark harness. Iter 1 flagged phase 016 as "medium" risk from `72c36121201`; that rating was over-cautious. The commit doesn't touch phase 016's surfaces.

**Phase 016 = still valid** (transitive dependency on phase-003 refinement documented, not inherited as drift class). [SOURCE: `016/spec.md:59,68,88,100,115,135,151,164`; `git show --stat 72c36121201` scope is skill-benchmark harness, not whole-system gate.]

### F7.3 — Phase 017 still valid; is the pulled-forward charter for this census

Phase 017 is the drift-handling closeout phase. Its stated scope (`017/spec.md:52`): "integrates the latest origin in a clean worktree, re-censuses every touched contract against the parent 065 scope and phase tree, reopens any earlier phase with relevant drift, reruns the complete phase-016 whole-system gate on the exact final SHA, and reconciles the parent packet's open items."

This census (packet 018) is literally the pulled-forward version of phase 017's drift-census charter (per `018/spec.md:72`: "Pull phase 017's drift-census charter forward to now"). So phase 017's premise — that drift exists and must be re-censused — is being empirically validated by this very loop.

Phase 017 citations: phase 016 (still valid per F7.2), parent spec, manifest/phase-tree.json (intra-packet). All resolve. The two commits in range that touched phase 017 (`1a5963e6b9d` "complete 017 hyphen references in the benchmark suite" and `71e18c224c3` "complete deferred-integration reference completion") are reference-completion fixes — they update path references inside phase 017's plan, not its scope.

**Phase 017 = still valid.** The phase is the right shape for its job; its drift-handling charter is what's executing right now. [SOURCE: `017/spec.md:52,60,61,66,80,81,91`; `git show --stat 1a5963e6b9d` and `git show --stat 71e18c224c3` are reference-completion fixes; `018/spec.md:72` confirms this census pulls phase 017's charter forward.]

### F7.4 — Negative control selection: phase 004 locked

Of the 15 phases, three came back with zero drift at every checked surface: **004**, **006**, **007**. Phase 004 is the cleanest:
- Zero `runtime/` path citations of any kind (its plan is pure architectural ADR work).
- All intra-packet children resolve.
- No commits in the range touch its surfaces (architectural ADRs are stable decision records).
- No transitive dependencies on drifted phases (phase 004 produces the spine ADRs that OTHER phases depend on, not the other way).

**Phase 004 = locked as the NEGATIVE CONTROL** for SC-002 / Q-009. A census that marked everything drifted would be non-discriminating; phase 004's clean verdict proves this census discriminates.

## Questions Answered

- **Q-008** (phases 016-017 + packet-033 question B): ANSWERED. Phase 016 still valid (transitive dependency on phase-003 refinement documented). Phase 017 still valid (its drift-handling charter is what's executing now). OPEN QUESTION B resolved: dependency SURVIVES the renumber, but phase 003 MUST rebase its "Packet 033" reference to `z_archive/027-deep-loop-behavior-benchmarks` — additional first-order drift attributable to `7f3216fc502` that iter 1 missed.
- **Q-009** (negative control): ANSWERED. Phase 004 locked as the negative control (zero drift across every checked surface; no runtime citations; no transitive dependencies on drifted phases).

## Questions Remaining

All 9 questions answered. All 15 phase verdicts locked. Ready for synthesis.

## Sources Consulted

- `016/spec.md:59,68,88,100,115,135,151,164` (phase-003 baseline citations)
- `017/spec.md:52,60,61,66,80,81,91`
- `003/spec.md:57,119` (Packet 033 references)
- `git merge-base --is-ancestor 7f3216fc502 0ce43ff589` (returns non-ancestor)
- `git show -s --format=%ai 7f3216fc502` (2026-07-16 18:35:55) and `git show -s --format=%ai 0ce43ff589` (2026-07-16 06:09:33)
- `ls .opencode/specs/system-deep-loop/` (033-post-sync-verification-fixes)
- `ls .opencode/specs/system-deep-loop/z_archive/` (027-deep-loop-behavior-benchmarks)
- `z_archive/027-deep-loop-behavior-benchmarks/spec.md` (Status=Complete; 5-package framework preserved)
- `git show --stat 72c36121201` (skill-benchmark harness classifier scope, NOT whole-system gate)
- `git show --stat 1a5963e6b9d` and `git show --stat 71e18c224c3` (reference-completion fixes)

## Assessment

- **newInfoRatio: 0.85** — High novelty: F7.1 resolves the second load-bearing OPEN QUESTION B with a definitive timeline (renumber commit is 12.5h after baseline, in census range, outside the runtime subtree but inside its scope) AND surfaces an additional first-order drift on phase 003 that iter 1 missed. F7.4 locks the negative control. Only the path-resolution technique is rehearsed.
- **Novelty justification:** F7.1's discovery that "Packet 033" is now AMBIGUOUS (assigned to a different packet) is exactly the kind of drift the spec warned could come from outside the runtime subtree. Pinning the renumber commit's `git merge-base --is-ancestor` relationship to baseline was the load-bearing analytical move.
- **Confidence:** high. The renumber attribution is reproducible from documented `git` commands.
- **Tool-call budget:** 5/12 used. Reserved headroom for state writes.

## Reflection

### What worked

- `git merge-base --is-ancestor <renumber-commit> <baseline>`: definitively placed the renumber AFTER baseline without timestamp arithmetic. The 12.5-hour timestamp difference corroborates but isn't load-bearing.
- Searching phase 003's spec.md for the LITERAL STRING "033" before assuming iter 1 had caught every drift instance. Iter 1 caught the kebab renames but missed the renumber-induced number ambiguity — a different drift class on the same phase.
- Reading `z_archive/027`'s spec.md frontmatter to verify the dependency survives (Status=Complete, 5-package framework intact) before recommending the rebase. The recommendation is grounded in confirmed preservation, not assumption.

### What failed

- _Approach (rejected):_ "Iter 1's phase-003 verdict was complete." _Reason ruled out below._

### Ruled out

- _Approach:_ "Treat iter 1's phase-003 verdict as final." _Reason ruled out:_ iter 1 caught the kebab-path renames (`state_format.md`, `integration_points.md`, `behavior_benchmark/`) but missed the packet-033 → z_archive/027 number-rebind drift, which is a different drift class (renumber-induced ambiguity, not kebab migration). The rebase recommendation now joins iter 1's path-refinement recommendation under the same phase-003 verdict. _Evidence:_ `003/spec.md:57,119` "Packet 033" vs `ls .opencode/specs/system-deep-loop/033-post-sync-verification-fixes/` (different packet).

## Recommended Next Focus

Iteration 8 / Synthesis: all 15 phase verdicts are locked, both open questions are resolved, positive control reproduced, negative control locked. Proceed to `phase_synthesis` and compile `research/research.md` with the per-phase verdict table.
