---
title: "Implementation Plan: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)"
description: "Deny-by-default register-acceptance gate at the cross-CLI design dispatch boundary: an effective register not in registerPolicy.accepted (brand/product) is rejected before launch; reconciled with D2-R8 registerPolicy and the D4 deny-by-default invariant."
trigger_phrases:
  - "d5-r6 reject register unknown plan"
  - "deny-by-default register acceptance cli plan"
  - "cross-cli register reject dispatch"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/006-reject-register-unknown"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete; register acceptance gate landed in cli_child_pairing.md"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r6-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Markdown contract + reference rule authoring (no app code path; one optional deterministic check extension) |
| **Primary target** | `mcp-open-design/references/cli_child_pairing.md` — add a fail-closed Deny Rule + Parent Re-Validation step for register acceptance |
| **Policy source of truth** | `registerPolicy.accepted` in `sk-design/command-metadata.json` (today: `brand`, `product`) — consumed by reference, never re-hardcoded |
| **Carrier** | The compact Context Manifest `Register:` field (cli-opencode Template 16, `prompt_templates.md`), hoisted per-skill so every cli-* manifest carries the field |
| **Mutation class** | Append a deny rule + a re-validation step + an evergreen contract paragraph; reuse the existing `STATUS=ASK MISSING_REGISTER` ASK behavior |
| **Verification** | Fixture-style truth table (unknown ⇒ reject, brand/product ⇒ pass, out-of-set ⇒ reject) + reconciliation-against-`accepted` check + evergreen scan |

### Overview
The cross-CLI design dispatch path currently has no boundary that rejects a design dispatch whose register is unresolved. The compact Context Manifest carries `Register: <Brand | Product | unknown until shared/register.md is read>` — the `unknown` value explicitly means `shared/register.md` was never read and no posture was decided. Dispatching that ships ambiguity into a child that cannot resolve it.

This plan specifies a **deny-by-default register-acceptance gate**: at the cross-CLI design dispatch boundary the parent MUST confirm the effective `register` is a member of the accepted posture set declared by `registerPolicy.accepted` (`brand`, `product`). An `unknown` register — or any token not in `registerPolicy.accepted` — is **rejected fail-closed before launch** (deny-by-default); the caller is asked to resolve the posture via the existing `STATUS=ASK MISSING_REGISTER` ASK rather than dispatching. A known posture (`brand` or `product`) passes.

The gate reconciles two already-landed invariants and invents no new policy: it consumes D2-R8's `registerPolicy.accepted` as the single membership source of truth, and it extends the D4 deny-by-default posture (fail closed on a missing/unresolved precondition) to the register field — an unresolved register is functionally a missing precondition, never a silent pass-through default.

### Scope note (honest)
The folder's namesake and this plan's load-bearing deliverable is the **register rejection**. The compact-manifest **hoist** (the other half of the shared D5-R6 backlog row) is treated here as the supporting *carrier* only: the hoist is what makes the `Register:` field present in every cli-* manifest so the reject rule has a field to test in all three siblings, not only cli-opencode. Full manifest-parity checker authoring beyond carrying the `Register:` field is out of this plan's load-bearing scope.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The accepted posture set is located and read: `registerPolicy.accepted == ["brand","product"]` in `command-metadata.json` (present on all five design commands).
- [x] The carrier field is located: `Register: <Brand | Product | unknown ...>` in cli-opencode Template 16 (`prompt_templates.md`); `unknown` is the placeholder meaning register.md was unread.
- [x] The reuse target is located: `STATUS=ASK MISSING_REGISTER` is an existing ASK token already asserted by `design-command-surface-check.mjs`.
- [x] The exact enforcement home is named: a Deny Rule + Parent Re-Validation step in `cli_child_pairing.md` (which already owns the cross-CLI fail-closed deny contract and a Named Residual section).

