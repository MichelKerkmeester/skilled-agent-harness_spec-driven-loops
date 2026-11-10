# Iteration 022 — Code-convention misalignment sweep (final iteration)

## Focus

Final iteration at the ceiling. A misalignment sweep against the repository's code conventions — the cluster's thinnest finding type — over `.skilled/skills/system-skill-advisor/runtime`, `.skilled/hooks` and `.opencode/plugins`, non-test and test files alike. Two work items:

1. Find every code comment embedding an ephemeral label (packet/phase numbers, spec paths, ADR/REQ/task/finding ids, `Unit X`, `Phase N`, `iter NNN`), excluding the previously recorded `python-compat.vitest.ts:19`, and report each with `path:line`.
2. Check that each hook entry file carries the repository's module header block, using `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` as the reference form.

Read-only. Nothing written into the repository — the two artifacts below are the only writes.

## Actions Taken

1. `rg` over the three trees with a nine-alternative label pattern (`specs/`, `ADR-`, `REQ-`, `CHK-`, `Unit N`, `Phase N`, `iter NNN`, `f|inv|obs-iterNNN-`, `packet NNN`). First pass returned 56 matching lines but counted string literals and JSONL payloads, so a second pass was run requiring a comment marker (`//`, `#` or `*`) on the same line before the label.
2. Manual inspection of every surviving hit, and a `ls`/`find` check of the spec paths those hits name.
3. Enumerated hook entry files (88 files under `.skilled/hooks`, excluding `lib/`, `tests/`, `*.test.*`, `*.spec.*`) and tested each for a `^// MODULE:` line and for a box-drawing header opener.
4. Repo-wide census of the two header dialects, and a check for whether any tooling reads either marker.

## Findings

### f-iter022-001 — The comment-hygiene convention holds in this cluster (P2, drift, confidence high)

Twelve lines across the three trees carry a comment marker followed by an ephemeral label, and **zero of them are explanatory comments**. Seven are deliberate test-fixture string literals that exist to exercise the pre-commit linter on its own forbidden pattern — `const FLAGGED_SOURCE = '// see ADR-12\nexport const ok = 1;\n'` at [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:69], the same fixture at [SOURCE: .skilled/hooks/post-edit-quality/tests/codex-post-edit-quality.test.cjs:48] and its Devin twin at [SOURCE: .skilled/hooks/post-edit-quality/tests/devin-post-edit-quality.test.cjs:50], plus the assertion strings at `sk-code-post-edit-quality.test.cjs:789-790` and `post-edit-router.test.cjs:145`. The remaining five are single-line JSONL transcript fixtures under `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl` where a `//` inside prose preceded a `specs/` mention — regex artifacts, not labels.

The one comment that reaches closest to a violation is compliant: `// Anchor to the real repo root so a scan launched from a specs/<packet>` at [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:40] names a directory *shape*, not a packet id or a resolvable spec path.

Verdict: the AGENTS.md §1 Comment Hygiene rule and the pre-commit gate that backs it are enforced and clean across the advisor/hooks/relaunch cluster. This closes the sweep's first item as a pass, not a defect.

Verify: `rg -n -e '(//|^\s*#|\*).*(specs/[0-9a-z]|ADR-[0-9]|REQ-[0-9]|CHK-[0-9]|Unit [0-9]|Phase [0-9]|iter[-_ ]?[0-9]{3})' .skilled/skills/system-skill-advisor/runtime .skilled/hooks .opencode/plugins | grep -v python-compat.vitest.ts:19 | wc -l` → 12, all inspectable as fixture data.

### f-iter022-002 — Three test constants name a spec track that does not exist (P2, drift, confidence high)

The relaunch packet lives under `specs/hooks-plugins-extensions/023-session-relaunch-loop/`. There is no `specs/hooks/` directory at all — `ls specs/hooks/023-session-relaunch-loop` returns *No such file or directory*, and the only `specs/hooks*` entry is `specs/hooks-plugins-extensions`. Three code constants still assert the old prefix as the seed's own spec folder:

- `const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters';` at [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:45]
- the seed string `+ ' | Spec folder: specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters'` at [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:699]
- `const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop';` at [SOURCE: .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:25]

Execution is unaffected — the assertion only needs a spec-shaped string — which is exactly why the staleness survived. The cost is a grep target: a reader searching for the relaunch adapter's tests by path finds a track that was renamed, and `specs/hooks/001-session-relaunch` at [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:26] and `specs/hooks/session-relaunch` at [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:1487] are dead the same way.

The distinction matters for remediation: the same files also use `specs/hooks/001-example`, `specs/hooks/23-x`, `specs/hooks/030-linked-packet` and `specs/hooks/../001-example` as *deliberately* malformed or arbitrary fixtures. Those are correct as written. Only the four lines that claim to name the real relaunch packet are stale.

Verify: `ls specs/hooks 2>&1` → *No such file or directory*; `rg -n "specs/hooks/023-session-relaunch-loop" .skilled .opencode` → 3 hits.

### f-iter022-003 — Five of six runtime rows in the relaunch README link to evidence files that are gone (P2, drift, operator-facing, confidence high)

`.skilled/hooks/session-relaunch/README.md` carries a per-runtime support table whose last column is "Spike evidence". Every runtime row except Cursor points at a `SPIKE*.md` under the packet's phase-child scratch tree — [SOURCE: .skilled/hooks/session-relaunch/README.md:25] (Claude, `001-claude-relaunch-loop`), `:26` (Pi) and `:27` (OpenCode, both `002-pi-opencode-adapters`), `:28` (Codex) and `:30` (Devin, both `003-command-trigger-runtimes`).

