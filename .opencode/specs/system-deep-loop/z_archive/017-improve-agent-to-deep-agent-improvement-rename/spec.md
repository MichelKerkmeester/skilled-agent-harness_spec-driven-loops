---
title: "Feature Specification: Rename @improve-agent agent to @deep-agent-improvement"
description: "Rename the @improve-agent agent to @deep-agent-improvement across all 4 runtimes (.opencode, .claude, .codex, .gemini) plus ~18 active reference files. Completes the naming-family alignment started by packet 079 (skill rename sk-improve-agent → deep-agent-improvement). Pure semantic rename — no behavior change. Mirrors precedent 085/001 (prompt-improver → prompt-improver)."
trigger_phrases:
  - "087 agent rename"
  - "improve-agent to deep-agent-improvement"
  - "deep-agent-improvement agent rename"
  - "naming-family alignment agent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/017-improve-agent-to-deep-agent-improvement-rename"
    last_updated_at: "2026-05-06T15:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "spec.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files:
      - ".opencode/agents/improve-agent.md"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000087"
      session_id: "087-spec-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Does the slash command /deep:start-agent-improvement-loop rename too? (No — `agent` is a generic sub-name like /prompt, not the agent's identifier.)"
      - "Does .gemini/commands/deep/start-agent-improvement-loop.toml rename? (No — it is a Gemini slash-command file named after `/deep:start-agent-improvement-loop`, not the agent. Filename stays; content updates only.)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Rename `@improve-agent` agent to `@deep-agent-improvement`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Predecessor** | `z_archive/079-sk-deep-agent-improvement/` (skill rename, COMPLETE) |
| **Direct precedent** | `085-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename/` (sister agent rename) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 079 renamed the skill `sk-improve-agent` → `deep-agent-improvement` but kept the agent name `@improve-agent` stable per the original 070-sk-deep-rename precedent. The 079 implementation-summary §Known Limitations #5 explicitly noted: "If full naming-family alignment is desired, a follow-on packet can rename the agent." This packet is that follow-on.

The current asymmetry — skill `deep-agent-improvement` operated by agent `@improve-agent` — creates two-name cognitive load and breaks the naming-family discipline already established by sister skills (skill `deep-research` ↔ agent `@deep-research`; skill `deep-review` ↔ agent `@deep-review`). The single most-discoverable naming for the family is: skill name = agent name = the identity the user thinks about.

### Purpose

Rename the agent across all 4 runtime mirrors plus ~18 active reference files. After this packet, the family is consistent: skill `deep-agent-improvement` ↔ agent `@deep-agent-improvement` ↔ command family `/deep:*` (sub-name `agent` stays generic, parallel to `/prompt`). Pure semantic rename — no behavior change, no dispatcher contract change, no skill change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Physical agent file renames (4 runtimes):**
- `.opencode/agents/improve-agent.md` → `.opencode/agents/deep-agent-improvement.md`
- `.claude/agents/improve-agent.md` → `.claude/agents/deep-agent-improvement.md`
- `.gemini/agents/improve-agent.md` → `.gemini/agents/deep-agent-improvement.md`
- `.codex/agents/improve-agent.toml` → `.codex/agents/deep-agent-improvement.toml`

