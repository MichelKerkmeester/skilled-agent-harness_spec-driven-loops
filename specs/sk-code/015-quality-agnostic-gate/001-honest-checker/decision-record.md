---
title: "Decision Record: Phase 1: honest-checker"
description: "Ten accepted decisions for the honest checker: six operator decisions from the design, each taken with its recommended default, and four judgments made in this phase, each with its reversal."
trigger_phrases:
  - "honest checker decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/001-honest-checker"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded ADR-001 to ADR-010 for Phase 1"
    next_safe_action: "Confirm each pending ADR at program end, and implement Step 1 of plan.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 1: honest-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

ADR-001 to ADR-006 take the six decisions that the design leaves to the operator (design section 1.4). Each takes the design's recommended default under the operator's standing instruction to build autonomously. Each carries the status "Accepted, pending operator confirmation at program end". ADR-007 to ADR-010 are this phase's own judgments. Each names its reversal.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Amend Iron Law 3 to name the universal floor and the operator's config

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (standing build instruction), recorded by the markdown agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Iron Law 2 makes the Phase 1.5 quality gate mandatory (`phase-detection.md:108`). Iron Law 3 forbids any standard on an UNKNOWN surface (`phase-detection.md:109`). A repository with no surface packet therefore never completes the gate. That is the case the program goal names. This phase does not execute the amendment. Phase 4 does.

### Constraints

- The amended text must still forbid surface standards on an UNKNOWN surface.
- Verification keeps asking for the surface's verification commands (`workflow-verify.md:47` and `workflow-verify.md:55`).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The design's text for Iron Law 3. "No claim about an unsupported surface. An UNKNOWN surface gets only the universal floor in code-quality-standards.md and the quality runner's built-in checks until the operator names its surface and commands, in a declared surface or in the repository's committed .sk-code/quality.json. No other standard or verification command applies to it."

**How it works**: Phase 4 replaces the line at `phase-detection.md:109`. The UNKNOWN rows at `stack-detection.md:32` and `code-quality-standards.md:122` take the same floor. Phases 2 and 3 supply the built-in checks and the config path that the text names.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amend Iron Law 3 as designed** | The gate completes on UNKNOWN with the floor. The text names the one way to add commands. | A reader may stretch the floor into a licence for surface standards (design risk 4). | 8/10 |
| Keep Iron Law 3 unchanged | No text change, and fully conservative. | Repositories with no surface never complete the gate, so the goal fails for them. | 3/10 |

**Why this one**: The goal needs foreign repositories to finish. The amended text keeps the rule that matters, which is no surface standard without a named surface.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A repository with no surface packet completes the gate with the universal floor and the built-in checks.
- The rule names the one route for adding commands.

**What it costs**:
- The floor could be read as a licence. Mitigation: the text names the floor and the config and nothing else. Phase 4 checks the wording.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader takes the floor as a licence for surface standards | M | The text names the floor and the config only. Phase 4 checks the wording. |
| The operator rejects the amendment | L | The reversal below restores the old line. Phases 1 to 3 still ship. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Repositories with no surface packet never complete the gate today. |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the rule and adding a config-only route were both weighed. The text keeps both. |
| 3 | **Sufficient?** | PASS | One rule line changes, and two UNKNOWN rows follow it. |
| 4 | **Fits Goal?** | PASS | The goal is a gate that works in any codebase. |
| 5 | **Open Horizons?** | PASS | The text names the config, which Phase 3 builds. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (Phase 4, not this phase):
- `phase-detection.md:109` takes the amended text.
- `stack-detection.md:32` and `code-quality-standards.md:122` take the floor wording.

**How to roll back**: Restore the three lines from the parent of the Phase 4 commit. Then `rg -n -F 'universal floor' .skilled/skills/sk-code/shared/references/phase-detection.md` prints no line.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Scope the universal checklist to SKILLED as the house checklist

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (standing build instruction), recorded by the markdown agent |

---

<!-- ANCHOR:adr-002-context -->
### Context

