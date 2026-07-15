# Deep Review Report — sk-prompt parent-hub merge (packet 124)

<!-- Machine-owned markers preserved for reducer re-runs -->
<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories: true)

- **Active findings**: 6 P1, 4 P2, 0 P0 — across 10 iterations (3 passes over 4 dimensions), fully converged (iteration 10 found zero new findings; dimension coverage 4/4; convergence score 1.0).
- **Executor**: GPT-5.5-fast (`openai/gpt-5.5-fast --variant high`) via cli-opencode, real dispatch each iteration, `stop_policy=max-iterations`.
- **Scope**: the completed 006-sk-prompt-parent merge (parent + 8 phase specs), the merged `sk-prompt` hub + both packets, the post-merge benchmark artifacts, and the touched command/agent referrers — 73 scope files.
- **Headline**: the merge itself is structurally sound (all findings are `correctness`-dimension referrer/consistency issues, none touch the hub topology, routing, or the validated spec-kit docs). The recurring theme is an **incomplete phase-006 referrer sweep** — several cross-references to the old flat paths and the renamed `/prompt` command survived. Distinct from that: three P1s are **pre-existing** command behaviors inherited unchanged through the `git mv`, not introduced by this merge.

## 2. Planning Trigger

`/speckit:plan` remediation is **recommended** (CONDITIONAL verdict with 6 P1). None are blocking; all are low-risk doc/reference fixes plus one optional hardening cluster.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 6, "P2": 4 },
  "remediationWorkstreams": [
    "WS-A: complete the phase-006 referrer sweep (merge-introduced stale refs) — R1, R4, R7, R1-P2, R8-P2-002",
    "WS-B: pre-existing command save-path hardening (inherited, out-of-merge-scope) — R2, R6, R9",
    "WS-C: doc-accuracy fixes — R3-P2, R8-P2-001"
  ],
  "specSeed": "Referrer-sweep completion + optional command save-path containment hardening for /prompt-improve.",
  "planSeed": "Fix 5 merge-introduced stale references; separately scope the 3 pre-existing path-safety P1s as command hardening.",
  "findingClasses": ["stale_command_path", "stale_skill_path", "tool_surface_contract_drift", "path_escape", "active-model-doc-drift", "traceability-followup-guidance"],
  "affectedSurfacesSeed": [".opencode/agents/prompt-improver.md", ".opencode/skills/sk-prompt/prompt-models/", ".opencode/commands/prompt-improve.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### Merge-introduced (phase-006 referrer-sweep gaps) — WS-A

| ID | Sev | File:line | Finding | Adjudication | Fix |
|----|-----|-----------|---------|--------------|-----|
| R1-P1-001 | P1 | `.opencode/agents/prompt-improver.md:62` | Integration table still routes to the removed `/prompt` command via `.opencode/commands/prompt.md` | **CONFIRMED** — `prompt.md` is gone (git-mv'd to `prompt-improve.md`); path is dead. Functional impact low (agent is dispatched by name, not this table), so effective severity P2, but a real sweep miss. | Repoint to `/prompt-improve` + `.opencode/commands/prompt-improve.md`. Also present in `.claude/agents/prompt-improver.md` mirror. |
| R4-P1-001 | P1 | `.opencode/skills/sk-prompt/prompt-models/SKILL.md:4` | Packet frontmatter `allowed-tools: []` contradicts its router contract (needs Read/Glob to discover resources) | **CONFIRMED (severity nuance)** — the hub `mode-registry.json` toolSurface DOES grant `[Read, Grep, Glob]`, and the registry governs actual grants in the hub, so no runtime break. The packet's own `allowed-tools: []` is stale pre-fold metadata that should read `[Read, Grep, Glob]` to match. Effective severity P2. | Set packet frontmatter `allowed-tools: [Read, Grep, Glob]` to match the registry toolSurface (ADR-001 intent). |
| R7-P1-001 | P1 | `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:53` | Playbook global preconditions still assert pre-fold hub-root resource paths (`sk-prompt/SKILL.md` §2 routing) | **CONFIRMED** — those sections now live in `prompt-improve/SKILL.md`; the hub-root SKILL.md is thin routing-only. Stale precondition. | Repoint precondition paths to `prompt-improve/SKILL.md`. |
| R1-P2-001 | P2 | `.opencode/skills/sk-prompt/prompt-models/README.md:55` | README quick-start/verification cite non-existent top-level `prompt-models` skill path | **CONFIRMED** — top-level `sk-prompt-models/` dissolved; path is `sk-prompt/prompt-models/`. | Repoint to nested path. |
| R8-P2-002 | P2 | `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md:243` | Verification command points at removed top-level `prompt-models` path | **CONFIRMED** — same class as R1-P2. | Repoint to `sk-prompt/prompt-models/`. |

### Pre-existing (inherited through git-mv, NOT merge-introduced) — WS-B

| ID | Sev | File:line | Finding | Adjudication | Fix |
|----|-----|-----------|---------|--------------|-----|
| R2-P1-001 | P1 | `.opencode/commands/prompt-improve.md:454` | Custom save path lacks containment + overwrite guard | **CONFIRMED but PRE-EXISTING** — this logic is inherited verbatim from the old `/prompt` command; the merge git-mv'd the file and repointed the Read path only, it did not author this behavior. Real hardening gap, out of merge scope. | Add path containment + overwrite guard; scope as command hardening, not merge remediation. |
| R6-P1-001 | P1 | `.opencode/commands/prompt-improve.md:450` | New-spec-folder save branch derives a shell-created path from unsanitized topic text | **CONFIRMED but PRE-EXISTING** — same inheritance as R2. Path-injection surface via topic text. | Sanitize topic before path construction; command-hardening scope. |
| R9-P1-001 | P1 | `.opencode/commands/prompt-improve.md:93` | Save-location workflow still discovers/creates legacy `specs/` paths | **CONFIRMED but PRE-EXISTING** — inherited; the repo now prefers `.opencode/specs/`. | Prefer `.opencode/specs/` roots; command-hardening scope. |

### Doc-accuracy — WS-C

| ID | Sev | File:line | Finding | Adjudication | Fix |
|----|-----|-----------|---------|--------------|-----|
| R3-P2-001 | P2 | `008-cutover-and-rollout/implementation-summary.md:122` | Closeout follow-up names a live dispatch that later evidence shows insufficient | **CONFIRMED (advisory)** — a nuance note in the closed packet's own summary; historical, non-blocking. | Optional: annotate the follow-up note. |
| R8-P2-001 | P2 | `.opencode/skills/sk-prompt/prompt-models/README.md:84` | README maintainer framework map omits GLM-5.2 | **CONFIRMED** — GLM-5.2 is an active supported model; map is incomplete. | Add GLM-5.2 row. |

## 4. Remediation Workstreams

- **WS-A (merge-introduced, P1×2 + P2×2 effective)**: complete the phase-006 referrer sweep — 5 stale references to old flat paths / renamed command. All are 1-line doc repoints; lowest-risk, highest-alignment with the merge's own goal. Do first.
- **WS-B (pre-existing, P1×3)**: `/prompt-improve` command save-path containment + topic sanitization + spec-root preference. Real hardening but inherited, not caused by this merge — scope as a **separate** command-hardening packet, not as 124 remediation, to keep the merge's completion claim honest.
- **WS-C (doc-accuracy, P2×2)**: add GLM-5.2 to the README map; optionally annotate the closeout note.

## 5. Spec Seed

- The 124 packet's own completion claim stands (structurally canon-clean, STRICT 0 warnings) — WS-A is a *follow-up sweep completion*, not a defect in the shipped hub topology.
- A distinct `sk-prompt/prompt-improve` command-hardening packet should own WS-B, explicitly labeled pre-existing/inherited.

## 6. Plan Seed

1. WS-A: 5 doc repoints (prompt-improver.md ×2 runtimes, prompt-models SKILL.md frontmatter, prompt-improve playbook precondition, prompt-models README + context_budget).
2. WS-B: separate command-hardening packet — path containment, topic sanitization, spec-root preference for the save workflow.
3. WS-C: README GLM-5.2 row + optional closeout annotation.

## 7. Traceability Status

- **Core protocols**: spec_code — PASS (hub topology matches the 8 phase specs; all findings are peripheral referrers, not spec/impl contradictions). checklist_evidence — PASS (124's own validate.sh --recursive --strict is 0/0).
- **Overlay protocols**: skill_agent — 1 gap (R1: agent integration table stale). agent_cross_runtime — R1 present in both `.opencode/` and `.claude/` mirrors. feature_catalog_code — n/a. playbook_capability — 1 gap (R7: playbook preconditions stale).
- **AC_COVERAGE**: exempt (review target is a completed packet, not lifecycle-active implementation).

## 8. Deferred Items

- WS-B pre-existing command-hardening P1s: deferred to a separate packet by design (not merge-caused). Named follow-up, not silently dropped.
- D1-inter advisor scoring + D4 hallucination ablation from the benchmark work: still unscored (needs authored advisor-probe + ablation scenarios) — carried from the benchmark summary, orthogonal to this review.

## 9. Search Ledger

*No v2 search-depth state captured (v1 iteration records; router-mode leaf did not emit reviewDepthSchemaVersion:2).* Dimension coverage complete (4/4 across 3 passes); no reducer-owned searchDebt; convergence score 1.0.

## 10. Audit Appendix

- **Convergence**: 10 iterations, newFindingsRatio trend 1.0 → 0.45 → 0.25 → 0.2 → 0.0 → 0.25 → 0.17 → 0.22 → 0.1 → 0.0. Converged (final iteration zero new findings, all dimensions covered ≥2 passes).
- **Coverage**: correctness (iters 1,5,9), security (2,6,10), traceability (3,7), maintainability (4,8).
- **Executor**: real GPT-5.5-fast dispatch per iteration, route-proof verified (`target_agent: deep-review`, `resolved_route`, `agent_definition_loaded: true`, `mode: review`) on all 10 via `verify-iteration.cjs`.
- **Sources reviewed**: 73 scope files (9 spec folders, hub + 2 packets core files, benchmark artifacts, command + agent referrers).

Review verdict: CONDITIONAL