**YAML asset filename renames (2 runtimes × 2 files):**
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` → `deep_start-agent-improvement-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` → `deep_start-agent-improvement-loop_confirm.yaml`
- `.claude/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` → `deep_start-agent-improvement-loop_auto.yaml`
- `.claude/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` → `deep_start-agent-improvement-loop_confirm.yaml`

**Frontmatter rotation in renamed agent files:**
- `name: improve-agent` → `name: deep-agent-improvement` (3 .md files)
- `name = "improve-agent"` → `name = "deep-agent-improvement"` (1 .toml file)
- Description fields + body self-references that mention the agent name

**Reference rotation across active scope (~31 `@improve-agent` mentions in ~18 files):**
- Command bodies + YAML asset content: `.opencode/commands/deep/start-agent-improvement-loop.md`, `deep_start-agent-improvement-loop_auto.yaml` content, `deep_start-agent-improvement-loop_confirm.yaml` content, `.opencode/commands/README.txt`, `.claude/commands/deep/{agent.md,README.txt,assets/*.yaml}` mirrors, `.gemini/commands/deep/start-agent-improvement-loop.toml` content (filename stays — slash-command file)
- Skill `deep-agent-improvement/` docs: SKILL.md, README.md, graph-metadata.json, manual_testing_playbook (incl. 08--agent-discipline-stress-tests/), feature_catalog/, changelog/v1.4.0.0.md
- Cross-skill: `.opencode/skills/sk-doc/assets/agent_template.md`
- Root: `README.md`, `AGENTS.md` (and transitively `CLAUDE.md` symlink → AGENTS.md)
- Agent runtime READMEs: `.opencode/agents/README.txt`

### Out of Scope

- **Slash command `/deep:start-agent-improvement-loop` rename.** The sub-name `agent` is generic ("improve an agent surface"), not the agent's identifier; mirrors `/prompt` family pattern. The command and its file (`.opencode/commands/deep/start-agent-improvement-loop.md` → filename stays; only body content updates) keep their names.
- **`.gemini/commands/deep/start-agent-improvement-loop.toml` filename rename.** This file is the Gemini definition for the slash command `/deep:start-agent-improvement-loop` (Gemini convention names slash-command files using flat hyphenated form). The filename stays; only body content updates.
- **Specs/ historical research artifacts.** ~189 references to `@improve-agent` exist in `specs/z_archive/059-*`, `060-*`, `070-*`, `079-*`, `042-*` packets. These are research record and stay verbatim.
- **`barter/coder/` external repo.** Mirrored copies live in `barter/coder/.opencode/agents/improve-agent.md` and related paths. Barter handles its own propagation.
- **Skill folder rename or skill_id change.** Already done in packet 079.

### Files to Change

| Category | Files | Refs | Action |
|---|---|---|---|
| Runtime agent definitions | 4 | 10 | `git mv` + frontmatter `name:` update + body refs |
| YAML asset files | 4 | 8 | `git mv` filename + content refs |
| Command bodies | 5 | ~10 | sed `@improve-agent` → `@deep-agent-improvement`; update YAML filename refs in agent.md and README.txt |
| Skill `deep-agent-improvement/` docs | ~13 | ~22 | sed across SKILL.md, README.md, graph-metadata.json, manual_testing_playbook, feature_catalog, changelog |
| Cross-skill | 1 | 1 | sk-doc/assets/agent_template.md |
| Root governance | 2 | 2 | AGENTS.md (line 324), README.md (line 1097) |
| Runtime agent READMEs | 1+ | 1+ | .opencode/agents/README.txt |
| **Active total** | **~30 files** | **~54 active refs + 8 file renames** | |
| Out-of-scope (historical) | ~78 z_archive files | ~189 refs | UNCHANGED |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 4 agent files renamed via `git mv` | `ls .opencode/agents/deep-agent-improvement.md`, `.claude/agents/deep-agent-improvement.md`, `.gemini/agents/deep-agent-improvement.md`, `.codex/agents/deep-agent-improvement.toml` all succeed; old paths return ENOENT |
| REQ-002 | 4 agent frontmatter `name:` fields updated | `grep -n '^name:' .opencode/agents/deep-agent-improvement.md` returns `name: deep-agent-improvement`; ditto for `.claude/`, `.gemini/`; `name = "deep-agent-improvement"` for `.codex/.toml` |
| REQ-003 | 4 YAML asset files renamed via `git mv` | `deep_start-agent-improvement-loop_{auto,confirm}.yaml` exist in both `.opencode/commands/deep/assets/` and `.claude/commands/deep/assets/`; old `deep_start-agent-improvement-loop_*.yaml` filenames absent |
| REQ-004 | YAML asset internal `@improve-agent` content + agent.md filename refs updated atomically with the rename | After rename, `agent.md` references the new YAML filenames; content of YAML files references `@deep-agent-improvement`; `/deep:start-agent-improvement-loop` command can resolve YAML path |
| REQ-005 | All `@improve-agent` references in active code migrated | `rg -F '@improve-agent' .opencode .claude .gemini .codex AGENTS.md README.md \| grep -v '/specs/' \| grep -v '/z_archive/' \| grep -v '/barter/'` returns 0 hits |
| REQ-006 | All `name: improve-agent` and `name = "improve-agent"` references in active scope cleared | `rg -F 'name: improve-agent'` and `rg -F 'name = "improve-agent"'` in active scope return 0 hits |
| REQ-007 | Strict spec validation passes | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename --strict` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | New changelog entry authored documenting the rename | `.opencode/skills/deep-agent-improvement/changelog/v1.5.0.0.md` (or next-up version) exists, cites 079 + 085/001 precedents, lists migration notes |
| REQ-009 | Root docs (AGENTS.md, README.md) updated | `grep -n 'sk-improve-agent\|@improve-agent' AGENTS.md README.md` returns 0 hits |
| REQ-010 | Implementation summary authored with verification evidence | `implementation-summary.md` cites concrete commit SHAs, verification command outputs, and any deferrals |
| REQ-011 | Continuity saved to canonical surface | `/memory:save` executed → continuity canonical at packet root |
| REQ-012 | Branch hygiene confirmed | Working state at end is on `main`; no surviving auto-created packet branch |

### P2 - Optional (defer with reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Update z_archive/079-sk-deep-agent-improvement/ implementation-summary §Limitations #5 to reference 087 as the follow-on | Cross-link added; can be deferred (historical record |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -F '@improve-agent' .opencode .claude .gemini .codex AGENTS.md README.md | grep -v specs/ | grep -v z_archive/ | grep -v barter/` returns **0**.
- **SC-002**: `rg -F 'name: improve-agent'` and `rg -F 'name = "improve-agent"'` in active scope return **0**.
- **SC-003**: All 4 agent files exist at new paths; old paths absent.
- **SC-004**: All 4 YAML asset files exist at new filenames; old filenames absent.
- **SC-005**: Skill advisor `recommend({prompt: "improve agent loop"})` still returns `deep-agent-improvement` top hit (no scoring regression).
- **SC-006**: `/deep:start-agent-improvement-loop` script-level smoke (`scan-integration.cjs --agent <sandbox>`) exits 0 against the renamed sandbox agent.
- **SC-007**: Naming-family complete: skill `deep-agent-improvement` ↔ agent `@deep-agent-improvement` ↔ command `/deep:start-agent-improvement-loop`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bare `improve-agent` matches YAML filename token (e.g., `deep_start-agent-improvement-loop_auto.yaml`) | High | Use `@improve-agent` (with `@` prefix) for in-prose substitution; YAML filenames handled via explicit `git mv` |
| Risk | YAML filename rename creates transient broken state if `agent.md` not updated atomically | Medium | Update `agent.md` body filename refs in same commit/wave as `git mv` |
| Risk | `.gemini/commands/deep/start-agent-improvement-loop.toml` confusion (slash-command file vs agent file) | Low | Filename stays (it's the slash-command file); only content updates |
| Risk | Deferred 079 P1 findings still pending (resource-map.md inaccuracies, YAML path-injection, completion-claim) | Low | These are 079 advisories, not 087 blockers; document cross-reference in implementation-summary |
| Dependency | Packet 079 skill rename complete | Green | Verified — `.opencode/skills/deep-agent-improvement/` exists, advisor returns it as top hit |
| Dependency | 085/001 prompt-improver rename precedent for shape | Green | Provides direct shape template for this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No latency change. Symbolic rename only.

### Security
- **NFR-S01**: No new attack surface. Symbolic identifier replacement only.

### Reliability
- **NFR-R01**: Zero behavior regression — verified by smoke + advisor recommendation parity.
- **NFR-R02**: Reversibility — `git revert` of rename commits restores prior state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Reference shapes
- `@improve-agent` (with @): unambiguous agent reference. **Always update.**
- `name: improve-agent` (frontmatter): agent identity field. **Always update.**
- `improve-agent.md` / `improve-agent.toml`: agent file path. **Rename via git mv.**
- `deep_start-agent-improvement-loop_auto.yaml`: YAML asset filename pattern `improve_<TARGET>_<MODE>.yaml`. **Rename via git mv.**
- `/deep:start-agent-improvement-loop`: slash command. **Stays unchanged.**
- `.gemini/commands/deep/start-agent-improvement-loop.toml`: Gemini slash-command file (named after `/deep:start-agent-improvement-loop`). **Filename stays; content updates.**
- `cp-improve-target.md` (test fixture): different agent. **Not renamed.**
- `improve-agent` in z_archive/specs: historical record. **Not renamed.**

### Atomic ordering
- YAML asset filename rename must be coordinated with `agent.md` body update (which references the YAML by name) so the command stays resolvable throughout. Either: (a) update agent.md filename refs first, then `git mv` YAML, or (b) do both in the same commit.

### Mirrors
- 4 agent runtime mirrors stay in lock-step. Don't update one without the others.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~30 active files, ~54 refs + 8 file renames |
| Risk | 8/25 | Symbolic rename; YAML filename atomicity is the main load-bearing concern |
| Research | 6/20 | Fully scoped via 085/001 precedent + 079 predecessor |
| **Total** | **26/70** | **Level 2 confirmed** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at spec authoring time. All naming decisions resolved via 079 + 085/001 precedents.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Resource Map**: `resource-map.md`
- **Predecessor**: `.opencode/specs/deep-loops/z_archive/014-sk-deep-agent-improvement/` (skill rename, complete)
- **Direct precedent**: `.opencode/specs/skilled-agent-orchestration/z_archive/071-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename/`
