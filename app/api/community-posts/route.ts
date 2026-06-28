import {
  createCommunityPostRecord,
  findCommunityPostsForFeed,
  serializeCommunityPost,
} from "@/lib/community-posts-db";
import { canPostCommunityUpdate, getAuthenticatedUser } from "@/lib/post-auth";

const MAX_CONTENT = 2000;

export async function GET() {
  const posts = await findCommunityPostsForFeed(48);
  return Response.json(posts.map(serializeCommunityPost));
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPostCommunityUpdate(auth)) {
    return Response.json(
      { error: "Your account must be approved to share posts." },
      { status: 403 },
    );
  }

  const body = await req.json();
  const rawContent = body?.content;
  const rawImageUrl = body?.imageUrl;

  const content =
    typeof rawContent === "string" ? rawContent.trim().slice(0, MAX_CONTENT) : "";
  const imageUrl =
    typeof rawImageUrl === "string" && rawImageUrl.trim()
      ? rawImageUrl.trim()
      : null;

  if (!content && !imageUrl) {
    return Response.json(
      { error: "Write something or add a photo before posting." },
      { status: 400 },
    );
  }

  let created;
  try {
    created = await createCommunityPostRecord(auth.id, content, imageUrl);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not ready yet")) {
      return Response.json(
        { error: "Community posts is being set up. Please try again shortly." },
        { status: 503 },
      );
    }
    throw error;
  }

  return Response.json(serializeCommunityPost(created));
}
