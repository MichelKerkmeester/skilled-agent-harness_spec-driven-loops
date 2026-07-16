---
title: "Implementation Plan: Reconstruct sk-design 001-008 design specs and establish clean 001-009 numbering [template:level_2/plan.md]"
description: "Source-first reconstruction plan: map 8 design-spec packets to the intact sk-design skill tree, gate the collision-clearing delete of 3 never-tracked scratch folders, and hand off per-packet authoring to a downstream sonnet-5 scaffold + GPT-5.6 fill run."
trigger_phrases:
  - "sk-design reconstruction plan"
  - "sk-design 001-008 source map"
  - "sk-design numbering cleanup plan"
  - "design spec reconstruction plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Mapped 8 target packets to skill sources"
    next_safe_action: "Hand off Phase 4 to downstream fill run"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
      - ".opencode/specs/sk-design/"
      - ".opencode/specs/sk-design/009-sk-design-claude-parity/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-sk-design-reconstruct-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Source of truth for all 8 packets is the intact `.opencode/skills/sk-design/` tree, never the empty `z_archive/` or git history."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct sk-design 001-008 design specs and establish clean 001-009 numbering

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs (system-spec-kit templates); source content is the OpenCode skill tree (Markdown/JSON) |
| **Framework** | system-spec-kit Level 2 manifest templates (`spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `checklist.md.tmpl`) |
| **Storage** | Spec-folder Markdown + frontmatter continuity blocks; no database writes in this planning packet |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict`; `git ls-files` / `git log --all` forensic verification |

### Overview
Reconstruct 8 sk-design design-spec packets by treating `.opencode/skills/sk-design/` as the sole source
of truth — never the empty `z_archive/` and never git history, since `git log --all` proves 001-008 was
never committed. Each packet gets a one-to-one source mapping to a real skill-tree folder or file set.
Before packets `002` and `003` can be authored at those numbers, a gated cleanup must remove the 3
never-tracked scratch folders currently occupying those numbers. This packet plans that mapping and gate;
it does not author the 8 packets or run the delete.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `git log --all --diff-filter=A --name-only -- '.opencode/specs/sk-design/00[1-8]*'` | Empty output — no commit ever added a file under `sk-design/001-008`. |
| `git log --diff-filter=A --oneline --reverse -- '.opencode/specs/sk-design/009*'` | First commit `3907a95f12e`; `009` is the only ever-tracked sk-design spec packet. |
| `git ls-files .opencode/specs/sk-design/{002-mcp-open-design,003-mcp-figma-with-direct-cli-support,003-sk-design-parent}/` | 0 lines for all three — confirmed never-tracked. |
| `find` file counts on the 3 scratch folders | 19 / 2 / 2,712 untracked files respectively (orchestration logs, seat outputs, vendored `external/*-main` clones). |
| `find`/`wc -l` on the 6 mode folders + hub + shared/benchmark/feature_catalog | Captured per-packet source evidence; see §4 table below. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and forensic non-existence finding documented in `spec.md`.
- [x] All 8 packet sources independently verified against the live skill tree (file/line counts captured).
- [x] Scratch-collision folders confirmed 0-tracked-files via `git ls-files`.

### Definition of Done
- [x] Source map for all 8 packets recorded with evidence (this plan, §4).
- [x] Gated scratch-clear precondition documented, not executed.
- [ ] Downstream sonnet-5 scaffold + GPT-5.6 fill run authors `001-008` and runs the gated clear (out of scope for this packet; tracked as hand-off).
- [x] Docs updated (spec/plan/tasks/checklist all present and internally consistent).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first documentation reconstruction with a gated destructive precondition.

### Key Components
- **Skill tree (source of truth)**: `.opencode/skills/sk-design/` — six mode packets (`design-foundations`,
  `design-interface`, `design-motion`, `design-audit`, `design-md-generator`, `design-mcp-open-design`),
  the hub (`SKILL.md` + `mode-registry.json` + `hub-router.json`), and the shared backbone
  (`shared/`, `benchmark/`, `feature_catalog/`).
- **Target spec sequence**: `.opencode/specs/sk-design/001-008` (new) + `009-sk-design-claude-parity`
  (existing, untouched).
- **Collision gate**: a precondition check (fresh `git ls-files` + `git status --porcelain`) that must
  pass immediately before the downstream run deletes the 3 scratch folders occupying `002` and `003`.

### Data Flow
This packet reads the skill tree and the spec-folder git history only; it writes nothing to
`.opencode/skills/sk-design/` or `.opencode/specs/sk-design/`. The downstream sonnet-5 scaffold pass reads
this plan's source map, creates the 8 target folders' scaffolding, runs the gated clear first for `002`/`003`,
then a GPT-5.6 fill pass populates each packet's content from its mapped skill-tree source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/specs/sk-design/002-mcp-open-design/` | Never-tracked orchestration scratch | Delete (gated, downstream) | `git ls-files` returns 0 lines immediately before delete |
| `.opencode/specs/sk-design/003-mcp-figma-with-direct-cli-support/` | Never-tracked orchestration scratch | Delete (gated, downstream) | `git ls-files` returns 0 lines immediately before delete |
| `.opencode/specs/sk-design/003-sk-design-parent/` | Never-tracked orchestration scratch + vendored clones | Delete (gated, downstream) | `git ls-files` returns 0 lines immediately before delete |
| `.opencode/specs/sk-design/001-008/` | Does not exist | Create (downstream scaffold + fill) | `ls .opencode/specs/sk-design/` shows contiguous `001-009` |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/` | Existing tracked packet (442 files) | Unchanged | `git ls-files` count stays 442; no path under it is touched |
| `.opencode/skills/sk-design/**` | Source of truth | Read-only | No `Write`/`Edit`/`Bash` mutation command appears against this path anywhere in this packet |

Required inventories:
- Same-class producers: `git log --all --diff-filter=A --name-only -- '.opencode/specs/sk-design/00[1-8]*'` (confirms no prior producer of 001-008 content).
- Consumers of changed symbols: N/A — this packet changes no runtime code, only plans doc creation; the consumer of the eventual 8 packets is the downstream fill run and any future reader of `.opencode/specs/sk-design/`.
- Matrix axes: 6 mode packets x (SKILL.md, references, procedures, assets, scripts) + hub (SKILL.md, mode-registry.json, hub-router.json) + shared backbone (shared/, benchmark/, feature_catalog/) = 8 independent source rows, listed in §4 below.
- Algorithm invariant: N/A — no parser/redaction/path-resolution logic is touched; the applicable invariant is procedural: the scratch-clear gate must observe 0 tracked files immediately before any delete, every time it runs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (this packet)
- [x] Verify forensic non-existence of `sk-design/001-008` via `git log --all`.
- [x] Verify the 3 scratch folders are 0-tracked-files via `git ls-files`.
- [x] Enumerate the live `.opencode/skills/sk-design/` tree and capture per-source file/line counts.

### Phase 2: Source Map (this packet's core deliverable)

| # | Target packet | Source (`.opencode/skills/sk-design/...`) | Evidence (this session) |
|---|----------------|--------------------------------------------|---------------------------|
| 001 | `design-foundations` | `design-foundations/` | `SKILL.md` v1.0.0.1, 261 lines; 10 references; 3 procedures; 2 assets; 5 scripts. Format proof already drafted in-session scratchpad. |
| 002 | `design-interface` | `design-interface/` | `SKILL.md` v1.0.1.0, 321 lines; 19 references; 6 procedures; 1 asset. Requires prior clear of the existing `002-mcp-open-design` scratch folder. |
| 003 | `design-motion` | `design-motion/` | `SKILL.md` v1.0.0.1, 397 lines; 7 references; 1 procedure; 3 assets. Requires prior clear of `003-mcp-figma-with-direct-cli-support` and `003-sk-design-parent`. |
| 004 | `design-audit` | `design-audit/` | `SKILL.md` v1.0.0.2, 293 lines; 10 references; 2 procedures; 27 assets; 2 scripts. |
| 005 | `design-md-generator` | `design-md-generator/` | `SKILL.md` v1.0.2.0, 421 lines; 23 references; 1 procedure; 3 assets; `backend/` pipeline (excludes vendored `node_modules/`, ~2,793 files total in that subtree). |
| 006 | `design-mcp-open-design` (transport) | `design-mcp-open-design/` | `SKILL.md` v1.5.0.0, 226 lines; 9 references; 3 scripts; 1 `mcp-servers/` dir; `packetKind: transport`, `backendKind: od-cli-transport` per `mode-registry.json`. |
| 007 | `design-hub-routing` | Hub root: `SKILL.md`, `mode-registry.json`, `hub-router.json` | Hub `SKILL.md` v1.4.3.0, 277 lines; `mode-registry.json` 165 lines (6 modes); `hub-router.json` 412 lines; `command-metadata.json` 907 lines; `README.md` 106 lines. |
| 008 | `design-shared-backbone` | `shared/`, `benchmark/`, `feature_catalog/` | `shared/` 24 files (assets/procedures/scripts); `benchmark/` 15 files across `baseline/` + 6 `after_*` snapshots; `feature_catalog/` 6 files (`feature_catalog.md` + `manager_shell/` + `procedure_card_system/`). |
| 009 | `sk-design-claude-parity` | Already exists, tracked, 442 files | No action — unchanged; final position in the clean sequence. |

### Phase 3: Gated Collision Clear (documented here, executed downstream)
- [ ] Immediately before authoring `002`/`003`, re-run `git ls-files` and `git status --porcelain` on the 3
      scratch folders; abort if any path returns.
- [ ] `rm -rf` the 3 scratch folders only after the re-verification passes.
- [ ] Re-run `ls .opencode/specs/sk-design/` to confirm the numbers `002` and `003` are now free.

### Phase 4: Per-Packet Authoring (downstream sonnet-5 scaffold + GPT-5.6 fill, out of scope here)
- [ ] Sonnet-5 scaffolds `spec.md`/`plan.md`/`tasks.md`/`checklist.md` for each of `001-008` from this plan's
      source map, mirroring the `001-design-foundations/spec.md` format proof already drafted.
- [ ] GPT-5.6 fills each packet's content by reading its mapped skill-tree source directly (not this plan's
      cached counts, which may drift).
- [ ] Regenerate `.opencode/specs/sk-design/description.json` and `graph-metadata.json` after all 8 exist on disk.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Forensic verification | Git history for `sk-design/001-008` and `009` | `git log --all --diff-filter=A --name-only`, `git log --diff-filter=A --oneline --reverse` |
| Tracked-file gate | 3 scratch folders | `git ls-files <path>` (must return 0 lines before any delete) |
| Source-map accuracy | 6 mode folders + hub + shared backbone | `find <path> -type f | wc -l`, `wc -l <path>/SKILL.md` |
| Spec validation | This planning packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct --strict` |
| Final numbering (downstream, out of scope) | `.opencode/specs/sk-design/` | `ls .opencode/specs/sk-design/` shows exactly `001`-`009` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/sk-design/` skill tree | Internal (read-only source of truth) | Available | Reconstruction has no other source; if the tree changes materially before the fill run, downstream must re-verify counts. |
| Downstream sonnet-5 scaffold + GPT-5.6 fill run | Internal (not yet started) | Pending hand-off | The 8 packets remain undocumented until this run executes; this planning packet's own completion is not blocked by it. |
| `009-sk-design-claude-parity` packet | Internal (existing) | Stable, untouched | If renumbered before hand-off, downstream execution must re-list the directory rather than trust this plan's numbering assumption. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This packet's own docs are found to mischaracterize the forensic finding (e.g., implying
  restorable git content that does not exist), or the source map is found to be inaccurate against the
  live skill tree.
- **Procedure**: Since this packet performs no destructive action and creates no files outside its own
  spec folder, rollback is limited to editing this packet's `spec.md`/`plan.md` to correct the claim; no
  git revert of skill or spec content is needed because none was touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup / forensic verify) --> Phase 2 (Source map) --> Phase 3 (Gated clear, downstream) --> Phase 4 (Per-packet authoring, downstream)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Source map |
| Source map | Setup | Gated clear, per-packet authoring |
| Gated clear | Source map (numbers 002/003 identified as colliding) | Per-packet authoring for 002/003 only |
| Per-packet authoring | Source map (001, 004-009 unblocked); gated clear (002, 003 only) | Final 001-009 numbering claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup / forensic verify | Low | Already complete this session |
| Source map | Medium | Already complete this session |
| Gated clear (downstream) | Low | Single precondition re-check + `rm -rf`, minutes |
| Per-packet authoring (downstream) | High | 8 packets x scaffold + fill, several hours |
| **Total (this packet)** | | **Complete; downstream phases separately scoped** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or runtime code path is touched by this planning packet.
- [ ] Downstream: re-verify `git ls-files` returns 0 for all 3 scratch folders immediately before delete.
- [ ] Downstream: snapshot `ls .opencode/specs/sk-design/` before and after the gated clear for audit.

### Rollback Procedure
1. If the downstream gated clear is ever run against a folder that in fact has tracked files, `git checkout`
   restores tracked content immediately (untracked content in a wrongly-cleared folder is not recoverable
   by git, which is why the gate requires a fresh 0-tracked-files check rather than trusting this session's).
2. If a reconstructed packet's content is later found inaccurate against the skill tree, edit that packet
   directly — it does not affect this planning packet's own docs.
3. Re-run the forensic `git log --all` check to confirm no unexpected commit history has appeared.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A for this planning packet; downstream gated-clear rollback is covered above.
<!-- /ANCHOR:enhanced-rollback -->
