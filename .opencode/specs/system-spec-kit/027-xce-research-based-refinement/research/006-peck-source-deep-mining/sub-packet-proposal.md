---
title: "Sub-packet proposal for 027 — peck-source verification discipline, benchmark substrate, and the revived T1 coverage gate"
source_research: "research/006-peck-source-deep-mining/research.md (iterations 001-013)"
session: "2026-06-06-027-peck-source-deep-mining"
status: "proposal (cross-model endorsed by MiniMax M3 at iter 018 — one must-fix + T1 refinements applied) — awaiting operator approval before any Gate-3 packet creation"
---

# Sub-packet proposal for 027 (from peck-source mining)

Derived from the 13-iteration peck-source deep-research pass (`research.md`). This proposes **three new 027 child packets (009-011)**, **two coordination items** that extend the *already-pending* 001 children (do NOT create new packets for these), and a short **optional/deferred** list. Numbering, non-conflict, and sequencing were verified in iteration 013.

> **Nothing here is implemented.** This is a planning artifact. New packets require a Gate-3 answer + `/speckit:plan :with-phases` per packet.

## 0. Summary table

| Proposed packet | Teachings | Level | Effort | Risk | Depends on | Verdict |
|---|---|---|---|---|---|---|
| **009-peck-verification-discipline** | T5, T6, T7, T8, T9 | 3 | M | med | 010 (for tests); coord. pending 002 | **PROPOSE** |
| **010-reviewer-prompt-benchmark-substrate** | T10 | 2-3 | M | med | none (land FIRST) | **PROPOSE** |
| **011-acceptance-coverage-gate** (revived T1) | T1 + AC-format prereq | 3 | M/L | med | 010; coord. pending 002/003 | **PROPOSE** |
| *coordination →* pending **003** | T14 | — | M | med | — | **EXTEND (not new)** |
| *coordination →* pending **004** | T12(a,b) | — | S-M | low-med | — | **EXTEND (not new)** |
| *optional* | T13, T11, T12(c) | — | S-M | low-high | 010 (T11) | **DEFER / OPTIONAL** |

New top-level children number from **009** (000-008 occupied; avoid the `000` placeholder and the internal `008/002` coco gap — iter 013). All three sequence **independently of the 005 memory re-plan**.

---

## 1. Packet 009 — peck-verification-discipline  *(PROPOSE, Level 3)*

**Purpose.** Adopt the coherent net-new verification-discipline bundle peck implements in its agent prompts but the 2026-06-02 README pass missed. All changes land on agent/skill prompts, the completion gate, and CLAUDE.md — **zero overlap with the 027 memory phases 002-008** (iter 013).

**Suggested phase children (ascending risk):**
| Phase | Teaching | What ships | Key files |
|---|---|---|---|
| 001 | **T6** completion-verdict freshness *(anchor)* | Bind checklist `[x]` evidence to a content fingerprint (reuse `session_dedup.fingerprint`, recompute it) + a clean-tree precondition in the completion rule; invalidate green on later in-scope edits | `CLAUDE.md` §2, `constitutional/verify-before-completion-claims.md`, `mcp_server/lib/validation/spec-doc-structure.ts` + `scripts/validation/continuity-freshness.ts` |
| 002 | **T5** escalation gates | Add "one-sentence root-cause or escalate" + "impl conflicts with spec → escalate for AMENDMENT, not workaround" + 3-strike/contradiction gates | `sk-code/SKILL.md` (escalation block), `CLAUDE.md` Logic-Sync |
| 003 | **T7** anti-softening | "Do NOT relabel a Fail as conditional/partial"; anti-truncation (always emit a verdict) in the completion ritual + deep-review final report | completion ritual / `/speckit:complete`, `deep-review/SKILL.md` |
| 004 | **T8** reviewer read-budget | "State the reason before each non-diff Read; never re-read a full-content/new file" — ADOPT for `@review`; ADAPT for deep-review/deep-research/@context (must NOT override P0 rereads) | `.opencode/agents/review.md` (+ context/deep-* prompt packs) |
| 005 | **T9** numeric calibration (docs only) | Add a `±2 context` adjustment note + optional non-gating `riskScore` annotation; **do NOT** adopt the literal `score≥4 blocks` | `sk-code-review/SKILL.md`, `deep-review` report schema (docs) |

