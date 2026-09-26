//! Compiler bridge fixture.
//!
//! ```
//! assert_eq!(supercov_rustc_spike_fixture::authored(true), 1);
//! assert_eq!(probe_macros::generated_expression!(), 41);
//! probe_macros::generated_local_function!();
//! assert_eq!(generated_local_by_proc(true), 47);
//! ```

macro_rules! generated_function {
    () => {
        pub fn generated_by_rules(value: bool) -> usize {
            if value { 3 } else { 5 }
        }
    };
}

macro_rules! generated_match_function {
    () => {
        pub fn generated_match(value: bool) -> usize {
            match value {
                true => 23,
                false => 29,
            }
        }
    };
}

generated_function!();
generated_match_function!();
external_rules::external_choice_function!(generated_by_external_rules);
probe_macros::generated_function!();
probe_macros::generated_match_function!();
probe_macros::generated_guarded_match_function!();
probe_macros::generated_nested_match_function!();
probe_macros::generated_loop_nested_match_function!();
probe_macros::generated_nested_scrutinee_match_function!();
probe_macros::generated_nested_guard_match_function!();
probe_macros::generated_let_else_function!();
probe_macros::generated_two_let_else_function!();
probe_macros::generated_try_function!();
probe_macros::generated_two_try_function!();
probe_macros::generated_nested_try_function!();
probe_macros::generated_assertion_function!();
probe_macros::generated_nested_external_function!();

#[probe_macros::generated_choice]
pub fn attributed_choice(_first: bool, _second: bool) -> usize {
    unreachable!("the attribute macro replaces this body")
}

pub mod repeated_expansions {
    generated_function!();
    external_rules::external_choice_function!(generated_by_external_rules);
    probe_macros::generated_function!();
}

#[derive(probe_macros::SupercovChoice)]
pub struct DerivedChoice;

#[derive(probe_macros::SupercovChoice)]
pub struct UnusedDerivedChoice;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

pub const fn const_decision(value: bool) -> usize {
    if value { 11 } else { 13 }
}

pub const CONST_VALUE: usize = const_decision(true);
pub const CONST_FALSE_VALUE: usize = const_decision(false);

pub const DIRECT_CONST_TRUE: usize = if true { 17 } else { 19 };
pub const DIRECT_CONST_FALSE: usize = if false { 23 } else { 29 };

pub static STATIC_CONST_TRUE: usize = if true { 31 } else { 37 };
pub static STATIC_CONST_FALSE: usize = if false { 41 } else { 43 };

pub const fn const_generic_decision<const ENABLED: bool>() -> usize {
    if ENABLED { 47 } else { 53 }
}

pub const CONST_GENERIC_TRUE: usize = const_generic_decision::<true>();
pub const CONST_GENERIC_FALSE: usize = const_generic_decision::<false>();

pub const fn const_mixed(first: bool, second: bool, third: bool) -> usize {
    if (first || second) && third { 83 } else { 89 }
}

pub const CONST_MIXED_FALSE_FALSE: usize = const_mixed(false, false, true);
pub const CONST_MIXED_SECOND_TRUE: usize = const_mixed(false, true, true);
pub const CONST_MIXED_FIRST_TRUE_FALSE: usize = const_mixed(true, false, false);
pub const CONST_MIXED_FIRST_TRUE_TRUE: usize = const_mixed(true, false, true);

pub const fn const_logical_value(first: bool, second: bool, third: bool) -> bool {
    first && second || third
}

pub const CONST_LOGICAL_FALSE_FALSE: bool = const_logical_value(false, false, false);
pub const CONST_LOGICAL_FALSE_TRUE: bool = const_logical_value(false, false, true);
pub const CONST_LOGICAL_TRUE_TRUE: bool = const_logical_value(true, true, false);
pub const CONST_LOGICAL_TRUE_FALSE: bool = const_logical_value(true, false, false);

pub const fn const_nested(first: bool, second: bool) -> usize {
    if first {
        if second { 97 } else { 101 }
    } else {
        103
    }
}

pub const CONST_NESTED_OUTER_FALSE: usize = const_nested(false, true);
pub const CONST_NESTED_INNER_FALSE: usize = const_nested(true, false);
pub const CONST_NESTED_INNER_TRUE: usize = const_nested(true, true);

