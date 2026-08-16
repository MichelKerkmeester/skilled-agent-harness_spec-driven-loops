---
title: "Feature Specification: sk-vision 009 manual testing playbook"
description: "Author the manual-testing-playbook package for sk-vision, scaffold the benchmark run index, and validate the operator contract."
trigger_phrases:
  - "sk-vision testing playbook"
  - "sk-vision manual scenarios"
  - "sk-vision benchmark scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 009 copy pack."
    next_safe_action: "Implement the playbook package from this spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-009-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision 009 manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 008-feature-catalog |
| **Successor** | 010-quality-gate |
| **Handoff Criteria** | Root playbook + 16 per-feature scenario files; `benchmark/` run-index scaffold; `validate-playbook-package.cjs` exit 0; root `validate_document.py` clean. Optional bounded live runs persisted with PASS/SKIP evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **leaf phase** under the sk-vision packet root.

**Scope Boundary**: `.opencode/skills/sk-vision/manual-testing-playbook/**` + `.opencode/skills/sk-vision/benchmark/**` (scaffold only). No catalog edits (008), no code changes.

**Dependencies**:
- 008-feature-catalog (scenarios cross-link catalog entries).

**Deliverables**:
- `manual-testing-playbook/manual-testing-playbook.md`
- 16 per-feature scenario files in 5 category folders (IDs `VSN-001`..`VSN-016`)
- `benchmark/README.md` + `benchmark/reports/README.md` (run-index scaffold)
- Validator proofs; optional live-run evidence

**Changelog**:
- Record delivery in the skill changelog if one exists; otherwise in this child's implementation-summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill has automated tests (8 passing) and a GPU smoke, but no reproducible operator validation: no deterministic prompts, no evidence contract, no place where a release decision can be reviewed. The create-skill shape also requires the `manual-testing-playbook/` + `benchmark/` pair, which are missing.

### Purpose
Deliver the operator scenario corpus with deterministic prompts, exact commands, expected signals, evidence, and PASS/FAIL/SKIP criteria, plus the benchmark run-index scaffold where executed evidence lands.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root `manual-testing-playbook.md` from `assets/manual-testing-playbook-template.md`
- 16 per-feature scenario files from `assets/manual-testing-playbook-snippet-template.md`:

| Category folder | Feature IDs |
|-----------------|-------------|
| `scene-understanding/` | VSN-001 inspect, VSN-002 ocr, VSN-003 detect, VSN-004 point, VSN-005 segment |
| `pixel-analysis/` | VSN-006 colors, VSN-007 diff, VSN-008 metadata, VSN-009 crop, VSN-010 zoom, VSN-011 annotate |
| `system-health/` | VSN-012 status, VSN-013 reverse |
| `host-adapters/` | VSN-014 opencode-plugin, VSN-015 pi-extension |
| `runtime-core/` | VSN-016 runtime-lifecycle |

- `benchmark/README.md` + `benchmark/reports/README.md` (index scaffold only — report files are renderer-owned, never hand-authored)
- Optional bounded live execution: if the model cache is warm (or the operator approves the ~3.9GB download), run a subset (recommend VSN-012 status first, then VSN-002 ocr on a fixture image) and persist evidence via `run-manual-playbook-scenario.cjs`; otherwise record SKIP with a named blocker.

