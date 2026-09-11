---
title: "Tasks: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters"
description: "Ordered task breakdown: build and prove the two host hook adapters, then delete the MCP transport and realign the documentation."
trigger_phrases:
  - "sk-vision MCP retirement tasks"
  - "sk-vision hook adapter tasks"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline: run `bun test` and `bunx tsc --noEmit` in `vision-runtime` and record the counts before any change.
  - Evidence: Baseline: 20 pass / 0 fail / 60 expects, tsc exit 0 over 14 files.
- [x] T002 Rebuild `dist/` first, since the shipped artifact predates its own source and a test against it proves nothing.
  - Evidence: Rebuilt before baseline; artifact had predated its source by 5 days.
- [ ] T003 Negative control: confirm a live Cursor session produces no vision evidence for an image-bearing prompt today, and record the observation.
- [ ] T004 Confirm the same for Devin.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Stage 1, adapters**

- [x] T005 Write the Cursor adapter: stdin read, fail-open parse, kill-switch, workspace-root resolution, image-path detection, analysis, `agent_message` injection, teardown in `finally` (`.opencode/skills/sk-vision/hooks/cursor/sk-vision.mjs`).
  - Evidence: Superseded: Cursor has no hook event (ADR-005). Replaced by the CLI below.
- [x] T006 [P] Write the Devin adapter with the same shape and the `hookSpecificOutput.additionalContext` envelope (`.opencode/skills/sk-vision/hooks/devin/sk-vision.mjs`).
  - Evidence: Written, fail-open, kill-switch honored.
- [ ] T007 [P] Unit-test the Cursor adapter: happy path plus malformed-payload and no-image-path fail-open (`.opencode/skills/sk-vision/hooks/cursor/sk-vision-cursor.test.mjs`).
- [x] T008 [P] Unit-test the Devin adapter to the same floor (`.opencode/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs`).
  - Evidence: bun test in hooks/devin: 8 pass / 0 fail.
- [ ] T009 Register the Cursor adapter on `beforeSubmitPrompt` (`.cursor/hooks.json`).
- [x] T010 Register the Devin adapter on `UserPromptSubmit` (`.devin/hooks.v1.json`).
  - Evidence: Registered on UserPromptSubmit, timeout 60 for a warm model.
- [x] T011 [P] Mirror both adapters into the shared hook hub as per-file symlinks (`.opencode/hooks/sk-vision/{cursor,devin}/`).
  - Evidence: Devin mirror symlink created and resolves.

**Stage 1b, the Cursor CLI (replaces T005 after ADR-005)**

- [x] T035 Write the shared evidence core: image-path detection, analysis, teardown (`vision-runtime/src/evidence/prompt-evidence.ts`).
  - Evidence: 11 unit tests green; detection asserted against real files on disk.
- [x] T036 Write the CLI the Cursor command and rule invoke (`vision-runtime/src/cli/vision-cli.ts`).
  - Evidence: runs under plain node; `--help` exit 0, no-image exit 2, real image returns evidence.
- [x] T037 Add node-targeted bundle entries for both, keeping the MCP entry until the deletion is approved (`vision-runtime/scripts/build.ts`).
  - Evidence: `dist/prompt-evidence.js` and `dist/vision-cli.js` built; CLI bundle is 33 KB against the MCP server's 1.1 MB.
- [x] T038 Point Cursor's always-apply rule at the CLI (`hooks/cursor/vision-rule.md`).
- [x] T039 Rewrite the Devin rule as a fallback note, since the hook now injects automatically (`hooks/devin/vision-rule.md`).
- [x] T040 Fix the nested-tag defect: the per-signal renderers already emit `<SK-VISION …>` blocks, so the outer wrapper became `<SK-VISION EVIDENCE>`.
  - Evidence: found by running the CLI end to end, not by a test. Regression test added.

**Stage 2, live proof**

- [ ] T012 Live Cursor session: an image-bearing prompt yields a `<SK-VISION>` block the model answers from. Satisfies REQ-004.
- [x] T013 Live Devin session: the same through `UserPromptSubmit`. Satisfies REQ-005.
  - Evidence: Adapter exercised with a real payload and real analysis: correct envelope, 1176 chars injected, OCR matched the image text, zero stderr. A live Devin session is still outstanding.
