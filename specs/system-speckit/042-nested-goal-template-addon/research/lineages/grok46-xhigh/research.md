# Nested goal addon — grok46-xhigh lineage synthesis

Lineage-local synthesis for `specs/system-speckit/042-nested-goal-template-addon`. Canonical for this fan-out lineage. Parent `research/research.md` is produced by the parent merge step, not this file.

<!-- MACHINE-OWNED: synthesis from iterations 1–3 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Spec | `specs/system-speckit/042-nested-goal-template-addon` |
| Lineage | grok46-xhigh |
| Session | fanout-grok46-xhigh-1788025387577-mq8fbn |
| Executor | cli-cursor / cursor-grok-4.6-xhigh |
| Iterations | 3 / 3 |
| Stop reason | maxIterationsReached |
| Questions | 6 / 6 answered |
| resource-map.md at spec folder (init) | absent |

## 2. Executive summary

A nested-goal addon should be a **lazy, opt-in packet file** named `goal.md`, not a Level-required document and not an `optionalAddonDocs` sibling of `acceptance-criteria.md`. The operator sets a **short, stable runtime string** that points at the parent file and copies a handful of self-contained completion criteria. Per-phase child `goal.md` files hold overflow. Nothing in the repo dereferences a path inside a goal string; reliability is wording plus a present-file validator.

There is **no Claude adapter**. OpenCode injects every turn (4000-char caps). Pi injects per turn via the sibling core. Cursor injects once at sessionStart. Speckit `goal_prompting` hardcodes `opencode_goal` on `set`. That contract should become a **runtime dispatch table** without inventing `hooks/goal/claude`.

`AC_CLOSURE` is the right **packet-close** gate for Level 2+ children. It is not the session stop evaluator and it does not run on phase-parent. Packet 033's `goal.md` is 15028 bytes with three phases; cap the **durable slice** at 2000 characters, not the whole file.

## 3. Key findings

1. **lazyAddonDocs, not optionalAddonDocs.** Optional is the QA/closure bucket (`checklist.md`, `acceptance-criteria.md`) and `collectDocuments` does not walk it except two hardcoded names.
2. **Levels 1–3+ and phase-parent; not review.** Phase-parent stays lean trio; parent `goal.md` is opt-in.
3. **Three in-repo goal surfaces plus a Claude hole.** Plugin ≠ sibling core. Claude Stop-hook internals are not proven in this repo.
4. **94 speckit `goal` mentions.** `goal_prompt_choice` lives in eight YAMLs. Offer does not call the tool; `set` does.
5. **Binding is a convention.** Set a ~200-character pointer. Child paths live in the parent file for the working agent to Read.
6. **AC_CLOSURE complements L2+ close.** Parent completion criteria must stay in the short set string for stop evaluators.
7. **Durable 2000-char cap.** 033 is 15028 bytes; the log caused the growth.

## 4. Level contract

Put `goal.md` on `lazyAddonDocs` for `"1"`, `"2"`, `"3"`, `"3+"`, and `"phase"`. Leave `"review"` unchanged.

Companion manifest work (EXTENSION-GUIDE steps 1–6): `documents.goal.md` with `owner: author`, `creationTrigger: explicit-option`, `absenceBehavior: silent-skip`; `versions["goal.md.tmpl"]`; `templates/addons/goal.md.tmpl`; `DOC_TEMPLATE_NAMES['goal.md']`; `sectionGates['goal.md']`.

Do not add to `requiredCoreDocs` or `requiredAddonDocs`. Do not add to `FREEFORM_WORKFLOW_DOCS`.

Template IF-gates: `level:1,2,3,3+,phase` (same as handover). Phase-parent variant requires a BINDING block. Child packets are ordinary Level-N folders (no extra Level row). `template-structure.js` already adds a `child` addendum when the parent spec has a `phase-map` anchor.

## 5. Runtime goal systems

