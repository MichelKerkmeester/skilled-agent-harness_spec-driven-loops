# Iteration 005 — Ring 5: the whole picture

**Focus:** reconcile rings 1–4. Name every contradiction, every unowned surface, and
everything a reader would get wrong; sort the divergences into defects, deliberate
surface differences, and open design decisions; state what remains unconfirmed.

**Method:** no new ring. This iteration re-reads nothing except the last stragglers
(`references/templates/template-style-guide.md`, `.opencode/commands/speckit/save.md`,
the retrieval fixtures, `recursive-child-manifest.vitest.ts`, and the deep-loop
harness docs), then derives the register from the 36 findings, 2 corrections and 4
resolved questions already recorded in the four prior deltas.

**Prior rings kept:** everything. Rings 1–4 stand as written; the one new finding
(R5-F1) comes from the straggler pass and is marked as such.

---

## 1. The reconciled map

Five layers carry the goal system, in increasing distance from the engine:

| Layer | Owner surface | What it owns |
|---|---|---|
| Engine | `.opencode/hooks/goal/` (core + slice + CLI + README) | scope model, state files, budget arithmetic, brief rendering, packet binding, log append, legacy quarantine |
| Runtime delivery | `pi/goal-context.ts`, `cursor/goal-inject.mjs`, `devin/goal-inject.mjs`, `opencode-goal.js`, `.cursor/hooks.json` + `.devin/hooks.v1.json` (generated), Pi's `.pi/extensions` symlink | identity, injection cadence, management surfaces |
| Spec contract | spec-kit manifest + validator + resolver + template + rules + set-string playbook | what `goal.md` is, the budget numbers, the binding row, the offer/flow |
| Fleet documentation | hooks hub README + coverage rationale + `injection-contract.md` + root README + AGENTS.md | the cross-runtime support story, flags, posture |
| Validation assets | 8 plugin test suites, 3 spec-kit vitest suites, 8 playbooks, feature catalogues, benchmark records | executable proof and operator scenarios |

The engine is genuinely cross-runtime: one slice boundary (`goal-slice.cjs`) is
shared by the CommonJS core and the ESM plugin, and the two front ends render the
same `[active_goal]` block byte-for-byte (`goal-slice.cjs` + `renderGoalBrief`
parity, pinned by `opencode-goal-render-parity.test.cjs`, ring 2). Everything
divergent in the register below is either *above* that shared core (docs, labels,
scenarios) or *beside* it (the OpenCode plugin as a second engine).

## 2. The contradiction register (deduplicated, with owners and verdicts)

Severity is the lens an operator needs, not the finder's: **H** = following the
doc causes a wrong action or a false verdict; **M** = the doc and the code disagree
about observable behaviour; **L** = wording, counts, or citations.

