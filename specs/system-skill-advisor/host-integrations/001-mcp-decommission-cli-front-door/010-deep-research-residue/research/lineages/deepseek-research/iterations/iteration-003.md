# Iteration 3: Residue inventory — the classes a transport removal leaves, and the file each one lives in

## Focus

Build the residue inventory from the phases that produced it, name each class's carrier and the referent that no longer exists, and record for each class the instrument that found it. The packet is unusually forthcoming here because two of its phases kept a residue record (`007-docs-and-residue-sweep/implementation-summary.md` §Residue) and one kept a decision record for everything it deliberately left behind.

## Findings

### 1. The seven residue classes, with carrier and referent

| # | Class | Carrier in this packet | Referent that is gone | Found by |
|---|---|---|---|---|
| R1 | Config env whose holder died | The five removed MCP blocks; values re-homed to `REPO_ENV_DEFAULTS` at `.opencode/bin/system-skill-advisor-launcher.cjs:80-90` | the block that set them | reading the deletion diff |
| R2 | Tests encoding the removed contract | `runtime/tests/compat/plugin-bridge.vitest.ts` (234 lines, 9 cases), `plugin-bridge-smoke.vitest.ts` (72 lines, 1 case), `rename-invariants.vitest.ts`, `system-skill-advisor-plugin.vitest.ts`, `skill-advisor-cli-dual-client.vitest.ts`, `tests/parity/cli-vs-mcp-parity.cjs` (592 lines) | the plugin bridge, the MCP leg, the retired registration | tooling, the moment a suite sampled them |
| R3 | Names outliving referents — and names that do not | kept by decision: `feature-catalog/mcp-surface/`, `manual-testing-playbook/native-mcp-tools/`, `standalone-mcp-shape.md`, `legacy-tool-bridge.md`, `native_mcp_tools`, `MCP_SHAPE`, `mcp` trigger aliases, `MCPCallerContext`, `runtime: 'mcp'` | mixed: some have a dead referent, some have a live one | human judgement, no instrument |
| R4 | Generated artifacts | retrieval corpus (47 stale advisor paths), `leaf-manifest.json`, the committed trigger index, `.opencode/skills/.state/` (11 hits) | the sources they were generated from | tooling finds the strings; only the generator's contract explains the deferral |
| R5 | Cross-package hardcoded paths | `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19` (fixed), and 603 surviving `mcp-server/` references repo-wide | the old package directory | path-shaped grep, but only if run outside the swept tranche |
| R6 | Documentation describing a deleted harness | `AGENTS.md` MCP routing paragraph; the doctor surfaces `mcp-doctor.sh:59,269,297-303,360,399,415` and `doctor-mcp-debug.yaml:27,42,90,108-122` | the MCP transport and its registration | grep finds the strings; reading finds the tense and the consequence |
| R7 | Local machine state outside the repository | `.system-skill-advisor-launcher.json` (rewritten to a temporary DB path), the generation counter under `.opencode/skills/.state/advisor/`, a stray bench daemon | the isolated-run configuration it recorded | neither grep nor a suite; found by running a harness and inspecting its side effects |

### 2. R1: the class is not just the flag — it is the documentation that lived inside the block

The five removed blocks did not only carry settings. Each carried five or six `_NOTE_*` keys that documented live invariants to whoever read the config. `git show eb53802beb` on `opencode.json` and `.claude/mcp.json` recovers them, and three of them mattered:

- `_NOTE_DB` documented the override and named a legacy fallback spelling that both "launcher + handlers" still recognize.
- `_NOTE_TRUST_DEFAULT` documented the fail-closed rule for mutation tools: callers whose `_meta` omits transport markers default to *untrusted* unless the grant is `trusted`.
- `_NOTE_DOC_TRIGGERS` documented that the doc-frontmatter harvest is default-*off* in code and enabled by this one value "for this repo".

Two of those three statements are load-bearing for anyone touching the advisor, and they now exist only in git. That is a residue class that a residue sweep for *retired tool ids* cannot see, because the content is not stale — it is gone, and its absence produces no grep hit at all.

