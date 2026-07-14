# Iteration 5 — Traceability: YAML Parity + Advisor Coverage Cross-Check

## Dispatcher
- **Run**: 5 of 10
- **Mode**: review
- **Dimension**: traceability
- **Focus**: traceability:yaml-parity — diff `if_cli_opencode` blocks across the 4 deep-* YAML files; cross-check `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` against actual YAML usage; verify advisor coverage parity vs other cli-* skills; check cross-runtime mirror surface
- **Budget profile**: scan (target 9, soft max 12, hard max 13)
- **Tool calls used**: 9
- **Status**: complete

## Files Reviewed
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` (lines 717-738)
- `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` (lines 649-670)
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` (lines 781-802)
- `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` (lines 758-779)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` (full, 49 lines)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` (lines 1-170)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` (lines 200-230)
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` (lines 1-45)
- `.opencode/skills/cli-opencode/SKILL.md` (lines 1-30)
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/006-cli-opencode-executor/implementation-summary.md` (lines 28-92)

## A-E Verdict Summary

| ID | Focus area                                                                | Verdict     | Evidence anchor                                                                            |
|----|---------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| A  | Branch parity across 4 `if_cli_opencode` blocks (research/review × auto/confirm) | **PASS — perfect parity** | All 6 pair-diffs return zero output; blocks are byte-identical                              |
| B  | Advisor coverage for cli-opencode (alias canonicalization vs scoring)     | **DEFECT (REFRAMED P2-027 → P2-027r)** | Strategy claim was category error; real defect is asymmetric scoring vs cli-codex          |
| C  | EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] vs YAML usage cross-trace      | **PARTIAL** | 3 of 4 declared flags actually wired; sandboxMode declared but unused (already P1-028)     |
| D  | Self-invocation guard — additional surfaces beyond cli-opencode SKILL.md  | **PASS with caveat** | YAML note at line 802 + multi-ai-council mirror are the only other mentions; consistent    |
| E  | Cross-runtime mirror parity (`.claude/`, `.gemini/`, `.codex/`)           | **PASS**    | cli-opencode SKILL.md is single-source; only `multi-ai-council` agent mirrors mention it (intentional) |

## Findings — New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **REFRAMED: P2-027 was a category error; the actual advisor defect is asymmetric scoring lane coverage** — `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:11`
   - **Description**: The original P2-027 (iter 1) claimed "cli-opencode missing from `aliases.ts`" — re-investigation in this iteration shows that's a false framing. `aliases.ts:5-27` is the **command-canonicalization table** (`deep-research`, `deep-review`, `memory:save`, `create:agent`, `create:testing-playbook`) — it does NOT register cli-* skills, and **none** of `cli-codex`, `cli-gemini`, `cli-claude-code` appear there either. So cli-opencode's absence from aliases.ts is consistent with siblings, not a gap. **However**, the actual advisor scoring lane in `explicit.ts` reveals genuine asymmetric coverage: line 11 has `codex: [['cli-codex', 0.9]]` and `fusion.ts:217` has a context-bonus rule for cli-codex, but `explicit.ts:39` has `opencode: [['sk-code', 1]]` — meaning the token "opencode" routes operators to the OpenCode component-quality skill (`sk-code`), NOT to the cli-opencode dispatcher skill. Phrases at lines 163-166 (`'opencode skill'`, `'opencode agent'`, `'opencode command'`, `'opencode plugin'`) all point to `sk-code`. There is NO equivalent of `codex: cli-codex` for the cli-opencode skill. When an operator types "use cli-opencode", "dispatch to opencode CLI", or "opencode CLI for deep-review", the advisor will boost `sk-code` but not the dispatcher skill.
   - **Recommendation**: Add a phrase boost in `explicit.ts:128+` (PHRASE_BOOSTS section) for `'cli-opencode'` and `'opencode cli'` pointing to the `cli-opencode` skill at confidence ~0.95 (sibling parity with `cli-codex`); leave the bare `opencode` token alone (legitimate for sk-code). Optional: add a fusion rule analogous to `fusion.ts:217` so `\b\.opencode\/(commands|agents|skills)\b` also boosts `system-spec-kit` rather than ambiguously hitting cli-opencode.
   - **Finding class**: instance-only
   - **Scope proof**: explicit.ts full token + phrase tables read (lines 1-170); aliases.ts full file read (49 lines); cli-codex (lane scoring) vs cli-opencode (no lane scoring) asymmetry is direct file-comparison evidence; fusion.ts context-bonus rules read (line 200-230)
   - **Affected surface hints**: `lanes/explicit.ts:11 (codex token)`, `lanes/explicit.ts:39 (opencode token routes to sk-code)`, `lanes/explicit.ts:163-166 (opencode phrase boosts route to sk-code)`, `fusion.ts:217 (cli-codex fusion rule, no cli-opencode analog)`

2. **Strategy doc + iter-1 narrative claim cli-opencode "advisor alias" was added — narrative drift versus actual implementation surface** — `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md:33`
   - **Description**: Strategy doc line 33 lists `aliases.ts — advisor alias for cli-opencode` as one of the 6 surfaces 101 touched. Iter-1 finding P2-027 then framed the "missing alias" as a defect. Live grep across `aliases.ts`, `explicit.ts`, `fusion.ts`, `lanes/` shows ZERO cli-opencode references in any advisor scorer file. 101's own implementation-summary.md (lines 52-67 "Files Modified" table) does NOT list `aliases.ts` — it lists only `executor-config.ts` (twice), 4 YAML files, and the `dist/` rebuild. **The strategy doc's surface inventory was wrong, not the implementation.** This is a small but real traceability defect: the strategy claim survives downstream into the planning packet unless corrected.
   - **Recommendation**: Update strategy doc line 33 to remove `aliases.ts` from the 6-surface inventory, OR document that 101 deliberately did not extend the advisor (which is the correct design — advisor extension is a separate concern). 5 surfaces is the accurate count: `executor-config.ts`, 4 YAMLs.
   - **Finding class**: instance-only
   - **Scope proof**: 101 implementation-summary.md:52-67 read; strategy doc line 33 read; advisor scorer directory grep returns 0 hits for cli-opencode
   - **Affected surface hints**: `102/review/deep-review-strategy.md:33`, `101/implementation-summary.md:52-67`

## Traceability Checks

| Protocol            | Status   | Evidence |
|---------------------|----------|----------|
| spec_code           | pass     | All 4 `if_cli_opencode` blocks byte-identical (6 pair-diffs all empty); 101 implementation-summary's "5 surfaces" claim matches code (executor-config + 4 YAMLs); strategy's "6 surfaces" claim is the drift |
| checklist_evidence  | pass     | EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] declares `[model, reasoningEffort, sandboxMode, timeoutSeconds]`; cross-trace: model=4/4 used, reasoningEffort=4/4 used (via optional_variant_flag), sandboxMode=4/4 declared-not-used (P1-028), timeoutSeconds=4/4 used |
| runtime_parity      | pass     | cli-opencode SKILL.md is single-source-of-truth; only `multi-ai-council` agent (mirrored across .opencode/.claude/.gemini/.codex) mentions it intentionally; no runtime-specific cli-opencode tooling expected (cli-opencode IS the OpenCode dispatcher, not a runtime mirror target) |

## Integration Evidence

```yaml
yamlBranchParity:
  pair_diffs_run: 6 # research_auto vs research_confirm, research_auto vs review_auto, review_auto vs review_confirm, research_confirm vs review_confirm, plus 2 transitive
  output_lines_total: 0
  conclusion: byte-identical
  blocks:
    - spec_kit_deep-research_auto.yaml:717-738
    - spec_kit_deep-research_confirm.yaml:649-670
    - spec_kit_deep-review_auto.yaml:781-802
    - spec_kit_deep-review_confirm.yaml:758-779

