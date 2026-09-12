---
title: "Research: the goal items left open"
description: "Five rings over the items remediation left open: line width, unowned surfaces, the untested README section, the naming collision, and which facts earn a machine check."
trigger_phrases:
  - "goal open items research"
  - "goal line length standard"
  - "goal unowned surfaces"
  - "goal machine checks"
importance_tier: important
contextType: research
---

---
title: "Research: the goal items left open"
description: "Five rings over what the repo-wide goal research and its remediation left behind: line length measured repo-wide, the unowned surfaces, the root README goal section, the word goal naming four things, and which facts earn a machine check. One recommendation per ring, each with its cost and blast radius."
trigger_phrases:
  - "open goal items research"
  - "goal line length distribution"
  - "goal unowned surfaces"
  - "root README goal section"
  - "goal naming collision"
  - "goal machine checks"
importance_tier: important
contextType: research
---

# Research: the goal items left open

Session `fanout-deepseek-1789201017494-mped3v` · executor `cli-pi model=deepseek-v4.1-flash` ·
five rings, stop policy `max-iterations`, five iterations, no early convergence.

**Question.** The repo-wide goal research closed fourteen of fifteen contradictions and the
remediation built them. What did it leave behind, and what should happen to each item: line length,
unowned surfaces, the untested root README goal section, the word "goal" naming four unrelated
things, and the question of which facts earn a machine check.

**Answer in one paragraph.** Four of the five items are smaller than their descriptions. The
100-character limit is not a prose standard at all — it is a code-style maximum borrowed for an
artifact class it does not govern, and the corpus behaves as if it does not exist; the fix is to
retire it, which costs nothing. Most of the unowned surfaces were re-checked against today's tree
and are now consistent restatements with identifiable owners; the two that still carry live drift
are one undocumented environment variable and a live spec-kit test that depends on a script living
inside a spec packet. The root README goal section should be covered by the goal-document contract
test, not dragged into retrieval: its exclusion from both retrieval lanes is a documented decision
with a structural reason, and the section's checkable facts pass the test's scan today. The word
"goal" collides with live machinery exactly once — the deep-review scope manifest — and that
rename costs thirteen live files. The machine-check question resolves to a package of three cheap
checks that all pass today (env-var documentation, roster names, the README section), one
agreement assertion for the rename, and an explicit refusal to check line width or prose copies.

---

## 1. Scope and method

- **Rings, one per iteration.** 1 line length, 2 unowned surfaces, 3 the root README goal section,
  4 the naming collision, 5 machine checks. The ring plan is the packet strategy
  (`research/deep-research-strategy.md`); this lineage executed it.
- **Evidence rule.** Every claim about current behaviour carries a `file:line` that was opened in
  this session, or the measured command that produced it. Design conclusions are marked CLAIM;
  anything unconfirmed is INFERRED or UNKNOWN with its settling action named. Each ring ends with
  one recommendation, its cost and its blast radius — not a survey.
- **Deviation.** The deep-research append gateway writes outside this lineage's bound write
  surface, so state records were written in-lineage in the gateway's record shape. Recorded in
  `deep-research-config.json` and `deep-research-state.jsonl`.
- **Excluded surfaces.** `specs/**/research/lineages/**`, `**/containment/**`, `.worktrees/**`
  (machine-generated or another checkout), retrieval fixtures, generated changelogs. Historical
  records inside `specs/**` were read as evidence but never treated as live assertions.

---

## 2. Ring 1 — Line length

**Finding.** No prose line-length rule exists anywhere in the repository. There is no markdownlint
configuration, no MD013, no width rule in sk-doc or repo-rules; the only declared 100-character
maxima are code style guides for TypeScript, JavaScript and Python
(`typescript/style-guide/formatting-imports-and-coexistence.md:77`,
`javascript/style-guide.md:278`, `python/style-guide.md:447`). CLAIM: the limit the packet strategy
cites for four markdown goal files was borrowed from a code standard.

