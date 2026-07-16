---
title: "Feature Specification: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline"
description: "Four fixes to the package-009 validation-hardening tooling that a three-angle Fable-5 review of shipped packages 006-011 confirmed live: check-evidence.sh's substance checker can be satisfied by a filename mention in a task's own subject line and now wrongly flags a legitimate [DEFERRED: ...] marker; status-classifier.sh and its duplicate in strict-pass-freshness.ts do not recognize Implemented as a valid status, leaving the cross-doc consistency check blind on two packets that use it today; the two classifier copies have no shared source or cross-reference comment; and strict-pass-freshness.ts treats an empty/missing baseline as everything-previously-passing, misreporting first-run failures as regressions."
trigger_phrases:
  - "validation hardening tooling fixes"
  - "evidence substance checker loophole"
  - "status classifier implemented blind spot"
  - "duplicated status enum drift"
  - "freshness sweep first run regression"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh"
      - ".opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-015-validation-hardening-fixes"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "DEFERRED-marker exemption: unconditional bypass beyond the existing trivial-placeholder case-statement (no new minimum-length floor) — matches spec's own risk-mitigation text."
      - "F9 cross-reference: paired comments (not a shared literal list) — matches existing bash/TS duplication precedent and the plan's Out-of-Scope bar on new shared-config tooling."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented, with 2 out-of-scope findings flagged for operator review (see Problem Statement addendum below) |
| **Created** | 2026-07-09 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-speckit/029-memory-search-intelligence |
| **Handoff Criteria** | All 6 REQs implemented and verified; `validate.sh --strict` PASSED on this folder; not yet committed (operator instructed no commit/push this turn) |
| **Predecessor** | ../008-validation-integrity-hardening/spec.md |
| **Successor** | ../010-validation-enforce-graduation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers four findings (F6, F7, F9, F10) from a three-angle Fable-5 review (correctness/quality, architecture consistency, risk/blast-radius) of packages 006-011 under this parent, all already shipped and passing `validate.sh --strict`. All four findings target the package-009 (`009-validation-integrity-hardening`) validation tooling itself — the bash rules and TypeScript sweep script that `validate.sh` runs — not any daemon or hot-path code. None of the other findings from that review (F1-F5, F8, F11-F15; F16 already fixed separately) belong to this phase; they are scoped to sibling phases.

**Scope Boundary**: `scripts/rules/check-evidence.sh`'s `evidence_item_has_substance` function, `scripts/lib/status-classifier.sh`'s `classify_status` function, and `scripts/sweep/strict-pass-freshness.ts`'s `classifyStatus` function and `runValidate`'s baseline-comparison logic. No changes to `mcp_server/` daemon code, no changes to any other validate.sh rule.

**Dependencies**: None upstream. Independent of the other 028 phases covering the same review round (sibling phases own F1-F5, F8, F11-F15).

**Priority**: F7 (status classifier) is the highest-priority fix in this phase and is sequenced first in `plan.md`/`tasks.md` — unlike F6/F9/F10, its blind spot is confirmed live today against two of this parent's own shipped sibling packets (see Problem Statement below), not a hypothetical or latent gap.

