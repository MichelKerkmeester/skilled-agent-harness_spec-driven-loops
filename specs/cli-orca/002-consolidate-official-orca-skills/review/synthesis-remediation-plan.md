# Synthesis Remediation Plan: cli-orca

Synthesised from the completed five-iteration `/deep:review` run. Every finding below was re-opened at its cited
`file:line` and, where the claim was behavioural, re-executed. Corrections to the compiled report are stated inline as
`CORRECTION` and are marked `[verified]` when I ran the check myself.

Path shorthand: `SKILL` = `.skilled/skills/cli-orca/SKILL.md`, `REF` =
`.skilled/skills/cli-orca/references/orca-cli-reference.md`, `RMAP` =
`specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md`. All commands run from the repo root.

**Harness A — router probes.** Executes the fenced `python` block of `SKILL:94-168` in place, so it survives any edit
of the surrounding prose. Exit 1 = broken.

```bash
python3 - <<'PY'
import pathlib, sys
p = pathlib.Path('.skilled/skills/cli-orca/SKILL.md'); src = p.read_text().splitlines()
s = next(i for i,l in enumerate(src) if l.strip()=='```python')
e = next(i for i in range(s+1,len(src)) if src[i].strip()=='```')
ns = {'__file__': str(p.resolve())}
exec(compile('\n'.join(src[s+1:e]),'SKILL.md','exec'), ns); r = ns['route']
bad = []
if r("please read the terminal and share skills")["action"]=="load": bad.append("generic terminal routed")
if r("embedded browser snapshot")["action"]=="load": bad.append("generic browser routed")
if r("help me with computer-use")["action"]=="load": bad.append("unplaced official name routed")
if r("Show the OpenOrca model label for the current request.")["action"]!="defer": bad.append("holdout routed")
if r("orca terminal read --json")["load_level"]!="TERMINAL": bad.append("orca terminal lane lost")
if r("managed worktree listing")["load_level"]!="WORKTREE": bad.append("sanctioned compound lost")
for q in ["use the orca cli","orca handoff to another agent",
          "help me with the linear-tickets skill in Orca","the orca-emulator-android skill in Orca"]:
    if r(q)["action"]!="load": bad.append("listed trigger does not route: "+q)
print("router probes:", "PASS" if not bad else "FAIL: "+"; ".join(bad)); sys.exit(1 if bad else 0)
PY
```

Current state, executed: `FAIL: generic terminal routed; generic browser routed; unplaced official name routed;
listed trigger does not route: use the orca cli; listed trigger does not route: orca handoff to another agent;
listed trigger does not route: help me with the linear-tickets skill in Orca`, exit 1 — which is the finding, reproduced.

**Harness B — scope coverage.** Counts in-scope entries under `.skilled/skills/cli-orca/` that no map row or glob row
matches. Read the printed count, not the exit status: this probe exits 0 whether or not entries are uncovered. Current
state, executed: `rows: 53  scope entries without a row: 14`.

```bash
python3 - <<'PY'
import json, re, fnmatch, pathlib
cfg=json.load(open('specs/cli-orca/002-consolidate-official-orca-skills/review/deep-review-config.json'))
scope=[p for p in cfg['reviewScopeFiles'] if p.startswith('.skilled/skills/cli-orca/')]
t=pathlib.Path('specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md').read_text()
rows=re.findall(r'^\|\s*`([^`]+)`\s*\|', t, re.M)
plains={r for r in rows if '*' not in r}; globs=[r for r in rows if '*' in r]
miss=[p for p in scope if p not in plains and not any(
    fnmatch.fnmatch(p,g) or p.startswith(g.rstrip('*')) for g in globs)]
