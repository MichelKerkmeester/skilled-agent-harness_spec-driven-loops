---
title: "Research: repo-wide goal surfaces"
description: "Five expanding rings over every goal-related surface in the repository: the engine, the runtime surfaces, spec-kit's contract, everything else that touches a goal, and a reconciliation naming fifteen contradictions."
trigger_phrases:
  - "repo wide goal research"
  - "goal contradiction register"
  - "goal surfaces inventory"
  - "goal documentation drift"
importance_tier: important
contextType: research
---

# Research: repo-wide goal surfaces

Session `fanout-deepseek-1789192823658-autusz` · executor `cli-pi model=deepseek-v4.1-flash` ·
five rings, stop policy `max-iterations` · this report reconciles iterations 1–4 and adds
ring 5's straggler pass and register.

**Question.** Every goal-related surface in this repository: what exists, what it actually
does, where it disagrees with another surface or document, what reads as live but is not, and
what a new reader would get wrong.

**Answer in one paragraph.** A cross-runtime session-goal system exists and works: one shared
slice boundary (`.opencode/hooks/goal/lib/goal-slice.cjs`) feeds a runtime-neutral core and a
second OpenCode-native engine, three spec-kit documents agree on the `goal.md` contract and
its 3,000/4,000-character durable budget, and eight distributed suites plus three spec-kit
suites pin the behaviour and pass. Around that working core, the *documentation and validation
layer* has drifted: the durable budget is enforced on phase children by the hook alone (five
other surfaces declare them unbounded), the disable flag is taught three ways (one of them
dead), `/goal resume` has three behaviours across code and catalogues, the two engines use
incompatible status vocabularies, "injection-only" hides real writes, and the operator
playbooks carry a dead citation set, a wrong filename, stale suite counts and one unrunnable
command. The register below separates defects that should be fixed from differences that are
deliberate but undocumented.

---

## 1. Scope and method

- **Rings.** 1 engine (`.opencode/hooks/goal`, 14 files / ~6,600 lines). 2 every runtime
  surface (OpenCode plugin 3,372 lines + 8 suites, registries, generated mirrors, three command
  surfaces, discovery paths). 3 spec-kit's contract (manifest, validator, resolver, template,
  rules, set-string playbook, lifecycle assets, retrieval). 4 everything else (root
  instructions, repo rules, hook hub, shared flags, env rosters, three feature catalogues,
  eight playbooks, scaffold metadata, template tests, advisor metadata, collision surfaces).
  5 reconciliation + stragglers.
- **Evidence rule.** Every statement about current behaviour carries a `file:line` that was
  opened; design conclusions are marked CLAIM, unconfirmed items INFERRED/UNKNOWN with their
  settling action. One command was executed as evidence: the eight plugin suites
  (`node --test .opencode/plugins/tests/opencode-goal-*.test.cjs` → 137/137 pass).
- **Excluded surfaces, with reasons.** `specs/**` prior research and other lineages (prior
  claim sets, not current behaviour); `barter/`, `.worktrees/**`, `**/containment/**`
  (vendored/other checkouts and harness baselines); retrieval fixtures (generated corpus dumps);
  generated changelogs.
- **Deviation.** The deep-research append gateway writes outside this lineage's bound write
  surface, so state was recorded in-lineage in the gateway's shape (recorded in
  `deep-research-config.json` and `deep-research-state.jsonl`).

## 2. The system, reconciled

