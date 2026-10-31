---
title: "Deep Research: MCP-to-CLI transport decommission — latent failures, residue classes, and the next-migration checklist"
description: "What the completed eight-phase MCP-to-CLI decommission teaches: the fallback-only failure class and how to detect it before promotion, the eight residue classes a transport removal leaves and which instrument finds each, the packet record's own defects, and a twenty-two-step checklist ordered so each step fails cheaply."
importance_tier: important
contextType: research
status: complete
---

# Deep Research: MCP-to-CLI transport decommission

**Lineage:** `deepseek-research` · **Session:** `fanout-deepseek-research-1789148376236-1mi32g` · **Executor:** cli-pi / deepseek-v4.1-flash
**Case study:** `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` (phases 001-008, commits `1d900a17bf` … `afd10f291f`)
**Iterations:** 5 of 5 · **Stop:** `maxIterationsReached` · **Convergence mode:** `off` (audit run, per the parent directive's five-iteration audit rule)

---

## 1. EXECUTIVE SUMMARY

The decommission succeeded, and its record is unusually good — but not for the reason a reader would expect. The defects that mattered were not introduced by the migration. They were **activated** by it.

A code path whose only trigger is another path's failure can sit in a repository for months having never once succeeded, because nothing about it *fails* in a way that invites investigation: when it breaks, the operation has already degraded, and the degradation is correctly explained by the primary's failure. This packet promoted such a path to primary in phase 4 and thereby converted a defect of exposure zero into a defect of exposure one — which is exactly what made it findable. That conversion, not the removal itself, is what the packet actually teaches.

Three claims carry the study:

1. **The latent-failure class has three properties, and the third is what hides it.** Order-gated execution, unverified preconditions, and *masked failure* — the fallback's own defect is attributed to the failure it was answering. Six concrete members are documented in this packet, each with a distinct mechanism. Five of them were found only because the promotion forced a comparison against the primary.
2. **Residue after a transport removal falls into eight classes, and the split between tooling-found and reading-found is a property of the search key, not of the class.** A token-keyed sweep is complete for residue that carries the removed token — and structurally blind to residue whose carrier does not name the removed thing, even when that residue sits inside the swept directory. This packet demonstrates both: zero retired tool ids survive in scope, while two live documents inside the same directory still assert an env alias that no code honors.
3. **The checklist's order should follow availability before cost.** Checks that can only run while the old and new paths coexist are *gates* on the removal; checks that can only run afterwards are a *battery*. Cost orders within each set. The packet's phase order is right for the work; it is not the same as the order of the checks.

Where the packet's record is wrong, it is stale rather than inflated: five of eight phases read `Pending` in the parent's progress table while their commits and artifacts exist. Section 7 enumerates the eight defects by kind.

---

## 2. SCOPE, METHOD, AND EVIDENCE BASE

**In scope:** the mechanism of the latent-failure class; the residue taxonomy and its instruments; a repeatable checklist. **Out of scope:** whether the decommission should have happened (a frozen parent decision), advisor scoring quality (D7 places it out of scope), and MCP-versus-CLI trade-offs in general.

**Method.** Every claim was re-verified against the tree at HEAD, the commit history, or the live filesystem — not against a phase log's narrative. The packet's goal logs are written in the present tense about defects that are fixed, so they were used as leads and never as evidence of current state. Two claims were verified independently of the packet entirely:

- The socket-scoping predicate (`.opencode/bin/lib/launcher-ipc-bridge.cjs:103-109,151-153`) was checked against the live `/tmp/system-skill-advisor/` layout, which shows scope directories `12c06db97a8e`, `697296aed00e`, `f5986893208c` with real sockets one level deeper and no flat socket at all.
- The alias collapse was checked against two live documents inside the swept directory and against the surviving `MK_SKILL_ADVISOR_DB_DIR` references that prove the intent.

**Evidence classes used:** commit diffs (`git show`, `git log -S`, `--diff-filter`, `--numstat`), pre-fix source read from git (`<commit>^:<path>`), current source at HEAD, phase artifacts, measured counts, and the live filesystem.

**Deliberate non-goals:** no writes outside this lineage directory; no `validate.sh`, no `generate-context.js`, no git write. Consequently the append-mode-event gateway was not invoked — its `--run-directory` binds a ledger root and the containment rule forbids writing outside this directory. The state log here is a direct projection written by the executor; the deviation is recorded so it is not mistaken for gateway output.

---

## 3. FINDING 1 — THE LATENT-FAILURE CLASS

### 3.1 Definition

A **fallback-only path** fails latently when three properties hold together:

| Property | Statement |
|---|---|
| **Order-gated execution** | The path's only trigger is a prior failure, so its normal-case execution count is zero and remains zero until something else breaks. |
| **Unverified preconditions** | Because it seldom or never runs, its own assumptions — a path shape, an env var, a timeout budget, a flag's meaning — are never validated against the module that owns each value. |
| **Masked failure** | When it does fail, the enclosing operation has already degraded, so the degradation is attributed to the primary's failure. The correct explanation is already available and it is not the fallback's. |

The first two are preconditions; **the third is the operative one**, and it is a property of the observer, not of the code. In this packet the helper emitted a distinguishable reason code (`socket_absent`) and it still bought nothing, because that code is a member of the retryable set (`hooks/lib/skill-advisor-cli-fallback.ts:86-91`) — the caller already expected it. **A fallback needs a signal that contradicts an assertion, not merely a better label.**

### 3.2 Membership, each with its mechanism

| # | Member | Mechanism | Evidence |
|---|---|---|---|
| M1 | The flat socket path | The helper derived the socket path itself, using the *unscoped* form of the default socket directory — and the default directory is precisely the one the owner always scopes by `sha256(database dir)[:12]`. Not a typo: **two owners computing one derived path.** | pre-fix `e8d564ca98^:hooks/lib/skill-advisor-cli-fallback.ts:210-216`; owner rule `bin/lib/launcher-ipc-bridge.cjs:103-109,151-153`; live `/tmp/system-skill-advisor/*/daemon-ipc.sock` |
| M1b | The pre-flight probe | `probeWarmDaemon` checked `existsSync` on the locally derived path, so the wrong premise became a **guaranteed short-circuit**: the CLI was never even spawned. A local pre-flight probe amplifies a premise error into a fast, well-labelled refusal. | pre-fix `…:224-230` |
| M2 | The 250 ms clamp | `DEFAULT_CLI_FALLBACK_TIMEOUT_MS = 250` against a measured warm CLI latency of about 440 ms, so even a reachable daemon would have timed out. The fix changed the *derivation* — use the caller's hook budget — not the number. | `hooks/lib/skill-advisor-cli-fallback.ts:76,145-158`; F17 `004/goal.md:118` |
| M3 | `--warm-only` | A flag that is *correct* for a fallback (never pay daemon start) and *wrong* for a primary (must return a recommendation). The argument text never changed; its correctness did. | resolution `hooks/lib/skill-advisor-cli-fallback.ts:242-246`; F18 `004/goal.md:119` |
| M4 | Uniformed latency proof | The fallback returned in 30317/30366/30332 ms because the CLI waited its whole 30 s tool timeout; the scorer itself takes ~213 ms. Correctness was proven on a path where latency was the point. | F20 `004/goal.md:116` |
| M5 | The fix that removed the work | Removing the daemon spawn instead of bounding the wait left a cold session with one recommendation and no Advisor line; "the 209 ms that looked like success was the signature of the defect: fast because it had stopped doing the work". | F21 `004/goal.md:114`; invariant now stated at `hooks/lib/skill-advisor-cli-fallback.ts:307-309` |
| M6 | The dropped ambiguity flag | The producer carried `ambiguous: true`; the mapper never mentioned the word, so the renderer printed the single-skill line instead of the near-tie. Found only by rebuilding both versions in one worktree and diffing. | F19 `004/goal.md:113` |

### 3.3 Generalisations

- **Promotion does not create the defect; it converts exposure zero into exposure one.** Provenance: the helper was added by `0d19afb4e86` (packet 028) and predates this packet's first commit `1d900a17bf`; 025 touched it in `e8d564ca98`, `7920288acb`, `3feab865ea`. The audit therefore belongs to the *promotion commit*, and its scope is fixed: **for every value the promoted path reads, find the module that owns it and check the assumption against the owner's rule.**
- **A distinct reason code is necessary but not sufficient.** Required: the reason must be surprising to some assertion. Otherwise it is a better-labelled silence.
- **A speed-up on a degraded path is presumptively a defect** until the work it stopped is accounted for (M5).
- **A comment that justifies a failure-only path's premise is a defect report**, not documentation. The pre-fix helper carried its wrong premise in writing (`…:214-215`), and the finding itself quotes it as an admission.

### 3.4 A live specimen at HEAD, outside this packet's authorship

The second spelling of the advisor DB-directory override is unreachable at six sites, because a rename rewrote the second operand of an alias chain into a duplicate of the first: `hooks/lib/skill-advisor-cli-fallback.ts:182`, `bin/lib/launcher-ipc-bridge.cjs:95`, `bin/system-skill-advisor-launcher.cjs:131,133,358`, `plugins/system-skill-advisor.js:355-356`, `commands/doctor/scripts/skill-graph-freshness.cjs:47`. Introduced by `19e1ffedaf0 refactor(hooks): rename mk- hook library to self-describing names` (2026-08-21), an ancestor of the packet's base commit.

Attribution, stated plainly: **pre-existing, not produced by this packet.** It matters here because it is a live specimen of a residue class (R8, §4) that the packet's sweep did not reach, and because the same repository contains the working mitigation.

---

## 4. FINDING 2 — THE RESIDUE TAXONOMY

Eight classes. For each: the carrier in this packet, the dead referent, and the instrument that finds it.

| # | Class | Carrier | Dead referent | Found by |
|---|---|---|---|---|
| R1 | Config env whose holder died | the five removed MCP blocks; values re-homed to `bin/system-skill-advisor-launcher.cjs:80-90`; five `_NOTE_*` doc keys recoverable only from `git show eb53802beb` | the block that held them | reading the deletion diff |
| R2 | Tests encoding the removed contract | `tests/compat/plugin-bridge.vitest.ts` (9 cases), `plugin-bridge-smoke.vitest.ts` (1), `rename-invariants.vitest.ts` (4, 3 red), `system-skill-advisor-plugin.vitest.ts` (27 of 41 red), `skill-advisor-cli-dual-client.vitest.ts`, `tests/parity/cli-vs-mcp-parity.cjs` (592 lines, 22 cases) | the bridge, the MCP leg, the retired registration | tooling — but only if a full suite is sampled |
| R3 | Names outliving referents | kept by decision: `feature-catalog/mcp-surface/`, `native-mcp-tools/`, `standalone-mcp-shape.md`, `legacy-tool-bridge.md`, `native_mcp_tools`, `MCP_SHAPE`, `mcp` trigger aliases, `MCPCallerContext`, `runtime: 'mcp'`, and the lying identifier `mcpServerDir` (`bin/skill-advisor.cjs:22`) | mixed — some dead, some alive | human judgement; no instrument |
| R4 | Generated artifacts | retrieval corpus (47 stale paths), `leaf-manifest.json`, the committed trigger index, `.opencode/skills/.state/` | the sources they derive from | tooling finds the strings; only the generator's contract explains the deferral |
| R5 | Cross-package hardcoded paths | `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19` (fixed) plus **603** surviving `mcp-server/` references repo-wide | the old package directory | path-shaped grep, run *outside* the tranche |
| R6 | Documentation describing a deleted harness | 12 classified historical survivors in the advisor skill; `mcp-doctor.sh:59,269,297-303,360,399,415` and `doctor-mcp-debug.yaml:27,42,90,108-122` outside it | the MCP transport and its registration | grep finds strings; reading finds tense and consequence |
| R7 | Local machine state outside the repository | `.system-skill-advisor-launcher.json`, the `.opencode/skills/.state/advisor/` generation counter, a stray bench daemon | the isolated-run configuration each recorded | neither grep nor suite; a run's side effects |
| R8 | Alias pairs collapsed by a rename | `references/config/db-path-policy.md:80`, `runtime/database/README.md:25`, six code sites | the alias name that no code honors | a **concept** grep (`legacy fallback`), not a token grep |

**Two corrections that matter.** R1 is not a sweep problem at all: the deleted block's contents are not in the tree, so the instrument is history and the class is a *pre-deletion read*. And R8 lives **inside the swept directory**: two live documents under `.opencode/skills/system-skill-advisor/` still assert the alias while the code reads one name twice.

**R8 also has a proven remedy in the same repository.** `.opencode/hooks/shared/hook-flags.cjs:43-63` keeps an enumerated `LEGACY_ALIASES` table naming three generations of names for each concern, with the rule stated: "everything a real surface also documents or exports for the same concern is listed here so the documented switch actually disables the hook". The failure mode is not "the rename was mechanized" — it is **alias knowledge copied into every consumer instead of owned in one table**.

**Two further properties worth abstracting.**

- A generated artifact is *derived* (so a source change makes it stale without touching it), its regeneration is *all-or-nothing* (006: one generator run rewrote 18,966 unrelated lines and shifted advisor fusion scores), and its consumers may *depend on the drift*. It is therefore the most deferrable class — and sometimes a *fence*: the committed trigger index constrained what 007 was allowed to rename in the documentation.
- R7 is residue in the **environment**, not the corpus: a harness rewrote the real launcher status file to a temporary DB path and "a normal call did not heal it because the CLI attached to the running daemon instead of relaunching" (003 F11); the generation counter "honors neither the database nor the socket override, so a harness run moves shared state. Three runs moved it 1060 to 1078" (003 F10).

---

## 5. FINDING 3 — THE TOOLING-VERSUS-READING SPLIT IS A PROPERTY OF THE SEARCH KEY

1. **A token-keyed search finds residue that still carries the removed token.** R2, R5 and R6 are token-reachable, which is why the sweep *was* complete — complete for the classes whose carrier names the removed thing.
2. **Residue whose carrier does not name the removed thing is invisible to that search, even inside the swept directory.** R8 is the proof: caused by a different rename, in a different vocabulary, with no transport token anywhere in the carrier. The remedy is a second key family — the *intent* vocabulary of the operation: `legacy`, `alias`, `fallback`, `still recognized`, `deprecated`, `old name`. One such command found this packet's unclosed class.
3. **Some classes have no corpus at all.** R7 is found by diffing a run's side effects; R1 only by a key in history.

The instrument that would have caught R2 is not a better search but a *wider sample*: red tests are loud, and they are invisible only while no suite includes them.

---

## 6. FINDING 4 — DETECTION AT PROMOTION TIME: SEVEN CHECKS, CHEAPEST FIRST

| # | Check | Catches | Artifact it must read | Cost |
|---|---|---|---|---|
| 1 | Execution census — has this path ever returned success? | any member (triage) | run logs / counters | ~zero |
| 2 | Derivation equality — the fallback's resolved value equals the owner's, for two inputs | M1, M1b | the owner module | unit, no daemon |
| 3 | Budget floor — effective timeout ≥ measured p50 of the call it makes | M2 | one stored latency number | unit + 1 constant |
| 4 | Negative-path latency bound — absent socket and refused connection return fast | M4 | no daemon at all | unit |
| 5 | Degraded-content assertion — the degraded answer carries the full observable shape | M5 | a captured degraded payload | unit + fixture |
| 6 | Invocation inversion + byte diff — run the fallback as primary, diff against the primary | M3, M6 | both versions in one worktree | scratch worktree + harness |
| 7 | Three-backend-state proof — warm, cold, unreachable | M3, M4, M5 end-to-end | real daemon lifecycle | daemon control |

Three rules from this packet's evidence:

- **Check 2 must assert an equality, never a literal.** A test asserting the socket path *value* would have passed on the defective revision, because that value was the implementation's own output. The owner already has the complementary test (`launcher-ipc-bridge-probe.vitest.ts:320-321`); the missing half is the cross-seam equality. The same mistake appears one layer up in 003's first frozen input set, which "tested required-argument errors instead of what they claimed" (`003/goal.md:38`): **an expectation derived from the implementation cannot catch an implementation error.**
- **Check 6 needs a captured before-image and a single corpus.** It is the only check here with a proven catch, and 004's first attempt at it was invalid because it compared the old path in the main checkout against the new one in a worktree — "two different corpora, and the numbers flattered the change".
- **Checks 1-5 need no daemon, no worktree and no second checkout.** They are the ones that will actually run.

**Why the cluster survived in the first place:** three harnesses existed and each was scoped to a component — the parity harness to the CLI binary and launcher entry, the hook suites to hook logic with a stubbed producer, the fallback suite to the envelope shape. **A fallback lives in a seam by construction, because its trigger is another component's failure**, so component-scoped coverage has a systematic blind spot exactly where fallbacks live. Every harness passed, and their combined green was not evidence about the seam.

---

## 7. FINDING 5 — THE PACKET RECORD'S OWN DEFECTS

Listed by kind, because the kind determines the remedy.

| # | Kind | Defect | Evidence |
|---|---|---|---|
| C1 | Status contradiction | The parent's §Progress rows for 004-008 all read `Pending` with empty evidence, and §DONE WHEN is empty in every row — while 004 was closed by `91fd9b6226`, 005's removals shipped (`eb53802beb`, `077dbf804d`), 006 records 407 renames and `completion_pct: 100`, 007 records 160 validated documents, and 008 holds `latency-delta.md` with final-state numbers. A session resuming from the parent reaches the inverse of the truth. | parent `goal.md`; `008/latency-delta.md` |
| C2 | Phase log vs own summary | `005/goal.md:103-105` and all three rows of `006/goal.md` say `Pending` while the same files' tables/impl-summaries say Done; `008/implementation-summary.md` says "Not started" beside a measured latency report; `009` and `010` goal logs are untouched templates. | those files |
| C3 | One number, two labels | `parity/report.json` says `allowlisted: 15, differed: 0`; `parity/verdict.md:27` labels the same fifteen `Differing`. | `003/parity/*` |
| C4 | Superseded limitation | 007 limitation 2 reports four pre-existing red tests as raised-not-fixed; `9015d00c79` subsequently rewrote or retired them (and 006 limitation 2's red suite). The final limitations describe a state two commits old. | `git:9015d00c79 --numstat` |
| C5 | Open item closed in source | 004's F18 is headed `OPEN` and its runtime-proof row is `Pending`, while the resolution is in source and the phase is closed. **A pending row can record a question that stopped being a question.** | `004/goal.md:119`; `hooks/lib/skill-advisor-cli-fallback.ts:242-246` |
| C6 | Reopened phase, unnamed fix | 003's `Wire migration` row reads `REOPENED`, honestly explaining that it "closed its criteria on those artifacts rather than on what the contract said the phase owed"; no `tools/call` remains at HEAD, but the replacement landed in `3def6d6c9b`, whose message names no phase. | `003/goal.md:102`; `skill-advisor-cli.ts:22,1296-1304` |
| C7 | External framing not reproducible | The driving brief cites "26 tests of a deleted file and 7 asserting removed registrations". The suites count 9+1, 4, and 22 frozen cases, with 27-of-41 failing in the plugin suite. Recorded so the figure does not propagate. | `git:9015d00c79 --numstat` |
| C8 | Handoff with no receiving record | 005 handed the retrieval fixture to 007; the fixture survives in `system-spec-kit` while 007's scope was the advisor skill directory, and 007's summary never mentions it. A repo-wide retired-id count of 3 has every survivor classified except this one. | `005/goal.md:15`; `phrase-variants.json:60670` |

**What the record gets right, and why it matters for reading the rest.** 002 discarded an invalid benchmark run rather than reporting its 87 ms figures. 003 declared its own closure premature. 006 recorded the defects it fixed *and* the pre-existing failures it left. 007 raised code defects instead of fixing them in place. 004 recorded that its own fast-fail fix was worse than the bug, with numbers. **The record's problem is staleness at the edges, not inflation** — which is the opposite of the usual failure and is what makes it usable as a case study.

---

## 8. FINDING 6 — PROVENANCE AND EXPOSURE

The helper file was added by `0d19afb4e86 feat(028): skill-advisor runtime integration`; this packet touched it three times (`e8d564ca98`, `7920288acb`, `3feab865ea`). The defects of M1, M1b, M2 and M3 were therefore *inherited*, and 025's contribution was the promotion that exposed them. The general form:

> **A migration does not have to create a defect to be the reason it was found.** What it changes is the execution count. So the audit is a property of the promotion commit, and it is scoped by what the promoted path reads.

This also explains the packet's shape: the most valuable phase for this study is 004, not 005. Deletion is mechanical once the replacement is proven; promotion is where exposure changes.

---

## 9. RECOMMENDATIONS

| # | Recommendation | Why (evidence) |
|---|---|---|
| 1 | Treat any promotion of a fallback to primary as a change requiring its own audit of the promoted path's preconditions, scoped to the values it reads and the modules that own them. | §3.3 provenance; M1-M3 |
| 2 | Keep alias knowledge in one enumerated, tested table per concern — never as an inline `??` chain repeated per consumer. | R8; the working `LEGACY_ALIASES` table |
| 3 | Make a full-suite run and a pre-existing-red baseline mandatory before and after the removal. | R2; 007 limitation 2; F14's stale case predating the packet |
| 4 | Sweep residue twice: once with the removed token, once with the operation's intent vocabulary. | §5; R8 found by `legacy fallback` in one command |
| 5 | Read live operator surfaces for *tense*, not for tokens: past-tense survivors are records to keep, present-tense ones are false and may act. | R6; the doctor diagnostic that invites re-registration |
| 6 | Treat generated artifacts as scheduled work with a recorded owner, and check whether any generator's output constrains what may be renamed. | R4; 006's non-separable regeneration; 007's trigger-index fence |
| 7 | Diff the machine state a harness touched, after it runs. | R7; 003 F10/F11 |
| 8 | Reconcile status rows, evidence tables and handoffs against the final state as the last step of the migration, not the first. | C1, C2, C8 |

---

## 10. ELIMINATED ALTERNATIVES

Negative knowledge, as primary output. Each entry names what was eliminated and the evidence that eliminated it.

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Explain the flat socket probe as a mistyped or stale literal | The literal is the correct unscoped form of the *default* socket directory, and the owner scopes precisely that directory by construction; a string fix would re-break at the next derivation change | `bin/lib/launcher-ipc-bridge.cjs:103-109` |
| Treat a distinguishable fallback reason code as sufficient observability | `socket_absent` is a member of the retryable set, so the caller already expects it | `hooks/lib/skill-advisor-cli-fallback.ts:86-91` |
| Widen the 003 parity harness to cover the hook helper | Its allowlist encodes genuine surface differences, so covering the seam would require modelling the seam's semantics; a cross-seam equality assertion is smaller and sufficient | `003/goal.md:41` |
| Assert the helper's socket path as a literal value | The defective revision's own output is what such a test would assert; it re-encodes the premise | pre-fix `…:216` |
| Handle name residue with a single token sweep | `mcpServerDir` (a dead referent) and the `mcp` trigger aliases (a live referent) share the token and require opposite dispositions | `bin/skill-advisor.cjs:22-23`; 007 decisions |
| Handle generated artifacts with a blanket regenerate-after-rename step | One generator run rewrote 18,966 unrelated lines and shifted advisor fusion scores; the manifest generator fails on an unrelated resolution defect | 006 decision table; 007 limitation 5 |
| Treat R1 as a post-deletion search problem | The deleted block's contents are not in the tree; the instrument is git history, so the class is a pre-deletion read | `git show eb53802beb` |
| Treat the seven-class taxonomy as closed | R8 appeared only when the split forced the question of which search key each class needs | `references/config/db-path-policy.md:80` |
| Read the parent's pending progress rows as a delivery failure | Every phase's artifacts exist; the rows are a reconciliation failure | parent `goal.md` vs phase artifacts |
| Reproduce the brief's "26 tests / 7 registrations" | The actual suites count 9+1, 4, 22 frozen cases, and 27-of-41; the figure is in no packet artifact | `git:9015d00c79 --numstat` |

---

## 11. OPEN QUESTIONS

1. **Would checks 1-5 have caught M1-M5 without the promotion?** The evidence says the checks are *available* before promotion, but the packet never ran them, so their yield is argued from mechanism rather than demonstrated. A proof would require replaying the pre-promotion revision and running the check set against it.
2. **Is the R8 alias collapse a family-wide residue or a one-off?** The DB-directory alias collapsed at six sites; the hook-flag family kept its aliases in a table. Both are renames of the same vocabulary. Whether the difference is a rule (a table existed) or an accident (someone edited by hand) is not determinable from the artifacts; `19e1ffedaf0`'s diff would settle it.
3. **How much residue does R5's 603-reference remainder actually cost?** The count is a marker, not a measurement. Whether any of those references is *executed* (rather than read) was not established; 006 warns most are "runnable examples", which implies some are.
4. **Does the machine-state class (R7) recur elsewhere?** It was found by accident twice in this packet. Its frequency is unknown because nothing collects it.
5. **Is the checklist transferable to a migration without a comparable record?** Every ordered position rests on evidence from this packet. The availability-then-cost rule is a general claim; the specific step ordering is not tested beyond this case.

---

## 12. THE CHECKLIST

Five stages. Failure is cheapest in Stage 0 and most expensive in Stage 3, and the boundary between Stage 1 and Stage 2 is *availability*, not cost: steps 8-12 can only run while both paths exist.

### Stage 0 — before anything is touched (reading and capturing)

1. **State the bar as operator-visible behavior, and capture the before-image from the worktree the change will land in.** *Catches:* every later "it looks the same" claim. The artifact that caught F19; its absence invalidated 004's first comparison (main checkout vs worktree: two corpora).
2. **Enumerate callers and automatic behaviors, classified by who starts them.** *Catches:* the one-hook-rather-than-four surprise (F15) and paths no list mentions.
3. **For every config block to be deleted, enumerate its members — values *and* commentary — and name each member's new owner.** *Catches:* R1. A block holds policy, not only transport: here a trust grant, a doc-trigger flag, and five `_NOTE_*` keys whose content survives only in git.
4. **Search for the string being renamed outside your own tranche, and record the count with an owner.** *Catches:* R5 — 603 surviving references, starting from a hook path hardcoded in a sibling package.
5. **For each name being renamed, enumerate its aliases in one owned table and decide each alias's fate.** *Catches:* R8. Working form: `.opencode/hooks/shared/hook-flags.cjs:43-63`. Failing form: an inline `NAME ?? NAME` chain per consumer.
6. **Read every live operator surface describing the removed thing; classify each sentence past- or present-tense.** *Catches:* R6 — a past-tense sentence is a record, a present-tense one becomes false and, if it is a diagnostic, will act.
7. **Write the preserve set, with a proof for each item now.** *Catches:* silent capability loss, the one outcome D2 forbids.

### Stage 1 — prove the replacement while both paths exist (one scratch environment)

8. **Promote the fallback to primary in a scratch environment and byte-diff its observable against the primary's, in one worktree.** *Catches:* M6 and the M1-M3 family. The highest-yield step, and only available here.
9. **For every value the promoted path reads, check its assumption against the module that owns it.** *Catches:* M1, M1b, M2. Assert equality of two derivations, never a literal.
10. **Time the degraded path, and assert a content contract on the degraded answer.** *Catches:* M4 and M5. "Degraded" is content, not status; and a speed-up on a degraded path is presumptively a defect.
11. **Exercise the replacement warm, cold and unreachable, and record a number for each.** *Catches:* the cold path, which a real session hits first.
12. **Run the whole suite and record the pre-existing red set.** *Catches:* unattributable failures later — this packet had a stale case predating it and four red suites.

### Stage 2 — the removal

13. **Delete the transport, and retire or repoint every test that named it in the same commit.** *Catches:* the three deletion blockers 004 handed to 005, each of which breaks when the bridge goes.
14. **Deregister from every runtime, then verify operator-visible behavior survives with zero declarations.** *Catches:* a partial deregistration.
15. **Rename only after the deletion; carry every resolving path, rebuild every package that runs from `dist`, and delete the pre-rename build output.** *Catches:* the rename defects 006 fixed on the way and the missed-reference-that-keeps-working trap.
16. **Re-run the before-image diff, the three-state battery and the latency comparison from the final state.** *Catches:* regressions and the like-for-like claim.

### Stage 3 — post-removal battery (cannot succeed earlier)

17. **Full-suite run; attribute every red to the recorded baseline set or fix in place.** *Catches:* R2.
18. **Re-read live operator surfaces for present-tense claims about the removed thing.** *Catches:* R6's dangerous half — the diagnostic that invites re-registration.
19. **Diff the machine state the migration touched: status files, shared counters, stray daemons.** *Catches:* R7.
20. **Run a concept-keyed residue search alongside the token-keyed one.** *Catches:* R8 and any class whose carrier does not name the removed thing.
21. **Decide regenerate-or-defer per generated artifact, record reason and owner, and check whether a generator's output constrains what may be renamed.** *Catches:* R4 including its fence property.
22. **Reconcile the record: phase status rows, the parent's progress and evidence tables, and every handed item against its receiver's scope.** *Catches:* C1, C2, C8 — and it must run last, because it attests to the final state.

**The ordering rule the checklist encodes:**

> **Filter by availability first, then by cost.** A check that can only run while both paths exist is a *gate* on the removal; a check that can only run afterwards is a *step in a battery*.

---

## 13. METHOD NOTES AND LIMITS

- **Everything was re-verified at HEAD.** The packet's phase logs are written in the present tense about defects that are fixed; three claims from the log were confirmed only by reading the pre-fix source out of git.
- **Not executed:** the suite, the three-state battery, and the inversion harness. The detection checks' yields are argued from mechanism and from the packet's recorded outcomes, not from a run I performed. Latency claims are quoted from the packet with their measurement context.
- **Counts are measurements, not estimates:** 603 `mcp-server/` references (markdown, excluding `node_modules`, `dist`, advisor `changelog`), 3 retired tool ids repo-wide, 6 alias-collapse code sites, 47 stale retrieval paths, 407 renames, 10 + 4 + 22 = 36 test cases across the retired or rewritten suites.
- **Containment:** every artifact of this study lives under this lineage directory. The append gateway was not used (see §2), and no repository file was modified.

---

## 14. REFERENCES

**Packet artifacts**
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md` — directive D1-D10, completion criteria, progress and DONE WHEN tables
- `…/001-transport-and-consumer-inventory/{goal.md,inventory.md}` — F1-F4; freeze `6012ec5c7d`
- `…/002-daemon-transport-decision/{goal.md,baseline.md,protocol-contract.md,warm-mechanism.md}` — F5-F9, bench residue
- `…/003-cli-front-door-parity/{goal.md,parity/report.json,parity/verdict.md,parity/frozen-inputs.json,parity/cli-vs-mcp-parity.cjs}` — parity method, F10-F12, the reopened wire row
- `…/004-caller-rewire/goal.md` — F13-F21, the before-image baseline, the three-state proof
- `…/005-mcp-transport-removal/goal.md` — deletion blockers, the socket-as-request-handler blocker, the fixture handoff
- `…/006-runtime-package-rename/implementation-summary.md` — 407 renames, reference classes, defects fixed, limitations
- `…/007-docs-and-residue-sweep/{goal.md,implementation-summary.md}` — sweep scope, counts, residue record, retained names, limitations
- `…/008-verification-and-closeout/latency-delta.md` — final-state latency against the phase 2 budget
- `…/009-deep-review-decommission/review/lineages/deepseek-review/iterations/iteration-001.md` — the live doctor residue (independent, sibling lineage)
- `…/010-deep-research-residue/prompts/research-target.txt` — the brief this study executes

**Repository code at HEAD**
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:76,79,86-91,145-158,182,194-252,307-309`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:287`
- `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:22,36,366-369,1245-1291,1296-1304`
- `.opencode/skills/system-skill-advisor/runtime/tests/hooks/{skill-advisor-cli-fallback-envelope.vitest.ts,claude-user-prompt-submit-hook.vitest.ts}`
- `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md:80`; `runtime/database/README.md:25`
- `.opencode/bin/{skill-advisor.cjs,system-skill-advisor-launcher.cjs,lib/launcher-ipc-bridge.cjs}`
- `.opencode/hooks/shared/hook-flags.cjs:43-63`
- `.opencode/plugins/system-skill-advisor.js:355-356`; `.opencode/plugins/tests/system-skill-advisor.test.cjs:193-194`
- `.opencode/commands/doctor/scripts/{mcp-doctor.sh,skill-graph-freshness.cjs}`
- `.opencode/skills/system-spec-kit/{runtime/hooks/claude/user-prompt-submit.ts:19,runtime/tests/launcher-ipc-bridge-probe.vitest.ts:320-321,runtime/cli/retrieval/fixtures/phrase-variants.json:60670}`

**Commits** (`git log -S`, `--diff-filter`, `--numstat`, `git show`)
- `1d900a17bf` packet's first commit · `0d19afb4e86` helper's origin · `19e1ffedaf0` the mk- rename that collapsed the alias
- `e8d564ca98` prompt hook moved to the CLI (M5 shipped here) · `7920288acb` cold-start bound · `3feab865ea` package rename
- `eb53802beb` deregistration · `077dbf804d` bridge deletion · `f4bf73e682` phase 3 reopened · `3def6d6c9b` wire replaced
- `91fd9b6226` phase 4 closed · `9015d00c79` suites retired · `afd10f291f` sweep finished

**Live checks performed**
- `/tmp/system-skill-advisor/` scope directories and their `daemon-ipc.sock` entries
- `grep` counts: 603 `mcp-server/` markdown references by area; 3 retired tool ids; 6 duplicated-operand sites

**Eliminated-alternatives sources:** §10 table, each row with its own evidence citation.

---

## 15. LINEAGE ARTIFACTS

| Artifact | Purpose |
|---|---|
| `iterations/iteration-001.md` … `iteration-005.md` | Per-iteration narratives with findings, sources, assessment and ruled-out directions |
| `deltas/iter-001.jsonl` … `iter-005.jsonl` | Structured per-iteration findings, negative knowledge and graph events |
| `deep-research-state.jsonl` | Append-only config, iteration and synthesis records (executor-written; see §2 deviation) |
| `deep-research-strategy.md` | Persistent plan: questions, what worked, what failed, ruled out, next focus |
| `findings-registry.json` | Question and finding state with metrics |
| `deep-research-dashboard.md` | Regenerated operator summary |
| `research.md` | This synthesis (workflow-owned canonical output) |