The concrete consequence is already observable. The `_NOTE_DB` text of the pre-decommission block named the alias chain, and the *only* surviving trace of that intent today is a self-contradictory sentence produced by an earlier rename (`_NOTE_DB`: "`SYSTEM_SKILL_ADVISOR_DB_DIR` overrides, with `SYSTEM_SKILL_ADVISOR_DB_DIR` as a legacy fallback") that was itself deleted with the block. The code's duplicated operand (iteration 1, finding 4) and the documentation's duplicated name are the same event seen twice: a mechanized rename replacing both members of an alias pair, once in code and once in prose. Deleting the block did not create the defect; it removed the last place where the intent was written down.

### 3. R2: these tests were red, not green — which is why tooling found them

This is the cleanest tooling-finds-it class in the packet, and the mechanism is worth stating exactly: a test that encodes a removed contract does not silently pass. It either fails or cannot resolve its fixture, and either way a suite that samples it reports red. The packet's record matches: 007 lists four pre-existing red tests by name and count (`rename-invariants.vitest.ts` 3 failed 1 passed; two bridge suites resolving a removed file; `system-skill-advisor-plugin.vitest.ts` failing 27 of 41, `007-docs-and-residue-sweep/implementation-summary.md` limitation 2), and the final commit `9015d00c79` retired or rewrote every one.

The failure mode is therefore not detection but *sampling*: the class is invisible only while no suite includes it. Two properties of the packet's own discipline did the detecting — a full-suite run rather than a focused one, and a rule that a defect found during a sweep is raised rather than fixed in place (007 decision table). The second matters more than it looks: had the sweep silently rewritten the red tests, the fact that four suites still encoded the old contract would never have been recorded.

### 4. R3: a name is not residue — a name with a dead referent is

The packet's retained-name decisions read as a long list of things left alone, and they are defensible in every case, but only because they separate two kinds that look identical to a grep:

- `mcpServerDir` in `.opencode/bin/skill-advisor.cjs:22` is a **lying name**: its value is now `…/system-skill-advisor/runtime`, so the identifier asserts a directory that no longer exists. 006 kept it on purpose, with the reason recorded ("Renaming the identifier would also touch two test files that inject it by name").
- The `mcp` trigger aliases are **correct names**: users type "mcp" when asking about MCP servers, and the advisor once answered those prompts. The referent is a query vocabulary, not the transport, and it is alive.

Both survive a grep for `mcp`, both appear in 007's residue tables, and they require opposite dispositions. That is the whole argument for why this class cannot be closed by tooling: **the instrument sees the token, and the disposition depends on whether a referent exists, which is a fact about the world and not about the string.**

### 5. R4: generated artifacts are stale by construction, and regenerating them is not separable

Two independent instances, and the packet recorded the reason for deferring each:

- The retrieval corpus holds 47 stale advisor doc paths. 006's decision: "Regenerating rewrote 18,966 lines unrelated to the rename and changed advisor fusion scores. The minimal path fix is not separable because one generator run must write all four files as a pair" (`006-runtime-package-rename/implementation-summary.md`, decisions).
- `leaf-manifest.json` was stale before the tranche and stayed stale because "its regeneration command fails at module load on a pre-existing `@spec-kit/shared` resolution defect" (007 limitation 5).

The generalisation is stronger than "generated files go stale". A generated artifact has three properties that together make it the most deferrable residue class: it is *derived*, so a source change makes it stale without touching it; its regeneration is *all-or-nothing*, so the fix carries unrelated churn; and its consumers may *depend on the drift*, as the retrieval corpus's fusion scores did. The third property is why this class cannot be handled by a blanket "regenerate after rename" step.

There is a converse and it caught the packet's attention: the trigger index is a generated artifact that *constrains the sweep*. 007 kept trigger phrases "because the committed trigger index lives under system-spec-kit and harvests these phrases" — so a generated artifact that consumes the documentation sets the boundary of what the documentation may be renamed to. Residue, here, is also a fence.

### 6. R5: the cross-package path is the class that survives a tidy tranche

