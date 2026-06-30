---
title: "Implementation Plan: Device And Constrained-Context Probes"
description: "Plan to add a Device And Constrained Context section to design-audit/references/hardening_edge_cases.md covering low-power, Save-Data, CPU-throttle, offline-to-online recovery, and slow media, each probe recorded with a pass/fail/skip verdict plus captured evidence. Additive reference edit; acceptance is an advisory review."
trigger_phrases:
  - "device constrained context probes plan"
  - "hardening matrix device probes design build"
  - "low-power save-data throttle offline slow-media probes"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/006-device-constrained-probes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked plan phases complete after the 8B section passed advisory review"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether to renumber or letter-suffix resolved to 8B — reuses the file's own 8A precedent for a zero-renumber additive insert"
---
# Implementation Plan: Device And Constrained-Context Probes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference edit (additive section) — no script, no code |
| **Primary target** | `design-audit/references/hardening_edge_cases.md` (EXISTING — additive section insert) |
| **Section added** | `Device And Constrained Context` — five probes: low-power, Save-Data, CPU-throttle, offline-to-online recovery, slow media |
| **Source craft** | impeccable `harden.md` network/error coverage; the file's own matrix house style (§2-8A); `accessibility_performance.md` §3-5 (performance boundary); `evidence_capture.md` (evidence); `audit_contract.md` (severity) |
| **Verification** | Advisory review — each of the five probes is present with a pass/fail/skip verdict and an evidence slot, in the matrix house style. No checker runs over this file (the matrix is a reference the audit walks, not a code-enforced gate). |

### Overview
An auditor walking the hardening matrix today can prove a surface survives long text, network errors, permission states, concurrency races, RTL, text expansion, CJK and emoji, and trapped overlays — but the matrix has no row for the device the surface actually runs on. A phone in battery-saver, a data-capped connection, a low-end CPU, a connection that drops and returns mid-flow, and a large image arriving over a slow link are all real production conditions that the current matrix leaves unaudited. This build adds one new section — `Device And Constrained Context` — that gives the audit a concrete probe for each of those five conditions, in the exact shape every other section already uses: a probe, the symptom that appears when the surface is unhardened, and the finding to file.

The section is **additive and house-style-consistent**: it inserts one new section into the existing matrix and changes none of the existing probe sections. Each probe is recorded with a pass / fail / skip verdict plus evidence, so a reviewer can confirm the constrained-context conditions were walked, not skipped silently.

Scope is frozen to the single target file `hardening_edge_cases.md`. The required change is one inserted section; a small set of honest-metadata touches (frontmatter description, version, one routing-summary line) are flagged as optional in §3 and stay inside the same file.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec target confirmed: `design-audit/references/hardening_edge_cases.md` exists and carries the §2-8A probe-matrix house style this section must match — confirmed, §8A overlay row at line 138 shows the three-column shape
- [x] The five required probes are fixed by spec §4: low-power, Save-Data, CPU-throttle, offline-to-online, slow media — all five authored as §8B rows
- [x] The recording shape is fixed by spec §4: each probe records pass/fail/skip + evidence — every finding cell carries `verdict: pass | fail | skip` and an `evidence:` slot
- [x] The boundary with `accessibility_performance.md` §3-5 (performance measurement) and the existing §3 offline-failure row is understood (see §3 Boundary) — closing note routes measurable evidence out and names the recovery-vs-failure distinction
- [x] Acceptance is an advisory review, not a checker run — the matrix is a walked reference with no gate over it — confirmed; no checker added, probe bites by an auditor filing a finding

### Definition of Done
- [x] The new `Device And Constrained Context` section exists in `hardening_edge_cases.md` with all five probes present — `## 8B` at line 150 with all five rows
- [x] Each probe carries a probe description, the unhardened symptom, the finding to file, and a recorded pass/fail/skip verdict with an evidence slot — verified per row
- [x] The section matches the file's house style: an intro sentence, the probe table, and a closing routing/boundary note (the same shape as §2-8A) — intro at line 152, table 154-160, closing note 162-164
- [x] The section does not duplicate the performance-measurement content owned by `accessibility_performance.md`; it routes measurable evidence there instead — closing note routes load/layout-shift/long-task/latency/motion evidence out, no thresholds restated
- [x] Additive only: no existing probe section, table, or routing line is rewritten; the change is the inserted section — `git diff --stat` reports 18 insertions, 0 deletions; optional metadata touches deferred
- [x] Evergreen: the authored section embeds no spec/packet/phase IDs and no `specs/` paths — only evergreen owner-doc references — grep of §8B returns no IDs or `specs/` paths

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Section shape (`Device And Constrained Context`)
The section mirrors every existing matrix section: a one-line intro that names the condition, a probe table in the file's fixed three-column order, and a closing note that routes the findings and holds the boundary.

```markdown
| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| <constraint condition to reproduce> | <what breaks when the surface ignores the constraint> | <the finding, named against the missing degradation path> |
```

**Verdict and evidence convention (the spec-required recording shape).** The file's §1 already establishes the model: walk each probe, label a probe you could not run as inferred, and file a finding on every failure. This section maps the spec's pass/fail/skip + evidence onto that model so a reviewer can confirm coverage:

