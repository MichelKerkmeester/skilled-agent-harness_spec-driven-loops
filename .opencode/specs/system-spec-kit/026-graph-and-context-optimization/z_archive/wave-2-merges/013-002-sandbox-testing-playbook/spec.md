---
title: "Feature Specification: Sandbox Testing Playbook [system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec]"
description: "Author 23 manual testing playbook scenarios (IDs 323-336, 338-342, 344-347; gaps at 337 + 343) covering all 5 doctor commands plus version-migration end-to-end, plus a Docker sandbox harness (Dockerfile + docker-compose.yml + fixture-fetch + 4 harness scripts + 23 per-scenario shell wrappers) under .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/ and _sandbox/23--doctor-commands/. Validates the runtime contract authored in sibling 001-doctor-commands."
trigger_phrases:
  - "002-sandbox-testing-playbook"
  - "doctor commands manual testing"
  - "23--doctor-commands"
  - "docker sandbox doctor"
  - "DOC-323"
  - "DOC-347"
  - "version migration end-to-end"
  - "doctor command playbook"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T16:05:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 spec for 23 scenarios plus sandbox harness"
    next_safe_action: "Draft plan tasks checklist decision-record resource-map"
    blockers: []
    key_files:
      - "../001-doctor-commands/spec.md"
      - "../001-doctor-commands/decision-record.md"
      - ".opencode/commands/doctor/code-graph.md"
      - ".opencode/commands/doctor/assets/doctor_code-graph.yaml"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/system-spec-kit/scripts/tests/test-validation.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Spec location: 002 child of 013 phase parent (user choice)"
      - "Scenario IDs: 323-347 contiguous above current 322 file max (user choice)"
      - "Sandbox location: manual_testing_playbook/_sandbox/23--doctor-commands/ (user choice)"
      - "Fixture hosting: external download via fetch-fixtures.sh at sandbox setup time (user choice)"
      - "Scope: Option A (full package — 23 scenarios + Dockerfile + harness + fetch + root playbook integration; mode-reduction follow-on removed DOC-337 and DOC-343)"
---
# Feature Specification: Sandbox Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet adds the validation layer for sibling `001-doctor-commands`: 23 manual testing playbook scenarios for `/doctor:*` commands, a Docker-based sandbox harness, fixture-fetch scaffolding, and root playbook indexing. It gives operators a concrete upgrade and smoke-test trail for spec-kit doctor-command behavior.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Superseded By** | ../003-router-phase/ and ../005-cutover-phase/ (router consolidation + cutover, 2026-05-11) |
| **Sibling** | 001-doctor-commands (Complete) |
| **Predecessor** | 001-doctor-commands |
| **Successor** | None |
| **Handoff Criteria** | 23 playbook scenarios authored + valid; root playbook updated; sandbox Dockerfile + harness + fetch script authored; bash -n + JSON/YAML syntax pass; strict spec-folder validate exits 0 (acknowledge known cross-packet template-manifest issue). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Sibling packet `001-doctor-commands/` shipped 5 doctor commands (`/doctor memory`, `causal-graph`, `deep-loop`, `cocoindex`, `update`), 10 active YAML assets, and a migration manifest for spec-kit version migration (3.3.0.0 → 3.4.1.0). The runtime is in place. What's missing:

1. **No reproducible test harness** — verification gates G4-G9 in 001's spec require runtime smoke tests (auto/confirm/concurrent dispatch/SIGINT/migration-gap/dashboard) but those need a controlled environment with pre-populated database fixtures, a deterministic codebase tag (e.g., v3.3.0.0 simulated state), and runnable shell harness scripts that snapshot evidence.
2. **No manual playbook coverage** — the canonical `system-spec-kit/manual_testing_playbook/` has 322 scenarios across 22 categories but ZERO entries for the new doctor surface. Operators wanting to verify a v3.3.0.0 → v3.4.1.0 upgrade have no scenario to follow.
3. **No version-migration end-to-end story** — the migration manifest declares the upgrade chain but no scenario actually exercises it from a fresh clone of an older release through to current schema.