**Deliverables**:
- `status-classifier.sh`'s `classify_status` and `strict-pass-freshness.ts`'s `classifyStatus` both recognize `Implemented` (and `implementing`) as the `complete` bucket.
- Both status-enum copies carry a paired cross-reference comment (or a shared constant, per the plan's recommendation) so a future status addition to one is a visible prompt to update the other.
- Once the classifier fix lands, `STATUS_CROSS_DOC_CONSISTENCY` is re-run against `006-presentation-layer-fixes` and `010-query-channel-calibration` and any mismatch it now correctly surfaces is reconciled — closing the loop the classifier fix itself opens (REQ-006).
- `check-evidence.sh`'s bare-filename-mention pattern no longer counts as evidence on its own (closes the self-referencing-filename loophole), and a `[DEFERRED: ...]` marker with a genuine (non-trivial) reason is recognized as sufficient explanation again without needing to independently pass the evidence-shape checks meant for `[EVIDENCE: ...]` content.
- `strict-pass-freshness.ts`'s `runValidate` no longer classifies every current failure as a `regression` when there is no prior baseline; a first-run/no-baseline failure gets a distinct, correctly-labeled status.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**F6 — the evidence "substance" checker has two live defects, a false-negative loophole and a false-positive regression, both in `evidence_item_has_substance()` (`check-evidence.sh:30-68`).**

1. *Loophole:* `check-evidence.sh:49` — `if [[ "$normalized" =~ [A-Za-z0-9_./-]+\.(ts|tsx|js|mjs|cjs|sh|md|json|jsonc|yml|yaml|py) ]]; then return 0; fi` matches ANY filename mention anywhere in the checklist/task line, with no requirement that it appear alongside a line number, a result, or an "Evidence:" trailer. A checklist item such as `- [x] T001 Update memory-search.ts routing table` normalizes to `T001 Update memory-search.ts routing table` (32+ chars, passes the length gate at line 44), and the bare-filename regex matches `memory-search.ts` in the item's own subject text — the item "proves" itself just by naming the file it changed, with zero evidence content. The adjacent, stricter `filename:linenum` pattern (line 46) is legitimate evidence and is not the problem; the bare-filename variant at line 49 is the loophole.
2. *Regression:* `check-evidence.sh:36` extracts the text inside a `[deferred: ...]` or `[evidence: ...]` bracket (`remainder`) and, after the trivial-placeholder case-statement (lines 38-42), the same length (line 44) and shape checks (lines 46-66) built for `[EVIDENCE: ...]` content also gate `[DEFERRED: ...]` content. A real, non-trivial deferral reason like `[DEFERRED: blocked on operator decision]` is not a placeholder (skips the case statement), passes the length gate, but is plain prose with no filename, backtick, fraction, percent, or test-tool keyword — it fails every shape check and gets flagged as missing evidence. `git log -p` on this file confirms an earlier version had an unconditional "Pattern 5: `[DEFERRED: ...]` counts as explained" bypass that a later revision removed when the substance checks were tightened, without re-adding an equivalent bypass scoped to `deferred` (as opposed to `evidence`) markers. A deferral marker is a documented disposition, not a proof of completed work; it should not need to look evidence-shaped to count.

Both defects are confirmed, not theorized: running `evidence_item_has_substance()` directly against a `checklist.md`-style fixture line shows a filename-only line (no line number, no other evidence signal) passing the check when it should not, and a genuine `[DEFERRED: blocked on operator decision]` marker being flagged as missing evidence when it should not be. Both outcomes reproduce live against the current source, not just against a reading of the regex.

**F7 — the status classifier has a confirmed live blind spot on `Implemented`.** `status-classifier.sh:36` — the `complete` bucket regex is `(complete|completed|done|shipped|delivered|finished|closed)` — does not include `implemented`. The byte-identical duplicate at `strict-pass-freshness.ts:97` has the same gap. `STATUS_CROSS_DOC_CONSISTENCY` (`check-status-cross-doc-consistency.sh:36-43`) classifies both `spec.md` and `implementation-summary.md` Status fields and, when either bucket is `unknown`, declares the check "not applicable" — silently skipping the exact cross-doc drift check it exists to run. This is not hypothetical: `006-presentation-layer-fixes/spec.md:57` (`Status: Implemented, with broad-suite caveat documented in implementation-summary.md`) and `010-query-channel-calibration/spec.md:54` (`Status: Implemented, verification-limited`) are two of this same parent's own shipped sibling packets using exactly that status string today. Running `validate.sh --strict` on `006-presentation-layer-fixes` directly confirms the skip: `+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; one status is missing or unclassified`.

**F9 — the same status-bucket list is duplicated with no shared source or cross-reference.** `status-classifier.sh:36` (bash) and `strict-pass-freshness.ts:97` (TypeScript) hand-encode the identical `complete` bucket word list (and the parallel `in-progress`/`planned` lists at `status-classifier.sh:41,46` and `strict-pass-freshness.ts:98-99`) independently, with no comment in either file pointing at the other. They agree today only because both were authored in the same package-009 pass. This is explicitly not a behavior bug on its own — it is a maintenance-hazard: the next person who adds a new recognized status word to one copy (as F7's fix is about to do) has no signal that a second copy exists and needs the identical edit, so the two will silently drift the next time either file is touched in isolation.

This is confirmed, not assumed: directly diffing both word lists today shows they are still byte-identical — no drift has happened yet — which is exactly what makes this a live-but-currently-silent hazard rather than an already-manifested bug; F7's own fix is the next edit that would trigger the drift if REQ-004 is not also applied alongside it.

**F10 — `strict-pass-freshness.ts` misclassifies every first-run failure as a regression.** `strict-pass-freshness.ts:172` — `const wasBaselinePass = baselinePasses.size === 0 || baselinePasses.has(relativeFolder);` — when there is no baseline file, or the baseline's `results` array is empty, `readBaseline()` (line ~152, not separately cited above) returns an empty `Set`, so `baselinePasses.size === 0` is true for every folder, and the `||` short-circuits to `true` regardless of whether that specific folder was ever actually a recorded pass. Line 173's `if (failed && wasBaselinePass)` then reports status `'regression'` for every currently-failing folder on the very first invocation of this sweep anywhere (no baseline has ever been captured yet) — even though nothing "regressed," since there was nothing to regress from. This is low severity: it does not suppress a real regression (the false condition only ever makes the check MORE alarming, never less), it just produces misleading noisy output the first time the sweep runs.

This is confirmed by an actual no-baseline run, not inferred from reading the diff logic: invoking the sweep with no `--baseline` flag against a folder carrying a real, already-known-failing check reports that known failure as `'regression'`, not as a first-run/unknown result — a real known failure mislabeled, not a hypothetical one.

### Purpose
Fix the evidence-substance checker's loophole and its DEFERRED-marker regression together (they share one function and one root cause: the same shape-check gate was applied to two different marker types with different legitimate content), recognize `Implemented` in both status-classifier copies, add a durable cross-reference between the two copies so the next status addition does not repeat F9, and correct the freshness sweep's baseline-absent classification so a first run reports "unknown/first-run" rather than a spurious "regression."

### Implementation Findings (post-implementation addendum)

**Correction made during implementation, not deferred:** REQ-003's literal instruction ("add `implemented`/`implementing` to the `complete` bucket regex") was implemented as a single-word addition first, then empirically tested — this collided with the pre-existing `not implemented` / `not yet implemented` phrasing the `planned` bucket already owns. `classify_status "Not Implemented"` regressed to `complete` under the naive addition; confirmed live against real packets still on disk today (`system-skill-advisor/008-skill-advisor-cli/{001,002,003}/spec.md`, `system-deep-loop/z_archive/009-.../009-fanout-remediation/implementation-summary.md`, four `z_future/code-graph-and-cocoindex/002-code-graph-trace/*/implementation-summary.md` files, all literally `Status: Not implemented` or `Status: Planned (not implemented)`). Bash's `[[ =~ ]]` has no lookbehind, so the fix adds a second, separately-guarded check: `implemented`/`implementing` counts as `complete` only when not immediately preceded by `not (yet )`. Re-verified: `not implemented` → `planned` (correct), `implemented` / `Implemented, verification-limited` → `complete` (REQ-003 satisfied), `not started` → `in-progress` (pre-existing, unrelated collision between the `planned` and `in-progress` buckets, left untouched — out of this phase's scope; not introduced by this change).

**Finding 1 — `check-scaffold-never-touched.sh` newly fails on `010-query-channel-calibration` (not fixed, flagged for operator decision):** the plan's own Phase 1 task hedged "confirm during implementation rather than assuming" that this rule "matches the raw Status string directly rather than through `classify_status`." Direct inspection confirms it does NOT — `check-scaffold-never-touched.sh:45` calls `classify_status` directly. Once REQ-003 lands, `010-query-channel-calibration` (real Status: `Implemented, verification-limited`) newly classifies as `complete`, and `SCAFFOLD_NEVER_TOUCHED` — previously always early-exiting for this packet since it never classified as `complete` before — now correctly runs its scan and finds 4 real, pre-existing scaffold-signature markers still present: `plan.md:2`, `tasks.md:2`, `implementation-summary.md:2`, `checklist.md:2` all still carry literal `[template:level_2/...]` text in their frontmatter `title` fields. This is a genuine, real defect in `010`'s own docs that F7's bug was masking, not a bug introduced by this fix — `SCAFFOLD_NEVER_TOUCHED` is working exactly as designed. It is NOT fixed here: this phase's Files-to-Change table only conditionally authorizes editing `006`/`010`'s `spec.md`/`implementation-summary.md` for REQ-006's Status-field reconciliation, not `plan.md`/`tasks.md`/`checklist.md` frontmatter titles, and REQ-006 itself only names `STATUS_CROSS_DOC_CONSISTENCY`, not `SCAFFOLD_NEVER_TOUCHED`. `006-presentation-layer-fixes` was audited the same way and has no scaffold markers (clean).

**Finding 2 — closing the F6 loophole flips already-shipped folders' `EVIDENCE_CITED` result repo-wide (not fixed, flagged for awareness).** **CORRECTION (independently re-verified 2026-07-09, ~21:06–21:26 CEST):** the original disclosure here ("83 of 2,121 folders repo-wide; 5 within this packet's own 028 parent — 009, 010, 011, 012, 014") was wrong on both the within-parent breakdown and, less severely, the repo-wide total. Neither `check-evidence.sh` nor `status-classifier.sh`/`strict-pass-freshness.ts` have git history capturing the intermediate post-009/pre-015 state (this packet's own tooling changes are still uncommitted in this branch's working tree), so the pre-fix `evidence_item_has_substance()` was reconstructed line-for-line from this section's own line-49/line-36-44 quotes above and independently re-run against the real, on-disk `checklist.md`/`tasks.md` of every sibling folder.

*Within-parent breakdown (corrected):* only **`009-validation-integrity-hardening`** (0→9 missing) and **`010-query-channel-calibration`** (0→2 missing, both bare `spec.md`/`plan.md` mentions with no line number, in `checklist.md:58-59`) flip `pass`→`warn`. `012-orphan-sweep-scoped-scan-safety`, `013-drift-marker-pipeline-resilience`, and `014-self-healing-internals-hardening` report **zero** missing-evidence items in both the reconstructed pre-fix and the real post-fix run — they never relied on the bare-filename loophole and do not flip, so the original list's inclusion of `012`/`014` was a fabrication, not a rounding error. `011-automatic-drift-self-healing` is the one genuinely time-sensitive case: an initial pass (matching the original disclosure) found it flipping (0→14 missing), but a concurrent, unrelated editing session in this same repo modified `011`'s `checklist.md`/`tasks.md` mid-investigation (confirmed via file mtimes, 21:15–21:16 CEST, files marked `??` untracked in git) to add real evidence content; a second re-test against a frozen snapshot taken immediately afterward (21:25:50 CEST) shows `011` no longer flips. The original claim of "011 flips" was accurate at some earlier point but is not accurate now, and `012`/`014` were never accurate at any point checked.

*Repo-wide figure (corrected, re-scoped):* re-running the same reconstructed-vs-real comparison across every `checklist.md`/`tasks.md`-bearing folder under `.opencode` (2,235 folders as of this re-verification — deliberately excluding `.worktrees/`, which holds ~19,600 duplicate `checklist.md` copies from git-worktree checkouts of the same repository content, not independent folders, and which was very likely also excluded from the original "2,121" count since that figure is far closer to the `.opencode`-only total) shows **80 folders flip `pass`→`warn`, 0 flip the other way** — not 83 of 2,121. The gap between 80 and 83 is not attributable to a single identified cause; plausible contributors include the original scan's undocumented exact folder-set definition (e.g. whether `test-fixtures/` synthetic packets were included) and this same repo's live concurrent-editing activity (one other in-flight, unrelated edit — to `016-cross-package-flag-governance/tasks.md`, created mid-scan — was also observed during this re-verification window; it does not flip). Given the repo is under active concurrent edit outside this packet's control, an exact repeat of the original 83 is not achievable and this note treats its own 80/2,235 figure as a timestamped snapshot, not a permanently fixed constant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `evidence_item_has_substance()` in `check-evidence.sh`: remove or tighten the bare-filename-without-context match (line 49) so a filename mention alone, with no line number, backtick output, fraction/percent, or recognized test-tool keyword, no longer counts as evidence on its own.
- The same function: restore a bypass scoped specifically to non-trivial `[DEFERRED: ...]` content (distinct from `[EVIDENCE: ...]` content, which keeps the existing shape checks), so a real deferral reason is not required to look evidence-shaped.
- `classify_status()` in `status-classifier.sh`: add `implemented`/`implementing` to the `complete` bucket regex.
- `classifyStatus()` in `strict-pass-freshness.ts`: the identical addition, kept byte-for-byte equivalent to the bash regex's word list.
- A cross-reference comment (or a shared constant/data file, per the plan's recommendation) linking the two classifier copies so a future status-word addition to either file visibly points at the other.
- `runValidate()` in `strict-pass-freshness.ts`: replace the single `wasBaselinePass` boolean with logic that distinguishes "no baseline exists at all" from "this folder was a recorded baseline pass," and report a distinct status (not `'regression'`) for the no-baseline case.
- Once REQ-003 lands: re-run `STATUS_CROSS_DOC_CONSISTENCY` against `006-presentation-layer-fixes` and `010-query-channel-calibration` (the two real packets it is blind to today) and reconcile whatever mismatch the now-unblocked check surfaces, if any — a docs-only edit to the affected packet's own `Status` field, or a recorded note that the difference is intentional (REQ-006).

### Out of Scope
- F1-F5, F8, F11-F15 from the same review round — covered by sibling 028 phases, not this one.
- F16 (ENV_REFERENCE.md missing new flags) — already fixed in a prior documentation pass, not re-planned here.
- Any change to `check-status-cross-doc-consistency.sh`'s own logic beyond what F7's classifier fix causes it to newly recognize; the cross-doc rule's advisory-vs-enforce behavior (`SPECKIT_STATUS_CROSS_DOC_ENFORCE`) is unchanged.
- Any change to `check-scaffold-never-touched.sh`, which also sources `status-classifier.sh` but is not implicated by any of F6/F7/F9/F10.
- Building a general-purpose bash/TypeScript shared-config-loading mechanism; F9's fix is a targeted comment or a small literal list, not new build tooling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` | Modify | F6: tighten the bare-filename match (`:49`), restore a scoped DEFERRED-marker bypass (`:36-44`) |
| `.opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh` | Modify | F7+F9: add `implemented` to the `complete` bucket regex (`:36`), add cross-reference comment |
| `.opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts` | Modify | F7+F9: mirror the `complete` bucket regex addition (`:97`), add cross-reference comment. F10: fix `wasBaselinePass` classification (`:172-173`) |
| tests alongside `check-evidence.sh`, `status-classifier.sh`, `strict-pass-freshness.ts` (if any exist; create if not) | Create/Modify | Regression coverage for each of the four fixes |
| `006-presentation-layer-fixes/spec.md` and/or `010-query-channel-calibration/spec.md` (or their `implementation-summary.md`) | Conditional | REQ-006 only: docs-only edit if `STATUS_CROSS_DOC_CONSISTENCY` surfaces a real mismatch once `Implemented` becomes classifiable; no edit if the re-run shows clean agreement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `evidence_item_has_substance()` SHALL NOT treat a bare filename mention (no line number, no other evidence signal) as sufficient evidence. | A checklist.md fixture line whose only evidence-shaped content is a filename mention in its own subject text (e.g. `- [x] T001 Update memory-search.ts routing table`, no `:linenum`, no backtick, no fraction/percent, no test-tool keyword) — confirmed pre-fix to incorrectly pass `evidence_item_has_substance()` today — is reported as missing evidence after the fix. A line with `filename.ts:123` still passes (existing legitimate pattern untouched). |
| REQ-002 | `evidence_item_has_substance()` SHALL recognize a non-trivial `[DEFERRED: ...]` reason as sufficient explanation without requiring it to independently match the evidence-shape checks. | A checklist.md fixture line `[DEFERRED: blocked on operator decision]` (or equivalent, non-placeholder reason) — confirmed pre-fix to be incorrectly flagged as missing evidence today — is reported as having substance after the fix. A trivial `[DEFERRED: tbd]` (or another word already in the existing placeholder case-statement) still fails, so an empty rubber-stamp deferral is not accepted either. |
| REQ-003 | `classify_status()` (bash) and `classifyStatus()` (TypeScript) SHALL both classify an `Implemented`/`Implementing` status string into the `complete` bucket. | `classify_status "Implemented, with broad-suite caveat documented in implementation-summary.md"` returns `complete`. Re-running `validate.sh --strict` on `006-presentation-layer-fixes` and `010-query-channel-calibration` no longer reports `STATUS_CROSS_DOC_CONSISTENCY: ... not applicable; one status is missing or unclassified` for the previously-`unknown` side; it either passes (buckets agree) or correctly runs its advisory/enforce comparison (buckets now both classified, so any real disagreement is caught). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two status-bucket word lists SHALL carry a cross-reference comment (or be backed by one shared source) so a future edit to one file's status list has a visible prompt to check the other. | Both `status-classifier.sh:36` (and its sibling `in-progress`/`planned` lines) and `strict-pass-freshness.ts:97` (and its siblings) carry a comment naming the other file's path and line, OR both read from one shared list. `plan.md` records which of the two mechanisms was chosen and why. |
| REQ-005 | `strict-pass-freshness.ts`'s `runValidate()` SHALL NOT classify a currently-failing folder as `'regression'` when no prior baseline exists for it. | With `readBaseline()` returning an empty `Set` (no `--baseline` flag, missing file, or empty `results` array), a currently-failing folder is reported with a status distinct from `'regression'` (e.g. `'unknown'` or a new `'first-run'` value), and the summary/output text does not claim a regression occurred — confirmed pre-fix that a no-baseline run against a real, already-known-failing folder is mislabeled `'regression'` today. When a real baseline IS supplied and the folder was a recorded pass, a currently-failing folder still correctly reports `'regression'` (existing behavior preserved). |
| REQ-006 | Once REQ-003 lands, `STATUS_CROSS_DOC_CONSISTENCY` SHALL be re-run specifically against `006-presentation-layer-fixes` and `010-query-channel-calibration` — the two real packets whose `Implemented` status is invisible to the check today — and any mismatch the check now correctly surfaces for either packet SHALL be reconciled (aligning the differing `Status` field, or recording an explicit note that the difference is intentional) before this phase is treated as complete. This closes the loop that REQ-003's fix itself opens: making `Implemented` classifiable turns a silent skip into a real comparison, and a real comparison can fail. | `validate.sh --strict` is re-run on both packets after REQ-003 lands. If `STATUS_CROSS_DOC_CONSISTENCY` reports a genuine disagreement (not the previous "not applicable" skip) for either packet, the disagreement is resolved via a docs-only edit or an explicit intentional-difference note, and a follow-up re-run confirms the expected pass/advisory outcome. If both packets agree with no disagreement, that clean outcome is recorded explicitly rather than left unstated. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The self-referencing-filename loophole in `check-evidence.sh` is closed (REQ-001) without breaking any currently-passing packet's `EVIDENCE_CITED` result — verified by re-running `validate.sh --strict` on a representative sample of shipped packets alongside the fix.
- **SC-002**: A real `[DEFERRED: ...]` marker with a genuine, non-trivial reason is no longer wrongly flagged (REQ-002), while an empty/placeholder deferral is still caught.
- **SC-003**: `STATUS_CROSS_DOC_CONSISTENCY` is no longer blind to `Implemented`/`Implementing` statuses (REQ-003), confirmed against the two real sibling packets that use that status today.
- **SC-004**: The two status-classifier copies carry a durable cross-reference so the next status-word addition does not silently repeat F9 (REQ-004).
- **SC-005**: `strict-pass-freshness.ts`'s first invocation against a fresh (no-baseline) run reports first-run/unknown status rather than false regressions (REQ-005), while a genuine regression against a real baseline still reports correctly.
- **SC-006**: Typecheck/build (for the TypeScript sweep), any existing focused tests for these three files, and `validate.sh --strict` on this folder all pass.
- **SC-007**: The cross-doc consistency loop that REQ-003's fix newly opens on `006-presentation-layer-fixes` and `010-query-channel-calibration` is closed, not left half-open — any mismatch `STATUS_CROSS_DOC_CONSISTENCY` now correctly surfaces for either packet is reconciled, or their clean agreement is explicitly recorded (REQ-006).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tightening the bare-filename match (REQ-001) could newly flag a checklist item that was legitimately relying on that pattern as a lighter-weight (but real) evidence signal. | Low-Med | **REALIZED, confirmed benign.** Independently re-verified 2026-07-09: 80 of 2,235 `.opencode` folders flip `pass`→`warn`, 0 the other way (corrected from an earlier, uncorroborated "83 of 2,121" figure — see Implementation Findings' Finding 2 for full methodology and caveats). Spot-checked flipped lines — all genuine bare-filename-only citations, zero false positives. Not remediated (out of Files-to-Change scope). |
| Risk | Restoring a DEFERRED bypass (REQ-002) too broadly could re-open a new loophole (any `[DEFERRED: x]` with one throwaway word passing). | Low | **Did not materialize.** Kept the existing trivial-placeholder case-statement as the floor; fixture-confirmed `[DEFERRED: tbd]` still fails, `[DEFERRED: blocked on operator decision]` now passes. |
| Risk | Adding `implemented` to the `complete` bucket regex could reclassify a packet that intentionally uses "Implemented" to mean something other than fully complete (e.g. `010-query-channel-calibration`'s "Implemented, verification-limited" caveat). | Low | **REALIZED on `check-scaffold-never-touched.sh` specifically** (not the "different meaning" scenario this row anticipated, but the SAME "review both consumers" mitigation caught it): `010` newly fails `SCAFFOLD_NEVER_TOUCHED` with 4 real scaffold markers — see Implementation Findings above. `006` audited clean. Also found and fixed a second, unanticipated collision (`not implemented` vs `implemented`) before shipping — see Implementation Findings above. |
| Dependency | None on any other 028 phase. | — | Confirmed — independent of sibling phases covering F1-F5, F8, F11-F15 from the same review round. |
| Dependency | `strict-pass-freshness.ts` is TypeScript under `scripts/`; confirm its build/dist-freshness gate (if any) picks up the REQ-004/REQ-005 changes before `validate.sh --strict` is re-run. | Low | Confirmed: `sweep/` is not in `scripts/tsconfig.json`'s `include` list, so it has no project build gate. Standalone `tsc --noEmit` with matching compiler flags: 0 diagnostics. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **RESOLVED:** Restored DEFERRED-marker exemption (REQ-002) uses an unconditional bypass beyond the existing trivial-placeholder case-statement (no new minimum-length floor) — matches this spec's own risk-mitigation text. Fixture-confirmed: `[DEFERRED: tbd]` still fails, `[DEFERRED: blocked on operator decision]` now passes.
- **RESOLVED:** REQ-004's cross-reference lands as paired comments in both files (not a shared literal list) — zero new build surface, matches this repo's existing bash/TypeScript-duplication precedent, and respects the plan's Out-of-Scope bar on new shared-config-loading tooling.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
