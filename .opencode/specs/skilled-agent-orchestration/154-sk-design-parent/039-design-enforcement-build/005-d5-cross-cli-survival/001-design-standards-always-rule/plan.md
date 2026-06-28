---
title: "Implementation Plan: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)"
description: "Append-only insertion of a Design Standards Loading ALWAYS rule beside the existing code-standards rule in all 3 cli-* SKILLs, under live GLM-5.2 concurrency."
trigger_phrases:
  - "d5-r1 design standards always rule"
  - "design standards loading cli plan"
  - "append-only cli design rule"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/001-design-standards-always-rule"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan phases complete; rename L2 anchors to canonical"
    next_safe_action: "Run validate.sh --strict and confirm zero non-metadata findings"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r1-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Markdown SKILL.md ALWAYS-rule insertion (no code, no DB, no build step) |
| **Targets** | `cli-codex/SKILL.md`, `cli-opencode/SKILL.md`, `cli-claude-code/SKILL.md` (the cli-* dispatch family) |
| **Mutation class** | Append-only insertion of ONE list item per file + minimal trailing renumber |
| **Verification** | `grep` for `sk-design` presence + `git diff` hunk inspection (byte-unchanged except the inserted rule) |
| **Concurrency** | A separate GLM-5.2 workstream is actively editing `cli-opencode` (and possibly siblings) |

### Overview
Add a short `Design Standards Loading` ALWAYS rule — the exact twin of the existing `Code Standards Loading (surface-aware contract)` rule — immediately BESIDE the code-standards rule in each of the three cli-* SKILLs. The new rule is the deterministic safety net that fires regardless of router keyword hits: when a dispatched child is given design/UI work, it loads `sk-design` (the hub), lets the hub route to a mode via `mode-registry.json`, sets the design register, and carries the `mcp-open-design` pairing when the work feeds Open Design. Today none of the three cli-* SKILLs contain the string `sk-design` in their dispatch contract; after this change each contains the twin rule.

The work is append-only and must NOT reflow, reformat, or touch any other section. A separate workstream is concurrently editing `cli-opencode` for GLM-5.2, so merge/clobber avoidance dominates this plan: the implementer stages ONLY the exact rule-insertion hunk and treats a dirty/shifted target as a HALT.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The code-standards rule to mirror is located and read in all three files (unique anchor confirmed per file).
- [x] Baseline confirmed: `grep -c "sk-design"` returns `0` in each of the three target files today.
- [x] Concurrency state captured: `cli-opencode/SKILL.md` is dirty (GLM-5.2 WIP); the other two are clean.
- [x] Exact twin rule text drafted (evergreen, no spec/packet/phase IDs).

### Definition of Done
- [x] All three cli-* SKILLs contain a `Design Standards Loading` ALWAYS rule beside their code-standards rule, with parallel wording. — twin present as 12/10/13
- [x] `grep -c "sk-design"` returns `>= 1` in each target file (was `0`). — returns 1 in all three
- [x] Each target file is byte-identical to its pre-edit baseline EXCEPT the inserted rule block and the minimal trailing renumber. — git diff verified
- [x] The GLM-5.2 workstream's edits are not clobbered; no unrelated hunk is staged. — snapshot diff; GLM hunk separate
- [x] Evergreen check passes: the inserted rule carries no spec path, packet, phase, ADR, REQ, task, or finding ID. — grep scan clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Twin-rule parallelism. The new rule clones the structure of the existing `Code Standards Loading (surface-aware contract)` rule one-for-one, substituting the design surface for the code surface:

| Code-standards clause | Design twin clause |
|-----------------------|--------------------|
| load `sk-code` | load `sk-design` (the hub) |
| `sk-code` emits a surface tag from markers/target files | the hub resolves a `workflowMode` via `mode-registry.json` (interface / foundations / motion / audit / md-generator) |
| load surface resources + run verification commands | load the selected mode packet, set the design register, run that mode's design verification |
| add `sk-code-review` only for findings-first review | if the work feeds Open Design, carry the `mcp-open-design` pairing — the transport never decides taste |
| Fallback: ask for the runtime surface + verification set | Fallback: ask for the surface + design intent |
| NEVER hardcode obsolete sibling code skills | NEVER treat `mcp-figma`/`mcp-open-design` as taste authority, or hardcode obsolete flat design skills |

