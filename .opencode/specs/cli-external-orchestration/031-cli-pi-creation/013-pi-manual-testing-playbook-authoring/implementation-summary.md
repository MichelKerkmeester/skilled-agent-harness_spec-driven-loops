---
title: "Implementation Summary: Pi manual-testing playbook authoring"
description: "Authored the real cli-pi manual-testing-playbook (root file + 19 PI-NNN scenarios across 8 categories), mirroring cli-cursor's structure; 9 scenarios live-executed against phase 012's real artifacts; GLM-5.2 independently spot-checked evidence against the repo and returned APPROVE WITH MINOR NOTES, all 3 wording findings fixed."
trigger_phrases:
  - "pi manual testing playbook authoring summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/013-pi-manual-testing-playbook-authoring"
    last_updated_at: "2026-07-27T17:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "Playbook authored, live-verified, GLM reviewed, findings fixed, closed Complete"
    next_safe_action: "None -- this is the terminal phase; run the final packet-wide report"
    blockers: []
    key_files: ["manual-testing-playbook.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["19 PI-NNN scenarios across 8 categories authored, all 20 files (root + 19) independently re-validated by me, 0 issues.", "9 scenarios live-executed with real captured evidence, not inferred.", "GLM-5.2 independently spot-checked 11 distinct claims against the live repo state (file counts, grep hits, source-line matches) and confirmed every one -- APPROVE WITH MINOR NOTES, 0 blocking, 3 wording findings fixed."]
---
# Implementation Summary: Pi manual-testing playbook authoring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-pi-manual-testing-playbook-authoring |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is the terminal phase of `031-cli-pi-creation`. It authored the actual `cli-pi` manual-testing-playbook — a root file plus 19 `PI-NNN` scenario files across 8 categories — that phase 010 planned in full (its own `spec.md` §9 coverage table) but explicitly deferred authoring, and that this session's operator explicitly asked for. `cli-pi/manual-testing-playbook/` previously contained only a `.gitkeep`.

### Structure

The root file mirrors `cli-cursor/manual-testing-playbook/manual-testing-playbook.md`'s exact 17-section shape (frontmatter → H1 → EXECUTION POLICY banner → SELF-INVOCATION GUARD banner → canonical-artifacts list → 6 shared sections → 8 category sections → 2 cross-reference sections), with one deliberate, disclosed addition: a "Current Execution Boundaries" section (§15) explaining why roughly 12 of the 19 scenarios are `SKIP`-heavy on this specific machine (no provider API key configured — the same limitation phase 001 first documented, carried consistently through every phase in this packet). GLM-5.2's independent review specifically endorsed this addition as "load-bearing... the kind of context that prevents the SKIP-heavy pattern from reading as a cop-out," not padding.

Each of the 19 scenario files follows the same 5-section canonical contract as the sibling playbooks (`OVERVIEW` → `SCENARIO CONTRACT` → `TEST EXECUTION` → `SOURCE FILES` → `SOURCE METADATA`), executes phase 010's own `PI-001`..`PI-019` coverage table verbatim (no redesign), and uses strict `PASS`/`FAIL`/`SKIP` verdict discipline — never `UNAUTOMATABLE`/`PARTIAL`.

### Live execution against phase 012's real artifacts

9 scenarios were live-executed with real, captured evidence rather than left docs-grounded: `PI-001` (`pi --version` → `0.82.1`), `PI-007` (36 `.pi/prompts/*.md` counted, live session exit clean), `PI-008` (real `$ARGUMENTS` token usage confirmed in a generated prompt file), `PI-009` (`sync-agents-pi.cjs --check` PASS, 13 files), `PI-011`/`PI-012` (cite phase 007's own real, already-captured MCP-connection findings), `PI-014`/`PI-015` (live session loaded all 7 extensions without a startup error), and `PI-017` (a real `grep` of `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`, confirming no `"auto"` default).

### A real, disclosed title/behavior mismatch (PI-016)

`PI-016`'s originally-planned title said "fail-closed verification," but phase 012's actual, GLM-reviewed implementation is deliberately **fail-open** (a guard-core exception must never accidentally block valid work). The scenario file tests the real, built behavior and explicitly documents the title/behavior mismatch rather than silently reinterpreting the requirement or fabricating a fail-closed test that doesn't match what exists. GLM-5.2's independent review confirmed this is "a real, disclosed discrepancy... the opposite of using the mismatch to avoid testing."

### Real-environment safety boundary (PI-010, PI-013)

Two scenarios (`agent-bridge/project-agent-override.md`, `mcp-host-integration/project-global-mcp-precedence.md`) deliberately `SKIP` their live global-config-collision sub-check, since running it would require writing into the **operator's real** `~/.pi/agent/` directory — outside this git worktree entirely. I independently confirmed `~/.pi/agent/agents/` does not exist (nothing was written there), and GLM-5.2 independently confirmed neither scenario's own "Exact Command Sequence" column contains a command that would write to that path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Created | Root playbook file. |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/{cli-invocation,skill-discovery,command-dispatch,agent-bridge,mcp-host-integration,hook-extension-layer,model-dispatch,prompt-quality}/*.md` | Created (19 files) | Per-scenario files. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Every REQ/task/checklist item updated with real, live-evidenced results; Status flipped Planned → Complete. |
| `implementation-summary.md` | Created | This document. |

The `.gitkeep` scaffold marker in `manual-testing-playbook/` was removed since the directory now has real content.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

LUNA (`codex exec --model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox workspace-write`) authored all 20 files in one dispatch, given a brief reproducing phase 010's full 19-row coverage table verbatim plus explicit per-row grounding for which scenarios could be live-executed against phase 012's now-real artifacts, and an explicit, hard instruction never to write into the operator's real global `~/.pi/agent/` directory. LUNA correctly identified and honestly resolved the PI-016 title/behavior mismatch rather than silently picking an interpretation, and correctly respected the global-config safety boundary on PI-010/PI-013.

I independently re-validated every claim rather than trusting LUNA's self-report: I re-ran `validate_document.py --type reference` on all 20 files myself (all `VALID, 0 issues`), confirmed `~/.pi/agent/agents/` genuinely does not exist, and spot-read 2 scenario files (`default-invocation-and-settings-merge.md`, `fail-open-guard-discipline.md`) directly.

GLM-5.2 (`devin -p --model glm-5.2 -- "<review>"`) reviewed the full root file plus all 19 scenario files and, in an environment where it could not execute shell commands, still independently re-verified 11 distinct factual claims against the live repo using its own read-only tools (file counts for `.pi/agents`/`.pi/prompts`/`.pi/extensions`, `settings.json`'s real content, `executor-config.ts`'s real model list, source-line quotes in `agent-delegation.md` and the MCP reference doc, fail-open comment presence across all 7 extension files, `$ARGUMENTS` token presence in a real generated prompt) — every single one confirmed. Verdict: **APPROVE WITH MINOR NOTES**, 0 blocking findings, 3 wording-clarity notes, all fixed before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Execute phase 010's own 19-row coverage table verbatim, no redesign | The design work was already done and verified in an earlier phase; this phase's job is authoring the files against that design, not re-litigating scope. |
| Test PI-016's actual built behavior (fail-open) and disclose the title/behavior mismatch, rather than silently picking an interpretation | The planned title ("fail-closed verification") and the real, GLM-reviewed implementation (fail-open) genuinely disagree. Testing the real code and naming the discrepancy is more honest than either silently reinterpreting the title or fabricating a fail-closed test against code that doesn't work that way. |
| SKIP the live global-config-collision sub-check on PI-010/PI-013 rather than running it | Running it would require writing into the operator's REAL `~/.pi/agent/` directory, outside this worktree/repo entirely — a hard safety boundary, not a capability gap. Independently confirmed nothing was written there. |
| Add a "Current Execution Boundaries" section not present in the sibling template | This machine's genuinely high SKIP rate (no provider credentials) needs an explicit, honest explanation so a reader doesn't mistake disciplined SKIP-per-blocker for avoidance. GLM-5.2 independently endorsed this as load-bearing context. |
| Fix all 3 of GLM's minor wording findings before commit | All 3 were cheap, real clarity improvements (disambiguating "the title," naming all 7 extensions in one evidence cell, sharpening one blocker's specificity) with no behavior change — worth doing since the fix cost was near zero. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type reference` on all 20 files | PASS — independently re-run by me, `VALID, 0 issues` each |
| `extract_structure.py` on all 20 files | PASS — per LUNA's own run; structure visually spot-checked by me on 2 files |
| Live `pi --offline --approve -p "..."` sessions (PI-001/007/008/009/014/015) | PASS — exit clean, no startup error, real output captured |
| `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL` grep (PI-017) | PASS — 7 real model IDs, default `deepseek-v4-pro`, no `"auto"` |
| `~/.pi/agent/agents/` non-existence check (PI-010 safety boundary) | PASS — directory confirmed absent |
| GLM-5.2 independent review | APPROVE WITH MINOR NOTES — 11/11 spot-checked claims confirmed against the live repo; 0 blocking; 3 wording findings fixed |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **~12 of 19 scenarios stay SKIP for their live-dispatch sub-check** because this machine has no provider API key configured — the same limitation phase 001 first documented and every subsequent phase in this packet has honestly carried forward. A future re-run on a credentialed machine could upgrade these to real PASS/FAIL.
2. **PI-010/PI-013's global-config-collision behavior is untested**, by deliberate design — testing it would require mutating the operator's real global Pi configuration outside this worktree, which is out of scope for any phase in this packet.
3. **PI-005/PI-006's skill-discovery flattening-risk and trust-prompt-persistence questions remain open**, per phase 004's own already-documented open question — this phase did not attempt to resolve them, since doing so needs the same live, credentialed session every other SKIP-tagged scenario needs.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