The universal checklist says it serves "the OpenCode development environment" (`universal-checklist.md:3` and `universal-checklist.md:16`). Its P0 rows force this framework's header form, its numbered ALL-CAPS sections and its spec roots. It loads on every quality pass, so foreign repositories inherit SKILLED house rules. The change narrows what the baseline meant under the research ADR-001 (`specs/sk-code/014-code-modes-research/003-review-remediation/implementation-summary.md:26`), so the operator confirms it (operator decision 2).

### Constraints

- The spec-root rows must name `specs/` in this phase, whatever the scope decision.
- The floor for every surface stays in `code-quality-standards.md`.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: The checklist becomes the SKILLED house checklist. It loads only when SKILLED is a resolved surface of the target.

**How it works**: Phase 1 changes the two spec-root rows (T034). Phase 4 retitles the checklist. Surfaces declare their own checklists in `quality.checklists[]` (design D13, Phase 5), so the SKILLED declaration carries the house checklist.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope to SKILLED** | Foreign repositories stop inheriting SKILLED house rules. | Changes what the baseline meant. Needs the operator's yes. | 8/10 |
| Keep the universal checklist for every surface | No change. | Foreign repositories are judged on OpenCode header and section rules. | 3/10 |

**Why this one**: The checklist's own text says it serves the OpenCode environment, so a foreign repository should not be measured against it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Foreign repositories are judged on the floor and on their own declared checklists.

**What it costs**:
- The name "universal" becomes misleading until Phase 4 retitles the file. Mitigation: the Phase 1 changelog says the retitle is pending.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator rejects the scope | L | Restore the universal loading rule in the Phase 4 commit. |
| A SKILLED target loses its house rules | L | The loading condition names SKILLED explicitly. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Foreign repositories get SKILLED rules today. |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the universal checklist and scoping it were both weighed. |
| 3 | **Sufficient?** | PASS | One loading condition is enough. |
| 4 | **Fits Goal?** | PASS | The goal needs the floor to be the only universal rule. |
| 5 | **Open Horizons?** | PASS | Surfaces declare their own checklists (Phase 5). |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- This phase: the spec-root rows at `universal-checklist.md` lines 89 and 114 (T034).
- Phase 4: the retitle at lines 2, 3 and 16, and the loading condition in `Q/SKILL.md`.

**How to roll back**: Restore the universal title and the universal loading rule in the Phase 4 commit. The spec-root rows return with the Phase 1 revert.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The repository config is `.sk-code/quality.json`, with the design's merge rule

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (standing build instruction), recorded by the markdown agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

Phase 2 needs one committed seam for the repository's own commands and checklists. The design recommends the file name and a merge rule (operator decision 3, design D16 and section 4). Phase 1 does not read the file. Phase 3 reads it.

### Constraints

- Commands come only from the repository layer. Surface blocks and suggestions never supply one.
- The name must sit beside the other committed skill folders, such as `.sk-git/`.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: `.sk-code/quality.json` at the repository root, committed. Discovery runs in this order: `--config`, then the file-scope git config `skcode.qualityConfig`, then `.sk-code/quality.json`, then the shipped defaults. The merge rule is these five clauses. `checks` come only from the repository layer, and a duplicate id is an error. `checklists` and `generated` append. `commentHygiene` lists append, and the core patterns cannot be removed. `sensors` merge per sensor, and an exact sensor can be narrowed but never disabled. `schemaVersion` must be 1, and an unknown key is an error.

