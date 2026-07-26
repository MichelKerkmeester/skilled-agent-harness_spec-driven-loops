---
title: "Feature Specification: cli-cursor creation"
description: "Coordinate an 18-phase first-time creation of a cli-cursor CLI-dispatch mode inside cli-external-orchestration, adding executor support, a skill packet, hook adapters, a Composer model profile, a manual-testing playbook, live hook wiring, Claude parity, discovery mirrors, and a session-start Gate-3 prebind against the current (2026-07) Cursor CLI (cursor-agent). All 18 phases are complete."
trigger_phrases: ["cli-cursor creation", "Cursor CLI executor", "cursor-agent mode", "delegate to cursor", "cursor cli hub mode"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation"
    last_updated_at: "2026-07-26T06:54:58Z"
    last_updated_by: "opencode"
    recent_action: "Completed phase 018 in implementation commit 348b644283."
    next_safe_action: "No further packet work; push only on explicit approval."
    blockers: []
    key_files: ["018-cursor-spec-gate-prebind/spec.md", ".cursor/hooks.json", ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Should a dispatched cursor-agent carry a --workspace/config-isolation flag so it does not inherit the operator's shared ~/.cursor/ hooks/mcp/rules?", "How should all Cursor hooks handle multi-root workspace_roots consistently?"]
    answered_questions: ["Phase 001 confirmed the live Cursor CLI contract.", "Phase 004 confirmed partial CLI hook-event delivery.", "Phase 018 resolves autonomous-child Gate-3 handling as a complete no-op."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->
# Feature Specification: cli-cursor creation

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 phased packet |
| **Priority** | P1 |
| **Status** | Complete — all 18 phases implemented, validated, and committed |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | None (first-time creation; Cursor CLI has never existed in this repo) |
| **Successor** | None |
| **Handoff Criteria** | Every phase validates independently; `cli-cursor` becomes a new deep-loop executor kind and a 4th `cli-external-orchestration` mode without breaking the 3 existing modes; an unavailable `cursor-agent` binary never becomes routable (fail-closed, matching the `cli-codex` precedent). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cursor CLI (`cursor-agent`) is a real, actively-developed terminal coding agent (build `2026.07.23-e383d2b`, installed and live-verified on this machine in phase 001) that has **never existed in this repo** — no standalone skill, no hub mode, no archived packet (a `z_archive` grep for "cursor" returns nothing). This is therefore a first-time creation, following the "-creation" precedent of the archived `001-cli-gemini-creation`/`002-cli-codex-creation`/`003-cli-claude-code-creation`/`004-cli-copilot-creation` packets, not a revival like `027-cli-codex-revival`/`029-cli-devin-revival`.

Adding `cli-cursor` means adding a 4th mode to the existing, already-conformant `cli-external-orchestration` hub (which today has exactly 3 modes: `cli-opencode`/`cli-claude-code`/`cli-codex`). The structural operation mirrors the `cli-codex` and `cli-devin` skill-packet additions, but Cursor's product differs from every sibling in ways this packet documents faithfully rather than by copy-paste: its config surface is **shared with the Cursor editor** (`.cursor/`/`~/.cursor/`: mcp.json, hooks.json, rules, skills, plugins), not a tool-private namespace; its hooks use a `{permission: allow|deny|ask}` + exit-code envelope and are documented not to fire every event under the CLI; and it carries genuinely unique surfaces with no sibling analog — native git worktree isolation (`-w`), a cloud `worker`, a `plugin marketplace`, and a Cursor-native model (Composer).

### Purpose
Create `cli-cursor` through bounded phases grounded in the *current* Cursor CLI product (live-verified in phase 001, not assumed from Cursor-the-editor knowledge). Begin with a verified live contract (complete), extend to deep-loop executor support, build the mode's skill packet per this repo's `sk-doc create-skill` guidelines, add hook adapters for the repo guard hooks over Cursor's shared-config hooks surface, add a Composer model-profile and prompt-quality-card CI coverage, author a Cursor-native manual-testing playbook, and close out docs/agents/governance with full recursive validation.

### Initial seven-phase decomposition and later extensions
The original decomposition matched `029-cli-devin-revival`'s 7-phase shape because Cursor's core capabilities mapped onto seven bounded workstreams (contract-pin → executor → skill-packet → hooks → model-registry → playbook → closeout). Later phases added allowlist enforcement, live hook wiring, parity, manual evidence, discovery mirrors, MCP correction, and Gate-3 prebinding as distinct workstreams. Cursor's unique worktree/worker/plugin surfaces remain documented rather than wired into the deep-loop runtime.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the live Cursor CLI contract (binary name, non-interactive dispatch, auth, hooks, shared config, permissions, models, unique surfaces) — **done, see 001**.
- Add `cli-cursor` as a new `EXECUTOR_KINDS` entry across the deep-loop runtime (typed union, audit maps, fan-out dispatch command builder, model-benchmark dispatcher, tests).
- Build the `cli-cursor` skill packet under `cli-external-orchestration/cli-cursor/` per `sk-doc create-skill`'s existing-hub checklist, and wire `mode-registry.json` / `hub-router.json` / `leaf-manifest.json` / the hub's own `SKILL.md`, `description.json`, `graph-metadata.json`.
- Add thin Cursor hook adapters (project `.cursor/hooks.json` + adapter scripts) over this repo's runtime-neutral guard-hook cores, mirroring the `cli-codex` hook-adapter precedent, with explicit decisions on registration scope (editor-shared config) and event-mapping (CLI partial delivery).
- Add a Composer (Cursor-native model) prompt-craft profile and `cli-cursor` executor rows to `sk-prompt/prompt-models`, and wire the `check-prompt-quality-card-sync.sh` CI gate for `cli-cursor`.
- Author a Cursor-native manual-testing playbook (plan/ask modes, worktree isolation, cloud worker, MCP, shared hooks, session continuity — not a blind port of a sibling's categories).
- Add `cli-cursor` roster/governance/cross-skill mentions (touch-list from the current tree), then run full recursive validation.

### Out of Scope
- Wiring Cursor's native `-w`/`--worktree`, cloud `worker`, or `plugin marketplace` into this repo's deep-loop runtime — documented as Cursor-side capabilities in the skill packet and playbook, not new repo wiring.
- Enumerating Cursor's exact live model roster (auth-gated behind `cursor-agent login`, an operator-only OAuth flow) — Composer's exact specs stay TBD until authenticated.
- Executing `cursor-agent login` on the operator's behalf — an interactive OAuth browser flow only the operator can complete.
- Adding profiles for the hosted frontier models Cursor drives (gpt/sonnet/opus/gemini/grok) — they carry provider-native behavior; only Composer (Cursor-exclusive) gets a new profile.

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `runtime/scripts/fanout-run.cjs`, `deep-improvement/scripts/model-benchmark/{dispatch-model.cjs,lib/profile-validator.cjs}` + their tests | Modify | 002 | Add `cli-cursor` as a typed executor kind, incl. a new `buildCursorLineageCommand` dispatch builder. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/**` | Created | 003 | New skill packet (SKILL.md, README.md, references/, assets/, changelog/), built per `sk-doc create-skill`'s existing-hub checklist. |
| `cli-external-orchestration/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,description.json,graph-metadata.json}` | Modify | 003 | Register the 4th mode; no new skill-graph node (hub stays the single advisor identity). |
| `.cursor/hooks.json` + `mcp-server/hooks/cursor/**` + `runtime/hooks/cursor/**` | Created | 004 | Thin adapters for the repo guard hooks over the existing runtime-neutral cores; project-scoped hook registration. |
| `sk-prompt/prompt-models/{assets/model-profiles.json,references/models/composer-2.5.md,references/models/_index.md}`, `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify/Created | 005 | Add a Composer profile + `cli-cursor` executor rows and CI gate coverage. |
| `cli-external-orchestration/cli-cursor/manual-testing-playbook/**` | Created | 006 | Cursor-native scenario playbook. |
| `.opencode/agents/context.md`(+`.claude`/`.codex` mirrors), `deep-research.md`, `deep-review.md`, `deep-improvement.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`, cross-skill sibling docs | Modify | 007 | Add roster/governance/sibling mentions against the current tree; full recursive validation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP
| Phase | Folder | Focus | Status |
|---|---|---|---|
| 1 | `001-cursor-contract-pin/` | Verify the live Cursor CLI, hook, config, permission, model, and auth contract. | Complete |
| 2 | `002-deep-loop-executor-support/` | Add `cli-cursor` as a new typed deep-loop executor kind, incl. dispatch builder. | Complete |
| 3 | `003-cli-cursor-skill-packet/` | Build the skill packet under the hub per `sk-doc create-skill`; wire hub registries. | Complete |
| 4 | `004-cursor-hook-adapter-layer/` | Add thin Cursor hook adapters over the repo guard cores; decide registration scope + event mapping. | Complete (`.cursor/hooks.json` registration deferred by operator choice) |
| 5 | `005-cursor-model-registry-and-routing/` | Add a Composer profile + `cli-cursor` executor rows and the CI gate coverage. | Complete |
| 6 | `006-cursor-manual-testing-playbook/` | Author a Cursor-native manual-testing playbook. | Complete |
| 7 | `007-docs-agents-governance-and-closeout/` | Add roster/governance/sibling doc mentions; full recursive validation and closeout. | Complete |
| 8 | `008-cursor-model-allowlist/` | Restrict cli-cursor dispatch to an enforced 10-id allowlist (Composer 2.5, Grok 4.5, GLM 5.2); remove `auto` as the default. | Complete |
| 9 | `009-cursor-hooks-catalog-and-playbook-coverage/` | Add a feature-catalog entry and playbook coverage for every cli-cursor hook adapter. | Complete |
| 10 | `010-cursor-hooks-live-wiring/` | Create and commit the project `.cursor/hooks.json` registration (ADR-001). | Complete |
| 11 | `011-cursor-hooks-claude-parity/` | Expand toward Claude parity: `postToolUse` chain, `Task`-matcher guard, repo-guard scripts. | Complete |
| 12 | `012-hooks-manual-testing-results/` | Re-execute the hooks-category playbook independently. | Complete |
| 13 | `013-hooks-sk-code-alignment/` | Align all Cursor `.mjs` hooks to `sk-code/code-opencode` P0 standards. | Complete |
| 14 | `014-cursor-hooks-discovery-mirror/` | `.cursor/hooks/` discovery mirror. | Complete |
| 15 | `015-hook-code-style-cross-runtime/` | Cross-runtime hook code-style alignment. | Complete |
| 16 | `016-cursor-mcp-wiring-and-route-guard-fix/` | Wire `.cursor/mcp.json`; find and fix the `mcp-route-guard.mjs` dead wire. | Complete |
| 17 | `017-codex-claude-hooks-discovery-mirrors/` | `.codex/hooks/` and `.claude/hooks/` discovery mirrors. | Complete |
| 18 | `018-cursor-spec-gate-prebind/` | Wire the session-start Gate-3 prebind; make autonomous-child sessions a complete shared-core no-op. | Complete |

### Phase Transition Rules
- Each phase MUST pass `validate.sh <phase-folder> --strict` independently before the next phase begins.
- Phase 003 must not create `cli-cursor/graph-metadata.json` or `cli-cursor/description.json` — the hub stays the single advisor identity (`parent-skill-check.cjs` rules 2a/2b fail hard on a nested one).
- Every routing surface must check `command -v cursor-agent` before advertising or dispatching Cursor, mirroring the `cli-codex` fail-closed precedent; because a `-p` dispatch without auth exits `0`, no guard may key on the exit code for availability.
- Phase 002/003 must use the confirmed canonical binary name `cursor-agent` (with `agent` as an alias), never assume a bare `cursor` binary.
- Phase 004 must live-verify per-event CLI hook delivery (documented partial-delivery caveat) before claiming any guard is active, and must account for the editor-shared `.cursor/hooks.json` blast radius.
- Phase 005 must mark Composer's auth-gated specs (context window/pricing/version slug) as TBD, never fabricated.
- Phase 007 must build its touch-list by grepping the current tree, not by replaying a sibling's historical list.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|---|---|---|---|
| 001 | 002 | Live Cursor CLI contract (binary, flags, auth, hooks, config, permissions, models, unique surfaces) confirmed. | Met — `cursor-agent --version` (`2026.07.23-e383d2b`), `--help`/`mcp`/`plugin`/`worker` captured, `cursor.com/docs` fetched and cross-checked (001 implementation-summary.md). |
| 002 | 003 | `cli-cursor` compiles as a new `ExecutorKind` and dispatches through `fanout-run.cjs` with a real `buildCursorLineageCommand`, rejecting cleanly when `cursor-agent` is absent from PATH. | Met — `executor-config.ts`/`fanout-run.cjs` extended, fail-closed test asserts the binary-absent rejection (002 implementation-summary.md). |
| 003 | 004 | `cli-cursor/` exists under the hub, registered in `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`, and `parent-skill-check.cjs` + `validate_skill_package.py` both stay at 0 fails against the hub. | Met — both validators 0 fails (003 implementation-summary.md). |
| 004 | 005 | Cursor hook adapters installed and live-verified for the confirmed-delivered core events (actually `sessionStart`/`preToolUse`/`sessionEnd`, not the originally-assumed `sessionStart`/`beforeSubmitPrompt`/`stop` trio — live probing inverted the assumption). | Met — live delivery table captured in 004 decision-record.md. |
| 005 | 006 | Composer profile + `cli-cursor` executor rows present; `check-prompt-quality-card-sync.sh` passes with `cli-cursor` covered. | Met — `GUARD PASS` (005 implementation-summary.md). |
| 006 | 007 | Manual-testing playbook authored with Cursor-native scenario categories, cross-referenced from `cli-cursor/SKILL.md`. | Met — 19 `CU-NNN` scenarios across 9 categories (006 implementation-summary.md). |
| 007 | 008 | Roster/governance mentions land wherever the 3 siblings appear; whole packet validates `--recursive --strict` 0/0. | Met — 8/8 folders 0/0 (007 implementation-summary.md). |
| 008 | 009 | cli-cursor dispatch enforced to a 10-id allowlist; `auto` removed as the default. | Met — allowlist enforced at both dispatch entry points (008 implementation-summary.md). |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- Should a dispatched `cursor-agent` carry an explicit `--workspace`/config-isolation flag so it does not silently inherit the operator's shared `~/.cursor/` hooks/mcp/rules? Deferred to the phase-002/003 dispatch-command finalization.
- How should all Cursor hook adapters handle additional `workspace_roots` consistently? The current first-root-only behavior is deferred to a separate cross-hook phase.
- **Answered:** Cursor CLI delivers only a subset of registered events; phase 004 captured the live event table.
- **Answered in part:** Composer slugs are `composer-2.5`/`composer-2.5-fast`; context window and pricing remain unavailable from the authenticated CLI and are non-blocking.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `001-cursor-contract-pin/spec.md`, `.../implementation-summary.md`
- `002-deep-loop-executor-support/spec.md` through `018-cursor-spec-gate-prebind/spec.md`
- `../027-cli-codex-revival/spec.md`, `../029-cli-devin-revival/spec.md` (structural precedents for a hub-mode CLI packet)
- `../z_archive/002-cli-codex-creation/`, `../z_archive/003-cli-claude-code-creation/` (naming precedent for a first-time "-creation" CLI packet)
- `.opencode/skills/sk-doc/create-skill/SKILL.md`, `.../references/parent-skill/parent-skills-nested-packets.md` (hub doctrine)
