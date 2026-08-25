# Deep Review Report — Gateway-Alignment Surface

- Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/014-gateway-alignment-review`
- Review target: leaf agent prompts (deep-research, deep-review, deep-alignment, ai-council) across six runtime agent directories; 16 orchestrator YAMLs under `.opencode/commands/deep/assets/`; 8 deep command docs; `AGENTS.md`; append gateway `append-mode-event.cjs`; 013 guard `check-agent-gateway.sh`
- Execution: fan-out, 2× cli-pi lineages (cline/x-ai/ox-alpha @xhigh; openrouter/stealth/ox-alpha), concurrency 2, stop policy `max-iterations`, 20 iterations total
- Date: 2026-08-25

## 1. Executive Summary

- **Overall verdict: FAIL**
- hasAdvisories: false
- Active findings: **P0 = 1, P1 = 5, P2 = 4** (10 unique after cross-lineage dedup)
- Scope summary: the review hunted for what the 013 gateway-alignment fix and its read-only audit missed. It found exactly that class of residue: a shipped three-way contradiction in the state-write contract itself (P0), decommissioned-MCP and pre-gateway doctrine still taught by prompts/SKILL.mds, confirm-mode YAMLs dispatching full-write CLI leaves without structural containment, and a conformance guard that fails open.

The loop machinery's own write contract is self-contradictory in shipped artifacts. Until F-008 is resolved, contract-clean leaves can be deadlocked or routed around the gateway depending on which artifact an executor happens to follow.

## 2. Planning Trigger

`/speckit:plan` **is required** (verdict FAIL).

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": 10,
  "remediationWorkstreams": [
    "WS1 (P0): reconcile the state-write contract across agent prompt, prompt-pack template, runtime refresh, and validator so exactly one write path (the append gateway) is instructed, permitted, and enforced",
    "WS2 (P1): remove decommissioned sequential_thinking registration from ai-council prompts/agent metadata except where genuinely still registered (.pi)",
    "WS3 (P1): port the alignment leaf's untrusted-target prompt-injection guard into research/review leaves and their prompt packs",
    "WS4 (P1): rewrite mode SKILL.mds state-writer doctrine from 'reduce-state.cjs is the SINGLE state writer' to the gateway-owned model",
    "WS5 (P1): add structural write-containment to confirm-mode research/review cli-opencode dispatch branches",
    "WS6 (P1): make check-agent-gateway.sh fail closed on unresolvable agents with a checked-count floor assertion"
  ],
  "specSeed": [
    "Amend 036 packet scope (or successor packet) to cover prompt-pack template direct-append instructions and validator/gateway contract reconciliation",
    "Record decision: single canonical state-write path = append gateway; all other artifacts must describe, never bypass, it"
  ],
  "planSeed": [
    "T1: fix prompt-pack-iteration.md.tmpl (review + siblings) to route records through append-mode-event.cjs instead of `>> {state_log}`",
    "T2: reconcile verify-iteration.cjs expectations with gateway receipts (latest-record-wins already present at :165-170)",
    "T3: strip sequential_thinking from .opencode/.claude ai-council prompts; decide .pi/mcp.json fate",
    "T4: copy deep-alignment.md:25 injection-guard block into deep-research/deep-review leaves + prompt packs",
    "T5: update deep-review/deep-research/deep-alignment/deep-ai-council SKILL.mds §state-writer doctrine",
    "T6: port auto-YAML cli-opencode containment (worktree/dirty-path/recovery-baseline checks) into confirm YAMLs",
    "T7: harden check-agent-gateway.sh: count skipped agents, assert floor, exit non-zero on unresolvable targets"
  ],
  "findingClasses": [
    "correctness/shipped-contract-contradiction",
    "correctness/coherence",
    "security/missing-validation",
    "traceability/doc-contradiction",
    "security/containment-gap",
    "traceability/silent-validation-degradation",
    "maintainability/guard-brittleness",
    "maintainability/doc-drift-risk",
    "security/guard-regex-depth",
    "traceability/terminology-conflation"
  ],
  "affectedSurfacesSeed": [
    ".opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl",
    ".opencode/skills/system-deep-loop/deep-review/assets/alignment-prompt-pack.md.tmpl",
    ".opencode/agents/deep-review.md", ".claude/agents/deep-review.md",
    ".opencode/agents/ai-council.md", ".claude/agents/ai-council.md", ".pi/mcp.json",
    ".opencode/skills/system-deep-loop/deep-review/SKILL.md",
    ".opencode/skills/system-deep-loop/deep-research/SKILL.md",
    ".opencode/commands/deep/assets/deep-research-confirm.yaml",
    ".opencode/commands/deep/assets/deep-review-confirm.yaml",
    "specs/system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment/scripts/check-agent-gateway.sh",
    ".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs (TOOL deferred item)"
  ],
  "fixCompletenessRequired": true
}
```

