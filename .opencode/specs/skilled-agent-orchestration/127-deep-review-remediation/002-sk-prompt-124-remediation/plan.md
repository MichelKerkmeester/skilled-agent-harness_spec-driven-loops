---
title: "Implementation Plan: Phase 2: sk-prompt-124-remediation"
description: "Execution plan for the sk-prompt/124 remediation: verify each of 12 candidate findings against the live file, apply Cluster A referrer-sweep repoints, Cluster B save-path hardening, and the Cluster C1 doc fix, re-verify, exclude C2 as out of scope."
trigger_phrases:
  - "sk-prompt 124 remediation plan"
  - "prompt-improve hardening plan"
  - "referrer sweep plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/002-sk-prompt-124-remediation"
    last_updated_at: "2026-07-10T05:50:20Z"
    last_updated_by: "claude"
    recent_action: "A5 18-file playbook sweep folded into cluster A"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/agents/prompt-improver.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-002-sk-prompt-124-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: sk-prompt-124-remediation

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
| **Language/Stack** | Markdown + YAML frontmatter (OpenCode skill/command/agent documentation) |
| **Framework** | OpenCode skill/command/agent spec format (SKILL.md frontmatter + rules, command markdown workflow prose, agent integration tables) |
| **Storage** | Filesystem - skill/command/agent files under `.opencode/skills/sk-prompt/`, `.opencode/commands/`, `.opencode/agents/`, `.claude/agents/` |
| **Testing** | grep verification + `validate.sh --strict` (both this phase and the unaffected 124 parent, `--recursive`) |

### Overview
This phase fixes 5 merge-introduced referrer-sweep gaps and hardens 3 pre-existing `/prompt-improve` save-path behaviors surfaced by the 124 parent-hub deep review, plus one doc-accuracy gap (GLM-5.2 row), each independently verified against the live file before and after the edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 10 review findings (R1, R4, R7, R1-P2, R8-P2-002, R2, R6, R9, R3-P2, R8-P2-001) pre-specified with approximate file:line evidence in the fix manifest, grouped into 3 clusters.
- [x] Source review report (`124-sk-prompt-parent/review/review-report.md` §3) confirms all 10; the manifest reconciles them into 12 concrete edit targets (A1-A4, B1-B3, C1-C2).
- [x] Scope boundary is unambiguous: sk-prompt hub tree + the command + the two agent mirrors only; 124 spec docs explicitly excluded.

### Definition of Done
- [x] All 5 Cluster A fixes applied and re-verified against live files.
- [x] All 3 Cluster B hardening fixes applied to the live command, phrased consistently with sibling `/deep:*` command conventions.
- [x] Cluster C1 applied (GLM-5.2 row, grounded in `_index.md`/`model_profiles.json`); C2 explicitly excluded with a documented reason.
- [x] `validate.sh --strict` passes 0/0 for this phase folder; `124-sk-prompt-parent --recursive --strict` stays 0/0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted content-hygiene + prose-hardening fix - no runtime code touched; documentation/instruction-text edits only (agent integration tables, skill frontmatter, playbook preconditions, README tables, and command workflow prose).

### Key Components
- **`prompt-improver.md` agent mirrors** (`.opencode/agents/`, `.claude/agents/`): Integration Touchpoint Contract table, Commands table, NEVER-list, context-handoff example, and the ASCII summary box - all 5 carried the stale `/prompt` reference independently.
- **`prompt-models` packet**: `SKILL.md` frontmatter (`allowed-tools`), `README.md` (quick-start Read call, verification commands, framework map), `references/context_budget.md` (verification command) - all pre-fold path references that survived the flatten.
- **`prompt-improve` playbook**: `manual_testing_playbook.md` GLOBAL PRECONDITIONS §2 - asserted pre-fold hub-root `SKILL.md` section numbering.
- **`/prompt-improve` command** (`prompt-improve.md`): Setup Phase step 5 (discovery) and step 9 (background-ops preview), Step 5 A/B/C (existing/new/custom save branches), and §7 NOTES - the save-location workflow inherited unchanged through the merge's git-mv from the old `/prompt` command.

