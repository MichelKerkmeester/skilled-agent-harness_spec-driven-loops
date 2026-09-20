---
title: "Feature Specification: Pi model registry and routing"
description: "Design a Pi-compatible model registry contribution in sk-prompt/prompt-models (a new profile or executor-row bookkeeping, pending live pi.dev/models verification), extend check-prompt-quality-card-sync.sh's CI gate coverage arrays for cli-pi, and finalize a fail-closed dispatch allowlist (PI_SUPPORTED_MODELS, no auto/router default) in this same phase - learning from 030-cli-cursor-creation's later 008-cursor-model-allowlist hardening rather than repeating its two-step path."
trigger_phrases:
  - "cli-pi model registry"
  - "pi model routing"
  - "pi dispatch allowlist"
  - "pi fail-closed model gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/009-pi-model-registry-and-routing"
    last_updated_at: "2026-07-27T11:26:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via LUNA (2 passes, operator-corrected roster), reviewed by GLM-5.2"
    next_safe_action: "Commit; phase 010 proceeds"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Pi's own dispatch-time CLI flag/parameter names for reasoning effort and service tier remain unconfirmed - no live pi session was run this phase"]
    answered_questions: ["Branch B resolved: Pi has no native/house model, confirmed both via a generic pi.dev/models fetch (1,106+ models, 40+ providers) and stronger operator-supplied evidence (a live configured Pi model picker)", "PI_SUPPORTED_MODELS roster is exactly 7 ids: deepseek-v4-pro, minimax-m3, gpt-5.6-luna, gpt-5.6-sol, gpt-5.6-terra, mimo-v2.5-pro, mimo-v2.5-pro-ultraspeed; PI_DEFAULT_MODEL is deepseek-v4-pro (a judgment call)", "No FAMILY dict entry was needed - deepseek/minimax/mimo family tokens were already reachable in the hub's graph-metadata.json"]
