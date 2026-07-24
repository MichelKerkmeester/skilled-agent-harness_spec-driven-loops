---
title: "Feature Specification: cli-devin revival"
description: "Coordinate a seven-phase revival of the cli-devin CLI-dispatch mode inside cli-external-orchestration, restoring executor support, skill packet, hook adapters, model registry, and playbook against the current (2026-07) Devin CLI product rather than pre-deprecation assumptions. Phase 001 is complete with live-verification evidence; phases 002-007 are planned."
trigger_phrases: ["cli-devin revival", "Devin CLI executor", "Devin hooks", "Devin agents", "cognition devin"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored parent spec.md and all 7 phase children"
    next_safe_action: "Confirm open questions, then start phase 002"
    blockers: ["devin auth login needs an interactive OAuth flow"]
    key_files: ["001-devin-contract-pin/implementation-summary.md", "002-deep-loop-executor-support/spec.md", "003-cli-devin-skill-packet/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 14
    open_questions: ["No technical reason recorded for the 2026-06-08 deprecation - confirm reversal is still desired.", "Devin IDE-runtime hooks (deleted D5 surface) in scope? Scoped OUT by default.", "Devin-as-MCP-host surface in scope? Scoped OUT by default."]
    answered_questions: ["Phase 001 confirms Devin CLI is real and current (v3000.2.17), not a hypothetical revival target."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->
# Feature Specification: cli-devin revival

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 phased packet |
| **Priority** | P1 |
| **Status** | Active — phase 001 complete (live-verified); phases 002-007 planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `z_archive/022-cli-devin-deprecation` (reverses this decision; the removal itself is left in place as an immutable historical record) |
| **Successor** | None |
| **Handoff Criteria** | Every phase validates independently; `cli-devin` becomes a 5th deep-loop executor kind and a 4th `cli-external-orchestration` mode without breaking the 3 existing modes; unavailable `devin` binary never becomes routable (fail-closed, matching the `cli-codex` precedent). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-devin` shipped 2026-05-15 (`z_archive/016-cli-devin-creation`), received two effectiveness/prompt-quality follow-ons (`017`, `018`), then was fully removed 2026-06-08 (`z_archive/022-cli-devin-deprecation`, 6 phases, ~45 active-wiring files across executor routing, skill-graph, agent rosters, and governance docs). No technical, cost, or reliability rationale for the removal is recorded in any of those three packets — it reads as a pure operator-directed retirement (see Open Question 1). Cognition's Devin CLI has continued shipping since then and is, as of this research pass (2026-07-23), a real, actively-developed local coding agent (`devin v3000.2.17`, installed and verified on this machine) with a documented hook contract, a 4-tier permission model, a subagent system, MCP support, and a cloud-handoff capability — none of which existed in this form when the original packet was authored.

Critically, `cli-devin` **never previously existed as a mode inside `cli-external-orchestration`** — it was a standalone top-level skill (`.opencode/skills/cli-devin/`), and the hub itself (with `cli-opencode`/`cli-claude-code`/`cli-codex` as modes) was created *after* the deprecation. Reviving `cli-devin` therefore means adding a 4th mode to an existing, already-conformant hub — a materially different, better-precedented shape than the original standalone skill, and the same shape `cli-codex` used in `027-cli-codex-revival/003-cli-codex-skill-packet`.

### Purpose
Restore `cli-devin` through bounded phases grounded in the *current* Devin CLI product and the *current* repo layout (both have moved substantially since 2026-06-08 — see the path-drift table in Related Documents), not a mechanical replay of the archived removal diff. Begin with a verified live contract (complete), extend to deep-loop executor support, build the mode's skill packet per this repo's `sk-doc create-skill` guidelines, add hook adapters for the 7 repo guard hooks, restore the model registry (`swe-1.6` + the 3 sibling models' executor rows, using their *current* slugs), author a Devin-native manual-testing playbook, and close out docs/agents/governance/CI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the live Devin CLI contract (binary, hooks, config, permissions, models, subagents, auth) — **done, see 001**.
- Restore `cli-devin` as a 5th `EXECUTOR_KINDS` entry across the deep-loop runtime (typed union, audit maps, fan-out dispatch command builder, model-benchmark dispatcher, tests).
- Build the `cli-devin` skill packet under `cli-external-orchestration/cli-devin/` per `sk-doc create-skill`'s existing-hub checklist, and wire `mode-registry.json` / `hub-router.json` / `leaf-manifest.json` / the hub's own `SKILL.md`, `description.json`, `graph-metadata.json`.
- Add thin Devin hook adapters (project-level `.devin/hooks.v1.json` + adapter scripts) for this repo's 7 guard hooks, mirroring the `cli-codex` hook-adapter-layer precedent, with an explicit decision on native `read_config_from.claude` import vs. custom adapters.
- Restore the model registry: re-add the `swe-1.6` model (cli-devin-exclusive) and re-add `cli-devin` executor rows to `deepseek-v4-pro`, `kimi-k2.7-code` (current slug; archived docs say `kimi-k2.6`), and `glm-5.2` (current slug; archived docs say `glm-5.1`). Restore the `check-prompt-quality-card-sync.sh` CI gate arrays.
- Author a Devin-native manual-testing playbook (cloud handoff, subagents, hooks, 4-tier permission modes, session continuity — not a blind port of Codex's local-sandbox/`-p`-profile categories).
- Restore agent-roster mentions (3 runtimes, current filenames), governance docs (`AGENTS.md`/`CLAUDE.md`/`README.md`), and cross-skill sibling mentions, then run full validation.

### Out of Scope
- The separate Devin IDE-runtime hooks surface (`.devin/hooks.v1.json` as a *system*-level hook target, `hooks/devin/` source dirs in `system-skill-advisor`/`system-spec-kit`, the `'devin'` entry in `ADVISOR_RUNTIME_VALUES`) — this was a distinct surface the original deprecation (decision D5) tore out separately from the `cli-devin` skill itself. See Open Question 2.
- The "Devin-as-MCP-host" surface (`.devin/config.json` in `INSTALL_GUIDE`s) — explicitly left untouched by the original deprecation. See Open Question 3.
- Re-adding a prescriptive default review executor to `system-spec-kit/constitutional/post-implementation-deep-review.md` (made executor-agnostic by 022's decision D4) — not reverted unless the operator asks for it.
- Rewriting `z_archive/016`, `017`, `018`, `022` or any other historical spec content — those stay as an immutable audit trail (decision D1, preserved).
- Actually executing `devin auth login` on the operator's behalf — it is an interactive OAuth browser flow only the operator can complete.

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `runtime/scripts/fanout-run.cjs`, `deep-improvement/scripts/model-benchmark/{dispatch-model.cjs,lib/profile-validator.cjs}` + their tests | Modify | 002 | Restore `cli-devin` as a typed executor kind, incl. a new `buildDevinLineageCommand` dispatch builder. |
| `.opencode/skills/cli-external-orchestration/cli-devin/**` | Created | 003 | New skill packet (SKILL.md, README.md, references/, assets/, changelog/), built per `sk-doc create-skill`'s existing-hub checklist. |
| `cli-external-orchestration/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,description.json,graph-metadata.json}` | Modify | 003 | Register the 4th mode; no new skill-graph node (hub stays the single advisor identity). |
| `.devin/hooks.v1.json` + adapter scripts | Created | 004 | Thin adapters for the 7 repo guard hooks over the existing runtime-neutral cores. |
| `sk-prompt/prompt-models/assets/model-profiles.json`, `references/models/swe-1.6.md`, `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify/Created | 005 | Restore `swe-1.6` + 3 sibling executor rows (current model slugs) and the CI gate arrays. |
| `cli-external-orchestration/cli-devin/manual-testing-playbook/**` | Created | 006 | Devin-native scenario playbook. |
| `.opencode/agents/context.md`(+`.claude`/`.codex` mirrors), `deep-research.md`, `deep-review.md`, `deep-improvement.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`, cross-skill sibling docs | Modify | 007 | Restore roster/governance/sibling mentions against current filenames; full recursive validation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP
| Phase | Folder | Focus | Status |
|---|---|---|---|
| 1 | `001-devin-contract-pin/` | Verify the live Devin CLI, hook, config, permission, model, and auth contract. | Complete |
| 2 | `002-deep-loop-executor-support/` | Restore `cli-devin` as a 5th typed deep-loop executor kind, incl. dispatch builder. | Planned |
| 3 | `003-cli-devin-skill-packet/` | Build the skill packet under the hub per `sk-doc create-skill`; wire hub registries. | Planned |
| 4 | `004-devin-hook-adapter-layer/` | Add thin Devin hook adapters for the 7 repo guard hooks; decide adapter vs. native import. | Planned |
| 5 | `005-devin-model-registry-and-quota/` | Restore `swe-1.6` + sibling executor rows (current slugs) and the CI gate arrays. | Planned |
| 6 | `006-devin-manual-testing-playbook/` | Author a Devin-native manual-testing playbook. | Planned |
| 7 | `007-docs-agents-governance-and-closeout/` | Restore agent/governance/sibling doc mentions; full recursive validation and closeout. | Planned |

### Phase Transition Rules
- Each phase MUST pass `validate.sh <phase-folder> --strict` independently before the next phase begins.
- Phase 003 must not start authoring `cli-devin/graph-metadata.json` or `cli-devin/description.json` — the hub stays the single advisor identity (`parent-skill-check.cjs` rules 2a/2b fail hard on a nested one).
- Every routing surface must check `command -v devin` before advertising or dispatching Devin, mirroring the `cli-codex` fail-closed precedent.
- Phase 005 must use **current** model slugs (`kimi-k2.7-code`, `glm-5.2`) — the archived deprecation docs reference their now-superseded predecessors (`kimi-k2.6`, `glm-5.1`).
- Phase 007 must build its touch-list by grepping the **current** tree, not by replaying archived line numbers verbatim — several unrelated later changes (a hyphen-case filesystem-naming pass, a hub folder move, an agent filename change) landed between 2026-06-08 and today.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|---|---|---|---|
| 001 | 002 | Live Devin CLI contract (version, hooks, config, permissions, models, auth) confirmed. | Met — `devin --version` (3000.2.17), `docs.devin.ai/cli/**` fetched and cross-checked (001 implementation-summary.md). |
| 002 | 003 | `cli-devin` compiles as a 5th `ExecutorKind` and dispatches through `fanout-run.cjs` with a real `buildDevinLineageCommand`, rejecting cleanly when `devin` is absent from PATH. | Pending. |
| 003 | 004 | `cli-devin/` exists under the hub, registered in `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`, and `parent-skill-check.cjs` + `validate_skill_package.py` both stay at 0 fails against the hub. | Pending. |
| 004 | 005 | Devin hook adapters installed and smoke-tested against the live `devin` binary for at least the `SessionStart`/`UserPromptSubmit` events. | Pending. |
| 005 | 006 | `swe-1.6` and the 3 sibling executor rows present in `model-profiles.json`; `check-prompt-quality-card-sync.sh` passes. | Pending. |
| 006 | 007 | Manual-testing playbook authored with Devin-native scenario categories, cross-referenced from `cli-devin/SKILL.md`. | Pending. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- No documented technical/reliability reason was found for the 2026-06-08 deprecation (commit `17ee3bb83ab`) — it reads as a pure operator-directed retirement, not a failure response. Confirm the reversal is still desired knowing this (answered informally by this task's request, but worth an explicit record).
- Are the separate Devin IDE-runtime hooks (the deleted D5 surface) in scope for this revival, or strictly the `cli-devin` CLI-dispatch mode? Scoped **out** by default (see §3).
- Is the "Devin-as-MCP-host" surface (`.devin/config.json` in `INSTALL_GUIDE`s) in scope? Scoped **out** by default (see §3), matching the original deprecation's own boundary.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Resolution Status (deep-research 2026-07-24, generation 1, 5 iterations, `--stop-policy=max-iterations`):** Open Question 3 is **RESOLVED PROVISIONALLY** — the Devin CLI's current MCP-host surface (`devin mcp add/list/get/remove/login/logout/enable/disable`, stdio `command`/`args`/`env` schema) is real, protocol-aligned with the three repository servers, and worth bringing into scope as an additive phase (`008-devin-mcp-host-integration`). Four operational gaps require a clean Linux Devin session before phase 008 opens: (P1) no MCP `cwd` field, (P1) cold bootstrap / native modules, (P1) memory embedding/network, (P1) advisor/memory-write trust boundary. Recommended policy is two-tier: shared project config with exact read-only MCP allows + explicit memory/graph mutation denies, plus maintainer-local override in `.devin/config.local.json`. **Do NOT copy `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` into shared Devin config.** Canonical synthesis: `research/research.md` §1–§15. Acceptance matrix (forwarded to phase 008): clean Devin Linux `tools/list` for the three servers, exact namespace spelling captured, deny-rule survival against session-level wildcard grants, root-relative launcher invocation across fresh/resumed/sandboxed/handoff sessions.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `001-devin-contract-pin/spec.md`, `.../implementation-summary.md`
- `002-deep-loop-executor-support/spec.md` through `007-docs-agents-governance-and-closeout/spec.md`
- `../z_archive/022-cli-devin-deprecation/spec.md` (the decision this reverses) + `context/context-report.md` (the authoritative original removal touch-list)
- `../z_archive/016-cli-devin-creation/`, `../z_archive/017-cli-devin-effectiveness-improvements/`, `../z_archive/018-cli-devin-prompt-quality/` (original build + validated prompt-craft findings to fold in, not re-derive)
- `../027-cli-codex-revival/spec.md` (structural precedent for this packet)
- `../z_archive/013-cli-copilot-hallucination-caveat/spec.md` (structural analog for documenting Devin's own known hallucination fixtures)
