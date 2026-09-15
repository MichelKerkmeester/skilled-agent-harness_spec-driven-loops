---
title: "wave1-glm iteration 003 — Angle 8: cross-CLI executor parity"
loop: review
lane: wave1-glm
session: fanout-wave1-glm-1789465945073-px9i6h
iteration: 3 of 5
angle: 8
dimension_primary: correctness
dimension_secondary: security
verdict: PASS
hasAdvisories: true
---

# Dimension / Focus

**Dimension:** correctness (primary), security (secondary).
**Focus (Angle 8):** the executor-kind vocabulary and its flags/limits across five surfaces — `executor-config.ts` (the canon), the runner's command builders (`fanout-run.cjs`), the adapter stress matrix, each `cli-*/SKILL.md` roster, and the deep-loop protocols' adapter lists — the same kinds, the same flags, the same limits.

# Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (48331 B, the newest lib module) — the `EXECUTOR_KINDS` canon (:11), the flags-support matrix (:89-113), the sandbox-prevents map (:120-142), the sandbox→permission-mode translations (:547-570), the permissionMode plumbing (:2022, :2051, :2935, :3208), the `SPECKIT_CLAUDE_CODE_STATE_DIR` env (:474), the claude-code `configDir` resolution (:3249, :71), the hermes-only MCP statement (:636), the web-search policy default (:21, :64-66)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — the builder-map membership (`'cli-claude-code': buildClaudeLineageCommand`, :2716), the cursor builder + preflight (:2251-2490, :2745-2749), the containment commentary (:2452-2458)
- The seven `cli-*/manual-testing-playbook/` trees — directory-structure census (13/12/14/… dirs) and the `stress/` scenario-file sets (14 identical names verified for `cli-claude-code` and `cli-codex`; prefix-identical through `partial-lineage-death` for `cli-cursor`; four trees unseen, flagged)
- The seven `cli-*/SKILL.md` rosters — token census (aggregate 14 distinct `cli-*` tokens, 21-26 matching lines each) plus the named divergence-prose loci (cursor :242, :282)
- The deep-loop protocol references (both `deep-review/references/` and `deep-research/references/` trees, incl. `references/protocol/{loop-protocol,loop-state-and-gates,completion-criteria,quick-reference}.md`) — kind-token census (13 occurrences, all seven cli kinds covered)

Method note: the Angle-8 question was answered at the declaration/census layer; the prose layers of three surfaces (roster bodies, protocol adapter-argument prose, the deeper stress-scenario contents) were not read — recorded as the iteration's depth boundary under Traceability.

# Scorecard

| Gate | Rating | Basis |
|------|--------|-------|
| evidence | pass | every finding cites the exact lines; every negative result names the lines that killed it |
| scope | pass | both trees are in-scope (system-deep-loop, cli-external-orchestration); writes stayed in the ALLOWED-WRITE set |
| coverage | pass | the kind-vocabulary question, the flags question, the limits question (partially — see Dead Ends), the security-posture question, and the stress-matrix question each received a verdict; two leads were pursued to their death (Ruled Out) |

# Findings by Severity

## P0

None.

## P1

None.

## P2

### F014 — The sandbox→permission-mode compression at the Claude-Code branch dilutes the OS-preventive claim, while the prevents-map credits it

`[SOURCE: executor-config.ts:37, :74, :488 (SANDBOX_MODES = read-only | workspace-write | danger-full-access, default workspace-write); :135-142 (sandboxPreventsOS: native false, cli-codex true, cli-claude-code true, cli-opencode false, cli-cursor true, cli-devin true, cli-pi false, cli-hermes false); :547-570 (read-only → `plan`; both workspace-write AND danger-full-access → `force`); :3208 + :2022/:2051 (the branch resolves `permissionMode: resolveClaudePermissionMode(lineage.sandboxMode)`); :142 (the hermes contrast: "`--yolo` is an approval bypass, not confinement")]`