### Definition of Done
- [x] An unknown register at the cross-CLI design dispatch boundary is rejected fail-closed (deny-by-default) before any child is launched. — Re-Validation step 4 + Unknown-register deny row (`cli_child_pairing.md` lines 359, 369)
- [x] A known register (`brand` or `product`) passes the gate. — truth table rows + Accepted-postures acceptance row (lines 380-381, 397)
- [x] An out-of-set token (e.g. `marketing`, `campaign`, empty) is rejected the same way as `unknown` — membership is tested against `registerPolicy.accepted`, not against the literal string `unknown` only. — `marketing` ⇒ DENY truth row + Out-of-set deny row (lines 379, 371)
- [x] The rule reconciles with `registerPolicy.accepted` by reference (single source of truth); no second hardcoded posture list is introduced that could drift from `command-metadata.json`. — "MUST NOT maintain a second hardcoded accepted-register list" (line 350); 8 references, no parallel list
- [x] The rule reuses the existing `STATUS=ASK MISSING_REGISTER` ASK behavior for the pre-dispatch escalation rather than minting a new escalation token. — reused at lines 360, 369, 378, 398; no new token
- [x] Evergreen [HARD]: the authored rule text carries no spec path, packet, phase, ADR, REQ, task, or finding ID; it names the policy by field (`registerPolicy.accepted`) and the postures by `shared/register.md`. — evergreen grep over lines 346-400 returned nothing
- [x] The honest boundary is documented: the enforceable membership test vs the named residuals (register *correctness* on mixed surfaces; text-only cli-claude-code channel). — Named Residuals subsection (lines 385-387)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The reject contract (evergreen rule the implementer authors)
At the cross-CLI design dispatch boundary, the parent MUST resolve the effective `register` and confirm it is a member of `registerPolicy.accepted`:

1. **Resolve** the effective register following `registerPolicy.resolutionOrder` (explicit flag → declared register → task cue → surface-in-focus → safe default) and the two postures defined in `shared/register.md` (Brand = design IS the product; Product = design SERVES the product).
2. **Test membership** against `registerPolicy.accepted` (today `brand`, `product`). The test reads the policy field; it does not hardcode the posture list.
3. **Reject fail-closed (deny-by-default)** when the effective register is `unknown` (the Template 16 placeholder meaning register.md was never read) OR any token not in `registerPolicy.accepted`. The parent does NOT launch the child.
4. **Escalate, do not default**: the caller is asked to resolve the posture via the existing `STATUS=ASK MISSING_REGISTER` ASK. An unresolved register is never silently coerced to a safe default at the dispatch boundary.
5. **Pass** only a known posture (`brand` or `product`).

### Reconciliation with the two landed invariants

| Landed invariant | How the reject reconciles |
|------------------|---------------------------|
| **D2-R8 registerPolicy** (`accepted = [brand, product]`, `resolutionOrder`, `askWhen`) | The reject consumes `accepted` as the single membership source of truth and reuses the policy's `askWhen` intent + the `MISSING_REGISTER` ASK; it adds no parallel posture list and no new escalation token. |
| **D4 deny-by-default** (fail closed on a missing/stale/mismatched precondition) | An unresolved register is treated as a missing precondition. `unknown` ⇒ absent judgment ⇒ `DENY`. The reject is the register-field extension of the same fail-closed posture, not a new gate philosophy. |

### Where it is enforced (the EXACT target + additive layering)

- **Primary — boundary deny rule (enforceable, deterministic).** A new Deny Rule row plus a Parent Re-Validation step in `mcp-open-design/references/cli_child_pairing.md`. That file already owns the cross-CLI fail-closed deny contract (numbered Parent Re-Validation algorithm, a Deny Rules table, and a Named Residual section). The new row: *Unaccepted register* — when the effective register reconstructed from the dispatch manifest / transport-result material is `unknown` or ∉ `registerPolicy.accepted`, return fail-closed `DENY` for the dispatch/handoff.
- **Pre-dispatch ASK (request-path).** The hoisted compact Context Manifest `Register:` field must resolve to an accepted posture before launch; an `unknown` value yields `STATUS=ASK MISSING_REGISTER` rather than a dispatch. The carrier hoist makes this field present in every cli-* manifest.
- **Optional defense-in-depth (deterministic static check).** Extend `design-command-surface-check.mjs` so the hoisted manifest carrier is asserted to enumerate only accepted postures plus the ASK token. The script already validates `registerPolicy.accepted` membership and the presence of the `STATUS=ASK MISSING_REGISTER` token, so this is an additive assertion, not a new mechanism.

