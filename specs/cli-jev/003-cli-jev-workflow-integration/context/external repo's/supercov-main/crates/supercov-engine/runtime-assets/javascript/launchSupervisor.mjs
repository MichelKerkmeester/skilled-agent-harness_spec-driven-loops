import childProcess from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { appendFileSync, mkdirSync, statSync } from "node:fs";
import Module, { syncBuiltinESMExports } from "node:module";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const HOST_PATH_KEYS = ["hostPath", "source", "src", "localPath"];
const GUEST_PATH_KEYS = [
    "guestPath",
    "target",
    "destination",
    "containerPath",
];
const CACHE_IDENTITY = /^(?:warmup|snapshot|cache)(?:key|tag|id)$/i;
const patchedBuilders = new WeakSet();
const exportedValues = new WeakSet();
const capabilityProxies = new WeakMap();
const importedCapabilityProxies = new WeakMap();
const importedMemberProxies = new WeakMap();
let installed = false;
let remoteLaunchSequence = 0;

function isClassConstructor(value) {
    if (typeof value !== "function")
        return false;
    try {
        return /^class(?:\s|\{)/u.test(Function.prototype.toString.call(value));
    }
    catch {
        return false;
    }
}
// A pid is not an identity: pool VMs restored from one snapshot run clones
// of this very process with the same pid, and their appends to one file over
// a shared mount tear each other's lines. The log name carries a token, and
// an append that finds the file a different size than this writer left it
// has met a clone and rotates to a fresh file. The token mixes time in as
// well as randomness because clones may also share their entropy state.
function writerToken() {
    let random = "";
    try {
        random = randomBytes(3).toString("hex");
    }
    catch {
        random = Math.floor(Math.random() * 16777215).toString(16);
    }
    return `${random}${process.hrtime.bigint().toString(36).slice(-5)}`;
}
let executionLog = { token: writerToken(), path: undefined, size: 0 };
function executionLogPath(path, token = executionLog.token) {
    const shard = (process.env["SUPERCOV_EXECUTION_LOG_SHARD"] ?? "host").replace(/[^A-Za-z0-9_.-]/g, "_");
    const suffix = `.${shard}.${process.pid}-${token}.jsonl`;
    return path.endsWith(".jsonl")
        ? `${path.slice(0, -".jsonl".length)}${suffix}`
        : `${path}${suffix}`;
}
function record(value) {
    const configuredPath = process.env["SUPERCOV_EXECUTION_LOG"];
    if (!configuredPath)
        return;
    try {
        let path = executionLogPath(configuredPath);
        if (executionLog.path === path) {
            let currentSize = 0;
            try {
                currentSize = statSync(path).size;
            }
            catch {
                currentSize = 0;
            }
            if (currentSize !== executionLog.size) {
                executionLog = { token: writerToken(), path: undefined, size: 0 };
                path = executionLogPath(configuredPath);
            }
        }
        const line = `${JSON.stringify({
            at: new Date().toISOString(),
            pid: process.pid,
            ppid: process.ppid,
            ...value,
        })}\n`;
        mkdirSync(dirname(path), { recursive: true });
        appendFileSync(path, line);
        executionLog = { token: executionLog.token, path, size: executionLog.size + Buffer.byteLength(line) };
    }
    catch {
        // Process tracing is diagnostic and must never change test behavior.
    }
}
function safeArgument(value) {
    if (value.length <= 160 && !value.includes("\n") && !value.includes("\r"))
        return value;
    return {
        bytes: Buffer.byteLength(value),
        sha256: createHash("sha256").update(value).digest("hex"),
    };
}
function commandSummary(argv) {
    return {
        executable: argv[0] ? safeArgument(argv[0]) : undefined,
        arguments: argv.slice(1, 9).map(safeArgument),
        argumentCount: Math.max(0, argv.length - 1),
    };
}
function stringProperty(value, keys) {
    for (const key of keys) {
        const candidate = value[key];
        if (typeof candidate === "string" && candidate.length > 0)
            return candidate;
    }
    return undefined;
}
function containsPath(parent, child) {
    const local = relative(resolve(parent), resolve(child));
    if (local === "")
        return "";
    if (local.startsWith("..") || isAbsolute(local))
        return undefined;
    return local;
}
/**
 * Find a host-to-guest mount that makes the isolated project visible to a
 * remote executor. This deliberately recognizes data shape, not a provider or
 * package name.
 */
export function discoverWorkspaceMapping(value, hostRoot, depth = 0) {
    if (!value || typeof value !== "object" || depth > 5)
        return undefined;
    if (Array.isArray(value)) {
        for (const item of value.slice(0, 200)) {
            const mapping = discoverWorkspaceMapping(item, hostRoot, depth + 1);
            if (mapping)
                return mapping;
        }
        return undefined;
    }
    const candidate = value;
    const hostPath = stringProperty(candidate, HOST_PATH_KEYS);
    const guestPath = stringProperty(candidate, GUEST_PATH_KEYS);
    if (hostPath && guestPath) {
        const local = containsPath(hostPath, hostRoot);
        if (local !== undefined) {
            return {
                hostRoot: resolve(hostRoot),
                guestRoot: local ? resolve(guestPath, local) : resolve(guestPath),
            };
        }
    }
    for (const nested of Object.values(candidate).slice(0, 200)) {
        const mapping = discoverWorkspaceMapping(nested, hostRoot, depth + 1);
        if (mapping)
            return mapping;
    }
    return undefined;
}
function scopeCacheValue(value, fingerprint) {
    const suffix = `supercov-${fingerprint.slice(0, 20)}`;
    return value.includes(suffix) ? value : `${value}-${suffix}`;
}
/** Clone only branches that contain a recognized cache/snapshot identity. */
export function scopeCapabilityCache(value, fingerprint, depth = 0) {
    if (!value || typeof value !== "object" || depth > 5)
        return { value, changed: [] };
    if (Array.isArray(value)) {
        const changed = [];
        let cloned;
        for (let index = 0; index < value.length; index += 1) {
            const nested = scopeCapabilityCache(value[index], fingerprint, depth + 1);
            if (nested.changed.length > 0) {
                cloned ??= [...value];
                cloned[index] = nested.value;
                changed.push(...nested.changed.map((path) => `[${index}]${path}`));
            }
        }
        return { value: cloned ?? value, changed };
    }
    const source = value;
    let clone;
    const changed = [];
    for (const key of Reflect.ownKeys(source)) {
        if (typeof key !== "string")
            continue;
        const nestedValue = source[key];
        if (CACHE_IDENTITY.test(key) && typeof nestedValue === "string") {
            clone ??= { ...source };
            clone[key] = scopeCacheValue(nestedValue, fingerprint);
            changed.push(key);
            continue;
        }
        const nested = scopeCapabilityCache(nestedValue, fingerprint, depth + 1);
        if (nested.changed.length > 0) {
            clone ??= { ...source };
            clone[key] = nested.value;
            changed.push(...nested.changed.map((path) => `${key}.${path}`));
        }
    }
    return { value: clone ?? value, changed };
}
function replaceRoot(value, mapping) {
    const hostRoot = mapping.hostRoot.replaceAll("\\", "/").replace(/\/$/, "");
    const guestRoot = mapping.guestRoot.replaceAll("\\", "/").replace(/\/$/, "");
    const normalized = value.replaceAll("\\", "/");
    const hostUrl = pathToFileURL(mapping.hostRoot).href.replace(/\/$/, "");
    const guestUrl = pathToFileURL(mapping.guestRoot).href.replace(/\/$/, "");
    if (normalized === hostRoot)
        return guestRoot;
    if (normalized.startsWith(`${hostRoot}/`))
        return `${guestRoot}/${normalized.slice(hostRoot.length + 1)}`;
    if (value === hostUrl)
        return guestUrl;
    if (value.startsWith(`${hostUrl}/`))
        return `${guestUrl}/${value.slice(hostUrl.length + 1)}`;
    return value;
}
function appendNodeImport(existing, registerUrl) {
    const addition = `--import=${registerUrl}`;
    if (existing?.includes(addition))
        return existing;
    return [existing, addition].filter(Boolean).join(" ");
}
function coverageVariables(environment) {
    return Object.fromEntries(Object.entries(environment).filter(([key, value]) => key.startsWith("SUPERCOV_") && value !== undefined));
}
/** Build an environment whose paths remain valid inside the discovered VM. */
export function guestCoverageEnvironment(mapping, coverageEnvironment = process.env, existingEnvironment = {}) {
    const translated = Object.fromEntries(Object.entries(coverageVariables(coverageEnvironment)).map(([key, value]) => [
        key,
        value === undefined ? value : replaceRoot(value, mapping),
    ]));
    const registerUrl = pathToFileURL(resolve(mapping.guestRoot, ".supercov/node_modules/register.mjs")).href;
    return {
        ...existingEnvironment,
        ...translated,
        SUPERCOV_PROJECT_ROOT: mapping.guestRoot,
        SUPERCOV_CJS_INTERCEPT: "1",
        SUPERCOV_DURABLE_EVIDENCE_EACH_TEST: "1",
        NODE_OPTIONS: appendNodeImport(existingEnvironment.NODE_OPTIONS, registerUrl),
    };
}
function launchOptions(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return false;
    const candidate = value;
    return ((Array.isArray(candidate.argv) &&
        candidate.argv.every((item) => typeof item === "string")) ||
        (Array.isArray(candidate.cmd) &&
            candidate.cmd.every((item) => typeof item === "string")) ||
        typeof candidate.command === "string");
}
function launchArgv(value) {
    if (Array.isArray(value.argv))
        return value.argv;
    if (Array.isArray(value.cmd))
        return value.cmd;
    return [String(value.command)];
}
function injectRemoteLaunch(options, mapping) {
    const environmentKey = "environment" in options && !("env" in options) ? "environment" : "env";
    const existing = options[environmentKey];
    return {
        ...options,
        [environmentKey]: guestCoverageEnvironment(mapping, {
            ...process.env,
            SUPERCOV_EXECUTION_LOG_SHARD: `${process.pid}-${++remoteLaunchSequence}`,
        }, existing && typeof existing === "object"
            ? existing
            : {}),
    };
}
function wrapResult(value, mapping) {
    if (value instanceof Promise)
        return value.then((result) => wrapCapabilityObject(result, mapping));
    return wrapCapabilityObject(value, mapping);
}

// A Proxy `get` trap must return the exact value of a non-configurable,
// non-writable own data property (and `undefined` for a non-configurable
// accessor without a getter). Constructors commonly expose `prototype` this
// way. Returning another capability proxy is a TypeError before user code can
// run, as seen with PrismaSessionStorage during an Essential Apps VM bake.
function fixedProxyValue(target, property) {
    const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
    if (!descriptor || descriptor.configurable)
        return { fixed: false };
    if ("value" in descriptor && !descriptor.writable)
        return { fixed: true, value: descriptor.value };
    if (!("value" in descriptor) && descriptor.get === undefined)
        return { fixed: true, value: undefined };
    return { fixed: false };
}

function wrapImportedMember(member, receiver, invoke) {
    let members = importedMemberProxies.get(receiver);
    if (!members) {
        members = new WeakMap();
        importedMemberProxies.set(receiver, members);
    }
    const cached = members.get(member);
    if (cached)
        return cached;
    const proxy = new Proxy(member, {
        apply(target, _thisArgument, args) {
            return invoke(target, receiver, args);
        },
        construct(target, args, newTarget) {
            return wrapImportedCapability(Reflect.construct(target, args, newTarget));
        },
    });
    members.set(member, proxy);
    return proxy;
}
/**
 * A remote SDK can hide its first executable launch inside a configuration
 * callback (for example an image warmup hook). Decorate callbacks in ordinary
 * configuration data so capability objects delivered later receive the same
 * provider-neutral launch supervision as objects returned directly by the SDK.
 * Accessors and class instances are deliberately left alone.
 */
export function wrapCapabilityCallbacks(value, mapping, depth = 0, seen = new WeakMap()) {
    if (typeof value === "function") {
        // A class is a nominal value as well as a callable capability. Replacing
        // it with a Proxy changes strict constructor identity in registries such
        // as Lexical, ORMs and dependency-injection containers. Static builder
        // methods are supervised at the export boundary; classes passed through
        // ordinary configuration must remain the exact original value.
        if (isClassConstructor(value))
            return value;
        const cached = seen.get(value);
        if (cached)
            return cached;
        const original = value;
        const wrapped = function supercovCapabilityCallback(...args) {
            return wrapResult(Reflect.apply(original, this, args.map((argument) => wrapCapabilityObject(argument, mapping))), mapping);
        };
        seen.set(value, wrapped);
        return wrapped;
    }
    if (!value || typeof value !== "object" || depth > 5)
        return value;
    const cached = seen.get(value);
    if (cached)
        return cached;
    const prototype = Object.getPrototypeOf(value);
    if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null)
        return value;
    const clone = Array.isArray(value)
        ? [...value]
        : Object.create(prototype);
    seen.set(value, clone);
    let changed = false;
    for (const key of Reflect.ownKeys(value).slice(0, 200)) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !("value" in descriptor))
            continue;
        const wrapped = wrapCapabilityCallbacks(descriptor.value, mapping, depth + 1, seen);
        if (wrapped !== descriptor.value)
            changed = true;
        Object.defineProperty(clone, key, { ...descriptor, value: wrapped });
    }
    if (!changed) {
        seen.set(value, value);
        return value;
    }
    return clone;
}
/**
 * Follow an opaque image/pool/machine-style object graph. Any method accepting
 * an argv-shaped options object receives the translated Supercov environment.
 */
