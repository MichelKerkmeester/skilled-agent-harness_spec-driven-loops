---
title: "Feature Specification: cli-pi creation"
description: "Coordinate the phased integration of Pi CLI (pi.dev, earendil-works' open-source multi-provider coding agent) into cli-external-orchestration and full skill/agent/command/plugin parity with this repo's .opencode/.claude surface, including executor support, skill packet, native skill/prompt-template/extension bridges, third-party MCP and sub-agent package integration, model registry, playbook, and governance closeout."
trigger_phrases: ["cli-pi creation", "Pi CLI integration", "Pi CLI executor", "pi.dev", "earendil-works pi-coding-agent"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation"
    last_updated_at: "2026-07-27T07:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded phase-parent and 11 child phases (all Planned) via create.sh"
    next_safe_action: "Get operator approval, then execute phase 001 to install Pi CLI"
    blockers: ["Pi CLI not yet installed — deferred pending operator go-ahead"]
    key_files: ["001-pi-contract-pin/spec.md", "004-pi-skill-discovery-bridge/spec.md", "007-pi-mcp-host-integration/spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does Pi's SKILL.md discovery respect the single-advisor-identity hub design? (phase 004)"
      - "Does pi-mcp-extension support local stdio transport, or only remote HTTP? (phase 007)"
      - "What is Pi's headless dispatch syntax and failure exit-code behavior? (phase 001)"
      - "Which lifecycle events does Pi's extension API expose? (phase 008)"
    answered_questions:
      - "Pi (pi.dev) confirmed real: open-source multi-provider agent by earendil-works, unaffiliated with Anthropic"
      - "Pi documents a .pi/ repo-root config dir analogous to .claude/.cursor, settings.json merge"
      - "Skills/prompt-templates/extensions are native; sub-agents and MCP are third-party packages"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->
# Feature Specification: cli-pi creation

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 phased packet |
| **Priority** | P1 |
| **Status** | Planned — all 11 phases scaffolded, none executed; Pi CLI not yet installed |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Predecessor** | None (new integration; structurally follows `029-cli-devin-revival` and `030-cli-cursor-creation` as the pattern to mirror, not as a dependency) |
| **Successor** | None |
| **Handoff Criteria** | Every phase validates independently; `cli-pi` becomes a 6th deep-loop executor kind and a 6th `cli-external-orchestration` mode without breaking the 5 existing modes; an unavailable `pi` binary never becomes routable (fail-closed, matching the `cli-codex`/`cli-devin` precedent); every claim resting on pi.dev's documentation rather than live-confirmed behavior is explicitly flagged and resolved by phase 001 before downstream phases treat it as fact. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repository already dispatches work to five external coding CLIs as `cli-external-orchestration` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`), each requiring its own contract-pin, deep-loop executor wiring, skill packet, hook/extension bridge, model registry entry, and manual-testing playbook — a pattern proven twice in `029-cli-devin-revival` and `030-cli-cursor-creation`. Pi (pi.dev) is a sixth real, actively-maintained coding-agent CLI (open-source, `@earendil-works/pi-coding-agent`) the operator wants installed locally and brought into the same parity: every skill, agent, command, and plugin this repo already exposes to Claude Code and OpenCode should also be usable from Pi, tested, not merely copied.

Pi's architecture differs from the four precedents in a way that changes the shape of the work, not just its content: Pi natively speaks the same `SKILL.md` convention this repo already uses for skills (its own docs example even points at `~/.claude/skills`), and it has a first-party TypeScript extension system rather than an external hooks-registration file. Its custom-command layer ("prompt templates") is native but flat and non-recursive, unlike this repo's nested `create/`, `deep/`, `doctor/` command groups. Its sub-agent support (`pi-subagents`) and its MCP-server support (`pi-mcp-extension`) are both explicitly third-party community packages, not built into Pi core — meaning the two integration surfaces this repo depends on most heavily (the `mk-spec-memory` MCP daemon every file-modifying task routes through, and the 14 Task-tool sub-agents deep-loop dispatches) rest on the least-verified part of Pi's ecosystem.

### Purpose
Mirror the `029`/`030` phased-decomposition pattern — contract-pin first, then deep-loop executor wiring, skill packet, discovery/command/agent/MCP/extension bridges, model registry, manual-testing playbook, and a docs/governance closeout — while adapting each phase's *shape* to what Pi's real architecture requires (a discovery-bridge instead of a hook-adapter-layer for skills; a flattening bridge for the non-recursive command layer; explicit third-party-package risk framing for agents and MCP). Every phase below is currently **Planned**: this packet was scaffolded and content-authored before Pi was installed, per an explicit operator decision to sequence "scaffold the spec first, install later" — so phase 001 carries the sole responsibility of converting the pi.dev documentation findings cited throughout this packet from *documented* to *confirmed*.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Install the real Pi CLI and live-verify its whole contract (binary, `.pi/` directory, settings merge, skills/prompts/extensions discovery, auth/providers, headless/programmatic dispatch and its exit-code semantics) against the pi.dev documentation — **phase 001**.
- Add `cli-pi` as a 6th typed `ExecutorKind` across the deep-loop runtime (`executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, model-benchmark dispatchers) with a fail-closed dispatch builder — **phase 002**.
- Build the `cli-pi` skill packet under `cli-external-orchestration/cli-pi/` per `sk-doc create-skill`'s existing-hub checklist, and register it as the hub's 6th mode across `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/the hub's own `SKILL.md`/`description.json`/`graph-metadata.json` — **phase 003**.
- Bridge this repo's 12 skill hubs into Pi's native `.pi/settings.json` skills-discovery mechanism, live-verifying whether Pi's recursive discovery respects the single-advisor-identity parent-hub design — **phase 004**.
- Bridge the 49 nested `.opencode/commands/*.md` files into Pi's flat, non-recursive `.pi/prompts/*.md` prompt-template format — **phase 005**.
- Bridge the 14 `.claude/agents/*.md` sub-agents into the third-party `pi-subagents` package's markdown+YAML schema — **phase 006**.
- Bridge the 5 native MCP servers and 10 external MCP manuals into the third-party `pi-mcp-extension` package under a deny-by-default policy, resolving whether its documented remote-only config example means local stdio servers are unsupported — **phase 007**.
- Bridge this repo's runtime-neutral hook guard cores into Pi's native TypeScript extension system (`.pi/extensions/*.ts`) — **phase 008**.
- Add Pi-compatible model profiles to `sk-prompt/prompt-models` with a fail-closed dispatch allowlist from the start — **phase 009**.
- Author a Pi-native manual-testing playbook — **phase 010**.
- Restore/extend agent-roster, governance, and cross-skill sibling mentions wherever the other 5 CLIs already appear, then run a full recursive `validate.sh --strict` closeout — **phase 011**.

### Out of Scope
- Actually running any interactive Pi auth/provider-login flow on the operator's behalf — this is an interactive browser/API-key flow only the operator can complete, mirroring the `cli-devin`/`cli-cursor` precedent boundary.
- Building a fork or patch of the third-party `pi-subagents`/`pi-mcp-extension` packages themselves — this packet consumes them as-is; if a live-verified gap makes either package unusable for this repo's needs, that becomes a documented open question/blocker, not an upstream contribution project.
- Rebranding Pi's `.pi/` config directory via `CONFIG_DIR_NAME` (the docs mention this exists for "rebranded distributions") — out of scope unless a live conflict with another tool's `.pi/` usage is found.
- Wiring Pi into this repo's CI pipeline (GitHub Actions or equivalent) — scoped to local-machine parity only, matching how `029`/`030` scoped their own CI touch to gate-array coverage rather than pipeline wiring.

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `~/.pi/agent/**`, `.pi/**` (settings.json, skills/, prompts/, extensions/, agents/, mcp.json) | Created | 001, 004-008 | Pi's global and project config surfaces; created incrementally as each bridge phase lands. |
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `runtime/scripts/fanout-run.cjs`, `deep-improvement/scripts/model-benchmark/{dispatch-model.cjs,lib/profile-validator.cjs}` + their tests | Modify | 002 | Add `cli-pi` as a typed executor kind, incl. a new `buildPiLineageCommand` dispatch builder. |
| `.opencode/skills/cli-external-orchestration/cli-pi/**` | Created | 003 | New skill packet (SKILL.md, references/, assets/, changelog/), built per `sk-doc create-skill`'s existing-hub checklist. |
| `cli-external-orchestration/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,description.json,graph-metadata.json}` | Modify | 003 | Register the 6th mode; no new skill-graph node (hub stays the single advisor identity). |
| `sk-prompt/prompt-models/assets/model-profiles.json`, `references/models/*.md`, `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify/Created | 009 | Add Pi model profiles and CI gate array coverage. |
| `cli-external-orchestration/cli-pi/manual-testing-playbook/**` | Created | 010 | Pi-native scenario playbook. |
| `.opencode/agents/context.md` (+ `.claude`/`.codex` mirrors), `deep-research.md`, `deep-review.md`, `deep-improvement.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`, cross-skill sibling docs | Modify | 011 | Extend roster/governance/sibling mentions to include Pi; full recursive validation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP
| Phase | Folder | Focus | Status |
|---|---|---|---|
| 1 | `001-pi-contract-pin/` | Install the real Pi CLI and live-verify its whole contract (binary, `.pi/` dir, settings merge, skills/prompts/extensions/MCP/agent discovery, auth, headless dispatch and exit-code semantics) against the pi.dev documentation findings. | Planned |
| 2 | `002-deep-loop-executor-support/` | Add `cli-pi` as a 6th typed deep-loop executor kind, incl. a `buildPiLineageCommand` dispatch builder, fail-closed on the real headless syntax confirmed by phase 1. | Planned |
| 3 | `003-cli-pi-skill-packet/` | Build the skill packet under the hub per `sk-doc create-skill`; wire hub registries as the 6th mode. | Planned |
| 4 | `004-pi-skill-discovery-bridge/` | Point Pi's native skills discovery at `.opencode/skills/`; live-verify it respects the single-advisor-identity parent-hub design rather than flattening every nested mode into its own skill. | Planned |
| 5 | `005-pi-command-layer/` | Bridge the 49 nested `.opencode/commands/*.md` files into Pi's flat, non-recursive `.pi/prompts/*.md` format with a `$1`/`$2`/`$@` argument-substitution translation. | Planned |
| 6 | `006-pi-agent-bridge/` | Bridge the 14 `.claude/agents/*.md` sub-agents into the third-party `pi-subagents` package's markdown+YAML schema. | Planned |
| 7 | `007-pi-mcp-host-integration/` | Bridge the 5 native + 10 external MCP servers into the third-party `pi-mcp-extension` package under a deny-by-default policy; resolve the stdio-transport-support open question. | Planned |
| 8 | `008-pi-hook-extension-layer/` | Bridge this repo's runtime-neutral guard cores into Pi's native TypeScript extension system, live-probing the real lifecycle-event surface first. | Planned |
| 9 | `009-pi-model-registry-and-routing/` | Add Pi-compatible model profiles to `sk-prompt/prompt-models` with a fail-closed dispatch allowlist designed in from the start (learning from `030`'s later hardening pass). | Planned |
| 10 | `010-pi-manual-testing-playbook/` | Author a Pi-native manual-testing playbook covering install/skills/commands/agents/MCP/extensions/models. | Planned |
| 11 | `011-docs-agents-governance-and-closeout/` | Extend roster/governance/sibling mentions to include Pi wherever the other 5 CLIs already appear; full recursive `validate.sh --strict` closeout across the whole packet. | Planned |

### Phase Transition Rules
- Each phase MUST pass `validate.sh <phase-folder> --strict` independently before the next phase begins.
- Phase 003 must not author `cli-pi/graph-metadata.json` or `cli-pi/description.json` — the hub stays the single advisor identity (`parent-skill-check.cjs` rules 2a/2b fail hard on a nested one), matching the `cli-devin`/`cli-cursor` precedent.
- Every routing surface must check for a working `pi` binary before advertising or dispatching Pi, mirroring the `cli-codex`/`cli-devin` fail-closed precedent — an unavailable binary must never become routable.
- Phases 002, 004-009 all have a load-bearing dependency on phase 001's live findings (not the pi.dev documentation alone) — none of the headless-dispatch syntax, discovery behavior, or third-party-package install verbs in phases 002-009's plans may be treated as confirmed until phase 001 actually runs `pi` and records what happened.
- Phases 006 and 007 both depend on a third-party community package (`pi-subagents`, `pi-mcp-extension` respectively) whose maintenance status and exact install syntax are unconfirmed from docs alone — each phase's plan must include a documented fallback (skip/defer with a recorded reason) if the package proves broken, unmaintained, or incompatible at execution time, rather than blocking the whole packet.
- Phase 010's real dependencies are phases 001 (install/contract), 004-008 (the bridges being tested) and 009 (model dispatch content), not its numeric predecessor alone.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|---|---|---|---|
| 001 | 002 | `pi --version` succeeds locally and the live-probed non-interactive/headless dispatch syntax is documented with real exit-code behavior on both success and failure. | Pending. |
| 002 | 003 | `EXECUTOR_KINDS` includes `cli-pi`, `buildPiLineageCommand` is unit-tested, typecheck and the existing test suites stay green. | Pending. |
| 003 | 004 | `cli-pi` is registered as the hub's 6th mode and `parent-skill-check.cjs` + `validate_skill_package.py` both pass. | Pending. |
| 004 | 005 | A live `pi` session's skill discovery is confirmed to expose the intended skill set (documented divergence accepted or mitigated, not silently assumed). | Pending. |
| 005 | 006 | At least one sample command from each of the 8 `.opencode/commands` groups dispatches correctly as a flattened `/name` prompt template with working argument substitution. | Pending. |
| 006 | 007 | `pi-subagents` is installed and every translated agent file parses/loads without schema errors. | Pending. |
| 007 | 008 | `pi-mcp-extension` is installed and `/mcp` in-session shows at least the 5 native MCP servers connected under a deny-by-default policy (or the stdio-transport gap is explicitly documented as unresolved). | Pending. |
| 008 | 009 | A discriminating test suite passes for each bridged extension, with fail-open/fail-closed behavior matching the intended policy per guard. | Pending. |
| 009 | 010 | `check-prompt-quality-card-sync.sh` passes and a live smoke dispatch against a Pi model succeeds; the dispatch allowlist is fail-closed (no `auto` default). | Pending. |
| 010 | 011 | The playbook's scenario coverage is judged proportional to the sibling CLIs' playbooks (both in count and category breadth). | Pending. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- Does Pi's recursive `SKILL.md` discovery respect this repo's single-advisor-identity parent-hub design, or does it also surface every nested mode `SKILL.md` as an independently-discovered skill, diverging from `mode-registry.json`-driven routing? Owned by phase 004; currently UNKNOWN.
- Does `pi-mcp-extension` support a local stdio transport at all, or only remote streamable-http servers as its sole documented config example shows? Owned by phase 007; currently UNKNOWN — this determines whether the 5 native MCP servers (all local Node processes) can be wired into Pi at all without a proxy layer.
- What is Pi's real non-interactive/headless dispatch syntax (Programmatic Usage: SDK, RPC mode, JSON event stream mode) and its exit-code behavior on auth or dispatch failure? Owned by phase 001; blocks phase 002's dispatch builder design.
- Which lifecycle events does Pi's native TypeScript extension API actually expose, and do they cover the guard-core taxonomy (`SessionStart`/`PreToolUse`/`PostToolUse`/etc.) this repo's hooks assume? Owned by phase 008; currently UNKNOWN.
- Are `pi-subagents` and `pi-mcp-extension` (both third-party, single-maintainer-looking community packages per the pi.dev packages catalog) actively maintained and compatible with the current Pi core version? Not verifiable from docs alone — must be checked live in phases 006/007, with a documented fallback if either proves unusable.
- Should this packet eventually be extended with a `009-pi-mcp-host-integration`-style deny-by-default policy identical to `029`'s Devin MCP-host phase, or does Pi's own security/permission model (documented under "Providers, Security, Containerization" in the docs nav) already provide an equivalent gate that makes a bespoke policy redundant? Owned by phase 007.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `001-pi-contract-pin/spec.md` through `011-docs-agents-governance-and-closeout/spec.md` (full phase detail)
- `../029-cli-devin-revival/spec.md` (structural precedent — hook-adapter-layer/MCP-host-integration/model-registry phase shapes)
- `../030-cli-cursor-creation/spec.md` (structural precedent — contract-pin/executor-support/skill-packet/model-allowlist-hardening phase shapes; closest analog for a CLI installed fresh during this packet's own lifetime)
- `../026-cli-external-parent/spec.md` (origin of the `cli-external-orchestration` hub `cli-pi` is joining as a 6th mode)
- pi.dev, pi.dev/docs/latest, pi.dev/docs/latest/skills, pi.dev/docs/latest/extensions, pi.dev/docs/latest/settings, pi.dev/docs/latest/prompt-templates, pi.dev/packages/pi-mcp-extension, pi.dev/packages/pi-subagents (external documentation sources cited throughout this packet's phases — all fetched live, not assumed)