### Purpose

Author the validation half of 013's deliverable: 23 manual playbook scenarios (IDs 323-336, 338-342, 344-347; gaps at 337 + 343) covering all 5 doctor commands plus version-migration end-to-end, plus a Docker sandbox harness (Dockerfile + docker-compose.yml + fixture-fetch + 4 harness scripts + 23 per-scenario shell wrappers). Together these turn 001's runtime contract into a reproducible, evidence-capturing test suite that a new user simulating an outdated release can run end-to-end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **23 per-scenario Markdown files** in `system-spec-kit/manual_testing_playbook/23--doctor-commands/`:
  - 5 `/doctor memory` (323-327): fresh-install, drift, long-pole, sigint, disk-pressure
  - 3 `/doctor causal-graph` (328-330): low-coverage, confidence-threshold, add-only
  - 3 `/doctor deep-loop` (331-333): lazy-init, empty-no-source, convergence
  - 3 `/doctor cocoindex` (334-336): daemon-healthy, daemon-zombie, daemon-unreachable
  - 6 `/doctor:update` orchestrator (338-342 + 344): G5-G9 gates + tier-aware single interactive flow
  - 3 version migration end-to-end (345-347): 3.3.0.0→3.4.1.0, cleanup-legacy, no-op
- **Root playbook update** (`manual_testing_playbook.md`): add `23--doctor-commands/` to canonical-source-artifacts list, update `last_updated:` frontmatter, append 23 entries to Section 12 (Feature Catalog Cross-Reference Index).
- **Sandbox harness** under `manual_testing_playbook/_sandbox/23--doctor-commands/`:
  - `Dockerfile` (Node 20-bookworm + python3.11 + sqlite3 + jq + git + curl, non-root user)
  - `docker-compose.yml` (service def + volume mount + env vars)
  - `fixtures/fetch-fixtures.sh` + `fixtures/manifest.json` (external download with SHA-256 verification)
  - `harness/run-all.sh` + `reset-state.sh` + `capture-evidence.sh` + `assert-signals.sh`
  - 23 per-scenario shell wrappers (`scenarios/DOC-323-*.sh` ... `DOC-347-*.sh`)
- **Packet docs** (this folder, Level 3): spec, plan, tasks, checklist, decision-record, resource-map, description.json, graph-metadata.json, implementation-summary.

### Out of Scope

