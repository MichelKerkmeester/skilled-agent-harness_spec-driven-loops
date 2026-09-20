---
title: "Feature Specification: Grok 4.6 Support for cli-cursor & cli-devin"
description: "Add Grok 4.6 alongside the still-supported Grok 4.5 in cli-cursor and cli-devin's enforced deep-loop rosters, including the new xhigh reasoning tier, sort every affected roster alphabetically, and update every skill doc and cross-reference that named Grok."
trigger_phrases:
  - "grok 4.6 support"
  - "grok 4.5 and 4.6"
  - "cursor grok roster"
  - "devin grok roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/036-grok-4.6-support"
    last_updated_at: "2026-08-12T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Corrected spec after operator follow-up: keep Grok 4.5 alongside Grok 4.6 (not a swap), and sort roster tables alphabetically"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-036-grok-4.6-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Adopt only the 4.5-parity tiers (low/medium/high) or the full 4.6 family including the new xhigh tier? RESOLVED: full adoption, operator-selected, with live verification of the exact levels/modes before committing."
      - "Should Grok 4.5 be retired once 4.6 lands, or kept alongside it? RESOLVED (operator follow-up): kept alongside 4.6 — both versions are live on both platforms and both stay in the enforced allowlist."
      - "Should roster tables and arrays be grouped by family or sorted alphabetically? RESOLVED (operator follow-up): alphabetically, across every touched table, list, and array."
---
# Feature Specification: Grok 4.6 Support for cli-cursor & cli-devin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

xAI shipped Grok 4.6 with a new `xhigh` reasoning tier that Grok 4.5 never had, and neither Cursor nor Devin has retired 4.5 — both versions are live on both platforms today. This packet adds the full Grok 4.6 family to cli-cursor's (10 → 18 ids) and cli-devin's (curated Grok family 3 → 7 uids) enforced allowlists alongside the existing Grok 4.5 entries, sorts every touched roster table and array alphabetically instead of grouping by family, and rewrites every skill doc, cross-reference, and test that named Grok to match — all after live-dispatch-verifying every new id through the real `cursor-agent` and `devin` binaries.

**Key Decisions**: Full 4.6 adoption including the new `xhigh` tier (ADR-001); keep Grok 4.5 in both allowlists rather than retiring it (ADR-002); sort roster tables and arrays alphabetically (ADR-002).

**Critical Dependencies**: `cursor-agent` and `devin` CLIs installed and authenticated on the operator's machine for live verification.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-cursor's enforced `CURSOR_SUPPORTED_MODELS` allowlist and cli-devin's enforced `DEVIN_SUPPORTED_MODELS` allowlist both curated only Grok 4.5 (6 ids on Cursor, 3 uids on Devin). Live checks against both CLIs (`cursor-agent --list-models`, `devin models list`) on 2026-08-12 showed both platforms now also expose a Grok 4.6 family — with a fourth `xhigh` reasoning tier that 4.5 never had — while still fully supporting 4.5. Every skill doc that named a Grok id — SKILL.md, README.md, five references files, two asset files, one manual-testing playbook, plus three cross-reference docs in sibling skills — needed updating to cover the new version, and the two runtime enforcement points (`executor-config.ts`, `fanout-run.cjs`) plus their vitest coverage needed the new ids added without dropping the old ones.

