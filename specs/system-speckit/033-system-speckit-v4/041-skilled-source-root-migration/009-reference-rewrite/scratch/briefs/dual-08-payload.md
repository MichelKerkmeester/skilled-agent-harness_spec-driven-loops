Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts	19	35	a766ac7a9503b39a	R3:bare	// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts	20	3	7668bd9622853670	R3:bare	// .opencode linked to it, and Node runs a script through that link by its real path.
.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts	22	30	582f4acfae579a1b	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts	22	68	582f4acfae579a1b	R3:segment	{ name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts	39	65	2fcacef409134c04	R3:segment	if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	38	11	ee2da53387bbc456	R3:entry:skill.	// for .opencode/skill. When tests run from the mcp_server directory,
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	195	28	af4befa9a246b2dc	R3:segment	writeSentinel(today, '.opencode');
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	200	47	94bc49dc0338072d	R3:segment	symlinkSync('.skilled', join(wholeLink, '.opencode'));
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	201	66	e1d6c5d419e125fc	R1:segment	const leak = join(root, 'leak', '.skilled', 'skills', 'x', '.opencode', 'skills');
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	204	27	9754a3ce6ddf8649	R3:bare	// an ancestor named .opencode and holds its tree under .skilled, so hoisting above
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	206	37	fa134f2aa5ccfcbf	R3:segment-entry:outer	const nestedRepo = join(root, '.opencode', 'outer', 'repo');
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	212	22	1292ee0c0b8064a3	R1:segment	[join(today, '.opencode', 'skills', 'system-spec-kit'), today],
.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts	214	26	76ae400362fd76fa	R1:segment	[join(wholeLink, '.opencode', 'skills', 'system-spec-kit'), wholeLink],
.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-repo-paths.vitest.ts	24	63	615c756307b0eff4	R3:segment	if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	5	24	d1d672bdec7c4ea7	R3:directory	// directory inside an `.opencode/` tree, because the advisor writes runtime
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	6	56	11c5ff4d18092521	R3:directory	// state under whatever root it returns; a root inside `.opencode/` materializes
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	14	45	1c7e230ff61e586c	R3:segment	// The source tree sits under `.skilled` or `.opencode`, or under `.skilled` with
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	15	4	09d97025993e7983	R3:segment	// `.opencode` linked to it, and the walk treats both names as the same tree.
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	25	18	23095a9d4b19571a	R1:path	const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	48	36	f1ed8bd4115ec388	R1:segment	const seat = mkdirp(join(repo, '.opencode', 'skills', 'sk-doc', 'create-diff'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	49	23	de6762c14454f57f	R1:segment	mkdirp(join(repo, '.opencode', 'skills', 'system-spec-kit'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	55	68	71a90121290c4d8c	R3:bare	describe('findAdvisorWorkspaceRoot — fallback never lands inside an .opencode tree', () => {
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	57	21	1aec1f386922dcd5	R1:segment	['skills', join('.opencode', 'skills', 'system-spec-kit')],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	58	27	42feff5463ed5e62	R1:segment	['skills, deep', join('.opencode', 'skills', 'sk-doc', 'create-diff', 'scripts')],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	59	22	28236d9fb6c7db0b	R1:segment	['runtime', join('.opencode', 'skills', 'system-skill-advisor', 'runtime')],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	61	23	1bf0995c116518d1	R1:segment	['commands', join('.opencode', 'commands', 'deep', 'assets')],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	62	18	2e153c518981595c	R1:segment	['bin', join('.opencode', 'bin', 'lib')],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	63	22	060a4afb509764d9	R1:segment	['plugins', join('.opencode', 'plugins', 'tests')],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	67	21	816a6df61f16ac1e	R3:bare	it(`hoists above .opencode for a start under ${label}`, () => {
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	73	33	80e91fec2c60de14	R3:bare	it('hoists above the OUTERMOST .opencode when a leak already nested one inside another', () => {
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	75	36	aad9f5604dccc75e	R1:segment	const seat = mkdirp(join(repo, '.opencode', 'skills', 'sk-doc', '.opencode', 'skills'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	75	69	aad9f5604dccc75e	R1:segment	const seat = mkdirp(join(repo, '.opencode', 'skills', 'sk-doc', '.opencode', 'skills'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	79	41	f73f8e76bf0ad557	R3:bare	it('never returns a path containing an .opencode segment, for any nested start', () => {
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	82	90	761e000de24d8ef1	R3:segment	expect(findAdvisorWorkspaceRoot(mkdirp(join(repo, rel))).split(sep)).not.toContain('.opencode');
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	88	63	eda765bedf4c7111	R3:bare	it('returns the start dir for a path with no sentinel and no .opencode segment', () => {
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	98	16	9a45bf1d847b19df	R3:segment	['today', ['.opencode']],
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	105	61	7cff895eb018a067	R3:segment	const skillDir = mkdirp(join(repo, layout === 'today' ? '.opencode' : '.skilled', 'skills', 'system-spec-kit'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	107	69	88e1d7023b5d9dcd	R3:segment	if (layout === 'whole-link') symlinkSync('.skilled', join(repo, '.opencode'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	126	63	e1a2156aa1e6605f	R3:segment	const skillDir = mkdirp(join(repo, layout === 'today' ? '.opencode' : '.skilled', 'skills', 'system-spec-kit'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	136	40	0d7f58724bc03c97	R1:segment	const skillDir = mkdirp(join(repo, '.opencode', 'skills', 'system-spec-kit'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	157	72	9d4415217fd72935	R3:bare	it('hoists above the OUTERMOST segment when a .skilled tree leaked an .opencode tree inside it', () => {
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	159	63	5a963583795a58d7	R1:segment	const seat = mkdirp(join(repo, '.skilled', 'skills', 'x', '.opencode', 'skills'));
.skilled/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts	174	38	c678cc4bd081bba0	R3:segment	expect(segments).not.toContain('.opencode');
.skilled/skills/system-spec-kit/runtime/cli/tests/gate-3-classifier.vitest.ts	624	88	7c0e432266a93dfc	R3:segment	if (layout === 'whole-link') fs.symlinkSync('.skilled', path.join(workspaceRoot, '.opencode'));
~~~~
