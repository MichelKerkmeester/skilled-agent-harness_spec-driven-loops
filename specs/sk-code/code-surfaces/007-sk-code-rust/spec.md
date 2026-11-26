---
title: "Feature Specification: Rust standards in sk-code, informed by rust-anything"
description: "sk-code's Rust references are written for napi-rs and WASM bindings that must match a TypeScript oracle and say nothing about Rust apps such as a CLI or a terminal screen. This packet researches the rust-anything repository and updates the existing Rust references and checklist in place with what it teaches."
trigger_phrases:
  - "sk code rust standards"
  - "rust anything research"
  - "rust references update"
  - "rust checklist update"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Rust standards in sk-code, informed by rust-anything

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-26 |
| **Branch** | `worktrees/546-sk-code-rust` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Rust references and checklist under `.skilled/skills/sk-code/sk-code-skilled/` are written for one job: a napi-rs or WASM binding whose output must match a TypeScript oracle byte for byte. A Rust app built inside Skilled, such as the planned `bots-tui` terminal screen, gets no guidance on its command line, its terminal handling, its tests or its lints, because the set never names clap, ratatui or crossterm.

### Purpose
The Rust set covers a Rust app as well as a Rust binding, with every new rule traced to a line of the rust-anything repository or to an existing sk-code rule.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from `.skilled/skills/sk-code/sk-code-skilled` on 2026-11-26, counting the Rust reference and checklist files that name each topic:
```text
$ for t in clap ratatui crossterm anyhow thiserror proptest insta 'unsafe_code' 'clippy' 'edition = "2024"' napi wasm-bindgen; do printf '%s: ' "$t"; grep -rl -- "$t" references/rust assets/checklists/rust-checklist | wc -l | tr -d ' '; done; find references/rust assets/checklists/rust-checklist -name '*.md' | wc -l
clap: 0
ratatui: 0
crossterm: 0
anyhow: 5
thiserror: 14
proptest: 1
insta: 2
unsafe_code: 8
clippy: 7
edition = "2024": 3
napi: 21
wasm-bindgen: 14
      21
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run a deep research loop over `specs/z_external-repo-library/rust-anything-main` on four angles: its own Rust craft, its record, diff and gate method with `docs/pitfalls.md`, its cross-language type mapping in `docs/types.md`, and the agent skill in `skills/rust-anything/`.
- Map every finding against the 21 existing Rust files as covered, contradicted or missing, by file and section.
- Edit the existing Rust references and checklist parts in place with the ranked findings.
- Add a new split part only for a topic no existing part can hold, and list it wherever the hub enumerates the Rust files.
- Record the version bump and a changelog entry for sk-code-skilled, and update the LS-006 playbook scenario when the reference list changes.

### Out of Scope
- A new `sk-code-rust` surface packet - the operator chose to update in place on 2026-11-26, so Rust stays inside sk-code-skilled.
- A change to surface or language detection in `shared/references/stack-detection.md` - Rust inside Skilled is already detected, and the research only reopens this if it finds a gap inside SKILLED. Amended 2026-11-26 by decision Q010: the RUST row gains the app-crate keywords, recorded as goal.md D1.
- Writing any Rust code - this packet changes standards documents only.
- Copying rust-anything files - its MIT or Apache-2.0 licence allows reuse, but the references state rules in sk-code's own words with a source line.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md` | Modify | Lints table, edition, the finish gate of fmt, clippy and test |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` | Modify | App layout, module split, the command-line entry |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md` | Modify | Error handling for an app beside the binding rules |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` | Modify | Record, diff and gate against an original, and the pitfalls |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md` | Modify | Value mapping across FFI from `docs/types.md` |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/` | Modify | A short recipe an agent follows |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/` | Modify | New P1 and P2 rows |
| `.skilled/skills/sk-code/ROUTER.md`, `.skilled/skills/sk-code/mode-registry.json` | Modify | Only when a new split part is added, since both list the Rust files |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`, `changelog/` | Modify, Create | Version bump and changelog entry |
| `.skilled/skills/sk-code/manual-testing-playbook/language-sub-detection/skilled-rust.md` | Modify | Only when the reference list changes |

The final list comes from the research synthesis, and `plan.md` names it before the first edit. The list as applied is in `plan.md` §Final File List.

After the first commit, the operator widened the scope twice. Decision Q009 brought the LS-006 TypeScript-side load fix into this packet, which touches the hub `ROUTER.md`, `sk-code-review/SKILL.md` and `stack-detection.md`. Decision Q010 added the app-crate routing keywords and the LS-007 playbook scenario, which touch the hub routers, registry, metadata and playbook. `plan.md` §Final File List names every file the follow-up changed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `research/research.md` exists and holds a ranked list of edits. Each edit names its target file under `sk-code-skilled/references/rust/` or `assets/checklists/rust-checklist/`, the change, and the rust-anything `file:line` it rests on. |
| REQ-002 | Every rule added to the Rust set cites a rust-anything source line or an existing sk-code rule, and no line longer than 60 characters is copied verbatim from the reference repository. |
| REQ-003 | Every Rust file path named in `sk-code/ROUTER.md` and `mode-registry.json` exists after the change, and the hub's router sync check passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The Rust set names the command-line, terminal and test practice a Rust app needs, so a grep for `clap`, `ratatui` and `crossterm` over `references/rust` finds each at least once, unless the research shows rust-anything gives no evidence for one. Then the gap is recorded in `research/research.md`. |
| REQ-005 | The napi-rs and WASM parity rules keep their meaning: every rule the binding sections state before the change is still stated after it, checked section by section. |
| REQ-006 | sk-code-skilled carries a new version and a changelog entry naming the changed files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The grep in Measured Behavior prints at least 1 for `clap`, `ratatui` and `crossterm`, or `research/research.md` names why one stays at 0.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/code-surfaces/007-sk-code-rust --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `cli-mistral-vibe` executor with DeepSeek flash at max thinking | Without it the research cannot run under the operator's executor rule | A `--dry-run` preview is read before the real run, and a failed lineage is re-run or recorded |
| Risk | A lineage reports findings whose `file:line` does not resolve | Med | The main session opens every cited line before an edit uses it |
| Risk | An edit to a shared part weakens a binding rule | Med | REQ-005's section-by-section check against the pre-change text |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each split part stays within the size the sk-doc reference format allows, and a part that would pass it is split.

### Security
- **NFR-S01**: The research reads the reference repository and writes only inside this packet's `research/` folder.

### Reliability
- **NFR-R01**: The compiled-routing freshness check run by the pre-commit hook prints that every hub is fresh or excused.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a research angle with no evidence in the repository is recorded as a gap and adds no rule.
- Maximum input: a finding that needs more than one new part is split across parts, each listed in the hub.
- Failure path: a lineage that stops or fails is re-run once, then recorded as a finding in `research/research.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 14 files, about 900 lines, one skill |
| Risk | 6/25 | Documents only, with no API, auth or data change |
| Research | 14/20 | A 75,000-line reference repository on four angles |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does any finding need a change to Rust detection inside SKILLED? Decision: no, unless the research shows a gap. Then it is raised to the operator before an edit.
<!-- /ANCHOR:questions -->

---
