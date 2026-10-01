import { useState } from "react";
import { generateContent } from "../services/api";

function ProfileForm({ onResult, onLoading, onError }) {
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!linkedinUrl.trim()) {
      onError("Please enter a LinkedIn profile URL.");
      return;
    }

    if (!linkedinUrl.includes("linkedin.com/in/")) {
      onError(
        "Please enter a valid LinkedIn profile URL."
      );
      return;
    }

    try {
      onLoading(true);
      onError("");

      const result = await generateContent(
        linkedinUrl.trim()
      );

      if (!result.success) {
        throw new Error(
          result.error || "Content generation failed"
        );
      }

      onResult(result.data);
    } catch (error) {
      console.error(
        "Content generation error:",
        error
      );

      onError(
        error.response?.data?.error ||
          error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      onLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div>
        <label
          htmlFor="linkedinUrl"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          LinkedIn Profile URL
        </label>

        <input
          id="linkedinUrl"
          type="url"
          value={linkedinUrl}
          onChange={(event) =>
            setLinkedinUrl(event.target.value)
          }
          placeholder="https://www.linkedin.com/in/username/"
          className="
            w-full rounded-xl
            border border-slate-700
            bg-slate-950
            px-4 py-3
            text-slate-100
            placeholder:text-slate-600
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        />
      </div>

      <button
        type="submit"
        className="
          w-full rounded-xl
          bg-blue-600
          px-5 py-3
          font-semibold
          text-white
          shadow-lg
          shadow-blue-900/20
          transition
          hover:bg-blue-500
          active:scale-[0.99]
          sm:w-auto
        "
      >
        Generate Content
      </button>
    </form>
  );
}

export default ProfileForm;