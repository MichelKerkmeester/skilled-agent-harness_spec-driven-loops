import { appendFileSync, existsSync, mkdirSync, openSync, closeSync, fsyncSync, renameSync, rmSync, statSync, writeFileSync, } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { Buffer } from "node:buffer";
function fsyncDirectory(path) {
    try {
        const directory = openSync(path, "r");
        try {
            fsyncSync(directory);
        }
        finally {
            closeSync(directory);
        }
    }
    catch {
        // Some platforms (notably Windows) do not permit opening directories.
    }
}
/** Write a complete sibling file and atomically replace the destination. */
export function atomicWriteFileSync(path, data, options) {
    mkdirSync(dirname(path), { recursive: true });
    const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
    let descriptor;
    try {
        descriptor = openSync(temporary, "wx", 0o600);
        writeFileSync(descriptor, data, options);
        fsyncSync(descriptor);
        closeSync(descriptor);
        descriptor = undefined;
        renameSync(temporary, path);
        // Persist the directory entry as well as the file contents on POSIX. Some
        // platforms (notably Windows) do not permit opening directories, so file
        // fsync + atomic rename remains the portable fallback there.
        fsyncDirectory(dirname(path));
    }
    finally {
        if (descriptor !== undefined)
            closeSync(descriptor);
        rmSync(temporary, { force: true });
    }
}
/** Append one recoverable JSONL record and make the completed line durable. */
export function appendJsonLineDurableSync(path, data) {
    mkdirSync(dirname(path), { recursive: true });
    const existed = existsSync(path);
    const descriptor = openSync(path, "a", 0o600);
    try {
        writeFileSync(descriptor, data.endsWith("\n") ? data : `${data}\n`);
        fsyncSync(descriptor);
    }
    finally {
        closeSync(descriptor);
    }
    if (!existed)
        fsyncDirectory(dirname(path));
}
/** Append a complete local record; process exit closes it before publication. */
export function appendJsonLineSync(path, data) {
    mkdirSync(dirname(path), { recursive: true });
    appendFileSync(path, data.endsWith("\n") ? data : `${data}\n`, { mode: 0o600 });
}
/** Atomically publish a fully prepared file or directory and persist its entry. */
export function atomicRenameSync(source, destination) {
    mkdirSync(dirname(destination), { recursive: true });
    renameSync(source, destination);
    fsyncDirectory(dirname(destination));
}
/**
 * Append one test's evidence to this writer's own journal.
 *
 * A file per test cost a directory, a temporary file, two fsyncs and a rename:
 * jshttp/cookie's 63,740 tests had written 26,600 of them after seven
 * minutes, where the suite alone takes two seconds. An append is one write the
 * kernel keeps when the process is killed, which is the durability the rest of
 * the workspace has; set SUPERCOV_DURABLE_EVIDENCE_EACH_TEST=1 to fsync each
 * record as well. The reader already takes `*.mcdc.jsonl` journals, one record
 * per line, as Playwright writes them.
 *
 * A journal is named by a token, never by the pid alone: worker threads share
 * a pid, and VMs restored from one snapshot share the token too, so a journal
 * that grew by anything but this writer's own appends is left to its other
 * writer and a new one is started.
 */
const journals = new Map();
export function appendEvidenceRecord(directory, prefix, payload) {
    const line = `${JSON.stringify(payload)}\n`;
    let journal = journals.get(prefix);
    if (journal) {
        let size = -1;
        try {
            size = statSync(journal.path).size;
        }
        catch {
            // A missing journal is started again below.
        }
        if (size !== journal.size)
            journal = undefined;
    }
    if (!journal) {
        const writer = (process.env.SUPERCOV_EXECUTION_LOG_SHARD ?? `pid-${process.pid}`)
            .replace(/[^A-Za-z0-9_-]/g, "_");
        journal = { path: resolve(directory, `${prefix}-${writer}-${randomUUID()}.mcdc.jsonl`), size: 0 };
        journals.set(prefix, journal);
    }
    const append = process.env.SUPERCOV_DURABLE_EVIDENCE_EACH_TEST === "1"
        ? appendJsonLineDurableSync
        : appendJsonLineSync;
    append(journal.path, line);
    journal.size += Buffer.byteLength(line);
}
