# Iteration 001 — KQ1: Latent failures behind the fallback

**Focus:** Which failures were latent while the CLI was only a fallback and surfaced solely because it became the primary path — at which file, by what mechanism.
**Status:** complete · **newInfoRatio:** 0.85
**Novelty justification (1 sentence):** 009 hunted surviving residue; no packet record had assembled the *executed* failure set of the flip together with the mechanism that hid each one, and the finding that the hiding was structural — the fallback-era verification class (payload parity against a live warm daemon, judged by exit code) could not see the lifecycle failure class — is new synthesis.

## Actions Taken

1. Surveyed the packet's phase records: located 009's lineage report, 008's closeout records, and the implementation summaries of phases 003–008 (`find` + `rg` over the packet).
2. Read 006-runtime-package-rename/implementation-summary.md in full — it names three defects fixed on the way and states the cold-start discovery.
3. Read 003-cli-front-door-parity/parity/verdict.md (what the fallback-era parity actually exercised) and grepped 008-verification-and-closeout/implementation-summary.md (what the final state had to add).
4. Read 004-caller-rewire/implementation-summary.md (found its record is an unfilled template — recorded for iteration 2) and checked the trust-default test against today's tree.
5. Verified the degraded-marker institutionalization: `rg "Advisor: stale|marked degraded" AGENTS.md` → 1 hit at line 101; confirmed `runtime/advisor-server.ts` still exists (`ls`, exit 0).
No test or daemon was executed (write containment); all behavioral claims cite the packet's own recorded outputs. 009's findings are cited as mechanism witnesses, not re-derived.

## Findings

### LF1 — `runtime/lib/freshness.ts` resolved its script root and DB path under the old name → `Advisor: stale` after a cold start
- **What:** After the rename, the freshness module — the code that decides whether the advisor's installed bits are current — looked for its root and database under the pre-rename name; the daemon answered `Advisor: stale` from a cold start.
- **Evidence:** 006/implementation-summary.md, §Verification → "Defects this phase fixed on the way", row 1: "`lib/freshness.ts` resolved its script root and DB path under the old name | The daemon answered `Advisor: stale` after a cold start; the fix restored `live`".
- **Mechanism that kept it hidden (two, stacked):**
  1. *Warm process masks the disk.* A daemon started earlier holds its resolutions in memory; only a cold start re-derives them. 006: "Two failures surfaced only because the daemon was stopped before the hook ran, which is the cold path real sessions hit first" (006/implementation-summary.md:83). In the MCP-primary era the CLI's cold start was the rare path, so nobody continuously exercised the one probe that catches this class.
  2. *Graceful degradation answers with exit 0.* D9 made "a degraded answer acceptable; no answer is a failure" (goal.md, decision D9). A stale advisor still answers, renders `Advisor: stale`, and exits successfully — so every exit-code-verified check stays green while the answer is wrong. 008 learned this and institutionalized "a command whose output and exit status were read, never an exit code alone" (008/implementation-summary.md:84-85).
- **Aftermath (the lesson stuck):** the degraded marker became documented, live instructions: "the CLI runs it when the daemon is unreachable, the answer is marked degraded, and the brief renders that as `Advisor: stale`" (AGENTS.md:101, root framework, live instruction surface — verified by `rg` this iteration, 1 hit). 008 added "Brief arrives in three daemon states | PASS. Warm and cold both render a route; unreachable renders a degraded line" (008/implementation-summary.md:115) — the cold path became a standing criterion only *after* it had bitten.