pub const fn const_match(value: u8) -> usize {
    match value {
        0 => 107,
        1 => 109,
        _ => 113,
    }
}

pub const CONST_MATCH_FIRST: usize = const_match(0);
pub const CONST_MATCH_SECOND: usize = const_match(1);
pub const CONST_MATCH_FALLBACK: usize = const_match(2);

pub const fn const_let_else(value: Option<usize>) -> usize {
    let Some(value) = value else {
        return 127;
    };
    value
}

pub const CONST_LET_ELSE_MATCHED: usize = const_let_else(Some(131));
pub const CONST_LET_ELSE_FALLBACK: usize = const_let_else(None);

pub const fn const_while(mut remaining: usize, enabled: bool) -> usize {
    let mut count = 0;
    while remaining > 0 && enabled {
        count += 1;
        remaining -= 1;
    }
    count
}

pub const CONST_WHILE_ZERO: usize = const_while(0, true);
pub const CONST_WHILE_ENTERED: usize = const_while(2, true);
pub const CONST_WHILE_DISABLED: usize = const_while(2, false);

pub const fn const_assertion(first: bool, second: bool) -> usize {
    assert!(first || second);
    137
}

pub const CONST_ASSERTION_FIRST: usize = const_assertion(true, false);
pub const CONST_ASSERTION_SECOND: usize = const_assertion(false, true);
pub const DIRECT_CONST_ASSERTION: usize = {
    assert!(true);
    139
};

pub const fn const_debug_assertion(first: bool, second: bool) -> usize {
    debug_assert!(first || second, "const debug assertion failed");
    149
}

pub const CONST_DEBUG_ASSERTION_FIRST: usize = const_debug_assertion(true, false);
pub const CONST_DEBUG_ASSERTION_SECOND: usize = const_debug_assertion(false, true);
pub const DIRECT_CONST_DEBUG_ASSERTION: usize = {
    debug_assert!(true);
    151
};

pub struct ConstGenericValue<const ENABLED: bool>;

impl<const ENABLED: bool> ConstGenericValue<ENABLED> {
    pub const VALUE: usize = if ENABLED { 59 } else { 61 };
}

pub const ASSOCIATED_CONST_TRUE: usize = ConstGenericValue::<true>::VALUE;
pub const ASSOCIATED_CONST_FALSE: usize = ConstGenericValue::<false>::VALUE;

pub const ARRAY_DECISION_LEN: usize = [0_u8; if true { 2 } else { 3 }].len();

pub fn inline_const_values() -> [usize; 2] {
    [
        const { if true { 67 } else { 71 } },
        const { if false { 73 } else { 79 } },
    ]
}

pub fn promoted_literal() -> &'static usize {
    &157
}

pub fn promoted_array() -> &'static [usize; 3] {
    &[2, 3, 5]
}

pub trait RuntimeChoice {
    fn enabled(&self) -> bool;

    fn default_choice(&self) -> usize {
        if self.enabled() { 211 } else { 223 }
    }
}

pub struct EnabledChoice;

impl RuntimeChoice for EnabledChoice {
    fn enabled(&self) -> bool {
        true
    }
}

pub struct DisabledChoice;

impl RuntimeChoice for DisabledChoice {
    fn enabled(&self) -> bool {
        false
    }
}

pub struct OverrideChoice(pub bool);

impl RuntimeChoice for OverrideChoice {
    fn enabled(&self) -> bool {
        self.0
    }

    fn default_choice(&self) -> usize {
        if self.0 { 227 } else { 229 }
    }
}

pub fn generic_choice<T: RuntimeChoice>(value: &T) -> usize {
    if value.enabled() { 233 } else { 239 }
}

pub fn dynamic_choice(value: &dyn RuntimeChoice) -> usize {
    value.default_choice()
}

pub struct YieldOnce {
    value: bool,
    yielded: bool,
}

impl YieldOnce {
    pub fn new(value: bool) -> Self {
        Self {
            value,
            yielded: false,
        }
    }
}

impl std::future::Future for YieldOnce {
    type Output = bool;

