---
title: "Feature Specification: Pi manual-testing playbook (planning)"
description: "Plan a Pi-native manual-testing playbook (sk-doc create-manual-testing-playbook conventions) for the future cli-pi skill: 8 category folders, ~19 PI-NNN scenarios spanning install/contract, skill discovery, command dispatch, agent bridge, MCP host integration, hook/extension behavior, and model dispatch. Planning only -- no playbook files are created this phase."
trigger_phrases:
  - "pi manual testing playbook"
  - "PI-NNN scenarios"
  - "cli-pi playbook categories"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/010-pi-manual-testing-playbook"
    last_updated_at: "2026-07-27T11:36:00Z"
    last_updated_by: "claude-code"
    recent_action: "Coverage plan re-verified against phases 001-009's real landed facts"
    next_safe_action: "Commit; phase 011 re-judges playbook proportionality at closeout"
    blockers: ["The actual playbook files remain unauthored - out of this planning phase's own scope, deferred to a future execution phase"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-planning"
      parent_session_id: null
    completion_pct: 90
    open_questions: ["Which lifecycle events does Pi's extension API actually expose (routed to phase 008)?", "Does pi-mcp-extension support stdio transport at all (routed to phase 007)?", "What is Pi's self-invocation-guard signal (routed to phase 001/003)?", "What is the exact `pi install npm:X` syntax and its failure output (routed to phase 001)?", "Should a Pi-unique category (no sibling analog) be added once phases 001-009 reveal one, e.g. from Containerization or Sessions/Compaction?"]
    answered_questions: []
---
# Feature Specification: Pi manual-testing playbook (planning)

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
| **Priority** | P1 |
| **Status** | Complete - planning re-verified against phases 001-009's real landed facts (exit-code semantics, stdio-transport docs update, 32-event type-confirmed lifecycle set, 7-model roster); the actual playbook files stay unauthored, deferred to a future execution phase per this phase's own Hard Constraint |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Predecessor** | `../009-pi-model-registry-and-routing/spec.md` |
| **Successor** | `../011-docs-agents-governance-and-closeout/spec.md` |
| **Handoff Criteria** | The playbook's scenario coverage is judged proportional to the sibling CLIs' playbooks (both in count and category breadth). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-codex`, `cli-devin`, and `cli-cursor` each ship a split-document manual-testing playbook (root file + category folders, `{PREFIX}-NNN` scenario IDs, strict PASS/FAIL/SKIP discipline) as their no-mocking validation gate -- there is no automated test suite for these CLI-dispatch skills, so the playbook IS the gate. `cli-pi` has none, and per the pi.dev research findings supplied to this phase, Pi's actual surface doesn't map cleanly onto any single sibling's category set: it has NATIVE first-party skills/prompt-templates/extensions (unlike Devin/Cursor, which needed bespoke hook adapters because they lack a shared skill format) but sub-agents and MCP support come from two THIRD-PARTY community packages (`pi-subagents`, `pi-mcp-extension`) with meaningfully unconfirmed capability (MCP's only documented config example is a remote `streamable-http` server; whether a local stdio server -- the shape our 5 native MCP servers actually use -- works at all is UNCONFIRMED from docs). A blind port of a sibling's category set would fabricate coverage Pi doesn't have in that shape while missing what it does have.

### Purpose
Plan (this phase authors ONLY spec.md/plan.md/tasks.md/checklist.md -- no playbook files exist yet) a Pi-native manual-testing-playbook package via the sk-doc `create-manual-testing-playbook` conventions: 8 category folders mapping onto the capability areas exercised by phases 001-009 (install/contract, skill discovery, command dispatch, agent bridge, MCP host integration, hook/extension behavior, model dispatch, plus one cli-family-generic prompt-quality addition), targeting a 17-20 scenario range under a `PI-NNN` ID scheme, so that once phases 001-009 land live-verified facts, the future authoring pass for this phase has a concrete, falsifiable target to build against rather than starting from a blank page.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan the FUTURE root playbook file's section shape, mirroring sk-doc's canonical `manual-testing-playbook.md` contract (EXECUTION POLICY banner, SELF-INVOCATION GUARD banner, then numbered sections through a Feature Catalog Cross-Reference Index) -- this phase does not create `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/` itself.
- Plan 8 category folders and a `PI-NNN` scenario-ID scheme spanning the capability areas exercised by phases 001-009: `cli-invocation` (install/contract, phases 001+002), `skill-discovery` (phases 003/004), `command-dispatch` (phase 005), `agent-bridge` (phase 006), `mcp-host-integration` (phase 007), `hook-extension-layer` (phase 008), `model-dispatch` (phase 009), plus `prompt-quality` (the cli-family-generic CLEAR-scoring pattern ported near-verbatim from `cli-codex`/`cli-cursor`).
- Sketch a Scenario Coverage Plan table (§9 in the body, referenced from REQUIREMENTS) targeting 17-20 total planned scenarios; 19 are sketched below (`PI-001`..`PI-019`).
- Sketch one hallucination-fixture scenario plan (`PI-003`), grounded in the general cli-family hallucination-caveat pattern -- Pi has no archived per-model failure data of its own; like `cli-cursor`'s playbook, this would be a first-time creation, not a port of real Pi failure history.
- Plan an explicit `mcp-host-integration` pairing: one stdio-transport probe scenario (`PI-011`) testing a capability the pi.dev docs never demonstrate, alongside one streamable-http positive-control scenario (`PI-012`) using the one shape the docs do demonstrate -- so the playbook plan does not silently assume stdio support either way.
- Plan an explicit `hook-extension-layer` lifecycle-event enumeration scenario (`PI-015`) that live-lists Pi's actual exposed extension events, rather than assuming event-for-event parity with Claude/Devin/Cursor's hook surfaces.
- Plan the Global Preconditions section to gate future scenario EXECUTION on Pi CLI install + provider auth (the eventual analogue of `cursor-agent login`), and to explicitly route the self-invocation-guard signal and the headless-dispatch exit-code-on-failure behavior to phase 001 as still-open, live-verification-required facts rather than guessing them here.
- Note (without performing) the future cross-reference this phase will add into `cli-pi/SKILL.md` once phase 003 ships that file.

### Out of Scope
- Actually creating `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/` or any file under it - that authoring pass happens when this phase is later executed, after phases 001-009 land real, live-verified facts to author against.
- Installing the Pi CLI, `pi-subagents`, or `pi-mcp-extension`, or running any live `pi` dispatch - this phase is planning-only, per the HARD CONSTRAINTS governing the whole 031 packet.
- Editing `cli-pi/SKILL.md`, `.mcp.json`, or any file outside this phase's own folder (`010-pi-manual-testing-playbook/`).
- Resolving the open UNKNOWNs (self-invocation env var, stdio MCP support, extension lifecycle-event set, exact `pi install` syntax) - each is explicitly routed to its owning phase (001, 007, 008) rather than guessed here.
- Inventing a fictional Pi changelog/version-history narrative - that is an 011/closeout concern, and 011 should not fabricate one either.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `010-pi-manual-testing-playbook/spec.md` | Modify | This planning spec (Scenario Coverage Plan, requirements, risks). |
| `010-pi-manual-testing-playbook/plan.md` | Modify | Implementation plan for the FUTURE authoring pass. |
| `010-pi-manual-testing-playbook/tasks.md` | Modify | Task breakdown for the FUTURE authoring pass. |
| `010-pi-manual-testing-playbook/checklist.md` | Modify | Verification checklist for the FUTURE authoring pass (all items unchecked - nothing executed yet). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root playbook file's planned section shape matches sk-doc's canonical `create-manual-testing-playbook` contract (EXECUTION POLICY + SELF-INVOCATION GUARD banners, then numbered sections through a Feature Catalog Cross-Reference Index). | This spec's SCOPE section names both banners and the section set explicitly (present, confirmed by direct read of this file). |
| REQ-002 | 8 category folders planned, each with >=1 `PI-NNN` scenario sketched. | §9 Scenario Coverage Plan table lists all 8 named categories (`cli-invocation`, `skill-discovery`, `command-dispatch`, `agent-bridge`, `mcp-host-integration`, `hook-extension-layer`, `model-dispatch`, `prompt-quality`), each with >=1 row. |
| REQ-003 | Total planned scenario count lands in the 17-20 range. | §9 table row count is between 17 and 20 inclusive (19 sketched). |
| REQ-004 | A hallucination-fixture scenario is planned with a Fail condition that names a fake-flag/fake-syntax reference explicitly. | `PI-003`'s row states the fake-flag probe and a Fail condition naming the fabricated pattern, grounded in the cli-family hallucination-caveat pattern, not fabricated Pi failure data. |
| REQ-005 | Global Preconditions plan gates future scenario EXECUTION on Pi CLI install + provider auth, and explicitly marks the self-invocation-guard mechanism and the headless-dispatch exit-code-on-failure behavior as UNKNOWN pending phase 001. | Both UNKNOWNs are stated as such in SCOPE/RISKS, each routed to phase 001 by name, never asserted as confirmed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `PI-NNN` scenario IDs planned sequential and gap-free from `PI-001`. | Extracting every `PI-\d{3}` token from §9's table yields a sorted, gap-free, duplicate-free sequence starting at `PI-001`. |
| REQ-007 | Category set maps 1:1 onto the 7 capability areas named in this phase's brief (install/contract, skill discovery, command dispatch, agent bridge, MCP host integration, hook/extension behavior, model dispatch), plus one documented cli-family-generic addition. | Each of the 7 named areas has a matching category in §9; `prompt-quality` is documented in SCOPE as the one addition and why. |
| REQ-008 | `mcp-host-integration` plans both a stdio-transport probe and a streamable-http positive control, not just the one documented shape. | `PI-011` and `PI-012` rows exist in §9 naming distinct transport shapes (`stdio` vs `streamable-http`). |
| REQ-009 | `hook-extension-layer` plans a live lifecycle-event enumeration scenario rather than an assumed event list. | `PI-015`'s row in §9 states it enumerates events live via the extension API, not from an assumed parity list. |
| REQ-010 | `model-dispatch` plans a fail-closed-from-the-start allowlist scenario (no `"auto"` default), citing `cli-cursor`'s later-hardening lesson. | `PI-017`'s row in §9 states the no-`auto`-default requirement explicitly and cites the precedent. |
| REQ-011 | This phase's own docs note (without performing) the future `cli-pi/SKILL.md` cross-reference. | SCOPE/RISKS name the future cross-reference as phase-003-gated; no edit to `cli-pi/SKILL.md` exists in this phase's diff. |
| REQ-012 | No changelog/version-history fabrication in this phase's own docs. | No changelog/version-history section appears in spec.md, plan.md, tasks.md, or checklist.md (grep for the headings returns none). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Scenario Coverage Plan (§9) names 8 categories and 17-20 `PI-NNN` scenarios spanning the 7 required capability areas plus one documented addition (`prompt-quality`). **Target, not yet met** - this is the planning artifact itself.
- **SC-002**: Every UNKNOWN Pi behavior claim (self-invocation guard, stdio MCP transport, extension lifecycle events, `pi install` syntax, headless exit-code semantics) is explicitly marked UNKNOWN and routed to its owning phase, never asserted as confirmed.
- **SC-003**: This phase's own `validate.sh 010-pi-manual-testing-playbook --strict` returns `Errors: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 (`pi-contract-pin`) | Complete - exit code on failure confirmed unreliable, `pi install npm:<pkg> -l --approve` confirmed as the real verb; self-invocation signal NOT surfaced | `PI-002`'s scenario plan now cites real evidence instead of an assumption; self-invocation guard remains routed to a future phase |
| Dependency | Phase 003 (`cli-pi-skill-packet`) | Complete - `cli-pi/SKILL.md` exists, 6th hub mode registered | Cross-reference target now exists; still not edited by this planning phase per REQ-011 |
| Dependency | Phase 007 (`pi-mcp-host-integration`) | Blocked - docs now document stdio transport (narrowing REQ-002's premise), but live-session confirmation was out of that phase's own scope | `PI-011`'s scenario is still the one that must confirm a live connection; `PI-012`'s streamable-http control still stands as the fallback baseline |
| Dependency | Phase 008 (`pi-hook-extension-layer`) | Blocked - the real 32-event set was TYPE-CONFIRMED via the installed package's `types.d.ts`, a materially stronger evidence class than this phase's authoring-time UNKNOWN | `PI-015`'s scenario plan can now cite real candidate event names instead of an assumed list, still pending live-session capture |
| Dependency | Phase 009 (`pi-model-registry-and-routing`) | Complete - fail-closed 7-model allowlist landed, `check-prompt-quality-card-sync.sh` passing | `PI-017`/`PI-018` now cite the real, operator-confirmed model roster instead of a generic catalog reference |
| Risk | Blind port of sibling categories (Cursor's worktree-isolation/cloud-worker, Codex's 3-tier sandbox, Devin's 4-mode permission enum) fabricates coverage Pi doesn't have in that shape | High if unmitigated | Category set (REQ-007) is derived from Pi's actual documented native surfaces (skills/prompt-templates/extensions) plus its two third-party packages, not ported verbatim |
| Risk | Third-party package install syntax (`pi install npm:X`) assumed from a packages-catalog-page convention, not confirmed by docs | Medium | `agent-bridge` (`PI-009`) and `mcp-host-integration` (`PI-011`) scenario plans both note the install-syntax UNKNOWN, routed to phase 001's first live install and re-confirmed by phases 006/007 |
| Risk | MCP support may be genuinely peripheral to core Pi - both `https://pi.dev/docs/latest/install` and `.../mcp` core-docs pages 404; MCP is documented only at the package-catalog page | Medium | `mcp-host-integration` scenario plan (`PI-011`/`PI-012`) pairs a stdio probe with a streamable-http control instead of assuming either direction works |
| Risk | This phase's own scenario-count/category targets (8 categories, 19 scenarios) turn out disproportionate once phases 001-009 reveal Pi's real surface (e.g. too many/few Pi-unique surfaces vs. siblings) | Low-Medium | Handoff criterion into phase 011 explicitly re-judges proportionality against sibling playbooks at that later point, not frozen here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable - this phase produces no runtime code path; documented as N/A rather than fabricated, matching the `cli-cursor` precedent's convention for a docs-only playbook-planning phase.

### Security
- **NFR-S01**: No scenario plan may embed a real credential, token, or provider API key value - only env-var *names* (e.g. a hypothetical `PI_API_KEY`) may appear in prose once the real playbook is authored.
- **NFR-S02**: This phase's own planning docs (spec/plan/tasks/checklist) contain zero secrets or credential-shaped values, verified by grep before completion.

### Reliability
- **NFR-R01**: The FUTURE root playbook's EXECUTION POLICY banner will enforce strict PASS/FAIL/SKIP-only verdicts (no `UNAUTOMATABLE`, no `PARTIAL`), per sk-doc's `create-manual-testing-playbook` determinism rule (§5 SCENARIO DESIGN RULES).
- **NFR-R02**: Every UNKNOWN Pi-specific behavioral claim in this planning phase is routed to a specific owning phase by number, never left as a silent, unattributed assumption.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Pi CLI absent from PATH at future-execution time: the Global Preconditions plan requires the precondition check to fail closed to `SKIP` with a documented blocker, not `FAIL` - mirroring the `cli-cursor`/`cli-devin` precedent pattern.
- Provider auth not completed at future-execution time: playbook EXECUTION is blocked at the Global Preconditions gate; this phase's own planning-doc authoring and `validate.sh --strict` run are unaffected, since they require no live Pi CLI access.

### Error Scenarios
- Headless dispatch exit-code semantics turn out to mirror the `cursor-agent -p` exit-0-on-auth-failure gotcha: `PI-002`'s plan requires inspecting stdout/stderr/JSON-event-stream content, never exit code alone, once phase 001 confirms the actual behavior - the guard-design lesson is carried forward even though the exact Pi behavior is still unconfirmed.
- Extension lifecycle event partially delivered (some events fire, others don't, mirroring `cli-cursor`'s confirmed-fires vs. confirmed-non-delivery split): `PI-015`'s plan calls for a delivery table per event, not a single pass/fail verdict for the whole extension layer.
- `pi-mcp-extension` install succeeds but stdio transport is rejected: `PI-011`'s plan treats this as a valid, documented `FAIL`-or-`SKIP` outcome (not a silent omission), with `PI-012`'s streamable-http control still establishing a working baseline.

### State Transitions
- This phase's planning docs are authored before phases 001-009 execute: every Pi-specific behavioral claim is marked UNKNOWN-pending-live-verification rather than asserted, and reconciled once those phases land - mirroring how `cli-cursor`'s 006 phase drafted cross-references against phase 001's confirmed facts and reconciled once phases 003-005 shipped.
- Phases 001-009 land facts that change the planned category/scenario count materially: the future authoring pass revises §9's table against the real facts before creating any playbook file, rather than forcing the pre-execution plan's exact numbers.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Planning-only: 4 docs (spec/plan/tasks/checklist), no code, no real playbook files created this phase. |
| Risk | 8/25 | Docs-only, low blast radius; main risk is premature/fabricated coverage claims, mitigated by explicit UNKNOWN routing per capability area. |
| Research | 12/20 | Grounded in the supplied pi.dev docs findings, the sk-doc `create-manual-testing-playbook` conventions, and the `cli-cursor`/`cli-devin` precedents; several Pi-specific facts (stdio MCP support, extension lifecycle events, self-invocation signal) remain genuinely unconfirmed pending phases 001/007/008. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 9. SCENARIO COVERAGE PLAN

This table is the planning-stage sketch that the FUTURE authoring pass (after phases 001-009 land) will build against. Each row is a target, not an authored scenario - none of these files exist yet. `Fixture-status` marks whether the row depends on an UNKNOWN fact this planning phase could not confirm.

| PI-ID | Category | Planned Title | Depends On | Fixture-Status |
|-------|----------|----------------|------------|-----------------|
| PI-001 | `cli-invocation` | Version/help + `.pi/` directory creation + `settings.json` merge (project overrides global, nested-object merge per the docs quote) | Phase 001 | Docs-grounded; merge behavior UNCONFIRMED until live |
| PI-002 | `cli-invocation` | Headless/non-interactive dispatch exit-code semantics (Programmatic Usage: SDK/RPC/JSON event stream) on both success and auth/dispatch failure | Phase 001, Phase 002 | Phase 001 live-confirmed exit code is UNRELIABLE on failure (0 then 1 across identical runs, worse than `cursor-agent`'s own gotcha) - the future scenario must assert on stdout/JSON-event content, never exit code alone |
| PI-003 | `cli-invocation` | Hallucination-fixture: constructed Pi dispatch never fabricates an undocumented flag/model-id syntax; Fail condition explicitly names the fabricated pattern | None (self-contained negative control) | Grounded in the general cli-family hallucination-caveat pattern; Pi has no archived failure data of its own |
| PI-004 | `skill-discovery` | `.pi/settings.json` `"skills"` array pointed at `.opencode/skills/`; verify recursive `SKILL.md` discovery surfaces the 12 hubs | Phase 003, Phase 004 | Docs-grounded (recursive discovery documented); hub-count behavior UNCONFIRMED |
| PI-005 | `skill-discovery` | Flattening-risk check: does every nested mode `SKILL.md` surface as an independent skill, diverging from the single-advisor-identity parent-hub design? | Phase 004 | UNKNOWN - phase 004's own open question; this scenario is the live check |
| PI-006 | `skill-discovery` | Project-skills trust-prompt behavior: first load of a configured project skill dir triggers a trust prompt; verify it fires once and the decision persists | Phase 004 | Docs-grounded ("after a trust prompt"); persistence behavior UNCONFIRMED |
| PI-007 | `command-dispatch` | Flatten one sample command from each top-level command group (`create/`, `deep/`, `doctor/`, `interface/`, `memory/`, `prompt/`, `speckit/`) into `.pi/prompts/*.md`; verify `/name` dispatch and confirm discovery is non-recursive | Phase 005 | Docs-grounded (non-recursive discovery explicitly documented) |
| PI-008 | `command-dispatch` | `$1`/`$2`/`$@`/`${1:-default}` argument substitution translated from Claude's `$ARGUMENTS` placeholder convention; verify multi-arg substitution on a flattened command | Phase 005 | Docs-grounded (syntax documented); translation correctness UNCONFIRMED |
| PI-009 | `agent-bridge` | Install `pi-subagents` (confirm exact `pi install npm:pi-subagents` syntax live); verify one translated `.claude/agents/*.md` file parses without schema errors under `.pi/agents/**/*.md` | Phase 006 | Install syntax UNKNOWN (inferred from catalog convention, not documented); routed to phase 001/006 |
| PI-010 | `agent-bridge` | Project-vs-global override: a project `.pi/agents/name.md` wins over a global `~/.pi/agent/agents/name.md` on name collision | Phase 006 | Docs-grounded ("project definitions win on name collision") |
| PI-011 | `mcp-host-integration` | Install `pi-mcp-extension`; attempt to wire one native stdio-transport MCP server (e.g. `mk_code_index`) from `.mcp.json`'s `{command,args,env}` shape into `.pi/mcp.json`; live-verify via `/mcp` whether stdio transport is supported at all | Phase 007 | Phase 007 found a live docs re-fetch now documents a stdio config shape (`"transport": "stdio"` + `command`/`args`/`env`), narrowing but not resolving this - phase 007 stayed Blocked pending an actual install; this scenario is still the one that must confirm it connects live |
| PI-012 | `mcp-host-integration` | Positive control: wire the one documented remote `streamable-http` MCP server shape and verify `/mcp` shows it connected, establishing a deny-by-default / connected-only baseline | Phase 007 | Docs-grounded (the one quoted example shape) |
| PI-013 | `mcp-host-integration` | `~/.pi/agent/mcp.json` (global) vs `.pi/mcp.json` (project) precedence - verify project config overrides global on a colliding server name | Phase 007 | Docs-grounded ("project ... overrides global") |
| PI-014 | `hook-extension-layer` | Native `.pi/extensions/*.ts` auto-discovery (project-local); load a minimal extension and confirm it is picked up without a `settings.json` entry | Phase 008 | Docs-grounded (auto-discovery explicitly documented) |
| PI-015 | `hook-extension-layer` | Lifecycle-event enumeration probe: live-list which lifecycle events/hooks the extension API actually exposes, checked against the events our guard cores need (spec-gate, skill-advisor routing, code-graph freshness, mcp-route-guard) | Phase 008 | Phase 008 found the real event set via a direct read of the installed package's `types.d.ts` (32 named events incl. `tool_call`, block-capable via `{block: true, reason}`) - TYPE-CONFIRMED, not yet LIVE-SESSION-CONFIRMED; this scenario is the one that must capture a real invocation |
| PI-016 | `hook-extension-layer` | Fail-closed verification: a bridged guard core whose extension throws/errors during a guarded lifecycle event must not silently allow the guarded action through | Phase 008 | Depends on PI-015's confirmed event set |
| PI-017 | `model-dispatch` | Live smoke dispatch against a Pi-supported model; confirm the dispatch allowlist has no `"auto"` default (fail-closed from the start, learning from `cli-cursor`'s later hardening rather than repeating the two-step path) | Phase 009 | Phase 009 landed the real, operator-confirmed 7-model roster (`deepseek-v4-pro`, `minimax-m3`, `gpt-5.6-luna`/`sol`/`terra`, `mimo-v2.5-pro`/`-ultraspeed`) in `PI_SUPPORTED_MODELS`, fail-closed with no `"auto"` default, confirmed by unit test - this scenario is the live-dispatch confirmation still pending a real `pi` session |
| PI-018 | `model-dispatch` | Provider/auth config surface: confirm provider config (`pi.dev/docs/latest/providers`) interacts correctly with the `.pi/settings.json` merge semantics from `PI-001` | Phase 001, Phase 009 | Docs-grounded (Providers doc page named in the nav); merge interaction UNCONFIRMED |
| PI-019 | `prompt-quality` | CLEAR scoring via the canonical quality card applied before a non-trivial Pi dispatch, ported near-verbatim from `cli-codex`/`cli-cursor`'s cli-family-generic pattern | None (cli-family-generic, not Pi-specific) | Grounded in the existing, already-proven sibling pattern |

Category rollup: `cli-invocation` (3), `skill-discovery` (3), `command-dispatch` (2), `agent-bridge` (2), `mcp-host-integration` (3), `hook-extension-layer` (3), `model-dispatch` (2), `prompt-quality` (1) = **19 scenarios across 8 categories**, within the 17-20 target range (REQ-003) and IDs sequential/gap-free `PI-001`..`PI-019` (REQ-006).

---

## 10. OPEN QUESTIONS

- Which lifecycle events does Pi's extension API actually expose? **Substantially answered** by phase 008's direct read of the installed package's `types.d.ts`: 32 named events including block-capable `tool_call`. TYPE-CONFIRMED, not yet LIVE-SESSION-CONFIRMED - `PI-015` still needs to capture a real invocation.
- Does `pi-mcp-extension` support a local stdio-transport MCP server at all? **Narrowed** by phase 007's live docs re-fetch: stdio IS now documented (unlike at this phase's authoring time), but phase 007 could not install the package to confirm it connects live - `PI-011`/`PI-012` still test both directions.
- What is Pi's actual self-invocation-guard signal? **Still unresolved** - phase 001 did not surface this; remains routed to a future execution phase, not guessed here.
- What is the exact `pi install npm:X` syntax and its failure-mode output? **Confirmed** by phase 001: `pi install npm:<pkg> -l --approve`; exit code on failure is unreliable (0 then 1 across identical runs) - phase 001's own key finding, now the ground truth `PI-002`'s scenario plan is built against.
- Should the eventual playbook add a Pi-unique category with no sibling analog? **Still open** - phases 001-009 (planning-scope, all no live session) did not surface a clear Pi-unique surface; left for the future authoring pass once a live session is possible.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../009-pi-model-registry-and-routing/spec.md` (predecessor)
- `../011-docs-agents-governance-and-closeout/spec.md` (successor)
- `../030-cli-cursor-creation/006-cursor-manual-testing-playbook/spec.md` (structural + tone precedent this phase mirrors, Cursor's 19-scenario/9-category playbook)
- `../029-cli-devin-revival/006-devin-manual-testing-playbook/` (sibling precedent, second reference point)
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` (authoring conventions this plan follows)
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md` (shipped example of the target package shape)
