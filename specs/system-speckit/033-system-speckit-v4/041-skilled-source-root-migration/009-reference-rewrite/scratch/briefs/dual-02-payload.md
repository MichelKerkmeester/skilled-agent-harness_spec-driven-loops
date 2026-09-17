Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.github/scripts/tests/broken-move-drill.sh	5	28	71815f6317dcb9d1	R3:bare	# file under .skilled/, and .opencode a tracked relative link back to it. On that
.github/scripts/tests/broken-move-drill.sh	49	79	03085d45ed6b148f	R1:path	FIRST_RULE="$(git -C "$SRC" log --reverse --format=%H -S _in_toolchain_repo -- .opencode/scripts/git-hooks/pre-commit | head -1)"
.github/scripts/tests/broken-move-drill.sh	53	35	3bcba436ec29dafa	R1:path	git -C "$SRC" show "$FIRST_RULE^:.opencode/scripts/git-hooks/$hook" > "$PRE_HOOKS/$hook" || exit 2
.github/scripts/tests/broken-move-drill.sh	55	33	215d3729d5873f46	R1:path	git -C "$SRC" show "$FIRST_RULE^:.opencode/bin/check-git-hooks.sh" > "$PRE_HOOKS/check-git-hooks.sh" || exit 2
.github/scripts/tests/broken-move-drill.sh	56	33	2019e0719ae2ac12	R1:path	git -C "$SRC" show "$FIRST_RULE^:.opencode/hooks/git/pre-commit" > "$PRE_HOOKS/legacy-pre-commit" || exit 2
.github/scripts/tests/broken-move-drill.sh	64	11	63e8efa8e4f15411	R3:bare	mv "$CLONE/.opencode" "$CLONE/.skilled"
.github/scripts/tests/broken-move-drill.sh	65	23	b56c2b4edbd8c4c2	R3:bare	ln -s .skilled "$CLONE/.opencode"
.github/scripts/tests/broken-move-drill.sh	66	23	85223cdcfa4181a8	R3:bare	git -C "$CLONE" add -A .opencode .skilled || exit 2
.github/scripts/tests/broken-move-drill.sh	70	10	f804be51ab2b58b0	R1:path	H="$CLONE/.opencode/scripts/git-hooks"
.github/scripts/tests/broken-move-drill.sh	88	70	c57133552b3ee25f	R3:bare	# Two push ranges. The move itself, which a diff across sees as every .opencode file
.github/scripts/tests/broken-move-drill.sh	90	61	9d66bb65173a1291	R3:bare	# gates meet from then on, and the one where a filter naming .opencode alone sees nothing.
.github/scripts/tests/broken-move-drill.sh	125	41	93cb865306617d96	R1:path	check_names "a missing comment checker" ".opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	129	18	399935d4bc3b8069	R1:path	run_plain "$CLONE/.opencode/hooks/git/pre-commit"; RC=$?
.github/scripts/tests/broken-move-drill.sh	134	46	b75745afd9f9876c	R1:path	check_names "a missing agent mirror checker" ".opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	143	45	dd1a456b0eb90614	R1:path	check_names "missing mirror parity scripts" ".opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	150	41	4e0dd52e28781a24	R1:path	check_names "a missing card-sync guard" ".opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	157	46	4994db6b84ebd983	R1:path	check_names "a missing mutation-class guard" ".opencode/commands/doctor/scripts/check-mcp-mutation-class.sh resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	164	40	96e0bb671b298c0f	R1:path	check_names "a missing re-derive tool" ".opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	171	37	b7586e9a3615e5a5	R1:path	check_names "a missing kill switch" ".opencode/hooks/shared/hook-flags.sh resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	178	37	1b1eea7c2216bc94	R1:path	check_names "a missing route guard" ".opencode/bin/compiled-route-guard.cjs resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	190	43	d1d77bac125325ca	R1:path	check_names "a missing permission script" ".opencode/skills/sk-git/scripts/worktree-naming.sh resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	196	53	320079e36fe4846f	R1:path	check_names "a missing skill-root metadata checker" ".opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	202	45	a34a93e46c14f72c	R1:path	check_names "a missing commit id allocator" ".opencode/skills/sk-git/scripts/commit-id-naming.sh resolves nowhere"
.github/scripts/tests/broken-move-drill.sh	215	18	a435a8470f3eaec8	R1:path	run_plain "$CLONE/.opencode/bin/check-git-hooks.sh"; RC=$?
.github/scripts/tests/broken-move-drill.sh	304	19	7986957409c2328b	R1:path	mkdir -p "$FOREIGN/.opencode/agents" "$FOREIGN/.opencode/skills/demo" "$FOREIGN/specs/demo/001-demo"
.github/scripts/tests/broken-move-drill.sh	304	47	7986957409c2328b	R1:path	mkdir -p "$FOREIGN/.opencode/agents" "$FOREIGN/.opencode/skills/demo" "$FOREIGN/specs/demo/001-demo"
.github/scripts/tests/broken-move-drill.sh	305	23	24fd64ec448c5675	R1:path	echo agent > "$FOREIGN/.opencode/agents/a.md"; echo skill > "$FOREIGN/.opencode/skills/demo/SKILL.md"
.github/scripts/tests/broken-move-drill.sh	305	70	24fd64ec448c5675	R1:path	echo agent > "$FOREIGN/.opencode/agents/a.md"; echo skill > "$FOREIGN/.opencode/skills/demo/SKILL.md"
.github/scripts/tests/broken-move-drill.sh	311	85	56753cabbdced212	R1:path	compare_foreign "the SessionStart check adds nothing for another repository" "$CLONE/.opencode/bin/check-git-hooks.sh" "$PRE_HOOKS/check-git-hooks.sh" plain
.github/scripts/tests/broken-move-drill.sh	312	80	c3f174c3c7166d42	R1:path	compare_foreign "the legacy helper adds nothing for another repository" "$CLONE/.opencode/hooks/git/pre-commit" "$PRE_HOOKS/legacy-pre-commit" plain
~~~~
