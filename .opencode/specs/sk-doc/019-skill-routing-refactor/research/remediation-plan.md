---
title: "Second-Pass Audit — Remediation Plan"
description: "Consolidated remediation plan for the luna+sol second-pass audit of sk-doc/019-skill-routing-refactor: every canonical finding with status, fix approach, recommendation, sequencing, and effort."
trigger_phrases:
  - "019 audit remediation plan"
  - "second-pass audit remediation"
  - "skill-routing audit findings plan"
importance_tier: "important"
contextType: "reference"
---
<!-- SPECKIT_TEMPLATE_SOURCE: none (planning artifact) -->

# Second-Pass Audit — Remediation Plan

## 1. Overview

Two independent GPT-5.6 deep-research lineages audited the `019-skill-routing-refactor` parent
packet, its 21 direct children, and nested descendants (forced-depth, no early convergence):

- **luna** (`gpt-5.6-luna` xhigh, cli-codex) — 15 findings.
- **sol** (`gpt-5.6-sol-fast` medium `--variant medium`, cli-opencode) — 27 findings.

Deduplicated to **~26 canonical findings**. Cross-model corroboration (a finding in *both*
lineages) = high confidence; single-model findings are verified before action (both models
produced false positives — see §5).

**Working rules for every fix:**
1. **Verify-first** — confirm each finding against disk before editing (`finding = hypothesis`).
2. **Fingerprint refresh** — any doc edit requires re-running `backfill-graph-metadata.js` on
   that packet, or `GENERATED_METADATA_INTEGRITY` fails (`--strict`, enforced).
3. **Lifecycle-authority policy** — when a spec/summary claims a status ahead of its own
   `graph-metadata.json`, the graph is machine-authoritative; reconcile the narrative *down*
   to it (per `context-index.md`), unless the work is genuinely done (then advance the graph).
4. **Isolation** — a concurrent session's cli-codex write-containment reverts main-tree edits;
   all remaining work runs in worktree `sk-doc/0104-019-audit-remediation` (see §6).

---

## 2. Canonical finding register

Legend — **Status:** ✅ done · ⬜ remaining · ❌ rejected (verified false/non-defect).
**Sev:** P1/P2. **Prov:** NEW (introduced/exposed by commit `140266be3e`) · PRE (pre-existing).

