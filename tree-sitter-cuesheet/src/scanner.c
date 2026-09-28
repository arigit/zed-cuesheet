#include "tree_sitter/parser.h"

#include <stdbool.h>

enum TokenType {
  EOL,
  ERROR_SENTINEL,
};

void *tree_sitter_cuesheet_external_scanner_create(void) { return NULL; }

void tree_sitter_cuesheet_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_cuesheet_external_scanner_serialize(void *payload, char *buffer) {
  return 0;
}

void tree_sitter_cuesheet_external_scanner_deserialize(void *payload, const char *buffer,
                                                       unsigned length) {}

// Matches the end of a command without consuming anything: the next
// character must be a line break (or the file must end). The line break
// itself is then skipped as an extra, so command nodes end at the end of
// their line.
bool tree_sitter_cuesheet_external_scanner_scan(void *payload, TSLexer *lexer,
                                                const bool *valid_symbols) {
  if (valid_symbols[ERROR_SENTINEL] || !valid_symbols[EOL]) {
    return false;
  }

  while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
    lexer->advance(lexer, true);
  }

  if (lexer->eof(lexer) || lexer->lookahead == '\n' || lexer->lookahead == '\r') {
    lexer->mark_end(lexer);
    lexer->result_symbol = EOL;
    return true;
  }

  return false;
}