| # | Contradiction | Surfaces in conflict | Verdict |
|---|---|---|---|
| C1 | Durable budget applies to phase children **H** | manifest `spec-kit-docs.json:26`, validator `spec-doc-structure.ts:1051`, rules `validation-rules.md`, playbook, template banner vs hook `goal-slice.cjs:267-285`, `bin/goal.cjs:169`, `opencode-goal.js:3061` | **Defect in the hook.** Five surfaces agree; the hook disagrees with the manifest that owns the numbers. Fix the hook (skip the budget for phase children). R1-F4 → R3-F1 |
| C2 | Flag naming teaches the alias, or a dead name **H** | canonical = `OPENCODE_GOAL_DISABLED` (hub `hooks/README.md:50`, `shared/README.md:88`, `ENV-REFERENCE.md:83`, test-pinned `hook-flags.test.cjs:38`) vs `goal-plugin.md:61`, `.env.example:291` section header, `plugins/README.md:96-98` (rule computes to the dead name), local `hook-flags.env:25` | **Defect cluster, docs-side.** The alias pair is deliberate; teaching the alias first is not. Fix plugins README, make error messages name the variable that fired (R1-F2), retire the dead local line. R1-F1 (downgraded), R1-F2, R2-F3, R2-F9, R4-F6 |
| C3 | `/goal resume` semantics **M** | plugin `opencode-goal.js:1952` (`paused|usage_limited|budget_limited`) vs both catalogues ("paused or usage_limited") vs core `goal-core.cjs:1327` (paused only) | **Docs defect + mapping gap.** Fix both catalogues; add a line stating the core's stricter rule. R4-F1 |
| C4 | Status vocabularies `completed`/`cleared` vs `complete`/`blocked`/`usage_limited`/`budget_limited` **M** | `goal-core.cjs:73` + engine `README.md:37` vs `opencode-goal.js:153-160` + plugin docs | **Deliberate difference, undocumented.** Decide: rename core's `completed`→`complete`, or document the mapping. R4-F2 |
| C5 | "Injection-only" implies read-only **M** | engine `README.md:79`, root `README.md:864`, `coverage-rationale.md:82`, CE-P03 vs `cursor/goal-inject.mjs:36`, `devin/goal-inject.mjs:25` (both call `recordTurn`) | **Docs defect.** Say "no management surface; still records the turn". R1-F5, R4-F11 |
| C6 | Injection cadence "on every turn" **M** | root `README.md:861` vs `injection-contract.md:139-140` and the Cursor registration (sessionStart only) | **Docs defect.** Qualify Cursor. R4-F7 |
| C7 | Kill switch blocks documented session-free reads **M** | `bin/goal.cjs:395-401` + docs "session-free" vs the gate preceding routing; library `appendPacketLog`/`describePacketGoal` skip the check | **Open design decision.** Either read-only actions bypass the switch, or the docs stop calling them session-free-while-disabled. R1-F3 |
| C8 | `OPENCODE_GOAL_STATE_DIR` documented as the goal-state override **M** | `.env.example:304`, engine README vs `opencode-goal.js:34` (ignores it) | **Docs defect or plugin gap.** Qualify "core/CLI only" or honour it in the plugin. R2-F2 |
| C9 | CLI status omits `tokens_used` **L** | `goal-plugin.md:103-105` vs `bin/goal.cjs:131` (plugin emits both, `opencode-goal.js:2960-2970`) | **Docs/field defect.** Emit it, or name `usage_source` canonical for the CLI. R1-F6 |
| C10 | Claude/Codex "native host goal command" **M** | hub matrix `hooks/README.md:234`, `coverage-rationale.md:82`, root `README.md:862` vs nothing in-repo (CC-029 exists to say it is unverifiable) | **Assertion about host behaviour**, deliberately fenced by CC-029's PASS/FAIL ("does not prove whether a live Claude product version exposes…"). Keep, but see C14 for its dying authority. R2-F8 |
| C11 | Dead citations and stale numbers in validation assets **L** | CL-007 cites `goal_opencode.md` (4×), CC-029 + benchmark JSON cite the deleted constitutional rule, CO-039 pins 7/125 vs observed 8/137, PI-021 expects `pi-<sha256>.json`, save.md's `log` example omits scope flags | **Defects (docs + one runnable command).** Fix paths/flags; add a machine check (see §6). R4-F3, R4-F4, R4-F5, R4-F9, R5-F1 |
| C12 | `goal.md` budget scope in the public README ("a parent goal") **L** | `README.md:865` vs manifest `spec-kit-docs.json:26` | **Wording defect.** Say "phase parents and top-level packets", or move the sentence to the reference. R4-F8 |
| C13 | Hub matrix restates Claude/Codex coverage **L** | `hooks/README.md:234` vs `coverage-rationale.md:82` vs root README — three copies of one sentence | **Duplication, currently consistent**; consolidation candidate (§3). R3-Q1 |
| C14 | Two implementations of the workspace-root walk **L** | `goal-slice.cjs:213` (plugin) vs `goal-core.cjs:161` (core) | **Live drift risk, not dead code.** Consolidate one direction. R1-F7 (corrected in ring 2) |
| C15 | "goal" names four unrelated things **L** | session-goal system vs generic prose vs `goal-file-manifest.txt` (`deep-review-auto.yaml:373-376`, live gate `check-goal-file-manifest.sh`, tracked by `recursive-child-manifest.vitest.ts:14-22`) vs ClickUp product goals | **Naming hazard.** Optional note; no behaviour at stake. R4-F10 |

Ruled out along the way (do not carry forward as defects): the hub matrix's
comment-folded cells (model-wide convention), `hook-flags.sh`'s inability to
resolve `goal` (no goal consumer), `dispatch-guard.cjs`'s "mirroring
opencode-goal" comments (textual inspiration), `repo-rules/*` (zero goal text),
dist staleness (in step, freshness-gated), the `goal.md` scaffold/metadata
surfaces (consistent, tested), and `ENV-REFERENCE.md`'s plugin-scoped roster
(correct for its stated scope; the `OPENCODE_GOAL_STATE_DIR` /
`OPENCODE_GOAL_RUNTIME_LABEL` roster gap is recorded in ring 4 §4).

## 3. Unowned surfaces (facts with no single owner, or consumers with no writer)