Phase 001 named it: the registered Claude hook is a spec-kit file that hardcoded the advisor's `mcp-server/dist/...` hook path, so the rename had to carry a string living in a different package (001 finding F4). 006 fixed it and recorded the trap that made it hard: the hook runs from `dist`, so "the source edit alone had no effect" and a rebuild of the sibling package was required.

The measured remainder is the point. A recursive search for `mcp-server/` outside `node_modules`, `dist` and the advisor's own `changelog/` returns **603 references**, distributed as: sk-code 67, system-spec-kit 51, sk-doc 36, sk-design 23, system-deep-loop 19, cli-external-orchestration 12, `skills/.state` 11, sk-communication 6, mcp-code-mode 3, mcp-tooling 2, and one each in sk-prompt, sk-git, hooks and bin. The advisor skill directory itself is clean, which is exactly what the sweep's scope promised — and exactly why this class needs a different instrument: **a tranche-scoped grep returns clean while the reference still resolves at runtime from outside the tranche.**

006's own note sharpens the consequence: most of the remaining prose is "runnable examples" carrying the old path. A stale example is not a stale comment; it is an instruction that will be executed and will fail.

### 7. R6: the live diagnostic is worse than the stale prose, and it is present-tense residue

007 classified its 12 surviving `MCP server` lines and every one is history — an ADR row, an appended run record, a legacy test card. Rewriting them would falsify the record, and the classification is sound.

Outside that scope a different kind of survivor exists, and the sibling review lineage found it: `mcp-doctor.sh` still enumerates `servers=(system_skill_advisor code_mode)` and runs that check unconditionally, so every `/doctor:mcp` invocation emits a warning for the deliberately removed registration, while the same script tests the correct `runtime/node_modules` and prints the deleted `mcp-server/node_modules` at lines 300, 303 and 399 (`009-deep-review-decommission/review/lineages/deepseek-review/iterations/iteration-001.md:71,98` and the quoted command output at `:100-120`).

The class distinction is the useful part. 007's survivors describe the past and should stay. These describe the *present* and are false: they are present-tense claims about a transport that no longer exists. And one of them is worse than false, because a diagnostic that reports a removed registration as "Not wired" invites an operator to re-register the advisor — the single outcome the packet exists to prevent. A residue sweep organised by *token* puts both in the same bucket; a sweep organised by *tense and consequence* separates them, and only the second ordering finds the one that acts on the world.

### 8. R7: residue the repository does not contain

Three instances, all recorded as measured side effects rather than as stale strings:

- An isolated launch rewrote the real `.system-skill-advisor-launcher.json` so its `database` field pointed at a temporary copy, because `writeState()` uses the hard-coded directory while the lease and owner paths honour the override. Worse, "a normal call did not heal it because the CLI attached to the running daemon instead of relaunching" (003 finding F11, `003-cli-front-door-parity/goal.md:47`).
- The generation counter under `.opencode/skills/.state/advisor/` "anchors on the discovered repository root and honors neither the database nor the socket override, so a harness run moves shared state. Three runs moved it 1060 to 1078" (003 finding F10, `003-cli-front-door-parity/goal.md:46`).
- An isolated daemon outlived its socket directory after the phase 002 benchmark and had to be killed by pid (002 log, "Bench residue removed").

These are residue in the strict sense — leftovers of a migration activity — but they are not in the tree, so no grep finds them and no `git checkout` reverts them. They are discovered only by running the tooling and then looking at what it left behind, which means the check for this class is a step in the *procedure*, not a query over the *corpus*.

## Sources Consulted

