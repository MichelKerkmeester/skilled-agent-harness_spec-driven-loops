---
title: "Implementation Summary"
description: "Keep verdict for `/doctor:speckit skill-graph-freshness`: the route, its workflow asset, its read-only script, its flags and its presentation row all still match the system they cover, so the verdict was applied by changing nothing."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/012-skill-graph-freshness"
    last_updated_at: "2026-10-02T21:10:32Z"
    last_updated_by: "doc-closure"
    recent_action: "Closed the phase documentation for the keep verdict"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "scratch/reality-check.md"
      - "scratch/doctor-run.log"
      - "scratch/proposal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-skill-graph-freshness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-skill-graph-freshness |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: keep.** `/doctor:speckit skill-graph-freshness` still matches the system it inspects: its script `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`, its three data sources, its routed command, its flags, its mutation class and its presentation rows all exist and behave as the workflow assumes, and the check was observed firing on real three-way disagreement rather than only on a clean checkout. Nothing was edited to apply the verdict.

### Phase 12: skill-graph-freshness

The target reads three representations of the same skill graph — the compiled `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the SQLite `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` and the depth-1 `.skilled/skills/*/graph-metadata.json` files — and prints the zombie, missing, ghost, family-mismatch and null-stamp sets between them. On this checkout the three agree exactly at 14 skills each, and an independently written recomputation over the same sources produced the same result, so the panel's clean report is not an artifact of its own implementation. The panel also stayed correct away from the clean case: pointed at other checkouts' databases it reported real zombie and missing rows, and with the database absent it dropped the SQLite-derived sets and still exited 0.

Keeping the target is the minimal honest outcome. The one named thing that does not resolve is the `contract: "local command design contract"` key in the workflow asset, which no file defines and no consumer reads; eight of the fourteen doctor workflow assets carry the same key, so a per-target edit would leave this file inconsistent with its siblings without removing the dangling reference anywhere. Two prose imprecisions ("source sizes" for counts, and a "reindex staleness check" phrase wider than what the five sets compute) are cosmetic, and the second is recorded as a finding.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/reality-check.md` | Created | The inventory of every path, script, command, flag and variable the route and workflow name, with the command that showed each |
| `scratch/doctor-run.log` | Created | The full read-only run transcript, the detection and degradation probes and the independent recomputation |
| `scratch/proposal.md` | Created | The `keep` verdict, its evidence table, the non-blocking observations and the four subsystem findings |
| `graph-metadata.json` | Regenerated | The derived source fingerprint and status were re-derived from the closed documents so the strict generated-metadata gate passes |
| No production file | Unchanged | The keep verdict leaves the route, the workflow asset, the script and the presentation row untouched |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit ran read-only first: line-numbered reads of the route, the router, the workflow, the script and the presentation; the exact route command twice with no arguments; detection probes against two foreign databases and an absent database; an independent recomputation of the five sets; and before-and-after hashes of every source. The `keep` verdict was then applied by making no edit to the target. The batch around it was executed by GPT-6 Luna through `cli-codex` (max, fast) because the `/doctor:speckit` targets share `_routes.yaml`, `speckit.md` and `doctor-speckit-presentation.txt`; the orchestrator reviewed the diff and reran the gates itself. Route validation exits 0 with 9 routes validated after the batch, every doctor asset YAML parses, the catalog mirror check returns `STATUS=OK`, the MCP mutation-class guard passes, and the doctor script tests match their recorded baseline. The three files in `scratch/` are the phase's evidence; the target itself needed no change. Closing the documents staled the generated source fingerprint in `graph-metadata.json`, so the repository's own remediation, `repair-derived.cjs --apply`, re-derived the generated metadata in the same folder; the strict validator then passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the target instead of fixing or retiring it | Every named asset exists and behaves as assumed; the one dangling reference is a family-level prose key that no consumer reads, so `fix` would change nothing this target owns |
| Record the four subsystem defects as findings, not fixes | The phase changes the doctor; defects in the subsystem it inspects are reported for a later decision, per the packet decision that says so |
| Do not edit the `contract:` key or the loose prose | Eight of the fourteen doctor workflow assets carry the same key, and the "source sizes" and "reindex staleness check" wording is cosmetic; both are family-level or wording changes, not repairs this phase should make |
| Leave the shared batch changes alone | The batch touched the startup menu rows 12 and 13 and the route count; this target's row 10 and route block do not depend on either, and route validation still passes |
| Use the environment override for the disagreement probes | `SYSTEM_SKILL_ADVISOR_DB_DIR` is the script's own single source override; pointing it at real foreign databases modelled source disagreement without writing fixtures |
| Regenerate the derived graph metadata after closing the documents | Editing the packet documents changes their fingerprint; `repair-derived.cjs` recomputes that derived fact from disk and is the validator's own named remediation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Exit 0 (`scratch/doctor-run.log:102`) |
| `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (the exact route command, no arguments) | Exit 0, source counts 14/14/14 and all five sets `none`; byte-identical on the second run (`scratch/doctor-run.log:107`, `:123`) |
| Detection with a 15-node and a 17-node foreign database | Fires — `ZOMBIE: cli-jev, sk-communication` and `MISSING: cli-classifier` at 15 nodes, four zombies at 17 nodes; read-only on both (`scratch/doctor-run.log:242`, `:257`) |
| Degradation with an absent database directory | `SQLite skill-graph.sqlite : absent`; the SQLite-derived sets drop, the compiled-versus-disk sets remain, exit 0 (`scratch/doctor-run.log:272`) |
| Independent recomputation of the five sets | Identical result: all sets `none`, both family comparisons `none`, both key sets equal, `compiled=sqlite=disk=14` (`scratch/doctor-run.log:483`) |
| Read-only in fact | The compiled JSON and SQLite shasums and all 14 disk mtimes and sizes are identical at baseline and after every run (`scratch/doctor-run.log:627`) |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 — `OK: route-validate — 10 routes validated, 2 warnings` at audit time (`scratch/doctor-run.log:378`); after the batch, exit 0 — `OK: route-validate — 9 routes validated, 2 warnings` |
| Batch gates | `python3 yaml.safe_load` → `YAML_OK` for every doctor asset and `_routes.yaml`; catalog mirror check `STATUS=OK`, exit 0; MCP mutation-class guard `GUARD PASS`; `skill-advisor-route-contract.test.cjs` passes and the three `parent-skill-check-*.test.cjs` files fail exactly as the pre-batch baseline |
| Retired-name scan | `rg` for `system_skill_advisor.`, `deep_loop_graph_status|query|convergence(` and `doctor_*` in the edited doctor files returns no matches |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/012-skill-graph-freshness --strict` | `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded finding: the compiled graph is older than one of the sources it compiles, and the panel cannot see it.** The compiled `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` carries `generated_at: 2026-09-29T07:49:34.068437+00:00`, while `.skilled/skills/cli-classifier/graph-metadata.json` carries `derived.last_updated_at: 2026-09-29T09:00:00Z` — 1 h 10 min later — and that file's last commit is a day after the compiled JSON's. The panel legitimately reports nothing, because `cli-classifier` is present in all three sources with family `cli`, so every set is `none`. The subsystem's own freshness model names stale-artifact states but compares source snapshots against the SQLite artifact, never the compiled JSON, so an id-invisible staleness of the compiled JSON is reported by neither layer while the route advertises a "reindex staleness check". Recorded, not fixed.
2. **Recorded finding: the SQLite half of the three-way diff is untracked runtime state.** `.skilled/skills/system-skill-advisor/runtime/database/.gitignore` ignores `*.sqlite`, so a fresh checkout has no database for the panel to read: it prints `SQLite skill-graph.sqlite : absent`, omits the zombie, missing and SQLite-family sets entirely, and still exits 0 with no degraded marker, silently turning the three-way diff into a two-way one. The subsystem distinguishes that state for its own artifacts but the panel's read-out carries no equivalent signal. Recorded, not fixed.
3. **Recorded finding: the disk scan's `z_archive` exclusion is inert, and depth-1 coverage is currently complete.** The script excludes a nested `z_archive/` tier, and no such directory exists anywhere under `.skilled/skills` today, so the exclusion does nothing. Depth-1 is the correct rule for this checkout — 14 skill roots carry metadata and the only deeper files are system-spec-kit CLI test fixtures at depths 7 and 9 — and the rule's safety depends on that distribution staying true. Recorded, not fixed.
4. **Recorded finding: family names and skill ids share one namespace.** The compiled graph's families include `sk-code`, and `.skilled/skills/sk-code/graph-metadata.json` carries `family: "sk-code"`, so `sk-code` is simultaneously a family name and the sole skill id inside it. A genuine family-mismatch line for that skill would read ambiguously to a reader and to text processing. Low severity, purely a naming collision. Recorded, not fixed.
5. **Two code paths were read, not run.** The family-mismatch and null-stamp sets never fired, because no pair of available sources disagrees on a family and every disk file carries `derived.last_updated_at`; the corrupt-database `unreadable` catch was also read rather than run. Building fixtures to force them was rejected because this audit could write only the three scratch files, so those paths are inference from the code rather than observation.
6. **The record is pinned to the audit commit `83616db9ba` and the pre-batch 10-route manifest.** The batch then retired the embeddings route and changed shared presentation rows; route validation was rerun after it and still exits 0. Three `parent-skill-check-*.test.cjs` suites fail in this worktree exactly as they did before the batch, because their temporary fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` here; that is a baseline condition, not a regression from this phase.
<!-- /ANCHOR:limitations -->

---