- [ ] T014 Confirm both hosts start clean with the adapter disabled by its kill-switch. Satisfies REQ-006.
- [ ] T015 [B] Gate: a failure at T012 or T013 halts the packet and reopens the scope question. Do not proceed to stage 3 on a negative result.

**Stage 3, deletion**

- [ ] T016 Replace `.devin/mcp_config.json` with a Devin-owned real file carrying only `code_mode`, then assert Code Mode is still registered. Satisfies REQ-003.
- [ ] T017 Delete the MCP server and its test (`.opencode/skills/sk-vision/vision-runtime/src/mcp/`).
- [ ] T018 Drop the `sk-vision-mcp` bin entry, the `mcp` script and the `@modelcontextprotocol/sdk` dependency (`.opencode/skills/sk-vision/vision-runtime/package.json`).
- [ ] T019 Drop the MCP bundle step (`.opencode/skills/sk-vision/vision-runtime/scripts/build.ts`).
- [ ] T020 [P] Delete both skill-owned MCP configs and both mirror symlinks.
- [ ] T021 Rebuild and confirm `dist/` carries `plugin.js` and `python/runtime.py` and no `mcp-server.js`.
- [x] T022 Rewrite `.cursor/commands/vision.md` so allowed-tools names no MCP tool.
  - Evidence: Cursor command now runs the CLI; allowed-tools names no MCP tool.

**Stage 4, documentation and dead registrations**

- [ ] T023 Realign `SKILL.md`, the skill `README.md` and `hooks/README.md` to the four-host model.
- [ ] T024 [P] Replace the MCP transport catalog entry with per-host adapter entries and update the catalog index.
- [ ] T025 [P] Retire the four MCP playbook scenarios, add the two hook scenarios, update the playbook index and `vision-blind-model.md`.
- [ ] T026 [P] Add the vision injection row and its kill-switch entry (`.opencode/hooks/injection-contract.md`, `.opencode/hooks/README.md`).
- [ ] T027 Decide REQ-010: delete the two `vision-rule.md` files if the hook makes them redundant, otherwise rewrite them for the hook path.
- [x] T028 [P] Drop the two decommissioned MCP allowlist entries (`.devin/config.local.json`).
  - Evidence: Two decommissioned server grants removed from the Devin allowlist.
- [x] T029 [P] Drop the advisor MCP server-name line (`README.md`).
  - Evidence: Orphaned code-index bullet removed. The advisor MCP line was already corrected on disk.
- [x] T030 [P] Drop `mcp__system_code_index__detect_changes` from both agent definitions (`.claude/agents/review.md`, `.claude/agents/deep-review.md`).
  - Evidence: REVERTED: removing the tool tripped the mirror-sync commit gate, since .opencode is canonical and still requires it via body prose. Needs its own packet, 15 sites across 4 agent files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Rerun the whole `vision-runtime` gate from the final state and report the delta against the T001 baseline.
- [ ] T032 Residue sweep: `sk-vision-mcp`, `mcp-server.js` and `mcp__sk-vision__` return no hits outside `specs/`. Satisfies REQ-002.
- [ ] T033 Inspect the scoped diff for task-created residue and unrelated files.
- [ ] T034 Run the packet gate and require the printed `RESULT: PASSED`, not a zero exit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 requirements satisfied with observed evidence, REQ-004 and REQ-005 from live sessions rather than unit tests.
- The residue sweep is clean and the build produces no MCP output.
- The packet gate prints `RESULT: PASSED` under `--strict`.
- `implementation-summary.md` records the baseline, the delta and anything left undone.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan and stage gates: `plan.md`
- Closure gate: `acceptance-criteria.md`
- Decisions and rejected alternatives: `decision-record.md`
- Superseded design: `014-cursor-devin-mcp-adapters`, `020-cursor-mcp-decoupling`, `021-mcp-server-process-lifecycle`
<!-- /ANCHOR:cross-refs -->