**In scope:** the five teachings above. **Out of scope:** the T1 coverage gate (→ 011), the benchmark fixtures (→ 010), any memory-subsystem change.
**Effort** M · **Risk** med (T6 touches the completion validator → ship warn-first). **Verification:** each rule gets a 010 regression fixture (stale-verdict, softened-Fail, over-read cases).

---

## 2. Packet 010 — reviewer-prompt-benchmark-substrate  *(PROPOSE, Level 2-3 — land FIRST)*

**Purpose.** Adopt **T10** — peck's highest-novelty mechanism (iter 006, newInfoRatio 0.85): a reviewer-prompt **regression** harness over real fixtures with **expected verdicts** (`CHECKOUT/INPUT/EXPECTED` → `Pass|Fail|Block`). spec-kit's deep-improvement Lane B/C cannot currently answer "does this reviewer prompt still catch this known bug class." This is the **test substrate** that makes 009 and 011 safe to ship.

**In scope:** a reviewer-fixture type in deep-improvement Lane B (fixture = repo-state + input diff/story + expected verdict/findings) + a scorer that runs a reviewer prompt and compares to the oracle; seed fixtures for each 009 rule and the 011 gate. **Out of scope:** changing existing Lane B/C scorer defaults; the reviewer rules themselves.
**Files:** `.opencode/skills/deep-improvement/assets/model-benchmark/**` (fixture schema + README), `scripts/model-benchmark/lib/**` (reviewer scorer), a fixtures dir.
**Effort** M · **Risk** med · **Depends on** nothing structural — **sequence first** so 009/011 are regression-tested. (Also unlocks the optional T11 cheap-model preset.)

---

## 3. Packet 011 — acceptance-coverage-gate  *(PROPOSE, Level 3 — the revived T1)*

**Purpose.** The long-deferred **T1** is now adoptable (iter 008): post-026 the validation/checklist/deep-review substrate exists, so T1 is a **staged, reuse-heavy** packet rather than a from-scratch build. Confirmed **unowned** by both 027 parent and 001 (iter 013). Needs one prerequisite the README pass missed (iter 011).

**Suggested phase children:**
| Phase | What ships | Key files |
|---|---|---|
| 001 | **AC-format normalization** *(prereq, iter 011)* — L1/L2 "how to verify" placeholders → mechanical `precondition+action→outcome`; tighten L3 requirement tables. Coordinate with pending **002-self-check-templates** | `templates/manifest/spec.md.tmpl` |
| 002 | **AC traceability table** in checklist — `AC-id | classification (Tested/Partially/Manual/Not-covered) | evidence (test @ file:line)` replacing the single self-attested checkbox | `templates/manifest/checklist.md.tmpl` |
| 003 | **`AC_COVERAGE` rule (WARNING)** — `covered/total ≥ floor(total × SPECKIT_AC_COVERAGE_FLOOR)`, default 0.9; `Manual — automation infeasible` escape hatch w/ rationale | `references/validation/validation_rules.md`, `validator-registry.json`, new rule script |
| 004 | **deep-review verdict binding** + **per-level AND lifecycle opt-in** (L2+ default once checklist.md exists AND `implementation-summary.md` is in-progress+; L1 exempt — see Design constraints) | `deep-review/SKILL.md`, `CLAUDE.md` §2 |
| 005 | **ERROR promotion** after a warn-only adoption window | rule severity |