executorFlagCrossTrace:
  schema_declared: ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds']
  model_yaml_uses: 4/4 (line 720/652/784/761)
  reasoningEffort_yaml_uses: 4/4 (via optional_variant_flag → --variant; render_hint at line 730/662/794/771)
  sandboxMode_yaml_uses: 0/4 (declared-but-ignored; only mentioned in note explaining the gap; SUBSUMED BY P1-028)
  timeoutSeconds_yaml_uses: 4/4 (timeout_seconds: "{config.executor.timeoutSeconds}" line 728/660/792/769)

advisorCoverageMatrix:
  cli-codex:
    explicit_token_boost: lanes/explicit.ts:11 (codex → cli-codex 0.9)
    fusion_rule: fusion.ts:217 (\.codex/agents context bonus)
    aliases_canonical_id: NOT_PRESENT (consistent with all cli-* skills)
  cli-opencode:
    explicit_token_boost: NONE
    fusion_rule: NONE
    aliases_canonical_id: NOT_PRESENT (consistent with all cli-* skills)
  cli-gemini:
    explicit_token_boost: NONE (token 'gemini' not in TOKEN_BOOSTS)
    fusion_rule: NONE
    aliases_canonical_id: NOT_PRESENT
  cli-claude-code:
    explicit_token_boost: NONE
    fusion_rule: NONE
    aliases_canonical_id: NOT_PRESENT
  asymmetry: cli-codex is the only cli-* skill with a dedicated lane scoring entry; cli-opencode lacks parity AND its bare token routes elsewhere (sk-code). cli-gemini and cli-claude-code lack scoring too, but their tokens 'gemini' and 'claude' don't conflict (no competing skill).

