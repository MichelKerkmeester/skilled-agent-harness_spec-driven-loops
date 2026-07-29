# Deep Review Report: sk- Prefix Mode Packet Rename (021-mode-sk-prefix-rename)

Lineage: `grok-4-5-high` | Session: `fanout-grok-4-5-high-1785304228962-ywfkk2` | Executor: cli-cursor (cursor-grok-4.5-high)
Target: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename` (spec-folder, phase parent)

---

## 1. Executive Summary

**Verdict: CONDITIONAL** | hasAdvisories: true

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 2 |
| Active P2 | 10 |
| Dimensions covered | 4/4 (correctness, security, traceability, maintainability) |
| Iterations | 10 (stopPolicy: max-iterations) |
| Convergence score | 0.88 (telemetry only) |
| Release-readiness | in-progress |

Machine identity rename is sound: all 21 `rename-map.json` rows match live `mode-registry.json` entries and packet directories; old packet directories are gone; hooks, commands, agents, leaf manifests, and sampled Lane C fixtures use sk-prefixed identities. Phase 009 already cleared the prior review’s parent Status/`planned` P1s.

This lineage is **CONDITIONAL** because two P1 residuals remain: (1) `sk-prompt/SKILL.md` still documents and fallback-loads pre-rename `prompt-improve` paths while the live router uses `sk-prompt-improve`; (2) parent `graph-metadata.json` `last_active_child_id` still points at phase 008 after phase 009 completed. Ten P2 advisories cover doc/test/advisor hygiene.

---

## 2. Planning Trigger

`/speckit:plan` (or a small remediation child) is required for hub-SKILL realignment and resume-pointer refresh — not a re-rename.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008", "F009", "F010", "F011", "F012"],
  "remediationWorkstreams": ["sk-prompt-hub-skill-realign", "last-active-child-refresh", "sk-design-skill-bare-key-sweep", "doc-hygiene-advisories"],
  "specSeed": ["Note held BLOCKED-BY-ROUTE-GOLD baselines in parent success criteria", "Optional lean-trio checklist exemption"],
  "planSeed": ["Rewrite sk-prompt/SKILL.md identities to sk-prompt-*", "Set last_active_child_id to 009-post-review-remediation", "Sweep sk-design ALWAYS/NEVER bare keys"],
  "findingClasses": ["spec-alignment", "completion-metadata", "doc-hygiene", "advisor-metadata", "test-hygiene"],
  "affectedSurfacesSeed": [".opencode/skills/sk-prompt/SKILL.md", "graph-metadata.json", ".opencode/skills/sk-design/SKILL.md"],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Disposition |
|----|-----|-----|-------|----------|-------------|
| F001 | P1 | correctness | sk-prompt SKILL pre-rename keys/paths + broken fallback | sk-prompt/SKILL.md:22,43,77,89,106-107; hub-router.json:5 | active (replayed iter 10) |
| F004 | P1 | traceability | last_active_child_id still 008 after 009 Complete | graph-metadata.json:43,103 | active (replayed iter 10) |
| F002 | P2 | correctness | Parent problem statement pre-rename examples | spec.md:35-37 | active |
| F003 | P2 | security | Fail-open post-edit hooks | claude-posttooluse.cjs:17-18 | active (pre-existing posture) |
| F005 | P2 | traceability | Parent lacks checklist.md / exemption | spec.md:24 | active |
| F006 | P2 | traceability | Success criteria omit held BLOCKED gold | spec.md:97; 008/009 impl summaries | active |
| F007 | P2 | maintainability | sk-design SKILL bare `interface`/`md-generator` rules | sk-design/SKILL.md:177,179,228,235 | active |
| F008 | P2 | maintainability | sk-doc registry prose still says create-*/ | sk-doc/mode-registry.json:15 | active |
| F009 | P2 | maintainability | Contract freeze citations look live | 002/.../contract.md:21-22 | active |
| F010 | P2 | correctness | sk-prompt-models cites prompt-models/assets | sk-prompt-models/SKILL.md:212 | active |
| F011 | P2 | traceability | leaf-resource-contract test old grammar | leaf-resource-contract.test.cjs:243-248 | active |
| F012 | P2 | maintainability | Dual bare+sk advisor keywords (Lane D) | description.json keywords; 009 summary | active (by design) |

---

## 4. Remediation Workstreams

**Lane A — sk-prompt hub SKILL (F001, F010).** Rewrite mode table, discriminator docs, layout tree, NEVER rules, and UNKNOWN_FALLBACK to `sk-prompt-improve` / `sk-prompt-models`; fix nested packet prose paths.

**Lane B — Resume pointer (F004).** Set `derived.last_active_child_id` to `.../009-post-review-remediation` (or re-save via generate-context after touching 009).

**Lane C — Design/doc hygiene (F007, F008).** Replace bare ALWAYS/NEVER keys in sk-design SKILL; update sk-doc registry contract prose to `sk-create-*`.

**Lane D — Advisories (F002, F003, F005, F006, F009, F011, F012).** Optional narrative/checklist/test/vocab cleanups; F012 is keep-by-decision until advisor re-baseline.

---

## 5. Spec Seed

- Parent `spec.md` §5: mention held BLOCKED-BY-ROUTE-GOLD 91 baselines as intentional out-of-scope router work (F006).
- Optional: lean-trio checklist exemption paragraph pointing at child checklists (F005).
- Problem statement: add “historical framing” label or update examples to sk-prefixed names (F002).

---

## 6. Plan Seed

1. Edit `.opencode/skills/sk-prompt/SKILL.md` (+ nested models SKILL prose) to match live registry/hub-router.
2. Refresh parent `graph-metadata.json` last_active to 009.
3. Sweep `.opencode/skills/sk-design/SKILL.md` ALWAYS/NEVER bare keys to `sk-design-interface` / `sk-design-md-generator`.
4. Patch sk-doc `mode-registry.json` advisorRoutingContract prose.
5. Optionally annotate contract.md freeze-time column; leave F012 keywords until a dedicated advisor packet.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | Registries/dirs/commands match map; hub SKILL prose gap (F001) |
| checklist_evidence | partial | Child checklists complete; last_active stale (F004); no parent checklist (F005) |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| feature_catalog_code | pass | sk-design catalog uses sk-design-interface paths |
| playbook_capability | pass | Hub playbook expected_intent sk-prefixed |

---

## 8. Deferred Items

- F003 fail-open hook posture (pre-existing warn-only design).
- F012 dual advisor vocabulary (Lane D keep-by-decision).
- F009 freeze-time citation labeling (documentation clarity only).
- F011 test fixture old-grammar sample (parser regression value).
- Clearing BLOCKED-BY-ROUTE-GOLD 91 (separate router packet; out of rename scope).

---

## 9. Audit Appendix

| Check | Result |
|-------|--------|
| Iterations markdown + JSONL deltas | 10/10 present |
| Dimension coverage | 4/4 |
| Adversarial P0/P1 replay | F001/F004 replayed iter 10; severities unchanged; no P0 |
| stopPolicy | max-iterations honored; convergence telemetry would have voted STOP after low-ratio tail |
| resource_map_present at init | false (gate skipped); synthesis emits coverage map below |
| Executor | cli-cursor / cursor-grok-4.5-high |
| Fanout artifact dir | `review/lineages/grok-4-5-high` |

Review verdict: CONDITIONAL
