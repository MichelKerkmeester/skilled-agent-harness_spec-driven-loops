# Iteration 2: The unowned surfaces

## Focus

Ring 2 of the packet strategy: take the eight-item unowned-surface inventory from the prior
synthesis (§4 of `../../../010-repo-wide-goal-research/research/research.md`) and verify each item
against the current tree, naming for each an owner, a deletion, or a generator — and separating
duplication that is cheap and consistent from duplication that has already drifted.

## Findings

**F1. The flag-roster duplication is real, wide, and currently consistent.** The canonical name
`OPENCODE_GOAL_DISABLED` and its alias `OPENCODE_GOAL_PLUGIN_DISABLED` are restated across at
least seven documents plus the live example file: `.env.example:291-292`, `.opencode/hooks/hook-flags.env.example`,
`.opencode/hooks/README.md`, `.opencode/hooks/shared/README.md:88,95`,
`.opencode/hooks/goal/README.md`, `.opencode/hooks/goal/goal-plugin.md:62-63`,
`.opencode/plugins/README.md:97-98`, and `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`.
Every one of them now names the canonical switch first; the dead `SYSTEM_GOAL_DISABLED` name the
remediation fixed appears in none of them. The resolver remains the single authority
(`.opencode/hooks/shared/hook-flags.cjs`, `CONCERN_CANONICAL`) and the hook-flags suite pins it
(`.opencode/hooks/shared/hook-flags.test.cjs`, `concernFlag("goal") === "OPENCODE_GOAL_DISABLED"`).
**Verdict: cheap consistent duplication — keep, no generator.** Generating seven documents from
one roster would add a build step and a failure mode to prevent a drift that the resolver plus one
test already catches. [SOURCE: `rg` over the named files, 2026-09-12]

**F2. The runtime support story has six restatements and they agree.** `.opencode/hooks/README.md:234`
carries the runtime matrix row and its preamble declares that matrix "the coverage authority";
`.opencode/hooks/coverage-rationale.md:82` gives the same mapping in prose; `.opencode/hooks/goal/README.md:78-84`
gives it per runtime; `.opencode/hooks/goal/goal-plugin.md:144` names Cursor/Pi/Devin;
`README.md:861-866` restates it for operators; `.opencode/hooks/injection-contract.md` carries the
cadence half (`OpenCode, Pi and Devin per turn, Cursor at session start`). Cross-checked claim by
claim: Cursor is "injection + packet read" in the matrix and "sessionStart hook plus a session-free
packet read" in the rationale; Devin is "injection only" and "no management surface"; Pi's matrix
mark is ✓ covered and the engine README names `/goal-pi` as its management command. No
contradiction was found. **Verdict: cheap consistent duplication with a declared owner (the hub
matrix) — keep.** [SOURCE: the six documents listed, read 2026-09-12]

**F3. The state-directory README is an accurate, tracked document about two engines, owned by
nobody.** `.opencode/skills/.state/goal/README.md` is the only tracked file in its directory (both
`git ls-files` and `git check-ignore` confirm it) and describes two record schemes in one folder:
the plugin's `<session-id-hex>.json` (line 33) and the runtime-neutral core's
`<sha256-of-workspace-runtime-session>.json` (line 34), with line 71 explaining that both key
schemes are deliberately preserved. Read against the code, its claims hold: the plugin's state
directory is `process.env.OPENCODE_GOAL_STATE_DIR || ../skills/.state/goal/`
(`.opencode/plugins/opencode-goal.js:36-37`) and the core's is the same subdirectory behind the
same override (`.opencode/hooks/goal/lib/goal-core.cjs:39,43,171-177`). No document names it as an
owner, and no test touches it. **Verdict: keep; assign the owner to the goal engine (the two code
paths it documents) — the file is not wrong, it is unowned.** [SOURCE: the README, the plugin and
the core, read 2026-09-12]