- Authoring or modifying any `/doctor:*` command — already done in `001-doctor-commands/`.
- Modifying the migration manifest — already authored in 001.
- Hosting fixture archives at a real release URL — `fixtures/manifest.json` ships with placeholder URLs; populating them is a follow-on packet OR manual user setup.
- CI integration — repo has no `.github/workflows/`; not adding one in this packet.
- Real Docker build (G8 in 001's verification gates) — requires Docker daemon; deferred to follow-on or manual user run.
- Real fixture fetch (G9) — requires hosted release URL; deferred.
- Real end-to-end scenario execution — requires both G8 + G9 first.
- Backporting playbook scenarios to older spec-kit tags — scenarios target v3.4.1.0 + behavior; older versions out of scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/manual_testing_playbook/23--doctor-commands/323-doctor-memory-fresh-install.md` ... `347-version-migration-no-op.md` | Create (23 files) | Per-scenario Markdown files matching canonical playbook 5-section template |
| `system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add 23-- to canonical-source-artifacts list; update last_updated; append 23 Section 12 entries |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/Dockerfile` | Create | Node 20 + Python 3.11 + sqlite3 + jq base image |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml` | Create | Service + volume + env vars |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/fixtures/fetch-fixtures.sh` | Create | Idempotent download + SHA-256 verify |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/fixtures/manifest.json` | Create | Per-fixture URL + checksum |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/fixtures/.gitkeep` | Create | Empty placeholder until fetched |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/{run-all,reset-state,capture-evidence,assert-signals}.sh` | Create (4 files) | Bash 3.2 compatible per `scripts/tests/test-validation.sh` precedent |
| `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/DOC-323-*.sh` ... `DOC-347-*.sh` | Create (23 files) | Per-scenario wrappers mapping 1:1 to Markdown scenarios |
| `002-sandbox-testing-playbook/{spec,plan,tasks,checklist,decision-record,resource-map}.md` | Create (6 files) | Level 3 packet docs |
| `002-sandbox-testing-playbook/{description,graph-metadata}.json` | Create (auto) | Via `generate-context.js` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 23 playbook scenario `.md` files exist at canonical IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) in `23--doctor-commands/` | `ls 23--doctor-commands/` returns 23 files; ID range matches |
| REQ-002 | Each scenario file passes `validate_document.py --type playbook_feature` with `valid: true` | Per-file validation exit 0 |
| REQ-003 | Each scenario file follows the canonical 5-section structure (`## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`) | Per-file H2 grep returns exactly the 5 canonical headers |
| REQ-004 | Root `manual_testing_playbook.md` lists `23--doctor-commands/` in canonical-source-artifacts list | `grep '23--doctor-commands' root.md` returns ≥1 hit |
| REQ-005 | Root `manual_testing_playbook.md` Section 12 (Feature Catalog Cross-Reference Index) includes 23 new entries (IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008)) | `grep -E 'Feature File.*\[(32[3-9]\|33[0-9]\|34[0-7])\]' root.md` returns 23 hits |
| REQ-006 | Root `manual_testing_playbook.md` `last_updated:` frontmatter reflects today's date | `grep '^last_updated:' root.md` shows 2026-05-09 |
| REQ-007 | `Dockerfile` is parseable (no syntax errors) | `docker buildx build --dry-run -f Dockerfile .` exits 0 (deferred if no Docker) OR `dockerfile-utils lint` clean |
| REQ-008 | `docker-compose.yml` is valid YAML | `python3 -c "import yaml; yaml.safe_load(open('docker-compose.yml'))"` exit 0 |
| REQ-009 | `fixtures/manifest.json` is valid JSON with required fields (per-fixture URL + SHA-256 + size) | `python3 -m json.tool < manifest.json` exit 0 + required fields present |
| REQ-010 | All 4 harness scripts pass `bash -n` syntax check | `for s in harness/*.sh; do bash -n $s; done` exits 0 each |
| REQ-011 | All 23 per-scenario shell wrappers pass `bash -n` | `for s in scenarios/*.sh; do bash -n $s; done` exits 0 each |
| REQ-012 | `harness/run-all.sh --dry-run` exits 0 (no docker invocation; just script linting + path resolution) | Dry-run executes cleanly |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Per-scenario `.md` includes a "Real user request" + "Prompt" + "Expected signals" + "Evidence" + "Pass/Fail" + "Failure Triage" subsection in Section 3 (TEST EXECUTION) | Per-file grep returns 6 subsection markers |
| REQ-021 | Per-scenario `.md` cites the corresponding YAML asset path in Section 4 (SOURCE FILES) | Per-file grep returns the canonical YAML path |
| REQ-022 | Per-scenario `.sh` wrapper invokes the canonical `/doctor:*` command exactly as documented in 001's Markdown entrypoint (no parallel reimplementation) | Per-file grep returns the canonical command invocation |
| REQ-023 | `decision-record.md` captures 5+ ADRs covering: ID range choice, sandbox location, fixture-hosting strategy, scenario-shape choice, harness-language choice | 5 ADR sections present |
| REQ-024 | `harness/capture-evidence.sh` snapshots stdout, exit code, file deltas, snapshot files into `evidence/<scenario>/` | Script content includes the 4 capture targets |
| REQ-025 | `harness/assert-signals.sh` is grep-based and consumes the "Expected signals" section from per-scenario Markdown | Script reads `.md` files and asserts via grep |
| REQ-026 | `harness/run-all.sh` emits a Markdown rollup at the end with per-scenario PASS/FAIL/SKIP/UNAUTOMATABLE classification | Script content includes Markdown rollup logic |
| REQ-027 | `fixtures/fetch-fixtures.sh` is idempotent (skips already-fetched + checksum-matched files) | Script content includes the idempotent guard |

