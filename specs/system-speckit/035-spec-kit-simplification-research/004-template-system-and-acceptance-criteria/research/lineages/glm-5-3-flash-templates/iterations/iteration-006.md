# Iteration 006 — Angle 6: the goal addon — render path, offering surface (CQ1), nested-goal binding

- sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
- Window opened: 2026-09-06T23:52:18Z (init) · iteration executed 2026-09-07T01:22Z–01:40Z
- Focus: Q6 — does the goal addon's render path run through inline-gate-renderer.ts, does any command offer it, and do phase parents in specs/ honor the nested-goal binding? (CQ1 adjudication)
- Status: complete · newInfoRatio: 0.125 (3 new findings / 24 accumulated)
- Novelty justification (1 sentence): first-recorded — the creatorless most-defined document, the partially-honored nested binding, and the session-goal vs goal-document name conflation; angles 1-5 established the scaffold/renderer groundwork this angle only consumes.
- Executor: this process, inline · tool calls: 9 bash evidence + writes = within 12; research actions 6.
- Quality guards: source diversity 11 distinct files/templates; every finding ≥3 records; focus alignment 100%.

## Focus

Q6 per strategy §3, adjudicating CQ1 (what creates goal.md). State read first: state log 6 records, registry 21 findings.

## Actions Taken

