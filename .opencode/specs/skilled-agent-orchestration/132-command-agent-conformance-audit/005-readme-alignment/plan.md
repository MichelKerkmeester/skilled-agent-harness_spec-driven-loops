---
title: "Implementation Plan: Phase 5: readme-alignment"
description: "Aligns authored repo READMEs to current command/agent/skill reality: fixes the 5 confirmed-stale changed-surface targets from research.md (install-guide catalog, mcp-code-mode transport table, bin naming, both agent README.txt .codex claims, CMD-09's dead folder_readme.md + create_agent_verified residue), then sweeps the remaining hub/index/mode-packet README universe as time permits."
trigger_phrases:
  - "readme alignment plan"
  - "cmd-09 readme fix"
  - "install guide catalog fix"
  - "005-readme-alignment plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/005-readme-alignment"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "fable-5"
    recent_action: "Authored sequenced implementation plan for 3 README findings"
    next_safe_action: "Wait for 002-004 handoff, then execute Phase 1-6"
    blockers:
      - "Phases 002-004 must land before README edits execute"
      - ".codex/agents mirror wording gated on phase 004's design decision"
    key_files:
      - ".opencode/install_guides/README.md"
      - ".opencode/skills/mcp-code-mode/README.md"
      - ".opencode/bin/README.md"
      - ".opencode/agents/README.txt"
      - ".claude/agents/README.txt"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/create/assets/create_readme_confirm.yaml"
      - ".opencode/commands/create/assets/create_readme_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: readme-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown / YAML (documentation prose only) |
| **Framework** | None — authored README + `/create:readme` workflow assets |
| **Storage** | None |
| **Testing** | `grep` assertions + `validate.sh --strict` |