| Layer | Owner | State |
|---|---|---|
| Engine | `.opencode/hooks/goal/` (`goal-core.cjs`, `goal-slice.cjs`, `bin/goal.cjs`, README) | Scope = sha256 of `[workspace, runtime, sessionId]`; no default session; atomic 0600/0700 writes under cross-process locks; legacy singleton quarantined; kill switch `OPENCODE_GOAL_DISABLED` |
| Second engine | `.opencode/plugins/opencode-goal.js` | Own state machine (6 statuses), supervisor/verifier, guarded continuation (default off), tools `opencode_goal`/`opencode_goal_status`, native token accounting |
| Delivery | Pi (`input`, `session_start`, `turn_end` observe-only verify), Cursor (`sessionStart` only), Devin (`SessionStart` + `UserPromptSubmit`), OpenCode (transform + tools) | All four fail open; Cursor/Devin lack management surfaces but still call `recordTurn` |
| Contract | `templates/spec-kit-docs.json` (numbers), `spec-doc-structure.ts` (enforcement), `goal.md.tmpl`, `validation-rules.md` §12, `goal-set-string-playbook.md` | `goal.md` is an optional add-on at every level; budget bounds phase parents and top-level packets, phase children unbounded; binding rows must name a child `goal.md` on disk |
| Handoff | `speckit-plan.yaml:141-206`, `speckit-{complete,implement}.yaml`, `resume-*` | Offer line pinned across four assets; plan binds when `goal.md` exists; Claude/Codex read the packet hash session-free and paste the stripped slice |
| Fleet docs | hook hub README + matrix, `coverage-rationale.md`, `injection-contract.md`, root README, AGENTS.md | Posture and support story; five hand-copied rosters (see §4) |

## 3. The contradiction register

Severity: **H** = following the doc causes a wrong action or a false verdict; **M** = doc and
code disagree on observable behaviour; **L** = wording, counts, citations.

| # | Contradiction | Verdict |
|---|---|---|
| C1 H | Durable budget: hook applies it to phase children (`goal-slice.cjs:267-285`, `bin/goal.cjs:169`, `opencode-goal.js:3061`) while manifest, validator, rules, playbook and template banner scope it to phase parents + top-level packets (`spec-kit-docs.json:26`, `spec-doc-structure.ts:1051`) | **Defect in the hook** (five surfaces agree; hook is the outlier) |
| C2 H | Flag naming: canonical `OPENCODE_GOAL_DISABLED` (three rosters, test-pinned) vs `plugins/README.md:96-98` whose rule computes to the dead `SYSTEM_GOAL_DISABLED` vs the local `hook-flags.env:25` carrying that dead name vs docs teaching the alias first (`goal-plugin.md:61`, `.env.example:291`) | **Docs defect cluster**; alias pair itself deliberate |
| C3 M | `/goal resume`: plugin `paused|usage_limited|budget_limited` (`opencode-goal.js:1952`) vs both catalogues ("paused or usage_limited") vs core `paused` only (`goal-core.cjs:1327`) | **Docs defect + mapping gap** |
| C4 M | Status vocabularies: core `active|paused|completed|cleared` (`goal-core.cjs:73`) vs plugin `active|paused|blocked|usage_limited|budget_limited|complete` (`opencode-goal.js:153-160`); `completed` vs `complete` collide | **Deliberate, undocumented** — decide rename or mapping |
| C5 M | "Injection-only" (engine README:79, root README:864, coverage-rationale:82, CE-P03) vs Cursor/Devin adapters calling `recordTurn` (`cursor/goal-inject.mjs:36`, `devin/goal-inject.mjs:25`) | **Docs defect** |
| C6 M | Root README:861 "on every turn" vs Cursor sessionStart-only (`injection-contract.md:139-140`, `.cursor/hooks.json`) | **Docs defect** |
| C7 M | Kill switch blocks documented session-free reads (`bin/goal.cjs:395-408`) while library `appendPacketLog`/`describePacketGoal` skip the check | **Open design decision** |
| C8 M | `OPENCODE_GOAL_STATE_DIR` documented as the override (`.env.example:304`, engine README) but the plugin ignores it (`opencode-goal.js:34`) | **Qualify or implement** |
| C9 L | `tokens_used` documented canonical (`goal-plugin.md:103-105`) but CLI emits only `usage_source` (`bin/goal.cjs:131`; plugin emits both, `opencode-goal.js:2960-2970`) | **Field/doc defect** |
| C10 M | Claude/Codex "native host goal command" asserted three ways; nothing in-repo verifies it; CC-029 exists to fence it but its authority is the dead citation in C11 | **Keep, fenced** (host behaviour) |
| C11 L | Validation-asset rot: CL-007 cites `goal_opencode.md` (4×); CC-029 + benchmark JSON cite the deleted constitutional rule; CO-039 says 7 suites/125 vs observed 8/137; PI-021 expects `pi-<sha256>.json`; save.md's `log` example omits scope flags (R5-F1) | **Six defects** |
| C12 L | Root README "a parent goal" vs manifest "phase parents and top-level packets" | **Wording defect** |
| C13 L | Claude/Codex support sentence copied in hub matrix, coverage rationale and root README | **Duplication, consistent** |
| C14 L | Two live workspace-root walks (`goal-slice.cjs:213` used by the plugin, `goal-core.cjs:161` used by core/Pi) | **Drift risk** — consolidate |
| C15 L | "goal" names four systems; `goal-file-manifest.txt` (deep-review scope manifest, gate script under a spec packet) is unrelated to `goal.md`; ClickUp's goals card is self-declared unsupported | **Naming hazard** |

