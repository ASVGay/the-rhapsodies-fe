-- Do not change these users. However update the SQL if any changes have been made to the `member` table.
INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                            "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                            "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                            "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                            "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                            "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                            "email_change_confirm_status", "banned_until", "reauthentication_token",
                            "reauthentication_sent_at", "is_sso_user")
VALUES ('00000000-0000-0000-0000-000000000000', '4ec7af50-3ced-45a9-9c1c-0e1038404778', 'authenticated',
        'authenticated', 'old@cypress.com', '$2a$10$75nN5Q/T4k840.pxlUVSzO2YUo4r038ucd2sM1cNTyaS2hOmB416.',
        '2023-05-16 08:23:07.992463+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-05-16 08:50:07.776211+00',
        '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-05-16 08:23:07.989348+00',
        '2023-05-16 08:50:07.777528+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false);
INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                            "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                            "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                            "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                            "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                            "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                            "email_change_confirm_status", "banned_until", "reauthentication_token",
                            "reauthentication_sent_at", "is_sso_user")
VALUES ('00000000-0000-0000-0000-000000000000', '569e7419-5424-4d18-9918-31016f6252d7', 'authenticated',
        'authenticated', 'new@cypress.com', '$2a$10$b6bT0PQv8JdC7Ub9vN0RYuHJrP21xkIK0lj2WfV7UIkVqQ9YT8R2u',
        '2023-05-16 08:23:29.855917+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-05-16 08:50:09.183747+00',
        '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-05-16 08:23:29.854098+00',
        '2023-05-16 08:50:09.185724+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false);

INSERT INTO "auth"."identities" ("id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                 "updated_at")
VALUES ('4ec7af50-3ced-45a9-9c1c-0e1038404778', '4ec7af50-3ced-45a9-9c1c-0e1038404778',
        '{"sub": "4ec7af50-3ced-45a9-9c1c-0e1038404778", "email": "old@cypress.com"}', 'email',
        '2023-05-16 08:23:07.990111+00', '2023-05-16 08:23:07.990136+00', '2023-05-16 08:23:07.990136+00');
INSERT INTO "auth"."identities" ("id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                 "updated_at")
VALUES ('569e7419-5424-4d18-9918-31016f6252d7', '569e7419-5424-4d18-9918-31016f6252d7',
        '{"sub": "569e7419-5424-4d18-9918-31016f6252d7", "email": "new@cypress.com"}', 'email',
        '2023-05-16 08:23:29.854808+00', '2023-05-16 08:23:29.854828+00', '2023-05-16 08:23:29.854828+00');

INSERT INTO "public"."member" ("display_name", "id")
VALUES ('Old', '4ec7af50-3ced-45a9-9c1c-0e1038404778');

-- Allow deleting members for Cypress tests
CREATE POLICY "Members are viewable by everyone." ON "member" FOR SELECT TO "authenticated", "anon" USING (true);
CREATE POLICY "Members are deletable by everyone." ON "member" FOR DELETE TO "authenticated", "anon" USING (true);