    fn poll(
        self: std::pin::Pin<&mut Self>,
        context: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Self::Output> {
        let this = self.get_mut();
        if this.yielded {
            std::task::Poll::Ready(this.value)
        } else {
            this.yielded = true;
            context.waker().wake_by_ref();
            std::task::Poll::Pending
        }
    }
}

pub async fn async_choice(value: bool) -> usize {
    if YieldOnce::new(value).await {
        241
    } else {
        251
    }
}

#[allow(async_fn_in_trait)]
pub trait AsyncRuntimeChoice: RuntimeChoice {
    async fn async_default_choice(&self, value: bool) -> usize {
        let awaited = YieldOnce::new(value).await;
        if self.enabled() && awaited { 257 } else { 263 }
    }
}

impl AsyncRuntimeChoice for EnabledChoice {}

impl AsyncRuntimeChoice for DisabledChoice {}

impl AsyncRuntimeChoice for OverrideChoice {
    async fn async_default_choice(&self, value: bool) -> usize {
        if YieldOnce::new(self.0 && value).await {
            269
        } else {
            271
        }
    }
}

pub async fn async_trait_choice<T: AsyncRuntimeChoice>(value: &T, flag: bool) -> usize {
    value.async_default_choice(flag).await
}

impl EnabledChoice {
    pub fn associated_generic_choice<T: RuntimeChoice>(value: &T, outer: bool) -> usize {
        if outer && value.enabled() { 277 } else { 281 }
    }
}

pub fn nested_generic_choice<T: RuntimeChoice>(first: bool, second: bool, value: &T) -> bool {
    if first && value.enabled() || second {
        true
    } else {
        false
    }
}

pub fn logical_value_choice(first: bool, second: bool, third: bool) -> bool {
    first && second || third
}

pub trait AssociatedRuntimeChoice: RuntimeChoice {
    type Marker;

    fn associated_enabled() -> bool;

    fn associated_default(&self, flag: bool) -> usize {
        if Self::associated_enabled() && flag {
            307
        } else {
            311
        }
    }
}

impl AssociatedRuntimeChoice for EnabledChoice {
    type Marker = usize;

    fn associated_enabled() -> bool {
        true
    }
}

impl AssociatedRuntimeChoice for DisabledChoice {
    type Marker = bool;

    fn associated_enabled() -> bool {
        false
    }
}

pub trait GatRuntimeChoice: RuntimeChoice {
    type Borrowed<'a>: std::ops::Deref<Target = bool>
    where
        Self: 'a;

    fn borrow_choice<'a>(&'a self, value: &'a bool) -> Self::Borrowed<'a>;

    fn gat_default(&self, value: &bool) -> usize {
        if *self.borrow_choice(value) && self.enabled() {
            313
        } else {
            317
        }
    }
}

impl GatRuntimeChoice for EnabledChoice {
    type Borrowed<'a> = &'a bool;

    fn borrow_choice<'a>(&'a self, value: &'a bool) -> Self::Borrowed<'a> {
        value
    }
}

impl GatRuntimeChoice for DisabledChoice {
    type Borrowed<'a> = &'a bool;

    fn borrow_choice<'a>(&'a self, value: &'a bool) -> Self::Borrowed<'a> {
        value
    }
}

pub trait OpaqueRuntimeChoice: RuntimeChoice {
    fn opaque_values(&self, flag: bool) -> impl Iterator<Item = usize> {
        let value = if self.enabled() && flag { 331 } else { 337 };
        std::iter::once(value)
    }
}

impl OpaqueRuntimeChoice for EnabledChoice {}
impl OpaqueRuntimeChoice for DisabledChoice {}

pub fn opaque_choice<T: OpaqueRuntimeChoice>(value: &T, flag: bool) -> usize {
    value.opaque_values(flag).sum()
}

pub fn hrtb_choice<F>(value: bool, predicate: F) -> usize
where
    F: for<'a> Fn(&'a bool) -> bool,
{
    if predicate(&value) && value {
        347
    } else {
        349
    }
}

pub async fn async_closure_choice(value: bool) -> usize {
    let choose = async |input: bool| {
        if YieldOnce::new(input).await {
            283
        } else {
            293
        }
    };
    choose(value).await
}

struct AsyncDrop<'a>(&'a std::cell::RefCell<Vec<&'static str>>);

impl Drop for AsyncDrop<'_> {
    fn drop(&mut self) {
        self.0.borrow_mut().push("async-drop");
    }
}

pub async fn suspended_borrow_choice(
    value: bool,
    log: &std::cell::RefCell<Vec<&'static str>>,
) -> usize {
    let mut number = 5;
    let borrowed = &mut number;
    let _drop = AsyncDrop(log);
    let awaited = YieldOnce::new(value).await;
    *borrowed += if awaited { 7 } else { 11 };
    *borrowed
}

