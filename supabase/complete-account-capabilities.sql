begin;

-- Bổ sung quyền cộng tác để mọi tài khoản dùng đủ các luồng của prototype.
-- Phạm vi xem dự án vẫn do can_view_project() kiểm soát.

-- Người được giao việc có thể cập nhật chính đầu việc của mình.
drop policy if exists "tasks_update_by_project" on public.tasks;
create policy "tasks_update_by_project"
on public.tasks
for update
to authenticated
using (
  (select public.can_manage_project(project_id))
  or assigned_to = (select auth.uid())
)
with check (
  (select public.can_manage_project(project_id))
  or assigned_to = (select auth.uid())
);

-- Mọi người có quyền xem dự án đều được tham gia trao đổi.
-- Chỉ Admin mới được đánh dấu một trao đổi là ý kiến chỉ đạo.
drop policy if exists "comments_insert_by_project" on public.comments;
create policy "comments_insert_by_project"
on public.comments
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (select public.can_view_project(project_id))
  and (
    is_directive = false
    or (select public.is_admin())
  )
);

-- Mọi người có quyền xem dự án đều được gắn link tài liệu.
drop policy if exists "documents_insert_by_project" on public.document_links;
create policy "documents_insert_by_project"
on public.document_links
for insert
to authenticated
with check (
  added_by = (select auth.uid())
  and (select public.can_view_project(project_id))
);

-- Người thêm link được sửa/xóa link của mình; Admin/Manager quản trị toàn bộ.
drop policy if exists "documents_update_owner_or_admin" on public.document_links;
create policy "documents_update_owner_or_admin"
on public.document_links
for update
to authenticated
using (
  added_by = (select auth.uid())
  or (select public.is_admin_or_manager())
)
with check (
  (select public.can_view_project(project_id))
  and (
    added_by = (select auth.uid())
    or (select public.is_admin_or_manager())
  )
);

drop policy if exists "documents_delete_owner_or_admin" on public.document_links;
create policy "documents_delete_owner_or_admin"
on public.document_links
for delete
to authenticated
using (
  added_by = (select auth.uid())
  or (select public.is_admin_or_manager())
);

commit;

select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('tasks', 'comments', 'document_links')
order by tablename, policyname;
