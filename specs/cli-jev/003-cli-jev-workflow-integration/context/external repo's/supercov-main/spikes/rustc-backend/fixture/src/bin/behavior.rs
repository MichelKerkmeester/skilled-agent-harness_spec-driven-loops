use std::{
    cell::RefCell,
    future::Future,
    panic,
    task::{Context, Poll, Waker},
};

use no_std_fixture::{no_std_choice, no_std_logical_value, no_std_match};

use supercov_rustc_spike_fixture::{
    ARRAY_DECISION_LEN, ASSOCIATED_CONST_FALSE, ASSOCIATED_CONST_TRUE, CONST_ASSERTION_FIRST,
    CONST_ASSERTION_SECOND, CONST_DEBUG_ASSERTION_FIRST, CONST_DEBUG_ASSERTION_SECOND,
    CONST_FALSE_VALUE, CONST_GENERIC_FALSE, CONST_GENERIC_TRUE, CONST_LET_ELSE_FALLBACK,
    CONST_LET_ELSE_MATCHED, CONST_LOGICAL_FALSE_FALSE, CONST_LOGICAL_FALSE_TRUE,
    CONST_LOGICAL_TRUE_FALSE, CONST_LOGICAL_TRUE_TRUE, CONST_MATCH_FALLBACK, CONST_MATCH_FIRST,
    CONST_MATCH_SECOND,
    CONST_MIXED_FALSE_FALSE, CONST_MIXED_FIRST_TRUE_FALSE, CONST_MIXED_FIRST_TRUE_TRUE,
    CONST_MIXED_SECOND_TRUE, CONST_NESTED_INNER_FALSE, CONST_NESTED_INNER_TRUE,
    CONST_NESTED_OUTER_FALSE, CONST_VALUE, CONST_WHILE_DISABLED, CONST_WHILE_ENTERED,
    CONST_WHILE_ZERO, DIRECT_CONST_ASSERTION, DIRECT_CONST_DEBUG_ASSERTION, DIRECT_CONST_FALSE,
    DIRECT_CONST_TRUE, AssociatedRuntimeChoice, DerivedChoice, DisabledChoice, EnabledChoice,
    GatRuntimeChoice, OverrideChoice, RuntimeChoice,
    STATIC_CONST_FALSE, STATIC_CONST_TRUE, assert_compound, assert_constant_expression_true,
    assert_equal, assert_equal_evaluation_order, assert_literal_conjunction,
    assert_literal_disjunction, assert_literal_false, assert_literal_true,
    assert_named_constant_false, assert_not_equal, assert_panicking_condition,
    assert_panicking_message_argument, async_choice, async_closure_choice, async_trait_choice,
    attributed_choice, authored, chained, compound, context_normal_scope, context_panic_scope, shared_edge_decisions,
    debug_assert_compound, debug_assert_equal, debug_assert_literal_false, debug_assert_literal_true,
    debug_assert_not_equal, disjoined, drop_order, dynamic_choice, fallible, for_break, for_values,
    generated_assertion_by_proc,
    generated_by_build_script, generated_by_external_rules, generated_by_proc, generated_by_rules,
    generated_guarded_match_by_proc, generated_let_else_by_proc, generated_match,
    generated_match_by_proc, generated_nested_guard_match_by_proc, generated_nested_match_by_proc,
    generated_nested_scrutinee_match_by_proc, generated_nested_try_by_proc, generated_try_by_proc,
    generated_nested_external_by_proc, generated_two_let_else_by_proc, generated_two_try_by_proc,
    generic_choice, hrtb_choice,
    inline_const_values,
    interrupted_decision, interrupted_for, interrupted_match, let_else_value, logical_value_choice,
    AdapterKind, DerivedOrderLine, macro_inside_and_outside_arm, DerivedStyleIfLet, UnwrapOrSeven, adapter_flavor,
    generated_loop_nested_match_by_proc,
    match_empty, match_identical, match_irrefutable, match_unreachable, match_value, mixed, nested,
    nested_expression, nested_for_values, nested_generic_choice, nested_let_else, nested_match,
    nested_try_result, opaque_choice, opaque_macro_compound, opaque_macro_guard,
    opaque_macro_nested, panic_before_try, panic_path, pattern, promoted_array, promoted_literal,
    repeated_expansions,
    suspended_borrow_choice, try_option, try_result, two_for_values, two_let_else, two_try_results,
    while_compound, while_let_chain,
};