`fixCompletenessRequired` is set because WS3/WS5/WS6 are security-adjacent (injection guard, write containment, fail-open guard); closed-gate replay with file:line/command evidence is required before any future STOP may clear them.

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence (verified this synthesis) |
|----|-----|-----------|-------|------------------------------------|
| F-008 | **P0** | correctness | Three-way state-write contract contradiction: agent prompt (gateway-only) vs prompt pack (direct append) vs runtime (no non-research refresh); validator deadlocks contract-clean leaves | tmpl(review):117-118 instructs `echo '<json>' >> {state_log}`; `.opencode/agents/deep-review.md:250` mandates gateway `--event-json <record file>` ≠ multi-line delta; zero delta files produced across 20 iterations corroborates runtime leg; `verify-iteration.cjs:167` latest-record-wins lookup |
| F-001 | P1 | correctness | ai-council prompts mandate decommissioned sequential_thinking MCP server; only .pi still registers it | `.opencode/agents/ai-council.md:22` lists `sequential_thinking`; AGENTS.md:391 declares it decommissioned |
| F-002 | P1 | security | Research/review leaves + dispatch templates lack the untrusted-target prompt-injection guard the loop protocol mandates; alignment leaf demonstrates the pattern | loop-protocol.md:280 confirms full-workspace cli-opencode access; `deep-alignment.md:25` carries the guard pattern; review/research packs lack it |
| F-003+P1-002 | P1 | traceability | Mode SKILL.mds teach pre-gateway doctrine ("reduce-state.cjs is the SINGLE state writer") contradicting their own leaf prompts and the reducer's actual outputs — merged cline+openrouter duplicate | `deep-review/SKILL.md:60` verbatim SINGLE-writer claim; `.opencode/agents/deep-review.md:250` gateway-only; `deep-research/SKILL.md:272` same doctrine |
| P1-001 | P1 | security | Confirm-mode research/review YAMLs dispatch cli-opencode leaves with full write access but omit structural write-containment | `deep-research-confirm.yaml:1060+` raw `opencode run` without the worktree/dirty-path/recovery-baseline guards present in the auto-YAML branch |
| P1-003 | P1 | traceability | Guard exits 0 while silently skipping unresolvable agents; no checked-count floor assertion | `check-agent-gateway.sh:26-31` `|| continue` before counter increment; no floor check near :56-60 |
| P2-001 | P2 | maintainability | ASCII flow arrows adjacent to state-file names may desensitize grep guards | `.claude/agents/deep-research.md:75`, `.codex/agents/deep-research.toml:79` |
| P2-002 | P2 | maintainability | Duplicated sandbox-capability prose notes across YAMLs rot silently when capability lands | `deep-research-confirm.yaml:1077` |
| P2-003 | P2 | security | Single `>` truncate, `tee` pipe, backtick `--event-json` evade guard checks B/D; guard never scans YAMLs/docs | `check-agent-gateway.sh:35-50` regex coverage |
| P2-004 | P2 | traceability | deep-research SKILL.md labels gateway event input a "JSONL delta" (delta-vs-payload conflation the fix did not reach) | `deep-research/SKILL.md:272` |

All entries: disposition `active`. Full evidence arrays live in `review/deep-review-findings-registry.json`.

## 4. Remediation Workstreams