| Verdict | Meaning | Evidence recorded |
|---|---|---|
| `pass` | The surface degrades gracefully under the constraint | The captured artifact (screenshot/trace/measurement) that shows graceful degradation, per `evidence_capture.md` |
| `fail` | The unhardened symptom appears → file the finding | The captured symptom artifact plus the filed finding (element, user impact, severity, owner) |
| `skip` | The probe could not be run on the available evidence → label the finding inferred (file's §1 rule) and state what would confirm it | The reason it could not be run and the evidence that would confirm it |

### The five probes (grounded content for the implementer)
Author one row per probe. The probe column names the condition to reproduce; the symptom and finding follow the house style.

| Probe (condition to reproduce) | Expected symptom when unhardened | Finding to file |
|---|---|---|
| Device in low-power / battery-saver mode, which typically forces reduced motion and may pause autoplaying media | Load-bearing state, progress, or content shown only through animation or autoplay silently stops; an entrance animation that gates content never runs, so the content never appears | State or feedback conveyed only through motion or autoplay, with no static or reduced fallback (route the reduced-motion half to `accessibility_performance.md`) |
| `Save-Data` request header on / data-saver active (`navigator.connection.saveData`, `prefers-reduced-data`) | Full-resolution images and video and heavy prefetch ship regardless; the data-saving user pays the full payload, or a "lite" path hides real content | Save-Data / reduced-data signal ignored — no lighter media path or deferred loading (route media-weight measurement to `accessibility_performance.md` §Performance, the fix to `sk-code`) |
| Throttled CPU emulating a low-end device (DevTools 4x-6x slowdown; coarse hints `hardwareConcurrency` / `deviceMemory`) | Scroll jank, delayed input, dropped frames, frozen interaction during heavy work; interaction latency leaves the usable band | No budget for low-end CPU — long tasks block input (route the measurable long-task / interaction-latency evidence to `accessibility_performance.md` §Performance Checks, the fix to `sk-code`) |
| Connection drops mid-flow and then returns (offline-to-online recovery; `online`/`offline` events, `navigator.onLine`) | After reconnect the UI stays stuck in its offline or error state; queued input is lost; no resync; the user must reload and re-enter data | No connectivity-recovery path — the offline-to-online transition leaves stale state, lost input, or no automatic resync |
| Large image or video arriving over a slow connection (slow media; `loading="lazy"`, reserved dimensions, poster/skeleton) | Layout shifts as media pops in, blank gaps, blocked interaction waiting on media, or a broken-looking region until the large asset finishes | Slow or large media not handled — no reserved dimensions, placeholder, lazy-loading, or progressive path (route layout-shift / load evidence to `accessibility_performance.md` §Performance, the fix to `sk-code`) |

> Honest ceiling: the section proves the audit now *asks* the five constrained-context questions and records a verdict with evidence for each. It does not prove the surface actually survives the constraint — that judgment is the auditor's, captured as evidence, not a number a script returns.

### Placement and numbering
Insert the new section immediately before `## 9. ROUTING SUMMARY`, after `## 8A. OVERLAYS AND TOP LAYER`. Two numbering options:

- **Recommended (zero renumber, matches the file's own precedent):** number it `## 8B. DEVICE AND CONSTRAINED CONTEXT`. The file already used the `8A` letter-suffix insertion precisely to add a section without renumbering everything below it; reusing that pattern keeps every existing section number stable and the change strictly additive.
- **Alternative (cleaner sequential read, one renumber):** number it `## 9. DEVICE AND CONSTRAINED CONTEXT` and bump the existing routing section to `## 10. ROUTING SUMMARY`. This touches one existing heading number.

Lead with the recommended zero-renumber option unless the orchestrator prefers the sequential read.

### Boundary (no duplication)
- `accessibility_performance.md` §3-5 owns performance *measurement* (Core Web Vitals, rendering, motion performance, performance evidence). This section owns production-readiness *resilience under constraint* and routes any measurable evidence there rather than restating thresholds.
- The existing §3 row probes the offline *failure* path (spinner forever, lost input). The new offline-to-online probe covers the *recovery* path (does the surface come back cleanly), which §3 does not cover — so the two do not overlap.
- Reduced-motion resilience routes to `accessibility_performance.md`; layout and logical-property fixes route to `foundations`; implementation routes to `sk-code`. The audit names the owner; it does not harden the surface itself.

### Additive / no-regression contract
- The required change is one inserted section. No existing probe section, table, intro, or the routing summary is rewritten.
- Optional honest-metadata touches, all inside the same file and flagged for the orchestrator: append "device and constrained-context resilience" to the frontmatter `description`; bump `version` `1.0.0.0` to `1.1.0.0` for the additive content; add one bullet to `## 9 ROUTING SUMMARY` routing constrained-context findings to their owners. The core deliverable stands without these; they keep the file's metadata and routing honest.
- Reverting the inserted section (and any optional touch) restores the prior file exactly. No script, asset, or downstream consumer depends on the new section.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup [Confirm targets, boundary, house style]
- [x] Re-read the target matrix to lock the house style (intro sentence, three-column probe table, closing routing note) and the `8A` letter-suffix insertion precedent — §8A confirmed as the letter-suffix precedent to reuse
- [x] Re-read the boundary owners (`accessibility_performance.md` §3-5, the §3 offline-failure row, `evidence_capture.md`, `audit_contract.md`) so the new section routes rather than duplicates — boundary confirmed; §3 covers offline failure, performance measurement owned elsewhere

### Phase 2: Author section [Author Device And Constrained Context section]
- [x] Insert `## 8B. DEVICE AND CONSTRAINED CONTEXT` before `## 9. ROUTING SUMMARY` with a one-line intro naming the constrained-context conditions — inserted at line 150, intro at line 152
- [x] Author the five probe rows (low-power, Save-Data, CPU-throttle, offline-to-online, slow media) in the fixed three-column order, populated from §3 grounded content — all five rows authored at lines 156-160
- [x] Add the pass/fail/skip + evidence recording convention and the closing routing/boundary note — convention at line 162, routing/boundary note at line 164
- [x] Optionally apply the flagged honest-metadata touches (frontmatter description, version bump, one routing-summary bullet) — deferred by decision; left to keep the diff maximally additive (18 insertions, 0 modifications), core section stands without them

### Phase 3: Verification
- [x] Advisory review: five probes present, each with a verdict and evidence slot — confirmed per row
- [x] House-style + boundary check: shape matches §2-8A; measurable evidence routed, offline recovery distinct from the §3 failure row — confirmed; closing note names the recovery-vs-failure distinction
- [x] Evergreen + scope audit: no IDs/paths in the section; only `hardening_edge_cases.md` touched — grep clean; `git diff --stat` confirms the one file

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (advisory review) | The five probes present with verdict + evidence | Read the section: low-power, Save-Data, CPU-throttle, offline-to-online, slow media each appear with a probe, a symptom, a finding, and a recorded pass/fail/skip + evidence convention |
| House-style consistency | Section shape vs §2-8A | The section has an intro sentence, the three-column probe table in fixed order, and a closing routing/boundary note — the same shape as the existing sections |
| Boundary | No duplication of performance ownership | The section routes measurable evidence to `accessibility_performance.md` rather than restating thresholds; the offline-to-online probe covers recovery, not the §3 offline-failure path |
| Evergreen lint | Authored section text | grep the new section for spec/packet/phase IDs and `specs/` paths — none present; only evergreen owner-doc references |
| Scope audit | Working tree | only `hardening_edge_cases.md` is touched; the diff is the inserted section plus any flagged optional metadata touch — no other file changed |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design-audit/references/accessibility_performance.md` §3-5 (performance boundary) | Internal | Green | Performance findings have no owner to route measurable evidence to |
| `design-audit/references/evidence_capture.md` (evidence model) | Internal | Green | The pass/fail/skip evidence slot has no capture convention to cite |
| `design-audit/references/audit_contract.md` (severity + findings schema) | Internal | Green | Findings cannot cite a severity model |
| `design-audit/references/critique_hardening.md` + `anti_patterns_production.md` (narrative owners) | Internal | Green | The boundary note cannot point at the narrative hardening owners |
| impeccable `harden.md` (corpus source for the constrained-context coverage gap) | Internal (corpus) | Green | The build loses its grounding for which constraints to probe |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the section duplicates performance-measurement content owned elsewhere, breaks the matrix house style, or the probes are judged wrong for the surface class.
- **Procedure**: delete the inserted `Device And Constrained Context` section (and revert any optional metadata touch). The change is additive and referenced by nothing else, so removal restores the prior file exactly. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Author section) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Author (needs the confirmed boundary + house style) |
| Author | Setup | Verify (needs the section to review) |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (confirm targets, boundary, house style) | Low | 30 minutes |
| Author (intro + five probes + verdict/evidence convention + routing note) | Medium | 1-1.5 hours |
| Verification (advisory review + house-style + boundary + evergreen + scope) | Low | 45 minutes |
| **Total** | | **~2.25-2.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm only `hardening_edge_cases.md` is in the diff — this phase's change is the one file; sibling template/script edits belong to a different phase
- [x] Confirm the diff is the inserted section plus, at most, the flagged optional metadata touches — no existing probe section rewritten — `git diff --stat` reports 18 insertions, 0 deletions; optional touches deferred
- [x] Confirm the section routes measurable evidence to `accessibility_performance.md` rather than restating its thresholds — closing note routes load/layout-shift/long-task/latency/motion evidence out, no thresholds restated

### Rollback Procedure
1. Delete the inserted `Device And Constrained Context` section from `hardening_edge_cases.md`
2. Revert any optional metadata touch (frontmatter description, version, routing-summary bullet)
3. No script, asset, database, or downstream consumer to reconcile (a single reference doc, additive)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Section deletion only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Additive Device And Constrained Context section: five probes (low-power, Save-Data, CPU-throttle, offline-to-online, slow media), pass/fail/skip + evidence convention, performance/offline boundary, advisory-review acceptance
-->
