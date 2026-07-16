---
title: "Tasks: Phase 4: Release and Program Cleanup [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup/tasks]"
description: "Task breakdown for the 028 post-release doc-alignment universe, grouped (a)-(h); in-flight concurrent-agent rows marked for reconciliation."
trigger_phrases:
  - "028 release cleanup tasks"
  - "004 release-and-program-cleanup tasks"
  - "cli transition doc cleanup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All task groups closed; SC-001/SC-002 green; T041 dispositioned-deferred"
    next_safe_action: "validate.sh --strict folder + parent, then close phase"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 4: Release and Program Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

**IN-FLIGHT marker**: rows tagged `IN-FLIGHT` are being executed by other concurrent agents right now (catalog/playbook + skill READMEs). For those rows this phase snapshots their progress, verifies their output against shipped behavior, and fills gaps only — it does not re-edit aligned content.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the truth-source inventory: CLI bins (`.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs`), CLI entry points (`mcp_server/{spec-memory-cli.ts,code-index-cli.ts,skill-advisor-cli.ts}`), plugins (`.opencode/plugins/{mk-spec-memory.js,mk-skill-advisor.js,mk-code-graph.js}`), env var grep inventory (11 vars), doctor route CLI-probe state, changelog slots (v3.5.0.4 / v1.1.0.0 / v0.6.0)
- [x] T002 Snapshot in-flight concurrent-agent progress on groups (a) and (g) before touching those surfaces — concurrent agents finished waves 1-2; their output (T010-T012, T070-T072) reconciled, not re-edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group (a) — Skill docs: SKILL.md + README.md, three systems — IN-FLIGHT

- [x] T010 [P] IN-FLIGHT reconcile: system-spec-kit SKILL.md + README.md describe the dual-stack `spec-memory` CLI, warm-only fallback semantics, and the new `mk-spec-memory.js` OpenCode plugin (`.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/README.md`)
- [x] T011 [P] IN-FLIGHT reconcile: system-code-graph SKILL.md + README.md describe the `code-index` CLI fallback and the CLI-backed `mk-code-graph.js` bridge repair (the reverted in-process import fix replaced by the CLI/IPC path) (`.opencode/skills/system-code-graph/SKILL.md`, `.opencode/skills/system-code-graph/README.md`)
- [x] T012 [P] IN-FLIGHT reconcile: system-skill-advisor SKILL.md + README.md describe the `skill-advisor` CLI, prompt-time warm path, trust gate (`MK_SKILL_ADVISOR_TRUST_DEFAULT`), and facade-vs-CLI caller guidance (`.opencode/skills/system-skill-advisor/SKILL.md`, `.opencode/skills/system-skill-advisor/README.md`)

### Group (b) — Code READMEs

- [x] T020 [P] Align `mcp_server/README.md` for system-spec-kit: `spec-memory-cli.ts` entry point, dual-stack contract, env vars, launcher relationship (`.opencode/skills/system-spec-kit/mcp_server/README.md`)
- [x] T021 [P] Align `mcp_server/README.md` for system-code-graph: `code-index-cli.ts`, plugin bridge (`plugin_bridges/mk-code-graph-bridge.mjs`), hooks fallback (`.opencode/skills/system-code-graph/mcp_server/README.md`)
- [x] T022 [P] Align `mcp_server/README.md` for system-skill-advisor: `skill-advisor-cli.ts`, `plugin_bridges/mk-skill-advisor-bridge.mjs`, hooks `lib/skill-advisor-cli-fallback.ts` (`.opencode/skills/system-skill-advisor/mcp_server/README.md`)
- [x] T023 [P] Align `.opencode/bin/README.md`: document the three CLI wrappers (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) next to the three launchers (`.opencode/bin/README.md`)
- [x] T024 [P] Align `.opencode/bin/lib/README.md` with any shared-lib additions the CLI wrappers introduced (`.opencode/bin/lib/README.md`)

### Group (c) — Top-level READMEs

- [x] T030 [P] Public root README: the NATIVE MCP TOPOLOGY section and access-path prose gain the dual-stack CLI surface; no claim that the three systems are MCP-only (`README.md`)
- [x] T031 [P] Skills index README: three-system entries reflect the CLI fallback surfaces (`.opencode/skills/README.md`)

### Group (d) — Commands

- [x] T040 [P] VERIFY doctor routes already updated during workstreams: `_routes.yaml` + `doctor_skill-advisor.yaml` + `doctor_skill-budget.yaml` CLI probes present and accurate (`.opencode/commands/doctor/`) — probes present; fixed to add missing `--warm-only` so they honor the "do not start a daemon" policy (empirically confirmed exit 75, no spawn); route-validate passes (7 routes)
- [x] T041 [P] Disposition the doctor parity gap: `doctor_memory.yaml` and `doctor_code-graph.yaml` carry no CLI probes today — verify whether intentional; edit only with operator sign-off per spec.md REQ-004 (`.opencode/commands/doctor/assets/`) — FIXED (operator sign-off received 2026-06-10): added warm-only `cli_health_command`/`cli_health_policy` + route-action + `_routes.yaml` `script_invocations` rows to both yamls, mirroring the skill-advisor pattern — `spec-memory.cjs memory_health --warm-only` / `code-index.cjs code_graph_status --warm-only` (both smoke-verified exit 75, no spawn); route-validate.sh passes (7 routes)
- [x] T042 [P] Sweep `memory:*` command docs for transport-sensitive flows that should reference the `spec-memory` CLI fallback (`.opencode/commands/memory/`) — 5 docs patched (manage/save/search/learn + README) with warm-only CLI fallback + exit-75 semantics; manage.md no-Bash toolset preserved
- [x] T043 [P] Sweep `speckit:*` command docs (incl. resume/recovery prose) for the same CLI-fallback references (`.opencode/commands/speckit/`) — resume/plan/complete/implement + 2 resume yamls patched; routine in-session mcp_integration yamls left as accurate