**How it works**: `quality-config.cjs` (Phase 3) reads and validates the file. The doctor route reuses that reader.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.sk-code/quality.json`** | Mirrors the `.sk-git/` folder and keeps one committed file. | Adds one folder at the root. | 8/10 |
| A local override file | Lets one operator change checks without a commit. | A local file can disable a required check silently. The design rejects it. | 4/10 |
| `.sk-code.json` at the root | Shorter path. | Breaks the folder convention that the other skills follow. | 6/10 |

**Why this one**: The folder convention is the one a reviewer already knows, and a commit is the trust boundary for a command.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One committed place holds the repository's commands and checklists.

**What it costs**:
- One more file to learn. Mitigation: `/doctor:sk-code quality init` writes it once, as a dry run first (Phase 3).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A malformed config stops every run | M | The reader reports the error and exits 3, and the doctor shows the parse message. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The goal needs committed checks to run, and the runner needs a place to read them from. |
| 2 | **Beyond Local Maxima?** | PASS | Three names and a local override were weighed. |
| 3 | **Sufficient?** | PASS | One file and one five-clause merge rule. |
| 4 | **Fits Goal?** | PASS | The seam is the operator naming its commands. |
| 5 | **Open Horizons?** | PASS | The schema version lets the file evolve. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes** (Phase 3, not this phase): `lib/quality-config.cjs`, the doctor route, and the template the route copies once.

**How to roll back**: Remove the reader and the route in the Phase 3 commit. Nothing else depends on the file, because the config is optional and the runner falls back to the defaults.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: CI and pre-commit keep whole-file scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (standing build instruction), recorded by the markdown agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

Pre-commit checks each staged file whole (`.skilled/scripts/git-hooks/pre-commit`, lines 142 to 158). The CI job checks each changed file whole (`.github/workflows/comment-hygiene.yml`, lines 36 to 48). Moving either layer to changed-line scope changes a HARD BLOCK layer. The design leaves that to the operator (operator decision 4).

### Constraints

- A block on an unchanged line changes behavior for every author, so the change needs its own decision and test.
- Pre-commit runs from a temporary copy of the staged blobs, so it cannot read the working-tree config safely (design risk 6).
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Both layers keep whole-file scope. Phase 1 changes the CI job's path lookup, its exit handling and its annotations, and nothing about its scope (REQ-012). Pre-commit gets no logic change. The runner in Phase 2 uses changed-line scope with the touched-file rule of design D6.

**How it works**: A finding on an unchanged line in a touched file blocks only when a whole-file layer is present. The runner names that layer in its reason.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep whole-file scope** | No layer change, and behavior stays as it is today. | Unchanged lines in touched files still block at commit and in CI. | 7/10 |
| Changed-line scope in both layers | Blocks only what the author changed. | Changes a HARD BLOCK layer, and pre-commit cannot read the working-tree config safely. | 4/10 |

**Why this one**: A change to the blocking layers needs its own decision and its own test, and this phase is not the place for it.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- No new commit block lands for unchanged code.

**What it costs**:
- Whole-file blocks stay in CI and pre-commit. Mitigation: the runner's touched-file rule reports the same finding as P1 debt when no whole-file layer is present.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An author expects changed-line scope in CI | L | The runner reports the scope on every run, and the operator can revisit this record. |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The goal does not need a scope change. |
| 2 | **Beyond Local Maxima?** | PASS | Changed-line scope in both layers was weighed. |
| 3 | **Sufficient?** | PASS | Keeping the scope needs no change. |
| 4 | **Fits Goal?** | PASS | The HARD BLOCK layers keep their current contract. |
| 5 | **Open Horizons?** | PASS | A later scope change arrives as a new record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: Phase 1 changes the CI job's path, exit handling and annotations (T024). Pre-commit has no change.

**How to roll back**: Revert the Phase 1 CI edit. That restores the CI exit handling and leaves the scope unchanged, because the scope never changes in this record.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The benchmark report follows the format of the existing reports

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (standing build instruction), recorded by the markdown agent |

---

<!-- ANCHOR:adr-005-context -->
### Context

The design's Phase 6 writes a live benchmark report. Its format owner is the harness owner, and that question stays open at design rank 13 (operator decision 5). The quality mode already keeps dated reports under `Q/benchmark/reports/`, each with a README.

### Constraints

- The report records catch rate, misses, false positives, wall time, intent recall, the corpus, and a repository-relative root (design 6.5).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: The Phase 6 report follows the format of the existing reports under `Q/benchmark/reports/`, including their dated folder names and their README.

**How it works**: The report adds any design field the existing shape lacks, and it keeps the same folder and file layout.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Follow the existing reports** | Reports stay comparable across releases. | The existing shape may lack a field, so the phase adds it. | 8/10 |
| A new format owned by the harness | Could match the design fields exactly. | Two report formats would sit side by side. | 4/10 |

**Why this one**: Comparable reports matter more than a new layout.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A reader can compare this release with the earlier reports line by line.

**What it costs**:
- Any missing field is added to the existing shape. Mitigation: Phase 6 checks the field list in design 6.5 before it closes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A field is missing from the report | L | The Phase 6 acceptance lists each field. |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 6 writes a report. |
| 2 | **Beyond Local Maxima?** | PASS | A new format was weighed. |
| 3 | **Sufficient?** | PASS | The existing layout needs at most one added field. |
| 4 | **Fits Goal?** | PASS | Measured results are the goal's evidence. |
| 5 | **Open Horizons?** | PASS | A later format change is a new record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes** (Phase 6): a new dated folder under `Q/benchmark/reports/`.

**How to roll back**: Delete the new folder, because Phase 6 creates it and nothing else depends on it.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The advisor plugin keeps its own copy of declaredSurfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (standing build instruction), recorded by the markdown agent |

---

<!-- ANCHOR:adr-006-context -->
### Context

The advisor plugin, `.skilled/plugins/system-skill-advisor.js`, holds its own copy of `declaredSurfaces`. The runner reads declarations through the one reader in `router-replay-lib.cjs` (design D14). Folding the plugin copy into that reader is the operator's call (operator decision 6). Design risk 7 records the drift it can cause.

### Constraints

- The plugin must keep working in its runtime without importing the router library.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: The plugin keeps its copy. No phase in this program folds it. Risk 7 stays open and is recorded here.

**How it works**: The runner's reader is the one that gates a run, and the plugin only routes a request. The two copies therefore cannot change a gate result, only a routing hint.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the copy** | No plugin change, and no new runtime import. | Two copies can drift. | 7/10 |
| Fold the copy into the one reader | One copy to maintain. | Adds a cross-runtime import the plugin does not have today. | 6/10 |

**Why this one**: The copy only routes hints, so drift costs routing quality and never a gate result.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The plugin stays as it is, and the program touches no runtime import.

**What it costs**:
- Two copies can drift. Mitigation: the runner's reader is the gate, and the operator can revisit this record.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The copies drift and the plugin routes a request to the wrong surface | L | The gate and the router replay read the one reader, so a wrong hint shows in replay. |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The goal does not need the plugin changed. |
| 2 | **Beyond Local Maxima?** | PASS | Folding the copy was weighed. |
| 3 | **Sufficient?** | PASS | No change is the simplest option. |
| 4 | **Fits Goal?** | PASS | The gate is unaffected. |
| 5 | **Open Horizons?** | PASS | Folding remains available as a later change. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**: None in Phases 1 to 4. Phase 5 leaves the plugin alone.

**How to roll back**: Nothing to roll back, because no phase changes the plugin.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Keep the phase 0 and T id patterns, and record the two residual false positives

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-007-context -->
### Context

The design narrows `\bphase\s+0+\d*\b` to `\bphase\s+0\d+\b`, and `\bT\d{3,4}\b` to `\bT\d{3}\b` (design 5.2 table). It also says the checker suite keeps its 26 cases (design 6.3). Both narrowings flip a pinned case. `generic_phase_zero` expects exit 1 for `// Phase 0 external artifact` (`Q/scripts/check-comment-hygiene.test.sh` line 47). `motion_label_with_id` expects exit 1 for `// MOTION: added for T1234` (line 51). This pass ran both lines against the current checker, and each exits 1. The design's false positives, `two-phase commit: phase 0 prepares` and `emulates the T1000 timer chip`, also exit 1. Each pinned line and its false positive differ only in the words or the digits around the match, so no pattern on these terms separates them. AGENTS.md section 1 makes comment hygiene a HARD BLOCK.