crossRuntimeMirror:
  cli-opencode_SKILL.md: .opencode/skills/cli-opencode/SKILL.md (single source)
  mirrors_mentioning_cli-opencode:
    - .claude/agents/multi-ai-council.md (intentional cross-AI council reference)
    - .gemini/agents/multi-ai-council.md (mirror)
    - .codex/agents/multi-ai-council.toml (mirror)
  no_runtime_specific_cli-opencode_tooling: confirmed (and intentional — cli-opencode dispatches OpenCode itself, no runtime-mirror logic)

selfInvocationGuardSurfaces:
  skill_level: cli-opencode/SKILL.md:12,54-96 (3-layer detection contract)
  yaml_level_4_branches: spec_kit_deep-{research,review}_{auto,confirm}.yaml note line 738/670/802/779 ("cli-opencode self-invocation guard: ... cli-opencode skill SKILL.md §SELF-INVOCATION PROHIBITED contract is the authoritative gate")
  enforcement: convention-only (already P2-031); but documented consistently across all 4 YAML branches (parity holds)

strategyDocDrift:
  claim_line: 102/review/deep-review-strategy.md:33
  claim_text: "aliases.ts — advisor alias for cli-opencode"
  reality: aliases.ts has 0 cli-opencode references; 101 implementation-summary.md:52-67 lists only executor-config.ts + 4 YAMLs (no aliases.ts mention)
  surfaces_count_actual: 5 (executor-config.ts, 4 YAMLs); strategy claims 6
