---
title: "Feature Specification: cli-pi skill packet"
description: "Build cli-pi as a new 6th mode inside the existing, already-conformant cli-external-orchestration hub (5 modes today: cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin), mirroring the cli-devin (029/003) and cli-cursor (030/003) registration precedents, with zero regressions to the hub's confirmed 0-fail/0-warning baseline."
trigger_phrases:
  - "cli-pi skill packet"
  - "cli-pi mode"
  - "cli-external-orchestration 6th mode"
  - "pi.dev cli packet"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/003-cli-pi-skill-packet"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "pi-cli-authoring"
    recent_action: "cli-pi built as the hub's 6th mode via LUNA, reviewed by GLM-5.2, 4 findings fixed"
    next_safe_action: "Phase 004 may build the skill-discovery bridge on this registered mode"
    blockers: ["Known, out-of-scope gap: compiled-routing readiness check fails (pre-existing bug class, tracked in sk-doc/019-skill-routing-refactor)"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-packet-authoring"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Whether the bare single-token alias \"pi\" creates an elevated cross-hub/cross-skill collision risk given it is a common short word and math constant — this phase's plan excludes any bare \"pi\" alias, using multi-word phrases only"
      - "No first-party Pi env var analogous to DEVIN_PROJECT_DIR or CURSOR_AGENT is documented for an active-session signal — phase 001 must live-probe before the self-invocation guard can rely on more than process ancestry"
      - "Whether pi-subagents' and pi-mcp-extension's install-verb syntax (`pi install npm:<pkg>`) is exactly correct — the upstream research explicitly flags it as inferred, not confirmed"
      - "Whether the hub-root README.md needs a Pi-specific correction beyond the mode-table/layout-tree additions, mirroring the still-open stale-defaultMode-prose question carried unresolved through the devin and cursor phases"
    answered_questions: []
---
# Feature Specification: cli-pi skill packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete - cli-pi registered as the hub's 6th mode; parent-skill-check.cjs 0 warnings; compiled-routing readiness stays a known, out-of-scope gap (pre-existing bug class) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Predecessor** | `../002-deep-loop-executor-support/spec.md` |
| **Predecessor Handoff Criteria** | `EXECUTOR_KINDS` includes `cli-pi`, `buildPiLineageCommand` is unit-tested, typecheck and the existing test suites stay green. |
| **Successor** | `../004-pi-skill-discovery-bridge/spec.md` |
| **Successor Handoff Criteria** | `cli-pi` is registered as the hub's 6th mode and `parent-skill-check.cjs` plus `validate_skill_package.py` both pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-pi` does not exist anywhere in this repo yet. Pi (pi.dev, npm scope `@earendil-works`, MIT-licensed, NOT affiliated with Anthropic) is an open-source, terminal-based, multi-provider AI coding agent whose repo-root config dir (`.pi/`) is documented as directly analogous to `.claude/`/`.cursor/`, and whose native Skills feature is documented to ingest Claude/Codex-style skill folders directly. The `cli-external-orchestration` hub already has 5 conformant workflow modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, confirmed today at a 0-fail/0-warning `parent-skill-check.cjs`/`validate_skill_package.py` baseline — see `plan.md` §2). The closest and only real structural precedents for "add an Nth mode to an already-conformant, zero-extension registry" are `cli-devin`'s own addition (`029-cli-devin-revival/003-cli-devin-skill-packet`) and `cli-cursor`'s (`030-cli-cursor-creation/003-cli-cursor-skill-packet`) — both third-party CLIs that fail closed when their binary is absent and both built with a runtime-signal-based self-invocation guard.

### Purpose
Build `cli-pi` as a new packet under `cli-external-orchestration/cli-pi/`, wire it into `mode-registry.json` and `hub-router.json`, update the hub's own `description.json`/`SKILL.md`/`graph-metadata.json`, and regenerate `leaf-manifest.json` — all while keeping `parent-skill-check.cjs` and `validate_skill_package.py` at the same 0-fail/0-warning baseline confirmed against the hub today, without introducing a second advisor identity anywhere under the new packet, and without stating any pi.dev-documentation-sourced claim as if it were already live-verified (this phase is planning only — see `plan.md` §1 Overview and the Hard Constraints carried from the parent packet).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `cli-external-orchestration/cli-pi/` with `SKILL.md`, `README.md`, `changelog/` (hard-required by check 3d-files), plus `references/`, `assets/`, `manual-testing-playbook/` (family-parity convention — all 5 siblings carry these; the playbook directory is scaffolded here only, its Pi-native scenario content is authored in phase 010, mirroring how `cli-devin`'s playbook content landed in phase 006).
- Author `SKILL.md` from the packet-level `skill-md-template.md`, with a `hard_rules` frontmatter triad (`pi-availability-required` / `self-invocation-prohibited` / `deep-loop-runtime-required`), a Section 2 self-invocation guard function built from documented-but-unconfirmed signals only, and a `command -v pi` prerequisite probe, mirroring `cli-devin`'s and `cli-cursor`'s exact shape.
- Author `README.md` from `skill-readme-template.md` (9-section AT A GLANCE → RELATED DOCUMENTS shape).
- Author 5 `references/*.md` files (kebab-case, ≥100 LOC each, per the family precedent): `cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `native-skills-and-extensions.md` (Pi's genuinely novel property vs. Devin/Cursor — native `SKILL.md`/prompt-template/extension discovery), `mcp-and-third-party-packages.md` (documents the `pi-subagents`/`pi-mcp-extension` community packages and the documented-only streamable-HTTP MCP example, explicitly flagging the stdio-transport gap as UNCONFIRMED).
- Author `assets/prompt-quality-card.md` (thin delegator to the canonical `sk-prompt/prompt-models` card, 3-tier precedence rule stated up front — not a competing framework taxonomy) and `assets/prompt-templates.md`.
- Wire `mode-registry.json` (add the `cli-pi` `modes[]` entry as the registry's 6th entry).
- Wire `hub-router.json` (add `routerSignals.cli-pi`, a `cli-pi-aliases`/`pi-dispatch` vocabulary-class pair, and append `"cli-pi"` to `routerPolicy.tieBreak`).
- Update the hub's own `description.json` (keywords/trigger_examples/prose only), `SKILL.md` (mode table row + layout tree row + "five"→"six" mode-count prose), and `graph-metadata.json` (derived arrays, for doctrine-consistent symmetry with the 5 existing entries).
- Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write`.
- Validate: `parent-skill-check.cjs` and `validate_skill_package.py` both stay at 0 fails against the whole hub (confirmed today, before this phase, at 0 fails / 0 warnings / 5 modes / 25 unique aliases — see `plan.md` §2).