pub fn let_else_value(value: Option<usize>) -> usize {
    let Some(value) = value else {
        return 0;
    };
    value
}

pub fn nested_let_else(value: Option<Result<usize, usize>>) -> usize {
    let Some(Ok(value)) = value else {
        return 0;
    };
    value
}

pub fn two_let_else(first: Option<usize>, second: Option<usize>) -> usize {
    let Some(first) = first else {
        return 0;
    };
    let Some(second) = second else {
        return first;
    };
    first + second
}

pub fn try_result(value: Result<usize, &'static str>) -> Result<usize, &'static str> {
    Ok(value? + 1)
}

pub fn try_option(value: Option<usize>) -> Option<usize> {
    Some(value? + 1)
}

pub fn two_try_results(
    first: Result<usize, &'static str>,
    second: Result<usize, &'static str>,
) -> Result<usize, &'static str> {
    Ok(first? + second?)
}

pub fn nested_try_result(
    value: Result<Result<usize, &'static str>, &'static str>,
) -> Result<usize, &'static str> {
    Ok(value?? + 1)
}

pub fn panic_before_try() -> Result<usize, &'static str> {
    fn operand() -> Result<usize, &'static str> {
        panic!("try operand")
    }
    Ok(operand()? + 1)
}

pub fn assert_compound(left: bool, right: bool) {
    assert!(left && right, "compound assertion failed: {left}/{right}");
}

pub fn assert_literal_true() {
    assert!(true, "literal true assertion failed");
}

pub fn assert_literal_false() {
    assert!(false, "literal false assertion failed");
}

pub fn debug_assert_literal_true() {
    debug_assert!(true, "literal true debug assertion failed");
}

pub fn debug_assert_literal_false() {
    debug_assert!(false, "literal false debug assertion failed");
}

pub fn assert_literal_conjunction(right: bool) {
    assert!(true && right, "literal-first conjunction failed");
}

pub fn assert_literal_disjunction(right: bool) {
    assert!(false || right, "literal-first disjunction failed");
}

pub fn assert_constant_expression_true() {
    assert!(1 + 1 == 2, "constant expression assertion failed");
}

pub fn assert_named_constant_false() {
    const CONDITION: bool = false;
    assert!(CONDITION, "named constant assertion failed");
}

pub fn assert_equal(left: usize, right: usize) {
    assert_eq!(left, right, "values differ");
}

pub fn assert_not_equal(left: usize, right: usize) {
    assert_ne!(left, right, "values unexpectedly equal");
}

pub fn debug_assert_compound(left: bool, right: bool) {
    debug_assert!(left && right, "debug compound assertion failed");
}

pub fn debug_assert_equal(left: usize, right: usize) {
    debug_assert_eq!(left, right, "debug values differ");
}

pub fn debug_assert_not_equal(left: usize, right: usize) {
    debug_assert_ne!(left, right, "debug values unexpectedly equal");
}

pub fn assert_panicking_condition() {
    fn condition() -> bool {
        panic!("assertion condition")
    }
    assert!(condition());
}

pub fn assert_panicking_message_argument() {
    fn message() -> &'static str {
        panic!("assertion message argument")
    }

    assert!(std::hint::black_box(false), "{}", message());
}

pub fn assert_equal_evaluation_order(log: &std::cell::RefCell<Vec<&'static str>>) {
    fn operand(
        log: &std::cell::RefCell<Vec<&'static str>>,
        label: &'static str,
        value: usize,
    ) -> usize {
        log.borrow_mut().push(label);
        value
    }

    assert_eq!(operand(log, "left", 7), operand(log, "right", 7));
}

/// A non-mergeable doctest with a hidden setup line.
///
/// ```standalone_crate
/// # let hidden = std::hint::black_box(20);
/// let combined = hidden
///     + std::hint::black_box(2);
/// assert_eq!(combined, 22);
/// assert_eq!(hidden + 2, 22);
/// assert_eq!(supercov_rustc_spike_fixture::authored(false), 2);
/// ```
pub fn standalone_doctest_surface() {}

/// The rustdoc launcher must not leak its private unstable-option bootstrap
/// into user doctest compilation.
///
/// ```compile_fail
/// #![feature(test)]
/// extern crate test;
/// ```
pub fn stable_feature_gate_doctest_surface() {}

