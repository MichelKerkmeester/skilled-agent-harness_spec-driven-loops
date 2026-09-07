# Iteration 001 — Remediation verification, doc-side residue

**Focus:** Verify every 006 document-side fix landed completely: search.md recipe parity (REQ-002), five-label matchClass vocabulary everywhere (REQ-001), concept-lane removal (REQ-001), retrieval README paths and counts (REQ-006), doctor wording (REQ-005). A fix that left one document line behind is a finding.

**Method:** Full read of `search-presentation.txt`, `search.md`, `retrieval-conventions.md`, `retrieval/README.md`, `ops/README.md`, `lib/README.md`; `rg` residue sweeps for `concept lane` / `embedded index` / `three lanes` / old retrofit path.

## Findings

### V1 — PRESENTATION §3 STILL CARRIES THE OLD THREE-LABEL VOCABULARY (fix incomplete, P1)

- **Path:line:** `.opencode/commands/speckit/assets/search-presentation.txt:106` (vs `:60`, `:92`; code `runtime/cli/retrieval/lib/rg-lane.mjs:427`, `lib/normalize.mjs:42-47`)
- **Claimed vs actual:** The 006 fix made "both documents now list the five labels in rank order" (confirmed-findings.md P2 row). Actual: §2's trigger-lane mapping (line 60) lists `exact`, `phrase-containment`, `query-containment`, `token-overlap`, `partial` — but §3's free-text-lane mapping (line 106) still reads `<matchClass>` — `exact`, `containment`, or `token-coverage`, a vocabulary no code path emits. The filled example (line 92) renders `body  containment`. `rg-lane.mjs:427` ranks exactly the five labels; `scorePhrase` (normalize.mjs:131-150) returns only those. `retrieval-conventions.md:199` says "The lookup emits these labels verbatim, and no document may rename them."
- **Severity:** P1 — the presentation asset is the display source of truth for `/speckit:search` (§2 OWNED ASSETS of search.md:34-35), and a caller reading §3's field mapping will emit `containment` / `token-coverage`, labels that never reach the UI.
- **Recommendation:** One line fix: replace the line-106 mapping with the five labels verbatim and re-render the example row's class.

### V2 — PRESENTATION §3 EVIDENCE-FIELD MAPPING DOESN'T MATCH THE WRAPPER'S EMISSION (P1)

- **Path:line:** `.opencode/commands/speckit/assets/search-presentation.txt:105`; code `runtime/cli/retrieval/lib/rg-lane.mjs:69-72, 391-394`
- **Claimed vs actual:** §3 documents `<field>` — `trigger_phrases`, `title`, `description`, `anchor`, or `body`. The wrapper's `rankMatches` emits exactly `body`, `trigger_phrases`, `title-or-description`, `anchor-marker` (EVIDENCE_FIELDS at rg-lane.mjs:69-72; assignments at :391-394). Two documented names (`title`, `description` as separate values; `anchor` alone) never appear, and two emitted names (`title-or-description`, `anchor-marker`) are undocumented. Conventions §5 (retrieval-conventions.md:190-197 step 1) describes the tuple as "title or description, then anchor marker" — the wrapper's combined spelling is the code reality.
- **Severity:** P1 — same §3 block as V1; a caller following the mapping will label rows with field names the tool never produced.
- **Recommendation:** Same editing pass as V1: document `title-or-description` and `anchor-marker` as the emitted values (or split the wrapper's emission — but code was verified correct in round one; adapt the doc).

### V3 — RETRIEVAL README ARCHITECTURE DIAGRAM STILL DRAWS RETROFIT-CONVENTION INSIDE `scripts/retrieval` (P2)

- **Path:line:** `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:49` (box) and `:56` ("All six scripts"); correct statement at `:74`
- **Claimed vs actual:** 006 moved `retrofit-convention.mjs` to `runtime/cli/ops/` and "both tests and every document follow it" (implementation-summary). Actual: §2's architecture panel (header `scripts/retrieval`) still draws the `retrofit-convention.mjs ───▶ lib/grep-convention.mjs` box (line 49) and counts it: "All six scripts import shared primitives from lib/" (line 56). §3's directory tree (lines 66-74) correctly lists five retrieval scripts plus `lib/` + `fixtures/` and says the pipeline "lives in `../ops/`". The diagram contradicts the tree it backs.
- **Severity:** P2 — cosmetic, but it is exactly the "one document line behind" class: the same file both shows and contradicts the move.
- **Recommendation:** Remove the retrofit box from the §2 panel, change "six" to "five", and add a one-line pointer to `../ops/retrofit-convention.mjs` in the §2 caption.

### V4 — THREE DIFFERENT RECIPE COUNTS ACROSS THE DOCS (P2, first evidence)

- **Path:line:** `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md` §1 ("the three documented ripgrep recipes (structured, path-only, count)") and §4 table; `references/retrieval/retrieval-conventions.md:308` ("The Section 2 recipes behind one front door"); code `runtime/cli/retrieval/rg-wrapper.mjs` RECIPES (structured|path|count)
- **Claimed vs actual:** Conventions §2 documents FOUR recipes (2.1 structured, 2.2 path-only, 2.3 count, 2.4 context and anchor). The wrapper exposes three (RECIPES constant). README says "three documented"; conventions §10 says "the Section 2 recipes" (all of them). search.md:82-84 routes the 2.4 recipe directly (bypassing the wrapper) — so the wrapper covering 3 of 4 is defensible, but no document states that split.
- **Severity:** P2 — doc-count drift; a reader of conventions §10 will try `rg-wrapper.mjs context` and get "unknown recipe".
- **Recommendation:** conventions §10 → "the three non-context Section 2 recipes behind one front door (see the router for 2.4)"; README already says three and is fine once §10 is aligned.

## Ruled out this pass

- `concept lane` / `embedded index` / `three lanes` residue: zero hits in conventions, search.md, presentation, doctor YAML (the L3 fix is complete — REQ-001 lane part verified).
- Old retrofit path `retrieval/retrofit-convention` outside specs: zero hits (REQ-006 verified).

## Open questions

1. Does any OTHER file under `.opencode/commands/` or `references/` still name the five free-text classes differently — or was the presentation §3 the only survivor? (Continues into iteration 2 census.)
