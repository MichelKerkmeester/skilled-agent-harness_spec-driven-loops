---
title: "Feature Specification: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides"
description: "The always-loaded AGENTS.md, the 13 repo rules and the sk-prompt skill were written before the current Anthropic and OpenAI prompting guides, and GPT-6 is documented as more sensitive to instructions in exactly these files. This packet checks all three surfaces against the guides through three independent model lenses and applies what survives verification."
trigger_phrases:
  - "vendor prompting guide alignment"
  - "claude prompting best practices"
  - "gpt-6 prompting guide"
  - "agents.md prompting audit"
  - "over-prompting emphatic caps"
  - "gpt-6 luna devin roster"
  - "three lens prompting review"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/067-prompting-guide-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository's instruction surfaces predate the current vendor prompting guides. Anthropic's Claude prompting best practices and its per-model pages for Opus 5.5, Opus 5 and Fable 5.1 say that aggressive wording such as "CRITICAL: You MUST" now causes over-triggering. OpenAI's "Using GPT-6" page says GPT-6 is more sensitive to instructions in skills and in files such as `AGENTS.md`, and it recommends auditing them for conflicting guidance. `AGENTS.md` opens with "CRITICAL RULES" and "MANDATORY GATES", and the prompt-improver agent carries CRITICAL, MANDATORY and NEVER in capitals. `sk-prompt` has had no Claude or GPT guidance since its v3.0.0.0 flattening. No repo rule covers emphatic wording, positive versus negative framing, or parallel tool calls.

The operator wants three independent opinions: Opus 5.5 in this session, GPT-6 Luna max-fast through cli-devin, and MiMo v2.6 pro high through cli-pi's LLM Gateway. GPT-6 Luna is live in `devin models list` but missing from the cli-devin roster, so the fan-out runtime rejects it.

### Purpose
Each finding in the vendor guides that the repository does not already honor is either applied to the surface that owns it or recorded as rejected with its reason, and GPT-6 Luna max-fast can be dispatched through cli-devin's runtime.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `gpt-6-luna-max` and `gpt-6-luna-max-priority` to the cli-devin roster in code, test and docs. This mirrors the existing GPT-5.6 Luna pair.
- Restore the one missing comma at `.pi/models.json:13` in the main checkout, so that `llmgateway/mimo-v2.6-pro` loads. The global `~/.pi/agent/models.json` is a symlink to that file.
- Build three blind lenses over `AGENTS.md`, `REPO RULES.md` plus `.skilled/repo-rules/*.md`, and `sk-prompt` plus the prompt-improver agent. Each is judged against five vendor pages fetched 2026-09-24.
- Write a synthesis with every repeated citation opened and every lens disagreement explained.
- Apply every finding that survives verification, as the operator chose autonomous apply. Rejected findings go to a "considered and rejected" list with their reason.

