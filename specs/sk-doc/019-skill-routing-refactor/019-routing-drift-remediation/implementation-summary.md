---
title: "Implementation Summary: Post-019 routing drift remediation"
description: "Outcome of the six remediation items: the compiled-route probe no longer reports serving state it cannot substantiate, a hub silently served by legacy is back on compiled, and the documentation and packaging drift is closed. One pre-existing sync-path defect is recorded, not fixed."
trigger_phrases:
  - "routing drift remediation outcome"
  - "compiled serving fix status"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped all six items; verified probe agreement with resolver ground truth across all seven hubs"
    next_safe_action: "Repair the stale sync path"
    blockers: []
    key_files:
      - ".opencode/bin/compiled-route-status.cjs"
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Packet** | sk-doc/019-skill-routing-refactor/019-routing-drift-remediation |
| **Files changed** | 16 (~350 lines) |
| **Verification** | Resolver ground truth, baseline delta, four independent checkers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six fixes, two of which were defects discovered while remediating the other four.

**Serving observability.** The status probe declared `compiled-serving` whenever a hub's manifest said
`compiled` and the engine did not throw. It never checked the serve-time identity binding the resolver
enforces, so a hub whose content changed after its generation was minted reported green while the resolver
silently fell back to legacy. The probe now gates on manifest freshness and on routing the selected
generation, and its stated contract documents both new drift cause codes.

**Manifest refresher.** Re-minting the drifted hub failed closed with a compile error. The cause was
structural: the refresher called the generic canonical compiler — which throws on a graduated hub's packet
kinds — instead of preferring the shadow-child snapshot the freshness check already used, and it wrote a
bumped generation the engine never routes. It now prefers the snapshot and selects the generation the
compiled policy actually carries.

**Restored serving.** With the refresher fixed, both stale manifests were re-minted. All seven activated hubs
now genuinely resolve compiled.

**Documentation and packaging.** Seven hub feature catalogs still described compiled routing as off-by-default
after the cutover; a leaf manifest omitted a live, indexed model profile; a hub's `description.json` lagged its
`SKILL.md`; a `SKILL.md` had grown past the hard word cap; and two fixtures lacked required frontmatter.

### Files Changed
| Area | Files |
|------|-------|
| Runtime | Status probe, manifest library, two activation manifests |
| Skills | Seven feature catalogs, one leaf manifest, one `description.json`, one `SKILL.md`, two fixtures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three sequenced phases, with the riskiest surface handled first and directly.

Phase one established truth before changing anything: baselines were captured, each survey finding was
re-verified against the live tree, and the probe gained its freshness and identity gates. The new report was
then checked against the resolver rather than against itself.

Phase two restored serving. The first re-mint attempt failed closed, which exposed the refresher defect; that
was fixed, and a first attempt at the generation fix was caught by ground-truth verification and corrected to
use the codebase's own normalizer before the manifests were re-minted.

Phase three ran concurrently. The mechanical documentation and packaging work was delegated to a separate
executor under a hard scope lock — no deletions, no git write commands, an explicit file list — with a
pre-dispatch snapshot used afterwards to confirm nothing outside that list was touched. Its edits incidentally
staled a second hub's manifest, which phase one's gate surfaced immediately and phase two resolved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Truth before change.** The probe was fixed and verified before any manifest was re-minted, so the re-mint's
  effect could be observed rather than assumed.
- **Mirror the resolver, don't approximate it.** The probe reuses the resolver's identity comparison, so the two
  cannot drift apart again by construction.
- **Fail closed stays.** Both the compile-error path and the concurrent-flip path keep their existing
  fail-closed behaviour; the new gates only add drift cause codes.
- **Scope discipline over opportunism.** A stale authored path in the sync tool was found and deliberately not
  fixed, because the fix implies renumbering the live promoted mirror — an operator decision, recorded as an
  open question.
- **Parallel delegation under a hard scope lock.** The mechanical documentation work ran concurrently with a
  pre-dispatch snapshot used to verify no out-of-scope file was touched.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Ground truth, not self-report:** `resolveRoute` was called directly for each of the seven activated hubs —
  all return a compiled route — and the probe's report agrees for exactly those seven.
- **Negative case observed, not simulated:** the parallel documentation edits staled a second hub's manifest
  mid-run. The new gate surfaced it as a stale manifest instead of a false green; re-minting restored it. That
  is the defect class this work exists to prevent, reproduced incidentally and handled correctly.
- **Baseline delta:** the manifest suite was captured before the change (16 pass / 1 fail) and re-run after
  (16 pass / 1 fail) — unchanged, so the single remaining failure is pre-existing.
- **Independent checkers:** leaf-manifest freshness across every skill that ships one, strict packaging for both
  touched packets, and a word count against the documented cap.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Requirement | Evidence |
|-------------|----------|
| Fail-safe | Both new gates return a cause code and return early; no new throw path into routing |
| Observability | Non-serving conditions are now distinguishable by cause code rather than collapsing into one sentinel |
| No routing-decision change | The re-mint selects the identity the engine already computes; the resolver's logic is untouched |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stale authored path in the sync tool (unfixed, pre-existing).** The compiled-route sync tool points its
   authored root at a phase path that no longer exists. It is the one failing case in the manifest suite and it
   predates this packet. Repointing it would renumber the live promoted mirror, so the layout question needs an
   operator decision first.
2. **Re-minting is content-triggered.** Any edit to a hub's routing inputs re-stales its manifest. The probe now
   makes that visible immediately, but nothing yet re-mints automatically.
3. **Parity is not re-established by a re-mint.** Restoring the selected identity restores compiled serving; it
   does not re-run the compiled-versus-legacy parity evidence for the new content.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- The plan anticipated four remediation items. Two additional defects were found during execution — the
  refresher bug and the stale sync path — and are recorded rather than hidden.
- The re-mint was expected to be a single tool invocation. It required fixing the tool first, which was
  escalated and approved before proceeding rather than worked around.
- A first attempt at the generation fix used a raw field read and wrote a generation the engine never routes.
  It was caught by ground-truth verification and corrected to use the codebase's normalizer.
<!-- /ANCHOR:deviations -->