### Purpose
Add Grok 4.6 to both enforced allowlists alongside the existing Grok 4.5 entries, sort every affected roster table and array alphabetically, and update every doc/test that references either version — confirming each new id is actually callable through the live CLI before it lands in the allowlist, not a text-only addition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` — `CURSOR_SUPPORTED_MODELS` (10 → 18 ids: adds 8 Grok 4.6 ids, keeps 6 Grok 4.5 ids) and `DEVIN_SUPPORTED_MODELS` (curated Grok family 3 → 7 uids: adds 4 Grok 4.6 uids, keeps 3 Grok 4.5 uids), both resorted alphabetically, plus their doc comments.
- `fanout-run.cjs` — `CURSOR_ALLOWED_MODELS` and `DEVIN_ALLOWED_MODELS` mirrors, kept byte-synced with `executor-config.ts`, resorted alphabetically.
- `executor-config.vitest.ts` / `fanout-run.vitest.ts` — allowlist fixtures updated to cover both Grok versions.
- cli-cursor: `SKILL.md`, `README.md`, `references/{cli-reference,integration-patterns,providers-and-models,agent-delegation}.md`, `assets/{prompt-templates,prompt-quality-card}.md`, `manual-testing-playbook/manual-testing-playbook.md`.
- cli-devin: `SKILL.md`, `README.md`, `references/{cli-reference,providers-and-models}.md`.
- Cross-reference docs: `cli-pi/references/pi-tools.md`, `shared/references/smart-routing.md`, `sk-prompt/sk-prompt-models/references/models/_index.md`.
- New changelog entries in `cli-cursor/changelog/` and `cli-devin/changelog/` (additive — existing pre-v1.3.0.0 entries are historical and untouched; the v1.3.0.0.md entries authored during this same session were revised in place once the scope corrected, since they are not yet a shipped historical release).
- Live dispatch verification of every new AND every retained model id through the real `cursor-agent` and `devin` binaries, including the bracket-syntax rejection re-test.
- Alphabetical sorting of every roster table, enumerated model list, and allowlist array touched by this packet.

### Out of Scope
- Historical spec-folder evidence and research artifacts under `specs/` that recorded a past run against Grok 4.5 (e.g. `specs/ai-systems/027-.../evidence/cursor-grok-4.5-high-fast/`, `specs/sk-doc/019-.../research/lineages/grok-4-5-high/`) — these are records of what actually ran; rewriting them would misrepresent history, not fix it.
- `.opencode/logs/cli-dispatch-audit.log` — an append-only audit log of past dispatches; out of scope for the same reason.
- `sk-doc/sk-create-benchmark/SKILL.md`'s example folder name (`...--cursor-grok-4-5-high-fast/`) — illustrative naming-convention example, not a functional roster claim.
- Reordering roster tables/lists outside `cli-cursor`, `cli-devin`, and the three cross-reference docs this packet already touches (e.g. GLM/SWE/DeepSeek-only tables elsewhere in the repo) — the alphabetization instruction is scoped to the files this packet's Grok work already modifies.
- Any DeepSeek/SWE/GLM roster drift noticed incidentally during live verification (DeepSeek V4 Pro's tier uids changed shape upstream) — unrelated to Grok, not touched here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Add Grok 4.6 ids alongside Grok 4.5 in both allowlists, sorted alphabetically; update doc comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror the same addition and resort in both allowlist mirrors |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Update the 18-id Cursor allowlist assertion |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Update allowed model fixtures for both adapters to cover both Grok versions |
| `.opencode/skills/cli-external-orchestration/cli-cursor/*` (9 files) | Modify | Model tables/examples cover both Grok versions, allowlist counts updated, rosters alphabetized |
| `.opencode/skills/cli-external-orchestration/cli-devin/*` (4 files) | Modify | Model tables/examples cover both Grok versions, family description alphabetized |
| `.opencode/skills/cli-external-orchestration/{cli-pi,shared}/references/*.md`, `sk-prompt/sk-prompt-models/references/models/_index.md` | Modify | Cross-reference example ids and routing keywords cover both Grok versions |
| `.opencode/skills/cli-external-orchestration/{cli-cursor,cli-devin}/changelog/v1.3.0.0.md` | Create | New changelog entries documenting the addition (revised in place after the scope correction, since not yet a shipped historical release) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every new Grok 4.6 id is live-dispatch-verified before landing in an allowlist | `cursor-agent -p --model cursor-grok-4.6-{high,xhigh}` and `devin -p --model grok-4-6-{high,xhigh}` each return a real model response at exit 0 |
| REQ-002 | Grok 4.5 stays fully allowlisted and independently re-verified, not just left untouched by accident | `cursor-grok-4.5-high` and `grok-4-5-high` each dispatch-tested live and return a real model response at exit 0 |
| REQ-003 | `executor-config.ts` and `fanout-run.cjs` allowlists stay in sync | Both files list identical Grok 4.5 + 4.6 ids/uids, sorted alphabetically; guard tests assert both |
| REQ-004 | Runtime stays green | Targeted `npm test` (188 tests, the files this packet touched) and `npm run typecheck` pass clean after the addition |
| REQ-005 | No live-surface doc undercounts the allowlist or implies Grok 4.5 was removed | Repo-wide grep for `12-id\|exactly 12\|retired from` under `.opencode/skills/` returns nothing live-surface; every allowlist-count claim reads 18 (Cursor) or covers both Grok families (Devin) |
| REQ-006 | Every roster table, enumerated model list, and allowlist array touched by this packet is sorted alphabetically | Manual inspection of each touched table/array confirms ascending alphabetical order by id (or by family name, then id) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The parameterized bracket-syntax rejection still holds for the new model | `cursor-agent --model 'cursor-grok-4.6[effort=high]'` returns `Cannot use this model`, exit 1 |
| REQ-008 | Feature catalog and every manual-testing playbook checked for stale Grok references | `feature-catalog.md` confirmed clean; only `cli-cursor/manual-testing-playbook.md` had a mention, and it was updated |
| REQ-009 | Changelog entries accurately describe the final, corrected scope | `v1.3.0.0.md` in both skills describes an addition (both versions live), not a swap; historical pre-v1.3.0.0 entries untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-loop fan-out dispatch of any `cursor-grok-4.6-*` or `grok-4-6-*` id is accepted and runs.
- **SC-002**: A deep-loop fan-out dispatch of any `cursor-grok-4.5-*` or `grok-4-5-*` id is still accepted and runs — Grok 4.5 was never removed from the allowlist.
- **SC-003**: Targeted `npm test` and `npm run typecheck` in `system-deep-loop/runtime` pass with zero failures on the files this packet touched.
- **SC-004**: Every live-surface skill doc that names Grok now covers both 4.5 and 4.6, with allowlist counts updated to match (10→18 for Cursor, curated Grok family 3→7 uids for Devin).
- **SC-005**: Every roster table, enumerated model list, and allowlist array touched by this packet reads in alphabetical order.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Documenting an id that doesn't actually resolve on the live CLI | Silent dispatch failure for a caller who trusts the doc | Every id (new AND retained) live-dispatch-tested before being written into any allowlist or doc |
| Risk | Mirror drift between `executor-config.ts` and `fanout-run.cjs` | Fan-out rejects an allowlisted model, or accepts an unlisted one | Both files edited together; guard tests assert the exact id sets |
| Risk | Assuming Cursor/Devin "retired" 4.5 upstream (they did not) | Doc claims a false vendor-side deprecation | Explicitly verified and documented that 4.5 still appears in both live rosters; this skill's allowlist never dropped it |
| Risk | Initial implementation mistakenly retired 4.5 from the enforced allowlists | Callers who relied on `cursor-grok-4.5-*`/`grok-4-5-*` would have hit a dispatch failure | Caught by operator follow-up before commit; corrected in this same session — 4.5 restored to both allowlists and independently re-verified |
| Risk | Scope-creeping into unrelated roster drift found during verification (DeepSeek tier-uid shape change) | Unbounded diff, out of the user's ask | Logged as a note in this spec, left untouched |
| Dependency | `cursor-agent` and `devin` CLIs installed and authenticated on the operator's machine | Cannot live-verify | Confirmed installed (`cursor-agent 2026.08.11-e8db854`, `devin 3000.4.16`) and authenticated; all test calls returned real output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `executor-config.ts`'s allowlists and `fanout-run.cjs`'s mirrors MUST list identical ids (fail-closed sync invariant, matching the existing convention documented inline in both files).
- **NFR-M02**: Every doc comment naming a curated Grok family MUST carry the live-verification date and CLI version, matching the pre-existing convention in `executor-config.ts`.
- **NFR-M03**: Roster tables, enumerated model lists, and allowlist arrays touched by this packet MUST be sorted alphabetically rather than grouped by release order, per the operator's explicit instruction.

### Reliability
- **NFR-R01**: A dispatch of a model outside the enforced allowlist (any version) MUST still fail closed with the enforced-allowlist error, not a silent fallback.
<!-- /ANCHOR:nfr -->

---

## 8. EDGE CASES

### Roster shape
- **4.6 has an extra tier.** Cursor's 4.5 family is 6 ids (low/medium/high × fast); 4.6 is 8 (adds xhigh × fast). Devin's 4.5 family is 3 uids; 4.6 is 4 (adds xhigh). This was never a 1:1 rename — resolved via ADR-001.
- **Neither vendor retired 4.5.** Both `cursor-agent --list-models` and `devin models list` list the 4.5 family alongside 4.6 on 2026-08-12. This skill's curated allowlist keeps both — resolved via ADR-002.
- **Alphabetical vs. family-grouped ordering.** The original allowlist arrays and several doc tables grouped ids by family (Composer, then Grok, then GLM) with inline per-family comments. Alphabetizing interleaves families, so the family-level explanatory comments were consolidated into the top-level doc comment above each array rather than kept as inline per-group comments that would no longer align with contiguous blocks.

### Historical records
- **Do not rewrite past evidence.** Dozens of historical spec-folder artifacts (deep-research lineages, manual-testing-playbook evidence, prior spec docs) recorded runs that actually used Grok 4.5 at the time. These were inventoried and deliberately left untouched — Section 3 "Out of Scope" names the exact directories.

---

## 9. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | New id documented but not actually callable | M | L | Live dispatch test per id before landing in allowlist |
| R-002 | Allowlist mirrors drift | M | L | Edited together, asserted by vitest |
| R-003 | Vendor-retirement claim is factually wrong | L | M | Corrected in providers-and-models.md and changelog prose after re-checking the live roster |
| R-004 | Historical spec docs rewritten, misrepresenting past runs | M | L | Scoped to `.opencode/skills/` only; `specs/` left untouched except this packet |
| R-005 | First implementation pass silently retired Grok 4.5 instead of adding 4.6 alongside it | H | (materialized, then corrected) | Operator caught it via direct follow-up; every allowlist, doc, test, and changelog reverted to an additive change in the same session |

---

## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Files: ~20 doc/code/test files across 2 primary skills + 3 cross-reference docs, each touched twice (initial pass + correction pass) |
| Risk | 16/25 | Safety-critical enforced allowlist (fail-closed dispatch gate), no auth/breaking-API risk, but one real correctness miss (premature retirement) caught before commit |
| Research | 14/20 | Required live CLI verification of both platforms' full model roster before any edit, twice (4.6 addition, then 4.5 re-verification) |
| Multi-Agent | 0/15 | Single-session, no sub-agent fan-out |
| Coordination | 6/15 | Two skills' docs must stay mutually consistent with the shared runtime allowlists, across two passes |
| **Total** | **55/100** | **Level 3** |

---

## 11. USER STORIES

### US-001: Operator dispatches Grok 4.6 through cli-cursor (Priority: P0)

**As an** operator, **I want** to dispatch `cursor-grok-4.6-high` through the deep-loop fan-out runtime, **so that** I get Grok 4.6's reasoning without hand-rolling a bypass of the enforced allowlist.

**Acceptance Criteria**:
1. Given the updated `CURSOR_SUPPORTED_MODELS`, When a lineage specifies `cursor-grok-4.6-high`, Then `buildCursorLineageCommand` accepts it and constructs a valid `cursor-agent` invocation.

### US-002: Operator keeps dispatching Grok 4.5 through cli-cursor (Priority: P0)

**As an** operator with existing workflows pinned to `cursor-grok-4.5-high`, **I want** those dispatches to keep working after this packet lands, **so that** adding 4.6 support never breaks a workflow that named 4.5 explicitly.

**Acceptance Criteria**:
1. Given the updated `CURSOR_SUPPORTED_MODELS`, When a lineage specifies `cursor-grok-4.5-high`, Then dispatch is accepted exactly as it was before this packet.

### US-003: Operator reads cli-devin docs and finds both Grok versions (Priority: P0)

**As an** operator reading `cli-devin/SKILL.md` or `README.md`, **I want** the docs to name both Grok versions as available, **so that** I know 4.5 workflows still work and 4.6 is available for the new xhigh tier.

**Acceptance Criteria**:
1. Given cli-devin's live-surface docs, When I look for the curated family list, Then it names both Grok 4.5 and Grok 4.6, not just one.

---

## 12. OPEN QUESTIONS

- Adopt only the 4.5-parity tiers (low/medium/high, matching the old tier count) or the full 4.6 family including the new xhigh tier? **RESOLVED: full adoption — operator chose option 2 ("check actual available levels and modes"), which the live-verification pass confirmed as exactly 8 Cursor ids and 4 Devin uids (see ADR-001).**
- Should Grok 4.5 be retired now that 4.6 is available, or kept alongside it? **RESOLVED (operator follow-up, after the first implementation pass): kept alongside 4.6. Both versions are live and dispatchable on both platforms today, and the operator explicitly asked to make sure 4.5 stays in the roster (see ADR-002).**
- Should roster tables and allowlist arrays be grouped by family (as originally structured) or sorted alphabetically? **RESOLVED (operator follow-up): alphabetically, across every table/list/array this packet touches (see ADR-002).**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Prior art**: `033-deepseek-v4-flash-pi-roster`, `034-opencode-go-flash-qwen-roster`, `032-per-mode-provider-model-reference`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive summary, risk matrix, user stories
- Full architecture documentation
-->