### P2 — Nice-to-have (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-040 | Root `manual_testing_playbook.md` scenario count metadata updates from 322 → 347 if tracked | If metadata field exists, update; otherwise document as "field not tracked" |
| REQ-041 | Per-scenario `.md` includes `audited_post_*` frontmatter field for future audit traceability | Optional; document deferral if skipped |
| REQ-042 | Sandbox `Dockerfile` includes `LABEL` directives matching standard OCI annotations | Optional; document deferral if skipped |
| REQ-043 | `harness/run-all.sh` supports `--filter` flag to run a single scenario by ID | Optional; document deferral if skipped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 23 scenario `.md` files exist + each passes `validate_document.py --type playbook_feature`.
- **SC-002**: Root playbook `manual_testing_playbook.md` lists `23--doctor-commands/` and indexes 23 new scenarios in Section 12.
- **SC-003**: Sandbox harness `Dockerfile` + `docker-compose.yml` + 4 harness scripts + 23 wrappers + fixture-fetch + manifest authored.
- **SC-004**: All `*.sh` files pass `bash -n`; all `*.yaml` and `*.json` files pass syntax validation.
- **SC-005**: `harness/run-all.sh --dry-run` exits 0 (script linting + path resolution).
- **SC-006**: Strict spec-folder validate exits 0 on 002 packet (acknowledge known cross-packet template-manifest issue).
- **SC-007**: `decision-record.md` captures all 5 ADRs (ID range, sandbox location, fixture hosting, scenario shape, harness language).
- **SC-008**: Each scenario references the matching `001-doctor-commands` YAML asset and Markdown entrypoint via SOURCE FILES section.
- **SC-009**: `_memory.continuity.completion_pct` reaches 100 in `implementation-summary.md` only after all P0/P1 items are marked.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex parallel dispatch unreliability with 4 tracks | Phase B authoring may stall | Tracks write to disjoint paths (5 ID ranges); fallback to serial if hangs |
| Risk | Existing playbook strict validate already known to fail (TEMPLATE_HEADERS / ANCHORS_VALID issues) | G3 gate on 002 packet may fail | Document as known cross-packet issue per 002 + 003 packet precedent |
| Risk | Fixture release URL hosting absent | G9 gate (real fetch) deferred indefinitely | `manifest.json` ships with placeholder URLs + clear comment; G9 deferred |
| Risk | Per-scenario file count creep beyond 25 | ID range collision risk | Range 323-347 reserved; scope-locked; new scenarios = follow-on packet |
| Risk | `generate-context.js` regenerates parent graph-metadata + drops manual fields | Parent metadata loses `manual.depends_on` | Restore manual fields after every save (memory rule) |
| Risk | Auto-branch from `create.sh` against memory rule "stay on main" | Diverges from main | After scaffold, switch back to main and delete auto-created packet branch |
| Risk | Docker / Compose syntax errors break harness silently | Sandbox unusable | G6 `bash -n` per script + Phase E manual review; defer G8 (real docker build) to follow-on |
| Dependency | Sibling 001-doctor-commands fully authored | All scenarios reference the commands | 001 is `Complete` per phase parent map; locked |
| Dependency | Babysitter Dockerfile pattern as fork starting point | Dockerfile authoring | `specs/z_future/agentic-system-upgrade/.../babysitter-main/external/Dockerfile` confirmed available; cited in plan |
| Dependency | `scripts/tests/test-validation.sh` shell harness conventions | Harness scripts authoring | Confirmed available; cited in plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reproducibility

