// Exercises the requestAnimationFrame callback error path.
// Run: cd .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad && node ../../test-minified-runtime.mjs
window.requestAnimationFrame(function () { undefined_frame_helper(); });
