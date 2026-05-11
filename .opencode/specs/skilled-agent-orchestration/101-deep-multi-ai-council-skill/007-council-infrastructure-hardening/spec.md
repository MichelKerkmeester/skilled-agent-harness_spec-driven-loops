---
title: "Feature Specification: 101/007 Council Infrastructure Hardening"
description: "Close the residual gaps from 101/001..006: add a runnable council test gate, build the 32-entry feature catalog, ship a reverse-anchor meta-test, write the DAC-025 replay helper, broaden Codex TOML mirror parity, and document the DAC-030/DAC-032 fixture normalization."
trigger_phrases:
  - "council infrastructure hardening"
  - "council test gate"
  - "deep-ai-council feature catalog"
  - "council playbook anchor integrity"
  - "council graph replay helper"
  - "101/007"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/007-council-infrastructure-hardening"
    last_updated_at: "2026-05-11T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 007 spec for residual-gap closure"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast for implementation"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/package.json
      - .opencode/skills/deep-ai-council/feature_catalog/
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts
      - .opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-007-infrastructure-hardening"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "CI gate: not GitHub Actions (none exist) — npm script + standalone runner + opt-in pre-push template + docs."
      - "Feature catalog format follows system-spec-kit/feature_catalog convention (4 sections, category folders)."
      - "Dispatched as a single cli-codex gpt-5.5 high fast job per user direction."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/007 Council Infrastructure Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (101 phase parent) |
| **Phase** | 7 of 7 |
| **Predecessor** | `006-council-graph-value-scenario-automation` |
| **Successor** | None |
| **Handoff Criteria** | All six residual gaps from 101/001..006 resolved with verification evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 101/006 shipped, six residual gaps remained: (1) no runnable council-test gate, so the 8-day test-rot window that surfaced in 101/004 can recur; (2) the playbook's §17 FEATURE CATALOG CROSS-REFERENCE INDEX carries 32 "No feature catalog exists yet" placeholders inherited from packet 002; (3) playbook scenario → vitest test-name anchors are one-way strings with no integrity check; (4) DAC-025's "delete graph + replay from artifacts" path is doc-only with no helper script; (5) the Codex TOML runtime mirror is only checked for sandbox/permission strings, not name + description prose; (6) DAC-030 and DAC-032 fixture helpers normalize operator-facing answers from grouped runtime responses without code-level provenance for future maintainers.

### Purpose
Close all six gaps in one packet so 101's deep-ai-council skill ships with a complete test/maintenance infrastructure layer: discoverable + scriptable test gate, complete feature catalog, automatically-enforced playbook anchor integrity, real replay helper for DAC-025, broadened parity coverage for the fourth runtime mirror, and explicit normalization provenance comments.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Gap | Deliverable |
|-----|-------------|
| #1 CI gate | `mcp_server/package.json` `test:council` script; `scripts/test-council-matrix.sh` standalone runner (vitest + sk-doc + strict spec validate); `.github/hooks/scripts/pre-push-council.sh` opt-in template; short docs at `deep-ai-council/CONTRIBUTING.md` |
| #2 Feature catalog | `.opencode/skills/deep-ai-council/feature_catalog/{01..09}--<category>/<NN>-<scenario-slug>.md` — one entry per DAC-NNN scenario (32 total), 4-section format matching `system-spec-kit/feature_catalog/` convention; root playbook §17 updated to point at the new catalog paths |
| #3 Reverse-anchor meta-test | `mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` — scans playbook + scenario files, extracts DAC-NNN references and vitest test-name strings, asserts each maps to an actual test name in the council-related vitest files |
| #4 DAC-025 replay helper | `.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` — Node script that reads `ai-council-state.jsonl` from a session and replays derived rows via `council_graph_upsert`; updates DAC-025 scenario file to reference the new script |
| #5 Codex TOML parity broaden | Extend `multi-ai-council-runtime-parity.vitest.ts` second `it()` block (or add a third) to assert `.codex/agents/deep-ai-council.toml` contains the canonical name + description prose |
| #6 Fixture normalization provenance | Add inline comments at the normalization sites in `tests/fixtures/council-value/dac-030.ts` and `dac-032.ts` explaining the grouped→ranked / binary→incomplete-flag translation and why runtime code stays untouched |

