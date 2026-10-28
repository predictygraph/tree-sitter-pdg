/**
 * @file Tree-sitter grammar for predictygraph (.pdg) diagrams
 * @license GPL-3.0-or-later
 * Mirrors docs/SPEC.md and src/predictygraph/parser.py in the main repo.
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'pdg',

  extras: $ => [/[ \t]/, $.comment],

  externals: $ => [],

  word: $ => $.identifier,

  rules: {
    source_file: $ => optional($._statements),

    // statements are separated by newlines or ';'
    _statements: $ => choice(
      seq($._statement, repeat(seq($._terminator, optional($._statement)))),
      seq(repeat1(seq($._terminator, optional($._statement)))),
    ),

    _terminator: _ => choice(/\r?\n/, ';'),

    _statement: $ => choice(
      $.graph_statement,
      $.css_import,
      $.css_block,
      $.default_statement,
      $.group,
      $.edge_statement,
      $.node_statement,
    ),

    graph_statement: $ => prec.right(2, seq('graph', repeat($._modifier))),

    css_import: $ => seq('css', field('path', $.string)),

    css_block: $ => seq('css', '{', optional(alias($._css_body, $.css_content)), '}'),
    _css_body: $ => repeat1(choice(/[^{}]+/, seq('{', optional($._css_body), '}'))),

    default_statement: $ => prec.right(seq(
      'default',
      field('kind', choice('node', 'edge', 'group')),
      repeat($._modifier),
    )),

    group: $ => seq(
      'group',
      field('id', $.identifier),
      optional(field('label', $.string)),
      repeat($._modifier),
      $.block,
    ),

    block: $ => seq('{', optional($._statements), '}'),

    node_statement: $ => prec.right(1, seq(
      field('id', $.identifier),
      optional(field('label', $.string)),
      repeat($._modifier),
    )),

    edge_statement: $ => prec.right(seq(
      $.endpoints,
      repeat1(seq($.arrow, $.endpoints)),
      optional(field('label', $.string)),
      repeat($._modifier),
    )),

    endpoints: $ => prec.left(seq($.identifier, repeat(seq(',', $.identifier)))),

    // `<?[-=.]+>` | `<[-=.]+` | `[-=.]{2,}`
    arrow: _ => token(choice(/<?[-=.]+>/, /<[-=.]+/, /[-=.][-=.]+/)),

    _modifier: $ => choice($.class, $.attribute),

    class: $ => token(seq('.', /[A-Za-z_][\w-]*/)),

    attribute: $ => seq(
      field('key', alias($.identifier, $.attribute_name)),
      token.immediate('='),
      field('value', choice(alias(token.immediate(/"(?:[^"\\]|\\.)*"/), $.string),
        alias(token.immediate(/[^\s{}";]+/), $.value))),
    ),

    identifier: _ => /[A-Za-z_][\w-]*/,

    string: _ => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),

    // `#` followed by space/end of line; `#fff` is not a comment
    comment: _ => token(prec(-1, /#([ \t#!][^\n]*)?/)),
  },
});
