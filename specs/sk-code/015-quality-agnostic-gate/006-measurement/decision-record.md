---
title: "Decision Record: Phase 6: measurement"
description: "Records the operator decisions this phase takes at their design defaults, the phase-local measurement choices, and the one blocked decision about who renders the live report."
trigger_phrases:
  - "measurement decision record"
  - "phase 6 ADR"
  - "operator decisions taken at defaults"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/006-measurement"
    last_updated_at: "2026-10-26T14:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded ADR-001 to ADR-008, all still awaiting the operator at program end"
    next_safe_action: "Wait for the operator confirmation at program end"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-measurement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 6: measurement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Operator decisions from the design (section 1.4) are taken here at the design default, as the standing instruction asks. Each one carries its alternative and its reversal, so the operator can confirm or reverse it at program end.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Amend Iron Law 3 to name the floor for UNKNOWN surfaces (design D4)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-25 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Iron Law 3 forbids any standard on an UNKNOWN surface (`.skilled/skills/sk-code/shared/references/phase-detection.md:109`), and Iron Law 2 makes the gate mandatory (`phase-detection.md:108`). A repository with no surface packet therefore never completes the gate, which is the case the program goal names. Phase 6 measures that case in CQ-002, CQ-003 and fixture F01.

### Constraints

- The amended text keeps the rule that no command runs on an unsupported surface (`.skilled/skills/sk-code/shared/references/stack-detection.md:32`).
- The amendment lands in phase 004, so Phase 6 measures the amended text only.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the design's amended Iron Law 3. "No claim about an unsupported surface. An UNKNOWN surface gets only the universal floor in `code-quality-standards.md` and the quality runner's built-in checks until the operator names its surface and commands, in a declared surface or in the repository's committed `.sk-code/quality.json`. No other standard or verification command applies to it."

**How it works**: The runner runs the universal floor and its built-in checks on an UNKNOWN surface, and it reports `resolved_surface` as `unknown`. Configured checks run only from the committed config (ADR-003). The mode asks for the surface and its commands when a required P0 check is UNVERIFIED.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amended Iron Law 3 (chosen)** | The floor runs everywhere, and no unnamed command runs | The floor may be read as licence for surface standards (design risk 4) | 8/10 |
| Keep Iron Law 3 as written | No doctrine change | The gate never completes in a repository without a surface packet | 3/10 |
| Ship phases 001 to 003 and keep asking on UNKNOWN | No doctrine change | The runner serves SKILLED and named checks only | 5/10 |

**Why this one**: It lets the gate reach a verdict on a foreign repository without running any command nobody named.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- CQ-002 and CQ-003 test the UNKNOWN path, so a foreign repository gets a real verdict.

