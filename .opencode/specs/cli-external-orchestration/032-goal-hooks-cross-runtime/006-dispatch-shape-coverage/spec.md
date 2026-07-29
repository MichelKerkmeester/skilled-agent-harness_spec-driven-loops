---
title: "Feature Specification: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Extend the shared DISPATCH_SHAPES registry in dispatch-audit.mjs with real devin/cursor-agent/pi dispatch-command regexes, fold Codex's locally-bolted-on shape into the same registry, and resolve the severity:error to block|warn mapping gap in evaluate() so the three CLIs' already-declared hard_rules become reachable."
trigger_phrases:
  - "dispatch shape coverage"
  - "devin cursor pi dispatch regex"
  - "codex dispatch shape fold-in"
  - "severity mapping block warn"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-29T05:31:42Z"
    last_updated_by: "claude"
    recent_action: "Shipped 6-shape DISPATCH_SHAPES, codex fold-in, error-to-block severity mapping"
    next_safe_action: "None — phase complete; missing CHECKS functions are a follow-up phase"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether implementing the three missing CHECKS entries (command-v-<cli>-required, <cli>-self-invocation-guard, deep-loop-runtime-delegation) belongs in a follow-up phase remains unresolved; deliberately out of scope here (see REQ-006/REQ-007)."
    answered_questions:
      - "This phase is functionally independent of phases 001-005 (goal-hook port); it is a separate dispatch-shape fix, ordered 006 for packet narrative only."
      - "Fold Codex's local CODEX_EXEC_SHAPE into the shared DISPATCH_SHAPES registry rather than leaving it duplicated locally."
      - "Current real path confirmed by direct file read: .opencode/hooks/dispatch/lib/dispatch-audit.mjs (post-relocation; not any older skill-nested path)."
      - "severity: error resolved to map to 'block' (alongside the pre-existing 'block'), implemented as an explicit branch in evaluate(), not an implicit fallthrough."
      - "dispatch-audit-posttooluse.mjs (codex) was found mid-pass with its own local CODEX_EXEC_SHAPE duplicate; fixed same session to read DISPATCH_SHAPES directly. rg -n \"CODEX_EXEC_SHAPE\" repo-wide now 0 hits; REQ-002/SC-002 fully met."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet's operator choice) |
