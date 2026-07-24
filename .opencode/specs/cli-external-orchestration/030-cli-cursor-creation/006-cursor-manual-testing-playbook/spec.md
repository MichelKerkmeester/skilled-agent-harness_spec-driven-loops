---
title: "Feature Specification: Cursor manual-testing playbook"
description: "Author a Cursor-native manual-testing playbook for the cli-cursor skill: a split-document catalog (root + 9 category folders, ~15-20 CU-NNN scenario files) reframed against Cursor's actual 2026-07 CLI surface (plan/ask modes, worktree isolation, cloud worker, MCP, shared hooks) rather than a blind port of a sibling playbook."
trigger_phrases: ["cursor manual testing playbook", "CU-NNN scenarios", "cli-cursor playbook categories"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md for phase 006 (Planned)"
    next_safe_action: "Author plan.md, tasks.md, checklist.md; wait for phases 003-005"
    blockers: ["cursor-agent login (interactive OAuth) blocks scenario EXECUTION, not this phase's authoring"]
    key_files: ["../001-cursor-contract-pin/implementation-summary.md", "../003-cli-cursor-skill-packet/spec.md", ".opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Should the hallucination-fixture scenario dispatch a fabricated --reasoning-effort flag (which Cursor expresses via a model bracket, not a standalone flag) as the fake-flag probe, or a different fabricated flag?", "Should worktree-isolation scenarios actually create a git worktree under ~/.cursor/worktrees, or dry-run to avoid touching the operator's repo state?", "Should the cloud-worker category execute a real worker registration, given it connects to Cursor's cloud and may incur account effects?"]
    answered_questions: ["Cursor has genuinely unique surfaces (plan/ask execution modes, -w worktree isolation, cloud worker, plugin marketplace) that have no sibling playbook analog and must be authored fresh, not ported from cli-codex/cli-devin categories."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Cursor manual-testing playbook

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../005-cursor-model-registry-and-routing/spec.md` |
| **Successor** | `../007-docs-agents-governance-and-closeout/spec.md` |
| **Handoff Criteria** | Manual-testing playbook authored with Cursor-native scenario categories, cross-referenced from `cli-cursor/SKILL.md`. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-codex` ships a split-document manual-testing-playbook (1 root + per-feature scenario files across categories) as its canonical, no-mocking, PASS/FAIL/SKIP validation mechanism — there is no automated test suite for these CLI-dispatch skills, so the playbook IS the gate. `cli-cursor` needs its own playbook, but several of the sibling categories (Codex's `config.toml` `-p profile` routing and 3-tier local-sandbox modes; Devin's `/handoff` and 4-mode permission system) do not map onto Cursor's actual (2026-07) surface, confirmed live in phase 001. A blind port would fabricate coverage for capabilities Cursor doesn't have in that shape, while missing capabilities Cursor genuinely does have that no sibling does: **read-only plan/ask execution modes**, **native git worktree isolation (`-w`)**, a **cloud `worker`** (infra-grade, distinct from Devin's session `/handoff`), a **plugin marketplace**, and a **hooks system shared with the Cursor editor**.

### Purpose
Author a Cursor-native manual-testing playbook mirroring the confirmed cli-codex split-document template (root file + category folders, universal per-feature scenario template, `CU-NNN` scenario IDs) but reframing the category set against Cursor's live-verified 2026-07 surface: 9 categories targeting roughly 15-20 total scenario files, including a hallucination-fixture scenario grounded in the general cli-family hallucination-caveat pattern (Cursor has no archived per-model failure data — it is a first-time creation), with an explicit note that playbook EXECUTION (not authoring) is gated on the operator completing `cursor-agent login`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the playbook root file `manual-testing-playbook.md` under `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/`, mirroring cli-codex's confirmed root-file section structure (EXECUTION POLICY banner, SELF-INVOCATION GUARD banner, then numbered sections through a Feature Catalog Cross-Reference Index).
- Author 9 category subdirectories, each with at least 1 `CU-NNN` scenario file using the universal per-feature template (frontmatter, Overview, Scenario Contract, Test Execution, Source Files, Source Metadata): `cli-invocation`, `execution-modes`, `approvals-and-sandbox`, `worktree-isolation`, `mcp-integration`, `hooks`, `session-continuity`, `cloud-worker`, `prompt-templates`.
- Target roughly 15-20 total scenario files.
- Frame `execution-modes` around Cursor's distinctive read-only `plan` and `ask` modes plus default agent mode (no sibling has read-only execution modes in this shape).
- Frame `approvals-and-sandbox` around Cursor's real flags (`--force`/`--yolo`, `--auto-review` Smart Auto, `--sandbox enabled|disabled`, `--trust`), NOT Codex's 3-tier sandbox or Devin's 4-mode permission enum.
- Add a `worktree-isolation` category exercising `-w`/`--worktree`, `--worktree-base`, and `.cursor/worktrees.json` — a Cursor-unique surface (see Open Question on whether to create real worktrees).
- Add a `cloud-worker` category exercising `cursor-agent worker` — a Cursor-unique surface (see Open Question on real registration).
- Add a `hooks` category exercising the shared `.cursor/hooks.json` events wired in phase 004 (`sessionStart`/`beforeSubmitPrompt`/`stop` at minimum), noting the CLI partial-event-delivery caveat.
- Add an `mcp-integration` category exercising `cursor-agent mcp add/list/list-tools/enable/disable` against `.cursor/mcp.json`.
- Port the `prompt-templates` category near-verbatim from Codex's CLEAR/RCAF scoring apparatus — a shared, cli-family-generic pattern.
- Include at least one scenario dispatching a prompt likely to trigger flag hallucination (canonical example: a fabricated `--reasoning-effort` flag, which Cursor expresses via a model bracket rather than a standalone flag) and verify the response does not reference a fake flag — grounded in the general cli-family hallucination-caveat pattern, not fabricated Cursor-specific failure data.
- State explicitly, in the root file's Global Preconditions section, that playbook EXECUTION is gated on the operator completing `cursor-agent login` (interactive OAuth), and that a `-p` dispatch without auth fails closed with `Error: Authentication required`.
- Add a cross-reference to the playbook from `cli-cursor/SKILL.md` once phase 003's skill packet exists.

### Out of Scope
- Actually executing any scenario. Execution requires `cursor-agent login` (operator-only interactive OAuth) — this phase authors the playbook, it does not run it.
- Porting Codex's `config.toml` profile-routing or 3-tier local-sandbox categories, or Devin's 4-mode permission / `/handoff` categories, verbatim — they don't map onto Cursor's actual surface.
- Building the `cli-cursor` skill packet (phase 003) or the hook adapter layer (phase 004) — this phase authors the playbook that validates them once built.
- Wiring `mode-registry.json`/`hub-router.json`/`leaf-manifest.json` — that is phase 003; this phase only adds the playbook's own cross-reference pointer into `cli-cursor/SKILL.md`.
- Inventing a fictional Cursor changelog/version-history narrative — that is a phase-007/closeout concern and phase 007 should not fabricate one either.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md` | Create | Root playbook file mirroring cli-codex's root-file structure. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/{cli-invocation,execution-modes,approvals-and-sandbox,worktree-isolation,mcp-integration,hooks,session-continuity,cloud-worker,prompt-templates}/*.md` | Create | Roughly 15-20 `CU-NNN` scenario files, at least 1 per category, using the universal per-feature template. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Modify | Add a cross-reference to the manual-testing playbook (once phase 003 creates this file). |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Playbook root file authored with the confirmed section structure, plus the EXECUTION POLICY and SELF-INVOCATION GUARD banners before the numbered sections. | Root file mirrors cli-codex's root-file section set; both banners present. |
| REQ-002 | 9 category subdirectories authored, each with at least 1 `CU-NNN` scenario file. | `find` lists exactly the 9 named directories; each contains `>=1` `.md`. |
| REQ-003 | Total scenario file count lands in the 15-20 range. | Scenario-file count is between 15 and 20 inclusive. |
| REQ-004 | At least one scenario dispatches a prompt designed to trigger flag hallucination, with Pass/Fail criteria that explicitly reject a fake-flag reference (e.g. a fabricated `--reasoning-effort`). | The scenario's Fail condition names the fake-flag reference explicitly, grounded in the cli-family hallucination-caveat pattern (not fabricated Cursor failure data). |
| REQ-005 | Root file's Global Preconditions documents `cursor-agent login` as an operator-only, non-automatable OAuth step gating EXECUTION (not authoring), and notes the fail-closed `-p`-without-auth behavior. | The preconditions section states this explicitly. |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Scenario IDs use the `CU-NNN` prefix (Cursor), globally unique and sequential with no gaps across all 9 categories. | Extracting every `CU-\d{3}` token yields a sorted, gap-free, duplicate-free sequence from `CU-001`. |
| REQ-007 | `execution-modes` documents Cursor's read-only `plan`/`ask` modes and default agent mode, explaining they replace Codex's/Devin's permission-mode categories. | The category names `plan`, `ask`, and agent mode and states they are read-only vs. mutating. |
| REQ-008 | `approvals-and-sandbox` uses Cursor's real flags (`--force`/`--yolo`, `--auto-review`, `--sandbox enabled\|disabled`, `--trust`), not a ported sibling permission model. | The category's scenarios reference those exact flags. |
| REQ-009 | `worktree-isolation` and `cloud-worker` categories exist as Cursor-unique surfaces with no sibling analog, each with the safety caveat from its Open Question noted in-scenario. | Both categories exist; each notes its execution-safety caveat. |
| REQ-010 | `hooks` category exercises the shared `.cursor/hooks.json` events from phase 004, naming the CLI partial-event-delivery caveat. | The category names `sessionStart`/`beforeSubmitPrompt`/`stop` and the partial-delivery caveat. |
| REQ-011 | Playbook cross-referenced from `cli-cursor/SKILL.md`. | `cli-cursor/SKILL.md` references `manual-testing-playbook`. |
| REQ-012 | This phase's own docs do not fabricate a changelog/version-history narrative. | No changelog/version-history section in this phase's spec-kit docs. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Root playbook file exists with the confirmed section set, structurally mirroring the cli-codex root-file shape.
- **SC-002**: All 9 categories authored, each with at least 1 scenario, total scenario count within the 15-20 target range.
- **SC-003**: The hallucination-fixture scenario exists and its Pass/Fail criteria explicitly reject fake-flag references.
- **SC-004**: Playbook cross-referenced from `cli-cursor/SKILL.md`.
- **SC-005**: sk-doc's `validate_document.py` reports 0 structural errors against every playbook file, and this phase's spec-folder passes `validate.sh --strict` 0/0.
- **SC-006**: Root file's Global Preconditions gate scenario EXECUTION on `cursor-agent login`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Phase 003 `cli-cursor` skill packet (SKILL.md cross-reference target) | Yellow — Planned | Author playbook content independently; add the cross-reference once phase 003 ships. |
| Dependency | Phase 004 hook adapter layer (adapter paths for the `hooks` category) | Yellow — Planned | Author `hooks` scenarios against phase 001's confirmed hook contract + phase 004's chosen events; backfill exact paths once 004 ships. |
| Dependency | `cursor-agent login` (operator-only OAuth) | Red — not completed | Blocks scenario EXECUTION only; does not block authoring or this phase's `validate.sh --strict`. |
| Risk | Blind port of sibling categories fabricates coverage for capabilities Cursor lacks in that shape | High if unmitigated | Reframe `execution-modes`/`approvals-and-sandbox` per grounded facts (REQ-007/REQ-008); explicit Out-of-Scope against verbatim porting. |
| Risk | worktree-isolation / cloud-worker scenarios mutate the operator's repo/account if executed live | Medium | Note the dry-run / real-registration caveat in-scenario (Open Questions); default to non-destructive framing. |
| Risk | Hallucination-fixture facts fabricated (no archived Cursor failure data) | Medium | Ground the scenario in the general cli-family hallucination-caveat pattern, not invented Cursor-specific failures. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
- Should the hallucination-fixture scenario use a fabricated `--reasoning-effort` flag as the fake-flag probe (Cursor expresses effort via a model bracket, not a standalone flag), or a different fabricated flag? Leaning toward `--reasoning-effort` since it is a plausible-but-absent flag.
- Should worktree-isolation scenarios actually create a git worktree under `~/.cursor/worktrees`, or dry-run to avoid touching repo state? Leaning toward dry-run/inspection framing with an optional real-worktree variant marked destructive.
- Should the cloud-worker category execute a real `cursor-agent worker` registration (which connects to Cursor's cloud and may have account effects), or document-and-SKIP by default? Leaning toward document-and-SKIP with a clearly-marked opt-in live variant.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable — this phase produces no runtime code path; documented as N/A rather than fabricated.

### Security
- **NFR-S01**: No scenario file may embed a real credential, token, or the operator's actual `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN` value — placeholders only.

### Reliability
- **NFR-R01**: The EXECUTION POLICY banner enforces PASS/FAIL/SKIP-only verdicts (no silent "unavailable" classification), matching the cli-codex precedent's reliability bar for the eventual execution phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `cursor-agent` absent from PATH: the precondition check fails closed; every scenario is marked SKIP with a documented blocker, not FAIL.
- `cursor-agent login` not completed: playbook execution is blocked at the Global Preconditions gate; authoring and this phase's `validate.sh --strict` proceed unaffected.

### Error Scenarios
- Hallucinated-flag scenario returns ambiguous output (references both a real flag and a fake one): the Pass/Fail criteria treat any fake-flag reference as FAIL, not PARTIAL.
- `hooks` category event not delivered by the CLI (partial-delivery caveat): the scenario is marked SKIP-editor-only with a documented gap, not silently omitted.

### State Transitions
- Phase 006 authoring begins before phases 003/004/005 land: cross-references to SKILL.md, hook events, and Composer are drafted against phase 001's confirmed facts and reconciled once those phases ship.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Root file + ~16-20 scenario files across 9 directories, all markdown, no code. |
| Risk | 8/25 | Docs-only, low blast radius; main risk is miscategorization/fabricated coverage, mitigated by REQ-007/REQ-008. |
| Research | 10/20 | Grounded in confirmed phase 001 facts; exact hook events and Composer specs depend on phases 004/005. |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../005-cursor-model-registry-and-routing/spec.md` (predecessor)
- `../007-docs-agents-governance-and-closeout/spec.md` (successor)
- `../001-cursor-contract-pin/implementation-summary.md` (live Cursor CLI contract: modes, worktree, worker, hooks, MCP, models)
- `../../z_archive/013-cli-copilot-hallucination-caveat/spec.md` (structural analog for documenting a CLI's known hallucination behavior)
- `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md` (structural precedent this phase mirrors)