export function wrapCapabilityObject(value, mapping) {
    if ((!value || typeof value !== "object") && typeof value !== "function")
        return value;
    if (isClassConstructor(value)) {
        patchBuilder(value);
        return value;
    }
    const object = value;
    const cached = capabilityProxies.get(object);
    if (cached)
        return cached;
    const proxy = new Proxy(object, {
        get(target, property) {
            const fixed = fixedProxyValue(target, property);
            if (fixed.fixed)
                return fixed.value;
            // Use the real target as the receiver so SDK getters backed by private
            // fields keep their brand check. Method calls are likewise bound below.
            const member = Reflect.get(target, property, target);
            if (typeof member !== "function")
                return member;
            return (...args) => {
                let callArguments = args;
                let index = args.findIndex(launchOptions);
                let positionalCommand;
                if (index < 0 &&
                    typeof property === "string" &&
                    /^(?:exec|execute|launch|run|spawn)$/i.test(property)) {
                    const commandIndex = args.findIndex((argument) => typeof argument === "string" ||
                        (Array.isArray(argument) && argument.every((item) => typeof item === "string")));
                    if (commandIndex >= 0) {
                        const command = args[commandIndex];
                        positionalCommand = Array.isArray(command)
                            ? command
                            : [String(command), ...(Array.isArray(args[commandIndex + 1]) ? args[commandIndex + 1] : [])];
                        index = args.findIndex((argument, argumentIndex) => argumentIndex > commandIndex &&
                            Boolean(argument) &&
                            typeof argument === "object" &&
                            !Array.isArray(argument));
                    }
                }
                if (index >= 0) {
                    const original = args[index];
                    callArguments = [...args];
                    callArguments[index] = injectRemoteLaunch(original, mapping);
                    record({
                        event: "remote-launch",
                        command: commandSummary(positionalCommand ?? launchArgv(original)),
                        guestRoot: mapping.guestRoot,
                    });
                }
                return wrapResult(Reflect.apply(member, target, callArguments), mapping);
            };
        },
    });
    capabilityProxies.set(object, proxy);
    return proxy;
}
/**
 * Proxy a value imported by a first-party ESM launcher. The proxy remains
 * provider-neutral: it waits until arguments reveal a host/guest mount, then
 * delegates to the same capability graph used for CommonJS exports.
 */
