Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/plugins/tests/system-dist-freshness-guard.test.cjs	394	19	11b939923dd2a342	R3:bare	// A cwd without .opencode forces the script-relative fallback. Before the
.skilled/plugins/tests/system-dist-freshness-guard.test.cjs	395	44	b243e1c2dc8052e7	R3:bare	// parent-count fix it resolved to <repo>/.opencode and appended .opencode again,
.skilled/plugins/tests/system-dist-freshness-guard.test.cjs	395	67	b243e1c2dc8052e7	R3:bare	// parent-count fix it resolved to <repo>/.opencode and appended .opencode again,
.skilled/scripts/run-node-tests.mjs	114	114	561115f34352804e	R3:bare	console.log(`node:test — ${nodeFiles.length} files SKIPPED (.opencode/node_modules absent; run "npm install" in .opencode)`);
.skilled/scripts/run-node-tests.mjs	140	107	f52a36975c0f22ef	R3:segment	const result = spawnSync(vitest, ['run', ...vitestFiles.map((f) => path.relative(path.join(REPO_ROOT, '.opencode'), f))], {
.skilled/scripts/run-node-tests.mjs	141	33	13a22028d184ca12	R3:segment	cwd: path.join(REPO_ROOT, '.opencode'),
.skilled/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json	3	28	cb24492f546aa0a8	R3:bare	"description": "Repo-wide .opencode matrix. Allows writes/edits across .opencode while explicitly denying .git, node_modules, and ~/.config. Resolution semantics: most-specific glob wins; first-in-array breaks equal-specificity ties.",
.skilled/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json	3	73	cb24492f546aa0a8	R3:bare	"description": "Repo-wide .opencode matrix. Allows writes/edits across .opencode while explicitly denying .git, node_modules, and ~/.config. Resolution semantics: most-specific glob wins; first-in-array breaks equal-specificity ties.",
.skilled/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json	76	22	5c6718491d78b489	R3:directory	"target_glob": ".opencode/**",
.skilled/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json	80	63	cfe94e414f1a0fac	R3:bare	"rationale": "This profile allows authored writes across .opencode."
.skilled/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json	83	22	5c6718491d78b489	R3:directory	"target_glob": ".opencode/**",
.skilled/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json	87	62	f4ec467afa8457e5	R3:bare	"rationale": "This profile allows authored edits across .opencode."
.skilled/skills/sk-code/mode-registry.json	50	85	740d95dcbbc299d6	R3:entry:.code-review-cache	"writeScopeNote": "Write is scoped to the ephemeral, untracked review cache (.opencode/.code-review-cache/<repo-ref>.jsonl); code-review never writes tracked project files (Edit is forbidden), so the tracked workspace is not mutated."
.skilled/skills/sk-code/sk-code-mobile-cli/scripts/run-source-gates.sh	26	42	4ae93f062e4ec422	R3:bare	# SKILL.md reached through the app repo's .opencode symlink; pass $1 to override.
.skilled/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh	27	36	371a6e48aee43367	R3:bare	# reached through the plugin repo's .opencode symlink; pass $1 to override.
.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py	110	6	010750e3636e670d	R3:root-fragment	"/.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/"
.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh	74	54	cb5a4fa95a810a1f	R3:bare	# scripts -> code-quality -> sk-code -> skills -> .opencode -> repo root
.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh	8	44	2e8b4464cff2a6f0	R3:bare	# scripts -> review -> sk-code -> skills -> .opencode -> repo root
.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json	830	5	5f91a2a33afc5b23	R3:segment-entry:.claude	".opencode",
.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py	44	22	ba480166f7dfde39	R3:absolute	"/tmp/project/.opencode/commands/create/sk-skill.md"
.skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py	6	17	365d9f79534d6213	R3:runtime-view	files live under .opencode/skills/ where runtime scanners (OpenCode, Claude Code,
.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js	349	7	30bcabf28e98429c	R3:directory	// .opencode/**, which over-scanned historical specs/ implementation records —
.skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py	200	44	b00272b1a19c2ccd	R3:segment	return len(parts) >= 2 and parts[0] == ".opencode" and parts[1] == "specs"
.skilled/skills/sk-doc/shared/scripts/reference_checker_extractors.py	84	23	63c0a1d71dbe71d8	R3:bare	r"(?<![\w./-])((?:\.opencode|\.claude|\.codex|\.github)/[\w.-]+(?:/[\w.-]+)*)(?![\w/-])"
.skilled/skills/sk-doc/shared/scripts/validate_document.py	1100	66	17e465dbba969389	R3:mixed-escape	('code_folder_specs_path', re.compile(r'(?<![A-Za-z0-9_])\.opencode/specs(?:/|$)', re.IGNORECASE)),
.skilled/skills/sk-doc/shared/scripts/validate_document.py	1222	5	779d5acbef142b6a	R3:runtime-view	`.opencode/agents/` files must use the `permission:` object — OpenCode enforces only
.skilled/skills/sk-doc/shared/scripts/validate_document.py	1231	20	f4a11d2afe06eb52	R3:root-fragment	is_opencode = '/.opencode/agents/' in f'/{path_str}' or path_str.startswith('.opencode/agents/')
.skilled/skills/sk-doc/shared/scripts/validate_document.py	1288	44	eddc7177ea2bc7b2	R3:runtime-view	'message': 'OpenCode agent (.opencode/agents/) is missing a permission: object',
.skilled/skills/sk-doc/shared/scripts/validate_document.py	1295	44	a49674731f04c86d	R3:runtime-view	'message': 'OpenCode agent (.opencode/agents/) has a tools: key, which OpenCode silently ignores',
.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py	107	47	275cfeeb846f6a68	R3:bare	REPO_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:\.opencode|\.claude|\.codex)/[A-Za-z0-9_./-]+')
.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py	488	27	b0aa15c2338199c4	R3:directory	REPO_RELATIVE_PREFIXES = ('.opencode/', '.claude/', '.codex/')
.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py	904	96	59c820d63dad2929	R3:entry:skills.	parser.add_argument('--repo-root', default=None, help='Defaults to the repo root containing .opencode/skills.')
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	16	25	98e98be92822dde8	R3:bare	- README files below .opencode, .claude, .pi, .github and scripts
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	46	28	f3cb7af7b9b458c1	R3:segment-entry:.claude	DURABLE_ROOT_NAMES = (".", ".opencode", ".claude", ".pi", ".github", "scripts")
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	97	18	667e52017756d7c8	R3:directory	"./", "../", ".opencode/", "specs/",
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	272	52	cb7d70ce018cbbf7	R3:segment	if relative.parts and relative.parts[0] == '.opencode' and len(relative.parts) > 1 and relative.parts[1] == 'specs':
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	426	25	fe1ad6e26fc233ab	R3:directory	if lower.startswith(".opencode/") or lower.startswith("specs/"):
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	429	30	f90e5a7e424092eb	R3:root-fragment	if lower.startswith("/.opencode/") or lower.startswith("/specs/"):
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	447	41	10bdd99df4a19e10	R3:directory	or lower.startswith(".opencode/")
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	455	41	10bdd99df4a19e10	R3:directory	or lower.startswith(".opencode/")
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	462	33	94dc7426bfdc41ab	R3:directory	or lower.startswith(".opencode/")
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	577	52	cb7d70ce018cbbf7	R3:segment	if relative.parts and relative.parts[0] == '.opencode' and len(relative.parts) > 1 and relative.parts[1] == 'specs':
.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py	987	17	26e597f8aba560b8	R3:directory	".opencode/**/README.md",
.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py	7	42	d9196f4693ebbc05	R3:entry:...	Repository-root command anchors such as ``.opencode/...`` are resolved from
.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py	49	5	b3df6dc8d28f47f0	R3:directory	".opencode/",
.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py	103	50	42da284723d2cb41	R3:directory	if value.startswith(("./", "../", "/", "~/", ".opencode/", ".github/")):
.skilled/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs	55	40	1073fc811ef917a4	R3:segment	fs.existsSync(path.join(current, '.opencode'))
.skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh	33	33	901b34695ea4b543	R3:directory	grep -Eho "node[[:space:]]+\\.opencode/[^\"'[:space:]]+\\.cjs" "$yaml_path" \
.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts	107	19	7ff5c19e6e2be417	R3:segment-entry:cli-cursor	'cli-opencode': '.opencode',
.skilled/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts	178	81	1cf2a2da37815029	R3:segment	if (existsSync(path.join(current, '.git')) || existsSync(path.join(current, '.opencode'))) {
.skilled/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts	243	43	29904cba8cca32d8	R3:root-fragment	const opencodeIndex = absolute.indexOf('/.opencode/');
.skilled/skills/system-deep-loop/runtime/scripts/check-protocol-append-sites.cjs	35	55	789b5277b6d1626b	R3:bare	// scripts -> runtime -> system-deep-loop -> skills -> .opencode -> repo
.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs	44	72	db67b51227fc922e	R3:segment	// `.git` is the unambiguous repo-root marker; prefer it so nested `.opencode`
.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs	49	68	f54acf146d89d027	R3:segment	if (opencodeMatch === null && fs.existsSync(path.join(current, '.opencode'))) {
.skilled/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs	47	70	81dff56248eedb1c	R3:bare	//      the working directory's git worktree -- e.g. a checkout whose .opencode is
.skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts	118	16	5e6be7c9c399af07	R3:segment	join(home, '.opencode'),
.skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts	140	33	84ef808df2207015	R3:segment	OPENCODE_HOME: join(home, '.opencode'),
~~~~
