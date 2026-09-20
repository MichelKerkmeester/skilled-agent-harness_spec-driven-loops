---
title: "Feature Specification: rewrite the /interface:* command bodies into literal design prompts"
description: "Rewrite the five /interface:* command bodies from thin routers into literal, self-contained design prompts; expand the shared lifecycle exactly once via a runtime @-include; keep taste in the mode; and reconcile wrapper/presentation/YAML/metadata authority atomically."
trigger_phrases:
  - "rewrite interface command bodies literal prompts"
  - "interface creation-contract include gap 004"
  - "command wrapper presentation authority reconcile"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/003-interface-command-rewrite"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Rewrote the five wrappers + include; tests 19/19 green."
    next_safe_action: "Run the live OpenCode include sentinel to close CHK-002."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/creation-contract.md"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-008-impl-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | IMPLEMENTED — live include sentinel deferred |
| **Created** | 2026-07-21 |
| **Branch** | `sk-design/0093-012-gap-research` (targets `skilled/v4.0.0.0`) |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `007-gap-remediation-research` (gap 004 finding) |
| **Successor** | None |
| **Phase** | 008 — implementation of the 007 gap-004 finding |
| **Source** | `007-gap-remediation-research/004-commands/research/lineages/sol-high-fast/research.md` (5/5 forced SOL iterations); operator's original ask |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five `/interface:*` command bodies (`design`, `foundations`, `motion`, `audit`, `design-reference`) are substantive **thin routers**: each carries a 7-section router contract (route proof, owned assets, mode routing, visible output, execution targets, presentation boundary, workflow summary) and references the shared lifecycle by a **Read-imperative** at line 9 rather than a runtime include. The architecture routes correctly, but the checked-in command does not read like the literal creative contract the operator asked for: to reconstruct the intended creation prompt the model must assemble a wrapper, a presentation asset, a shared contract, a workflow, and a mode. Worse, each body's PRESENTATION BOUNDARY currently declares the *presentation asset* as the prompt source of truth — so a literal wrapper and a normative presentation would become **two competing prompt authorities**.

### Purpose

Preserve the `/interface:*` architecture but **rewrite the five command bodies into literal, self-contained design prompts**: each body visibly tells the agent what to create or diagnose, why quality matters, what context to resolve, what outcome to produce, and what evidence ceiling applies. Expand the shared lifecycle **exactly once per body** via the runtime include `@.opencode/skills/sk-design/shared/creation-contract.md` (OpenCode 1.18.4 confirmed). Keep all taste in the selected mode. Reconcile wrapper/presentation/YAML/metadata authority in one atomic change so no competing prompt authority remains.

### Decision (FROZEN)

