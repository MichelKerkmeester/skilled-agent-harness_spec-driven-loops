---
title: "Tasks: Deprecate sk-design mcp-open-design transport skill and remove all live references"
description: "Task breakdown: review init, allowlist, implementation strips, verification."
trigger_phrases:
  - "deprecate open design"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/015-deprecate-open-design"
    last_updated_at: "2026-08-10T14:09:15Z"
    last_updated_by: "remnant-remediation"
    recent_action: "Removed residual transport contracts"
    next_safe_action: "None — remnant remediation verified"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-mcp-open-design/"
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deprecate-open-design-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deprecate sk-design mcp-open-design transport skill and remove all live references

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Deep Review

- [x] T001 Init review packet: config, strategy, registry, JSONL (review/) — [evidence: `review/deep-review-config.json` and state artifacts present]
- [x] T002 Complete 9 LEAF iterations with GPT-5.6 Luna max/fast via native pi subagents; preserve the aborted tenth launch and operator-directed early stop (review/iterations/) — [evidence: `review/iterations/` contains 9 iteration files and the state records the stop]
- [x] T003 Reduce state after each iteration via reduce-state.cjs (review/) — [evidence: `reduce-state.cjs` final rerun exited 0]
- [x] T004 Synthesize review-report.md with verdict (review/review-report.md) — [evidence: `review/review-report.md` present]
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T010 Freeze live-surface allowlist from inventory + review findings (scratch/) — [evidence: `git ls-files` inventory and review findings produced the residue-gate scope]
- [x] T011 Confirm no historical file (specs/, changelog history, benchmark corpora, sqlite) is on the edit list — [evidence: `git diff --name-only` scope review preserved documented historical classes]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T020 [P] Delete `.opencode/skills/sk-design/sk-design-mcp-open-design/` tree (45 files) — [evidence: `test ! -e` passes]
- [x] T021 [P] Remove `open_design` MCP server entry from `.utcp_config.json` — [evidence: `.utcp_config.json` parses and contains zero matching entries]
- [x] T022 Strip sk-design hub: SKILL.md, README.md, mode-registry.json, leaf-manifest.json, hub-router.json, command-metadata.json, description.json, graph-metadata.json — [evidence: `mode-registry.json` has exactly 2 workflow modes]
- [x] T023 Strip sk-design feature-catalog/, manual-testing-playbook/, shared/ — [evidence: expanded `git grep -E` residue gate passes]
- [x] T024 Strip sk-design-md-generator references — [evidence: `git grep -E` reports no live retired identifiers]
- [x] T025 [P] Strip agents: `.opencode/agents/design.md`, `deep-alignment.md`; `.claude/agents/*`; `.codex/agents/*.toml`; `.pi/agents/*.md` — [evidence: targeted `check-agent-mirror-sync.cjs` passes]
- [x] T026 [P] Strip commands: `.opencode/commands/interface/design.md`, `design-reference.md`; `doctor/mcp.md`, `doctor-mcp-install.yaml`; `install-guides/README.md` — [evidence: generated `deep-alignment.contract.md` is byte-identical to a fresh compile]
- [x] T027 Strip deep-alignment: adapters, feature-catalog, playbook, scripts/adapters/sk-design-live-render.cjs, tests — [evidence: coverage-integrity `36/36` and scoping-adapter pass]
- [x] T028 [P] Strip sibling skills: mcp-code-mode, mcp-figma, cli-external-orchestration, sk-code checklist, sk-prompt improve, sk-doc fixtures/tests/templates, system-spec-kit playbook/eval — [evidence: expanded `git grep -E` live-surface gate passes]
- [x] T029 Re-point system-skill-advisor corpus (skill_advisor.py, skill-graph.json) — [evidence: regenerated `skill-graph.json` has zero retired signals]
- [x] T030 [P] Strip root docs: README.md, AGENTS.md, BARTER.md — [evidence: expanded `git grep -E` live-surface gate passes]
- [x] T031 Adjudicate compiled-routing canary fixture per review finding — [evidence: `canary-cases.v1.json` parses after the retired case removal]
- [x] T032 Regenerate derived manifests/descriptions that reference the removed leaf — [evidence: `generate-leaf-manifest.cjs --check` passes and advisor graph regeneration exited 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 JSON parse check on every edited JSON (.utcp_config.json, registry/manifest files) — [evidence: `python3 -m json.tool` checks pass]
- [x] T041 Zero-residue grep gate over live-surface allowlist — [evidence: expanded `git grep -E` returns exit 1]
- [x] T042 `validate.sh specs/sk-design/015-deprecate-open-design --strict` exit 0 — [evidence: `validate.sh --strict` final rerun]
- [x] T043 checklist.md all P0/P1 items evidenced — [evidence: `check-completion.sh` reports P0 17/17 and P1 25/25]
- [x] T044 Write implementation-summary.md; update decision-record.md with outcomes — [evidence: `implementation-summary.md` and `decision-record.md` present]
- [x] T045 Final `git status`/diff review: no historical files touched, no stray files — [evidence: `git diff --check` passes and audit artifacts remain outside the repository]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Remnant Audit Remediation

- [x] T050 Remove the empty sk-design transport-axis metadata and retired advisor keywords — [evidence: `mode-registry.json`, `description.json`, and `skill-graph.json` residue scan returns zero]
- [x] T051 Remove stale deep-alignment adapter claims from runtime agents, command sources, catalogs, playbooks, and manifests — [evidence: expanded `git grep -E` live-surface gate passes]
- [x] T052 Replace retired-adapter test fixtures and comments with authority-neutral coverage — [evidence: `scoping-adapter.test.cjs` and comment-hygiene checks pass]
- [x] T053 Remove the broken tracked changelog symlink — [evidence: `test ! -L .opencode/changelog/sk-design/design-mcp-open-design` passes]
- [x] T054 Regenerate `skill-graph.json`, `leaf-manifest.json`, and the compiled deep-alignment command contract from canonical sources — [evidence: graph compiler exited 0, manifest freshness passes, compiled contract byte comparison passes]
- [x] T055 Re-run the expanded subsystem residue gate and focused runtime/config tests — [evidence: residue gate passes; runtime artifact writer `25/25`; variant schema gate passes 5 rows]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (residue gate + validate.sh + diff review)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
