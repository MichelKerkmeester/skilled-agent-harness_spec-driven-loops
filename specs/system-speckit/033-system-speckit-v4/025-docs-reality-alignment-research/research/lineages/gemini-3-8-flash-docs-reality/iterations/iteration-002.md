# Iteration 2: References and Feature-Catalog Documentation Fidelity Audit

## Focus
Auditing `references/cli`, `references/config`, `references/debugging`, `references/memory`, `references/templates` and `feature-catalog/lifecycle`, `governance`, `context-preservation`, `ux-hooks` against runtime code and active command implementations.

---

## Findings

### Finding 1: /speckit:search Advertises Retired Capabilities as Live
- **Doc path:line**: `references/memory/save-workflow.md:144`
- **Claimed behavior**: "`/speckit:search  # Unified retrieval + analysis: search, epistemic baselines, causal graph, evaluation`"
- **Actual behavior**: In `.opencode/commands/speckit/search.md:111-120`, epistemic baselines, causal graph analysis, evaluation dashboards, and semantic search are explicitly declared unsupported retired capabilities from the decommissioned database. The `/speckit:search` router is purely lexical (trigger index and ripgrep). Describing `/speckit:search` as providing epistemic baselines and causal graph traversal directly contradicts the command's own contract.
- **Severity**: P0
- **One-line fix**: Update the description of `/speckit:search` to "Continuity retrieval: trigger-index lookup and ripgrep lexical scan".

---

### Finding 2: Epistemic Vectors Claims Decommissioned Memory Search and Contradicts AGENTS.md Gate 1 Scale
- **Doc path:line**: `references/memory/epistemic-vectors.md:210, 315, 333, 338, 390-392`
- **Claimed behavior**: Lines 210, 333, 338 advise agents to "Search memory for prior work" and "Broader memory search". Line 315 claims: `READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)` and lines 390-392 claim this dual-threshold validation is enforced in Gate 1 of `AGENTS.md`.
- **Actual behavior**: Memory search is decommissioned. In `AGENTS.md:88-97`, Gate 1 defines Confidence Thresholds using a single scale (`≥80%`, `40-79%`, `<40%`, `Override`) and explicitly commands: "that table is the single scale; do not carry a second one."
- **Severity**: P1
- **One-line fix**: Remove references to searching memory and align Gate 1 readiness with the single confidence scale in `AGENTS.md`.

---

### Finding 3: Template Guide Claims Save Touches DB_UPDATED_FILE and Re-indexes Database
- **Doc path:line**: `references/templates/template-guide.md:619-620`
- **Claimed behavior**: "and then reindexes the packet docs for recovery. When that save updates indexed state, the runtime also touches `DB_UPDATED_FILE` so long-lived readers can rebind instead of serving stale packet data."
- **Actual behavior**: `runtime/cli/continuity/generate-context.ts` (the sole save continuity writer) has zero references to `DB_UPDATED_FILE`, does not update any SQLite database, and does not re-index packet docs. `DB_UPDATED_FILE` belonged to the decommissioned memory SQLite database.
- **Severity**: P1
- **One-line fix**: Remove the claim that saves touch `DB_UPDATED_FILE` and re-index a database.

---

### Finding 4: Template Style Guide Documents Decommissioned memory/*.md and Semantic Search
- **Doc path:line**: `references/templates/template-style-guide.md:213, 217-229`
- **Claimed behavior**: Line 213 specifies frontmatter for "Generated continuity support artifacts (`memory/*.md`)", and lines 217-229 show frontmatter with `title: [Descriptive title for semantic search]`, `sessionId`, `triggers`, and `importanceTier`.
- **Actual behavior**: The `[spec]/memory/*.md` directory and files were decommissioned in Phase 018 (as documented in `save-workflow.md:255`), semantic search is decommissioned, and continuity is written into `implementation-summary.md` (`_memory.continuity`).
- **Severity**: P1
- **One-line fix**: Remove the `memory/*.md` frontmatter section and replace with `implementation-summary.md` `_memory.continuity` frontmatter.

---