**What it costs**:
- The floor is narrower than a surface checklist. Mitigation: the envelope names the surface as `unknown`, and the mode asks for the commands.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The floor is read as licence for surface standards (design risk 4) | M | The amended text names the floor and the config, and nothing else. CQ-003 checks that the envelope reports `unknown` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A foreign repository cannot complete the gate under the current text |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One clause and no new file |
| 4 | **Fits Goal?** | PASS | The foreign-repository goal needs it |
| 5 | **Open Horizons?** | PASS | The operator still names the commands |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/shared/references/phase-detection.md:109` (phase 004).
- The UNKNOWN row at `.skilled/skills/sk-code/shared/references/stack-detection.md:32` (phase 004).
- The UNKNOWN row of `code-quality-standards.md` (phase 004).

**How to roll back**: Restore the original Iron Law 3 sentence at `phase-detection.md:109` and the original UNKNOWN row at `stack-detection.md:32`, then revert the phase 004 commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Scope `universal-checklist.md` to SKILLED as the house checklist (design D12)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-25 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-002-context -->
### Context

`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` describes itself as serving "the OpenCode development environment" (lines 3 and 16). Its P0 rows force this framework's header form and spec roots. It loads on every surface today, so a foreign repository inherits SKILLED rules. The operator's ADR-001 in packet `014-code-modes-research/003-review-remediation` already split the quality floor into a baseline and a web overlay (`specs/sk-code/014-code-modes-research/003-review-remediation/implementation-summary.md:26,103`), and this decision narrows that meaning further.

### Constraints

- No new baseline file is written. The floor stays in `code-quality-standards.md` (design D12).
- The operator confirms the narrowing.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: retitle the file as the SKILLED house checklist, and load it only when SKILLED is a resolved surface of the target. Other surfaces declare their own checklists in one shape (design D13).

**How it works**: The runner loads the file only for SKILLED targets (fixture F16). A repository opts in to it with a `checklists[]` row that names the `hub:` path. No special flag is needed.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope to SKILLED (chosen)** | Foreign repositories get the floor only | A retitle and one loading condition | 8/10 |
| New universal baseline file | A clear name | A file that no reader needs, which design D12 rejects | 4/10 |
| Keep it universal | No change | Foreign repositories get SKILLED header and spec rules | 3/10 |

**Why this one**: SKILLED rules stay where SKILLED is the target, and the floor stays universal.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Fixture F16 and CQ-005 test that SKILLED rules stay out of foreign targets.

**What it costs**:
- A SKILLED house rule no longer applies to a foreign repository by default. Mitigation: the repository opts in with a `hub:` row.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The narrowing reads as a loss of the ADR-001 baseline set | M | The operator confirms it at program end |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Foreign repositories inherit SKILLED rules today |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One retitle and one condition |
| 4 | **Fits Goal?** | PASS | The goal is a codebase-agnostic gate |
| 5 | **Open Horizons?** | PASS | Repositories opt in through their own rows |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The title and loading condition of `universal-checklist.md` (phase 004).
- The loading table in `.skilled/skills/sk-code/sk-code-quality/SKILL.md` (phase 005).

**How to roll back**: Restore the universal title and the always-load row in the `SKILL.md` loading table, then revert the phase 004 commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Config file `.sk-code/quality.json` with the design merge rule (design D16)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-25 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

The runner needs one committed place where a repository names its own checks. The sk-git precedent is a `.sk-git/` folder at the repository root (`.skilled/skills/sk-git/SKILL.md:261`). The design recommends the name and the merge rule in its section 4.2 (design 1.4 item 3).

### Constraints

- Commands come only from the repository layer (design 4.5).
- No local override file is added (design D16).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: `.sk-code/quality.json` at the repository root, with `schemaVersion` 1.

**How it works**: Discovery runs in this order: `--config`, then git config `skcode.qualityConfig` at file scope, then `.sk-code/quality.json`, then the shipped defaults. The merge is: `checks` come from the repository only. `checklists` and `generated` append. `commentHygiene` lists append and the core patterns stay. `sensors` merge per sensor, and an exact sensor can be narrowed but never disabled.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.sk-code/quality.json` (chosen)** | Mirrors `.sk-git/`, one name, committed | One new folder at the repository root | 8/10 |
| `.skilled/quality.json` | Keeps the framework folder | Mixes repository config into the framework | 4/10 |
| Environment variable only | No file | Not committed, so each session differs | 2/10 |

**Why this one**: It is committed, easy to find, and matches the sk-git precedent.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Fixture F06 and CQ-006 use a configured required check, and the file path appears in the envelope.

**What it costs**:
- One more config file. Mitigation: `/doctor:sk-code quality init` writes it once (phase 003).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A repository writes an unknown key | L | An unknown key is a config error (design 4.2) |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required checks need one committed home |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One file and one merge rule |
| 4 | **Fits Goal?** | PASS | Repositories name their own commands |
| 5 | **Open Horizons?** | PASS | The schema can grow under `schemaVersion` |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `lib/quality-config.cjs` and the doctor route (phase 003).
- The reference document `quality-config.md` (phase 003).

**How to roll back**: Rename the path in the discovery list and in the doctor route. The schema does not change.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: CI and pre-commit keep whole-file scope (design D6)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-25 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

