---
title: "Implementation Summary"
description: "The closing measurement found three claims that were true when each phase made them and false at the end, two of them invisible to the validator nominally responsible."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof"
    last_updated_at: "2026-09-06T13:52:18Z"
    last_updated_by: "claude-code"
    recent_action: "Repaired 4 dangling graph edges and reconciled 3 canon documents"
    next_safe_action: "Hand the blocked FLOWCHART fixtures to the owner of the sk-doc benchmark corpus"
    blockers: []
    key_files:
      - "specs/sk-design/018-sk-design-parent-v2/scratch/routing-after-005.txt"
      - "specs/sk-design/018-sk-design-parent-v2/scratch/routing-regressions.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-closure-and-routing-proof |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not a feature: a measurement, and the repairs it forced.

Four phases had each closed against evidence they gathered themselves, at the moment they ran. This
phase measured the fleet from the closing state instead, and found three claims that were true when
made and false afterwards.

### Four dangling graph edges, and a validator that could not see them

The rebuild reported `rejectedEdges: 4`, which no earlier step had read. Phase 003 folded the md
generator's sibling edges into the hub by concatenation, without retargeting or deduplication, so
four edges named a skill that no longer exists — including `sk-design` pointing at itself.

`skill_graph_validate` reported `isValid: true, errorCount: 0` throughout, because the builder drops
a dangling edge at build time. The graph was clean; the sources were not. **A validator that reads a
built artefact cannot see a defect the build silently repairs.**

The edges were not inert. Repairing them raised the indexed edge count from 50 to 52 and moved two
scores: `extract design tokens from stripe.com` from 0.896 to 0.9026, and `redraw this drawio
diagram` from 0.82 to 0.8252 — the phrases the merge was supposed to help.

### Two stale derived blocks

`sk-design` carried three dead `key_files` references and one dead `source_doc`; `sk-doc` carried
one. The regenerator's default is a dry run: the first two invocations printed the changes and wrote
nothing, which would have read as success to anyone checking output alone.

### Three documents describing a fleet that no longer exists

The canon fleet class table listed `sk-design` as standalone and `sk-design-md-generator` as a root.
Rewriting it from the live audit's own output surfaced a third error nobody had reported: `sk-prompt`
was listed class H and is class S. The four-hubs extension matrix still said the hub "was
decommissioned into two standalone skills and is no longer an example of this shape". `016` recorded
no supersession from its own side.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/graph-metadata.json` | Modified | Dangling sibling edge and self-loop removed |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modified | Sibling edge retargeted to the hub |
| `.opencode/skills/sk-communication/graph-metadata.json` | Modified | Same retarget; the rewritten row brought into the recommended weight band |
| `.opencode/skills/sk-design/graph-metadata.json`, `sk-doc/graph-metadata.json` | Modified | Derived blocks regenerated |
| `.../references/shared/skill-root-metadata-contract.md` | Modified | Fleet class table rewritten from the audit output |
| `.../references/parent-skill/parent-skills-nested-packets.md` | Modified | Extension matrix row restored to `sk-design` |
| `specs/sk-design/016-.../spec.md` | Modified | Records its own partial supersession |
| `scratch/routing-after-005.txt` | Created | The closing replay |
| `scratch/routing-regressions.md` | Modified | The closing measurements and the edge finding |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Rebuild, measure, repair, re-measure. Every routing number is quoted with the daemon generation it
was taken at: 632 to 633 for the first rebuild, 637 to 638 after the repair.

Two gates in this fleet lie in different ways, and both were caught by reading output rather than
exit codes. `validate-playbook-topology` prints `verdict=FAIL` and exits 0 unless `--strict` is
passed. `skill_graph_validate` reports clean while the builder rejects four edges on every run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the rebuild's `rejectedEdges` count as a gate | It is the only surface that reports this defect class; the graph validator structurally cannot. |
| Use `--strict` wherever a gate offers it | Without it, one gate converts a failure into exit 0. |
| Rewrite the canon fleet table from the audit's own output rather than by hand | It caught a third error that hand-editing for the two known ones would have missed. |
| Leave `016`'s reasoning as written | It is the record of a decision that was correct when taken. Only the supersession is added. |
| Name the blocked FLOWCHART fixtures rather than move or delete them | Every available path deletes tracked coverage, fabricates a scenario under a published id, or splits a corpus mid-benchmark. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor rebuild | generation 632→633, then 637→638; `rejectedEdges` 4→0; edges 50→52 |
| Sixteen-phrase replay, generation 638 | 0 reach nobody, against 4 at baseline; 3 `sk-doc` controls byte-identical |
| Fleet metadata audit | 13/13 pass, `sk-design` and `sk-doc` both class H |
| `ci-leaf-manifest-freshness` | 13 fresh, 0 failed |
| `ci-skill-derived-freshness` | 13 fresh, 0 stale, exit 0 |
| `skill_graph_validate` | 0 errors |
| `check-corpus.cjs --render` | `RESULT: PASSED`, errors: 0 |
| `validate.sh --strict` | `RESULT: PASSED`: parent, 5 children, and `016` (8 folders) |
| `validate-playbook-topology --strict` | **FAIL** on `sk-doc`: `valid=28 blocked=4`, exit 1 |
| `validate-compiled-routing-scenarios --strict` | **FAIL** on `SD-CR-001`, exit 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`sk-doc`'s typed-gold playbook gate is red, and this packet caused it.** Four fixtures assert
   `sk-doc` owns FLOWCHART, which phase 004 made false. Three would validate under `sk-design`, which
   has no hub playbook root; the fourth pairs a `sk-doc` mode with a `sk-design` mode and validates
   under neither, since the gate is per-hub by design. The corpus is keyed to benchmark reports from
   2026-07-21 that reference these scenario ids. Recorded with its options for the owner of that
   corpus.
2. **`SD-CR-001` fails on missing pass/fail criteria.** Confirmed pre-existing since 2026-09-02,
   before this packet's first commit, and unrelated to design routing. Named, not fixed.
3. **The fleet-wide vocabulary finding is untested beyond these two hubs.** Vocabulary in
   `description.json` moves no advisor score; if that is why long phrases miss elsewhere, it is worth
   checking before anyone writes a packet to tune scorer thresholds.
4. **Four phrases score lower than baseline, and every one changed owner.** Comparing them compares
   two different identities. The substantive test — does the phrase reach the skill that owns the
   work — passes in all four.
<!-- /ANCHOR:limitations -->

---