### Constraints

- The phase must not weaken a HARD BLOCK detector to remove a false positive that the `hygiene-ok` escape already covers.
- The pinned cases define the current contract, and the design's own count of 26 cases assumes they keep their meaning.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Keep both patterns unchanged. The fixture for the clean set excludes the two residual phrases, so the fixture holds only lines that the checker must pass. A repository that needs the two phrases uses the `hygiene-ok` escape.

**How it works**: The new issue rule, the slash narrowing and the other additions add detection. The two pinned patterns stay as they are (REQ-007).
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep both patterns** | The pinned cases hold. Bare `Phase 0` and four-digit T ids stay flagged. | Two named false positives remain, and the design's zero-finding target for F02 is missed. | 7/10 |
| Narrow both as the design says, and flip cases 47 and 51 | Removes the two false positives. | A bare `Phase 0` word and a four-digit T id pass. Two pinned cases change expectation. | 4/10 |
| A context rule that separates the lines | Could remove the false positives and keep the pinned cases. | No rule separates the pairs without matching the words around them, which makes a fragile term list. | 3/10 |

**Why this one**: The pinned contract and the HARD BLOCK both favour detection, and the escape already covers the residue.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Every pinned case keeps its expectation, so the suite means what it meant before.
- A bare `Phase 0` or a four-digit task id stays flagged.