---
# Feature Specification: Pi model registry and routing

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
| **Status** | Complete - Branch B resolved (Pi is pure provider-passthrough, no house model); PI_SUPPORTED_MODELS populated with the operator-confirmed 7-model roster; fail-closed allowlist enforced at both dispatch entry points; implemented via LUNA (2 passes), reviewed by GLM-5.2 (APPROVE WITH MINOR NOTES) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Predecessor** | `../008-pi-hook-extension-layer/spec.md` |
| **Successor** | `../010-pi-manual-testing-playbook/spec.md` |
| **Handoff Criteria** | `check-prompt-quality-card-sync.sh` passes and a live smoke dispatch against a Pi model succeeds; the dispatch allowlist is fail-closed (no `"auto"` default). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt/prompt-models` is this repo's canonical per-model prompt-craft registry (`assets/model-profiles.json` + `references/models/*.md`), consulted whenever any executor dispatches a named model. Pi introduces a genuinely different shape than the two prior CLI-creation packets this spec follows: Devin owns a house model (`swe-1.6`) and Cursor owns a house model (`composer-2.5`), each requiring exactly one new profile. Per the pi.dev docs findings available to this authoring session, Pi is instead documented as an open-source, terminal-based, **multi-provider** AI coding agent - its docs nav lists "Custom Models" and "Custom Providers" under Customization, and the canonical model-list page (`https://pi.dev/models`) was never live-fetched during this planning pass. This spec therefore does not yet know whether Pi has any native/default model of its own that needs a new profile, or whether it is purely a provider-passthrough surface over models this registry may already carry (or needs as net-new externally-hosted entries) - that page's existence as a dedicated "Models" doc leans toward a published, curated multi-provider list rather than a single house model, but this is an inference from the docs-nav shape, not a confirmed fact.

Separately, `check-prompt-quality-card-sync.sh` (`system-skill-advisor/mcp-server/scripts/`) keeps every `cli-*` executor's `prompt-quality-card.md` in sync via 3 coverage points - `cli_cards[]` (currently 3 entries: `cli-opencode`/`cli-claude-code`/`cli-cursor`), `cli_skills[]` (same 3), and the `CLI_EXECUTOR_HUB_METADATA` dict (same 3) - confirmed live in this repo's current script (2026-07-27). It does not yet know about `cli-pi`.

Finally, the `030-cli-cursor-creation` packet's own history is a documented cautionary tale this phase exists to avoid repeating: phase 002 shipped `cli-cursor` with a permissive `CURSOR_SUPPORTED_MODELS` reference list (`['auto', 'composer-2.5', 'composer-2.5-fast']`, explicitly documented "not exhaustive by design... Cursor accepts any valid `--model` id at dispatch time") and no enforced allowlist. It took a **separate later phase** (`008-cursor-model-allowlist`, added after phases 001-007 had already shipped) to retrofit a hard, fail-closed 10-id allowlist with `auto` removed as the default - confirmed via the shipped `executor-config.ts`, which today defines `CURSOR_SUPPORTED_MODELS` as an enforced 10-id array, `CURSOR_DEFAULT_MODEL = 'composer-2.5'`, and `isCursorModelAllowed()`, with the fail-closed rejection duplicated in both `fanout-run.cjs`'s `buildCursorLineageCommand` and `dispatch-model.cjs`'s cli-cursor case.

### Purpose
Author the `sk-prompt/prompt-models` registry contribution for Pi (a new model profile, or executor-row bookkeeping only, whichever REQ-001's implementation-time live verification against `https://pi.dev/models` resolves), extend `check-prompt-quality-card-sync.sh`'s 3 CI-gate coverage points for `cli-pi`, and finalize - in this same phase, not a later hardening pass - a fail-closed `PI_SUPPORTED_MODELS` dispatch allowlist with one named `PI_DEFAULT_MODEL` and no `"auto"`/router-style default, enforced identically at both `fanout-run.cjs`'s `buildPiLineageCommand` and `dispatch-model.cjs`'s cli-pi case.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Live-fetch `https://pi.dev/models` (plus the Providers / Custom Models / Custom Providers docs pages) at the start of implementation to resolve Open Question 1: does Pi document a native/default model needing a new profile, or is it purely provider-passthrough? This planning pass documents the decision tree for both branches (REQ-005/REQ-006) without pre-guessing the answer.
- **Branch A** (Pi has a native/default model): author `references/models/<pi-model-id>.md` mirroring the existing 8-section per-model profile shape (`composer-2.5.md` / `deepseek-v4-pro.md` as structural precedent - Overview / Identity / Recommended Framework / Benchmark Evidence / Tuned Template Snippet / Dispatch Gotchas / See Also), a matching `model-profiles.json` entry, and an `_index.md` row - every unexposed numeric/behavioral field left TBD, never fabricated.
- **Branch B** (Pi is confirmed purely provider-passthrough): add `cli-pi` executor rows to whichever already-profiled models Pi is live-confirmed to dispatch - bookkeeping only, no speculative new profiles for models Pi merely *could* reach (mirrors 030/005's "Composer-only, not every hosted-frontier id" precedent).
- Extend `check-prompt-quality-card-sync.sh`'s `cli_cards[]` (lines 61-64), `cli_skills[]` (line 92), and `CLI_EXECUTOR_HUB_METADATA` (lines 153-157) - each currently a 3-entry array/dict - with a `cli-pi` entry apiece (3 -> 4), plus a `FAMILY` dict entry if the resolved model id's first hyphen-segment isn't already a reachable token.
- Finalize `executor-config.ts`'s Pi allowlist surface: `PI_SUPPORTED_MODELS` (a hard, curated, non-empty array populated only from ids live-confirmed against `pi.dev/models` and/or phase 001's live pi CLI probe - never guessed), `PI_DEFAULT_MODEL` (one specific allowlisted id, never `"auto"` or a router alias), and `isPiModelAllowed()` - hardening whatever placeholder phase 002 scaffolds for `buildPiLineageCommand`, in this same phase rather than a follow-up hardening phase (the explicit anti-030/008 lesson).
- Add the identical fail-closed rejection check to both real dispatch-construction entry points: `buildPiLineageCommand` (`fanout-run.cjs`) and the cli-pi case of `buildSpawnSpec` (`dispatch-model.cjs`) - mirroring the exact proven cli-cursor pattern (`if (!CURSOR_ALLOWED_MODELS.has(model)) throw ...`) so a non-allowlisted model is rejected before any `pi` command is constructed.
- Update the affected test files (`executor-config.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts`, or their nearest cli-pi equivalents once phase 002 lands) with allowlist accept/reject coverage for `cli-pi` at both dispatch entry points.

### Out of Scope
- Building `buildPiLineageCommand`'s headless-dispatch-success detection (exit-code/stdout inspection so a Pi auth/dispatch failure that returns exit 0 isn't mistaken for success) - phase 002's job, keyed on phase 001's live-probed non-interactive syntax; this phase only hardens the MODEL-selection axis of that same function, not its success-detection axis.
- Authoring `cli-pi/assets/prompt-quality-card.md` itself - phase 003's job; this phase only wires the existing card into the CI sync gate.
- Registering `cli-pi`'s trigger_phrases in the hub's shared `graph-metadata.json` - phase 003's job; this phase's own CHECK 4 verification is a re-confirmation, not the original registration.
- Live-installing `pi`, live-fetching `pi.dev/models`, or live-dispatching any `pi` command during THIS planning pass - every live-verification step named above is a required TASK of this phase's future implementation, not something performed now (this phase's status is Planned).
- Extending the allowlist to any model Pi can merely reach through a generic "any provider you configure" mechanism without `pi.dev/models` or a live `pi` config surfacing it as a documented, named option - mirrors 030/005's "Composer-only" discipline against speculative scope growth.
- Re-litigating phases 001-008's already-scoped deliverables (contract pin, executor support, skill packet, discovery bridge, command layer, agent bridge, MCP host integration, hook/extension layer) beyond the model-selection surfaces this phase touches.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/prompt-models/references/models/<pi-model-id>.md` | Create (Branch A only) | Pi model profile, unexposed specs as TBD - only if Open Question 1 resolves to "Pi has a native/default model". |
| `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md` | Modify | Add the new model row (Branch A), or an explicit "Pi drives existing models via cli-pi" note (Branch B). |
| `.opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json` | Modify | New model entry (Branch A) or `cli-pi` executor rows on already-adopted models (Branch B); bump `version`/`description`. |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify | Add `cli-pi` to `cli_cards[]`, `cli_skills[]`, `CLI_EXECUTOR_HUB_METADATA`; add a `FAMILY` entry if needed. |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS`, `PI_DEFAULT_MODEL`, `isPiModelAllowed()` - finalized, fail-closed, no `auto`. |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Fail-closed allowlist check inside `buildPiLineageCommand`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | Fail-closed allowlist check inside the cli-pi case of `buildSpawnSpec`. |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/{executor-config,fanout-run}.vitest.ts` | Modify | Allowlist accept/reject fixtures + tests for `cli-pi`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modify | Allowlist accept/reject fixtures + tests for the cli-pi dispatch case. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A live fetch of `https://pi.dev/models` (plus Providers/Custom Models/Custom Providers) resolves Open Question 1 (native/default model vs. pure provider-passthrough) before any registry edit is made. | The implementation record cites the live page content (or the exact fallback source used if that URL 404s) and states which branch (A/B) applies, with evidence, not a guess. |
| REQ-002 | `PI_SUPPORTED_MODELS` (`executor-config.ts`) is a curated, non-empty, hard allowlist populated only from ids live-confirmed against `pi.dev/models` and/or phase 001's live pi CLI probe - never guessed, never including a router/`"auto"`-style alias. `PI_DEFAULT_MODEL` is one specific allowlisted id, not `"auto"`. `isPiModelAllowed()` is exported. | `grep -n '"auto"' executor-config.ts` shows no match inside the Pi allowlist block; a unit test asserts `isPiModelAllowed('auto') === false`. |
| REQ-003 | `buildPiLineageCommand` (`fanout-run.cjs`) and the cli-pi case of `buildSpawnSpec` (`dispatch-model.cjs`) both hard-reject (throw, before constructing any `pi` command) a model outside `PI_SUPPORTED_MODELS` - finalized in THIS phase, not deferred to a later hardening phase (the explicit anti-030/008 lesson). | Both functions throw a message naming the allowlist for an out-of-roster model; a discriminating test exists at each entry point. |
| REQ-004 | `check-prompt-quality-card-sync.sh` includes `cli-pi` in all 3 coverage points (`cli_cards[]`, `cli_skills[]`, `CLI_EXECUTOR_HUB_METADATA`), and the script exits 0 (`GUARD PASS`) after all this phase's edits land. | Running the script shows all 4 checks PASS with `cli-pi` enumerated. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | **Branch A**: if `pi.dev/models` documents a genuine Pi-native/default model with no existing `sk-prompt/prompt-models` profile, `references/models/<id>.md` is authored mirroring the existing 8-section shape, plus a `model-profiles.json` entry and an `_index.md` row; every unexposed numeric/behavioral field carries an explicit TBD marker, never a fabricated number. | `grep -n -i "TBD\|unconfirmed"` on the new profile shows >=1 hit for every field the live source did not expose; 0 fabricated numbers. |
| REQ-006 | **Branch B**: if Pi is confirmed purely provider-passthrough, this phase instead adds `cli-pi` executor rows to whichever already-profiled models Pi is confirmed to dispatch (bookkeeping only), and `_index.md`/`SKILL.md` prose states this explicitly rather than silently omitting a Pi mention. | The registry diff for this branch contains zero new top-level model entries; `_index.md` carries a one-sentence note explaining why. |
| REQ-007 | A discriminating unit-test suite proves `PI_SUPPORTED_MODELS` accepts every allowlisted id and rejects both an out-of-roster id and any router/`"auto"`-style value, at both dispatch entry points, mirroring the cli-cursor test shape (`fanout-run.vitest.ts`'s `'accepts every model in the enforced allowlist'` / `'rejects a model outside the enforced allowlist'` pattern). | `npx vitest run` on the 3 affected test files shows 0 new regressions and the new cli-pi accept/reject tests passing. |
| REQ-008 | This phase's own `references/models/<id>.md` (Branch A) or `_index.md` note (Branch B) is grepped for the phantom permission-mode wording bug ("auto, dangerous, or dangerous") before closeout, with 0 matches - mirroring 029/005 REQ-007's precedent. | A recorded `rg` run shows 0 matches. |

### P2 - Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | `model-profiles.json`'s top-level `version` and `description` fields are updated to mention the Pi contribution, mirroring how the existing `description` already calls out Composer and the Haiku stub. | The `description` field's prose includes a Pi clause; `version` bumps from `"1.6"` to a documented next value. |
| REQ-010 | Any newly-added model id needing a `FAMILY` dict entry in `check-prompt-quality-card-sync.sh` (because its first hyphen-segment doesn't already reduce to a reachable token) is identified and added, or explicitly confirmed unnecessary. | CHECK 4 passes for the new/updated `cli-pi` rows without a `not reachable by name` failure. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Open Question 1 is resolved with live evidence (not guessed) before any registry file changes.
- **SC-002**: `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`/`isPiModelAllowed()` exist in `executor-config.ts`, `PI_DEFAULT_MODEL` is never `"auto"`, and `isPiModelAllowed('auto')` returns `false`.
- **SC-003**: Both `buildPiLineageCommand` (fanout-run.cjs) and the cli-pi case of `buildSpawnSpec` (dispatch-model.cjs) throw before constructing a command for any non-allowlisted model - verified by a direct test run, not inferred from code inspection alone.
- **SC-004**: `check-prompt-quality-card-sync.sh` exits 0 (`GUARD PASS`, all 4 checks) with `cli-pi` covered in all 3 coverage points.
- **SC-005**: Whichever branch (A/B) applies, zero fabricated model specs ship - every unexposed field is an explicit TBD/unconfirmed marker.
- **SC-006**: `bash .../validate.sh 009-pi-model-registry-and-routing --strict` passes 0/0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fabricating pi.dev/models roster content - this planning session has zero live-fetched data from that page, unlike 030/005's `cursor-agent --list-models` grounding. | High (false model data shipped) | REQ-001 gates every registry edit on a live fetch; REQ-005/006's TBD discipline mirrors 029/005 and 030/005's precedent for every unexposed field. |
| Risk | Repeating 030's two-step allowlist mistake (permissive list now, fail-closed hardening 5+ phases later). | High (an unenforced `"auto"`-style default ships and lingers) | REQ-002/REQ-003 fold the hardening into this same phase; no follow-up "008-pi-model-allowlist" phase is planned or needed. |
| Dependency | Phase 002 must have already created `buildPiLineageCommand` (EXECUTOR_KINDS widened to include `cli-pi`) for this phase to harden. | High if missing | This phase's Setup task re-verifies the precondition before any edit, mirroring 029/005's T002 pattern. |
| Dependency | Phase 003 must have registered `cli-pi`'s trigger_phrases in the hub's shared `graph-metadata.json`, and created `cli-pi/assets/prompt-quality-card.md`, for CHECK 2/4 to pass. | High if missing | Re-verified read-only before this phase edits `check-prompt-quality-card-sync.sh`. |
| Dependency | Phase 001 must have live-confirmed the pi CLI's headless dispatch syntax and, ideally, enumerated at least a partial model roster (e.g. via `pi --help`/config output) as a cross-check against `pi.dev/models`. | Medium | Cited explicitly as a predecessor input; if phase 001 did not enumerate models, REQ-001's live fetch is the sole source. |
| Risk | `pi.dev/models` is unreachable or 404s at implementation time (mirrors the confirmed 404s on `/docs/latest/install` and `/docs/latest/mcp` in this packet's own research). | Medium | Fall back to whatever phase 001 could live-probe via the installed `pi` CLI itself; document the fallback source used, never silently guess. |
| Risk | CHECK 4 cross-consumer dependency - a new Pi model id's family token must actually appear in the hub's `graph-metadata.json` trigger_phrases for reachability to pass. | Medium | Re-run `check-prompt-quality-card-sync.sh` immediately after every edit, not just once at the end (mirrors 030/005's single-pass-then-verify discipline). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: The allowlist is enforced identically at both runtime dispatch entry points (`fanout-run.cjs` and `dispatch-model.cjs`) - no single-entry-point gap, mirroring 030/008's NFR-C01.
- **NFR-C02**: Whichever branch (A/B) applies, the resulting profile/bookkeeping follows the exact structural shape of the existing `references/models/*.md` profiles or `_index.md` conventions - no bespoke section layout invented for Pi.

## 8. EDGE CASES
- A caller omits `--model` on a cli-pi dispatch: defaults to `PI_DEFAULT_MODEL` (an allowlisted id), never a router/`"auto"` value.
- `pi.dev/models` lists a large, drifting roster (analogous to Cursor's 150+ hosted-frontier ids): the allowlist stays a small, deliberately curated subset, not the full live roster, mirroring both the Cursor and Devin precedents' "curated, not exhaustive" allowlist discipline.
- A future Pi release renames or retires an allowlisted id: the allowlist would then reject a genuinely-desired model; re-verify via a fresh `pi.dev/models` fetch (or live `pi` config output) and update the allowlist in a follow-up phase rather than silently loosening it.
- Pi resolves to be genuinely provider-agnostic with NO documented default (Branch B, no natural `PI_DEFAULT_MODEL` candidate): pick the most conservative already-adopted, already-profiled model Pi is confirmed to dispatch as the default, and flag the choice explicitly as a judgment call for operator override (mirrors 030/008's `composer-2.5`-as-default precedent, which was also an explicitly-flagged judgment call).
- `check-prompt-quality-card-sync.sh` runs before phase 003 ships `cli-pi/assets/prompt-quality-card.md`: CHECK 1 reports `MISSING`; this phase's Setup re-verifies the phase 003 precondition before editing, mirroring 029/005's dependency-check discipline.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 16/25 | JSON + Markdown + Bash CI gate + 2 runtime `.cjs`/`.ts` files + 3 test files - denser than 030/005 alone because this phase folds in 030/008's later hardening rather than deferring it. |
| Risk | 14/25 | Fabrication risk (no live pi.dev/models data yet) + a genuinely unresolved Branch A/B open question + the CHECK 4 cross-consumer dependency. |
| Research | 14/20 | The docs findings available to this phase name no concrete Pi model id at all (unlike Devin's `swe-1.6` or Cursor's `composer-2.5`, both named explicitly in their precedent research) - heavy live-verification dependency at implementation time. |
| **Total** | **44/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pi model spec fabricated instead of TBD | Medium | High (false model data shipped, worse than Cursor's case since even the id is unconfirmed here) | REQ-001/REQ-005/REQ-006 gate every registry edit on live evidence; TBD discipline mandatory |
| Fail-closed allowlist deferred to a later phase (repeating 030's mistake) | Low (explicitly designed against) | High (unenforced default ships) | REQ-002/REQ-003 fold hardening into this phase; no successor "allowlist" phase exists in the 11-phase plan |
| CHECK 4 reachability fails post-edit | Medium | Medium (partially-gated card) | Re-run the sync gate after every edit, not just at closeout |
| Branch A/B misjudged from thin evidence | Medium | Medium (wrong-shaped registry contribution) | REQ-001 mandates a live fetch before committing to either branch; both branches are pre-designed so neither requires an emergency re-plan |

## 11. USER STORIES
- As a dispatcher, I want a Pi model (native or provider-routed) to have a prompt-craft profile like every other model, so dispatching `cli-pi` follows the same craft guidance as any other model dispatch.
- As the operator, I want `cli-pi` to only ever dispatch a small, deliberately curated set of models with no `"auto"`/router default, so a future edit or a config drift cannot silently reopen an unrestricted roster - without needing a second hardening phase later.
- As a maintainer, I want `cli-pi`'s prompt-quality card covered by the same CI sync gate as its siblings, so it cannot silently drift from the canonical card.

## 12. OPEN QUESTIONS
- Does `pi.dev/models` document a Pi-native/house model with no existing `sk-prompt/prompt-models` profile (Branch A), or is Pi purely a provider-passthrough surface over already-profiled (plus net-new externally-hosted) models (Branch B)? **Not resolved during this planning pass** - no live fetch of that page was available to this authoring session; resolving this is REQ-001, the first task of this phase's implementation.
- What is the exact live-confirmed `PI_SUPPORTED_MODELS` roster, and which single id becomes `PI_DEFAULT_MODEL`? **Not resolved** - depends on REQ-001's live fetch and/or phase 001's live pi CLI probe; must never be guessed or seeded with a plausible-looking id.
- Does any newly-added model id need a `FAMILY` dict entry in `check-prompt-quality-card-sync.sh` for CHECK 4 reachability (the way `deepseek-v4-pro`/`kimi-k2.6`/`glm-5.1`/`minimax-m3`/`mimo-v2.5-pro` do, but `composer-2.5` does not)? **Not resolved** - depends on the actual model id chosen once Branch A/B is decided.
- Should `sk-prompt/prompt-models/SKILL.md`'s own model-executor table also gain a `cli-pi`/Pi-model mention (the same open question 029/005 raised and left to a later phase for `swe-1.6`/cli-devin)? **Deferred** - not in this phase's declared Files to Change table; recommend folding into phase 011's closeout sweep, matching how the Devin precedent deferred its analogous gap.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

## RELATED DOCUMENTS
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Spec**: `../spec.md`
- **Predecessor**: `../008-pi-hook-extension-layer/spec.md`
- **Successor**: `../010-pi-manual-testing-playbook/spec.md`
- **Structural precedent (Composer)**: `../../030-cli-cursor-creation/005-cursor-model-registry-and-routing/spec.md`
- **Structural precedent (fail-closed hardening this phase folds in early)**: `../../030-cli-cursor-creation/008-cursor-model-allowlist/spec.md`
- **Structural precedent (Planned-status registry data phase)**: `../../029-cli-devin-revival/005-devin-model-registry-and-quota/spec.md`
- **Model shape precedent**: `.opencode/skills/sk-prompt/prompt-models/references/models/composer-2.5.md`, `.opencode/skills/sk-prompt/prompt-models/references/models/deepseek-v4-pro.md`
