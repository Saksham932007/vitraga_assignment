// app/api/send-updates/route.js
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { GitHubUpdateEmail } from "@/components/GitHubUpdateEmail";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";

// This endpoint will be triggered by a cron job.

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1. Fetch all subscribers from Supabase (same as before)
    const { data: subscribers, error: supabaseError } = await supabase
      .from("subscribers")
      .select("email");

    if (supabaseError) throw supabaseError;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers to email.",
      });
    }

    // 2. Fetch data from the local timeline.atom file
    // The 'path' and 'fs' modules are Node.js APIs for file system operations.
    const filePath = path.join(process.cwd(), "data", "timeline.atom");
    const xmlData = fs.readFileSync(filePath, "utf-8");

    // 3. Parse the XML data
    const parser = new XMLParser();
    const parsedData = parser.parse(xmlData);
    const githubEvents = parsedData.feed.entry;

    // 4. Prepare a short update (e.g., last 5 events)
    const latestEvents = githubEvents.slice(0, 5);

    // 5. Send email to each user (same logic as before)
    const emailPromises = subscribers.map((subscriber) => {
      return resend.emails.send({
        from: "GitHub Updates <updates@yourverifieddomain.com>", // IMPORTANT: Change to your verified Resend domain
        to: subscriber.email,
        subject: "Your Weekly GitHub Timeline Digest",
        react: GitHubUpdateEmail({ events: latestEvents }),
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${subscribers.length} subscribers.`,
    });
  } catch (error) {
    console.error("Error in send-updates cron job:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
