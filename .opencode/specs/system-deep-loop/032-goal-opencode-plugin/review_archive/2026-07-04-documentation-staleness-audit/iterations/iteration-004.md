# Deep Review Iteration 004

## Dimension

Traceability + maintainability audit focused on the companion research claims for Finding #3 and Finding #4.

## Files Reviewed

- `.claude/skills/sk-code-review/references/review_core.md:28-49` - severity and evidence requirements loaded before final severity calls.
- `README.md:1230-1233` - root `/goal` command summary and plugin-contract pointer.
- `.opencode/plugins/README.md:42-51` - current plugin entrypoint inventory, including `mk-goal.js`.
- `.opencode/plugins/README.md:69-130` - plugin configuration section and its documented scope.
- `.opencode/plugins/README.md:146-150` - related references from the plugin entrypoint document.
- `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:14-17` - actual goal plugin contract introduction.
- `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:24-52` - runtime surfaces, behavior contract and environment-variable table.
- `.opencode/skills/system-skill-advisor/README.md:42-85` - skill-owned plugin documentation context and OpenCode plugin note.
- `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:27-41` - `/goal` plugin state, tools, lifecycle and live-verification claims.

## Finding #3 Audit

Verdict: confirmed with a narrower framing than the research summary.

Root `README.md` describes `/goal` behavior and explicitly delegates the plugin contract to `.opencode/plugins/README.md` at `README.md:1230-1233`. The delegated file is not merely a one-line inventory anymore: `.opencode/plugins/README.md:49` has a detailed `mk-goal.js` entry, and `.opencode/plugins/README.md:26-28` defines the important default-export-only OpenCode loader contract. However, for the contract the root README names in context - per-session state, active-goal injection, usage accounting, guarded continuation and autonomy gates - `.opencode/plugins/README.md` still lacks a `mk-goal` contract/config subsection. Its configuration section says `Both plugins support` at `.opencode/plugins/README.md:71` and then documents only `mk-skill-advisor` and `mk-code-graph` config at `.opencode/plugins/README.md:78-126`.

The stronger contract target already exists: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:14-17` says it is the OpenCode Goal Plugin Contract, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:24-31` names plugin/command/state/tests surfaces, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33-40` names behavior, and `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:41-52` begins the environment-variable table. Existing P1-002 already covers missing env/output details inside that hook reference; this iteration does not duplicate it.

Recommendation: retarget the root `README.md:1233` pointer to `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, and optionally add a short related link from `.opencode/plugins/README.md` to that contract. Expanding `.opencode/plugins/README.md` is a viable alternative only if this entrypoint inventory is intentionally becoming the operator contract, but that conflicts with its current statement that owning skills hold bridge/helper contracts.

### P1-003 [P1] Root README delegates the `/goal` plugin contract to an entrypoint inventory that does not define that contract

- Claim: The public root README sends operators to `.opencode/plugins/README.md` for the `/goal` plugin contract, but that document does not contain the `mk-goal` config/contract surface needed for the state, injection, lifecycle and autonomy claims the root README is describing.
- Evidence refs: `README.md:1230-1233`, `.opencode/plugins/README.md:49`, `.opencode/plugins/README.md:69-126`, `.opencode/plugins/README.md:146-150`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:14-17`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:24-52`.
- Counterevidence sought: I checked whether `.opencode/plugins/README.md` had a `mk-goal` config/contract subsection, a link to the goal contract, or goal env/output/archive behavior beyond the entrypoint row. It does not in the reviewed ranges.
- Alternative explanation: If the root README intended only the low-level OpenCode loader/export contract, `.opencode/plugins/README.md:26-28` and `.opencode/plugins/README.md:49` partially satisfy that. The surrounding root bullets at `README.md:1231-1233` discuss `/goal` state, injection and autonomy, so the operator-facing goal contract is the more likely intended target.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if the root README wording is narrowed to "entrypoint loader contract" or if `.opencode/plugins/README.md` gains a first-class `mk-goal` contract subsection linked from the root pointer.
- Finding class: cross-consumer.
- Scope proof: Cross-read the public root pointer, the plugin entrypoint document and the dedicated goal contract reference; this affects root docs and the plugin/operator docs rather than an isolated typo.
- Affected surface hints: `README.md`, `.opencode/plugins/README.md`, `goal_plugin.md` reference surface.
- Content hash: `sha256:e80e260116b0bf49ce90d1b4547345935ecf3f60515b9d19eaf7ccc4bb21f457`.