**What it costs**:
- Two named false positives stay flagged. Mitigation: the `hygiene-ok` escape, and the fixture excludes them.
- The design's zero-finding target for F02 is not met as written. Mitigation: Phase 6 reports the two phrases by name as residual.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator reverses the call and the narrowing lands without a changelog line | L | The reversal below names the two pattern lines and the two cases. |
| A real four-digit task id is written in a comment | L | Detection stays on, so the line is flagged. |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The two pinned cases fix the current contract. |
| 2 | **Beyond Local Maxima?** | PASS | Both narrowings and a context rule were weighed. |
| 3 | **Sufficient?** | PASS | No pattern change is needed for the phase. |
| 4 | **Fits Goal?** | PASS | The goal needs detection that a reader can trust. |
| 5 | **Open Horizons?** | PASS | The reversal is two patterns and two cases. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**: No line of these two patterns changes in this phase. The clean fixture in `check-comment-hygiene.test.sh` excludes the two phrases (T015).

**How to roll back**: To adopt the narrowing, replace `\bphase\s+0+\d*\b` with `\bphase\s+0\d+\b` at line 172, and `\bT\d{3,4}\b` with `\bT\d{3}\b` at line 166. Change the expected exit of cases 47 and 51 to 0, and move the two phrases into the clean fixture.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Narrow the NNN/NNN pattern to a zero-padded second number

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-008-context -->
### Context

The pattern `\b\d{3}/\d{3}\b` at `Q/scripts/check-comment-hygiene.sh` line 161 flags ratios such as `100/250`. The probe in this pass confirmed exit 1. Packet folders are zero-padded, so a child folder numbered 001 to 099 always has a second number that starts with 0.

### Constraints

- Packet references in the zero-padded form must keep flagging.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: The pattern becomes `\b\d{3}/0\d{2}\b`. A path form such as `specs/042-foo/x.md` still flags through the `specs/` rule.

**How it works**: A ratio like `100/250` passes, and `042/003` still flags.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Zero-padded second number** | Removes a common ratio false positive. | A bare `NNN/1xx` pair, such as `042/100`, is no longer flagged. | 8/10 |
| Keep the broad pattern | No change in detection. | Ratios and measurements keep failing the check. | 4/10 |

**Why this one**: The false positive is common, and the lost case needs a child numbered 100 or more written as a bare pair.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Ratios and measurements pass.

**What it costs**:
- A bare pair with a child numbered 100 or more is missed. Mitigation: the path form still flags, and the Phase 1 changelog lists the residual.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A bare 100-plus child pair appears in a comment | L | The `specs/` rule flags the path form, and the changelog names the gap. |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The `100/250` false positive is confirmed by probe. |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the broad pattern was weighed. |
| 3 | **Sufficient?** | PASS | One pattern changes. |
| 4 | **Fits Goal?** | PASS | Fewer false positives make the gate trustworthy. |
| 5 | **Open Horizons?** | PASS | The gap is named and can be closed with a path rule later. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**: Line 161 of the checker (T010).

**How to roll back**: Restore `\b\d{3}/\d{3}\b` at line 161, then rerun the checker suite, whose cases do not pin this pattern.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Resolve the router's checker from its own real path first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-009-context -->
### Context

