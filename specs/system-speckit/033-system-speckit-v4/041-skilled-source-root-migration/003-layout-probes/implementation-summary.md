---
title: "Implementation Summary"
description: "Nine live probes settled what the .skilled layout decision depends on: a whole-directory .opencode link works for every runtime probed, per-entry links break package-importing opencode plugins, and several gates and a checkout step fail silently."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes"
    last_updated_at: "2026-09-16T20:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Ran the nine layout probes and verified every lane return"
    next_safe_action: "Resolve phase 004 ADR-001 from these records"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-003-layout-probes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-layout-probes |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every question that decides what `.opencode/` becomes now has an observed answer, with the command, the exit status and the record behind it. The layout choice no longer rests on reading code. Three results change the plan. A whole-directory `.opencode -> .skilled` link keeps every runtime probed working, including opencode plugins that import packages, and per-entry links do not. Git skips a dangling hook silently, and seven gate filters miss `.skilled/` changes. Checking out the moved tree deletes the ignored files under `.opencode/` without a warning.

### Phase 3: layout-probes

These results feed phase 004's decision tree (crosswalk in `../004-migration-design/plan.md`):

- **P1, P3 (Q2):** opencode loads plugins, commands, agents, skills and the `code_mode` launcher's server manifest through the whole-directory link, and Devin loads all 13 repository skills. Passes.
- **P2a, P2b (Q2):** with per-entry links, an opencode plugin importing `@opencode-ai/plugin/tool` does not load, whether the install files stay in `.opencode/` or move to `.skilled/`. Fails for three repository plugins.
- **P4 (Q4):** every gate script is found through either link shape. The agent-mirror, prompt-card, MCP mutation-class, route re-mint, skill-change-detector, skill-metadata and routing-bytes filters miss `.skilled/` changes silently.
- **P5 (Q3):** a dangling hook under `core.hooksPath` is skipped silently, for commits and pushes alike.
- **P6, P7 (Q5):** 17,767 renames with 0 deletions at every rename limit, `--follow` history intact, and 1 deletion for the whole push range. A checkout of the moved tree deletes ignored files under `.opencode/`. Without the link, the installed pre-push disengages its mass-deletion, push-permission and skill-metadata gates.
- **P8 (Q1):** no runtime can rename its own project directory. Additive flags exist for several.
- **P9 (Q2 R5):** Pi extensions resolve their relative `.opencode` imports through both shapes and through a retargeted second hop.
- **Q6:** the council graph rebuilds per session through `replay-graph-from-artifacts.cjs`. The tracked file holds test residue with one `.opencode/specs` namespace key and needs no migration.
- **Q7:** one of 35 recorded fixtures (`emitted-name-contract.json`) sits beside an assertion on repo-relative `.opencode` literals.
- **Q8:** 60 live home configuration files name the repository. Phase 002's map missed the 38 Codex prompt stubs and `~/.codex/rules/default.rules`.
- **Q9:** no untracked, unignored file lives under `.opencode/`. Ignored state is rebuildable, except `hooks/hook-flags.env` and the history databases.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `probes/probe-environment.md` | Created | Base commit, clones, versions, git settings, home guard and after-probe comparison |
| `probes/runtime-root-configurability.md` | Created | Q1, seven lane returns with briefs and 243 citation checks |
| `probes/runtime-symlink-resolution.md` | Created | Q2 loader matrix across baseline, A, B and B2 |
| `probes/dangling-hook-behavior.md` | Created | Q3 sandbox with controls |
| `probes/gate-filters-under-linked-root.md` | Created | Q4, 12 gates in two shapes plus a control |
| `probes/rename-rehearsal.md` | Created | Q5 counts, guard verdicts, pre-push runs, history and ignored-file checkout |
| `probes/council-graph-rebuild.md` | Created | Q6 |
| `probes/fixture-path-assertions.md` | Created | Q7, 35 fixtures |
| `probes/home-state-enumeration.md` | Created | Q8, counts and classes; the full row table stays out of this public repository |
| `probes/untracked-ignored-files.md` | Created | Q9 |
| `probes/captures/*-help.txt`, `devin-skills-paths.txt`, `opencode-debug-paths.txt` | Created | Help and path captures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every live probe ran in clones under `/tmp/skilled-probes-003/` with remotes removed. Hooks pointed at an empty directory unless a hook was the subject, and each live row ran on an unmodified baseline first. Ten DeepSeek V4.1 Flash lanes on cli-pi read loader source and repository code. Seven more attempts at 19:21Z were rejected because the gateway now refuses the `developer` role for this model, and they re-ran through an isolated Pi agent directory that sets `compat.supportsDeveloperRole: false`. The orchestrator ran every git, hook, runtime and home command itself, opened the load-bearing citations, and resolved all 547 returned citations to files and lines: 526 matched, 21 struck. Afterwards both checkouts and the guarded home configuration were compared with their captures, and the scratch tree (12 GB) was removed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Home scan and home hashing stayed with the orchestrator | Home files can hold credentials, and a lane's reads leave the machine |
| The lane dispatch used an isolated `PI_CODING_AGENT_DIR` instead of editing the shared `.pi/models.json` | The fix belongs to every Pi session on the machine and to a tracked file in the busy main checkout, so it is reported to the operator rather than applied mid-run |
| R10 and R11 (Codex) recorded as not probed | `codex debug prompt-input` is blind to project prompts even at baseline, and a live run would need credentials copied into an isolated home |
| R13 re-run with a planted manifest | The first run was blind in every clone because the server's `package.json` is untracked |
| Round 2 of Q4 set `SPECKIT_SKIP_MIRROR_PARITY=1` | Mirror parity fails in dependency-less clones and stopped the trace before three later gates. Skipping only that gate let the others run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Nine records plus the environment record | PASS, all present with kebab-case names |
| Shape A, B and C implication lines | PASS, 3 per probe record (`rg -c '^- Shape [ABC]:'`) |
| Lane citations resolved | 526 matched, 21 struck, each listed in its record |
| Worktree status after probes | PASS, only `probes/` added |
| Main checkout status after probes | 22 extra lines, all from this session's authorized goal-send edits (038/013), none from a probe |
| Guarded home configuration hashes | PASS, unchanged |
| Strict validation | recorded in `goal.md` log after T025 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex loaders were not probed live.** Codex's project `.codex/` name is fixed (Q1), so it remains a consumer of links or generated copies under every shape.
2. **Content was opened only for load-bearing citations.** The remaining matched citations are confirmed to point at existing lines, not re-read for meaning.
3. **Lane U3 read a home file its brief did not name.** `~/.cursor/cli-config.json` was sent through the gateway. Its `authInfo` holds account identity (email, display name, ids), not a credential. Future briefs forbid opening any file under the home directory.
4. **The Pi DevPass route for DeepSeek V4.1 Flash is broken for every Pi session on this machine** until `.pi/models.json` sets `llmgateway.compat.supportsDeveloperRole` to `false`.
<!-- /ANCHOR:limitations -->

---


