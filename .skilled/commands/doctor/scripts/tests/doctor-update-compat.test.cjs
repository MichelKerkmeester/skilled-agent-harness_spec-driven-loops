#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Update Compatibility Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the read-only compatibility phase of /doctor:update check against
// fixture repositories in temporary directories: the layout map owns the
// reported layout, the era report owns the signal counts, and neither command
// may write. The era report's own layout signal reads a v3 checkout whose
// specs is a symlink to .opencode/specs as v4, because it takes the alias for
// the absence of a legacy root, so layout assertions read the map.
//
// The compat action covers the mutating half: the action YAML and the router
// are read as contracts, and the layout map's steps are executed against
// classic and partial fixtures. The upgrade runs in the integration suite,
// because upgrade-legacy derives its repository from its own location and
// cannot target a fixture.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');
const { parse: parseYaml } = require('yaml');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const ASSET_ROOT = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'assets');
const SPEC_CLI_DIR = path.join(
  REPO_ROOT, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec',
);

// Node resolves an executed module through symlinks but leaves argv[1] as
// spelled, and the era report only runs when argv[1] is its real path; the
// layout map is imported by its real path for the same reason.
const LAYOUT_MAP_PATH = fs.realpathSync(path.join(SPEC_CLI_DIR, 'upgrade-legacy.mjs'));
const ERA_REPORT_PATH = fs.realpathSync(path.join(SPEC_CLI_DIR, 'repo-era.mjs'));

const CHECK_WORKFLOW = parseYaml(
  fs.readFileSync(path.join(ASSET_ROOT, 'doctor-update-check.yaml'), 'utf8'),
);
const COMPAT = CHECK_WORKFLOW.workflow.phase_3_compatibility;
const PRESENTATION = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-presentation.txt'), 'utf8',
);

// The mutating compat action workflow and the router that routes to it.
const COMPAT_ACTION_TEXT = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-compat-action.yaml'), 'utf8',
);
const COMPAT_ACTION = parseYaml(COMPAT_ACTION_TEXT);
const UPDATE_ROUTER = fs.readFileSync(
  path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'update.md'), 'utf8',
);

const LAYOUT_STATES = ['v3', 'partial', 'v4', 'none'];

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A packet written to the pre-v4 contract: a title-only spec frontmatter and
// two documents without any frontmatter, so the era report has missing
// frontmatter to count.
const PACKET_DOCUMENTS = {
  'spec.md': '---\ntitle: "Old packet"\n---\n\n# Old packet\n',
  'plan.md': '# Plan\n',
  'tasks.md': '# Tasks\n',
};

function writePacket(root, specsRoot, track, packet) {
  const directory = path.join(root, specsRoot, track, packet);
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, text] of Object.entries(PACKET_DOCUMENTS)) {
    fs.writeFileSync(path.join(directory, name), text);
  }
}

// The four checkout shapes the layout map distinguishes: a legacy root alone, a
// legacy root with specs linked to it, a v4 root alone, and both roots real.
const LAYOUT_BUILDERS = {
  legacy(root) {
    writePacket(root, '.opencode/specs', 'legacy-track', '001-old-packet');
  },
  classic(root) {
    LAYOUT_BUILDERS.legacy(root);
    fs.symlinkSync('.opencode/specs', path.join(root, 'specs'), 'dir');
  },
  v4(root) {
    writePacket(root, 'specs', 'legacy-track', '001-old-packet');
  },
  partial(root) {
    writePacket(root, '.opencode/specs', 'legacy-track', '001-old-packet');
    writePacket(root, 'specs', 'specs-track', '001-new-packet');
  },
};

function fixture(t, kind) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-update-compat-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // An isolated global config keeps the fixture independent of the machine: a
  // user-level ignore rule for specs/ would otherwise empty the era walk.
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: path.join(root, 'global.gitconfig'),
    GIT_CONFIG_NOSYSTEM: '1',
  };
  delete env.GIT_DIR;
  delete env.GIT_WORK_TREE;
  fs.writeFileSync(env.GIT_CONFIG_GLOBAL, '');

  LAYOUT_BUILDERS[kind](root);
  fs.mkdirSync(path.join(root, '.skilled'), { recursive: true });
  fs.writeFileSync(path.join(root, '.skilled', 'marker.txt'), 'doctor-update-compat fixture\n');

  const git = (...args) => execFileSync('git', args, { cwd: root, env, encoding: 'utf8' });
  git('init', '-q');
  git('add', '-A');
  git(
    '-c', 'user.name=Doctor Update Compat',
    '-c', 'user.email=doctor-update-compat@test.invalid',
    'commit', '-q', '-m', 'fixture',
  );

  return {
    root,
    git,
    era() {
      const result = spawnSync(process.execPath, [ERA_REPORT_PATH, '.'], {
        cwd: root, env, encoding: 'utf8',
      });
      assert.equal(result.status, 0, `era report failed: ${result.stderr}`);
      return JSON.parse(result.stdout);
    },
    status: () => git('status', '--porcelain'),
  };
}

