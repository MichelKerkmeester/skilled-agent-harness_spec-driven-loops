Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.github/scripts/tests/check-gate-inputs.test.sh	24	52	52eaf5990eb8fd12	R1:path	mkdir -p "$TMP/repo/.github/workflows" "$TMP/repo/.opencode/bin" "$TMP/repo/.opencode/skills/demo"
.github/scripts/tests/check-gate-inputs.test.sh	24	78	52eaf5990eb8fd12	R1:path	mkdir -p "$TMP/repo/.github/workflows" "$TMP/repo/.opencode/bin" "$TMP/repo/.opencode/skills/demo"
.github/scripts/tests/check-gate-inputs.test.sh	26	24	1360d2b7a35c64e2	R3:directory	mkdir -p "$TMP/repo/.opencode/$(dirname "$gate")"
.github/scripts/tests/check-gate-inputs.test.sh	27	48	e8af2a2a6c4d7d03	R3:directory	printf '#!/usr/bin/env bash\n' > "$TMP/repo/.opencode/$gate"
.github/scripts/tests/check-gate-inputs.test.sh	29	27	8589ccf1622c09bb	R1:path	echo "tool" > "$TMP/repo/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	30	28	f23effbb3af65b89	R1:path	echo "skill" > "$TMP/repo/.opencode/skills/demo/SKILL.md"
.github/scripts/tests/check-gate-inputs.test.sh	31	20	c316d4374a2ded69	R1:path	cat >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	32	17	846758073090a865	R1:path	TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	40	9	d10bbfa6d8b5427d	R1:path	- '.opencode/skills/**'
.github/scripts/tests/check-gate-inputs.test.sh	46	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	53	10	4fb5720b08500fdd	R3:root-fragment	- "/.opencode/**"
.github/scripts/tests/check-gate-inputs.test.sh	77	14	16e8080f473bf6f8	R1:path	rm "$TMP/repo/.opencode/scripts/git-hooks/pre-push"
.github/scripts/tests/check-gate-inputs.test.sh	79	72	8a2bac528f480bd1	R1:path	expect "a missing gate file fails gate-files" 1 "$RC" "FAIL gate-files: .opencode/scripts/git-hooks/pre-push"
.github/scripts/tests/check-gate-inputs.test.sh	83	23	236a1199aa24c60f	R1:path	echo 'GONE="$REPO_ROOT/.opencode/bin/gone.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	83	61	236a1199aa24c60f	R1:path	echo 'GONE="$REPO_ROOT/.opencode/bin/gone.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	85	79	e14816ce8056950d	R1:path	expect "an unresolved hook input fails hook-inputs" 1 "$RC" "FAIL hook-inputs: .opencode/scripts/git-hooks/pre-commit:4"
.github/scripts/tests/check-gate-inputs.test.sh	89	24	9736d5ca3aeaced9	R1:path	echo '      - run: node .opencode/bin/gone.cjs' >> "$TMP/repo/.github/workflows/demo.yml"
.github/scripts/tests/check-gate-inputs.test.sh	91	121	8a4119eebeb86836	R1:path	expect "an unresolved workflow input fails workflow-inputs" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/bin/gone.cjs"
.github/scripts/tests/check-gate-inputs.test.sh	98	128	2ce8ff2886dfcfd6	R1:path	expect "a path filter without its twin fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:5 path filter .opencode/skills/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	102	92	022d246068b11e65	R3:runtime-view	echo "git diff --cached --name-only | grep -E '^\.(opencode|claude)/agents/'" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	108	13	362ab9ffdb9c52b3	R3:entry:lib	echo 'source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/post-merge"
.github/scripts/tests/check-gate-inputs.test.sh	108	51	362ab9ffdb9c52b3	R1:path	echo 'source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/post-merge"
.github/scripts/tests/check-gate-inputs.test.sh	110	83	fde7a9a9b5799d39	R1:path	expect "a root mention with no input fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/post-merge:2"
.github/scripts/tests/check-gate-inputs.test.sh	114	14	8cdd8f84d5997726	R3:bare	mv "$TMP/repo/.opencode" "$TMP/repo/.skilled"
.github/scripts/tests/check-gate-inputs.test.sh	115	26	543f2cf6221e0064	R3:bare	ln -s .skilled "$TMP/repo/.opencode"
.github/scripts/tests/check-gate-inputs.test.sh	126	7	52bd83df436972c7	R1:path	- '.opencode/skills/**'
.github/scripts/tests/check-gate-inputs.test.sh	131	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	134	135	c0ac9bf958b9f51f	R1:path	expect "a one-root filter at the key's indent fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:5 path filter .opencode/skills/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	142	13	372dd4877da0f301	R1:path	paths: ['.opencode/skills/**']
.github/scripts/tests/check-gate-inputs.test.sh	147	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	150	123	8e7fc209701c64e0	R1:path	expect "an inline one-root filter fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:4 path filter .opencode/skills/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	163	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	175	7	a7e089803908d9c9	R1:path	'.opencode/skills/**' ]
.github/scripts/tests/check-gate-inputs.test.sh	180	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	187	35	67c401ef51078743	R1:path	echo '      - run: node --import ./.opencode/skills/gone/node_modules/tsx/dist/loader.mjs x.ts' >> "$TMP/repo/.github/workflows/demo.yml"
.github/scripts/tests/check-gate-inputs.test.sh	189	135	38d366d73ba6577d	R1:path	expect "a generated path under a missing directory fails workflow-inputs" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/skills/gone/node_modules/tsx/dist/loader.mjs is generated under .opencode/skills/gone"
.github/scripts/tests/check-gate-inputs.test.sh	189	209	38d366d73ba6577d	R1:path	expect "a generated path under a missing directory fails workflow-inputs" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/skills/gone/node_modules/tsx/dist/loader.mjs is generated under .opencode/skills/gone"
.github/scripts/tests/check-gate-inputs.test.sh	193	24	5aff4f22b372f96d	R1:path	printf '%s\n' 'CHECKER=".opencode/bin/gone.sh"' 'TOOL="$REPO_ROOT/.opencode/bin/tool.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	193	66	5aff4f22b372f96d	R1:path	printf '%s\n' 'CHECKER=".opencode/bin/gone.sh"' 'TOOL="$REPO_ROOT/.opencode/bin/tool.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	193	104	5aff4f22b372f96d	R1:path	printf '%s\n' 'CHECKER=".opencode/bin/gone.sh"' 'TOOL="$REPO_ROOT/.opencode/bin/tool.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	195	102	af1f2337bd082b49	R1:path	expect "a literal path assignment that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:2 $REPO_ROOT/.opencode/bin/gone.sh resolves nowhere'
.github/scripts/tests/check-gate-inputs.test.sh	195	146	af1f2337bd082b49	R1:path	expect "a literal path assignment that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:2 $REPO_ROOT/.opencode/bin/gone.sh resolves nowhere'
.github/scripts/tests/check-gate-inputs.test.sh	199	17	224ad96f6530fe9b	R1:path	cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	202	17	846758073090a865	R1:path	TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	203	34	5466dde5d23fe609	R1:path	git diff --cached --name-only -- '.opencode/skills/*/SKILL.md'
.github/scripts/tests/check-gate-inputs.test.sh	207	118	fef0488872fd7cce	R1:path	expect "a pathspec with its twin only in a comment or another command fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	207	168	fef0488872fd7cce	R1:path	expect "a pathspec with its twin only in a comment or another command fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	216	9	d10bbfa6d8b5427d	R1:path	- '.opencode/skills/**'
.github/scripts/tests/check-gate-inputs.test.sh	220	9	d10bbfa6d8b5427d	R1:path	- '.opencode/skills/**'
.github/scripts/tests/check-gate-inputs.test.sh	225	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	228	156	11bb995635197af2	R1:path	expect "a path filter with its twin only in another event's filter fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:9 path filter .opencode/skills/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	235	10	4fb5720b08500fdd	R3:root-fragment	- "/.opencode/**"
.github/scripts/tests/check-gate-inputs.test.sh	238	152	0a554c13bebe8974	R3:root-fragment	expect "a dependabot directory with its twin only in another update fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/dependabot.yml:9 directory /.opencode/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	242	29	48736e76e401d528	R3:entry:docs	echo '      - run: echo "See .opencode/docs/not-a-gate.md"' >> "$TMP/repo/.github/workflows/demo.yml"
.github/scripts/tests/check-gate-inputs.test.sh	248	17	224ad96f6530fe9b	R1:path	cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	250	17	846758073090a865	R1:path	TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	257	112	681a6da6c15d4bec	R1:path	expect "an array entry with its twin only in a trailing comment fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	257	162	681a6da6c15d4bec	R1:path	expect "an array entry with its twin only in a trailing comment fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	261	17	224ad96f6530fe9b	R1:path	cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	263	17	846758073090a865	R1:path	TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	264	30	30210e69e2b19496	R1:path	git diff --cached --quiet -- '.opencode/skills/*/SKILL.md' \
.github/scripts/tests/check-gate-inputs.test.sh	268	121	4c6ec68947cafcd2	R1:path	expect "a pathspec with its twin in the next command of a continued line fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:3 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	268	171	4c6ec68947cafcd2	R1:path	expect "a pathspec with its twin in the next command of a continued line fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:3 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	272	17	224ad96f6530fe9b	R1:path	cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	274	17	846758073090a865	R1:path	TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	275	9	624aaf1d2e202042	R1:path	PATHS=( ".opencode/skills/*/SKILL.md" )
.github/scripts/tests/check-gate-inputs.test.sh	279	92	3af39f9fafc78611	R1:path	expect "a one-root entry in an inline array fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:3 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	279	142	3af39f9fafc78611	R1:path	expect "a one-root entry in an inline array fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:3 pathspec .opencode/skills/*/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	286	9	0ffc4d1f14ea1a94	R3:root-fragment	- /.opencode/**
.github/scripts/tests/check-gate-inputs.test.sh	289	158	221dcc8712561328	R3:root-fragment	expect "a plain dependabot directory with its twin only in another update fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/dependabot.yml:9 directory /.opencode/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	293	43	81593a6f69171fd3	R1:path	echo '      - run: echo "checking" && node .opencode/bin/gone.cjs' >> "$TMP/repo/.github/workflows/demo.yml"
.github/scripts/tests/check-gate-inputs.test.sh	295	125	553f3b80307437ae	R1:path	expect "a command after an echo in the same step is still read" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/bin/gone.cjs resolves nowhere"
.github/scripts/tests/check-gate-inputs.test.sh	299	29	a97f8eb98fab5235	R3:entry:docs	echo '      - run: "echo See .opencode/docs/not-a-gate.md"' >> "$TMP/repo/.github/workflows/demo.yml"
.github/scripts/tests/check-gate-inputs.test.sh	305	17	224ad96f6530fe9b	R1:path	cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	307	17	846758073090a865	R1:path	TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
.github/scripts/tests/check-gate-inputs.test.sh	310	5	b8d1e5e14918b405	R1:path	'.opencode/skills/*/SKILL.md'
.github/scripts/tests/check-gate-inputs.test.sh	321	9	a20ada0f364f4b8a	R1:path	echo 'cp .opencode/bin/tool.sh "$TMPDIR/tool.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	321	64	a20ada0f364f4b8a	R1:path	echo 'cp .opencode/bin/tool.sh "$TMPDIR/tool.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	323	93	ea47ddb60b47f617	R1:path	expect "an unread root path beside real inputs fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/pre-commit:4"
.github/scripts/tests/check-gate-inputs.test.sh	327	15	7bef8900d8fe13ad	R1:path	echo 'git add ".opencode/skills/demo/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	327	62	7bef8900d8fe13ad	R1:path	echo 'git add ".opencode/skills/demo/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	329	92	9bbb7b0431d63eed	R1:path	expect "a double-quoted pathspec without -- fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	329	142	9bbb7b0431d63eed	R1:path	expect "a double-quoted pathspec without -- fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	337	59	10fc15537d2f7ee3	R1:path	paths: ['.opencode/skills/**', '.skilled/skills/**', '!.opencode/skills/private/**']
.github/scripts/tests/check-gate-inputs.test.sh	342	18	d4fe8773dbc4b89b	R1:path	- run: bash .opencode/bin/tool.sh
.github/scripts/tests/check-gate-inputs.test.sh	345	130	815880fe617f946e	R1:path	expect "a negated one-root filter entry fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:4 path filter !.opencode/skills/private/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	349	97	4b87c7caf0f73bc3	R1:path	echo 'git diff --cached --name-only -- "$REPO_ROOT/.skilled/skills/demo/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	351	94	159372bf3478b9d9	R1:path	expect "a one-root pathspec behind a variable fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .skilled/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	355	16	39cc5d34f90711fd	R3:entry:docs	echo 'echo "See .opencode/docs/not-a-gate.md" && source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	355	56	39cc5d34f90711fd	R3:entry:lib	echo 'echo "See .opencode/docs/not-a-gate.md" && source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	355	94	39cc5d34f90711fd	R1:path	echo 'echo "See .opencode/docs/not-a-gate.md" && source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	357	87	77264490f1e21f72	R1:path	expect "an unread command beside an echo fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/pre-commit:4"
.github/scripts/tests/check-gate-inputs.test.sh	361	60	0f6c1c690ccc7aa3	R3:entry:docs	echo "true # the gate matches '^\.(opencode)/agents/' under .opencode/docs" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	361	90	0f6c1c690ccc7aa3	R3:runtime-view	echo "true # the gate matches '^\.(opencode)/agents/' under .opencode/docs" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	367	37	20c3b21eb370fb3f	R1:path	echo '/usr/bin/git diff --cached -- ".opencode/skills/missing/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	367	87	20c3b21eb370fb3f	R1:path	echo '/usr/bin/git diff --cached -- ".opencode/skills/missing/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	369	108	6695eb970d8da1bc	R1:path	expect "a one-root pathspec for git called by its full path fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/missing/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	369	158	6695eb970d8da1bc	R1:path	expect "a one-root pathspec for git called by its full path fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/missing/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	373	39	3109d7c959735e51	R3:directory	echo 'git diff --cached -- "$REPO_ROOT/.opencode/"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	373	66	3109d7c959735e51	R1:path	echo 'git diff --cached -- "$REPO_ROOT/.opencode/"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	375	98	68051992ad90a8e4	R1:path	expect "the root directory as a one-root pathspec fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/ has no twin .skilled/"
.github/scripts/tests/check-gate-inputs.test.sh	375	148	68051992ad90a8e4	R3:directory	expect "the root directory as a one-root pathspec fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/ has no twin .skilled/"
.github/scripts/tests/check-gate-inputs.test.sh	379	18	7e08ccbbb58b045c	R1:path	cat >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
.github/scripts/tests/check-gate-inputs.test.sh	381	3	d493ced7f4d6e635	R1:path	".opencode/skills/*/SKILL.md"
.github/scripts/tests/check-gate-inputs.test.sh	383	26	ac7990333bcd3a2d	R1:path	) ; git diff --cached -- ".opencode/skills/missing/SKILL.md"
.github/scripts/tests/check-gate-inputs.test.sh	386	86	447aa574bfb90c22	R1:path	expect "a command after an array's closing paren is read" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:7 pathspec .opencode/skills/missing/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	386	136	447aa574bfb90c22	R1:path	expect "a command after an array's closing paren is read" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:7 pathspec .opencode/skills/missing/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	390	26	7e0a0d09a27a1f7a	R1:path	echo 'declare -r CHECKER=".opencode/bin/missing.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	390	67	7e0a0d09a27a1f7a	R1:path	echo 'declare -r CHECKER=".opencode/bin/missing.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	392	100	8ba7a8d9e9937d7f	R1:path	expect "a declared literal path that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/scripts/git-hooks/pre-commit:4 $REPO_ROOT/.opencode/bin/missing.sh resolves nowhere'
.github/scripts/tests/check-gate-inputs.test.sh	392	152	8ba7a8d9e9937d7f	R1:path	expect "a declared literal path that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/scripts/git-hooks/pre-commit:4 $REPO_ROOT/.opencode/bin/missing.sh resolves nowhere'
.github/scripts/tests/check-gate-inputs.test.sh	396	109	7ba2377bb20036d2	R1:path	echo 'STAGED="$(git diff --cached --name-only -- "$REPO_ROOT/.skilled/skills/demo/SKILL.md")"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	398	106	2e94ee7e82fad695	R1:path	expect "a one-root pathspec inside a command substitution fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .skilled/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	402	35	b3b71a53e5e1ce7b	R1:path	printf '%s\n' 'PATHS=( "$REPO_ROOT/.opencode/skills/demo/SKILL.md" )' 'git diff --cached -- "${PATHS[@]}"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	402	121	b3b71a53e5e1ce7b	R1:path	printf '%s\n' 'PATHS=( "$REPO_ROOT/.opencode/skills/demo/SKILL.md" )' 'git diff --cached -- "${PATHS[@]}"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	404	92	9e1a08edbaa91706	R1:path	expect "an array expanded into git needs twins for its entries" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	404	142	9e1a08edbaa91706	R1:path	expect "an array expanded into git needs twins for its entries" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	408	57	1491b5faec9428c2	R1:path	printf '%s\n' 'MISSING=bin/missing.js' 'node "$REPO_ROOT/.opencode/skills/demo/$MISSING"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	408	104	1491b5faec9428c2	R1:path	printf '%s\n' 'MISSING=bin/missing.js' 'node "$REPO_ROOT/.opencode/skills/demo/$MISSING"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	414	149	20b78e0f1b73fee9	R1:path	echo "git diff --cached --name-only | grep -Eq '\\.opencode/agents/' && git diff --cached --name-only | grep -Eq '\\.skilled/agents/'" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	416	95	fa76c48028e08e3c	R1:path	expect "two one-root regexes joined on one line fail filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 regex \\.opencode/ matches one source root"
.github/scripts/tests/check-gate-inputs.test.sh	416	144	fa76c48028e08e3c	R3:directory	expect "two one-root regexes joined on one line fail filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 regex \\.opencode/ matches one source root"
.github/scripts/tests/check-gate-inputs.test.sh	420	104	e9012a231e07c5e0	R1:path	echo "git log --format='.skilled/skills/demo/SKILL.md' -- .opencode/skills/demo/SKILL.md" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
.github/scripts/tests/check-gate-inputs.test.sh	422	76	508291967f0b9c43	R1:path	expect "an option value is not a pathspec twin" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	422	126	508291967f0b9c43	R1:path	expect "an option value is not a pathspec twin" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	426	54	8da2e44b3098d331	R3:root-fragment	echo '  - { package-ecosystem: "pip", directories: ["/.opencode/**"] }' >> "$TMP/repo/.github/dependabot.yml"
.github/scripts/tests/check-gate-inputs.test.sh	428	120	b27c9c9419608534	R3:root-fragment	expect "a flow-style dependabot entry is its own group" 1 "$RC" "FAIL filter-twins: .github/dependabot.yml:7 directory /.opencode/** has no twin"
.github/scripts/tests/check-gate-inputs.test.sh	432	24	8c123f3b6ec5ca70	R1:path	echo '      - run: bash .opencode/bin/tool.s?' >> "$TMP/repo/.github/workflows/demo.yml"
~~~~
