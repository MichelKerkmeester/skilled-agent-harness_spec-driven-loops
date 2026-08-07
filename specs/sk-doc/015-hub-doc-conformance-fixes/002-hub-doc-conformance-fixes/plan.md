---
title: "Implementation Plan: Hub Doc Conformance Fixes [015-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes]"
description: "Verify-first fix protocol, four-work-stream partition, doc-layer/routing-layer coordination boundary, and the re-run-deep-review gate for remediating the 015-hub-doc-conformance-fixes/001-hub-doc-conformance-review FAIL verdict."
trigger_phrases:
  - "implementation"
  - "plan"
  - "hub doc conformance fixes"
  - "verify-first protocol"
  - "work-stream partition"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes"
    last_updated_at: "2026-07-11T09:08:12.320Z"
    last_updated_by: "claude"
    recent_action: "Authored the four-work-stream remediation plan"
    next_safe_action: "Dispatch WS-A through WS-D fix agents against tasks.md"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/015-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "131-hub-doc-conformance-fixes-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Hub Doc Conformance Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec-kit + sk-doc template-conformant docs) |
| **Framework** | `system-spec-kit` templates (Level 3) + `sk-doc` README/feature-catalog/playbook schemas |
| **Storage** | None (doc-only; no runtime state changes) |
| **Testing** | `validate.sh --strict` per touched packet + live CLI/MCP verify-first probes per reality-drift finding |