### Data Flow
N/A for Cluster A/C - static documentation read by agents/advisors dispatching through these surfaces. For Cluster B, the data flow is: user-supplied topic text / custom path (Setup Phase Q0/Q2) -> Step 5 branch logic -> shell `mkdir`/`Write` calls. The hardening fix interposes sanitization (B2) and containment (B1) between the user-supplied text and the shell/path construction step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `prompt-improver.md` (both runtimes) | Integration referrer table + summary box naming the command surface | Update - repoint `/prompt` -> `/prompt-improve`, `commands/prompt.md` -> `commands/prompt-improve.md` at all 5 occurrences per file | `grep -n '/prompt\b' <file> \| grep -v '/prompt-improve'` returns 0 |
| `prompt-models/SKILL.md` frontmatter | Declares the packet's own tool grant | Update - `allowed-tools: []` -> `[Read, Grep, Glob]` to match `mode-registry.json` toolSurface.allowed | `head -6 SKILL.md` shows the new array; matches `mode-registry.json`'s `prompt-models` mode entry |
| `manual_testing_playbook.md` §2 precondition #2 | Asserts where Smart Routing / operating-modes-table / agent-invocation-contract content lives | Update - repoint path to `prompt-improve/SKILL.md` | Confirmed `prompt-improve/SKILL.md` actually has §2 Smart Routing, §3 Operating Modes table, §7 Agent Invocation Contract (read back, all 3 present) |
| `prompt-models/README.md` + `references/context_budget.md` | Quick-start Read call, 2 verification commands, 1 jq command citing a dead top-level path | Update - repoint all 4 occurrences to `.opencode/skills/sk-prompt/prompt-models/...` | `grep -rln '\.opencode/skills/prompt-models\b' .opencode/skills/sk-prompt/ --include='*.md' \| grep -v /changelog/` returns 0 |
| `prompt-models/README.md` Framework Map | Maintainer-facing per-model framework table | Update - add `glm-5.2` row | Row present, cross-verified against `references/models/_index.md` and `assets/model_profiles.json` `recommended_frameworks` |
| `prompt-improve.md` Step 5-C (custom path) | Free-text custom save path from Q2=C | Update - add containment check (reject paths escaping the repo root) + overwrite guard (never silently clobber) | Read back Step 5-C: both checks present as explicit numbered steps before the write |
| `prompt-improve.md` Step 5-B (new spec folder) | Derives a folder name from raw prompt-topic text, interpolated into a shell `mkdir` command | Update - sanitize topic to an `[a-z0-9-]` slug before any shell interpolation; prefer `.opencode/specs/` root | Read back Step 5-B: sanitization step precedes the `mkdir`; root is `.opencode/specs/` |
| `prompt-improve.md` Setup step 5 (discovery) + step 9 (preview) + §7 Notes | Search command and behavior summaries that assumed the legacy `specs/` root | Update - prefer `.opencode/specs/`, note `specs/` is a symlink alias, not a separate store | Read back all 3 locations: `.opencode/specs/` named as canonical throughout |

Required inventories:
- Same-class producers: `grep -n '/prompt\b\|prompt\.md' .opencode/agents/prompt-improver.md .claude/agents/prompt-improver.md` (7 hits per file before the fix, all same-class stale command refs); `grep -rn '\.opencode/skills/prompt-models\b' .opencode/skills/sk-prompt/` (4 hits before the fix, all same-class dead top-level path refs, changelog occurrences correctly excluded as historical narration).
- Consumers of changed symbols: N/A for Cluster A/C - prose/doc links and a frontmatter array, not code symbols consumed elsewhere. For Cluster B, the only consumer of the Setup-step-5 discovery output is Step 5-A's `[folder]` variable - updated in the same pass to stop double-prefixing the root once discovery returns full paths (see Key Decisions in implementation-summary.md).
- Matrix axes: one axis per cluster (A/B/C), independently fixable; within Cluster A, one axis per stale-path class (command ref vs. tool-surface frontmatter vs. playbook precondition vs. dead top-level path); within Cluster B, one axis per hardening concern (containment / sanitization / root-preference), all converging on the same Step 5 A/B/C branches.
- Algorithm invariant: B2's sanitization invariant is a whitelist, not a blacklist - only `[a-z0-9-]` survives, collapsed/trimmed hyphens, `untitled-prompt` fallback on empty result. This removes shell metacharacters (spaces, `;`, `|`, backticks, `$()`, quotes) as a side effect rather than attempting to enumerate and strip them individually. B1's containment invariant: a custom path must resolve inside the repository root once `..` segments and absolute-elsewhere paths are accounted for; adversarial cases considered: `../../etc/passwd`-style traversal, an absolute path naming a location outside the repo, and a path that looks relative but escapes via `..` before the write.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the fix manifest (`phase2-sk-prompt.md`) and the full 124 review report §3 registry; cross-referenced all 10 findings.
- [x] Confirmed all 12 candidate findings via Read/grep against live files before editing (not manifest line-number estimates) - including discovering the `specs -> .opencode/specs` symlink (git-tracked) and the all-tracked (no flat `[NNN]-name/`) shape of `.opencode/specs/`, both of which shaped the B3 fix design.