- `git show eb53802beb -- opencode.json .claude/mcp.json` — the removed blocks and their five `_NOTE_*` keys
- `git show 19e1ffedaf0^:opencode.json` — the pre-rename `_NOTE_DB` text naming `MK_SKILL_ADVISOR_DB_DIR`
- `.opencode/bin/system-skill-advisor-launcher.cjs:76-90,124-150` — `REPO_ENV_DEFAULTS` and the child-env allowlist (with its own duplicated `SYSTEM_SKILL_ADVISOR_DB_DIR` entry at `:131,133`)
- `.opencode/bin/skill-advisor.cjs:22-23` — the retained `mcpServerDir` identifier
- `../../../../006-runtime-package-rename/implementation-summary.md` — 407 renames, reference classes, the four defects fixed on the way, limitations 4-5
- `../../../../007-docs-and-residue-sweep/implementation-summary.md` — residue record (12 classified survivors), decisions, validation counts, limitations 1-6
- `../../../../007-docs-and-residue-sweep/goal.md:14-25` — the AGENTS.md touchpoints, the no-new-repo-rule decision, the raised code defects
- `../../../../003-cli-front-door-parity/goal.md:46-47` — findings F10 and F11
- `../../../../002-daemon-transport-decision/goal.md` — "Bench residue removed"
- `../../../../001-transport-and-consumer-inventory/goal.md` — findings F3 and F4
- `../../../009-deep-review-decommission/review/lineages/deepseek-review/iterations/iteration-001.md:71,98,100-120` — the live doctor residue
- Measured: 603 `mcp-server/` references outside `node_modules`/`dist`/advisor `changelog`, broken down by top-level area
- `git log --diff-filter=D`/`--numstat` over the packet range: `9015d00c79`, `afd10f291f`, `eb53802beb`, `077dbf804d`

## Assessment

- **newInfoRatio: 0.85**
- **Novelty justification:** The individual findings are the packet's, but the seven-class structure, the R1 sub-class of documentation that died inside the deleted block, the measured 603-reference remainder with its distribution, the R3 lying-name versus live-vocabulary distinction, the R6 present-tense-diagnostic distinction, and R7 as a class outside the corpus are all new to this packet's record.
- **Confidence:** High for R1, R2, R4, R5, R6 (each has a diff, a commit, a count, or a quoted file). Medium for R3's categorisation of individual names — the dead-versus-live referent call is mine, not the packet's. High for R7's three instances (each is a recorded measurement) but the class is surely incomplete, since it is discovered by accident.
- **Evidence gap:** I did not run a full-suite test pass, so R2's "tooling found them" rests on 007's counts and the commit's diffstat rather than on my own red run. The 603 count is a `grep -rn` over `.md` files only; a code-wide count would be larger and I did not measure it.

## Reflection

- **Worked:** Reading the *deletion diff* rather than the post-deletion state. The values and the `_NOTE_*` documentation keys exist nowhere in the tree and are recoverable only from `git show`, which is also the only way to see what the deletion took with it.
- **Worked:** Counting the remainder instead of trusting a scope statement. "Repo-wide references are checked and reported, not rewritten" (`007/goal.md:20`) reads like completeness; 603 is what it means in practice, and the distribution shows the class is entirely outside the tranche.
- **Failed / ruled out:** Treating R3 as one class. Ruled out by the `mcpServerDir` versus `mcp`-alias pair: identical tokens, opposite correctness, opposite disposition. Any tooling that tried to close this class would have renamed the aliases and broken search.
- **Failed / ruled out:** Treating R4 as "regenerate after rename". Ruled out by 006's measurement — one generator run rewrote 18,966 unrelated lines and shifted advisor fusion scores — and by 007's finding that the manifest generator fails on an unrelated resolution defect. The deferral was correct in both cases; the class needs a *scheduling* answer, not a cleanup command.
- **Method note:** The sibling review lineage at `009-.../review/lineages/deepseek-review/iteration-001.md` independently found R6 items the packet's sweep missed. Cross-lineage overlap is evidence about scope, not a duplicate finding: it shows what a differently-scoped loop sees.

## Recommended Next Focus

Iteration 4: finish the tooling-versus-reading split for the seven classes and derive the ordering rule. For each class, state the check that finds it, the check's blind spot, and whether the class is discoverable *before* the removal or only after. Then test the split against the two classes where a single instrument was demonstrably insufficient — R3 (token visible, referent not) and R7 (outside the corpus) — and against R2, where tooling worked but only because a full suite ran. Deliverable: a two-column table (found by tooling / found only by reading) with the reason each class falls where it does, plus the pre-removal-versus-post-removal timing for each.
