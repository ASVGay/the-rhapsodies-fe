drop policy "Enable delete access for users" on "public"."song";

drop policy "Enable update access for users" on "public"."song";

create policy "Enable delete access for users based on author id"
on "public"."song"
as permissive
for delete
to authenticated
using ((auth.uid() = author));


create policy "Enable update access for users based on author id"
on "public"."song"
as permissive
for update
to authenticated
using ((auth.uid() = author))
with check (true);



