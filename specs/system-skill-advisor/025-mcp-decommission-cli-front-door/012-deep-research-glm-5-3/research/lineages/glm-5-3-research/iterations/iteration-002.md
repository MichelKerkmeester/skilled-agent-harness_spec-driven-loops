# Iteration 002 — KQ2: Residue classes beyond obvious name references

**Focus:** What classes of residue a transport removal leaves beyond obvious "MCP" name references, grounded in artifacts present in this packet; which class the existing sweep missed; which historical/live bucket each hit occupies.
**Status:** complete · **newInfoRatio:** 0.75
**Novelty justification (1 sentence):** 007/008 classified andBucketed surviving *names* (their own records show the method: 007:85, 008/AC:92), but no packet record had named the residue classes that a grep→classify→bucket sweep cannot see at all — mechanism-claims (R4), departed coverage (R5), unfilled records (R6), waived derivatives (R7) — nor shown that the packet's own counts (nine required corrections vs an eight-finding registry) disagree.

## Actions Taken

1. Read 009's remediation record (009/implementation-summary.md) — learned the loop's verdict ("nine required corrections, eight advisories") and that its next_safe_action at close was still "Close the nine required findings and re-run the loop".
2. Read 008/acceptance-criteria.md closure statement (AC-007's 87→0/24-historical, the consciously-left residue sets) and 007/implementation-summary.md's method and counts (grep→classify→edit; 13→0, 115→12, 452→193, 248→85; the deliberate-survivor taxonomy).
3. Verified TODAY's state of the disputed surfaces: ENV-REFERENCE.md:366 (now cites the launcher), doctor-mcp-debug.yaml's invariant and server table (now "(code-mode)", two rows, no advisor row), tests/compat/ contents (four suites, no bridge) vs its README's trigger-phrase list, and the dedicated doctor-skill-advisor.yaml (5 references to the CLI/daemon; rg exit 0).
4. Read the 009 report's closure appendix: the prior nine (F001–F009 of the earlier generation), the three promotions (prior F010/F012/F015 → this F001/F002/F003), and the fix-echo note.

## Findings — the residue taxonomy

### R1 — Surface-name residue in live authored prose (the class everyone photographs)
- **Artifact:** 008:117 — "87 live files at first measurement, now zero; 24 historical files keep the old name by design"; the criterion (008/AC-007): "Given every live instruction surface, When searched for the retired transport or directory, Then none presents the advisor as an MCP server".
- **Bucket:** LIVE — fixed. **Swept:** yes, by 007+008; this is the only class the existing sweep fully owned. 008/AC closure: "closing it took a sweep, a regenerated trigger index and a hand-corrected allowlist".

### R2 — Surface-name residue kept historically (the bucket the charter's rule protects)
- **Artifacts:** the 24 historical files (008:117); 007:132 — 12 remaining "MCP server" lines, "every one classified... none describes the advisor as currently shipping an MCP server"; 007:149's survivor taxonomy — trigger-phrase aliases (kept as search aliases), negative statements ("No MCP transport ships"), retained path names, unrelated MCP skills, code identifiers, appended run records quoting pre-rewrite text; the dated benchmark 008/latency-delta.md (2 `mcp` case-insensitive hits — a dated report, historical by the charter's own rule); frozen fixtures — 007:149 names `runtime/tests/parity/cli-vs-mcp-parity.cjs`.
- **Bucket:** HISTORICAL — kept by design. **Swept:** yes — classified, not erased (007:85: "authored prose was rewritten, appended evidence sections and decision records were left alone, and a phrase that belonged to a different MCP server was left untouched").

### R3 — Operator-frozen names (a disposition 007's trichotomy did not have)
- **Artifact:** 008/AC closure: "Left out consciously: the P2 naming residue in the plugin's timeout variable, because it is operator-set and renaming it would change operator-visible behaviour that this packet's second decision [D2: preservation is the bar] forbids"; plus the trigger-alias residuals (007:149 — renaming would break searches).
- **Bucket:** LIVE-NAME, FROZEN CONTRACT. **Swept:** classified by 008, but the *bucket* had to be invented at 008 — 007's classification offered only rewrite | leave-evidence | leave-other-server (007:85). A third disposition — "operator-set, therefore untouchable" — is neither.

