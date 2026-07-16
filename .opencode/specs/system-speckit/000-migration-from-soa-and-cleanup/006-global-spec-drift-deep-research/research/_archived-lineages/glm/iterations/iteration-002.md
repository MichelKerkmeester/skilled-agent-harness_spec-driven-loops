# Iteration 2: Numbering drift across non-renumber tracks (Q2)

## Focus
Characterize numbering drift in tracks NOT covered by phases 001-005 (cli-external-orchestration, sk-code, sk-git, sk-prompt, mcp-tooling, system-skill-advisor, z_future), and verify whether the scheme is per-track or global. Also probe whether phase 005 (sk-design reconstruct) actually converted numbering, since graph state claimed draft in iteration 1.

## Findings

### F2.1 — Two numbering schemes coexist (root cause of numbering drift)
The tree runs **two incompatible numbering conventions simultaneously**:
- **Local per-track counters** (clean `001..NNN`): cli-external-orchestration (001-028), mcp-tooling (001-007), sk-design (001-009), sk-prompt (001-007), system-skill-advisor (000-017).
- **Global-offset ranges** (each track owns a slice of a repo-wide counter): sk-code (017-020), sk-git (007-014), system-code-graph (025-035), system-deep-loop (029-068), system-speckit (000, 026-041).
- [SOURCE: per-track sequence extraction, all `*/` slugs under `.opencode/specs/`]

This dual-scheme is the structural numbering drift the parent packet 000 diagnosed; phases 001-005 targeted 5 tracks but did not unify the whole tree.

### F2.2 — Cross-track "collisions" are NOT real drift (ruled out)
The slug `026` appears in cli-external-orchestration, system-code-graph, and system-speckit; `025`/`027`/`032` recur across tracks. Because the packet path is `{track}/{NNN}-{slug}`, the track prefix disambiguates — identical numbers in different tracks are namespaced, not collisions.
- **Ruled out:** "cross-track number collision" as a drift category. [SOURCE: path namespace analysis]

### F2.3 — Global-offset tracks have residual gaps never renumbered
Tracks using global offsets but NOT covered by any renumber phase show unexplained low-number absences and mid-range gaps:
- **sk-code (017-020):** starts at 017 — 001-016 absent (consumed by archived/deleted packets or never allocated). Not covered by a renumber phase → residual drift.
- **sk-git (007-014):** starts at 007 — 001-006 absent. Not covered → residual.
- **system-deep-loop (029-068):** 7 gaps (033→035, 035→038, 038→052, 052→054, 054→059, 059→063, 063→065) where packets were deleted/archived but the counter never compacted. Phase 002 was meant to renumber this track but is operator-skipped (Draft, per 006 spec) → gaps persist.
- [SOURCE: sk-code/, sk-git/, system-deep-loop/ slug enumeration]

### F2.4 — Phase 005 (sk-design) shows NO evidence of numbering conversion
Phase 005 was scoped to "reconstruct" sk-design. But sk-design still uses a clean local `001-009` counter with no global-offset conversion. Combined with iteration-1's finding that all sk-design graph-metadata = `draft`, this reinforces that **phase 005 either did not run or did not touch numbering** — the "shipped" claim is not substantiated by either status state or numbering state.
- [SOURCE: sk-design/001..009 slug scan; iteration-001.md F1.3]

### F2.5 — Non-numeric sentinel packets persist
- **sk-doc/999-create-diff-mode:** `999` is a reserved high sentinel, leaving a 018→999 gap (and 032 sits orphaned between 018 and 999). [SOURCE: sk-doc/ slug scan]
- **system-skill-advisor/changelog:** a `changelog` slug breaks the `NNN-` convention inside a numbered track. [SOURCE: system-skill-advisor/ slug scan]
- **z_future:** entirely unnumbered (9 packets: `agent-memory`, `sqlite-to-turso`, etc.). Likely intentional for a future/experimental track, but it is a convention deviation.

## Sources Consulted
- All `*/` slugs under `.opencode/specs/` (per-track number extraction).
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-.../spec.md` (phase skip/gate claims).

## Assessment
- **newInfoRatio: 0.80** — new characterization (dual-scheme root cause + per-track vs global-offset split) not covered by iteration 1's status work. Slightly below 1.0 because the "there is numbering drift" premise was already seeded in the strategy snapshot; the novelty is the precise mechanism and the ruled-out collisions.
- **Confidence:** high on the scheme split and gap enumeration (mechanical); high that cross-track collisions are namespaced (ruled out cleanly).
- **Q2 status:** substantially answered — the drift is a dual-scheme inconsistency plus uncompacted gaps in global-offset tracks, not cross-track collisions. Marking Q2 answered (evidence-backed).

## Reflection
- **Worked:** per-track sequence + gap extraction cleanly separated real drift (gaps, dual-scheme) from false-positive drift (namespaced collisions).
- **Failed:** none.
- **Ruled out:** cross-track number collision as a drift category (F2.2).

## Recommended Next Focus
Iteration 3: **naming-convention violations (Q3)** — quantify snake_case slugs, the `999` sentinel, unnumbered `z_future`, and the `changelog` packet against the sk-doc/017+032 hyphen-case program; determine which tracks are out of compliance.
