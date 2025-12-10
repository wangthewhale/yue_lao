export const analyzeIdealMatch = async (prompt: string) => {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("Analyze failed");

  return res.json();
};

export const generateMatchImage = async (prompt: string) => {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("Image generation failed");

  return res.json();
};
