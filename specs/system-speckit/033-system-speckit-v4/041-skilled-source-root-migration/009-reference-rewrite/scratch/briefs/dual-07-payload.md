Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/commands/scripts/validate-command-references.cjs	13	64	fd44f6e32b9f8397	R1:path	// ([runtime_agent_path]/<name>.md), literal skill-asset paths (.opencode/skills/**),
.skilled/commands/scripts/validate-command-references.cjs	42	21	b37bf946f8d4d60e	R1:path	const AGENT_DIRS = ['.opencode/agents', '.claude/agents', '.codex/agents'];
.skilled/commands/scripts/validate-command-references.cjs	46	40	38e439a9cc20226d	R3:segment-entry:.claude	const RUNTIME_DIR_ALLOWLIST = new Set(['.opencode', '.claude', '.codex', '.cursor', '.devin', '.pi']);
.skilled/commands/scripts/validate-command-references.cjs	52	43	5032f7a75dd5bf06	R1:segment	const commandsRoot = path.join(rootDir, '.opencode', 'commands');
.skilled/commands/scripts/validate-command-references.cjs	65	22	b4a12acfa9787ea5	R1:path	const SKILL_TOKEN = /\.opencode\/skills\/[^\s"'`,()\[\]{}<>$*|]+/g;
.skilled/commands/scripts/validate-command-references.cjs	69	25	e951a8d46261a9ff	R1:path	const COMMAND_TARGET = /\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt)/g;
.skilled/commands/scripts/validate-command-references.cjs	169	38	5030f3aa67052436	R1:segment	const dir = path.join(REPO_ROOT, '.opencode', 'commands', fam, 'assets');
.skilled/commands/scripts/validate-command-references.cjs	186	52	40e57202afd2d2a0	R3:bare	// The command tree sits under .skilled, or under .opencode in a checkout that predates
.skilled/commands/scripts/validate-command-references.cjs	410	49	38c30663b4b9a743	R1:segment	const commandsDir = path.join(topologyRoot, '.opencode', 'commands');
.skilled/commands/scripts/validate-command-references.cjs	414	35	dd07617c56fb0b39	R1:path	'This workflow router loads `.opencode/commands/assets/workflow.yaml`.\n',
.skilled/commands/scripts/validate-command-references.cjs	420	23	8f9bd8ce0427d5d0	R1:path	'- `start` -> `.opencode/commands/assets/start.yaml`',
.skilled/commands/scripts/validate-command-references.cjs	421	22	002ce10bd63194e8	R1:path	'- `stop` -> `.opencode/commands/assets/stop.yaml`',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	36	19	b835d26ce310e35e	R1:path	commentHygiene: '.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	37	14	c3ea9128c754370b	R1:path	flowchart: '.opencode/skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	38	24	b41a49037532fc4f	R1:path	frontmatterVersions: '.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	39	17	568f044d7eefd68b	R1:path	placeholders: '.opencode/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	40	14	9805806a0c025f84	R1:path	wikilinks: '.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	41	18	73bc632e5ddb0073	R1:path	distStaleness: '.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh',
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	197	57	b22d2a0a6abd7881	R3:bare	// by its real path, which names .skilled even where .opencode links to it.
.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs	217	73	86390a190eeb24da	R3:segment	const underSpecsDir = segments[0] === 'specs' || (segments[0] === '.opencode' && segments[1] === 'specs');
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	30	23	0878a4ef108e25c4	R1:segment	const LOG_RELATIVE = ['.opencode', 'logs', 'post-edit-quality.log'];
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	101	42	ef8c44b575a4b1f5	R1:path	const entries = router.resolveDispatch('.opencode/skills/sk-doc/SKILL.md', '/tmp/proj');
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	153	45	5f34935016d15c2c	R1:path	const offEntries = router.resolveDispatch('.opencode/skills/sk-doc/notes.md', '/tmp/proj', { env: {} });
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	156	44	da91ae5e1f1bb36f	R1:path	const onEntries = router.resolveDispatch('.opencode/skills/sk-doc/notes.md', '/tmp/proj', {
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	161	61	6edcd3d62f81e735	R1:path	assert.equal(onEntries[0].args[0], path.join('/tmp/proj', '.opencode/skills/sk-doc'));
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	165	42	59f24c06e4fec0e7	R1:path	const entries = router.resolveDispatch('.opencode/skills/sk-doc/SKILL.md', '/tmp/proj', {
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	173	42	c5100f2bb8e41212	R1:path	const entries = router.resolveDispatch('.opencode/skills/sk-doc/references/spec.md', '/tmp/proj');
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	182	23	faef56f02b3e78b8	R1:segment	path.join(tmpDir, '.opencode', 'skills', 'sk-doc', 'references', 'architecture.md'),
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	196	55	3266e02c56864a17	R1:segment	const readmeNoSibling = writeFile(path.join(tmpDir, '.opencode', 'skills', 'sk-doc', 'sub', 'README.md'), '# x\n');
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	199	31	37201601a1cb43fe	R1:segment	writeFile(path.join(tmpDir, '.opencode', 'skills', 'sk-doc', 'sub', 'SKILL.md'), '---\nversion: 1.0.0.0\n---\n');
.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs	363	55	fbc415a08a1a6539	R1:segment	const tmpFile = fs.mkdtempSync(path.join(REPO_ROOT, '.opencode', 'plugins', 'tests', '.tmp-real-checker-'));
.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py	18	10	5258e34da5a42d41	R1:path	'node .opencode/bin/compiled-route.cjs --hub',
.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py	271	39	b5906471f9adaeb1	R1:path	else "the repository's .opencode/commands/doctor/scripts/parent-skill-check.cjs"
.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts	10	21	161acbe2aa31eb5c	R1:path	const SCRIPTS_DIR = '.opencode/skills/system-deep-loop/deep-improvement/scripts';
.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts	52	31	8f174e0f69cc4159	R1:path	path.join(WORKSPACE_ROOT, '.opencode/skills/system-spec-kit/shared'),
.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts	55	13	0d8799fdaa7ebba3	R1:path	writeFile(`.opencode/agents/${AGENT_NAME}.md`, CANONICAL);
.skilled/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts	148	52	da4fde23adc1603b	R3:bare	it('accepts recorded source digests spelled under .opencode on a tree that holds them under .skilled', () => {
.skilled/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts	150	100	9adfbc8b605a867e	R3:directory	for (const digest of header.sourceDigests) digest.path = digest.path.replace(/^\.skilled\//, '.opencode/');
.skilled/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts	166	35	6916d3e556ee9b68	R3:directory	return content.replaceAll('.opencode/', '.skilled/');
.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts	87	47	71774b806d89e2b1	R3:bare	// A checkout that holds its tree only under .opencode has no .skilled path, so an output
.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts	92	34	3d06f855bfaa09e1	R1:segment	const scripts = join(root, '.opencode', 'skills', 'system-deep-loop', 'runtime', 'scripts');
.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts	98	20	64d50c9e6e0cb52b	R1:segment	join(root, '.opencode', 'commands', 'deep', 'assets', 'compiled', 'deep-review.contract.md'),
.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts	32	47	8ded8265ddd35e1b	R3:segment	// The source tree sits under `.skilled` or `.opencode`, so the sentinel is
.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts	70	20	64382cb9166b7cb8	R3:segment	// A `.skilled` or `.opencode` directory is by definition a child of the workspace
.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs	85	32	1013763f6b7cafc0	R1:path	path = os.path.join(workspace, '.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py')
~~~~