export function wrapImportedCapability(value) {
    if ((!value || typeof value !== "object") && typeof value !== "function")
        return value;
    if (isClassConstructor(value)) {
        patchBuilder(value);
        return value;
    }
    const object = value;
    const cached = importedCapabilityProxies.get(object);
    if (cached)
        return cached;
    const invoke = (callable, receiver, args) => {
        const hostRoot = process.env["SUPERCOV_PROJECT_ROOT"];
        const mapping = hostRoot
            ? args.map((argument) => discoverWorkspaceMapping(argument, hostRoot)).find(Boolean)
            : undefined;
        if (mapping) {
            const fingerprint = process.env["SUPERCOV_EXECUTION_FINGERPRINT"] ?? "unversioned";
            const scopedArguments = args.map((argument) => scopeCapabilityCache(argument, fingerprint));
            const supervisedArguments = scopedArguments.map((entry) => wrapCapabilityCallbacks(entry.value, mapping));
            record({
                event: "workspace-capability",
                hostRoot: mapping.hostRoot,
                guestRoot: mapping.guestRoot,
                cacheIdentities: scopedArguments.flatMap((entry) => entry.changed),
            });
            return wrapResult(Reflect.apply(callable, receiver, supervisedArguments), mapping);
        }
        return wrapImportedCapability(Reflect.apply(callable, receiver, args));
    };
    const proxy = new Proxy(object, {
        get(target, property) {
            const fixed = fixedProxyValue(target, property);
            if (fixed.fixed)
                return fixed.value;
            const member = Reflect.get(target, property, target);
            if (isClassConstructor(member)) {
                patchBuilder(member);
                return member;
            }
            if (typeof member !== "function")
                return wrapImportedCapability(member);
            return wrapImportedMember(member, target, invoke);
        },
        ...(typeof value === "function"
            ? {
                apply(target, thisArgument, args) {
                    return invoke(target, thisArgument, args);
                },
                construct(target, args, newTarget) {
                    const result = Reflect.construct(target, args, newTarget);
                    return wrapImportedCapability(result);
                },
            }
            : {}),
    });
    importedCapabilityProxies.set(object, proxy);
    return proxy;
}
function patchBuilder(builder) {
    if (patchedBuilders.has(builder))
        return;
    const descriptor = Object.getOwnPropertyDescriptor(builder, "build");
    if (!descriptor || typeof descriptor.value !== "function" || !descriptor.writable)
        return;
    const original = descriptor.value;
    Object.defineProperty(builder, "build", {
        ...descriptor,
        value: function supercovCapabilityBuild(...args) {
            const hostRoot = process.env["SUPERCOV_PROJECT_ROOT"];
            const mapping = hostRoot
                ? discoverWorkspaceMapping(args[0], hostRoot)
                : undefined;
            if (!mapping)
                return Reflect.apply(original, this, args);
            const fingerprint = process.env["SUPERCOV_EXECUTION_FINGERPRINT"] ?? "unversioned";
            const scoped = scopeCapabilityCache(args[0], fingerprint);
            const callArguments = [
                wrapCapabilityCallbacks(scoped.value, mapping),
                ...args.slice(1),
            ];
            record({
                event: "workspace-capability",
                hostRoot: mapping.hostRoot,
                guestRoot: mapping.guestRoot,
                cacheIdentities: scoped.changed,
            });
            return wrapResult(Reflect.apply(original, this, callArguments), mapping);
        },
    });
    patchedBuilders.add(builder);
}
function inspectExports(value, depth = 0) {
    if (((!value || typeof value !== "object") && typeof value !== "function") ||
        depth > 2)
        return;
    const object = value;
    if (exportedValues.has(object))
        return;
    exportedValues.add(object);
    if (typeof value === "function")
        patchBuilder(value);
    for (const key of Reflect.ownKeys(object).slice(0, 200)) {
        if (key === "prototype" || key === "caller" || key === "callee")
            continue;
        try {
            const descriptor = Object.getOwnPropertyDescriptor(object, key);
            if (descriptor && "value" in descriptor)
                inspectExports(descriptor.value, depth + 1);
        }
        catch {
            // Export inspection is best-effort and never invokes accessors.
        }
    }
}
// spawn, fork and execFile take (file, args?, options?, callback?): options
// follow an argument list, or an explicit null or undefined in its place. exec
// takes (command, options?, callback?), and calls execFile as (file, options,
// callback) itself -- that object is the options, not an argument list.
function childOptionsIndex(method, args) {
    if (method === "spawn" ||
        method === "spawnSync" ||
        method === "fork" ||
        method === "execFile" ||
        method === "execFileSync")
        return Array.isArray(args[1]) || (args[1] == null && args.length > 2) ? 2 : 1;
    if (method === "exec" || method === "execSync")
        return 1;
    return undefined;
}
// util.promisify(exec) and util.promisify(execFile) resolve { stdout, stderr }
// through a function Node keeps on the original, and that function calls the
// original. A wrapper carries its own, which calls the wrapper, or a promisified
// call resolves the bare stdout string and skips the wrapper.
const promisifyCustom = Symbol.for("nodejs.util.promisify.custom");
function keepPromisifiedShape(original, wrapper) {
    if (typeof original[promisifyCustom] !== "function")
        return wrapper;
    Object.defineProperty(wrapper, promisifyCustom, {
        configurable: true,
        value: (...args) => {
            let settle;
            let reject;
            const promise = new Promise((ok, fail) => {
                settle = ok;
                reject = fail;
            });
            promise.child = wrapper(...args, (error, stdout, stderr) => {
                if (error !== null) {
                    error.stdout = stdout;
                    error.stderr = stderr;
                    reject(error);
                }
                else
                    settle({ stdout, stderr });
            });
            return promise;
        },
    });
    return wrapper;
}
function injectChildEnvironment(method, args) {
    const index = childOptionsIndex(method, args);
    if (index === undefined)
        return args;
    const next = [...args];
    const original = next[index];
    const options = original && typeof original === "object" && !Array.isArray(original)
        ? original
        : {};
    const inherited = coverageVariables(process.env);
    const existingEnvironment = options.env && typeof options.env === "object"
        ? options.env
        : undefined;
    if (existingEnvironment?.["SUPERCOV_INTERNAL_ENGINE"] === "1" ||
        existingEnvironment?.["SUPERCOV_INTERNAL_INSTRUMENTER"] === "1")
        return args;
    const environment = existingEnvironment
        ? { ...existingEnvironment, ...inherited }
        : { ...process.env, ...inherited };
    // The runtime child wrapper has captured the current async test scope in
    // these options. An inherited setup/unscoped carrier from the launcher
    // must not overwrite it when we restore the other coverage variables.
    if (existingEnvironment?.SUPERCOV_CONTEXT !== undefined)
        environment.SUPERCOV_CONTEXT = existingEnvironment.SUPERCOV_CONTEXT;
    // The register path must come from THIS module's own location, never from
    // the environment or the working directory. Monorepo runners both defeat
    // the old derivation at once: turbo's strict env strips SUPERCOV_PROJECT_ROOT
    // from task children, and it runs each task with cwd inside the package --
    // so the fallback fabricated packages/<name>/.supercov/register.mjs and
    // every task aborted with ERR_MODULE_NOT_FOUND. launchSupervisor.js is
    // generated into the same .supercov directory as register.mjs.
    environment.NODE_OPTIONS = appendNodeImport(existingEnvironment?.NODE_OPTIONS ?? process.env.NODE_OPTIONS, new URL("./register.mjs", import.meta.url).href);
    next[index] = { ...options, env: environment };
    if (typeof original === "function")
        next.splice(index + 1, 0, original);
    record({
        event: "child-launch",
        method,
        command: safeArgument(String(args[0] ?? "")),
    });
    return next;
}
function patchChildProcesses() {
    const methods = [
        "spawn",
        "spawnSync",
        "exec",
        "execSync",
        "execFile",
        "execFileSync",
        "fork",
    ];
    for (const method of methods) {
        const original = childProcess[method];
        Object.defineProperty(childProcess, method, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: keepPromisifiedShape(original, (...args) => Reflect.apply(original, childProcess, injectChildEnvironment(method, args))),
        });
    }
    syncBuiltinESMExports();
}
export function installLaunchSupervisor() {
    if (installed)
        return;
    installed = true;
    patchChildProcesses();
    const moduleLoader = Module;
    const originalLoad = moduleLoader._load;
    moduleLoader._load = function supercovCapabilityLoad(request, parent, isMain) {
        const exports = originalLoad.call(this, request, parent, isMain);
        // A user's test command may itself be implemented by an installed
        // package. That package can import a VM/container/process SDK without
        // any project-owned module ever crossing the SDK boundary. Inspect all
        // newly loaded export graphs (deduplicated by `exportedValues`) so
        // capability discovery remains provider- and runner-neutral.
        inspectExports(exports);
        return exports;
    };
    record({
        event: "process",
        cwd: process.cwd(),
        command: commandSummary(process.argv),
        entrypoint: process.argv[1],
    });
}
