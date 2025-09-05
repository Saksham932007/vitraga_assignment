import { supabase } from "../../../lib/supabase";
import { Resend } from "resend";
import GitHubUpdateEmail from "../../../components/GitHubUpdateEmail";
import { promises as fs } from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  // 1. Check for the cron secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("cron_secret");

  if (secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 2. Fetch all subscribers from Supabase
    const { data: subscribers, error: supabaseError } = await supabase
      .from("subscribers")
      .select("email");

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return new Response(JSON.stringify({ error: supabaseError.message }), {
        status: 500,
      });
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers to email.");
      return new Response(
        JSON.stringify({ message: "No subscribers to email." }),
        { status: 200 }
      );
    }

    // 3. Fetch and parse the local GitHub timeline data
    const filePath = path.join(process.cwd(), "data", "timeline.atom");
    const fileContents = await fs.readFile(filePath, "utf8");

    const parser = new XMLParser();
    const parsedData = parser.parse(fileContents);
    const events = parsedData.feed.entry.slice(0, 5); // Get the 5 most recent events

    // 4. Send email to each subscriber
    for (const subscriber of subscribers) {
      await resend.emails.send({
        from: "GitHub Updates <onboarding@resend.dev>",
        to: subscriber.email,
        subject: "Your Weekly GitHub Timeline Update",
        react: GitHubUpdateEmail({ events }),
      });
    }

    console.log(
      `Successfully sent emails to ${subscribers.length} subscribers.`
    );
    return new Response(
      JSON.stringify({ message: "Emails sent successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in cron job:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
