# Iteration 1 — Gate 1 parity across runtimes

- **Lineage:** glm-5-3-flash-ripgrep-search-r3 · **Angle 1 of 5** · TS receipts: 10:04:52Z (probe) → 10:21:39Z (T2, last clock before this record)
- **Question:** does the Gate 1 lookup instruction survive outside the root document — and does the command each instruction names actually resolve against `lookup-trigger-index.mjs`?
- **Method:** 1 instruction-side grep sweep (8 files), 4 reads (root instruction via grep receipt, `.mjs` full, `REPO RULES.md`, `.cursor/rules/skill-routing.md`), 3 resolution checks (ls), 1 line-anchor grep. 7 evidence calls + 4 record writes = 11 executed; 2 earlier calls lost to the harness dispatch wedge (process notes).

## Findings (2)

| ID | Claim (path:line) | Actual (evidence) | Severity | Recommendation |
|----|-------------------|-------------------|----------|----------------|
| R3-1.1 | `.codex/AGENTS.md:9-12` — the only instruction content in the Codex-side doc is four fenced `sh` commands, each hard-coding the absolute workstation path `/Users/michelkerkmeester/Library/Application Support/node-terminal/context-links/context.sh` | The target exists on this machine only: `ls -la` receipt `-rwxr-xr-x 1 michelkerkmeester staff 4236 Aug 18 15:00 /Users/.../node-terminal/context-links/context.sh`. A checked-in instruction whose four paths resolve solely where that user+path exist | P2 | document (state the assumed environment) or compute the path at invocation time |
| R3-1.2 | Dispatched expectation: Gate 1 lookup instructions should exist at `AGENTS.md`, `CLAUDE.md`, `REPO RULES.md`, `.codex/AGENTS.md or its equivalent`, `.cursor/rules or its equivalent`, `.pi/AGENTS.md or its equivalent`, `.devin/AGENTS.md or its equivalent` | Survey + grep receipts: `.pi/AGENTS.md` MISSING, `.devin/AGENTS.md` MISSING; zero `trigger-index`/`lookup-trigger`/`trigger index` mentions in `REPO RULES.md`, `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md`, `.cursor/rules/sk-vision.md`, `.pi/PLUGINS.md`, `.pi/SYNC.md`, `.devin/SYNC.md`. The entire retrieval instruction surface is ONE file (`AGENTS.md`, which `CLAUDE.md` symlinks to); no runtime-specific equivalent exists for the four non-root runtimes the angle names | P2 | document (record the single-surface decision) or add one pointer line to the `.pi`/`.devin` instruction layers |

## Verified as correct (cited; no row)

1. **The instruction's command resolves exactly.** `AGENTS.md:83` = `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"` (byte-identical at `CLAUDE.md:83` via symlink). The script exists at that path; `parseArgs` (`.mjs:228`) accepts `--json` (`.mjs:235-237`), treats everything after a bare `--` as literal prompt (`.mjs:244`), joins positional prompt parts (`.mjs:276`), rejects unknown `--` flags and empty prompts with exit 2 (`.mjs:23,273`). Both the instruction's flags-before-`--` order and the usage line's prompt-first order (`.mjs:17-19`) parse to the same invocation.
2. **"Reads the committed index and needs no daemon" (AGENTS.md:83) is true at source.** `loadIndex` is `fs.readFileSync` + `JSON.parse` + fail-closed shape assert of `DEFAULT_INDEX_PATH` (`.mjs:47` → `.../runtime/data/trigger-index.json`; present, 3,856,761 bytes, mtime 2026-09-07 10:34 local). Imports: `node:crypto/fs/path/process/url` + `./lib/artifact.mjs` + `./lib/normalize.mjs` — no daemon, no child process; the header itself says "the committed trigger index" (`.mjs:5`). (Commitment of that path is inferred, not git-verified — git is out of scope by hard limit; the dispatch states only the compiled `dist/` dirs are untracked.)
3. **Exit contract 0/1/2** documented at `.mjs:23` — the "Surface relevant context" step can distinguish no-candidates (1) from unreadable index (2). The instruction is silent on this, which is fine: it promises surfacing, not triage.
4. **`--limit 0` = unlimited** documented at `.mjs:17-21` — the census's P2 fix (round one) still holds.
5. **`CLAUDE.md -> AGENTS.md`** (`ls -la` receipt, 9 bytes, target exists) — census §3's "already zero-cost" reason verified; the instruction cannot drift between the two root docs. Not re-reported: the census already recorded it.
6. **`REPO RULES.md` (91 lines) correctly carries no retrieval duty** — it is a pure router whose scope section (§4 "Out") deliberately excludes mechanics; census §3's reasoning (per-prompt duty cannot live behind the once-per-session Gate 5) holds. Not re-reported.
7. **`.cursor/rules/skill-routing.md` (18 lines)** — routing pointers only, self-described as "static session context... not a substitute for that brief"; no retrieval duty, consistent with the census-N7 recorded design (rule documents are Gate-5-loaded, not Gate-1-retrieved). `.cursor/rules/sk-vision.md` (23 lines) is vision-only. Not re-reported.
8. **repo-rules/ = 9 posture rule files, none about retrieval** — confirms census §3's footprint claim from the file side.