| # | Finding | luna / sol | Sev | Prov | Status | Where |
|---|---------|-----------|-----|------|--------|-------|
| F-01 | Residual "sk-code + sk-doc ONLY" surface-router claims (lines 48/56/136) vs 7/7 reality | F06 / CF-09 | P1 | NEW | ✅ | `v4 2cc0787dcb` |
| F-02 | "operator-gated" claim vs runtime **default-on** (7/7 manifests compiled) | — / CF-11+12 | P1 | NEW | ✅ | wt `9f7aeebc3d` |
| F-03 | "7/7 hubs PASS" overstated — route-gold applies to 6 hubs | F08 / CF-18 | P1 | NEW | ✅ | `v4 2cc0787dcb` |
| F-04 | Resume chain stranded — `020`/`020/007` `last_active_child_id` null | F09 / CF-05 | P1 | NEW | ✅ | `v4 2cc0787dcb` (020→007) |
| F-05 | Parent prose conflates benchmark replay with live compiled serving | F07 / CF-10 | P1 | PRE | ✅ | `v4 2cc0787dcb` |
| F-06 | 017 `_memory.continuity` over-long narrative (`SPECDOC_FRONTMATTER_004`) | F03 / CF-02 | P1 | PRE | ✅ | wt `a3f5b74e99` |
| F-07 | 012 stale `smart_routing.md` path ×4 | F13 / CF-15 | P2 | PRE | ✅ | wt `a3f5b74e99` |
| F-08 | 013 `mcp_server` refs ×25 (lib/tests → `mcp-server`; hooks → top-level `hooks/`) | F12 / CF-16 | P1 | PRE | ✅ | wt `0c7d26900f` |
| F-09 | Nested 015 phase map lists 12 of 14 children (missing 013, 016) | — / CF-07 | P1 | PRE | ✅ | wt `0c7d26900f` |
| F-10 | Nested 015 pointer at stale `011`; current in-progress is `013` | F10 / CF-08 | P1 | PRE | ✅ | wt `0c7d26900f` |
| F-11 | sk-code typed contract "resolves 0 resources" | F15 / — | P1 | PRE | ❌ | live route works; documented lossy index-table benchmark-replay |
| F-12 | Parent handoff row names "wrong" `020/spec.md` + `021/spec.md` | — / CF-14 | P2 | NEW | ❌ | both files exist — sol false positive |
| F-13 | Duplicate `012-*` prefix under 020/007 is a resume collision | — / CF-06 | P2 | PRE | ❌ | both models ruled non-defect (full IDs resolve) |
| F-14 | **012** FILE_EXISTS/LEVEL_MATCH (Errors:2) — fails where identical-shaped 013 passes | F01+F02 / CF-01 | P1 | PRE | ⬜ | Wave R1 |
| F-15 | 019-sk-prompt spec "Research Complete" vs graph `in_progress` | F04 / CF-04 | P1 | PRE | ⬜ | Wave R2 |
| F-16 | 015-sk-code + 006 pending-state desync (spec/graph vs summary/checklist) | F05 / CF-03 | P1 | PRE | ⬜ | Wave R2 |
| F-17 | Parent phase-map marks E/F Active while `020`/`021` graphs say `planned` | F14 / CF-21 | P1 | PRE | ⬜ | Wave R2 |
| F-18 | Nested 015/009 + 015/013 claim Complete with open gates/items | F11 / CF-19+20 | P1 | PRE | ⬜ | Wave R2 |
| F-19 | 020/004 spec "Research complete" vs graph `in_progress` | — / CF-23 | P2 | PRE | ⬜ | Wave R2 |
| F-20 | 020/004 + 020/006 declare Level 2 but omit required files | — / CF-22 | P1 | PRE | ⬜ | Wave R3 |
| F-21 | 020/005 all 8 idea children declare Level 2 but omit required files | — / CF-24 | P1 | PRE | ⬜ | Wave R3 |
| F-22 | 020/005 children 001-004 claim complete without completion evidence | — / CF-25 | P1 | PRE | ⬜ | Wave R3 |
| F-23 | 020/005 parent overstates children 005-007 complete vs graphs | — / CF-26 | P1 | PRE | ⬜ | Wave R3 |
| F-24 | 020/005 parent `planned` + null pointer while child 008 unfinished | — / CF-27 | P1 | PRE | ⬜ | Wave R3 |
| F-25 | 020 `context-index.md` "New location" path base ambiguous | — / CF-17 | P2 | PRE | ⬜ | Wave R4 |
| F-26 | sk-design fails hard topology invariant 6a (`styles/` unregistered) | — / CF-13 | P1 | PRE | ⬜ | Wave R4 |
| M-01 | **deep-loop runtime bug**: cli-codex write-containment reverts sibling + cross-session work | discovered | P1 | — | ⬜ | separate packet (§7) |

**Tally:** 26 canonical + 1 meta. **Done: 10** · **Rejected: 3** · **Remaining: 13 + 1 meta.**

---

## 3. Completed (verify-first, committed)

All 4 NEW findings from commit `140266be3e` are fixed, plus 6 pre-existing. See §2 for
locations. Two model claims were **rejected on verification** (F-11, F-12) and one **ruled
non-defect by both models** (F-13) — do not "fix" these.

---

## 4. Remaining — sequenced remediation waves

Each wave: verify → fix → `backfill-graph-metadata.js` on the touched packet → validate →
commit. Run in the worktree.

### Wave R1 — 012 hard errors (F-14) · P1 · ~1 unit
- **Symptom:** 012 (Planned, Level 3) fails `FILE_EXISTS`("missing 1 required file") +
  `LEVEL_MATCH`, but 013 — identical file set, also Planned Level 3 without
  `implementation-summary.md` — passes clean. Level markers are consistent (all `3`).
