import { useState } from "react";

function ProfileForm({
  onGenerate,
  loading
}) {
  const [mode, setMode] = useState("single");

  const [linkedinUrl, setLinkedinUrl] =
    useState("");

  const [batchUrls, setBatchUrls] =
    useState([""]);

  function handleAddUrl() {
    if (batchUrls.length >= 10) {
      return;
    }

    setBatchUrls([
      ...batchUrls,
      ""
    ]);
  }

  function handleRemoveUrl(index) {
    if (batchUrls.length === 1) {
      return;
    }

    setBatchUrls(
      batchUrls.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  function handleBatchUrlChange(
    index,
    value
  ) {
    const updatedUrls = [
      ...batchUrls
    ];

    updatedUrls[index] = value;

    setBatchUrls(updatedUrls);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "single") {
      if (!linkedinUrl.trim()) {
        return;
      }

      onGenerate({
        linkedinUrl:
          linkedinUrl.trim()
      });

      return;
    }

    const urls = batchUrls
      .map((url) => url.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      return;
    }

    onGenerate({
      linkedinUrls: urls
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex border-b border-gray-200">
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            setMode("single")
          }
          className={`border-b-2 px-5 py-3 text-sm font-medium transition ${
            mode === "single"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Single Profile
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            setMode("batch")
          }
          className={`border-b-2 px-5 py-3 text-sm font-medium transition ${
            mode === "batch"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Batch Profiles
        </button>
      </div>

      {mode === "single" ? (
        <div>
          <label
            htmlFor="linkedinUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            LinkedIn Profile URL
          </label>

          <input
            id="linkedinUrl"
            type="url"
            value={linkedinUrl}
            onChange={(event) =>
              setLinkedinUrl(
                event.target.value
              )
            }
            placeholder="https://www.linkedin.com/in/username/"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-100"
          />
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            LinkedIn Profile URLs
          </label>

          <div className="space-y-3">
            {batchUrls.map(
              (url, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    type="url"
                    value={url}
                    onChange={(event) =>
                      handleBatchUrlChange(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="https://www.linkedin.com/in/username/"
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-100"
                  />

                  {batchUrls.length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveUrl(
                          index
                        )
                      }
                      disabled={loading}
                      className="rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {batchUrls.length <
            10 ? (
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Add URL
              </button>
            ) : (
              <span className="text-sm text-gray-500">
                Maximum of 10 profiles
              </span>
            )}

            <span className="text-sm text-gray-500">
              {batchUrls.length}/10
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Generating..."
          : mode === "single"
            ? "Generate Content"
            : "Generate Batch"}
      </button>
    </form>
  );
}

export default ProfileForm;