/// Descriptor metadata must survive the compiler-owned merged-doctest map.
///
/// ```ignore
/// panic!("an ignored doctest must not execute");
/// ```
///
/// ```no_run
/// panic!("a no-run doctest must only compile");
/// ```
///
/// ```should_panic
/// panic!("an expected panic must count as passing");
/// ```
pub fn doctest_execution_modes() {}

pub fn authored(value: bool) -> usize {
    if value { 1 } else { 2 }
}

/// One cfg!-eliminated statement sharing a body with ordinary ones. The
/// eliminated statement must be declined as unmeasured while its neighbours
/// stay instrumented and are reported COVERED -- the defect fixed in 413d2e2
/// left every other statement in such a body uninstrumented, so they never
/// fired and were reported uncovered.
pub fn eliminated_neighbours(value: usize, log: &mut Vec<&'static str>) -> usize {
    log.push("before-eliminated");
    let total = if cfg!(target_os = "none") {
        let eliminated_statement = value + 211;
        eliminated_statement
    } else {
        value + 223
    };
    log.push("after-eliminated");
    total
}

/// zmij's shape: a branch on a monomorphic `const` folds at compile time
/// exactly like the literal `cfg!` expands to, so the ruled-out arm never
/// reaches MIR. Its statements and the decision itself are unmeasurable in
/// this configuration, never binder blind spots — and the surviving arm plus
/// both neighbours must stay measured.
pub const CONST_ELIMINATION_WIDE: bool = usize::BITS >= 32;

pub fn const_eliminated_neighbours(value: usize, log: &mut Vec<&'static str>) -> usize {
    log.push("before-const-eliminated");
    let total = if CONST_ELIMINATION_WIDE {
        value + 331
    } else {
        let const_eliminated_statement = value + 337;
        const_eliminated_statement
    };
    log.push("after-const-eliminated");
    total
}

pub struct ConstEliminationTable;

impl ConstEliminationTable {
    pub const ENABLE: bool = usize::BITS >= 32;
}

/// zmij's tail family: the constant-selected arm ends in a tail `return`,
/// so the fallback after the `if` never lowers — its statements and its own
/// decisions are unmeasurable in this configuration, and the code before the
/// `if` plus the live arm must stay measured.
pub fn const_diverging_neighbours(value: usize, log: &mut Vec<&'static str>) -> usize {
    log.push("before-const-diverging");
    if ConstEliminationTable::ENABLE {
        log.push("const-diverging-live");
        return value + 401;
    }
    let const_diverging_dead = if value >= 7 { value + 409 } else { value + 419 };
    log.push("after-const-diverging");
    const_diverging_dead
}

/// The follow-on shapes: a constant operand inside a multi-condition
/// decision is not a run-time condition (`while i < limit && ENABLE`), and a
/// negated constant folds exactly as its operand does.
pub fn const_operand_neighbours(limit: usize, log: &mut Vec<&'static str>) -> usize {
    let mut index = 0;
    while index < limit && ConstEliminationTable::ENABLE {
        index += 1;
    }
    if !ConstEliminationTable::ENABLE {
        log.push("negated-const-dead");
    }
    log.push("after-const-operand");
    index
}

/// Two decisions whose CFG blocks meet on one edge: the first `if`'s merge
/// block is the second `if`'s entry. Probes for the first decision's outcome
/// and the second's entry attach around the same edge, and each decision
/// must keep exact, independent vectors (#32).
pub fn shared_edge_decisions(first: bool, second: bool) -> usize {
    let mut total = 1;
    if first {
        total += 3;
    }
    if second {
        total += 5;
    }
    total
}

pub fn statement_paths(value: bool, log: &mut Vec<&'static str>) {
    if value {
        log.push("true-path");
    } else {
        log.push("false-path");
    }
    log.push("after-path");
}

pub fn compound(left: bool, right: bool) -> usize {
    if left && right { 29 } else { 31 }
}

pub fn opaque_macro_compound(value: Option<u8>, enabled: bool) -> usize {
    if matches!(value, Some(1 | 2)) && enabled {
        433
    } else {
        439
    }
}