### LF2 — `.opencode/bin/skill-advisor.cjs` used a split `path.join` form and "would not have resolved its own dist"
- **What:** The single front door's own entry point computed its dist path from string fragments spread across lines.
- **Evidence:** 006/implementation-summary.md, defects table row 2: "The CLI entry point used a split `path.join` form | `.opencode/bin/skill-advisor.cjs` would not have resolved its own dist"; and the analysis: "The old name survived in forms no path-shaped search finds: string elements split across lines in a `path.join` call, and bare `'mcp-server'` literals. Two of those were the CLI's own entry point and the module that computes the freshness signature, and each one alone was enough to break the front door" (006/implementation-summary.md:60-62).
- **Mechanism:** *the reference was true until it wasn't.* While the directory was still `mcp-server/`, the fragment-join resolved correctly; the failure existed only in waiting. compounded by (a) invisibility to path-shaped searches — the tool every sweep in this repository reaches for (007's residue hunt, 009's `rg`-based evidence) cannot see a literal split across lines; (b) the fallback era rarely executed the entry point at all. It surfaced exactly when the rename (006) broke the constant, i.e. when the CLI was already the only door.

### LF3 — the spec-kit shim printed `TARGET_UNRESOLVED`; its compiled `dist` still held the old path
- **What:** The hook shim in the consumed package kept resolving the retired location from its compiled output.
- **Evidence:** 006/implementation-summary.md, defects table row 3: "`system-spec-kit` shim printed `TARGET_UNRESOLVED` | Its compiled `dist` still held the old path; a rebuild was required"; plus the decision note: "Rebuild `system-spec-kit` after editing its hook source — the hook runs from `dist`, so the source edit alone had no effect" (006/implementation-summary.md, §Key Decisions) and "Delete the pre-rename `dist/` and rebuild clean — a surviving `dist/mcp-server/` would keep a missed reference working, and the failure would only appear after a later clean build" (006/implementation-summary.md:99).
- **Mechanism:** *a duplicated compiled tree makes wrong references succeed.* Two masking directions, both dormant while the MCP transport answered: (1) edits to source appear to work because the OLD dist still serves the old, working code — the edit is a silent no-op; (2) missed references keep resolving because the stale dist still exists. Both only stop masking when somebody rebuilds clean — an event the MCP-primary, daemon-forever-warm world postponed indefinitely, and the CLI-primary world forces.

