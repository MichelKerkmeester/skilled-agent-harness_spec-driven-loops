# Iteration 001 — v4 Doc Freshness

**Mode:** research · **Executor:** native (`@deep-research` LEAF) · **Iteration:** 1 of 10 · **Date:** 2026-09-19
**HEAD:** `31f60000c2` ("fix(migration): reconcile drift across runtime manifests, invocation paths, and packet metadata")
**Evidence hygiene:** the changelog file itself is committed and unmodified; the working tree carries only in-flight changes to this packet (`graph-metadata.json`, `spec.md` modified; `042-v4-doc-freshness/` untracked).

## Focus

Q1 — Which path, command or binary references in `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` point at roots that no longer exist, and which remain true through a compatibility alias or symlink? Sub-surface: `.opencode` vs `.skilled` roots, compatibility aliases, and the advisor front door.

## Actions Taken

1. **Changelog root-reference inventory.** Full-file grep for root names (`\.opencode|\.skilled|\.hermes|\.pi/|\.cursor|\.claude`) across all 600 lines, plus a second grep for command/binary tokens (`skill-advisor|spec-memory|memory_search|memory_save|advisor_recommend|list-tools|.cjs|.sh`). Read L1–161 for section context.
2. **Live layout census + resolution tests.** Root, `.skilled/` and `.opencode/` listings; six `test -e` probes on changelog-named `.opencode` paths; `.skilled/skills/system-spec-kit/` top-level check for the retired `scripts/` and `mcp-server/`.
3. **Tracking + alias semantics.** `git ls-files -s .opencode` (file modes), `git status --short`; read the compatibility root's tracked docs `.opencode/README.md` and `.opencode/SYNC.md`.
4. **Retirement + config checks.** Memory-trace scan of `.skilled/bin` and `.opencode/plugins`; MCP registration scan of `opencode.json`, `.claude/mcp.json`, `.cursor/mcp.json`, `.pi/mcp.json`; `open_design` scan of `.utcp_config.json`; symlink count in `.skilled/hooks`.
5. **Advisor runtime root-handling scan.** `rg` over `.skilled/skills/system-skill-advisor/runtime` for `.skilled`/`.opencode`/`outermost`.
6. **Gateway append + repair.** The first append was refused (`stable-identity-missing`, exit 1, nothing written); diagnosed the legacy upcaster (`append-mode-event.cjs` L398–446; `legacy-compatibility.ts` `hasIterationIdentity`), re-appended the record with `runId`/`sessionId`/`lineageId` = `rsr-2026-09-19T18-45-00Z` from the run's lineage config, and confirmed exit 0 with `projectionRefreshed: true` — the refreshed state log carries iteration 1 (ledger sequence 2, event `deep-research.ledger.iteration-completed`).

Tool budget: 12 planned calls — 8 evidence calls in the 5 research actions above, 4 artifact calls — plus 6 repair calls after the gateway refusal (see F7).

## Findings

**F1 (P1) — The changelog never names the canonical `.skilled` root; every path instruction uses the legacy `.opencode` spelling.**
The full-file root grep matches only `.opencode`/`.hermes` spellings (L22, L32, L72, L78, L84, L130, L146, L278, L366, L369, L537, L580, L581); not one line contains `.skilled`. The changelog draft (packet `035-v4-changelog-draft-update`) predates the source-root migration (packet `041-skilled-source-root-migration`; tree move commit `ec33385ae5` "refactor(source-root): move the authored asset tree from .opencode to .skilled"). The compatibility root's tracked docs now state the opposite naming policy: "Prefer `.skilled/` in anything you write… Repository links, documentation and new code should name `.skilled/`" and "only `.skilled/` resolves on the web" (`.opencode/README.md` §4); `SYNC.md`'s `bin` row says the alias "stays until they name `.skilled/bin`". Verdict: no reference is dead — but every path instruction points in a direction the repo itself now designates legacy, and which cannot resolve as a URL.