let layoutMapModule = null;

// Imported once and cached. The module's direct-run guard compares real paths,
// so importing it never starts the CLI.
function loadLayoutMap() {
  if (layoutMapModule === null) {
    layoutMapModule = import(pathToFileURL(LAYOUT_MAP_PATH).href);
  }
  return layoutMapModule;
}

async function loadPlanLayoutMove() {
  const { planLayoutMove } = await loadLayoutMap();
  assert.equal(
    typeof planLayoutMove,
    'function',
    'upgrade-legacy.mjs must export planLayoutMove',
  );
  return planLayoutMove;
}

function fieldAt(object, fieldPath) {
  return fieldPath.split('.').reduce(
    (value, key) => (value === null || typeof value !== 'object' ? undefined : value[key]),
    object,
  );
}

// Every checkout file's identity, so "writes nothing" is checked against bytes
// rather than exit codes. .git is skipped: a status read may refresh git's own
// index cache, which is not a checkout file.
function snapshotTree(root) {
  const snapshot = new Map();
  const walk = (directory, prefix) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (relative === '.git') continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        snapshot.set(relative, `link:${fs.readlinkSync(absolute)}`);
      } else if (entry.isDirectory()) {
        walk(absolute, relative);
      } else if (entry.isFile()) {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
        snapshot.set(relative, `sha256:${digest}`);
      }
    }
  };
  walk(root, '');
  return snapshot;
}

// The file digests under one directory prefix, so a digest comparison asserts
// real bytes instead of passing vacuously on an empty selection.
function fileDigestsUnder(snapshot, prefix) {
  return [...snapshot].filter(
    ([relative, value]) => relative.startsWith(`${prefix}/`) && value.startsWith('sha256:'),
  );
}

// The body of one document section, cut at the next top-level heading so a
// contract assertion cannot read a neighbouring section's lines.
function sectionBody(document, heading) {
  const start = document.indexOf(heading);
  assert.notEqual(start, -1, `the document must carry the ${heading} section`);
  const body = document.slice(start + heading.length);
  const end = body.indexOf('\n## ');
  return end === -1 ? body : body.slice(0, end);
}

