// app/api/subscribe/route.js
import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) {
      // It's possible the email already exists, which would cause a unique constraint violation.
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, message: "This email is already subscribed." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