pub fn opaque_macro_nested(
    first: bool,
    first_value: Option<u8>,
    second_value: Option<u8>,
    fallback: bool,
) -> usize {
    if (first && matches!(first_value, Some(1 | 2)))
        || (matches!(second_value, Some(3 | 5)) && fallback)
    {
        443
    } else {
        449
    }
}

pub fn opaque_macro_guard(value: Option<u8>, enabled: bool) -> usize {
    match value {
        candidate if matches!(candidate, Some(1 | 2)) && enabled => 457,
        _ => 461,
    }
}

pub fn disjoined(left: bool, right: bool) -> usize {
    if left || right { 47 } else { 49 }
}

pub fn mixed(first: bool, second: bool, third: bool) -> usize {
    if (first || second) && third { 53 } else { 59 }
}

pub enum SharedBodyChoice {
    First(usize),
    Second(usize),
}

/// The body fragment is written once and expanded into BOTH arms, so the arms
/// carry the identical body span. Spans cannot tell them apart -- MIR puts the
/// scrutinee span on the test blocks, not the arm patterns -- so binding has to
/// separate them by the discriminant instead.
macro_rules! shared_arm_body_macro {
    ($value:expr, $pattern:pat => $result:expr) => {
        match $value {
            SharedBodyChoice::First($pattern) => $result,
            SharedBodyChoice::Second($pattern) => $result,
        }
    };
}

pub fn shared_arm_body(choice: &SharedBodyChoice) -> usize {
    shared_arm_body_macro!(*choice, ref inner => *inner + 103)
}

/// A negated chain is two conditions, not one. Recorded atomically it reports a
/// merged MC/DC number for a decision that genuinely has two operands.
pub fn negated_chain(first: bool, second: bool) -> usize {
    if !(first || second) { 83 } else { 89 }
}

/// The same shape with a compile-time operand. `cfg!` folds away, leaving no
/// switch for a decomposed condition to bind to, so this one must stay atomic --
/// and must keep its decision rather than dropping out of the denominator.
pub fn negated_chain_with_cfg(first: bool, second: bool) -> usize {
    // `none` is a known target_os (bare metal), so this is false on every
    // platform the corpus runs on and the expectation stays platform-stable.
    if !(first || (cfg!(target_os = "none") && second)) {
        97
    } else {
        101
    }
}

pub fn nested(first: bool, second: bool, third: bool) -> usize {
    if first {
        if second && third { 71 } else { 73 }
    } else {
        79
    }
}

pub fn nested_expression(first: bool, second: bool, third: bool, fourth: bool) -> usize {
    if first && (if second { third } else { fourth }) {
        83
    } else {
        89
    }
}

pub fn while_compound(mut remaining: usize, enabled: bool) -> usize {
    let mut entered = 0;
    while remaining > 0 && enabled {
        entered += 1;
        remaining -= 1;
    }
    entered
}

pub fn while_let_chain(mut values: Vec<Option<usize>>, enabled: bool) -> usize {
    let mut total = 0;
    while let Some(Some(value)) = values.pop()
        && value > 0
        && enabled
    {
        total += value;
    }
    total
}

pub fn for_values(values: Vec<usize>) -> usize {
    let mut total = 0;
    for value in values {
        total += value;
    }
    total
}

pub fn for_break(values: Vec<usize>) -> usize {
    for value in values {
        return value;
    }
    0
}

pub fn two_for_values(first: Vec<usize>, second: Vec<usize>) -> usize {
    let mut total = 0;
    for value in first {
        total += value;
    }
    for value in second {
        total += value;
    }
    total
}

pub fn nested_for_values(rows: Vec<Vec<usize>>) -> usize {
    let mut total = 0;
    for row in rows {
        for value in row {
            total += value;
        }
    }
    total
}

struct PanicOnNext;

impl Iterator for PanicOnNext {
    type Item = usize;

    #[inline(never)]
    fn next(&mut self) -> Option<Self::Item> {
        panic!("iterator-next-panic")
    }
}

pub fn interrupted_for() {
    for _value in PanicOnNext {}
}

pub fn match_value(value: Option<usize>, enabled: bool) -> usize {
    match value {
        Some(value) if value > 0 && enabled => value,
        Some(_) => 2,
        None => 0,
    }
}

pub fn match_identical(value: u8) -> usize {
    match value {
        0 => 7,
        1 => 7,
        _ => 9,
    }
}