// The STATUS line one presentation section owns, so a terminal-status
// assertion cannot read another action's template.
function statusLineUnder(presentation, heading) {
  const line = sectionBody(presentation, heading)
    .split('\n')
    .find((candidate) => candidate.startsWith('STATUS='));
  assert.ok(line, `the ${heading} section must carry a STATUS line`);
  return line;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMMAND CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('the check runs both compatibility commands read-only', () => {
  assert.deepEqual(COMPAT.commands, {
    layout_map: 'node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --layout-map',
    era_report: 'node .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs .',
  });
  assert.deepEqual(CHECK_WORKFLOW.mutation_boundaries.allowed_targets, []);
  assert.match(COMPAT.json_policy, /--json/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. LAYOUT STATES ON FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

test('a v3 checkout reports layout v3 and its era signal counts', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  for (const kind of ['legacy', 'classic']) {
    const f = fixture(t, kind);
    assert.equal(planLayoutMove(f.root).state, 'v3', `${kind}: planLayoutMove state`);
    const era = f.era();
    for (const field of COMPAT.era_report_fields) {
      assert.equal(typeof fieldAt(era, field), 'number', `${kind}: era field ${field} must be a number`);
    }
    assert.ok(era.signals.frontmatter.missing > 0, `${kind}: the fixture must report missing frontmatter`);
  }
});

test('a v4 repository reports layout v4 and no move', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const layout = planLayoutMove(fixture(t, 'v4').root);
  assert.equal(layout.state, 'v4');
  assert.deepEqual(layout.moves, []);
  assert.deepEqual(layout.steps, []);
  assert.deepEqual(layout.collisions, []);
});

test('a partial move reports both roots', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const layout = planLayoutMove(fixture(t, 'partial').root);
  assert.equal(layout.state, 'partial');
  assert.deepEqual(layout.moves, [{ from: '.opencode/specs/legacy-track', to: 'specs/legacy-track' }]);
  assert.ok(
    layout.alreadyMoved.includes('specs/specs-track'),
    'the specs-only track must count as already moved',
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROUTING AND PRESENTATION
// ─────────────────────────────────────────────────────────────────────────────

test('every layout state has a check route and a presentation value', () => {
  const layoutLine = PRESENTATION.split('\n').find((line) => line.startsWith('Layout:'));
  assert.ok(layoutLine, 'the presentation must carry a Layout line');
  for (const state of LAYOUT_STATES) {
    assert.equal(typeof COMPAT.routing[state], 'string', `routing must cover ${state}`);
    assert.ok(COMPAT.routing[state].length > 0, `routing ${state} must name a next step`);
    assert.ok(layoutLine.includes(state), `the Layout line must show ${state}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. READ-ONLY PROOF
// ─────────────────────────────────────────────────────────────────────────────

test('the compatibility commands write nothing', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  for (const kind of ['legacy', 'classic', 'v4', 'partial']) {
    const f = fixture(t, kind);
    assert.equal(f.status(), '', `${kind}: the fixture must commit cleanly`);
    const before = snapshotTree(f.root);
    planLayoutMove(f.root);
    f.era();
    assert.deepEqual(snapshotTree(f.root), before, `${kind}: a compatibility command changed a fixture file`);
    assert.equal(f.status(), '', `${kind}: a compatibility command dirtied the checkout`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMPAT ACTION CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('the compat action previews before it asks and asks before it writes', () => {
  assert.deepEqual(Object.keys(COMPAT_ACTION.workflow), [
    'phase_1_preflight',
    'phase_2_layout_preview',
    'phase_3_move_approval',
    'phase_4_move',
    'phase_5_upgrade_preview',
    'phase_6_upgrade_approval',
    'phase_7_upgrade',
    'phase_8_summary',
  ]);

  // Exactly the move and the upgrade ask for a yes, and the raw text proves
  // both keys exist as workflow phases rather than as prose in a rule.
  const approvalKeys = COMPAT_ACTION_TEXT.match(/^\s{2}phase_[0-9]+_[a-z_]*approval:\s*$/gm) ?? [];
  assert.deepEqual(
    approvalKeys.map((line) => line.trim()),
    ['phase_3_move_approval:', 'phase_6_upgrade_approval:'],
  );

  assert.ok(
    COMPAT_ACTION.terminal_statuses.includes('STATUS=CANCELLED'),
    'the terminal statuses must cover an operator cancellation',
  );
  const statusLine = statusLineUnder(PRESENTATION, '### Compatibility result');
  for (const status of COMPAT_ACTION.terminal_statuses) {
    assert.ok(
      statusLine.includes(status.slice('STATUS='.length)),
      `the Compatibility result STATUS line must carry ${status}`,
    );
  }
});

test('the compat action runs the layout map and the upgrade commands', () => {
  assert.equal(
    COMPAT_ACTION.workflow.phase_2_layout_preview.commands.layout_map,
    'node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --layout-map',
  );
  assert.equal(
    COMPAT_ACTION.workflow.phase_5_upgrade_preview.commands.upgrade_dry_run,
    'node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs',
  );
  assert.equal(
    COMPAT_ACTION.workflow.phase_7_upgrade.commands.upgrade_apply,
    'node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --apply',
  );
  assert.ok(
    COMPAT_ACTION.mutation_boundaries.forbidden_targets.some((target) => target.includes('.skilled/')),
    'the forbidden targets must cover every path under .skilled/',
  );
});

test('the compat move log lives in the git directory', () => {
  // The git directory keeps the log out of git status and out of .skilled/,
  // so a recorded move never dirties a tracked path.
  assert.ok(
    COMPAT_ACTION.move_log.path.includes('git rev-parse --absolute-git-dir'),
    'the move log path must resolve through the git directory',
  );
  assert.ok(
    COMPAT_ACTION.move_log.path.includes('doctor-update-compat.log.jsonl'),
    'the move log must keep its name',
  );
  assert.deepEqual(COMPAT_ACTION.move_log.line_fields, ['run', 'event', 'step', 'argv', 'at']);
  for (const event of ['step-started', 'step-done', 'step-failed', 'run-complete']) {
    assert.ok(
      COMPAT_ACTION.move_log.events.includes(event),
      `the move log events must cover ${event}`,
    );
  }
});

test('the router documents the compat path with declared flags only', () => {
  const section = sectionBody(UPDATE_ROUTER, '## 7. EXTERNAL-USER COMPATIBILITY PATH');
  const forms = [...section.matchAll(/\/doctor:update compat[^\n`]*/g)].map((match) => match[0]);
  assert.ok(
    forms.some((form) => form.includes('--dry-run')),
    'the section must document the dry-run preview',
  );
  assert.ok(
    forms.some((form) => form.trim() === '/doctor:update compat'),
    'the section must document the full run',
  );

  const declared = new Set(
    Object.keys(COMPAT_ACTION.user_inputs)
      .filter((key) => key !== 'action')
      .map((key) => `--${key.replace(/_/g, '-')}`),
  );
  for (const form of forms) {
    for (const flag of form.match(/--[a-z-]+/g) ?? []) {
      assert.ok(declared.has(flag), `${form} must use a declared compat flag, not ${flag}`);
    }
  }

  assert.ok(section.includes('upgrade-legacy.manifest.json'), 'the section must name the upgrade manifest');
  assert.ok(section.includes('doctor-update-compat.log.jsonl'), 'the section must name the move log');
  assert.ok(section.includes('clean'), 'the section must tell the operator to leave the roots clean');
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. MOVE EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

test('the planned steps move a classic v3 checkout to v4', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'classic');
  const planned = planLayoutMove(f.root);
  assert.equal(planned.state, 'v3');
  assert.deepEqual(
    planned.steps.map((step) => step.id),
    ['remove-specs-link', 'move-tree', 'link-legacy-path'],
  );

  const recordedFiles = fileDigestsUnder(snapshotTree(f.root), '.opencode/specs');
  assert.ok(recordedFiles.length > 0, 'the classic fixture must hold files under .opencode/specs');

  for (const step of planned.steps) {
    execFileSync(step.argv[0], step.argv.slice(1), { cwd: f.root });
  }

  assert.ok(fs.lstatSync(path.join(f.root, 'specs')).isDirectory(), 'specs must be a real directory');
  const legacyLink = path.join(f.root, '.opencode', 'specs');
  assert.ok(fs.lstatSync(legacyLink).isSymbolicLink(), '.opencode/specs must be a symlink');
  assert.equal(fs.readlinkSync(legacyLink), '../specs');

  const after = snapshotTree(f.root);
  for (const [relative, digest] of recordedFiles) {
    const moved = relative.replace('.opencode/specs/', 'specs/');
    assert.equal(after.get(moved), digest, `${relative} must keep its bytes at ${moved}`);
  }

  const layout = planLayoutMove(f.root);
  assert.equal(layout.state, 'v4');
  assert.deepEqual(layout.steps, []);
  assert.equal(
    f.git('status', '--porcelain', '--', '.skilled'),
    '',
    'the move must leave .skilled untouched',
  );
});

test('the planned steps finish a partial move', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'partial');
  const planned = planLayoutMove(f.root);
  assert.equal(planned.state, 'partial');
  assert.deepEqual(planned.collisions, []);

  const before = snapshotTree(f.root);
  for (const step of planned.steps) {
    execFileSync(step.argv[0], step.argv.slice(1), { cwd: f.root });
  }

  const layout = planLayoutMove(f.root);
  assert.equal(layout.state, 'v4');
  assert.deepEqual(layout.steps, []);

  const after = snapshotTree(f.root);
  for (const entry of planned.alreadyMoved) {
    const files = fileDigestsUnder(before, entry);
    assert.ok(files.length > 0, `${entry} must hold files`);
    for (const [relative, digest] of files) {
      assert.equal(after.get(relative), digest, `${relative} must keep its bytes`);
    }
  }
  for (const { from, to } of planned.moves) {
    const files = fileDigestsUnder(before, from);
    assert.ok(files.length > 0, `${from} must hold files`);
    for (const [relative, digest] of files) {
      const moved = `${to}${relative.slice(from.length)}`;
      assert.equal(after.get(moved), digest, `${relative} must keep its bytes at ${moved}`);
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. COMPAT EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

test('a dirty spec root blocks the move before any step runs', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'classic');
  const dirtyCheck = COMPAT_ACTION.workflow.phase_2_layout_preview.dirty_check_command.split(' ');
  assert.equal(dirtyCheck[0], 'git', 'the dirty check must be a git command');
  const dirty = () => f.git(...dirtyCheck.slice(1));

  assert.equal(dirty(), '', 'a clean classic fixture must report no dirty spec paths');

  fs.appendFileSync(
    path.join(f.root, '.opencode', 'specs', 'legacy-track', '001-old-packet', 'plan.md'),
    '\nUncommitted line.\n',
  );
  assert.notEqual(dirty(), '', 'an uncommitted legacy edit must be reported');
  assert.equal(planLayoutMove(f.root).state, 'v3', 'the fixture must have a move to block');

  const refusal = COMPAT_ACTION.workflow.phase_2_layout_preview.dirty_refusal;
  assert.ok(refusal.includes('STATUS=BLOCKED'), 'the refusal must stop the run as blocked');
  assert.ok(
    sectionBody(PRESENTATION, '### Compatibility refusals').includes('before-image'),
    'the refusal must give its reason, that the move keeps no before-image',
  );
});

test('a tree dirtied after the move approval is refused before the move runs', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'classic');
  const preview = COMPAT_ACTION.workflow.phase_2_layout_preview;
  const move = COMPAT_ACTION.workflow.phase_4_move;

  // The move is approved on a clean tree: steps are planned and the check
  // that guarded the approval passes.
  const planned = planLayoutMove(f.root);
  assert.equal(planned.state, 'v3', 'the fixture must have a move to run');
  assert.ok(planned.steps.length > 0, 'the fixture must plan move steps');
  assert.equal(
    move.dirty_check_command,
    preview.dirty_check_command,
    'the move phase must re-run the same dirty check',
  );
  assert.equal(
    move.dirty_refusal,
    preview.dirty_refusal,
    'the move phase must refuse with the same refusal text',
  );
  const dirtyCheck = move.dirty_check_command.split(' ');
  assert.equal(dirtyCheck[0], 'git', 'the move dirty check must be a git command');
  const dirty = () => f.git(...dirtyCheck.slice(1));
  assert.equal(dirty(), '', 'the approved tree must be clean at approval time');

  // The tree turns dirty between the approval and the move.
  fs.appendFileSync(
    path.join(f.root, '.opencode', 'specs', 'legacy-track', '001-old-packet', 'plan.md'),
    '\nUncommitted line.\n',
  );
  const dirtied = snapshotTree(f.root);
  assert.notEqual(dirty(), '', 'the re-check must see the late edit');

  // The refusal fires before the first step and appends no log line, so a
  // refused run cannot read as an interrupted one.
  assert.ok(
    move.dirty_refusal.includes('STATUS=BLOCKED'),
    'the move refusal must stop the run as blocked',
  );
  assert.match(
    move.logging,
    /dirty-roots refusal appends no line/,
    'a refused move must log nothing as moved',
  );

  // Nothing moved: the roots keep their shape, the late edit stays at the
  // legacy path, and the re-check itself writes nothing to the checkout.
  assert.deepEqual(snapshotTree(f.root), dirtied, 'the re-check must write nothing');
  assert.equal(planLayoutMove(f.root).state, 'v3', 'the tree must still owe the move');
  assert.ok(
    fs.lstatSync(path.join(f.root, 'specs')).isSymbolicLink(),
    'specs must still be the legacy link, so no step ran',
  );
  assert.ok(
    fs.lstatSync(path.join(f.root, '.opencode', 'specs')).isDirectory(),
    '.opencode/specs must still be the real root, so no step ran',
  );
  assert.ok(
    fs.readFileSync(
      path.join(f.root, '.opencode', 'specs', 'legacy-track', '001-old-packet', 'plan.md'),
      'utf8',
    ).includes('Uncommitted line.'),
    'the dirtied packet must stay at the legacy path',
  );
  const gitDir = f.git('rev-parse', '--absolute-git-dir').trim();
  assert.equal(
    fs.existsSync(path.join(gitDir, 'doctor-update-compat.log.jsonl')),
    false,
    'a refused run must append no log line',
  );
});

test('an interrupted classic move resumes from the recomputed map', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'classic');

  const planned = planLayoutMove(f.root);
  const [removeLink] = planned.steps;
  assert.equal(removeLink.id, 'remove-specs-link', 'the first step must remove the specs link');
  execFileSync(removeLink.argv[0], removeLink.argv.slice(1), { cwd: f.root });

  const afterUnlink = planLayoutMove(f.root);
  assert.deepEqual(
    afterUnlink.steps.map((step) => step.id),
    ['move-tree', 'link-legacy-path'],
    'the recomputed map must list only the steps still owed',
  );

  const moveTree = afterUnlink.steps[0];
  execFileSync(moveTree.argv[0], moveTree.argv.slice(1), { cwd: f.root });

  // The moved tree looks finished, but the legacy link is still owed; only
  // the move log can tell that apart from a completed move.
  const afterMove = planLayoutMove(f.root);
  assert.equal(afterMove.state, 'v4');
  assert.deepEqual(afterMove.steps, []);
  assert.equal(fs.existsSync(path.join(f.root, '.opencode', 'specs')), false);

  assert.ok(
    COMPAT_ACTION.workflow.phase_1_preflight.recovery.includes('link-legacy-path'),
    'the recovery rule must name the owed link step',
  );

  const linkLegacy = afterUnlink.steps[1];
  assert.equal(linkLegacy.id, 'link-legacy-path');
  execFileSync(linkLegacy.argv[0], linkLegacy.argv.slice(1), { cwd: f.root });
  assert.equal(fs.readlinkSync(path.join(f.root, '.opencode', 'specs')), '../specs');
});

