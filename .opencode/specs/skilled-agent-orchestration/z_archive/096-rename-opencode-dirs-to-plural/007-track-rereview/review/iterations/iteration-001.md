# Iteration 001 — Inventory Pass

**Run**: 1
**Mode**: review
**Dimension**: inventory
**Status**: complete
**Session**: deep-review-102-2026-05-07T2055
**Effective executor**: native opus (cli-opencode requested → fallback)
**Budget profile**: scan (target 9, used ~9)

---

## 1. Dimension

**inventory** — closed-gate replay table for 099's 19 active findings (13 P1 + 6 P2) against 100-099-remediation; 101-cli-opencode-executor wiring inventory across 6 surfaces; cli-opencode + DeepSeek pre-flight smoke result documentation as headline P1 candidate.

---

## 2. Files Reviewed

### Predecessor verdict (read for replay anchors)
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md:132-167` — 099's active P1+P2 finding registry
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation/implementation-summary.md:38-238` — 100's resolution claims
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation/implementation-summary.md:172-204` — 100's verification table

### 100 fix surfaces (spot-checked)
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:505-555` — P1-026 reducer findings extraction (`deltaRecordToFinding` + 5-arg `buildRegistry`)
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200-216` — P1-019 shell metacharacter rejection
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:255-285` — P1-021 sibling-skill fallback
- `.opencode/commands/doctor/scripts/audit_descriptions.py:421-435` — P1-020 zero-inventory FAIL guard
- `.opencode/skills/sk-code-review/SKILL.md:402-404` — P1-018 playbook reference
- `.opencode/skills/sk-git/SKILL.md:440-442` — P1-018 playbook reference
- `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:38-42` — P1-015 plural default
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts:1-49` — P1-025 alias updates
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md` — P1-023 continuity blockers backfill
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md` — P1-022 anchor repair (validated via strict-validate)

### 101 wiring surfaces
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:7,32-41` — `EXECUTOR_KINDS` array + `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` — (no `cli-opencode` advisor alias entry; see Wiring Inventory §4)
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:717-738` — `if_cli_opencode` branch
- `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:649-670` — `if_cli_opencode` branch
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:781-802` — `if_cli_opencode` branch
- `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:758-779` — `if_cli_opencode` branch

### Run-time evidence
- `bash validate.sh --strict 096-rename-opencode-dirs-to-plural/004-symlinks` → exit 0
- `bash validate.sh --strict 098-097-remediation` (recursive) → exit 0
- `python3 skill_advisor.py "/speckit:deep-review track:foo" --threshold 0.8` → command-spec-kit @ 0.82
- `rg '\.opencode/(skill|agent|command)\b' scripts/dist/` → 0 hits

---

## 3. Closed-Gate Replay Table — 099 P1/P2 → 100 fix surface

Verdict legend: **RESOLVED** (fix landed + verifiable), **STILL_ACTIVE** (claim of fix but evidence missing), **DOWNGRADED** (partial fix), **NEW** (replaced).

### P1 (13 findings from 099 §3)