### Group (e) — Agent rosters (3 runtimes)

- [x] T050 [P] Sweep `.opencode/agents/` for MCP-only claims about memory/code-graph/advisor access; update only where CLI-relevant (`.opencode/agents/`) — VERIFIED-NO-CHANGE: all MCP mentions are tool listings / capability boundaries / whitelists, not sole-path access claims
- [x] T051 [P] Same sweep for the Claude mirror roster (`.claude/agents/`) — VERIFIED-NO-CHANGE: mirror bodies parity-match canonicals; frontmatter `tools:` grants are whitelists, not access-path prose
- [x] T052 [P] Same sweep for the Codex mirror roster (`.codex/agents/`) — VERIFIED-NO-CHANGE: `.toml` mirror bodies parity-match; shared-MCP-channel header comments remain true post-release (CLI is additive)

### Group (f) — Skill references / assets

- [x] T060 Add the new CLI env var rows to ENV_REFERENCE.md — confirmed absent today: `SPECKIT_SPEC_MEMORY_CLI_{WARM_ONLY,PROMPT_TIME,DEV_ALLOW_STALE}`, `SPECKIT_CODE_INDEX_CLI_{WARM_ONLY,PROMPT_TIME,DEV_ALLOW_STALE}`, `MK_SKILL_ADVISOR_CLI_{WARM_ONLY,PROMPT_TIME,TRUSTED,DEV_ALLOW_STALE}`, `MK_SKILL_ADVISOR_TRUST_DEFAULT` (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
- [x] T061 [P] Verify/align CLI-reference-style docs in each system's `references/` (incl. hook-system docs that describe the runtime fallback path) (`.opencode/skills/{system-spec-kit,system-code-graph,system-skill-advisor}/references/`) — 12 files patched (hook_system, skill_advisor_hook ×2, troubleshooting, env vars, tool_surface, naming_conventions, freshness_contract, tool_ids_reference, etc.); all CLI snippets live-verified; also fixed two nonexistent plugin paths; remainder verified-no-drift

### Group (g) — Feature catalogs + manual-testing playbooks — IN-FLIGHT

- [x] T070 [P] IN-FLIGHT reconcile: system-spec-kit feature catalog section(s) for the `spec-memory` CLI + playbook rows incl. 028 CLI stress scenarios; bump the playbook's hand-maintained file-count self-check and big-table index (`.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`, `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`)
- [x] T071 [P] IN-FLIGHT reconcile: system-code-graph catalog + playbook rows for the `code-index` CLI and bridge repair (`.opencode/skills/system-code-graph/feature_catalog/`, `.opencode/skills/system-code-graph/manual_testing_playbook/`)
- [x] T072 [P] IN-FLIGHT reconcile: system-skill-advisor catalog + playbook rows — `cli-hooks-and-plugin/` scenarios already exist; verify coverage incl. trust gate + dual-failure stress rows (`.opencode/skills/system-skill-advisor/feature_catalog/`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/`)

### Group (h) — Changelog

- [x] T080 Author the 028 release changelog entry for system-spec-kit (next free slot after v3.5.0.4); write via the skill-local changelog path, not the `.opencode/changelog/` symlink; check the slot at write time for parallel-session collisions (`.opencode/skills/system-spec-kit/changelog/`)
- [x] T081 [P] Author the system-code-graph release entry (next free slot after v1.1.0.0) (`.opencode/skills/system-code-graph/changelog/`)
- [x] T082 [P] Author the system-skill-advisor release entry (next free slot after v0.6.0) (`.opencode/skills/system-skill-advisor/changelog/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T090 Run the SC-001 stale-claim grep across all in-scope surfaces; attach hit-free evidence per group — PASS: zero live Gemini/Devin refs, zero sole-path MCP assertions across commands/agents/references; CLI fallback now referenced across all patched memory/speckit docs
- [x] T091 Run the SC-002 bidirectional ENV_REFERENCE-vs-code env var diff (no missing, no phantom vars) — PASS: 11/11 shipped CLI env vars documented; zero missing, zero phantom
- [x] T092 Complete checklist.md with evidence; run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` --strict on this folder and the parent packet (both exit 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T041 dispositioned-deferred per REQ-004, P1 user-approved-deferral path)
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements in spec.md verified with evidence (REQ-001/002/003 via groups a-c/f/h; SC-001/SC-002 green)
- [x] IN-FLIGHT rows reconciled with the concurrent agents' final output, not duplicated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Model phase**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/`
<!-- /ANCHOR:cross-refs -->