fn block_on<F: Future>(future: F) -> F::Output {
    let waker = Waker::noop();
    let mut context = Context::from_waker(waker);
    let mut future = std::pin::pin!(future);
    loop {
        match future.as_mut().poll(&mut context) {
            Poll::Ready(output) => return output,
            Poll::Pending => std::thread::yield_now(),
        }
    }
}

fn main() {
    let log = RefCell::new(Vec::new());
    let previous_hook = panic::take_hook();
    panic::set_hook(Box::new(|_| {}));
    let panic = panic::catch_unwind(panic::AssertUnwindSafe(|| panic_path(&log)));
    assert_eq!(context_normal_scope(), 1);
    let context_log = RefCell::new(Vec::new());
    let context_panic = panic::catch_unwind(panic::AssertUnwindSafe(|| {
        context_panic_scope(&context_log)
    }));
    let interrupted = panic::catch_unwind(|| interrupted_decision(true));
    let interrupted_for = panic::catch_unwind(interrupted_for);
    let interrupted_match = panic::catch_unwind(|| interrupted_match(Some(3)));
    let assertion_panics = [
        panic::catch_unwind(|| assert_compound(false, true)).is_err(),
        panic::catch_unwind(|| assert_compound(true, false)).is_err(),
        panic::catch_unwind(|| assert_compound(true, true)).is_err(),
        panic::catch_unwind(|| assert_equal(1, 1)).is_err(),
        panic::catch_unwind(|| assert_equal(1, 2)).is_err(),
        panic::catch_unwind(|| assert_not_equal(1, 2)).is_err(),
        panic::catch_unwind(|| assert_not_equal(1, 1)).is_err(),
        panic::catch_unwind(|| debug_assert_compound(false, true)).is_err(),
        panic::catch_unwind(|| debug_assert_compound(true, false)).is_err(),
        panic::catch_unwind(|| debug_assert_compound(true, true)).is_err(),
        panic::catch_unwind(|| debug_assert_equal(1, 1)).is_err(),
        panic::catch_unwind(|| debug_assert_equal(1, 2)).is_err(),
        panic::catch_unwind(|| debug_assert_not_equal(1, 2)).is_err(),
        panic::catch_unwind(|| debug_assert_not_equal(1, 1)).is_err(),
        panic::catch_unwind(|| generated_assertion_by_proc(false, true)).is_err(),
        panic::catch_unwind(|| generated_assertion_by_proc(true, false)).is_err(),
        panic::catch_unwind(|| generated_assertion_by_proc(true, true)).is_err(),
        panic::catch_unwind(assert_literal_true).is_err(),
        panic::catch_unwind(assert_literal_false).is_err(),
        panic::catch_unwind(debug_assert_literal_true).is_err(),
        panic::catch_unwind(debug_assert_literal_false).is_err(),
        panic::catch_unwind(|| assert_literal_conjunction(false)).is_err(),
        panic::catch_unwind(|| assert_literal_conjunction(true)).is_err(),
        panic::catch_unwind(|| assert_literal_disjunction(false)).is_err(),
        panic::catch_unwind(|| assert_literal_disjunction(true)).is_err(),
        panic::catch_unwind(assert_constant_expression_true).is_err(),
        panic::catch_unwind(assert_named_constant_false).is_err(),
    ];
    let assertion_condition_panic = panic::catch_unwind(assert_panicking_condition);
    let assertion_message_panic = panic::catch_unwind(assert_panicking_message_argument);
    let assertion_order = RefCell::new(Vec::new());
    assert_equal_evaluation_order(&assertion_order);
    panic::set_hook(previous_hook);
    assert!(context_panic.is_err());
    assert_eq!(authored(true), 1);

    println!("authored={:?}", [authored(false), authored(true)]);
    println!("fallible={:?}", [fallible(0), fallible(4)]);
    println!("drop-value={}", drop_order(&log));
    println!("panic={}", panic.is_err());
    println!("decision-panic={}", interrupted.is_err());
    println!("for-panic={}", interrupted_for.is_err());
    println!("match-panic={}", interrupted_match.is_err());
    println!("assertion-panics={assertion_panics:?}");
    println!(
        "assertion-edge-panics={:?}",
        [
            assertion_condition_panic.is_err(),
            assertion_message_panic.is_err()
        ]
    );
    println!("assertion-order={:?}", assertion_order.into_inner());
    println!("drop-order={:?}", log.into_inner());
    println!("const-values={CONST_VALUE:?},{CONST_FALSE_VALUE:?}");
    println!("promoted={:?}", [*promoted_literal(), promoted_array()[1]]);
    println!(
        "ctfe-surfaces={:?}",
        [
            DIRECT_CONST_TRUE,
            DIRECT_CONST_FALSE,
            STATIC_CONST_TRUE,
            STATIC_CONST_FALSE,
            CONST_GENERIC_TRUE,
            CONST_GENERIC_FALSE,
            ASSOCIATED_CONST_TRUE,
            ASSOCIATED_CONST_FALSE,
            ARRAY_DECISION_LEN,
            inline_const_values()[0],
            inline_const_values()[1],
            CONST_MIXED_FALSE_FALSE,
            CONST_MIXED_SECOND_TRUE,
            CONST_MIXED_FIRST_TRUE_FALSE,
            CONST_MIXED_FIRST_TRUE_TRUE,
            CONST_NESTED_OUTER_FALSE,
            CONST_NESTED_INNER_FALSE,
            CONST_NESTED_INNER_TRUE,
            CONST_MATCH_FIRST,
            CONST_MATCH_SECOND,
            CONST_MATCH_FALLBACK,
            CONST_LET_ELSE_MATCHED,
            CONST_LET_ELSE_FALLBACK,
            CONST_WHILE_ZERO,
            CONST_WHILE_ENTERED,
            CONST_WHILE_DISABLED,
            CONST_ASSERTION_FIRST,
            CONST_ASSERTION_SECOND,
            DIRECT_CONST_ASSERTION,
            CONST_DEBUG_ASSERTION_FIRST,
            CONST_DEBUG_ASSERTION_SECOND,
            DIRECT_CONST_DEBUG_ASSERTION,
        ]
    );
    println!(
        "expanded={:?}",
        [
            generated_by_rules(false),
            repeated_expansions::generated_by_rules(true),
            generated_by_external_rules(false),
            repeated_expansions::generated_by_external_rules(true),
            DerivedChoice.derived_choice(false),
            DerivedChoice.derived_choice(true),
            generated_by_proc(false),
            repeated_expansions::generated_by_proc(true),
            generated_by_build_script(false),
        ]
    );
    println!(
        "ctfe-logical-value={:?}",
        [
            CONST_LOGICAL_FALSE_FALSE,
            CONST_LOGICAL_FALSE_TRUE,
            CONST_LOGICAL_TRUE_TRUE,
            CONST_LOGICAL_TRUE_FALSE,
        ]
    );
    println!(
        "generic-trait={:?}",
        [
            generic_choice(&EnabledChoice),
            generic_choice(&DisabledChoice),
            EnabledChoice.default_choice(),
            DisabledChoice.default_choice(),
            dynamic_choice(&EnabledChoice),
            dynamic_choice(&DisabledChoice),
            OverrideChoice(false).default_choice(),
            OverrideChoice(true).default_choice(),
        ]
    );
    println!(
        "async={:?}",
        [block_on(async_choice(false)), block_on(async_choice(true))]
    );
    let async_drop_log = RefCell::new(Vec::new());
    println!(
        "advanced-generic-async={:?}",
        [
            EnabledChoice::associated_generic_choice(&EnabledChoice, true),
            EnabledChoice::associated_generic_choice(&DisabledChoice, true),
            EnabledChoice::associated_generic_choice(&EnabledChoice, false),
            block_on(async_trait_choice(&EnabledChoice, true)),
            block_on(async_trait_choice(&EnabledChoice, false)),
            block_on(async_trait_choice(&DisabledChoice, true)),
            block_on(async_trait_choice(&OverrideChoice(false), true)),
            block_on(async_trait_choice(&OverrideChoice(true), true)),
            block_on(async_closure_choice(false)),
            block_on(async_closure_choice(true)),
            block_on(suspended_borrow_choice(false, &async_drop_log)),
            block_on(suspended_borrow_choice(true, &async_drop_log)),
        ]
    );
    println!("async-drop={:?}", async_drop_log.into_inner());
    println!(
        "nested-generic={:?}",
        [
            nested_generic_choice(false, false, &EnabledChoice),
            nested_generic_choice(false, true, &EnabledChoice),
            nested_generic_choice(true, false, &EnabledChoice),
            nested_generic_choice(true, false, &DisabledChoice),
        ]
    );
    println!(
        "logical-value={:?}",
        [
            logical_value_choice(false, false, false),
            logical_value_choice(false, false, true),
            logical_value_choice(true, true, false),
            logical_value_choice(true, false, false),
        ]
    );
    println!(
        "advanced-types={:?}",
        [
            EnabledChoice.associated_default(true),
            EnabledChoice.associated_default(false),
            DisabledChoice.associated_default(true),
            EnabledChoice.gat_default(&true),
            EnabledChoice.gat_default(&false),
            DisabledChoice.gat_default(&true),
            opaque_choice(&EnabledChoice, true),
            opaque_choice(&EnabledChoice, false),
            opaque_choice(&DisabledChoice, true),
            hrtb_choice(true, |value| *value),
            hrtb_choice(false, |value| *value),
            hrtb_choice(false, |_| true),
        ]
    );
    println!(
        "nested-expansions={:?}",
        [
            attributed_choice(true, true),
            attributed_choice(true, false),
            attributed_choice(false, true),
            generated_nested_external_by_proc(true),
            generated_nested_external_by_proc(false),
        ]
    );
    println!(
        "no-std={:?}",
        [
            no_std_choice(false, true),
            no_std_choice(true, false),
            no_std_choice(true, true),
            usize::from(no_std_logical_value(false, false)),
            usize::from(no_std_logical_value(false, true)),
            usize::from(no_std_logical_value(true, false)),
            no_std_match(None),
            no_std_match(Some(421)),
        ]
    );
    println!(
        "conditions={:?}",
        [
            compound(true, true),
            compound(true, false),
            compound(false, true),
            shared_edge_decisions(true, false),
            shared_edge_decisions(false, true),
            pattern(Some(true)),
            pattern(None),
            chained(Some(true), true),
            chained(Some(false), true),
            chained(None, true),
        ]
    );
    println!(
        "opaque-macro-compound={:?}",
        [
            opaque_macro_compound(None, true),
            opaque_macro_compound(Some(1), false),
            opaque_macro_compound(Some(2), true),
        ]
    );
    println!(
        "opaque-macro-nested={:?}",
        [
            opaque_macro_nested(false, Some(1), None, true),
            opaque_macro_nested(false, Some(1), Some(3), false),
            opaque_macro_nested(false, Some(1), Some(3), true),
            opaque_macro_nested(true, Some(1), None, false),
            opaque_macro_nested(true, None, None, true),
            opaque_macro_nested(true, None, Some(3), false),
            opaque_macro_nested(true, None, Some(3), true),
        ]
    );
    println!(
        "opaque-macro-guard={:?}",
        [
            opaque_macro_guard(None, true),
            opaque_macro_guard(Some(1), false),
            opaque_macro_guard(Some(2), true),
        ]
    );
    println!(
        "or-mixed={:?}",
        [
            disjoined(true, false),
            disjoined(false, true),
            disjoined(false, false),
            mixed(true, false, true),
            mixed(true, false, false),
            mixed(false, true, true),
            mixed(false, false, true),
        ]
    );
    println!(
        "nested={:?}",
        [
            nested(false, true, true),
            nested(true, true, true),
            nested(true, true, false),
            nested(true, false, true),
        ]
    );
    println!(
        "nested-expression={:?}",
        [
            nested_expression(false, true, true, true),
            nested_expression(true, true, true, false),
            nested_expression(true, true, false, true),
            nested_expression(true, false, false, true),
            nested_expression(true, false, false, false),
        ]
    );
    println!(
        "while={:?}",
        [
            while_compound(0, true),
            while_compound(2, true),
            while_compound(2, false),
        ]
    );
    println!(
        "while-let={:?}",
        [
            while_let_chain(Vec::new(), true),
            while_let_chain(vec![Some(2), Some(3)], true),
            while_let_chain(vec![Some(2)], false),
            while_let_chain(vec![Some(0)], true),
        ]
    );
    println!("for={:?}", [for_values(Vec::new()), for_values(vec![2, 3])]);
    println!(
        "for-break={:?}",
        [for_break(Vec::new()), for_break(vec![7, 9])]
    );
    println!(
        "for-two={:?}",
        [
            two_for_values(Vec::new(), vec![2]),
            two_for_values(vec![3], Vec::new()),
        ]
    );
    println!(
        "for-nested={:?}",
        [
            nested_for_values(Vec::new()),
            nested_for_values(vec![Vec::new(), vec![2, 3]]),
        ]
    );
    println!(
        "match={:?}",
        [
            match_value(Some(3), true),
            match_value(Some(0), true),
            match_value(Some(3), false),
            match_value(None, true),
        ]
    );
    println!(
        "match-identical={:?}",
        [match_identical(0), match_identical(1), match_identical(2)]
    );
    match_empty(true);
    match_empty(false);
    println!("match-empty=true");
    println!("match-irrefutable={}", match_irrefutable(4));
    println!(
        "match-unreachable={:?}",
        [match_unreachable(true), match_unreachable(false)]
    );
    println!(
        "match-generated={:?}",
        [generated_match(true), generated_match(false)]
    );
    println!(
        "match-generated-proc={:?}",
        [
            generated_match_by_proc(true),
            generated_match_by_proc(false)
        ]
    );
    println!(
        "match-generated-guarded-proc={:?}",
        [
            generated_guarded_match_by_proc(Some(3), true),
            generated_guarded_match_by_proc(Some(0), true),
            generated_guarded_match_by_proc(Some(3), false),
            generated_guarded_match_by_proc(None, true),
        ]
    );
    println!(
        "match-generated-nested-proc={:?}",
        [
            generated_nested_match_by_proc(Some(Ok(3))),
            generated_nested_match_by_proc(Some(Err(4))),
            generated_nested_match_by_proc(None),
        ]
    );
    println!(
        "match-generated-nested-scrutinee-proc={:?}",
        [
            generated_nested_scrutinee_match_by_proc(Some(true)),
            generated_nested_scrutinee_match_by_proc(Some(false)),
            generated_nested_scrutinee_match_by_proc(None),
        ]
    );
    println!(
        "match-generated-nested-guard-proc={:?}",
        [
            generated_nested_guard_match_by_proc(Some(3), true),
            generated_nested_guard_match_by_proc(Some(0), true),
            generated_nested_guard_match_by_proc(Some(3), false),
            generated_nested_guard_match_by_proc(None, true),
        ]
    );
    println!(
        "let-else={:?}",
        [let_else_value(Some(7)), let_else_value(None)]
    );
    println!(
        "let-else-nested={:?}",
        [
            nested_let_else(Some(Ok(7))),
            nested_let_else(Some(Err(7))),
            nested_let_else(None),
        ]
    );
    println!(
        "let-else-two={:?}",
        [
            two_let_else(Some(2), Some(3)),
            two_let_else(None, Some(3)),
            two_let_else(Some(2), None),
        ]
    );
    println!(
        "let-else-generated-proc={:?}",
        [
            generated_let_else_by_proc(Some(7)),
            generated_let_else_by_proc(None)
        ]
    );
    println!(
        "let-else-generated-two-proc={:?}",
        [
            generated_two_let_else_by_proc(Some(Ok(2)), Some(3)),
            generated_two_let_else_by_proc(None, Some(3)),
            generated_two_let_else_by_proc(Some(Ok(2)), None),
        ]
    );
    println!(
        "try-result={:?}",
        [try_result(Ok(7)), try_result(Err("no"))]
    );
    println!("try-option={:?}", [try_option(Some(7)), try_option(None)]);
    println!(
        "try-two={:?}",
        [
            two_try_results(Ok(2), Ok(3)),
            two_try_results(Err("first"), Ok(3)),
            two_try_results(Ok(2), Err("second")),
        ]
    );
    println!(
        "try-generated-proc={:?}",
        [
            generated_try_by_proc(Ok(8)),
            generated_try_by_proc(Err("no"))
        ]
    );
    println!(
        "try-generated-two-proc={:?}",
        [
            generated_two_try_by_proc(Ok(2), Ok(3)),
            generated_two_try_by_proc(Err("first"), Ok(3)),
            generated_two_try_by_proc(Ok(2), Err("second")),
        ]
    );
    println!(
        "try-nested={:?}",
        [
            nested_try_result(Ok(Ok(7))),
            nested_try_result(Ok(Err("inner"))),
            nested_try_result(Err("outer")),
        ]
    );
    println!(
        "try-generated-nested-proc={:?}",
        [
            generated_nested_try_by_proc(Ok(Ok(7))),
            generated_nested_try_by_proc(Ok(Err("inner"))),
            generated_nested_try_by_proc(Err("outer")),
        ]
    );
    let previous_hook = panic::take_hook();
    panic::set_hook(Box::new(|_| {}));
    let try_panic = panic::catch_unwind(panic_before_try);
    panic::set_hook(previous_hook);
    println!("try-panic={}", try_panic.is_err());
    println!(
        "match-nested={:?}",
        [
            nested_match(Some(Ok(3))),
            nested_match(Some(Err(4))),
            nested_match(None),
        ]
    );
    println!(
        "derived-order={:?}",
        [
            DerivedOrderLine {
                file: "a.rs".into(),
                line: 1,
            } < DerivedOrderLine {
                file: "a.rs".into(),
                line: 2,
            },
            DerivedOrderLine {
                file: "b.rs".into(),
                line: 1,
            } < DerivedOrderLine {
                file: "a.rs".into(),
                line: 9,
            },
        ]
    );
    println!(
        "derived-if-let={:?}",
        [
            DerivedStyleIfLet::unwrap_or_seven(Ok(3)),
            DerivedStyleIfLet::unwrap_or_seven(Err(true)),
        ]
    );
    println!(
        "loop-nested-match-proc={}",
        generated_loop_nested_match_by_proc(vec![Ok(5), Ok(0), Err(7)])
    );
    println!(
        "macro-arm-aggregate={:?}",
        [
            macro_inside_and_outside_arm(true),
            macro_inside_and_outside_arm(false),
        ]
    );
    println!(
        "adapter-flavor={:?}",
        [
            adapter_flavor(AdapterKind::Vite),
            adapter_flavor(AdapterKind::Generic),
            adapter_flavor(AdapterKind::Direct),
        ]
    );
}