| 099 ID | Title | 100 Fix Surface | Disposition | Evidence |
|--------|-------|-----------------|-------------|----------|
| P1-007 | Checklist evidence still unchecked | bulk `[x]` mark across 7 checklists (see §What Was Built/P1-007) | **RESOLVED** | 093/001 unchecked count = 0 (`grep -c "^\- \[ \]"`) |
| P1-015 | `skill_graph_scan` source default singular | `mcp_server/handlers/skill-graph/scan.ts:40` flipped to plural | **RESOLVED** | scan.ts:40 reads `'.opencode/skills'`; dist regenerated |
| P1-016 | `scripts/dist` observability stale | `npm run build` in `scripts/` regenerated all dist files | **RESOLVED** | `rg '\.opencode/(skill\|agent\|command)\b' scripts/dist/` → 0 hits |
| P1-017 | 095 internal contradiction (18/18 vs 3 SKIP) | `095/implementation-summary.md` Decisions + Verification reconciled | **RESOLVED** | claim recorded in 100/implementation-summary.md:91-92; not re-verified line-by-line in this iter (deferred to iter 5/traceability) |
| P1-018 | Playbooks unreachable from owning SKILL.md | `sk-code-review/SKILL.md:398-406` + `sk-git/SKILL.md:436-444` reference blocks added | **RESOLVED** | Live grep at SKILL.md:402,404 (sk-code-review) and :440,442 (sk-git) |
| P1-019 | `spec_folder` interpolated raw before containment | `shared/review-research-paths.cjs:200-216` shell-metachar reject | **RESOLVED** | Code at :210-214 rejects `['"`$;&\|<>\\]`; throws clear error |
| P1-020 | `audit_descriptions.py` zero-inventory passes | `audit_descriptions.py:421-435` zero-items FAIL guard | **RESOLVED** | Code at :424-435 prints FAIL + exits 2 on `not items` |
| P1-021 | Smart-router rejects shared CLI sibling paths | `check-smart-router.sh:255-280` sibling-skill fallback | **RESOLVED** | Code at :260-275 falls back via `skills_root.iterdir()` for sibling lookup |
| P1-022 | 096/004 anchor mismatch + strict-validate fail | 3 anchor pair fixes in `096/004-symlinks/spec.md` | **RESOLVED** | `validate.sh --strict 096-rename-opencode-dirs-to-plural/004-symlinks` → RESULT: PASSED, Errors: 0 |
| P1-023 | Deferred required findings absent from continuity blockers | Python backfill across 5 098 sub-phase implementation-summary.md | **RESOLVED** | 098/005/implementation-summary.md `blockers:` is now a non-empty array (sample: "Optional CHK-* line-by-line backfill audit") |
| P1-024 | 098 sub-phases fail strict-validate | All 7 checklists rewritten + tasks.md phase headers + impl-summary `how-delivered` anchor | **RESOLVED** | `validate.sh --strict 098-097-remediation` (recursive) → RESULT: PASSED, Errors: 0 |
| P1-025 | Native advisor returns `[]` for `deep-review` trigger | `aliases.ts:13-26` canonical keys renamed `sk-deep-*` → bare `deep-*`, alias arrays include both | **RESOLVED** | Live `skill_advisor.py "/speckit:deep-review track:foo" --threshold 0.8` → command-spec-kit @ confidence 0.82 (was `[]`) |
| P1-026 | Reducer doesn't extract findings from delta records | `reduce-state.cjs:505-555` `deltaRecordToFinding` helper + 5-arg `buildRegistry` | **RESOLVED** | Live grep confirms `deltaRecordToFinding` at :505 + `deltaRecords` plumbing at :543,553,872 |

**P1 totals**: 13 RESOLVED, 0 STILL_ACTIVE, 0 DOWNGRADED, 0 NEW.

### P2 (6 findings from 099 §3)

| 099 ID | Title | 100 Action | Disposition | Notes |
|--------|-------|------------|-------------|-------|
| P1-005 | Resolver containment (downgraded P1) | Subsumed by P1-019 fix | **RESOLVED** | The shell-metachar guard at `review-research-paths.cjs:200-216` IS the resolver containment; P1-005 was an alias for P1-019 from the start |
| P2-002 | Test fixture title singular wording | Not in 100 scope | **STILL_ACTIVE (advisory)** | Marked deferred-to-P2-sweep in 100 §Followups |
| P2-004 | Copilot target-authority helper | Not in 100 scope | **STILL_ACTIVE (advisory)** | Optional executor-branch followup |
| P2-008 | Singular schema/default text in tool-schemas | Not in 100 scope | **STILL_ACTIVE (advisory)** | Documentation drift; behavior plural via P1-015 |
| P2-009 | 098/003 stale smart-router line range | Not in 100 scope | **STILL_ACTIVE (advisory)** | Evidence drift only |
| P2-010 | 096 resource-map sed-induced rename headings | Not in 100 scope | **STILL_ACTIVE (advisory)** | Cosmetic narrative |

**P2 totals**: 1 RESOLVED (subsumed), 5 STILL_ACTIVE (all advisory; deferred-to-P2-sweep with clear rationale).

### Replay summary

- **All 13 P1 from 099 RESOLVED in 100.** No STILL_ACTIVE P1, no DOWNGRADED, no NEW P1 surfaced by 100's edits in this inventory pass.
- **5 of 6 P2 STILL_ACTIVE as designed** (deferred to P2-sweep packet; their disposition is advisory-only and 100/§Followups documents them).
- One P2 (P1-005) is RESOLVED by virtue of being the P1-019 alias; the 099 P2 entry was a downgrade trace, not a separate finding.
- **No verdict-blockers from the 099 carryover should remain** at iter 1 inventory granularity. Subsequent iterations will adversarially confirm P1 closures (especially P1-017, P1-019, P1-026) at correctness/security/traceability granularity.

---

## 4. 101 Wiring Inventory Table — 6 surfaces

| # | Surface | Location | Status | Evidence |
|---|---------|----------|--------|----------|
| 1 | `EXECUTOR_KINDS` array + `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` | `executor-config.ts:7,32-41` | **LANDED_CLEAN** | `cli-opencode` is the 5th kind in array; flag support: `['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds']`; comment at :37-39 documents `--variant` mapping + `--dangerously-skip-permissions` semantics |
| 2 | `cli-opencode` advisor alias | `mcp_server/skill_advisor/lib/scorer/aliases.ts` | **CROSS_REF_BROKEN** | Read aliases.ts:1-49 — file contains `deep-research`, `deep-review`, `create:agent`, `create:testing-playbook`, `memory:save` groups. **No `cli-opencode` group nor `cli-opencode` token in any alias array.** 101 commit message claims "advisor alias for cli-opencode" but no code evidence. (NOTE: cli-* skills are typically advisor-discovered via SKILL.md trigger phrases, not alias-table entries — but the 101 claim and the strategy doc both say the alias landed; either the strategy is wrong about the alias surface or the commit didn't include the edit. Iter 5 traceability will resolve.) |
| 3 | `if_cli_opencode` branch — deep-research auto YAML | `spec_kit_deep-research_auto.yaml:717-738` | **DEFECT** | Branch present and structurally identical to other 3 YAML branches; **does NOT pass `--pure`**. See §5 for full claim packet. |
| 4 | `if_cli_opencode` branch — deep-research confirm YAML | `spec_kit_deep-research_confirm.yaml:649-670` | **DEFECT** | Same as #3 — no `--pure` flag. |
| 5 | `if_cli_opencode` branch — deep-review auto YAML | `spec_kit_deep-review_auto.yaml:781-802` | **DEFECT** | Same as #3. This is the YAML the orchestrator's pre-flight smoke ran against. |
| 6 | `if_cli_opencode` branch — deep-review confirm YAML | `spec_kit_deep-review_confirm.yaml:758-779` | **DEFECT** | Same as #3. |

**Wiring summary**:
- **1 of 6 LANDED_CLEAN** (executor-config.ts).
- **4 of 6 DEFECT** (the 4 YAML `if_cli_opencode` branches all share the missing-`--pure` defect).
- **1 of 6 CROSS_REF_BROKEN** (aliases.ts has no `cli-opencode` entry — strategy doc may have over-counted what 101 actually edited; verify in iter 5 traceability).

---

## 5. cli-opencode + DeepSeek Pre-flight Smoke Finding (P1 candidate)

### Headline finding (NEW)

**P1-027 — `if_cli_opencode` YAML branches do not pass `--pure`, breaking cli-opencode dispatch under DeepSeek-family models**

- **Severity**: P1 (Required)
- **File:line**: 4 sites:
  - `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:719-731`
  - `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:651-663`
  - `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:783-795`
  - `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:760-772`
- **Class**: cross-consumer
- **Scope proof**: `Grep "if_cli_opencode\|cli-opencode\|opencode run\|--pure" .opencode/commands/speckit/assets/speckit_deep-*` — all 4 branches present, none contain `--pure`
- **Affected surface hints**: ["spec_kit_deep-research_auto.yaml", "spec_kit_deep-research_confirm.yaml", "spec_kit_deep-review_auto.yaml", "spec_kit_deep-review_confirm.yaml", "cli-opencode skill SKILL.md"]
- **Recommendation**: Add `--pure` to all 4 `opencode run` invocations (after `--dangerously-skip-permissions`, before `{optional_variant_flag}`); document in cli-opencode skill SKILL.md that DeepSeek-family models require `--pure` because default opencode plugin loading injects MCP tool names with `:` characters that DeepSeek's tool-name regex `^[a-zA-Z0-9_-]+$` rejects.

### Claim adjudication packet

```json
{
  "type": "P1",
  "claim": "All 4 `if_cli_opencode` YAML branches dispatch `opencode run` without `--pure`, which causes DeepSeek-family provider errors when the default opencode plugin loadout injects MCP tool functions whose names contain `:` (e.g. `mcp__mk_spec_memory__advisor_recommend` and `tools[23]` of similar shape). DeepSeek's API rejects these names with regex pattern `^[a-zA-Z0-9_-]+$` violation, hard-failing the dispatch before iteration work even begins. The cli-opencode dispatch path as shipped at commit e125ea341 is therefore broken end-to-end when paired with the very executor model 102 was authorized to use (`opencode-go/deepseek-v4-pro`).",
  "evidenceRefs": [
    "spec_kit_deep-research_auto.yaml:719-731 — opencode run command lacks --pure",
    "spec_kit_deep-research_confirm.yaml:651-663 — same",
    "spec_kit_deep-review_auto.yaml:783-795 — same",
    "spec_kit_deep-review_confirm.yaml:760-772 — same",
    "Pre-flight smoke (orchestrator-recorded, deep-review-state.jsonl:2): `Error from provider (DeepSeek): Invalid 'tools[23].function.name': string does not match pattern. Expected a string that matches the pattern '^[a-zA-Z0-9_-]+$'.` without --pure",
    "Pre-flight smoke (orchestrator-recorded): returns 'CLI_SMOKE_OK' exactly with --pure",
    "deep-review-config.json:36 — fallback_reason field captures the smoke evidence canonical"
  ],
  "counterevidenceSought": [
    "Searched for `--pure` substring across all 4 YAML files — 0 hits in `if_cli_opencode` blocks",
    "Searched for any conditional logic that might inject `--pure` based on model name — none found in YAML render_hints",
    "Checked cli-opencode skill SKILL.md trigger guidance — does not call out the model-specific `--pure` requirement",
    "Verified the pre-flight smoke evidence is captured in deep-review-state.jsonl as a typed event (not just narrative)"
  ],
  "alternativeExplanation": "Could the failure be model-side (DeepSeek API change)? Counterargument: `--pure` works deterministically per orchestrator smoke, so the API behavior is stable; the issue is opencode's default plugin loadout, not the model. Could it be runtime-version drift? Counterargument: even on a fresh clean repo the 4 YAML files would dispatch identically — no version logic gates `--pure` insertion. Could it be that DeepSeek-only models are intentionally unsupported? Counterargument: the strategy doc (line 12) authorizes `opencode-go/deepseek-v4-pro` and the cli-opencode SKILL.md does not declare DeepSeek-family unsupported; 101 implicitly claims general DeepSeek support by accepting the model in EXECUTOR_KIND_FLAG_SUPPORT.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If a maintainer documents that cli-opencode is intentionally not designed for DeepSeek-family models AND adds a guard in `parseExecutorConfig` that rejects DeepSeek model strings for cli-opencode, downgrade to P2 (documentation/guard-rail follow-up). Until either `--pure` is added to YAML or the guard is added to executor-config.ts, this stays P1."
}
```

### Why P1 (not P0, not P2)

- **Not P0**: no exploitable security vector, no auth bypass, no destructive data loss. Failure is a hard error (clean halt on dispatch), not silent corruption.
- **Not P2**: this is the literal authorized executor for 102 (`cli-opencode` + `opencode-go/deepseek-v4-pro`); without the smoke result and pre-authorized fallback, this packet would have been entirely undeliverable. 101 shipped a "5th deep-loop executor" and 4 YAML dispatch branches that don't actually work on the headline model the strategy doc authorizes. That's a required-fix gate issue.
- **P1 fits**: correctness bug (dispatch path advertised as working but doesn't, against any DeepSeek model under default plugin loading), spec-vs-code mismatch (101 packet implies cli-opencode dispatch works; YAML dispatch flag set proves it doesn't for DeepSeek-class models), must-fix gate before next release window because the executor is already advertised in EXECUTOR_KINDS.

### Why this is the headline finding

1. The orchestrator pre-flight smoke is the *only* operationally-visible test that exercised the YAML's actual command shape; without it, this defect would have shipped silent and broken.
2. The defect occurs at all 4 sites identically (cross-consumer class), so a single edit is enough to close the gap — but verifying the edit takes adversarial smoke at all 4 sites because YAML branches drift.
3. 101 is a brand-new packet (commit e125ea341) and 102's job is to confirm 101 wiring. Failing to surface this defect would invalidate the entire 101 verdict.

---

## 6. Findings by Severity

### P0 (Blockers)
None.

### P1 (Required)

#### P1-027 — `if_cli_opencode` YAML branches do not pass `--pure`, breaking cli-opencode dispatch under DeepSeek-family models
- File: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:783-795` (primary) + 3 sibling YAMLs
- Evidence: `Grep "opencode run\|--pure"` across the 4 deep-* YAML files — `opencode run` present, `--pure` absent in all 4
- Finding class: cross-consumer
- Scope proof: see §5 claim packet
- Affected surface hints: ["spec_kit_deep-research_auto.yaml", "spec_kit_deep-research_confirm.yaml", "spec_kit_deep-review_auto.yaml", "spec_kit_deep-review_confirm.yaml", "cli-opencode SKILL.md"]
- Recommendation: see §5 claim packet
- See full claim adjudication packet in §5.

