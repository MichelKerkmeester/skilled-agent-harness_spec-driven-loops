---
title: "Feature Specification: Rollback, Audit Integrity & Non-Hub Policy"
description: "Closes the rollback/audit integrity holes in the activation and serving-flip drivers (activate-hub.cjs has no --rollback; flip-serving.cjs's serving-prior guard is first-flip-only and its fence epoch advances identically on rollback and forward-flip with no persisted direction; both audit files are plain overwrites, losing re-mint history), states an explicit non-hub single-skill-router ineligibility policy with negative fixtures, and names the P2 canary profile/owner/window/thresholds/rollback-trigger plus the routingRecommendation field-collision fix. Implemented and committed in a1cdb65d90; never edits the frozen scorer trio; touches an already-shipped sibling driver additively."
trigger_phrases:
  - "rollback audit integrity non-hub policy"
  - "activate-hub rollback flag"
  - "fence direction serving-prior"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Feature Specification: Rollback, Audit Integrity & Non-Hub Policy

## EXECUTIVE SUMMARY

The activation and serving-flip drivers have real rollback and audit integrity holes, and this session independently re-confirmed all of them by reading the live code (upgrading CF-ACT-8 from synthesis's own "INFERRED, single-model, not re-verified" to CONFIRMED). `activate-hub.cjs`'s `parseArgs()` (`007-unified-refactor-implementation/010-live-activation/lib/activate-hub.cjs:79-92`) accepts only `--hub/--child/--verify/--json` — there is no `--rollback`, even though the file already contains an internal `proveRollback()` function used only as a pre-flight dry-run check. `flip-serving.cjs` (`011-runtime-engine/lib/flip-serving.cjs`) already has its own `--rollback`, but its pre-flip `serving-prior` capture is guarded by `if (!fs.existsSync(servingPriorPath))` (~L124) — first-flip-only, so a forward re-flip after a rollback would NOT refresh the retained "prior," silently going stale. Both its rollback branch (~L105) and its forward-flip branch (~L128) call `nextFence = fence + 1` identically, so `fence-state.json` cannot distinguish a cutover advance from a recovery advance. Both `activation-record.json` (activate-hub.cjs, ~L244) and `serving-flip-record.json` (flip-serving.cjs, bottom of file) are plain `fs.writeFileSync` overwrites — re-mint history is lost on every re-run. Separately, ADR-002's "scales to any skill with no code edit" claim never states what happens to the four-to-five non-hub single-skill routers (`sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit` — 4 real, built children under the sibling `009-non-hub-rollout/`; `mcp-code-mode` — a fifth candidate with zero directory presence anywhere, not to be invented as a `005-` folder) — CF-ACT-9. And CF-ACT-11 leaves the P2 canary profile/owner/window/thresholds unnamed (`012-default-on-decision/checklist.md:66`'s CHK-004 is still unchecked) and a field-name collision live (`session-snapshot.ts`'s `routingRecommendation: string` is code-search guidance, not skill-router state). This packet closes all of it.

**Hard invariants:** the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) stay SHA-256-pinned and are never edited by this child; compiled routing stays byte-identical to legacy on every routing field — nothing here changes what a prompt routes to; every change ships a named, byte-exact rollback (this child's own subject matter IS rollback correctness, so its own changes must meet the same bar); no code this child adds or edits reads under `.opencode/specs`. This child depends on `002-runtime-promotion-and-status-foundation` and builds entirely behind the still-off `SPECKIT_COMPILED_ROUTING` flag. **This child modifies `activate-hub.cjs`, an already-shipped, Status: Complete sibling driver (`010-live-activation`) that has already activated all seven hubs** — every change to it must be additive and must not alter the forward-flip behavior those seven hubs already depend on.

> **Evidence provenance.** CF-ACT-8's `activate-hub.cjs:79-92,214,244` and CF-ACT-9's `013/checklist.md:68` citations are consolidated in `001-research/synthesis-v1.md` §2.1 and independently re-verified in `001-research/verification-v1.md` ("CONFIRMED — upgraded from synthesis's own INFERRED"). This session independently re-read `activate-hub.cjs` in full and `flip-serving.cjs:90-140` in full — both confirm the synthesis's claims exactly, and additionally confirm `flip-serving.cjs` already has its own `--rollback` (a distinct surface from `activate-hub.cjs`'s missing one), and that `serving-flip-record.json` is the second, previously-uncited plain-overwrite audit file alongside `activation-record.json`. Per `review-v1.md` §2, treat every other cited `file:line` as ±2–10 and re-anchor on the symbol at build time.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 — required for a complete, auditable cutover (`001-research/synthesis-v1.md` §5 P0→P4 graph places rollback/audit integrity and non-hub policy at P1) |
| **Status** | Implemented — landed in `a1cdb65d90`, behind the still-off flag; additive to two already-shipped drivers, no live hub flipped, frozen scorer trio SHA-256 unchanged |
| **Created** | 2026-07-20 |
| **Branch** | `010-rollback-audit-and-non-hub-policy` |
| **DAG Stage** | P1 (`001-research/synthesis-v1.md` §5: "Rollback & audit integrity holes" + "Non-hub archetype policy undefined" gate P4's per-hub `=0` kill-switch drill) |
| **Blast radius** | Medium — this child edits an already-shipped, Complete-status driver (`activate-hub.cjs`) that all seven hubs already depend on, plus a second live serving-flip driver (`flip-serving.cjs`); every change is additive (new flag, unconditional resave, new field, append-only sibling file) and none alters existing forward-flip behavior or any routing decision |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three related integrity gaps sit at the P1 rollback/audit/policy layer of the activation program. First, `activate-hub.cjs` — the P4a binding driver that already activated all seven hubs — has no `--rollback` verb; its `proveRollback()` function exists but is only ever invoked as an internal pre-flight check inside the normal activation flow, never as a standalone recovery command an operator can run against an already-committed hub. Second, `flip-serving.cjs` — the P4b serving-authority-flip driver — already has `--rollback`, but two of its own mechanics are unsafe: its `serving-prior` capture only fires on the very first flip (`if (!fs.existsSync(servingPriorPath))`), so a rollback followed by a re-flip would retain a stale prior instead of the state immediately before the re-flip; and its fence epoch advances identically (`nextFence = fence + 1`) on both the rollback and forward-flip code paths, so `fence-state.json` alone cannot answer "did this fence advance recover a hub or cut it over." Third, both drivers' audit files (`activation-record.json`, `serving-flip-record.json`) are plain overwrites — every re-run erases the previous record, so there is no history of prior activations, flips, or rollbacks for a given hub. Separately, ADR-002 (`012-default-on-decision/decision-record.md`) claims the compiled-routing approach "scales to any skill with no code edit," but never states what happens to `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit` (four real, built, shadow-only children under the sibling `009-non-hub-rollout/`, using a different `fenced-manifest.cjs`/no-`acceptance.json` archetype) or `mcp-code-mode` (a fifth non-hub candidate with no directory anywhere in the repo). And CF-ACT-11 leaves both the P2 canary's profile/owner/window/thresholds unnamed and a footgun live: `session-snapshot.ts`'s `SessionSnapshot.routingRecommendation: string` field is Grep-vs-code-graph search guidance, not skill-router state — a name collision anyone grepping for router posture would be misled by.

### Purpose

Add `--rollback` to `activate-hub.cjs` reusing its existing `proveRollback()` hash validation; fix `flip-serving.cjs`'s stale-`serving-prior` guard and give its fence state a persisted `direction`; convert both drivers' audit files to an append-only history; state an explicit, named non-hub ineligibility policy with negative fixtures; and name the P2 canary profile/owner/window/thresholds/rollback-trigger plus fix the `routingRecommendation` field collision. None of this changes a routing decision or a manifest's `selectedPolicy` on any already-activated hub except through the exact, proven rollback path this child builds.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `--rollback` to `activate-hub.cjs`, reusing the existing `proveRollback()` hash-validation logic as a real, committed recovery command (not only a pre-flight dry-run).
- Fix `flip-serving.cjs`'s stale `serving-prior` guard: unconditionally re-save the current manifest as `manifest.serving-prior.json` immediately before every forward flip.
- Persist a `direction` field (or, alternatively, stop advancing the fence on rollback and restore the prior epoch instead) in `fence-state.json` for both drivers, so cutover-advance and recovery-advance are distinguishable.
- Convert `activation-record.json` and `serving-flip-record.json` to also emit an append-only per-hub `flip-history.jsonl`, so re-mint history is never lost.
- Author an explicit "non-hub single-skill routers are ineligible by design" policy naming `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, and `mcp-code-mode`, with negative fixtures proving each stays on its legacy/shadow-only path.
- Name the P2 canary profile, promotion-owner role, observation window, pass/fail thresholds, and rollback trigger.
- Fix the `routingRecommendation` field-name collision in `session-snapshot.ts` (rename to `codeSearchRecommendation`, add a typed `skillRouterStatus`) and require a live router-status probe before a router-cutover-relevant packet's resume/priming sufficiency early-exit.

### Out of Scope

- Editing `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs` (the frozen trio) — [why] hard invariant.
- Editing any file inside a sibling spec-folder packet (`009-non-hub-rollout/`, `012-default-on-decision/`, `013-create-skill-alignment/`) — [why] scope-lock; this child cross-references those packets' evidence and open checklist items but writes only inside its own three-child authoring scope. The `009-non-hub-rollout/spec.md` Phase Documentation Map undercount (1 of 4 children listed) is a real, independently-observed drift but is that packet's own fix, not this child's deliverable.
- Changing which hub is currently `servingAuthority: compiled` on any of the seven already-activated hubs, except through the exact rollback path this child builds and proves — [why] this child adds recovery capability, it does not re-run or re-decide any prior activation.
- The P4 staged cutover itself, or the actual canary run — [why] owned by `011-activation-cutover-p4`; this child only names the canary's profile/owner/window/thresholds as a contract for 011 to execute against.
- ADR-003 promotion mechanics — [why] owned by `002-runtime-promotion-and-status-foundation`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `007-unified-refactor-implementation/010-live-activation/lib/activate-hub.cjs` (`parseArgs` ~L79-92; manifest-swap ~L214; `activation-record.json` write ~L244) | Modify | Add `--rollback` reusing `proveRollback()`; add append-only history emission |
| `007-unified-refactor-implementation/011-runtime-engine/lib/flip-serving.cjs` (~L90-140) | Modify | Unconditional `serving-prior` resave before every forward flip; persist `direction` in `fence-state.json`; add append-only history emission |
| `007-unified-refactor-implementation/010-live-activation/activation/<hub>/flip-history.jsonl` (per hub, 7 hubs) | Create | New append-only audit sibling consumed by both drivers |
| `.opencode/skills/system-skill-advisor/references/non-hub-router-eligibility-policy.md` (proposed location; confirm at build time) | Create | The named non-hub ineligibility policy + negative-fixture contract |
| `.opencode/skills/system-skill-advisor/references/compiled-routing-canary-profile.md` (proposed location; confirm at build time) | Create | The named P2 canary profile/owner/window/thresholds/rollback-trigger |
| `.opencode/skills/system-spec-kit/mcp-server/lib/session/session-snapshot.ts` (`SessionSnapshot.routingRecommendation` ~L33; construction ~L161-167) | Modify | Rename to `codeSearchRecommendation`; add typed `skillRouterStatus` |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml` (~L110) | Modify | Require a live router-status probe before the sufficiency early-exit for router-cutover-relevant packets |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts` (~L292) | Modify | Same sufficiency-probe requirement on the priming path |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | `activate-hub.cjs --rollback` (CF-ACT-8, activate-hub.cjs half). | `parseArgs()` accepts `--rollback`; the new mode restores the retained prior manifest via the existing `proveRollback()` byte-exact hash validation as a real, committed state change (not only a pre-flight drill); `selectedPolicy` reverts to the prior generation; `servingAuthority`/`shadowOnly` are asserted unchanged by the rollback (P4a's binding layer never touches serving authority); the committed activated state for every OTHER hub is untouched. |
| REQ-002 | Fix `flip-serving.cjs`'s stale `serving-prior` guard (CF-ACT-8, flip-serving.cjs half). | The `if (!fs.existsSync(servingPriorPath)) fs.writeFileSync(...)` first-flip-only guard is replaced with an unconditional re-save of the current manifest as `manifest.serving-prior.json` immediately before every forward flip; a rollback-then-reflip sequence retains the state immediately before the re-flip, not the original first-ever prior. |
| REQ-003 | Persist fence `direction` (or stop advancing on rollback) (CF-ACT-8). | `fence-state.json` (for both `activate-hub.cjs`'s new rollback path and `flip-serving.cjs`'s existing rollback/forward paths) either (a) records `direction: 'forward' \| 'rollback'` alongside `fencingEpoch`, or (b) restores the PRIOR fence epoch on rollback instead of advancing past it — exactly one approach is chosen and documented, not left ambiguous; fence history is reconstructable as cutover-vs-recovery from the persisted state alone. |
| REQ-004 | Append-only audit history (CF-ACT-8). | `activation-record.json` and `serving-flip-record.json` both gain an append-only per-hub `flip-history.jsonl` sibling recording every CAS/flip/rollback event as one JSON line; the existing single-record files may remain as a "latest" snapshot, but re-mint history is never lost. |
| REQ-005 | Explicit non-hub archetype ineligibility policy (CF-ACT-9). | A policy document names `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, and `mcp-code-mode` as ineligible for the seven-hub compiled-routing activation path by design (different archetype: `fenced-manifest.cjs`, no `acceptance.json`); the document correctly distinguishes the 4 real, built `009-non-hub-rollout/` children from `mcp-code-mode`'s zero-directory candidate status and explicitly states no `005-mcp-code-mode` folder is to be created; cross-references `013-create-skill-alignment/checklist.md:68` CHK-023 as the sibling item this policy informs (informational cross-reference; this child does not edit 013's files); negative fixtures prove each of the 5 stays on its legacy/shadow-only path under the compiled-routing eligibility check. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-006 | Name the P2 canary profile/owner/window/thresholds/rollback-trigger (CF-ACT-11, canary half). | A decision-record-shaped document names: the canary profile (the exact environment/flag-state combination under observation), the promotion-owner ROLE (an explicit operator-fill placeholder — this child does not invent a named human owner), the observation window, the pass/fail thresholds, and the rollback-trigger condition; cross-references `012-default-on-decision/checklist.md:66` CHK-004 as the sibling item this satisfies (informational; this child does not edit 012's files). |
| REQ-007 | Fix the `routingRecommendation` field collision + require a live router-status probe before sufficiency early-exit (CF-ACT-11, remaining half). | `session-snapshot.ts`'s `SessionSnapshot.routingRecommendation: string` is renamed to `codeSearchRecommendation`; a new typed `skillRouterStatus` field is added, its shape cross-referencing 002's status-probe contract (CF-ACT-5) rather than redefining it; `speckit-resume-auto.yaml` and `session-prime.ts` require a live router-status probe before declaring context sufficient for a router-cutover-relevant packet, rather than early-exiting without one. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `activate-hub.cjs --hub <id> --rollback` restores the byte-identical prior manifest for that hub, proven via `proveRollback()`, without touching any other hub's committed state.
- **SC-002**: A rollback-then-reflip sequence on `flip-serving.cjs` retains the correct, current `serving-prior` — not the original first-flip prior.
- **SC-003**: `fence-state.json` (or the chosen alternative) makes cutover-advance and recovery-advance distinguishable for every fence transition, old and new.
- **SC-004**: `flip-history.jsonl` (per hub) accumulates every CAS/flip/rollback event; no prior event is ever erased by a subsequent one.
- **SC-005**: The non-hub ineligibility policy names all 5 candidates correctly (4 real children + 1 zero-directory candidate) and its negative fixtures all pass — none of the 5 is ever treated as compiled-routing-eligible.
- **SC-006** (P1): The canary profile/owner/window/thresholds/rollback-trigger are named in a single, findable document; the owner field is honestly marked as an operator-fill placeholder, not fabricated.
- **SC-007** (P1): `session-snapshot.ts` no longer has a field literally named `routingRecommendation` that carries code-search guidance; a live router-status probe is required before the resume/priming sufficiency early-exit for router-cutover-relevant packets.
- **SC-008**: No file in this child's diff touches `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs`; pre/post SHA-256 are unchanged; no already-activated hub's `servingAuthority` or `selectedPolicy` changes except through the proven rollback path this child adds.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-runtime-promotion-and-status-foundation` | Sequencing baseline per the Phase Map; REQ-007's `skillRouterStatus` field shape should cross-reference 002's status-probe contract (CF-ACT-5) once it exists | Design `skillRouterStatus` as a thin cross-reference, not a redefinition, so it can adopt 002's shape once available |
| Risk | `activate-hub.cjs` is an already-shipped, Complete-status driver that activated all seven hubs | A careless change could regress the forward-flip path all seven hubs already depend on | Every change here is additive (new `--rollback` mode, new history emission); the existing forward-activation code path is not touched; re-run the existing seven-hub activation as a regression check after this child's changes |
| Risk | `flip-serving.cjs`'s stale `serving-prior` fix changes behavior on the SECOND forward flip for a hub that has already flipped once | Existing hubs that flip again (e.g., after a manual rollback) would see different `serving-prior` bytes than today's buggy behavior would have produced | This is the intended fix, not a regression — CF-ACT-8 explicitly identifies the current first-flip-only behavior as the bug; document the behavior change explicitly in this child's completion evidence |
| Risk | Inventing a `005-mcp-code-mode` folder by mistake | Would misrepresent `mcp-code-mode`'s actual zero-directory, not-yet-onboarded status as an existing-but-undocumented child | REQ-005's acceptance criteria explicitly forbid creating such a folder; the policy document states the distinction in writing |
| Risk | Naming a specific human "owner" for the P2 canary without operator input | Would fabricate an organizational fact this child has no authority to assert | REQ-006 requires the owner field to be an explicit placeholder, never a fabricated name |
| Dependency | `009-non-hub-rollout/` (4 real children), `012-default-on-decision/checklist.md:66`, `013-create-skill-alignment/checklist.md:68` | This child's policy and canary docs cross-reference these sibling packets' evidence and open items | Cross-reference only; no edit to any of these sibling packets' files from this child |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: `activate-hub.cjs --rollback` and `flip-serving.cjs --rollback` are both deterministic, offline, zero-network operations reusing the existing hash-validation logic.

### Reversibility
- **NFR-R01**: Every change in this child is itself reversible by a plain file revert; none introduces a state this child's own rollback cannot undo. This child's subject is rollback correctness, so its own changes are held to the same bar they enforce.

### Auditability
- **NFR-AU01**: After this child ships, every CAS/flip/rollback event for every hub is reconstructable from `flip-history.jsonl` alone, without relying on the (still-present but now non-authoritative-for-history) single-record snapshot files.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Precondition failures
- `activate-hub.cjs --rollback` invoked for a hub with no retained prior manifest: fails closed with a clear error, exactly like `flip-serving.cjs`'s existing `--rollback` does today (`no serving-prior to roll back to for ${hubId}`).
- A negative fixture for one of the 5 non-hub candidates accidentally matching an eligibility check due to a future code change: the fixture fails loudly, not silently passing.

### Idempotency and re-runs
- `activate-hub.cjs --rollback` run twice in a row: the second run is a no-op (already at the prior generation) that still appends a `flip-history.jsonl` entry recording the no-op.
- A hub that has never been rolled back: `flip-history.jsonl` contains only forward-flip entries; no rollback entry is fabricated.

### Boundary integrity
- A rollback attempted mid-way through a forward-flip's own write sequence: the fenced compare-and-swap's existing atomicity guarantees still apply; this child does not weaken them.
- The append-only `flip-history.jsonl` growing unbounded over a long program lifetime: out of scope for this child to add rotation/truncation; flagged as a future concern, not silently handled.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two driver fixes (one new flag, one guard fix), one fence-semantics decision, one new audit format, one policy doc, one canary-naming doc, one field rename + probe requirement |
| Risk | 15/25 | Touches an already-shipped, Complete-status driver that all seven activated hubs depend on; every change is additive but the blast surface (activation state for 7 live hubs) is real |
| Research | 6/20 | The drivers were read in full this session (upgraded from INFERRED to CONFIRMED); residual work is the fence-direction design choice and the canary profile's concrete thresholds |
| **Total** | **35/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `fence-state.json` gain a persisted `direction` field, or does rollback instead restore the prior fence epoch without advancing past it? REQ-003 requires one approach chosen and documented — decide at build time based on which is simpler to keep consistent across both `activate-hub.cjs` and `flip-serving.cjs`.
- Where should the non-hub ineligibility policy and the canary-profile documents durably live — the proposed `system-skill-advisor/references/` location, or somewhere under `012-default-on-decision/` (which this child cannot edit but could later absorb the content)? Confirm the durable home at build time; this child's own scope is limited to authoring the content, not contesting its eventual filing location.
- Who names the actual human owner for the P2 canary promotion role? This child produces the naming CONTRACT (profile/window/thresholds/trigger + an owner placeholder); filling the owner name is an operator decision outside this child's authority.
- Does REQ-007's `session-snapshot.ts`/`speckit-resume-auto.yaml`/`session-prime.ts` work belong in this child, or is it better sequenced as part of `002`'s status-probe wiring (since `skillRouterStatus`'s shape depends on 002's contract)? Resolve at build time; flagged here as a legitimate sequencing question, not a scope gap.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` §2.1 (CF-ACT-8, CF-ACT-9, CF-ACT-11), `../001-research/verification-v1.md`, `../001-research/review-v1.md` §2-4