### LF4 — the exit-taxonomy smoke's orphaned case: the lookup table narrowed, the case list did not → `node undefined`, exit 1 instead of 64
- **What:** The smoke test that guards the CLI's exit taxonomy (the contract 003 froze — see LF4b) carried a case for a shim the lookup table no longer defined; `spawnSync` ran `node undefined` and exited 1 instead of the contracted 64.
- **Evidence:** 006/implementation-summary.md, §Known Limitations, item 1: "`cli-exit-taxonomy-smoke.cjs` fails one of four cases. The `SHIMS` map defines only `skill-advisor`, while a case still asks for `shim: 'code-index'`, so `spawnSync` runs `node undefined` and exits 1 instead of 64"; closed later by deletion: "Exit-taxonomy smoke | PASS. 3/3, after removing a case that named a shim deleted from the lookup table" (008/implementation-summary.md:119).
- **Mechanism:** *the lookup table was narrowed when the shim set collapsed to the one front door; the asserting case survived it.* While the MCP transport existed, the shim surface was wider (009-F002's "dual-stack" framing, see iteration 2) and the case was true; the collapse (D1, "delete, do not deprecate") stranded the case. Surfaced only because 006 — the first phase to exercise the front door as the primary — ran the smoke. The packet's resolution precedent: retire the case (D1's spirit — delete, don't deprecate), don't resurrect the shim.
- **LF4b — the contract this smoke guards:** 003/parity/verdict.md, §2: "Ten cases, every one of them an error path returning exit 64... The CLI is a process: it must map a failure onto an exit code and print a machine-readable error to stderr. MCP returns a protocol error object... **Allowlisted, with the exit taxonomy as the contract.** What must hold after the transport goes is that the CLI's error behavior stays what it is today, which the taxonomy tests cover." — the taxonomy was consciously pre-frozen as the carry-over contract while the CLI was still secondary.

### LF5 (cross-cutting, answers "why these stayed latent") — the verification class of the fallback era structurally excluded the failure class that surfaced
- **What:** Every verification the packet ran while the CLI was a fallback shared three properties: it judged payloads, not lifecycles; it ran against a *live daemon*; and it judged process results, not outputs.
- **Evidence:** 003/parity/verdict.md, epigraph: "22 frozen cases across all nine commands, run against the live daemon with mutating cases confined to an isolated database copy" — warm by construction; the cold start, the on-disk freshness derivation, and the shim's dist resolution are outside a payload-parity harness. 008/implementation-summary.md:84-85 ("output and exit status were read, never an exit code alone"), :98 ("Re-measure rather than cite the phase that first proved it — a claim proven in phase 3 says nothing about the tree after phases 5 through 7 moved it"), :100/:118 (baseline before regression: "all 5 fail identically on the pre-change baseline, which fails 8") — the final phase had to *add* these disciplines because the earlier phases did not have them.
- **Mechanism:** *category, not negligence.* LF1–LF3 are lifecycle/environment failures (cold start, on-disk resolution, compiled-vs-source); the fallback-era harness was a payload/behavior harness. A harness member cannot catch a non-member. The failures surfaced "solely because it became the primary path" in the precise sense that becoming primary changed which verification class ran (006's cold-start probes, 008's three-daemon-states criterion) — the packet only gained the ability to see them when it lost the ability to avoid them.

## Questions Answered

- **KQ1: ANSWERED.** Five failures, each named at its file, each with its mechanism: LF1 freshness.ts (warm-masks-disk + exit-0 degradation), LF2 skill-advisor.cjs (true-until-renamed + search-invisible), LF3 spec-kit shim (dist-duality masks both edits and misses), LF4 exit-taxonomy smoke's orphaned case (narrowed table, stranded case), LF5 the structural mechanism (payload-parity-against-warm-daemon could not see lifecycle failures). A factor across LF1–LF3: D9's graceful degradation (by design) makes a *wrong* answer succeed, which hides it from exit-status gates.

## Questions Remaining

- KQ2 (iteration 2): residue classes beyond obvious name references; which class the 007 sweep missed. Already collected: 008:117 ("87 live files at first measurement, now zero; 24 historical files keep the old name by design"), 009-F001 (ENV-REFERENCE claims no committed config carries), 004's unfilled record.
- KQ3 (iteration 3), KQ4 (iteration 4).
- Open: the identities of the 5 inherited suite failures (008:118 counts them, names none) — recorded as 008's omission, disposed in 008's own baseline discipline; the launcher-bootstrap trust-default test's current verdict (asserts source, not registration — 009-F001's divergence) — resolved in iteration 2 if the residue taxonomy needs it.

## SCOPE VIOLATIONS

None. All reads; writes confined to this lineage. 009's findings were read as witnesses (its report's registry), its workstreams not re-derived; 010/011 research outputs untouched.

## Next Focus

Iteration 2 — KQ2: residue taxonomy. Classify the removal's leftovers beyond name references, using: 008:117's 87→0/24-historical split, 009's F001/F002/F005/F007/F008 (docs asserting dead mechanisms, registration-format assumptions, retired gitignore, retired playbook steps), 006's 253-untouched-docs decision + 18,966-line unregenerated corpus (deliberate, recorded residue), 004's unfilled record, and the trust-default assertion mismatch. Then: which class had no sweep.

## Ruled Out (dead ends)

- Re-deriving 009's defect hunt: deliberately not repeated; 009's findings cited only as witnesses where they explain a latent mechanism (F001, F002, F006, F007, F008 queued for iteration 2).
- Executing the advisor/daemon/tests to "verify" behavior: banned by containment; the packet's own recorded outputs and exit statuses (006's verification table, 008:115-119) are the citable evidence, which also honors the charter's read-the-output rule at second hand.

## Negative knowledge

- 003's parity harness verdict: 15 of 22 cases differ, ALL inside two allowlisted classes (error envelope; volatile fields) — parity was *false* in exactly the ways 003 predicted and allowlisted. Any future study of "the CLI diverged" should start from the allowlist, not from the diff.
