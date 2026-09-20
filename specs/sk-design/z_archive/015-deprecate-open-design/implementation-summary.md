---
title: "Implementation Summary"
description: "Deprecation executed: tree removed, references stripped, gates verified."
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `sk-design/015-deprecate-open-design` |
| **Status** | Complete — deprecation implemented and verified |
| **Started** | 2026-08-10 |
| **Completed** | 2026-08-10 |
| **Verification** | `validate.sh --strict` exit 0; residue gate clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet deprecated the Open Design MCP transport end-to-end:

- **Removed**: `.opencode/skills/sk-design/sk-design-mcp-open-design/` (45 files) — deleted; `sk-prompt`'s `design-generation-patterns.md` — deleted; deep-alignment's `sk-design-live-render.cjs` adapter + 3 doc files — deleted; playbook scenario `mcp-open-design-mode.md` + `design-mode-pairing-before-run.md` — deleted.
- **Configs**: `open_design` MCP server entry removed from `.utcp_config.json` (`.claude/.utcp_config.json` verified already clean).
- **Hub**: sk-design SKILL.md/README/registry JSONs/manifests/feature-catalog/playbook/shared/md-generator stripped; transport mode removed from mode-registry (3→2) and leaf-manifest (3→2); 14 sk-design tests pass.
- **Agents/commands**: design.md ×6 runtimes, deep-alignment.md ×4 runtimes, interface commands, doctor MCP command+YAML, install-guides — stripped.
- **deep-alignment**: live-render lane removed from SKILL.md, scoping.cjs registry, tests (coverage-integrity 36/36, scoping-adapter pass); docs reworded.
- **Sibling skills**: mcp-code-mode, mcp-figma, cli-external-orchestration ×5, sk-code checklist, sk-prompt improve, sk-doc fixtures/validator/template, system-spec-kit workflow+link-guard+ground-truth (lib+dist, id 82 removed, parity kept), system-skill-advisor (boosters removed from skill_advisor.py, playbooks re-pointed, skill-graph.json regenerated via skill_graph_compiler.py).
- **Root docs**: README.md, AGENTS.md, BARTER.md, CLAUDE.md (symlink) stripped.
- **Fixtures**: canary transport case removed; 42 benchmark fixtures' `forbiddenWorkflowModes` cleaned + `rankBelowSkillIds` entry removed; `openDesignLineageDigest` → `lineageDigest` renamed across proof token, lint, fixtures.
- **Derived artifacts**: sk-design description.json/graph-metadata.json rewritten and refreshed via generate-context.js.
- **Remnant remediation**: removed the empty transport axis and retired advisor keywords, purged stale adapter claims from agents/commands/catalogs/playbooks/tests, removed the broken changelog symlink, reduced the variant transport schema to its actual Figma consumer, and regenerated the advisor graph, leaf manifest, and compiled command contract.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Level 3 packet scaffolded via `create.sh` and authored (spec, plan, tasks, checklist, decision-record).
- Live-surface allowlist built from `git ls-files` + grep sweeps; historical exclusions enumerated in `spec.md` §3.
- Nine deep-review iterations completed via native pi subagents; the aborted tenth launch and operator-directed early stop remain recorded in the review state.
- Implementation removed the transport tree and consumers, then a post-completion remnant audit expanded the vocabulary to adjacent adapter and routing aliases.
- Canonical generators refreshed derived artifacts before focused tests, packet validation, and completion checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Full removal, no stub (ADR-001) | "Deprecate completely"; a stub keeps 45 dead files + routing references alive |
| Native pi subagents for the review loop (ADR-002) | Operator's explicit instruction; pi runtime has no opencode YAML workflow runner |
| Historical records preserved (ADR-003) | Audit trail; edits restricted to the live allowlist |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Placeholder sweep | Clean after authoring (implementation-summary now filled) |
| `validate.sh --strict` | **PASSED — exit 0, 0 errors, 0 warnings** |
| Residue grep gate | **Clean — full-variant sweep exit 1 (zero hits on live surfaces)** |
| Review artifacts (9 iterations + report; 10th aborted, operator-directed early convergence) | **Present — review/review-report.md verdict CONDITIONAL, 19 P1 / 0 P0** |
| Expanded remnant gate | **PASSED — no live transport or retired-adapter aliases** |
| Derived artifact freshness | **PASSED — advisor graph regenerated, leaf manifest fresh, compiled contract byte-stable** |
| Focused runtime tests | **PASSED — deep-alignment 36/36 + scoping, artifact writer 25/25, variant gate 5 rows** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Historical records (specs/, changelog history, dated benchmark reports, captured discovery baselines) keep mentioning the transport by design (ADR-003); the residue gate is scoped to the live allowlist.
- sqlite memory/advisor/graph DBs retain indexed content until re-scanned; not hand-edited.
- Reducer CLI defect (post-write logging crash) fixed during closeout; `reduce-state.cjs` CLI rerun verified exit 0.
- 6 existing test failures in sk-doc-command-adapter.test.cjs remain tied to a missing relocated oracle and were not changed by this packet.
- The global deep-alignment contract-drift checker still reports `TOOL_ALLOWLIST_OVERFLOW` because the unchanged command frontmatter lacks the tools already present in the generated contract; the same mismatch exists in `HEAD`, and this remediation did not broaden command permissions.
<!-- /ANCHOR:limitations -->
