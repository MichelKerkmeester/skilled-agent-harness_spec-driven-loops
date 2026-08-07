---
title: "Plan: Phase C 8-folder README authoring"
description: "Single-track pipeline: cli-devin SWE 1.6 produces 8 context bundles, cli-opencode deepseek-v4-pro writes 8 sk-doc-aligned READMEs. New 3-check verification gate per Phase B lesson."
trigger_phrases:
  - "054 plan"
  - "phase C plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-054-code-folder-readmes"
    last_updated_at: "2026-05-15T12:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote plan for Phase C single-track pipeline"
    next_safe_action: "Dispatch Pass 1"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:276e70e8fcb2b9238a3f1ff5f2c55a06e4def80299823e2bd622ecb3a3899623"
      session_id: "054-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase C 8-folder README authoring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; sk-doc CODE template; cli-devin + cli-opencode |
| **Framework** | sk-doc validation (`validate_document.py`, `audit_readmes.py`) |
| **Storage** | n/a |
| **Testing** | Per-file sk-doc validate + strict-validate on packet + sonnet double-check |

### Overview

Single track this phase (all 8 folders are missing READMEs, no TOC-fix track). Three passes:

1. **Pass 1 (cli-devin SWE 1.6)**: One session reads each folder, emits 8 JSON bundles.
2. **3-check verification gate (NEW)**: per bundle: grep internal_imports, grep public_entrypoints, smoke-run validation_commands. Persist transcript.
3. **Pass 2 (cli-opencode deepseek-v4-pro)**: One session consumes 8 verified bundles + sk-doc template + HVR rules + exemplars; writes 8 READMEs.

Convergence: per-file validate, audit_readmes, strict-validate, sonnet double-check, commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase A + B shipped and validated (the pipeline shape is proven)
- [x] 3-check gate documented (`feedback_bundle_gate_smoke_run`)
- [x] cli-devin authenticated, cli-opencode + DeepSeek API key configured
- [x] sk-doc CODE template + HVR rules available
- [x] Phase A + B exemplars available

### Definition of Done
- [ ] 8 new READMEs written
- [ ] All 8 pass `validate_document.py --type readme` exit 0
- [ ] HVR score >= 85 per file
- [ ] 8 context bundles persisted under `research/context-bundles/`
- [ ] 3-check gate transcript persisted under `research/bundle-verification.md`
- [ ] Strict-validate on packet exits 0
- [ ] Sonnet @markdown + @review pass (0 P0)
- [ ] Single commit on `main`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Same single-track pipeline as Phase A, scaled to 8 folders with the upgraded 3-check gate.

### Key Components

- **Pass 1 dispatcher**: `devin -p --prompt-file /tmp/devin-054-pass1.md --model swe-1.6 --permission-mode dangerous </dev/null`
- **3-check verification gate**:
  - imports: `grep -rln "<claimed_consumer>" <folder>` non-empty
  - exports: `grep -n "export.*<name>" <source>` finds declaration
  - validation_commands: actually run with short timeout; require expected exit code; flip `verified: false -> true`
- **Pass 2 dispatcher**: `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions </dev/null`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet scaffold
- [x] Create all 7 packet files (spec, plan, tasks, impl-summary, description.json, graph-metadata.json, resource-map)
- [x] Create empty research/context-bundles/ directory

### Phase 2: Pass 1 — cli-devin context bundles for 8 folders
- [ ] Compose prompt at `/tmp/devin-054-pass1.md`
- [ ] Dispatch cli-devin
- [ ] Verify 8 bundle JSON files

### Phase 3: 3-check verification gate
- [ ] Per bundle: grep internal_imports, grep public_entrypoints, smoke-run validation_commands
- [ ] Persist `research/bundle-verification.md`
- [ ] Correct any hallucinations in place before Pass 2

### Phase 4: Pass 2 — cli-opencode README writes
- [ ] Compose prompt at `/tmp/opencode-054-pass2.md`
- [ ] Dispatch cli-opencode + deepseek-v4-pro
- [ ] Verify 8 README.md files written

### Phase 5: Validation
- [ ] `validate_document.py --type readme` per file (8 exit 0)
- [ ] HVR score check per file (>= 85)
- [ ] `audit_readmes.py` over system-spec-kit (0 blocking)
- [ ] Strict-validate on packet (exit 0)

### Phase 6: Sonnet double-check
- [ ] @markdown + @review parallel Task-tool dispatches
- [ ] Patch any P0 findings

### Phase 7: Commit
- [ ] Stage only files in scope (8 new READMEs + packet)
- [ ] Commit on `main`: `feat(014/054): sk-doc-aligned READMEs for system-spec-kit 8 code folders`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Bundle JSON keys present | Python json + key-presence |
| 3-check gate | Bundle claim accuracy | Shell grep + smoke-run |
| Anchor presence | 4 mandatory anchors per file | grep |
| sk-doc compliance | Per-README | `validate_document.py` |
| HVR | Per-README | `validate_document.py --json` |
| Strict-validate | Packet level | `validate.sh --strict` |
| Independent review | Sonnet eyes | Task-tool @markdown + @review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase A + B pipeline proof | Internal | Met | n/a |
| cli-devin SWE 1.6 | External binary | Met | Fall back to cli-codex for context |
| DeepSeek API for cli-opencode | External service | Met | Cannot run Pass 2 |
| sk-doc CODE template + HVR | Repo asset | Met | Cannot author |
| Sonnet @markdown + @review | Internal agents | Met | Cannot independent-verify |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any README fails sk-doc validate post-write, OR Pass 1 produces empty bundles, OR 3-check gate finds unrecoverable hallucinations, OR Pass 2 dispatch hangs > 15 min.
- **Procedure**:
  - Pass 1 fails: retry with cli-codex gpt-5.5 high
  - Gate finds hallucinations: correct bundles in place; re-run gate before Pass 2
  - Pass 2 fails: re-dispatch with tighter per-folder prompts; final fallback is main-agent direct authoring
  - Validation fails: apply `--fix --dry-run`; manual Edit if structural
- **Recovery baseline**: HEAD before this packet commits.
<!-- /ANCHOR:rollback -->
