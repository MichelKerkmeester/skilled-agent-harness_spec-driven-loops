---
title: "Plan: Phase B scoped README work"
description: "Two-track plan: pipeline-author 2 new fixture READMEs, mechanically insert TOC anchor blocks into 5 already-aligned READMEs. New verification-gate step added per Phase A lesson."
trigger_phrases:
  - "024 plan"
  - "phase B plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-code-folder-readmes"
    last_updated_at: "2026-05-15T11:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote plan for Phase B 2-track approach"
    next_safe_action: "Dispatch Pass 1 cli-devin over 2 fixture folders"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:3bdfbae8ded12f83ba890e525aba3f0a4d50467ad92e9c3626e4fc075cd3452e"
      session_id: "024-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase B scoped README work

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; sk-doc CODE template; cli-devin + cli-opencode shell orchestration; main-agent Edit for TOC inserts |
| **Framework** | sk-doc validation (`validate_document.py`, `audit_readmes.py`) |
| **Storage** | n/a (config + docs only) |
| **Testing** | Per-file sk-doc validate + strict-validate on packet |

### Overview

Phase B closes the system-skill-advisor sk-doc gap. Discovery revealed two distinct gap kinds requiring different treatment:

1. **Track 1 (Pipeline authoring, 2 folders)**: `tests/fixtures/lifecycle/` and `tests/scorer/fixtures/` have no README. Author via the cli-devin SWE 1.6 + cli-opencode deepseek-v4-pro pipeline proven in Phase A. New step added: bundle-verification gate between Pass 1 and Pass 2.
2. **Track 2 (Mechanical TOC insert, 5 files)**: 5 READMEs are already structurally sk-doc-aligned (frontmatter present, anchored sections present, content quality acceptable) but miss only the `## TABLE OF CONTENTS` anchor block. Insert mechanically via main-agent Edit; no pipeline needed.

Validation is the same for both tracks: per-file `validate_document.py --type readme`, packet-level strict-validate, sonnet @markdown + @review double-check before commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase A (035) shipped and validated — pipeline shape proven
- [x] cli-devin authenticated and reachable (`devin auth status`)
- [x] cli-opencode + DeepSeek API key configured
- [x] sk-doc CODE template + HVR rules available
- [x] Phase A 2 exemplar READMEs available (`system-code-graph/mcp_server/core/README.md` compact, `system-spec-kit/mcp_server/README.md` full)
- [x] Bundle verification gate documented (per Phase A lesson, `feedback_cli_devin_bundle_verification`)

### Definition of Done
- [ ] 2 new fixture READMEs written via pipeline
- [ ] 5 existing READMEs gain TOC anchor block via Edit
- [ ] All 7 files exit 0 on `validate_document.py --type readme`
- [ ] Each has HVR score >= 85
- [ ] 2 context bundles persisted under `research/context-bundles/`
- [ ] Bundle verification transcript persisted under `research/bundle-verification.md`
- [ ] Strict-validate on packet exits 0
- [ ] Sonnet @markdown + @review double-check finds no P0 issues
- [ ] Single commit on `main`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two parallel tracks merging at the validation gate:

```text
TRACK 1: PIPELINE AUTHORING (2 new fixture READMEs)
  Pass 1: cli-devin SWE 1.6 -> 2 context bundles
  Verification gate: grep-verify internal_imports + validation_commands
  Pass 2: cli-opencode deepseek-v4-pro -> 2 README.md files

TRACK 2: TOC INSERTION (5 existing READMEs)
  Single main-agent pass: Edit tool inserts TOC anchor block per file

CONVERGENCE: VALIDATION
  validate_document.py --type readme per file
  audit_readmes.py over system-skill-advisor
  validate.sh --strict on packet
  Task tool: @markdown + @review double-check
```

### Key Components

- **Pass 1 dispatcher**: cli-devin orchestrator with `-p --model swe-1.6 --permission-mode dangerous </dev/null` (the non-interactive shape proven in Phase A)
- **Verification gate**: shell+grep transcript persisted under `research/bundle-verification.md`. For each bundle key:
  - `internal_imports` → `grep -rln "<claimed_consumer>" <folder>` returns non-empty
  - `validation_commands` → command exists and produces expected exit code
  - `public_entrypoints` → grep finds the declared export
- **Pass 2 dispatcher**: `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions </dev/null` (proven shape from Phase A)
- **TOC insert pattern**: anchor block placed between the H1 title line and the first existing `## N. SECTION` heading:

  ```markdown
  <!-- ANCHOR:table-of-contents -->
  ## TABLE OF CONTENTS

  - [1. OVERVIEW](#1--overview)
  - ...

  <!-- /ANCHOR:table-of-contents -->
  ```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet scaffold
