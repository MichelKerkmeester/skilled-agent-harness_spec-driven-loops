---
title: "Feature Specification: Deep research — refine the sk-code code-opencode surface sub-skill against .opencode reality"
description: "Ten-iteration deep-research investigation seeded by a Fable-5 AI-council review of sk-code, focused on the code-opencode SURFACE sub-skill. code-opencode is the playbook for writing and modifying code in this repo's own .opencode/ tree (skills, agents, commands, plugins, MCP servers, hooks, config). This research is a docs-vs-reality gap hunt: validate code-opencode's language standards, implement/debug/verify workflow doctrine, hook contracts, alignment-verification automation, detection markers, and skill/agent/command/MCP authoring checklists against the ACTUAL .opencode logic code (system-skill mcp_server TypeScript, deep-loop CJS/mjs runtime, command YAMLs, the review/code/debug agents, plugins, bin/ daemon CLIs). Output: a ranked, evidence-grounded refinement backlog for code-opencode; secondary output: any real bugs/drift found in the underlying .opencode code itself, flagged separately."
trigger_phrases:
  - "code-opencode refinement research"
  - "refine code-opencode surface subskill"
  - "code-opencode vs .opencode reality"
importance_tier: "high"
contextType: "research"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/027-code-opencode-refinement-research"
    last_updated_at: "2026-07-08T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "RESEARCH COMPLETE — 10 GLM-5.2 iterations + synthesis, manually orchestrated by the Opus conductor (the /deep:research :auto command was blocked by the documented GPT/GLM Gate-3 halt P0, so each iteration was a direct read-only GLM-5.2 dispatch). research/research.md holds the ranked, file-mapped code-opencode refinement backlog (~25 P1 / ~22 P2 / ~7 P3) + 8 underlying .opencode code bugs (C1-C8); iterations at research/iterations/iteration-001..010."
    next_safe_action: "Operator reviews research/research.md; a follow-up IMPLEMENTATION packet executes the backlog in the §6 sequencing order. Packet finalization (description.json/graph-metadata.json regen, 017-parent children_ids registration, validate --strict, commit) is DEFERRED pending the live deep-loop->system-deep-loop + spec-folder-renumber migration settling, to avoid collision."
---
# Feature Specification: Deep research — refine the sk-code code-opencode surface sub-skill against .opencode reality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Executor** | GLM-5.2 (`zai-coding-plan/glm-5.2`) via cli-opencode, 10 iterations |
| **Seed** | Fable-5 AI-council review of sk-code (67 raised / 52 confirmed findings, 0 refuted) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`code-opencode` is not a generic docs packet — it is the **playbook for writing and modifying code in this repository's own `.opencode/` tree**: skills, agents, commands, plugins, MCP servers, hooks, and descriptor/config. It ships per-language standards (TypeScript / Python / Shell / Config / JavaScript trios of `style_guide` + `quality_standards` + `quick_reference`), the shared implement → debug → verify workflow doctrine, hook contracts (`hooks.md`), an alignment-drift verifier (`alignment_verification_automation.md`), surface-detection markers, and skill/agent/command/MCP authoring checklists.

Because it is documentation *about how the real system is built*, it can silently drift from that system. The `.opencode/` codebase evolved fast — the invokable parent-hub (Option E) architecture, the one-graph-metadata invariant, `mode-registry.json` routing, the daemon + CLI-fallback MCP pattern, `tsconfig.build.json` build/verify conventions, vitest with deterministic-env gotchas, native-module ABI rebuilds, the source-vs-stale-dist trap, and a two-gate pre-commit hook. A Fable-5 council review already confirmed that a v4 two-axis restructure of sk-code shipped without a docs/metadata/guard sweep, leaving code-opencode-adjacent staleness. What has NOT been done is a deep, evidence-grounded check of code-opencode's guidance **against the actual `.opencode` logic code it purports to describe.**

### Purpose
Produce a ranked, evidence-grounded refinement backlog for `code-opencode`, each item mapped to the exact file to change, grounded in the real `.opencode` code. Where the investigation surfaces genuine bugs or drift in the underlying `.opencode` code itself (not the docs), flag those separately — they belong to different owning packets, not a code-opencode docs edit.

<!-- /ANCHOR:problem -->
---

## 3. COUNCIL SEED (starting evidence, not the whole picture)

A Fable-5 council (6 seats, adversarial verification) reviewed sk-code and confirmed 52 findings (12 P1, 22 P2, 18 P3), no P0s. Core theme: the v4 two-axis restructure landed in the router + packet content but never swept the surrounding docs/metadata/guard layer. **code-opencode-relevant confirmed findings to start from (verify each independently, then go deeper):**