### Overview
This phase edits documentation prose only: it corrects five confirmed-stale README targets against the on-disk hub structure (`cli-external`, `mcp-tooling`, `sk-prompt`, `system-deep-loop`, `sk-design`, `sk-code`, `sk-doc`, `sk-git`, `mcp-code-mode`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`) and fixes CMD-09's dead workflow-YAML residue, then sweeps the broader ~370-file authored README universe as time permits. It does not touch SKILL.md logic, command YAML behavior, agent bodies, or scripts — those are owned by phases 002-004 and are read-only inputs here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5, SC-001..SC-004)
- [x] Dependencies identified (phases 002-004 handoff; phase 004's `.codex/agents` decision)

### Definition of Done
- [ ] All P1-Required acceptance criteria met (REQ-001..REQ-005)
- [ ] Every grep assertion in spec.md §5 returns the specified result
- [ ] `validate.sh --strict` exits 0 for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-only remediation: read-verify-edit-reverify per file, no build step.

### Key Components
- **Discovery pass**: enumerate the authored README universe once (excluding vendored/build/worktree/spec-doc/deep dev-note READMEs), producing the definitive edit list.
- **Confirmed-stale fix set**: the 5 targets research.md already pinpointed with exact lines — executed first, independent of the discovery pass.
- **CMD-09 fix set**: the 4 `/create:readme` workflow assets — independent of the README-prose targets, touches YAML/txt comments and a field name only.
- **Broader sweep**: the remaining ~13 hub/index READMEs + 4 command-index READMEs + ~32 mode-packet READMEs, addressed after the confirmed set, with any items not completed recorded as explicit deferrals (not silently dropped).

### Data Flow
Research finding (research.md §3/§7) -> exact file:line -> read current content -> edit to match on-disk reality -> grep-verify -> next finding. No file is edited twice; CMD-09 and the confirmed-stale README set are disjoint (different files) and can run in parallel.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gate — confirm predecessor handoff
- [ ] Verify phases 002 (slash-commands), 003 (doctor), and 004 (agents) have landed (their `implementation-summary.md` exists with a non-planned Status). A README cannot be aligned to a surface still being corrected.
- [ ] Read phase 004's resolution of the `.codex/agents` design question (AGT-05) before touching either agent `README.txt`'s sibling-runtimes line. If phase 004 has not resolved it, defer REQ-004's `.codex/agents` clause and record the deferral in this phase's `implementation-summary.md`; do not guess.
- **SEQUENCING CONSTRAINT**: Phase 1 blocks Phases 3-6. Phase 2 (discovery) may run in parallel with Phase 1 since it is read-only.

### Phase 2: Discovery — enumerate the authored README universe [P]
- [ ] Run the scoped inventory command (below) to produce the definitive edit list for the broader sweep, confirming the confirmed-stale set is still accurate and surfacing any additional drift research.md did not catch.
  ```bash
  find . \( -iname "README.md" -o -iname "README.txt" \) \
    -not -path "*/node_modules/*" -not -path "*/.worktrees/*" \
    -not -path "*/dist/*" -not -path "*/.venv/*" -not -path "*/__pycache__/*" \
    -not -path "*/.opencode/specs/*" -not -path "*/z_archive/*"
  ```
- [ ] From that list, classify each hit as: (a) already covered by the confirmed-stale set, (b) a hub/index/command-index/agent README in spec.md's "In Scope" list, (c) a mode-packet README under the parent hubs, or (d) a deep per-dir dev-note README out of scope. Record counts, not a line-by-line diff, for (c)/(d) — full diffing is the broader-sweep task, not discovery.
- **Verification**: discovery output cross-checked against spec.md §3 "In Scope" bullets; no in-scope category is missing from the produced list.

### Phase 3: Fix the confirmed-stale changed-surface targets (REQ-001, REQ-003, REQ-004)
- [ ] `.opencode/install_guides/README.md:884-896` — rewrite the "Current Skills" catalog: drop retired pinned versions, add the 4 missing parent hubs (sk-design, system-code-graph, system-deep-loop, system-skill-advisor) and 2 sibling modes (mcp-click-up, mcp-figma), reflect hub-owns-mode topology.
- [ ] `.opencode/skills/mcp-code-mode/README.md:138-141` — add a `mcp-figma` row to the Related-Skills table under the mcp-tooling hub framing.
- [ ] `.opencode/bin/README.md:168` — normalize the lone `system-speckit` occurrence to `system-spec-kit`.
- [ ] `.opencode/agents/README.txt:8` and `.claude/agents/README.txt:8` — reconcile the `.codex/agents/ (.toml)` sibling-runtimes claim per Phase 1's phase-004 decision (generate/validate the mirror claim, or drop it).
- **Verification (per file)**: `grep -n "<old-string>" <file>` returns 0 after edit; re-read the edited region to confirm no adjacent content broke.
- **SEQUENCING CONSTRAINT**: independent files — run in any order, in parallel.

### Phase 4: Fix CMD-09 — dead `folder_readme.md` + `create_agent_verified` residue (REQ-005) [P]
- [ ] `create_readme_auto.yaml:37` and `create_readme_confirm.yaml:9,40` — replace `folder_readme.md` with `.opencode/commands/create/readme.md`.
- [ ] `create_readme_presentation.txt:19,138`, `create_readme_auto.yaml:148`, `create_readme_confirm.yaml:133` — rename `create_agent_verified` to `create_readme_verified` consistently across all 3 files.
- **Verification**: `grep -rn "folder_readme.md"` over the 2 YAMLs returns 0; `grep -rln "create_agent_verified"` over the 3 readme-workflow asset files returns 0.
- **SEQUENCING CONSTRAINT**: disjoint from Phase 3 (different files) — may run in parallel with Phase 3.

### Phase 5: Broader sweep — hub/index/command-index/mode-packet READMEs (REQ-002, REQ-004 remainder)
- [ ] Top-level `README.md` — re-verify against the corrected surface from phases 002-004; patch any residual drift (recon as of this planning pass found none).
- [ ] `.opencode/skills/README.md` + the 12 hub READMEs — reconcile each enumeration against the on-disk mode tree using Phase 2's discovery list.
- [ ] `.opencode/commands/{README.txt, memory/README.txt, speckit/README.txt, create/README.txt}` — remove any dead command ids surfaced by phases 002-003.
- [ ] ~32 mode-packet READMEs under the parent hubs — fix any stale flat-skill path or retired name found by discovery; time-box this task and record any remaining items as explicit deferrals rather than silently skipping them.
- **Verification**: `grep -rEn "cli-codex|cli-gemini|cli-devin|mcp-magicpath" <in-scope READMEs>` returns 0 (baseline already 0; must stay 0 after edits).
- **DEFERRAL NOTE**: if the full mode-packet sweep cannot complete within this phase's time budget, list the unswept files explicitly in `implementation-summary.md` — do not mark the phase complete with an implicit "rest is fine" assumption.

### Phase 6: Final validation
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and confirm exit 0.
- [ ] Re-run every grep assertion from spec.md §5 (SC-001..SC-004) and record the exact output in `implementation-summary.md`.
- [ ] Refresh the matching changelog entry in `../changelog/` using the parent packet number plus this phase folder name (per spec.md Phase Context "Changelog").
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep assertion | Retired-name / dead-reference absence per finding | `rg` / `grep -n` |
| Manual read-diff | Each edited README section reads correctly in context (no broken tables/links) | `Read` tool re-verification |
| Structural | Spec-doc frontmatter, anchors, and status classification | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 (slash-commands) handoff | Internal | Pending | Cannot verify command-index README enumerations |
| Phase 003 (doctor) handoff | Internal | Pending | Cannot verify doctor-adjacent README references |
| Phase 004 (agents) handoff + `.codex/agents` decision (AGT-05) | Internal | Pending | Cannot finalize the agent README.txt sibling-runtimes wording; REQ-004's `.codex` clause stays deferred |
| research.md (001-conformance-deep-research) | Internal | Green | Supplies the ranked finding inventory this plan executes against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An edited README is found to describe a surface phases 002-004 have not actually landed (i.e., this phase ran ahead of its dependency), or a grep-verification step in Phase 3/4/5 fails after edit.
- **Procedure**: `git diff` the touched README/YAML files, `git checkout -- <file>` to revert the specific file (never a broad `git checkout .`), and re-run the corresponding grep-verification to confirm the revert is clean. No database, schema, or runtime state is touched by this phase, so rollback is file-local.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
