import { withNodeAssertionPhase } from "./runtime.mjs";
import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
const ASSERTION_METHODS = new Set([
    "deepEqual",
    "deepStrictEqual",
    "doesNotMatch",
    "doesNotReject",
    "doesNotThrow",
    "equal",
    "fail",
    "ifError",
    "match",
    "notDeepEqual",
    "notDeepStrictEqual",
    "notEqual",
    "notStrictEqual",
    "ok",
    "partialDeepStrictEqual",
    "rejects",
    "strictEqual",
    "throws",
]);
function assertionSource(boundary) {
    // Omit our own frames by function identity, not basename: a user's helper
    // may itself be called runtime.mjs or nodeAssertAdapter.mjs. Never search
    // deeper for a plausible-looking caller when the immediate frame is opaque.
    // A loader may have transformed this file without composing source maps.
    // Qualify stack coordinates so they cannot masquerade as the original
    // source positions emitted by lexical probes and used for oracle matching.
    try {
        const error = {};
        Error.captureStackTrace(error, boundary);
        if (typeof error.stack !== "string")
            return undefined;
        const entry = error.stack.split("\n")[1]?.trim();
        const match = entry && /(?:^at (?:async )?| \()((?:file:\/\/\/|\/|[A-Za-z]:[\\/]).*):(\d+):(\d+)\)?$/.exec(entry);
        if (!match)
            return undefined;
        const file = match[1].startsWith("file:") ? fileURLToPath(match[1]) : match[1];
        const roots = [process.env.SUPERCOV_PROJECT_ROOT, process.env.SUPERCOV_SOURCE_PROJECT_ROOT, process.cwd()].filter(Boolean);
        for (const root of roots) {
            const path = relative(root, file);
            if (path !== ".." && !path.startsWith(`..${sep}`) && !/^(?:[A-Za-z]:|[\\/])/.test(path))
                return `runtime-stack:${path.split(sep).join("/")}:${match[2]}:${match[3]}`;
        }
        return `runtime-stack:${file.split(sep).join("/")}:${match[2]}:${match[3]}`;
    }
    catch {
        // Custom stack formatters must not change the user's assertion outcome.
        return undefined;
    }
}
function wrapAssertion(original, operation) {
    return new Proxy(original, {
        apply: function assertionApply(target, thisArgument, argumentsList) {
            return withNodeAssertionPhase(operation, () => assertionSource(assertionApply), () => Reflect.apply(target, thisArgument, argumentsList));
        },
    });
}
function wrapAssertInstance(instance, operation) {
    const cache = new Map();
    return new Proxy(instance, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);
            if (typeof value !== "function" || !ASSERTION_METHODS.has(String(property)))
                return value;
            const existing = cache.get(property);
            if (existing)
                return existing;
            const wrapped = wrapAssertion(value.bind(target), `${operation}.${String(property)}`);
            cache.set(property, wrapped);
            return wrapped;
        },
    });
}
function wrappedAssertConstructor(original, operation) {
    return new Proxy(original, {
        construct(target, argumentsList, newTarget) {
            return wrapAssertInstance(Reflect.construct(target, argumentsList, newTarget), operation);
        },
    });
}
export function createNodeAssertAdapter(native, moduleName) {
    const adapter = wrapAssertion(native, `${moduleName}.ok`);
    const nativeRecord = native;
    for (const property of Reflect.ownKeys(nativeRecord)) {
        if (["name", "length", "prototype", "arguments", "caller"].includes(String(property)))
            continue;
        const descriptor = Reflect.getOwnPropertyDescriptor(nativeRecord, property);
        if (!descriptor)
            continue;
        let value = descriptor.value;
        if (typeof value === "function" && ASSERTION_METHODS.has(String(property)))
            value = wrapAssertion(value, `${moduleName}.${String(property)}`);
        else if (property === "Assert" && typeof value === "function")
            value = wrappedAssertConstructor(value, `${moduleName}.Assert`);
        try {
            Reflect.defineProperty(adapter, property, {
                ...descriptor,
                value,
            });
        }
        catch {
            // Exotic builtin descriptors are not required for assertion dispatch.
        }
    }
    return adapter;
}
export function setStrictAssertAdapter(adapter, strict) {
    Reflect.defineProperty(adapter, "strict", {
        configurable: true,
        enumerable: true,
        value: strict,
        writable: true,
    });
}