1. `templates/addons/goal.md.tmpl` read whole: single `<!-- IF level:1,2,3,3+,phase -->` wrapper (`:1`); inline `SPECKIT_TEMPLATE_SOURCE: goal | v2.2` marker at `:31` (markers SURVIVE rendering — packet 004's AC file carries the same marker at :27); ANCHOR:directive `:41-62` (with the resend/amendment protocol); phase-only `<!-- IF level:phase -->` ANCHOR:binding `:67-85` (binding table: each phase's `goal.md` binds as if written here; precedence rules; "An evaluator sees the objective string, not these files"); ANCHOR:completion `:87-97` (3-7 checkable bullets, "criteria left only here are invisible to whatever judges completion"); ANCHOR:log `:101-119` (volatile). [SOURCE: templates/addons/goal.md.tmpl:1,31,41-62,67-85,87-97,101-119]
2. `runtime/cli/templates/inline-gate-renderer.ts`: `RenderLevel = '1'|'2'|'3'|'3+'|'phase'` (`:15`); gate grammar IF//IF with parens tokenizer (`:32-48`); the renderer CAN render goal.md.tmpl at any level incl. phase — and copy_template would route it there (`template-utils.sh:88-100`, angle 1) — but no scaffold path ever passes goal.md to it (create.sh 0 goal.md hits, angles 1/3). [SOURCE: runtime/cli/templates/inline-gate-renderer.ts:15,32-48; runtime/cli/lib/template-utils.sh:88-100]
3. Contract side: phase `sectionGates.goal.md` = `{directive: [1,2,3,3+,phase], completion: [1,2,3,3+,phase], log: [1,2,3,3+,phase], binding: [phase]}` (programmatic dump of spec-kit-docs.json levels.phase.sectionGates); L1 also carries a full goal.md gate profile (`:521`); goal.md is in lazyAddonDocs at L1/2/3/3+ AND phase (`:2170-2177`) but NOT review/research (`:2311-2316,2428-2433`). [SOURCE: templates/spec-kit-docs.json:521,2170-2177,2311-2316,2428-2433 + levels.phase.sectionGates (node dump)]
4. Offering surface (CQ1): create.sh/upgrade-level/scaffold-debug-delegation — 0 goal.md references; `rg goal` over runtime/cli/rules/*.sh — 0 hits (no rule requires or warns for goal.md). The LIVE "goal" machinery is a DIFFERENT artifact: `.opencode/plugins/opencode-goal.js` — "Persist session goals and inject passive goal steering" (`:1-6`), state dir `skills/.state/goal/` (`:27-29`), tools `opencode_goal`/`opencode_goal_status` (`:3060,3072`), ZERO references to goal.md. Wired into 8 speckit workflow YAMLs (plan/complete/implement/resume × auto/confirm) via `goal_prompt_choice` default-offer + `goal_objective` → `opencode_goal({action:"set", objective})` (`speckit-plan-auto.yaml:98-99,123-137`); the offer line is pinned by `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:20-41,71-75,81`. [SOURCE: runtime/cli/spec/create.sh (0 hits); .opencode/plugins/opencode-goal.js:1-6,27-29,3060,3072; .opencode/commands/speckit/assets/speckit-plan-auto.yaml:98-99,123-137; .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:20-41,71-75,81]
5. Binding reality under specs/: `find specs -name goal.md` = 75 files; ANCHOR:binding present in 15. Phase-parent spot checks: mcp-tooling/019-official-obsidian-cli (parent) HAS goal.md WITH binding (`:60,:75`) referencing `001-cli-versus-mcp/goal.md` (`:109`) and the child HAS its own goal.md — honored; system-speckit/033-system-speckit-v4 (the parent whose own child 010-goal-file-addon SHIPPED the goal system) has NO parent goal.md while child 010 has one (+ its own sub-children); sk-design/018-sk-design-parent-v2 has a parent goal.md WITHOUT template anchors (freeform "Read first/Binding constraints" shape); mcp-tooling/013-mcp-obsidian/goal.md is freeform prose (no template marker). [SOURCE: specs/mcp-tooling/019-official-obsidian-cli/goal.md:60,75,109; ls specs/system-speckit/033-system-speckit-v4/ (no goal.md); ls specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/ (goal.md present); specs/sk-design/018-sk-design-parent-v2/goal.md; specs/mcp-tooling/013-mcp-obsidian/goal.md]
6. Playbook claims: goal-set-string-playbook.md `:20` — "The rule it complements checks the file; nothing can check what an operator types"; `:27-31` set-string shape ("Execute specs/<track>/<packet>/goal.md. BINDING: read each phase's goal.md before working that phase..."); `:91-93` worked example targets 033/010's goal.md. [SOURCE: references/workflows/goal-set-string-playbook.md:20,27-31,91-93]

## Findings

### f-iter006-001 — P1 — document (or fix with a creator)

`README.md:184` + `templates/spec-kit-docs.json:158-162,521,2170-2177` + 75 live files vs create.sh (0 hits) + opencode-goal.js (0 goal.md refs) + rules (0 hits) — CLAIM: goal.md is "explicit-option — written when you ask for it" (README:184; manifest documents[] `:158-162`), fully gated in the contract (L1 gate `:521`, phase gate profile, lazyAddonDocs at 5 of 7 levels), and 75 goal.md files exist under specs/. FACT: NOTHING creates it — no create.sh flag (angles 1/3), no command, no rule, and the opencode-goal plugin (the live "goal" machinery) stores operator objective STRINGS under `skills/.state/goal/` and never writes a packet goal.md. The only creation path is the manual renderer example — documented for resource-map.md only (angle 3, template-guide.md:195-200), never for goal.md. Adjudicates CQ1: goal.md is the most contract-defined, least-creatable document in the system; its "explicit-option" trigger has no implementing surface. SEVERITY: **P1 (wrong-or-unused)**. RECOMMENDATION: **document** — name the manual render (with a goal.md-specific example) as THE creation path in the README trigger row + template-guide; or **fix** by adding a tiny creator (e.g. `create.sh --with-goal` or a scaffold-debug-delegation-style helper).
[SOURCE: README.md:184; templates/spec-kit-docs.json:158-162,521,2170-2177; runtime/cli/spec/create.sh (0 hits); .opencode/plugins/opencode-goal.js:27-29,3060 (0 goal.md refs); references/templates/template-guide.md:195-200; find specs -name goal.md | wc -l = 75]

### f-iter006-002 — P2 — document (or fix with an optional-parent-goal rule)

`templates/addons/goal.md.tmpl:67-85` + `references/workflows/goal-set-string-playbook.md:27-31` vs specs/ reality (action 5) — CLAIM: phase parents bind children via a parent goal.md whose ANCHOR:binding table lists each phase's goal.md; the playbook's set-string shape instructs the operator to execute the packet goal.md and read each phase's. FACT: the binding is honored only where the file exists and follows the template — 019's parent honors it end-to-end; 033's parent (the packet that BUILT the goal system) has NO parent goal.md; 018/013 goals are freeform without template anchors; only 15 of 75 goal.md files carry ANCHOR:binding. Enforcement is conditional: goal.md is optional-presence (lazyAddonDocs), so a parent without one is unconstrained; a PRESENT goal.md gets anchor-checked per the phase gate profile (validator presentAddons scan, orchestrator.ts:507-510); the operator's typed objective string is explicitly unchecked (playbook:20). SEVERITY: **P2** — the binding is a convention, not a gate; prose never says so. RECOMMENDATION: **document** ("binding binds only when a template-shaped parent goal.md exists; parents may omit it; legacy freeform goals sit outside the anchor system") — or **fix** with an advisory rule (children have goal.md, parent lacks a binding goal → info).
[SOURCE: templates/addons/goal.md.tmpl:67-85; references/workflows/goal-set-string-playbook.md:20,27-31; specs/mcp-tooling/019-official-obsidian-cli/goal.md:60,75,109; ls specs/system-speckit/033-system-speckit-v4/; specs/sk-design/018-sk-design-parent-v2/goal.md; specs/mcp-tooling/013-mcp-obsidian/goal.md; runtime/lib/validation/orchestrator.ts:507-510]

### f-iter006-003 — P2 — document

`.opencode/plugins/opencode-goal.js:1-6,27-29` + `speckit-plan-auto.yaml:98-137` + `speckit-goal-offer-contract.test.cjs:81` vs `templates/addons/goal.md.tmpl` + `references/workflows/goal-set-string-playbook.md:27-31` — CLAIM/FACT: two distinct artifacts share the name "goal": (a) the SESSION GOAL — an objective string persisted by the opencode-goal plugin under `skills/.state/goal/`, offered by 8 speckit workflow YAMLs (Q9. Session Goal, default offer) and injected as passive steering ("An evaluator sees the objective string, not these files", goal.md.tmpl:81-82 area); (b) the GOAL DOCUMENT — the manifest addon goal.md with durable directive/binding/criteria. No code connects them: the plugin never reads or writes goal.md (0 refs), and the playbook's set-string shape tells the operator to paste goal.md-derived text INTO the objective by hand. The README trigger table and EXTENSION-GUIDE never disambiguate the two, which is the root cause behind f-iter006-001's creatorless doc and f-iter002-001's phantom ask-surface. SEVERITY: **P2**. RECOMMENDATION: **document** — one paragraph (README or EXTENSION-GUIDE): "goal" the session objective (opencode_goal) vs "goal.md" the packet document (manual render), and that the former is hand-derived from the latter.
[SOURCE: .opencode/plugins/opencode-goal.js:1-6,27-29; .opencode/commands/speckit/assets/speckit-plan-auto.yaml:98-99,123-137; .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:81; templates/addons/goal.md.tmpl:81-82; references/workflows/goal-set-string-playbook.md:27-31]

## Questions Answered

- **Q6 (angle 6) — ANSWERED, three parts**: (1) render path — YES, goal.md.tmpl is a gated template rendered by inline-gate-renderer.ts (IF wrapper + phase-only binding anchor; RenderLevel incl. phase), but the path only runs via the manual renderer because no scaffold/command feeds it; (2) offering — NO command offers goal.md; the goal OFFER in 8 speckit YAMLs sets a plugin-persisted objective STRING (opencode_goal), a different artifact; CQ1 CLOSED (f-iter006-001); (3) nested-goal binding — PARTIALLY honored: enforced only when a template-shaped parent goal.md exists (019 yes; 033 no; 018/013 freeform; 15/75 carry the binding anchor), conditional-presence by contract, operator objective unchecked by design (f-iter006-002, f-iter006-003).
- **CQ1 — CLOSED** (folded into f-iter006-001).

## Questions Remaining

- Q7-Q8 (queued; next: Q7 — template version fields vs SPECKIT_TEMPLATE_SOURCE headers for manifest↔shipped drift; NOTE acquired this angle: goal.md.tmpl:31 carries the marker INSIDE the template, and rendered files keep it — the mechanism check-template-source.sh reads).
- Carried: none besides Q7/Q8 (CQ1, CQ2, CQ3, CQ4, CQ5 partially via f-iter003-005/f-iter005-001, CQ6 all closed or adjudicated).

## Ruled Out (do not retry)

- ro-iter006-001: "a command or flag creates goal.md" — ruled out: create.sh/upgrade-level/scaffold-debug-delegation 0 hits; rules 0 hits; the opencode-goal plugin writes only session state (0 goal.md refs). [SOURCE: runtime/cli/spec/create.sh; .opencode/plugins/opencode-goal.js:27-29,3060; runtime/cli/rules/ (0 hits)]
- ro-iter006-002: "the goal offer in speckit YAMLs produces goal.md" — ruled out: goal_prompt_choice/goal_objective route to opencode_goal({action:"set",objective}) — a session-goal string, never a file. [SOURCE: .opencode/commands/speckit/assets/speckit-plan-auto.yaml:123-137]

## SCOPE VIOLATIONS

None. Writes: `iterations/iteration-006.md`, `deltas/iter-006.jsonl`, `deltas/event-006.json` + gateway ledger/projection writes — all inside the lineage directory. No packet-level writes, no repo tooling.

## Next Focus

Iteration 7 — Angle 7: template version fields vs SPECKIT_TEMPLATE_SOURCE headers. (a) read check-template-source.sh (what it compares: manifest versions{} vs rendered files' markers; legacy v2.1 acceptance); (b) census: all 17 templates' inline markers (goal.md.tmpl:31 carries `goal | v2.2` INSIDE the .tmpl — do the other 16?) vs manifest versions (all v2.2, :4-22) vs rendered samples (004's files carry v2.2); (c) drift scan: any shipped file whose marker version ≠ manifest version, any .tmpl missing the marker, any file carrying a version the manifest never declared.

## Convergence telemetry (advisory only — stopPolicy=max-iterations)

newInfoRatio = 0.125 → NOT qualifying; consecutiveQualifying 0/3. Loop continues: 4 iterations remain, forced.
