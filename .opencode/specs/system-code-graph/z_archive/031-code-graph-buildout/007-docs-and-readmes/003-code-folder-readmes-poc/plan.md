---
title: "Plan: Phase A 3-folder README PoC"
description: "Two-pass pipeline plan: cli-devin SWE 1.6 produces per-folder context bundles, cli-opencode deepseek-v4-pro writes sk-doc-aligned READMEs."
trigger_phrases:
  - "035 plan"
  - "phase A plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/003-code-folder-readmes-poc"
    last_updated_at: "2026-05-15T08:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote plan for Phase A 2-pass pipeline"
    next_safe_action: "Dispatch Pass 1"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:00057af9762658e60d366342ce6e2571919d50181b379a237fd521a6f6d9b95a"
      session_id: "035-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase A README PoC

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; sk-doc CODE template; cli-devin + cli-opencode shell orchestration |
| **Framework** | sk-doc validation pipeline (`validate_document.py`, `audit_readmes.py`) |
| **Storage** | n/a (config + docs only) |
| **Testing** | Per-file sk-doc validate + strict-validate on packet |

### Overview

Three code folders under `system-code-graph/mcp_server/` (root, core, plugin_bridges) currently lack READMEs. Phase A uses a two-pass pipeline:

1. **Pass 1 (cli-devin SWE 1.6)**: One Devin session reads each folder's source files and emits a structured JSON context bundle per folder. Bundles persist under `research/context-bundles/`.
2. **Pass 2 (cli-opencode deepseek-v4-pro)**: One opencode session consumes the 3 bundles + sk-doc CODE template + HVR rules + 2 exemplar READMEs, writes 3 sk-doc-aligned `README.md` files.
3. **Pass 3 (validation)**: `validate_document.py` per README, then strict-validate on the packet.

This is the proof-of-concept for Phases B (9 folders), C (56 folders), and D (root README realignment, different writer).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] cli-devin installed + authenticated (`devin auth status` returns "Logged in")
- [x] cli-opencode + DeepSeek API key configured (proven working this session)
- [x] sk-doc CODE template located at `.opencode/skills/sk-doc/assets/readme/readme_code_template.md`
- [x] HVR rules located at `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- [x] 2 exemplar READMEs identified: `system-spec-kit/mcp_server/README.md` (full scaffold), `system-spec-kit/mcp_server/utils/README.md` (compact variant)

### Definition of Done
- [ ] 3 new `README.md` files created
- [ ] Each passes `validate_document.py --type readme` exit 0
- [ ] Each has 4 mandatory anchors + YAML frontmatter
- [ ] Each has HVR score ≥ 85
- [ ] 3 context bundles persisted in `research/context-bundles/`
- [ ] Packet strict-validate exits 0
- [ ] Commit on `main` references this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-pass externalized pipeline: model-A produces machine-readable context, model-B consumes context plus template to produce final markdown. Validation happens between Pass 2 and commit.

### Key Components

- **Pass 1 dispatcher**: cli-devin orchestrator skill at `.opencode/skills/cli-devin/`. Dispatch shape: `devin --prompt-file /tmp/devin-035-pass1.md --model swe-1.6 --permission-mode normal --config $HOME/.config/devin/config.json </dev/null > /tmp/devin-035-pass1.log 2>&1 &`
- **Pass 2 dispatcher**: cli-opencode orchestrator skill at `.opencode/skills/cli-opencode/`. Dispatch shape: `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dir <repo> --dangerously-skip-permissions "$(cat /tmp/opencode-035-pass2.md)" </dev/null > /tmp/opencode-035-pass2.log 2>&1 &`
- **Context bundle schema**: JSON per folder with keys `folder_path`, `file_inventory` (by extension), `public_exports`, `internal_imports`, `external_imports`, `architecture_observation`, `entrypoints`, `validation_commands`, `integration_notes`
- **README template authority**: `readme_code_template.md` is the single source of truth — Pass 2 must match its section structure and anchor IDs
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet scaffold
- [x] Create spec, plan, tasks, checklist, implementation-summary, description.json, graph-metadata.json
- [x] Create resource-map enumerating 3 target folders + their existing state
- [x] Create empty `research/context-bundles/` directory

### Phase 2: Pass 1 — cli-devin context gathering
- [ ] Compose prompt at `/tmp/devin-035-pass1.md` covering all 3 folders + per-folder JSON schema
- [ ] Dispatch `devin --prompt-file ...` with SWE 1.6, permission-mode normal, redirected stdin
- [ ] Verify 3 bundle JSON files land in `research/context-bundles/`
- [ ] Validate each bundle's structure (required keys present, file_inventory non-empty)

### Phase 3: Pass 2 — cli-opencode markdown writing
- [ ] Compose prompt at `/tmp/opencode-035-pass2.md` referencing bundles + sk-doc CODE template + 2 exemplars + HVR rules
- [ ] Dispatch `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general ...`
- [ ] Verify 3 README.md files written in target folders

### Phase 4: Validation
- [ ] `validate_document.py` per README — all 3 exit 0
- [ ] `audit_readmes.py` over system-code-graph — 0 blocking errors
- [ ] Strict-validate on this packet — exit 0
- [ ] Fill in implementation-summary.md with actual results

### Phase 5: Commit
- [ ] Stage only files in scope (3 new READMEs + this packet)
- [ ] Commit on `main` with message `feat(007/035): sk-doc-aligned READMEs for system-code-graph 3 code folders`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Bundle JSON keys present | Python json + key-presence check |
| Anchor presence | 4 mandatory anchors per README | grep |
| Frontmatter validity | YAML parses + required keys | Python PyYAML or sk-doc validator |
| sk-doc compliance | Per-README | `validate_document.py --type readme` |
| HVR | Per-README | `validate_document.py --json` → check `hvr_score >= 85` |
| Strict-validate | Packet level | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin v2026.5.6+ | External binary | Met | Cannot run Pass 1; fall back to cli-codex gpt-5.5 high |
| Devin SWE 1.6 model | External service | Met | Same — fallback to cli-codex |
| DeepSeek API key for cli-opencode | External service | Met | Cannot run Pass 2 |
| sk-doc CODE template | Repo asset | Met | Cannot author |
| HVR rules | Repo asset | Met | Cannot author with voice gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of the 3 READMEs fails sk-doc validate post-write, OR Pass 1 produces empty bundles, OR Pass 2 dispatch hangs >10 min.
- **Procedure**:
  - If Pass 1 fails: retry with cli-codex gpt-5.5 high using the same prompt structure
  - If Pass 2 fails: re-dispatch with a tighter per-folder prompt; if still fails, fall back to main-agent direct authoring
  - If validation fails: apply `--fix --dry-run` suggestions then re-validate; if structural fix needed, manual Edit
- **Recovery baseline**: HEAD before this phase commits. Worst case `git restore` the 3 unwanted READMEs.
<!-- /ANCHOR:rollback -->
