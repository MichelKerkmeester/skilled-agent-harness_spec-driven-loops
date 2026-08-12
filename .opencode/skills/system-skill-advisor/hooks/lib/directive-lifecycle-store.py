#!/usr/bin/env python3
"""Directory-descriptor-anchored directive lifecycle state operations."""

import fcntl
import hashlib
import json
import os
import re
import stat
import sys
import time
import uuid

MAX_RECORD_BYTES = 64 * 1024
MAX_DIRECTORY_SCAN = 256
MAX_TEMP_CLEANUP = 32
TEMP_MAX_AGE_SECONDS = 5 * 60
TEMP_PREFIX = ".directive-lifecycle-tmp-"
GENERATION_FILE = ".generation.json"
LOCK_FILE = ".store.lock"
POISON_FILE = ".poison.json"
INITIAL_TOKEN = "initial"
RECORD_RE = re.compile(r"^[a-f0-9]{16}\.json$")
EPOCH_RE = re.compile(r"^[a-f0-9]{16}\.epoch\.json$")


class SecurityError(Exception):
    pass


class Missing:
    pass


MISSING = Missing()


def secure_stat(value, uid, directory=False):
    expected = stat.S_ISDIR(value.st_mode) if directory else stat.S_ISREG(value.st_mode)
    links_ok = directory or value.st_nlink == 1
    return expected and value.st_uid == uid and links_ok and value.st_mode & 0o077 == 0


def open_child_directory(parent_fd, name, uid, create):
    if create:
        try:
            os.mkdir(name, 0o700, dir_fd=parent_fd)
        except FileExistsError:
            pass
    flags = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW
    child_fd = os.open(name, flags, dir_fd=parent_fd)
    if not secure_stat(os.fstat(child_fd), uid, directory=True):
        os.close(child_fd)
        raise SecurityError("unsafe directory")
    return child_fd


