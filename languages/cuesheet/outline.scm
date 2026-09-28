(file
  header: (file_command
    "FILE" @context
    name: (_) @name)) @item

(track
  header: (track_command
    "TRACK" @context
    number: (number) @name)
  (title_command
    value: (_) @name)?) @item
