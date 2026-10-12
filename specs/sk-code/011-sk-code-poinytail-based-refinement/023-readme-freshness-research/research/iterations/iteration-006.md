# Iteration 6: Q4 part 1 — Setup-Facing Related READMEs (`.skilled/bin/README.md`, the named install guides, and the `.skilled/README.md` premise)

## Focus

Q4 part 1 per the dispatch: the related READMEs that document setup — the research topic's example `.skilled/README.md`, any install or getting-started guide the root README points at, and `.skilled/bin/README.md` — checked against v4.0.0.4 and the repository. The strategy's machine-owned "Next Focus" still read "Q3 (part 3)" (stale from iteration 5, whose question the registry marks resolved); the dispatch focus was followed per the precedence rule and the strategy text is left for the reducer to refresh.

## Actions Taken

1. Read state first: config (sessionId `dr-023-readme-freshness-research-2026-10-12T14:40:22.000Z`, `progressiveSynthesis: true`, lineageMode `new`), the strategy, and the registry head; 5 iteration records on disk → this is iteration 6.
2. Listed `.skilled` (no `README.md` at its top level) and `.skilled/bin` (33 entries plus `lib/` and `tests/`).
3. Read `.skilled/bin/README.md` in full (234 lines) and diffed its §3 tree, §6 entrypoints and §7 validation against the `ls` listing and the changelog.
4. Read the heads (1-45) of the two install guides in the changelog's `**/install*.md` family: `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` (1589 lines) and `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` (440 lines).
5. Checked the root README's install-guide reference (`sed -n '174,178p' README.md`) and searched `README.md` for `skilled/README` and `spec/README` → 0 matches.
6. Verified supporting paths: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` exists; `.skilled/plugins/` holds `system-dist-freshness-guard.js`; `.skilled/vitest.config.bin.ts` exists.

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
| --- | --- | --- | --- | --- | --- |
| `.skilled/bin/README.md:63-90` | §3 DIRECTORY TREE lists `bin/`'s files (entries from `system-skill-advisor-launcher.cjs` to the closing `README.md` line) | `ls -1 .skilled/bin` shows nine files the tree omits: `agent-mirror-crosswalk.md`, `check-agent-mirror-sync.cjs`, `check-agent-mirror-sync.vitest.ts`, `compiled-route-admission.cjs`, `magicpath-utcp-exec.cjs`, `magicpath-utcp-manual.cjs`, `mcp-code-mode-launcher.cjs`, `mcp-code-mode-launcher.test.cjs`, `mirror-sync-verify.vitest.ts`; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:159] moves the agent-mirror checker to `.skilled/bin/check-agent-mirror-sync.cjs`, and the same README documents it at [SOURCE: .skilled/bin/README.md:167] | STALE | P2 | add one line to the tree, e.g. after `:80`: `+-- check-agent-mirror-sync.cjs    # Blocks agent edits that desync the runtime mirrors` |
| `.skilled/bin/README.md:172-178` | (no statement — absence) §6 describes shim usage, warm-only behavior and the exit taxonomy `0/1/64/69/75`, but never the new unknown-option refusal | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:281] names the shared `.skilled/bin` tools among the scripts that now "name the unknown option and exit with its usage code"; a full read of `.skilled/bin/README.md:1-234` found no unknown-option wording | MISSING | P2 | one clause after `:174`, e.g. "An unknown option is named and exits with the script's usage code." |
| `.skilled/bin/README.md:22,178-180` | "every shim calls `checkPackageFreshness()` from `system-spec-kit/runtime/cli/lib/dist-freshness.cjs`" … "backs … the `system-dist-freshness-guard` OpenCode plugin (`.skilled/plugins/`)" | `ls -1 .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` → path exists; `ls -1 .skilled/plugins` shows `system-dist-freshness-guard.js` (consumer wiring not re-run this iteration) | OK-VERIFIED | P2 | none |
| `.skilled/bin/README.md:149-168` | §6 ENTRYPOINTS table names each CLI and its purpose | every file named in the table appears in `ls -1 .skilled/bin` (`system-skill-advisor-launcher.cjs`, `skill-advisor.cjs`, `hf-model-server.cjs`, `worktree-*.sh`, `compiled-route*.cjs`, `check-no-spec-imports.cjs`, `check-agent-mirror-sync.cjs`, `install-codex-hooks.mjs`); the "9 tools" count at `:154` is consistent with the advisor install guide and `README.md:1592` (count not re-run this iteration) | OK-VERIFIED | P2 | none |
| `.skilled/bin/README.md:200-226` | §7 VALIDATION lists runnable commands and an expected result | targets exist: `cli-offline-smoke.cjs`, `cli-exit-taxonomy-smoke.cjs`, `compiled-route-guard.cjs`, `compiled-route-status.cjs`, `compiled-route-sync.cjs`, `check-no-spec-imports.cjs`, `tests/`, `worktree-session.sh`, `worktree-reaper.sh` (all in `ls -1 .skilled/bin`), `lib/model-server-supervision.cjs` (in `ls -1 .skilled/bin/lib`), `.skilled/vitest.config.bin.ts` | OK-VERIFIED | P2 | none |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:4,11-12` | frontmatter `version: 1.0.0.0`; the body blockquote says `**Version:** 2.0.0` | both read at `:1-14`; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:389] gives hand-written docs, "such as the install guides", frontmatter with a version (new docs start at `1.0.0.0`) — the two statements cannot both describe the document | WRONG | P2 | align the `:11` line with the frontmatter version, or label it (drop it, or name what `2.0.0` versions) |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:11-12,24-36` | "Dependencies: Node.js 24 (see Prerequisites)"; the AI-first prompt checks "a Node 24 interpreter … it does not have to be your default" | [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:46] ("name Node 24 as the one line every part accepts") | OK-VERIFIED | P2 | none |
| `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:1-4,9` | frontmatter `version: 1.0.0.0`; "It exposes nine commands: the eight public ones … plus the trusted-caller-only `skill_graph_propagate_enhances`" | read at `:1-45`; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:389]; the 8+1 split is internally consistent and the nine count matches [SOURCE: .skilled/bin/README.md:21], [SOURCE: .skilled/bin/README.md:154] and [SOURCE: README.md:1592] | OK-VERIFIED | P2 | none |

