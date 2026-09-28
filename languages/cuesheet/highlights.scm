; Commands
[
  "CATALOG"
  "CDTEXTFILE"
  "FILE"
  "FLAGS"
  "INDEX"
  "ISRC"
  "PERFORMER"
  "POSTGAP"
  "PREGAP"
  "SONGWRITER"
  "TITLE"
  "TRACK"
] @keyword

; REM KEY value: metadata when KEY is upper-case (GENRE, DATE, DISCID, ...)
(rem_command
  "REM" @keyword
  key: (rem_key) @property
  (#match? @property "^[A-Z][A-Z0-9_]*$"))

(rem_command
  key: (rem_key) @_key
  value: (unquoted_value) @number
  (#match? @_key "^[A-Z][A-Z0-9_]*$")
  (#match? @number "^[-+]?[0-9]+([.:/][0-9]+)*( ?dB)?$"))

(rem_command
  key: (rem_key) @_key
  value: (unquoted_value) @string
  (#match? @_key "^[A-Z][A-Z0-9_]*$")
  (#not-match? @string "^[-+]?[0-9]+([.:/][0-9]+)*( ?dB)?$"))

; Anything else after REM is a plain comment
(rem_command
  key: (rem_key) @_key
  (#not-match? @_key "^[A-Z][A-Z0-9_]*$")) @comment

(rem_command
  !key) @comment

(rem_command
  key: (rem_key) @_key
  value: (string) @string
  (#match? @_key "^[A-Z][A-Z0-9_]*$"))

; Values
(title_command
  value: (_) @string)

(performer_command
  value: (_) @string)

(songwriter_command
  value: (_) @string)

(file_command
  name: (_) @string.special)

(cdtextfile_command
  name: (_) @string.special)

(file_type) @type

(track_type) @type

(flag) @constant

(code) @constant

(number) @number

(timestamp) @number