**F4. The spec-kit offer contract test is placed in the plugin test tree and is documented there,
not in a goal document.** `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` pins the
offer line across four presentation assets and five workflow YAMLs; the folder's own README lists
it with a rationale (`.opencode/plugins/tests/README.md:40`). It is discovered and run by
`.opencode/scripts/run-node-tests.mjs` (its `ROOTS` include `.opencode/plugins`, line 23). So the
"listed in no goal document" half of the inventory is true, and the "unowned" half is not: the
test README owns it, and the runner reaches it. **Verdict: keep, no move.** Moving it under
spec-kit would change the test runner lane it lands in and buy nothing: the file tests command
wiring, and the plugin test tree is where command-wiring tests already live.
[SOURCE: the test file head, `plugins/tests/README.md:40`, `run-node-tests.mjs:23`, 2026-09-12]

**F5. One of the two "only in `.env.example`" variables is fixed and one is not.**
`OPENCODE_GOAL_STATE_DIR` is now documented in `.env.example:305`, `.opencode/hooks/goal/README.md`
and `.opencode/hooks/goal/goal-plugin.md`, and honoured by both engines (see F3) — the C8
remediation held. `OPENCODE_GOAL_RUNTIME_LABEL` is read on the CLI path
(`.opencode/hooks/goal/bin/goal.cjs:391`) and used by a published re-run recipe
(`.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/README.md:51`), but its only
description is the comment line `.env.example:306`; neither engine README mentions it.
**Verdict: drifted documentation — one line owed, not a generator.** [SOURCE: `rg -ln
OPENCODE_GOAL_RUNTIME_LABEL`, the three files read, 2026-09-12]

**F6. The `goal-file-manifest.txt` format has two parsers with two different contracts.** The
deep-review workflow instructs a full validation — one repo-relative path per line, rejecting
absolute paths, traversal, duplicates, missing paths and non-files
(`.opencode/commands/deep/assets/deep-review-auto.yaml:373-375`). The checker that actually runs
validates one thing only — that every entry is in `git ls-files`
(`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh:19-40`).
A manifest that is tracked but has a wrong duplicate, or a path that exists but is untracked, can
pass one and fail the other. [SOURCE: both files, read 2026-09-12]

**F7. The manifest checker is a live dependency living inside a spec packet.** Six packets carry
`goal-file-manifest.txt` in the main tree, and the only automated consumer of the format is a
packet-resident script — referenced by a spec-kit test through a `.opencode/specs` symlink path
constant (`.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:14-17`).
If that packet is archived or renamed, a spec-kit suite breaks, and nothing in the packet's own
docs promises to keep the path stable. The manifests themselves also record hand-reconciled drift:
the 003 packet's manifest header records 10 entries that had MOVED and 16 that were deleted
outright and pruned. **Verdict: drifted — the checker needs a live home or a declared dependency
contract; deleting the manifests would destroy evidence and is not recommended.**
[SOURCE: `find`, the vitest constant, the manifest header, 2026-09-12]

**F8. The benchmark records cite paths that have moved, and that is the right shape for them.**
The Cursor goal-hook benchmark report cites `.opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md`
and `build-report.cjs`, neither of which exists in the tree today. As immutable evidence of a run
that happened, it should keep citing what it saw; the fix for citations that rot in live documents
is not the fix for historical records. **Verdict: keep as historical evidence; owner = the
benchmark corpus; explicitly exempt from any path-existence check.** [SOURCE: citation extraction
and `test -e` over the report, 2026-09-12]

## Sources Consulted