### R4 — Mechanism-claim residue (the words are right; the referent is gone)
- **Artifact:** 009-F001 (carried from prior-F010): "ENV-REFERENCE.md:313 (`SPECKIT_ADVISOR_DOC_TRIGGERS` 'pinned true' in three configs), :366 (`SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` 'set in the committed MCP registrations'); both claims fail `rg` over the five configs" — the sweep had "cleared the env reference" (007:167) yet the *claims* survived, because those lines' role is to say WHO SUPPLIES WHAT, and the suppliers (the registrations) were deleted by 005 without any name in the lines changing. TODAY, :366 reads "Set in the advisor launcher's repo defaults" — repaired by 009's workstream, not the residue sweep (verified this iteration, `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` sed 366). Its clause "for native MCP surfaces whose clients send no `_meta`" survives inside a live instruction; since D1 keeps the framing ("JSON-RPC framing and `initialize` stay: the socket bridge parses them", goal.md D1) the clause is probably still true of framing-clients, but this study did not read the trust logic — labeled hypothesis, not verdict.
- **Test-side mirror:** `runtime/tests/launcher-bootstrap.vitest.ts:107-119` asserts the *source* mechanism ("passes an explicit daemon trust default through to the advisor child env"; expects `advisor-server.ts` to contain `process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT`) and stayed GREEN while the *documented* supplier (the registrations) died — a green test asserting a mechanism that is no longer the documented one.
- **Bucket:** LIVE-TRUTH. **Swept:** no — the residue sweep verifies names; a claim needs its referent checked (009's defect hunt, whose evidence is literally "both claims fail `rg` over the five configs").

### R5 — Check-side residue: silent coverage narrowing (the absence class)
- **Artifacts:** 009-F005: the debug report's invariant said the advisor was covered while "mcp-doctor.sh has no advisor check"; TODAY the invariant reads "all supported servers (code-mode)" (doctor-mcp-debug.yaml:25-29, verified) and the report's server table lists "System Code Graph" and "Code Mode" — no advisor row (verified, :242-246) — while a dedicated `doctor/assets/doctor-skill-advisor.yaml` references `skill-advisor.cjs`/`daemon` 5 times (rg, exit 0). Coverage did not merely vanish: it moved — whether that asset predates the decommission or was the 009 remediation's "repoint" is unknowable without git (banned here; labeled). Companion: `runtime/tests/compat/README.md:6` still advertises "advisor plugin bridge tests" in its trigger_phrases while the suites are retired (my `ls`: daemon-probe, python-compat, redirect-metadata, shim; 009-F006: "tests/compat/ has no bridge suites") — an orphaned trigger: not rewritten prose, not a deliberate alias (nothing answers it), not historical (it is live machine-read metadata).
- **Bucket:** LIVE. **Swept:** no — and *by construction*: a presence-sweep (grep→classify→bucket) can see remaining names (R1–R3) but cannot see departed coverage or departed referents. Absence has no grep. Proof it slips even a second, adversarial net: 009's own hunt needed its 4th and 5th iterations to find these — "F005/F006/F007 iteration 4; F008 iteration 5" (009-report:94).
- **This is the class the existing sweep missed.** 008's criterion is present-tense existence ("none *presents* the advisor as an MCP server", AC-007) — it verifies what remains, never what *stopped being checked*.

### R6 — Record-level residue (the packet's own簿簿 bookkeeping)
- **Artifacts:** 004-caller-rewire/implementation-summary.md is an unfilled template end-to-end — "No implementation artifact exists yet" (:55), placeholder How-It-Was-Delivered ("[How was this tested, verified and shipped?...]"), placeholder Decisions/Verification/Limitations, and `004/description.json:3` still carries the template's own description ("Open with a hook: what changed and why it matters. One paragraph, impact first.") — template text as machine-read metadata, feeding the advisor's own retrieval. 009-F003 caught 009's OWN scaffolds and the parent's phase map, but no workstream (WS-1..WS-4) mentions 004's records. Plus the arithmetic: 009/implementation-summary.md:3 says "nine required corrections, eight advisories" while the report's active registry holds eight (F001–F008) and its appendix counts a *different* nine (the prior generation's F001–F009) — one required correction has no F-number. Labeled OPEN; hypothesis: it is counted outside the finding registry; this study did not locate it.
- **Bucket:** LIVE (packet-record truth). **Swept:** no.

### R7 — Derived-artifact residue, waived with a recorded blast radius
- **Artifacts:** 006:139 — "Deferred by decision. The retrieval corpus keeps 47 stale advisor doc paths. The fix is a generator run that also rewrites 18,966 unrelated lines and shifts advisor scores, so it needs its own task and review"; 006:95 — the four-files-as-a-pair constraint; 008/AC:92 — the closing needed "a regenerated trigger index and a hand-corrected allowlist"; 009-report:16 — "the trigger index and its fixtures were regenerated as one set".
- **Bucket:** LIVE-but-WAIVED — the packet's most honest residue: recorded three times (limitation, frontmatter open-question, decision rationale) rather than silently shipped. Whether the 47 doc-paths themselves cleared when the index+fixtures were regenerated "as one set" — probably yes (that reads like 006:95's four-file set), but the 47-count's post-state is uncited here; 010/011 unread per charter. Labeled hypothesis.
- **Swept:** deliberately not (006:95), then partially discharged by the 009-remediation's regeneration.

### Bonus — fix-echo residue: the repair's own diff needs the next scan
- 009-report:16: "The regression scan still found residue on three live surfaces, **one of them inside the repair's own `.gitignore` edit** (F007), plus a live playbook instruction (F008)." — 009-F007: `.gitignore:135` ignores `.opencode/skills/system-skill-advisor/mcp_server/` (underscore) while the package is `runtime/`. Residue begets residue: a remediation's diff is itself a residue candidate.

## Questions Answered

- **KQ2: ANSWERED.** Seven classes beyond obvious name references (R1–R7 plus the fix-echo), each grounded in a present artifact, each bucketed; the class the existing sweep missed **by construction** is R5 — silent coverage narrowing — because 007/008's machinery (grep→classify→bucket; a presence criterion) cannot see that a subject stopped being checked; R6 (the packet's own records) was missed by everyone.

