---
title: "Feature Specification: Align SECURITY.md with sk-doc and expand it"
description: "SECURITY.md failed the sk-doc validator and said nothing about what Skilled runs on a user's machine. This packet aligns it with the README rule set and expands it with a reporter checklist, a threat model, safe-running guidance and the repository's own safeguards, each grounded in a file."
trigger_phrases:
  - "security policy alignment"
  - "security.md sk-doc"
  - "security threat model"
  - "running skilled safely"
  - "vulnerability reporting policy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/063-security-policy-alignment"
    last_updated_at: "2026-10-02T10:42:03Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Expanded SECURITY.md and validated it against the sk-doc README rule set"
    next_safe_action: "Operator decides the open policy choices listed in section 7"
    blockers: []
    key_files:
      - "SECURITY.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "13974574-59f7-48b5-b4cd-aa93ca9ca737"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should CI workflows under .github/ be named in scope?"
      - "Should the policy name what is not a vulnerability, such as the shipped bypassPermissions default?"
    answered_questions:
      - "The closest sk-doc standard is the README rule set, which validate_document.py already applies to SECURITY.md"
      - "The reporting channel, acknowledgement, supported-versions and scope wording stay as the operator wrote them"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Align SECURITY.md with sk-doc and expand it

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/077-security-policy-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Commit `b0f89ee5f0` (2026-10-01, `chore(repo): stop tracking vendored packet context and add a security policy`) created `SECURITY.md` as a 35-line file. That commit belonged to the `system-speckit/047-plugin-scanner-readiness` packet. The HOL plugin scanner that gates the `awesome-ai-plugins` listing scored the repository 76 with 75 high findings. Most of those came from 32,372 vendored files under `specs/**/context/`, and the repository had no vulnerability reporting policy. The commit untracked the vendored files, rebuilt the sk-doc README verdict baseline and added `SECURITY.md` to point reporters at GitHub private vulnerability reporting.

The file did that one job. It fails `validate_document.py`, which applies the README rule set and requires an overview section. It also says nothing about what Skilled runs on a user's machine: hooks on every tool call, permissive shipped permission modes, CLI dispatches with approval switched off, npm installs on first use and MCP servers fetched at launch.

### Purpose
Make `SECURITY.md` pass the sk-doc README standard and give reporters and users the repository-specific facts they need, without adding a commitment the repository does not already make.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure `SECURITY.md` to the README rule set: an OVERVIEW first, numbered uppercase H2 headings with the existing emoji style, `---` dividers and a RELATED section last.
- Expand the reporter checklist and add a map of where each in-scope surface lives.
- Add a threat model, guidance for running Skilled safely and a table of the safeguards the repository already has, each tied to a file.
- Record the history of the original commit in this packet.

### Out of Scope
- Any new policy commitment, such as a response time, a bounty, a CVE process, a supported-version change or a contact address. These are the operator's call.
- Changing the shipped defaults the document describes, such as `bypassPermissions` in `.claude/settings.json`. The document reports them and the operator decides.
- Adding `SECURITY.md` to the kebab-case exemption list in `check_no_new_snake_case.py`. It is a separate tool change.
- `CONTRIBUTING.md` and `PUBLIC-RELEASE.md`, which fail the same validator for the same reason. They were not part of the request.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `SECURITY.md` | Modify | Restructure to the README rule set and expand with grounded content |
| `specs/sk-doc/063-security-policy-alignment/` | Create | This packet |
| `specs/sk-doc/graph-metadata.json` | Modify | Track root lists the new packet, written by `create.sh` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SECURITY.md` passes the sk-doc document validator | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py SECURITY.md` exits 0 |
| REQ-002 | The policy wording the operator wrote is unchanged | `git diff b0f89ee5f0 -- SECURITY.md` removes no line except the four renumbered H2 headings and the first reporter bullet, which only gains text |
| REQ-003 | No new commitment appears | `SECURITY.md` names no response time, bounty, CVE process or contact address |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The prose follows the Human Voice Rules | `hvr_scan.py SECURITY.md` reports 0 hard blockers, and the file holds no em dash or semicolon |
| REQ-005 | Document quality does not drop | `extract_structure.py SECURITY.md` reports a DQI total of at least 86, the pre-change score |
| REQ-006 | Every factual claim is traceable | Each claim in sections 5 to 8 names a file, command or setting that exists in the repository |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py SECURITY.md` exits 0, where it exited 1 before the change.
- **SC-002**: DQI rises from 86 to at least 90, with 0 HVR hard blockers.
- **SC-003**: `validate.sh specs/sk-doc/063-security-policy-alignment --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A described default changes later, such as the Claude permission mode or an MCP entry | Med | Each claim names its file, so a reader can check it and a reviewer can spot the drift |
| Risk | The document reads as a promise | Med | Sections 2 to 5 keep the operator's wording, and the new sections describe behavior without promising any |
| Dependency | GitHub private vulnerability reporting must be enabled on the repository | High if off: the reporting instruction leads nowhere | Listed for the operator to confirm, since only the repository settings show it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `.github/workflows/` be named in scope? A workflow such as `dependabot-auto-merge.yml` holds `contents: write`, and the current scope sentence does not say whether CI counts as shipped.
- Should the policy say what is not a vulnerability, for example the shipped `bypassPermissions` default or behavior a user switched on?
- Should the acknowledgement promise a time frame? The current text promises acknowledgement only.
- Should third-party npm dependencies be named in or out of scope?
<!-- /ANCHOR:questions -->

---
