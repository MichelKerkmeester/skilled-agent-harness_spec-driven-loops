---
title: "Implementation Summary"
description: "The advisor documentation now describes the CLI front door: 0 retired tool ids remain, 12 'MCP server' lines survive as history or flagged defects, and three rewritten playbook procedures ran green from the final state."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/007-docs-and-residue-sweep"
    last_updated_at: "2026-09-11T15:37:07Z"
    last_updated_by: "executor"
    recent_action: "Swept advisor docs to the CLI front door and re-ran the verification battery"
    next_safe_action: "Author the acceptance rows and tasks, then close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/feature-catalog/feature-catalog.md"
      - ".opencode/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/system-skill-advisor/references/runtime/tool-ids-reference.md"
      - ".opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md"
      - ".opencode/skills/system-skill-advisor/runtime/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-advisor-docs-tranche"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "The phase packet still holds scaffold tasks and acceptance rows; closure is not yet claimed"
      - "Stale advisor paths survive outside the declared scope (the spec-kit env reference, .pi docs, doctor configs)"
    answered_questions:
      - "The CLI cold-starts the daemon, so no per-runtime MCP registration step survives in the setup docs"
      - "The Python scorer is the production local scorer, not a validation-only facade"
      - "A playbook procedure counts as rewritten only once its command has been run and its output read"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-docs-and-residue-sweep |
| **Completed** | 2026-09-11 (docs and residue sweep tranche; packet closure pending) |
| **Level** | 3 |
| **Base Commit** | `3feab865ea` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two tranches. The earlier one rewrote the five documents a reader hits first; this one carried the same voice through every remaining authoring surface under `.opencode/skills/system-skill-advisor/` except `changelog/`, and it is the tranche this summary records.

The five root documents already described the CLI front door. This tranche swept the feature catalog (7 groups, 42 features), the manual-testing playbook (its index and about sixty scenarios), the references tree (scoring, graph, runtime, decisions, config), the hooks documentation, the runtime code READMEs, the runtime source comments, and two shell scripts.

| Surface | What changed | Volume |
|---------|--------------|--------|
| Retired tool ids | Every `mcp__system_skill_advisor__` id became the equivalent CLI invocation, except where a line is a historical record | 13 occurrences in 4 reference files |
| Feature catalog | Group 6 `MCP SURFACE` became `COMMAND SURFACE`, rows became `<command> command`, the directory name stays | catalog plus its entries |
| Playbook | Authored scenario contracts, preconditions, steps and expected signals rewritten against the CLI; appended run records kept verbatim | index and about sixty scenarios |
| References | Tool-id, drift, scoring, runtime, bridge-policy and decision documents rewrote live MCP prose; ADR records kept and labelled | 30+ documents |
| Hooks and code READMEs | Bridge-era prose replaced by the OpenCode plugin's real CLI path; package trees, titles and flows renamed to the runtime | 25+ READMEs and hook docs |
| Source comments | MCP transport comments and docstrings rewritten without behavior change (advisor server, handlers, tools, schemas, Python shim, watcher, doctor script) | 12 files |
| Unrunnable steps | Authored `advisor_*(...)`, `skill_graph_*(...)` and `spec_kit_skill_advisor_status({})` pseudo-calls became runnable `node .opencode/bin/skill-advisor.cjs` invocations | about 30 steps in 24 documents |

The completion bar was measured, not asserted: `mcp__system_skill_advisor__` fell from 13 to 0, `MCP server` from 115 lines to 12 (all classified below), case-insensitive `mcp` lines in markdown from 452 to 193, and strong transport phrases from 248 to 85, where the remainder is test/code internals, trigger aliases, negative statements, unrelated MCP servers and run records.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How Was Delivered

Documentation-only, with every claim checked against the tree or the live CLI rather than an earlier document. Residue greps classified each hit before editing: authored prose was rewritten, appended evidence sections and decision records were left alone, and a phrase that belonged to a different MCP server was left untouched. Structural anchors, headings and code fences were preserved; code blocks changed only their contents.

