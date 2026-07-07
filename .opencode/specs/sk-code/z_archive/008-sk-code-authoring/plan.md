---
title: "Implementation Plan: 078/001 sk-code OpenCode Authoring Recipe"
description: "Add 5 authoring checklists + spec_folder_write recipe to sk-code/assets/opencode/, restore STACK_FOLDERS contract, fix stale link, bump to v3.2.0.0, ship changelog."
trigger_phrases: ["078/001 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/008-sk-code-authoring"
    last_updated_at: "2026-05-05T17:45:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 1 implementation complete via cli-codex"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-001-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 078/001 sk-code OpenCode Authoring Recipe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

077 research surfaced that sk-code's OPENCODE scope (claimed in SKILL.md as covering skills/agents/commands/mcp-servers/spec-folders) is not backed by authoring assets — only language-level checklists ship. Phase 1 closes that gap with 5 authoring checklists + 1 spec_folder_write recipe, restores the machine-readable STACK_FOLDERS contract that regressed to inline strings, fixes a stale relative link, bumps sk-code to v3.2.0.0, and ships the v3.2.0.0 changelog. Implementation was dispatched via cli-codex (gpt-5.5/high/fast); validate.sh --strict passed cleanly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion |
|---|---|
| G1 | 5 new authoring checklists exist with 6-section canonical structure |
| G2 | 1 new recipe at `assets/opencode/recipes/spec_folder_write.md` |
| G3 | SKILL.md contains `STACK_FOLDERS = {` machine-readable dict |
| G4 | SKILL.md OpenCode resource map references all 6 new files |
| G5 | F-001-005 stale link fixed: `assets/opencode/checklists/universal_checklist.md` |
| G6 | sk-code SKILL.md frontmatter version 3.2.0.0 |
| G7 | description.json version 3.2.0.0 + 6 new keyword tokens |
| G8 | changelog/v3.2.0.0.md exists with compact-format structure |
| G9 | validate.sh --strict on 078/001 exits 0 |
| G10 | One commit on main + push origin/main success |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### 6 new content files

```
.opencode/skills/sk-code/assets/opencode/
├── checklists/
│   ├── skill_authoring.md         (NEW)
│   ├── agent_authoring.md         (NEW)
│   ├── command_authoring.md       (NEW)
│   ├── mcp_server_authoring.md    (NEW)
│   ├── spec_folder_authoring.md   (NEW)
│   ├── config_checklist.md        (existing, unchanged)
│   ├── javascript_checklist.md    (existing, unchanged)
│   ├── python_checklist.md        (existing, unchanged)
│   ├── shell_checklist.md         (existing, unchanged)
│   ├── typescript_checklist.md    (existing, unchanged)
│   └── universal_checklist.md     (existing, unchanged)
└── recipes/
    └── spec_folder_write.md       (NEW dir + file)
```

### Canonical 6-section authoring checklist structure

Each new checklist follows: PURPOSE → WHEN TO USE → PRE-CHECKS → STEPS → POST-CHECKS → RELATED RESOURCES. References sk-doc as source-of-truth for doc structure and includes ≥1 file path to a canonical example.

### STACK_FOLDERS contract restoration

A Python-style dict in SKILL.md §2 Smart Routing makes the surface contract machine-readable:

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

This pairs with the existing detection bash block (preserved unchanged) and keeps the inline string fallback for compatibility.

### Cli-codex dispatch

A single codex exec invocation handled all the writes via the standard memory-rule pattern: `codex exec --sandbox workspace-write -c service_tier="fast" -c model="gpt-5.5" -c model_reasoning_effort="high" - < /tmp/078-001-codex-prompt.md`. The prompt enumerated all 12 work items + the canonical structure for each new file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec authoring (Claude orchestrator)
- 078 parent + 4 phase children scaffolded via create.sh
- 078/001 spec.md authored with 12 REQs mapped to 077 finding IDs

### Phase 2: Implementation (cli-codex dispatch)
- Single dispatch via stdin with full prompt
- 6 files created + 3 files modified
- ~30 sec wall-clock

### Phase 3: Verification (Claude orchestrator)
- validate.sh --strict on 078/001 → exit 0
- Author plan.md, tasks.md, implementation-summary.md (this phase's docs)
- Refresh description.json + graph-metadata.json on 078/001

### Phase 4: Commit + push
- git add 078/001/ + sk-code/assets/opencode/ + sk-code/SKILL.md + sk-code/description.json + sk-code/references/opencode/shared/universal_patterns.md + sk-code/changelog/v3.2.0.0.md
- Commit + push origin main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method |
|---|---|
| File presence | `ls` on each new path |
| File structure | grep for canonical 6-section headers in checklists |
| STACK_FOLDERS contract | grep `STACK_FOLDERS\s*=\s*{` returns ≥1 hit in SKILL.md |
| Resource map updated | grep new filenames in SKILL.md |
| Stale link fixed | grep `assets/opencode/checklists/universal_checklist.md` in universal_patterns.md |
| Version bumps | grep version 3.2.0.0 in SKILL.md frontmatter + description.json |
| Changelog format | grep template heading + sections |
| validate.sh --strict | exit 0 |
| alignment-verifier | `verify_alignment_drift.py --root sk-code` exits 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Status | Note |
|---|---|---|
| sk-code v3.1.0.0 baseline | Green | Just shipped in 069 |
| sk-doc changelog template | Green | At `assets/documentation/changelog_template.md` |
| cli-codex (gpt-5.5/high/fast) | Green | All prior 077 iterations exit 0; 078/001 dispatch exit 0 |
| system-spec-kit validate.sh | Green | Used as completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Phase 1 is purely additive on the asset side; the SKILL.md surface change is a localized addition + version bump. Rollback paths:

- Per memory rule: DELETE not archive. `rm -rf 078/`, `rm -f sk-code/assets/opencode/checklists/{skill,agent,command,mcp_server,spec_folder}_authoring.md`, `rm -rf sk-code/assets/opencode/recipes/`, `git checkout -- sk-code/SKILL.md sk-code/description.json sk-code/references/opencode/shared/universal_patterns.md`
- Or surgically: revert the v3.2.0.0 commit, leaving v3.1.0.0 as latest

Stay on main; no feature branches per memory rule.
<!-- /ANCHOR:rollback -->
