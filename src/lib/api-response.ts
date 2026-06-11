import { NextResponse } from "next/server";

export const apiResponse = {
  success<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
  },

  created<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
  },

  noContent() {
    return new NextResponse(null, { status: 204 });
  },

  badRequest(message: string) {
    return NextResponse.json({ message }, { status: 400 });
  },

  unauthorized(message = "unauthorized") {
    return NextResponse.json({ message }, { status: 401 });
  },

  notFound(message = "not found") {
    return NextResponse.json({ message }, { status: 404 });
  },

  error(message = "internal server error") {
    return NextResponse.json({ message }, { status: 500 });
  },
};