test('an interrupted move that stopped before the legacy link is not treated as finished', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'classic');

  // Stop after the moves, leaving the link step owed, as an interrupted run
  // would: every planned step but the last one runs.
  const planned = planLayoutMove(f.root);
  const owed = planned.steps[planned.steps.length - 1];
  assert.equal(owed.id, 'link-legacy-path');
  for (const step of planned.steps.slice(0, -1)) {
    execFileSync(step.argv[0], step.argv.slice(1), { cwd: f.root });
  }

  // The recomputed map reads v4 with no steps and no legacy root, so the
  // finished-looking tree cannot show that the link step is still owed.
  const recomputed = planLayoutMove(f.root);
  assert.equal(recomputed.state, 'v4');
  assert.deepEqual(recomputed.steps, []);
  assert.equal(fs.existsSync(path.join(f.root, '.opencode', 'specs')), false);

  // Record the interrupted run the way phase_4_move's logging rule writes it:
  // the done steps, then step-started for the owed step, with no step-done and
  // no run-complete.
  const run = 'interrupted-fixture-run';
  const at = '2026-01-01T00:00:00.000Z';
  const logLine = (event, step) => JSON.stringify({
    run,
    event,
    step: step ? step.id : null,
    argv: step ? step.argv : null,
    at,
  }) + '\n';
  const gitDir = f.git('rev-parse', '--absolute-git-dir').trim();
  const logPath = path.join(gitDir, 'doctor-update-compat.log.jsonl');
  let log = logLine('run-started', null);
  for (const step of planned.steps.slice(0, -1)) {
    log += logLine('step-started', step) + logLine('step-done', step);
  }
  log += logLine('step-started', owed);
  fs.writeFileSync(logPath, log);

  // The log, read through the declared line fields, shows the run as
  // interrupted and names the link step as the only step still owed.
  const entries = fs.readFileSync(logPath, 'utf8').trim().split('\n').map(JSON.parse);
  assert.ok(
    !entries.some((entry) => entry.event === 'run-complete'),
    'the newest run must read as interrupted',
  );
  const doneSteps = new Set(
    entries.filter((entry) => entry.event === 'step-done').map((entry) => entry.step),
  );
  assert.deepEqual(
    entries
      .filter((entry) => entry.event === 'step-started' && !doneSteps.has(entry.step))
      .map((entry) => entry.step),
    ['link-legacy-path'],
    'the log must show the link step as the only step still owed',
  );

  // The contract must not treat the v4 shape as finished when the move log
  // owes a step: the v4 handling defers to the recovery, and both skip rules
  // require that no recovery step is owed.
  const v4 = COMPAT_ACTION.workflow.phase_2_layout_preview.state_handling.v4;
  assert.match(v4, /interrupted/, 'the v4 handling must defer to the recovery');
  assert.match(v4, /link-legacy-path/, 'the v4 handling must name the owed step');
  assert.match(v4, /phase_3_move_approval/, 'the v4 handling must keep the move approval');
  for (const phase of ['phase_3_move_approval', 'phase_4_move']) {
    const skip = COMPAT_ACTION.workflow[phase].skip_when;
    assert.notEqual(
      skip,
      'layout state is v4 or none',
      `${phase} must not skip a v4 tree unconditionally`,
    );
    assert.match(
      skip,
      /no recovery step is owed/,
      `${phase} must skip only when no recovery step is owed`,
    );
  }
  assert.ok(
    COMPAT_ACTION.workflow.phase_1_preflight.recovery.includes('phase_3_move_approval'),
    'the recovery must keep the move approval for the owed step',
  );
});