### Out of Scope
- Other cli-devin tiers (`gpt-6-luna-high`, `-xhigh` and the rest), because the request named max-fast only.
- Fixing the cli-devin doc contradictions on the default permission mode and default model. These are reported as adjacent defects.
- The other session's changes in the main checkout (`CLAUDE.md` deletion, `create-without-build.vitest.ts`, the rest of the `.pi/models.json` edit), because they are not this packet's work.
- Committing vendor page text, since the repository is published on GitHub. Snapshots live in `scratch/sources/` and are deleted at closeout.
- Commit, push or merge, because the operator has not asked for any.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Add the two GPT-6 Luna ids to `DEVIN_SUPPORTED_MODELS` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Add the same ids to the hand-copied devin allowlist |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Add the ids to the hardcoded expected roster |
| `.skilled/skills/cli-external-orchestration/cli-devin/{SKILL.md,README.md,references/*.md}` | Modify | List the new ids where the GPT-5.6 Luna pair is listed |
| `.hermes/skills/cli-devin/SKILL.md` | Regenerate | Generated mirror, rebuilt by `sync-skills-hermes.cjs` |
| `AGENTS.md`, `.codex/AGENTS.md` | Modify | Only the edits the synthesis accepts |
| `REPO RULES.md`, `.skilled/repo-rules/*.md` | Modify | Only the edits the synthesis accepts |
| `.skilled/skills/sk-prompt/**`, `.skilled/agents/prompt-improver.md` and its runtime copies | Modify | Only the edits the synthesis accepts |
| `.pi/models.json` (main checkout) | Modify | One comma, restoring valid JSON |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The devin roster in `executor-config.ts`, `fanout-run.cjs` and the fan-out test accepts `gpt-6-luna-max` and `gpt-6-luna-max-priority`, and the fan-out and combo-matrix suites pass. |
| REQ-002 | Seven lens outputs exist: one from Opus, three from Luna and three from MiMo. Each is read-only, and none of the delegate briefs contains the Opus hypotheses. |
| REQ-003 | `research/synthesis.md` ranks findings with vendor evidence and a repo `file:line` for each, and every citation it repeats was opened. |
| REQ-004 | Every accepted finding is applied to its owning surface, and every rejected one is listed with its reason. |
| REQ-005 | No vendor page text is committed or left in the packet at closeout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The cli-devin docs and the generated Hermes mirror list the new ids. |
| REQ-007 | Every edited instruction file with a runtime copy (`.codex/AGENTS.md`, the prompt-improver copies) carries the same change. |
| REQ-008 | Adjacent defects found during the work are reported, not fixed. |
| REQ-009 | The MiMo route loads after a one-comma change, and the main checkout carries no other change from this packet. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A cli-devin dispatch on `gpt-6-luna-max-priority` returns output, and the fan-out suite reports every test passing.
- **SC-002**: Every finding in the synthesis ends as applied, with a diff, or rejected, with a reason. None is left open.
- **SC-003**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway credential for MiMo | No MiMo lens | Record the failed dispatch as the finding and synthesize from two lenses, saying so |
| Dependency | Devin account access to GPT-6 Luna | No Luna lens | Smoke dispatch before the real briefs |
| Risk | AGENTS.md edits change behavior for every session on every runtime | High | Surgical edits only, each tied to vendor evidence and a repo gap; the hard blockers stay intact |
| Risk | Softening emphatic wording weakens a real hard blocker | Med | A gate that must never be skipped keeps its force; only emphasis that adds nothing is removed |
| Risk | Delegates drift into writing | Med | Read-only tool modes plus a `git status` diff before and after each dispatch |
| Risk | Another session edits the main checkout concurrently | Med | All work happens in the worktree; the main checkout gets exactly one comma |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The always-loaded `AGENTS.md` does not grow by more than 10 lines net. Detail belongs in the rule tier, per the precedent set by the bloat audit in `specs/agents/004`.

### Security
- **NFR-S01**: No credential, API key or gateway token appears in any packet file, brief or captured log.

### Reliability
- **NFR-R01**: Every change to a rule or instruction file keeps that file passing the sk-doc validator it passed before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A delegate returns an empty file or only a preamble. The output is treated as a failed lens, re-dispatched once with the brief corrected, then recorded.
- A delegate cites a `file:line` that does not resolve. The finding is dropped from the synthesis, and the fabrication is noted against that lens.

### Error Scenarios
- `--permission-mode auto` blocks devin's file reads. Fall back to `dangerous` with a read-only instruction and a before/after `git status` diff.
- The gateway rejects MiMo (credit, capacity). Retry once, then record it and proceed with two delegate lenses.

### State Transitions
- The lenses disagree. The synthesis finds out whether the question was underspecified or the evidence thin, and never averages them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 16 files across code, docs, rules and one root instruction file |
| Risk | 14/25 | `AGENTS.md` is loaded by every session on seven runtimes; the roster is shared runtime |
| Research | 14/20 | Five vendor pages and three independent model lenses |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The operator settled the Luna generation (GPT-6), the MiMo unblock (restore the comma), the apply scope (autonomous) and the workspace (a worktree) on 2026-09-24.
<!-- /ANCHOR:questions -->

---
