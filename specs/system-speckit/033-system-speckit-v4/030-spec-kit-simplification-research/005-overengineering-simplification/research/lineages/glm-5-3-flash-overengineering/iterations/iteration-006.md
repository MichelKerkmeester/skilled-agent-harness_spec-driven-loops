# Iteration 006 — Root governance (AGENTS.md/CLAUDE.md): what a repo rule or the skill could own instead (KQ6)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 6 | focus: dual-maintenance of the governance layer; spec-kit procedure that belongs in a rule or the skill
Evidence reads: `wc -l`/`diff`/`ls -la` on the governance pair, spec-kit-machinery mention census across `repo-rules/*.md`, validate.sh-mention census (root vs skill), freshness-covenant greps in the skill's validation reference. Reads cost: 3 shell calls.

## What exists

Root governance: `AGENTS.md` = 506 lines; `CLAUDE.md` = a **symlink to it** (`ls -la`: `lrwxr-xr-x … CLAUDE.md ->`) — the dual-maintenance hypothesis dies at the prompt: there is exactly ONE 506-line governance document. `repo-rules/` = 9 behavior-rule files, 1,615 LOC (delegation 251, communication 244, evidence 210, scope 164, prevent-overengineering 162, root-cause 159, blast-radius 154, uncertainty 144, skill-hub 127). Spec-kit machinery mentions (validate.sh | Gate 3 | spec folder | checklist | spec-kit) across all 9: **exactly 1** (`repo-rules/scope-discipline.md`). The root doc mentions `validate.sh` 6×; the skill's SKILL.md 11×. The freshness covenant (`CONTINUITY_FRESHNESS` warn-vs-ENFORCE): stated in the governance completion-verification clause AND fully restated in `references/validation/validation-rules.md:113-127` (incl. the `warn`/`exit 2`/`ENFORCE` mechanics and both env flags, default `false`).

## Findings

**F21 [P2 — candidate] The freshness covenant is the only completion-verification semantic the governance layer and the owning component both fully restate — 2× coordinated maintenance in an otherwise clean boundary.**
- Where: root `AGENTS.md` (COMPLETION VERIFICATION RULE, item 4: "`CONTINUITY_FRESHNESS=true`… A stale result reports a warning, which does not block; `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` escalates it to an error, which does") vs `references/validation/validation-rules.md:113,122,126-127` (same covenant + the `warn`/`exit 2` mechanics + both flags, default `false`).
- Cost: any change to warn-vs-enforce semantics = 2 coordinated edits across 2 layers; today they agree (verified: both state default-`false`, warn-not-block, ENFORCE-escalates).
- Protects: the completion-blocking boundary — the one place where governance must states WHAT and the component states HOW (exit codes), the restatement being the cost of the 2-layer design.
- Recommendation: **keep** — this is the 2-layer governance/implementation split doing its job; the duplication is one semantic, explicitly paired, both sides accurate as of this run. (Contrast F14, where ONE layer contains 5 uncoordinated copies.)

**F22 [P2 — candidate → correction] Governance→runtime duplication: measured, and it is (almost) not there.**
- Where: `CLAUDE.md` → symlink to `AGENTS.md` (0% duplicated); `repo-rules/*.md`: 1/9 files mention any spec-kit machinery; root→skill: the Gate-3 mechanics are pointered, not copied (root: "system-spec-kit/shared/gate-3-classifier.ts (`classifyPrompt()`) owns the exact vocabulary and is authoritative…"; the A/B/C/D/E options are the governance surface itself); the completion covenant lives as governance-mandate (root, 4 items) + workflow scorecard (`speckit-complete-auto.yaml:431,457`: `continuity_ladder_walked: 20`, `memory_saved: 20` — a scored VIEW, weights YAML-local) + validator mechanics (`validation-rules.md`), each stating its own layer's truth. The one governance-internal prose oddity: `complete.md:92`'s phantom dashboards (F18) — the command层的 residue, already filed.
- Cost: ~0 duplication; the census cost 3 greps to establish.
- Protects: the governance(when/whether)/rules(behavior)/skill(how) separation — the separation the entire 35-packet corpus rests on.
- Recommendation: **keep** — recorded as negative knowledge: no fold-into-a-repo-rule candidates found at the governance layer; the 1,615 LOC of rules own behavior only, by design. Any future governance edit should preserve this (the temptation to "also explain the mechanics" is what produced F14/F18's restatement debt inside the skill).

## Ruled out (negative knowledge, this run)

- "AGENTS.md/CLAUDE.md are dual-maintained duplicates" — false: `CLAUDE.md` is a symlink; 506 lines exist once. Evidence: `ls -la` (lrwxr-xr-x). 
- "Spec-kit procedure in the governance layer could fold into repo-rules" — no: 9 rule files, 1,615 LOC, 1 machinery mention (`scope-discipline.md`); the rules own behavior, the governance owns procedure. Nothing to fold.
- "The governance layer re-documents the validate.sh invocation contract the skill owns" — partially: root mentions validate.sh 6× (the WHEN + the 4-pitfalls procedure), the skill 11× (the WHERE/WHAT). The 4-ways-it-lies pitfalls (stale-orchestrator exit 3, realpath, RESULT:PASSED, regenerate-metadata) are documented at governance, while the freshness mechanics they depend on are documented in `validation-rules.md:113-127`. Two layers, two duties, agreed today. Residual risk only (the F21 2×), no action.

## Not pursued here

- Whether the completion scorecard's 20-point items (complete-auto.yaml:431,457) are ever actually awarded on real packets (are the gates obeyed, or just present?) → run 8 (adherence evidence in specs/).