The uniform 3-mode sandbox vocabulary compresses to 2 permission modes at the Claude-Code branch: both `workspace-write` and `danger-full-access` resolve to `force`. Meanwhile `sandboxPreventsOS` scores `cli-claude-code: true` — the OS-preventive class — yet the mechanism actually shipped at that branch is the app-level permission mode (`force`), the same approval-bypass class the map's own hermes commentary demotes ("an approval bypass, not confinement"). Two truths, one field: either the prevents-map's true entry is over-credited (the enforcement is Claude's permission layer, not an OS fence), or `force` genuinely implies confinement the way the map says — the file does not say which, and the hermes/claude treatments of the same mechanism-class disagree in thoroughness.

**Recommendation:** annotate the `cli-claude-code: true` prevents-map entry with the mechanism (and the 3→2 compression), the way the hermes false-entry already does; one sentence restores the symmetry.

### F015 — The enforced model allowlists are hand-maintained, dated-comment rosters with no validation-date protocol

`[SOURCE: executor-config.ts:303-331 (the cursor allowlist: "Grok 4.6 joined this allowlist alongside Grok 4.5 (2026-08-12)…", "GPT-5.6 Luna Max joined this allowlist (2026-08-14)…", "Gemini 3.7 Flash High joined this allowlist (2026-08-15)…"), :312 ("can silently resolve to a model outside this allowlist, defeating the…"), :374-394 (the devin allowlist, same dated-addition pattern)]`

Both the cursor and devin enforced-allowlists grow by hand-appended, dated comments recording live-verified additions (the most recent: 2026-08-15 — 30 days before this review). The design self-documents its own failure mode (:312: the `auto`-router peril, "can silently resolve to a model outside this allowlist"), which is exactly what an under-validated allowlist produces. No validation-date, no roster-freshness check, no test guards the lists; the only maintenance protocol is whoever notices the upstream roster moved. This is the known weakest joint of the whole parity system: the config pins behavior to model ids, the provider rosters drift, and the drift detector is a human reading changelogs.

**Recommendation:** add a last-validated date constant per allowlist (and a test-or-script that fails when it ages past a policy), so the review question "when was this list last true?" becomes mechanical.

### F016 — Five-surface kind/flag parity holds — but its only verification is manual (this review)

`[SOURCE: executor-config.ts:11 (the 8-kind canon) vs the seven-tree directory census (7/7 matching `cli-*` dirs); the aggregate SKILL.md token census (14 tokens = 8 canon + 6 self-explained prose/path artifacts: `cli-copilot` annotated in cli-opencode/changelog/v1.3.15.2.md:60 as "no `cli-copilot` skill exists under `.opencode/skills/` at all" with "verify availability" mitigation notes already in place; `071-cli-hermes-creation`/`031-cli-pi-creation` = spec-packet paths; `update-cli-config`/`cli-guards` = prose fragments at cli-cursor/SKILL.md:242, :282); the flags-support matrix :89-113 (every suppression justified, live-verified, and dated in-place: cursor 2026-07-24, devin 2026-07-27, the pi/ hermes reasoning-idiom notes); the stress/ scenario sets (14-identical filenames, claude-code ≡ codex); the protocol references' kind coverage (all 7 present)]`

The Angle-8 question — the same kinds, the same flags, the same limits — resolves positively at every surface: the kind vocabulary is 8-strong and exactly mirrored by the skill tree; the flags-support differences are all justified, live-verified, dated, and documented at the divergence point (cursor: effort baked into the model id; devin: ditto + the permission-mode lever; pi: the tool-allowlist IS the confinement; hermes: `--yolo`-not-confinement); the stress-matrix shares a 14-scenario canon across the trees checked. What does not exist is any mechanized guarantee of the continued agreement: no test, no script, no CI assertion compares the five surfaces — the alignment holds today because it was built carefully, and its future drift would be caught only by a repeat of this manual census. (The 049 commission exists precisely because such alignments were once found broken.)

**Recommendation:** a parity-check fixture (the 8-kind canon asserted against: the skill-tree directory names, the aggregate token set, the flags-support superset, the stress-filename set) — one test, five surfaces, the drift alarm this angle had to simulate by hand.

# Traceability Checks

| Protocol | Class | Status | Evidence / notes |
|----------|-------|--------|------------------|
| spec_code | hard | partial | Angle 8 = "executor kinds in executor-config.ts, the runner's command builders, the adapter stress matrix, each cli-*/SKILL.md roster and the deep-loop protocols' adapter lists naming the same kinds with the same flags and limits" (strategy §13). All five surfaces were touched and census-compared; the flags/limits leg verified to the *declaration* layer (which keys each kind supports, each suppression justified+dated); the prose layers of the rosters, the protocol adapter-argument texts, and four of seven stress trees remain unread (the iteration's depth boundary). F014-F016 + two dead leads cite the lines. |
| checklist_evidence | hard | notApplicable | unchanged: no checklist.md in the target; the parent-REQ rows are assessed at synthesis. |

Summary: required 2, executed 1, pass 0, partial 1, fail 0, blocked 0, notApplicable 1, gatingFailures 0.

# Assessment

- **Counts:** 3 findings — P0: 0, P1: 0, P2: 3 (F014-F016). All new; zero refinements (the executor/roster/protocol surfaces are disjoint from iterations 1-2). Cumulative: 16 open (P0 0, P1 1, P2 15), 0 resolved.
- **newFindingsRatio:** 3/(13+3) = 0.19 (formula (new + 0.5·refined)/(priorOpen + new + refined)); stuck_count 0 (0.19 > 0.05). durationMs = 309000 (pack-003 render T0=1789469793 → this checkpoint T2=1789470102; the artifact-compose window follows, consistent with prior iterations' disclosure).
- **Novelty justification:** the first 5-surface executor-parity census of this review; iterations 1-2 touched the command YAMLs and the agent mirrors; the sibling lane touched the hub-routing artifacts. Cross-reference note (not a refinement): F009 (the agent-file sampling gap) meets its counterpart here — the dispatch layer (this angle's `executor-config.ts`) already centralizes the reasoning-idiom translations (cursor/devin bake-into-uid, pi `--thinking`, hermes `--reasoning`, claude permission modes), which strengthens F009's framing: the file-layer gap persists *next to* an existing dispatch-layer solution.
- **Claim adjudication:** no new P0/P1 → the gate is vacuous-true; zero packets, zero missing. The adjudication event records activeP0P1: 0, passed: true.
- **Quality gates:** evidence — every finding cites lines; both dead leads cite their killing lines; scope — reads confined to the two in-scope trees; writes = the three artifacts + the sanctioned state-log append; coverage — all five surfaces censused, the limits leg partially (the timeout *values* uncompared, see Dead Ends).
- **Verdict logic:** no P0, no P1 → PASS, per pack-003:77; `hasAdvisories: true` (3 new P2; 15 cumulative) per pack-003:59. Second consecutive PASS.

# Ruled Out

1. **The devin comment-vs-entry drift (my lead)** — died on the verbatim read: the devin comment (:97-103) says "No reasoningEffort and no serviceTier" and its entry (:105-106) carries exactly `['model','sandboxMode','timeoutSeconds','liveTools']` — consistent. My earlier 10-line grep had fused it with the *pi* comment (:108-110, "no OS sandbox or service-tier surface, so neither sandboxMode nor serviceTier is supported"), which is equally consistent with pi's entry (:112, no sandboxMode). Metric artifact of the -A6-adjacent reading; no finding. The lesson recorded: adjacent same-shape comment blocks censor each other under truncation.
2. **The claude-code runner-branch thinness (my lead)** — died: `'cli-claude-code': buildClaudeLineageCommand` sits in the builder map (:2716), the branch resolves `configDir` (:3249), threads `SPECKIT_CLAUDE_CODE_STATE_DIR` (:474), and resolves permission modes (:3208). The ×3 token count was an artifact of counting the full hyphenated token while the branch's substance lives in `claude`-substrings (`resolveClaudePermissionMode` ×2, `resolvedPermission` ×2, `resolvedClaudeConfigDir`). No finding.
3. **The `cli-copilot` ghost** — self-annotated: cli-opencode/changelog/v1.3.15.2.md:60 states "no `cli-copilot` skill exists under `.opencode/skills/` at all" and records that both citing locations now carry "verify availability on the Copilot surface" annotations. The documentation already grades itself; not a finding.
4. **The 14→8 token sprawl** — fully decomposed, all six extra tokens are prose/paths, not undeclared kinds (see F016's evidence). Negative result.
5. **The hermes-only MCP statement** — executor-config.ts:636 documents that only Hermes exposes MCP-server naming per lineage, alongside the webSearch `inherit`-default policy (:21, :64-66). Deliberate, documented divergence; not a finding.

# Dead Ends

- The **timeout-value leg** of "same flags and limits" remains unchecked: `timeoutSeconds` appears in every kind's supported-flags list, but the per-kind default *values* were never extracted or compared (the budget went to the security leg). UNKNOWN, carried.
- Four of seven `stress/` trees unseen (devin, hermes, opencode, pi — the `head -40` cut); the 14-scenario canon is verified identical for claude-code ≡ codex and prefix-identical for cursor. The parity leans positive (a shared-canon design) but the four trees are UNKNOWN, carried.
- The devin `--permission-mode` lever (its `--help`, quoted at :97-98) vs the uniform `sandboxMode` key: the devin-side translation site (:570-±, the read-only→? arm) was cut from the evidence — the completeness of that translation is UNKNOWN, carried.

# SCOPE VIOLATIONS

None. Writes: `prompts/iteration-003.md` (pre-iteration), this narrative, `deltas/iter-003.jsonl`, `logs/iter-003-events.jsonl`, the sanctioned lane-direct state-log append, and the reducer/verify invocations' in-lineage outputs.

# Recommended Next Focus / Next Dimension

Iteration 4 = **Angle 9 — architecture/containment**: detect, quarantine, remedy, ledger and merge read as one system — contradictions, dead paths, duplicated rules (the inline containment blocks in the command YAMLs beside the runner's), and validators with more than one call site (strategy §13 Angle 9 pointer), dimensions: correctness (primary) + maintainability (secondary). Carry-overs: F004's fail-closed-promise question (where the containment failure actually lands — the runner-side vs the YAML-branch) is Angle 9's native question; F014's hermes-scrutiny precedent (the prevents-map's treatment of approval-bypass mechanisms) extends to the merge/ledger legs; the three UNKNOWNs (timeout values, four stress trees, the devin translation arm) fold into Angle 9's validator-coverage sweep or the synthesis.

Review verdict: PASS