### Out of Scope
- Any deep-loop `ExecutorKind`/`buildPiLineageCommand`/dispatch-command-builder work — that is phase 002 (`deep-loop-executor-support`), already scoped separately and a hard predecessor per the METADATA table.
- `cli-pi/graph-metadata.json` or `cli-pi/description.json` anywhere under the new packet — `parent-skill-check.cjs` checks 2a/2b scan the whole hub tree and fail hard on a nested one ("re-introduces a second identity" / "second advisor identity"). The hub keeps exactly one of each, at its root.
- Any live install, dispatch, or behavioral verification of the real `pi` binary — that is entirely phase 001 (`pi-contract-pin`)'s job. This phase authors documentation and a planned diff only; every pi.dev-doc-sourced claim used in that authored content is marked UNCONFIRMED unless it can be traced to a phase-001 result (which does not exist yet).
- Wiring `.pi/settings.json`'s `"skills"` array (or `--skill` flag) at `.opencode/skills/` and live-verifying whether Pi's recursive `SKILL.md` discovery respects the hub's single-advisor-identity design or flattens every nested mode `SKILL.md` into an independent skill — that is phase 004 (`pi-skill-discovery-bridge`).
- Translating the 49 nested `.opencode/commands/*.md` files into Pi's flat `.pi/prompts/*.md` prompt-template format — that is phase 005 (`pi-command-layer`).
- Installing `pi-subagents` and translating the 14 `.claude/agents/*.md` files into `.pi/agents/**/*.md` — that is phase 006 (`pi-agent-bridge`); this phase's `agent-delegation.md` reference documents the concept and the third-party dependency, not the finished translation.
- Installing `pi-mcp-extension` and translating `.mcp.json`'s 5 native MCP servers + 10 external UTCP manuals into `.pi/mcp.json` — that is phase 007 (`pi-mcp-host-integration`); this phase's `mcp-and-third-party-packages.md` reference documents the concept and the documented-only HTTP-transport example, not a working translation.
- Bridging the repo's runtime-neutral guard cores (spec-gate, skill-advisor routing, code-graph freshness, mcp-route-guard) into Pi's native `.pi/extensions/*.ts` — that is phase 008 (`pi-hook-extension-layer`).
- Model registry rows, CI gate coverage arrays, or a fail-closed dispatch allowlist for Pi-compatible models — that is phase 009 (`pi-model-registry-and-routing`).
- Manual-testing-playbook scenario *content* — this phase only scaffolds the directory; the Pi-native scenarios are authored in phase 010.
- Docs/agent-roster governance mentions and the full packet-wide `validate.sh --recursive --strict` closeout — that is phase 011 (`docs-agents-governance-and-closeout`), the terminal phase.
- The hub-root `README.md`'s stale prose (if any is found at implementation time) beyond the mode-table/layout-tree additions this phase's `SKILL.md` requirement already covers — flagged as an Open Question, not preemptively corrected here, to avoid scope creep beyond this phase's own file set (mirrors the same deferral both `cli-devin` and `cli-cursor` made).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/cli-pi/SKILL.md` | Create | Packet skill definition: frontmatter, `hard_rules`, self-invocation guard, routing. |
| `cli-external-orchestration/cli-pi/README.md` | Create | 9-section AT A GLANCE → RELATED DOCUMENTS overview. |
| `cli-external-orchestration/cli-pi/changelog/` | Create | Version history directory (hard-required by check 3d-files). |
| `cli-external-orchestration/cli-pi/references/cli-reference.md` | Create | CLI invocation/flags/config reference. |
| `cli-external-orchestration/cli-pi/references/integration-patterns.md` | Create | Cross-AI integration patterns. |
| `cli-external-orchestration/cli-pi/references/agent-delegation.md` | Create | Subagent delegation contract (via third-party `pi-subagents`, translation deferred to phase 006). |
| `cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md` | Create | Pi's native `SKILL.md`/prompt-template/extension discovery surfaces. |
| `cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md` | Create | `pi-mcp-extension`/`pi-subagents` community packages, documented-only HTTP transport, stdio gap flagged UNCONFIRMED. |
| `cli-external-orchestration/cli-pi/assets/prompt-quality-card.md` | Create | Thin delegator to `sk-prompt/prompt-models`, dispatch-mechanics addenda only. |
| `cli-external-orchestration/cli-pi/assets/prompt-templates.md` | Create | Pi-dispatch prompt templates. |
| `cli-external-orchestration/cli-pi/manual-testing-playbook/` | Create | Scaffold directory; content lands in phase 010. |
| `cli-external-orchestration/mode-registry.json` | Modify | Add the `cli-pi` `modes[]` entry (6th entry). |
| `cli-external-orchestration/hub-router.json` | Modify | Add `routerSignals.cli-pi`, vocabulary classes, extend `tieBreak` to 6 elements. |
| `cli-external-orchestration/description.json` | Modify | Extend `keywords`/`trigger_examples`/prose only. |
| `cli-external-orchestration/SKILL.md` | Modify | Add `cli-pi` mode-table row + layout-tree row + "six modes" prose. |
| `cli-external-orchestration/graph-metadata.json` | Modify | Extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals`. |
| `cli-external-orchestration/leaf-manifest.json` | Regenerate | Via `generate-leaf-manifest.cjs --write` (mechanical, not hand-edited). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create the `cli-pi/` packet directory with `SKILL.md`, `README.md`, `changelog/` (hard-required), plus `references/`, `assets/`, `manual-testing-playbook/` (family-parity). | Directory exists; check 3d-files passes. |
| REQ-002 | Never create `cli-pi/graph-metadata.json` or `cli-pi/description.json` anywhere under the new packet. | `parent-skill-check.cjs` checks 2a and 2b stay at 0 fails against the whole hub tree. |
| REQ-003 | `SKILL.md` frontmatter `name` equals the folder name (`cli-pi`) and equals the registry `packetSkillName`; `version` is four-part (`"1.0.0.0"`); `allowed-tools: [Bash, Read, Glob, Grep]`. | Check 3d-name-frontmatter passes. |
| REQ-004 | Wire `mode-registry.json` with a `cli-pi` `modes[]` entry matching the exact schema every existing sibling uses (`workflowMode`, `packetKind: "workflow"`, `backendKind: "cli-dispatch"`, `toolSurface`, `packet`, `packetSkillName`, `grandfatheredFolderMismatch: false`, `command: null`, `aliases`, `advisorRouting`). | Checks 3b (6 modes), 3c, 3d, 3d-canon, 3e all pass. |
| REQ-005 | Wire `hub-router.json`: `routerSignals.cli-pi` (weight 4, matching the 5 siblings), a `cli-pi-aliases`/`pi-dispatch` vocabulary-class pair, `resources: ["cli-pi/SKILL.md"]`, and append `"cli-pi"` to `routerPolicy.tieBreak` so it is an exact 6-element permutation of the registry's modes. | Checks 5b and 5e pass; `defaultMode` stays `null`. |
| REQ-006 | Choose every `cli-pi` alias as a multi-word phrase — never the bare token `"pi"` — given "pi" is an unusually common short word/math constant with elevated collision risk versus every prior CLI name added to this hub. | `parent-skill-check.cjs` check 3d-alias reports all aliases unique across 6 modes; no alias array entry is the single token `pi`. |
| REQ-007 | Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write` after all packet/reference/asset files exist. | Checks 10a-manifest-source through 10d-reachability pass; no byte-drift. |
| REQ-008 | Validate `parent-skill-check.cjs` and `validate_skill_package.py` against the whole hub; both must stay at 0 fails/0 warnings (confirmed today, before this phase, at 5 modes / 25 unique aliases — see `plan.md` §2). | Both commands exit clean and are cited as completion evidence at implementation time. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Author `references/cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md` in kebab-case, ≥100 LOC each. | 5 files exist, kebab-case, each ≥100 LOC. |
| REQ-010 | Author `assets/prompt-quality-card.md` as a thin delegator stating the 3-tier precedence rule (sk-prompt framework → model hub profile → this card's dispatch-mechanics addenda) up front, not a competing framework taxonomy re-deriving STAR/BUILD/ATLAS/CONTEXT for a different concept. | Card opens with the precedence rule; no re-derived framework taxonomy present. |
| REQ-011 | Author `assets/prompt-templates.md` with Pi-dispatch prompt templates. | File exists, referenced from `SKILL.md`/`README.md`. |
| REQ-012 | Mirror family convention beyond the bare template: a `hard_rules` frontmatter block analogous to `cli-devin`'s/`cli-cursor`'s `<cli>-availability-required` / `self-invocation-prohibited` / `deep-loop-runtime-required` triad, a Section 2 self-invocation guard function, and a `command -v pi` prerequisite probe. | `SKILL.md` contains all three `hard_rules` ids, a guard function, and the probe command. |
| REQ-013 | Build the self-invocation guard from documented-but-unconfirmed signals only (process ancestry for the `pi` binary, plus the non-conclusive `.pi/` repo-root directory heuristic), and explicitly document in the guard's own comments that no first-party env var analogous to `DEVIN_PROJECT_DIR` or `CURSOR_AGENT` is confirmed — absence of a detected signal is not proof no session is active. | Guard function contains an explicit "unconfirmed signal" comment; no invented env-var name is asserted as real. |
| REQ-014 | Every reference/asset claim sourced from the pi.dev documentation findings (skills discovery paths, prompt-template non-recursive discovery, extension auto-discovery paths, `pi-subagents`/`pi-mcp-extension` install syntax, MCP stdio-transport support) is written as "per pi.dev docs, unconfirmed:" rather than as an already-verified fact. | Manual review confirms no unconfirmed pi.dev-sourced claim is stated as verified anywhere in the packet. |
| REQ-015 | Update the hub's own `description.json`: extend `keywords[]` and `trigger_examples[]`, extend the prose to mention the 6th mode; do not add `modes` or `backend_kinds` keys (registry-owned). | Check 8b stays at 0 fails; no duplicated registry keys in `description.json`. |
| REQ-016 | Update the hub's own `SKILL.md`: add a `cli-pi` row to the Section 1 mode table and the Section 3 layout ASCII tree; update "five workflow modes" prose to "six"; no `allowed-tools` frontmatter edit needed (already `[Bash, Read, Glob, Grep]`, identical to `cli-pi`'s surface). | Both edits present; hub frontmatter unchanged. |
| REQ-017 | Update the hub's own `graph-metadata.json`: extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals` to include the new packet's files/phrases, symmetric with how the 5 existing packets are enumerated. | Arrays extended; not mechanically gated but doctrine-consistent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` returns 0 fails, 0 warnings after `cli-pi` is added — the same baseline confirmed against the hub today (5 modes, 25 unique aliases, both validators PASS — see `plan.md` §2), now at 6 modes.
- **SC-002**: `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration` returns 0 fails.
- **SC-003**: A prompt like "delegate to pi" resolves to the `cli-pi` packet through the executor-delegation scorer with zero code changes to `executor-delegation.ts` — following the same dynamic `mode-registry.json`-load pattern that `cli-devin` and `cli-cursor` both confirmed by direct code research at their own implementation time; re-confirm this at implementation, not assume it from this spec alone.
- **SC-004**: All 6 modes are present in `mode-registry.json`; `hub-router.json`'s `routerPolicy.tieBreak` is an exact 6-element permutation of all 6 registry `workflowMode` values; `defaultMode` stays `null`.
- **SC-005**: No claim in the authored `cli-pi/` packet content states a pi.dev-documentation-sourced behavior as already live-verified; every such claim is either labeled "per pi.dev docs, unconfirmed:" or explicitly routed to phase 001.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Nested `cli-pi/graph-metadata.json` or `description.json` accidentally created | High — hub fails checks 2a/2b (second identity) | REQ-002 as an explicit hard rule; validation gate (REQ-008) before any completion claim at implementation time. |
| Risk | Alias collision — "pi" is an unusually common short token (math constant, informal word) with materially higher collision risk than any prior CLI name (`opencode`, `claude`, `codex`, `cursor`, `devin`) | Medium-High — check 3d-alias fails, or a false-positive router match on unrelated prose containing "pi" | REQ-006 bans any bare `"pi"` alias entirely; only multi-word phrases (`pi cli`, `pi agent`, `delegate to pi`, `pi.dev cli`) are used; cross-check against all 5 sibling alias arrays plus a broader repo-wide alias search before implementation locks the list in. |
| Risk | Self-invocation guard has no confirmed env-var signal (unlike `DEVIN_PROJECT_DIR` or `CURSOR_AGENT`) | Medium — a false-negative guard could let the packet dispatch itself when actually running inside Pi | REQ-013 builds the guard from process-ancestry + the non-conclusive `.pi/` directory heuristic only, documents the gap explicitly, and routes the real signal discovery to phase 001's live probe. |
| Risk | `mode-registry.json` and `hub-router.json` drift out of sync (signal keys vs. registry `workflowMode` values) | Medium — checks 5b/5e fail | Author both files in the same edit pass; validate immediately after, at implementation time. |
| Risk | `leaf-manifest.json` left stale after adding packet files | Medium — checks 10b (byte-drift) / 10d (reachability) fail | Mandatory regeneration step (REQ-007) before any validation claim. |
| Risk | `prompt-quality-card.md` re-introduces a competing-framework-taxonomy (the same archived bug class `cli-devin`'s ADR-003 fixed pre-emptively) | Medium — drifts the card into a duplicate, conflicting taxonomy | REQ-010 mandates a thin delegator from day one, mirroring the `cli-devin`/`cli-cursor` precedent. |
| Risk | A pi.dev-doc-sourced claim (skills discovery, MCP stdio-transport support, `pi install` syntax) is authored as if already verified | Medium — downstream phases (004-009) would inherit a false premise | REQ-014 mandates "per pi.dev docs, unconfirmed:" phrasing for every such claim; SC-005 gates completion on this. |
| Dependency | Phase 001 (`pi-contract-pin`) | Not yet executed. The packet can still be authored (the registry is read dynamically at call time, per `cli-devin`'s and `cli-cursor`'s own confirmed code research), but every live-behavior claim in this phase's content stays UNCONFIRMED until phase 001 runs, and real end-to-end dispatch smoke-testing needs phase 001's headless-invocation syntax plus phase 002's `ExecutorKind` support. | Author documentation-only content now; explicitly flag every unconfirmed claim; do not implement the packet's registry-wiring edits until phase 001 lands (per the parent packet's Phase Transition Rules). |
| Dependency | Phase 002 (`deep-loop-executor-support`) | Not yet landed. | Sequence implementation after phase 002 lands; documentation authoring (this phase's actual deliverable) does not itself require phase 002's code. |
| Dependency | `sk-doc/create-skill` packet-level templates (`skill-md-template.md`, `skill-readme-template.md`) | Wrong shape if templates change before authoring. | Read templates fresh at implementation time rather than trusting this spec's cached description. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — no running service is introduced; packet load cost is bounded by the hub's existing `SKILL.md` router discovery, identical to the 5 existing siblings.
- **NFR-P02**: N/A — static Markdown/JSON authoring carries no throughput target.

### Security
- **NFR-S01**: No secrets, tokens, or credentials are stored in any authored file. Pi's own auth (OAuth or API-key, exact mechanism UNCONFIRMED pending phase 001) stays entirely in the operator's `.pi/`/`~/.pi/` config; this packet never references a credential by value.
- **NFR-S02**: N/A — filesystem/config-only change; no data-at-rest or in-transit surface is introduced by this phase.

### Reliability
- **NFR-R01**: N/A — no uptime target applies to a static skill packet.
- **NFR-R02**: The self-invocation guard fails closed (refuses dispatch) on any detected signal; per REQ-013, absence of a detected signal is explicitly documented as not proof the guard is safe, since no first-party env-var signal is yet confirmed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A — this phase authors static docs/config only; there is no runtime input surface to bound.
- Maximum length: N/A.
- Invalid format: `mode-registry.json`/`hub-router.json` schema must exactly match the 5 existing sibling entries' shape at implementation time — enforced by checks 3c/3d/3d-canon/3e/5b/5e, not by hand-verification alone.

### Error Scenarios
- External service failure: N/A at authoring time — no live dispatch happens in this phase. The `pi` binary's absence is checked at dispatch time by the packet's own `command -v pi` probe (REQ-012), not a build-time blocker for this phase.
- Network timeout: N/A — no network call is made by this phase's deliverable.
- Concurrent access: A concurrent in-flight session editing `hub-router.json`/`mode-registry.json` at implementation time — mitigated by checking `git status` clean before those edits begin (per the repo's Blast-Radius Management guidance), mirroring the same noted risk in the `cli-devin`/`cli-cursor` precedents.

### State Transitions
- Partial completion: If implementation is interrupted mid-edit (e.g. `mode-registry.json` updated but `hub-router.json` not yet), the hub temporarily fails checks 5b/5e until both are updated in the same pass — REQ-005 mandates a single coordinated edit pass to avoid this window.
- Session expiry: N/A — no session-based runtime state is introduced by this phase's deliverable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | ~11 new packet files + 5 hub-root file edits, one hub, no application code — same order of magnitude as the `cli-devin`/`cli-cursor` precedents. |
| Risk | 11/25 | Breaking an already-conformant, zero-fail 5-mode hub if the registry/router go out of sync, or a second advisor identity leaks in — tempered relative to the precedents because the exact registration shape has now been proven twice (devin, cursor) with a real 0/0 baseline confirmed today. |
| Research | 15/20 | Must mirror the `cli-devin`/`cli-cursor` precedent exactly, ground every Pi-specific claim in the pi.dev docs findings with explicit UNCONFIRMED flags, and avoid inventing a signal the docs do not support (elevated because Pi's own docs are thinner than Devin's/Cursor's — `install` and `mcp` pages 404). |
| **Total** | **39/70** | **Level 2** — a third, now-familiar instance of the same registration pattern; this phase carries no live-execution risk since it is planning-only. |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the bare single-token alias `"pi"` creates elevated cross-hub or cross-skill collision risk given it is an extremely common short word/math constant — this phase's mitigation is to exclude any bare `"pi"` alias entirely (REQ-006), using only multi-word phrases; a broader repo-wide alias/keyword search is recommended before the implementation phase locks in the exact alias list.
- No first-party Pi env var analogous to `DEVIN_PROJECT_DIR` or `CURSOR_AGENT` is documented for detecting an active Pi session — phase 001 must live-probe Pi's process environment before this phase's self-invocation guard (REQ-013) can rely on more than process ancestry plus the non-conclusive `.pi/` directory heuristic.
- Whether the hub-root `README.md` needs any Pi-specific correction beyond the mode-table/layout-tree additions this phase's `SKILL.md` requirement already covers — mirrors the still-open "stale defaultMode prose" question both `cli-devin` and `cli-cursor` flagged rather than fixed; flagged here too, not preemptively corrected, to avoid scope creep beyond this phase's own file set.
- Whether `pi-subagents`' and `pi-mcp-extension`'s exact install-verb syntax (`pi install npm:<package>`) is correct as documented in the packages-catalog convention — the upstream research explicitly notes this is inferred, not confirmed, and phase 001 (or the phase that first installs either package) must confirm the real syntax live before phases 006/007 depend on it.
- Whether `pi`'s recursive `SKILL.md` discovery, when pointed at `.opencode/skills/`, respects this repo's single-advisor-identity parent-hub design (hub `SKILL.md` only) or also surfaces every nested mode `SKILL.md` as an independent skill — genuinely unknown until phase 004 live-verifies it; this phase's `native-skills-and-extensions.md` reference documents the question but does not answer it.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
