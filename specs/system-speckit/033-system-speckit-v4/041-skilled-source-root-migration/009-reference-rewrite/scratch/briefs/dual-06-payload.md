Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/bin/compiled-routing-foundation.vitest.ts	51	3	4e470af3ec83d4d8	R1:path	'.opencode/skills/system-skill-advisor/runtime/dist/runtime/lib/compiled-routing-flag.js',
.skilled/bin/compiled-routing-foundation.vitest.ts	294	37	13b92c82ebadb1c9	R3:bare	// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
.skilled/bin/compiled-routing-foundation.vitest.ts	295	5	8860f010398b73a1	R3:bare	// .opencode linked to it, and Node runs a script through that link by its real path.
.skilled/bin/compiled-routing-foundation.vitest.ts	297	32	f40cdc1bfe1443b4	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
.skilled/bin/compiled-routing-foundation.vitest.ts	297	70	f40cdc1bfe1443b4	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
.skilled/bin/compiled-routing-foundation.vitest.ts	322	65	2fcacef409134c04	R3:segment	if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));
.skilled/bin/mcp-code-mode-launcher.test.cjs	175	35	a766ac7a9503b39a	R3:bare	// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
.skilled/bin/mcp-code-mode-launcher.test.cjs	176	3	927e477fadabd7db	R3:bare	// .opencode linked to it, and Node loads a script through that link by its real path.
.skilled/bin/mcp-code-mode-launcher.test.cjs	178	30	582f4acfae579a1b	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
.skilled/bin/mcp-code-mode-launcher.test.cjs	178	68	582f4acfae579a1b	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
.skilled/bin/mcp-code-mode-launcher.test.cjs	201	75	e07b4ceb6d871e45	R3:segment	if (layout.linked) fs.symlinkSync('.skilled', path.join(repositoryRoot, '.opencode'));
.skilled/bin/tests/check-git-hooks.test.sh	16	18	6bea6c27234c0373	R1:path	CHECK="$REPO_ROOT/.opencode/bin/check-git-hooks.sh"
.skilled/bin/tests/check-git-hooks.test.sh	31	19	7014d746952f1a81	R1:path	mkdir -p "$TMP/.opencode/skills/system-spec-kit"
.skilled/bin/tests/check-git-hooks.test.sh	32	26	4478c49f176a34eb	R1:path	echo sentinel > "$TMP/.opencode/skills/system-spec-kit/SKILL.md"
.skilled/bin/tests/check-git-hooks.test.sh	59	13	ed4e821f28efabda	R3:bare	rm -rf "$TMP/.opencode"
.skilled/bin/tests/check-git-hooks.test.sh	60	21	1bae0ca9c5213cc9	R3:bare	ln -s .skilled "$TMP/.opencode"
.skilled/bin/tests/check-git-hooks.test.sh	63	12	7cde47de44e54c41	R1:path	ln -s "$TMP/.opencode/scripts/git-hooks/pre-commit" "$TMP/.git/hooks/pre-commit"
.skilled/bin/tests/check-git-hooks.test.sh	74	15	67d833bf883cac9f	R1:path	mkdir -p "$TMP/.opencode/scripts/git-hooks"
.skilled/bin/tests/check-git-hooks.test.sh	75	47	a198deb169b3813e	R1:path	printf '#!/usr/bin/env bash\nexit 0\n' > "$TMP/.opencode/scripts/git-hooks/pre-commit"
.skilled/bin/tests/install-codex-hooks-source-root.test.cjs	31	35	a766ac7a9503b39a	R3:bare	// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
.skilled/bin/tests/install-codex-hooks-source-root.test.cjs	32	3	1fb94277f67f6b2c	R3:bare	// .opencode linked to it. The orphan rows read the adapter from disk, so each layout
.skilled/bin/tests/install-codex-hooks-source-root.test.cjs	35	30	1d17db534635e3b9	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false },
.skilled/bin/tests/install-codex-hooks-source-root.test.cjs	57	65	bd6f427e4743d2d3	R3:segment	if (layout.linked) fs.symlinkSync('.skilled', path.join(repo, '.opencode'));
.skilled/bin/tests/relink-local-specs.test.sh	6	2	de08764c4f25b91e	R3:bare	# .opencode tree beside an empty .skilled placeholder, a real .skilled tree, and a
.skilled/bin/tests/relink-local-specs.test.sh	7	26	14db2c4d5c47641b	R3:bare	# real .skilled tree with .opencode linked to it. The script finds the checkout two
.skilled/bin/tests/relink-local-specs.test.sh	38	17	89c9f778c91009dd	R3:segment	today) real=".opencode"; entries=".opencode" ;;
.skilled/bin/tests/relink-local-specs.test.sh	38	38	89c9f778c91009dd	R3:segment	today) real=".opencode"; entries=".opencode" ;;
.skilled/bin/tests/relink-local-specs.test.sh	39	25	181a96375acf6457	R3:bare	whole-link) entries=".opencode .skilled" ;;
.skilled/bin/tests/relink-local-specs.test.sh	49	63	1da1ef6661e12588	R3:bare	[ "$layout" != "whole-link" ] || ln -s .skilled "$checkout/.opencode"
.skilled/bin/tests/worktree-session.test.sh	216	22	e323ccd6cd3f5dc1	R3:bare	# The tree sits under .opencode beside a tracked .skilled placeholder (today), under .skilled,
.skilled/bin/tests/worktree-session.test.sh	217	25	40e79afa13aab4a4	R3:bare	# or under .skilled with .opencode linked to it. Physical paths, for the same containment
.skilled/bin/tests/worktree-session.test.sh	221	36	0aeac82941fa7da6	R3:segment	[ "$layout" != "today" ] || real=".opencode"
.skilled/bin/tests/worktree-session.test.sh	229	60	2fc950100c7705fb	R3:bare	[ "$layout" != "whole-link" ] || ln -s .skilled "$fixture/.opencode"
.skilled/bin/tests/worktree-session.test.sh	249	36	0aeac82941fa7da6	R3:segment	[ "$layout" != "today" ] || real=".opencode"
.skilled/bin/tests/worktree-session.test.sh	282	39	a9ef591f9311018b	R3:bare	expect "skilled-only launch creates no .opencode path in the worktree" test ! -e "$F7_WT/.opencode"
.skilled/bin/tests/worktree-session.test.sh	282	89	a9ef591f9311018b	R3:bare	expect "skilled-only launch creates no .opencode path in the worktree" test ! -e "$F7_WT/.opencode"
.skilled/bin/tests/worktree-session.test.sh	291	16	d7875c7fe35d160a	R3:bare	mv "$F8_FIXTURE/.opencode" "$F8_FIXTURE/.skilled"
.skilled/bin/tests/worktree-session.test.sh	299	98	b7cb8a8946f77f62	R3:bare	grep -F "main checkout keeps its source tree under .skilled but the new worktree keeps it under .opencode" "$ROOT/f8.stderr"
~~~~
