Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	10	4	41ecbd9712c9dbf8	R3:directory	// `.opencode/` tree, a real `.skilled/` tree, and a real `.skilled/` tree with
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	11	4	de1ed41b957f698e	R3:segment	// `.opencode` linked to it, which a caller reaches through either name.
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	46	50	dbfca3d1e2578763	R3:segment	const TODAY: Layout = { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] };
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	46	88	dbfca3d1e2578763	R3:segment	const TODAY: Layout = { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] };
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	57	69	e3054c9fc4a50248	R3:segment	if (layout.linked) fs.symlinkSync('.skilled', path.join(repoRoot, '.opencode'));
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	99	139	9762d0b8afa524ce	R3:segment	const { skillRoot, start } = buildTree(root, { name: 'capped walk', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true }, TODAY, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	121	53	f45516515ca3a0ae	R3:segment	const today = buildTree(root, FULL_TREE, TODAY, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	127	66	517ba72738a82b41	R1:segment	const start = path.join(leakRoot, '.skilled', 'skills', 'x', '.opencode', 'skills');
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	142	17	e117ba005b0ab153	R3:bare	it('a dangling .opencode link falls back to the hoist, never to the start', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	145	56	7cd4c7751d980f47	R3:segment	fs.symlinkSync('.skilled', path.join(danglingRoot, '.opencode'));
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	164	64	6430a17993b965bf	R3:segment	const { repoRoot } = buildTree(ancestor, FULL_TREE, TODAY, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	186	13	5c98e5341f694a77	R3:bare	it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
.skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts	187	138	f34c78bf2e80d3c7	R3:segment	const { repoRoot, start } = buildTree(root, { name: 'placeholder', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true }, TODAY, '.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-migration-manifest.vitest.ts	175	74	98861a902d9f216d	R3:bare	// The legacy root keeps its one .opencode/specs spelling, so a link from .opencode to
.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-migration-manifest.vitest.ts	199	78	165069787fd8c5f3	R3:bare	it.each(['today', 'whole-link'] as const)('%s: lists the legacy root by its .opencode spelling', (layout) => {
.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-migration.vitest.ts	200	74	2dc8e5477adbc57c	R3:bare	// A legacy-only packet is written inside the source tree, so a link from .opencode to
.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-migration.vitest.ts	202	3	fc6fba46a576e2ab	R3:bare	// .opencode path, .skilled/specs is no legacy root, and the packet stays where it is.
.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts	219	70	22cf82302c9d6ca9	R3:bare	// Root enumeration finds no legacy root in a workspace with no .opencode path, so
.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts	245	64	0223260f36da5094	R3:segment	expect(pathEntryExists(path.join(fixture.workspaceDir, '.opencode'))).toBe(false);
.skilled/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js	610	63	a578b0d4eb5eac51	R3:bare	// A real .skilled/specs directory is no approved root where .opencode does not lead to
.skilled/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js	613	21	bba17dc23cc055b7	R3:bare	// reached through .opencode, which the rows above accept.
.skilled/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js	638	9	17671a0e4bebbd25	R3:bare	// the .opencode link reaches it, and then under the legacy spelling.
.skilled/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js	237	58	4de5dc3d0626ad79	R3:segment	fs.symlinkSync(opencodeTree, path.join(consumerRoot, '.opencode'));
.skilled/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js	243	69	821f79e05a140760	R3:segment-entry:SKILL.md	assertDoesNotThrow(() => sanitizePath(path.join(consumerRoot, '.opencode', 'SKILL.md')),
.skilled/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js	244	74	70f0d83d113758f6	R3:bare	'T-003j: sanitizePath default bases accept a path inside a linked .opencode');
~~~~
