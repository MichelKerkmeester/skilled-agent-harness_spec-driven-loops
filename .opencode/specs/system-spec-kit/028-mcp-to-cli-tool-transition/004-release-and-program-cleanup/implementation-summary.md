---
title: "Implementation Summary: Phase 4: Release and Program Cleanup [system-spec-kit/028-mcp-to-cli-tool-transition/004-release-and-program-cleanup/implementation-summary]"
description: "IN PROGRESS — running summary for the 028 post-release doc-alignment phase; final state recorded at phase close."
trigger_phrases:
  - "028 release cleanup result"
  - "004 release-and-program-cleanup result"
  - "cli transition doc cleanup summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/004-release-and-program-cleanup"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Phase closed: all doc groups aligned, SC-001/SC-002 green, stress set executed"
    next_safe_action: "028 parent close: T9xx runtime drills, then memory save"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-to-cli-tool-transition/004-release-and-program-cleanup |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 028 documentation surface was double-checked against the shipped dual-stack reality and aligned across every affected group. The cleanup ran in three waves: waves 1-2 (prior sessions) covered the skill/code/root READMEs (groups a-c), `ENV_REFERENCE.md` CLI env-var rows (T060), feature catalogs + manual-testing playbooks incl. the 028 CLI stress set 434-438 (group g), and the three release changelog entries v3.5.0.5 / v1.2.0.0 / v0.7.0 (group h). Wave 3 (this session) closed the remaining groups via three parallel Fable 5 agents with disjoint write paths: group (d) commands, group (e) agent rosters, group (f) skill references — followed by the SC-001/SC-002 verification gate and execution of the 028 CLI stress scenarios with a small-model test subject.

### Matrix — 3 systems × doc groups (a)-(h)

| Group | spec-memory | code-index | skill-advisor | State |
|-------|-------------|------------|---------------|-------|
| (a) SKILL+README | ✓ | ✓ | ✓ | patched (waves 1-2) |
| (b) code READMEs | ✓ | ✓ | ✓ | patched (waves 1-2) |
| (c) top-level READMEs | n/a (shared) | n/a | n/a | patched (waves 1-2) |
| (d) commands | ✓ | ✓ (doctor parity gap dispositioned) | ✓ | 14 files patched (wave 3) |
| (e) agent rosters | — | — | — | verified-no-change (wave 3) |
| (f) references + ENV | ✓ | ✓ | ✓ | 12 ref files + ENV_REFERENCE (wave 3 + T060) |
| (g) catalogs+playbooks | ✓ | ✓ | ✓ | patched + stress set executed (waves 1-2 + this session) |
| (h) changelog | v3.5.0.5 | v1.2.0.0 | v0.7.0 | published (wave 2) |

