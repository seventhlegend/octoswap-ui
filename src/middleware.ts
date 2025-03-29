import { NextResponse } from "next/server";
import { limiter } from "@/utils/limiter"; // Limiter dosyasının doğru yolu
import { jwtVerify } from "jose";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://roary-pals.vercel.app", "https://yoursite.com"]
    : ["http://localhost:3000"];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Hariç tutulacak rotalar
const excludedRoutes = [
  "/api/connect-user",
  "/api/get-nonce",
  "/api/verify-signature",
  "/api/tasks/list",
  "/api/verify-token",
];

export async function middleware(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);

  // Rate Limiting kontrolü
  const remaining = await limiter.removeTokens(1);
  if (remaining < 0) {
    return NextResponse.json(
      { message: "Too Many Requests" },
      {
        status: 429,
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }

  // CORS Kontrolü
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { message: "Blocked by CORS policy" },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // OPTIONS methodu için preflight response
  if (request.method === "OPTIONS") {
    const preflightHeaders = {
      ...(origin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };

    return new NextResponse(null, {
      status: 204,
      headers: preflightHeaders,
    });
  }

  // Eğer rota hariç tutulacak rotalardan biriyse, middleware'i atla
  if (excludedRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  // JWT Doğrulama
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized: Missing or invalid Authorization header" },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    // jose ile JWT doğrulama
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    console.log("Decoded JWT Payload:", payload);
    // Doğrulama başarılı, istek kullanıcı bilgileri ile devam eder
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json(
      { message: "Unauthorized: Invalid or expired token" },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const config = {
  matcher: "/api/:path*", // Middleware sadece /api rotalarında çalışır
};
