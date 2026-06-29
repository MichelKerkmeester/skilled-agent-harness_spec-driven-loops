---
title: "Implementation Summary: Device And Constrained-Context Probes"
description: "A Device And Constrained Context section in the hardening matrix gives the audit five probes — low-power, Save-Data, CPU-throttle, offline-to-online recovery, slow media — each with a pass/fail/skip verdict and an evidence shape. Additive reference edit, advisory review, no checker."
trigger_phrases:
  - "device constrained context probes summary"
  - "hardening matrix device probes design build"
  - "low-power save-data throttle offline slow-media probes"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/006-device-constrained-probes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped 8B device/constrained-context section; five probes with verdict and evidence shape"
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
      - "Whether the probes need a checker resolved to no — hardening_edge_cases.md is a walked reference, so the bite is an auditor filing a finding, the same as every existing matrix row"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-device-constrained-probes |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hardening matrix could prove a surface survives long text, network errors, permission states, concurrency races, RTL, text expansion, CJK and emoji, and trapped overlays — but it had no row for the device the surface actually runs on. A phone in battery-saver, a data-capped connection, a low-end CPU, a connection that drops and returns mid-flow, and a large image arriving over a slow link are all real production conditions the matrix left unaudited. You can now walk a `Device And Constrained Context` section that asks each of those five questions in the exact shape every other section uses, and records a verdict with evidence for each so a reviewer can confirm the constraint was walked, not skipped silently.

This is additive. One new section was inserted into the matrix and nothing else changed: the diff is `18 insertions(+)`, zero deletions, no existing probe section rewritten, no existing heading renumbered.

### Device And Constrained Context section

`hardening_edge_cases.md` now carries `## 8B. DEVICE AND CONSTRAINED CONTEXT`, inserted between `## 8A. OVERLAYS AND TOP LAYER` and `## 9. ROUTING SUMMARY`. It opens with a one-line intro that names the budgets real devices impose, then carries the file's fixed three-column probe table (`Probe | Expected symptom when unhardened | Finding to file`) with one row per probe, and closes with a recording convention and a routing/boundary note — the same shape as §2 through §8A.

The five probes are: low-power / battery-saver (reduced motion or paused autoplay where the platform applies it); Save-Data / data-saver signal (`Save-Data`, `navigator.connection.saveData`, `prefers-reduced-data`); CPU-throttle / low-end device emulation (DevTools slowdown, coarse `hardwareConcurrency` / `deviceMemory` hints); offline-to-online recovery after a connection drops mid-flow and returns; and slow media over a slow connection (lazy loading, reserved dimensions, poster/skeleton). Each finding cell ends with the spec-required recording shape: `verdict: pass | fail | skip` plus an `evidence:` slot naming the artifact to capture, or, for a skip, the reason and the confirming probe still needed.

### Verdict and evidence convention

A closing line maps the recording onto the file's own §1 model: record `pass` when the surface degrades gracefully, `fail` when the symptom appears and becomes the finding, and `skip` only when the probe could not be run — and a skipped probe stays inferred and names the evidence that would confirm it. That keeps the matrix honest: a reviewer can tell a probe that was walked-and-passed from one that was dropped.

### Boundary, stated honestly

