---
title: "Feature Specification: Phase 7: install-guidance-and-setup-helper"
description: "A user has no tested recipe for running OpenCode 1.19.3 and 2.0.32 side by side. This phase adds one setup helper and one install reference, and proves them in a throwaway home."
trigger_phrases:
  - "install guidance and setup helper"
  - "phase 7 install guidance and setup helper"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: install-guidance-and-setup-helper

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/007-install-guidance-and-setup-helper` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 11 |
| **Predecessor** | 006-cli-opencode-dual-dispatch |
| **Successor** | 008-doctor-and-ci |
| **Handoff Criteria** | Hands to 008 when AC-001 to AC-003 in acceptance-criteria.md are Met, and the operator's install snapshot is unchanged before and after the proof. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: One setup helper in the cli-opencode skill, and one install reference beside its other references. The operator's existing installs are outside the boundary. The doctor battery belongs to 008. The `SKILL.md` link to the reference belongs to 010.

**Dependencies**:
- 006-cli-opencode-dual-dispatch (predecessor). The dispatch shape is settled before the install guide describes it.
- `research/iterations/iteration-015.md`. Its install matrix (lines 136 to 138), its helper design (lines 143 to 197), and its irreducible gaps (lines 199 to 207) are the source for both deliverables.
- `research/research.md` section 7 (install) and section 8 (the gap ledger).
- A working npm registry, for the throwaway installs.

**Deliverables**:
- `cli-opencode/scripts/opencode-setup.sh` with the modes `both`, `v1`, `v2` and `check`.
- `cli-opencode/references/install-and-versions.md`, covering the three layouts, the launcher, `OPENCODE_DB`, the shared config directory, the Homebrew fact, the `--major` warning, and the gaps.
- Proof output recorded in the implementation summary, with the throwaway files deleted.

**Executor**: `opencode-setup.sh` goes to GPT-6 Luna max fast through cli-codex. The install reference goes to DeepSeek V4.1 Flash max through cli-devin, in the sk-doc skill mode. Each reviews the other's output. The orchestrator runs every install-like proof, because each proof runs `npm` and starts processes the codex sandbox cannot run.

**Frozen decisions that bind this phase**:
- D4: every install proof runs in a throwaway prefix under this folder's `scratch/`, and the proof is deleted afterwards. The phase never runs `opencode upgrade --major`, never runs uninstall, and never starts, stops or restarts the v2 service.
- D5 and D8: the helper pins the two CLI packages at the pinned targets, `opencode-ai@1.19.3` and `@opencode/cli@2.0.32`. The plugin pins belong to 002. The public claim belongs to 011.
- D6: the executor split stated above.
- D7: the script follows `sk-code/sk-code-opencode`. The reference follows the sk-doc skill mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-opencode skill has no install guidance. A user who wants OpenCode 1.19.3 and 2.0.32 on one machine has no tested recipe (research section 7, iteration-015 F7). The layout that works needs three parts: a v1 npm prefix, a v2 npm prefix kept off PATH, and a launcher that sets `OPENCODE_DB`. The launcher comment says that without the variable, v2 opens the v1 database and migrates it in place. That claim is documented in the launcher comment and iteration-015 F6, and it has not been probed on a disposable machine.

### Purpose
A user can build the v1-only, v2-only or side-by-side layout with one script, see which version each name runs, and read what the layout cannot do.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The helper with the four modes. Each mode is idempotent, and each step prints its rollback line.
- The install reference covering the three layouts, the launcher, `OPENCODE_DB`, the shared `~/.config/opencode`, the Homebrew fact, the `upgrade --major` warning, and the irreducible gaps from research section 8.
- Proof runs in a throwaway home under this folder's `scratch/`, deleted afterwards.

### Out of Scope
- Any change to the operator's installs, which are `~/.local/bin/opencode`, `~/.local/opencode-v2` and the running v2 service.
- Running `upgrade`, `upgrade --major`, `uninstall` or any `service` command. The rollback lines are printed and never run.
- The doctor battery and the CI workflow. Those belong to 008.
- The `SKILL.md` link to the reference. That belongs to 010.
- The dispatch shape. That belongs to 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Create | The helper. The `scripts/` folder does not exist yet, so this step creates it. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Create | The install reference. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/007-install-guidance-and-setup-helper/scratch/home` | Create, then delete | The throwaway HOME for every proof run. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/007-install-guidance-and-setup-helper/scratch/npm-cache` | Create, then delete | The npm cache for the throwaway installs. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `both` builds a v1 and a v2 pair in a throwaway HOME. The name `opencode` reports `1.19.3`, the name `opencode2` reports `opencode v2.0.32`, and the launcher sets `OPENCODE_DB` to a path other than `opencode.db`. |
| REQ-002 | Every mode is idempotent. A second run changes no file in the home, each step prints its rollback line, and the script never runs a rollback, uninstall or upgrade. |
| REQ-003 | `check` classifies each name by output shape, changes no file, and runs on a throwaway layout. It reads the binaries from HOME and does not depend on PATH for classification. |
| REQ-004 | The install reference passes `validate_document.py` with the install guide type and no blocking error. |
| REQ-005 | No file under the operator's `~/.local`, `~/.config/opencode` or `~/.local/share/opencode` changes during the proof. The process list is unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `v2` refuses when a v1 `opencode` already resolves, and `v1` refuses when a v2 `opencode` already resolves. Each refusal prints the `both` hint and exits 1. |
| REQ-007 | The reference covers the irreducible gaps from research section 8 and the divergences in iteration-015 F4. |
| REQ-008 | The reference names Homebrew as a v2-only, exclusive channel. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The throwaway pair reports its versions under its own names, and the databases are on different paths.
- **SC-002**: The operator's install snapshot matches before and after the proof.
- **SC-003**: The reference validates with no blocking error.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm registry access for the throwaway installs | Without it the pair cannot be built. | The proof reports BLOCKED, not PASS. The npm cache stays inside `scratch/`. |
| Risk | An install script starts a v2 service or writes outside its prefix (Q6) | The operator's service or config changes. | The process list and file times under the real config and data folders are recorded before and after. Nothing is stopped. |
| Risk | The helper runs with the real HOME | The operator's `~/.local` is written. | The proof sets HOME to `scratch/home`. The script prints its resolved paths before any write. |
| Risk | The claim that v2 adopts `opencode.db` is documented, not probed | A reader trusts an unverified migration claim. | The reference labels it documented. The `v2` mode warns, and it never moves a file. |
| Risk | `uninstall` may leave the v2 service running (Q2) | A user who follows the rollback keeps a live service. | The rollback lines are printed, never run, and the reference marks the question open. |
| Risk | A `--version` check reads as proof that plugins load | A reader trusts a pair that has not loaded any plugin. | The reference and AC-001 say "reports its version", not "works". Plugin load is 008's proof. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `check` makes at most two `--version` calls and reads the file system once for each prefix.

### Security
- **NFR-S01**: The script uses no `sudo`. Its only network call is the npm install in `both` and `v1`, `v2`, and it writes only under the resolved prefixes and the launcher path, plus one temporary probe folder in the system temp area that it removes on exit, and on INT or TERM; signals are ignored for the instant the folder is created. The folder exists because the v2 binary logs every launch under its data directory (amended at build time, `scratch/decisions.txt` 18 and 22).

### Reliability
- **NFR-R01**: The launcher is written last, and only after both npm installs succeed. A failed install leaves no launcher behind.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Unknown mode: print the usage text and exit 2.
- No database directory: `check` prints that no database file exists and continues.

### Error Scenarios
- A v1 `opencode` resolves when `v2` runs: refuse, print the `both` hint, and exit 1.
- A launcher that differs from the expected text: rewrite it, and print that it did.
- `$V2_PREFIX/bin` already on PATH: abort with the message from iteration-015 (step 4 of `both`).
- npm missing: exit 1 with a message, and write nothing.

### State Transitions
- Partial completion: the first npm install succeeds and the second fails. The launcher is not written, and the rerun completes the layout.
- Session expiry: not applicable. The script keeps no state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One script, one reference, and two proof paths |
| Risk | 15/25 | Installs that could touch the operator's machine, held by the throwaway HOME |
| Research | 6/20 | The matrix and the helper are specified in iteration-015 |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q1.** Does v1 honour `OPENCODE_DB`? Iteration-015 leaves this open (P2). The reference states it as unknown.
- **Q2.** Does the v2 service outlive `uninstall`? Iteration-015 leaves this open. The reference states it as unknown.
- **Q3.** Do bun and pnpm support the two-prefix layout? Only npm was verified. The reference marks the other managers single-version.
- **Q4.** Does `upgrade --major` prompt before it acts? Not probed. The reference says that it removes v1, and it makes no claim about a prompt.
- **Q5.** Does a launcher trace prove separate databases? The trace proves the path. The database file appears only after a real run, and this phase makes no real run. Default: the trace is the evidence, and the implementation summary says so.
- **Q6.** Do the `@opencode/cli` install scripts start a service? Unknown. The process snapshot in T001 and T014 records it.
- **Q7.** Which validator type applies to the reference? The file name does not match the `install_guide` auto-detect rule in `validate_document.py`. Default: pass `--type install_guide` explicitly, and report if the rules do not fit.
<!-- /ANCHOR:questions -->
