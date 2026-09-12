# Iteration 003 — Ring 3: spec-kit's own goal contract

**Focus:** the goal template, the budget contract, the validator rules, the set-string
playbook, the lifecycle workflow assets and the retrieval surfaces that make them reachable.
**Method:** the manifest's goal block and level contracts; the validator's goal checks and its
slice extractor; the budget resolver; the template; the playbook; the five speckit workflow
YAMLs and four presentation files; the goal-offer contract test; the retrieval index.
**Prior rings kept:** rings 1 and 2 in full, including the R1-F7 correction. Ring 3 converts
R1-F4 from a suspicion into a proven three-way contradiction, and narrows R2-F8.

---

## 1. What exists in this ring, by path

| Surface | Path | Size |
|---|---|---|
| Budget contract | `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | `goalDurableBudget` block at `:24-29` |
| Goal template | `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | 4,049 bytes |
| Budget resolver | `.../runtime/lib/templates/level-contract-resolver.ts` | `resolveGoalDurableBudget` at `:288` |
| Validator goal checks | `.../runtime/lib/validation/spec-doc-structure.ts` | `validateGoalDocument` at `:1049`, extractor at `:1029` |
| Validation reference | `.../references/validation/validation-rules.md` | §12 at `:684-722` |
| Set-string playbook | `.../references/workflows/goal-set-string-playbook.md` | 150 lines |
| Workflow assets | `.opencode/commands/speckit/assets/speckit-{plan,complete,implement,resume-auto,resume-confirm}.yaml` | `goal_prompting` blocks |
| Presentation assets | `.opencode/commands/speckit/assets/speckit-{plan,complete,implement,resume}-presentation.txt` | the offer line |
| Router files | `.opencode/commands/speckit/{plan,complete,implement,resume}.md` | `allowed-tools` |
| Offer contract test | `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | pins all of the above |
| Scaffold path | `.../runtime/cli/spec/create.sh` | `--with-goal` at `:153`, `:283`, `:462` |
| Level contract | `spec-kit-docs.json` `levels.*.lazyAddonDocs` | `goal.md` at every level |
| Retrieval | `.../runtime/data/trigger-index.json` | indexes the engine docs and the playbook |
| State-dir doc | `.opencode/skills/.state/goal/README.md` | 10,364 bytes, tracked by a `.gitignore` negation |

---

## 2. What it actually does

### 2.1 The contract is single-sourced and every reader quotes the same pair

`spec-kit-docs.json:24-29` carries the block, including a `measure` sentence and an
`appliesTo` sentence:

```
"measure": "characters after the frontmatter closing fence up to the log anchor, anchors and comments included",
"appliesTo": "phase parents and top-level packets; phase children are unbounded",
"warnChars": 3000,
"errorChars": 4000
```

`resolveGoalDurableBudget` (`level-contract-resolver.ts:288-299`) reads exactly
`warnChars` and `errorChars`, validates them, and explicitly tolerates a missing block ("the
validator then checks nothing"). Every prose surface quotes the same two numbers:
`validation-rules.md:698`, `goal-set-string-playbook.md:28`, `:65`, `:124` and
`goal.md.tmpl`'s banner.

### 2.2 The two slice extractors agree on purpose, and the code says so

`spec-doc-structure.ts:1029-1031`:

> Same boundary the runtime extractor draws: bare CR normalized too, and a fence tolerates
> trailing spaces or tabs, so both count the same slice.

Both normalize bare CR (`:1030` against `goal-slice.cjs:39`), both tolerate trailing fence
whitespace (`:1031` against `goal-slice.cjs:24-25`), both stop at `<!-- ANCHOR:log -->`
(`:1023`, `:1039` against `goal-slice.cjs:19`, `:57`), and both fail closed on an unclosed
opener — the validator returns an empty slice (`:1037`), the hook returns `broken: true` which
`readPacketGoal` turns into unbound (`goal-slice.cjs:44`, `:309`). **Measure parity holds.**

### 2.3 `goal.md` is optional everywhere and never scaffolded unasked

`goal.md` is in `lazyAddonDocs` at level 1, 2, 3, 3+ **and** phase — never in
`requiredCoreDocs` or `requiredAddonDocs`. The playbook states the rule
(`goal-set-string-playbook.md:100`): "Nothing writes `goal.md` unasked." Two paths exist:
`create.sh ... --with-goal` (`goal-set-string-playbook.md:102`, wired at `create.sh:153`,
`:283`, `:462`, and advertised in create's own help at `:1809`), or a by-hand render through
`inline-gate-renderer.sh` with the addon template (`goal-set-string-playbook.md:106-110`).

### 2.4 Binding rows are validated, in three notations

`validateGoalDocument` checks the `binding` anchor's rows (`:1069-1085`) and
`bindingRowTarget` (`:1096-1110`) accepts bare text, a code span, or a markdown link. Its
comment explains why (`:1091-1094`): recognising only one notation "let the other two name a
child that was never written and still pass, which is the whole failure this rule exists to
catch."

### 2.5 Claude and Codex get a documented handoff, not an injection

`speckit-plan.yaml:200` gives them the mechanism:

> On claude-code and codex, read the hash at every command entry with
> `node .opencode/hooks/goal/bin/goal.cjs packet <spec_path> --workspace <repo root>` and
> compare `packet_slice_hash` against the hash last rendered this session. Different means
> resend; equal means stay silent. A first entry with no held hash renders once.

So the handoff path exists and is specified. This **narrows R2-F8**: what is absent for Claude
and Codex is goal *injection* and goal *management*; the *resync* path is documented and rests
on the session-free `packet` read.

---

## 3. Where it disagrees with another surface, or with a document

### R3-F1 — The budget scope contradicts itself three ways, and the hook is the odd one out

Proof on each side, all opened:

| Surface | What it does with a phase child over 4,000 characters |
|---|---|
| `spec-kit-docs.json:26` | declares it **out of scope**: "phase children are unbounded" |
| `spec-doc-structure.ts:1051` | **skips the check**: `budgetApplies = level === 'phase' \|\| !isPhaseChildFolder(folder)`, where `isPhaseChildFolder` is "the parent folder has a `spec.md`" (`:1045-1047`) |
| `validation-rules.md:694-696` | documents the skip: "**Phase children**: unbounded. A child binds through its parent and is never set directly." |
| `goal-set-string-playbook.md:65` | documents the skip: "Children are unbounded." |
| `goal.md.tmpl` banner | scoped correctly: "A phase parent or top-level packet warns past 3000 … fails past 4000" |
| `goal-slice.cjs:267-285` | **applies it anyway**: reads only the two numbers, drops `appliesTo`, compares every packet |
| `bin/goal.cjs:169-171` | emits `packet_budget=over` plus `warning="durable slice is N characters; past the error tier"` |
| `opencode-goal.js:3061-3063` | emits the same on `bind` |

So a phase child that the validator passes silently is reported by both goal front ends as
being past the error tier. This is now a `CLAIM`-quality conclusion with evidence on both
sides: **the hook is the only surface of six that got the scope wrong**, which makes it a bug
rather than a design position.

**R1-F4 is upgraded to confirmed and cross-checked.** The practical harm is a false positive an
operator will act on: they will cut a phase child's criteria to satisfy a limit that does not
apply to it, and `goal-set-string-playbook.md:71` told them never to drop a criterion.

### R3-F2 — The same offer text means two different things across the lifecycle

`speckit-goal-offer-contract.test.cjs:16` pins one literal across four presentation files:

```
Session Goal (optional): A) Offer or reference a session goal for this workflow  B) Set goal: <objective>  C) Skip
```

and `:85-90` asserts that literal in every presentation asset. The behaviours behind it differ
by workflow:

- `speckit-plan.yaml:142-146`: `default_choice: offer`; the `set` choice "Set a session goal
  only when `goal_objective` is provided", with `bind_when_goal_present` routing to `bind`
  (`:160-161`).
- `speckit-resume-auto.yaml:33-35`: `offer` is "Render **or reference** the current
  session-goal status in the resume brief; **do not call `opencode_goal`**", and `set` is
  "Carry `goal_objective` into the resume brief and **route actual setting to a
  mutation-capable surface**".
- `speckit-resume-auto.yaml:29` states it flatly: "resume does not call `opencode_goal`."

The test locks the text and the tool list — `:126-131` asserts `resume.md` may allow
`opencode_goal_status` but **not** bare `opencode_goal` — and nothing locks the semantics. So
an operator who learned the offer from `/speckit:plan` and meets the same sentence on
`/speckit:resume` gets a different outcome, and no test would notice if a third meaning
appeared.

### R3-F3 — `speckit-plan.yaml` documents a capitalised runtime namespace

`speckit-plan.yaml:190`:

```
pi: 'node .opencode/hooks/goal/bin/goal.cjs bind <spec_path> --runtime Pi --session <native session id> --workspace <repo root>'
```

`RUNTIME_NAMESPACE_PATTERN` is `/^[a-z][a-z0-9-]{0,63}$/` (`goal-core.cjs:51`), which `Pi`
fails — but `normalizeRuntimeNamespace` lowercases before testing (`goal-core.cjs:166`), so
`Pi` is accepted and stored as `pi`. The command is therefore correct and reads as a typo.
A reader who copies the capitalisation into a runtime that does *not* normalise, or who reads
`RUNTIME_NAMESPACE_PATTERN` first and concludes the line is broken, has no way to tell which
reading holds without running it.

### R3-F4 — The engine README's flag table is the only place that presents the alias unsplit

Ring 1 and ring 2 each found a surface naming the disable alias as primary. Ring 3 finds the
authoritative one: `.opencode/hooks/README.md:50` carries the hub's coverage row and names
**both** — `OPENCODE_GOAL_DISABLED` canonical, `OPENCODE_GOAL_PLUGIN_DISABLED` alias — with
status `enabled` and kind `inject / tool`. So the correct pairing exists in the repository, and
the three surfaces that get it wrong (`.opencode/hooks/hook-flags.env:25`,
`.opencode/commands/goal-opencode.md:56`, `.opencode/hooks/goal/goal-plugin.md:61`) are all
downstream of a hub that is right.

### R3-F5 — The retrieval index reaches the engine docs but not the playbook's own rules

The trigger index indexes `.opencode/hooks/goal/README.md` (`paths[11]`),
`.opencode/hooks/goal/goal-plugin.md` (`paths[12]`), `.opencode/skills/.state/goal/README.md`
(`paths[27]`), `goal-set-string-playbook.md` (`paths[1696]`), the spec-kit and skill-advisor
feature catalogues, the three CLI manual-testing playbooks, and
`manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md` (`paths[110]`).

Two things a reader would get wrong from that list: `paths[27]` is a README **inside the
live state directory** — it is tracked only because `.gitignore:109` negates
`.state/*/README.md` — and the index has no entry for
`validation-rules.md` §12 or the goal template, so the retrieval surface reaches the
*engine's* documents and the *playbook*, but not the *rule* that checks the budget. A search
for the durable-budget rule finds the playbook's prose and not the validator's.

### R3-F6 — The plan workflow's set path ignores the budget it just checked

`speckit-plan.yaml:160-161` routes a packet that has a `goal.md` to `bind`. That is the
right call and `README.md:60` explains why (the packet is then the source from the first
turn). But `bind` is the one action that reports `packet_budget` — so the workflow that
decides to bind is also the workflow that will surface R3-F1's false positive to the operator,
under clause B of the offer it just rendered. The two rings interact: the ring-3 workflow
triggers the ring-1 scope bug.

---

## 4. What is unreachable, unused, or reads as live but is not

1. **`resolveGoalDurableBudget`'s `appliesTo`** is read by nobody — not by the resolver (which
   drops it), not by the template, not by the playbook. Only the validator re-derives the scope
   from the folder layout (`spec-doc-structure.ts:1051`). So the manifest sentence and the
   validator's rule are two independent encodings of one policy, and the hook has neither.
2. **`extractGoalDurableSlice` is exported** and used by the validator; it exists in the
   runtime (`dist`) as well (`runtime/dist/lib/validation/spec-doc-structure.js`). Whether the
   hand-written `.ts` and the compiled `.js` are currently in step is a ring-4
   `dist-freshness` question, not settled here.
3. **`level-contract-resolver.ts:58 goalDurableBudget?: ManifestGoalBudget`** types the block
   as optional, matching the resolver's "a manifest without the block yields no budget, and the
   validator then checks nothing" tolerance. So removing the block disables the budget check
   silently rather than failing.
4. **The state-dir README** (`.opencode/skills/.state/goal/README.md`, 10,364 bytes) is a
   tracked document inside a directory whose contents are otherwise ignored
   (`.gitignore:108-109`). It is indexed by retrieval. Nothing in rings 1-3 reads it.

---

## 5. What a new reader would get wrong

- **That the 3,000/4,000 budget applies to a phase child.** Five surfaces say no, two front
  ends say yes. See R3-F1.
- **That the offer means the same thing on every workflow.** It does not, and the shared text
  is locked by a test while the behaviour is not. See R3-F2.
- **That `--runtime Pi` is a typo.** It is not, but only because normalization lowercases
  first. See R3-F3.
- **That the budget rule is a runtime rule.** It is a validator rule that the runtime
  re-implements with a wider scope. See R3-F1.
- **That `validate.sh --strict` passing means the goal engine will be happy.** It does not: a
  phase child can pass validation and still be reported as over budget on `bind`.
- **That the goal template's measure and the validator's measure could differ.** They cannot;
  the extraction is deliberately identical and the code comments say so. See §2.2.

---

## 6. Ruled out in this iteration

| Approach tried | Result |
|---|---|
| Treating the two slice extractors as an independent-implementation drift risk | Ruled out. `spec-doc-structure.ts:1029-1031` names the runtime extractor as the thing it matches, and the five parity points (CR, fence whitespace, BOM, log anchor, unclosed-fence fail-closed) all hold. The divergence is scope, not measure. |
| Reading `validation-rules.md`'s manifest key as `n` | Ruled out. My earlier search used `rg -r`, which is `--replace`; the real key is `goalDurableBudget` and it appears that way at `:698`. Re-read to confirm. |
| Concluding `--runtime Pi` is rejected by `RUNTIME_NAMESPACE_PATTERN` | Ruled out by reading `normalizeRuntimeNamespace` (`goal-core.cjs:166`): the value is lowercased before the pattern test. |
| Treating the speckit YAML as the workflow executor for goal state | Ruled out. The YAML resolves runtime and tool per runtime (`speckit-plan.yaml:162-174`) and hands off; it holds no goal state, and `resume` explicitly does not call the tool (`speckit-resume-auto.yaml:29`). |

---

## 7. Open questions handed to ring 4

1. Who owns `.opencode/hooks/README.md`'s coverage row (`:50`), and does the same table exist
   in a second place that could drift from it?
2. Is the compiled `runtime/dist/lib/validation/spec-doc-structure.js` in step with the
   hand-written `.ts` that carries the `budgetApplies` logic?
3. Root instruction files and repo rules fire on the goal posture. Do they restate the budget,
   the resend rule, or the offer, in words that could drift from ring 3's?
4. The feature catalogues and manual-testing playbooks describe the goal surfaces. Do they
   describe the *phase-child* budget correctly, and do they name the right disable flag?

Recorded `newInfoRatio`: **0.86**. Ring 3 produced one high-severity proven contradiction
(R3-F1), one workflow-semantics divergence (R3-F2), and a narrowing of R2-F8 — but four of its
seven sections are *confirmation* of ring-1 and ring-2 findings from the authoritative side
rather than new material, and §2.2 is a positive parity finding that reduces rather than adds
open questions. That is the honest baseline the next ring should beat.

---

## Evidence index

| Claim | Source |
|---|---|
| Manifest block and its `appliesTo` sentence | `spec-kit-docs.json:24-29` |
| Resolver drops everything but the two numbers | `level-contract-resolver.ts:288-299` |
| Resolver tolerates a missing block | `level-contract-resolver.ts:292-294` |
| Validator skips the budget for a phase child | `spec-doc-structure.ts:1049-1052` |
| Phase-child test is the parent's `spec.md` | `spec-doc-structure.ts:1045-1047` |
| Extractor parity is deliberate | `spec-doc-structure.ts:1029-1031` |
| Validator fails closed on an unclosed fence | `spec-doc-structure.ts:1037` |
| Hook applies the budget to every packet | `goal-slice.cjs:267-285` |
| CLI emits the over-budget warning | `bin/goal.cjs:169-171` |
| Plugin emits the same on `bind` | `opencode-goal.js:3061-3063` |
| Rule documentation, scope included | `validation-rules.md:694-696`, `:698`, `:706` |
| Playbook states children are unbounded | `goal-set-string-playbook.md:65` |
| Template banner is correctly scoped | `goal.md.tmpl` banner |
| `goal.md` is a lazy addon at every level | `spec-kit-docs.json` `levels.*.lazyAddonDocs` |
| Scaffold paths | `create.sh:153`, `:283`, `:462`, `:1809`; `goal-set-string-playbook.md:100-110` |
| Binding-row notations | `spec-doc-structure.ts:1089-1110` |
| Claude/Codex handoff mechanism | `speckit-plan.yaml:200` |
| Offer line pinned across four assets | `speckit-goal-offer-contract.test.cjs:16`, `:85-90` |
| Resume does not call the tool | `speckit-resume-auto.yaml:29`, `:33-35` |
| Resume tool list asserted | `speckit-goal-offer-contract.test.cjs:126-131` |
| Plan's set path binds | `speckit-plan.yaml:160-161`, `:162-174` |
| Capitalised `--runtime Pi` | `speckit-plan.yaml:190`; `goal-core.cjs:51`, `:166` |
| Hub names both flag names | `.opencode/hooks/README.md:50` |
| Indexed goal paths | `trigger-index.json` `paths[11]`, `[12]`, `[27]`, `[110]`, `[1696]` |
| State-dir README tracked by negation | `.gitignore:108-109`; on-disk `ls -la` |