- `.opencode/hooks/shared/hook-flags.cjs`, `.opencode/hooks/shared/hook-flags.test.cjs`, `.opencode/hooks/shared/README.md:88,95`, `.opencode/hooks/hook-flags.env.example`, `.opencode/hooks/README.md`, `.env.example:224,291-292,305-306`
- `.opencode/hooks/goal/README.md`, `.opencode/hooks/goal/goal-plugin.md:62-63,144`, `.opencode/plugins/README.md:97-98`
- `.opencode/hooks/coverage-rationale.md:82`, `.opencode/hooks/injection-contract.md`, `README.md:861-866`
- `.opencode/skills/.state/goal/README.md`, `.opencode/plugins/opencode-goal.js:36-37`, `.opencode/hooks/goal/lib/goal-core.cjs:39,43,171-177,1594`
- `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`, `.opencode/plugins/tests/README.md:40`, `.opencode/scripts/run-node-tests.mjs:20-23`
- `.opencode/commands/deep/assets/deep-review-auto.yaml:373-375`, `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh:5,19-40`, `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:14-17`
- Six `goal-file-manifest.txt` files, the 003 packet manifest header, the Cursor benchmark report and README

## Assessment

**newInfoRatio: 0.85.** Eight findings against the prior register's inventory. Five confirm or
narrow known items with current evidence (F1, F2, F4, F5, F8); three are new: the two-parser
contract divergence (F6), the live test pinned to a packet-resident script (F7), and the
state-directory README read against both engines' code (F3). The remaining novelty is the
cheap-versus-drifted split itself, which the prior synthesis asserted but did not separate file by
file.

**Novelty justification:** the register named the surfaces; this iteration reproduced each one
against today's tree and found that most are now consistent copies while three carry live drift.

**Confidence:** F1-F7 observed by reading the named files and running the named searches. The claim
that generating the rosters would not pay is a CLAIM built on F1 and the resolver being the single
authority. The judgement that the manifests should not be deleted is a CLAIM: they are the only
record of what those goals touched.

## Reflection

**What worked.** Verifying each inventory item against today's tree instead of trusting the
register separated the items the remediation already fixed from the ones it did not. The
flag-roster item, which read like a defect in the register, is today a consistent restatement; the
RUNTIME_LABEL item, which read like one line of the same item, is the actual drift.

**What failed.** The first support-story grep matched every file mentioning both "Cursor" and
"Devin" and returned twenty unrelated documents. Narrowing to the six documents that state the
goal coverage mapping was the only way to make the consistency claim checkable. Duplication counts
without a file list are not verifiable; both counts in this ring are now lists.

**Ruled out.** (a) Generating the flag rosters or the support story from one source: a generator
would rewrite seven documents on every roster change and needs its own drift test anyway, which is
the test that already exists. (b) Deleting the state-directory README: it is the only tracked
description of a two-scheme store that operators will otherwise misread. (c) Deleting the
historical benchmark records or the manifest files: both are evidence, and neither breaks anything
by staying.

## Recommended Next Focus

Ring 3 — the root README goal section: whether it should be covered by the contract test, joined
to a retrieval lane, or deliberately outside both. The corpus walker's own comment already claims
the exclusion is deliberate, so the iteration has to test that claim rather than assume it.

---

## Recommendation (ring 2)

**Keep both duplications as derived restatements under named owners; repair the two drifted
surfaces with one small change.**

- **The change.** (1) Add `OPENCODE_GOAL_RUNTIME_LABEL` to the same env table that now documents
  `OPENCODE_GOAL_STATE_DIR` in `.opencode/hooks/goal/README.md` and `goal-plugin.md` — one line
  each, naming `bin/goal.cjs` as the reader. (2) Give the `goal-file-manifest.txt` checker a live
  home outside the spec packet (spec-kit's validation tree is the natural owner) and update the
  vitest's path constant, or, if it stays, record the packet path as a declared, pinned dependency
  in the test itself. Nothing else moves: the rosters stay hand-written, the support story stays
  restated under the hub matrix's declared authority, the state-directory README stays and gains
  its owner in the engine README's cross-reference, and the benchmark records stay historical.
- **Cost.** Two documentation lines, one file relocation with its test-path update, and one
  cross-reference. No runtime code, no behaviour change, no generator.
- **Blast radius.** Documentation and one test path. The relocation touches the vitest that
  currently reaches through `.opencode/specs` and any packet doc that cites the checker's old
  location; the two doc lines touch no code. Low blast, reversible.
