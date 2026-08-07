---
title: "Handover: post-019 survey, drift remediation, and deep-loop runs"
description: "State of the post-019 work as of 2026-07-25: earlier survey/remediation, a sealed 10-iteration alignment audit, and an eight-iteration manually stopped research synthesis, with local worktrees awaiting separate integration."
trigger_phrases:
  - "post-019 handover"
  - "where did we leave the routing work"
  - "resume post-019 loops"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-skill-routing-refactor"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor"
    last_updated_at: "2026-07-25T07:50:37Z"
    last_updated_by: "opencode"
    recent_action: "Corrected both reducers, synthesized the existing alignment and research evidence, and strictly validated phases 017 and 018"
    next_safe_action: "Review the two dirty worktrees, then decide how to integrate them without weakening the recorded findings"
    blockers: []
    completion_pct: 90
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Handover: Post-019 Survey, Drift Remediation, and Deep-Loop Runs

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

Four threads now make up the post-019 follow-up. The earlier angle survey and drift remediation were pushed previously; the two loop closeouts below remain local and uncommitted in their isolated worktrees.

1. **Angle survey** — two independent GPT-5.6-SOL agents surveyed all twelve skill hubs for follow-up
   work grounded in packet 019, producing eleven alignment angles and thirteen research angles. Persisted
   under `research/post-019-angles/`.
2. **Drift remediation** — six confirmed defects fixed, including a compiled-route status probe that
   reported serving state it could not substantiate. Documented in `019-routing-drift-remediation/`
   (validates `--strict` clean).
3. **Deep-alignment loop** - ran ten of ten iterations and reached **SEALED** terminal synthesis.
   The corrected fail-closed verdict is **FAIL**: 49 of 1,794 artifacts were checked and **11 P1 findings** remain.
4. **Deep-research loop** - synthesized the eight completed iterations under the approved `manualStop`.
   The dashboard is terminal `COMPLETE`, the five original questions are resolved, and iterations 9-10 were not executed.

Nothing is mid-write. Both loops are terminal, the research lock is absent, and phase 017/018 strict validation reports zero errors and zero warnings. The worktree artifacts are not committed, merged, or pushed.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### Where the work lives

| Thread | Location | State |
|--------|----------|-------|
| Angle survey | `research/post-019-angles/` | Complete — README plus both agent reports |
| Drift remediation | `019-routing-drift-remediation/` | Complete — `--strict` 0 errors, 0 warnings |
| Alignment loop | `017-post-019-alignment/` | Complete audit; sealed FAIL, 49/1,794 coverage, 11 P1 |
| Research loop | `018-post-019-research/` | Complete synthesis; 8 iterations, manualStop, 5/5 original questions |

Loop artifacts from the resumed runs are in two worktrees and are **not yet merged**:

- `.worktrees/0105-sk-doc-post-019-alignment-resume` on branch `sk-doc/0105-post-019-alignment-resume`
- `.worktrees/0106-sk-doc-post-019-research-resume` on branch `sk-doc/0106-post-019-research-resume`

The main tree still does not contain the worktree-local phase artifacts. This handover is the only parent update in the main workspace; integration remains a separate operator decision.

### What the drift remediation changed