The CI job scans every changed file in full (`.github/workflows/comment-hygiene.yml:36-48`). Pre-commit scans the staged blobs in full (`.skilled/scripts/git-hooks/pre-commit:145-158`). Both are blocking layers. Changing either to changed-line scope is a decision the operator must make (design 1.4 item 4).

### Constraints

- Phase 6 measures the gate. It does not change a blocking layer.
- The gate reports layer state through `layers` (design 3.5), so it can name a whole-file layer when one exists.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: whole-file scope for CI and pre-commit. The quality gate scopes its own findings to changed lines. A finding on an untouched line of a touched file blocks only when a whole-file layer is present, and the finding names that layer (design D6).

**How it works**: The runner reads the `layers` probe. When a layer is present, its touched-file finding is blocking and names the layer. When no layer is present, the finding is P1 debt.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Whole-file for both (chosen)** | No blocking layer changes | Old comments on touched files can block a commit | 8/10 |
| Changed-line in CI only | Less noise in CI | CI and pre-commit disagree | 4/10 |
| Changed-line in both | Least noise | Changes a HARD BLOCK layer and needs the operator's ruling | 3/10 |

**Why this one**: It changes no blocking layer without the operator, and the gate still predicts what each layer does.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Fixture F04 measures a touched-file finding that blocks because a layer is present.

**What it costs**:
- Old comments on touched files can block a commit. Mitigation: the baseline run (design 6.4) classes every new hit before merge.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Newly covered languages make existing comments fail CI (design risk 1) | H | The 6.4 baseline runs before merge, and its halt rule applies when the count is large |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The layers keep their current behavior |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | No layer file changes |
| 4 | **Fits Goal?** | PASS | Measurement does not change blocking layers |
| 5 | **Open Horizons?** | PASS | A later change can move a layer after its ruling |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: Nothing in this phase. The gate changes in phase 002, and CI and pre-commit change only if the operator asks.

**How to roll back**: Nothing to roll back. The reversal is an operator decision that changes `comment-hygiene.yml` and the pre-commit hook.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Benchmark report format, with corpus and root in `source.md` (design 1.4 item 5, synthesis rank 13)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-25 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-005-context -->
### Context

The design says the report follows the existing reports under `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/`. Rank 13 says the live run records an absolute root and no corpus (`specs/sk-code/014-code-modes-research/001-quality-mode-research/research/synthesis-v1.md:207`). The folder grammar and the report contract belong to create-benchmark (`.skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:240`). The index storage rule is in the reports README section 3. The existing `source.md` already carries a `Target skill` row and a `Scenario corpus` row.

### Constraints

- The renderer owns the markdown (ADR-008, and `manual-testing-playbook.md:21-22`).
- Raw transcripts stay in the source packet, not in the report (reports README section 3).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: the existing seven-file set, in one folder named by the execution date and the subject and variant `quality-gate-fixtures` and `live`. The corpus and a repository-relative root go into the existing `source.md` rows `Scenario corpus` and `Target skill`. Raw transcripts stay in this phase's `evidence/` folder, and `source.md` names that path.

**How it works**: The measurement record holds the same values. The renderer, once it exists, copies them into the rows. The root is `.skilled/skills/sk-code/sk-code-quality`, which is repository-relative and holds no user path.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Seven files, root and corpus in `source.md` (chosen)** | Matches the grammar and closes both rank 13 gaps | The rows depend on a renderer (ADR-008) | 8/10 |
| Add an eighth file for the corpus | Clear separation | No reader expects the file | 4/10 |
| Keep the absolute root, as the existing report does | No change | Rank 13 rejects it | 1/10 |

**Why this one**: It keeps the format and fixes the two gaps that rank 13 names.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The report records a portable root and the corpus, as rank 13 asks.

