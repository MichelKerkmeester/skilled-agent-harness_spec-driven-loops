# Deep Review Report — 027 XCE Research-Based Refinement

Review target: `system-spec-kit/027-xce-research-based-refinement` (full epic, post-implementation release readiness)
Mode: autonomous fan-out (`/deep:start-review-loop`) | Dimensions: correctness, security, traceability, maintainability

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories=true)

| Severity | Active count |
|----------|--------------|
| P0 (Blocker) | 0 |
| P1 (Required) | 4 |
| P2 (Suggestion) | 4 |

Six independent review lineages (4× gpt-5.5-fast-high via cli-opencode, 2× Fable-5 via cli-claude-code) audited the full 027 epic across all four dimensions. **No correctness, security, or behavioral defects were found in the shipped code** — the implementation surfaces were already verified per-phase during the build. Every confirmed finding is **documentation / control-metadata drift at the 027 parent level**: the phase children shipped, but the parent control docs (`spec.md` phase map, `description.json`, `resource-map.md`, `_memory.continuity`, `context-index.md`, `changelog/README.md`) were never reconciled to the post-implementation reality.

Cross-model convergence is high: GPT and Fable lineages independently surfaced the same parent-doc-staleness cluster, and Fable sharpened the status-column contradiction. All P1 findings were adversarially re-verified against the cited files and confirmed real (not false positives).

These are exactly the reconciliation items the COMPLETION VERIFICATION RULE requires before a completion claim.

---

## 2. Planning Trigger

`/speckit:plan` remediation is **not required** — the findings are bounded, well-understood control-doc reconciliations remediable directly. Planning Packet:

```json
{
  "verdict": "CONDITIONAL",
  "remediationRequired": true,
  "remediationClass": "parent-control-doc-reconciliation",
  "blocksRelease": false,
  "items": [
    {"id": "R1", "severity": "P1", "target": "spec.md", "action": "add phase 011 row to phase map; correct STATUS column for shipped phases (000,002,008,009); correct 'not implemented' narrative note"},
    {"id": "R2", "severity": "P1", "target": "description.json", "action": "surgically add 011-command-presentation-workflow-separation to children_ids + children (do not full-regenerate the subtree)"},
    {"id": "R3", "severity": "P1", "target": "resource-map.md", "action": "refresh frozen 2026-06-04 scope to include phases 002-011; reconcile last-active-child with graph-metadata"},
    {"id": "R4", "severity": "P2", "target": "spec.md _memory.continuity", "action": "refresh recent_action/next_safe_action/completion_pct/last_updated; recompute fingerprint"},
    {"id": "R5", "severity": "P2", "target": "context-index.md", "action": "correct current-folder column for phases folded into 003"},
    {"id": "R6", "severity": "P2", "target": "changelog/README.md", "action": "reconcile track 000/001 status cells with child completion state"},
    {"id": "R7", "severity": "P2", "target": "research/010 dispatch logs", "action": "untracked local-only home-path leakage; gitignore-or-leave (not shipped)"}
  ]
}
```

---

## 3. Findings

### P1 — Required

- **P1-1 · correctness · `spec.md`** — Parent child inventory omits live phase `011-command-presentation-workflow-separation`. The phase exists on disk and is present in `graph-metadata.json`, but the `spec.md` PHASE DOCUMENTATION MAP stops at 010 and `description.json.children_ids` ends at `010-mcp-to-cli-tool-transition`. Three-way drift between spec.md / description.json / graph-metadata.
- **P1-2 · correctness · `spec.md`** — Phase-map STATUS column and narrative note contradict on-disk child statuses: `000` shown "Placeholder", `002`/`008`/`009` shown "Spec-scaffolded", and the note "All three programs are scaffolded and planned, not implemented" — while those phases (and 006/007 leaves) are implemented/shipped per their implementation-summaries and the changelog.
- **P1-3 · traceability · `resource-map.md`** — Parent resource map excludes the 011 track and later shipped scope.
- **P1-4 · traceability · `resource-map.md`** — Resource map is scope-frozen at 2026-06-04; omits phases 002-011 and contradicts current `graph-metadata.json` on the active-child set.

### P2 — Advisory

- **P2-1 · maintainability · `spec.md` `_memory.continuity`** — Stale on every progress field: `next_safe_action` names already-completed work, `completion_pct` 0, last-updated date mismatch.
- **P2-2 · traceability · `context-index.md`** — Current-folder column stale for phases folded into `003-memory-index-causal-lifecycle`.
- **P2-3 · maintainability · `changelog/README.md`** — Status coherence: track 001 "shipped" vs child "In Progress"; track 000 "planned / 0 changelogs" vs Completed 000 children.
- **P2-4 · security · `research/010/.../prompts/*.out`** — Machine-local home paths in research dispatch logs. Local-only, untracked (not shipped); informational.

---

## 4. Convergence & Methodology

| Lineage | Executor | Iterations | Convergence | Verdict |
|---------|----------|-----------|-------------|---------|
| gpt-1 | cli-opencode / gpt-5.5-fast-high | 5 | 1.00 | CONDITIONAL |
| gpt-2 | cli-opencode / gpt-5.5-fast-high | 5 | 0.76 | CONDITIONAL |
| gpt-3 | cli-opencode / gpt-5.5-fast-high | 5+ | 0.72 | CONDITIONAL |
| gpt-4 | cli-opencode / gpt-5.5-fast-high | 5 | 0.75 | CONDITIONAL |
| fable-1 | cli-claude-code / claude-fable-5 (native acct) | 5 | 0.78 | CONDITIONAL |
| fable-2 | cli-claude-code / claude-fable-5 (native acct) | 5 | 0.79 | PASS |

Merge policy: strongest-restriction (any lineage active P0 → merged FAIL). Merged verdict CONDITIONAL (no P0 in any lineage; P1s present). Total ~30 review iterations (20 GPT + 10 Fable), matching the requested split. claude2 (account #2) hit its session limit mid-run; Fable seats were moved to the native account per the standing fallback.

## 5. Adversarial Self-Check

All P1 findings re-verified against source:
- 011 directory exists on disk ✓; `description.json.children_ids` ends at 010 ✓; `graph-metadata.json` contains 011 (grep=1) ✓ → drift confirmed real.
- spec.md phase-map STATUS cells read Placeholder/Spec-scaffolded for phases whose implementation-summaries record shipped state ✓ → contradiction confirmed real.
No P1 downgraded or marked false-positive. No P0 candidates.

## 6. Verdict & Next Steps

**CONDITIONAL** — release-ready after the parent-control-doc reconciliation (items R1–R6). No code changes required; no behavioral risk. Remediation tracked in this packet and applied directly (governance-sensitive metadata; not a code-fix workload).