| Surface | Injection | Cap | Management | Stop/verify |
|---------|-----------|-----|------------|-------------|
| OpenCode `plugins/opencode-goal.js` | `experimental.chat.system.transform` every turn | 4000 / 4000 / 4800 | `opencode_goal` | `session.idle` heuristic or LLM |
| Sibling `hooks/goal/lib/goal-core.cjs` | Pi: per-turn `input`. Cursor: `sessionStart` once | same defaults | Pi: `bin/goal.cjs`. Cursor: none | Pi `turn_end`. Cursor: `stop` does not fire on tested CLI |
| Claude | none in repo | unknown | none | unverified live product feature |

CC-029: no `.opencode/hooks/goal/claude`; no `.claude/commands/goal-opencode.md`. Cited constitutional file `goal-prompting-runtime-specific.md` is **missing**.

## 6. Speckit command surface

`goal_prompting` default `offer`; `set` → `opencode_goal({ action: "set", objective })`. Resume already does not call the tool.

Become runtime-neutral:

- Keep offer/skip/set.
- Dispatch `set` by runtime (OpenCode tool, Pi CLI with identity, Cursor/Claude handoff or native product command — never fake an adapter).
- Nested-goal `goal_objective` is the **pointer string**, never the file body.
- Presentation already says "session goal"; tests forbid the substring `goal.md` in command files (stale command name). Keep the packet basename; do not mention it in speckit markdown.

## 7. Binding convention

Required parent wording (file): BINDING, Read-children, PRECEDENCE (parent decisions and completion criteria win), STOP (only parent completion criteria).

Required set string: execute the parent file path; follow BINDING/PRECEDENCE; stop only on parent COMPLETION CRITERIA. Copy 3–7 checkable bullets into the set string because stop evaluators do not Read the file.

Packet validator (present-file only): durable/log headings; parent BINDING on phase-parent; listed child paths exist inside the packet; durable slice ≤ 2000 chars.

## 8. Stop-gate asymmetry

Working agent can Read children. Stop evaluator (OpenCode heuristic, possible Claude Stop hook) sees the stored string only. Cursor has no stop verify.

AC_CLOSURE: Level ≥ 2, cutoff-aware, completion-claim gated, reads `acceptance-criteria.md`. Inactive below Level 2; phase-parent numeric level defaults to 1 so the gate is off. Lean trio forbids AC at the parent.

Use AC_CLOSURE as a **child packet-close** bullet in parent criteria. Do not use it as the session stop check. Phase-parent closeability is recursive child validation plus parent durable criteria.

## 9. Drift and size cap

033 `goal.md`: 15028 bytes, 204 lines, three-phase map, long Progress/remediation log. Live frozen-condition "two phases" was not observable from files; file growth is confirmed.

Split: durable = one-sentence objective, BINDING, DECISIONS IDs, 3–7 completion bullets. Volatile = progress, evidence, remediation. Child path list stays in the file, not the set string.

Cap **durable slice** at 2000 characters (under the 4000 runtime cap). Do not cap the whole file. Child durable optional cap at 4000.

## 10. Template skeleton

Shared: frontmatter, `SPECKIT_TEMPLATE_SOURCE: goal`, Durable directive, BINDING, COMPLETION CRITERIA, optional Volatile log (marked).

Phase-parent: Binding required; CONTENT DISCIPLINE — do not restate child plans.

Standalone Level 1: no Binding; this file is the whole goal.

## 11. Recommendations