## Finding #4 Audit

Verdict: confirmed at P2.

`.opencode/skills/system-skill-advisor/README.md:42` says this skill owns OpenCode hook/plugin docs including `/goal`, and `.opencode/skills/system-skill-advisor/README.md:85` says live OpenCode-run tool invocation is still under investigation. The sibling feature catalog contradicts that status: `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:41` says a real `opencode serve` run lists `mk_goal` and `mk_goal_status`, and that a live model turn calls `mk_goal` and persists per-session state.

I keep this at P2 rather than P1 because the contradiction is localized documentation drift inside the same skill and does not by itself misdescribe the root operator contract or runtime behavior. It still matters: the quick-start README is the higher-visibility status surface and currently weakens the verified catalog evidence.

### P2-001 [P2] Skill Advisor README contradicts the feature catalog's verified `/goal` live-tool status

- Claim: The system-skill-advisor README says `/goal` live OpenCode-run tool invocation remains under investigation, while the sibling feature catalog says a live `opencode serve` run verified tool listing and live model state persistence.
- Evidence refs: `.opencode/skills/system-skill-advisor/README.md:42`, `.opencode/skills/system-skill-advisor/README.md:85`, `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:41`.
- Counterevidence sought: I checked the feature catalog for whether it only documented unit/tool-path tests or an unverified plan. It explicitly claims `opencode serve` tool listing plus a live model turn persisting state.
- Alternative explanation: The README may have intended to say active autonomous continuation invocation is still under investigation, not basic `mk_goal` / `mk_goal_status` tool invocation. If so, the wording is ambiguous and should be narrowed.
- Final severity: P2.
- Confidence: 0.9.
- Downgrade trigger: Downgrade to a no-finding wording cleanup if the README is clarified to refer only to live autonomous continuation and the feature catalog keeps basic tool invocation verification separate.
- Finding class: instance-only.
- Scope proof: Exact sibling-doc contradiction found between one README line and one feature catalog line; no broader same-class claim was made.
- Affected surface hints: `system-skill-advisor README`, `goal-opencode-plugin feature catalog`.
- Content hash: `sha256:016d482d6029e467ba94c1f63cf012e09999b684c8ff5e8f383de27f05b82f56`.

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

- P1-003: Root README delegates the `/goal` plugin contract to an entrypoint inventory that does not define that contract.

### P2

- P2-001: Skill Advisor README contradicts the feature catalog's verified `/goal` live-tool status.

## Traceability Checks

- Existing P1-001: Not re-emitted. This iteration did not independently audit `ENV_REFERENCE.md`; it only encountered adjacent contract/documentation drift.
- Existing P1-002: Strengthened indirectly. The dedicated `goal_plugin.md` reference is the right root-pointer target, but prior P1-002 means it still needs env/output completion before it can be treated as fully authoritative.
- `Both plugins support` wording: confirmed stale as a P3-equivalent wording issue. `.opencode/plugins/README.md:44-51` lists six entrypoints, including `mk-goal.js`, but `.opencode/plugins/README.md:71` says `Both plugins support` and the config section only covers `mk-skill-advisor` and `mk-code-graph`. This is not counted as a formal P0/P1/P2 finding in this iteration because it is subordinate to P1-003 and can be corrected while retargeting or clarifying the plugin contract pointer.

## Verdict

CONDITIONAL. This iteration found one new P1 traceability gap and one new P2 sibling-doc contradiction. No P0 findings were identified.

## Next Dimension

Next review should focus on whether the dedicated `goal_plugin.md` contract and feature catalog can be reconciled into one canonical operator path without duplicating details across root README, plugin entrypoint README and skill-advisor feature docs.

Review verdict: CONDITIONAL
