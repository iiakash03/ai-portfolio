import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const AiInsights = () => {
  const [insightText, setInsightText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/portfolio/getinsights`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 200 && res.data.insights) {
          setInsightText(res.data.insights); // ✅ extract string from JSON
        } else {
          throw new Error("Invalid insights format");
        }
      } catch (e) {
        console.error("Error fetching AI insights:", e);
        toast("Error fetching AI insights. Please try again later.", {
          style: { background: "#f87171", color: "#fff" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="prose max-w-none whitespace-pre-wrap">
      {isLoading ? (
        <p>Loading insights...</p>
      ) : (
        <p>{insightText}</p> // ✅ Display the actual text
      )}
    </div>
  );
};
