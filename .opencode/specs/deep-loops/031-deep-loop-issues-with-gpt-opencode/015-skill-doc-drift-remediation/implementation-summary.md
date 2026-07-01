---
title: "Implementation Summary: Skill Documentation Drift Remediation"
description: "Patched all 6 confirmed drift clusters from phase 014's audit: stale ai-council direct-invoke guidance in cli-opencode, retired .opencode/agents/*.toml mirror references across 5 SKILL.md docs plus deep-improvement's scanner code and 6 supporting docs, a stale plugins/README.md entrypoint count, and cli-opencode's internal self-contradiction on orchestrate routing. Also found and fixed 13 additional real .toml references and a pre-existing REPO_ROOT path bug during post-fix verification."
trigger_phrases:
  - "implementation"
  - "summary"
  - "skill doc drift remediation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation"
    last_updated_at: "2026-07-01T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 6 clusters patched and verified; packet complete"
    next_safe_action: "None -- packet complete; phase 016 is a separate new-engineering follow-up"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-015-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cluster 4: retire the .toml mirror check entirely (2-mirror model), matching mirror-sync-verify.cjs's earlier fix this session."
      - "Cluster 6: keep orchestrate's @deep-review row (load-bearing per deep-review.md's Caller contract); narrow cli-opencode's internal self-contradiction instead."
---
# Implementation Summary: Skill Documentation Drift Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `015-skill-doc-drift-remediation` |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every one of phase 014's 6 confirmed drift clusters is now patched to match current runtime reality. This was a documentation and one-scanner-config correction phase — no production agent behavior changed, only what the docs (and one hardcoded scanner template list) claim about it.

### Cluster 1 — cli-opencode direct `ai-council` dispatch

`SKILL.md` (lines ~31, ~285), `README.md` (lines 76, 164), `assets/prompt_templates.md` Template 10, `manual_testing_playbook.md`'s CO-017 entry, and its linked feature file `04--agent-routing/multi-ai-council-multi-strategy.md` all previously instructed direct `--agent ai-council` dispatch. All now route through `--agent orchestrate` with an ai-council-shaped prompt, or `/deep:ai-council`, matching the already-correct `references/agent_delegation.md`.

### Clusters 2/3/4 — retired `.opencode/agents/*.toml` mirror

Removed the stale 3rd-mirror requirement from `deep-research/SKILL.md` (+ `capability_matrix.md`), `deep-review/SKILL.md` (+ `loop_protocol.md`), `deep-context/SKILL.md`, `deep-loop-runtime/SKILL.md`, and `deep-ai-council/SKILL.md` (+ `output_schema.md`) — all now describe a 2-mirror model (`.opencode/agents/*.md` canonical + `.claude/agents/*.md` mirror). Per operator decision, also retired the check in code: `deep-improvement/scripts/agent-improvement/scan-integration.cjs`'s `MIRROR_TEMPLATES` array dropped its `.toml` entry, and its 6 supporting docs (`README.md` x2, `feature_catalog/.../runtime-mirrors.md`, `references/agent_improvement/integration_scanning.md` x2, `references/agent_improvement/mirror_drift_policy.md`, `references/shared/promotion_rules.md`) were updated to match.

### Cluster 5 — `plugins/README.md` entrypoint count

Updated the frontmatter description ("Three" → "Six" plugin entrypoint files) and added the missing `mk-deep-loop-guard.js` row to the Current Entrypoints table, matching the real 6-file `.opencode/plugins/` directory.

### Cluster 6 — orchestrate/cli-opencode routing tension