def open_state_directory(base, create):
    uid = os.getuid()
    if create:
        os.makedirs(base, mode=0o700, exist_ok=True)
    base_lstat = os.lstat(base)
    if stat.S_ISLNK(base_lstat.st_mode) or not secure_stat(base_lstat, uid, directory=True):
        raise SecurityError("unsafe base")
    canonical = os.path.realpath(base)
    canonical_stat = os.lstat(canonical)
    if (canonical_stat.st_dev, canonical_stat.st_ino) != (base_lstat.st_dev, base_lstat.st_ino):
        raise SecurityError("base identity mismatch")
    base_fd = os.open(canonical, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    lifecycle_fd = None
    state_fd = None
    try:
        if not secure_stat(os.fstat(base_fd), uid, directory=True):
            raise SecurityError("unsafe base handle")
        lifecycle_fd = open_child_directory(base_fd, "directive-lifecycle", uid, create)
        project = hashlib.sha256(os.getcwd().encode("utf-8")).hexdigest()[:12]
        state_fd = open_child_directory(lifecycle_fd, project, uid, create)
        return base_fd, lifecycle_fd, state_fd
    except Exception:
        if state_fd is not None:
            os.close(state_fd)
        if lifecycle_fd is not None:
            os.close(lifecycle_fd)
        os.close(base_fd)
        raise


def read_json(directory_fd, name, uid):
    try:
        descriptor = os.open(name, os.O_RDONLY | os.O_NOFOLLOW, dir_fd=directory_fd)
    except FileNotFoundError:
        return MISSING
    try:
        metadata = os.fstat(descriptor)
        if not secure_stat(metadata, uid) or metadata.st_size > MAX_RECORD_BYTES:
            raise SecurityError("unsafe state file")
        chunks = []
        remaining = metadata.st_size
        while remaining > 0:
            chunk = os.read(descriptor, min(remaining, 8192))
            if not chunk:
                break
            chunks.append(chunk)
            remaining -= len(chunk)
        return json.loads(b"".join(chunks).decode("utf-8"))
    finally:
        os.close(descriptor)


def unlink_regular(directory_fd, name, uid, missing_ok=True):
    try:
        metadata = os.stat(name, dir_fd=directory_fd, follow_symlinks=False)
    except FileNotFoundError:
        return missing_ok
    if not secure_stat(metadata, uid):
        raise SecurityError("unsafe unlink target")
    os.unlink(name, dir_fd=directory_fd)
    return True


def write_json(directory_fd, name, value, uid):
    payload = json.dumps(value, separators=(",", ":")).encode("utf-8")
    if len(payload) > MAX_RECORD_BYTES:
        return False
    temporary = f"{TEMP_PREFIX}{os.getpid()}-{uuid.uuid4().hex}"
    descriptor = None
    try:
        descriptor = os.open(
            temporary,
            os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
            0o600,
            dir_fd=directory_fd,
        )
        if not secure_stat(os.fstat(descriptor), uid):
            raise SecurityError("unsafe temporary file")
        written = 0
        while written < len(payload):
            written += os.write(descriptor, payload[written:])
        os.fsync(descriptor)
        os.close(descriptor)
        descriptor = None
        os.rename(temporary, name, src_dir_fd=directory_fd, dst_dir_fd=directory_fd)
        os.fsync(directory_fd)
        installed = os.stat(name, dir_fd=directory_fd, follow_symlinks=False)
        return secure_stat(installed, uid) and installed.st_size == len(payload)
    finally:
        if descriptor is not None:
            os.close(descriptor)
        try:
            unlink_regular(directory_fd, temporary, uid)
        except (FileNotFoundError, SecurityError):
            pass


def token(value):
    if value is MISSING:
        return INITIAL_TOKEN
    if not isinstance(value, dict):
        raise SecurityError("invalid token")
    result = value.get("token")
    if not isinstance(result, str) or not result or len(result) > 128:
        raise SecurityError("invalid token")
    return result


def record(value):
    if value is MISSING:
        return None
    if not isinstance(value, dict):
        raise SecurityError("invalid record")
    required = {
        "schemaVersion": int,
        "directives": str,
        "transcriptPath": str,
        "transcriptHighWaterBytes": (int, float),
        "storeGeneration": str,
        "lifecycleEpoch": str,
    }
    if value.get("schemaVersion") != 2:
        raise SecurityError("invalid schema")
    for key, expected in required.items():
        if not isinstance(value.get(key), expected):
            raise SecurityError("invalid record field")
    if not value["transcriptPath"] or value["transcriptHighWaterBytes"] < 0:
        raise SecurityError("invalid transcript evidence")
    return value


def session_hash(session_id):
    return hashlib.sha256(session_id.encode("utf-8")).hexdigest()[:16]


def clock(directory_fd, session_id, uid):
    generation = token(read_json(directory_fd, GENERATION_FILE, uid))
    epoch = token(read_json(directory_fd, f"{session_hash(session_id)}.epoch.json", uid))
    return {"storeGeneration": generation, "lifecycleEpoch": epoch}


def cleanup(directory_fd, uid):
    names = os.listdir(directory_fd)
    if len(names) > MAX_DIRECTORY_SCAN:
        raise SecurityError("state directory scan exceeds bound")
    cutoff = time.time() - TEMP_MAX_AGE_SECONDS
    cleaned = 0
    for name in names:
        if not name.startswith(TEMP_PREFIX) or cleaned >= MAX_TEMP_CLEANUP:
            continue
        metadata = os.stat(name, dir_fd=directory_fd, follow_symlinks=False)
        if secure_stat(metadata, uid) and metadata.st_mtime <= cutoff:
            unlink_regular(directory_fd, name, uid)
            cleaned += 1
    return names


def evict(directory_fd, uid, max_sessions, current_name):
    names = cleanup(directory_fd, uid)
    records = []
    for name in names:
        if RECORD_RE.fullmatch(name) and name != current_name:
            metadata = os.stat(name, dir_fd=directory_fd, follow_symlinks=False)
            if not secure_stat(metadata, uid):
                raise SecurityError("unsafe eviction record")
            records.append((metadata.st_mtime, name))
    remove_count = max(0, len(records) + 1 - max_sessions)
    for _, name in sorted(records)[:remove_count]:
        unlink_regular(directory_fd, name, uid)


def write_record(directory_fd, session_id, candidate, uid, max_sessions):
    current_clock = clock(directory_fd, session_id, uid)
    if candidate.get("storeGeneration") != current_clock["storeGeneration"] or candidate.get("lifecycleEpoch") != current_clock["lifecycleEpoch"]:
        return False
    name = f"{session_hash(session_id)}.json"
    prior = record(read_json(directory_fd, name, uid))
    if prior and all(prior.get(key) == candidate.get(key) for key in (
        "directives", "transcriptPath", "storeGeneration", "lifecycleEpoch"
    )):
        candidate = dict(candidate)
        candidate["transcriptHighWaterBytes"] = max(
            prior["transcriptHighWaterBytes"], candidate["transcriptHighWaterBytes"]
        )
    evict(directory_fd, uid, max_sessions, name)
    return write_json(directory_fd, name, candidate, uid)


def evaluate(directory_fd, request, uid, max_sessions):
    session_id = request["sessionId"]
    current_clock = clock(directory_fd, session_id, uid)
    current = record(read_json(directory_fd, f"{session_hash(session_id)}.json", uid))
    candidate = {
        "schemaVersion": 2,
        "directives": request["directives"],
        "transcriptPath": request["transcriptPath"],
        "transcriptHighWaterBytes": request["transcriptBytes"],
        **current_clock,
    }
    matched = bool(
        not request.get("forceFull")
        and current
        and current["storeGeneration"] == current_clock["storeGeneration"]
        and current["lifecycleEpoch"] == current_clock["lifecycleEpoch"]
        and current["directives"] == request["directives"]
        and current["transcriptPath"] == request["transcriptPath"]
        and request["transcriptBytes"] >= current["transcriptHighWaterBytes"]
    )
    if matched:
        candidate["transcriptHighWaterBytes"] = max(
            request["transcriptBytes"], current["transcriptHighWaterBytes"]
        )
        if not write_record(directory_fd, session_id, candidate, uid, max_sessions):
            return {"suppressed": False, "record": candidate}
        return {"suppressed": True, "record": None}
    return {"suppressed": False, "record": candidate}


def mutate(directory_fd, request, uid, max_sessions):
    operation = request.get("op")
    session_id = request.get("sessionId")
    if operation == "is-poisoned":
        return read_json(directory_fd, POISON_FILE, uid) is not MISSING
    if operation == "mark-poison":
        return write_json(directory_fd, POISON_FILE, {"token": uuid.uuid4().hex}, uid)
    if operation == "clear-poison":
        return unlink_regular(directory_fd, POISON_FILE, uid)
    if operation == "clock":
        return clock(directory_fd, session_id, uid)
    if operation == "get":
        return record(read_json(directory_fd, f"{session_hash(session_id)}.json", uid))
    if operation == "set":
        return write_record(directory_fd, session_id, record(request.get("record")), uid, max_sessions)
    if operation == "evaluate":
        return evaluate(directory_fd, request, uid, max_sessions)
    if operation == "clear":
        unlink_regular(directory_fd, f"{session_hash(session_id)}.json", uid)
        unlink_regular(directory_fd, f"{session_hash(session_id)}.epoch.json", uid)
        return True
    if operation == "advance-session":
        unlink_regular(directory_fd, f"{session_hash(session_id)}.json", uid)
        return write_json(directory_fd, f"{session_hash(session_id)}.epoch.json", {"token": uuid.uuid4().hex}, uid)
    if operation in ("advance-generation", "clear-all"):
        names = cleanup(directory_fd, uid)
        for name in names:
            if RECORD_RE.fullmatch(name) or EPOCH_RE.fullmatch(name):
                unlink_regular(directory_fd, name, uid)
        if operation == "clear-all":
            unlink_regular(directory_fd, POISON_FILE, uid)
            return True
        return write_json(directory_fd, GENERATION_FILE, {"token": uuid.uuid4().hex}, uid)
    raise SecurityError("unknown operation")


def failsafe_poisoned(base):
    try:
        base_fd, lifecycle_fd, state_fd = open_state_directory(base, False)
    except FileNotFoundError:
        return False
    except Exception:
        return True
    try:
        uid = os.getuid()
        lock_fd = os.open(LOCK_FILE, os.O_RDWR | os.O_NOFOLLOW, dir_fd=state_fd)
        try:
            if not secure_stat(os.fstat(lock_fd), uid):
                return True
            fcntl.flock(lock_fd, fcntl.LOCK_SH)
            return read_json(state_fd, POISON_FILE, uid) is not MISSING
        finally:
            os.close(lock_fd)
    except FileNotFoundError:
        return False
    except Exception:
        return True
    finally:
        os.close(state_fd)
        os.close(lifecycle_fd)
        os.close(base_fd)


def main():
    base = os.path.abspath(sys.argv[1])
    max_sessions = max(1, int(sys.argv[2]))
    failsafe = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else None
    request = json.loads(sys.stdin.read() or "{}")
    operation = request.get("op")
    if failsafe and operation in ("get", "set", "clock", "evaluate") and failsafe_poisoned(failsafe):
        print(json.dumps({"ok": True, "result": None}, separators=(",", ":")))
        return
    create = operation not in ("get", "clear", "clear-all", "is-poisoned", "clear-poison")
    descriptors = open_state_directory(base, create)
    base_fd, lifecycle_fd, state_fd = descriptors
    try:
        uid = os.getuid()
        lock_fd = os.open(LOCK_FILE, os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600, dir_fd=state_fd)
        try:
            if not secure_stat(os.fstat(lock_fd), uid):
                raise SecurityError("unsafe lock")
            fcntl.flock(lock_fd, fcntl.LOCK_EX)
            pause_ms = int(os.environ.get("SPECKIT_DIRECTIVE_STORE_TEST_PAUSE_MS", "0"))
            if pause_ms > 0:
                time.sleep(min(pause_ms, 1000) / 1000)
            cleanup(state_fd, uid)
            result = mutate(state_fd, request, uid, max_sessions)
            print(json.dumps({"ok": True, "result": result}, separators=(",", ":")))
        finally:
            os.close(lock_fd)
    finally:
        os.close(state_fd)
        os.close(lifecycle_fd)
        os.close(base_fd)


try:
    main()
except Exception as error:
    print(json.dumps({"ok": False, "error": type(error).__name__}, separators=(",", ":")))
    sys.exit(1)