**What it costs**:
- The rows wait on the renderer. Mitigation: the measurement record already holds the values.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later renderer drops the corpus row | M | AC-014 checks the row and the absence of absolute paths |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Rank 13 names the two gaps |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | Two existing rows, no new file |
| 4 | **Fits Goal?** | PASS | The report is the measurement deliverable |
| 5 | **Open Horizons?** | PASS | The same shape serves later runs |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**: The new report folder and its index row (Step 3, blocked by ADR-008).

**How to roll back**: Delete the new folder and its index row. No prior run is overwritten, because a changed result gets a new folder.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The advisor plugin keeps its own `declaredSurfaces` copy (design D14)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-25 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-006-context -->
### Context

`.skilled/plugins/system-skill-advisor.js` (function `declaredSurfaces`, lines 747 to 772) keeps a second copy of the surface declarations. The quality reader is `declaredSurfaces` in `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:773`. Design 1.4 item 6 asks whether to fold the copy into the one reader. The plugin sits outside this packet.

### Constraints

- Phase 6 changes no plugin file.
- Drift between the two copies is a known risk (design risk 7).
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: keep the advisor plugin's copy where it is. The quality runner reads through the one reader in `router-replay-lib.cjs`, and Phase 6 does not fold the plugin's copy into it.

**How it works**: No plugin code changes. The compiled canaries use the compiled route front door, not the advisor plugin, so they do not detect plugin-only drift.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the copy (chosen)** | No plugin change | Drift risk remains (design risk 7) | 7/10 |
| Fold it into `router-replay-lib.cjs` | One reader | Changes the advisor's load path, outside this packet | 5/10 |

**Why this one**: Folding touches a runtime path outside this packet, and no measurement here needs it.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- No plugin change in this phase.

**What it costs**:
- The two copies may drift. Mitigation: none in this phase, and the operator is told.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Drift shows up only in the advisor and not in the compiled route | M | Raised to the operator. Not covered by a canary |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nothing in Phase 6 needs the fold |
| 2 | **Beyond Local Maxima?** | PASS | Two options were scored |
| 3 | **Sufficient?** | PASS | No code change |
| 4 | **Fits Goal?** | PASS | The fold is outside the packet's scope |
| 5 | **Open Horizons?** | PASS | The fold stays available as a later change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**: Nothing.

**How to roll back**: Nothing to roll back. The reversal points the plugin's loader at `declaredSurfaces` in `router-replay-lib.cjs` and deletes the plugin's copy.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Intent recall is measured and recorded with no target (phase-local)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | Markdown agent, for this phase. Reversible by the operator |

---

<!-- ANCHOR:adr-007-context -->
### Context

Both saved 014 runs record an intent recall of 0 (`specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:123`). Research question Q6 asks why and records the cause as UNKNOWN (`research.md:330`). Design 6.5 names no target for intent recall.

### Constraints

- No target exists in the design, and inventing one needs a decision.
- Four prompts are too few to tune routing against.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: measure intent recall on four quality prompts, the CQ-001 prompt and the three canary prompts. Record the count as found, with `targeted` set to `false`. This phase does not tune routing against the result.

**How it works**: `measurement.json` holds an `intent` object with `prompts` set to 4, `matched`, and `targeted` set to `false`. The report README repeats the figure beside the words "intent recall".
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Measure and record, no target (chosen)** | Honest about the gap, and no overfitting | No pass or fail on routing | 7/10 |
| Target 1.0 on four prompts | A clear bar | Tuning on four prompts overfits | 4/10 |
| Leave it unmeasured | No work | Repeats the 014 gap | 2/10 |

**Why this one**: The claim needs a number, and tuning to four prompts would make the number meaningless.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- A measured intent recall for the first time since packet 014.

**What it costs**:
- The result may stay low, and its cause is read in a later phase from the per-prompt output.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader takes the figure as a score | M | `targeted: false` is written beside it |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 014 gap is open (`research.md:330`) |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One field and one README row |
| 4 | **Fits Goal?** | PASS | Measurement is this phase's goal |
| 5 | **Open Horizons?** | PASS | A later target is an amendment |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**: The `intent` field of `evidence/measurement.json` (T019) and the report README row (blocked by ADR-008).

