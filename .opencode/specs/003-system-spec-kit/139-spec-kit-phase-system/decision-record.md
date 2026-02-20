<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record (level3-arch) | v2.2 -->

---

<!-- ANCHOR:decisions -->

## ADR-001: Behavioral Layer vs New Level Tier

**Date**: 2026-02-20
**Status**: Accepted
**Context**: The phase system could be implemented as: (A) a new documentation level (e.g., "Level 4 - Phased"), (B) a behavioral layer on existing levels, or (C) a separate parallel system like sharded templates.

**Decision**: Option B — Behavioral layer on existing levels.

**Rationale**:
- Phases are about execution decomposition, not documentation depth. A L1 child phase is valid inside a L3+ parent.
- Adding a Level 4 would break the clean 1/2/3/3+ progression and force template system changes in compose.sh
- A parallel system (like sharded) creates maintenance burden and fragmentation
- The organic pattern in 136/138 already uses existing levels for both parent and children — formalizing this preserves what works

**Consequences**:
- Phase detection is separate from level recommendation (two outputs from recommend-level.sh)
- No compose.sh changes needed
- Phase templates are small addendums (parent section + child header), not full level tiers
- Users can combine any level with any phase count

---

## ADR-002: Phase vs Sub-Folder Distinction

**Date**: 2026-02-20
**Status**: Accepted
**Context**: The existing `--subfolder` flag in create.sh creates versioned iterations within a spec folder. The new phase concept is semantically different (decomposition vs iteration). Should they share the same mechanism?

**Decision**: Separate flags (`--phase` vs `--subfolder`), mutually exclusive, with shared infrastructure.

**Rationale**:
- Versioning (--subfolder): Same scope, different iteration ("we redid the auth approach")
- Phases (--phase): Different scopes, parallel/sequential execution ("foundation, then implementation, then integration")
- Both use the same `[0-9][0-9][0-9]-*/` numbering and create identical directory structures (memory/, scratch/)
- The distinction is in metadata: phases inject parent back-references and Phase Documentation Map; versions do not
- Making them mutually exclusive prevents confusing a phase folder for a version and vice versa

**Consequences**:
- create.sh has two sub-folder modes with different metadata injection
- validate.sh --recursive treats both identically for validation purposes (structure is the same)
- Phase-specific metadata (parent links, handoff criteria) only present in --phase created folders
- A folder created with --subfolder can be manually promoted to a phase by adding metadata

---

## ADR-003: Conservative Phase Detection Thresholds

**Date**: 2026-02-20
**Status**: Accepted
**Context**: Phase recommendation could be aggressive (suggest phases for any L2+ task) or conservative (only for clearly large tasks). Over-suggestion is a worse UX problem than under-suggestion.

**Decision**: Conservative thresholds — phase score >= 25/50 AND level >= 3.

**Rationale**:
- Retrospective analysis: spec 136 had LOC ~5000+, 40+ files, architectural + API + DB risks → would score ~45/50
- Spec 138 had LOC ~3000+, 25+ files, architectural + API → would score ~35/50
- A typical L2 feature (200 LOC, 5 files, one risk factor) would score ~10/50 — correctly not flagged
- Setting threshold at 25 captures both 136/138-style tasks while rejecting routine L2 work
- The user always has the option to decline the suggestion or manually invoke /spec_kit:phase

**Consequences**:
- Most tasks (estimated 80%+) will not trigger phase suggestions
- Users working on genuinely complex tasks get proactive guidance
- False positive rate expected < 10% based on retrospective scoring
- Threshold is configurable via --phase-threshold flag and .speckit.yaml override

---

## ADR-004: Default Child Phase Level

**Date**: 2026-02-20
**Status**: Accepted
**Context**: When --phase creates child folders, what documentation level should children default to? The parent is typically L3+, but children represent bounded scope slices.

**Decision**: Children default to Level 1, with `--child-level N` override.

**Rationale**:
- Each phase is a scoped slice of the parent's work — typically 100-300 LOC, 3-8 files
- The parent already has the comprehensive L3+ documentation covering the full scope
- Child phases need focused spec/plan/tasks, not repeated governance sections
- L1 is the lightest template that still provides structured documentation
- If a specific phase is complex enough to warrant L2+ (e.g., has its own risk matrix), the user can override

**Consequences**:
- Significantly reduces documentation overhead per phase
- Reduces context window pressure (L1 child = ~455 lines vs L3+ child = ~1075 lines)
- Users can escalate individual phases: `create.sh --subfolder --level 2` on an existing phase
- Parent's Phase Documentation Map is the single source of truth for cross-phase coordination

---

## ADR-005: Gate 3 Option E Contextual Display

**Date**: 2026-02-20
**Status**: Proposed
**Context**: Adding a 5th option (E: "Add phase to existing spec") to Gate 3 increases cognitive load. Should it always be shown or only when relevant?

**Decision**: Option E shown only when: (1) existing spec folder is detected with high complexity markers, OR (2) user's task description contains phase-related keywords, OR (3) recommend-level.sh --recommend-phases returns true.

**Rationale**:
- Most Gate 3 interactions are for simple tasks where phases are irrelevant
- Showing 5 options universally would slow down the common case
- Contextual display keeps the simple case simple (4 options) while making the complex case discoverable
- AI agents can detect the signals programmatically

**Consequences**:
- Gate 3 prompt logic becomes slightly more complex (must evaluate display conditions)
- Risk: users may not know Option E exists if conditions aren't met — mitigate with /spec_kit:phase always being available
- CLAUDE.md Gate 3 section needs clear documentation of when E appears

<!-- /ANCHOR:decisions -->

---

## SESSION DECISION LOG

| # | Decision | Rationale | Timestamp |
|---|----------|-----------|-----------|
| 1 | Phases are behavioral, not a new level | Preserves clean level progression; matches organic pattern | 2026-02-20 |
| 2 | --phase and --subfolder are mutually exclusive | Semantic clarity: decomposition vs iteration | 2026-02-20 |
| 3 | Conservative thresholds (25/50 + Level >= 3) | Avoid over-suggestion; validated against 136/138 retrospective | 2026-02-20 |
| 4 | Default child level is L1 | Reduces overhead; parent has full docs; children are focused slices | 2026-02-20 |
| 5 | Gate 3 Option E is contextually shown | Keep simple case fast; complex case discoverable | 2026-02-20 |