### Enforceable vs residual (the honest "1000%")
- **Enforceable at the boundary (deterministic, replayable):** the membership test (`register ∈ registerPolicy.accepted`) and the fail-closed `DENY` on `unknown`/out-of-set. This is a string-set test against a stable policy field — fully deterministic and replayable on the local checkout.
- **Named residual 1 — register correctness on mixed surfaces (advisory).** The gate proves the value is one of `{brand, product}`; it cannot prove the child picked the *right* posture for a genuinely mixed surface (the `registerPolicy.askWhen` "mixed across Brand and Product" case). A substantively-wrong-but-accepted register passes the deterministic gate. Application taste stays advisory.
- **Named residual 2 — text-only cli-claude-code channel (advisory).** A prose-only return with no machine-readable manifest/register field degrades the register check to advisory; it inherits and is bounded by the existing Named Residual already documented in `cli_child_pairing.md`. Parent demand-back remains the fail-closed floor for any machine-readable channel.

### What NOT to touch (scope freeze)
- Do NOT change `registerPolicy.accepted`, `default`, `resolutionOrder`, or `askWhen` in `command-metadata.json` — the reject consumes them read-only.
- Do NOT mint a new escalation token; reuse `STATUS=ASK MISSING_REGISTER`.
- Do NOT redefine the proof-token, guarded-proxy, or transport-result schemas in `cli_child_pairing.md` — add only the register deny rule + re-validation step.
- Do NOT author the broader manifest-parity checker here (carrier-only scope).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Grounding
- [x] Re-read `registerPolicy.accepted` in `command-metadata.json` and confirm `["brand","product"]` is identical across all five design commands. — confirmed; source read-only, untouched
- [x] Re-read the `Register:` enum in cli-opencode Template 16 (`prompt_templates.md`) and confirm `unknown` is the unread-register placeholder. — confirmed; `unknown` = register.md unread
- [x] Re-read the `cli_child_pairing.md` Parent Re-Validation algorithm, Deny Rules table, and Named Residual section to locate the insertion points. — insertion fixed at EOF after the laundering guard; new H2 at line 346
- [x] Re-read the `STATUS=ASK MISSING_REGISTER` + `registerPolicy.accepted` assertions in `design-command-surface-check.mjs`. — confirmed the reuse target before authoring

### Phase 2: Author the reject rule
- [x] Add the *Unaccepted register* Deny Rule row to `cli_child_pairing.md` Deny Rules: register `unknown` or ∉ `registerPolicy.accepted` ⇒ fail-closed `DENY`. — Register Deny Rules table, 4 rows (lines 367-372)
- [x] Add the matching Parent Re-Validation step: reconstruct the effective register from the dispatch manifest / transport-result material, test membership against `registerPolicy.accepted`. — 6-step Parent Re-Validation Extension (lines 352-361)
- [x] Document the pre-dispatch ASK: an `unknown` register on the hoisted manifest `Register:` field yields `STATUS=ASK MISSING_REGISTER` before launch (reuse, no new token). — step 5 + Unknown-register deny row (lines 360, 369)
- [x] Reconcile wording with the two postures in `shared/register.md` and the D4 deny-by-default invariant; keep the rule text evergreen (no IDs/paths embedded as policy values). — postures cited (line 348); "missing precondition ... deny-by-default posture" (line 363); evergreen clean

