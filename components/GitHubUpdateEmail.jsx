// components/GitHubUpdateEmail.jsx
import * as React from "react";

// This is the updated React component for the email.
// It now expects props that match the structure of the parsed Atom XML feed.

export const GitHubUpdateEmail = ({ events }) => {
  const getEventType = (title) => {
    if (typeof title !== "string") return { type: "Event", emoji: "🎉" };
    if (title.includes("pushed")) return { type: "Push", emoji: "🚀" };
    if (title.includes("created a branch"))
      return { type: "Create Branch", emoji: "✨" };
    if (title.includes("starred")) return { type: "Star", emoji: "⭐️" };
    return { type: "Event", emoji: "🎉" };
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h1 style={{ color: "#4078c0" }}>GitHub Public Timeline Updates</h1>
      <p>Here are some of the latest events from the GitHub public timeline:</p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {events.map((event, index) => {
          const { type, emoji } = getEventType(event.title);
          return (
            <li
              key={index}
              style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
            >
              <p>
                <strong>
                  {emoji} {event.title}
                </strong>
              </p>
              <p>
                Actor:{" "}
                <a href={event.author.uri} style={{ color: "#4078c0" }}>
                  {event.author.name}
                </a>
              </p>
              <p>Type: {type}</p>
              <p style={{ fontSize: "0.8em", color: "#666" }}>
                {new Date(event.published).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ul>
      <p style={{ marginTop: "20px", fontSize: "0.8em", color: "#999" }}>
        You are receiving this because you subscribed to GitHub Timeline
        Updates.
      </p>
    </div>
  );
};
