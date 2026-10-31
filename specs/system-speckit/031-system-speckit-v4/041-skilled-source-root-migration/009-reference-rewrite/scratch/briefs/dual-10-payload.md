Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	3	10	7dc6104100f0add2	R3:bare	// a real .opencode tree, a real .skilled tree and an .opencode link to .skilled
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	3	54	7dc6104100f0add2	R3:bare	// a real .opencode tree, a real .skilled tree and an .opencode link to .skilled
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	33	46	e790a787ae1ce0f4	R3:bare	// Today's checkout holds the real tree under .opencode beside a .skilled placeholder,
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	37	67	34fd9175aee3198a	R3:segment	const realSourceRoot = path.join(repoRoot, layout === 'today' ? '.opencode' : '.skilled');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	41	79	020a779530b0879d	R3:segment	if (layout === 'whole-link') fs.symlinkSync('.skilled', path.join(repoRoot, '.opencode'));
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	46	28	69600f5f8e3f730b	R3:bare	it('treats the repo-local .opencode directory as the canonical workspace anchor', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	48	46	ff2733489ef34746	R3:segment	const opencodeRoot = path.join(repoRoot, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	53	55	06fd7f36b664122d	R3:absolute	expect(identity.canonicalOpencodePath).toMatch(/\/\.opencode$/);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	60	66	00f1d311c440255b	R3:bare	it('accepts repo-root and nested paths that resolve to the same .opencode workspace', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	62	46	ff2733489ef34746	R3:segment	const opencodeRoot = path.join(repoRoot, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	69	70	6200dd1416da6957	R1:segment	expect(toWorkspaceRelativePath(opencodeRoot, path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit', 'runtime', 'cli', 'core', 'workflow.ts')))
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	70	13	94aafcef4393aa99	R1:path	.toBe('.opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	77	38	d86b0db166d1634f	R3:segment	fs.mkdirSync(path.join(repoRoot, '.opencode'), { recursive: true });
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	78	43	b95cc3662f35d52c	R3:segment	fs.mkdirSync(path.join(otherRepoRoot, '.opencode'), { recursive: true });
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	80	52	2d2bbcc09949d79a	R3:segment	expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), otherRepoRoot)).toBe(false);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	81	52	ab6b42c165500d2e	R3:segment	expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), path.join(otherRepoRoot, '.opencode'))).toBe(false);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	81	91	ab6b42c165500d2e	R3:segment	expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), path.join(otherRepoRoot, '.opencode'))).toBe(false);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	86	46	ff2733489ef34746	R3:segment	const opencodeRoot = path.join(repoRoot, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	94	69	c311f4b8193e8a0f	R3:segment	expect(isSameWorkspacePath(opencodeRoot, path.join(symlinkRoot, '.opencode'))).toBe(true);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	111	54	b064f3db87305548	R3:bare	it('gives the repository root, never .skilled, when .opencode links to .skilled', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	114	45	1bc4a9f2f1cc75e3	R1:segment	const throughLink = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	120	52	6fc5bd90fc253b61	R3:segment	expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), throughReal)).toBe(true);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	123	84	9469ab77c4414bea	R3:bare	.toEqual(expect.arrayContaining([`${realRepoRoot}/.skilled`, `${realRepoRoot}/.opencode`]));
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	128	42	a335499546a91567	R3:bare	it('keeps one workspace root for a real .opencode tree beside the .skilled placeholder', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	131	48	35f48f1a25c1ce25	R1:segment	const nestedSkillDir = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	137	74	a3b52c95f4e5811f	R3:bare	expect(getWorkspacePathVariants(repoRoot)).toContain(`${realRepoRoot}/.opencode`);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	139	52	19d772a8fbd7d71d	R3:segment	expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), placeholder)).toBe(true);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	141	13	4f72775c97e60156	R1:path	.toBe('.opencode/skills/system-spec-kit/SKILL.md');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	146	42	40c9af9e24c5be9b	R1:segment	const skillDir = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	153	13	4f72775c97e60156	R1:path	.toBe('.opencode/skills/system-spec-kit/SKILL.md');
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	173	38	25abd1d4b2658362	R3:segment	fs.mkdirSync(path.join(bareRoot, '.opencode'), { recursive: true });
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	182	56	edd42910a7b2ce06	R3:segment	expect(isSameWorkspacePath(path.join(opencodeRepo, '.opencode'), skilledRepo)).toBe(false);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	183	56	23788a3cb994b371	R3:segment	expect(isSameWorkspacePath(path.join(opencodeRepo, '.opencode'), path.join(skilledRepo, '.skilled'))).toBe(false);
.skilled/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts	184	92	58d3bccbb20ddab2	R1:segment	expect(isSameWorkspacePath(path.join(skilledRepo, '.skilled'), path.join(opencodeRepo, '.opencode', 'skills'))).toBe(false);
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	874	53	baf8e58ad94695a5	R3:segment	// source tree beside them sits under `.skilled` or `.opencode`, and a checkout
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	886	35	6da98811f4ad20b2	R3:segment	path.basename(parent) === '.opencode'
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	905	36	7299f2b5d0e6d66c	R3:segment	return path.basename(parent) === '.opencode' ? path.dirname(parent) : parent;
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	964	31	59429a99ba16f075	R3:directory	if (normalized.startsWith('.opencode/')) {
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	968	42	e84a8803b8773de8	R3:segment	lookups.add(path.resolve(repoRoot, '.opencode', normalized));
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	971	51	68601f8653bd8386	R1:segment	const systemSpecKitRoot = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	1039	26	963f26642a2fe0cc	R3:root-fragment	for (const marker of ['/.opencode/specs/', '/specs/', '.opencode/specs/', 'specs/']) {
.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts	1778	64	1d2288f15b8479ad	R3:segment	// it exists on disk and its workspace is anchored on a real `.opencode`
~~~~
