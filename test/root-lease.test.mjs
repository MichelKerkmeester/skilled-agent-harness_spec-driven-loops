import assert from "node:assert/strict";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  utimes,
  writeFile,
} from "node:fs/promises";
import { hostname } from "node:os";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { RootLeaseManager } from "../dist/daemon/root-lease.js";
import {
  assertDaemonWriteAllowed,
  daemonLeasePath,
} from "../dist/engine/utils/daemon-lease.js";
import { createZvecGrep } from "../dist/index.js";
import { printError } from "../dist/cli/errors.js";

test("daemon root lease blocks Direct index writes and is removed on release", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "zvec-grep-lease-"));
  const root = join(temporaryDirectory, "repo");
  await mkdir(root);
  const manager = new RootLeaseManager();
  const lease = await manager.acquire(root);
  const service = await createZvecGrep({
    root,
    embeddingModel: { dispose: async () => {} },
    embeddingModelOwnership: "borrowed",
  });
  try {
    await access(daemonLeasePath(root));
    let leaseError;
    await assert.rejects(service.index(), (error) => {
      leaseError = error;
      assert.match(error.message, /daemon owns index writes/i);
      assert.match(error.context, /--mode auto/);
      assert.match(error.context, /client\.mode to "auto"/);
      return true;
    });
    const output = [];
    const originalError = console.error;
    console.error = (...values) => {
      output.push(values.join(" "));
    };
    try {
      printError(leaseError, { color: "never" });
    } finally {
      console.error = originalError;
    }
    const rendered = output.join("\n");
    assert.match(rendered, /config: Edit .* client\.mode to "auto"/);
    assert.doesNotMatch(rendered, /^client\.mode:/m);
  } finally {
    await service.close();
    await lease.release();
    await manager.close();
    await assert.rejects(access(daemonLeasePath(root)));
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("concurrent stale lease takeover leaves exactly one new owner", async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "zvec-grep-stale-lease-"),
  );
  const root = join(temporaryDirectory, "repo");
  await mkdir(join(root, ".zvec-grep", "locks"), { recursive: true });
  await writeFile(
    daemonLeasePath(root),
    `${JSON.stringify({
      pid: 2_147_483_647,
      hostname: hostname(),
      instanceToken: "stale",
      createdAt: 1,
      updatedAt: 1,
    })}\n`,
  );
  const managers = [new RootLeaseManager(), new RootLeaseManager()];
  try {
    const outcomes = await Promise.allSettled(
      managers.map((manager) => manager.acquire(root)),
    );
    assert.equal(
      outcomes.filter((outcome) => outcome.status === "fulfilled").length,
      1,
    );
    assert.equal(
      outcomes.filter((outcome) => outcome.status === "rejected").length,
      1,
    );
    const owner = JSON.parse(await readFile(daemonLeasePath(root), "utf8"));
    const winner = managers.find(
      (manager) => manager.instanceToken === owner.instanceToken,
    );
    assert.ok(winner);
    const fulfilled = outcomes.find(
      (outcome) => outcome.status === "fulfilled",
    );
    await fulfilled.value.release();
  } finally {
    await Promise.all(managers.map((manager) => manager.close()));
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("an abandoned malformed lease can be replaced safely", async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "zvec-grep-malformed-lease-"),
  );
  const root = join(temporaryDirectory, "repo");
  await mkdir(join(root, ".zvec-grep", "locks"), { recursive: true });
  const path = daemonLeasePath(root);
  await writeFile(path, '{"pid":');
  const old = new Date(Date.now() - 60_000);
  await utimes(path, old, old);
  const manager = new RootLeaseManager();
  try {
    const lease = await manager.acquire(root);
    const owner = JSON.parse(await readFile(path, "utf8"));
    assert.equal(owner.instanceToken, manager.instanceToken);
    await lease.release();
    await writeFile(path, "{}\n");
    await utimes(path, old, old);
    const secondLease = await manager.acquire(root);
    const secondOwner = JSON.parse(await readFile(path, "utf8"));
    assert.equal(secondOwner.instanceToken, manager.instanceToken);
    await secondLease.release();
  } finally {
    await manager.close();
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("a Direct write permit prevents daemon activation until the write completes", async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "zvec-grep-direct-permit-"),
  );
  const root = join(temporaryDirectory, "repo");
  await mkdir(root);
  const manager = new RootLeaseManager();
  const permit = assertDaemonWriteAllowed(root);
  try {
    assert.ok(permit);
    await assert.rejects(
      manager.acquire(root),
      /changing the root lease|INDEX_BUSY/i,
    );
    permit.release();
    const lease = await manager.acquire(root);
    await lease.release();
  } finally {
    permit?.release();
    await manager.close();
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});