All five links are dead. The phase children exist — `001-claude-relaunch-loop`, `002-pi-opencode-adapters` and `003-command-trigger-runtimes` are present under `specs/hooks-plugins-extensions/023-session-relaunch-loop/` — but `find specs/hooks-plugins-extensions/023-session-relaunch-loop -name 'SPIKE*'` returns nothing. The scratch spike folders were not retained when the track was renamed or archived.

This is the operator's entry document for enabling relaunch, which is one of the three blocks the run's UX question keeps naming. An operator reading it to decide whether their runtime is supported is told AUTO on five rows and offered no evidence for any of them — and the one claim the table cannot establish from a dead link is whether the runtime's flag set still matches the CLI it describes.

Verify: `find specs/hooks-plugins-extensions/023-session-relaunch-loop -name 'SPIKE*' | wc -l` → 0.

### f-iter022-004 — Two module-header dialects, 84 versus 4, with no canon and no enforcement (P2, misalignment, confidence high)

All 88 hook entry files carry a box-drawing header block, so nothing is headerless. But they do not agree on the block's identifying line. The reference form names a module — `// MODULE: Dispatch Audit Core` at [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:2], followed by a `// ───` rule and a prose paragraph. Four entry files instead use a double-line box with `// ║ COMPONENT: … ║` / `// ║ PURPOSE: … ║`:

- [SOURCE: .skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs:3]
- [SOURCE: .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs:3]
- [SOURCE: .skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs:3]
- [SOURCE: .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:3]

Repo-wide the split is 2069 `// MODULE:` headers against 80 `// ║ COMPONENT:` headers, so `MODULE` is the de facto canon and `COMPONENT` the minority dialect. Neither is written down as a rule anywhere I could find, and nothing reads either marker: every `MODULE:` hit outside `.skilled/hooks` is a *source file carrying* a header, never a tool *parsing* one. A convention with a 96%-style majority, two dialects and zero enforcement is a rule that exists only by imitation — the next author picks whichever neighbour they copy, and the 4-entry minority keeps growing or keeps being copied.

Severity is P2 rather than higher because nothing breaks: no generator, inventory or linter reads the marker, so the divergence costs a reader a moment of doubt, not a failure. What it would cost *after* a fix is different — the moment anything greps `^// MODULE:` for a module inventory, those 4 files silently vanish from it.

Verify: `rg -c --no-heading '^// ║ COMPONENT:' -g '*.{mjs,cjs,ts,js}' .skilled .opencode .pi .claude .codex .cursor .devin .dsh | wc -l` → 80; swap the pattern for `'^// MODULE:'` → 2069.

### Observation — the sweep's own instrument is coarse in exactly one direction

The first `rg` pass returned 56 lines against the comment-filtered pass's 12, a 4.7× inflation driven entirely by string literals and JSONL payloads. Any future automation of this check has to anchor on comment syntax, and the bash pattern used here anchors only on *same-line* markers — a label wrapped onto a continuation line of a block comment (` * …` on its own line) is matched by the `\*` alternative, but a label split across two `//` lines with the label on the second still needs the marker present on that line, which it is. No gap found, but the instrument should be a TS parser rule, not a regex.

## Questions Answered

None of the strategy's key questions were answered this iteration. The sweep addresses repository code convention, which the strategy does not track as a question; the run's open questions (advisor transport, UX and extension, the generation-1 advisor follow-ups) were not reached — the transport question closes its twelfth carried iteration unexercised.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/two-launcher race remain unexercised. Now carried across twelve iterations and still the largest untested claim in the run. Everything except "MCP is gone" is inference from reading.
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history after compaction. Seventeenth iteration unreached as a whole. f-iter022-003 is adjacent (the relaunch README an operator reads first is broken) but was found by a convention sweep, not by the UX question, and should not be counted against it.
- **New — was the scratch spike tree deleted deliberately, or did the track rename orphan it?** f-iter022-003's remediation differs: restore five files versus rewrite five table rows. `git log --diff-filter=D -- 'specs/hooks-plugins-extensions/023-session-relaunch-loop/*/scratch/spike/*'` settles it, path-limited as the run config requires.
- **New — which is the canon, `MODULE` or `COMPONENT`?** f-iter022-004 records the split but not the decision. `sk-code`'s module-header reference is the arbiter; if it says `MODULE`, the 4 files are the defect, and if it says nothing, the finding is the missing rule rather than the 4 files.
- Carried unchanged: which layer drops the advisor redirect (CLI handler vs `recommend_with_native_advisor()`); the generation-1 advisor follow-ups (`sk-create-skill-parent` shared-packet entry, duplicate `package_skill.py`); the hook git-call time limit; `hook-flags.sh` vs `hook-flags.cjs` differential; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction.

## Next Focus

The iteration ceiling is reached at 22 of 22; the run has no next focus. For a generation-3 continuation, the two cheapest closures in order: the f-iter022-003 provenance question (one path-limited `git log --diff-filter=D`) and the f-iter022-004 canon question (one read of sk-code's header reference). Neither touches the transport claim, which needs a process, not a read: start two launchers against one daemon and observe the lease.

## SCOPE VIOLATIONS

None. No out-of-scope write or mutation was planned or executed.