test('an interrupted partial move names the track already moved', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'partial');
  writePacket(f.root, '.opencode/specs', 'legacy-track-b', '001-old-packet');

  const planned = planLayoutMove(f.root);
  assert.equal(planned.moves.length, 2, 'the fixture must plan two legacy tracks to move');

  const [first] = planned.steps;
  assert.equal(first.argv[0], 'mv', 'the first step must move the first legacy track');
  execFileSync(first.argv[0], first.argv.slice(1), { cwd: f.root });

  const layout = planLayoutMove(f.root);
  assert.equal(layout.state, 'partial');
  assert.ok(
    layout.alreadyMoved.includes(first.argv[2]),
    'the moved track must read as already moved',
  );
  assert.deepEqual(
    layout.moves,
    [{ from: '.opencode/specs/legacy-track-b', to: 'specs/legacy-track-b' }],
    'exactly one legacy track must remain to move',
  );
});

test('collisions stop the move and list both paths with their reasons', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'partial');

  // A packet file present on both sides with different bytes: the move cannot
  // choose a winner, so it is a collision.
  const sharedPacket = ['both-track', '001-old-packet'];
  for (const side of ['.opencode/specs', 'specs']) {
    fs.mkdirSync(path.join(f.root, side, ...sharedPacket), { recursive: true });
  }
  fs.writeFileSync(path.join(f.root, '.opencode', 'specs', ...sharedPacket, 'spec.md'), 'legacy copy\n');
  fs.writeFileSync(path.join(f.root, 'specs', ...sharedPacket, 'spec.md'), 'current copy\n');

  // One name is a file on the legacy side and a directory on the current side.
  fs.writeFileSync(path.join(f.root, '.opencode', 'specs', 'type-track'), 'legacy file\n');
  fs.mkdirSync(path.join(f.root, 'specs', 'type-track'), { recursive: true });

  // One name differs only in case. The two entries sit under different
  // parents, so even a case-insensitive file system can hold both.
  fs.mkdirSync(path.join(f.root, '.opencode', 'specs', 'Track'), { recursive: true });
  fs.mkdirSync(path.join(f.root, 'specs', 'track'), { recursive: true });

  const layout = planLayoutMove(f.root);
  assert.equal(layout.state, 'partial');
  assert.deepEqual(layout.steps, []);
  assert.deepEqual(layout.collisions, [
    { from: '.opencode/specs/Track', to: 'specs/track', reason: 'case-only-difference' },
    {
      from: '.opencode/specs/both-track/001-old-packet/spec.md',
      to: 'specs/both-track/001-old-packet/spec.md',
      reason: 'exists-in-both',
    },
    { from: '.opencode/specs/type-track', to: 'specs/type-track', reason: 'type-mismatch' },
  ]);
  assert.ok(
    PRESENTATION.includes('| From | To | Reason |'),
    'the presentation must carry the collision table header',
  );
});

