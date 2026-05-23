# RCAF DEEP RESEARCH — ITERATION 1 — 118 deep-review upgrades survey

## ROLE
Expert researcher cataloging the upgrades shipped for deep-review in arc 118 (and adjacent commits). You produce a structured inventory of CHANGES with their TYPE, SCOPE, and SHIPPED-LOCATION.

## CONTEXT

This is ITERATION 1 of 10 on the question: **which 118 deep-review upgrades should propagate to deep-research?**

The 118 arc shipped across these commits (origin/main, most recent first):
- `56456514ce` fix(118): deep-review fix-pack — close P1/P2 advisories (groups 1/2/3/5)
- `aa593eb897` review(118): deep-review iters 3-10 + synthesis — PASS hasAdvisories=true
- `f8f3bdcac6` review(118): cli-devin SWE-1.6 deep-review iters 1-2
- `d485837718` chore(118): deferred-items closure — strip MCP comments + restore 117 keywords
- `14b40f23b3` chore(118/008): verify + changelog + closeout — deep-loop FULL_ISOLATE complete
- `71042e1a33` chore(118): sk-doc canonical companions for deep-loop-runtime
- `1a32678e7b` chore(118): sk-doc conformance pass on deep-loop-runtime SKILL.md + README.md
- `be2e777a4f` feat(118/007): split tests by responsibility — runtime tests move to deep-loop-runtime/
- `e590c12e19` feat(118/006): /doctor + system-code-graph collateral updates
- `107c522599` feat(118/002-005): deep-loop FULL_ISOLATE transition
- `954702a8f4` feat(118/001): scaffold deep-loop-runtime/ skeleton
- `bd77886d0a` feat(118): scaffold deep-loop FULL_ISOLATE_NO_MCP phased arc

Plus the 117 deliberation packet that preceded it: `1e35680075`.

## ACTION

**Step 1: Survey deep-review's 118 changes (ACCEPTANCE: structured inventory).**

For each commit listed, look at the changes that touched deep-review or deep-loop-runtime. Categorize each change into one of these types:

| Type | What it is |
|------|------------|
| RUNTIME-RELOCATION | Files moved from system-spec-kit/mcp_server/ to deep-loop-runtime/ |
| MCP-REMOVAL | Removed mcp__mk_spec_memory__deep_loop_graph_* tools + handlers |
| SCRIPT-SHIM | New .cjs entry points (convergence/upsert/query/status) |
| WORKFLOW-YAML | Updated deep-review_{auto,confirm}.yaml |
| COLLATERAL | Updated /doctor + system-code-graph references |
| TEST-MIGRATION | Test files moved to deep-loop-runtime/tests/ |
| DOC-COMPLIANCE | SKILL.md/README.md/changelog updated to sk-doc standards |
| CANONICAL-COMPANIONS | feature_catalog/ + manual_testing_playbook/ + references/ + graph-metadata.json authored |
| FIX-PACK | Bug/finding fixes (state_format.md field names, completion_pct, path validation, etc.) |
| VERSION-BUMP | SKILL.md frontmatter version bumps |

**Step 2: For each change, capture (ACCEPTANCE: file:line citations).**

| Field | Description |
|-------|-------------|
| change_id | C-NNN sequential |
| type | one of the types above |
| scope | what changed (file or area) |
| evidence | git log / file path reference |
| deep_review_specific | did this change touch deep-review/, or was it bilateral (deep-review + deep-research) |

**Step 3: Write iteration-001.md + iter-001.jsonl.**

`.opencode/specs/skilled-agent-orchestration/119-deep-research-uplift/001-research-deep-review-changes/research/iterations/iteration-001.md`:

```markdown
# Iteration 1 — Survey of 118 Deep-Review Upgrades

## Summary
<one paragraph: total N changes catalogued across M commits>

## Inventory

### C-001 — <title>
- Type: <TYPE>
- Scope: <file/area>
- Evidence: <commit + file:line>
- Deep-review-specific: yes/no

### C-002 — ...
...

## Type Distribution

| Type | Count | Bilateral? |
|------|-------|------------|
| RUNTIME-RELOCATION | N | Yes (also affects deep-research) |
| ...

## Next-Iter Suggestions

<bullet list: areas iter-2+ should probe for deep-research applicability>

## Convergence Signal (self-report)

- newChanges catalogued: <N>
- newChangesRatio (vs prior): N/A (baseline iter-1)
- coverage gate: PASS/FAIL (all 12 commits surveyed)
```

`.opencode/specs/.../research/deltas/iter-001.jsonl`:
```jsonl
{"iter":1,"change_id":"C-001","type":"RUNTIME-RELOCATION","scope":"lib/deep-loop/","evidence":"commit 107c522599","deep_review_specific":false,"bilateral":true}
{"iter":1,"change_id":"C-002","type":"MCP-REMOVAL","scope":"4 handler files","evidence":"commit 107c522599 phase 004","deep_review_specific":false,"bilateral":true}
...
```

## FORMAT

- file:line citations mandatory (commit SHA + file path acceptable for git-history changes)
- Evidence direct (commit + path), not paraphrase
- Honor scope: this iter is INVENTORY only, not analysis. Save applicability mapping for iter-2+
- DO NOT modify files outside `.opencode/specs/.../119-.../001-.../research/`

After writing both files, print:
`ITER-1 DONE: <N changes catalogued>, types=<distinct type count>, bilateral=<count>`
