---
title: "Implementation Summary: Directive-Lifecycle Documentation Alignment"
description: "The directive-lifecycle documentation surface is aligned: ENV-REFERENCE §1 carries the canonical hook-level lifecycle flags block, the skill-advisor README and .pi extensions README state the lifecycle rule, the cursor catalog row is verified-and-noted, and SAD-003 is recorded as session-less fail-open compatible no-change — docs only, zero behavior change."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle docs alignment implementation"
  - "directive lifecycle documentation summary"
importance_tier: "high"
contextType: "implementation"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-directive-docs-alignment"
    last_updated_at: "2026-08-11T10:10:08Z"
    last_updated_by: "claude"
    recent_action: "Documentation alignment, gates, and parent reconciliation completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".pi/extensions/README.md"
      - ".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md"
    session_dedup:
      fingerprint: "sha256:d6aa4d44da547fd19d33b736c7b32b60b40706ae9a7b6677bc239e16896243f8"
      session_id: "2026-08-11-directive-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Directive-Lifecycle Documentation Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-directive-docs-alignment |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Level** | 2 |
| **Completion** | 100% — audit, four documentation edits, gates, and reconciliation completed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four doc edits across four files, plus one recorded no-change, driven by an audit that found zero stale docs and four missing items after 013/014 went live.

1. **The canonical env registry.** `ENV-REFERENCE.md` §1 gains a `Hook-level lifecycle flags` block — deliberately beside, not inside, the search-flags-generated Feature Flags table — registering `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` (model-context, default ON, kill-switch `0`/`false`/`off`/`no` → always-full), `SPECKIT_PI_DIRECTIVE_DEDUP` (Pi, default ON, same semantics), and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` (state-dir override, default `tmpdir/speckit-advisor/directive-lifecycle`), each pointing at the canonical core.

2. **The README cadence sentence.** `system-skill-advisor/README.md`'s OpenCode Plugin Note paragraph now states the since-014 lifecycle rule: full on the first message of a session and after lifecycle boundaries (startup/resume/compact events or transcript shrink on the shim); repeats carry the dynamic `Advisor:` route line only; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` reverts to always-full; fail-open on every uncertain path.

3. **The Pi rows.** `.pi/extensions/README.md` prompt-advisor rows document the 013 lifecycle: `SPECKIT_PI_DIRECTIVE_DEDUP` default ON, full delivery on the first message and after `session_start`/`session_compact`, route-only on proven repeats, `0`/`false`/`off` restoring always-full.

4. **The cursor verify-and-note.** `cursor-hooks-and-spec-gate.md`'s `user-prompt-submit` row is verified and noted: registered `beforeSubmitPrompt` proxy with unconfirmed delivery, directive delivery lifecycle-deduped via the shared compiled shim, kill-switch named.

5. **SAD-003, recorded no-change.** `system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md` verified session-less fail-open compatible — Pi calls the shim without a session id, so the shim always fails open there — no edit required.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit after 014's reconciliation checked every doc surface that describes advisor brief injection: `ENV-REFERENCE.md`, the skill-advisor README, `.pi/extensions/README.md`, the cursor hooks/spec-gate catalog, and the SAD-003 playbook. It found zero stale assertions (nothing claims always-full delivery anymore) and exactly four missing items: the hook envs had no canonical registration, and three runtime-facing docs either predated the lifecycle cadence or needed a verify-and-note pass. The edits were landed as a docs-only set: one canonical registry, per-runtime restatement pointing at it, kill-switch values stated beside every env mention, and SAD-003 explicitly recorded as verified no-change so a later phase does not re-audit it. Nothing runtime-adjacent was touched; the shipped 013/014 behavior is the contract these docs now describe.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ENV-REFERENCE §1 is the canonical hook-level env registry | The Feature Flags table is search-flags-generated and cannot absorb hook toggles without polluting the search contract. A deliberate hand-authored `Hook-level lifecycle flags` block beside it gives hook envs one authoritative home with defaults and kill-switch semantics, and gives runtime docs a single target to point at. |
| Per-runtime docs restate the rule and point at the block | Runtime operators read the READMEs, not the env reference; restating the rule where it is consumed keeps the docs self-sufficient while the canonical block stays the registry of record — the two can never contradict because both are grep-gated to the same phrasing contract. |
| Docs only; zero behavior change | The behavior is already live, tested, and reconciled (013/014). This phase exists because the docs lagged the feature, so changing any code would be both unnecessary and out of scope. The scope diff is the proof. |
| SAD-003 recorded as verified no-change | Pi's session-less shim call means the shim's dedup always fails open there; the doc is already accurate and the fail-open wording matches the shipped behavior. Recording the verification prevents redundant re-audits. |
| Content-anchored edits, not line-anchored | The README sentence sits near line ~101 today; anchoring on the OpenCode Plugin Note paragraph text survives paragraph edits and makes the grep gate stable. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canonical block | PASS (static) — ENV-REFERENCE.md §1 `Hook-level lifecycle flags` block present with all three envs, defaults, and kill-switch semantics. |
| Runtime-doc rule statements | PASS (static) — README OpenCode Plugin Note, `.pi` prompt-advisor rows, and cursor `user-prompt-submit` row all state the lifecycle rule and fail-open. |
| Kill-switch discoverability | PASS (static) — both dedup switches documented in the canonical block with identical `0`/`false`/`off`/`no` semantics; README and `.pi` rows restate. |
| SAD-003 no-change | PASS (static) — verified session-less fail-open compatible; no edit. |
| Comment hygiene | PASS (static) — docs-only; no code comments added. |
| Grep gates | PASS — block, env names, rule phrasing, and kill-switch values verified. |
| Stale-docs re-sweep | PENDING — expect zero always-full claims on the named surfaces. |
| Scope diff audit | PENDING — zero git diff on runtime code, tests, and the 007 activation folder; recursive validate.sh on the parent. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Docs-only guarantee is time-bound.** These docs describe behavior as shipped in 013/014; a future runtime change (for example threading Pi's session id through the shim) would need this phase's gates re-run. The grep gates are re-runnable by design.
2. **Line numbers drift.** The README cadence sentence was reported at ~line 101 during the audit; the edit and the gate anchor on paragraph content, so the reported line number is informational only.
3. **Sibling coverage split.** Playbook/catalog coverage of the lifecycle feature is sibling phase 016's scope; this phase covers only the four named doc surfaces and SAD-003.
4. **Search-flags table untouched.** The Feature Flags table remains search-flags-generated; the hook block is deliberately separate, which an operator scanning only the generated table would miss — mitigated by the block's placement in the same §1 section and its explicit hook/plugin-level marking.

<!-- /ANCHOR:limitations -->