1. **The flag pair is hand-copied in five places** — hub table
   (`hooks/README.md:50`), shared README (`shared/README.md:88`),
   `ENV-REFERENCE.md:83`, the plugin README rule (`plugins/README.md:96-98`),
   and the operator's local `hook-flags.env`. Two of the five are wrong today.
   Nothing generates any of them from `hook-flags.cjs`; the tests pin the
   resolver, not the prose.
2. **The runtime support story is copied in six places** — `hooks/README.md:234`,
   `coverage-rationale.md:82`, root `README.md:861-864`, engine `README.md`,
   `hook-system.md:99`, and `speckit-plan.yaml:162-174` — plus per-runtime
   playbooks and catalogues. They agree today except for C5–C7; no generator and
   no test covers the prose.
3. **The `.opencode/skills/.state/goal/` directory has two writer families** —
   the OpenCode plugin (`<hex-session>.json`) and the runtime-neutral core
   (`<sha256-of-[workspace,runtime,sessionId]>.json`) — documented by one
   README inside the state dir, which is tracked only through the `.gitignore`
   negation at `:108-109`. Two engines, one doc, no ownership split stated.
4. **`speckit-goal-offer-contract.test.cjs` lives in the plugin test directory
   but owns the speckit presentation contract** (four lifecycle assets + router
   markdown); it is listed in neither `goal-plugin.md:35` nor the engine README.
   A cross-skill contract with a plugin-dir home.
5. **The root README's Goal section** — excluded from both retrieval lanes
   (`retrieval-conventions.md:282`) and covered by no test; it is the only
   goal document a public reader meets, and it carries C6 and C12.
6. **`goal-file-manifest.txt` and `check-goal-file-manifest.sh`** — the manifest
   format has two parsers (`deep-review-auto.yaml:373-376` and the gate script)
   and the gate lives in a spec packet under `specs/`, consumed by a live
   vitest (`recursive-child-manifest.vitest.ts:14-22`). A live test depending
   on a packet artifact is an ownership seam.
7. **Benchmark records as goal documentation** — the cli-claude-code benchmark
   report set (5 files) carries the constitutional citation and the SKIP
   rationale; nothing regenerates it when the cited rule moves.
8. **`OPENCODE_GOAL_STATE_DIR` / `OPENCODE_GOAL_RUNTIME_LABEL`** — live env vars
   with no roster row (§4 of ring 4); owned by `.env.example` alone.

## 4. Everything a reader would get wrong (consolidated, in the order a grepper meets it)

1. **The disable flag.** Read `plugins/README.md`, then look at the local env
   file, and you set `SYSTEM_GOAL_DISABLED` — which disables nothing. The
   correct name is `OPENCODE_GOAL_DISABLED`; the alias works too. (C2)
2. **What `resume` resumes.** Two catalogues say paused/usage_limited; the
   plugin also resumes budget_limited; the CLI/Pi path resumes only paused. (C3)
3. **The status vocabulary.** `status=completed` (CLI) and `status=complete`
   (plugin) are the same concept; `cleared`, `blocked`, `usage_limited`,
   `budget_limited` are surface-specific. (C4)
4. **Cursor's cadence.** "On every turn" is false there: one sessionStart
   delivery. (C6)
5. **"Injection-only".** Cursor and Devin do write (turn counter, revision);
   they lack a management surface, not write access. (C5)
6. **The phase-child budget.** A phase child over 4,000 chars passes
   `validate.sh --strict` and then `goal packet`/`bind` calls it "past the error
   tier". Phase children are unbounded by contract. (C1)
7. **Which command file to read.** CL-007 sends you to `goal_opencode.md`; the
   file is `goal-opencode.md`. (C11)
8. **Where the Claude boundary rule lives.** CC-029 and its benchmark cite a
   constitutional file that was removed. (C11)
9. **How many plugin suites exist.** Eight, 137 tests; CO-039 says seven and
   125. (C11)
10. **Fresh Pi state filenames.** `<sha256>.json`, not `pi-<sha256>.json`;
    the `pi-` form is the legacy adoption name. (C11)
11. **The save-time log command.** The documented CLI form without
    `--runtime/--session` fails with `MISSING_RUNTIME`; the `packet-log` form on
    the next line is complete and works without a session. (C11, R5-F1)
12. **The word "goal" itself.** Four systems share it; `goal-file-manifest.txt`
    has nothing to do with `goal.md`. (C15)

## 5. R5-F1 — the documented save-time `log` command is unrunnable as written