| **Authority** | `cli-external-orchestration` (dispatch hook concern lives at `.opencode/hooks/dispatch/`, shared across all `cli-*` skills) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `005-pi-goal-hooks` |
| **Successor** | `007-opencode-plugin-symlinks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`cli-devin`, `cli-cursor`, and `cli-pi` already declare `hard_rules:` in their SKILL.md frontmatter (availability check, self-invocation guard, deep-loop-runtime delegation — all `severity: error`), but the shared dispatch-shape registry (`DISPATCH_SHAPES` in `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`) only recognizes `opencode run` and `claude -p` command shapes. A `devin -p`, `cursor-agent … -p`, or `pi -p` dispatch is never matched, so the preflight lint and audit-trail adapters never look up or evaluate those skills' hard rules at all — the rules are unreachable dead weight. Separately, Codex's own dispatch shape (`codex exec … -p`) is NOT in the shared registry either; it is bolted on locally, only inside one adapter (`.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`'s `CODEX_EXEC_SHAPE` constant), so any other adapter reading `DISPATCH_SHAPES` directly (e.g. the Pi preflight-lint adapter, confirmed reading `audit.DISPATCH_SHAPES` directly) still cannot recognize a Codex dispatch.

### Purpose

Make `DISPATCH_SHAPES` the single, complete source of truth for every `cli-*` dispatch shape in the repo — devin, cursor, pi, and codex — and resolve the one real contract ambiguity blocking full activation: `evaluate()` in `dispatch-rule-checks.mjs` currently maps a rule's `severity` field to only two outcomes (`'block'` when `severity === 'block'`, `'warn'` for everything else, confirmed by direct read of `evaluate()`'s source), so a `severity: error` hard rule — the only severity value all four cli-* skills currently declare — silently falls into the `'warn'` bucket rather than `'block'` today. This phase makes that mapping an explicit, tested decision instead of an implicit fallthrough.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add three new dispatch-shape entries to `DISPATCH_SHAPES` in `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, matching real dispatch command forms: `devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print`.
- Fold Codex's `CODEX_EXEC_SHAPE` (`\bcodex\s+exec\b[^\n]*\s-p\b`, skill `cli-codex`) into the shared `DISPATCH_SHAPES` array, and remove the local `CODEX_EXEC_SHAPE` constant plus the `DISPATCH_SKILLS = [...DISPATCH_SHAPES, CODEX_EXEC_SHAPE]` composition from `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`, so there is exactly one definition of the Codex shape in the repo.
- Resolve and implement the `severity: error` → `block`/`warn` mapping in `evaluate()` (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`), verified against the function's actual current behavior, not assumed — record the decision and cover it with a test.
- Add regression tests per new shape in the dispatch-family test suites (`dispatch-rule-checks.test.mjs`, `dispatch-audit.test.mjs`, and any adapter-level test that asserts on `DISPATCH_SHAPES`/`DISPATCH_SKILLS` composition), and re-run every dispatch-family test suite after the change — not only the new tests — to confirm the pre-existing `opencode run`/`claude -p` shapes still match correctly.

### Out of Scope

- Implementing the three CHECKS functions the devin/cursor/pi/codex hard_rules actually reference (`command-v-<cli>-required`, `<cli>-self-invocation-guard`, `deep-loop-runtime-delegation`) — confirmed absent from `CHECKS` in `dispatch-rule-checks.mjs` today via direct grep. Shape-matching alone makes `readHardRules()` find these rules and pass them into `evaluate()`, but `evaluate()`'s `if (!fn) continue` guard means an unimplemented check is silently skipped, not violated. Whether to implement these three checks is recorded as an open question for a follow-up phase, not built here.
- Any change to the goal-hook port (phases 001-005) — this phase touches an unrelated hook concern (`dispatch/`, not `goal/`) and has no functional dependency on them.
- Any change to the `opencode run`/`claude -p` shape regexes themselves, or to the existing `stdin-redirect-required`/`no-bare-agent-general`/`command-flag-for-slash-prompt`/`share-requires-confirmation`/`non-interactive-permission-mode-risk` checks.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add real dispatch-shape regexes for devin, cursor, and pi to the shared `DISPATCH_SHAPES` registry. | `DISPATCH_SHAPES` gains three entries whose `test` regexes match real command strings for `devin -p "..."` / `devin --print "..."`, `cursor-agent ... -p "..."` / `cursor-agent ... --print "..."`, and `pi -p "..."` / `pi --print "..."`, each with `skill` and `packetPath` matching the existing entry shape (e.g. `cli-devin`, `cli-external-orchestration/cli-devin`). |
| REQ-002 | Fold Codex's shape into the shared registry with zero remaining local duplicate. | **MET.** `CODEX_EXEC_SHAPE` and the `DISPATCH_SKILLS`/`SHAPES` compositions are removed from both `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` (PreToolUse) and `.opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` (PostToolUse); both adapters read `DISPATCH_SHAPES` directly. `rg -n "CODEX_EXEC_SHAPE"` returns 0 hits repo-wide, confirmed this pass. |
| REQ-003 | Resolve the `severity: error` mapping in `evaluate()`, verified against its real source. | `evaluate()`'s severity-mapping logic is read and quoted verbatim in `plan.md`/`implementation-summary.md` before any code change; the chosen mapping (`error` → `block`, or `error` → `warn`, or a third explicit branch) is implemented as a deliberate branch, not an implicit `=== 'block' ? 'block' : 'warn'` fallthrough for an unlisted value; a new test asserts the exact resulting `severity` field for a rule declaring `severity: error`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add regression tests per new shape. | `dispatch-rule-checks.test.mjs` and/or `dispatch-audit.test.mjs` gain at least one passing/one non-matching test case per new shape (devin, cursor, pi, codex-in-shared-registry). |
| REQ-005 | Re-run every dispatch-family suite, not only the new tests, after the change. | `dispatch-rule-checks.test.mjs`, `dispatch-audit.test.mjs`, and any Pi/Claude/Devin/Codex adapter test referencing `DISPATCH_SHAPES` all pass post-change, with the pre-existing `opencode run`/`claude -p` cases still passing (no regression). |
| REQ-006 | Disclose the CHECKS-function gap honestly rather than implying full activation. | `spec.md`/`implementation-summary.md` state plainly that shape-matching makes the three CLIs' hard_rules reachable by `evaluate()`, but that `evaluate()` still skips them (via `if (!fn) continue`) until the three referenced check IDs exist in `CHECKS`, since no implementation of `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` exists as of this phase (confirmed via `rg`). |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Note follow-up scope for the missing CHECKS entries. | An explicit "not built here" note in `implementation-summary.md` Known Limitations, naming the exact three check IDs and their owning skills, so a later phase can pick this up without re-discovering the gap. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three new shapes (`devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print`) match real dispatch command strings for their respective CLIs and do not false-positive on unrelated commands containing the bare binary name without the flag.
- **SC-002**: `CODEX_EXEC_SHAPE` exists in exactly one place in the repo (the shared `DISPATCH_SHAPES` registry); zero remaining local duplicate in the Codex adapter. **MET** — both the PreToolUse `dispatch-preflight-lint.mjs` and PostToolUse `dispatch-audit-posttooluse.mjs` adapters read `DISPATCH_SHAPES` directly; `rg -n "CODEX_EXEC_SHAPE"` returns 0 hits repo-wide.
- **SC-003**: The `severity: error` → `block`/`warn` mapping decision is implemented as an explicit branch and covered by a passing regression test.
- **SC-004**: The full dispatch-family test suite (all files exercising `DISPATCH_SHAPES`, `matchDispatchShape`, `evaluate`, `readHardRules`) is green post-change, with the pre-existing `opencode run`/`claude -p` coverage unregressed.

### Acceptance Scenarios

- **Given** the composed command `devin -p "review this diff"`, **When** `matchDispatchShape()` runs, **Then** it returns `{ skill: 'cli-devin' }`.
- **Given** the composed command `cursor-agent --model composer-2.5 -p "..."`, **When** `matchDispatchShape()` runs, **Then** it returns `{ skill: 'cli-cursor' }`.
- **Given** the composed command `pi --print "..."`, **When** `matchDispatchShape()` runs, **Then** it returns `{ skill: 'cli-pi' }`.
- **Given** `codex exec --model gpt-5.6 -p "..."`, **When** `matchDispatchShape()` runs against the now-shared registry (not a locally-composed `DISPATCH_SKILLS` array), **Then** it returns `{ skill: 'cli-codex' }` from `DISPATCH_SHAPES` alone.
- **Given** a hard rule with `severity: error`, **When** `evaluate()` processes a violated instance of that rule, **Then** the returned violation's `severity` field matches the phase's resolved mapping decision, not an unexamined fallthrough.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A too-broad devin/cursor/pi regex could false-match an unrelated command that happens to contain the binary name plus `-p` (e.g. a `grep -p`-shaped alias, or `cursor-agent` appearing in a longer path string). | A non-dispatch command gets incorrectly audited/preflight-checked as a dispatch. | Anchor each regex on the binary name as a word boundary followed by the specific flag form, mirroring the existing `\bclaude\s+(-p|--print)\b` precedent; add a non-matching regression case per shape. |
| Risk | Changing the severity-mapping branch could alter behavior for the two shapes already live (`opencode run`, `claude -p`) if either skill's SKILL.md declares any hard rule with a severity value other than `block`/`warn`. | Existing dispatch preflight behavior for cli-opencode/cli-claude-code could shift unintentionally. | Grep both skills' hard_rules severity values before changing the branch; re-run the full pre-existing suite to confirm no behavior change for already-covered severities. |
| Risk | Shape-matching alone does not implement the three referenced CHECKS functions, so activation could be honestly overclaimed. | A completion claim could imply hard_rules are now enforced when `evaluate()` still silently skips unknown checks. | REQ-006 requires the gap to be stated plainly in this packet's own docs; Known Limitations names the exact three missing check IDs. |
| Dependency | `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`'s Codex adapter behavior, live under `.codex/hooks.json`. | Removing `CODEX_EXEC_SHAPE` without updating the adapter's import/composition would silently stop Codex dispatch recognition. | REQ-002's acceptance criteria requires the adapter to be updated in the same change and its own shape-matching test re-run. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: Every new/changed regex must be anchored with word boundaries consistent with the existing `opencode run`/`claude -p` entries, not a loosely-matching substring test.
- **NFR-Q02**: No behavior change to the two already-live shapes (`opencode run`, `claude -p`) or their currently-passing test cases.

### Traceability

- **NFR-T01**: The severity-mapping decision must be traceable to a direct quote of `evaluate()`'s pre-change source in `plan.md`, not a description from memory or the parent packet's plan text alone.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Regex Boundaries

- `cursor-agent` commands can carry many flags before `-p`/`--print` (e.g. `cursor-agent --model composer-2.5 -p "..."`), so the shape regex must not require `-p` to immediately follow the binary name.
- A command that merely mentions `devin`, `cursor-agent`, or `pi` in prose (e.g. inside a quoted prompt string being dispatched to a *different* CLI) must not false-match; the regex anchors on the binary invocation position, mirroring how the existing `opencode run`/`claude -p` entries already avoid matching prose mentions.

### Severity Fallthrough

- If a future hard rule declares a `severity` value other than `block`, `warn`, or `error`, the resolved mapping decision must define what happens to it explicitly (e.g. treated as `warn` by default, or rejected), not silently inherit whatever the `error` branch does.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One shared registry file, one adapter file, associated test files; no runtime config or symlink changes. |
| Risk | 10/25 | Touches a shared, live dispatch-recognition path used by every `cli-*` skill's preflight/audit adapters. |
| Research | 6/20 | Confirming `evaluate()`'s real severity-mapping branch and the CHECKS-function gap required direct source reads, not assumption. |
| **Total** | **24/50** | **Level 2 verification packet** (below phase-qualification thresholds for a further nested phase split). |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **RESOLVED**: `severity: error` maps to `block` in `evaluate()` (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`) — `const blocking = rule.severity === 'block' || rule.severity === 'error';` then `severity: blocking ? 'block' : 'warn'`, implemented as an explicit branch and covered by a passing regression test (`dispatch-rule-checks.test.mjs`, "severity maps error and block to a blocking violation; anything else advises").
- **Still open**: whether implementing the three missing `CHECKS` entries (`command-v-<cli>-required`, `<cli>-self-invocation-guard`, `deep-loop-runtime-delegation`) belongs in a dedicated follow-up phase — this spec scoped it out (see Out of Scope, REQ-006/REQ-007) and it remains unresolved for the parent packet's tracking. Confirmed still absent from `CHECKS` as of this completion pass.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related -->
## RELATED DOCUMENTS

- `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md` — parent phase-parent packet.
- `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` — shared `DISPATCH_SHAPES` registry, current real path.
- `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` — `evaluate()` and `CHECKS` registry.
- `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` — the locally-bolted-on Codex shape being folded in.
- `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`, `cli-cursor/SKILL.md`, `cli-pi/SKILL.md`, `cli-codex/SKILL.md` — the four skills declaring the `hard_rules:` this phase makes reachable.
<!-- /ANCHOR:related -->