The status probe declared compiled serving whenever a hub's manifest said `compiled` and the engine did
not throw — it never checked the serve-time identity binding the resolver enforces. One hub was therefore
reported green while silently served by legacy. Fixing that exposed a second defect: the manifest
refresher could never refresh a graduated hub, because it called the generic compiler (which throws on
those hubs' packet kinds) instead of preferring the shadow-child snapshot, and wrote a generation the
engine never routes.

Both are fixed and verified against resolver ground truth: all seven activated hubs now genuinely resolve
compiled, and the probe agrees. Also closed: seven hub catalogs still documenting compiled routing as
off-by-default, an omitted leaf-manifest entry, a hub version mismatch, an oversized `SKILL.md`, and two
fixtures missing frontmatter.

### What the alignment loop found

Sealed and authoritative. Coverage is low — forty-nine of 1,794 discovered artifacts, stopped by the
iteration ceiling rather than by convergence — so absence of findings in a lane is not evidence of
conformance.

| Lane | Verdict | Checked | Findings |
|------|---------|---------|----------|
| `sk-code` / code - compiled-routing runtime | **CONDITIONAL** | 19 / 19 | **1 P1** |
| `sk-doc` / docs - feature catalogs + `create-*` | **FAIL** | 30 / 465 | **10 P1** |
| `sk-doc` / docs - hub routing metadata | **FAIL** | 0 / 12 | none observed |
| `sk-design` / designs | **FAIL** | 0 / 1,298 | none observed |

The runtime lane's one P1 is the reproducibility defect in `compiled-route-sync.cjs`: the active manifests resolve compiled, but the sync check targets a missing authored runtime root. The other ten P1s are `reality-drift` and `creation-standard-drift` findings in feature catalogs across `cli-external-orchestration`, `sk-code`, and `sk-design`.

The reducer now consumes canonical iteration `findingDetails`, deduplicates them with delta findings, and fails closed on every non-empty partially checked lane. The registry and report agree on all 11 P1 findings; corruption count is zero.

### What the research loop covered

Eight iterations, new-information ratios 0.67–0.85 throughout (no saturation):

1. Threshold–Recovery–Provenance decomposition across the fleet
2. Advisor confidence and selective-auto-routing calibration
3. Minimum cross-runtime telemetry for causal leaf use
4. Two-tier required/supplemental leaf selection
5. Whether route-gold and typed fixtures predict natural prompts
6. Joining fixture-to-natural score gaps to leaf-use telemetry
7. Reproducing the staged join across the other hubs
8. A privacy-preserving sampling frame for sealed evaluation

**Headline result (iteration 1)** - the decomposition question packet 019 planned but never ran:
`(T,R,P)` holds fleet-wide as a policy posture, but the evidence **falsifies "authority as a fourth
scalar coordinate."** Compiled policy keeps an `authorityGraph` beside the posture, decisions hold
authority `WithheldUntilVerify`, and route proof cannot grant commit capability. The correct model is
`(T,R,P)` for selection plus an **independent authority invariant** for destination-local
PREPARE → VERIFY → COMMIT. It further flags that `Provenance` needs typed sub-kinds or it silently
absorbs authority.

The final synthesis connects that model to a measurement-first program:

- Treat advisor `0.82` as policy strength, not an empirical correctness probability.
- Prove leaf use through an immutable route decision, leaf-originated start, and terminal finish receipt.
- Mint one prompt-free evaluation-unit ID before routing and preserve every sampled request in the denominator.
- Run required/supplemental versus monolithic selection only as a paired, budget-matched sealed ablation.
- Build natural-prompt gold inside a trusted research environment with split sampling, labeling, and analysis roles.

Canonical output: `018-post-019-research/research/research.md`. The generated resource map is structurally valid but contains zero normalized references because the current delta schema did not project citations into the emitter; source citations remain in the iteration narratives and synthesis.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### Immediate, highest value

1. **Triage the eleven P1 findings.** Read
   `017-post-019-alignment/alignment/alignment-report.md`. They are documentation-versus-reality drift in
   three hubs' feature catalogs plus one compiled sync-path reproducibility defect. Treat each as a hypothesis and confirm against the code before editing -
   the same discipline that made this session's fixes hold.
2. **Review and integrate the two loop worktrees** (`0105`, `0106`) when authorized. No commit, merge, or push was performed during synthesis.

### Open decisions

3. **The stale sync path (unfixed, pre-existing).** `compiled-route-sync.cjs` points its authored root at
   a phase path that no longer exists. It is the single failing case in the manifest suite and it predates
   this work. The fix is blocked on a real decision: the promoted runtime mirror reflects the pre-ungroup
   authored numbering, while the authored tree shifted by three positions, so repointing the root would
   renumber the **live serving mirror**. Decide whether the promoted layout tracks the authored
   renumbering or the sync tool pins its source path independently.
4. **Choose the measurement follow-up scope.** The research loop is already terminal; the remaining work is a new implementation/research packet for evaluation identity, causal receipts, privacy approval, and preregistered fleet measurement.

### Standing risks

5. **Re-minting is content-triggered.** Any edit to a hub's routing inputs re-stales its activation
   manifest and drops that hub to legacy serving. The probe now surfaces this immediately
   (`compiled-route-status.cjs --all`), but nothing re-mints automatically. This bit twice in one session.
6. **A re-mint restores serving, not parity.** It selects the identity the engine already computes; it
   does not re-run compiled-versus-legacy parity evidence for the new content.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All seven activated hubs resolve compiled, confirmed via `resolveRoute`, with the status probe agreeing
  - **Evidence**: ground-truth comparison run per hub after the re-mints
- [x] Manifest suite unchanged from the pre-change baseline
  - **Evidence**: `16 pass / 1 fail` before and after; the single failure is the pre-existing sync path
- [x] Remediation packet validates clean
  - **Evidence**: `validate.sh --strict` reports 0 errors, 0 warnings
- [x] Alignment run reached synthesis and sealed
  - **Evidence**: report states `SEALED`, coverage `49 / 1794`, verdict `FAIL`, findings P1=11
- [x] Research run reached terminal synthesis after the approved stop
  - **Evidence**: dashboard states `COMPLETE`, iteration `8 of 10`, `stopReason: manualStop`, questions `5/5`
- [x] Both phase packets pass strict validation
  - **Evidence**: phase 017 and phase 018 each report `Errors: 0 / Warnings: 0`
- [x] Reducer regression gates pass
  - **Evidence**: alignment scripts pass 3/3; research targeted Vitest passes 20/20
- [x] Resumed loops produced no new containment violations
  - **Evidence**: the only violation records carry `iter1`/`iter2` labels from the pre-isolation run
- [x] Co-active session's work intact
  - **Evidence**: every path containment touched is either committed at `HEAD` or was recreated and committed by that session
- [ ] Eleven P1 findings triaged
- [ ] Sync-path layout decision made
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**The containment lesson.** Both loops were first launched against the shared main tree while another
session was actively working in it. The deep-loop write-containment gate assumes isolation: it treats any
out-of-scope dirty path as a violation and *reverts* it. Two loops plus a live session meant every writer
looked hostile to every other. The loops halted at 2/10 and 1/10, and containment reverted sixteen files
and deleted four.

No work was ultimately lost — the co-active session had committed its changes, and it recreated the two
untracked files itself minutes later — but the near-miss is the point. Rerunning each loop in **its own
clean worktree** removed the collision at the root and both then ran cleanly. The alternative on offer was
detection-only containment, which would have weakened a real safety gate to work around a setup error.

**Verify-first paid for itself repeatedly.** Every survey finding was re-checked against the live tree
before editing. Two claims that looked settled were wrong on inspection: a "genuinely lost" file had
already been recovered by its owner (reconstructing it would have overwritten their authoritative
version), and a defect first attributed to this session's restructure turned out to predate it.

**Ground truth over self-consistency.** The status probe was self-consistent and wrong for an unknown
period. It was only caught by comparing it against what the resolver actually returns. A first attempt at
the generation fix was likewise caught that way — it wrote a value the engine never routes, which no
amount of reading the diff would have revealed.
<!-- /ANCHOR:session-notes -->
