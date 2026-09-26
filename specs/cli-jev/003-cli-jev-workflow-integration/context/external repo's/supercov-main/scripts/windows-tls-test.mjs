// Windows must not need a C compiler to build Supercov.
//
// `ring` is why it ever did. rustls needs a crypto provider, every provider it
// has compiles C, and on `aarch64-pc-windows-msvc` that C is built by clang --
// so the build needed LLVM on PATH, ahead of whatever else had put a clang
// there. Installing Ruby was enough to break it, and `cargo install supercov`
// broke with it.
//
// Windows uses schannel instead. That is one `features` line away from being
// undone by a dependency nobody inspected, and the failure would not show on
// Linux or macOS, so it is asserted here rather than left to a reviewer.

import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Resolving a target needs no toolchain for it installed, so this runs
// anywhere -- which is the point: the platform it protects is not the platform
// most of this project is developed on.
function resolves(target) {
  const result = spawnSync(
    'cargo',
    ['tree', '-p', 'supercov', '--target', target, '--prefix', 'none', '--no-dedupe'],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 0, `cargo tree ${target}\n${result.stderr}`);
  return result.stdout;
}

const failures = [];
for (const target of ['aarch64-pc-windows-msvc', 'x86_64-pc-windows-msvc']) {
  const tree = resolves(target);
  if (/^ring v/m.test(tree)) {
    failures.push(
      `${target} pulls in ring, so building it needs a C compiler and the right clang first on PATH`,
    );
  }
  if (!/^schannel v/m.test(tree)) {
    failures.push(`${target} does not use schannel, so it is not using the TLS Windows already has`);
  }
}

// And the reason the split exists rather than moving everything to native-tls:
// the static musl builds are what rustls makes possible.
const musl = resolves('x86_64-unknown-linux-musl');
if (!/^rustls v/m.test(musl)) {
  failures.push('x86_64-unknown-linux-musl no longer uses rustls, which the static builds rest on');
}

assert.deepEqual(failures, [], `\n  - ${failures.join('\n  - ')}\n`);
console.log('[windows-tls] Windows builds need no C compiler; musl keeps rustls');