Premise check (not a table row): `.skilled/README.md` does not exist — `ls -d .skilled/README.md` returns `No such file or directory`, the `.skilled` top level holds no `README.md`, and `README.md` contains no `skilled/README` or `spec/README` reference (awk → 0 matches). The topic's example target is not a related README; recorded as a ruled-out direction.

Note: the root README's install-guide reference is [SOURCE: README.md:176] ("Code Mode needs its own server build, see the mcp-code-mode install guide."), plain text with no link; iteration 1 already recorded that row (OK-VERIFIED, optional link addition) and it is not repeated here.

## Questions Answered

None fully. Q4 part 1 is covered; Q4 also spans the hub READMEs and the remaining inventory READMEs, so it stays open.

## Questions Remaining

- Q4: the remaining related READMEs (hub READMEs for sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor, system-deep-loop, cli-pi; `.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`).
- Q5: which v4.0.0.4 user-facing changes the READMEs leave out where a reader would need them, and which statements checked out accurate — this iteration contributes five first-time verifications and one gap (row 2).

## Ruled Out

- `.skilled/README.md` as a related README to audit: the file does not exist and the root README has no reference to it (awk → 0 matches). Do not chase it in later iterations.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: none material. The dispatch focus (Q4 part 1) and the strategy's stale "Next Focus" disagreed; the dispatch won per the precedence rule and the strategy is left for the reducer.
- Contradictory evidence: the mcp-code-mode guide's two version statements (row 6) — both sides cited, classified WRONG, fix proposed; if `2.0.0` is a package version the line needs a label rather than a number change.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/bin/README.md:1-234` (full read)
- `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:1-45` (of 1589 lines)
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:1-45` (of 440 lines)
- `README.md:174-178`
- `.skilled/changelog/skilled/v4.0.0.4.md:1-390`
- Command outputs: `ls -1 .skilled` (no README.md); `ls -1 .skilled/bin` (33 entries); `ls -1 .skilled/bin/lib`; `ls -1 .skilled/plugins`; `ls -1 .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` → exists; `ls -1 .skilled/skills/*/INSTALL-GUIDE.md …` → the two guides; `wc -l` (234 / 1589 / 440); `awk '/skilled\/README|spec\/README/' README.md` → 0 matches.

## Assessment

- New information ratio: 0.69 (3 fully new findings + 5 first-time verifications at half weight = 5.5/8)
- Questions addressed: Q4 (part 1 of 2+)
- Questions answered: none

## Reflection

- What worked and why: reading `.skilled/bin/README.md` in full and diffing it against one `ls -1 .skilled/bin` turned the tree staleness into a direct subtraction; checking the changelog's version-model paragraph (line 389) against the two install-guide frontmatter blocks produced two verifications and one real internal contradiction in a single pass; folding every probe into one compound read-only command per batch kept the evidence count low while still opening every cited file.
- What did not work and why: an early `&&`-chained probe aborted at the first missing file (`.skilled/README.md`) and a blind read of that same missing file spent a call — the file-not-found path was not budgeted; state reads plus those probes pushed the iteration to 14 tool calls, above the persona's 8-11 target and the pack's 12 cap. The changelog's lines 391-452 were not re-read this iteration; iteration 1's map already covers them and they target the root README install path (Q2, resolved).
- What I would do differently: put an expected-missing path last in a `;`-separated chain (or probe it with `ls` first), and treat "target file may not exist" as a planned branch rather than a failure.

## Recommended Next Focus

Q4 part 2: the remaining Q1-inventory READMEs that document setup or the same features — `.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md` — then the hub READMEs (sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor, system-deep-loop, cli-pi) and `.skilled/bin/lib/README.md`.
