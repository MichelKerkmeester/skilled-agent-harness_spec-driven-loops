---
title: "Spec: Command Template Conformance"
description: "Audit .opencode/commands/{design,rewrite,prompt} against the sk-doc/sk-create-command contract and fix the confirmed defects: a missing mandatory input gate and a missing allowed-tools declaration."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "command template conformance"
  - "sk-create-command audit"
  - "mandatory input gate missing"
  - "allowed-tools missing command"
importance_tier: "high"
contextType: "spec"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/035-command-template-conformance"
    last_updated_at: "2026-08-29T09:43:41Z"
    last_updated_by: "claude"
    recent_action: "Added mandatory input gate to design/extract.md; allowed-tools to rewrite/response.md"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/commands/design/extract.md"
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/prompt/improve.md"
      - ".opencode/commands/rewrite/explain-visually.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:213a659696166959937bbe57f9181ff67b737995ffbc1dd7758ad74cfeae755a"
      session_id: "2026-08-29-sk-code-029"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Command Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-command-template-conformance |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`.opencode/commands/{design,rewrite,prompt}` are slash commands governed by the `sk-doc/sk-create-command` contract, which specifies a required frontmatter shape and, for router-style commands, a mandatory blocking input gate whenever `argument-hint` declares a required `<argument>`. Drift from that contract is easy to introduce silently: a command can look complete while missing the gate that stops it from inferring a required input instead of asking for it, or missing the `allowed-tools` declaration that should scope its tool access.

`.opencode/commands/` is the single real copy; `.claude/commands/` and `.cursor/commands/` are symlinks into it, so one edit lands in all three runtimes at once, and one drifted command is drifted everywhere. The purpose was to audit every real command file in this scope against the contract and fix any confirmed defect, rather than assume conformance.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the 5 real command files under `.opencode/commands/{design,rewrite,prompt}` — `design/extract.md`, `prompt/improve.md`, and the three `rewrite/*.md` commands (`explain-visually.md`, `response-by-external-agent.md`, `response.md`) — checked against `sk-doc/sk-create-command`'s mandatory-gate rule (Step 7) and its `allowed-tools` least-privilege expectation.

Out of scope: `.codex`, `.pi`, and `.devin`, which have no commands directory in this scope; any command outside `{design,rewrite,prompt}`; changing the non-router `rewrite/*` commands' section vocabulary, since `sk-create-command` Step 8 does not mandate a fixed vocabulary for non-routers.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Every command whose `argument-hint` declares a required `<argument>` has a mandatory input gate immediately after its frontmatter, per `sk-create-command` Step 7.
- **REQ-002 [P2]** Every command declares an `allowed-tools` key scoped to what it actually needs, rather than inheriting an unrestricted tool set by omission.
- **REQ-003 [P2]** A command family's section vocabulary is checked against `sk-create-command`'s actual requirement for its command type (router vs. non-router) before being treated as a defect.
- **REQ-004 [P1]** Every fix is verified visible through all three runtime paths this scope's commands are reachable from: `.opencode`, `.claude`, `.cursor`.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `design/extract.md` has a mandatory input gate binding `live_url`, `output_dir`, and `execution_mode`, matching the shape used by its sibling router `prompt/improve.md`.
- **SC-002** `rewrite/response.md` declares `allowed-tools: Read`, matching its two siblings' pattern of declaring a scoped tool set.
- **SC-003** Both fixes are confirmed reachable through `.opencode/commands/`, `.claude/commands/`, and `.cursor/commands/` after the edit, since the latter two are symlinks into the former.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False-positive defects.** Mitigated by checking each finding against the actual contract text before fixing it: the shifted section numbering in `design/extract.md` and the non-router vocabulary in the three `rewrite/*` commands were both checked and found to be contract-conformant, not defects, and were left unchanged.
- **Symlink fan-out.** `.claude/commands/` and `.cursor/commands/` are symlinks into `.opencode/commands/`, so an edit to the one real file is the only edit needed; verification still needs to confirm the change is visible through all three paths, since a broken symlink would silently strand two runtimes.
- **Dependencies.** `sk-doc/sk-create-command`'s contract as source of truth; no new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The two fixes were confirmed defects against the written contract; the two checked-and-rejected findings (section numbering, non-router vocabulary) were confirmed conformant against the same contract, not assumed.

<!-- /ANCHOR:questions -->
