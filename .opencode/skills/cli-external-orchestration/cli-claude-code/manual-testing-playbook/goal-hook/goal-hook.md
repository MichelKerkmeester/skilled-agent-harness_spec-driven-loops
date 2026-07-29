---
title: "CC-029 -- Cross-runtime goal hook: Claude Code native /goal (documentation-only)"
description: "This scenario validates the cross-runtime goal-hook documentation boundary for `CC-029`. It confirms Claude Code's session-goal behavior is its own native /goal feature, not the mk-goal port and not the cross-runtime .opencode/hooks/goal/ hook, and that live headless validation of the hook itself does not apply to Claude Code by design."
version: 1.0.0.0
---

# CC-029 -- Cross-runtime goal hook: Claude Code native /goal (documentation-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-029`.

---

## 1. OVERVIEW

This scenario validates the cross-runtime goal-hook documentation boundary for `CC-029`. Claude Code has its own **native** `/goal` feature. That native feature is not the `mk-goal` OpenCode plugin port, and it is not the runtime-neutral cross-runtime hook at `.opencode/hooks/goal/` this playbook family otherwise validates for Devin, Cursor, and Pi (see `PI-021` for the Pi-side scenario). `mk_goal()` is an OpenCode-only plugin tool -- calling it from Claude Code fails because the tool does not exist in a Claude Code toolset at all.

The cross-runtime hook's own `README.md` documents this boundary directly: its directory tree lists exactly three per-runtime injection adapters -- `devin/`, `cursor/`, `pi/` -- plus a `bin/` manage CLI, a `lib/` core, and an `opencode/` folder that is a browsability-only symlink back to the real `mk-goal.js` plugin (nothing loads through it). There is no `claude/` adapter folder anywhere in that tree (confirmed live below), and the constitutional rule at `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` states the routing decision explicitly: "When operating as Claude Code ... use Claude Code's own native `/goal` goal-prompting feature. Do NOT route through the OpenCode `mk-goal` plugin command."

### Why This Matters