## Census cross-check (read once, this iteration)

- L5 (Gate 1 has no mechanical executor; hook table = manual fallback): design, Dropped→holds. Not re-reported.
- N7 (rule docs Gate-5-loaded, not Gate-1-retrieved; §9 gained the row): the reason I did NOT file "no lookup instruction in `.cursor/rules`/`REPO RULES.md`" as a defect. Not re-reported.
- §3 (symlink + five-line root footprint): verified, not re-reported.
- `--limit 0` P2 fix: verified in place at `.mjs:17-21`. Not re-reported.
- Both iteration-1 findings are NEW (the instruction-side layer beyond the root docs was never censused).

## What the angle did NOT read (call cap)

`.codex/AGENTS.md:13-122` (grep-verified zero retrieval mentions, but prose beyond the fenced block unseen); the four nodeterm subcommand flags' support in `context.sh` (Library/ read allowed but outside this angle's 8-instruction-file cap); `.cursor/agents/*.md` and the unseen tail of `.cursor/` (the `find | head -12` cut entries after `design.md`); `.pi/` and `.devin/` beyond the top-level listing and grep.

## Open questions

1. This dispatch's `project_instructions` block (AGENTS.md) arrived EMPTY in the prompt, while the file holds 506 lines — pi-harness integration artifact or intended? (Not verifiable from inside this session; needs a probe from a second session.)
2. Is the `.cursor` `beforeSubmitPrompt` advisor registration still registered-but-dormant under the CURRENT CLI build (self-reported at `.cursor/rules/skill-routing.md:16-18`)? No adapter file surfaced at depth ≤2; locus of registration unidentified within the call cap.
3. Do the four `context.sh` subcommands (`list/summary/transcript/terminal`, `.codex/AGENTS.md:9-12`) resolve? The script exists; its flag surface was not opened.

## Process notes

- Harness wedge: two bash dispatches rejected with "Pi dispatch denied: the command does not prove one direct executor" (both used `mkdir`/`printf`/redirect/multi-statement forms; the read-only `cd/echo/grep/find/ls/wc/date` idiom passes). Recovered by: read-only bash + `write`-tool full-rewrites for the accumulating state surfaces. 2 calls lost, logged.
- `createdAt: 2026-09-07T11:35:00Z` in `deep-research-config.json` mirrors the lineage dir's harness-minted ctime in LOCAL clock (11:35 +02:00 = 09:35Z); the 10:04/10:21 receipts are the true UTC. Cosmetic, own-metadata; correction declined to conserve the call cap.

## What Worked / What Failed / Next Focus

- **Worked:** instruction-side coverage in ONE grep sweep; the single `.mjs` read settled the whole interface question; census-read-once discipline caught 2 would-be duplicate rows (L5, symlink) before they were written.
- **Failed:** nothing analytical; 2 harness-dispatch retries.
- **Next Focus (Iteration 2):** the doctor retrieval target — for each check `doctor-speckit-retrieval.yaml` declares, read the artifact it names under `fixtures/` or `runtime/data/` and decide whether the check reads a real, independently-derivable value or a self-referential one; a check that would pass on a stale or absent artifact is a finding. Seeds: `AGENTS.md:477` promises `/doctor speckit-retrieval` "reports a pair one run did not produce"; census L1/L6/N5 record the 006/013 fixes (committed-pair signal, phraseQuality screen) as DONE — those fixes are not to be re-reported; the question is whether their checks read real values.