> **Design constraints (cross-model verified — iter 015, MiniMax M3):**
> - **AC-format normalization (phase 001) is a HARD prerequisite, not optional** — the `AC_COVERAGE` rule can *count* coverage but cannot *classify* (Tested/Partially/Not-covered) on today's placeholder AC text (`spec.md.tmpl:91,97,445-453`).
> - **Canonical per-level AC location** — L3 carries BOTH a requirement table (placeholder ACs) and Given/When/Then story ACs; the rule must count exactly ONE (recommend: L3 counts story-ACs only) to avoid double-count/miss.
> - **Lifecycle opt-in** (phase 004) — enforce only when `implementation-summary.md` status is in-progress+, so a freshly scaffolded L2 spec with zero tests doesn't ERROR at scaffold time.
> - **Sequence after pending 001/002** — phases 001-002 edit the SAME manifest templates that pending `001/002-self-check-templates` modifies; land 001/002 first or coordinate the edit window (see §7).

**In scope:** the above. **Out of scope (reuse, don't rebuild — iter 008):** AC location (columns exist), evidence infra (`EVIDENCE_CITED`), the fresh-context reviewer primitive (deep-review).
**Effort** M/L · **Risk** med (new ERROR rule can block in-flight folders → mandatory warn-only window + per-level + lifecycle opt-in). **Depends on** 010 (regression fixtures); **sequencing dependency on pending 001/002** for the shared manifest templates.

---

## 4. Coordination items — EXTEND pending 001 children (NOT new packets)

The "adopted" peck teachings **002/003/004 are spec'd but still pending** (their own implementation-summaries; iters 010/011/012). These residue findings should fold into that pending work to avoid editing the same surfaces twice:

- **T14 → pending `003-current-state-discipline`** (iter 012): generalize current-state discipline to `implementation-summary.md` (its own deferred wave-1) and add a curated `product.md`-style "system now" narrative surface (distinct from `description.json` metadata). **DEFER** non-parent `spec.md` generalization (high false-positive risk).
- **T12(a,b) → pending `004-constitutional-rule-review`** (iter 010): add a bounded standing-guidance **cap** and a **recurrence→promotion** signal ("happened twice → promote") in the dedup/reconsolidation path. **DEFER** T12(c) the human-gated prune/demote lifecycle (high risk — constitutional rules are intentionally permanent).

---

## 5. Optional / deferred

- **T13 — resume FILES manifest** (iter 007): a small, optional `/speckit:resume` enhancement (one-shot phase-aware JSON FILES list alongside the existing ladder). Nice-to-have; could be a tiny child or a resume-maintenance pass.
- **T11 — cheap-model review preset** (iter 009): an **opt-in**, benchmark-gated cheap-model severity first-pass — only after 010 fixtures exist; **DEFER as a blanket default** (broad/security surfaces risk false PASS; deep-review defaults to Opus for good reason).
- **T12(c) — constitutional prune/demote lifecycle**: its own future review (high risk).

## 6. What NOT to build (re-confirmed anti-teachings)
Empty-commit verdict ledger · branch-per-story checkout · literal `score≥4 blocks` · blanket cheap-model release gate · automatic constitutional deletion. (iters 003, 007, 009, 010.)

---

## 7. Recommended sequencing & next step

```
010 (benchmark substrate)  ──first──▶  009 (verification discipline)  ──┐
                                   └──▶  011 (T1 coverage gate)  ───────┴─▶ (independent of the 005 memory re-plan)

  ⚠ MUST-FIX (cross-model iter 018): 011 phases 001-002 (AC-format + AC table) SHARE the manifest
     templates spec.md.tmpl / checklist.md.tmpl with PENDING 001/002 (T3 self-check templates).
     → Land 001/002 FIRST, or coordinate the edit window — do NOT edit those templates in parallel.
  • Coordinate current-state (T14) → pending 001/003 and reflection (T12) → pending 001/004.
```

**Immediate next step (operator decision):** approve, then scaffold **010 first** (it is the test substrate, zero deps) via a Gate-3 "New" answer + `/speckit:plan :with-phases`, followed by 009; sequence **011 after pending 001/002 closes** (shared manifest templates). Hold the T12/T14 residue for the pending 003/004 children rather than new packets.