## Questions Remaining

- KQ3 (iteration 3), KQ4 (iteration 4).
- Carried (see 11A): doctor-asset provenance; the 47-path post-state; the ninth required correction's identity; whether any post-009 workstream owns R4–R7.

## SCOPE VIOLATIONS

None. Reads only; writes inside the lineage; 010/011 research outputs untouched (independence preserved); no packet document modified.

## Next Focus

Iteration 3 — KQ3: the cost-ordered migration checklist. Ground the ordering in the packet's own cost statements: 006:62 ("each one alone was enough to break the front door") for the top of the order; 008:91-96's "the residue criterion carried this packet" for the sweep's priority; 008:98's re-measure rule; 006:95's blast-radius discipline for the waiver; D6's load-bearing order (prove, rewire, delete, rename, retrofit) as the scaffold the checklist must subdivide.

## Negative knowledge

- 007's completion bar was measured, not asserted (007:77: `mcp__system_skill_advisor__` 13→0, "MCP server" 115→12, case-insensitive `mcp` 452→193, strong transport phrases 248→85, remainder classified) — and yet F005/F006/F007/F008 survived it: measured counts of *present* things do notcount *departed* things. A residue criterion needs an absence dimension, and 008's presence-only criterion (AC-007) is the recorded demonstration.