`speckit/save.md:61` instructs the save workflow to "Always use the locked
append: the goal command's log action on a bound session (`node
.opencode/hooks/goal/bin/goal.cjs log "<item> | <state> | <evidence>"` …)".
Verified against the router: `log` is **not** in `actionsWithoutScope`
(`bin/goal.cjs:401`), so `resolveGoalScope(options)` runs before dispatch
(`:402-408`) and throws `MISSING_RUNTIME` / `MISSING_SESSION_ID` when the flags
are absent; `goalOptions` defaults only `workspace` to `process.cwd()`
(`:72-79`). The tool form (`opencode_goal({action:"log"…})`) is fine, and the
`packet-log` form on the same line is complete (its action *is* scope-exempt,
`:401`, and it takes `--workspace` anyway). So the first of the three documented
appends fails for exactly the runtime the CLI form exists for (Pi/Cursor/Devin
without a management surface). Fix: add `--runtime <r> --session <id>
--workspace "$PWD"` to the example, or point it at `packet-log`. The cell
splitting itself is correct (`runLog` at `:196-204` joins and splits on `|`,
matching the documented `"<item> | <state> | <evidence>"` shape).

## 6. Defects, deliberate differences, and decisions — the sorting ring 3 asked for

**Fix now (docs or hook, no design input needed):** C1 (hook budget scope),
C2's plugins-README rule + error messages, C3 (catalogue sentences + a core
note), C5, C6, C11 (all six stale items, incl. R5-F1), C12, C14 (pick one
workspace-root walk).

**Decide (needs an owner's intent):** C4 (rename or mapping), C7 (does the kill
switch silence read-only actions?), C8 (qualify the env var or honour it),
C9 (emit the field or document the CLI's naming).

**Keep and fence:** C10 (host-behaviour claim), C15 (optional naming note),
C13 + §3 items 1–2 (duplication is the deliberate maintenance model — keep it,
but consider a generator or a prose check so the next drift is caught rather
than found).

**Machine checks the rot in §C11 argues for:** the offer-contract test already
proves the pattern works (it pins text and tool lists across assets). The same
style could pin the playbooks' cited paths, the suite/test counts, the
constitutional reference (or its replacement), and the flag pair in the four
prose rosters. Scope decision for the unification work, recorded not assumed.

## 7. Convergence statement

Ring yields over the run: ring 1 = 9 findings, ring 2 = 9, ring 3 = 6, ring 4 =
11 (+1 downgrade), ring 5 = 1 new + the register. Production never fell to zero,
and ring 4 — the widest ring — was the second-highest producer, which is the
honest signal that this run stopped on the **max-iterations cap**, not on
exhaustion. `convergenceThreshold` 0.05 was never operative (telemetry only,
per the charter).

Residual unknowns, with what would settle each:

- **C7's intent** — ask the engine's owner whether a disabled hook is meant to
  freeze read-only packet reads. UNKNOWN (design).
- **C10's host behaviour** — a live Claude Code / Codex session with a native
  `/goal`; not observable from this repository. UNKNOWN by construction; CC-029
  says so, which is the correct posture.
- **C4's durable answer** — a decision, not a fact.
- **Every claim about the two ignored env vars, the plugin's state-dir
  computation and the legacy adoption path** was confirmed by reading code, not
  by running a live OpenCode session except where ring 2 recorded live-serve
  evidence (CO-039's evidence block predates this run; this run executed the
  unit suites only). A live `/goal bind` on OpenCode would settle the remaining
  runtime-observed gaps; nothing in the register depends on that.

**New in this ring:** R5-F1 (above), and the reconciled register itself.

---

## Evidence index (ring 5 additions)

| Claim | Source |
|---|---|
| `log` requires scope; `packet-log` exempt | `bin/goal.cjs:401-408`, `:410-418` |
| `log` cell splitting | `bin/goal.cjs:196-204` |
| `packet-log` cell splitting | `bin/goal.cjs:224-234` |
| Workspace default only | `bin/goal.cjs:72-79` |
| Save workflow's three append forms | `.opencode/commands/speckit/save.md:61` |
| Template style guide rows (goal.md lazy + packet-type omissions) | `references/templates/template-style-guide.md:42-45` |
| Retrieval fixtures are generated corpus dumps | `runtime/cli/retrieval/fixtures/{corpus-manifest,generated-diagnostics,phrase-variants}.json` |
| Gate script for the tracked-file manifest | `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` |
| Live test depends on that packet gate | `runtime/cli/tests/recursive-child-manifest.vitest.ts:14-22` |
| Deep-loop research charter uses "Non-Goals" only | `deep-research/SKILL.md:332`; `loop-protocol.md:93-96` |