### Phase 2: Core Implementation
- [x] A1: Repointed 5 stale `/prompt` references per agent mirror (10 edits total across both runtimes).
- [x] A2: Fixed `prompt-models/SKILL.md` frontmatter `allowed-tools`.
- [x] A3: Repointed the playbook precondition path.
- [x] A4: Repointed 4 dead top-level `prompt-models` path references across 2 files.
- [x] C1: Added the GLM-5.2 framework-map row, grounded in `_index.md` + `model_profiles.json`.
- [x] B1: Added containment + overwrite guard to Step 5-C.
- [x] B2: Added topic sanitization to Step 5-B.
- [x] B3: Repointed discovery, Step 5-B creation, and §7 Notes to prefer `.opencode/specs/`.
- [x] Coherence fix: updated Step 5-A's `[folder]` handling and Setup step 9's preview text so they stay consistent with the B3 discovery-command change (not a 4th cited finding; documented as a necessary side-effect).

### Phase 3: Verification
- [x] Re-grepped to confirm 0 remaining bare `/prompt` refs, 0 remaining `commands/prompt.md` refs, and 0 remaining dead top-level `prompt-models` path refs (outside `changelog/`, which is historical narration and correctly untouched).
- [x] Authored this Level 1 spec-kit packet and ran `validate.sh --strict`.
- [x] Ran `124-sk-prompt-parent --recursive --strict` to confirm it stayed 0/0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All 12 findings against live file state, before and after | `grep`/`rg` |
| Cross-reference check | GLM-5.2 row data cross-verified against 2 independent sources (`_index.md`, `model_profiles.json`) before writing | `Read`, `python3 -c` (JSON field extraction) |
| Empirical platform check | Confirmed `specs` symlink is real, git-tracked, and how BSD `find` on this platform actually traverses it, before committing to a discovery-command design | `realpath`, `git ls-files`, `find`/`find -L` comparison |
| Spec validation | Phase-folder frontmatter + task evidence; parent-packet non-regression | `validate.sh --strict`, `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fix manifest (`phase2-sk-prompt.md`) | Internal (scratchpad input) | Green | N/A - manifest fully specified every fix with approximate line numbers; live-file verification resolved all ambiguity. |
| 124 review report (`124-sk-prompt-parent/review/review-report.md`) | Internal | Green | N/A - read for full finding context (adjudication + severity nuance) beyond the manifest's summary. |
| `specs` top-level symlink (git-tracked, -> `.opencode/specs`) | Internal (repo structure) | Green | None - the fix prefers the real `.opencode/specs/` path regardless, so it does not depend on the symlink continuing to exist. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix found to alter unintended content, or `validate.sh --strict` fails after authoring (either this phase or the 124 recursive re-check).
- **Procedure**: No commit was made this session; `git diff -- <file>` isolates each fix's edits, and `git checkout -- <file>` reverts a single file to its pre-phase state if a fix needs to be undone. All 7 touched files are exclusive to this phase's scope (no other in-flight phase edits the same files), so a per-file revert carries no cross-phase collision risk.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
