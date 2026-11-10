// ───────────────────────────────────────────────────────────────────
// MODULE: Sub-Track Fixture Tree
// ───────────────────────────────────────────────────────────────────
// Builds one specs/ tree that holds every shape a named sub-track can
// meet, so the track-level tools are all tested against the same layout:
//
//   <specs>/demo/                      track root
//   <specs>/demo/001-flat-probe/       flat packet directly in the track
//   <specs>/demo/sub/                  declared sub-track (level "sub-track")
//   <specs>/demo/sub/001-nested-probe/ phase parent inside the sub-track
//     001-phase-one/                 its one phase child
//   <specs>/demo/sub/z_archive/        the sub-track's own archive
//   <specs>/demo/loose/                undeclared non-numbered folder
//   <specs>/demo/linked -> ../../linked-target   symlinked sub-track
//
// The symlink target sits outside specs/, so a tool that follows it would
// count packets no track owns.

import fs from 'node:fs';
import path from 'node:path';

/* ───────────────────────────────────────────────────────────────
   1. WRITERS
──────────────────────────────────────────────────────────────── */

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function containerMetadata(id, children) {
  return {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.includes('/') ? id.split('/').slice(0, -1).join('/') : null,
    children_ids: children,
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { trigger_phrases: [], key_topics: [id], causal_summary: `Container folder for ${id}.` },
  };
}

function container(specsDir, id, level, children) {
  const dir = path.join(specsDir, id);
  writeJson(path.join(dir, 'description.json'), { level, specFolder: id, description: `Fixture ${level} ${id}.` });
  writeJson(path.join(dir, 'graph-metadata.json'), containerMetadata(id, children));
  return dir;
}

function packet(dir, title) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'spec.md'), `# ${title}\n`);
  return dir;
}

/* ───────────────────────────────────────────────────────────────
   2. BUILDER
──────────────────────────────────────────────────────────────── */

/**
 * Build the sub-track tree under `root`.
 * @param {string} root an empty directory; specs/ and linked-target/ are created in it
 * @param {{ declared?: boolean, flat?: boolean }} [options] declared=false leaves every
 *   children_ids list empty, which is the state a tool must repair. flat=false leaves out the
 *   flat packet, so the track holds sub-tracks only and is not mixed
 * @returns {{ specs: string, entries: Record<string, string> }}
 */
export function buildSubtrackTree(root, options = {}) {
  const declared = options.declared !== false;
  const withFlat = options.flat !== false;
  const specs = path.join(root, 'specs');
  const list = (ids) => (declared ? ids : []);

  container(specs, 'demo', 'track', list(withFlat ? ['demo/001-flat-probe', 'demo/sub'] : ['demo/sub']));
  const flat = withFlat ? packet(path.join(specs, 'demo', '001-flat-probe'), 'Flat probe') : null;

  const sub = container(specs, 'demo/sub', 'sub-track', list(['demo/sub/001-nested-probe']));
  const nested = packet(path.join(sub, '001-nested-probe'), 'Nested probe');
  const phase = packet(path.join(nested, '001-phase-one'), 'Phase one');
  const archive = path.join(sub, 'z_archive');
  packet(path.join(archive, '001-old-probe'), 'Archived probe');

  const loose = path.join(specs, 'demo', 'loose');
  fs.mkdirSync(loose, { recursive: true });
  fs.writeFileSync(path.join(loose, 'notes.md'), '# Loose notes\n');

  const target = path.join(root, 'linked-target');
  writeJson(path.join(target, 'description.json'), { level: 'sub-track', specFolder: 'demo/linked', description: 'Fixture symlinked sub-track.' });
  writeJson(path.join(target, 'graph-metadata.json'), containerMetadata('demo/linked', []));
  packet(path.join(target, '001-outside-probe'), 'Outside probe');
  const linked = path.join(specs, 'demo', 'linked');
  fs.symlinkSync(path.relative(path.dirname(linked), target), linked);

  return {
    specs,
    entries: { flat, sub, nested, phase, archive, loose, linked },
  };
}

/** Build a tree with flat tracks only, the layout every existing repository has. */
export function buildFlatTree(root) {
  const specs = path.join(root, 'specs');
  container(specs, 'alpha', 'track', ['alpha/001-one', 'alpha/002-two']);
  packet(path.join(specs, 'alpha', '001-one'), 'One');
  packet(path.join(specs, 'alpha', '002-two'), 'Two');
  container(specs, 'beta', 'track', ['beta/001-three']);
  packet(path.join(specs, 'beta', '001-three'), 'Three');
  return { specs };
}