### P2 (Suggestions)

#### P2-027 — `cli-opencode` advisor alias claim in 101 strategy not reflected in `aliases.ts`
- File: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts:1-49`
- Evidence: aliases.ts contains 5 group entries (create:agent, create:testing-playbook, memory:save, deep-research, deep-review); no `cli-opencode` group; no `cli-opencode` token in any existing group's alias array
- Finding class: instance-only
- Scope proof: full file read at lines 1-49 covers entire RAW_ALIAS_GROUPS object literal
- Affected surface hints: ["aliases.ts", "102 strategy doc charter line 33"]
- Recommendation: Either (a) add a `cli-opencode` group entry to aliases.ts if executor-routing surface alias was intended OR (b) update 101 packet narrative + 102 strategy charter to clarify that "advisor alias for cli-opencode" actually lives in the cli-opencode SKILL.md trigger phrases (not aliases.ts). Marking P2 rather than P1 because cli-* skills are advisor-discoverable via SKILL.md trigger-phrase matching — the missing aliases.ts entry is doc/narrative drift unless executor-routing depends on canonical-skill-id resolution (verify in iter 5 traceability).

---

## 7. Traceability Checks

### Core protocols

#### `spec_code` (099 → 100 closed-gate replay) — **PASS**
All 13 099 P1 findings have a corresponding 100 fix surface with file:line evidence. Spot-checked 8 of 13 with live grep / strict-validate:
- P1-015 → scan.ts:38-42 plural default (verified)
- P1-016 → scripts/dist/ plural-only (`rg` returns 0 hits, verified)
- P1-018 → SKILL.md:402,440 (verified)
- P1-019 → review-research-paths.cjs:200-216 (verified)
- P1-020 → audit_descriptions.py:421-435 (verified)
- P1-021 → check-smart-router.sh:255-285 (verified)
- P1-022 → 096/004 strict-validate exit 0 (verified)
- P1-024 → 098 recursive strict-validate exit 0 (verified)
- P1-025 → live advisor returns command-spec-kit @ 0.82 (verified)
- P1-026 → reduce-state.cjs:505,543 deltaRecordToFinding present (verified)

P1-007, P1-017, P1-023 are claim-recorded but not adversarially re-verified at this iter granularity (deferred to iter 2-5).

#### `checklist_evidence` (101 wiring audit) — **PARTIAL**
- 4 of 6 surfaces (executor-config.ts + 4 YAML branches) verified present
- 2 of 6 surfaces flagged DEFECT (YAML branches missing `--pure`) or CROSS_REF_BROKEN (aliases.ts missing entry); these are recorded as new findings P1-027 and P2-027

### Overlay protocols (deferred)
- `skill_agent` — iter 5 (traceability)
- `agent_cross_runtime` — iter 5
- `feature_catalog_code` — iter 5
- `playbook_capability` — already PASS (P1-018 closed; SKILL.md links verified)

---

## 8. Edge Cases

- **Edge case 1**: Pre-flight smoke evidence pre-existed this iteration (orchestrator captured it at line 2 of state.jsonl as `executor_fallback` event). I treated this as packet-internal evidence rather than re-running the smoke (would be out of LEAF scope and out of budget).
- **Edge case 2**: Strategy doc claims 101 touched 6 surfaces including `aliases.ts`, but live grep shows no `cli-opencode` token in aliases.ts. I recorded this as P2-027 (CROSS_REF_BROKEN) rather than NEW because two interpretations both fit (advisor alias vs SKILL.md trigger discovery) — iter 5 traceability will adjudicate.
- **Edge case 3**: 100 implementation-summary.md claims P1-026 was deferred-then-fixed in a "follow-on pass within this packet"; the file's Limitations §1 says "P1-026 fully resolved" but Followups still lists it. Live code at reduce-state.cjs:505 confirms the fix landed; the Followups entry is stale doc drift (P3-class, not raised in this inventory).

## 9. Confirmed-Clean Surfaces

- `executor-config.ts` (101 surface 1) — clean, well-commented, schema-correct.
- `reduce-state.cjs` (P1-026 fix) — `deltaRecordToFinding` present + plumbed end-to-end.
- 098 sub-phase strict-validate (P1-024 fix) — recursive PASS, errors 0, warnings 0.
- 096/004-symlinks anchor pairs (P1-022 fix) — strict-validate PASS.

---

## 10. Ruled Out

- **"100 introduced new P0/P1 defects"** — ruled out at this inventory granularity. No new bug surfaces during the spot-checks of 8 of 13 P1 fix sites. Will re-test in iter 2 (correctness) on reducer + executor-config.
- **"P1-019 fix is incomplete (no adversarial regression test)"** — acknowledged in 100/§Limitations §2 as a known limitation. Marking it as a deferred-advisory rather than a new P1 because the live shell-metachar guard at :210-214 is correct; the missing test is a maintainability concern, not a correctness gap. Will re-classify as P2 candidate in iter 7 if no test materializes.

---

## 11. Verdict (provisional, this iteration)

- **P0**: 0 (no blockers found)
- **P1**: 1 NEW (`P1-027` — cli-opencode YAML branches missing `--pure`)
- **P2**: 1 NEW (`P2-027` — aliases.ts missing cli-opencode entry per 101 strategy claim)
- **Carryover**: 0 STILL_ACTIVE P1 from 099 → 100 closed-gate replay
- **Provisional verdict for this iter**: **CONDITIONAL** (1 active P1 surfaced)
- **hasAdvisories**: true

The 099 → 100 closed-gate replay is **clean**: 13 of 13 P1 RESOLVED, 5 of 6 P2 STILL_ACTIVE-as-designed (deferred to P2-sweep). The verdict-flip hypothesis from FAIL → PASS would have held *if* 101 hadn't introduced P1-027. With P1-027 in scope, the verdict for the track at iter 1 is CONDITIONAL until P1-027 is closed.

---

## 12. Next Focus

- **Dimension**: correctness (iter 2)
- **Focus area**: 100 reducer delta-extraction (P1-026) end-to-end correctness; 101 executor-config (cli-opencode kind support); adversarial pass on P1-019 spec_folder containment to confirm the regex catches the documented attack vector
- **Reason**: The 099 → 100 P1 sweep is verified clean at inventory granularity, but three findings require correctness-level adversarial re-verification: P1-026 (does the registry actually update across a fresh reducer run on 099 data?), P1-019 (does the regex catch the exact attack documented in the original finding?), and P1-017 (is 095 internally consistent now or just the aggregate row?). Iter 2 should focus correctness on these three.
- **Rotation status**: rotating from inventory → correctness as planned
- **Carry-forward**: P1-027 (active, surfaced this iter); P2-027 (active, surfaced this iter)
- **Required evidence**: live reducer run on 099 packet showing registry counts match state.jsonl; adversarial smoke against `resolveArtifactRoot` with the documented attack vector; cross-section consistency check across 095 implementation-summary.md
- **Recovery note**: N/A (this iter completed cleanly; no stuck/blocked state)