- **NFR-RP-001**: Sandbox harness must produce identical output across runs given identical fixture state (deterministic).
- **NFR-RP-002**: Fixture archives are versioned + SHA-256 verified — same archive bytes, same scenario behavior.
- **NFR-RP-003**: `harness/reset-state.sh` is idempotent and restores fixture archive between scenarios without leftover state.

### Discoverability

- **NFR-DC-001**: Every new scenario is indexed in root playbook Section 12 with the canonical `> **Feature File:** [NNN](23--doctor-commands/NNN-filename.md)` pattern.
- **NFR-DC-002**: New category folder name `23--doctor-commands` follows existing `NN--name` numbered-category convention.
- **NFR-DC-003**: Per-scenario file naming matches `NNN-feature-id-slug.md` pattern with global numeric IDs (no per-category reset).

### Maintainability

- **NFR-MN-001**: Sandbox harness scripts are bash 3.2 compatible (matches macOS default + repo `scripts/tests/` convention).
- **NFR-MN-002**: Harness uses `set -euo pipefail` + color guards `[[ -t 1 ]]` per repo precedent.
- **NFR-MN-003**: Per-scenario `.sh` wrappers are single-purpose (one docker invocation + one harness call); no scenario-specific business logic in scripts.
- **NFR-MN-004**: Fixture manifest is human-readable JSON with one entry per fixture (URL, SHA-256, size, version, description).

### Test Quality

- **NFR-TQ-001**: Each scenario covers exactly one user-observable behavior (no mega-scenarios with 5+ assertions).
- **NFR-TQ-002**: Scenarios with destructive side effects (e.g., DOC-326 SIGINT cancellation) require explicit fixture-restore preconditions.
- **NFR-TQ-003**: PASS/FAIL/SKIP/UNAUTOMATABLE classification per scenario, matching root playbook execution policy.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Scenario Authoring

- **Long-pole scenarios** (DOC-325 memory long-pole rebuild, DOC-345 version migration end-to-end) — must declare expected runtime in scenario contract; harness must not timeout prematurely.
- **Destructive scenarios** (DOC-326 SIGINT cancellation) — require checkpoint creation before AND rollback evidence after, per root playbook rule for destructive tests.
- **Daemon-dependent scenarios** (DOC-334-336 cocoindex daemon states) — must SKIP cleanly if daemon unavailable in sandbox rather than FAIL.

### Sandbox Harness

- **Docker daemon unavailable** — `harness/run-all.sh` should detect via `docker version` and SKIP all sandbox-dependent scenarios with clear message.
- **Fixture archive missing or corrupted** — `fetch-fixtures.sh` should fail-fast with checksum mismatch; harness should refuse to run dependent scenarios.
- **Disk pressure mid-scenario** — DOC-327 disk-pressure scenario simulates this intentionally; harness must catch the refusal as PASS, not FAIL.
- **Concurrent dispatch test** (DOC-342) — requires harness to launch 2 docker invocations in parallel; second must be refused via flock.

### Cross-Cutting

- **Codex parallel dispatch** — Phase B uses 4 cli-codex tracks. If one stalls, fallback to serial. Document fallback path in plan.md dispatch design.
- **Per-scenario shell wrapper drift** — wrappers might invoke `/doctor:*` differently than the canonical Markdown entrypoint over time. REQ-022 enforces 1:1 fidelity at authoring time; future audits via `/doctor skill-budget` or similar.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 23 scenario .md + 31 sandbox files + 8 packet docs + 1 root playbook modify = ~67 files |
| Risk | 14/25 | Codex parallel dispatch + fixture hosting absence + cross-packet template-manifest known issue |
| Research | 12/20 | Phase 1 explored 3 areas (playbook conventions, docker patterns, phase-parent shape) — substantial research, well-grounded |
| **Total** | **48/70** | **Level 3** (above Level 2 threshold; Level 3+ not needed since complexity < 80) |

