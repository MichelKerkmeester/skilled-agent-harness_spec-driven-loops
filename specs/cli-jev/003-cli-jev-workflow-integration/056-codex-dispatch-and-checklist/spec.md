---
title: "Feature Specification: Phase 56: codex-dispatch-and-checklist"
description: "Phase 55 left Codex task dispatch unverified and the sk-code-opencode JavaScript checklist at odds with its style guide. Probing Codex 0.160 for the first also showed that its shell tool is now named Bash, so every repo Codex hook keyed to exec had stopped firing."
trigger_phrases:
  - "codex task dispatch payload"
  - "codex bash tool rename"
  - "codex exec matcher"
  - "javascript checklist module header"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 56: codex-dispatch-and-checklist

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 56 of 57 |
| **Predecessor** | 055-alignment-and-hook-parity |
| **Successor** | 057-changelog-and-readme-refresh |
| **Handoff Criteria** | Codex task dispatch carries a probed verdict, every Codex shell hook fires under 0.160, and the JavaScript checklist matches its style guide |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 56** of the cli-jev workflow integration packet. Phase 55 closed with two follow-ups: capture the Codex `spawn_agent` hook payload before deciding on a task-dispatch adapter, and amend the sk-code-opencode JavaScript checklist so its header rule matches the style guide.

**Scope Boundary**: The Codex hook adapters and their registry matchers, the coverage docs for Codex, and the two sk-code-opencode checklists. No guard changes what it checks.

**Dependencies**:
- Phase 55, which wrote the coverage matrix and rationale this phase corrects
- The installed codex-cli 0.160, probed with a throwaway `CODEX_HOME`

**Deliverables**:
- A probed verdict for Codex task dispatch in the matrix, rationale and task-dispatch README
- Codex shell matchers and adapters that accept both `exec` and `Bash`
- A JavaScript checklist header rule that matches the style guide

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Codex task dispatch was marked `unverified` because its `spawn_agent` hook payload had never been read. The live probe that read it also showed that Codex 0.160 names its shell tool `Bash`, and a matcher of `exec` no longer fires, so dispatch lint, dispatch audit, git preflight, the git message gate and spec-gate enforce on shell had all stopped running under Codex. Separately, the JavaScript checklist demanded a `╔═╗` box header that the style guide forbids in new files, and claimed no shipped file used the COMPONENT/PURPOSE header that several OpenCode plugins carry.

### Purpose
Codex runs every repo shell hook again, its task-dispatch cell states what a probe proved, and an author following the JavaScript checklist writes the header the style guide asks for.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A live capture of the Codex `spawn_agent` PreToolUse payload and a verdict from it
- Codex shell matchers `exec|Bash` and `exec|Bash|apply_patch|edit`, and adapters that accept both names and both PostToolUse response shapes
- Tests for the `Bash` path through spec-gate enforce, dispatch lint and dispatch audit
- The coverage matrix, rationale, task-dispatch README and cli-codex hook contract
- The JavaScript and universal checklist header lines

### Out of Scope
- A Codex task-dispatch adapter: the payload carries the spawn message encrypted
- Approving the changed Codex hook entries: Codex stores approvals in the operator's own `~/.codex/config.toml`
- Rewriting existing files that carry the older headers: the style guide keeps them until each file is next rewritten

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/codex/*.mjs` | Modify and create | Accept `Bash` and the string response, new test |
| `runtime/hooks/codex/spec-gate-enforce.mjs` and its test | Modify | Map `Bash` to the shell tool, new test |
| `sk-git/scripts/hooks/git-{preflight-advisory,message-gate}.mjs` | Modify | Comments name the new tool |
| `runtime-mirrors/hook-registry.json`, `.codex/hooks.json` | Modify and regenerate | Codex shell matchers |
| Hook coverage docs and the cli-codex hook contract | Modify | Codex verdict, rename and hook trust |
| `sk-code-opencode/assets/checklists/{javascript,universal}-checklist.md` | Modify | Header rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Codex task dispatch carries a verdict backed by a captured hook payload |
| REQ-002 | Every repo Codex hook bound to the shell tool fires under both `exec` and `Bash` |
| REQ-003 | Every suite passes, and the registration and mirror syncs pass their checks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The JavaScript checklist requires the style guide's `MODULE:` header and makes no false claim about shipped files |
| REQ-005 | The Codex docs record the `Bash` rename and the hook-trust step an operator needs after a matcher change |
| REQ-006 | Changed code passes the sk-code-opencode alignment verifier |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A flagged dispatch sent through a `Bash` payload is linted and audited the same as one sent through `exec`.
- **SC-002**: No coverage doc calls Codex task dispatch `unverified`.
- **SC-003**: The JavaScript checklist and style guide show the same header template.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A matcher change alters the hook's trust hash | Codex skips the changed hooks until approved | Record the `/hooks` approval step in the hook contract and the handoff |
| Risk | An older Codex still sends `exec` with `{stdout, stderr}` | The adapters miss older builds | Both names and both shapes stay accepted, each with a test |
| Dependency | codex-cli 0.160 | The probe cannot run | A throwaway `CODEX_HOME` and `--dangerously-bypass-hook-trust` keep the probe off the operator's config |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A non-shell tool call still exits at the first tool-name check.

### Security
- **NFR-S01**: The probe never writes the operator's `~/.codex` config or hooks file.

### Reliability
- **NFR-R01**: Every adapter still fails open on a missing or malformed payload.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An empty string response falls back to the `{stdout, stderr}` reading, which yields nothing.

### Error Scenarios
- An unknown tool name, including `apply_patch` for the dispatch adapters, approves with no output.

### State Transitions
- A hook entry with no approval is skipped by Codex. A changed matcher likely needs approving again, since each approval is stored as a hash.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | About 18 files |
| Risk | 8/25 | Live hook matchers on one runtime |
| Research | 10/20 | Codex payloads read only by live probe |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