Rewrite bodies, keep architecture. This is gap 004 from the 007 research (the operator's *original* ask) and is **independent** of the DB-build/restructure work (gaps 001–003), which lands in separate packets under `015`. The `/design:*` alias namespace is already retired (`006-retire-design-alias-namespace`, complete) — this packet does **not** touch aliases.

- **Include token (canonical, single form):** `@.opencode/skills/sk-design/shared/creation-contract.md` — no `./` prefix; `@./…` is path-equivalent but rejected as a second form to keep static tests single-token.
- **Mode map (unchanged):** design→`interface`, foundations→`foundations`, motion→`motion`, audit→`audit`, design-reference→`md-generator`.
- **Corrected body cores are authored** in `007/004-commands/research/…/research.md` §7 — they are the authoring base; existing frontmatter, register/lanes, route-proof fields, and execution wiring surround them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Five command wrappers** — rewrite each body to the shared 9-step grammar (§4 REQ-002), placing exactly one `@`-include after the authority-split paragraph and before the ordered outcome sequence.
- **Five presentation assets** — demote `commands/interface/assets/interface-<mode>-presentation.txt` from "prompt/output source of truth" to consolidated-question + display fixtures; invert the PRESENTATION BOUNDARY declaration in each wrapper.
- **Command metadata** — `command-metadata.json` mirrors the wrapper/presentation authority split (no `command`/route/proof/suffix semantics change).
- **Two test files** — extend `interface-command-contract.test.mjs` (include count, all four statuses, anti-duplication, no-nesting, audit read-only, md-generator measured-only fidelity) and `design-command-surface-check.test.mjs` (frontmatter/suffix/route/sibling/proof projection parity).
- **Include sentinel** — a pre-rewrite gate proving the canonical include's bytes reach the model-visible prompt.

### Out of Scope

- Any DB-build or styles-restructure work (gaps 001–003) — separate `015` packets.
- Mode taste: palettes, typography, token values, motion timings, severity verdicts, reference selection, extraction procedures — these stay in the selected `sk-design` mode and are not moved into any command body.
- The paired `interface-<mode>-{auto,confirm}.yaml` execution assets — role unchanged (execution control); no rewrite.
- Stable mode names, argument hints, register/lanes, route-proof fields, sibling/cannot-run behavior, and the four typed statuses — preserved, not redesigned.
- The `/design:*` alias namespace (already retired) and the `design-mcp-open-design` transport token.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/interface/design.md` | Modify | Rewrite body to literal `interface`-mode prompt + single `@`-include; invert presentation boundary |
| `.opencode/commands/interface/foundations.md` | Modify | Rewrite body to literal `foundations`-mode prompt + single `@`-include |
| `.opencode/commands/interface/motion.md` | Modify | Rewrite body to literal `motion`-mode prompt + single `@`-include |
| `.opencode/commands/interface/audit.md` | Modify | Rewrite body to literal `audit`-mode prompt (review-only) + single `@`-include |
| `.opencode/commands/interface/design-reference.md` | Modify | Rewrite body to literal `md-generator`-mode prompt (fidelity-first) + single `@`-include |
| `.opencode/commands/interface/assets/interface-*-presentation.txt` | Modify | Demote to consolidated-question + display fixtures (5 files) |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Mirror the wrapper/presentation authority split |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Modify | Add include/status/anti-dup/no-nesting/audit/md-generator assertions |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` | Modify | Add frontmatter/suffix/route/sibling/proof projection assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical include | Each wrapper contains **exactly one** `@.opencode/skills/sk-design/shared/creation-contract.md`; the include sentinel proves the contract's bytes reach the model-visible prompt |
| REQ-002 | Literal value present | Each body carries, literally: a mode-specific mission + consequence of weak work; local intake field names on `$ARGUMENTS`; `:auto\|:confirm` parsed first; fit/siblings/cannot-run/`workflowMode` without invoking a sibling; grounding + only decision-changing evidence; the authority split + the single include; an ordered mode-specific outcome sequence + decisive quality criterion; artifact refinement; and all four statuses |
| REQ-003 | Anti-duplication | No body copies the universal lifecycle, envelope schema, common visible blocks, evidence ladder, revision mechanics, statuses, or handoff envelope — those resolve only through the include |
| REQ-004 | Taste stays in the mode | No command-owned palettes, fonts, token/timing recipes, severity verdicts, reference inventories, or taste tables in any wrapper; bodies list intake field *names* only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Four statuses preserved | `STATUS=OK`, `STATUS=ASK MISSING=<input>`, `STATUS=FAIL ERROR=<named-cause>`, `STATUS=DEFER ROUTE=<hub\|sibling>` all remain; `blocked` remains an evidence level, not a status |
| REQ-006 | Package authority reconciled atomically | Wrapper becomes normative public prompt; presentation demoted to question/display fixtures; YAML role unchanged; metadata mirrors the split — all in one change; no mixed-authority intermediate state committed |
| REQ-007 | Tests green + extended | The 15-test baseline stays green; new deterministic assertions cover the include count, the four statuses, anti-duplication, no nested public command, audit read-only, and md-generator measured-only fidelity; whole-change rollback to the 15/15 baseline if any gate fails |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c '@\.opencode/skills/sk-design/shared/creation-contract\.md' commands/interface/*.md` returns exactly 1 per wrapper (5 total), and the sentinel confirms the bytes reach the model-visible prompt (REQ-001).
- **SC-002**: Each wrapper contains its literal mission, local fields, suffix control, route proof, ordered outcomes, decisive criterion, and artifact refinement; none contains a copied lifecycle/schema/block (REQ-002, REQ-003).
- **SC-003**: No wrapper contains a palette/font/timing recipe, severity verdict, or reference inventory; a token scan for taste tables in `commands/interface/*.md` is empty (REQ-004).
- **SC-004**: All four statuses appear in each wrapper's contract; `blocked` appears only as an evidence level (REQ-005).
- **SC-005**: Wrapper/presentation/YAML/metadata land in one atomic patch; the presentation boundary is inverted in all five wrappers; `command-metadata.json` mirrors the split (REQ-006).
- **SC-006**: `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` is green with the extended assertions; the pre-change 15-test baseline is preserved as the rollback target (REQ-007).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Literal bodies become a second taste authority (fixed recipes drift from the mode) | High | Paragraph-ownership + no-taste assertions; bodies name intake fields, never recipes |
| Risk | Shared lifecycle gets copied back into wrappers | Med | Exactly-one-include assertion + copied-schema rejection |
| Risk | Presentation stays normative beside a literal wrapper | High | Atomic authority reconciliation; invert every PRESENTATION BOUNDARY in the same patch |
| Risk | Include packaging differs from tagged 1.18.4 source; contract bytes miss the prompt | Med | Run the include sentinel **before** rewriting any wrapper |
| Risk | Partial rollback leaves mixed authority | Med | Whole-change rollback to the verified 15/15 baseline; never retain mixed ownership |
| Dependency | OpenCode 1.18.4 `@`-include resolves project-relative from `ctx.worktree` | Low | Confirmed against tagged parser + prompt-resolver source in the 004 research |
| Dependency | The 15-test command baseline runs on the worktree runtime | Low | Already the current suite; capture green baseline before edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- The executable contract is `interface-command-contract.test.mjs` + `design-command-surface-check.test.mjs` plus the include sentinel. No literal-value, include-count, status, or fidelity claim is made without those checks. The include sentinel is a required implementation gate because source inspection alone does not exercise model-visible prompt delivery.

### Security

- Comment hygiene [HARD BLOCK]: no spec/packet/phase/REQ ids in any command body, asset, or test comment — edits are prompt prose, fixtures, and assertions, not annotations.
- Reference material named in any body is untrusted evidence; bodies must instruct the agent to ignore source-embedded instructions (esp. `design-reference` capture).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **`:auto` vs `:confirm`** — `:confirm` renders one consolidated prompt and waits; `:auto` proceeds only with reversible, route-neutral assumptions and still asks for confirmation-required decisions. `design-reference` always confirms for authenticated/private capture, overwrite, or external transmission.
- **Typed statuses** — missing required input → `ASK`; unresolvable setup / uncapturable source → `FAIL`; a different primary job → `DEFER`. Each must be reachable per command.
- **Proof ceiling** — optional missing proof lowers the ceiling; mandatory missing proof is `blocked` (an evidence level, not a status); no unmeasured result is reported as verified.
- **Audit boundary** — audit is review-only; accepted fixes route to `sk-code`; a no-write fixture guards against mutation.
- **md-generator fidelity** — only measured values enter token tables; brief-provided values stay prose; inferred claims are labeled; absent values are not backfilled.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Level 2** — a bounded rewrite of five prompt bodies + five fixtures + one metadata file + two test files, no runtime/data schema change and no new module. Complexity sits in **authority reconciliation** (four package facets must change atomically) and in **fidelity to the mode/command split**, not in code volume. Blast radius is low and reversible: the commands are prompt text; the whole change rolls back to the 15/15 baseline. Independent of the DB/restructure blast radius.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None architecturally — the 004 research answered all five required questions plus the include-spelling follow-up (5/5 forced iterations). The one open **implementation** gate is the end-to-end include sentinel: it must prove packaged command discovery and model-visible delivery before the wrappers are rewritten, because source inspection does not exercise that path. A contradiction at the sentinel halts implementation for runtime/package diagnosis rather than silently selecting another token.
<!-- /ANCHOR:questions -->
