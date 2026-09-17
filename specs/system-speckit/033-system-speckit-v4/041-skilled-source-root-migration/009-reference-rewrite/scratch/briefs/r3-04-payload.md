Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	382	16	3e3d64c2c2c82f9f	R3:directory	f.includes('.opencode/') || f.includes('/.opencode/')
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	382	45	3e3d64c2c2c82f9f	R3:root-fragment	f.includes('.opencode/') || f.includes('/.opencode/')
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	395	66	be5d93d622eeadf8	R3:directory	const matchingFiles = opencodeFiles.filter((f) => f.includes(`.opencode/${subpath}`));
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	498	65	055c64f7536c405c	R3:directory	console.log(`   Warning: INFRASTRUCTURE MISMATCH: Work is on .opencode/${workDomain.subpath || ''}`);
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	515	33	5e950e27d087e04f	R3:directory	console.log(`   Work domain: .opencode/${workDomain.subpath || '*'} (${Math.round(workDomain.confidence * 100)}% of files)`);
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	620	59	2e5287da45f282df	R3:directory	console.log(`   Warning: Infrastructure work detected: .opencode/${workDomain.subpath || '*'}`);
.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts	634	112	f1cac30a8151a552	R3:directory	console.log(`\n   Warning: INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);
.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh	22	91	3f83cb2bd1dcb4e8	R3:directory	# Path: runtime/cli/spec/ -> runtime/cli/ -> runtime/ -> system-spec-kit/ -> skill/ -> .opencode/ -> project
.skilled/skills/system-spec-kit/runtime/cli/tests/alignment-drift-fixture-preservation.vitest.ts	16	3	3fd087da7abfb01e	R3:segment-entry:skill	'.opencode',
.skilled/skills/system-spec-kit/runtime/cli/tests/graph-key-file-declarations.vitest.ts	16	36	d21c74415b933e5d	R3:segment	fs.mkdirSync(path.join(repoRoot, '.opencode'), { recursive: true });
.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-write-containment.sh	110	39	7e6057e25c961470	R3:bare	expect "another workspace, anchored on .opencode" "wrote" "$(attempt "$WS/graph-metadata.json")"
.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-write-containment.sh	118	31	bb6c8f2ecf94a5fb	R3:bare	expect "the same shape with no .opencode anchor" "refused" "$(attempt "$UNANCHORED/graph-metadata.json")"
.skilled/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.js	8	43	7a8f9513cad1cdb6	R3:segment-entry:skill	const SKILL_ROOT = cwd.endsWith(path.join('.opencode', 'skill', 'system-spec-kit'))
.skilled/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.ts	106	43	7a8f9513cad1cdb6	R3:segment-entry:skill	const SKILL_ROOT = cwd.endsWith(path.join('.opencode', 'skill', 'system-spec-kit'))
.skilled/skills/system-spec-kit/runtime/cli/tests/process-memory-harness.vitest.ts	22	52	b71eb38d52418cc6	R3:absolute	2002     1 S    32000 /opt/homebrew/bin/node /repo/.opencode/skills/system-spec-kit/runtime/cli/dist/ops/synthetic-daemon.js
.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-repo-root.vitest.ts	28	47	3acd9c1ea8d520ef	R3:bare	it('resolves to the repository root, not the .opencode directory', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-repo-root.vitest.ts	29	55	30b5a825a7bcc634	R3:segment	expect(path.basename(DEFAULT_REPO_ROOT)).not.toBe('.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts	33	31	4cb1f8a28646116f	R3:segment	fs.mkdirSync(path.join(dir, '.opencode'), { recursive: true });
.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts	65	49	7b317272d911b7f6	R3:segment	expect(structuredRecipe('phrase', ['specs', '.opencode'])).toEqual([
.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts	68	32	dc00f4b984f4915d	R3:segment	'--', 'phrase', 'specs', '.opencode',
.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts	73	43	2a3738f82d0fb864	R3:segment	expect(pathRecipe('phrase', ['specs', '.opencode'])).toEqual([
.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts	77	32	dc00f4b984f4915d	R3:segment	'--', 'phrase', 'specs', '.opencode',
.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts	82	44	97deb2da8c6512c4	R3:segment	expect(countRecipe('phrase', ['specs', '.opencode'])).toEqual([
.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts	85	32	dc00f4b984f4915d	R3:segment	'--', 'phrase', 'specs', '.opencode',
.skilled/skills/system-spec-kit/runtime/cli/tests/session-enrichment.vitest.ts	320	7	87accec7331209ca	R3:segment-entry:skill	'.opencode',
.skilled/skills/system-spec-kit/runtime/cli/tests/session-enrichment.vitest.ts	375	46	4164bb5118e4ffd2	R3:segment-entry:skill	const workflowPath = path.join(repoRoot, '.opencode', 'skill', 'system-spec-kit', 'scripts', 'core', 'workflow.ts');
.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts	101	30	d54a1a07ddd98611	R3:entry:state	expect(classifyLifecycle('.opencode/state/session.jsonl')).toBe('historical');
.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js	165	26	abdbffa0af4767ab	R3:segment-entry:agent	path.join(REPO_ROOT, '.opencode', 'agent', 'speckit.md'),
.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts	52	31	297972d922c545f6	R3:entry:command	path.join(WORKSPACE_ROOT, '.opencode/command'),
.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts	53	31	aed00b5d0ebd5c54	R3:entry:agent	path.join(WORKSPACE_ROOT, '.opencode/agent'),
.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-trigger-index-freshness.vitest.ts	20	60	70b890583f4049ed	R3:bare	// scripts/tests -> scripts -> system-spec-kit -> skills -> .opencode -> repo root.
.skilled/skills/system-spec-kit/runtime/cli/utils/tool-sanitizer.ts	34	15	e570f8517a229b31	R3:directory	// Replace .opencode/ internal paths
.skilled/skills/system-spec-kit/runtime/cli/utils/tool-sanitizer.ts	35	15	acfdabb8e08c9617	R3:bare	.replace(/\.opencode\/[^\s"'`,;)}\]]+/g, '[internal-path]')
.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts	58	37	40e9cc559ded6bd9	R3:segment	const candidate = join(current, '.opencode', TARGET_REL);
.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts	49	33	c65fb3a4264636c8	R3:bare	const SPEC_FOLDER_PATH_RE = /(?:\.opencode\/)?specs\/[^\s"'`]+/g;
.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts	31	27	514a8370ebc12b1a	R3:segment	// the ancestor that owns `.opencode`. Claude may invoke the hook from any
.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts	56	37	40e9cc559ded6bd9	R3:segment	const candidate = join(current, '.opencode', TARGET_REL);
.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs	100	34	c3d6ab60e3cbad63	R3:segment	if (existsSync(join(current, '.opencode'))) return current;
.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs	259	19	9f82766cc175f1bd	R3:root-fragment	// `resolve("   /.opencode/...")` which is a different directory than where
.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs	263	64	b7824074aa0a94bc	R3:root-fragment	// pre-fix adapter because state is written under `<root>/   /.opencode/...`
.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs	264	24	b7b255b3ca447d29	R3:entry:...	// instead of `<root>/.opencode/...`.
.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs	575	44	882321bd3a6908b7	R3:bare	// directory, which is what planted stray .opencode trees across the tree.
.skilled/skills/system-spec-kit/runtime/lib/config/spec-doc-paths.ts	311	64	7d782b48d2d0a15b	R3:segment	if (segments[index] === 'specs' && segments[index - 1] === '.opencode') {
.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts	57	16	ccfeb563443b9b61	R3:bare	.replace(/^\.opencode\//u, '')
.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts	512	16	64d2189afdc6ef4b	R3:bare	.replace(/^\.opencode\//, '')
.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs	75	38	abe7afb167527dd2	R3:bare	const SPEC_FOLDER_TEXT_PATTERN = /(?:\.opencode\/)?specs\/[^\s"'`)\]]+/;
.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts	255	16	51c32534d73c5686	R3:bare	.replace(/^\.opencode\//u, '');
.skilled/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts	1408	46	4fdd60caa5a3dd1e	R3:segment	const opencodeIndex = segments.lastIndexOf('.opencode');
.skilled/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts	1414	42	5255264ced44ebd5	R3:segment	if (fs.existsSync(path.join(current, '.opencode'))) {
.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts	15	49	53ef27331f145840	R3:directory	/** Resolved code-graph inclusion policy: which `.opencode/` folders and globs are indexed. */
.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts	130	18	f35cfb38b4d20ce7	R3:bare	? `; opted-in .opencode folders: ${includedFolders.join(', ')}`
.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts	131	9	3c441273ec3ddd16	R3:bare	: '; .opencode skill, agent, command, specs and plugins excluded';
.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts	222	10	f239f919240dc9fb	R3:mixed-escape	? ['\\.opencode/specs', 'specs']
.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts	223	10	23b588c37f49546e	R3:directory	: [`\\.opencode/${folder}`];
.skilled/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts	71	10	984c14b86597e3bc	R3:bare	if (/^(\.opencode\/)?specs\//.test(normalized)) {
.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts	739	31	37de3d30fe19a46d	R3:bare	const marker = `${path.sep}.opencode${path.sep}specs${path.sep}`;
.skilled/skills/system-spec-kit/runtime/tests/copilot-compact-cycle.vitest.ts	48	24	249140f736ba2f3a	R3:root-fragment	'plain text with /.opencode/specs/system-spec-kit/demo/spec.md reference',
.skilled/skills/system-spec-kit/runtime/tests/council-helpers-smoke.vitest.ts	33	38	54031906d1dc92b4	R3:directory	// The helper walks up looking for `.opencode/` as the repo-root signal.
.skilled/skills/system-spec-kit/runtime/tests/council-helpers-smoke.vitest.ts	34	28	f21f0b40624bf802	R3:segment	mkdirSync(join(repoRoot, '.opencode'), { recursive: true });
.skilled/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts	80	27	7c9a80d8aef1110c	R3:segment	cwd: join(repoRoot, '.opencode'),
.skilled/skills/system-spec-kit/runtime/tests/embedders/hf-model-server-perimeter.vitest.ts	24	75	d59af785c53334af	R3:bare	//   ..(embedders→tests) ..(→runtime) ..(→system-spec-kit) ..(→skills) ..(→.opencode) /bin
.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-single-writer-cluster.vitest.ts	215	40	224a90a5b3da3eb2	R3:segment	opencodeDir: join(process.cwd(), '.opencode'),
.skilled/skills/system-spec-kit/runtime/tests/folder-discovery-integration.vitest.ts	153	60	e7361907adc725f9	R3:bare	it('T046-05c: resolves repo specs when called from inside .opencode tooling', () => {
.skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts	23	22	5c8c35a72d625e74	R3:entry:...	// string, e.g. `node .opencode/.../foo.js` or `bash .opencode/bin/bar.sh`.
.skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts	135	69	5ac9d196ad484663	R3:runtime-view	{ runtime: 'opencode', event: 'plugin', path: resolve(repoRoot, '.opencode/plugins/system-skill-advisor.js') },
.skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts	136	69	f093a861adf25c67	R3:runtime-view	{ runtime: 'opencode', event: 'plugin', path: resolve(repoRoot, '.opencode/plugins/system-spec-gate.js') },
~~~~