- [x] Create spec, plan, tasks, implementation-summary, description.json, graph-metadata.json
- [x] Create resource-map enumerating actual scope (2 new + 5 TOC-fix + 2 no-op)
- [x] Create empty `research/context-bundles/` directory

### Phase 2: Track 1 Pass 1 — cli-devin bundles for 2 fixture folders
- [ ] Compose prompt at `/tmp/devin-024-pass1.md` covering both fixture folders + JSON bundle schema
- [ ] Dispatch `devin -p --prompt-file ... --model swe-1.6 --permission-mode dangerous </dev/null`
- [ ] Verify 2 bundle JSON files land under `research/context-bundles/`
- [ ] Validate each bundle structure (required keys present, file_inventory non-empty)

### Phase 3: Bundle verification gate (NEW per Phase A lesson)
- [ ] For each bundle, grep-verify `internal_imports`: every claimed consumer appears in source
- [ ] For each bundle, smoke-test `validation_commands`: each command exists or is annotated as planned
- [ ] For each bundle, grep-verify `public_entrypoints`: every claimed export is present in source
- [ ] Persist transcript to `research/bundle-verification.md`
- [ ] If any hallucinations: correct bundle JSON in place before Pass 2

### Phase 4: Track 1 Pass 2 — cli-opencode markdown writing
- [ ] Compose prompt at `/tmp/opencode-024-pass2.md` referencing verified bundles + sk-doc CODE template + 2 exemplars + HVR rules
- [ ] Dispatch `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions </dev/null`
- [ ] Verify 2 README.md files written in target fixture folders

### Phase 5: Track 2 — mechanical TOC inserts
- [ ] For each of 5 target READMEs, parse section headings and emit a TOC anchor block
- [ ] Edit each README to insert the TOC block between H1 and first H2 numbered section
- [ ] Verify each file post-edit: anchor pair balanced, frontmatter intact

### Phase 6: Validation
- [ ] `validate_document.py --type readme` per file — 7 exit 0
- [ ] HVR score check — all >= 85
- [ ] `audit_readmes.py` scoped to system-skill-advisor — 0 blocking errors
- [ ] Strict-validate on packet — exit 0

### Phase 7: Sonnet double-check
- [ ] Task-tool dispatch @markdown: read all 7 READMEs, flag any sk-doc structural issues
- [ ] Task-tool dispatch @review: read all 7 + bundles, flag any factual hallucinations
- [ ] Patch any P0 findings before commit

### Phase 8: Commit
- [ ] Stage only files in scope (2 new READMEs + 5 edited + this packet)
- [ ] Commit on `main` with message `feat(008/024): sk-doc-aligned READMEs for system-skill-advisor 7 code folders`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Bundle JSON keys present | Python json + key-presence check |
| Bundle verification | internal_imports + validation_commands accuracy | Shell grep against source |
| Anchor presence | 4 mandatory anchors per README | grep |
| Frontmatter validity | YAML parses + required keys | sk-doc validator |
| sk-doc compliance | Per-README | `validate_document.py --type readme` |
| HVR | Per-README | `validate_document.py --json` => `hvr_score >= 85` |
| Strict-validate | Packet level | `validate.sh --strict` |
| Independent review | Sonnet eyes | Task-tool @markdown + @review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase A pipeline proof | Internal | Met | n/a |
| cli-devin SWE 1.6 | External binary | Met | Fall back to cli-codex for context |
| DeepSeek API key for cli-opencode | External service | Met | Cannot run Pass 2 |
| sk-doc CODE template | Repo asset | Met | Cannot author |
| HVR rules | Repo asset | Met | Cannot voice-gate |
| Sonnet @markdown + @review | Internal agents | Met | Cannot independent-verify |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of the 7 READMEs fails sk-doc validate post-write, OR Pass 1 produces empty bundles, OR bundle verification flags unrecoverable hallucinations, OR Pass 2 dispatch hangs >10 min.
- **Procedure**:
  - Pass 1 fails: retry with cli-codex gpt-5.5 high using the same prompt structure
  - Verification gate finds hallucinations: correct bundle JSON in place; if uncorrectable, re-dispatch Pass 1 with a stricter source-grounded prompt
  - Pass 2 fails: re-dispatch with tighter per-folder prompt; final fallback is main-agent direct authoring
  - TOC insert breaks a README: restore from git, redo the insert with a smaller diff
  - Validation fails: apply `--fix --dry-run` suggestions then re-validate; if structural, manual Edit
- **Recovery baseline**: HEAD before this packet commits. Worst case `git restore` the 2 new READMEs and revert the 5 TOC inserts.
<!-- /ANCHOR:rollback -->