test('a move step that cannot complete stops the run and reports the failed step', async (t) => {
  const planLayoutMove = await loadPlanLayoutMove();
  const f = fixture(t, 'partial');
  const planned = planLayoutMove(f.root);
  assert.equal(planned.state, 'partial', 'the fixture must have a move to run');
  assert.ok(planned.steps.length > 1, 'the fixture must plan later steps after the move');
  const [first] = planned.steps;
  assert.equal(first.id, 'move-1', 'the first step must move the first legacy track');
  assert.deepEqual(first.argv, ['mv', '.opencode/specs/legacy-track', 'specs/legacy-track']);

  // The destination is replaced by a plain file after the plan is approved,
  // the kind of late worktree change a step can still meet: a directory move
  // refuses to overwrite it.
  fs.writeFileSync(
    path.join(f.root, 'specs', 'legacy-track'),
    'a plain file where the track should land\n',
  );
  const obstructed = snapshotTree(f.root);

  // The move runs each step in order and stops at the first failure, so the
  // loop models the run rather than running every step regardless.
  let failed = null;
  for (const step of planned.steps) {
    const result = spawnSync(
      step.argv[0], step.argv.slice(1), { cwd: f.root, encoding: 'utf8' },
    );
    if (result.status !== 0) {
      failed = { step, result };
      break;
    }
  }
  assert.ok(failed, 'the obstructed destination must fail the move step');
  assert.equal(failed.step.id, 'move-1', 'the first step must be the one that failed');
  assert.ok(failed.result.stderr.trim().length > 0, 'the failed step must print its reason');

  // A failed step moves nothing: the tree is byte-identical to the
  // obstruction, the legacy track is still in place, and the move is owed.
  assert.deepEqual(snapshotTree(f.root), obstructed, 'the failed move must change nothing');
  assert.ok(
    fs.statSync(path.join(f.root, '.opencode', 'specs', 'legacy-track')).isDirectory(),
    'the failed move must leave the legacy track in place',
  );
  assert.equal(planLayoutMove(f.root).state, 'partial', 'the tree must still owe the move');

  // The failure rule must report the step and stop the run, and the
  // presentation prints the failed state beside the rollback block. One key
  // owns the rule: a second copy would drift from it.
  const move = COMPAT_ACTION.workflow.phase_4_move;
  assert.equal(move.step_failure, undefined, 'the failed-step rule must live in one key');
  for (const phrase of ['step-failed', 'STATUS=FAILED', 'step id', 'argv', 'exit code']) {
    assert.ok(
      move.on_step_failure.includes(phrase),
      `the failed-step rule must report the ${phrase}`,
    );
  }
  assert.match(move.on_step_failure, /run no further step/, 'a failure must stop the run');
  assert.match(move.on_step_failure, /Never retry a step automatically/, 'a failure must not retry');
  assert.ok(
    move.on_step_failure.includes('Compatibility rollback block'),
    'a failure must show the rollback block',
  );

  const stepLogLine = sectionBody(PRESENTATION, '### Move step log')
    .split('\n')
    .find((line) => line.startsWith('Step '));
  assert.ok(stepLogLine, 'the presentation must carry the move step log line');
  assert.ok(stepLogLine.includes('failed'), 'the step log must show a failed step');
});

