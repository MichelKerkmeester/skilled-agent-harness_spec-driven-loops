// Shared helpers for the crate's integration tests.
// The frame loader reads the design mockups and the fixture helper builds a fake CLI.
// Each test binary uses only some of the helpers, so unused ones are allowed.
#![allow(dead_code)]
pub mod fixture;
pub mod frames;
