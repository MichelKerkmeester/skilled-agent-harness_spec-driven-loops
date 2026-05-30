// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: hf-model-server perimeter guards                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Covers 031/009 Family-4 perimeter findings:                                ║
// ║   DR-002-P1-001 — tcp:// bind must enforce loopback (or require auth).     ║
// ║   DR-001-P2-001 — direct-startup EADDRINUSE unlink must assert socket-dir  ║
// ║                    ownership AND refuse to unlink a live-resident socket.  ║
// ║                                                                            ║
// ║ Deterministic: injects connect/fs/getuid/env + a fake http-like server.   ║
// ║ No real sockets, no real filesystem ownership, no sleeps.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';

// Resolve the CJS module under test by walking from this test file to the repo's
// .opencode/bin/ directory. Computed at runtime so the relative depth cannot be
// guessed wrong, and so the test stays valid if the test tree is reorganized.
const here = dirname(fileURLToPath(import.meta.url));
// here = .opencode/skills/system-spec-kit/mcp_server/tests/embedders
//   ..(embedders→tests) ..(→mcp_server) ..(→system-spec-kit) ..(→skills) ..(→.opencode) /bin
const moduleUnderTest = resolve(here, '..', '..', '..', '..', '..', 'bin', 'hf-model-server.cjs');
const requireCjs = createRequire(import.meta.url);

type PerimeterModule = {
  isLoopbackHost: (host: string) => boolean;
  assertLoopbackBindAllowed: (target: string, options?: { env?: NodeJS.ProcessEnv }) => void;
  assertSocketDirOwnership: (
    target: string,
    options?: { fs?: unknown; getuid?: () => number },
  ) => void;
  probeSocketResident: (
    target: string,
    options?: { connect?: unknown; probeTimeoutMs?: number },
  ) => Promise<boolean>;
  listenHttpServer: (
    server: unknown,
    target: string,
    options?: Record<string, unknown>,
  ) => Promise<string>;
  SOCKET_RESIDENT_PROBE_TIMEOUT_MS: number;
};

const mod = requireCjs(moduleUnderTest) as PerimeterModule;

// ── Fakes ───────────────────────────────────────────────────────────────────

/**
 * Minimal http.Server stand-in for listenHttpServer. The first listen() attempt
 * emits EADDRINUSE (the "stale/resident socket already exists" case); subsequent
 * attempts succeed. Tracks how many times listen() was actually invoked so we can
 * prove whether the unlink+relisten path ran or was refused. address() returns
 * null so that, for a UDS target, getListeningEndpoint() returns the socket path
 * (the real behavior for a Unix-domain listener).
 */
function makeFakeServer(opts: { firstError?: NodeJS.ErrnoException | null } = {}) {
  const emitter = new EventEmitter() as EventEmitter & {
    listen: (...args: unknown[]) => void;
    address: () => null;
    listenCalls: number;
  };
  let attempts = 0;
  emitter.listenCalls = 0;
  emitter.listen = (..._args: unknown[]) => {
    emitter.listenCalls += 1;
    attempts += 1;
    if (attempts === 1 && opts.firstError) {
      queueMicrotask(() => emitter.emit('error', opts.firstError));
      return;
    }
    queueMicrotask(() => emitter.emit('listening'));
  };
  // A UDS listener's address() is the socket path string; getListeningEndpoint
  // only special-cases an object address, so returning null yields the target.
  emitter.address = () => null;
  return emitter;
}

const eaddrinuse = (): NodeJS.ErrnoException => {
  const e = new Error('listen EADDRINUSE') as NodeJS.ErrnoException;
  e.code = 'EADDRINUSE';
  return e;
};

// A socket-dir stat that is owned by the current uid and is NOT group/world-writable.
const safeDirStat = (uid: number) => ({ uid, mode: 0o040700 });

// listenHttpServer routes ALL fs side-effects (mkdir/unlink/chmod) through options.fs, so the
// integrated cases stay fully hermetic — no real directory or socket is created. A fixed,
// non-privileged path keeps the assertions deterministic.
const UDS_TARGET = '/run/speckit-test/hf-embed.sock';

// Build an injectable fs with no-op mkdir/chmod and a tracked unlink. statSync is supplied per
// test (safe by default).
function makeFs(opts: { statSync?: () => unknown } = {}) {
  const calls = { unlinked: false };
  const fsImpl = {
    statSync: opts.statSync ?? (() => safeDirStat(1000)),
    mkdirSync: () => undefined,
    chmodSync: () => undefined,
    unlinkSync: () => {
      calls.unlinked = true;
    },
  } as unknown;
  return { fsImpl, calls };
}

