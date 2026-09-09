import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin/login")) return NextResponse.next();

  const isUploadApi = pathname.startsWith("/api/upload");
  const isDeleteApi = pathname.startsWith("/api/media/") && request.method === "DELETE";
  const isAdminPage = pathname.startsWith("/admin");

  if (!isUploadApi && !isDeleteApi && !isAdminPage) return NextResponse.next();

  const session = request.cookies.get("admin_session");
  if (session?.value === "1") return NextResponse.next();

  if (isUploadApi || isDeleteApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/media/:path*"],
};