**F2 (P2) — No sampled `.opencode/...` reference is dead; all resolve through tracked compatibility symlinks.**
All nine `.opencode` top-level aliases (`agents`, `bin`, `changelog`, `commands`, `hooks`, `manual-testing-playbook`, `scripts`, `skills`, `specs`) are git-tracked relative symlinks (mode `120000`) into `.skilled/`, so fresh clones inherit them where symlinks are supported. Resolution probes passed: `.opencode/bin/skill-advisor.cjs`; `.opencode/specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (two-hop chain `.opencode/specs → ../.skilled/specs → ../specs`); `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh`; `.../spec/create.sh`; `.../continuity`; `.../retrieval`. The specs-move claim (L22/L72/L580) is true: top-level `specs/` exists and both old spellings chain to it. Caveats keeping this short of a clean "true": web URLs under `.opencode/` return the link-target text rather than the file (README §4); a clone without symlink support degrades the aliases to text files (SYNC §3); the `.opencode/bin` alias is explicitly temporary.

**F3 (P1) — Advisor front door: the command works only through the explicitly temporary alias; the canonical spelling moved; the MCP retirement is real.**
`node .opencode/bin/skill-advisor.cjs` (L146, L581) resolves via `.opencode/bin → ../.skilled/bin` (alias restored in `2a57cc635d` "restore the .opencode/bin alias until its callers move"). The canonical entry named by the repo is `.skilled/bin/skill-advisor.cjs` (root README.md L104–116). All four MCP configs register only `mcp-code-mode-launcher.cjs` — no advisor or spec-memory server — so L44 ("the MCP transport is retired and the CLI is the only way in") and L146 ("The advisor no longer speaks MCP") hold in the current tree. The standalone-package claim (L593) also holds: `.skilled/skills/system-skill-advisor/` and `.skilled/bin/system-skill-advisor-launcher.cjs` exist.

**F4 (P2) — Retirement claims verified absent.**
No memory-named binary in `.skilled/bin` or plugin in `.opencode/plugins` (L78, L581); `.skilled/skills/system-spec-kit/scripts` and `.../mcp-server` do not exist (L84: "the old `scripts/` and `mcp-server/` paths are gone"); the old flat `.skilled/skills/mcp-figma` is gone while `.skilled/skills/mcp-tooling/mcp-figma` exists (L537); `open_design` does not appear in `.utcp_config.json` (L581 instruction satisfied).

**F5 (P2) — Numeric drift: "102 relative symlinks" claimed vs 101 observed (L366).**
`ls -laR .skilled/hooks | rg -c '^l'` → 101 symlink entries in the hooks tree (reached through `.opencode/hooks`). Likely one hook retired or added since drafting; a per-hook diff would name it. Count method recorded for reproducibility.

**F6 (P2) — Advisor anchoring claim names `.opencode`; the runtime resolves `.skilled` first (L130).**
`runtime/skill-advisor-cli.ts:189-191` — "The source tree sits under .skilled or .opencode…"; `SOURCE_ROOT_NAMES = ['.skilled', '.opencode']`; sentinel `.skilled/skills/system-spec-kit/SKILL.md`; handlers resolve `.skilled/skills`. The behavior ("hoists state above the outermost source root") survives; the root the sentence names is outdated.

**F7 (P2) — Operational: the gateway now refuses legacy iteration records without stable identity, and the prompt-pack schema does not carry those fields.**
The first append returned `{"ok":false,"phase":"runtime","reason":"Legacy deep-research record refused: stable-identity-missing"}` (exit 1; the refusal throws before any append is attempted). `append-mode-event.cjs` L398–446 routes `type:"iteration"` rows through the legacy upcaster, whose decision path (`legacy-compatibility.ts` `hasIterationIdentity`) requires `runId`/`sessionId` plus `lineageId`/`parentSessionId`/`sessionId` on the record. Re-appended with `runId`/`sessionId`/`lineageId` = `rsr-2026-09-19T18-45-00Z` (from `deep-research-config.json` `lineage.sessionId`); the gateway accepted it (exit 0, `projectionRefreshed: true`, ledger sequence 2, warning: trusted evidence yield remains explicitly zero). Live evidence of the 049–050 admission tightening: the pack schema lags the gateway.

**Deferred detail checks (no verdict issued this iteration):**

- L580 `hvr-rules.md` location — tested spelling `.skilled/skills/sk-create-with-human-voice/references/hvr-rules.md` absent; the skill's real (likely hub-nested) location must be resolved before any verdict.
- L580 deep-loop `storage/` → `database/` — not found at the two tested spellings; needs the runtime's actual directory level.
- L15 "deliberately tolerant gate" — behavior unverified.
- `.hermes/` mirrors — `.hermes/plugins/repo-guards` verified present; the skills/agents mirror contents are unverified.

## Questions Answered

**Q1 — answered (core verdict delivered).** No changelog reference points at a root that no longer exists; every sampled `.opencode` path resolves through git-tracked compatibility symlinks. The real defect is the inverse: the changelog speaks the pre-migration root exclusively (zero `.skilled` mentions), while the post-migration naming policy is that documentation names `.skilled/` — and the `.opencode/bin` alias is explicitly temporary pending exactly this class of caller migration.

## Questions Remaining

Q2 (capability, family, mode and workflow claims vs the shipped tree), Q3 (root README claims), Q4 (post-draft work missing from the changelog narrative), Q5 (full rewrite vs targeted corrections). Carried sub-checks: the F5 per-hook diff; the four deferred detail checks above.

## Next Focus

Q2 — capability claims: the six hubs (L55), the six `/deep:*` commands (L26), the design hub's four modes (L36), sk-vision transport claims (L35), the executor roster and sign-in claims (L27–L34), `mcp-tooling` "nine modes" (L41) — the last intersects Q4, because the orca CLI packet (`a3272f5944`, `eeb149daf7`, `3bec6add68`) landed after the draft.

## SCOPE VIOLATIONS

None. All writes stayed inside `042-v4-doc-freshness/research/` plus the contract-sanctioned temp event file for the append gateway; no researched file was modified.