### Exact rule text (insert verbatim in all three files; only the leading list number differs)

```text
**Design Standards Loading (surface-aware contract)** — When dispatching for design or UI work, instruct the dispatched session to: (1) load `sk-design` (the hub); (2) let the hub resolve a `workflowMode` through `mode-registry.json` (interface / foundations / motion / audit / md-generator); (3) load the selected mode packet, set the design register, and run that mode's design verification; (4) if the work feeds Open Design, carry the `mcp-open-design` pairing — the transport never decides taste. Fallback: if the design mode cannot be determined confidently, ask for the surface and design intent. NEVER treat `mcp-figma` or `mcp-open-design` as the taste authority, or hardcode obsolete flat design skills in dispatch prompts.
```

### Append-only insertion contract (per file)

The new item goes on the line IMMEDIATELY AFTER the code-standards rule (whose terminal sentence is `... NEVER hardcode obsolete sibling code skills in dispatch prompts.`) and BEFORE the next existing ALWAYS item. Locate the anchor by CONTENT (the unique string `Code Standards Loading (surface-aware contract)`), never by trusting a line number — the GLM workstream may have shifted `cli-opencode` lines since this plan was written.

| File | Code-standards rule # (now) | Insert design twin as # | Trailing renumber (digit-prefix only) | Insertion anchor (content) |
|------|-----------------------------|--------------------------|----------------------------------------|----------------------------|
| `cli-codex/SKILL.md` | `11` | `12` | `12→13` (Single-dispatch), `13→14` (AI_SESSION_CHILD) | after `11. **Code Standards Loading ...`, before `12. **Single-dispatch discipline ...` |
| `cli-opencode/SKILL.md` | `12` | `13` | `13→14` (Destructive-scope RM-8), `14→15` (Single-dispatch), `15→16` (AI_SESSION_CHILD) | after `12. **Code Standards Loading ...`, before `13. **Destructive-scope-violation prevention ...` |
| `cli-claude-code/SKILL.md` | `9` | `10` | `10→11` (Single-dispatch), `11→12` (AI_SESSION_CHILD) | after `9. **Code Standards Loading ...`, before `10. **Single-dispatch discipline ...` |

**Code-standards number is preserved** in every file (insert AFTER it). This keeps `cli-opencode` ALWAYS rule 8's cross-reference `(see ALWAYS rule 12)` valid — it points at code-standards, which stays `12`. No other `ALWAYS rule N` cross-reference exists in any file, so the trailing renumber breaks nothing.

### What NOT to touch (HARD scope freeze)
- Do NOT reflow, rewrap, reindent, or reformat the file.
- Do NOT edit frontmatter, the H1, the `## 4. RULES` header, the `### ✅ ALWAYS` header, the `### ❌ NEVER` / `### ⚠️ ESCALATE IF` blocks, References, or any other section.
- Do NOT change the wording of any existing ALWAYS item — the ONLY permitted change to existing items is the single leading integer of the items that follow the insertion point.
- Do NOT touch the code-standards rule's text or number.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight (per target)
- [x] Re-read the unique anchor `Code Standards Loading (surface-aware contract)` and the next ALWAYS item in the target. — anchor matched by content in all three
- [x] Capture a pre-edit baseline (git blob SHA or working-tree copy) for byte-diff verification. — baseline captured
- [x] Check `git status`/`git diff` for the target; classify it clean or dirty (GLM concurrency). — codex/claude-code clean, opencode dirty

### Phase 2: Insertion (clean files first)
- [x] Edit `cli-claude-code/SKILL.md` (clean): insert twin as `10`, renumber `10→11`, `11→12`. — done, diff clean
- [x] Edit `cli-codex/SKILL.md` (clean): insert twin as `12`, renumber `12→13`, `13→14`. — done, diff clean
- [x] Edit `cli-opencode/SKILL.md` (DIRTY — handle last, see §7 Rollback and §6 Dependencies): re-confirm anchor by content, insert twin as `13`, renumber `13→14`, `14→15`, `15→16`. Do NOT bulk-stage this file. — done, design hunk isolated from GLM WIP

