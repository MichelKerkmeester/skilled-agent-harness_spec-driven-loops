# Workers used for this plan

## Blocker recorded: DeepSeek through Devin was unavailable

Three inventory prompts were sent to DeepSeek (`AI_SESSION_CHILD=1 devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`). They are kept in `scratch/prompts/`.

- **First launch.** It failed with `command not found: gtimeout` (exit 127). That tool is not installed on this host.
- **Second launch.** It ran without the timeout and every worker exited 1 with: `Your weekly usage quota has been exhausted ... "cognition.ai/errorKind": "resource_exhausted"`.
- **No output.** Devin wrote nothing. Its empty output files were replaced by the Claude reports below.
- **Fallback.** The same three inventories ran on Claude `@context` workers (Opus, medium effort, read-only).

## Inventory workers (read-only, @context, Opus)

| Report | Scope | What the orchestrator checked |
|--------|-------|-------------------------------|
| `inventory/a-engine.md` | engine sites that assume an in-tree overlay folder, plus the test fixtures | Read `overlay-engine.cjs:4524-4536`, `:6252-6258` and `:4219-4228`, and `tests/overlay-engine-repin.test.cjs:485`, `fixes.test.cjs:102-105` and `fixtures.cjs:53-69`. All matched. |
| `inventory/b-barter.md` | every Barter file that assumes the old location or naming rule, and the hooks | Read the manifest at `:146-153` and `:1536-1560`, `pre-commit:83-90`, `barter-git-write-gate.mjs:180-185`, `barter-overlay-guard-core.cjs:60-84` and `.gitignore:68`. All matched. Also checked the engine's link-target and verify-step handling (`:2473-2476`, `:2525-2529`, `:6104-6120`). |
| `inventory/c-upstream.md` | upstream docs, workflows, hooks and versions | Read `doctor-overlay-presentation.txt:557`, `overlay-guard.cjs:61-82`, `references/overlays.md:92` and `doctor-overlay-repin.yaml:76`. All matched. |

## Drafting workers (@markdown, Opus)

Each drafter wrote only its own child docs. The orchestrator then checked tokens (0), task lines (every task has a `Verify:` clause), the status and phase rows, and plan §4 for each child.

- **001 and 002.** Confirmed the six `adoptSource` callers (`overlay-engine.cjs:3371,5465,5469,5544,5556,5563`) and that `loadManifest` checks only the `overlays` array (`:474-500`). Afterwards the orchestrator:
  - closed two stale UNKNOWNs: link targets in a sibling folder, and that no destination is exactly `.skilled` (count 0);
  - added a link test to 001 (T023);
  - replaced the placeholder Measured Behavior commands with the commands actually run.
- **003 and 004.** Confirmed `overlay.md:35,110,116` and that `skilled/.skilled/skills/.state/doctor-update/base.json` exists in Barter. Afterwards the orchestrator:
  - checked which Barter overlays own a file that phases 001-003 change upstream. Only `adopted-skilled-commands-doctor-routes-yaml` does (Barter `_routes.yaml:708` against upstream `:699`);
  - added the rebase task T017, REQ-008 and a risk row to 004;
  - corrected REQ-006's task reference to T007.
- **005 and 006.** Confirmed `tests/node-version-policy.test.sh:165-173` carries the old `skilled/skills/` source prefix, so it belongs in 005.

## Writes outside the bound folder

- `/tmp/.x` held one Barter status capture and was deleted right after. Nothing else was written outside the packet, apart from the track's `graph-metadata.json` line that `create.sh` added.

## Revision round after the operator's answers (2026-11-20)

- **Restructure.**
  - `relocate.mjs` refuses to rename children of an uncommitted packet (`relocate.mjs:1832-1851`), and this session may not commit.
  - So the filled docs of old 004, 005 and 006 were copied into `scratch/old-004`, `old-005` and `old-006` as `.txt`. The three folders were removed, and `create.sh --phase --parent` re-created `004-barter-repin-and-relayout` (Level 1) and `005-barter-move-overlays-out-of-tree` (Level 2).
  - The graph-metadata writer only adds `children_ids` (`check-graph-metadata-child-drift.sh:7-12`). The three entries for deleted folders were removed by hand, then `repair-derived.cjs --apply` re-derived the parent.
- **Workers** (four @markdown on Opus, one message, in parallel): 002 to a default change, 003 docs and release, a merged 004, and old 006 renumbered to 005. The orchestrator revised the parent and 001 itself.
- **What the orchestrator checked:**
  - 002: the migration subsection, and that `strict-writes.test:547-552` places its copy on the old path.
  - 003: the cited `overlay.md:99` LAYOUT wording.
  - 004: its claim that 003 still targeted the old folder. That was stale, since both 003 T048 and 004 T001 name `004-barter-repin-and-relayout/spec.md`.
  - 005: the `SUM` helper, run against Barter's live `status --json`, printed `PASSED 0 0 487`.
  - Across the packet, an rg for old slugs, `of 6` and `sourceLayout` found only lines saying the field does not exist and the verbatim measured output.