pub fn match_empty(value: bool) {
    match value {
        true => {}
        false => {}
    }
}

pub fn match_irrefutable(value: usize) -> usize {
    match value {
        value => value + 1,
    }
}

#[allow(unreachable_patterns)]
pub fn match_unreachable(value: bool) -> usize {
    match value {
        true => 1,
        false => 2,
        _ => 3,
    }
}

pub fn nested_match(value: Option<Result<usize, usize>>) -> usize {
    match value {
        Some(result) => match result {
            Ok(value) => value,
            Err(value) => value + 10,
        },
        None => 0,
    }
}

#[inline(never)]
fn panic_guard() -> bool {
    panic!("match-guard-panic")
}

pub fn interrupted_match(value: Option<usize>) -> usize {
    match value {
        Some(value) if panic_guard() => value,
        _ => 0,
    }
}

#[inline(never)]
fn panic_condition() -> bool {
    panic!("decision-condition-panic")
}

pub fn interrupted_decision(first: bool) -> usize {
    if first && panic_condition() { 61 } else { 67 }
}

pub fn pattern(value: Option<bool>) -> usize {
    if let Some(value) = value {
        usize::from(value)
    } else {
        37
    }
}

pub fn chained(value: Option<bool>, enabled: bool) -> usize {
    if let Some(value) = value
        && value
        && enabled
    {
        41
    } else {
        43
    }
}

pub fn fallible(value: usize) -> Result<usize, &'static str> {
    if value == 0 {
        Err("zero")
    } else {
        Ok(value + 1)
    }
}

struct DropMarker<'a> {
    label: &'static str,
    log: &'a std::cell::RefCell<Vec<&'static str>>,
}

impl Drop for DropMarker<'_> {
    fn drop(&mut self) {
        self.log.borrow_mut().push(self.label);
    }
}

pub fn drop_order(log: &std::cell::RefCell<Vec<&'static str>>) -> usize {
    let _first = DropMarker {
        label: "first",
        log,
    };
    let _second = DropMarker {
        label: "second",
        log,
    };
    23
}

pub fn panic_path(log: &std::cell::RefCell<Vec<&'static str>>) {
    let _guard = DropMarker {
        label: "panic-drop",
        log,
    };
    panic!("expected-panic");
}

pub fn context_normal_scope() -> usize {
    authored(true)
}

pub fn context_panic_scope(log: &std::cell::RefCell<Vec<&'static str>>) {
    panic_path(log);
}

/// One macro body invoked twice in the same function. Both invocations expand
/// the same authored source, so they aggregate into a single obligation even
/// though each recording carries its own visit-order metadata.
#[macro_export]
macro_rules! flagged_choice {
    ($flag:expr) => {
        if $flag { 1 } else { 2 }
    };
}

pub fn macro_inside_and_outside_arm(flag: bool) -> usize {
    flagged_choice!(flag) * 10 + flagged_choice!(flag)
}

pub enum AdapterKind {
    Vite,
    Generic,
    Direct,
}

pub fn adapter_flavor(kind: AdapterKind) -> usize {
    let output = match kind {
        AdapterKind::Vite | AdapterKind::Generic => 1,
        AdapterKind::Direct => 2,
    };
    output + 10
}

#[derive(PartialEq, PartialOrd)]
pub struct DerivedOrderLine {
    pub file: String,
    pub line: usize,
}

pub struct DerivedStyleIfLet;

pub trait UnwrapOrSeven {
    fn unwrap_or_seven(input: Result<usize, bool>) -> usize;
}