### Overview
The review's dashboard self-reports 102 P0 / 5 P1 / 4 P2 findings as the raw sum across its 10 iteration runs; its own deduplicated findings registry (`deep-review-findings-registry.json`, `findingsBySeverity`) resolves this to 67 P0 / 4 P1 / 2 P2 distinct, still-open finding IDs (73 total) -- the raw sum double-counts at least one iteration's self-reported summary (iteration 9's metadata claims 36 P0 while it emitted exactly 2 real `finding` records, confirmed against `deltas/iter-009.jsonl`). This plan organizes all 73 distinct IDs into four file-disjoint work-streams (WS-A ClickUp, WS-B cli-opencode/cli-claude-code, WS-C Figma/Chrome DevTools, WS-D cross-cutting root playbooks and test-oracle mechanics), each independently dispatchable, each bound by the same verify-first protocol and doc-layer scope boundary defined below.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` sections 2-3).
- [x] All 73 distinct findings identified and mapped to a single owning work-stream (this plan, section "Verify-First Protocol" below plus `tasks.md`).
- [x] Dependencies identified: the findings registry, the 10 iteration narratives, and live CLI/MCP reachability at fix time.

**Verify-first protocol (mandatory for every reality-drift finding -- any claim about a CLI flag, command shape, MCP tool name, output field, storage path, or runtime behavior):**
1. **Probe before editing.** Re-run the exact command or discovery call the review cited (`cupt <cmd> --help`, `figma-ds-cli <cmd> --help`, `bdg --help`, live Code Mode `tool_info()`/`list_tools()`) against the currently installed/configured tool. Never reuse the review's quoted output as still-current without a fresh check.
2. **Confirm.** If the live probe confirms the review's claim, apply the review's "Exact fix" as written (or the closest safe equivalent).
3. **Diverge on new drift.** If the live probe contradicts the review's claim (the tool changed again since the review ran), stop and document the newly observed live truth instead of the review's now-stale evidence.
4. **Halt if unreachable.** If the live probe is unreachable (binary missing, MCP provider down, network required), halt that specific finding, mark it `BLOCKED` in `tasks.md` with the reason, and move to the next finding. Never fabricate a plausible-sounding answer.
5. **Never silently delete.** A capability claim is never removed just because it is inconvenient to verify -- either verify it live or mark it `BLOCKED`.

### Definition of Done
- [ ] Every work-stream's tasks in `tasks.md` are checked `[x]` with the live-probe evidence cited (file:line or command output) per `EVIDENCE_CITED`.
- [ ] `validate.sh --strict` returns 0/0 for every touched hub packet, not only this planning packet.
- [ ] The Phase 3 re-run-deep-review gate (section 4 below) reports 0 active P0 findings, or an explicit, operator-approved carry-over list.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four parallel, file-disjoint work-streams with one shared verify-first protocol and one shared scope boundary -- not a software architecture pattern, but the same non-collision discipline: each file has exactly one owning work-stream, verified by direct cross-reference against every other stream's finding list (see the collision check below).

### Key Components
- **WS-A (ClickUp)**: 28 P0 + 3 solely-owned P1 + a joint P1 share = every finding under `mcp-tooling/mcp-click-up/**`.
- **WS-B (cli-opencode + cli-claude-code)**: 20 P0 + 1 P2 = every finding under `cli-external/cli-opencode/**` and `cli-external/cli-claude-code/**`, including 5 findings merged in from the WS-D theme list because their affected files collide with a reality-drift finding already owned by WS-B (see the collision check below).
- **WS-C (Figma + Chrome DevTools)**: 11 P0 + a joint P1 share + 1 P2 = every finding under `mcp-tooling/mcp-figma/**` and `mcp-tooling/mcp-chrome-devtools/**`.
- **WS-D (cross-cutting)**: 8 P0 = the 4 hub root playbooks (verdict-vocabulary, coverage-count, self-contradiction) plus 2 solo cli-claude-code test-oracle files, carved out of WS-A/B/C's subtrees specifically because they are collision-free (no other finding touches those exact files) and benefit from one consistent fix pattern applied once.

### Data Flow
`deep-review-findings-registry.json` + 10 iteration narratives (frozen evidence) -> work-stream assignment (this plan) -> per-finding verify-first probe -> doc edit -> per-file `validate_document.py` + `extract_structure.py` DQI check -> Phase 3 re-run of `015-hub-doc-conformance-fixes/001-hub-doc-conformance-review`'s scope -> PASS or a documented, smaller carry-over list.

### Collision Check (file-path ownership, verified)
Every candidate cross-cutting finding was checked against every other work-stream's finding files before being assigned to WS-D. Two classes of result:
- **Collision-free (stayed WS-D)**: the 4 hub root playbooks (`cli-claude-code`, `cli-opencode`, `mcp-click-up`, `mcp-chrome-devtools` `manual_testing_playbook.md`) and 2 solo files (`cli-claude-code/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md`, `.../stream-json-incremental-output.md`) plus `cli-opencode/manual_testing_playbook/parallel-detached/ablation-suite.md` -- none of these 7 files carries a finding owned by WS-A, WS-B, or WS-C.
- **Collision found (merged into WS-B)**: `R3-P0-004` (dead root-file link, 8 affected files), `R3-P0-005` (CC-027 background PID), `R3-P0-010` (CC-026 cost metadata), `R4-P0-006` (shell-variable loss), and `R4-P0-007` (unrelated exit status) each share at least one file with an existing WS-B reality-drift finding (`R3-P0-002/003/009`, `R4-P0-003`). Splitting these across two work-streams would mean two agents editing the same file; instead, all five are WS-B tasks, bundled into the same edit pass as the file's reality-drift fix where they share a file.
<!-- /ANCHOR:architecture -->

---

## FIX ADDENDUM: AFFECTED SURFACES

This packet plans a remediation whose root cause is entirely surface drift between documentation and live tool truth -- the addendum is directly applicable.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Live CLI/MCP tool surface (`cupt` 0.8.0, `figma-ds-cli` 1.2.0, `bdg` 0.6.10, ClickUp/Figma Code Mode registries) | Producer: source of truth for every reality-drift claim | Not a consumer -- fix agents read it, never edit it | `--help` output / `tool_info()` / `list_tools()` capture cited in each fix's evidence note |
| `.utcp_config.json` | Producer: source of truth for the active MCP deployment/auth path | Not a consumer -- fix agents read it, never edit it | Direct read at fix time, not the review's cached July 2026 snapshot |
| `mcp-click-up/{feature_catalog,manual_testing_playbook,references,SKILL.md,mcp-servers}` | Consumer: describes the ClickUp CLI + MCP surface | Update (WS-A) | Verify-first probe result + `validate_document.py` + DQI >= 75 |
| `cli-opencode/**`, `cli-claude-code/**` (references, playbooks, assets, README) | Consumer: describes OpenCode/Claude Code CLI + agent routing | Update (WS-B) | Live `opencode run --help` / `claude --help`, current agent roster on disk (`.opencode/agents/`, `.claude/agents/`) |
| `mcp-figma/**`, `mcp-chrome-devtools/**` (feature_catalog, playbooks, references, README, mcp-servers) | Consumer: describes the Figma CLI/MCP + Chrome DevTools MCP surface | Update (WS-C) | Live `figma-ds-cli --help` / `bdg --help` / `tool_info()` |
| 4 hub root playbooks + 2 solo test-oracle files | Consumer: cross-cutting verdict-vocabulary/coverage-count/shell-mechanics claims | Update (WS-D) | Direct scenario-file recount; shell-mechanics fixes re-read in one shell session |
| `SKILL.md` routing block / `INTENT_SIGNALS` / `RESOURCE_MAP` / `mode-registry.json` / `hub-router.json` | Policy: owns advisor routing | Not a consumer of this packet -- explicitly out of scope | Deferred to the coordinated routing-layer pass (`decision-record.md` ADR-003); confirmed none of the 67 P0 findings requires editing one of these blocks |

Required inventories:
- Same-class producers: `rg -n "clickup_clickup_|clickup\\.clickup_" .opencode/skills/mcp-tooling/mcp-click-up` -- confirms every stale two-part Code Mode callable before replacing it with the verified `tool_info()`-returned name.
- Consumers of a changed reality claim: `rg -n "<flag-or-tool-name>" .opencode/skills/<hub>/**/*.md` before editing, so a fix does not miss a sibling file repeating the same stale claim.
- Matrix axes for the work-stream partition: 4 streams x {P0, P1, P2} x {reality-drift, agent-routing, dead-link, playbook-meta-claim, vendored-README, test-oracle} -- the full instantiated matrix is `tasks.md`.
- Algorithm invariant for the doc-layer/routing-layer boundary: a fix agent never opens a diff that touches a line between a `RESOURCE_MAP`/`INTENT_SIGNALS`/routing-block open and close marker in any `SKILL.md`; if a finding's fix requires that, it is deferred, not force-fit.

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

**Coordination boundary (applies to every phase below)**: a fix agent may edit any pure reference/playbook/feature-catalog/README file, and the PROSE sections of `SKILL.md` (overview paragraphs, workflow descriptions, worked examples). A fix agent MUST SKIP any `SKILL.md` routing block, `INTENT_SIGNALS`, `RESOURCE_MAP`, or `mode-registry.json`/`hub-router.json` entry -- those are owned by a separate, coordinated routing-layer pass. Every one of the 67 P0 findings was checked against this boundary during planning; none requires editing an excluded block (confirmed in `decision-record.md` ADR-003).

### Phase 1: Setup
- [ ] Freeze the deduped finding set (67 P0 / 4 P1 / 2 P2) against the registry and all 10 narratives.
- [ ] Capture the pre-fix baseline: run `validate_document.py` + `extract_structure.py` DQI on every target file so post-fix regressions show as deltas, not guesses.
- [ ] Confirm the doc-layer/routing-layer boundary on every target `SKILL.md` (grep for `INTENT_SIGNALS`/`RESOURCE_MAP`/routing-block markers, list them as explicitly out of scope).

### Phase 2: Core Implementation
- [ ] Dispatch WS-A, WS-B, and WS-C in parallel (file-disjoint by construction, no shared paths).
- [ ] Dispatch WS-D in parallel with WS-A/B/C (also file-disjoint by the collision check in section 3).
- [ ] Each work-stream applies the verify-first protocol per finding, fixes the target file(s), and re-runs `validate_document.py` + `extract_structure.py` on every file it touched.

### Phase 3: Verification
- [ ] Re-run `015-hub-doc-conformance-fixes/001-hub-doc-conformance-review`'s scope (or an equivalent `/deep:review` dispatch) against `cli-external` + `mcp-tooling`.
- [ ] Confirm 0 active P0 findings, or record an explicit, operator-approved carry-over list.
- [ ] Run `validate.sh --strict` on every touched packet (not only this planning packet) and report the final Errors/Warnings count.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Every touched file | `validate_document.py --type <asset\|reference>`, `extract_structure.py` (DQI >= 75) |
| Reality (live probe) | Every reality-drift finding | Live `--help` output, `tool_info()`/`list_tools()` Code Mode discovery, direct source read of the vendored CLI (`cupt/*.py`, `figma-ds-cli`) where cited |
| Link/anchor integrity | Every dead-link and source-anchor finding | `rg` + direct filesystem `test -e` resolution from the containing document's directory |
| Manual (end-to-end) | Whole-corpus re-verification | Re-run of `015-hub-doc-conformance-fixes/001-hub-doc-conformance-review`'s scope (Phase 3 gate) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-review-findings-registry.json` + 10 iteration narratives | Internal | Green | No traceable finding set; remediation cannot start. |
| Live `cupt`, `figma-ds-cli`, `bdg` binaries + Code Mode `tool_info()`/`list_tools()` | External | Yellow (must be reachable at fix time) | Verify-first protocol halts affected findings; they carry over `BLOCKED`. |
| `.utcp_config.json` (current MCP deployment/auth config) | Internal | Green | WS-A's transport/auth-drift fixes (`R9-P0-001`, `R10-P0-001`) would target a stale config. |
| Routing-layer coordination (separate agent owning `INTENT_SIGNALS`/`RESOURCE_MAP`) | Internal | Yellow (must stay sequenced/disjoint) | A `SKILL.md` merge collision if both agents edit the same file without the prose/routing-block split. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a work-stream's fix breaks `validate.sh` on the touched packet, or a post-fix live probe contradicts the just-landed claim.
- **Procedure**: `git diff` review of the specific file(s) the failing finding touched, then `git checkout -- <file>` to revert only that finding's edit -- never a broad `git checkout .` that would also revert sibling work-streams' already-landed fixes. Re-run the verify-first protocol before re-attempting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──┬──► WS-A (parallel) ──┐
                  ├──► WS-B (parallel) ──┤
                  ├──► WS-C (parallel) ──┼──► Phase 3 (Verify)
                  └──► WS-D (parallel) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | WS-A, WS-B, WS-C, WS-D |
| WS-A / WS-B / WS-C / WS-D | Setup | Verify |
| Verify | WS-A, WS-B, WS-C, WS-D | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 bounded dispatch |
| WS-A (28 P0, ~120-140 files) | High | 1 bounded dispatch, largest stream |
| WS-B (20 P0, ~35-40 files) | Medium-High | 1 bounded dispatch |
| WS-C (11 P0, ~20 files) | Medium | 1 bounded dispatch |
| WS-D (8 P0, 7 files) | Low-Medium | 1 bounded dispatch, smallest stream |
| Verify (Phase 3) | Medium | 1 `/deep:review`-equivalent re-run + validate sweep |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Baseline captured, doc-layer boundary confirmed on every target `SKILL.md` | End of Phase 1 |
| M2 | All 4 work-streams land | Every task in `tasks.md` checked `[x]` with verify-first evidence; `validate.sh --strict` 0/0 per touched packet | End of Phase 2 |
| M3 | Release-ready | Re-run of `015-hub-doc-conformance-fixes/001-hub-doc-conformance-review`'s scope reports 0 active P0 findings or an approved carry-over list | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Phase 1    │────►│   Phase 2    │────►│   Phase 3    │
│   Setup      │     │ WS-A/B/C/D   │     │   Verify     │
└──────────────┘     └──────┬───────┘     └──────────────┘
                             │
                    ┌────────┴────────┐
                    │  4 disjoint     │
                    │  file subtrees  │
                    └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Setup) | None | Baseline + confirmed doc-layer boundary | WS-A, WS-B, WS-C, WS-D |