Every changed procedure that could run was run, which is why two of them changed twice. The CLI fallback smoke, the native recommend happy path and the global disable flag scenario all executed from the final state, and the option shapes they print were corrected where the first draft would have failed (the disable scenario needed database plus socket isolation for a cold daemon; its plugin step needed the focused disable cases rather than a suite that carries unrelated pre-existing failures).

The changelog was not touched. Its newest write predates the first edit of this tranche, verified by mtime ordering.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep MCP-named directories and routed leaves (`feature-catalog/mcp-surface/`, `manual-testing-playbook/native-mcp-tools/`, `standalone-mcp-shape.md`, `legacy-tool-bridge.md`) | Renaming them would cascade into `leaf-manifest.json`, `leaf-aliases.json` and the SKILL.md resource map; the prose inside them is what had to change |
| Keep history verbatim: changelog, ADR rows, appended evidence and pass/fail records, absorbed legacy test cards, dated decision notes | These record what was true when written; rewriting them would falsify the record |
| Keep frontmatter trigger phrases as search aliases except those literally containing `MCP server` | The committed trigger index lives under system-spec-kit and harvests these phrases; only the exact residue string justified an alias change |
| Keep unrelated MCP references (`mcp-code-mode`, `mcp-figma`, `mcp-click-up`, `mcp-chrome-devtools`, the MCP route guard, the retired memory engine's `context-server`) | Only the advisor's own transport was removed |
| Keep code identifiers (`MCPCallerContext`, the `mcp` skill family, the `runtime: 'mcp'` cache namespace) and raise tests instead of editing them | Code changes are out of this phase's scope; a defect found during the sweep is a finding |
| Report a dead parity harness and four red tests instead of hiding or fixing them | The phase raises code defects; it does not repair them in place |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Retired tool ids (`rg -c "mcp__system_skill_advisor__"`, scope minus `changelog/` and `runtime/dist/`) | PASS: no matches, ripgrep exit 1 |
| `MCP server` residue | 12 lines in 11 files; every one classified in the residue record below |
| Any `mcp__` string in scope | PASS: none |
| Changed documents pass their documentation gate (`validate_document.py`) | PASS: 160 files checked, 157 valid, 3 fixture-tree READMEs skipped by the tool's own policy |
| Skill package structure (`quick_validate.py`) | PASS: "Skill is valid!" |
| Procedure CL-006 (CLI fallback smoke) | PASS: `ok 9`; `warm-only exit=75`; `untrusted exit=64`; `trusted exit=75`; no socket entries |
| Procedure NC-001 (native recommend happy path) | PASS: `status ok`; thresholds 0.8/0.35/false; `freshness live`; top `system-spec-kit` 0.9424; lane fields exactly `lane/rawScore/shadowOnly/weight/weightedScore`; no raw prompt leak; empty stderr |
| Procedure CP-003 (global disable flag) | PASS on all four steps: CLI returns `recommendations: []`, `freshness: unavailable`, `ADVISOR_DISABLED`; Python shim returns `[]`; plugin disable cases `3 passed`; hook adapter returns `{}` with exit 0 |
| Converted hook-validation `advisor_validate` check | PASS: exit 0, `status ok`, both `thresholdSemantics` halves present, `telemetry.outcomes.totals` populated, empty stderr |
| Changelog untouched | PASS: newest write 17:04:42 predates the tranche's first edit (17:10:00); no file under `changelog/` was written afterwards |
| Build and dist freshness | PASS: `npm run build` completed after the runtime comment edits; the CLI answered live calls from the rebuilt dist |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:residue -->
## Residue Sweep Record

Zero live hits. The 12 remaining `MCP server` lines are explained survivors, each falling into exactly one class; none describes the advisor as currently shipping an MCP server.

| Location | Class | Why it stays |
|----------|-------|--------------|
| `ARCHITECTURE.md:155` | Decision record | ADR-005 row names the standalone MCP server boundary and marks it superseded by the CLI front door |
| `references/runtime/standalone-mcp-shape.md:45` | Decision record | ADR-001 topology record in past tense, with the same supersession |
| `manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md:64` | Absorbed legacy test card | A recorded run card that quotes the build of its time |
| `manual-testing-playbook/auto-update-daemon/rebuild-from-source.md:81` | Appended evidence block | Quotes the scenario contract as it existed when the run was blocked |
| `manual-testing-playbook/operator-h5/unavailable-daemon.md:116` | Appended evidence block | Line-number-prefixed quote of the scenario text under test |
| `manual-testing-playbook/operator-h5/degraded-daemon.md:193` | Appended pass/fail record | Records why the run was blocked, quoting the precondition |
| `manual-testing-playbook/python-compat/force-native-force-local.md:184` | Appended pass/fail record | Same reason |
| `manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md:102` | Appended evidence block | Quoted precondition list from the blocked run |
| `manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md:109` | Appended pass/fail record | The blocked verdict itself |
| `manual-testing-playbook/native-mcp-tools/shadow-delta-sink.md:221` | Appended pass/fail record | Quotes the precondition that failed |
| `runtime/scripts/skill_advisor.py:2083` | Prompt keyword table | The entry `"mcp server code"` routes prompts about writing MCP servers to `sk-code`; it is not about this advisor |
| `runtime/tests/rename-invariants.vitest.ts:21` | Pre-existing red test | Asserts the retired registration; raised as a defect below, not rewritten |

The wider residue classes are deliberate too: trigger-phrase aliases that still say `mcp` (kept as search aliases), negative statements such as "No MCP transport ships", retained path names, unrelated MCP skills, code identifiers, and appended run records that quote pre-rewrite text. Test and fixture internals that still speak the MCP wire protocol (`runtime/tests/parity/cli-vs-mcp-parity.cjs`, the plugin-bridge tests, fixture corpora) belong to the code-remediation class listed below.
<!-- /ANCHOR:residue -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase packet is not closed.** `tasks.md` and `acceptance-criteria.md` still hold their scaffold rows, and `plan.md` is the template plus its execution protocol. This tranche records state; authoring the acceptance rows and closing the phase remains, and phase 008 re-proves the claims from the final state.

2. **Four pre-existing red tests, raised not fixed.** `runtime/tests/rename-invariants.vitest.ts` asserts the retired MCP registration (3 failed, 1 passed). `runtime/tests/compat/plugin-bridge.vitest.ts` and `plugin-bridge-smoke.vitest.ts` resolve the removed bridge file by design of their own assertions. `runtime/tests/system-skill-advisor-plugin.vitest.ts` fails 27 of 41 cases because its mocked spawn still models the old bridge payload; its focused disable cases pass (`3 passed` with `-t "opt-out"`). None of the four was caused by this tranche, and fixing them is a code change outside the docs scope.

   **Closed later.** The suites that asserted the retired registration were retired or inverted in a later phase; `rename-invariants.vitest.ts` now asserts the opposite and passes, and `tests/compat/` carries no bridge suites.

3. **The MCP-versus-CLI parity harness cannot be exercised.** `runtime/tests/parity/cli-vs-mcp-parity.cjs` still spawns the launcher for its MCP leg, which now reaches only the unix-socket daemon, so every case times out. It is referenced only by the phase 003 packet.

4. **Stale advisor paths survive outside the declared scope.** The spec-kit env reference still names `mcp-server/` and `plugin-bridges/` paths in its Source columns, and `.pi` docs and doctor configs were listed by the previous tranche. The env example and the live advisor env surface carry no transport-only flag; the path text is a documentation carry-over assigned to a dedicated sweep.

   **Closed later.** Phase 8's residue pass cleared the env reference, the `.pi` docs and the doctor surfaces; the live count is now zero, with historical records keeping their old names by design.

5. **Retained names and generated artifacts.** `feature-catalog/mcp-surface/`, `manual-testing-playbook/native-mcp-tools/`, `references/runtime/standalone-mcp-shape.md`, `references/runtime/legacy-tool-bridge.md`, the `native_mcp_tools` category and `MCP_SHAPE` intent vocabulary keep their names by decision. `leaf-manifest.json` was stale before this tranche and its regeneration command fails at module load on a pre-existing `@spec-kit/shared` resolution defect, so it was not refreshed.

6. **Not re-audited.** Repo-wide references to `mcp-server/` outside this skill, the retrieval corpus paths carried from phase 006, and other skills' documentation were out of scope and are not counted here.
<!-- /ANCHOR:limitations -->

---