Measured repo-wide, the corpus wraps near 100 and exceeds it everywhere: root docs 27.0% of lines
(749/2,778), repo-rules 3.8% (72/1,884), hook docs 29.7% (299/1,006), plugin docs 22.6% (87/385),
spec-kit references 9.7% (1,264/13,009), all skills 14.3% (74,051/518,400), specs 23.3%
(141,744/609,634). The goal documents sit at or above the corpus rate (engine plugin doc 40.7%,
engine README 26.5%, parent `goal.md` 25.4%) — long-lined, but not outliers. Code long lines are
consistent across shipped plugins (3.3-6.2%), which tests and confirms the "every plugin breaks it
at a similar rate" observation.

The strategy's "365 lines across the four goal files" does not reproduce on any natural four-file
set (172 / 202 / 118 / 225 for four candidate groupings). **UNKNOWN** which four files were
measured; settling action: ask the author or recover that session's measurement. The unreproducible
number is itself evidence: a prose budget nobody can re-measure is not a standard.

**Recommendation: retire the 100-character limit as a prose standard.** Keep the code-style maxima
as declared guidance; add no markdown lint, no goal-document budget, no exemption clause.
**Cost:** zero file changes. **Blast radius:** none today — nothing enforces or cites a prose width
rule, so retiring it changes no behaviour and no test; enforcing it would have been a ~216,500-line
rewrite across tables and link lines.

---

## 3. Ring 2 — The unowned surfaces

**Finding.** Each item from the prior synthesis §4 was re-verified against the current tree.

| Surface | State today | Owner / action |
|---|---|---|
| Five-plus flag rosters | Consistent: eight documents restate the goal kill-switch, all canonical, none carries the dead `SYSTEM_GOAL_DISABLED` | Keep; owner is the shared resolver (`.opencode/hooks/shared/hook-flags.cjs:51-52`) plus its suite. No generator |
| Six support-story copies | Agree claim by claim (Cursor injection + packet read, Devin injection only, Pi `/goal-pi`) | Keep; the hub matrix (`.opencode/hooks/README.md:224,234`) is the declared coverage authority |
| State-directory README | Accurate against both engines' key schemes (`.opencode/skills/.state/goal/README.md:33-34,71` vs `opencode-goal.js:36-37`, `goal-core.cjs:39,43,171-177`), tracked while its siblings are ignored, owned by nobody | Keep; assign the owner to the engine README |
| Speckit offer contract test in the plugin test tree | Documented in `plugins/tests/README.md:40`, discovered by the node-test runner (`run-node-tests.mjs:20-23`) | Keep where it is; no goal document needs to list it |
| `OPENCODE_GOAL_STATE_DIR` | Fixed: honoured by both engines, documented in three places | Done |
| `OPENCODE_GOAL_RUNTIME_LABEL` | Read at `bin/goal.cjs:391`, used by a published recipe, described only at `.env.example:306` | One documentation line owed |
| `goal-file-manifest.txt` parsers | Two contracts: full validation in `deep-review-auto.yaml:373-375`; trackedness only in `check-goal-file-manifest.sh:19-40` | Drifted; the divergence is the finding |
| Manifest checker's home | A spec-kit vitest spawns a script inside a spec packet through a `.opencode/specs` symlink constant (`recursive-child-manifest.vitest.ts:14-17,70-87`) | Drifted; needs a live home or a declared dependency |
| Benchmark records citing moved paths | Two citations no longer exist in the Cursor goal-hook report | Keep as historical evidence; exempt from path checks |

The cheap-versus-drifted split is the ring's contribution: the flag rosters and the support story
are cheap consistent duplication (no generator worth its build step), while the live drift is
concentrated in the manifest machinery and one undocumented variable.