- **Approach:** root-cause the validator delta between 012 and 013 (candidates: a
  `graph-metadata.json` status/level field difference, a content-metric threshold, or a
  grandfather list). Then apply the matching fix — most likely align 012's `graph-metadata.json`
  to 013's shape, **not** authoring a bogus implementation-summary for un-started work.
- **Recommendation:** investigate before editing. Do **not** downgrade the level (impl-summary
  is required at every level) and do **not** stub an implementation-summary for a Planned packet
  unless 013's passing config proves that is the intended convention.

### Wave R2 — lifecycle reconciliation (F-15..F-19) · P1/P2 · ~5 units
- **Packets:** 019-sk-prompt, 015-sk-code, 020/004, nested 015/009 + 015/013, plus the parent
  phase-map E/F rows.
- **Approach (policy-driven, low-risk):** for each, compare the narrative status claim to the
  packet's own `graph-metadata.json`. Reconcile the **narrative down to the graph** (change
  "Complete"/"Research Complete" → the graph's `in_progress`/`planned`), unless a checklist +
  implementation-summary prove the work is genuinely done (then advance the graph via backfill).
  Refresh each fingerprint.
- **Recommendation:** batch these — they share one mechanical pattern. Verify each against the
  graph first (some may already be reconciled). The parent phase-map rows (F-17) are the same
  edit applied to `spec.md`'s PHASE DOCUMENTATION MAP.

### Wave R3 — 020/005 out-of-box subtree (F-20..F-24) · P1 · ~5 units
- **Packets:** 020/004, 020/006, and 020/005's 8 idea-children — all research/OOB packets that
  declare Level 2 but omit required Level-2 files and/or overstate completion.
- **Judgment call (author vs downgrade):** these are **research deep-dives**, not implementations.
  The truthful fix is almost certainly to **downgrade the declared level to match research-only
  content** (Level 1 with the research artifacts they actually contain) and reconcile status to
  the graph — rather than authoring missing implementation files for work that is research by
  nature. **Confirm this framing with the packet owner before bulk-editing 8+ packets.**
- **Recommendation:** treat 020/005 as one coordinated sub-task; decide the level policy once,
  apply to all 8 children + the parent, then backfill. Highest blast-radius of the remaining set.

### Wave R4 — isolated fixes (F-25, F-26) · P2/P1 · ~2 units
- **F-25** (020 context-index path ambiguity): clarify the "New location" base path. Small doc edit.
- **F-26** (sk-design invariant 6a): **different hub** — `styles/` is unregistered/unallowlisted
  and fails `parent-skill-check.cjs` rule 6a. Verify via
  `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design`,
  then either register/allowlist `styles/` or record why it is exempt. **Out of the 019 tree —
  scope as its own sk-design change** (its own Gate-3 answer + commit).

---

## 5. Verification discipline (why single-model findings are gated)

Both models produced false positives, caught only by disk verification:
- **sol CF-14** — claimed `020/spec.md` + `021/spec.md` are "wrong" paths; both exist.
- **luna F15** — claimed sk-code "resolves 0 resources"; the live compiled route returns a valid
  target — the zero-pairs was the *documented* lossy index-table benchmark-replay behavior.

**Rule:** never fix a single-model finding without confirming the exact symptom on disk. F-26
(sk-design 6a) is single-model and unverified — verify before touching.

---

## 6. Execution environment

- **Worktree** `sk-doc/0104-019-audit-remediation` (`.worktrees/0104-sk-doc-019-audit-remediation`)
  isolates edits from the concurrent session's main-tree containment sweeps (canary-confirmed).
- **Do all remaining work in the worktree**, commit per wave, then `git merge --no-ff` into
  `skilled/v4.0.0.0`. The branch is disjoint from the concurrent `system-deep-loop/036` work.