### Phase 3: Verification
- [x] `grep -c "sk-design"` returns `>= 1` in each of the three files. — returns 1 each
- [x] `git diff` for each clean file shows exactly: one added rule block + the declared trailing renumber, nothing else. — verified
- [x] Evergreen scan: the inserted block contains no spec path / packet / phase / ADR / REQ / task / finding ID. — clean
- [x] Cross-reference integrity: `cli-opencode` rule 8's `(see ALWAYS rule 12)` still resolves to code-standards. — number preserved

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Command / method |
|-------|-------|------------------|
| Presence | All 3 files now carry the twin | `grep -c "Design Standards Loading (surface-aware contract)"` returns `1` per file |
| Routing token | `sk-design` now in each dispatch contract (was absent) | `grep -c "sk-design"` returns `>= 1` per file (baseline was `0`) |
| Parallelism | Twin sits beside code-standards | the twin's line number is exactly code-standards line + 1 (content-adjacent) |
| Byte-unchanged | Only the insertion + renumber changed | `git diff <file>` hunk inspection: one added block + N single-char number edits, no other hunk |
| Evergreen | No ephemeral IDs | `grep -nE "specs/|packet|phase|ADR-|REQ-|finding"` over the inserted block returns nothing |
| No clobber | GLM WIP intact in cli-opencode | the design hunk is the ONLY net-new change attributable to this task; GLM hunks untouched |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex/SKILL.md` code-standards anchor (rule 11) | Internal | Clean | Anchor moved/reformatted → HALT, re-locate by content |
| `cli-claude-code/SKILL.md` code-standards anchor (rule 9) | Internal | Clean | Anchor moved/reformatted → HALT, re-locate by content |
| `cli-opencode/SKILL.md` code-standards anchor (rule 12) | Internal | **DIRTY — GLM-5.2 WIP in working tree** | Mixed unstaged hunks; cannot cleanly partial-stage with interactive add blocked → see §7 |
| sk-design hub contract (`sk-design/SKILL.md`) | Internal | Stable | Rule wording depends on hub→mode-registry routing staying current |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The byte-diff shows an unintended change, the GLM workstream's edits would be staged/clobbered, or the code-standards anchor cannot be matched by content.
- **Procedure**: `git checkout -- <file>` to discard the insertion on a clean file, or `git restore --staged <file>` then re-edit if a wrong hunk was staged. Each file's change is a single self-contained hunk and is independently reversible.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Pre-flight (per file) ──> Insert clean files (codex, claude-code) ──> Insert dirty file (opencode, isolated) ──> Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-flight | None | Insertion |
| Insert clean (codex, claude-code) | Pre-flight | Verify |
| Insert dirty (opencode) | Pre-flight + concurrency decision | Verify |
| Verify | All insertions | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pre-flight (re-read anchors + baselines) | Low | 10 minutes |
| Insert clean files (codex, claude-code) | Low | 10 minutes |
| Insert dirty file (opencode, isolation) | Medium (concurrency) | 15 minutes |
| Verification (grep + byte-diff + evergreen) | Low | 10 minutes |
| **Total** | | **~45 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Concurrency HALT conditions (any one → STOP and report)
1. The unique anchor `Code Standards Loading (surface-aware contract)` is missing, duplicated, or its terminal sentence has been reworded in a target → the GLM workstream may have reformatted it. HALT; do not force the insertion.
2. `cli-opencode/SKILL.md` still carries unstaged GLM-5.2 changes when staging time arrives, and interactive partial-add (`git add -p`) is unavailable → do NOT run `git add <file>` (it would stage the GLM WIP too). Leave the design hunk unstaged, report, and coordinate (let GLM commit first, then apply on a clean tree — or stage via an explicitly verified path).
3. A `git diff` of any target shows a hunk this task did not author → STOP; another workstream is mid-edit. Do not commit over it.
4. The target's line numbers no longer match this plan AND content-anchor re-location also fails → HALT (the file changed structurally).

### Staging discipline
- Stage clean files (`cli-codex`, `cli-claude-code`) individually only after `git diff` confirms the hunk is exactly the insertion + declared renumber.
- NEVER `git add .` or `git add` a directory; stage each verified file by explicit path.
- For the dirty `cli-opencode`, make the edit but isolate staging per HALT condition 2.

### Data Reversal
- **Has data migrations?** No. Pure markdown insertion; reversal is `git checkout -- <file>` per file.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Concurrency HALT conditions dominate the rollback section
-->