The router joins the checker path to the project folder (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` lines 35 to 42 and 208). A downstream repository that reaches the hub through a link can lose the checker, and the hook then skips it without a word (design D3). The design resolves the checker from the router's real path first and from the project folder second. Two adapter suites build a stub checker in their fixture root: `codex/post-edit-quality.test.cjs` at lines 38 and 57, and `devin/post-edit-quality.test.cjs` at line 40. Under the new order those stubs are not the checker that runs, so their positive controls would fail. The opencode plugin suite already runs the real checker (`.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` line 480).

### Constraints

- Every adapter must run one checker, so the runtimes cannot drift on policy.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: The design's order. The router resolves its checker from its own real path first. The codex and devin fixtures change, so that the positive control is a quoted line the real checker flags.

**How it works**: The router reads the checker's location from `__filename` through its real path. The project folder is the second candidate, so a missing hub copy still falls through.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Router's real path first** | Downstream links work. One checker serves every adapter. | Two fixtures change, and the stub-based positive control goes away. | 7/10 |
| Project folder first, router's real path second | The stubs and a project's own checker keep working. | A project's older copy wins over the hub's, and the design's link case becomes a fallback. | 5/10 |

**Why this one**: The design's own failure case is the link, and one checker for every adapter removes the drift between runtimes.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Every adapter runs the same checker in a given run.

**What it costs**:
- Two fixtures change. Mitigation: T022 and T023 rerun both suites.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A project's own copy of the checker is ignored | L | The hub checker is the one the framework ships, and the router test names the order. |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Downstream links are the failure case that D3 names. |
| 2 | **Beyond Local Maxima?** | PASS | Project-first ordering was weighed. |
| 3 | **Sufficient?** | PASS | One candidate order changes, and two fixtures follow. |
| 4 | **Fits Goal?** | PASS | The goal needs the checker found in every repository. |
| 5 | **Open Horizons?** | PASS | The order can flip back with the fixtures. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**: The router's checker resolution (T018 to T021), the codex fixture (T022) and the devin fixture (T023).

**How to roll back**: Put the project folder first again in `post-edit-router.cjs`, and restore the stub fixtures from the phase's first commit.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Halt threshold for the new-language baseline delta

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Markdown agent, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-010-context -->
### Context

The design says to stop and ask the operator when the new-language delta is too large to fix in one change (design 6.4 and risk 1). It gives no number. CI and pre-commit inherit the wider language set, so a large delta would block other authors' commits.

### Constraints

- The threshold must be checkable from the baseline output, with no judgment at the moment of the check.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: The phase halts when the new-language class has more than 50 delta lines, or touches more than 20 distinct files. Above that, the phase stops and asks the operator. The number is this record's judgment and not a design number.

**How it works**: Task T043 counts the class and the files from `scratch/delta.txt`, and the changelog records the counts.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **50 lines or 20 files** | A visible stop point that one reviewable change can usually carry. | The number is chosen without measurement. | 6/10 |
| No threshold, decided case by case | Most flexible. | No stop point, and the design asks for one. | 4/10 |
| A threshold of 10 lines | Very tight control of new blocks. | Stops on normal deltas for languages with many comments. | 3/10 |

**Why this one**: The design needs a stop point, and 50 lines and 20 files is a size a single change can carry.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- A visible stop lands before CI and pre-commit inherit a large block.

**What it costs**:
- The number may not suit this repository. Mitigation: the operator confirms it at program end, and the class counts sit in the changelog.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The number is wrong for this repository | M | The operator adjusts it in this record and in T043 together. |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The design requires a stop point. |
| 2 | **Beyond Local Maxima?** | PASS | Three thresholds and no threshold were weighed. |
| 3 | **Sufficient?** | PASS | One pair of numbers. |
| 4 | **Fits Goal?** | PASS | The stop sits on the path to measurement. |
| 5 | **Open Horizons?** | PASS | The numbers are reversible in this record. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**: Task T043 and the class counts in the quality changelog.

**How to roll back**: Edit the two numbers in this record and in T043 together.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---