- `v4` also carries **unpushed** `2cc0787dcb` (F-01/03/04/05) + the concurrent session's commits;
  push `v4` when that session settles (its owner controls push timing).

---

## 7. Recommendations

1. **Land the done work now** — merge the worktree branch (10 findings) into v4; it is clean and
   disjoint from the concurrent session.
2. **Sequence the remainder** R1 → R2 → R3 → R4. R2 is the cheapest win (one mechanical pattern
   ×5). R3 (020/005 subtree) needs a **one-time level-policy decision** before bulk edits — the
   highest-risk step; confirm with the owner.
3. **Do R1 as investigation-first** — the 012-vs-013 validator delta is the one genuinely unclear
   case; do not guess.
4. **Scope F-26 (sk-design 6a) separately** — it is a different hub with its own Gate-3 and commit.
5. **File the containment bug (M-01) as its own `system-deep-loop` packet** — cli-codex
   write-containment reverting sibling and cross-session work is a real runtime defect with data-loss
   impact (it wiped the glm + minimax research lineages and reverted a concurrent session's work).
   This is the single most consequential discovery of the audit and is out of the 019 doc scope.
6. **Correct the stale mental model / memory** — the fleet compiled-routing cutover **completed**
   (default-on, 7/7 manifests `compiled`); prior notes calling it "operator-gated / blocked" are stale.

**Estimated remaining effort:** ~13 units across R1-R4 (R3 is the bulk), plus the separately-scoped
sk-design and deep-loop-runtime items.

---

## 8. Execution log — verify-adjusted outcomes

Waves executed in worktree `sk-doc/0104-019-audit-remediation`. Verify-first materially changed
several findings from the original register.

**R1 — done (`247d82a779`).** F-14 (012): root cause was `hasStartedWork()` — 012 has 8 completed
tasks (Layer A; deliverables verified on disk), so implementation-summary.md became required while
the packet still claimed "Planned". Authored a truthful In-Progress implementation-summary + set
Status In Progress. **012 now validates Errors:0.**

**R2 — one real defect, rest verify-adjusted to non-defects (`7534f7021d`).** Only F-16 (015-sk-code)
was a real narrative defect — declared Planned in spec+graph but 23/25 checklist + impl-summary =
In Progress; reconciled. The others are **graph-derivation lag on truthful specs**, not over-claims:
F-15 (019-sk-prompt "Research Complete" + impl-summary = true), F-18 (015/009 "Complete, REQ-006
deferred out-of-scope" validates Errors:0), F-18 (015/013 "Complete" carries the verified default-on
commit `7dfffa0c93`). sol CF-19/CF-20 counted explicitly-deferred / minor items as incomplete. No edit.

**R3 — verified REAL; deferred as a scoped structural decision.** 020/004, 020/006, and all 8
020/005 idea-children declare Level 2 but are research deep-dives with only `spec.md` + `presentation.md`
(Errors:3 each: FILE_EXISTS + LEVEL_MATCH + SECTION_COUNTS). Passing research packets (017) carry
`plan.md` + `tasks.md` even at Level 1, so these fail at **every** level. The truthful fix: author
~22 thin plan/tasks files across the 11 packets (+ downgrade to Level 1 to match research content),
or establish a research-presentation level exemption. This is a one-time policy decision touching the
router-unification exploration sub-workstream — do it as a **dedicated author-pass, not piecemeal**.
Recommended: downgrade the 11 to Level 1 and author minimal method-plan + iterations-as-tasks docs
mirroring 017's research pattern.

**R4 — F-25 done, F-26 scoped out.** F-25 (020 context-index "New location" base) clarified. F-26
(sk-design invariant 6a) confirmed real (`parent-skill-check.cjs` shows a canon FAIL) but is a
**different hub** — fix under its own sk-design Gate-3 + commit.

**Net:** 12 findings fixed, 3 rejected as FP/non-defect, 4 R2 verify-adjusted to non-defects, R3
(11 packets) scoped for a dedicated author-pass, F-26 + M-01 (containment bug) scoped to their own
packets.
