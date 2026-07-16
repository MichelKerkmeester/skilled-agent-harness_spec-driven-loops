---
title: "Implementation Summary: executable-edge route parsing"
description: "Shipped the structural route-edge parser: a dependency-free comment-aware extractor that follows only structural dispatch positions, re-classifying the three reported P0 route cycles from three to zero while the genuine structural cycle stays covered by a retained fixture and a new parser-contract test."
status: complete
trigger_phrases:
  - "executable edge route parsing implementation"
  - "route cycle false positive status"
  - "yaml comment edge parsing progress"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/002-executable-edge-route-parsing"
    last_updated_at: "2026-07-16T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped structural edge parser; comment-derived route cycles 3 to 0"
    next_safe_action: "013 phases 003-006 remain planned in the parent map"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No YAML parser is available to the adapter; used a dependency-free structural value-position extractor, not a new dependency"
      - "The independent reference oracle is left untouched by design scope; its raw-text handling is dormant and the harness forbids a second zero-finding fixture"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-executable-edge-route-parsing |
| **Status** | Complete |
| **Completed** | 5 of 5 tasks; real-corpus route cycles re-classified 3 to 0, adapter test and oracle green |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-doc-command route-cycle detector no longer reads YAML comments as dispatch edges. Before this change, its back-edge scan called `extractCommandTargets`, a raw-text extractor that matches any `.opencode/commands/…` token anywhere in a file — including inside `#` comments and prose. That produced three P0 `CMD-S3-ROUTE-CYCLE` findings against the real command corpus, all of which were false: each back-reference was a comment line documenting the routing relationship, not an executable dispatch.

The fix is a new `executableCommandEdges` extractor in the adapter. It walks the target YAML line by line, drops whole-line and inline `#` comments, and records a command reference only when it sits in a structural value position — a mapping value (`key: path`), a sequence item (`- path`), or a subaction route arrow (`` -> `path` ``). Each recorded edge is `{target, line, kind}` with a kind of `direct`, `subaction`, or `workflow`. The cycle detector's back-edge scan now runs over this executable-only edge set, so a comment that names the source command contributes no edge. Because no YAML parser is available to the adapter — a `require('js-yaml')` fails with `MODULE_NOT_FOUND` — and adding a dependency to a validator that must run inside bare git worktrees is a liability, the parse is a dependency-free line-oriented structural extractor rather than a full document AST.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Modified | Added `executableCommandEdges` (+ `edgeKind`, `stripInlineYamlComment`), wired it into the `checkRouteGraph` back-edge scan in place of raw-text extraction, and exported it for testing |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs` | Modified | Added `testExecutableEdges` — a parser-contract unit asserting comment references yield zero edges and mapping / sequence / arrow / `.yaml` positions resolve to typed edges with source lines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three reported cycles were first reproduced against the live corpus to confirm they were real findings, not paraphrase: `node sk-doc-command.cjs check .opencode/commands` emitted exactly three `CMD-S3-ROUTE-CYCLE` findings, at `create_readme_auto.yaml:37`, `create_readme_confirm.yaml:9`, and `doctor/_routes.yaml:5` — each verified to be a `#` comment line. The genuine-cycle fixture `public-route-cycle` was confirmed to use a structural `back_edge:` mapping value at `doctor_mcp_install.yaml:10`, so it is correct under both the old and the new extractor and needs no change. The extractor was then implemented, wired into the back-edge scan, and re-run: the real-corpus cycle count dropped from three to zero, the adapter differential test held at `fixtures=13` with the genuine cycle still firing, and the independent oracle stayed at `all=13`.

This phase is independent of the 000 to 001 chain and of the 014 asset-layer research. Its blast radius is low: the change is confined to one adapter and its test, with no fixture files, no runtime dispatch, and no command-local YAML edited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extract edges only from structural value positions instead of scanning raw text | Comments and prose stop being read as dispatch edges, which is the root cause of the three false P0 cycles |
| Dependency-free line-oriented parse, not a YAML AST or a new dependency | No YAML parser is available to the adapter, and adding one to a validator that runs in bare worktrees is a liability; the target manifests are flat, so a value-position parse is sufficient |
| Match any structural value carrying a command path, not a fixed field whitelist | A whitelist is the over-narrow schema the spec flags as a risk — it could drop a real edge; a value-position rule follows every declared dispatch field and still excludes comments |
| Tag each edge with kind (`direct`/`subaction`/`workflow`) and source line | Satisfies REQ-002 and lets a real cycle's path be expressed in executable fields |
| Leave the independent reference oracle untouched | It is a boundary-protected ground-truth component outside this phase's key files; its raw-text handling is dormant because no fixture exercises a comment-only workflow back-edge, and the harness's single-control invariant precludes adding a second zero-finding fixture |
| Guard the correction with a parser-contract unit rather than a new fixture | The harness forbids a second zero-finding (control) fixture, so the comment-equals-zero contract is locked at the extractor level while the retained `public-route-cycle` fixture guards genuine cycles |
| Keep the contract schema and semantic invariants out of scope | Those belong to phase 001 and phase 003; this phase is edge inference only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Comment references (whole-line and inline) yield zero edges | PASS — `testExecutableEdges` asserts both comment forms return `[]` |
| Each edge carries a kind and source location | PASS — edges are `{target, line, kind}`; the unit asserts `direct` / `subaction` / `workflow` with the right line |
| Genuine structural cycle still fails | PASS — `public-route-cycle` still emits `CMD-S3-ROUTE-CYCLE` at `doctor_mcp_install.yaml:10` |
| Reported P0 cycles re-classified | PASS — real-corpus `CMD-S3-ROUTE-CYCLE` dropped from three to zero, all comment-derived |
| Route-fixture suite reflects the corrected edge set | PASS — adapter differential test `fixtures=13` green; independent oracle `--verify` `all=13` green |
| Adapter syntax and CLI intact | PASS — `node -c` on the adapter and test; `check` CLI runs over the corpus |
| Strict packet validation | Run `validate.sh --strict` on this folder — Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The independent oracle retains raw-text extraction.** `reference-oracle.cjs` still reads comments as edges in its own `classifySourceRoutes`. This is intentional scope: the oracle is a boundary-protected ground-truth component the adapter is forbidden to import, it is not in this phase's key files, and its behavior is dormant because none of the thirteen fixtures exercises a comment-only workflow back-edge — so the adapter and oracle still agree on the full fixture set. Hardening the oracle is deferred.
2. **Line-oriented, not a full YAML parse.** The extractor is a value-position line parser, adequate for the flat command and route manifests in scope. A deeply nested dispatch structure or a multi-line flow scalar would not be traversed; none exists in the current corpus.
3. **No new benchmark fixture.** The comment-equals-zero correction is guarded by the `executable-edges` parser-contract unit rather than a dedicated fixture, because the oracle harness allows exactly one zero-finding (control) fixture.
<!-- /ANCHOR:limitations -->
