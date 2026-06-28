import {
  deleteCommunityPostRecord,
  findCommunityPostById,
  serializeCommunityPost,
  updateCommunityPostRecord,
} from "@/lib/community-posts-db";
import {
  canModerateCommunityPost,
  canPostCommunityUpdate,
  getAuthenticatedUser,
} from "@/lib/post-auth";

const MAX_CONTENT = 2000;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPostCommunityUpdate(auth)) {
    return Response.json({ error: "You cannot edit posts right now." }, { status: 403 });
  }

  const { id: idParam } = await context.params;
  const postId = Number.parseInt(idParam, 10);
  if (!Number.isFinite(postId)) {
    return Response.json({ error: "Invalid post id" }, { status: 400 });
  }

  const existing = await findCommunityPostById(postId);
  if (!existing) {
    return Response.json({ error: "Post not found." }, { status: 404 });
  }

  if (!canModerateCommunityPost(auth, existing.user.id)) {
    return Response.json({ error: "You cannot edit this post." }, { status: 403 });
  }

  const body = await req.json();
  const rawContent = body?.content;
  const rawImageUrl = body?.imageUrl;

  const content =
    typeof rawContent === "string" ? rawContent.trim().slice(0, MAX_CONTENT) : existing.content;
  const imageUrl =
    rawImageUrl === null
      ? null
      : typeof rawImageUrl === "string" && rawImageUrl.trim()
        ? rawImageUrl.trim()
        : existing.imageUrl;

  if (!content && !imageUrl) {
    return Response.json(
      { error: "A post needs text or a photo." },
      { status: 400 },
    );
  }

  const updated = await updateCommunityPostRecord(postId, content, imageUrl);
  return Response.json(serializeCommunityPost(updated));
}

export async function DELETE(_req: Request, context: RouteContext) {
  const auth = await getAuthenticatedUser(_req);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await context.params;
  const postId = Number.parseInt(idParam, 10);
  if (!Number.isFinite(postId)) {
    return Response.json({ error: "Invalid post id" }, { status: 400 });
  }

  const existing = await findCommunityPostById(postId);
  if (!existing) {
    return Response.json({ error: "Post not found." }, { status: 404 });
  }

  if (!canModerateCommunityPost(auth, existing.user.id)) {
    return Response.json({ error: "You cannot delete this post." }, { status: 403 });
  }

  await deleteCommunityPostRecord(postId);
  return Response.json({ ok: true });
}