### Out of Scope
- Authoring `skill-benchmark-report.md` / `results.csv` (renderer-owned).
- Editing the catalog or skill docs.
- `context/` edits. Code changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md` | Create | Root playbook |
| `.opencode/skills/sk-vision/manual-testing-playbook/{category}/*.md` | Create | 16 scenario files |
| `.opencode/skills/sk-vision/benchmark/README.md` | Create | Run layout + how to run |
| `.opencode/skills/sk-vision/benchmark/reports/README.md` | Create | Run index scaffold |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to create a `snippets/` subtree or sidecar `review_protocol.md` / `subagent_utilization_ledger.md`; you are about to hand-author a benchmark report file; you are about to renumber published feature IDs; you are about to run a GPU scenario without the operator's go-ahead.

Read first:
- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` and `-snippet-template.md`
- `references/prompt-voice.md` (natural-human vs RCAF)
- The 008 catalog entries (for cross-links)
- `vision-runtime/python/runtime.py` + `pi/sk-vision.ts` (exact command surfaces for expected signals)

**Scenario contract (per file, in order):** `## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. REFERENCES` or `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`. Nine display fields in the scenario contract: Feature ID, Feature Name, Scenario Objective, Exact Prompt (natural-human voice unless the actor is an orchestrator — for these tool scenarios use natural-human, e.g. "Use sk_vision_ocr on screenshots/error.png and report the exact text"), Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage. Deterministic prompts synchronized across the contract table and execution table. Verdicts only `PASS`/`FAIL`/`SKIP` with named blocker.

**Root playbook.** Frontmatter (title, description, version four-part) + H1 intro, global overview + coverage note, global preconditions (GPU/hardware, model cache, first-load weight download, host adapters present), global evidence requirements, deterministic command notation, integrated review protocol + release-readiness rules, category sections with short per-feature summaries, automated-test cross-reference section (the 8 bun tests), feature-catalog cross-reference index. Link every per-feature file. Do not duplicate full execution matrices.

**benchmark scaffold.** `benchmark/README.md`: layout + how to run (the Lane C command and the manual scenario wrapper, both from create-manual-testing-playbook §4). `benchmark/reports/README.md`: run index — one row per run folder, append-only, renderer-owned files listed with their ownership rules.

**Optional live execution.** Only with operator go-ahead. Recommended first runs: VSN-012 (status — no image needed) then VSN-002 (ocr — needs a fixture image; create one under the phase's `scratch/` if no fixture exists, e.g. a tiny PNG with a known word). Persist:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs \
  --skill .opencode/skills/sk-vision \
  --scenario VSN-012 \
  --variant status-first-run \
  --verdict PASS \
  --reason "status returns model_loaded with device and vram fields" \
  --stage routing \
  --evidence <comma-separated absolute evidence paths>
```

If the model cannot load (no GPU, no cache, no operator approval), record SKIP with the specific blocker in the implementation-summary — never fake a PASS.

Close this child with:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md --type reference
node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs \
  --package .opencode/skills/sk-vision/manual-testing-playbook
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root playbook at canonical path | `manual-testing-playbook/manual-testing-playbook.md` present, from template |
| REQ-002 | 16 scenario files, IDs VSN-001..016, kebab-case, no numeric prefixes | find output matches spec table |
| REQ-003 | Deterministic contracts | exact prompt/commands/signals/evidence/pass-fail/triage per file; prompts synchronized |
| REQ-004 | Operator validator clean | `validate-playbook-package.cjs` exit 0 |
| REQ-005 | Root validator clean | `validate_document.py --type reference` exit 0 |
| REQ-006 | benchmark scaffold | `benchmark/README.md` + `benchmark/reports/README.md` exist; no report files authored |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Catalog cross-links present | scenario files link the 008 entries; root has the cross-reference index |
| REQ-P2 | Live-run evidence persisted OR named SKIP | `benchmark/reports/` row exists for executed scenarios; SKIP names the blocker |
| REQ-P3 | No scope creep | files outside the scope table untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Root + 16 scenario files on disk at exact paths
- [ ] `validate-playbook-package.cjs` exit 0 (record output)
- [ ] root `validate_document.py --type reference` exit 0
- [ ] benchmark scaffold present; no hand-authored report files
- [ ] catalog cross-links resolve
- [ ] live evidence or named-blocker SKIP recorded
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | GPU scenarios run without approval | Medium | Operator gate in copy pack |
| Risk | Prompt drift between contract and table | High | Synchronization check per file |
| Risk | Hand-authored report files | Medium | Renderer-ownership rule enforced |
| Dependency | 008 catalog | Shipped | Stop if cross-links can't resolve |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Can this phase run GPU scenarios without approval? **A**: No — live execution is operator-gated; otherwise SKIP with a named blocker.

### Open Questions
- None.
<!-- /ANCHOR:questions -->

