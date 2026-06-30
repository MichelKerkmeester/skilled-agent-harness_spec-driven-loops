---
title: "Implementation Plan: D2-R8 — register (Brand/Product) pinnable at command entry"
description: "complete. Added a registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields} block to command-metadata.json, projected an anchor-delimited REGISTER section carrying a --register flag and STATUS=ASK MISSING_REGISTER into the five wrappers, and extended design-command-surface-check.mjs to validate the policy shape and wrapper presence — all additive, preserving every prior D2 field/section and holding drift at 0."
trigger_phrases:
  - "d2-r8 register pinning plan"
  - "design command register policy plan"
  - "brand product register command entry plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/008-register-pinning"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete; surface-check PASS invalid=0 drift=0"
    next_safe_action: "Run D2-R9 pipeline-handoff-visibility phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r8-register-pinning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "resolutionOrder priority resolved: declaredRegister placed ahead of taskCue to honor register.md 'authoritative' clause"
      - "--register kept body-only (not in argument-hint), preserving wrapper frontmatter byte-for-byte per the D2-R6/R7 convention"
      - "Brand≠Product realized as per-command dial enumeration on the named targets; the literal fixture is a D3 follow-on"
---
# Implementation Plan: D2-R8 — register (Brand/Product) pinnable at command entry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON data + Markdown command wrappers + Node.js ESM (`.mjs`) validator |
| **Runtime** | `node` (project default), no new dependencies |
| **Inputs (read-only)** | `.opencode/skills/sk-design/shared/register.md` (the six dials + resolution order), `.opencode/skills/sk-design/shared/assets/register_card.md` (per-mode dial hand-off), `.opencode/skills/sk-design/mode-registry.json` (workflowModes) |
| **Mutated artifacts** | `.opencode/skills/sk-design/command-metadata.json`, `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`, `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — deterministic, exit-coded; `node --check` on the edited checker |

### Overview
Today a caller cannot pin the Brand-vs-Product **register** at command entry — `commands/design/interface.md:3` exposes no register flag, so the posture that sets the six downstream dials is decided implicitly and never proven. This phase lets a caller pin **Brand** or **Product** at entry and fail-closed (ASK, not silent default) when the register is genuinely unresolved or mixed.

The authoritative content lives in `command-metadata.json` as a new `registerPolicy{accepted, default, resolutionOrder, askWhen, proofFields}` block (one per record), derived from `shared/register.md` (§2 resolution order, §3 the six dials, §4 mode usage) and `shared/assets/register_card.md` (§3 per-mode dial hand-off). A generator projects an anchor-delimited `REGISTER` section into the five wrappers carrying the `--register <brand|product>` flag, the per-command dials the register sets, and the `STATUS=ASK MISSING_REGISTER` fail-closed token. `design-command-surface-check.mjs` is **extended** to validate the `registerPolicy` shape (Stage 1) and to confirm the `REGISTER` section + flag + ASK token are present in each wrapper body (a new `kind=register` drift channel).

The work is strictly **additive**: it adds one metadata field, one wrapper body section, and one checker stage. It does **not** touch the four frontmatter drift fields (`description`, `argument-hint`, `aliases`, `allowed-tools`), so the existing frontmatter drift channel stays at `0`. It preserves every prior D2 addition byte-wise — `toolPolicy` (D2-R1), per-mode `argumentHint` (D2-R2), the `command-metadata.json` SSOT (D2-R3), `examples`/`## EXAMPLE` (D2-R4), `outputContract`/`## EMIT DELIVERABLE` (D2-R5), `discriminator`/`sibling-discriminator` section (D2-R6), and `preconditions`/`## PRECONDITIONS` markers (D2-R7). The new `registerPolicy.proofFields` is a distinct nested field; it is **never** compared to `outputContract.requiredFields`, so the existing record-level `proofFields ⇔ outputContract.requiredFields` invariant is untouched. `mode-registry.json`, `register.md`, and `register_card.md` are read-only and never mutated. The register **wording stays advisory** — the checker proves the policy and the flag/ASK tokens *exist and reconcile*, never that the posture call is correct on a genuinely mixed surface.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R8 framing confirmed from `spec.md`: a caller pins Brand/Product at entry; an unresolved register fails closed with `STATUS=ASK MISSING_REGISTER`; the policy reuses `shared/register.md` proof fields — spec.md §1 Objective + §5 Acceptance
- [x] The six register dials and the per-mode hand-off transcribed from `shared/register.md` §3/§4 and `shared/assets/register_card.md` §2/§3 — §3 matrix below
- [x] The five `workflowMode` keys (`audit`, `foundations`, `interface`, `md-generator`, `motion`) read from `mode-registry.json` as the command allow-set
- [x] Prior-D2 baseline confirmed green before any edit: `node design-command-surface-check.mjs` → `invalid=0 drift=0`
- [x] Scope frozen: only `command-metadata.json` + the five wrappers (body-only) + `design-command-surface-check.mjs`; `mode-registry.json` / `register.md` / `register_card.md` read-only

