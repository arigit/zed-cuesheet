/**
 * @file Tree-sitter grammar for CUE sheets (audio CD / disc image metadata)
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * Case-insensitive keyword, aliased to its canonical upper-case spelling.
 *
 * @param {string} word
 */
function kw(word) {
  const pattern = word
    .split('')
    .map((c) => (/[a-z]/i.test(c) ? `[${c.toLowerCase()}${c.toUpperCase()}]` : c))
    .join('');
  return alias(token(prec(1, new RegExp(pattern))), word);
}

module.exports = grammar({
  name: 'cuesheet',

  // Newlines are significant, but are recognised by the external scanner
  // (which also treats end-of-file as the end of the last line). Everything
  // else, including blank lines, is skipped.
  extras: (_) => [/\s/, '﻿'],

  externals: ($) => [$._eol, $._error_sentinel],

  rules: {
    source_file: ($) => repeat(choice($._command, $.file, $.track)),

    // FILE "name" TYPE, followed by the tracks it contains.
    file: ($) =>
      prec.right(seq(field('header', $.file_command), repeat(choice($._command, $.track)))),

    // TRACK nn TYPE, followed by the commands that describe it.
    track: ($) => prec.right(seq(field('header', $.track_command), repeat($._command))),

    _command: ($) =>
      choice(
        $.catalog_command,
        $.cdtextfile_command,
        $.flags_command,
        $.index_command,
        $.isrc_command,
        $.performer_command,
        $.postgap_command,
        $.pregap_command,
        $.rem_command,
        $.songwriter_command,
        $.title_command,
      ),

    file_command: ($) =>
      seq(kw('FILE'), field('name', $._text), optional(field('type', $.file_type)), $._eol),

    track_command: ($) =>
      seq(kw('TRACK'), field('number', $.number), optional(field('type', $.track_type)), $._eol),

    catalog_command: ($) => seq(kw('CATALOG'), field('value', $.code), $._eol),

    cdtextfile_command: ($) => seq(kw('CDTEXTFILE'), field('name', $._text), $._eol),

    flags_command: ($) => seq(kw('FLAGS'), repeat1($.flag), $._eol),

    index_command: ($) =>
      seq(kw('INDEX'), field('number', $.number), field('time', $.timestamp), $._eol),

    isrc_command: ($) => seq(kw('ISRC'), field('value', $.code), $._eol),

    performer_command: ($) => seq(kw('PERFORMER'), optional(field('value', $._value)), $._eol),

    songwriter_command: ($) => seq(kw('SONGWRITER'), optional(field('value', $._value)), $._eol),

    title_command: ($) => seq(kw('TITLE'), optional(field('value', $._value)), $._eol),

    pregap_command: ($) => seq(kw('PREGAP'), field('time', $.timestamp), $._eol),

    postgap_command: ($) => seq(kw('POSTGAP'), field('time', $.timestamp), $._eol),

    // REM KEY value  (e.g. REM GENRE "Rock", REM DATE 1999) or a free-form comment.
    rem_command: ($) =>
      seq(
        kw('REM'),
        optional(
          choice(
            seq(field('key', $.rem_key), optional(field('value', $._value))),
            field('value', $.string),
          ),
        ),
        $._eol,
      ),

    rem_key: (_) => /[^\s"]+/,

    _text: ($) => choice($.string, $.word),

    _value: ($) => choice($.string, $.unquoted_value),

    string: ($) => seq('"', optional($.string_content), '"'),

    string_content: (_) => token.immediate(prec(1, /[^"\r\n]+/)),

    // A bare value running to the end of the line.
    unquoted_value: (_) => /[^\s"]([^\r\n]*[^\s])?/,

    word: (_) => /[^\s"]+/,

    file_type: (_) => /[A-Za-z0-9]+/,

    track_type: (_) => /[A-Za-z0-9]+(\/[0-9]+)?/,

    flag: (_) => /[A-Za-z0-9]+/,

    code: (_) => /[A-Za-z0-9-]+/,

    number: (_) => /[0-9]+/,

    // mm:ss:ff (minutes, seconds, frames)
    timestamp: (_) => /[0-9]+:[0-9]+:[0-9]+/,
  },
});