#[automatically_derived]
impl UnwrapOrSeven for DerivedStyleIfLet {
    fn unwrap_or_seven(input: Result<usize, bool>) -> usize {
        if let Ok(value) = input { value } else { 7 }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    static CONTEXT_BARRIER: std::sync::Barrier = std::sync::Barrier::new(2);

    #[test]
    fn exercises_every_surface() {
        assert_eq!(authored(true), 1);
        assert_eq!(generated_by_rules(false), 5);
        assert_eq!(generated_by_proc(true), 17);
        assert_eq!(generated_by_build_script(false), 9);
        assert_eq!(CONST_VALUE, 11);
        assert_eq!(CONST_FALSE_VALUE, 13);
        assert_eq!(compound(true, true), 29);
        assert_eq!(compound(true, false), 31);
        assert_eq!(disjoined(true, false), 47);
        assert_eq!(disjoined(false, false), 49);
        assert_eq!(mixed(false, true, true), 53);
        assert_eq!(mixed(false, false, true), 59);
        assert_eq!(nested(false, true, true), 79);
        assert_eq!(nested(true, true, true), 71);
        assert_eq!(nested(true, true, false), 73);
        assert_eq!(nested_expression(false, true, true, true), 89);
        assert_eq!(nested_expression(true, true, true, false), 83);
        assert_eq!(nested_expression(true, true, false, true), 89);
        assert_eq!(nested_expression(true, false, false, true), 83);
        assert_eq!(while_compound(0, true), 0);
        assert_eq!(while_compound(2, true), 2);
        assert_eq!(while_compound(2, false), 0);
        assert_eq!(while_let_chain(Vec::new(), true), 0);
        assert_eq!(while_let_chain(vec![Some(2), Some(3)], true), 5);
        assert_eq!(while_let_chain(vec![Some(2)], false), 0);
        assert_eq!(while_let_chain(vec![Some(0)], true), 0);
        assert_eq!(pattern(Some(true)), 1);
        assert_eq!(pattern(None), 37);
        assert_eq!(chained(Some(true), true), 41);
        assert_eq!(chained(Some(false), true), 43);
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike MIR instrumentation"]
    fn records_real_runtime_probes() {
        assert_eq!(authored(true), 1);
        let mut paths = Vec::new();
        statement_paths(true, &mut paths);
        assert_eq!(paths, ["true-path", "after-path"]);
        let mut neighbours = Vec::new();
        assert_eq!(eliminated_neighbours(2, &mut neighbours), 225);
        assert_eq!(neighbours, ["before-eliminated", "after-eliminated"]);
        let mut const_neighbours = Vec::new();
        assert_eq!(const_eliminated_neighbours(2, &mut const_neighbours), 333);
        assert_eq!(
            const_neighbours,
            ["before-const-eliminated", "after-const-eliminated"]
        );
        let mut const_diverging = Vec::new();
        assert_eq!(const_diverging_neighbours(2, &mut const_diverging), 403);
        assert_eq!(
            const_diverging,
            ["before-const-diverging", "const-diverging-live"]
        );
        let mut const_operand = Vec::new();
        assert_eq!(const_operand_neighbours(3, &mut const_operand), 3);
        assert_eq!(const_operand, ["after-const-operand"]);
        assert_eq!(shared_edge_decisions(true, false), 4);
        assert_eq!(shared_edge_decisions(false, true), 6);
        assert_eq!(fallible(2), Ok(3));
        let log = std::cell::RefCell::new(Vec::new());
        assert_eq!(drop_order(&log), 23);
        let panic = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| panic_path(&log)));
        assert!(panic.is_err());
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike context instrumentation"]
    fn context_one() {
        CONTEXT_BARRIER.wait();
        assert_eq!(authored(true), 1);
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike context instrumentation"]
    fn context_two() {
        CONTEXT_BARRIER.wait();
        assert_eq!(fallible(2), Ok(3));
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike context instrumentation"]
    fn decision_context_true() {
        assert_eq!(compound(true, true), 29);
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike context instrumentation"]
    fn decision_context_short_circuit() {
        assert_eq!(compound(false, true), 31);
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike assertion context instrumentation"]
    fn assertion_restore_context() {
        assert_eq!(authored(true), 1);
        let result = fallible(2);
        assert_eq!(result, Ok(3));
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike nested assertion context instrumentation"]
    fn nested_assertion_context() {
        assert!({
            assert_eq!(authored(true), 1);
            fallible(2) == Ok(3)
        });
    }

    #[cfg(supercov_spike_instrumented)]
    #[probe_macros::generated_test]
    #[ignore = "requires compiler-spike context instrumentation"]
    fn attribute_context() {
        assert_eq!(authored(false), 2);
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike context instrumentation"]
    #[should_panic(expected = "expected-panic")]
    fn panic_context() {
        let log = std::cell::RefCell::new(Vec::new());
        panic_path(&log);
    }

    #[cfg(supercov_spike_instrumented)]
    #[test]
    #[ignore = "requires compiler-spike context instrumentation"]
    fn child_context() {
        assert_eq!(std::thread::spawn(|| authored(true)).join().unwrap(), 1);
    }
}