**Recommendation: keep both duplications as derived restatements under named owners; repair the two
drifted surfaces in one small change** — add `OPENCODE_GOAL_RUNTIME_LABEL` to the env table that now
documents `STATE_DIR`, and move the manifest checker out of the spec packet to a live home (folding
in ring 4's rename). **Cost:** two doc lines, one file relocation plus its test-path update, one
cross-reference. **Blast radius:** documentation and one test path; no runtime code, no behaviour
change, reversible.

---

## 4. Ring 3 — The root README goal section

**Finding.** The goal-document contract test pins seven documents
(`goal-doc-contract.test.cjs:20-28`) and `README.md` is not among them. Both retrieval lanes
exclude it deliberately, with a written reason — "public-facing project marketing content with no
`trigger_phrases` convention" (`retrieval-conventions.md:282`) — and structurally: the file has no
frontmatter (`README.md:1-2`), so the trigger index cannot admit it without adding frontmatter to
an 87,256-byte marketing document. A different workflow already checks its links
(`markdown-link-integrity.yml:17,26-27`), which is a weaker property than its claims.

The section's claims were checked one by one: `/goal-opencode` resolves to
`.opencode/commands/goal-opencode.md:7`; `/goal-pi` to `pi.registerCommand` at
`pi/goal-context.ts:181`; Cursor's cadence to `sessionStart` only in `.cursor/hooks.json`; Devin's
to `SessionStart` + `UserPromptSubmit` in `.devin/hooks.v1.json:2,39`. The native-host sentence for
Claude Code and Codex is not checkable from the repository. Replaying the contract test's own
citation regex over `README.md` finds five cited paths, all of which exist.

**Recommendation: cover the section with the contract test; keep it out of both retrieval lanes.**
Add `README.md` to the test's `DOCS` array (it passes today), then pin the command registrations
and the two host cadences, leaving the native-host sentence explicitly out of scope.
**Cost:** one array entry and three small assertions in one existing test file.
**Blast radius:** one test file; from then on a command rename or a cadence change fails a check
that already runs. Joining a retrieval lane was rejected because it requires frontmatter on the
README and reverses a documented exclusion; leaving it outside both was rejected because the
section is the first goal document a new operator reads and the least pinned of the six copies of
the support story.

---

## 5. Ring 4 — The word "goal" naming four unrelated things

**Finding.** The four referents carry very different machinery. (1) The packet `goal.md` directive:
194 files, template, validator, binding contract. (2) The session goal: `.opencode/hooks/goal/`
(14 files) plus `opencode-goal.js` (3,385 lines) — the runtime projection of the same directive, so
the shared word there is vocabulary, not collision. (3) The deep-review scope manifest
`goal-file-manifest.txt`: six files, two parsers, a gate script, a live test — **the only real
collision**. (4) ClickUp's goals card: self-declared UNSUPPORTED
(`mcp-click-up/.../manage-goals.md:19`), namespaced inside an MCP skill. The engine README already
pays for the collision with a disambiguation note (`.opencode/hooks/goal/README.md:19-22`) placed
in the document whose readers need it least.

The rename touches **thirteen live files**: the six manifests; `deep-review-auto.yaml:373-374`; the
checker script (name, line 5 default, line 21 temp prefix); the vitest path constant; the engine
README note; and three packet documents in `005-blocker-closeout/001-completion-evidence-reconcile`
(`spec.md`, `plan.md`, `tasks.md`). Roughly sixty other citations are historical review records,
prompts and deltas and must not be rewritten.

**Recommendation: rename to `review-scope-manifest.txt` and its checker to
`check-review-scope-manifest.sh`, in the same change that relocates the checker.** **Cost:**
thirteen live files, mostly mechanical. **Blast radius:** no behaviour change — the format, parsers
and gate logic are untouched; only the filename changes. Out-of-repo consumers are INFERRED absent
(settling action: operator check of downstream automation); the two stale copies under
`.worktrees/` keep the old name, correctly.

---

## 6. Ring 5 — Which facts earn a machine check

**Finding.** Prototyping each candidate check against the tree produced a new defect and a clean
no-list.

**The defect.** `OPENCODE_GOAL_VERIFIER_TIMEOUT_MS`, `OPENCODE_GOAL_CONTINUATION_TIMEOUT_MS` and
`OPENCODE_GOAL_JSONL_MAX_BYTES` are read by the plugin through name constants
(`opencode-goal.js:78-80,245-247`, defaults at `49-51`) and appear in neither `.env.example` (17
other goal names) nor the plugin's env table (18 names). An operator can set them but cannot
discover them.

**Checks that earn a test, with shape:**

| # | Fact | Test shape | Fails today? |
|---|---|---|---|
| 1 | Every `OPENCODE_GOAL_*` name read in engine/plugin non-test source is documented | collect string literals matching `OPENCODE_GOAL_[A-Z_]+`, assert each appears in `.env.example` | **Yes — three names** (fix the docs, land green) |
| 2 | Every goal kill-switch name taught in a roster document disables something | scan the eight rosters for `*GOAL*DISABLED`, assert membership in `CONCERN_CANONICAL.goal` or `LEGACY_ALIASES.goal` read from the resolver | No; fails on a dead name returning |
| 3 | The README goal section's commands and cadences are real | add `README.md` to `DOCS`; assert `/goal-opencode` ↔ command file, `goal-pi` ↔ `registerCommand`, Cursor sessionStart-only, Devin SessionStart + UserPromptSubmit | No; fails on a rename |
| 4 | The manifest name in the workflow matches the checker's default basename | compare the two strings | No; guards ring 4's rename |

**Facts that do not earn a test:** prose line width (nothing breaks; ~216,500 lines would flag);
per-copy scans of support-story prose (rephrasing becomes a false failure; the rename failure is
already pinned by #3); the state-directory README's claims (a check fails only when the README is
edited); historical citations in benchmark and review records (evidence of past runs).

**Recommendation: add checks 1-4 as one new vitest file in the spec-kit CLI test project — the lane
CI blocks on — and add no line-length or prose-copy checks.** **Cost:** one test file of roughly
60-80 lines, three documentation lines so check 1 lands green. **Blast radius:** one test file and
three doc lines; from then on an undocumented knob, a resurrected dead flag name, a renamed
command, or a renamed manifest fails a blocking check instead of waiting for the next research
pass. The advisory node-test lane was rejected as the home: it runs `continue-on-error`, so a
failure there is a report rather than a gate.

---

## 7. Confidence, residual unknowns, and how to settle them

- **Confirmed by reading or measuring:** all findings in §2-§6 except the marked items. The
  measurements are counts and greps whose commands are recorded in the iteration files.
- **CLAIM (design conclusions):** retiring the prose limit; the keep/repair split in ring 2; the
  README test placement; the rename's worth at thirteen files; the blocking-lane choice. Each is
  argued from the measured evidence in its ring, and each is reversible.
- **UNKNOWN:** which four files the packet strategy measured for "365 lines"; settling action: ask
  the author or recover the measurement from that session.
- **INFERRED:** no out-of-repo consumer reads `goal-file-manifest.txt`; settling action: operator
  check of downstream automation. No evidence of one exists.
- **Runtime-observed gap:** no test in this lineage was executed; every check in ring 5 was
  prototyped as a scan, not as a committed suite. A follow-up implementation pass should land the
  checks and watch them pass.

---

## 8. References

- Packet strategy: `../deep-research-strategy.md`
- Prior synthesis: `../../../010-repo-wide-goal-research/research/research.md` (§4 is the ring-2 inventory)
- Per-ring evidence: `iterations/iteration-001..005.md`
- Structured deltas: `deltas/iter-001..005.jsonl`
- State and provenance: `deep-research-state.jsonl`, `deep-research-config.json`, `convergence-report.md`
- Cited in this report: `goal-doc-contract.test.cjs`, `hook-flags.cjs:51-52`, `.env.example:305-306`,
  `opencode-goal.js:36-37,49-51,78-80,245-247`, `goal-core.cjs:39,43,171-177`,
  `.opencode/skills/.state/goal/README.md`, `.opencode/hooks/README.md:224,234`,
  `.opencode/hooks/goal/README.md:19-22,78-84`, `.opencode/commands/deep/assets/deep-review-auto.yaml:373-375`,
  `check-goal-file-manifest.sh:5,19-40`, `recursive-child-manifest.vitest.ts:14-17`,
  `retrieval-conventions.md:282`, `corpus.mjs:24-30`, `README.md:859-866`, `markdown-link-integrity.yml`,
  `goal-opencode.md:7`, `pi/goal-context.ts:181`, `.cursor/hooks.json`, `.devin/hooks.v1.json:2,39`,
  `mcp-click-up/.../manage-goals.md:19`