Ordered:
1. **WS1 (P0)** — F-008 contract reconciliation (blocks everything downstream: every future iteration's write path depends on it)
2. **WS2–WS6 (P1)** — F-001, F-002, F-003+P1-002, P1-001, P1-003
3. **Advisories (P2)** — P2-001..P2-004 (non-blocking; batch with touching surfaces)

## 5. Spec Seed

- Extend the 036 innovation packet (or open a successor) whose acceptance criteria include: zero artifacts instructing direct `{state_log}` appends; guard fails closed; containment parity between auto and confirm dispatch branches.
- Decision record: append gateway is the only canonical state-write path; templates may reference it but never bypass it.

## 6. Plan Seed

See Planning Packet `planSeed` T1–T7. Suggested order: T1 → T2 → T7 → T5 → T4 → T6 → T3.

## 7. Traceability Status

Core protocols:
- **Spec vs Code**: executed — findings cite shipped-artifact contradictions against AGENTS.md/YAML contracts.
- **Checklist vs Evidence**: exempt (this review packet carries no checklist.md; AC_COVERAGE: **exempt**).

Overlay protocols:
- **SKILL.md vs Agent**: executed — produced F-003+P1-002, P2-004.
- **Agent Cross-Runtime**: executed — produced P2-001 (`.claude` vs `.codex` drift surface).

Resource Map Coverage: resource-map.md not present at parent level; skipping coverage gate (fan-out layout creates no parent-level config/state for the emitter; per-lineage reports carry lineage-local synthesis).

## 8. Deferred Items

- **TOOL (non-target, elevated visibility): `fanout-merge.cjs:759` field-name drift** — filter requires `finding.status === 'active'` while lineage registries emit `disposition: active`; result was a silent empty PASS/0/0/0 merge of 11 real findings (first attempt additionally raced the cline final registry write). Any release gate consuming fanout-merge output would have recorded PASS over an active P0. Fix belongs to the deep-loop runtime packet, not this review's target scope; logged as `schema_mismatch` event in `deep-review-state.jsonl`.
- **Zero delta streams**: neither leaf wrote `deltas/iter-*.jsonl` this run; structured-delta consumers ran on registry/state-log fallbacks. Track alongside WS1.
- Parent-level `resource-map.md`: not emitted (see §7).
- openrouter lineage salvage: 12 timestamp-anomaly records during upstream 429 window; telemetry-only.

## Dimension Expansion Map

Breadth record only (no pivots fired; convergence_mode=default):
- Completed pivots: none · Failed pivots: none · Audited overrides: none
- Selected directions: cline → per-surface deep passes (prompt packs, runtime, validator, guards, cross-runtime); openrouter → breadth passes incl. broadened delta-payload-conflation sweep (iter 8)
- Remaining frontier: adversarial nested-dispatch probing of the six runtime directories beyond static contract reading

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)* — lineage leaves emitted no v2 searchCoverage/candidateCoverage structures this run.

## Audit Appendix

- Convergence summary: both lineages ran to the `max-iterations=10` ceiling under `stop_policy=max-iterations` (convergence telemetry only). cline final ratios trended upward late (iter 7: 0.60) then exhausted; openrouter converged toward ratio 0 by iter 10.
- Coverage summary: 4/4 dimensions covered; 20 iterations; 11 raw findings deduped to 10 active (1 cross-lineage merge).
- Adversarial self-check: all P0/P1 citations re-verified against source during synthesis (verbatim line matches listed in §3). Severity referee: F-008 held at P0 (shipped-contract blocker in the loop's own machinery).
- Ruled out: gateway `--event-json` pointing at multi-line delta/state file (not found in current artifacts — the 013 fix appears to have landed this one); unmatched leaf write sites in the four resolved agent prompts beyond those registered above; runtime stragglers outside the four resolved agents (none found in six-directory scan).
- Sources reviewed: 20 iteration files (both lineages), 2 lineage strategy/config/state logs, both lineage review-reports, fanout attribution + orchestration ledger, cited source files re-read at synthesis.
- Verdict derivation: strongest-restriction over lineages — cline active P0 ⇒ merged FAIL.

---

STATUS=FAIL PATH=specs/system-deep-loop/036-deep-loop-innovation/014-gateway-alignment-review
Next: `/speckit:plan [remediation]` · `/memory:save specs/system-deep-loop/036-deep-loop-innovation/014-gateway-alignment-review`