Must-do for implementation (out of this lineage's write scope):

1. Manifest: `goal.md` on `lazyAddonDocs` for 1/2/3/3+/phase; documents map; template; `DOC_TEMPLATE_NAMES`; section gates.
2. `goal.md.tmpl` with durable/log split and BINDING/PRECEDENCE/STOP wording.
3. Present-file validator: child paths, durable-slice 2000-char cap.
4. Speckit YAML: runtime dispatch table for `set`; keep offer tool-free; pointer-sized `goal_objective`.
5. Parent set-string playbook: ~200 char pointer + copied completion bullets.

Must-not:

- `hooks/goal/claude`
- Runtime dereference
- `requiredAddonDocs` / `optionalAddonDocs` as the primary bucket
- Whole-file size cap
- Claiming Claude Stop-hook internals as repo-proven

## 12. Eliminated alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| requiredAddonDocs / requiredCoreDocs | file-presence hard-error on existing packets | orchestrator.ts docsForLevel | 1 |
| optionalAddonDocs as primary bucket | QA/closure semantic; collectDocuments misses new names | spec-doc-structure.ts:204-220 | 1 |
| Distinct Level row for children | children are Level-N; only phase-map addendum | template-structure.js:400-406 | 1 |
| hooks/goal/claude adapter | CC-029 / README by-design empty | hooks/goal/README.md:69 | 2 |
| Unify plugin and sibling core | plugin does not import core | README.md:25 | 2 |
| Runtime path-follower | string-in/string-out | goal-core.cjs | 3 |
| AC_CLOSURE as session stop | wrong process/file; off on phase-parent | check-ac-closure.sh:221-224 | 3 |
| Whole-file parent size cap | punishes progress log | 033 goal.md:94 | 3 |
| Child paths in frozen set string | 4000-cap overflow and freeze-drift | goal-core 4000; 033 15028 bytes | 3 |

## 13. Divergence map

- Saturated: required lists; optionalAddonDocs-as-primary; Claude adapter; runtime dereference; whole-file cap
- Pivots taken: none (sequential three-iteration charter)
- Remaining frontier: whether a live Claude Goal/Stop hook re-reads a file path
- Council artifacts: none

## 14. Open questions

- Live Claude Code Goal/Stop hook: frozen-string-only vs file re-read? **Not answerable from this repository.**
- Narrow the speckit `goal.md` substring ban to the stale command filename without blocking packet-file docs in other trees?

## 15. Sources

- `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`
- `.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts`
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`
- `.opencode/skills/system-spec-kit/references/structure/phase-definitions.md`
- `.opencode/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`
- `.opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh`
- `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md`
- `.opencode/hooks/goal/README.md`
- `.opencode/hooks/goal/goal-plugin.md`
- `.opencode/hooks/goal/lib/goal-core.cjs`
- `.opencode/hooks/goal/cursor/goal-inject.mjs`
- `.opencode/plugins/opencode-goal.js`
- `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`
- `.opencode/commands/speckit/assets/speckit-plan-auto.yaml` (and seven sibling YAMLs)
- `.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md`
- `specs/system-speckit/033-spec-kit-template-optimization/goal.md`

Spec-folder `resource-map.md` was absent at init; no placeholder citation.

## 16. Quality guards

- Source diversity: templates, validators, two goal implementations, speckit YAML, packet 033 file. Pass.
- Focus alignment: one charter question-cluster per iteration. Pass.
- No single weak source: every load-bearing claim has a file citation. Pass.
- Claude Stop-hook internals marked unverified rather than cited as code.

## 17. Convergence report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 6 / 6
- Remaining questions: 0 charter; 2 carried-forward (live Claude behavior; substring-test narrowing)
- Last 3 iteration summaries: run 1: Level contract (1.00); run 2: runtimes + speckit (0.85); run 3: binding/stop/drift (0.70)
- Convergence threshold: 0.05 (not the terminal reason)
- Divergence summary: no divergent pivots; five saturated ruled-out directions
- Segment transitions, wave scores, and checkpoint metrics omitted (experimental)

## Lineage notes

- `reduce-state.cjs` not invoked: it resolves `{spec_folder}/research/` and would write outside this lineage.
- `generate-context.js` / `validate.sh` / git / spec.md mutation not run.
- Append gateway used with `--run-directory` = this lineage. Ledger: `deep-research-ledger`. Nested projection at `research/deep-research-state.jsonl` is lossy; fanout-merge should read lineage-root `deep-research-state.jsonl`.
