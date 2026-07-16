---
title: "Decision Record: Sandbox Testing Playbook [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/decision-record]"
description: "Architecture Decision Records for the 002 packet — captures the 5 cross-cutting decisions that justify the Level 3 designation: ID range strategy, sandbox location, fixture-hosting strategy, scenario-shape choice, harness-language choice."
trigger_phrases:
  - "002-sandbox-testing-playbook ADRs"
  - "doctor playbook decisions"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-2-merges/013-002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T16:22:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored 7 ADRs covering ID range sandbox fixtures scenario harness language"
    next_safe_action: "Draft resource-map"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Sandbox Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->

---

## Index

- [ADR-001: Scenario ID range — 323-347 contiguous above 322](#adr-001-scenario-id-range)
- [ADR-002: Manual playbook home — skill-level, not packet-local](#adr-002-manual-playbook-home)
- [ADR-003: Sandbox harness location — `_sandbox/23--doctor-commands/`](#adr-003-sandbox-harness-location)
- [ADR-004: Fixture archive hosting — external download via fetch script](#adr-004-fixture-archive-hosting)
- [ADR-005: Per-scenario file shape — canonical 5-section template](#adr-005-per-scenario-file-shape)
- [ADR-006: Harness language — bash 3.2 compatible](#adr-006-harness-language)
- [ADR-007: Dispatch design — 4 parallel cli-codex tracks for scenarios](#adr-007-dispatch-design)
- [ADR-008: Mode-reduction follow-on — drop DOC-337 and DOC-343](#adr-008-mode-reduction-follow-on)

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scenario ID range

**Status**: Decided.

<!-- ANCHOR:adr-001-context -->
### Context

Existing playbook has 322 per-scenario files with global numeric IDs. The "IDs stable once published" rule means new IDs must not collide with existing ones. Phase 1 Explore A suggested 280-299 as a possible gap range, but verifying is non-trivial and risk of collision is real.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**323-347 (25 IDs originally contiguous above current 322 file max).**

**Rationale**: Safest choice — guaranteed unused. Matches existing convention of stable, sequential ID assignment. No need to audit gaps in 280-299 range.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives rejected

- 280-299 gap range: requires verification; risk of collision if range isn't actually free
- Don't pre-assign (codex tracks pick available IDs): risk of parallel tracks picking the same ID; only safe with sequential dispatch
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- 23 active IDs retained; DOC-337 and DOC-343 retired (DOC-323..DOC-336, DOC-338..DOC-342, DOC-344..DOC-347); no overlap with existing 322 files.
- New scenarios beyond this packet must continue from 348+.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

- **Simplicity**: Appending above 322 avoids gap analysis and collision bookkeeping.
- **Performance**: Numeric ID choice has no runtime cost.
- **Maintainability**: Future scenario authors can continue from DOC-348 without reading packet-local allocation notes.
- **Scope**: Reserves exactly the 25 IDs required by `spec.md` Scope, no extra range.
- **Security**: No direct security impact; stable IDs improve audit traceability.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation pointer

Realized in `spec.md` Scope and Requirements (`REQ-001`, scenario IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008)), `tasks.md` Phase 2 task ranges, root playbook Section 12 entries, and sandbox wrappers named `DOC-323-*.sh` through `DOC-347-*.sh`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Manual playbook home

**Status**: Decided.

**Context**: Per-scenario Markdown files could live in either:
- The packet (`013/002-sandbox-testing-playbook/manual_testing_playbook/...`)
- The skill's canonical home (`system-spec-kit/manual_testing_playbook/23--doctor-commands/`)

**Decision**: **Skill-level at `system-spec-kit/manual_testing_playbook/23--doctor-commands/`.**

**Rationale**:
- Existing playbook has 322 scenarios across 22 numbered categories at the skill level — that's the canonical home.
- Future agents reading the playbook find all scenarios (including doctor commands) in one place.
- Root `manual_testing_playbook.md` already indexes all 22 categories; adding 23 follows convention.
- Per-scenario discoverability via canonical-source-artifacts list + Section 12 cross-reference index.

**Alternatives rejected**:
- Packet-local: fragments the playbook; new operators wouldn't find doctor scenarios via the established discovery path.

**Consequences**:
- Phase C must update root `manual_testing_playbook.md` (3 edits: canonical sources, last_updated, Section 12 index).
- The packet (`002-sandbox-testing-playbook/`) documents the work and tracks completion; the playbook deliverables themselves live at the skill level.

---

## ADR-003: Sandbox harness location

**Status**: Decided.

**Context**: The Docker harness includes binary fixtures, shell scripts, and Dockerfile. Existing playbook is all-Markdown (322 .md files, zero binaries or scripts). Adding harness inside `23--doctor-commands/` would break that convention.

**Decision**: **`manual_testing_playbook/_sandbox/23--doctor-commands/` — sibling to Markdown categories with `_` prefix.**

**Rationale**:
- `_` prefix keeps the sandbox dir out of validator/scanner globs (existing scanners typically skip `_*` paths).
- Mirrors the playbook category structure (`23--doctor-commands/` Markdown / `_sandbox/23--doctor-commands/` runtime).
- Future categories can add their own `_sandbox/<NN--name>/` subtrees without disturbing the playbook surface.

**Alternatives rejected**:
- Inside the 002 packet (`002-sandbox-testing-playbook/sandbox/`): mixes concerns (spec docs vs runtime artifacts); makes the packet less browsable.
- New top-level path (`.opencode/sandbox/doctor-commands/`): introduces a new top-level convention; harder to discover.

**Consequences**:
- Existing validator/scanners need to honor the `_` prefix convention (assumption — verify in Phase E).
- Future sandboxes follow this pattern: `_sandbox/<category>/`.

---

## ADR-004: Fixture archive hosting

**Status**: Decided.

**Context**: Pre-populated database snapshots at v3.3.0.0, v3.4.0.0, empty baseline, partial-state are needed for reproducible scenario execution. Snapshots could be ~100+ MB each. Three options for hosting:
1. Commit to repo as `*.tar.gz`
2. External download via fetch script at sandbox setup time
3. Generate on-demand from a build script

**Decision**: **External download via `fetch-fixtures.sh` at sandbox setup time.**

**Rationale**:
- Repo size stays minimal (no committed binary archives).
- Fixture content is reproducible and verifiable via SHA-256 in `manifest.json`.
- Fetch script is idempotent — skips already-downloaded archives matching their checksums.
- Fixtures can be re-published per spec-kit release without bumping the repo.

**Alternatives rejected**:
- Commit to repo: ~100+ MB binary blobs strain repo size; unnecessary friction for users not running the harness.
- Generate on-demand: slowest test runs (build databases from scratch each reset); fragile.

**Consequences**:
- Sandbox harness depends on a hosted release URL (out of scope: actual hosting setup; manifest ships with placeholder URLs).
- Real fixture fetch (G9 in 001's verification gates) deferred until URLs exist.
- Document the placeholder state clearly so users don't assume the harness is fully end-to-end ready.

---

## ADR-005: Per-scenario file shape

**Status**: Decided.

**Context**: New scenarios must match existing playbook conventions for discoverability and validator compliance. Phase 1 Explore A audited the canonical shape:
- 5-section template: `## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`
- Frontmatter: `title`, `description`, optional audit fields
- Length: 75-200 LOC per file
- Naming: `NNN-feature-id-slug.md`

**Decision**: **Match the canonical 5-section template + frontmatter exactly.**

**Rationale**:
- Existing playbook has 322 files following this template; 25 new files must blend in.
- `validate_document.py --type playbook_feature` enforces the structure.
- Future audits (e.g., `/doctor:skill-budget` description-budget audit) assume the structure.

**Alternatives rejected**:
- Custom template optimized for doctor commands: breaks discoverability; would require validator updates.

**Consequences**:
- Phase B dispatch prompts must reference 2-3 canonical examples (e.g., `04--maintenance/014-*.md`, `22--context-preservation-and-code-graph/252-*.md`) as locked authority.
- Per-scenario length budget: 75-200 LOC; codex must not pad.

---

## ADR-006: Harness language

**Status**: Decided.

**Context**: Sandbox harness scripts could be authored in bash, Python, or TypeScript. The existing repo has 20+ shell scripts at `system-spec-kit/scripts/tests/` (per Explore B), all in bash 3.2 compatible style.

**Decision**: **Bash 3.2 compatible.**

**Rationale**:
- Matches existing repo convention (`scripts/tests/test-validation.sh` is the gold standard).
- Bash 3.2 is the macOS default; no dependency on bash 4+ features (associative arrays, `mapfile`, etc.).
- Lower runtime overhead than Python or Node.
- Easier to read for evidence capture and grep-based assertions.

**Alternatives rejected**:
- Python: heavier runtime; no clear advantage over bash for this orchestration role.
- TypeScript/Node: requires npm install in sandbox; out of step with existing test conventions.

**Consequences**:
- Harness scripts use `set -euo pipefail` + color guards `[[ -t 1 ]]` per repo precedent.
- No bash 4+ features (associative arrays, `mapfile`).
- Phase D dispatch prompt must explicitly cite the bash 3.2 constraint.

---

## ADR-007: Dispatch design

**Status**: Decided.

**Context**: 23 scenarios + 31 sandbox files = 58 cli-codex deliverables. Sequential dispatch would be ~6-8 hours; parallel could cut to ~3-4 hours. Memory caveat warns about codex parallel dispatch unreliability.

**Decision**: **4 parallel cli-codex tracks for Phase B (scenarios) + 1 single dispatch for Phase D (harness).**

**Rationale**:
- Phase B tracks write to disjoint paths (5 ID ranges in `23--doctor-commands/`); no file conflicts.
- Phase D is a single cohesive dispatch (Dockerfile + harness + wrappers all share conventions); single dispatch keeps style consistency.
- Codex parallelism issue is around concurrent writes to the same file; disjoint paths sidestep this.
- Fallback to serial if hangs detected.

**Alternatives rejected**:
- All sequential: ~6-8 h wall-clock; unnecessarily slow for disjoint work.
- All parallel including Phase D: harness needs cohesive style; multi-track Phase D risks divergence.

**Consequences**:
- Phase B may need fallback to serial if 4-track parallel hangs.
- Phase D is a longer single dispatch (~3-4 h) but produces consistent harness.
- Total wall-clock estimate: 5-7 h with parallel tracks; 9-12 h sequential fallback.

---

## ADR-008: Mode-reduction follow-on

**Status**: Decided.

**Context**: The doctor command surface was reduced from five mode-suffixed variants per command to one bare interactive command per doctor entrypoint. Two published playbook scenarios only existed to validate removed update modes:
- DOC-337 covered `/doctor:update:auto` on an already-fresh repository.
- DOC-343 covered `/doctor:update:apply` as a skip-status full-chain bypass.

**Decision**: **Delete DOC-337 and DOC-343, and delete their matching sandbox wrappers. Keep the numeric gaps.**

**Rationale**:
- DOC-337's fresh-no-snapshot path now folds into the single tier-aware `/doctor:update` behavior and has no distinct user-observable contract.
- DOC-343's autonomous skip-status full-chain bypass no longer exists; the single interactive mode always runs the status decision gate first.
- The playbook ID rule keeps published IDs stable, so 337 and 343 remain intentional gaps rather than being renumbered.

**Consequences**:
- Active scenario count is 23: DOC-323..DOC-336, DOC-338..DOC-342, and DOC-344..DOC-347.
- Active wrapper count is 23 with the same IDs.
- `/doctor:update` orchestrator coverage drops from 8 scenarios to 6 scenarios: DOC-338..DOC-342 and DOC-344.