### Out of Scope
- Modifying `council_graph_*` MCP tool code or schemas.
- Touching 101/001..006 spec packets except parent 101 phase map.
- Wiring the pre-push hook into the user's local `.git/hooks/` automatically (opt-in template only).
- Authoring catalog entries beyond the 32 DAC scenarios.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modify | Add `test:council` script + `test:council:full` (vitest + sk-doc + spec validate) |
| `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh` | Create | Standalone runner (cwd-agnostic, exits non-zero on any failure) |
| `.github/hooks/scripts/pre-push-council.sh` | Create | Opt-in pre-push hook template invoking the runner |
| `.opencode/skills/deep-ai-council/CONTRIBUTING.md` | Create | Document the 3 invocation paths + how to wire the pre-push hook |
| `.opencode/skills/deep-ai-council/feature_catalog/` | Create | 9 category folders, 32 entry files |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modify | §17 catalog rows: replace 32 "No feature catalog exists yet" with real paths |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` | Create | Reverse-anchor integrity check |
| `.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` | Create | DAC-025 replay helper |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/007-council-graph-derived-projection-rebuilds-from-artifacts.md` | Modify | Reference the new replay script |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Modify | Add Codex TOML name + description prose assertions |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/dac-030.ts` and `dac-032.ts` | Modify | Inline normalization provenance comments |
| Parent 101 `spec.md` + `graph-metadata.json` | Modify | Add phase 007 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `npm run test:council` runs the full 8-file council vitest matrix | Exit 0; "Test Files 8 passed (8)" in output |
| REQ-002 | Standalone runner exits non-zero on any failure | Inject a temp test failure; runner exits 1; remove failure; runner exits 0 |
| REQ-003 | 32 feature catalog entries exist matching 32 DAC scenarios | `find feature_catalog -name '*.md' \| wc -l` returns 32; each DAC-NNN has exactly one entry |
| REQ-004 | Root playbook §17 references real catalog paths, no "No feature catalog exists yet" remaining | `rg "No feature catalog exists yet" manual_testing_playbook.md` returns 0 hits |
| REQ-005 | Reverse-anchor meta-test passes | `npx vitest run tests/council-playbook-anchor-integrity.vitest.ts` returns at least 1 test passed, 0 failures |
| REQ-006 | DAC-025 replay helper exists and is invokable | `node scripts/replay-graph-from-artifacts.cjs --help` exits 0; script accepts `--spec-folder <path> --session-id <id>` args |
| REQ-007 | Codex TOML mirror name + description assertions present | Test passes; deliberately corrupt TOML description → test fails |
| REQ-008 | Fixture normalization comments present | grep finds `NORMALIZATION` (or similar) in both dac-030.ts and dac-032.ts |
| REQ-009 | Full 9-file council vitest matrix passes (8 existing + 1 new anchor-integrity) | 0 failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | sk-doc quick_validate passes on deep-ai-council | Exit 0 |
| REQ-011 | Strict spec validation passes on packet 007 + parent 101 | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new contributor can run `npm run test:council` to validate council changes — no docs spelunking required.
- **SC-002**: Renaming a vitest test name that a playbook scenario anchors to fails the next CI run via the reverse-anchor meta-test.
- **SC-003**: All 32 DAC scenarios have a discoverable feature-catalog entry indexable by skill-graph traversal.
- **SC-004**: DAC-025's derived-projection replay path is executable, not just documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Feature-catalog drift from playbook scenario titles | Medium | Each catalog entry's `Feature ID` in SOURCE METADATA names the DAC-NNN — easy grep for drift |
| Risk | Reverse-anchor test brittleness (file paths shift) | Low | Test discovers anchors by glob, not hardcoded — survives reorganization |
| Risk | Replay helper diverges from real artifact contract | Medium | Helper consumes `ai-council-state.jsonl` directly (same contract as `persist-artifacts.js`); add a smoke test in the script |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. User approved scope ("fix all gaps"); implementation routed to cli-codex gpt-5.5 high fast.
<!-- /ANCHOR:questions -->