A dedicated investigation (launched before touching either file, per the operator's explicit instruction) found that removing orchestrate's `@deep-review` Priority row — the operator's initial framing of "revisit orchestrate's routing" — would reopen the exact gap phase 009 closed and break `deep-review.md`'s own documented Caller contract ("`@orchestrate`: caller/coordinator only, this agent must not call it back"). The real defect was `cli-opencode/SKILL.md` contradicting **itself**: one line listed `deep-review`/`deep-research` as routable through `orchestrate`, another said never to route them through `orchestrate` — in the same file. Fixed by reconciling both lines: `orchestrate` may perform exactly one bounded hand-off dispatch to a command-owned loop executor, but must never re-implement the loop (no iterating, no convergence tracking). `orchestrate.md` itself was intentionally left untouched in both runtimes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Clusters 1 + 6 |
| `.opencode/skills/cli-opencode/README.md` | Modified | Cluster 1 |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modified | Cluster 1 |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Modified | Cluster 1 |
| `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy.md` | Modified | Cluster 1 |
| `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md` | Modified | Cluster 2 |
| `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md` | Modified | Cluster 2 |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Modified | Cluster 3 |
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md` | Modified | Cluster 3 |
| `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | Modified | Clusters 2/3 |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modified | Clusters 2/3 |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md` | Modified | Clusters 2/3 |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/output_schema.md` | Modified | Clusters 2/3 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Modified | Cluster 4 (code) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/README.md` | Modified | Cluster 4 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/02--integration-scanning/runtime-mirrors.md` | Modified | Cluster 4 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md` | Modified | Cluster 4 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/mirror_drift_policy.md` | Modified | Cluster 4 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md` | Modified | Cluster 4 |
| `.opencode/plugins/README.md` | Modified | Cluster 5 |
| 13 additional files (deep-research/deep-review manual_testing_playbook + `07--command-flow-stress-tests/setup-cp-sandbox.sh` x2; deep-review's `assets/review_mode_contract.yaml`; deep-ai-council feature_catalog + playbook files) | Modified | Additional `.toml` references found via post-fix re-scan (beyond phase 014's citation sample) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Scaffolded the phase, then got two explicit operator decisions before touching anything ambiguous: Cluster 4 (retire the TOML check, matching this session's earlier `mirror-sync-verify.cjs` precedent) and an initial Cluster 6 direction ("revisit orchestrate's routing"). Rather than immediately acting on the Cluster 6 answer, launched a dedicated read-only investigation first — this surfaced that the operator's initial framing, if executed literally (removing orchestrate's row), would have introduced new breakage. Reported this back before editing, and the operator agreed to the investigation's recommended direction instead (narrow cli-opencode's wording).

Implemented Clusters 1, 2/3/4, and 5 directly against phase 014's cited file:line locations, re-confirming each citation was still accurate before editing (none had drifted). Fixed Cluster 6 last, after the investigation resolved.

After the 6 originally-cited clusters were done, ran a broader scoped grep across the whole `deep-loop-workflows`/`deep-loop-runtime`/`cli-opencode` tree (not just the originally-cited files) — per phase 014's own Plan Seed instruction to "re-run scoped grep... after edits" — and found 13 more real, live `.opencode/agents/*.toml` references that phase 014's citation sample hadn't enumerated (manual-testing-playbook scenario files, two sandbox-setup shell scripts, a YAML mode contract, and two deep-ai-council files). Fixed all 13, since they're the identical category of confirmed drift, just outside the originally-sampled list.

While live-testing the two fixed `setup-cp-sandbox.sh` scripts end-to-end (not just checking `bash -n` syntax), discovered both failed with a doubled `.opencode/.opencode/` path — a pre-existing `REPO_ROOT` off-by-one bug (5 `../` levels instead of 6) that predates this session entirely (confirmed via `git log`) and was unrelated to the `.toml` edit itself. Fixed it in both scripts since it was blocking verification of my own actual change, then confirmed both scripts now run to completion and produce the correct 2-file sandbox.

One `deep-improvement` fixture script (`08--agent-discipline-stress-tests/setup-cp-sandbox.sh`) was deliberately left untouched: its referenced `.md`/`.claude/agents/*.md` fixture paths are also missing entirely (a `060-stress-test` fixture directory that doesn't exist), which is a separate, broader pre-existing issue unrelated to the TOML mirror removal specifically — fixing it would mean creating missing fixture files, out of this phase's scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Investigated Cluster 6 before editing, even after the operator's initial answer | The operator's first answer ("revisit orchestrate's routing") was made without knowing whether removing the row was safe. A dedicated investigation is cheap; reverting a load-bearing routing row that breaks another agent's documented contract is not. |
| Kept `orchestrate.md`'s `@deep-review` row untouched in both runtimes | It's load-bearing: `deep-review.md`'s own "Caller/coordinator only" contract already depends on it, and removing it would reopen the exact routing gap phase 009 was built to close. |
| Fixed 13 additional `.toml` references beyond phase 014's citation sample | Phase 014's own Plan Seed explicitly called for a post-fix re-scan; these are the same category of confirmed drift, not new scope. |
| Fixed the pre-existing `REPO_ROOT` off-by-one bug in two sandbox scripts | Found while live-verifying my own fix (not just syntax-checking); leaving it would mean I couldn't confirm my actual change worked end-to-end, and it's a one-line, low-risk fix. |
| Left `deep-improvement`'s `08--agent-discipline-stress-tests/setup-cp-sandbox.sh` untouched | Its brokenness predates and is unrelated to the TOML removal (missing `.md` fixtures too, not just `.toml`) — fixing it is a separate, larger task (creating fixture files) outside this phase's scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scoped grep re-scan, Cluster 1 (`--agent ai-council`) | PASS — all remaining hits correctly framed as rejected/forbidden, no operational guidance to do it |
| Scoped grep re-scan, Clusters 2/3/4 (`.opencode/agents/*.toml`) across `deep-loop-workflows`/`deep-loop-runtime`/`cli-opencode` | PASS — zero hits, except one pre-existing unrelated `deep-improvement` fixture issue (noted, not fixed) |
| `scan-integration.cjs` smoke test post-edit | PASS — `node scan-integration.cjs --agent=deep-review` runs clean |
| `deep-improvement` vitest suite | 411/413 passing — same 2 pre-existing failures confirmed unrelated earlier this session, no regression from this phase's edit |
| Comment-hygiene check (`scan-integration.cjs` + 2 shell scripts) | PASS, exit 0 |
| `verify_alignment_drift.py` (`deep-loop-workflows`, `cli-opencode`, `plugins`) | PASS, 0 findings across all three roots |
| `bash -n` syntax check, both fixed sandbox scripts | PASS |
| Live end-to-end run, both fixed sandbox scripts | PASS — both produce the correct 2-file mirror sandbox after the `REPO_ROOT` fix |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`deep-improvement`'s `08--agent-discipline-stress-tests/setup-cp-sandbox.sh` remains broken** for reasons unrelated to this phase (missing `.md`/`.claude` fixtures, not just `.toml`) — flagged, not fixed.
2. **Cluster 6's fix is a wording reconciliation, not new enforcement.** It clarifies the contract; it doesn't mechanically prevent `orchestrate` from misusing the loop-executor hand-off. That mechanical enforcement is deferred to phase 016.
3. **The 13 additional `.toml` references were found via one broad grep pass**, not an exhaustive audit — a residual instance elsewhere in the repo (outside `deep-loop-workflows`/`deep-loop-runtime`/`cli-opencode`/`plugins`) is possible but was not the stated scope of phase 014's finding.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Phase `016` (already scaffolded as a task, not yet a spec folder): harden `.opencode/plugins/mk-deep-loop-guard.js` with orchestrate-specific loop-detection logic, mechanically blocking repeated/loop-like `orchestrate` → command-owned-loop-executor dispatches while allowing exactly one bounded hand-off — directly addressing phase 012's measured GPT-5.5 enforcement inconsistency (refused one direct `deep-research` dispatch citing the rule, allowed an identical direct `deep-review` dispatch in a separate run). This is new engineering (session-scoped dispatch-history tracking), not a doc fix, and needs its own spec/plan before implementation.
<!-- /ANCHOR:followup -->
