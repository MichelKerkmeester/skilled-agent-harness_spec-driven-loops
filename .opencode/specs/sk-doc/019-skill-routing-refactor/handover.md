---
title: "Handover: post-019 survey, drift remediation, and deep-loop runs"
description: "State of the post-019 work as of 2026-07-24: the two-agent angle survey, the six shipped routing-drift fixes, and the alignment (sealed 10/10) and research (stopped 8/10) loops — with the open decisions, the unfixed sync-path defect, and the containment lesson that shaped how the loops were rerun."
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
    last_updated_at: "2026-07-24T20:55:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Stopped both deep loops after the alignment run sealed at 10/10 and research reached 8/10"
    next_safe_action: "Triage the ten P1 catalog findings"
    blockers: []
    completion_pct: 80
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Handover: Post-019 Survey, Drift Remediation, and Deep-Loop Runs

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

Four threads ran in this session, all on `skilled/v4.0.0.0`, all pushed.

1. **Angle survey** — two independent GPT-5.6-SOL agents surveyed all twelve skill hubs for follow-up
   work grounded in packet 019, producing eleven alignment angles and thirteen research angles. Persisted
   under `research/post-019-angles/`.
2. **Drift remediation** — six confirmed defects fixed, including a compiled-route status probe that
   reported serving state it could not substantiate. Documented in `019-routing-drift-remediation/`
   (validates `--strict` clean).
3. **Deep-alignment loop** — ran to completion, ten of ten iterations, **SEALED** and authoritative.
   Verdict **CONDITIONAL**: the runtime lane PASSED, the documentation lane returned **ten P1 findings**.
4. **Deep-research loop** — reached eight of ten iterations before being stopped on request. Every
   iteration returned high new-information ratios; the highest-value question packet 019 never answered
   is now answered.

Nothing is mid-write. Both loops are stopped, no stray processes remain, and every artifact is committed.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### Where the work lives

| Thread | Location | State |
|--------|----------|-------|
| Angle survey | `research/post-019-angles/` | Complete — README plus both agent reports |
| Drift remediation | `019-routing-drift-remediation/` | Complete — `--strict` 0 errors, 0 warnings |
| Alignment loop | `017-post-019-alignment/` | Sealed, 10/10, verdict CONDITIONAL |
| Research loop | `018-post-019-research/` | Stopped at 8/10, resumable |

Loop artifacts from the resumed runs are in two worktrees and are **not yet merged**:

- `.worktrees/0105-sk-doc-post-019-alignment-resume` on branch `sk-doc/0105-post-019-alignment-resume`
- `.worktrees/0106-sk-doc-post-019-research-resume` on branch `sk-doc/0106-post-019-research-resume`

The main tree holds only the iteration 1–2 state that was committed before the resume.

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
| `sk-code` / code — compiled-routing runtime | **PASS** | 19 | none |
| `sk-doc` / docs — feature catalogs + `create-*` | **CONDITIONAL** | 30 | **10 P1** |
| `sk-doc` / docs — hub routing metadata | NOT_APPLICABLE | 0 | none |
| `sk-design` / designs | NOT_APPLICABLE | 0 | none |

The runtime PASS independently corroborates the drift remediation. The ten P1s are `reality-drift` and
`creation-standard-drift` in feature catalogs across `cli-external-orchestration`, `sk-code`, and
`sk-design` — documentation describing behaviour that no longer matches the code.

**Caveat:** the findings registry JSON is empty while the report shows ten P1s. The loop reported that a
malformed raw delta line was ignored by the reducer, so the registry under-counts. Read the report, not
the registry.

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

**Headline result (iteration 1)** — the decomposition question packet 019 planned but never ran:
`(T,R,P)` holds fleet-wide as a policy posture, but the evidence **falsifies "authority as a fourth
scalar coordinate."** Compiled policy keeps an `authorityGraph` beside the posture, decisions hold
authority `WithheldUntilVerify`, and route proof cannot grant commit capability. The correct model is
`(T,R,P)` for selection plus an **independent authority invariant** for destination-local
PREPARE → VERIFY → COMMIT. It further flags that `Provenance` needs typed sub-kinds or it silently
absorbs authority.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### Immediate, highest value

1. **Triage the ten P1 catalog findings.** Read
   `017-post-019-alignment/alignment/alignment-report.md`. They are documentation-versus-reality drift in
   three hubs' feature catalogs. Treat each as a hypothesis and confirm against the code before editing —
   the same discipline that made this session's fixes hold.
2. **Merge the two loop worktrees** (`0105`, `0106`) so the iteration artifacts live on the branch. They
   are disjoint from the main tree and from each other.

### Open decisions

3. **The stale sync path (unfixed, pre-existing).** `compiled-route-sync.cjs` points its authored root at
   a phase path that no longer exists. It is the single failing case in the manifest suite and it predates
   this work. The fix is blocked on a real decision: the promoted runtime mirror reflects the pre-ungroup
   authored numbering, while the authored tree shifted by three positions, so repointing the root would
   renumber the **live serving mirror**. Decide whether the promoted layout tracks the authored
   renumbering or the sync tool pins its source path independently.
4. **Finish the research loop** (two iterations remain) or synthesize what exists. Eight iterations is
   already a substantial evidence base and no saturation was observed.

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
  - **Evidence**: report states `SEALED (authoritative)` with `STOP_MAX_ITERATIONS`
- [x] Resumed loops produced no new containment violations
  - **Evidence**: the only violation records carry `iter1`/`iter2` labels from the pre-isolation run
- [x] Co-active session's work intact
  - **Evidence**: every path containment touched is either committed at `HEAD` or was recreated and committed by that session
- [ ] Ten P1 catalog findings triaged
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
