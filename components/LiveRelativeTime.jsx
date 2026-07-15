"use client";

import { useEffect, useState } from "react";

function formatElapsedTime(value, now) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";

  const elapsedSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  const units = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "min"],
    [1, "sec"],
  ];

  const [secondsPerUnit, label] = units.find(([seconds]) => elapsedSeconds >= seconds) || units.at(-1);
  const amount = Math.floor(elapsedSeconds / secondsPerUnit);
  const plural = amount === 1 || label === "min" || label === "sec" ? "" : "s";

  return `${amount} ${label}${plural} ago`;
}

export default function LiveRelativeTime({ value }) {
  const [now, setNow] = useState(null);
  const timestamp = new Date(value);
  const isValid = Number.isFinite(timestamp.getTime());
  const dateTime = isValid ? timestamp.toISOString() : undefined;
  const absoluteTime = isValid
    ? timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "Recently";

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time dateTime={dateTime} title={dateTime}>
      {now === null ? absoluteTime : formatElapsedTime(value, now)}
    </time>
  );
}
