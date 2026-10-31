---
title: "Implementation Summary"
description: "A second independent reading of the decommission, on SWE-2 Max. Five iterations, grounded and spot-check clean, with one fabricated artifact and one overstated claim found by verifying rather than trusting the exit code."
trigger_phrases:
  - "swe-2 research summary"
  - "second lineage findings"
  - "fabricated state log timestamps"
  - "latent failure untraveled path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2"
    last_updated_at: "2026-09-12T07:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Five-iteration SWE-2 lineage completed and verified against the repository"
    next_safe_action: "Nothing outstanding; the third reading landed under phase 012"
    blockers: []
    key_files:
      - "research/lineages/swe-2-research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01V4wzp8qRJRvyXdqxAYuJTi"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether a third reading adds anything was answered by phase 012: it did"
    answered_questions:
      - "Does the SWE-2 reading hold up under spot-check? Yes, nine commits and three file ranges"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-deep-research-swe-2 |
| **Completed** | 2026-09-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A second independent reading of the MCP decommission, so its lessons rest on more than one model's opinion. Five iterations on SWE-2 Max through the Devin route, convergence disabled, 24 minutes, one lineage. It never saw the DeepSeek reading that preceded it.

### What it found

Its central claim is that every latent failure sat on a path the healthy system never took. The fallback behind a working primary, the configuration inside a transport declaration, the shim outside the package being changed, the request handler behind a name that said transport. Promotion is what made the untraveled path load-bearing.

The sharpest instance is worth repeating on its own. The worst symptom of the broken prompt hook was that it got *faster*, because it had stopped doing the work. A faster number read as an improvement until someone checked what it stopped doing.

It also produced an eleven-class residue taxonomy and a twenty-one step migration checklist, ordered so that the steps preventing the most expensive failures come first, where expensive means the cost lands somewhere the change's own tests never look.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created | The phase's own documents |
| `research/lineages/swe-2-research/` | Created | Five iteration records, five prompts, and the synthesis |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The model was probed live before anything was wired, because a documented id that fails at resolution is a failure this repository has already shipped once. It replied, so the fan-out allowlist was widened to accept it.

The run was then verified rather than trusted. That distinction earned its keep twice here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Withhold the prior lineage's output | Agreement between two readings means nothing if the second one read the first |
| Disable convergence and force five iterations | Depth was the point; an early stop would have bought nothing |
| Count iteration records rather than read the exit status | The run exited zero while part of its own bookkeeping was fiction |
| Report the fabricated timestamps rather than let the exit code speak | The anomaly detector caught it, and swallowing it would have made the next run's timings unreadable too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records | PASS — five, plus five prompts |
| Nine cited commits | PASS — all exist, subjects match the claims made about them |
| Three cited file ranges | PASS — all three land on the named code |
| Lineage status | PASS — completed, terminal, no stall or orphan |
| State-log timestamps | FAIL — seventeen of eighteen fabricated on round twenty-minute marks against a run that spanned twenty-four minutes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The state log's timing is fiction.** The findings are unaffected because they cite commits and files, but nothing in that log can be used to reconstruct what happened when.
2. **One claim overstates its citation.** The rehomed environment block is described as carrying four keys; it carries two. The other two live elsewhere.
3. **Nothing was re-measured.** Write containment barred commands outside the lineage, so every test count and latency figure is a packet-document claim rather than an observation. The lineage says so itself.
<!-- /ANCHOR:limitations -->

---
