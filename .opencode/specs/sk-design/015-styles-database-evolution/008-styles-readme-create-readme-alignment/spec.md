---
title: "Spec: Align the sk-design README Set to the create-readme Standard"
description: "Expand and align twelve sk-design READMEs (the styles-library folder READMEs plus the sk-design skill-root README) to the sk-doc create-readme template and quality standard. They are currently thin stubs; make each genuinely useful — purpose, contents, usage, key files, architecture fit — without touching code or bundle data."
trigger_phrases:
  - "styles readme create-readme alignment"
  - "expand sk-design readmes to sk-doc standard"
  - "sk-design readme usefulness template"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/008-styles-readme-create-readme-alignment"
    last_updated_at: "2026-07-22T11:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded spec-only folder capturing the create-readme alignment request."
    next_safe_action: "Plan (add plan.md/tasks.md), then execute — optionally via a parallel Opus agent per the operator's request."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/README.md"
      - ".opencode/skills/sk-design/styles/library/README.md"
      - ".opencode/skills/sk-doc/create-readme/assets/readme-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-008-readme-alignment-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Align the sk-design README Set to the create-readme Standard

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-styles-readme-create-readme-alignment |
| **Level** | 1 |
| **Status** | Planned |
| **Verification** | Each of the twelve READMEs conforms to the create-readme template and passes sk-doc quality review; every named file/link resolves on disk; no code or bundle data changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `007-styles-folder-readmes` packet gave every styles folder a README, but most are minimal stubs
(e.g. `styles/library/README.md` is 15 lines). They state a bare purpose but do not follow the sk-doc
**create-readme** template and are not genuinely useful — they lack a clear contents map, usage, key-file
descriptions, and architecture-fit that the standard prescribes. This packet expands and re-aligns the
twelve READMEs the operator listed so each is a useful, standard-conformant document.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope** — align + expand these twelve README files to the create-readme standard:

- `.opencode/skills/sk-design/README.md` (skill root)
- `.opencode/skills/sk-design/styles/lib/README.md`
- `.opencode/skills/sk-design/styles/lib/engine/README.md`
- `.opencode/skills/sk-design/styles/lib/database/README.md`
- `.opencode/skills/sk-design/styles/library/README.md`
- `.opencode/skills/sk-design/styles/library/bundles/README.md`
- `.opencode/skills/sk-design/styles/library/manifests/README.md`
- `.opencode/skills/sk-design/styles/scripts/README.md`
- `.opencode/skills/sk-design/styles/tests/database/README.md`
- `.opencode/skills/sk-design/styles/tests/engine/README.md`
- `.opencode/skills/sk-design/styles/tests/oracle/README.md`
- `.opencode/skills/sk-design/styles/tests/oracle/golden/README.md`

**Out of scope** — the styles manual-testing playbook and `styles/database/README.md` (owned by sibling
packet `009`); any code, test, or bundle-data content; the 1,290 per-bundle folders (data).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — Each README follows the sk-doc create-readme template (`create-readme/assets/readme-template.md`, or `readme-code-template.md` where the folder is a code module), classified through the create-readme workflow.
- **REQ-002** — Each README is genuinely useful: purpose, contents/structure map, how to use or run, key-file descriptions, and how the folder fits the styles architecture.
- **REQ-003** — Every file, path, and link named in a README resolves on disk (authored from a live listing, no fabricated files).
- **REQ-004** — No code, test, or bundle-data file is modified; only the twelve README files change.
- **REQ-005** — Each README passes sk-doc create-quality-control review (DQI / structure / link checks).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All twelve READMEs conform to the create-readme template structure.
- sk-doc quality review passes for each (no broken links, no fabricated files).
- A reader can understand each folder's purpose, contents, and usage from its README alone.
- `git diff` touches only the twelve README files — no code or data.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Describing files that do not exist | Author each README from a live `ls` of the folder |
| Over-expanding a data folder (`library/bundles`) into per-bundle docs | Keep one README explaining it is regenerated data, per the `007` precedent |
| Drift between root-skill README and styles READMEs | Classify each with create-readme; the skill root uses the skill-README shape, folders use the folder/code shape |
| Execution delegated to a parallel agent | The operator asked for a parallel Opus agent; dispatch is a planning/execution-time decision, out of this scaffold |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the sk-design skill-root README use the full skill-README shape or the lighter folder shape? (Resolve at planning via create-readme classification.)
<!-- /ANCHOR:questions -->