### Finding 5: Level Specifications Instructs Verifying Non-Existent memory/ Folder
- **Doc path:line**: `references/templates/level-specifications.md:420`
- **Claimed behavior**: In the Level 3+ Pre-Task Checklist: "7. Verify memory/ folder for context from previous sessions".
- **Actual behavior**: The `memory/` folder in spec folders was decommissioned. Continuity context lives in `_memory.continuity` inside `implementation-summary.md` and in `handover.md`.
- **Severity**: P1
- **One-line fix**: Change step 7 to "Verify handover.md and implementation-summary.md for continuity context".

---

### Finding 6: Trigger Config Documents Unimplemented config.jsonc Memory Triggers
- **Doc path:line**: `references/memory/trigger-config.md:220-241`
- **Claimed behavior**: "Create or modify `config.jsonc` in your project root: `{\"memory\": {\"triggers\": {\"custom\": [...]}}}`".
- **Actual behavior**: No file in `runtime/` or `shared/` reads or parses `config.jsonc` for `memory.triggers`. Triggers are extracted from spec-doc and skill-doc markdown frontmatter by `generate-trigger-index.mjs`.
- **Severity**: P1
- **One-line fix**: Remove the `config.jsonc` memory trigger configuration block or mark it as deprecated/retired.

---

### Finding 7: Troubleshooting Reference Commands Cite Non-Existent .opencode/specs Path
- **Doc path:line**: `references/debugging/troubleshooting.md:155, 158, 161, 182, 183`
- **Claimed behavior**: Debugging commands instruct:
  - `grep -c "<!-- ANCHOR:" .opencode/specs/<track>/<NNN-name>/implementation-summary.md`
  - `find .opencode/specs -name "*.md"`
- **Actual behavior**: Spec folders live at `specs/`, not `.opencode/specs/` (`.opencode/specs` does not exist). Running `find .opencode/specs` fails with `find: .opencode/specs: No such file or directory`.
- **Severity**: P1
- **One-line fix**: Replace `.opencode/specs` with `specs` in all debugging command examples.

---

### Finding 8: Troubleshooting Reference Cites Removed CONTINUE SESSION Section
- **Doc path:line**: `references/debugging/troubleshooting.md:355`
- **Claimed behavior**: Line 355 table recommends: "Incomplete Handover | Missing continuation context | Review the CONTINUE SESSION section in handover.md".
- **Actual behavior**: `CONTINUE SESSION` was removed from the active ladder in `handover.md` (documented in `manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md:5`).
- **Severity**: P2
- **One-line fix**: Replace "CONTINUE SESSION section" with "Session summary and next steps in handover.md".

---

### Finding 9: Daemon CLI Reference Duplicates OPENCODE_PROMPT_TIME
- **Doc path:line**: `references/cli/daemon-cli-reference.md:114`
- **Claimed behavior**: "...runtime prompt-time markers such as `OPENCODE_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, and `CLAUDE_CODE_PROMPT_TIME`."
- **Actual behavior**: `OPENCODE_PROMPT_TIME` is repeated twice consecutively in the enumeration.
- **Severity**: P2
- **One-line fix**: Remove the duplicate `OPENCODE_PROMPT_TIME` entry.

---

### Finding 10: Level Specifications and Selection Guide Duplicate acceptance-criteria.md Lines
- **Doc path:line**: `references/templates/level-specifications.md:32-33, 191-192, 237-238` and `references/templates/level-selection-guide.md:210-211`
- **Claimed behavior**: Duplicate lines in file trees and lists:
  - Lines 191-192:
    `- acceptance-criteria.md (NEW at Level 2) - The criteria that gate packet closure`
    `- acceptance-criteria.md (required at Level 2) - the criteria that decide whether the packet may close`
  - Lines 237-238:
    `- templates/addons/acceptance-criteria.md.tmpl`
    `- templates/addons/acceptance-criteria.md.tmpl`
- **Actual behavior**: The lines are exact or near-exact duplicates accidentally repeated in the document templates.
- **Severity**: P2
- **One-line fix**: Deduplicate the consecutive `acceptance-criteria.md` entries in both documents.