## 4. Unowned surfaces

Five hand-copied flag rosters; six copies of the runtime support story; one state-dir README
documenting two engines' layouts; a speckit contract test living in the plugin test dir and
listed in no goal doc; the root README's Goal section (excluded from both retrieval lanes,
covered by no test); `goal-file-manifest.txt` with two parsers and a packet-resident gate
consumed by a live vitest; benchmark records that cite documents which move; and
`OPENCODE_GOAL_STATE_DIR` / `OPENCODE_GOAL_RUNTIME_LABEL` present only in `.env.example`.

## 5. What a reader would get wrong

The twelve traps in iteration-005 §4: the dead flag name; what `resume` resumes; the two
status vocabularies; Cursor's cadence; "injection-only" meaning read-only; the phase-child
budget; the stale command filename; the dead constitutional citation; the suite/test counts;
the legacy `pi-` filename; the unrunnable save-time `log` command; and the word "goal" itself.

## 6. Defects, differences, decisions

- **Fix now:** C1 (hook budget scope), C2's plugins-README rule and the error messages that
  name the wrong variable (R1-F2), C3's two catalogue sentences + a one-line core note, C5, C6,
  C11's six items (including R5-F1), C12, C14.
- **Decide:** C4 (rename `completed`→`complete` or document the mapping), C7 (does disabled
  mean frozen?), C8 (qualify the env var as core-only or honour it), C9 (emit `tokens_used` or
  document the CLI's naming).
- **Keep and fence:** C10 (host behaviour), C13 and the §4 duplications (the maintenance model —
  consider a prose check so the next drift is caught), C15 (optional naming note).
- **Cheap machine checks the rot argues for:** extend the offer-contract pattern to pin
  playbook cited paths, suite/test counts, the constitutional reference's replacement, and the
  flag pair across the four prose rosters.

## 7. Confidence, residual unknowns, and how to settle them

- **Confirmed by reading:** everything in the register except C10 and the design-intent parts
  of C7. **Confirmed by running:** the eight plugin suites (137/137) and the suite/file counts
  behind C11.
- **UNKNOWN (design):** C7's intent — settle by asking the engine owner; C4's durable answer —
  a decision.
- **UNKNOWN (by construction):** C10 — a live Claude Code / Codex native goal command; neither
  observable nor falsifiable from this repository, which is exactly what CC-029 says.
- **INFERRED, with provenance:** the deleted constitutional rule's former content (a git
  `lost-found` object describing the `/goal` → `/opencode_goal` rename) — settle by restoring
  or repointing the citations.
- **Runtime-observed gap:** this lineage ran the unit suites but not a live OpenCode session;
  nothing in the register depends on it, but a live `/goal bind` + transform pass would close
  the last observational gap.

## 8. Artifacts

`iterations/iteration-001..005.md` (per-ring evidence) · `deltas/iter-001..005.jsonl` (36
findings, 2 corrections, 4 resolved questions) · `deep-research-state.jsonl` (6 records + final)
· `findings-registry.json` (regenerated from the deltas by `logs/registry-build.cjs`)
· `convergence-report.md` · `deep-research-dashboard.md`.
