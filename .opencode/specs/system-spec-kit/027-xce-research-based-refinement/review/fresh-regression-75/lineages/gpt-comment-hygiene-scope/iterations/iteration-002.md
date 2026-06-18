# Seat gpt-comment-hygiene-scope — iteration 2 (global #71)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-comment-hygiene-scope
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Scope-Discipline Review — Seat `gpt-comment-hygiene-scope`

**Angle:** changes that strayed beyond each phase's frozen scope (gold-plating / adjacent cleanup), maintainability lens.
**Slice:** 027 phase diffs vs their `spec.md` scope.

### What I verified (and ruled out)

I traced the code-bearing phases (the daemon hardening, CLI front-doors, MCP-config alignment, code-graph indexing) against their declared `spec.md` "In Scope / Out of Scope / Files to Change" boundaries and the actual git diffs.

1. **Phase 008 config trim (`c67a972b88`)** — *initially looked like over-deletion.* The single commit strips **all** `_NOTE_*` keys, while `spec.md:76` says "trim **only** the drift-prone trivia … **while keeping the operational/reference notes**" and `spec.md:112` references "kept notes." **Refuted:** `008/implementation-summary.md:69` records the over-aggressive pass was caught and the ~17 operational notes **restored** in follow-up `645bd69fb2`; current configs each hold 20 `_NOTE_` keys and the `sun_path`/EINVAL operational guidance survives (`ENV_REFERENCE.md:180`). Spec ↔ shipped state agree. Not a finding.

2. **Phase 009 "selectable maintainer mode" (`a44e2a29c4`)** — the "maintainer mode" generalization (`mk-code-index-launcher.cjs` `resolveMaintainerModeCategories`) is a clean refactor of the existing all-or-nothing knob and is named directly in the phase's own scope ("Make `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` selectable"). In-scope, not gold-plating.

3. **Per-phase discipline was strong, not loose.** Phase 008 used `git commit --only` (10 files, none under `.opencode/specs/027`) specifically to avoid sweeping in a concurrent restructure (`008/implementation-summary.md:59`). Many phases explicitly **declined** to fix adjacent alignment-drift files (`canonical-fingerprint.ts`, `memo.ts`, `deploy-mcp.sh`) under their approved write scope (e.g. `002/.../002-causal-edge-tombstones/implementation-summary.md:137`, `003/001-causal-traversal-bfs/implementation-summary.md:112`). That is the opposite of the gold-plating my seat hunts for.

### The one genuine scope observation

The `chore(027)` catch-all snapshot commit **`6ed0f30a2f`** ("land full working-tree snapshot — operator-directed catch-all") lands changes across **~18 distinct spec trees** outside 027 — `skilled-agent-orchestration/{122,126,134,138,140,143,144,146,147,148,149,150,151,152,153,155}`, `system-spec-kit/026`, `system-spec-kit/028` — plus "the in-flight skill-advisor refactor + fable-mode tooling," and the message itself states the advisor refactor "was **not independently verified** here." This is attributed to 027 but is overwhelmingly non-027 work, and ships unverified code under a single chore commit. It is transparently self-documented and operator-directed (so it is a documented choice, not a hidden defect), but it harms `git bisect`/blame attribution for the 027 epic and lands unverified changes — a maintainability/traceability hygiene cost prior code-correctness passes would not have flagged. P2.

### Verdict

No P0/P1 scope-discipline violations. Per-phase frozen scope was respected to an unusually high degree (commit fencing, explicit refusal to clean adjacent code, corrected over-reach). One P2 traceability hygiene note on the catch-all snapshot.

```json
{"seat":"gpt-comment-hygiene-scope","model":"openai/gpt-5.5-fast","angle":"Scope discipline: changes that strayed beyond each phase frozen scope (gold-plating / adjacent cleanup).","verdict":"PASS","summary":"Per-phase frozen scope well respected (commit fencing, refused adjacent cleanup, corrected over-reach). No P0/P1. One P2: chore(027) catch-all snapshot bundles ~18 non-027 spec trees + unverified refactor, hurting bisect/blame attribution.","files_reviewed":[".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default/spec.md",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default/implementation-summary.md",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/009-code-graph-code-only-indexing/spec.md",".opencode/bin/mk-code-index-launcher.cjs",".opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts","opencode.json",".claude/mcp.json",".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md","git:6ed0f30a2f","git:c67a972b88","git:a44e2a29c4","git:4870a6b3f8"],"findings":[{"severity":"P2","dimension":"traceability","title":"chore(027) catch-all snapshot lands ~18 non-027 spec trees + unverified refactor under one 027-attributed commit","file":".opencode/specs/system-spec-kit/027-xce-research-based-refinement (commit 6ed0f30a2f)","evidence":"Commit 6ed0f30a2f 'chore(027): land full working-tree snapshot (operator-directed catch-all)' touches ~18 distinct spec trees outside 027 (skilled-agent-orchestration/122,126,134,138,140,143,144,146,147,148,149,150,151,152,153,155; system-spec-kit/026 and /028) plus the in-flight skill-advisor refactor + fable-mode tooling; the commit message states 'the in-flight advisor refactor was not independently verified here.'","why":"A single 027-attributed chore commit bundling work owned by ~18 other packets, including code the message admits was not verified, defeats per-epic git bisect/blame attribution and lands unverified changes in the tree — a maintainability/traceability cost. (Mitigated: it is transparently self-documented and operator-directed, and the underlying changes are individually owned by their real packets.)","recommendation":"Future bulk snapshots should be committed as a neutral chore (no per-epic scope prefix) or split by owning packet; explicitly tag any 'not independently verified' content so a later verification pass can find it. No action required on shipped state — the per-phase 027 work itself stayed within frozen scope."}]}
```