The closing note holds two boundaries. It routes measurable load, layout-shift, long-task, interaction-latency and motion evidence to `accessibility_performance.md` rather than restating its thresholds, and routes layout/logical-property fixes to `foundations`, visual/flow direction to `interface`, and implementation to `sk-code`. It also states the recovery probe is distinct from the earlier offline-failure probe: the existing §3 row asks whether failure is contained (spinner forever, lost input), while the new probe asks whether the surface comes back cleanly after connectivity returns — so the two do not overlap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md` | Modified | Inserted `## 8B. DEVICE AND CONSTRAINED CONTEXT` with five probes plus the verdict/evidence convention; additive, zero existing line removed, zero heading renumbered |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) inserted the section additively immediately before `## 9. ROUTING SUMMARY`, reusing the file's existing `8A` letter-suffix precedent so no section below it had to be renumbered. The orchestrator then verified acceptance independently and this summary re-confirmed it against the live file: the `## 8B` section is present with all five named probes (low-power, Save-Data, CPU-throttle, offline-to-online, slow media), each carrying a `verdict: pass | fail | skip` slot and an `evidence:` shape; `## 8A` stays at line 138 and `## 9. ROUTING SUMMARY` at line 168, so the insertion renumbered nothing. The change is purely additive — `git diff --stat` reports 18 insertions and 0 deletions — and the scope is one file: the sibling `audit_report_template.md` and `scripts/` changes in the working tree belong to a different phase, not this one. The acceptance is honestly an advisory review, not a checker run: `hardening_edge_cases.md` is a reference the audit walks, and the probes bite exactly the way every existing matrix row does — an auditor runs the probe and files a finding on the symptom. The new section was grepped for spec, packet, and phase identifiers and `specs/` paths and carries none.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Number the section `## 8B.`, not `## 9.` with a renumber | The file already used the `8A` letter-suffix to add a section without renumbering everything below it; reusing that precedent keeps every existing section number stable and the change strictly additive |
| Add probes to a walked reference, no checker | `hardening_edge_cases.md` is the matrix the audit reads, not a code-enforced gate; the probes bite the same way every existing row does, so a checker would invent a false enforcement signal |
| Record `pass / fail / skip` plus evidence per probe | A reviewer needs to tell a walked-and-passed probe from a silently dropped one; the skip path stays inferred and names what would confirm it, matching the file's §1 rule |
| Make the offline-to-online probe cover recovery, not failure | The existing §3 row already probes the offline-failure path; the new probe asks whether the surface comes back cleanly after reconnect, so the two do not duplicate |
| Route measurable evidence out, do not restate thresholds | `accessibility_performance.md` owns performance measurement; the section names the owner and routes the evidence rather than copying Core Web Vitals or motion-performance thresholds into the matrix |
| Defer the optional metadata touches | The frontmatter description, `version` bump, and routing-summary bullet were flagged optional; leaving them keeps the diff maximally additive (18 insertions, 0 modifications), and the core section stands without them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `## 8B. DEVICE AND CONSTRAINED CONTEXT` present | PASS, section exists at line 150 between §8A (line 138) and §9 (line 168) |
| Five probes present | PASS, low-power, Save-Data, CPU-throttle, offline-to-online, slow media each appear as their own row |
| Verdict + evidence shape per probe | PASS, every finding cell carries `verdict: pass | fail | skip` and an `evidence:` slot (or skip reason + confirming probe) |
| Additive / zero renumber | PASS, `git diff --stat` reports 18 insertions, 0 deletions; §8A and §9 heading numbers unchanged |
| Offline recovery distinct from §3 failure | PASS, the closing note states the new probe covers clean reconnect, not the §3 spinner-forever / lost-input failure path |
| Boundary: measurable evidence routed | PASS, load/layout-shift/long-task/latency/motion evidence routed to `accessibility_performance.md`, no thresholds restated |
| Evergreen audit | PASS, the new section carries no spec/packet/phase IDs and no `specs/` paths, only evergreen owner-doc references |
| Scope audit | PASS, only `hardening_edge_cases.md` is this phase's change; sibling template/script edits belong to a different phase |
| Acceptance nature | Advisory review (no checker) — the matrix is a walked reference; the probe bites by an auditor filing a finding |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisory, not enforced.** The section proves the audit now *asks* the five constrained-context questions and records a verdict with evidence for each. It does not prove the surface actually survives the constraint — that judgment is the auditor's, captured as evidence, not a number a script returns. There is no checker over `hardening_edge_cases.md`; the bite is an auditor filing a finding, the same as every existing matrix row.
2. **No routing-corpus impact.** `hardening_edge_cases.md` is not a hubRoute scenario source — only `manual_testing_playbook/` feeds the routing corpus — so this edit does not change which scenarios the router sees.
3. **Optional metadata touches deferred.** The flagged frontmatter description, `version` bump (`1.0.0.0` stays), and routing-summary bullet were not applied; the core section stands without them and a later pass can add them inside the same file.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale `status` and source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