An operator or an AI orchestrator working across runtimes could reasonably assume the cross-runtime goal hook covers Claude Code the same way it covers Devin, Cursor, and Pi, since it is explicitly a cross-runtime port. It deliberately does not, because Claude Code already ships equivalent first-party behavior. Documenting this omission as a real, well-formed scenario -- rather than silently skipping Claude Code from the playbook -- prevents a future operator from filing a false "missing adapter" defect against `.opencode/hooks/goal/`, and prevents a future AI session from routing a Claude Code goal request through `mk_goal()`, a tool call that is guaranteed to fail in that runtime.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-029` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Claude Code's session-goal behavior is its own native `/goal` feature, that `.opencode/hooks/goal/` deliberately ships no `claude/` adapter directory, and that the constitutional routing rule and the hook's own README both document this boundary consistently. Live headless validation of native `/goal` output is explicitly out of scope by design, not by omission.
- Real user request: `Can you keep track of my goal for this session so I don't have to keep re-explaining it?`
- Prompt: `As a goal-hook documentation auditor, confirm Claude Code's session-goal behavior is its own native /goal feature rather than the OpenCode mk-goal plugin or the cross-runtime .opencode/hooks/goal/ port, and confirm that port deliberately ships no Claude Code adapter directory. Verify against the constitutional routing rule and the goal-hook README, then return a documentation-only PASS/SKIP verdict naming the exact reason live validation does not apply here.`
- Expected execution process: Grep the constitutional rule doc for the native-`/goal` directive -> list `.opencode/hooks/goal/` and confirm it contains only `devin/`, `cursor/`, `pi/`, `bin/`, `lib/`, `opencode/`, and `README.md`, with no `claude` entry -> grep the hook's `README.md` for the explicit "sibling" framing and the adapter directory-tree line naming `pi/` -> grep the constitutional doc's own "Failure mode signal" section confirming `mk_goal()` is documented as a call that fails in Claude Code -> return the documentation verdict plus the SKIP reason for live validation.
- Expected signals: the constitutional doc contains the literal instruction to use Claude Code's native `/goal` and not route through `mk-goal`; the directory listing has no `claude` entry; the README's directory-tree line and "sibling" framing are present; the constitutional doc's failure-mode section names `mk_goal()`/`mk_goal_status()` as calls that do not exist in a Claude Code toolset.
- Desired user-visible outcome: A concise PASS (documentation boundary confirmed) verdict for the grounding checks, paired with an explicit SKIP verdict (and named reason) for the live model-turn portion, so the report never silently implies a headless run was attempted and failed.
- Pass/fail: PASS when all four grounding checks above are present and mutually consistent; FAIL if a `claude/` adapter directory has appeared, if the constitutional rule has been removed without a replacement pointer, or if the README no longer documents the adapter boundary. The live model-turn check is always SKIP, never PASS or FAIL, because Claude Code's native `/goal` is a first-party product surface with no cross-runtime hook state this playbook can assert against, and the port deliberately does not wire Claude Code (native coverage already exists).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Grep the constitutional routing rule for the native-`/goal` directive and the `mk_goal()` failure-mode note.
3. List `.opencode/hooks/goal/` and confirm no `claude/` adapter directory exists.
4. Grep the hook's `README.md` for the adapter-boundary framing.
5. Return the documentation verdict and the named SKIP reason for live validation.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CC-029 | Cross-runtime goal hook: Claude Code native /goal (documentation-only) | Confirm Claude Code's session-goal behavior is its own native /goal feature, that .opencode/hooks/goal/ ships no claude/ adapter, and that live headless validation is explicitly SKIP by design | `As a goal-hook documentation auditor, confirm Claude Code's session-goal behavior is its own native /goal feature rather than the OpenCode mk-goal plugin or the cross-runtime .opencode/hooks/goal/ port, and confirm that port deliberately ships no Claude Code adapter directory. Verify against the constitutional routing rule and the goal-hook README, then return a documentation-only PASS/SKIP verdict naming the exact reason live validation does not apply here.` | 1. `bash: grep -n "native" .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` -> 2. `bash: ls .opencode/hooks/goal/ \| sort` -> 3. `bash: grep -n "sibling" .opencode/hooks/goal/README.md && grep -n "goal-context.ts" .opencode/hooks/goal/README.md` -> 4. `bash: grep -n "mk_goal()" .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Step 1: the rule text instructing native `/goal` use appears; Step 2: the listing contains `bin`, `cursor`, `devin`, `lib`, `opencode`, `pi`, `README.md` and no `claude` entry; Step 3: the README's sibling framing and the `pi/` adapter directory-tree line are present; Step 4: the failure-mode note naming `mk_goal()` as a Claude Code call with no matching tool is present | Grep output for all four steps, directory listing capture, terminal transcript -- reproduced live during this file's authoring: `ls .opencode/hooks/goal/` returned exactly `README.md bin cursor devin lib opencode pi`, no `claude` entry | PASS when all four documentation checks are present and mutually consistent; FAIL if a `claude/` adapter directory now exists or the rule/README no longer document this boundary; the live model-turn portion is always SKIP with the stated reason, never counted as PASS or FAIL | If Step 2 shows a new `claude` directory, treat this scenario as stale and re-scope it against the new adapter instead of assuming a defect; if Step 1 or Step 4 text has changed, re-verify against the live file per the constitutional doc's own "re-verify the live filename" warning before concluding drift |

### Optional Supplemental Checks

- Confirm the shared state file path `.opencode/skills/.goal-state/active-goal.json` is documented as shared-but-runtime-agnostic across Devin/Cursor/Pi, and that nothing in this repo instructs a Claude Code session to read or write it directly -- Claude Code's own native `/goal` state is a separate, product-internal mechanism this repo does not expose a path for.
- If a future session adds Claude Code coverage to `.opencode/hooks/goal/`, this scenario's Step 2 expected signal (`no claude entry`) becomes the regression check that should immediately fail and prompt a rewrite of this file rather than a silent pass.
- Cross-reference `PI-021` (the Pi-side live-validated sibling scenario) for what a genuinely live-tested runtime adapter's evidence bar looks like, to keep the honesty gap between "native, out of scope" (this file) and "cross-runtime, live-tested" (`PI-021`) explicit rather than implied.

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
||---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `goal-hook/goal-hook.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

|| File | Role |
||---|---|
|| `../../../../../skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | The constitutional rule: Claude Code native `/goal`, cross-runtime routing for Devin/Cursor/Pi, and the `mk_goal()` failure-mode signal |
|| `../../../../../hooks/goal/README.md` | The cross-runtime goal-hook contract: directory tree, adapter parity tiers, explicit "sibling, not a replacement" framing |
|| `../../../../../hooks/goal/lib/goal-core.cjs` | The runtime-neutral core Devin/Cursor/Pi share; Claude Code is not a caller of this module |
|| `../../../../../commands/goal/goal-opencode.md` | The OpenCode-only `/goal:goal-opencode` router `mk_goal()` resolves to; not reachable from Claude Code |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CC-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
