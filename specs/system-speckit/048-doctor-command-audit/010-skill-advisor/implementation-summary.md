---
title: "Implementation Summary"
description: "Audit /doctor:speckit skill-advisor against this checkout and repair its addressing: the workflow now uses the advisor CLI, the route declares runnable commands, and the drifted assertions are corrected."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/010-skill-advisor"
    last_updated_at: "2026-10-02T20:59:43Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase docs from the observed evidence"
    next_safe_action: "Commit the packet files on the phase branch"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-skill-advisor.yaml"
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-speckit-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-skill-advisor"
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
| **Spec Folder** | 010-skill-advisor |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: fix. `/doctor:speckit skill-advisor` keeps its subject — the advisor's scoring lanes, its CLI and its live graph — but its addressing had drifted, so the workflow, its route entry and the presentation were repaired in place.

### Phase 10: skill-advisor

The doctor audits and re-tunes the skill advisor's scoring lanes: TOKEN_BOOSTS and PHRASE_BOOSTS in `explicit.ts`, derived triggers and topics in the per-skill graph metadata, and `CATEGORY_HINTS` in `lexical.ts`. It proposes changes per skill, gates them behind approval, captures a baseline, generates a rollback script, and validates the graph and the test suite after any edit. This phase left that design alone and fixed the pointers: the four call sites still addressed the removed `system_skill_advisor` MCP namespace, five of the eight route commands exited 64 when run verbatim, the rollback script's build had no root manifest to resolve, phase 0 assumed frontmatter triggers and root manifests that are not there, and the proposal validator enforced a boost range narrower than the map it validates. An operator who runs the doctor now reaches the advisor through the CLI front door and sees results that match this checkout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-skill-advisor.yaml` | Modified | Reached the advisor through `node .skilled/bin/skill-advisor.cjs` at all four former MCP call sites; inventory reads use the skill folders and graph metadata; rollback build uses `npm --prefix`; token and phrase boost ranges are split; phase 0 assertions corrected; `<packet_scratch>` placeholder and read-context comment |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The `skill-advisor` route: every declared command line carries its required arguments, gate 3 names the two author-lane files, and `mcp_tools: []` is declared |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | A labelled Skill-Advisor Scope prompt, and the retrieval scope prompt relabelled so another target cannot consume it |
| `scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md` | Created | The audit inventory, the read-only run log, and the repair proposal with the recorded findings |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran as an audit first and an apply second. The audit followed the workflow's own steps read-only and stopped at every write, so the graph database, the lane sources and the runtime `dist/` were never touched. GPT-6 Luna (cli-codex, max, fast) applied the repairs as one batch, because the doctor targets share their route manifest, router and presentation; the orchestrator reviewed the diff and reran the gates itself. The route validator exits 0, every edited YAML parses, the catalog mirror check reports STATUS=OK, the mutation-class guard passes, and the doctor script tests show no regression. The packet docs were closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair in place rather than retire the target | Every asset the workflow needs exists; only its addressing was stale, so fixing the pointers is cheaper and safer than losing a working audit surface |
| Address the advisor through the CLI front door | An earlier decommission removed the MCP transport, so the CLI is the only surface, and the route already named it |
| Source the skill inventory from the skill folders and `.skilled/skills/*/graph-metadata.json` | `skill_graph_status` has no `skills` key, and the metadata files are where derived trigger phrases live |
| Split the boost range instead of widening one bound | `TOKEN_BOOSTS` stays inside `[0.0, 1.0]`; `PHRASE_BOOSTS` runs from -0.6 to 1.8, so its range is `[-1.0, 2.0]`, a deliberate envelope around the observed amounts |
| Record subsystem defects instead of fixing them | The findings belong to the advisor, not the doctor, and the packet decision is to record them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Route manifest validator: `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0; `OK: route-validate — 9 routes validated, 2 warnings` |
| YAML parse: `python3 yaml.safe_load` over every doctor asset YAML and `_routes.yaml` | YAML_OK |
| Catalog mirror: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | STATUS=OK, exit 0 |
| Mutation-class guard: `check-mcp-mutation-class.sh` | GUARD PASS |
| Removed-namespace sweep: `rg` for the removed MCP namespace and stale graph-script names over the edited doctor files | No matches |
| Doctor script tests: `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` fail exactly as at baseline (their temporary fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree) | Pass; no regression |
| Startup menu | Shows `12) runtime mirrors` and `13) router reach`, which were accepted answers but were not displayed before |
| Packet validation: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/010-skill-advisor --strict` | `Summary: Errors: 1, Warnings: 0` — the one error is the enforced `SOURCE_FINGERPRINT_MISMATCH` on the derived graph metadata, which a doc edit invalidates by design and `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-speckit/048-doctor-command-audit/010-skill-advisor --apply` refreshes; every authored check passes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded finding: the graph reads as live while every tracked skill is stale.** `skill_graph_status` reports `freshSourceFiles: 0` and `changedSourceFiles: 14`, and the `sk-git` node's stored content hash differs from the file's current `shasum -a 256`, yet `advisor_status` returns `freshness: live`. The two surfaces disagree because `staleness` compares content hashes while `freshness` compares mtimes.
2. **Recorded finding: `advisor_status.skillCount` counts metadata files, not skills.** The live value is 20 while the checkout has 14 skill folders, because the scan walks the tree recursively and picks up six test fixtures.
3. **Recorded finding: changes made outside the CLI process do not move the freshness verdict.** A database indexed later than its sources reads as live even when the node hashes differ; a content-hash comparison would be the signal that catches it.
4. **Recorded finding: `PHRASE_BOOSTS` amounts are unbounded and undeclared.** The map uses penalties down to -0.6 and anchors up to 1.8, and no constant, schema or doc states a permitted range.
5. **Recorded finding: the advisor scorer reference cites moved line ranges.** `references/scoring/advisor-scorer.md` cites `explicit.ts:8-90` and `:92-186` for the two maps, which actually occupy `:27-107` and `:109-240`; the neighbouring `lexical.ts` citation is accurate.
6. **Recorded finding: the mutating CLI tools require `--trusted` and the subsystem docs never say so.** `advisor_rebuild` and `skill_graph_scan` exit 64 without it, which is the moment an operator is trying to repair state.
7. **Recorded finding: frontmatter trigger phrases exist for one skill out of fourteen.** The rest live in `graph-metadata.json` and body `Keywords:` comments, so any tool that reads routing phrases from frontmatter sees coverage for 1 of 14.
8. **The recorded run was read-only.** The mutating path — source edits, rebuild and the advisor test suite — was verified by command-line probes and the route validator, not by executing a mutation.
9. **The phrase-boost envelope is an operator judgment call.** The observed amounts run -0.6 to 1.8 and the declared `[-1.0, 2.0]` is a deliberate bound around them, not a measured contract.
<!-- /ANCHOR:limitations -->

---