- `verify_stack_folders.py` (code-opencode/assets/scripts) is permanently broken — parses for a `STACK_FOLDERS` map that no longer exists; a playbook scenario requires it to exit 0.
- `code-opencode/references/shared/hooks.md` documents removed OpenCode/Copilot hook infrastructure (dead anchors); `code-opencode/SKILL.md` over-claims post-tool-use coverage.
- Authoring checklists (code-opencode/assets/checklists/{command,skill,mcp_server}_authoring.md) cite canonical example files that do not exist.
- `code-opencode/SKILL.md:16` detection markers over-claim: bare extensions (`.cjs/.mjs/.ts/.py/.sh`) are not OPENCODE-surface markers per the canonical detection contract.
- `code-quality/SKILL.md`'s loading contract claims a packet-local `assets/checklists/` that never existed — the ten authoring checklists actually live in `code-opencode`.
- The `bash`-invokes-Python-shebang-checker bug (exit 2 read as benign "file skipped") — some of that tooling is code-opencode/adjacent.
- Broader: docs teaching interpreter traps, dead cross-tree pointers into commands/agents, stale universal docs.

## 4. RESEARCH FACETS (docs vs reality — expand angles each iteration)

1. **Language-standard fidelity** — do the TS / Python / Shell / Config / JS trios match how the real `.opencode` code is written (mcp_server TS `Object.freeze` calibration + `tsconfig.build.json`; deep-loop CJS/mjs; plugins; hook shell)? Prescribed-but-unused patterns; used-but-undocumented patterns.
2. **Verify-doctrine reality** — does `workflow_verify.md` match actual verification: `tsc -p tsconfig.build.json`, `vitest run` + the deterministic-env (`MK_SKILL_ADVISOR_DB_DIR`) collision gotchas, drift-guards, `validate.sh --strict`, native-module ABI rebuild (`rebuild-native-modules.sh`) for SIGBUS, warm-daemon reindex, and the **source-vs-stale-dist** trap (daemon serves gitignored dist)?
3. **Hook-contract accuracy** — do `hooks.md`'s session-prime / user-prompt-submit / pre-tool-use / post-tool-use contracts match the real `.opencode/hooks` (the pre-commit's TWO gates: comment-hygiene + agent-mirror-sync; the UserPromptSubmit advisor hook)?
4. **Alignment verifier** — does `alignment_verification_automation.md` match the actual drift-guard / vocab-sync / parent-skill-check tooling?
5. **Authoring checklists** — do the skill / agent / command / MCP checklists match current authoring reality (parent-hub Option E, one-graph-metadata invariant, `mode-registry.json`, command YAML shape, agent frontmatter + mirror-sync, the MCP daemon + CLI-fallback pattern)?
6. **Detection markers** — are the markers sufficient and correct? Missing stacks (native/node-gyp, vitest configs, `.sock` IPC, YAML commands)?
7. **Related commands + review agent** (explicitly in scope) — does code-opencode hand off correctly to `/deep`, `/speckit`, `/memory`, `/doctor`, `/create` and to the review/code/debug agents? Drift between command/agent docs and reality.
8. **Deep-loop logic conventions** — the runtime CJS/mjs (convergence, loop-host, fan-out, state): does code-opencode teach the conventions for editing that code?
9. **Empirically-hit pitfalls** — scratch-index push, worktree isolation, daemon single-writer, native ABI/SIGBUS, det-env test collisions, comment-hygiene HARD BLOCK: captured as OpenCode-surface guidance or missing?

## 5. SCOPE, GUARDRAILS & SUCCESS

### Scope
- Diagnostic research only. Produce `research/research.md` with a ranked refinement backlog for `code-opencode`; do NOT implement the refinements (a later packet owns implementation).
- Primary target = `code-opencode`. Secondary = real `.opencode` code bugs/drift, flagged separately with their likely owning surface.

### Guardrails (RM-8 — this run uses `--dangerously-skip-permissions`)
- **BANNED OPERATIONS:** the loop may WRITE only under this packet's `research/` directory. It MUST NOT create, edit, rename, or delete any file outside `.opencode/specs/sk-code/017-sk-code-parent/027-code-opencode-refinement-research/research/`. It MUST NOT touch existing sk-code spec folders, the live spec-folder migration, or any dirty working-tree file. All reading across `.opencode/` is allowed and encouraged.
- Recovery baseline HEAD recorded before launch.

### Success Criteria
- 10 productive iterations recorded in `research/deep-research-state.jsonl`, each with route-proof fields.
- Convergence or max-iterations reached; `research/research.md` synthesizes a ranked, evidence-grounded, file-mapped code-opencode refinement backlog with a clear separation of docs-refinements vs underlying-code bugs.
- No writes outside `research/`.