print("rows:", len(rows), "scope entries without a row:", len(miss)); print(*miss, sep="\n")
PY
```

---

## 1. Verdict baseline

| Field | Value | Source |
|---|---|---|
| Verdict | `CONDITIONAL` | `review/review-report.md:5` |
| Findings | P0=0, P1=1, P2=6, resolved=0 | `review/review-report.md:18`; registry `findingsBySeverity` `[verified]` |
| Stop reason | `maxIterationsReached` under `stopPolicy: max-iterations` | `review/review-report.md:15-16`; `deep-review-config.json` `/stopPolicy` `[verified]` |
| Release state | `in-progress` | `deep-review-config.json` `/releaseReadinessState` `[verified]` |
| Convergence | trend `0.40 -> 0.14 -> 0.00`, `convergenceScore` 1.00, `searchDebt` none | `review/review-report.md:23-26` |
| Graph convergence | `graphConvergenceScore` 0.00, `graphCoverageMode: graphless_fallback` — no decision emitted | `review/review-report.md:24-26` |
| Resource-map gate | armed, but degraded to a scope-list proxy: `applied/T-*.md` does not exist in this packet | `review/review-report.md:240`; `ls` of the packet root confirms no `applied/` `[verified]` |

What the loop actually verified, as opposed to what it claimed:

- `[verified]` The 32-document corpus sweep is clean today: I re-ran the exact sweep from the packet's own gate script
  (`scratch/final-gates.sh` `doc_sweep`) and got `cli-orca docs checked=32 blocking=0`, exit 0 — so `tasks.md:169`'s
  `checked=31` is stale with certainty, not by inference.
- `[verified]` The coverage gaps are exactly 14 (§Harness B), no more and no fewer.
- `[verified]` P1-001 is a live defect, not a reading: the fenced `python` block of `SKILL:94-168` was extracted,
  executed, and probed. Plain English routes into an Orca lane; the sanctioned trigger `orca cli` does not route at all.
- `[verified]` Live advisor routing is not mis-routed: `graph-metadata.json` `intent_signals` holds 13 entries, every
  one Orca-qualified or a sanctioned compound.
- Not verified: no Orca binary is present, so no upstream flag or command behaviour was confirmed; corpus-internal flag
  claims are `UNKNOWN` against the real binary. Nor did I re-audit the 18 ruled-out entries — the run's own search
  ledger is the authority for those (`review/review-report.md:296-310`), not this plan.

---

## 2. Priority queue

| Order | Finding | Sev | Surface | Change | Proving check |
|---|---|---|---|---|---|
| 1 | P1-001 | P1 | `SKILL:103-107`, `:151` | Prune the five generic surface keywords; state the RECOVERY-lane exception in the docstring | Router probe harness (§3.1) |
| 2 | P2-003 | P2 | `REF:94`, `:108` | Annotate both destructive examples with the gate and the authorization requirement | `rg` assertion (§3.2) |
| 3 | P2-001 | P2 | `SKILL:102`, `:105-106` | Add the six omitted §1 trigger phrases; stop bare official names routing without an Orca placement | Router probe harness (§3.3) |
| 4 | P2-004 | P2 | `tasks.md:169` | `checked=31` → `checked=32`; record the sweep command | Doc sweep re-run (§3.4) |
| 5 | P2-005 | P2 | `RMAP:62-63`, `:20-21` | Replace the two index rows with glob rows covering 12 sub-documents; re-derive Summary | Scope-coverage diff (§3.5) |
| 6 | P2-002 | P2 | `RMAP:65`, `:20-21` | Add one `OK` glob row for the two benchmark evidence artifacts; re-derive Summary | Scope-coverage diff (§3.6) |
| 7 | P2-006 | P2 | six documents incl. `README.md:24` | Declare `SKILL.md` the canonical restatement; the other five cite it | Canonical-pointer check (§3.7) |

Ordering rationale, risk × effort:

1. **P1-001 first.** It is the only finding that blocks PASS and it lives in the routing contract every other document
   defers to. Everything else is advisory.
2. **P2-003 second.** Highest residual risk of the advisories: it is the only one where an agent copying a documented
   example performs a destructive state change outside the documented gate (`REF:94` `--force`, `REF:108` `--all`). Cost
   is two inline annotations. Security-classed, so it outranks the rest.
3. **P2-001 third.** `[verified]` the skill's own headline trigger `orca cli` (`SKILL:28`) does not route — a
   user-visible false negative, not a documentation nit. It shares the `INTENT_SIGNALS` block with P1-001, so it is
   cheapest to land immediately after item 1 rather than in a later pass.
4. **P2-004 fourth.** A one-token closure-gate record. It carries no behavioural risk, but it must land before the map
   and packet records are re-derived so the checklist is truthful at the moment the counts are refreshed.
5. **P2-005, then P2-002.** Same file, one Summary re-derivation; both are gated on content items 1 and 3 having
   settled. P2-005 covers 12 files and replaces 2 rows, P2-002 adds 1 row — larger first.
6. **P2-006 last.** Largest structural decision (canonical copy), zero behavioural impact, and its recommended shape
   needs no shared-code change. Nothing depends on it.

---

## 3. Per-item detail

Every `Change` below must not embed the finding id, a spec path, or a task id in code, script, or skill-document text —
write the durable reason instead.

### 3.1 P1-001 — Smart Router admits generic vocabulary (P1, correctness)

**Evidence (all lines read directly).**

- `SKILL:103` `"TERMINAL": {"weight": 4, "keywords": ["orca terminal", "paired terminal", "read the terminal", "send to the terminal", "terminal receipt"]}`
- `SKILL:104` `"BROWSER": {"weight": 4, "keywords": ["orca browser", "orca embedded browser", "embedded browser"]}`
- `SKILL:105` `"AUTOMATIONS": {"weight": 3, "keywords": ["orca automation", "orca artifacts", "orca skills", "share skills"]}`
- `SKILL:151` docstring: `"""Only Orca-qualified phrases count. The bare token is excluded on purpose."""` — the filter at
  `:153` is a plain `keyword in text` substring test, so the docstring is false as written.
- `SKILL:157-158` `if not signals: return dict(UNKNOWN_FALLBACK)` — only an empty match set falls back.
- `SKILL:58` `routing needs an Orca-qualified multi-word phrase or a named Orca surface`.
- `SKILL:268` NEVER #7: `Never route a bare orca token, an OpenOrca model label, or generic worktree, terminal, browser or orchestration vocabulary into this skill.`
- `[verified]` Executed probes against the block as shipped:
  - `please read the terminal and share skills` → `{'action': 'load', 'load_level': 'TERMINAL', ...}`
  - `embedded browser snapshot` → `{'action': 'load', 'load_level': 'BROWSER', ...}`
  - `help me with computer-use` → `{'action': 'load', 'load_level': 'ORCA_SKILLS', ...}`
  - `runtime stopped` → `{'action': 'load', 'load_level': 'RECOVERY', ...}`
  - `Show the OpenOrca model label…` and `create a git worktree for the release branch` → `UNKNOWN_FALLBACK` (holdouts hold)

**CORRECTION (report and iteration 1):** the claimed lane for the first probe is wrong. `review/review-report.md:98-99`
says it "routes into the AUTOMATIONS lane"; `review/iterations/iteration-001.md:39` says `load_level: "AUTOMATIONS"`.
It routes into **TERMINAL**. `route()` breaks the tie with `max()` over dict insertion order (`SKILL:162`), and
`TERMINAL` is declared before `AUTOMATIONS` (`SKILL:103` vs `:105`). The impact claim survives; the reason given does not.

**CORRECTION (report §3):** the report lists only the TERMINAL and BROWSER keywords. Iteration 1 also recorded
`share skills`, `runtime stopped`, `executable missing`, `guide mismatch`, `ambiguous send`, and the executed probes
confirm two of them route.

**Change.** One edit to the `INTENT_SIGNALS` block plus one docstring line, in `SKILL`:

- `:103` TERMINAL → `["orca terminal", "paired terminal"]`
- `:104` BROWSER → `["orca browser", "orca embedded browser"]`
- `:105` AUTOMATIONS → `["orca automation", "orca artifacts", "orca skills"]`
- `:107` RECOVERY unchanged, with a lane comment stating that it names runtime failure states rather than surfaces, so
  it is the one lane that may be entered without an Orca qualifier.
- `:151` docstring → state that the set is Orca-qualified phrases plus the sanctioned compound surfaces of §1, and that
  the RECOVERY lane is state-based by design.

**Why this shape.** `managed worktree`, `paired terminal` and `child worktree` are declared qualifying surfaces by
`SKILL:27-29` and `README.md:54`, so a gate expressed as `startswith("orca")` — the report's second option at
`review/review-report.md:101` — would break three sanctioned triggers and duplicate the vocabulary. The literal sets are
already the single source; pruning them makes the docstring true with no second mechanism, and leaves `route()`'s
structure untouched. Marking the block non-normative (the third option) leaves NEVER #7 contradictory and removes the
only machine-shaped routing statement, which `SKILL:92` presents as the routing contract. RECOVERY is kept because
NEVER #7's own enumeration is "worktree, terminal, browser or orchestration vocabulary" and `SKILL:73` lists
`Runtime stopped, executable missing, guide mismatch` as recovery signals — the derivation is in the document.

**Proving check.** Harness A with its sixth probe. The four `listed trigger does not route` probes added for P2-001 (§3.3)
are declared here too, because both items edit the same block and the full set is what must be green after the pair
lands.

Additionally pin it durably as a new numbered gate in
`specs/cli-orca/002-consolidate-official-orca-skills/scratch/final-gates.sh`, whose `run()` wrapper already captures
exit status into `GATE_OUT` so the baseline-versus-final comparison in AC-012 stays meaningful. The scenario suite is
**not** the right home: `manual-testing-playbook/routing/negative-holdouts.md:30-40` tests the advisor, whose vocabulary
is `graph-metadata.json` `intent_signals` — already Orca-qualified, so that scenario stays green under this defect and
cannot prove the fix.

**Rollback.** The edit touches one block and one docstring; `git diff -- SKILL.md` restores the exact prior text and the
harness reverts to failing on the first two probes.

### 3.2 P2-003 — Destructive examples miss the gate (P2, security)

**Evidence.**

- `REF:94` `orca worktree rm --worktree id:<repoId>::<worktreePath> --force --json` — no `--run-hooks`, no annotation.
- `REF:108` `orca terminal close --worktree id:<repoId>::<worktreePath> --all --json` — no authorization note.
- `REF:82` the block's only caveat: `These lines prove intent and call shape, never the full surface.`
- `.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:65` shows the gated form
  `orca worktree rm --worktree <selector> --run-hooks --json`; `:68` `--force` does not bypass this gate.
- `mutation-and-browser-boundaries.md:72` `Bulk terminal close is destructive in the same class. It stops every
  terminal process in exactly that workspace and durably removes tabs, layouts and agent-resume records.`
- `REF:197` states the correction; `references/troubleshooting.md:43` and
  `feature-catalog/safety/mutation-and-ownership-boundaries.md:29` carry it too — all three confirmed by direct read.
- `[verified]` `rg -n 'run-hooks' .skilled/skills/cli-orca/` returns the gate form only in the boundaries doc and the
  feature catalog. The representative-call block never shows it.

**Change.** At `REF:94` append an inline comment naming the archive-hook gate and pointing at
`./mutation-and-browser-boundaries.md` §3; at `REF:108` append an inline note that bulk close is destructive and needs
explicit authorization plus the receipt rule. Leave both command lines otherwise byte-identical.

**Why this shape.** The lines are declared provenance copies of the upstream guide (`REF:82`), so rewriting the command
itself would falsify that provenance; annotating preserves it and fixes the copy hazard. Cross-reference the gate rather
than restate it, because `REF:195` describes `--run-hooks` as "a legacy alias for `--setup run` that also reveals the
worktree" while `mutation-and-browser-boundaries.md:65` uses it as the gated removal form — a restatement here would
become a third, potentially wrong, claim about the flag. `UNKNOWN`: no Orca binary is present, so which reading is
correct against the real CLI could not be confirmed.

**Proving check.**

```bash
rg -n 'recorded before|archive-hook|authorization' .skilled/skills/cli-orca/references/orca-cli-reference.md | sed -n '1,20p'
# then read :94 and :108 and confirm each destructive line carries its annotation
sed -n '94p;108p' .skilled/skills/cli-orca/references/orca-cli-reference.md
```

**Rollback.** Two appended annotations; `git diff -- REF` is a two-line revert.

### 3.3 P2-001 — trigger list and signal table disagree (P2, correctness)

**Evidence.**

- `SKILL:28` lists `orca cli`, `orca handoff` among the keyword triggers; `SKILL:29` lists `$orca-cli`,
  `full ownership handoff`; `SKILL:30` lists `linear-tickets` and bare `orchestration` as official names that route
  "when the request places them in Orca".
- `SKILL:102-106` implements only `orca worktree`, `managed worktree`, `orca repository`, `child worktree`, `orca terminal`,
  `paired terminal`, `orca-cli`, `orchestration skill`, `computer-use`, `orca-linear`, `orca-emulator`,
  `orca-per-workspace-env`.
- `[verified]` diff of `SKILL:101-108` against `graph-metadata.json` `intent_signals`: `orca cli` and `orca handoff` are
  in the advisor vocabulary but absent from the signal table; `$orca-cli` and `full ownership handoff` are in neither.
- `[verified]` executed probes: `use the orca cli` → `UNKNOWN_FALLBACK`; `orca handoff to another agent` →
  `UNKNOWN_FALLBACK`; `full ownership handoff through the Orca CLI` → `UNKNOWN_FALLBACK`.
- `README.md:54` repeats the same inventory, so the omission is a two-site divergence.

**CORRECTION (report §3, iteration 5):** the report and `review/iterations/iteration-005.md:48` record the omission set
as `linear-tickets` plus bare `orchestration`. The set is larger and includes the skill's own headline phrase
`orca cli`, plus `orca handoff`, `$orca-cli` and `full ownership handoff`. `orca-emulator-android` is genuinely covered
by substring, as recorded.

**Change.** In `SKILL:102` add `orca cli` and `orca handoff`; add `$orca-cli` and `full ownership handoff` where their
surfaces belong; in `SKILL:106` add `linear-tickets` and `orca-emulator-android`. Then resolve the §30 context rule in
the same document: a bare official name may not select the `ORCA_SKILLS` lane unless the request also carries an
Orca-qualified phrase, so `help me with computer-use` (no Orca placement) stops loading while
`help me with computer-use in Orca` keeps working.

**Why this shape.** Adding names alone leaves `SKILL:30`'s "when the request places them in Orca" unimplemented, which is
the clause the finding is about; a companion-qualifier requirement is the smallest rule that can express it without a
second vocabulary list. Aligning §1 down to the implementable set instead would delete four sanctioned triggers, and
`README.md:54` would then be wrong too.

**Proving check.** Harness A. Pre-fix, executed, the four trigger probes report `defer` and the unplaced-name probe
reports `load`; post-fix all five invert.

**Rollback.** Keyword-list edits only; the harness reverts to reporting `UNKNOWN_FALLBACK` for the four probes.

### 3.4 P2-004 — document count disagrees across three records (P2, traceability)

**Evidence.**

- `tasks.md:169` `Passed, checked=31 blocking=0`.
- `acceptance-criteria.md:49` AC-009 `Corpus sweep, cli-orca docs checked=32 blocking=0` and
  `implementation-summary.md:106` `Passed, 32 documents with 0 blocking issues`.
- `[verified]` I ran the sweep: `cli-orca docs checked=32 blocking=0`, exit 0. The corpus is 32 markdown files
  (`find .skilled/skills/cli-orca -name '*.md' | wc -l` → `32`). The 32-count rows are correct and `tasks.md:169` is
  stale.

**Change.** `tasks.md:169` → `Passed, checked=32 blocking=0`, and append the exact sweep command to the row's check cell
so the number is reproducible from the checklist.

**Why this shape.** The count is the only disputed datum; AC-009 and the implementation summary already agree, so
changing them would make three records wrong instead of one. No behaviour depends on the number, which is why this stays
at P2.

**Proving check.** `bash specs/cli-orca/002-consolidate-official-orca-skills/scratch/final-gates.sh` and read gate 9; the
printed `checked=` value must equal the value recorded at `tasks.md:169`.

**Rollback.** One token.

### 3.5 P2-005 — twelve in-scope sub-documents have no map row (P2, traceability)

**Evidence.**

- `RMAP:62-63` carry single rows for `feature-catalog/feature-catalog.md` and
  `manual-testing-playbook/manual-testing-playbook.md`; neither tree has a glob row, while sibling trees do
  (`RMAP:59` `references/orca-skills/**` "(9 files)", `RMAP:60` `assets/*.txt`).
- `[verified]` scope-coverage diff: of the 46 `reviewScopeFiles` entries under `.skilled/skills/cli-orca/`, twelve lack
  any matching row or glob — 4 under `feature-catalog/{orca-skills,routing,runtime,safety}/` and 8 under
  `manual-testing-playbook/{handoffs,ownership,routing,runtime}/`.
- `RMAP:46` is a category preamble (`.skilled/skills/**`), not a row, and demonstrably did not prevent the gap.

**Change.** Replace `RMAP:62` with `feature-catalog/**` and `RMAP:63` with `manual-testing-playbook/**`, each with
`Analyzed | OK` and the file count in the Note, mirroring `RMAP:59`. Re-derive the Summary at `RMAP:20-21`.

**Why this shape.** Glob rows are the established convention for a uniformly-handled subtree, and replacing the two
index rows rather than adding siblings keeps the index file from being counted twice — exactly how
`references/orca-skills/**` already works. Twelve individual rows would be a larger diff for the same coverage and would
set a precedent that duplicates `RMAP:59`.

**Proving check.** Harness B. The 14 uncovered entries must all be under `feature-catalog/**` or
`manual-testing-playbook/**` before the fix and `0` after it.

**Rollback.** Two table rows; replacing them back restores `rows: 53` and `scope entries without a row: 14`.

### 3.6 P2-002 — benchmark evidence artifacts have no map row (P2, correctness)

**Evidence.**

- `RMAP:65` declares only the not-yet-created
  `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--playbook-post-remediation/**` with status `PLANNED`.
- `[verified]` the declared 86-file scope contains
  `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/report.md` and
  `.../routing-replays.json`, and both exist on disk; neither matches any map row.
- `[verified]` the map does carry a benchmark-family row (`RMAP:65`) and a changelog row (`RMAP:64`), so
  benchmark-path rows are already in policy for this map even though `leaf-manifest.config.json`'s `_note` deliberately
  keeps `changelog` and `benchmark` outside the leaf roots. That note is about routable leaves, not audit surfaces.

**CORRECTION (report §3 and registry):** the cited line `RMAP:65` is the *contrasting* row, not the missing one. It is
the correct insertion anchor and the right `file:line` to hand an implementer, but the finding's own text reads as though
:65 were the offending row.

**Change.** Insert one row after `RMAP:65`:
`| .skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/** | Analyzed | OK | Captured routing evidence: report plus replay JSON |`
and re-derive the Summary at `RMAP:20-21`.

**Why this shape.** One glob row for the one evidence directory, matching `RMAP:59`'s treatment. A broader
`benchmark/**` glob would swallow the `PLANNED` post-remediation path into an `OK` row and claim coverage for files that
do not exist yet.

**Proving check.** Harness B, run **once** after both items land: `rows:` must read `54` and `scope entries without a
row:` must read `0`. Its 2 uncovered benchmark entries must be among the pre-fix misses — not added elsewhere.

**Rollback.** One inserted row plus the two Summary fields.

### 3.7 P2-006 — routing and ownership invariances duplicated with no gate (P2, maintainability)

**Evidence.**

- `[verified]` `rg -l 'mcp-aside-devtools' .skilled/skills/cli-orca` returns exactly six markdown documents:
  `SKILL.md`, `README.md`, `references/mutation-and-browser-boundaries.md`,
  `feature-catalog/feature-catalog.md`, `feature-catalog/routing/orca-qualified-vocabulary.md`,
  `feature-catalog/safety/mutation-and-ownership-boundaries.md`.
- `README.md:24` is one restatement site (`Defers | … generic agentic browser work to mcp-aside-devtools …`).
- The scoped validators are per-document or structural — `validate_document.py --help` offers a single positional `file`;
  `validate_skill_package.py --help` takes one `skill_path`. `[verified]` neither accepts a document set, and no script
  under `.skilled/skills/sk-doc/scripts/` or `sk-create-skill/scripts/` mentions the ownership matrix.
- The risk has already materialised once: §3.3's divergence is a divergence between two of these restatement sites.

**Change.** Add a one-line provenance pointer at each of the five non-canonical sites, naming `SKILL.md` as the
canonical statement of the ownership matrix and the routing vocabulary. Do not restructure the matrix.

**Why this shape.** The machine-check option would land a skill-specific cross-document rule inside shared sk-doc
validator code — a blast radius far wider than a maintainability advisory justifies, and a scope no packet record
authorises. The declaration is self-contained, fixes the property that actually failed (no site was labelled
non-canonical, so a divergence read as two equal truths), and makes the existing manual comparison repeatable via the
`rg -l` command above. If the fleet check is later wanted, where it lives is an sk-doc ownership question, not a cli-orca
one — recorded in §7.

**Proving check.**

```bash
for f in README.md references/mutation-and-browser-boundaries.md feature-catalog/feature-catalog.md \
         feature-catalog/routing/orca-qualified-vocabulary.md feature-catalog/safety/mutation-and-ownership-boundaries.md; do
  printf '%s: ' "$f"; rg -c 'canonical|SKILL.md states|see \[SKILL' ".skilled/skills/cli-orca/$f" || echo 0
done
# each file must print a non-zero count; SKILL.md is the canonical site and is excluded
```

Current state, executed: five zeroes — no site is labelled, which is the finding.

**Rollback.** Five single-line additions.

---

## 4. Sequencing and conflicts

| Files touched | Items | Constraint |
|---|---|---|
| `SKILL` `:101-108`, `:151` | P1-001, P2-001 | Same block. Land in one edit pass, then run the harness once: P1-001's prune and P2-001's additions both change the keyword sets and a split pass means two harness runs on a half-changed table. |
| `RMAP` `:20-21`, `:62-63`, `:65` | P2-005, P2-002 | Same file and the same Summary fields. One re-derivation after both row edits, or the second pass re-derives counts from a stale Summary. |
| `REF` `:94`, `:108` | P2-003 | Independent of every other item; no ordering constraint. |
| `tasks.md:169` | P2-004 | Before the map refresh, so the packet's verification record is truthful when the map's counts are re-derived. |
| five restatement sites | P2-006 | After items 1 and 3, since both edit text inside a restatement site (`SKILL`). Declaring a canonical copy before the vocabulary settles would point at text that then changes. |

One edit retiring two findings: the `INTENT_SIGNALS` edit in `SKILL` closes P1-001's admitted-vocabulary half and
P2-001's omitted-name half together. One re-derivation retiring two findings: the `RMAP` Summary refresh satisfies both
P2-005 and P2-002.

No item conflicts with another; no item requires deleting or weakening a check, deleting a test, or touching a fixture.
Nothing in this plan requires editing `.skilled/skills/sk-doc/**`, the advisor runtime, or the mcp-tooling hub.

---

## 5. Verification matrix

Run from the repo root. The packet's own suite is `bash specs/cli-orca/002-consolidate-official-orca-skills/scratch/final-gates.sh`
with `GATE_OUT=…/scratch/gate-results-baseline-review.md` for the pre-change capture and a second `GATE_OUT` for the
post-change capture — that baseline/final pair is AC-012's required evidence.

| Item | Gate / command | Records to update |
|---|---|---|
| P1-001 | Router probe harness (§3.1) + new numbered gate in `scratch/final-gates.sh` | `tasks.md` verification checklist (new row); `acceptance-criteria.md` AC-009-adjacent criterion from the review's spec seed if adopted; `implementation-summary.md` checklist row |
| P2-001 | Router probe harness extended (§3.3) | `tasks.md` checklist; `README.md:54` only if the inventory text changes |
| P2-002 | Scope-coverage diff, run once (§3.5) | `RMAP:20-21`; `resource-map.md` row count |
| P2-003 | `sed -n '94p;108p'` + `rg` assertion (§3.2) | `tasks.md` checklist row |
| P2-004 | `final-gates.sh` gate 9 `checked=` value (§3.4) | `tasks.md:169` |
| P2-005 | Scope-coverage diff, run once (§3.5) | `RMAP:20-21` |
| P2-006 | Canonical-pointer check (§3.7) | `tasks.md` checklist row if the check is promoted to a gate |
| Whole set | `final-gates.sh` full suite, baseline vs final; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-orca/002-consolidate-official-orca-skills --strict` must print `RESULT: PASSED` | `implementation-summary.md` verification table and status; `acceptance-criteria.md` AC-011 and AC-012 rows (currently `Unmet`); `tasks.md` T039-T046; `deep-review-config.json` `releaseReadinessState` via the loop's own writer only |

Two packet records are already truthful and must **not** be changed by this remediation: `acceptance-criteria.md:49`
(AC-009 = 32) and `implementation-summary.md:106` (32 documents). AC-010's evidence artifacts now exist
(`review/iterations/iteration-00N.md` verdict lines, `review/deep-review-state.jsonl`, `review/review-report.md`) and
should be re-graded from `Unmet` by whoever owns the packet's closure, not silently left stale.

Derived metadata: after any change under `.skilled/skills/cli-orca/`, gate 1 of the suite
(`ci-skill-root-metadata.cjs --fix`) and gate 14 (`ci-skill-derived-freshness.cjs`) must be re-run, because
`leaf-manifest.json`, `leaf-aliases.json` and `graph-metadata.json` are generated. Editing `SKILL` keyword text does not
change `intent_signals` (they derive from the frontmatter keyword line, not from the pseudocode), but the freshness gate
is the authority on that, not this plan.

---

## 6. Observed but not remediated

Real observations, with evidence, that belong to another owner or to another decision. None is a cli-orca defect.

1. **Loop runtime refused its own synthesis telemetry.** `append-mode-event.cjs` rejected the prescribed iteration
   record shape and the corrected envelope (`review/review-report.md:255-268`). I did not re-drive the runtime, so this
   stands as recorded, not re-verified. The gateway also refused `synthesis_complete` in three payload shapes; the
   closeout state itself is intact.
2. **`[verified]` The registry never advanced past init.** `deep-review-findings-registry.json` still carries
   `"status": "INITIALIZED"` and `"terminalStop": null` while `deep-review-config.json` carries `"status": "complete"`.
   The registry (mtime 15:35) and `deep-review-dashboard.md` (15:35) both predate the config's closeout write (15:38),
   so this is stale generated state rather than a wrong verdict — but anything consuming the registry's `status` or
   `terminalStop` reads it stale. Root cause, verified in the reducer: `buildTerminalStopState()` (`reduce-state.cjs:450-471`) derives `terminalStop` only from a `type:event, event:synthesis_complete` record — exactly the record the gateway refused (§6.1) — so no reducer re-run can clear this staleness; it clears only when the gateway accepts that event.
3. **`[verified]` `hasAdvisories: false` alongside six active P2 advisories.** `review/review-report.md:7`,
   `deep-review-dashboard.md:24`; `deep-review-config.json` `/severityThreshold` is `P2`, so six in-threshold
   advisories and a false advisories flag cannot both be right. The flag is reducer-owned.
4. **`[verified]` The resource-map coverage gate's declared input is unpopulated.** The packet has no `applied/`
   directory, so `applied/T-*.md` can never exist and the gate permanently degrades to a scope-list proxy
   (`review/review-report.md:240`). Two consecutive iterations recorded the same degradation without resolving it.
5. **`REF:195` versus `mutation-and-browser-boundaries.md:65` disagree on what `--run-hooks` is** — a legacy setup-hook
   alias that also reveals the worktree, or the gated removal form. Not filed as a finding by the run. It is not
   remediated here because no finding justifies it and no Orca binary is available to settle it against
   (`UNKNOWN`); §3.2's fix is deliberately shaped to avoid depending on the answer.
6. **Packet-level advisory, not a review finding.** The strict validator reports the packet's AC evidence citations as
   0/9 citing `file:line` while `AC_CLOSURE` passes 9/9 (`review/review-report.md:233-236`). Owner: the packet's
   closure pass.
7. **`[verified]` Five containment quarantine generations are stored under `review/containment/quarantine/{1..5}/`.**
   Quarantine 5's `manifest.json` (`timestamp: 2026-09-20T13:34:19.988Z`, well before this dispatch) records captured
   content and head patches for `.skilled/skills/sk-doc/sk-create-readme/**`, root `README.md` and
   `specs/sk-doc/056-sk-create-readme-writing-style/**` — none of them this target. Three of those live paths still
   differ from `HEAD`. Whether that residual difference is the quarantined out-of-scope write or the legitimate
   in-progress state of the unrelated `sk-create-readme` packet is `UNKNOWN` from this packet's evidence, and the
   distinction is not derivable here. Owner: whoever runs the `sk-doc/056` workstream.

---

## 7. Operator decisions

Only one item is genuinely not derivable from the evidence.

- **Where a cross-document invariant check should live, if P2-006 is ever promoted to a machine gate.** The evidence
  shows no existing scoped validator compares two documents (§3.7) and that sk-doc's validators are shared fleet code
  which this packet's remediation does not authorise touching. It does not establish who owns a fleet-level
  cross-document check, nor whether one is wanted beyond this skill. §3.7 ships the evidence-derived answer and leaves
  the fleet-check question to the sk-doc owner.

Everything else is decided in §3 from evidence — including the two shapes the report left open. RECOVERY stays
unqualified because `SKILL:268` enumerates only worktree, terminal, browser and orchestration vocabulary while `SKILL:73`
lists recovery states as lane signals. Bare official names stop routing without an Orca placement because `SKILL:30`
conditions them on it. The `--run-hooks` semantics conflict (§6.5) is left unresolved rather than guessed, and §3.2's
fix is shaped so that it does not depend on the answer.
