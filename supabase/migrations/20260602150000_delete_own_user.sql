-- Allow authenticated users to delete their own auth account (cascades to related data via FKs).

create or replace function public.delete_own_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_user() from public;
grant execute on function public.delete_own_user() to authenticated;