// A fake connector whose socket immediately accepts the connection => live resident.
function residentConnect() {
  return (_opts: unknown, onConnect: () => void) => {
    const s = new EventEmitter() as EventEmitter & {
      destroy: () => void;
      setTimeout: (ms: number, cb: () => void) => void;
    };
    s.destroy = () => undefined;
    s.setTimeout = () => undefined;
    queueMicrotask(() => onConnect());
    return s;
  };
}

// A fake connector whose socket errors ECONNREFUSED => stale (safe to reclaim).
function refusedConnect() {
  return (_opts: unknown, _onConnect: () => void) => {
    const s = new EventEmitter() as EventEmitter & {
      destroy: () => void;
      setTimeout: (ms: number, cb: () => void) => void;
    };
    s.destroy = () => undefined;
    s.setTimeout = () => undefined;
    const err = Object.assign(new Error('refused'), { code: 'ECONNREFUSED' });
    queueMicrotask(() => s.emit('error', err));
    return s;
  };
}

// ── DR-002-P1-001: loopback enforcement on tcp:// bind ────────────────────────

describe('DR-002-P1-001 tcp:// loopback bind enforcement', () => {
  it('treats 127.0.0.1 / ::1 / localhost as loopback and everything else as non-loopback', () => {
    expect(mod.isLoopbackHost('127.0.0.1')).toBe(true);
    expect(mod.isLoopbackHost('::1')).toBe(true);
    expect(mod.isLoopbackHost('localhost')).toBe(true);
    expect(mod.isLoopbackHost('')).toBe(true); // empty defaults to loopback bind
    expect(mod.isLoopbackHost('0.0.0.0')).toBe(false);
    expect(mod.isLoopbackHost('192.168.1.50')).toBe(false);
  });

  it('allows a loopback tcp:// bind', () => {
    expect(() => mod.assertLoopbackBindAllowed('tcp://127.0.0.1:9999', { env: {} })).not.toThrow();
  });

  it('REFUSES a non-loopback tcp:// bind with no auth opt-in', () => {
    // Without the fix the verbatim host binds with no guard at all (no throw).
    expect(() => mod.assertLoopbackBindAllowed('tcp://0.0.0.0:9999', { env: {} })).toThrowError(
      /non-loopback/i,
    );
    let code: string | undefined;
    try {
      mod.assertLoopbackBindAllowed('tcp://0.0.0.0:9999', { env: {} });
    } catch (e) {
      code = (e as NodeJS.ErrnoException).code;
    }
    expect(code).toBe('EPERM_NONLOOPBACK_BIND');
  });

  it('refuses a remote bind when opt-in is set but no auth token is provided', () => {
    expect(() =>
      mod.assertLoopbackBindAllowed('tcp://0.0.0.0:9999', {
        env: { HF_EMBED_ALLOW_REMOTE_BIND: '1' },
      }),
    ).toThrowError(/non-loopback/i);
  });

  it('allows a remote bind only when opt-in AND a non-empty auth token are both present', () => {
    expect(() =>
      mod.assertLoopbackBindAllowed('tcp://0.0.0.0:9999', {
        env: { HF_EMBED_ALLOW_REMOTE_BIND: '1', HF_EMBED_AUTH_TOKEN: 's3cret' },
      }),
    ).not.toThrow();
  });

  it('ignores non-tcp (UDS path) targets', () => {
    expect(() => mod.assertLoopbackBindAllowed('/tmp/some/hf-embed.sock', { env: {} })).not.toThrow();
  });
});

// ── DR-001-P2-001: socket-dir ownership assertion ─────────────────────────────

describe('DR-001-P2-001 socket-dir ownership assertion', () => {
  const target = '/var/run/speckit/hf-embed.sock';

  it('passes when the dir is owned by the current uid and not other-writable', () => {
    const fsImpl = { statSync: () => safeDirStat(1000) } as unknown;
    expect(() =>
      mod.assertSocketDirOwnership(target, { fs: fsImpl, getuid: () => 1000 }),
    ).not.toThrow();
  });

  it('throws when the dir is owned by a different uid', () => {
    const fsImpl = { statSync: () => ({ uid: 0, mode: 0o040700 }) } as unknown;
    let code: string | undefined;
    try {
      mod.assertSocketDirOwnership(target, { fs: fsImpl, getuid: () => 1000 });
    } catch (e) {
      code = (e as NodeJS.ErrnoException).code;
    }
    expect(code).toBe('EPERM_SOCKET_DIR_OWNER');
  });

  it('throws when the dir is group/world-writable', () => {
    const fsImpl = { statSync: () => ({ uid: 1000, mode: 0o040777 }) } as unknown;
    let code: string | undefined;
    try {
      mod.assertSocketDirOwnership(target, { fs: fsImpl, getuid: () => 1000 });
    } catch (e) {
      code = (e as NodeJS.ErrnoException).code;
    }
    expect(code).toBe('EPERM_SOCKET_DIR_PERMS');
  });

  it('is a no-op when the dir does not exist yet (ENOENT)', () => {
    const enoent = Object.assign(new Error('no dir'), { code: 'ENOENT' });
    const fsImpl = {
      statSync: () => {
        throw enoent;
      },
    } as unknown;
    expect(() =>
      mod.assertSocketDirOwnership(target, { fs: fsImpl, getuid: () => 1000 }),
    ).not.toThrow();
  });
});

