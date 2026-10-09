// Exercises the setTimeout callback error path.
// Run: cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs
window.setTimeout(function () { throw new Error('timer callback failed'); }, 50);