**How to roll back**: Remove the field. A target added later is an amendment to this record.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Owner of the live D4 runner and the report renderer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing instruction. Drafted by the markdown agent |

---

<!-- ANCHOR:adr-008-context -->
### Context

Design 6.5 and the Phase 6 scope in design section 7 require a live D4 run that writes a report folder under `sk-code-quality/benchmark/reports/`. The Lane C harness, its runner, its scoring contract and `/deep:skill-benchmark` are retired. The hub's benchmark README says "D4 usefulness, D5 connectivity and live-mode scoring have no successor. Owner of that gap: sk-code" (`.skilled/skills/sk-code/benchmark/README.md:14,16`). No script under `.skilled/bin` or the sk-code tree renders the report markdown. The existing reports say "Rendered from report.json (do not hand-edit)". The quality playbook says renderer-owned markdown is never hand-authored (`.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:21-22`). In the design, "D4" means the benchmark's D4 usefulness dimension (`research.md:122`), not design decision D4.

### Constraints

- The playbook rule forbids hand-written report markdown.
- A scenario is complete only after its outcome is recorded in a report folder (`manual-testing-playbook.md:21-22`), so the CQ runs also wait on the renderer.
- The retired scoring harness stays retired. Nothing here re-runs it or re-scores a run.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: option (a). The operator ruled that sk-code owns the gap and that every phase is implemented with nothing deferred, so this phase builds the report renderer. It lives at `.skilled/skills/sk-code/benchmark/scripts/render-report.cjs`, with its golden test beside it under `scripts/tests/`. Tasks T023 to T025 are unblocked.

**How it works**: `node render-report.cjs <report.json> <out-folder>` writes the seven-file set from one machine record. `--check <report-folder>` re-renders that folder's record into a temporary folder, compares every file byte for byte, names each file that differs and exits 1. The record's `corpus` field fills the `Scenario corpus` row of `source.md`, and `targetSkill.root` is written as recorded, so a record that stores a repository-relative root renders a portable folder (ADR-005). Eight committed reports re-render byte for byte, and the four that do not are named with the reason in the phase evidence.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(a) Phase 6 builds the renderer (chosen)** | The report folder is producible now, and the rule that renderer-owned markdown is never hand-authored holds | One module and one test outside the gate code, so the no-code requirement needs an explicit exception | 8/10 |
| (b) Hand-write the seven files under an operator exception | The report exists now | Breaks the renderer-owned rule and the "do not hand-edit" note | 2/10 |
| (c) Wait for the operator to name a renderer owner | Keeps the scope and the playbook rule | Nothing in this program is deferred, so the wait leaves the phase's deliverable unbuilt | 4/10 |

**Why this one**: The operator named the owner and ruled that no phase is deferred, so a wait would leave the measurement phase without the report its own success criteria ask for.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- The report folder is written from the measurement record, and any folder can be checked against the record it came from.

**What it costs**:
- One module and one test under the benchmark tree, and one stated exception to the no-code requirement. Mitigation: the module runs offline on Node built-ins, reads and writes only the folder it is given, and touches no gate code.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later template change silently rewrites an archived report | M | The golden test re-renders the committed reports of the current format and fails on any difference |
| The renderer is read as a replacement for the retired scoring harness | L | It renders a record it is given and scores nothing |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The report cannot be produced under current rules |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One module and one test |
| 4 | **Fits Goal?** | PASS | The report is the measurement's deliverable |
| 5 | **Open Horizons?** | PASS | A scoring harness restored later can write the same record |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/benchmark/scripts/render-report.cjs` (the renderer).
- `.skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs` (the golden test).
- `.skilled/skills/sk-code/benchmark/README.md` section 7 (names the renderer and how to run it).

**How to roll back**: Delete the two script files and section 7, then restore the no-code requirement. No archived report is touched, because a render writes a new folder and `--check` writes nothing.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->
