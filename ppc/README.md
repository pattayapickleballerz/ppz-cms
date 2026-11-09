# Pacific Pickleball Circuit — Pierce Demo

Fixed tournament: 3 divisions (Men's, Women's, Mixed Doubles), 8 fixed teams per division, 6 matches per team, 11 courts, conventional scoring to 11.

Backend foundation: six `ppc_` tables in existing Supabase project, separate from PPZ live sessions. Row-level security enabled; initial read-only owner policies. No browser client or score submission permissions deployed yet.

Next: authenticated host setup, division/team registration, round-robin generator, scorekeeper assignment and approval, spectator read policies, realtime synchronization, global player identity mapping, and multi-device end-to-end tests.