### Phase 3: Verification
- [x] Build/record the truth table: `unknown` ⇒ DENY/ASK; `brand` ⇒ pass; `product` ⇒ pass; an out-of-set token (e.g. `marketing`) ⇒ DENY. — Register Truth Table (lines 378-381)
- [x] Confirm the membership test reads `registerPolicy.accepted` (single source of truth) and no parallel hardcoded posture list was added. — 8 references; "MUST NOT maintain a second hardcoded accepted-register list" (line 350)
- [x] Confirm the ASK reuses `STATUS=ASK MISSING_REGISTER`. — 4 occurrences; no newly minted token
- [x] Evergreen scan of the authored rule block (no spec/packet/phase/ADR/REQ/task/finding token). — grep over lines 346-400 returned nothing
- [x] (Optional) If the surface-check extension was added, run it and confirm green on the accepted-postures + ASK-token assertion for the manifest carrier. — DEFERRED: the optional defense-in-depth check was not added this phase; `design-command-surface-check.mjs` untouched (carrier-only scope)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Command / method |
|-------|-------|------------------|
| Reject unknown | Deny-by-default fires | Truth-table case `register=unknown` ⇒ `DENY` / `STATUS=ASK MISSING_REGISTER`, no child launch |
| Pass brand | Known posture passes | Truth-table case `register=brand` ⇒ pass |
| Pass product | Known posture passes | Truth-table case `register=product` ⇒ pass |
| Reject out-of-set | Membership (not literal `unknown`) is the test | Truth-table case `register=marketing` ⇒ `DENY` |
| Reconciliation | Single source of truth | The rule references `registerPolicy.accepted`; `grep` finds no second hardcoded `["brand","product"]` posture list outside `command-metadata.json` |
| ASK reuse | No new escalation token | `grep` shows the escalation is `STATUS=ASK MISSING_REGISTER`, not a newly minted token |
| Evergreen | No ephemeral IDs | `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over the authored rule returns nothing |
| Residual honesty | Boundary stated | The mixed-surface correctness residual and the text-only cli-claude-code residual are named, not hidden |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `registerPolicy.accepted` in `command-metadata.json` (D2-R8 landed) | Internal | Stable | The membership source of truth; if it changes shape, the reject must follow it by reference |
| `shared/register.md` posture definitions (D2-R8 landed) | Internal | Stable | Defines the two accepted postures the gate resolves to |
| `cli_child_pairing.md` deny contract (D5-R2 landed) | Internal | Stable | The enforcement home; if its Deny Rules / Parent Re-Validation structure shifts, re-locate the insertion point by content |
| Compact Context Manifest hoist (`Register:` field present in all 3 cli-*) | Internal | Carrier | Without the hoist the field exists only in cli-opencode; the reject can still gate cli-opencode but cross-CLI coverage depends on the carrier being present in each sibling |
| `design-command-surface-check.mjs` register assertions | Internal | Stable | Existing deterministic checker reused for the optional defense-in-depth assertion |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The deny rule rejects a legitimately-resolved known posture (false positive), or the membership test drifts from `registerPolicy.accepted`, or the authored rule embeds an ephemeral ID.
- **Procedure**: The change is an additive markdown rule block + one re-validation step (plus an optional script assertion). Revert with `git checkout -- <file>` per file; each insertion is a self-contained, independently reversible hunk.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Grounding ──> Author reject rule (deny row + re-validation + ASK reuse) ──> Verify (truth table + reconciliation + evergreen)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Grounding | None | Author |
| Author reject rule | Grounding | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Grounding (re-read policy + carrier + deny contract) | Low | 10 minutes |
| Author reject rule (deny row + re-validation + ASK reuse + reconcile) | Medium | 25 minutes |
| Verification (truth table + reconciliation + evergreen + optional check) | Low | 15 minutes |
| **Total** | | **~50 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### HALT conditions (any one → STOP and report)
1. `registerPolicy.accepted` is not `["brand","product"]` or differs across the five design commands → the membership source of truth is inconsistent; HALT and reconcile before authoring a reject that reads it.
2. The `cli_child_pairing.md` Deny Rules / Parent Re-Validation structure cannot be matched by content (it was reorganized) → re-locate by content; do not force the insertion at a stale position.
3. The reject would require minting a NEW escalation token because `STATUS=ASK MISSING_REGISTER` cannot be reused → STOP and confirm reuse intent; do not silently introduce a parallel token.
4. The carrier hoist is absent in a sibling cli-* and the reject would falsely claim cross-CLI coverage it does not have → document the carrier gap honestly rather than over-claim.

### Reversal discipline
- Stage only the register deny rule + re-validation step (+ optional script assertion); never bulk-stage adjacent contract sections.
- Each authored block is a single self-contained hunk; reversal is `git checkout -- <file>` per file.

### Data Reversal
- **Has data migrations?** No. Pure markdown contract authoring (+ one optional deterministic check); reversal is `git checkout -- <file>`.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Load-bearing deliverable: deny-by-default register-acceptance reject at the cross-CLI dispatch boundary
- Carrier-only treatment of the compact-manifest hoist; honest enforceable-vs-residual split
-->
