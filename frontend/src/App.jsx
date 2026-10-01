import { useState } from "react";

import ProfileForm from "./components/ProfileForm";
import PostCard from "./components/PostCard";
import LoadingState from "./components/LoadingState";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResult = (result) => {
    setData(result);
  };

  const handleLoading = (value) => {
    setLoading(value);
  };

  const handleError = (message) => {
    setError(message);

    if (message) {
      setData(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-6 py-12">

          <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            AI-Powered LinkedIn Content
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            LinkedIn Content Strategy Generator
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Generate personalized LinkedIn content from a public
            LinkedIn profile using AI-powered profile analysis and
            content strategy generation.
          </p>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Generator */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl md:p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">
              Generate Content
            </h2>

            <p className="mt-2 text-slate-400">
              Enter a LinkedIn profile URL to create a personalized
              content strategy and five LinkedIn posts.
            </p>
          </div>

          <ProfileForm
            onResult={handleResult}
            onLoading={handleLoading}
            onError={handleError}
          />

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-8">
            <LoadingState />
          </div>
        )}

        {/* Results */}
        {!loading && data && (
          <section className="mt-10 space-y-10">

            {/* Profile */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>
                  <p className="text-sm font-medium text-blue-400">
                    LinkedIn Profile
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-white">
                    {data.profile.name}
                  </h2>

                  <p className="mt-2 text-lg text-slate-300">
                    {data.profile.headline}
                  </p>

                  {data.profile.location && (
                    <p className="mt-2 text-sm text-slate-500">
                      📍 {data.profile.location}
                    </p>
                  )}
                </div>

              </div>

              {data.profile.about && (
                <div className="mt-6 border-t border-slate-800 pt-6">
                  <p className="leading-7 text-slate-400">
                    {data.profile.about}
                  </p>
                </div>
              )}

            </div>

            {/* Strategy */}
            <section>

              <div className="mb-5">
                <p className="text-sm font-medium text-blue-400">
                  Strategy
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  Content Strategy
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">

                {/* Positioning */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Positioning
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {data.contentStrategy.positioning}
                  </p>
                </div>

                {/* Audience */}
                <div className="mt-8">

                  <h3 className="text-lg font-semibold text-white">
                    Target Audience
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.contentStrategy.targetAudience?.map(
                      (audience, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300"
                        >
                          {audience}
                        </span>
                      )
                    )}
                  </div>

                </div>

                {/* Content Pillars */}
                <div className="mt-8">

                  <h3 className="text-lg font-semibold text-white">
                    Content Pillars
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.contentStrategy.contentPillars?.map(
                      (pillar, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-300"
                        >
                          {pillar}
                        </span>
                      )
                    )}
                  </div>

                </div>

              </div>

            </section>

            {/* Posts */}
            <section>

              <div className="mb-5">
                <p className="text-sm font-medium text-blue-400">
                  AI Generated
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  Generated LinkedIn Posts
                </h2>

                <p className="mt-2 text-slate-400">
                  Five personalized content ideas based on the profile.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {data.posts?.posts?.map(
                  (post, index) => (
                    <PostCard
                      key={index}
                      post={post}
                      index={index}
                    />
                  )
                )}
              </div>

            </section>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        LinkedIn Content Strategy Generator · AI-powered content generation
      </footer>

    </div>
  );
}

export default App;