```

## Edge Cases
- **Strategy doc drift detected mid-review**: strategy line 33 inventory was authored speculatively from 101 narrative, not from 101 code. Reframed P2-027 captures this as finding 2 (instance-only). Did NOT broaden to a P1 because (a) the strategy doc is review-internal-only and not consumed by downstream gates beyond this review, (b) the narrative drift does not affect any code shipping decisions — 101 wiring is correct as-implemented, the strategy doc just over-listed it.
- **Token "opencode" intentionally routes to sk-code**: explicit.ts:39 mapping is correct for the dominant case (operators saying "review the opencode skill" mean the platform component, not the dispatcher). The defect is the absence of a phrase boost specifically for `'cli-opencode'` / `'opencode cli'` to give the dispatcher its own lane. This is genuinely P2 — affects discoverability, not correctness.
- **In-process advisor probe failed to load**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` imports `text.js` which is a TypeScript compilation artifact (not present at source-tree path). Probe fell back to source-text inspection, which gave equivalent evidence. Did NOT escalate as a finding — the import works at runtime via the built `dist/` tree (it's a compilation concern, not a source defect).
- **No findings ratio inflation**: 2 NEW P2 (one is a REFRAME of an iter-1 P2, one is a strategy-doc drift P2). Reframe is not a fresh finding — it's a refinement that REPLACES iter-1's P2-027 understanding with a more accurate framing. Counted at 0.5x weight per protocol.

## Confirmed-Clean Surfaces
- All 4 `if_cli_opencode` YAML branches: byte-identical parity (6 pair-diffs, all empty). The shipped wiring is consistent; any defect found in one branch applies symmetrically to all four.
- EXECUTOR_KIND_FLAG_SUPPORT cross-trace for `model`, `reasoningEffort`, `timeoutSeconds`: 4/4 wired correctly across all 4 YAMLs.
- `aliases.ts` schema: cli-opencode absent is consistent with sibling cli-* skills (none are aliased).
- Cross-runtime mirror surface: no drift detected. cli-opencode is single-source by design.
- `multi-ai-council` agent already mirrors cli-opencode mentions across all 4 runtimes — that mirror chain is intact.

## Ruled Out
- **Claim**: "if_cli_opencode YAML branches drift between research vs review or auto vs confirm" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: 6 pair-diffs all return zero output; blocks are byte-identical. P1-027 (--pure missing) and P1-028 (sandboxMode unused) apply uniformly across all 4 branches as cross-consumer findings, not per-branch drifts.
- **Claim**: "cli-opencode missing from aliases.ts is a real gap" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: aliases.ts is a command-canonicalization table; no cli-* skill is registered there. Iter-1 P2-027 framing was a category error. REFRAMED as actual asymmetric advisor coverage defect (finding 1 above).
- **Claim**: "cli-opencode needs cross-runtime mirror tooling like cli-codex/cli-claude-code" → **Disposition**: ruled_out_by_design. **Note**: cli-opencode IS the OpenCode dispatcher; the calling AI is always external (Claude/Codex/Gemini/raw shell). The skill itself is the single source. multi-ai-council agent mirrors are the only intentional cross-runtime references and they are intact.
- **Claim**: "Self-invocation guard at YAML level should be runtime-enforced not convention" → **Disposition**: subsumed_by_P2_031. **Note**: Already captured in iter-4 as P2-031 (cross-consumer cross-runtime). Not re-flagged.
- **Claim**: "Whole `if_cli_opencode` block missing from one of the 4 YAMLs" → **Disposition**: ruled_out. **Note**: All 4 branches present at lines 717/649/781/758 with identical structure (verified via grep for "if_cli_opencode:" header; 4/4 hits).

## Next Focus
- **Dimension**: maintainability
- **Focus area**: doc anchors, dead refs in 100 + 101, executor descriptions across runtime mirrors, comment hygiene at the schema↔YAML wiring boundary that birthed P1-028
- **Reason**: dimension queue advances per strategy item 5 (iter 7); this iteration completes traceability sufficiently to rotate. 1 dimension remains (maintainability). Iter 7 in original queue but advancing early due to clean traceability close. Iter 6 (second traceability pass) is unnecessary — perfect YAML parity + accurate executor cross-trace + single-source advisor evidence leaves no traceability stones unturned for the cli-opencode wiring focus.
- **Rotation status**: rotating to next dimension (maintainability); skipping planned 2nd-traceability iter
- **Blocked carry-forward**: F2 cli-opencode null-model (BLOCKED iter-3); P1-026 hidden regression (BLOCKED iter-2); buildCopilotPromptArg missing implementation (BLOCKED iter-4); --dir injection (BLOCKED iter-4); shell-layer prompt-injection (BLOCKED iter-4); Stop hook env override bypass (BLOCKED iter-4)
- **Productive carry-forward**: in-process source-text inspection on advisor scorer (PRODUCTIVE iter-5; effective when module load fails due to TS-compile artifact dependency); cross-trace tables for schema vs implementation (PRODUCTIVE iter-3-5)
- **Required evidence**: spot-check 100 + 101 doc anchors against live code; verify multi-ai-council mirror parity across .opencode/.claude/.gemini/.codex; check cli-opencode SKILL.md description budget against `doctor:skill-budget` thresholds; check for dead "TODO/FIXME" markers in 100/101 file modifications
- **Recovery note**: 2 NEW P2 findings (P2-027r reframe + new strategy-drift P2); P0/P1 counts UNCHANGED (still 0 P0, 3 P1); no severity escalation. Total findings: 0 P0, 3 P1, 5 P2 (1 reframed, 4 fresh including this iter's strategy-drift one).