| WS-A (ClickUp, 28 P0) | Phase 1 | `mcp-click-up/**` fixes | Phase 3 |
| WS-B (cli-opencode/cli-claude-code, 20 P0) | Phase 1 | `cli-external/cli-{opencode,claude-code}/**` fixes | Phase 3 |
| WS-C (Figma/Chrome DevTools, 11 P0) | Phase 1 | `mcp-figma/**`, `mcp-chrome-devtools/**` fixes | Phase 3 |
| WS-D (cross-cutting, 8 P0) | Phase 1 | 4 hub root playbook + 3 solo test-oracle fixes | Phase 3 |
| Phase 3 (Verify) | WS-A, WS-B, WS-C, WS-D | Re-run deep-review result + validate.sh sweep | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Setup)** -- 1 bounded dispatch -- CRITICAL
2. **WS-A (largest stream, 28 P0, ~120-140 files)** -- 1 bounded dispatch -- CRITICAL (longest of the 4 parallel streams; sets the floor for when Phase 3 can start)
3. **Phase 3 (Verify)** -- 1 bounded dispatch -- CRITICAL

**Total Critical Path**: Setup -> WS-A (as the longest parallel stream) -> Verify.

**Parallel Opportunities**:
- WS-A, WS-B, WS-C, and WS-D all run simultaneously once Phase 1 completes (file-disjoint by construction, see section 3's Collision Check).
- Phase 3 cannot start until the slowest of the four streams (expected to be WS-A) finishes.
<!-- /ANCHOR:critical-path -->

---

## AI Execution Protocol

Level 3 packets should carry an explicit AI execution protocol so a dispatched fix agent needs no additional context beyond this plan.

### Pre-Task Checklist

Before a fix agent starts any task in `tasks.md`, it confirms:
- [ ] The task's finding ID(s) and file(s) match what is currently on disk (line numbers may have shifted; re-locate by content match per `spec.md` Edge Cases).
- [ ] The verify-first protocol's live probe is reachable for reality-drift tasks (section 2 above).
- [ ] The task's file is not also claimed by another work-stream (cross-check the Collision Check in section 3).

### Execution Rules

| Rule ID | Rule |
|---------|------|
| TASK-SEQ-001 | Work through a work-stream's tasks in the order listed in `tasks.md`; bundled tasks (e.g. `R3-P0-004` folded into T041) are edited together, not split across two passes. |
| TASK-SCOPE-001 | A fix agent edits only the file(s) named in its assigned task; it never edits a routing block, `INTENT_SIGNALS`, or `RESOURCE_MAP` even if encountered nearby. |
| TASK-SCOPE-002 | A fix agent never edits a file assigned to a different work-stream, even if it appears related. |

### Status Reporting Format

Each completed task is marked `[x]` in `tasks.md` with a one-line evidence citation (live-probe result, file:line, or command output) appended to the task line, satisfying `EVIDENCE_CITED`. A task that cannot be completed because its verify-first probe is unreachable is marked `[B]` with the blocking reason stated inline, per the Blocked Task Protocol below.

### Blocked Task Protocol

A `[B]` blocked task is never silently dropped. It stays visible in `tasks.md` with its blocking reason, and Phase 3's re-run-deep-review gate reports every still-`[B]` task as part of the carry-over list requiring operator approval (`plan.md` section 4, Phase 3).
