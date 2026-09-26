// The import seam instrumented sources use for capability discovery.
//
// Instrumented files import this module instead of the launch supervisor, so
// a browser bundle of instrumented code carries no Node built-ins -- vite's
// rollup pass fails hard on `node:fs` inside a browser target, and a Shopify
// extension build of an instrumented app was the field case. In Node,
// register.mjs binds the real implementation before any user module
// evaluates; in a browser there are no processes to supervise and the seam
// stays a pass-through.
const passthrough = (value) => value;
let implementation = passthrough;

export function __supercovBindCapabilityWrapper(wrap) {
    implementation = wrap;
}

export function wrapImportedCapability(value) {
    return implementation(value);
}
