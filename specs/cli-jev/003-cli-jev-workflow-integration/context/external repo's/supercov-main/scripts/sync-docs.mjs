// One entry point for the CLI's bundled guides and the public website mirrors.
// Public feature documentation belongs in docs/, not in this maintenance script.
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.some(arg => arg !== '--check')) {
  console.error('Usage: node scripts/sync-docs.mjs [--check]');
  process.exit(2);
}
const website = resolve(process.env.SUPERCOV_SITE_DIR || resolve(repository, '../supercov-cloud'));
if (!existsSync(resolve(website, 'src/bin/sync_docs.rs'))) {
  console.error(`Website checkout not found at ${website}. Set SUPERCOV_SITE_DIR to supercov-cloud, or use npm run sync:rust-assets to update only the bundled CLI guides.`);
  process.exit(1);
}
const commands = [
  [process.execPath, [resolve(repository, 'scripts/sync-rust-package-assets.mjs'), ...args]],
  ['cargo', ['run', '--quiet', '--locked', '--manifest-path', resolve(website, 'Cargo.toml'), '--bin', 'sync-docs', ...(args.length ? ['--', ...args] : [])]],
];
for (const [command, commandArgs] of commands) {
  const result = spawnSync(command, commandArgs, {
    cwd: repository,
    env: { ...process.env, SUPERCOV_SOURCE_DIR: repository },
    stdio: 'inherit',
  });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log(args.includes('--check') ? 'CLI and website docs match the canonical sources.' : 'CLI and website docs updated. Run npm run docs:update in supercov-cloud to build and verify the website.');