test('failed packets are parsed from the lines upgrade-legacy prints', () => {
  const source = fs.readFileSync(LAYOUT_MAP_PATH, 'utf8');
  const prefixes = COMPAT_ACTION.workflow.phase_7_upgrade.result_parsing.prefixes;
  assert.ok(prefixes.length > 0, 'the action must declare its result prefixes');
  for (const prefix of prefixes) {
    assert.ok(source.includes(prefix), `upgrade-legacy must print the ${prefix.trim()} prefix`);
  }

  const onFailure = COMPAT_ACTION.workflow.phase_7_upgrade.on_failure;
  assert.ok(onFailure.still_failing.includes('STATUS=PARTIAL'), 'a partial repair must end as partial');
  assert.ok(onFailure.manifest_refusal.includes('STATUS=FAILED'), 'a manifest refusal must end as failed');
  assert.ok(
    sectionBody(PRESENTATION, '### Failed packets').includes('--include-archive'),
    'the failed-packet route must name the archive rerun',
  );
});

test('units that still need their release update block the action', () => {
  const releaseGate = COMPAT_ACTION.workflow.phase_1_preflight.release_gate;
  assert.match(releaseGate, /\bupdate\b/, 'the release gate must name the update status');
  assert.match(releaseGate, /\bnew\b/, 'the release gate must name the new status');

  const unitStatuses = fieldAt(CHECK_WORKFLOW, 'field_handling.status_values.unit');
  assert.ok(Array.isArray(unitStatuses), 'the check must declare its unit statuses');
  for (const status of ['update', 'new']) {
    assert.ok(unitStatuses.includes(status), `the unit statuses must cover ${status}`);
  }
});
