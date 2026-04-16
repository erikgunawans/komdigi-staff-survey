begin;

-- Fresh-start reset (runtime data only)
-- Keep schema, env vars, and OAuth config unchanged.
delete from survey_responses;
delete from survey_auth_identities;
delete from survey_sessions;
delete from survey_invites;

commit;
