const NORMALIZED_KINDS = [
    ["unit", /(^|[/_.-])unit([/_.-]|$)/i],
    ["component", /(^|[/_.-])(component|components|ct)([/_.-]|$)/i],
    ["integration", /(^|[/_.-])(integration|int)([/_.-]|$)/i],
    ["e2e", /(^|[/_.-])(e2e|end-to-end|offline|online)([/_.-]|$)/i],
];
// A runner that can only drive the whole system through its external interface
// is evidence, not a guess. Nothing else here is: a token in a filename is a
// convention someone may not have followed.
const STRONG_RUNNER_KINDS = { playwright: "e2e" };
// The most specific token in a segment wins, not the first one this list
// happens to hold. `checkout-integration-e2e` is an e2e spec whose name notes
// what it integrates; ordering by array position called it an integration.
function segmentKind(segment) {
    if (!segment)
        return undefined;
    // gatewayE2e.test.ts and responseIntegration.test.ts are conventional
    // camel-case paths too. Do not infer kinds from test titles or API usage.
    const words = segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2");
    let best;
    for (const [kind, pattern] of NORMALIZED_KINDS) {
        const found = words.search(pattern);
        if (found >= 0 && (best === undefined || found > best.at))
            best = { kind, at: found };
    }
    return best?.kind;
}
function classifiedKind(value) {
    if (!value)
        return undefined;
    return segmentKind(value);
}
// A directory is a deliberate choice about where a suite lives; a filename is
// often just a description of the thing under test. Read directories from the
// deepest inwards, so the nearest enclosing suite wins.
function directoryKind(file) {
    if (!file)
        return undefined;
    const segments = file.split(/[/\\]/).slice(0, -1);
    for (let index = segments.length - 1; index >= 0; index -= 1) {
        const kind = segmentKind(segments[index]);
        if (kind)
            return kind;
    }
    return undefined;
}
function basenameKind(file) {
    if (!file)
        return undefined;
    return segmentKind(file.split(/[/\\]/).pop());
}
export function inferTestProvenance({ runner, file, project, explicitKind, }) {
    if (explicitKind?.trim()) {
        return {
            runner,
            kind: explicitKind.trim().toLowerCase(),
            ...(project ? { project } : {}),
            source: "explicit",
        };
    }
    const projectKind = classifiedKind(project);
    if (projectKind) {
        return {
            runner,
            kind: projectKind,
            ...(project ? { project } : {}),
            source: "project",
        };
    }
    // A directory outranks the runner: putting a Playwright spec under
    // `tests/integration/` is a statement about that suite.
    const directory = directoryKind(file);
    if (directory) {
        return {
            runner,
            kind: directory,
            ...(project ? { project } : {}),
            source: "path",
        };
    }
    // A filename token does not. `storefront-empire-integration.spec.ts` drove
    // a real browser; reading `integration` out of its name reported 102 lines
    // as untouched by E2E while a browser had rendered them. The runner knows
    // better than the filename here, so it is asked first.
    const strong = STRONG_RUNNER_KINDS[runner];
    if (strong) {
        return {
            runner,
            kind: strong,
            ...(project ? { project } : {}),
            source: "runner-default",
        };
    }
    const basename = basenameKind(file);
    if (basename) {
        return {
            runner,
            kind: basename,
            ...(project ? { project } : {}),
            source: "path",
        };
    }
    const defaultKind = runner === "vitest" || runner === "jest" || runner === "node:test"
        ? "unit"
        : "unknown";
    return {
        runner,
        kind: defaultKind,
        ...(project ? { project } : {}),
        source: defaultKind === "unknown" ? "unknown" : "runner-default",
    };
}