### Definition of Done
- [x] Every record in `command-metadata.json` carries a well-formed `registerPolicy`; `accepted` contains `brand` and `product`; `default` is `auto`; `resolutionOrder`, `askWhen`, and `proofFields` are non-empty; `proofFields` contains `register`
- [x] Each wrapper carries an anchor-delimited `REGISTER` section naming the `--register <brand|product>` flag, both postures, this command's dials, and the `STATUS=ASK MISSING_REGISTER` token
- [x] `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0` (frontmatter + example + emit-deliverable + discriminator + preconditions + the new register channel all clean)
- [x] A synthetic break (drop one record's `registerPolicy`, or strip the `STATUS=ASK MISSING_REGISTER` token from one wrapper) flips the checker to a non-zero exit; restoring returns `invalid=0 drift=0`
- [x] `node --check design-command-surface-check.mjs` passes (checker was edited)
- [x] `mode-registry.json`, `register.md`, `register_card.md`, and all four frontmatter drift fields are byte-unchanged
- [x] No spec / packet / phase ID or spec path embedded in any mutated runtime artifact (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT + stateless drift-gate, extended. The register policy is authored once in `command-metadata.json` (the existing command-surface SSOT), projected into the wrappers, and gate-enforced by the existing `design-command-surface-check.mjs`. This reuses the D2-R3 contract and adds one Stage-1 sub-validator plus one body-presence channel, exactly as D2-R6 (discriminator) and D2-R7 (preconditions) did.

### Key Components
- **`command-metadata.json`** — gains a `registerPolicy` object per record (the new authoritative content).
- **The five wrappers** — gain an anchor-delimited `register` section (the `register` anchor-comment open/close pair is the deterministic extraction handle) carrying the projected flag, dials, and ASK token.
- **`design-command-surface-check.mjs`** — extended: `registerPolicy` added to required fields; a `validateRegisterPolicy()` Stage-1 sub-validator; a new `expectedRegisterDrift()` body channel reporting `kind=register` drift; `register` added to the drift sort order.
- **`mode-registry.json`** — read-only `workflowMode` source; the command allow-set; never mutated.
- **`shared/register.md` + `shared/assets/register_card.md`** — read-only derivation source for the policy values and the per-command dials; never mutated.

### registerPolicy data shape (added to every `command-metadata.json` record)
```json
"registerPolicy": {
  "accepted": ["brand", "product"],
  "default": "auto",
  "resolutionOrder": ["explicitFlag", "declaredRegister", "taskCue", "surfaceInFocus", "safeDefault"],
  "askWhen": "<one line: when the posture is unresolved or genuinely mixed → STATUS=ASK MISSING_REGISTER>",
  "proofFields": ["register", "<dial>", "<dial>"]
}
```
Reconciliation rules the checker enforces (Stage 1, violation → exit 2):
- `registerPolicy` is a plain object on every record.
- `accepted` is a non-empty string array that contains both `brand` and `product`.
- `default` is a non-empty string equal to `auto` (the spec's `default:auto`; the policy resolves, it never silently picks).
- `resolutionOrder` is a non-empty string array.
- `askWhen` is a non-empty string.
- `proofFields` is a non-empty string array that contains `register`.
- **Isolation rule:** `registerPolicy.proofFields` is validated only here; it is NOT compared to `outputContract.requiredFields`. The existing record-level `proofFields ⇔ outputContract.requiredFields` invariant (checker line 417) stays exactly as is.

### Authored registerPolicy matrix (derived from `register.md` §3/§4 + `register_card.md` §3)
The register sets six dials; each command reads the subset it owns (register.md §4 "Mode usage" / register_card.md §3 "Hand off to the modes"). `proofFields` pins that subset per command — this is the "register/dials position" each command declares. `accepted`/`default`/`resolutionOrder`/`askWhen` are shared across all five.

| Command (`whenToUse` register stance) | `registerPolicy.proofFields` | Dials the register sets here (provenance) |
|---|---|---|
| **interface** — reads the register first, then sets the build calibration | `["register", "density", "motionBudget", "colorStrategy"]` | register.md §4: density, motion budget, color strategy |
| **foundations** — reads the register to choose the system's color + density | `["register", "colorStrategy", "tokenDensity"]` | register.md §4: color strategy, token-system density (spacing rhythm, type scale) |
| **motion** — reads the motion-budget dial | `["register", "motionBudget"]` | register.md §4: motion-budget (choreography vs state-only) |
| **audit** — reads the audit-severity dial | `["register", "auditSeverity"]` | register.md §4: audit-severity weighting (distinctiveness for Brand, affordance for Product) |
| **md-generator** — records the extracted surface's register | `["register"]` | register.md §4: records the captured posture (no dials set; posture carried forward) |

Shared values (all five records):
- `accepted`: `["brand", "product"]` — the two postures `--register` accepts (register.md §2: a surface takes one of two postures).
- `default`: `"auto"` — per spec; resolve via `resolutionOrder`, fail-closed to ASK when unresolved.
- `resolutionOrder`: `["explicitFlag", "declaredRegister", "taskCue", "surfaceInFocus", "safeDefault"]`
  - `explicitFlag` — the `--register` value (caller pin, highest).
  - `declaredRegister` — a `register` field in PRODUCT.md / DESIGN.md (register.md §2.3 "authoritative if present").
  - `taskCue` — landing/campaign/portfolio → Brand; dashboard/admin/settings/tool → Product (register.md §2.1).
  - `surfaceInFocus` — the actual page/route/file, even inside a mixed app (register.md §2.2).
  - `safeDefault` — Product for an unlabeled internal surface (register.md §3); a genuinely mixed/unresolved surface does NOT default — it triggers `askWhen`.
- `askWhen`: a single string — "the register cannot be resolved from the flag, a declared field, the task cue, or the surface, or the surface is genuinely mixed across Brand and Product so the dials would diverge" → emit `STATUS=ASK MISSING_REGISTER` (spec §5: a mixed-surface call stays advisory, i.e. ASK, not FAIL).

**Faithful-authoring note (flagged open decision):** `register.md` §2 lists the resolution under "first match wins" as task-cue → surface → declared, yet §2.3 calls a declared register "authoritative if present." This plan places `declaredRegister` ahead of `taskCue` to honor the "authoritative" clause. The implementer must verify this ordering against `register.md` at author time; if the operator wants the literal §2 numeric order (task-cue first), that is the alternative (recorded in frontmatter `open_questions`).

### Wrapper section shape (projected into each `.opencode/commands/design/*.md`)
Each wrapper carries the `register` anchor pair (the deterministic extraction handle) wrapping a `## REGISTER` heading, inserted after `## PRECONDITIONS` and before `## INSTRUCTIONS` (the register is an entry precondition). The checker keys on the anchor, not the heading number, so the existing section numbers may shift without breaking the gate. The section shape (the literal `register` anchor-comment open/close pair wraps the heading and the four lines below):

```md
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) vs Product (design SERVES the product), with the per-command weighting.
- **This command's dials:** <proofFields joined> — set by the Brand-vs-Product register (see `shared/register.md`).
- **Ask-first:** when the register is unresolved or the surface is genuinely mixed, emit `STATUS=ASK MISSING_REGISTER` and ask "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" Do not guess the posture.
```

The existing `PURPOSE` / `sibling-discriminator` / `PRECONDITIONS` / `INSTRUCTIONS` / `EMIT DELIVERABLE` / `EXAMPLE` sections are preserved byte-wise; the `REGISTER` section is **inserted**, not overwritten. The interface wrapper's existing PRECONDITIONS already mentions "Brand or Product register?" — that text is preserved; the new `REGISTER` section is the uniform, checkable pin added to all five.

**Token coexistence (no regression):** the new `STATUS=ASK MISSING_REGISTER` token is distinct from the generic `STATUS=ASK MISSING=<input>` token the D2-R7 preconditions channel requires. Both coexist in every wrapper. The new token is NOT added to `REQUIRED_RETURN_STATUS_TOKENS` (which keeps the preconditions channel intact); it is enforced only by the new register channel. The `STATUS=FAIL ERROR="<message>"` status-only ban (D2-R7) is unaffected — `STATUS=ASK MISSING_REGISTER` does not trip it.

### Checker rules (added; FAIL conditions)
Stage 1 — metadata validation (violation → exit 2, INVALID), `validateRegisterPolicy(record, command)`:
1. `registerPolicy` missing or not an object on any record.
2. `accepted` not a non-empty string array, or missing `brand` or `product`.
3. `default` not a non-empty string, or `default !== "auto"`.
4. `resolutionOrder` not a non-empty string array.
5. `askWhen` not a non-empty string.
6. `proofFields` not a non-empty string array, or missing `register`.

Register-presence channel — wrapper body (violation → drift, exit 1), `expectedRegisterDrift(record, markdown)`:
7. The `register` anchor block is absent from a wrapper.
8. The block does not name the `--register` flag token.
9. The block does not name both postures (`brand` and `product`, case-insensitive).
10. The block carries no `STATUS=ASK MISSING_REGISTER` token.
11. The block does not name every dial in this record's `registerPolicy.proofFields` (the per-command Brand≠Product dial enumeration).

Presence and per-command dial coverage are diffed; **wording is not** (advisory). Register-presence failures report on a distinct `kind=register` line but count toward the single `drift` total. `register` is added to the drift sort order so output stays deterministic. PASS (exit 0) only when metadata is valid AND `drift=0` across frontmatter + example + emit-deliverable + discriminator + preconditions + register.

#### Scope decision — the spec's "fixtures assert Brand≠Product dials"
`spec.md` §4/§5 names "fixtures [that] assert Brand≠Product dials." The named targets for this phase are the five wrappers, `command-metadata.json`, `mode-registry.json` (read-only), and `design-command-surface-check.mjs` — **none is a router-replay / gold-corpus / fixture harness** (that machinery belongs to dimension D3 and its own phases, e.g. `router-replay.cjs` / a private gold corpus). This plan therefore realizes the Brand≠Product assertion **deterministically on the named targets**: each command's `registerPolicy.proofFields` enumerates the *specific* dials its register governs (interface ≠ motion ≠ audit ≠ foundations ≠ md-generator), and rule 11 asserts those per-command dials appear in the wrapper — a static, per-command "the dials differ by posture and by mode" guarantee without standing up cross-dimension fixtures. **Open decision (flagged for the operator):** if the spec intends a literal runtime fixture asserting Brand vs Product produce *different dial values*, that is a follow-on coupled to the D3 routing/gold-corpus build, not this phase's named targets (recorded in frontmatter `open_questions`).

#### Scope decision — `--register` in the argument-hint
The spec names "a `--register` flag." A flag's canonical declaration site could be the per-mode `argument-hint` (D2-R2). This plan keeps `--register` **body-only** (declared in the `REGISTER` section + `registerPolicy.accepted`), matching the D2-R6/D2-R7 convention that the wrapper frontmatter stays byte-unchanged. Adding `[--register <brand|product>]` to each `argumentHint` would require moving the metadata `argumentHint` and the frontmatter `argument-hint` in lockstep (drift would stay 0, but it departs from the established body-only convention). **Open decision (flagged for the operator):** promote `--register` into the argument-hints if the operator wants it visible in the command grammar; this phase does not, to preserve the frontmatter byte-for-byte.

### Data Flow
1. Author the `registerPolicy` block on all five records in `command-metadata.json`, sourced from the §3 matrix.
2. Extend the checker: add `registerPolicy` to required fields; `validateRegisterPolicy()` Stage 1; new `expectedRegisterDrift()` body channel; add `register` to the drift sort order.
3. Project the anchor-delimited `REGISTER` section into the five wrappers from the metadata (flag + dials + ASK token).
4. Run the checker → `invalid=0 drift=0`; `node --check` the checker; confirm `mode-registry.json` / `register.md` / `register_card.md` / the four frontmatter fields byte-unchanged.

#### Expected transient state
After Phase 1 (metadata only), the not-yet-extended checker still passes (extra fields are ignored). After the checker is extended but before the wrappers carry the section, the checker reports `register` drift (exit 1) — the correct intermediate state, cleared when Phase 2 projects the wrapper sections.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the registerPolicy SSOT (`command-metadata.json`)
- [x] Read `shared/register.md` §2/§3/§4 and `shared/assets/register_card.md` §2/§3; transcribe the §3 matrix dials per command
- [x] Add a `registerPolicy{accepted, default, resolutionOrder, askWhen, proofFields}` block to all five records
- [x] Set `accepted` = `["brand","product"]`, `default` = `"auto"`, the shared `resolutionOrder`, and the shared `askWhen` on every record
- [x] Set each record's `proofFields` from the §3 matrix (interface 4 dials, foundations 3, motion 2, audit 2, md-generator 1); every `proofFields` begins with `register`
- [x] Confirm valid JSON; confirm `registerPolicy.proofFields` is NOT equal to `outputContract.requiredFields` semantics (distinct field); no embedded spec/packet/phase ID or path (evergreen [HARD])

### Phase 2: Extend the checker + project the wrapper sections
- [x] Add `"registerPolicy"` to `REQUIRED_FIELDS`; implement `validateRegisterPolicy()` Stage-1 rules (1–6); call it from `validateMetadata`
- [x] Implement `expectedRegisterDrift()`: extract the `register` anchor block, assert the `--register` flag, both postures, the `STATUS=ASK MISSING_REGISTER` token, and the per-command `proofFields` dials; report `kind=register` drift; add `register` to the drift sort order
- [x] Confirm `validateRegisterPolicy` does NOT touch `validateOutputContract`'s `proofFields ⇔ requiredFields` rule (isolation preserved)
- [x] `node --check` the edited checker; confirm the exit-code contract (0/1/2) preserved
- [x] Project the anchor-delimited `REGISTER` section into all five wrappers from the metadata (flag + dials + ASK token), inserted after `## PRECONDITIONS`
- [x] Confirm each wrapper preserves its existing PURPOSE / sibling-discriminator / PRECONDITIONS / INSTRUCTIONS / EMIT DELIVERABLE / EXAMPLE sections and the four frontmatter fields byte-wise; no embedded ID or spec path (evergreen [HARD])

### Phase 3: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0
- [x] Confirm no-regression: frontmatter, example, emit-deliverable, discriminator, and preconditions channels all still report `drift=0`
- [x] Synthetic break: drop one `registerPolicy` (→ exit 2 INVALID) and strip one wrapper's `STATUS=ASK MISSING_REGISTER` (→ `register` drift, exit 1); restore → `invalid=0 drift=0`
- [x] Confirm `mode-registry.json`, `register.md`, `register_card.md`, and the four frontmatter fields byte-unchanged (`git diff`)
- [x] Re-read the three mutated runtime artifacts for evergreen; `node --check` the checker; mark `checklist.md` with evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `registerPolicy` present + well-formed on all 5 records | `node` + checker Stage 1 |
| Reconciliation | `accepted ⊇ {brand,product}`; `default == auto`; `resolutionOrder`/`askWhen`/`proofFields` non-empty; `proofFields ∋ register` | checker Stage 1 |
| Isolation | `registerPolicy.proofFields` never compared to `outputContract.requiredFields` | source review + the existing outputContract test still green |
| Body presence | each wrapper's `register` anchor block names the flag, both postures, the ASK token, and this command's dials | checker register channel |
| No-regression | frontmatter / example / emit-deliverable / discriminator / preconditions drift channels stay 0 | checker drift report (per `kind`) |
| Negative control | drop a `registerPolicy` → exit 2; strip a wrapper ASK token → `register` drift exit 1 | manual edit + re-run |
| Determinism | two runs produce byte-identical output | `diff` of two `--json` runs |
| Syntax | edited checker parses | `node --check design-command-surface-check.mjs` |
| Non-mutation | `mode-registry.json` / `register.md` / `register_card.md` / four frontmatter fields unchanged | `git diff` / sha compare |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT, carrying D2-R1…R7 fields) | Internal | Green | the host for the new `registerPolicy` block; prior fields must stay intact |
| `design-command-surface-check.mjs` (D2-R3…R7 checker) | Internal | Green | the gate being extended; all prior channels must stay green |
| `mode-registry.json` | Internal (read-only) | Green | command allow-set (workflowModes); never mutated |
| `shared/register.md` | Internal (read-only) | Green | derivation source for `resolutionOrder`, the six dials, and per-mode usage |
| `shared/assets/register_card.md` | Internal (read-only) | Green | derivation source for the per-command dial hand-off |
| `commands/design/*.md` | Internal | Green | the wrappers that receive the projected `REGISTER` section |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** the `registerPolicy` field shape is a contract the wrapper generator and the checker share. Renaming `accepted` / `default` / `resolutionOrder` / `askWhen` / `proofFields` later is a breaking change to both; this phase freezes that shape. The `registerPolicy.proofFields` name deliberately mirrors the record-level `proofFields` name but is a *separate* nested field — the checker must not conflate them.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the `registerPolicy` shape proves wrong, the register body channel proves non-deterministic, or any prior D2 drift channel regresses.
- **Procedure**: revert the three mutated files — remove the `registerPolicy` block from `command-metadata.json`, remove the anchor-delimited `REGISTER` section from the five wrappers, and revert the checker to its pre-D2-R8 state. `mode-registry.json` / `register.md` / `register_card.md` were never touched, so removal fully restores the D2-R7 baseline (`invalid=0 drift=0`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author registerPolicy SSOT) ──> Phase 2 (Extend checker + project wrappers) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author registerPolicy SSOT | None | Extend checker + project wrappers |
| Extend checker + project wrappers | Author registerPolicy SSOT | Verify |
| Verify | Extend checker + project wrappers | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author registerPolicy SSOT (5 records) | Low | 45–60 minutes |
| Extend checker + project 5 wrapper sections | Medium | 1.5–2 hours |
| Verification | Low | 30–45 minutes |
| **Total** | | **~3–3.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] D2-R7 baseline captured: `node design-command-surface-check.mjs` → `invalid=0 drift=0` before edits
- [x] `mode-registry.json` / `register.md` / `register_card.md` shas captured before any work (proves non-mutation after)
- [x] Confirmed exactly three runtime targets will be mutated (metadata, checker, five wrappers)

### Rollback Procedure
1. Remove the `registerPolicy` block from all five `command-metadata.json` records
2. Remove the `register` anchor section from the five wrappers
3. Revert `design-command-surface-check.mjs` to its pre-D2-R8 state
4. Verify `git status` shows no other change; the read-only shas match pre-work capture; the checker returns to `invalid=0 drift=0`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields} to command-metadata.json
- Projects an anchor-delimited REGISTER section (--register flag + dials + STATUS=ASK MISSING_REGISTER) into the five wrappers
- Extends design-command-surface-check.mjs (policy shape + body presence); every prior D2 channel + frontmatter drift stays 0
-->