// ── DR-001-P2-001: live-resident probe ────────────────────────────────────────

describe('DR-001-P2-001 live-resident socket probe', () => {
  const target = '/var/run/speckit/hf-embed.sock';

  it('reports resident=true when a peer accepts the connection', async () => {
    await expect(mod.probeSocketResident(target, { connect: residentConnect() })).resolves.toBe(
      true,
    );
  });

  it('reports resident=false when the connection is refused (stale socket)', async () => {
    await expect(mod.probeSocketResident(target, { connect: refusedConnect() })).resolves.toBe(
      false,
    );
  });

  it('reports resident=false on probe timeout (does not hang)', async () => {
    const connect = (_opts: unknown, _onConnect: () => void) => {
      const s = new EventEmitter() as EventEmitter & {
        destroy: () => void;
        setTimeout: (ms: number, cb: () => void) => void;
      };
      s.destroy = () => undefined;
      // Fire the timeout callback so the probe resolves deterministically & fast.
      s.setTimeout = (_ms: number, cb: () => void) => {
        queueMicrotask(() => cb());
      };
      return s;
    };
    await expect(mod.probeSocketResident(target, { connect, probeTimeoutMs: 1 })).resolves.toBe(
      false,
    );
  });
});

// ── DR-001-P2-001: integrated listenHttpServer guard on the direct-startup path ─

describe('DR-001-P2-001 listenHttpServer refuses to unlink a live-resident UDS', () => {
  it('REFUSES to unlink and re-surfaces EADDRINUSE when the socket is live-resident', async () => {
    const server = makeFakeServer({ firstError: eaddrinuse() });
    const { fsImpl, calls } = makeFs(); // safe dir, owned by uid 1000

    let code: string | undefined;
    try {
      await mod.listenHttpServer(server, UDS_TARGET, {
        fs: fsImpl,
        getuid: () => 1000,
        connect: residentConnect(),
        probeTimeoutMs: 5,
      });
    } catch (e) {
      code = (e as NodeJS.ErrnoException).code;
    }
    expect(code).toBe('EADDRINUSE');
    // unlink should NEVER be called on the live-resident path.
    expect(calls.unlinked).toBe(false);
    // Only the first (failed) listen attempt ran; we did NOT relisten after refusing.
    expect((server as unknown as { listenCalls: number }).listenCalls).toBe(1);
  });

  it('reclaims a STALE socket (connection refused) by unlinking, then relistens', async () => {
    const server = makeFakeServer({ firstError: eaddrinuse() });
    const { fsImpl, calls } = makeFs(); // safe dir, owned by uid 1000

    const endpoint = await mod.listenHttpServer(server, UDS_TARGET, {
      fs: fsImpl,
      getuid: () => 1000,
      connect: refusedConnect(),
      probeTimeoutMs: 5,
    });
    expect(calls.unlinked).toBe(true);
    // Two listen() calls: the initial EADDRINUSE attempt + the post-unlink relisten.
    expect((server as unknown as { listenCalls: number }).listenCalls).toBe(2);
    // For a UDS the resolved endpoint is the socket path itself.
    expect(endpoint).toBe(UDS_TARGET);
  });

  it('refuses to reclaim when the socket dir is not owned by us (ownership assert fires first)', async () => {
    const server = makeFakeServer({ firstError: eaddrinuse() });
    let probed = false;
    const connect = (_opts: unknown, onConnect: () => void) => {
      probed = true;
      const s = new EventEmitter() as EventEmitter & { destroy: () => void; setTimeout: () => void };
      s.destroy = () => undefined;
      s.setTimeout = () => undefined;
      queueMicrotask(() => onConnect());
      return s;
    };
    const { fsImpl } = makeFs({ statSync: () => ({ uid: 0, mode: 0o040700 }) }); // root-owned dir

    let code: string | undefined;
    try {
      await mod.listenHttpServer(server, UDS_TARGET, {
        fs: fsImpl,
        getuid: () => 1000,
        connect,
      });
    } catch (e) {
      code = (e as NodeJS.ErrnoException).code;
    }
    expect(code).toBe('EPERM_SOCKET_DIR_OWNER');
    // Ownership is asserted BEFORE we even probe for a resident.
    expect(probed).toBe(false);
  });
});