### Files Changed (wave 3)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/{_routes.yaml,assets/doctor_skill-advisor.yaml,assets/doctor_skill-budget.yaml}` | Modified | Added `--warm-only` to probes so they honor "no daemon spawn" |
| `.opencode/commands/memory/{manage,save,search,learn}.md`, `memory/README.txt` | Modified | `spec-memory` CLI warm-only fallback + exit-75 recovery rows |
| `.opencode/commands/speckit/{resume,plan,complete,implement}.md`, `speckit/assets/{speckit_resume_auto,speckit_resume_confirm}.yaml` | Modified | Transport-down CLI-fallback references |
| `.opencode/skills/{system-spec-kit,system-code-graph,system-skill-advisor}/references/**` (12 files) | Modified | CLI-reference + hook-fallback alignment to dual-stack reality |
| `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modified | Phase close reconciliation |
| `../spec.md` (parent) | Modified | Phase map row for 004 → Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verification-first throughout: each doc surface was read and diffed against shipped behavior, with only real 028-relevant drift patched (no style rewrites) and "verified, no drift / no change" recorded where accurate. Wave 3 used three parallel Fable 5 agents on disjoint write paths (commands / agent-rosters / references) so they could not collide; the orchestrator handled all spec-folder doc reconciliation and the verification gate centrally. The doctor memory/code-graph CLI-probe parity gap was dispositioned (not edited) per REQ-004 — see Known Limitations. Three out-of-028-scope defects surfaced by the agents were reported, not fixed (scope lock). The 028 CLI stress scenarios were executed with MiMo v2.5-pro (`xiaomi/mimo-v2.5-pro`) as a small-model test subject via cli-opencode, with parallel Fable 5 review and orchestrator-run authoritative ground truth.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Single Level 2 phase instead of a phase-parent like 026's `000-release-and-program-cleanup` | 028's cleanup universe is one coherent doc-alignment sweep, not eight independent workstreams |
| Doctor memory/code-graph CLI-probe gap is verify-and-disposition, not auto-edit | Parity may be intentionally deferred to owning workstreams; needs operator sign-off (REQ-004) |
| Changelog written via skill-local paths | `.opencode/changelog/<track>` directories are symlinks; git tracks the real skill-local files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**SC-001 (stale-claim grep)** — PASS: zero sole-path MCP assertions and zero live Gemini/Devin references across all in-scope surfaces (commands/agents/references); CLI fallback now referenced across the patched memory/speckit docs.

**SC-002 (bidirectional ENV_REFERENCE-vs-code env var diff)** — PASS: all 11 shipped CLI env vars (`SPECKIT_SPEC_MEMORY_CLI_{WARM_ONLY,PROMPT_TIME,DEV_ALLOW_STALE}`, `SPECKIT_CODE_INDEX_CLI_{WARM_ONLY,PROMPT_TIME,DEV_ALLOW_STALE}`, `MK_SKILL_ADVISOR_CLI_{WARM_ONLY,PROMPT_TIME,TRUSTED,DEV_ALLOW_STALE}`, `MK_SKILL_ADVISOR_TRUST_DEFAULT`) documented; 0 missing, 0 phantom.

**Playbook count self-check** — PASS: deterministic methodology count = 399 = expected.

**028 CLI stress scenarios (434-438)** — all PASS, triple-verified non-circularly:
- 437 numeric coercion: 8×exit-75 (coerced) / 4×exit-64 (rejected) — orchestrator ground truth, MiMo test-subject (matched), Fable source audit (matrix correct per `coerceArgsToSchema` + schema with handler-owned range clamping).
- 438 trust-gate fuzz: 9×exit-64 untrusted / 5×exit-75 controls — gate holds against flag-order, env-zero, and `--json` payload shapes; confirmed by `assertTrustedForMutation` audit.
- 436 large-payload: 75,538 bytes (>64KB), 1 stable hash/format across 10 reps, 0 parse-fails (json + jsonl).
- 435 warm-only churn: 0/60 non-75 probes, lifecycle suite green, launcher delta 0 (orchestrator-run authoritative).
- 434 concurrent dual-client: 9/9 suite executions green across 3 rounds, launcher delta 0 (orchestrator-run authoritative).
- Host daemons untouched throughout (launcher delta 0); MiMo's deterministic results matched orchestrator ground truth byte-for-byte (identical SHA-256 hashes).

**Structural** — `validate.sh --strict` exit 0 on this folder and the parent packet (recorded at close).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **RESOLVED (REQ-004, operator sign-off received 2026-06-10):** the `doctor_memory.yaml` / `doctor_code-graph.yaml` CLI-probe gap is now closed — warm-only `cli_health_command`/`cli_health_policy` + route-action + `_routes.yaml` `script_invocations` rows added (mirroring the skill-advisor pattern), `node .opencode/bin/spec-memory.cjs memory_health --warm-only` and `node .opencode/bin/code-index.cjs code_graph_status --warm-only` (both smoke-verified exit 75, no spawn; route-validate.sh passes 7 routes). Implemented by a GPT-5.5-fast agent, orchestrator-verified.
- **Out-of-028-scope defects reported, not fixed (scope lock):** (1) `.claude/agents/` frontmatter grants use underscore `mcp__mk_spec_memory__*` while the live server is hyphenated `mk-spec-memory` — the spec-memory tool grants may silently not match (code-index grants are fine); (2) `system-code-graph/references/runtime/launcher_lease.md` §1 says a held lease "prints LEASE_HELD_BY and exits" but the launcher now attempts `bridgeOrReportLeaseHeld()` first; (3) pre-existing typo "spec docss" in `speckit/implement.md`. All pre-existing, not 028 drift — flagged for a follow-on packet.
- T9xx transport-down drills and the tri-daemon spawn drill remain owned by the workstream phases; this cleanup phase closes independently of them (the tri-daemon drill already passed under 003/002-hardening).
<!-- /ANCHOR:limitations -->