### Notes

- Higher scope than 002 + 003 + 001 (this packet alone has 67 deliverables).
- Risk-managed via the 4-Explore-agent + Multi-AI Council deliberation in 001 + clarifying questions in this packet (3 user answers locked).
- Level 3 chosen because of cross-cutting decisions (sandbox architecture, fixture hosting, ID-range strategy, harness language) that warrant explicit ADRs in `decision-record.md`.
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Response |
|------|------------|--------|----------|
| Parallel scenario dispatch stalls | Medium | Medium | Fall back to serial dispatch; tracks write disjoint ID ranges. |
| Fixture URLs remain placeholders | High | Medium | Keep G9 deferred until release-hosted archives exist. |
| Template validator drift blocks G3 | Medium | High | Keep this packet's authored docs aligned to the canonical 010/003 Level 3 template. |

---

## 11. USER STORIES

- As an operator upgrading spec-kit from 3.3.0.0 to 3.4.1.0, I need doctor-command scenarios that show expected prompts, evidence, and pass/fail signals.
- As a maintainer running smoke tests, I need a sandbox harness that can reset fixture state and capture command evidence consistently.
- As a reviewer auditing this packet, I need scenario IDs, ADRs, and validation gates to trace back to `001-doctor-commands` requirements.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

(All resolved at intake — kept for audit trail.)

- **Q-A** *(answered 2026-05-09)*: Spec packet location? **Answer**: New child `002-sandbox-testing-playbook/` inside 013 phase parent.
- **Q-B** *(answered 2026-05-09)*: Manual playbook home — packet-local or skill-level? **Answer**: Skill-level at `system-spec-kit/manual_testing_playbook/23--doctor-commands/`.
- **Q-C** *(answered 2026-05-09)*: Sandbox harness location? **Answer**: `manual_testing_playbook/_sandbox/23--doctor-commands/`.
- **Q-D** *(answered 2026-05-09)*: Fixture hosting? **Answer**: External download via `fetch-fixtures.sh`.
- **Q-E** *(answered 2026-05-09)*: Scenario ID range? **Answer**: 323-347 (25 IDs originally contiguous above current 322 max).
- **Q-F** *(answered 2026-05-09)*: Scope? **Answer**: Option A (full package — 23 scenarios + Dockerfile + harness + fetch + root playbook integration; mode-reduction follow-on removed DOC-337 and DOC-343).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `../001-doctor-commands/spec.md`
- `../001-doctor-commands/plan.md`
- `../001-doctor-commands/tasks.md`
- `../001-doctor-commands/checklist.md`
- `../001-doctor-commands/implementation-summary.md`
- `../001-doctor-commands/decision-record.md`
- `../../../010-template-levels/003-template-greenfield-impl/spec.md`
- `../../../010-template-levels/003-template-greenfield-impl/plan.md`
- `../../../010-template-levels/003-template-greenfield-impl/tasks.md`
- `../../../010-template-levels/003-template-greenfield-impl/checklist.md`
- `../../../010-template-levels/003-template-greenfield-impl/implementation-summary.md`
- `../../../010-template-levels/003-template-greenfield-impl/decision-record.md`

---

<!--
LEVEL 3 SPEC (~290 lines)
- 23 manual playbook scenarios (IDs 323-336, 338-342, 344-347; gaps at 337 + 343) covering 5 doctor commands + version migration end-to-end
- Docker sandbox harness (Dockerfile + docker-compose.yml + fetch + 4 harness scripts + 23 wrappers)
- Root playbook integration (canonical-source list + Section 12 cross-reference + last_updated bump)
- Level 3 over Level 2 due to cross-cutting decisions warranting explicit ADRs
- Out of scope: real Docker build (G8), real fixture fetch (G9), real end-to-end (G10), CI integration, fixture hosting setup
-->
