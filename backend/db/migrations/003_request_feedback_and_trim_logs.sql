alter table if exists request_logs
    drop constraint if exists request_logs_session_id_fkey;

drop index if exists idx_request_logs_session_id;

alter table if exists request_logs
    drop column if exists session_id,
    drop column if exists is_partial,
    drop column if exists is_unsupported,
    add column if not exists feedback_reaction text null;

alter table if exists request_logs
    drop column if exists feedback_at;

alter table if exists request_logs
    drop constraint if exists request_logs_feedback_reaction_check;

alter table if exists request_logs
    add constraint request_logs_feedback_reaction_check
    check (feedback_reaction in ('up', 'down') or feedback_reaction is null);

drop index if exists idx_sessions_participant_id;
drop table if exists sessions;

do $$
begin
    if exists (
        select 1
        from information_schema.tables
        where table_schema = 'public'
          and table_name = 'request_feedback'
    ) then
        update request_logs as rl
        set
            feedback_reaction = rf.reaction
        from request_feedback as rf
        where rl.request_id = rf.request_id
          and rl.participant_id = rf.participant_id
          and rl.feedback_reaction is null;

        drop table if exists request_feedback;
    end if;
end $$;
